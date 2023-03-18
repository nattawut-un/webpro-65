import { authenticateUser, setLogin, getUser } from "../models/userModel.js"
import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import secret from '../config/auth.js'

export const loginUser = (req, res, next) => {
  let { username, password } = req.body
  authenticateUser(username, password, (err, results) => {
    if (err) {
      res.status(401).send(err)
      console.log(err)
    } else {
      const token = jwt.sign(
        { id: results[0].id },
        secret["jwt-secret"],
        { expiresIn: '2m' }
      )
      setLogin(results[0].id)

      let expiresAt = new Date(+new Date() + 120 * 1000)

      res.cookie('jwt-token', token, { expires: expiresAt })
      res.cookie('username', username, { expires: expiresAt })
      res.status(200).send({
        msg: "Logged in!",
        token,
        user: results[0].username,
        expire: expiresAt
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
  var decoded = {}
  try {
    decoded = jwt.verify(theToken, secret["jwt-secret"])
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
      res.status(200).send({
        error: false,
        data: results[0],
        message: "Fetch Successfully.",
      })
    }
  })
}
