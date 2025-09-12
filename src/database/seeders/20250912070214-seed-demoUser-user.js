'use strict';

module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert('tbl_users', [{
      email: 'devtester@site.com',
      password: '$2b$12$ONKoxjHM1U1Cjgp/v33A0.AD6XvPapgShF0YijpttuPuH78zastxm',
      role: 'user',
      first_name: 'Dev',
      last_name: 'Test',
      status: 10,
      registration_status: 'completed',
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down (queryInterface) {
    return queryInterface.bulkDelete('tbl_users', { email: 'devtester@site.com' });
  }
};
