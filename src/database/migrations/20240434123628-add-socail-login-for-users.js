
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Define the social provider enum
    const socialProviders = [
      'facebook', 'google', 'twitter', 'apple', 'github', 'linkedin', 
      'microsoft', 'instagram', 'gitlab', 'bitbucket', 'spotify', 
      'discord', 'twitch', 'slack', 'other'
    ];
    
    await queryInterface.createTable('tbl_social_logins', {
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
        comment: 'ID of the user this social login is linked to'
      },
      provider: {
        type: Sequelize.ENUM(...socialProviders),
        allowNull: false,
        comment: 'The social provider (e.g., google, facebook)'
      },
      access_token: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'OAuth access token'
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'OAuth refresh token'
      },
      id_token: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'OAuth ID token (JWT)'
      },
      social_profile_data: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Raw profile data from the social provider',
        get() {
          const value = this.getDataValue('social_profile_data');
          return value || {};
        },
        set(value) {
          this.setDataValue('social_profile_data', value || {});
        }
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When this social login was last used'
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
    await queryInterface.addIndex('tbl_social_logins', ['user_id']);
    // Add index on provider for filtering
    await queryInterface.addIndex('tbl_social_logins', ['provider']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_social_logins');
    
    // Drop the enum type if it exists
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_social_logins_provider";'
    );
  }
};