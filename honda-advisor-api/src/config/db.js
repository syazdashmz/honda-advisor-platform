const mysql = require('mysql2/promise');
require('dotenv').config();

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testDatabaseConnection() {
  try {
    const connection = await database.getConnection();
    console.log('Connected to MySQL database:', process.env.DB_NAME);
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