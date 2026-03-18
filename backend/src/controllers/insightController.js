const { getAllOrders } = require('../services/orderService');
const { analyzeOrders } = require('../services/insightService');

const getInsights = (req, res, next) => {
  try {
    const orders = getAllOrders();
    const insights = analyzeOrders(orders);
    res.json(insights);
  } catch (err) {
    next(err);
  }
};

module.exports = { getInsights };
