import prisma from '../config/prisma'

export const getProducts = async (user_id?: string) => {
  try {
    if (user_id) {
      const res = await prisma.product.findMany({
        include: {
          _count: { select: { userFavs: true, cartItem: true } },
          images: true,
          category: true,
          userFavs: { where: { userId: { equals: user_id } } },
        },
        orderBy: { id: 'asc' },
      })
      return res
    } else {
      const res = await prisma.product.findMany({
        include: {
          _count: { select: { userFavs: true, cartItem: true } },
          images: true,
          category: true,
        },
        orderBy: { id: 'asc' },
      })
      return res
    }
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getProductById = async (prod_id: string, user_id?: string) => {
  const productId = parseInt(prod_id)
  try {
    if (user_id) {
      const res = await prisma.product.findFirst({
        where: { id: productId },
        include: {
          images: true,
          category: true,
          userFavs: { where: { userId: { equals: user_id } } },
        },
      })
      return res
    } else {
      const res = await prisma.product.findFirst({
        where: { id: productId },
        include: {
          images: true,
          category: true,
        },
      })
      return res
    }
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const addProduct = async (data: {
  name: string, price: number, description: string, category_id: string
}, image: string) => {
  try {
    const res = await prisma.product.create({
      data: {
        title: data.name,
        price: data.price,
        description: data.description,
        categoryId: parseInt(data.category_id),
        images: {
          create: [{ path: image }],
        },
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const editProduct = async (data: {
  id: number, name: string, price: number, description: string, category_id: number
}) => {
  try {
    const res = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.name,
        price: data.price,
        description: data.description,
        categoryId: data.category_id,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const getCategories = async () => {
  try {
    const res = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        products: true,
      },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const deleteProduct = async (id: number) => {
  try {
    const res = await prisma.product.delete({
      where: { id },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const insertCategory = async (data: any) => {
  try {
    const res = await prisma.category.create({
      data: {
        ...data,
        name: undefined,
        title: data.name,
      }
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}

export const deleteCategory = async (cate_id: number) => {
  try {
    const res = await prisma.category.delete({
      where: { id: cate_id },
    })
    return res
  } catch (err) {
    throw err
  } finally {
    await prisma.$disconnect()
  }
}
