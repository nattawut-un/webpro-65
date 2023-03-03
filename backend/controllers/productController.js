import { getProducts, getProductById } from '../models/productModel.js'

export const showProducts = (req, res) => {
  getProducts((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
}

export const showProductById = (req, res) => {
  getProductById(req.params.id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
  });
}
