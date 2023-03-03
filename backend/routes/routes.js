import express from 'express'
import { showProducts, showProductById } from '../controllers/productController.js'
import { showAllUsers } from '../controllers/userController.js'

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello! Node.js");
});
router.get('/products', showProducts)
router.get('/products/:id', showProductById)
router.get('/users', showAllUsers)

export default router
