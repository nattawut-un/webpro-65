import express from 'express'

import { showProducts, showProductById } from '../controllers/productController.js'
import { loginUser, authorizeUser, registeringUser } from '../controllers/userController.js'

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("https://media.tenor.com/71bZdJOKqqgAAAAC/spideyvivi.gif")
});
router.get('/products', showProducts)
router.get('/products/:id', showProductById)
router.post('/login', loginUser)
router.post('/get-user', authorizeUser)
router.post('/register', registeringUser)

export default router
