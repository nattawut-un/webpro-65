import express from 'express'
const router = express.Router();

// products
import {
  showProducts,
  showProductById,
  createProduct,
  updateProduct
} from '../controllers/productController.js'

router.get('/products', showProducts)
router.get('/products/:id', showProductById)
router.post('/products/add', authorizeUser, createProduct)
router.put('/products/:id/update', authorizeUser, updateProduct)

// user
import { loginUser,
  authorizeUser,
  fetchUser,
  registeringUser
} from '../controllers/userController.js'

router.post('/login', loginUser)
router.post('/register', registeringUser)
router.post('/get-user', authorizeUser, fetchUser)

// order
import {
  fetchOrderbyUser,
  placeOrder
} from '../controllers/orderController.js'

router.post('/place-order', authorizeUser, placeOrder)
router.post('/get-order', authorizeUser, fetchOrderbyUser)

export default router
