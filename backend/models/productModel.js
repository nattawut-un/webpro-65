import db from '../config/database.js'
import path from 'path'

export const getProducts = async () => {
  try {
    const [rows, fields] = await db.query('SELECT p.*, i.file_path, c.name `category` FROM products p LEFT OUTER JOIN images i ON (p.id = i.product_id) JOIN categories c ON (p.category_id = c.id) WHERE i.main = 1 ORDER BY p.id')
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

export const getProductById = async (id) => {
  try {
    const [rows, fields] = await db.query("SELECT p.*, i.file_path FROM products p LEFT OUTER JOIN images i ON (p.id = i.product_id) WHERE p.id = ?", [id])
    return rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

export const addProduct = async (data, image) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r1, f1] = await db.query('INSERT INTO products SET ?', data)
    const [r2, f2] = await db.query('INSERT INTO images (product_id, file_path, main) VALUES (?, ?, 1)', [r1.insertId, image.path.substr(6)])
    conn.commit()
    return {
      product: r1,
      image: r2
    }
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const editProduct = async (data) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('UPDATE products SET name=?, price=?, description=?, category_id=?, date_modified=current_timestamp WHERE id=?', data)
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const getCategories = async () => {
  try {
    const [rows, fields] = await db.query('SELECT c.*, count(p.id) `prod_amount` FROM categories c LEFT OUTER JOIN products p ON (c.id = p.category_id) GROUP BY c.id')
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteProduct = async (id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('DELETE FROM products WHERE id=?', id)
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const insertCategory = async (data) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('INSERT INTO categories SET ?', data)
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}
