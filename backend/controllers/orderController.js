import { addOrder, getOrderFromID, getOrders, editOrderFinish, deleteOrder } from '../models/orderModel.js'
import { getAddressFromID } from '../models/userModel.js'
import { v4 as uuidv4 } from 'uuid'

// export const placeOrder = async (req, res, next) => {
//   const { user_id, address_id, cart } = req.body
//   const order_id = uuidv4()
//   const address = await getAddressFromID(address_id)

//   await addOrder(order_id, user_id, address, cart)
//   return res.status(200).send({
//     msg: 'Order successful.'
//   })
// }

export const placeOrder = async (req, res, next) => {
  const { user_id, address_id, cart } = req.body
  const order_id = uuidv4()
  const address = await getAddressFromID(address_id)

  try {
    await addOrder(order_id, user_id, address_id, JSON.parse(cart))
    return res.status(200).send({
      msg: 'Order successful.'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const fetchOrderbyUser = async (req, res, next) => {
  try {
    const orders = await getOrderFromID(req.user.id)
    return res.send(orders)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

// export const fetchOrders = async (req, res, next) => {
//   try {
//     const results = await getOrders()
//     return res.send(results)
//   } catch (err) {
//     console.log(err)
//     return res.status(500).send(err)
//   }
// }

export const fetchOrders = async (req, res, next) => {
  try {
    const results = await getOrders()
    return res.send(results)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const finishOrder = async (req, res, next) => {
  try {
    const results = await editOrderFinish(req.body.order_id)
    // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Order finished'.brightGreen.bold + ' order_id: ' + req.body.order_id)
    return res.send(results)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const removeOrder = async (req, res, next) => {
  try {
    const results = await deleteOrder(req.params.order_id)
    // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Order Deleted'.brightGreen.bold + ' order_id: ' + req.params.order_id)
    return res.send(results)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
