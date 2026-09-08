const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from workspace root .env as well as current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

/**
 * Creates a Sequelize instance for a specific microservice database connected directly to MySQL
 * @param {string} dbName Default database name (e.g. 'auth_db', 'fleet_db')
 */
const createServiceDb = (dbName) => {
  // Default to MySQL mode so Postman & real users write directly to MySQL Workbench
  const dialect = process.env.DB_DIALECT || 'mysql';
  const targetDbName = process.env.DB_NAME || dbName;

  if (dialect === 'mysql') {
    return new Sequelize(
      targetDbName,
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || 'abcd', // Connects directly to local MySQL root:abcd
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }

  // SQLite fallback if explicitly requested
  const storagePath = path.resolve(
    process.cwd(),
    process.env.DB_STORAGE || `${dbName}.sqlite`
  );

  return new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
};

module.exports = { createServiceDb };
