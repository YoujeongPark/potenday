import './scss/style.scss';
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import MainPage from './pages/Mainpage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';

const App = () => {
  const [count, setCount] = useState(0)
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
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="quiz" element={<QuizPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App
