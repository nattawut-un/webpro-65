import db from '../config/database.js'

export const addOrder = (order_id, user_id, address, cart, res) => {
  db.query('INSERT INTO `order` (order_id, user_id, address, cart) VALUES (?, ?, ?, ?)',
  [order_id, user_id, address, cart], (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}

export const getOrder = (res) => {
  db.query('SELECT * FROM `order`', (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}

export const getOrderFromID = (user_id, res) => {
  db.query('SELECT * FROM `order` WHERE user_id = ? ORDER BY order_time DESC',
  [user_id], (err, results) => {
    if (err) {
      res(err, null)
    } else {
      res(null, results)
    }
  })
}
