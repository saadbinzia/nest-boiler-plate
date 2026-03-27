'use strict';

const SeederTracker = require('../utils/seeder-tracker');
const seederName = '20250912070230-seed-devAdmin-user.js';

module.exports = {
  async up (queryInterface) {
    // Check if this seeder has already been executed
    const hasBeenExecuted = await SeederTracker.hasBeenExecuted(queryInterface, seederName);
    if (hasBeenExecuted) {
      console.log(`Seeder ${seederName} has already been executed. Skipping...`);
      return;
    }

    // Check if admin user already exists
    const existingUsers = await queryInterface.sequelize.query(
      'SELECT id FROM tbl_users WHERE email = ?',
      {
        replacements: ['admin@dev.com'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const existingUser = existingUsers[0];

    if (existingUser) {
      console.log('Developer admin user already exists. Skipping creation...');
      await SeederTracker.markAsExecuted(queryInterface, seederName);
      return;
    }

    // Insert the admin user
    await queryInterface.bulkInsert('tbl_users', [{
      email: 'admin@dev.com',
      password: '$2b$10$4xTjnwAL8vTxXNuT84ZpHeN5ZgEo74qM9Aqc/H0KKSJ6CgkGKz92y', // hashed pass2word
      role: 'admin',
      first_name: 'developer',
      last_name: 'admin',
      status: 10,
      registration_status: 'completed',
      created_at: new Date(),
      updated_at: new Date(),
    }]);

    // Mark seeder as executed
    await SeederTracker.markAsExecuted(queryInterface, seederName);
    console.log(`Seeder ${seederName} executed successfully.`);
  },

  async down (queryInterface) {
    // Delete the admin user
    await queryInterface.bulkDelete('tbl_users', { email: 'admin@dev.com' });
    
    // Mark seeder as not executed
    await SeederTracker.markAsNotExecuted(queryInterface, seederName);
    console.log(`Seeder ${seederName} rolled back successfully.`);
  }
};

