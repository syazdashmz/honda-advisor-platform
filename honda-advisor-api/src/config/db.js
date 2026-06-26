const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
};

const database = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testDatabaseConnection() {
  try {
    const connection = await database.getConnection();
    console.log('Connected to MySQL database:', dbConfig.database);
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  database,
  testDatabaseConnection,
};
