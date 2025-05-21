'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_notifications', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },

      // The columns we want to create in database
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, },
      redirect_page: { type: Sequelize.STRING },
      is_read: { type: Sequelize.BOOLEAN, defaultValue: false },
      user_id: {
        type: Sequelize.BIGINT, allowNull: false, references: {
          model: 'tbl_users',
          key: 'id'
        }
      },
      other_details: { type: Sequelize.JSON },

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
    await queryInterface.dropTable('tbl_notifications');
  }
};
