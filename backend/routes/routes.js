import express from 'express'

import { showProducts, showProductById } from '../controllers/productController.js'
import { loginUser, authorizeUser, fetchUser, registeringUser } from '../controllers/userController.js'
import { fetchOrderbyUser, placeOrder } from '../controllers/orderController.js'

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("https://media.tenor.com/71bZdJOKqqgAAAAC/spideyvivi.gif")
});

router.get('/products', showProducts)
router.get('/products/:id', showProductById)

router.post('/login', loginUser)
router.post('/register', registeringUser)
router.post('/get-user', authorizeUser, fetchUser)

router.post('/place-order', authorizeUser, placeOrder)
router.post('/get-order', authorizeUser, fetchOrderbyUser)

export default router
