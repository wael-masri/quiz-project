const orderService = require('../services/orderService');

const getAllOrders = (req, res, next) => {
  try {
    const orders = orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const createOrder = (req, res, next) => {
  try {
    const { product, quantity, price, date } = req.body;

    if (!product || product.trim() === '') {
      const error = new Error('Field "product" is required');
      error.statusCode = 400;
      return next(error);
    }
    if (quantity === undefined || quantity === null) {
      const error = new Error('Field "quantity" is required');
      error.statusCode = 400;
      return next(error);
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      const error = new Error('"quantity" must be a positive number');
      error.statusCode = 400;
      return next(error);
    }
    if (price === undefined || price === null) {
      const error = new Error('Field "price" is required');
      error.statusCode = 400;
      return next(error);
    }
    if (typeof price !== 'number' || price < 0) {
      const error = new Error('"price" must be a non-negative number');
      error.statusCode = 400;
      return next(error);
    }

    const order = orderService.createOrder({ product: product.trim(), quantity, price, date });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllOrders, createOrder };
