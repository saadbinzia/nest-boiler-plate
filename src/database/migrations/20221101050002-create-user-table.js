'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {  
  async up(queryInterface, Sequelize) {
    // Drop enum types if they exist (in case they were left behind from a previous migration)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_users_role";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_users_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_users_registration_status";'
    );

    await queryInterface.createTable('tbl_users', {
      id: { 
        type: Sequelize.BIGINT, 
        allowNull: false, 
        autoIncrement: true, 
        unique: true, 
        primaryKey: true 
      },

      email: { 
        type: Sequelize.STRING, 
        unique: true, 
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: { 
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty',
          },
        },
      },

      role: { 
        type: Sequelize.ENUM('ADMIN', 'USER'),
        allowNull: false,
        defaultValue: 'USER',
      },

      full_name: { 
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: {
          len: [1, 255],
        },
      },


      status: { 
        type: Sequelize.ENUM('ACTIVE', 'IN_ACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },

      registration_status: { 
        type: Sequelize.ENUM('STARTED', 'UNVERIFIED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'UNVERIFIED',
      },
      
      created_by: { 
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      updated_by: { 
        type: Sequelize.INTEGER,
        allowNull: true,
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
      
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_users');
    
    // Drop the enum types if they exist
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_users_role";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_users_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_users_registration_status";'
    );
  }
};
