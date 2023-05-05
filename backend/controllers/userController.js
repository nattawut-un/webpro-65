import {
  setLogin, getUserFromName, getUserFromID, getUserAddress,
  addUser, checkUser, updateUser, insertAddress, deleteAddress,
  insertUserFavs, deleteFromFavs, updateAddressMain
} from "../models/userModel.js"
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import secret from '../config/auth.js'
import bcrypt from 'bcryptjs'
import colors from 'colors'
import Joi from 'joi'


const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const registerValidator = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(6).alphanum().required(),
  email: Joi.string().email(),
})

export const loginUser = async (req, res, next) => {
  // validation
  try {
    await loginValidator.validateAsync(req.body)
  } catch {
    return res.status(401).send({
      msg: 'Please input username and password.'
    })
  }

  const { username, password } = req.body
  const user = await getUserFromName(username)

  // username is not found
  if (!user) {
    console.log(username + ': user not found')
    return res.status(401).send({
      msg: 'Incorrect credentials are provided.'
    })
  }

  // wrong password
  if(!(await bcrypt.compare(password, user.password))) {
    console.log(username + ': password wrong')
    return res.status(401).send({
      msg: 'Incorrect credentials are provided.'
    })
  }

  // everything is right
  const token = jwt.sign(
    { id: user.id },
    secret["jwt-secret"],
  )

  setLogin(user.id)
  console.log('username: ' + user.username)

  return res.send({
    msg: "Logged in!",
    token,
    user: user.username,
  })
}

export const authorizeUser = async (req, res, next) => {
  let authorization = req.headers.authorization

  if (!authorization) {
    return res.status(403).send('You are not logged in')
  }

  let [part1, part2] = authorization.split(' ')
  if (part1 !== 'Bearer' || !part2) {
    return res.status(403).send('You are not logged in')
  }

  try {
    var decoded = jwt.verify(part2, secret["jwt-secret"])
    var thisUser = await getUserFromID(decoded.id)
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      error: true,
      data: err,
      message: "Token is invalid."
    })
  }

  setLogin(decoded.id)
  req.user = thisUser
  next()
}

export const authorizeAdmin = async (req, res, next) => {
  if (req.user.is_admin === 1) {
    return next()
  }

  return res.status(401).send({
    msg: 'Unauthorized: You are not an admin.'
  })
}

export const fetchUser = async (req, res, next) => {
  const id = req.user.id
  const user = await getUserFromID(id)
  const address = await getUserAddress(id)

  res.status(200).send({
    data: user,
    address: address,
  })
}

export const registeringUser = async (req, res, next) => {
  try {
    await registerValidator.validateAsync(req.body)
  } catch (err) {
    return res.status(400).send(err)
  }

  let { username, password, email } = req.body
  const user = await checkUser(username, email)

  if (user.length) {
    if (results[0].username == username) {
      res.status(409).send(`Username "${username}" has already taken,`)
    } else if (results[0].email == email) {
      res.status(409).send(`Email "${email}" has already taken,`)
    }
  } else {
    bcrypt.hash(password, secret['salt-rounds'])
    .then(hash => {
      let uuid = uuidv4()
      addUser(uuid, username, email, hash)
      // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' New user registered'.brightGreen.bold + ' id: ' + uuid)
      res.status(200).send({
        msg: 'Register successfully.',
        user: {
          id: uuid,
          username: username,
          email: email
        }
      })
    }).catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
  }
}

export const changePassword = async (req, res, next) => {
  const { id, oldPassword, newPassword } = req.body
  const user = await getUserFromID(id)
  const currentPassword = user.password

  // console.log(id, currentPassword, oldPassword, newPassword)

  // bcrypt.compare(oldPassword, currentPassword,
  // (err, isMatch) => {
  //   if (isMatch) {
  //     // updateUser(req.body.id, { password: newPassword }, 'password')
  //     bcrypt.hash(newPassword, secret['salt-rounds'])
  //     .then(hash => {
  //       updateUser(id, { password: hash }, 'password')
  //       console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Password changed'.brightGreen.bold + ' user: ' + user.username)
  //       return res.send({
  //         msg: 'Password changed.',
  //         id: id
  //       })
  //     }).catch(err => {
  //       console.log(err)
  //       return res.status(500).send(err)
  //     })
  //   } else {
  //     console.log('Wrong password:', err)
  //     return res.status(401).send({
  //       msg: 'Password wrong.',
  //       id: req.body.id
  //     })
  //   }
  // })

  if((!(await bcrypt.compare(oldPassword, currentPassword)))) {
    console.log('Wrong password:')
    return res.status(401).send({
      msg: 'Password wrong.',
      id: req.body.id
    })
  }

  bcrypt.hash(newPassword, secret['salt-rounds'])
  .then(hash => {
    console.log(hash)
    updateUser(id, { password: hash }, 'password')
    // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' Password changed'.brightGreen.bold + ' user: ' + user.username)
    return res.send({
      msg: 'Password changed.',
      id: id
    })
  }).catch(err => {
    console.log(err)
    return res.status(500).send(err)
  })
}

export const addAddress = async (req, res, next) => {
  const user_id = req.user.id
  const address = req.body.address

  try {
    const result = await insertAddress(user_id, address)
    return res.send({
      msg: 'Address is added.',
      username: req.user.username,
      address: address
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const removeAddress = async (req, res, next) => {
  const { address_id } = req.body

  try {
    const result = await deleteAddress(address_id)
    return res.send({
      msg: 'Address is deleted.',
      username: req.user.username,
      address_id: address_id
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const editUserInfo = async (req, res, next) => {
  try {
    await updateUser(req.user.id, req.body)
    return res.send({
      msg: 'Updated user info',
      user_id: req.user.id,
      username: req.user.username
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const addFavorite = async (req, res, next) => {
  try {
    await insertUserFavs(req.user.id, req.body.prod_id)
    return res.send({
      msg: 'Favorite added.',
      user_id: req.user.id,
      prod_id: req.body.prod_id
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const removeFavorite = async (req, res, next) => {
  try {
    console.log(req.body)
    console.log('delete', req.user.id, req.body.prod_id)
    await deleteFromFavs(req.user.id, req.body.prod_id)
    return res.send({
      msg: 'Favorite added.',
      user_id: req.user.id,
      prod_id: req.body.prod_id
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const setMainAddress = async (req, res, next) => {
  try {
    console.log('main', req.user.id, req.body.address_id)
    await updateAddressMain(req.user.id, req.body.address_id)
    return res.send({
      msg: 'Main address set.',
      user_id: req.user.id,
      address_id: req.body.address_id
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
