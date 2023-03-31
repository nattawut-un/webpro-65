import db from '../config/database.js'

export const getProducts = async () => {
  const [rows, fields] = await db.query('SELECT * FROM products')
  return rows
}

export const getProductById = async (id) => {
  const [rows,fields] = await db.query("SELECT * FROM products WHERE id = ?", [id])
  return rows[0]
}
