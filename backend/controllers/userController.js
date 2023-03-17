import { checkUser } from "../models/userModel.js"
import { v4 } from 'uuid'

export const loginUser = (req, res, next) => {
  let { username, password } = req.body
  checkUser(username, password, (err, results) => {
    if (err) {
      res.status(401).send(err)
      console.log(err)
    } else {
      res.json(results)
      console.log(results)
    }
  })
}
