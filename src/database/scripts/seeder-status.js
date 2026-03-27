#!/usr/bin/env node
'use strict';

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Database configuration
const config = require('../config/database.cjs');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

const SeederTracker = require('../utils/seeder-tracker');

async function getSeederStatus() {
  try {
    // Get all seeder files
    const seedersPath = path.join(__dirname, '../seeders');
    const seederFiles = fs.readdirSync(seedersPath)
      .filter(file => file.endsWith('.js'))
      .sort();

    // Get executed seeders from database
    const executedSeeders = await SeederTracker.getExecutedSeeders({ sequelize });
    const executedSeederNames = executedSeeders.map(s => s.name);

    console.log('\n=== Seeder Status ===\n');

    if (seederFiles.length === 0) {
      console.log('No seeders found.');
      return;
    }

    seederFiles.forEach(file => {
      const status = executedSeederNames.includes(file) ? 'up' : 'down';
      const executedAt = executedSeeders.find(s => s.name === file)?.executed_at;
      
      if (status === 'up') {
        console.log(`up   ${file} (executed at: ${new Date(executedAt).toLocaleString()})`);
      } else {
        console.log(`down ${file}`);
      }
    });

    console.log('\n');
  } catch (error) {
    console.error('Error checking seeder status:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  getSeederStatus();
}

module.exports = getSeederStatus;

