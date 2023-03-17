import { check } from 'express-validator'

export const signupValidation = [
  check('name', 'Name is requied').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]

export const loginValidation = [
  check('username', 'Please include a valid username').isLength({ min: 5 }),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
