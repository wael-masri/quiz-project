import axios from 'axios';

const BASE_URL = '/api/quizzes';

export const getAllQuizzes = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getQuizById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createQuiz = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateQuiz = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteQuiz = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
