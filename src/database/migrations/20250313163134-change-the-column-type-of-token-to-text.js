'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tbl_user_sessions', 'auth_token', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.bulkDelete('tbl_user_sessions', { });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_user_sessions', { });
    await queryInterface.changeColumn('tbl_user_sessions', 'auth_token', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
