import mysql from 'mysql'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'webpro_project'
});

export default db;
