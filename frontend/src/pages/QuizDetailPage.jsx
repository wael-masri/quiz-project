import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuizById } from '../services/quizService';
import './QuizDetailPage.css';

function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    getQuizById(id)
      .then((data) => setQuiz(data))
      .catch(() => setError('Quiz not found or backend is unavailable.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (questionId, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (loading) return <div className="status-msg">Loading quiz...</div>;
  if (error) return <div className="status-msg error">{error}</div>;

  return (
    <div className="quiz-detail-container">
      <Link to="/quizzes" className="back-link">← Back to Quizzes</Link>
      <h1>{quiz.title}</h1>
      <p className="quiz-description">{quiz.description}</p>

      <div className="questions">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <p className="question-text">
              {idx + 1}. {q.text}
            </p>
            <ul className="options">
              {q.options.map((opt) => {
                let cls = 'option';
                if (submitted) {
                  if (opt === q.answer) cls += ' correct';
                  else if (answers[q.id] === opt) cls += ' wrong';
                } else if (answers[q.id] === opt) {
                  cls += ' selected';
                }
                return (
                  <li
                    key={opt}
                    className={cls}
                    onClick={() => handleSelect(q.id, opt)}
                  >
                    {opt}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < quiz.questions.length}
        >
          Submit Answers
        </button>
      ) : (
        <div className="result">
          <p>
            You scored <strong>{score}</strong> / {quiz.questions.length}
          </p>
          <button className="btn-submit" onClick={handleReset}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizDetailPage;
