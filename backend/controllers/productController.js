import { getProducts, getProductById } from '../models/productModel.js'

export const showProducts = async (req, res, next) => {
  try {
    const results = await getProducts()
    res.json(results)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const showProductById = async (req, res, next) => {
  try {
    const results = await getProductById(req.params.id)
    res.json(results)
  } catch (err) {
    console.log(err)
    next(err)
  }
}
