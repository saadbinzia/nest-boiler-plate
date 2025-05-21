'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_attachments', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },

      parent: { type: Sequelize.STRING, allowNull: false },
      parent_id: { type: Sequelize.BIGINT, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      file_original_name: { type: Sequelize.STRING, allowNull: false },
      file_path: { type: Sequelize.STRING, allowNull: false },
      file_unique_name: { type: Sequelize.STRING, allowNull: true },

      created_by: { type: Sequelize.BIGINT, allowNull: false },
      updated_by: { type: Sequelize.BIGINT, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_attachments');
  }
};
