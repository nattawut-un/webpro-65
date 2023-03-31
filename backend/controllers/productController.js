import { getProducts, getProductById } from '../models/productModel.js'

export const showProducts = (req, res) => {
  getProducts((err, results) => {
    if (err) {
      console.log('Fetched product list.')
      res.send(err);
    } else {
      console.log('GET /products')
      res.json(results);
    }
  });
}

export const showProductById = (req, res) => {
  getProductById(req.params.id, (err, results) => {
    if (err) {
      console.log('Fetched product detail: ' + req.params.id)
      res.send(err);
    } else {
      res.json(results);
    }
  });
}
