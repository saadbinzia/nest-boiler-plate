'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_users', 'verification_link', 'username');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('tbl_users', 'username', 'verification_link');
  }
};
