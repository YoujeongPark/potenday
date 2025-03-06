import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CategoryProvider } from "./context/CategoryContext";
import ScrollToTop from "./context/ScrollToTop";
import IntroContainer from './component/IntroContainer';
import Footer from './layout/Footer';
import MainPage from './pages/MainPage';
import WordPage from './pages/WordPage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';
import './scss/style.scss';

const routes = [
  { path: "/", Component: MainPage },
  { path: "/search", Component: SearchPage },
  { path: "/word", Component: WordPage },
  { path: "/quiz", Component: QuizPage }
];

const AppRoutes = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const isQuizPage = location.pathname === "/quiz";

  return (
    <>
      <IntroContainer />
      <div className="page-wrapper">
        <Routes location={location}>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
      {!isSearchPage && !isQuizPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <CategoryProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </CategoryProvider>
  );
};

export default App;
