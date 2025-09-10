'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_sessions', {
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
        comment: 'ID of the user this session belongs to'
      },
      auth_token: { 
        type: Sequelize.TEXT, 
        allowNull: false,
        comment: 'JWT or other authentication token'
      },
      status: { 
        type: Sequelize.ENUM('active', 'expired', 'revoked'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Current status of the session'
      },
      remember_me: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      user_agent: { 
        type: Sequelize.STRING(1000), 
        allowNull: true,
        comment: 'User agent string of the client'
      },
      browser: { 
        type: Sequelize.STRING(1000), 
        allowNull: true,
        comment: 'Browser name of the client'
      },
      public_ip: { 
        type: Sequelize.STRING(1000), 
        allowNull: true,
        comment: 'Public IP address of the client'
      },
      operating_system: { 
        type: Sequelize.STRING(1000), 
        allowNull: true,
        comment: 'Operating system of the client'
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
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the session was manually revoked'
      }
    });

    // Add index on user_id for better query performance
    await queryInterface.addIndex('tbl_user_sessions', ['user_id']);
    // Add index on auth_token for faster lookups
    await queryInterface.addIndex('tbl_user_sessions', ['auth_token'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_user_sessions');
    
    // Drop the enum type if it exists
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_user_sessions_status";'
    );
  }
};