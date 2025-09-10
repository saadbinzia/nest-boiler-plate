/* eslint-disable */
// This file is used by Sequelize CLI
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  test: {
    username: process.env.TEST_DB_USERNAME || process.env.DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME || process.env.DB_NAME + '_test',
    host: process.env.TEST_DB_HOST || process.env.DB_HOST,
    port: process.env.TEST_DB_PORT || process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USERNAME || process.env.DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.PROD_DB_NAME || process.env.DB_NAME,
    host: process.env.PROD_DB_HOST || process.env.DB_HOST,
    port: process.env.PROD_DB_PORT || process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};