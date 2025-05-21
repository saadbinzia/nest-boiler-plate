'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_system_settings', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },

      // The columns we want to create in database
      key: { type: Sequelize.STRING, unique: true, allowNull: false },
      value: { type: Sequelize.STRING, allowNull: false },
      value_type: { type: Sequelize.STRING},

      /**
       * To Create logs
       * created_by => Contains the id of admin who created the record
       * updated_by => Contains the id of admin who updated the record
       * createdAt => Contains the time when the record was created
       * updatedAt => Contains the time when the record was updated
       */
      created_by: { type: Sequelize.BIGINT, },
      updated_by: { type: Sequelize.BIGINT, },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_system_settings');
  }
};
