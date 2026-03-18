import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Welcome to QuizApp</h1>
        <p>Challenge yourself with fun and educational quizzes on a wide range of topics.</p>
        <Link to="/quizzes" className="btn-primary">
          Browse Quizzes
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
