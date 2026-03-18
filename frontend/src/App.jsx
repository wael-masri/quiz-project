import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuizListPage from './pages/QuizListPage';
import QuizDetailPage from './pages/QuizDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quizzes/:id" element={<QuizDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
