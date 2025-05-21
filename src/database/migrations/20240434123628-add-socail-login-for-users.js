
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_social_logins', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },
      user_id: { type: Sequelize.BIGINT, allowNull: false, references: {
        model: 'tbl_users',
        key: 'id'
      } },
      type: {
        type: Sequelize.ENUM('facebook', 'google', 'twitter', 'apple'),	
        allowNull: false
      },
      social_login_data: {
        type: Sequelize.JSON,
        allowNull: false
      },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      return Promise.all([
        await queryInterface.dropTable('tbl_social_logins'),
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tbl_social_logins_type";'),
      ]);
    });

  }
};