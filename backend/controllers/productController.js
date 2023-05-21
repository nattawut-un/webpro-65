import { getProducts, getProductById, addProduct, editProduct, getCategories, deleteProduct, insertCategory, deleteCategory } from '../models/productModel.js'
import { getUserFromID } from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import secret from '../config/auth.js'
import Joi from 'joi'

export const showProducts = async (req, res, next) => {
  var user_id = null
  try {
    if (req.headers.authorization) {
      let [part1, part2] = req.headers.authorization.split(' ')
      var decoded = jwt.verify(part2, secret["jwt-secret"])
      var user = await getUserFromID(decoded.id)
      var user_id = user.id
    }
    const results = await getProducts(user_id || null)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const showProductById = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let [part1, part2] = req.headers.authorization.split(' ')
      var decoded = jwt.verify(part2, secret["jwt-secret"])
      var user = await getUserFromID(decoded.id)
      var user_id = user.id
    }
    const results = await getProductById(req.params.id, user_id || null)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const productSchema = Joi.object({
  name: Joi.string().required().min(5),
  price: Joi.number().required().min(0),
  description: Joi.string().allow(''),
  category_id: Joi.number().required()
})

export const createProduct = async (req, res, next) => {
  try {
    await productSchema.validateAsync(req.body)
  } catch {
    return res.status(401).send({
      msg: 'Product details are invalid.'
    })
  }

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
    req.body.category_id,
    req.body.id,
  ]
  // console.log(' data '.bgGray, data)

  try {
    const results = await editProduct(data)
    // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Product updated'.brightGreen.bold + ' name: ' + req.body.name)
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
    // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Product deleted'.brightGreen.bold + ' id: ' + req.params.id)
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

export const addCategory = async (req, res, next) => {
  try {
    const results = await insertCategory(req.body)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const removeCategory = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id)
    res.send({
      msg: 'Category deleted.'
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      msg: 'ERROR: Category is not removed.',
      data: err
    })
  }
}
