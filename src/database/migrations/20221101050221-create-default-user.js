'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert('tbl_users', [{
      email: 'admin@site.com',
      password: '$2b$12$ONKoxjHM1U1Cjgp/v33A0.AD6XvPapgShF0YijpttuPuH78zastxm',
      role: 'admin',
      first_name: 'super',
      last_name: 'admin'
    }]);
  },

  async down (queryInterface) {
    return queryInterface.bulkDelete('tbl_users', { email: 'admin@site.com' });
  }
};
