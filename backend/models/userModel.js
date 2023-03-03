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
  db.query('SELECT * FROM users WHERE name = ? AND password = ?', [usr, pw], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
        result(null, results);
    }
  })
}
