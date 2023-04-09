import { getProducts, getProductById, addProduct, editProduct, getCategories, deleteProduct } from '../models/productModel.js'

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
  var isValid = true

  if (req.body.name.length < 5) {isValid = false}
  if (isNaN(req.body.price)) {isValid = false}

  if (!isValid) {
    res.status(400).send({
      err: 'form invalid'
    })
    return
  }

  try {
    const results = await addProduct(req.body, req.file)
    console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Product added'.brightGreen.bold + ' name: ' + req.body.name)
    console.log(` product `.bgBlue, results.product)
    console.log(` image `.bgBlue, results.image)
    res.send({
      msg: 'Product added.',
      data: results
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      msg: 'ERROR: Product is not added.',
      data: err
    })
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
    console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Product updated'.brightGreen.bold + ' name: ' + req.body.name)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const fetchCategories = async (req, res, next) => {
  try {
    const results = await getCategories()
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const removeProduct = async (req, res, next) => {
  try {
    const results = await deleteProduct(req.params.id)
    console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Product deleted'.brightGreen.bold + ' id: ' + req.params.id)
    res.send({
      msg: 'Product removed.',
      id: req.body.id
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      msg: 'ERROR: Product is not removed.',
      data: err
    })
  }
}
