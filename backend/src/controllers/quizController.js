const quizService = require('../services/quizService');
const createError = require('../utils/createError');

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
    if (!quiz) return next(createError('Quiz not found', 404));
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

const createQuiz = (req, res, next) => {
  try {
    const { title, description, questions } = req.body;
    if (!title || title.trim() === '') return next(createError('Field "title" is required', 400));
    if (!Array.isArray(questions) || questions.length === 0) return next(createError('Field "questions" must be a non-empty array', 400));
    const quiz = quizService.createQuiz({ title: title.trim(), description, questions });
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

const updateQuiz = (req, res, next) => {
  try {
    const quiz = quizService.updateQuiz(req.params.id, req.body);
    if (!quiz) return next(createError('Quiz not found', 404));
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = (req, res, next) => {
  try {
    const deleted = quizService.deleteQuiz(req.params.id);
    if (!deleted) return next(createError('Quiz not found', 404));
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
