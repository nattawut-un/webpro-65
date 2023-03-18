import express from 'express'

import { showProducts, showProductById } from '../controllers/productController.js'
import { loginUser, authorizeUser } from '../controllers/userController.js'
import { loginValidation } from '../validation/validation.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
});
router.get('/products', showProducts)
router.get('/products/:id', showProductById)
router.post('/login', loginValidation, loginUser)
router.post('/get-user', loginValidation, authorizeUser)

export default router
