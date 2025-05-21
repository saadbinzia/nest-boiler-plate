'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_verification_codes', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, unique: true, primaryKey: true },

      // The columns we want to create in database
      user_id: {
        type: Sequelize.BIGINT, allowNull: false, references: {
          model: 'tbl_users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      code: { type: Sequelize.STRING, allowNull: false },
      code_status: { type: Sequelize.ENUM('SENT', 'VALIDATED', 'EXPIRED'), allowNull: false, },
      type: { type: Sequelize.ENUM('FORGET_PASSWORD', 'REGISTRATION'), allowNull: false },
      browser: { type: Sequelize.STRING, allowNull: true },
      public_ip: { type: Sequelize.STRING, allowNull: true },
      operating_system: { type: Sequelize.STRING, allowNull: true },
      uuid: { type: Sequelize.STRING, allowNull: true },

      /**
       * To Create logs
       * createdAt => Contains the time when the record was created
       * updatedAt => Contains the time when the record was updated
       */
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });


  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      return Promise.all([
        await queryInterface.dropTable('tbl_user_verification_codes'),
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tbl_user_verification_codes_code_status";'),
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tbl_user_verification_codes_type";'),
      ]);
    });

  }
};
