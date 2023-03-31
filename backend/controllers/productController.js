import { getProducts, getProductById } from '../models/productModel.js'

export const showProducts = async (req, res, next) => {
  const results = await getProducts()
  res.json(results)
}

export const showProductById = async (req, res, next) => {
  const results = await getProductById(req.params.id)
  res.json(results)
}
