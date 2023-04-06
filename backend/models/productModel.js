import db from '../config/database.js'

export const getProducts = async () => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM products')
    return rows
  } catch (err) {
    return err
  }
}

export const getProductById = async (id) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM products WHERE id = ?", [id])
    return rows[0]
  } catch (err) {
    return err
  }
}

export const addProduct = async (data) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('INSERT INTO products SET ?', data)
    conn.commit()
  } catch (err) {
    await conn.rollback()
    return err
  } finally {
    conn.release()
  }
}

export const editProduct = async (data) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('UPDATE products SET name=?, price=?, description=? WHERE id=?', data)
    conn.commit()
  } catch (err) {
    await conn.rollback()
    return err
  } finally {
    conn.release()
  }
}
