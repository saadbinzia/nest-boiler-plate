'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SequelizeSeederMeta', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      executed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SequelizeSeederMeta');
  }
};