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

export const updateOrder = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
