import { getProducts, getProductById, addProduct, editProduct, getCategories, deleteProduct, insertCategory, deleteCategory } from '../models/productModel'
import { getUserFromID } from '../models/userModel'
import jwt from 'jsonwebtoken'
import secret from '../config/auth'
import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { uploadFile, getPublicURL } from '../config/supabase'
import { readFileSync } from 'fs'

const verifyToken = async (token: string) => {
  let [part1, part2] = token.split(' ')
  var decoded = jwt.verify(part2, secret['jwt-secret'])
  // @ts-ignore
  var user = await getUserFromID(decoded.id)

  if (!user) throw new Error('User is not found.')
  return user.id
}

export const showProducts = async (req: Request, res: Response, next: NextFunction) => {
  var user_id: string = ''
  try {
    if (req.headers.authorization) {
      user_id = await verifyToken(req.headers.authorization)
    }
    const results = await getProducts(user_id)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const showProductById = async (req: Request, res: Response, next: NextFunction) => {
  var user_id: string = ''
  try {
    if (req.headers.authorization) {
      user_id = await verifyToken(req.headers.authorization)
    }
    const results = await getProductById(req.params.id, user_id)
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

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(400).send({
      err: 'Form invalid',
    })
  }

  // s3.upload({
  //   Bucket: `${bucketName}`,
  //   Key: `${req.file?.originalname}`,
  //   Body: req.file?.buffer
  // }, (err, data) => {
  //   if (err) {
  //     console.error(err)
  //     return res.status(500).send('Error uploading file')
  //   }
  // })

  const file = new File(
    [readFileSync(`${req.file?.path}`)],
    `${req.file?.filename}`,
    { type: req.file?.mimetype }
  )
  const image = await uploadFile( 'images/', file)
  const imgPublicPath = await getPublicURL(image)

  try {
    const results = await addProduct(req.body, imgPublicPath)
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

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, price, description, category_id } = req.body
  let data = { id, name, price, description, category_id }

  try {
    const results = await editProduct(data)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const fetchCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await getCategories()
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const removeProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await deleteProduct(parseInt(req.params.id))
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

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await insertCategory(req.body)
    res.send(results)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const removeCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteCategory(parseInt(req.params.id))
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
