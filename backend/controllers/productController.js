import { getProducts, getProductById, addProduct, editProduct } from '../models/productModel.js'

export const showProducts = async (req, res, next) => {
  try {
    const results = await getProducts()
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const showProductById = async (req, res, next) => {
  try {
    const results = await getProductById(req.params.id)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const results = await addProduct(req.data)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const updateProduct = async (req, res, next) => {
  let data = [
    req.body.name,
    req.body.price,
    req.body.description,
    req.body.id,
  ]
  console.log(' data '.bgGray, data)

  try {
    const results = await editProduct(data)
    console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Product updated'.brightGreen.bold + ' id: ' + req.body.id)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
