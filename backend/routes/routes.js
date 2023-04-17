import express from 'express'
const router = express.Router();

import upload from '../config/multer.js'

// products
import {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  fetchCategories,
  removeProduct,
  addCategory
} from '../controllers/productController.js'

router.get('/products', showProducts) // get all products
router.get('/products/:id', showProductById) // get a prooduct by id
router.post('/products/add', authorizeUser, upload.single('image'), createProduct) // add new product
router.put('/products/:id/update', authorizeUser, authorizeAdmin, updateProduct) // update existing product
router.delete('/products/:id/delete', authorizeUser, authorizeAdmin, removeProduct) // delete product
router.get('/categories', fetchCategories) // get all categories
router.post('/categories/add', authorizeUser, authorizeAdmin, addCategory) // add new category

// user
import { loginUser,
  authorizeUser,
  authorizeAdmin,
  fetchUser,
  registeringUser,
  changePassword
} from '../controllers/userController.js'

router.post('/login', loginUser) // login
router.post('/register', registeringUser) // register
router.post('/get_user', authorizeUser, fetchUser) // get user date
router.put('/user/change_password', authorizeUser, changePassword) // change password

// order
import {
  fetchOrderbyUser,
  placeOrder,
  fetchOrders,
  finishOrder,
  removeOrder
} from '../controllers/orderController.js'

router.post('/place_order', authorizeUser, placeOrder) // place new order
router.post('/get_order', authorizeUser, fetchOrderbyUser) // get user's order
router.get('/orders', authorizeUser, authorizeAdmin, fetchOrders) // get all orders
router.put('/orders/finish', authorizeUser, authorizeAdmin, finishOrder) // finish the order
router.delete('/orders/delete/:order_id', authorizeUser, authorizeAdmin, removeOrder) // delete order

export default router
