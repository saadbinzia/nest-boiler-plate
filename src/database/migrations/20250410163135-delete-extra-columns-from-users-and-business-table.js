'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      return Promise.all([
        await queryInterface.removeColumn('tbl_users', 'profile_pic'),
      ]);
    });

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      return Promise.all([
        await queryInterface.addColumn('tbl_users', 'profile_pic', Sequelize.STRING),
      ]);
    });
  }
};
