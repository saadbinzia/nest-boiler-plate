'use strict';

const SeederTracker = require('../utils/seeder-tracker');
const seederName = '20250912070214-seed-demoUser-user.js';

module.exports = {
  async up (queryInterface) {
    // Check if this seeder has already been executed
    const hasBeenExecuted = await SeederTracker.hasBeenExecuted(queryInterface, seederName);
    if (hasBeenExecuted) {
      console.log(`Seeder ${seederName} has already been executed. Skipping...`);
      return;
    }

    // Check if demo user already exists
    const existingUsers = await queryInterface.sequelize.query(
      'SELECT id FROM tbl_users WHERE email = ?',
      {
        replacements: ['devtester@site.com'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const existingUser = existingUsers[0];

    if (existingUser) {
      console.log('Demo user already exists. Skipping creation...');
      await SeederTracker.markAsExecuted(queryInterface, seederName);
      return;
    }

    // Insert the demo user
    await queryInterface.bulkInsert('tbl_users', [{
      email: 'devtester@site.com',
      password: '$2b$12$ONKoxjHM1U1Cjgp/v33A0.AD6XvPapgShF0YijpttuPuH78zastxm',
      role: 'user',
      first_name: 'Dev',
      last_name: 'Test',
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
    // Delete the demo user
    await queryInterface.bulkDelete('tbl_users', { email: 'devtester@site.com' });
    
    // Mark seeder as not executed
    await SeederTracker.markAsNotExecuted(queryInterface, seederName);
    console.log(`Seeder ${seederName} rolled back successfully.`);
  }
};
