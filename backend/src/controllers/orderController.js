const orderService = require('../services/orderService');
const createError = require('../utils/createError');

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

    if (!product || product.trim() === '') return next(createError('Field "product" is required', 400));
    if (quantity === undefined || quantity === null) return next(createError('Field "quantity" is required', 400));
    if (typeof quantity !== 'number' || quantity <= 0) return next(createError('"quantity" must be a positive number', 400));
    if (price === undefined || price === null) return next(createError('Field "price" is required', 400));
    if (typeof price !== 'number' || price < 0) return next(createError('"price" must be a non-negative number', 400));

    const order = orderService.createOrder({ product: product.trim(), quantity, price, date });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const updateOrder = (req, res, next) => {
  try {
    const { id } = req.params;
    const { product, quantity, price } = req.body;

    if (product !== undefined && (!product || product.trim() === '')) {
      return next(createError('Field "product" cannot be empty', 400));
    }
    if (quantity !== undefined && (typeof quantity !== 'number' || quantity <= 0)) {
      return next(createError('"quantity" must be a positive number', 400));
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return next(createError('"price" must be a non-negative number', 400));
    }

    const updatedOrder = orderService.updateOrder(id, {
      product: product ? product.trim() : undefined,
      quantity,
      price,
    });

    if (!updatedOrder) return next(createError('Order not found', 404));
    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = orderService.deleteOrder(id);
    if (!deleted) return next(createError('Order not found', 404));
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllOrders, createOrder, updateOrder, deleteOrder };
