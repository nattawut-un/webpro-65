import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()

const db = mysql.createPool({
  host: process.env.WEBPRO_DB_HOST,
  user: process.env.WEBPRO_DB_USERNAME,
  password: process.env.WEBPRO_DB_PASSWORD,
  database: process.env.WEBPRO_DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
