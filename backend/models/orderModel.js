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
    return err
  } finally {
    conn.release()
  }
}

export const getOrder = async () => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM `order`')
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

export const getOrderFromID = async (user_id, res) => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM `order` WHERE user_id = ? ORDER BY order_time DESC', [user_id])
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

export const getOrders = async () => {
  const [rows, fields] = await db.query('SELECT o.*, u.username FROM `order` o JOIN users u ON (o.user_id = u.id) ORDER BY order_time DESC')
  return rows
}

export const editOrderFinish = async (order_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r, f] = await db.query('UPDATE `order` SET finish_time = CURRENT_TIMESTAMP WHERE order_id = ?',
    [order_id])
    conn.commit()
  } catch (err) {
    await conn.rollback()
    return err
  } finally {
    conn.release()
  }
}

export const deleteOrder = async (order_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r, f] = await db.query('DELETE FROM `order` WHERE order_id = ?',
    [order_id])
    conn.commit()
  } catch (err) {
    await conn.rollback()
    return err
  } finally {
    conn.release()
  }
}
