#!/usr/bin/env node
'use strict';

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function runCommand(command, description) {
  log(`\n${colors.blue}${description}...${colors.reset}`);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    log(`${colors.green}✓ ${description} completed${colors.reset}`);
    return true;
  } catch (error) {
    log(`${colors.red}✗ ${description} failed: ${error.message}${colors.reset}`);
    return false;
  }
}

async function setupDatabase() {
  log(`${colors.bright}${colors.cyan}=== Database Setup ===\n${colors.reset}`);

  const commands = [
    {
      command: 'npx sequelize-cli db:migrate',
      description: 'Running migrations',
    },
    {
      command: 'npx sequelize-cli db:seed:all',
      description: 'Running seeders',
    },
  ];

  let allSuccessful = true;

  for (const { command, description } of commands) {
    const success = await runCommand(command, description);
    if (!success) {
      allSuccessful = false;
      break;
    }
  }

  if (allSuccessful) {
    log(`\n${colors.green}${colors.bright}✓ Database setup completed successfully!${colors.reset}`);
    
    // Show seeder status
    log(`\n${colors.yellow}Checking seeder status...${colors.reset}`);
    try {
      const getSeederStatus = require('./seeder-status');
      await getSeederStatus();
    } catch (error) {
      log(`${colors.red}Could not check seeder status: ${error.message}${colors.reset}`);
    }
  } else {
    log(`\n${colors.red}${colors.bright}✗ Database setup failed!${colors.reset}`);
    process.exit(1);
  }
}

async function teardownDatabase() {
  log(`${colors.bright}${colors.magenta}=== Database Teardown ===\n${colors.reset}`);

  const commands = [
    {
      command: 'npx sequelize-cli db:seed:undo:all',
      description: 'Rolling back seeders',
    },
    {
      command: 'npx sequelize-cli db:migrate:undo:all',
      description: 'Rolling back migrations',
    },
  ];

  let allSuccessful = true;

  for (const { command, description } of commands) {
    const success = await runCommand(command, description);
    if (!success) {
      allSuccessful = false;
      // Continue with teardown even if one step fails
    }
  }

  if (allSuccessful) {
    log(`\n${colors.green}${colors.bright}✓ Database teardown completed successfully!${colors.reset}`);
  } else {
    log(`\n${colors.yellow}${colors.bright}⚠ Database teardown completed with some warnings${colors.reset}`);
  }
}

async function resetDatabase() {
  log(`${colors.bright}${colors.yellow}=== Database Reset ===\n${colors.reset}`);
  
  await teardownDatabase();
  await setupDatabase();
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'teardown':
    teardownDatabase();
    break;
  case 'reset':
    resetDatabase();
    break;
  default:
    log(`${colors.bright}Database Management Script${colors.reset}\n`);
    log('Usage: node db-setup.js <command>\n');
    log('Commands:');
    log('  setup     - Run migrations and seeders');
    log('  teardown  - Rollback seeders and migrations');
    log('  reset     - Teardown and setup (full reset)');
    log('\nExamples:');
    log('  node db-setup.js setup');
    log('  npm run db:setup');
    log('  npm run db:reset');
    break;
}

module.exports = {
  setupDatabase,
  teardownDatabase,
  resetDatabase,
};

