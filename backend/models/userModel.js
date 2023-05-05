import db from '../config/database.js'

export const setLogin = async (id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('UPDATE users SET last_login = now() WHERE id = ?', [id])
    conn.commit()
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const getUserFromName = async (name) => {
  const [rows, fields] = await db.query('SELECT * FROM users WHERE username = ?', [name])
  return rows[0]
}

export const getUserFromID = async (id) => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM users WHERE id = ?', [id])
    return rows[0]
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

export const getUserAddress = async (id) => {
  const [rows, fields] = await db.query('SELECT id, address, main_addr FROM address WHERE user_id = ?', [id])
  return rows
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

export const getAddressFromID = async (id) => {
  const [rows, fields] = await db.query('SELECT id, address, main_addr FROM address WHERE id = ?', [id])
  return rows[0].address
}

export const checkUser = async (username, email, res) => {
  const [rows, fields] = await db.query('SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
  [username, email])
  return rows
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

export const addUser = async (user_id, username, email, password) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [user_id, username, email, password])
    conn.commit()
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const updateUser = async (user_id, data, mode = null) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  let sql
  let params

  if (mode === 'password') {
    sql = 'UPDATE users SET password = ? where id = ?'
    params = [data.password, user_id]
  } else {
    sql = 'UPDATE users SET first_name=?, last_name=?, username=?, phone=?, email=? where id=?'
    params = [data.first_name, data.last_name, data.username, data.phone, data.email, user_id]
  }

  try {
    const [rows, fields] = await db.query(sql, params)
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const insertAddress = async (user_id, address) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('INSERT INTO address (user_id, address) VALUES (?, ?)', [user_id, address])
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const deleteAddress = async (address_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('DELETE FROM address WHERE id=?', [address_id])
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const insertUserFavs = async (user_id, prod_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('INSERT INTO user_favs (user_id, prod_id) VALUES (?, ?)', [user_id, prod_id])
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const deleteFromFavs = async (user_id, prod_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await db.query('DELETE FROM user_favs WHERE user_id=? AND prod_id=?', [user_id, prod_id])
    conn.commit()
    return rows
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

export const updateAddressMain = async (user_id, address_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r1, f1] = await db.query('UPDATE address SET main_addr=0 WHERE user_id=? AND id!=?', [user_id, address_id])
    const [r2, f2] = await db.query('UPDATE address SET main_addr=1 WHERE user_id=? AND id=?', [user_id, address_id])
    conn.commit()
    return r2
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}
