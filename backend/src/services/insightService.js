const RESTOCK_THRESHOLD = 10;

const getTopProducts = (orders) => {
  return orders.reduce((acc, order) => {
    acc[order.product] = (acc[order.product] || 0) + order.quantity;
    return acc;
  }, {});
};

const getBusiestHours = (orders) => {
  return orders.reduce((acc, order) => {
    const hour = new Date(order.date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
};

const getRecommendations = (topProducts) => {
  return Object.entries(topProducts)
    .filter(([, totalQty]) => totalQty > RESTOCK_THRESHOLD)
    .map(([product, totalQty]) => ({
      product,
      totalQuantitySold: totalQty,
      recommendation: 'needs restock',
    }));
};

const getSalesByDay = (orders) => {
  return orders.reduce((acc, order) => {
    const day = new Date(order.date).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + order.quantity;
    return acc;
  }, {});
};

const analyzeOrders = (orders) => {
  const topProducts = getTopProducts(orders);
  const busiestHours = getBusiestHours(orders);
  const recommendations = getRecommendations(topProducts);
  const salesByDay = getSalesByDay(orders);

  return { topProducts, busiestHours, recommendations, salesByDay };
};

module.exports = { analyzeOrders };
