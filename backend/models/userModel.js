import db from '../config/database.js'

export const getUsers = (result) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  })
}

export const checkUser = (usr, pw, result) => {
  let sql = 'SELECT * FROM users WHERE username = ? AND password = ?'
  db.query(sql, [usr, pw],
  (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  })
}

export const addUser = (data, result) => {
  let sql = 'INSERT INTO users (username, password) VALUES (?, ?)'
  db.query(sql, data,
  (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  })
}
