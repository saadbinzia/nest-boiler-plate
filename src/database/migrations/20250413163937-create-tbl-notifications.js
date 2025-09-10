'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Define the notification types enum
    const notificationTypes = [
      'info', 'success', 'warning', 'error', 'system', 'promotional', 'security', 'other'
    ];
    
    // Define the notification priorities enum
    const notificationPriorities = [
      'low', 'medium', 'high', 'critical'
    ];

    await queryInterface.createTable('tbl_notifications', {
      id: { 
        type: Sequelize.BIGINT, 
        allowNull: false, 
        autoIncrement: true, 
        unique: true, 
        primaryKey: true 
      },
      title: { 
        type: Sequelize.STRING(255), 
        allowNull: false,
        comment: 'Title or short description of the notification',
        validate: {
          notEmpty: { msg: 'Notification title is required' },
          len: [1, 255]
        }
      },
      description: { 
        type: Sequelize.STRING(2000), 
        allowNull: true,
        comment: 'Detailed description of the notification'
      },
      type: {
        type: Sequelize.ENUM(...notificationTypes),
        allowNull: false,
        defaultValue: 'info',
        comment: 'Type/category of the notification'
      },
      priority: {
        type: Sequelize.ENUM(...notificationPriorities),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Priority level of the notification'
      },
      is_read: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false,
        comment: 'Whether the notification has been read'
      },
      is_archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the notification has been archived'
      },
      redirect_url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
        comment: 'URL to redirect to when the notification is clicked',
        validate: {
          isUrl: true
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        comment: 'ID of the user who will receive this notification'
      },
      metadata: { 
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Additional metadata for the notification'
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the notification was read'
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

    // Add indexes for better query performance
    await queryInterface.addIndex('tbl_notifications', ['user_id']);
    await queryInterface.addIndex('tbl_notifications', ['is_read']);
    await queryInterface.addIndex('tbl_notifications', ['type']);
    await queryInterface.addIndex('tbl_notifications', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_notifications');
    
    // Drop the enum types if they exist
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_notifications_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_notifications_priority";'
    );
  }
};
