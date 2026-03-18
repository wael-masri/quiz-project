const express = require('express');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');
const orderRoutes = require('./routes/orderRoutes');
const insightRoutes = require('./routes/insightRoutes');
const { notFound, errorHandler } = require('./utils/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Quiz API is running' });
});

app.use('/api/quizzes', quizRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/insights', insightRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
