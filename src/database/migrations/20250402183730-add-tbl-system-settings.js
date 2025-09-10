'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('tbl_system_settings', {
      id: { 
        type: Sequelize.BIGINT, 
        allowNull: false, 
        autoIncrement: true, 
        unique: true, 
        primaryKey: true 
      },
      key: { 
        type: Sequelize.STRING(255), 
        unique: true, 
        allowNull: false,
        comment: 'Unique key for the setting',
        validate: {
          notEmpty: { msg: 'Key cannot be empty' },
          len: {
            args: [2, 255],
            msg: 'Key must be between 2 and 255 characters',
          },
          is: {
            args: /^[a-z0-9_]+(\.[a-z0-9_]+)*$/i,
            msg: 'Key can only contain alphanumeric characters, dots, and underscores',
          },
        },
      },
      value: { 
        type: Sequelize.TEXT, 
        allowNull: true,
        comment: 'The value of the setting (stored as string, parsed based on value_type)'
      },
      value_type: { 
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'string',
        comment: 'The data type of the setting value'
      },
      description: {
        type: Sequelize.STRING(1000),
        allowNull: true,
        comment: 'Description of what this setting does'
      },
      group: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Group/category for the setting'
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this setting is publicly accessible'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this setting is active'
      },
      created_by: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        comment: 'ID of the user who created this setting'
      },
      updated_by: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        comment: 'ID of the user who last updated this setting'
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
        comment: 'When the setting was soft-deleted'
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('tbl_system_settings', ['key'], { unique: true });
    await queryInterface.addIndex('tbl_system_settings', ['group']);
    await queryInterface.addIndex('tbl_system_settings', ['is_public']);
    await queryInterface.addIndex('tbl_system_settings', ['is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_system_settings');
    
    // Drop the enum type if it exists
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_system_settings_value_type";'
    );
  }
};
