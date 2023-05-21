import db from '../config/database.js'
import _ from 'lodash'

function processOrders(orders) {
  const groupedRows = _.groupBy(orders, 'order_id')
  var finalList = []

  for (const [key, value] of Object.entries(groupedRows)) {
    let orderList = []
    value.forEach(item => {
      orderList.push({
        name: item.name,
        price: item.price,
        amount: item.prod_amount,
      })
    })
    finalList.push({
      order_id: key,
      user_id: value[0].user_id,
      username: value[0].username,
      first_name: value[0].first_name,
      last_name: value[0].last_name,
      address: value[0].address,
      order_time: value[0].order_time,
      finish_time: value[0].finish_time,
      order_list: orderList
    })
  }

  return finalList
}

// export const addOrder = async (order_id, user_id, address, cart) => {
//   const conn = await db.getConnection()
//   await conn.beginTransaction()

//   try {
//     const [r, f] = await db.query('INSERT INTO orders (order_id, user_id, address, cart) VALUES (?, ?, ?, ?)',
//     [order_id, user_id, address, cart])
//     conn.commit()
//   } catch (err) {
//     await conn.rollback()
//     return err
//   } finally {
//     conn.release()
//   }
// }

export const addOrder = async (order_id, user_id, address, cart) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r, f] = await conn.query('INSERT INTO orders (order_id, user_id, address) VALUES (?, ?, ?)',
    [order_id, user_id, address])
    cart.forEach(async (item) => {
      await conn.query('INSERT INTO order_detail (order_id, prod_id, prod_price, prod_amount) VALUES (?, ?, ?, ?)',
      [order_id, item.id, item.price, item.quantity])
    })
    conn.commit()
  } catch (err) {
    await conn.rollback()
    throw new Error(err)
  } finally {
    conn.release()
  }
}

// export const getOrderFromID = async (user_id, res) => {
//   try {
//     const [rows, fields] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_time DESC', [user_id])
//     return rows
//   } catch (err) {
//     throw new Error(err)
//   }
// }

export const getOrderFromID = async (user_id, res) => {
  try {
    const sql =`
    SELECT o.*, u.username, u.first_name, u.last_name, p.id, p.name, p.price, od.prod_amount
    FROM orders o
    LEFT OUTER JOIN order_detail od ON (o.order_id = od.order_id)
    LEFT OUTER JOIN products p ON (od.prod_id = p.id)
    LEFT OUTER JOIN users u ON (o.user_id = u.id)
    WHERE user_id = ?
    ORDER BY o.order_time DESC
    `
    const [rows, fields] = await db.query(sql, [user_id])
    const finalList = processOrders(rows)
    return finalList
  } catch (err) {
    throw new Error(err)
  }
}

// export const getOrders = async () => {
//   const [rows, fields] = await db.query('SELECT o.*, u.username FROM orders o JOIN users u ON (o.user_id = u.id) ORDER BY order_time DESC')
//   return rows
// }

export const getOrders = async () => {
  const sql = `
  SELECT o.*, u.username, u.first_name, u.last_name, p.id, p.name, p.price, od.prod_amount
  FROM orders o
  LEFT OUTER JOIN order_detail od ON (o.order_id = od.order_id)
  LEFT OUTER JOIN products p ON (od.prod_id = p.id)
  LEFT OUTER JOIN users u ON (o.user_id = u.id)
  ORDER BY o.order_time DESC
  `
  const [rows, fields] = await db.query(sql)

  // const finalList = rows.reduce((group, arr) => {
  //   const { order_id } = arr
  //   group[order_id] = group[order_id] ?? []
  //   group[order_id].push(arr)
  //   return group
  // }, {})

  // const groupedRows = _.groupBy(rows, 'order_id')
  // var finalList = []
  // for (const [key, value] of Object.entries(groupedRows)) {
  //   let orderList = []
  //   value.forEach(item => {
  //     orderList.push({
  //       name: item.name,
  //       price: item.price,
  //       amount: item.prod_amount,
  //     })
  //   })
  //   // finalList[key] = {
  //   //   user_id: value[0].user_id,
  //   //   username: value[0].username,
  //   //   first_name: value[0].first_name,
  //   //   last_name: value[0].last_name,
  //   //   address: value[0].address,
  //   //   order_time: value[0].order_time,
  //   //   finish_time: value[0].finish_time,
  //   //   order_list: orderList
  //   // }
  //   finalList.push({
  //     order_id: key,
  //     user_id: value[0].user_id,
  //     username: value[0].username,
  //     first_name: value[0].first_name,
  //     last_name: value[0].last_name,
  //     address: value[0].address,
  //     order_time: value[0].order_time,
  //     finish_time: value[0].finish_time,
  //     order_list: orderList
  //   })
  // }

  const finalList = processOrders(rows)
  return finalList
}

export const editOrderFinish = async (order_id) => {
  const conn = await db.getConnection()
  await conn.beginTransaction()

  try {
    const [r, f] = await conn.query('UPDATE orders SET finish_time = CURRENT_TIMESTAMP WHERE order_id = ?',
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
    const [r1, f1] = await conn.query('DELETE FROM orders WHERE order_id = ?', [order_id])
    const [r2, f2] = await conn.query('DELETE FROM order_detail WHERE order_id = ?', [order_id])
    conn.commit()
  } catch (err) {
    await conn.rollback()
    return err
  } finally {
    conn.release()
  }
}
