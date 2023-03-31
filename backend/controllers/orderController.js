import { addOrder, getOrderFromID } from '../models/orderModel.js'
import { getAddressFromID } from '../models/userModel.js'
import { v4 as uuidv4 } from 'uuid'

export const placeOrder = async (req, res, next) => {
  const { user_id, address_id, cart } = req.body
  const order_id = uuidv4()
  const address = await getAddressFromID(address_id)

  addOrder(order_id, user_id, address, cart)
  res.status(200).send({
    msg: 'Order successful.'
  })
}

export const fetchOrderbyUser = async (req, res, next) => {
  const orders = await getOrderFromID(req.userID)
  console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Order fetched'.brightGreen.bold + ' id: ' + req.userID)
  res.status(200).send(orders)
}
