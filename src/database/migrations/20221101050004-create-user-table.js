'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_users', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      password: {
        type: Sequelize.STRING,
      },

      role: {
        type: Sequelize.STRING,
        allowNull: false
      },

      first_name: {
        type: Sequelize.STRING,
      },

      last_name: {
        type: Sequelize.STRING,
      },

      status: {
        type: Sequelize.INTEGER,
      },

      phone_number: {
        type: Sequelize.STRING,
      },

      profile_pic: {
        type: Sequelize.STRING,
      },

      registration_status: {
        type: Sequelize.STRING,
      },

      verification_link: {
        type: Sequelize.STRING,
      },

      reset_password_code: {
        type: Sequelize.STRING,
      },

      created_by: {
        type: Sequelize.BIGINT,
      },

      updated_by: {
        type: Sequelize.BIGINT,
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_users');
  }
};
