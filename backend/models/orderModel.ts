import _ from 'lodash'
import prisma from '../config/prisma.ts'
import { Prisma } from '@prisma/client'

export const addOrder = async (order_id: string, user_id: string, address_id: string, cart: {
  id: number, price: string, quantity: number
}[]) => {
  try {
    const cartData: Prisma.CartItemCreateManyOrderInput[] = []
    cart.forEach(item => {
      cartData.push({
        productId: item.id,
        priceEach: parseInt(item.price),
        amount: item.quantity
      })
    })

    const res = await prisma.order.create({
      data: {
        id: order_id,
        userId: user_id,
        addressId: address_id,
        cartItem: {
          createMany: {
            data: cartData
          }
        }
      }
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getOrderFromID = async (user_id: string) => {
  try {
    const res = await prisma.order.findMany({
      where: {
        userId: user_id
      },
      include: {
        cartItem: {
          include: {
            product: true
          }
        },
        user: true,
        address: true
      }
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getOrders = async () => {
  try {
    const res = await prisma.order.findMany({
      include: {
        cartItem: {
          include: {
            product: true
          }
        },
        user: true,
        address: true
      }
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const editOrderFinish = async (order_id: string) => {
  try {
    const res = await prisma.order.update({
      where: { id: order_id },
      data: { finishTime: new Date() },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const deleteOrder = async (order_id: string) => {
  try {
    const deleteOrder = prisma.order.delete({
      where: { id: order_id }
    })
    const deleteCartItem = prisma.cartItem.deleteMany({
      where: { orderId: order_id }
    })
    const res = await prisma.$transaction([ deleteOrder, deleteCartItem ])
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}
