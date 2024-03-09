import { addOrder, getOrderFromID, getOrders, editOrderFinish, deleteOrder } from '../models/orderModel.ts'
import { getAddressFromID } from '../models/userModel.ts'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from 'express'

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
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

export const fetchOrderbyUser = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const orders = await getOrderFromID(req.user.id)
    return res.send(orders)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const fetchOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await getOrders()
    return res.send(results)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const finishOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await editOrderFinish(req.body.order_id)
    return res.send(results)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const removeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await deleteOrder(req.params.order_id)
    return res.send(results)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
