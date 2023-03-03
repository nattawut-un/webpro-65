import { getUsers, checkUser } from "../models/userModel.js";

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
  checkUser(req.params.id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
  });
}

