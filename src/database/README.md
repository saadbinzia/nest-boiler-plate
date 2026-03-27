# Database Management System

This directory contains a comprehensive database management system with proper migration and seeder tracking.

## Features

- ✅ **Migration Tracking**: Standard Sequelize migration tracking
- ✅ **Seeder Tracking**: Custom seeder tracking to prevent duplicate execution
- ✅ **Idempotent Seeders**: Seeders can be run multiple times safely
- ✅ **Combined Scripts**: Single commands to setup/teardown entire database
- ✅ **Status Checking**: Check migration and seeder status
- ✅ **Rollback Support**: Proper rollback for both migrations and seeders
- ✅ **Proper Migration Order**: Seeder tracking table is created first
- ✅ **Clean Database Reset**: Complete database reset and reorganization

## Directory Structure

```
src/database/
├── config/
│   └── database.cjs          # Database configuration
├── migrations/               # Database migrations
├── seeders/                 # Database seeders (with tracking)
├── scripts/                 # Management scripts
│   ├── db-setup.js          # Combined setup/teardown script
│   └── seeder-status.js     # Seeder status checker
└── utils/
    └── seeder-tracker.js    # Seeder tracking utility
```

## Available Commands

### Basic Commands

```bash
# Migrations
npm run migrate              # Run pending migrations
npm run migrate:status       # Check migration status
npm run migrate:down         # Rollback last migration
npm run migrate:down:all     # Rollback all migrations
npm run migrate:create       # Create new migration

# Seeders
npm run seed                 # Run all seeders (with tracking)
npm run seed:status          # Check seeder status
npm run seed:down            # Rollback last seeder
npm run seed:down:all        # Rollback all seeders
npm run seed:create          # Create new seeder

# Combined Commands
npm run db:setup             # Run migrations + seeders
npm run db:teardown          # Rollback seeders + migrations
npm run db:reset             # Full reset (teardown + setup)
```

### Advanced Usage

```bash
# Check both migration and seeder status
npm run migrate:status && npm run seed:status

# Setup fresh database
npm run db:reset

# Setup database for development
npm run db:setup
```

## Migration Order

The migrations are organized in the following order:

1. **20221101050001-create-seeder-meta-table.js** - Creates the seeder tracking table (FIRST)
2. **20221101050002-create-user-table.js** - Creates the users table
3. **20240213104947-create-user-session-table.js** - Creates user sessions table
4. **20240221122426-create-table-user-verification-codes.js** - Creates verification codes table
5. **20240425102816-create-attachment-table.js** - Creates attachments table
6. **20240434123628-add-socail-login-for-users.js** - Adds social login fields
7. **20250402183730-add-tbl-system-settings.js** - Creates system settings table
8. **20250402183858-add-tbl-system-settings-data.js** - Populates system settings
9. **20250413163937-create-tbl-notifications.js** - Creates notifications table
10. **20251006120000-create-buildings.js** - Creates buildings table
11. **20251006120100-create-floors.js** - Creates floors table
12. **20251006120200-create-spaces.js** - Creates spaces table
13. **20251006120300-create-renovations.js** - Creates renovations table
14. **20251006120400-create-expenses.js** - Creates expenses table
15. **20251006120500-create-tenancy-history.js** - Creates tenancy history table

> **Important**: The seeder tracking table is created FIRST to ensure that seeder tracking works from the very beginning of the database setup.

## How Seeder Tracking Works

### 1. Tracking Table
A `SequelizeSeederMeta` table tracks executed seeders:
```sql
CREATE TABLE "SequelizeSeederMeta" (
  name VARCHAR PRIMARY KEY,
  executed_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Seeder Structure
Each seeder uses the `SeederTracker` utility:

```javascript
const SeederTracker = require('../utils/seeder-tracker');
const seederName = '20250912070014-seed-defaultAdmin-user.js';

module.exports = {
  async up(queryInterface) {
    // Check if already executed
    const hasBeenExecuted = await SeederTracker.hasBeenExecuted(queryInterface, seederName);
    if (hasBeenExecuted) {
      console.log(`Seeder ${seederName} has already been executed. Skipping...`);
      return;
    }

    // Check if data already exists (additional safety)
    const existingData = await queryInterface.sequelize.query(/* check query */);
    if (existingData.length > 0) {
      console.log('Data already exists. Skipping creation...');
      await SeederTracker.markAsExecuted(queryInterface, seederName);
      return;
    }

    // Insert data
    await queryInterface.bulkInsert(/* insert data */);

    // Mark as executed
    await SeederTracker.markAsExecuted(queryInterface, seederName);
  },

  async down(queryInterface) {
    // Remove data
    await queryInterface.bulkDelete(/* delete data */);
    
    // Mark as not executed
    await SeederTracker.markAsNotExecuted(queryInterface, seederName);
  }
};
```

### 3. Safety Features
- **Duplicate Prevention**: Seeders check tracking table before execution
- **Data Existence Check**: Additional check for existing data
- **Idempotent**: Can be run multiple times safely
- **Rollback Support**: Proper cleanup and tracking removal

## Creating New Seeders

1. **Create the seeder file**:
   ```bash
   npm run seed:create -- my-new-seeder
   ```

2. **Update the generated file** to use the tracking system:
   ```javascript
   'use strict';

   const SeederTracker = require('../utils/seeder-tracker');
   const seederName = 'YYYYMMDDHHMMSS-my-new-seeder.js'; // Use actual filename

   module.exports = {
     async up(queryInterface) {
       // Check if already executed
       const hasBeenExecuted = await SeederTracker.hasBeenExecuted(queryInterface, seederName);
       if (hasBeenExecuted) {
         console.log(`Seeder ${seederName} has already been executed. Skipping...`);
         return;
       }

       // Your seeder logic here
       await queryInterface.bulkInsert('your_table', [/* your data */]);

       // Mark as executed
       await SeederTracker.markAsExecuted(queryInterface, seederName);
       console.log(`Seeder ${seederName} executed successfully.`);
     },

     async down(queryInterface) {
       // Your rollback logic here
       await queryInterface.bulkDelete('your_table', {/* your conditions */});
       
       // Mark as not executed
       await SeederTracker.markAsNotExecuted(queryInterface, seederName);
       console.log(`Seeder ${seederName} rolled back successfully.`);
     }
   };
   ```

## Best Practices

### 1. Seeder Design
- Always check if data already exists
- Use unique identifiers (email, name, etc.) to prevent duplicates
- Include proper error handling
- Add meaningful console messages

### 2. Data Safety
- Test seeders in development first
- Use transactions for complex operations
- Validate data before insertion
- Handle foreign key constraints properly

### 3. Environment Management
- Use different data for different environments
- Consider environment-specific seeders
- Keep production data separate from development data

### 4. Rollback Strategy
- Always implement proper `down` methods
- Test rollback functionality
- Consider data dependencies when rolling back

## Troubleshooting

### Common Issues

1. **Seeder runs multiple times**:
   - Check if `SeederTracker.markAsExecuted()` is called
   - Verify seeder name matches filename exactly

2. **Foreign key constraint errors**:
   - Run seeders in correct order
   - Check if referenced data exists
   - Consider using transactions

3. **Permission errors**:
   - Ensure database user has necessary permissions
   - Check table creation permissions

### Debug Commands

```bash
# Check current database state
npm run migrate:status
npm run seed:status

# Reset everything (careful in production!)
npm run db:reset

# Manual seeder tracking check
psql $DATABASE_URL -c "SELECT * FROM \"SequelizeSeederMeta\";"
```

## Production Deployment

### Initial Setup
```bash
# Production database setup
NODE_ENV=production npm run db:setup
```

### Updates
```bash
# Run only new migrations and seeders
NODE_ENV=production npm run migrate
NODE_ENV=production npm run seed
```

### Monitoring
```bash
# Check status
NODE_ENV=production npm run migrate:status
NODE_ENV=production npm run seed:status
```

## Contributing

When adding new seeders:
1. Follow the tracking pattern shown above
2. Test in development environment first
3. Ensure proper rollback functionality
4. Update this README if adding new patterns or utilities

---

This system ensures reliable, trackable, and safe database operations across all environments.
