const express = require('express');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Quiz API is running' });
});

app.use('/api/quizzes', quizRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
