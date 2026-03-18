let quizzes = [
  {
    id: '1',
    title: 'General Knowledge',
    description: 'Test your general knowledge',
    questions: [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        answer: 'Paris',
      },
      {
        id: 'q2',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        answer: '4',
      },
    ],
  },
];

const getAllQuizzes = () => quizzes;

const getQuizById = (id) => quizzes.find((q) => q.id === id) || null;

const createQuiz = (data) => {
  const newQuiz = { id: String(Date.now()), ...data };
  quizzes.push(newQuiz);
  return newQuiz;
};

const updateQuiz = (id, data) => {
  const index = quizzes.findIndex((q) => q.id === id);
  if (index === -1) return null;
  quizzes[index] = { ...quizzes[index], ...data };
  return quizzes[index];
};

const deleteQuiz = (id) => {
  const index = quizzes.findIndex((q) => q.id === id);
  if (index === -1) return false;
  quizzes.splice(index, 1);
  return true;
};

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
