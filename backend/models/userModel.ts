import { Prisma } from '@prisma/client'
import prisma from '../config/prisma'

export const setLogin = async (id: string) => {
  try {
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

export const getUserFromName = async (name: string) => {
  try {
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

export const getUserFromID = async (id: string) => {
  try {
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

export const getUserAddress = async (id: string) => {
  const res = await prisma.address.findMany({
    where: {
      userId: id,
    },
  })
  return res
}

export const getAddressFromID = async (id: string) => {
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

export const checkUser = async (username: string, email: string) => {
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

export const addUser = async (user_data: Prisma.UserCreateInput) => {
  try {
    const res = await prisma.user.create({
      data: user_data,
    })
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const updateUser = async (user_id: string, data: Prisma.UserUpdateInput, mode: 'password' | null) => {
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

export const insertAddress = async (user_id: string, address: string) => {
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

  const main_addr = r[0].address.length === 0 ? true : false

  try {
    const res = await prisma.address.create({
      data: {
        userId: user_id,
        address,
        mainAddress: main_addr
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const deleteAddress = async (address_id: string) => {
  try {
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

export const insertUserFavs = async (user_id: string, prod_id: number) => {
  try {
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

export const deleteFromFavs = async (user_id: string, prod_id: number) => {
  try {
    const res =
      await prisma.$executeRaw`DELETE FROM Userfavorite WHERE userId=${user_id} AND productId=${prod_id}`
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const updateAddressMain = async (user_id: string, address_id: string) => {
  try {
    const removeFavFromOldAddress = prisma.$executeRaw`UPDATE Address SET mainAddress=0 WHERE userId=${user_id} AND id!=${address_id}`
    const addFavToNewAddress = prisma.$executeRaw`UPDATE Address SET mainAddress=1 WHERE userId=${user_id} AND id=${address_id}`

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

export const setAdmin = async (user_id: string) => {
  try {
    await prisma.user.update({
      where: { id: user_id },
      data: { isAdmin: 1 },
    })
  } catch (err) {
    throw err
  }
}

export const deleteAdmin = async (user_id: string) => {
  try {
    await prisma.user.update({
      where: { id: user_id },
      data: { isAdmin: 0 },
    })
  } catch (err) {
    throw err
  }
}

export const deleteUser = async (user_id: string) => {
  try {
    await prisma.user.delete({
      where: { id: user_id },
    })
  } catch (err) {
    throw err
  }
}
