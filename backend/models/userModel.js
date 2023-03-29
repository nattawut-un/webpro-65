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
  // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Login set '.bgBrightGreen + ' id: ' + id)
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

export const getUserAddress = (id, res) => {
  db.query(`SELECT id, address, main_addr FROM address WHERE user_id = '${id}'`, (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}

export const getMainAddress = (id, res) => {
  db.query(`SELECT id, address, main_addr FROM address WHERE user_id = '${id}' AND main_addr = 1`, (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results[0])
    }
  })
}

export const getAddressFromID = (id, res) => {
  db.query(`SELECT id, address, main_addr FROM address WHERE id = '${id}'`, (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}

export const checkUser = (username, email, res) => {
  db.query('SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
  [username, email], (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}

export const checkAdmin = (user_id) => {
  db.query('SELECT is_admin FROM users WHERE id = ?',
  [user_id], (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}

export const addUser = (user_id, username, email, password) => {
  db.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
  [user_id, username, email, password], (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.log(results)
    }
  })
}
