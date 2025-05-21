'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tbl_users', [{
      email: 'devtester@site.com',
      password: '$2b$12$ONKoxjHM1U1Cjgp/v33A0.AD6XvPapgShF0YijpttuPuH78zastxm',
      role: 'user',
      first_name: 'Dev',
      last_name: 'Test'
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tbl_users', { email: 'devtester@site.com' });
  }
};
