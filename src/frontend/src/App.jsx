import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CategoryProvider } from "./context/CategoryContext.jsx";
import Layout from './layout/Layout';
import MainPage from './pages/Mainpage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';
import './scss/style.scss';

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/findSlangs')
      .then(response => response.json())
      .then(message => {
        console.log("message> ?", message)
        setMessage(message);
      });
  }, []);

  return (
    <CategoryProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="quiz" element={<QuizPage />} />
          </Route>
        </Routes>
      </Router>
    </CategoryProvider>
  );
};

export default App
