import db from '../config/database.js'
import bcrypt from 'bcryptjs'

export const checkUser = (username, password, res) => {
  db.query(`SELECT username, password FROM users WHERE username = '${username}'`, (err, result) => {
    // error
    if (err) {
      console.log(err)
      res(username + ' error', null)
      return
    }
    // username is not found
    if (!result.length) {
      res(username + ' not found', null)
      return
    }
    // compare password with hash
    bcrypt.compare(
      password,
      result[0].password,
      (err, isMatch) => {
        if (isMatch) {
          // some shit about cookie or something idk
          res(null, username + ' password right')
        } else {
          res(username + ' password wrong', null)
        }
      }
    )
  })
}
