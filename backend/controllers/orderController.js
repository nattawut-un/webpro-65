import { addOrder, getOrderFromID } from '../models/orderModel.js'
import { getAddressFromID } from '../models/userModel.js'
import { v4 as uuidv4 } from 'uuid'

export const placeOrder = (req, res, next) => {
  let { user_id, address_id, cart } = req.body
  let order_id = uuidv4()
  getAddressFromID(address_id, (err, results) => {
    if (err) {
      console.log(err)
      res.status(400).send(err)
    }
    addOrder(order_id, user_id, results[0].address, cart, (err, results) => {
      if (err) {
        console.log(err)
        res.status(400).send(err)
      } else {
        res.status(200).send({
          msg: 'Order successful.'
        })
      }
    })
  })
}

export const fetchOrderbyUser = (req, res, next) => {
  getOrderFromID(req.userID, (err, results) => {
    if (err) {
      console.log(err)
      res.status(400).send(err)
    } else {
      console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Order fetched '.bgBrightGreen + ' id: ' + req.userID)
      console.log(results)
      res.status(200).send(results)
    }
  })
}
