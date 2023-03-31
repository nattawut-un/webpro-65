import { authenticateUser, setLogin, getUser, getUserAddress, addUser, checkUser } from "../models/userModel.js"
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import secret from '../config/auth.js'
import bcrypt from 'bcryptjs'

const cookieLengthJWT = '1h' // for jwt
const cookieLengthExpress = () => new Date(+new Date() + (60 * 60) * 1000) // for express

export const loginUser = (req, res, next) => {
  let { username, password } = req.body
  authenticateUser(username, password, (err, results) => {
    if (err) {
      res.status(401).send(err)
      console.log(err)
    } else {
      var token = jwt.sign(
        { id: results[0].id },
        secret["jwt-secret"],
        { expiresIn: cookieLengthJWT }
      )
      setLogin(results[0].id)

      res.cookie('jwt-token', token, { expires: cookieLengthExpress() })
      res.cookie('username', username)

      console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' User logged in '.bgGreen + ' id: ' + results[0].id)
      console.log(results)

      res.status(200).send({
        msg: "Logged in!",
        token,
        user: results[0].username,
      })
    }
  })
}

// check if user has access before fetch some data
export const authorizeUser = (req, res, next) => {
  console.log(req.cookies)
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    res.status(422).json({
      message: "Please provide the token",
    })
    return
  }
  var theToken = req.headers.authorization.split(" ")[1]
  try {
    var decoded = jwt.verify(theToken, secret["jwt-secret"])
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

  console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' User authorized '.bgGreen + ' id: ' + decoded.id)
  req.userID = decoded.id
  next()
}

export const fetchUser = (req, res, next) => {
  getUser(req.userID, (err, results) => {
    if (err) {
      res.status(400).send(err)
      return
    } else {
      setLogin(results[0].id)
      getUserAddress(results[0].id, (err, resultsAddr) => {
        if (err) {
          res.status(400).send(err)
          return
        } else {
          res.status(200).send({
            error: false,
            data: results[0],
            address: resultsAddr,
            message: "Fetch Successfully.",
          })
          console.log(` ${new Date().toLocaleTimeString()} `.bgBlue + ' User fetched '.bgBrightGreen + ' id: ' + req.userID)
        }
      })
    }
  })
}

export const registeringUser = (req, res, next) => {
  let { username, password, email } = req.body
  checkUser(username, email, (err, results) => {
    if (err) {
      res.status(400).send(err)
    } else if (results.length) {
      if (results[0].username == username) {
        res.status(409).send(`Username "${username}" has already taken,`)
      } else if (results[0].email == email) {
        res.status(409).send(`Email "${email}" has already taken,`)
      }
    } else {
      bcrypt.hash(password, secret['salt-rounds'])
      .then(hash => {
        // console.log('hash: ', hash)
        // res.json({ hash: hash })
        let uuid = uuidv4()
        addUser(uuid, username, email, hash)
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
  })
}
