'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tbl_system_settings', [
      {
        key: 'verificationCodeExpiry',
        value: '15',
        value_type: 'In Minutes'
      },
      {
        key: 'transactionPendingTime',
        value: '48',
        value_type: 'In Hours'
      },
      {
        key: 'transactionExpiryTime',
        value: '1',
        value_type: 'In Years'
      },
      {
        key: 'level1referralCommission',
        value: '10',
        value_type: '%'
      },
      {
        key: 'level2referralCommission',
        value: '20',
        value_type: '%'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tbl_system_settings', {});
  }
};

