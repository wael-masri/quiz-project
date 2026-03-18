let orders = [];
let nextId = 1;

const getAllOrders = () => orders;

const getOrderById = (id) => {
  return orders.find((order) => order.id === parseInt(id, 10));
};

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

const updateOrder = (id, { product, quantity, price }) => {
  const order = getOrderById(id);
  if (!order) return null;

  if (product !== undefined) order.product = product;
  if (quantity !== undefined) order.quantity = quantity;
  if (price !== undefined) order.price = price;

  console.log(`[Order Service] Updated order #${id}`);
  return order;
};

const deleteOrder = (id) => {
  const index = orders.findIndex((order) => order.id === parseInt(id, 10));
  if (index === -1) return false;

  orders.splice(index, 1);
  console.log(`[Order Service] Deleted order #${id}`);
  return true;
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
