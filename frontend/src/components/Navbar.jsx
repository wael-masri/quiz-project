import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🧠 QuizApp</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/quizzes" className={location.pathname.startsWith('/quizzes') ? 'active' : ''}>
            Quizzes
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
