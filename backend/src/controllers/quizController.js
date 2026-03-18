const quizService = require('../services/quizService');

const getAllQuizzes = (req, res) => {
  const quizzes = quizService.getAllQuizzes();
  res.json(quizzes);
};

const getQuizById = (req, res) => {
  const quiz = quizService.getQuizById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }
  res.json(quiz);
};

const createQuiz = (req, res) => {
  const quiz = quizService.createQuiz(req.body);
  res.status(201).json(quiz);
};

const updateQuiz = (req, res) => {
  const quiz = quizService.updateQuiz(req.params.id, req.body);
  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }
  res.json(quiz);
};

const deleteQuiz = (req, res) => {
  const deleted = quizService.deleteQuiz(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Quiz not found' });
  }
  res.json({ message: 'Quiz deleted successfully' });
};

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
