import { setLogin, getUserFromName, getUserFromID, getUserAddress, addUser, checkUser } from "../models/userModel.js"
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import secret from '../config/auth.js'
import bcrypt from 'bcryptjs'
import colors from 'colors'

const cookieLengthJWT = '1h' // for jwt
const cookieLengthExpress = () => new Date(+new Date() + (60 * 60) * 1000) // for express

const cookieOptions = {
  expires: cookieLengthExpress(),
  sameSite: 'None',
  secure: true,
}

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body
  const user = await getUserFromName(username)

  if (!user) {
    console.log(username + ': user not found')
    res.status(401).send(username + ': user not found')
    return
  }

  bcrypt.compare(
    password,
    user.password,
    (err, isMatch) => {
      if (isMatch) {
        const token = jwt.sign(
          { id: user.id },
          secret["jwt-secret"],
          { expiresIn: cookieLengthJWT }
        )

        setLogin(user.id)

        res.cookie('jwt-token', token, cookieOptions)
        res.cookie('username', username, cookieOptions)

        console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' User logged in '.bgGreen + ' id: ' + user.id)

        let data = {
          msg: "Logged in!",
          token,
          user: user.username,
        }
        res.status(200).send(data)
      } else {
        console.log(username + ': password wrong')
        res.status(401).send(username + ': password wrong')
      }
    }
  )
}

// check if user has access before fetch some data
export const authorizeUser = (req, res, next) => {
  // console.log(` req.cookies `.bgGray, req.cookies)
  if (
    !req.cookies['jwt-token']) {
    res.status(422).json({
      message: "Please provide the token",
    })
    console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' No token'.red.bold)
    return
  }
  var cookieToken = req.cookies['jwt-token']
  try {
    var decoded = jwt.verify(cookieToken, secret["jwt-secret"])
  } catch (err) {
    console.log(err)
    res.status(401).json({
      error: true,
      data: err,
      message: "Token is invalid."
    })
    return
  }
  var token = jwt.sign(
    {
      id: decoded.id,
    },
    secret["jwt-secret"],
    { expiresIn: cookieLengthJWT }
  )
  res.cookie('jwt-token', token, { expires: cookieLengthExpress() })
  setLogin(decoded.id)

  // console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' User authorized'.green.bold + ' id: ' + decoded.id)
  req.userID = decoded.id
  next()
}

export const fetchUser = async (req, res, next) => {
  const id = req.userID
  const user = await getUserFromID(id)
  const address = await getUserAddress(id)

  console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' User data fetched'.brightGreen.bold + ' id: ' + req.userID)
  res.status(200).send({
    data: user,
    address: address,
  })
}

export const registeringUser = async (req, res, next) => {
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
      console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' New user registered'.brightGreen.bold + ' id: ' + uuid)
      res.status(200).send({
        status: 'Register successfully.',
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
