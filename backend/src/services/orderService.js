let orders = [];
let nextId = 1;

const getAllOrders = () => orders;

const createOrder = ({ product, quantity, price, date }) => {
  const newOrder = {
    id: nextId++,
    product,
    quantity,
    price,
    date: date || new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
};

module.exports = { getAllOrders, createOrder };
