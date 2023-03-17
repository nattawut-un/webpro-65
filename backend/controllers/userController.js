import { getUsers, checkUser, addUser } from "../models/userModel.js"
import { v4 } from 'uuid'

const time = () => {
  let now = new Date()
  return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
}

const sessions = {}
console.log(sessions)

export const showAllUsers = (req, res) => {
  getUsers((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
}

export const authenticateUser = (req, res) => {
  let { username, password } = req.body
  checkUser(username, password, (err, results) => {
    console.log(time() + ' >> User logging in: username=' + username + ', password=' + password)
    if (err) {
      res.send(err);
    } else {
      console.log('authenticateUser => ' + results[0].auth)
      if (results[0].username == username && results[0].password == password) {
        // something
        let sessionToken = v4()
        console.log('sessionToken = ' + sessionToken)

        let expiresAt  = new Date(+new Date() + 60 * 1000)
        let cookie = [username, expiresAt]
        console.log('cookie => ' + cookie)

        sessions[sessionToken] = cookie
        res.cookie('session_token', sessionToken, { expires: expiresAt })
        res.cookie('username', username, { expires: expiresAt })
        console.log('sessions length = ' + Object.values(sessions).length)
        console.log()

      }
      res.json(results)
    }
  });
}

export const registingUser = (req, res) => {
  let { username, password } = req.body
  addUser(username, password, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
}

