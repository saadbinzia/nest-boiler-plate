'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('tbl_system_settings', [
      {
        key: 'verificationCodeExpiry',
        value: '15',
        value_type: 'In Minutes'
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('tbl_system_settings', {});
  }
};

