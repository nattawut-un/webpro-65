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
  const [rows, fields] = await db.query('SELECT * FROM users WHERE id = ?', [id])
  return rows[0]
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

export const updateUser = async (user_id, data, mode) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  let sql
  let params

  if (mode === 'password') {
    sql = 'UPDATE users SET password = ? where id = ?'
    params = [data.password, user_id]
  } else {
    throw new Error('Wrong mode.')
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
