'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_sessions', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },

      // The columns we want to create in database
      user_id: { type: Sequelize.BIGINT, allowNull: false, references: {
        model: 'tbl_users',
        key: 'id'
      } },
      auth_token: { type: Sequelize.STRING, allowNull: false},
      status: { type: Sequelize.STRING, allowNull: false },

      browser: { type: Sequelize.STRING, allowNull: true},
      public_ip: { type: Sequelize.STRING, allowNull: true},
      operating_system: { type: Sequelize.STRING, allowNull: true},
  
      remember_me: { type: Sequelize.BOOLEAN, defaultValue: false},

      /**
       * To Create logs
       * createdAt => Contains the time when the record was created
       * updatedAt => Contains the time when the record was updated
       */
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_user_sessions');
  }
};