import db from '../config/database.js'

export const addOrder = async (order_id, user_id, address, cart) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r, f] = await db.query('INSERT INTO `order` (order_id, user_id, address, cart) VALUES (?, ?, ?, ?)',
    [order_id, user_id, address, cart])
    conn.commit()
  } catch (err) {
    await conn.rollback()
    return next(err)
  } finally {
    conn.release()
  }
}

export const getOrder = async () => {
  const [rows, fields] = await db.query('SELECT * FROM `order`')
  return rows
}

export const getOrderFromID = async (user_id, res) => {
  const [rows, fields] = await db.query('SELECT * FROM `order` WHERE user_id = ? ORDER BY order_time DESC', [user_id])
  return rows
}
