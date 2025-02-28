import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CategoryProvider } from "./context/CategoryContext";
import Layout from './layout/Layout';
import MainPage from './pages/MainPage';
import WordPage from './pages/WordPage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';
import './scss/style.scss';

const App = () => {
  return (
    <CategoryProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="word" element={<WordPage />} />
            <Route path="quiz" element={<QuizPage />} />
          </Route>
        </Routes>
      </Router>
    </CategoryProvider>
  );
};

export default App
