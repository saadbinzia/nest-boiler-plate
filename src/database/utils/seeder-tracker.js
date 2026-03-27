'use strict';

/**
 * Seeder tracking utility to prevent duplicate seeder execution
 */
class SeederTracker {
  /**
   * Check if a seeder has already been executed
   * @param {Object} queryInterface - Sequelize query interface
   * @param {string} seederName - Name of the seeder file
   * @returns {Promise<boolean>} - True if seeder has been executed
   */
  static async hasBeenExecuted(queryInterface, seederName) {
    try {
      const results = await queryInterface.sequelize.query(
        'SELECT name FROM "SequelizeSeederMeta" WHERE name = ?',
        {
          replacements: [seederName],
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      return results.length > 0;
    } catch (error) {
      // If table doesn't exist, seeder hasn't been executed
      if (error.name === 'SequelizeDatabaseError' && error.message.includes('does not exist')) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Mark a seeder as executed
   * @param {Object} queryInterface - Sequelize query interface
   * @param {string} seederName - Name of the seeder file
   */
  static async markAsExecuted(queryInterface, seederName) {
    try {
      await queryInterface.sequelize.query(
        'INSERT INTO "SequelizeSeederMeta" (name, executed_at) VALUES (?, NOW())',
        {
          replacements: [seederName],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        }
      );
    } catch (error) {
      // Ignore duplicate key errors (seeder already marked as executed)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return;
      }
      throw error;
    }
  }

  /**
   * Mark a seeder as not executed (for rollback)
   * @param {Object} queryInterface - Sequelize query interface
   * @param {string} seederName - Name of the seeder file
   */
  static async markAsNotExecuted(queryInterface, seederName) {
    try {
      await queryInterface.sequelize.query(
        'DELETE FROM "SequelizeSeederMeta" WHERE name = ?',
        {
          replacements: [seederName],
          type: queryInterface.sequelize.QueryTypes.DELETE,
        }
      );
    } catch (error) {
      // If table doesn't exist, nothing to do
      if (error.name === 'SequelizeDatabaseError' && error.message.includes('does not exist')) {
        return;
      }
      throw error;
    }
  }

  /**
   * Get all executed seeders
   * @param {Object} queryInterface - Sequelize query interface
   * @returns {Promise<Array>} - Array of executed seeder names
   */
  static async getExecutedSeeders(queryInterface) {
    try {
      const results = await queryInterface.sequelize.query(
        'SELECT name, executed_at FROM "SequelizeSeederMeta" ORDER BY executed_at',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      return results;
    } catch (error) {
      // If table doesn't exist, no seeders have been executed
      if (error.name === 'SequelizeDatabaseError' && error.message.includes('does not exist')) {
        return [];
      }
      throw error;
    }
  }
}

module.exports = SeederTracker;
