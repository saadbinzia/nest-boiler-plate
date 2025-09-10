'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_verification_codes', {
      id: { 
        type: Sequelize.BIGINT, 
        allowNull: false, 
        autoIncrement: true, 
        unique: true, 
        primaryKey: true 
      },
      user_id: {
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        comment: 'ID of the user this verification code belongs to'
      },
      code: { 
        type: Sequelize.STRING(20), 
        allowNull: false,
        comment: 'The verification code',
      },

      uuid: { 
        type: Sequelize.STRING(256), 
        allowNull: false,
        comment: 'The verification code',
      },

      status: { 
        type: Sequelize.ENUM('PENDING', 'VERIFIED', 'EXPIRED', 'USED'), 
        allowNull: false, 
        defaultValue: 'PENDING',
        comment: 'Current status of the verification code'
      },
      type: { 
        type: Sequelize.ENUM('PASSWORD_RESET', 'REGISTRATION'), 
        allowNull: false,
        comment: 'Type of verification code'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'When the verification code expires'
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the code was verified'
      },
      created_at: { 
        type: Sequelize.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()') 
      },
      updated_at: { 
        type: Sequelize.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()') 
      }
    });

    // Add index on user_id for better query performance
    await queryInterface.addIndex('tbl_user_verification_codes', ['user_id']);
    // Add index on code for faster lookups
    await queryInterface.addIndex('tbl_user_verification_codes', ['code']);
    // Add index on uuid for faster lookups
    await queryInterface.addIndex('tbl_user_verification_codes', ['uuid']);
    // Add index on type for filtering
    await queryInterface.addIndex('tbl_user_verification_codes', ['type']);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async () => {
      await queryInterface.dropTable('tbl_user_verification_codes');
      
      // Drop the enum types if they exist
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_tbl_user_verification_codes_status";'
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_tbl_user_verification_codes_type";'
      );
    });
  }
};
