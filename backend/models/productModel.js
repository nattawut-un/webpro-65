import db from '../config/database.js'

export const getProducts = async () => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM products')
    return rows
  } catch (err) {
    console.log(err)
  }
}

export const getProductById = async (id) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM products WHERE id = ?", [id])
    return rows[0]
  } catch (err) {
    console.log(err)
  }
}
