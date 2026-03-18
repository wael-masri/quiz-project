const quizService = require('../services/quizService');

const getAllQuizzes = (req, res, next) => {
  try {
    const quizzes = quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};

const getQuizById = (req, res, next) => {
  try {
    const quiz = quizService.getQuizById(req.params.id);
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

const createQuiz = (req, res, next) => {
  try {
    const quiz = quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

const updateQuiz = (req, res, next) => {
  try {
    const quiz = quizService.updateQuiz(req.params.id, req.body);
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = (req, res, next) => {
  try {
    const deleted = quizService.deleteQuiz(req.params.id);
    if (!deleted) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
