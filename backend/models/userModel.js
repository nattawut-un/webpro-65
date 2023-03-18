import db from '../config/database.js'
import bcrypt from 'bcryptjs'

export const authenticateUser = (username, password, res) => {
  db.query(`SELECT id, username, password FROM users WHERE username = '${username}'`, (err, results) => {
    // error
    if (err) {
      console.log(err)
      res(username + ' error', null)
      return
    }
    // username is not found
    if (!results.length) {
      res(username + ' not found', null)
      return
    }
    // compare password with hash
    bcrypt.compare(
      password,
      results[0].password,
      (err, isMatch) => {
        if (isMatch) {
          // some shit about cookie or something idk
          res(null, results)
        } else {
          res(username + ' password wrong', null)
        }
      }
    )
  })
}

export const setLogin = (id) => {
  db.query(`UPDATE users SET last_login = now() WHERE id = '${id}'`)
  console.log('Login set: ' + id)
}

export const getUser = (id, res) => {
  db.query(`SELECT * FROM users WHERE id = '${id}'`, (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}
