'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {  
  async up(queryInterface, Sequelize) {
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
        type: Sequelize.ENUM('admin', 'user', 'manager', 'staff'),
        allowNull: false,
        defaultValue: 'user',
      },

      first_name: { 
        type: Sequelize.STRING(100),
        allowNull: true,
        validate: {
          len: [1, 100],
        },
      },

      last_name: { 
        type: Sequelize.STRING(100),
        allowNull: true,
        validate: {
          len: [1, 100],
        },
      },

      status: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10, // ACTIVE
        validate: {
          isIn: [[10, 20]], // ACTIVE, IN_ACTIVE
        },
      },

      phone_number: { 
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        },
      },

      registration_status: { 
        type: Sequelize.ENUM('pending', 'completed', 'verification_pending'),
        allowNull: false,
        defaultValue: 'pending',
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
  }
};
