import prisma from '../config/prisma.js'

export const setLogin = async id => {
  try {
    // const [rows, fields] = await conn.query('UPDATE users SET last_login = now() WHERE id = ?', [id])
    // conn.commit()
    const res = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        lastLogin: new Date(),
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getAllUsers = async () => {
  try {
    // const [rows, fields] = await db.query('SELECT u.*, count(o.order_id) `order_amount` FROM users u LEFT OUTER JOIN orders o ON (u.id = o.user_id) GROUP BY u.id ORDER BY u.register_time DESC')
    // return rows
    const res = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
        address: true,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getUserFromName = async name => {
  try {
    // const [rows, fields] = await db.query('SELECT * FROM users WHERE username = ?', [name])
    // return rows[0]
    const res = await prisma.user.findFirst({
      where: {
        username: name,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getUserFromID = async id => {
  try {
    // const [rows, fields] = await db.query('SELECT * FROM users WHERE id = ?', [id])
    // return rows[0]
    const res = await prisma.user.findFirst({
      where: {
        id: id,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getUserAddress = async id => {
  const res = await prisma.address.findMany({
    where: {
      userId: id,
    },
  })
  // const [rows, fields] = await db.query(
  //   'SELECT id, address, main_addr FROM address WHERE user_id = ?',
  //   [id]
  // )
  return res
}

export const getAddressFromID = async id => {
  // const [rows, fields] = await db.query('SELECT id, address, main_addr FROM address WHERE id = ?', [id])
  // return rows[0].address
  try {
    const res = await prisma.address.findFirst({
      where: {
        id: id,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const checkUser = async (username, email) => {
  // const [rows, fields] = await db.query('SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
  // [username, email])
  // return rows
  try {
    const res = await prisma.user.findMany({
      where: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const addUser = async user_data => {
  try {
    // const [rows, fields] = await conn.query('INSERT INTO users SET ?', user_data)
    // conn.commit()
    const res = await prisma.user.create({
      data: user_data,
    })
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const updateUser = async (user_id, data, mode = null) => {
  // const conn = await db.getConnection()
  // await conn.beginTransaction()

  // let sql
  // let params

  // if (mode === 'password') {
  //   sql = 'UPDATE users SET password = ? where id = ?'
  //   params = [data.password, user_id]
  // } else {
  //   sql =
  //     'UPDATE users SET first_name=?, last_name=?, username=?, phone=?, email=? where id=?'
  //   params = [
  //     data.first_name,
  //     data.last_name,
  //     data.username,
  //     data.phone,
  //     data.email,
  //     user_id,
  //   ]
  // }

  // try {
  //   const [rows, fields] = await conn.query(sql, params)
  //   conn.commit()
  //   return rows
  // } catch (err) {
  //   await conn.rollback()
  //   throw err
  // } finally {
  //   conn.release()
  // }
  try {
    if (mode === 'password') {
      const res = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          password: data.password,
        },
      })
      return res
    } else {
      const res = await prisma.user.update({
        where: {
          id: user_id,
        },
        data,
      })
      return res
    }
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const insertAddress = async (user_id, address) => {
  const r = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
      address: true,
    },
  })

  const main_addr = r[0]._count.orders > 0 ? 1 : 0

  // const conn = await db.getConnection()
  // await conn.beginTransaction()

  try {
    // const [rows, fields] = await conn.query(
    //   'INSERT INTO address (user_id, address, main_addr) VALUES (?, ?, ?)',
    //   [user_id, address, main_addr]
    // )
    // conn.commit()
    const res = await prisma.address.create({
      data: {
        userId: user_id,
        address,
        mainAddress: main_addr > 0 ? true : false,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const deleteAddress = async address_id => {
  try {
    // const [rows, fields] = await conn.query('DELETE FROM address WHERE id=?', [
    //   address_id,
    // ])
    // conn.commit()
    // return rows
    const res = await prisma.address.delete({
      where: {
        id: address_id,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const insertUserFavs = async (user_id, prod_id) => {
  try {
    // const [rows, fields] = await conn.query(
    //   'INSERT INTO user_favs (user_id, prod_id) VALUES (?, ?)',
    //   [user_id, prod_id]
    // )
    // conn.commit()
    // return rows
    const res = await prisma.userFavorite.create({
      data: {
        userId: user_id,
        productId: prod_id,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const deleteFromFavs = async (user_id, prod_id) => {
  // const conn = await db.getConnection()
  // await conn.beginTransaction()

  try {
    // const [rows, fields] = await conn.query(
    //   'DELETE FROM user_favs WHERE user_id=? AND prod_id=?',
    //   [user_id, prod_id]
    // )
    // conn.commit()
    // return rows
    const res =
      await prisma.$executeRaw`DELETE FROM userFavorite WHERE userId=${user_id} AND productId=${prod_id}`
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const updateAddressMain = async (user_id, address_id) => {
  // const conn = await db.getConnection()
  // await conn.beginTransaction()

  try {
    // const [r1, f1] = await conn.query(
    //   'UPDATE address SET main_addr=0 WHERE user_id=? AND id!=?',
    //   [user_id, address_id]
    // )
    // const [r2, f2] = await conn.query(
    //   'UPDATE address SET main_addr=1 WHERE user_id=? AND id=?',
    //   [user_id, address_id]
    // )
    // conn.commit()
    // return r2
    const removeFavFromOldAddress = prisma.$executeRaw`UPDATE address SET mainAddress=0 WHERE userId=${user_id} AND id!=${address_id}`
    const addFavToNewAddress = prisma.$executeRaw`UPDATE address SET mainAddress=1 WHERE userId=${user_id} AND id=${address_id}`

    const res = await prisma.$transaction([
      removeFavFromOldAddress,
      addFavToNewAddress,
    ])
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const setAdmin = async user_id => {
  try {
    // await db.query('UPDATE users SET is_admin=1 WHERE id=?', [user_id])
    await prisma.user.update({
      where: { id: user_id },
      data: { isAdmin: 1 },
    })
  } catch (err) {
    throw err
  }
}

export const deleteAdmin = async user_id => {
  try {
    // await db.query('UPDATE users SET is_admin=0 WHERE id=?', [user_id])
    await prisma.user.update({
      where: { id: user_id },
      data: { isAdmin: 0 },
    })
  } catch (err) {
    throw err
  }
}

export const deleteUser = async user_id => {
  try {
    // await db.query('DELETE FROM users WHERE id=?', [user_id])
    await prisma.user.delete({
      where: { id: user_id },
    })
  } catch (err) {
    throw err
  }
}
