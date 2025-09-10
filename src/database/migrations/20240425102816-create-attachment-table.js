'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_attachments', {
      id: { 
        type: Sequelize.BIGINT, 
        allowNull: false, 
        autoIncrement: true, 
        unique: true, 
        primaryKey: true 
      },
      parent: { 
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The parent entity type this attachment belongs to'
      },
      parent_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        comment: 'The ID of the parent entity'
      },
      type: { 
        type: Sequelize.STRING, 
        allowNull: false,
        defaultValue: 'other',
        comment: 'The type of the attachment'
      },
      file_original_name: { 
        type: Sequelize.STRING(500), 
        allowNull: false,
        comment: 'Original name of the uploaded file'
      },
      file_path: { 
        type: Sequelize.STRING(1000), 
        allowNull: false,
        comment: 'Relative path to the stored file'
      },
      file_unique_name: { 
        type: Sequelize.STRING(255), 
        unique: true,
        allowNull: true,
        comment: 'Unique name generated for the stored file'
      },
      created_by: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        comment: 'ID of the user who uploaded this file'
      },
      updated_by: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        comment: 'ID of the user who last updated this record'
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
    await queryInterface.addIndex('tbl_attachments', ['parent', 'parent_id']);
    await queryInterface.addIndex('tbl_attachments', ['type']);
    await queryInterface.addIndex('tbl_attachments', ['file_unique_name'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_attachments');
  }
};
