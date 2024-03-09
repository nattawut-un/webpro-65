import {
  setLogin,
  getUserFromName,
  getUserFromID,
  getUserAddress,
  addUser,
  checkUser,
  updateUser,
  insertAddress,
  deleteAddress,
  insertUserFavs,
  deleteFromFavs,
  updateAddressMain,
  getAllUsers,
  setAdmin,
  deleteAdmin,
  deleteUser,
} from '../models/userModel'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import secret from '../config/auth'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const registerSchema = Joi.object({
  username: Joi.string().min(5).max(30).required(),
  password: Joi.string().min(6).alphanum().required(),
  first_name: Joi.string().min(3).max(100).required(),
  last_name: Joi.string().min(3).max(100).required(),
  phone: Joi.string()
    .length(10)
    .required()
    .pattern(/^0[0-9]{9}$/),
  email: Joi.string().email(),
  address: Joi.string().min(10),
})

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // validation
  try {
    await loginSchema.validateAsync(req.body)
  } catch {
    return res.status(401).send({
      msg: 'Please input username and password.',
    })
  }

  const { username, password } = req.body
  const user = await getUserFromName(username)

  // username is not found
  if (!user) {
    console.log(username + ': user not found')
    return res.status(401).send({
      msg: 'Incorrect credentials are provided.',
    })
  }

  // wrong password
  if (!(await bcrypt.compare(password, user.password))) {
    console.log(username + ': password wrong')
    return res.status(401).send({
      msg: 'Incorrect credentials are provided.',
    })
  }

  // everything is right
  const token = jwt.sign({ id: user.id }, secret['jwt-secret'])

  setLogin(user.id)
  console.log('username: ' + user.username)

  return res.send({
    msg: 'Logged in!',
    token,
    user: user.username,
  })
}

export const authorizeUser = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  let authorization = req.headers.authorization

  if (!authorization) {
    return res.status(403).send('You are not logged in')
  }

  let [part1, part2] = authorization.split(' ')
  if (part1 !== 'Bearer' || !part2) {
    return res.status(403).send('You are not logged in')
  }

  try {
    var decoded = jwt.verify(part2, secret['jwt-secret'])
    // @ts-ignore
    var thisUser = await getUserFromID(decoded.id)
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      error: true,
      data: err,
      message: 'Token is invalid.',
    })
  }

  // @ts-ignore
  await setLogin(decoded.id)
  req.user = thisUser
  next()
}

export const authorizeAdmin = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (req.user.isAdmin >= 0) {
    return next()
  }

  return res.status(401).send({
    msg: 'Unauthorized: You are not an admin.',
  })
}

export const authorizeOwner = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (req.user.is_admin === 2) {
    return next()
  }

  return res.status(401).send({
    msg: 'Unauthorized: You are not an owner.',
  })
}

export const fetchUser = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const id = req.user.id
  const user = await getUserFromID(id)
  const address = await getUserAddress(id)

  res.status(200).send({
    data: user,
    address: address,
  })
}

export const fetchUserFromID = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.uid
  const user = await getUserFromID(id)
  const address = await getUserAddress(id)

  res.status(200).send({
    data: user,
    address: address,
  })
}

export const fetchAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await getAllUsers()
  console.log('Total users: ' + users.length)
  res.status(200).send(users)
}

export const registeringUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await registerSchema.validateAsync(req.body)
  } catch (err) {
    console.log(err)
    return res.status(400).send(err)
  }

  let { username, password, email, phone, address, first_name, last_name } =
    req.body
  const user = await checkUser(username, email)

  console.log(user)
  if (user.length) {
    if (user[0].username == username) {
      return res.status(409).send(`Username "${username}" has already taken,`)
    } else if (user[0].email == email) {
      return res.status(409).send(`Email "${email}" has already taken,`)
    }
  } else {
    bcrypt
      .hash(password, secret['salt-rounds'])
      .then(async (hash: string) => {
        let uuid = uuidv4()

        const user_data = {
          id: uuid,
          username,
          password: hash,
          email,
          phone,
          firstName: first_name,
          lastName: last_name,
        }

        await addUser(user_data)
        await insertAddress(uuid, address)

        return res.status(200).send({
          msg: 'Register successfully.',
          user: {
            id: uuid,
            username: username,
            email: email,
          },
        })
      })
      .catch((err: Error) => {
        console.log(err)
        return res.status(500).send(err)
      })
  }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { id, oldPassword, newPassword } = req.body
  const user = await getUserFromID(id)

  if (!user) {
    return res.status(40).send({
      msg: 'User is not found.',
      id: req.body.id
    })
  }

  const currentPassword = user.password

  if((!(await bcrypt.compare(oldPassword, currentPassword)))) {
    console.log('Wrong password:')
    return res.status(401).send({
      msg: 'Password wrong.',
      id: req.body.id
    })
  }

  bcrypt.hash(newPassword, secret['salt-rounds'])
  .then((hash: string) => {
    console.log(hash)
    updateUser(id, { password: hash }, 'password')
    return res.send({
      msg: 'Password changed.',
      id: id
    })
  }).catch((err: Error) => {
    console.log(err)
    return res.status(500).send(err)
  })
}

export const addAddress = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const user_id = req.user.id
  const address = req.body.address

  if (!user_id) {
    return res.status(400).send({
      msg: 'No user_id'
    })
  }
  if (!address) {
    return res.status(400).send({
      msg: 'No address'
    })
  }
  if (address.length < 20) {
    return res.status(400).send({
      msg: 'Address is shorter than 20'
    })
  }

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

export const removeAddress = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
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

export const editUserInfo = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const check = await checkUser(req.body.username, req.body.email)

    // user id and user from token isn't the same
    if (req.user.id !== req.body.id) {
      return res.status(401).send({
        msg: 'You are unauthorized.',
        msg_th: 'คุณไม่สามรถแก้ไข',
      })
    }

    // check if 1) email is duplicate 2) user is duplicate (using same username but different id)
    for (let i=0; i<check.length; i++) {
      if ((check[i].email === req.body.email || check[i].username === req.body.username)
        && req.user.id != check[i].id
      ) {
        return res.status(401).send({
          msg: 'Username/email is already used.',
          msg_th: 'มีผู้ใช้ชื่อผู้ใช้ หรืออีเมลนี้ไปแล้ว',
        })
      }
    }

    await updateUser(req.user.id, req.body, null)
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

export const addFavorite = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
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

export const removeFavorite = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
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

export const setMainAddress = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
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

export const addAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await setAdmin(req.body.uid)
    return res.send({
      msg: 'Added admin.',
      user_id: req.params.uid
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const removeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteAdmin(req.body.uid)
    return res.send({
      msg: 'Removed admin.',
      user_id: req.params.uid
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.uid)
  try {
    await deleteUser(req.body.uid)
    return res.send({
      msg: 'Removed user.',
      user_id: req.params.uid
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
