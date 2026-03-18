import axios from 'axios';

const BASE_URL = '/api/orders';

export const getAllOrders = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createOrder = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};
