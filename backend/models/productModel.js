import db from '../config/database.js'
import path from 'path'

export const getProducts = async (user_id = null) => {
  try {
    var sql = ''
    if (user_id) {
      sql += `
      SELECT p.*, p.name, i.file_path, c.name category, c.emoji cate_emoji,
      odc.purchase_amount, tuf.total_user_favs, f.id fav_id
      FROM products p
      LEFT OUTER JOIN images i ON (p.id = i.product_id)
      LEFT OUTER JOIN categories c ON (p.category_id = c.id)
      LEFT OUTER JOIN user_favs f ON (p.id = f.prod_id AND f.user_id = '${user_id}')
      JOIN (
        SELECT p.id prod_id, IFNULL(sum(od.prod_amount), 0) purchase_amount
        FROM products p
        LEFT OUTER JOIN order_detail od ON (p.id = od.prod_id)
        GROUP BY p.id
      ) AS odc ON (p.id = odc.prod_id)
      JOIN (
        SELECT p.id prod_id, count(uf.id) total_user_favs
        FROM products p
        LEFT OUTER JOIN user_favs uf ON (p.id = uf.prod_id)
        GROUP BY p.id
      ) AS tuf ON (p.id = tuf.prod_id)
      ORDER BY p.id
      `
    } else {
      sql += `SELECT p.*, p.name, i.file_path, c.name category, c.emoji cate_emoji,
      odc.purchase_amount, tuf.total_user_favs
      FROM products p
      LEFT OUTER JOIN images i ON (p.id = i.product_id)
      LEFT OUTER JOIN categories c ON (p.category_id = c.id)
      JOIN (
        SELECT p.id prod_id, IFNULL(sum(od.prod_amount), 0) purchase_amount
        FROM products p
        LEFT OUTER JOIN order_detail od ON (p.id = od.prod_id)
        GROUP BY p.id
      ) AS odc ON (p.id = odc.prod_id)
      JOIN (
        SELECT p.id prod_id, count(uf.id) total_user_favs
        FROM products p
        LEFT OUTER JOIN user_favs uf ON (p.id = uf.prod_id)
        GROUP BY p.id
      ) AS tuf ON (p.id = tuf.prod_id)
      ORDER BY p.id`
    }
    const [rows, fields] = await db.query(sql)
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

export const getProductById = async (prod_id, user_id = null) => {
  try {
    var sql = ''
    if (user_id) {
      sql += "SELECT p.*, i.file_path, f.id `fav_id` FROM products p LEFT OUTER JOIN images i ON (p.id = i.product_id) LEFT OUTER JOIN user_favs f ON (p.id = f.prod_id AND f.user_id = '" + user_id + "') WHERE p.id = ?"
    } else {
      sql += "SELECT p.*, i.file_path FROM products p LEFT OUTER JOIN images i ON (p.id = i.product_id) WHERE p.id = ?"
    }
    const [rows, fields] = await db.query(sql, [prod_id])
    return rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

export const addProduct = async (data, image) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r1, f1] = await conn.query('INSERT INTO products SET ?', data)
    const [r2, f2] = await conn.query('INSERT INTO images (product_id, file_path) VALUES (?, ?)', [r1.insertId, image.path.substr(6)])
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
    const [rows, fields] = await conn.query('UPDATE products SET name=?, price=?, description=?, category_id=?, date_modified=current_timestamp WHERE id=?', data)
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
    const sql = `
      SELECT c.*, count(p.id) prod_amount, i.file_path
      FROM categories c
      LEFT OUTER JOIN products p ON (c.id = p.category_id)
      LEFT OUTER JOIN (
        SELECT min(id) product_id, category_id
        FROM products
        GROUP BY category_id
      ) pid ON (pid.category_id = c.id)
      LEFT OUTER JOIN images i ON (pid.product_id = i.product_id)
      GROUP BY c.id;
    `
    const [rows, fields] = await db.query(sql)
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteProduct = async (id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await conn.query('DELETE FROM products WHERE id=?', id)
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
    const [rows, fields] = await conn.query('INSERT INTO categories SET ?', data)
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const deleteCategory = async (cate_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await conn.query('DELETE FROM categories WHERE id=?', [cate_id])
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}
