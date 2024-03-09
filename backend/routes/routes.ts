import express from 'express'
const router = express.Router();

import upload from '../config/multer'

import {
  showProducts, showProductById, createProduct, updateProduct,
  fetchCategories, removeProduct, addCategory, removeCategory
} from '../controllers/productController.ts'

import {
  loginUser, authorizeUser, authorizeAdmin, authorizeOwner,
  fetchUser, registeringUser, changePassword, addAddress,
  removeAddress, editUserInfo, addFavorite,
  removeFavorite, setMainAddress, fetchAllUsers,
  fetchUserFromID, addAdmin, removeAdmin, removeUser
} from '../controllers/userController.ts'

import {
  fetchOrderbyUser, placeOrder, fetchOrders, finishOrder,
  removeOrder
} from '../controllers/orderController.ts'

// products
router.get('/products', showProducts)                                                                       // get all products
router.get('/products/:id', showProductById)                                                                // get a prooduct by id
router.post('/products/add', authorizeUser, authorizeAdmin, upload.single('image'), createProduct)          //* add new product
router.put('/products/:id/update', authorizeUser, authorizeAdmin, updateProduct)                            //* update existing product
router.delete('/products/:id/delete', authorizeUser, authorizeAdmin, removeProduct)                         //* delete product

router.get('/categories', fetchCategories)                                                                  // get all categories
router.post('/categories/add', authorizeUser, authorizeAdmin, addCategory)                                  //* add new category
router.delete('/categories/:id/delete', authorizeUser, authorizeAdmin, removeCategory)                      //* add new category

// user
router.post('/login', loginUser)                                             // login
router.post('/register', registeringUser)                                    // register

router.get('/get_user', authorizeUser, fetchUser)                            //? get user self data
router.get('/get_all_users', authorizeUser, authorizeAdmin, fetchAllUsers)   //* get all user data

router.get('/user/:uid', authorizeUser, authorizeAdmin, fetchUserFromID)     //* get any user data from id
router.put('/user/change_password', authorizeUser, changePassword)           //? change password
router.put('/user/change_info', authorizeUser, editUserInfo)                 //? change user info
router.post('/user/address/add', authorizeUser, addAddress)                  //? add address
router.delete('/user/address/delete', authorizeUser, removeAddress)          //? delete address
router.put('/user/address/set_main', authorizeUser, setMainAddress)          //? set address to main
router.delete('/user/delete', authorizeUser, authorizeAdmin, removeUser)     //* delete user

router.put('/user/set_admin', authorizeUser, authorizeOwner, addAdmin)       //! add admin
router.put('/user/remove_admin', authorizeUser, authorizeOwner, removeAdmin) //! remove admin

router.post('/favs/add', authorizeUser, addFavorite)                         //? add favorite
router.delete('/favs/remove', authorizeUser, removeFavorite)                 //? remove favorite

// order
router.post('/place_order', authorizeUser, placeOrder)                                //? place new order
router.get('/get_order', authorizeUser, fetchOrderbyUser)                             //? get user's order

router.get('/orders', authorizeUser, authorizeAdmin, fetchOrders)                     //* get all orders
router.put('/orders/finish', authorizeUser, authorizeAdmin, finishOrder)              //* finish the order
router.delete('/orders/delete/:order_id', authorizeUser, authorizeAdmin, removeOrder) //* delete order

export default router
