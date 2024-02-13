'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_users', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },

      // The columns we want to create in database
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, },
      role: { type: Sequelize.STRING, allowNull: false },
      first_name: { type: Sequelize.STRING, },
      last_name: { type: Sequelize.STRING, },
      status: { type: Sequelize.INTEGER, },
      phone_number: { type: Sequelize.STRING, },
      registration_status: { type: Sequelize.STRING, },
      verification_link: { type: Sequelize.STRING, },
      profile_pic: { type: Sequelize.STRING, },
      reset_password_code: { type: Sequelize.STRING, },

      /**
       * To Create logs
       * created_by => Contains the id of admin who created the record
       * updated_by => Contains the id of admin who updated the record
       * createdAt => Contains the time when the record was created
       * updatedAt => Contains the time when the record was updated
       */
      created_by: { type: Sequelize.INTEGER, },
      updated_by: { type: Sequelize.INTEGER, },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_users');

  }
};
