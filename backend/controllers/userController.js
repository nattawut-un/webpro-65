import { authenticateUser, setLogin, getUser } from "../models/userModel.js"
import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import secret from '../config/auth.js'

const cookieLengthJWT = '2m' // for jwt
const cookieLengthExpress = () => new Date(+new Date() + 120 * 1000) // for express

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
      res.status(200).send({
        msg: "Logged in!",
        token,
        user: results[0].username,
      })
      console.log(results, 'Date:', new Date())
    }
  })
}

export const authorizeUser = (req, res, next) => {
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
  getUser(decoded.id, (err, results) => {
    if (err) {
      res.status(400).send(err)
      return
    } else {
      var token = jwt.sign(
        { id: results[0].id },
        secret["jwt-secret"],
        { expiresIn: cookieLengthJWT }
      )
      setLogin(results[0].id)

      res.cookie('jwt-token', token, { expires: cookieLengthExpress() })

      res.status(200).send({
        error: false,
        data: results[0],
        message: "Fetch Successfully.",
      })
      console.log(`User fetched: ${decoded.id}`)
    }
  })
}
