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
  removeProduct
} from '../controllers/productController.js'

router.get('/products', showProducts)
router.get('/products/:id', showProductById)
router.get('/categories', fetchCategories)
router.post('/products/add', authorizeUser, upload.single('image'), createProduct)
router.put('/products/:id/update', authorizeUser, updateProduct)
router.delete('/products/:id/delete', authorizeUser, removeProduct)

// user
import { loginUser,
  authorizeUser,
  fetchUser,
  registeringUser,
  changePassword
} from '../controllers/userController.js'

router.post('/login', loginUser)
router.post('/register', registeringUser)
router.post('/get_user', authorizeUser, fetchUser)
router.put('/user/change_password', authorizeUser, changePassword)

// order
import {
  fetchOrderbyUser,
  placeOrder
} from '../controllers/orderController.js'

router.post('/place-order', authorizeUser, placeOrder)
router.post('/get_order', authorizeUser, fetchOrderbyUser)

export default router
