import path from 'path'
import prisma from '../config/prisma'

export const getProducts = async (user_id?: string) => {
  try {
    if (user_id) {
      const res = await prisma.product.findMany({
        include: {
          _count: { select: { userFavs: true } },
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
          _count: { select: { userFavs: true } },
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
  // try {
  //   var sql = ''
  //   if (user_id) {
  //     sql += "SELECT p.*, i.file_path, f.id `fav_id` FROM products p LEFT OUTER JOIN images i ON (p.id = i.product_id) LEFT OUTER JOIN user_favs f ON (p.id = f.prod_id AND f.user_id = '" + user_id + "') WHERE p.id = ?"
  //   } else {
  //     sql += "SELECT p.*, i.file_path FROM products p LEFT OUTER JOIN images i ON (p.id = i.product_id) WHERE p.id = ?"
  //   }
  //   const [rows, fields] = await db.query(sql, [prod_id])
  //   return rows[0]
  // } catch (err) {
  //   throw new Error(err)
  // }
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
}, image: any) => {
  try {
    const res = await prisma.product.create({
      data: {
        title: data.name,
        price: data.price,
        description: data.description,
        categoryId: parseInt(data.category_id),
        images: {
          create: [{ path: image.path.substr(6) }],
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
  // const conn = await db.getConnection()
  // await conn.beginTransaction()

  try {
    // const [rows, fields] = await conn.query('DELETE FROM categories WHERE id=?', [cate_id])
    // conn.commit()
    // return rows
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
