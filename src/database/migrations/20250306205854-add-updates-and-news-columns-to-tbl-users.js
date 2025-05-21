'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('tbl_users', 'keep_user_updated', {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }),
        queryInterface.addColumn('tbl_users', 'agree_terms_and_conditions', {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        })
      ]);
    });

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('tbl_users', 'keep_user_updated'),
        queryInterface.removeColumn('tbl_users', 'agree_terms_and_conditions')
      ]);
    });
  }
};
