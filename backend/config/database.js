import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()

const db = mysql.createPool({
  host: process.env.webpro_db_host,
  user: process.env.webpro_db_username,
  password: process.env.webpro_db_password,
  database: process.env.webpro_db_database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
