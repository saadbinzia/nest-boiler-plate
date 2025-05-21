'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      return Promise.all([
        await queryInterface.changeColumn('tbl_attachments', 'created_by', {
          type: Sequelize.BIGINT,
          allowNull: true,
        }),
        await queryInterface.changeColumn('tbl_attachments', 'updated_by', {
          type: Sequelize.BIGINT,
          allowNull: true,
        }),
      ]);
    });

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      return Promise.all([
        await queryInterface.changeColumn('tbl_attachments', 'updated_by', {
          type: Sequelize.BIGINT,
          allowNull: true,
        }),
        await queryInterface.changeColumn('tbl_attachments', 'created_by', {
          type: Sequelize.BIGINT,
          allowNull: true,
        }),
      ]);
    });
  }
};
