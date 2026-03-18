import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuizzes } from '../services/quizService';
import './QuizListPage.css';

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllQuizzes()
      .then((data) => setQuizzes(data))
      .catch(() => setError('Failed to load quizzes. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="status-msg">Loading quizzes...</div>;
  if (error) return <div className="status-msg error">{error}</div>;

  return (
    <div className="quiz-list-container">
      <h1>All Quizzes</h1>
      {quizzes.length === 0 ? (
        <p className="status-msg">No quizzes available.</p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <Link to={`/quizzes/${quiz.id}`} key={quiz.id} className="quiz-card">
              <h2>{quiz.title}</h2>
              <p>{quiz.description}</p>
              <span className="question-count">
                {quiz.questions?.length ?? 0} questions
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizListPage;
