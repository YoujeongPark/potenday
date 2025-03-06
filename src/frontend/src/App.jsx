import React, { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CategoryProvider } from "./context/CategoryContext";
import { OverlayProvider, LoadingOverlay } from './context/OverlayProvider';
import ScrollToTop from "./context/ScrollToTop";
import IntroContainer from './component/IntroContainer';
import Footer from './layout/Footer';
import './scss/style.scss';

const MainPage = lazy(() => import('./pages/MainPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const WordPage = lazy(() => import('./pages/WordPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));

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

function vhHeight() {
  useEffect(() => {
    let lastWidth = window.innerWidth;

    setViewportHeight();

    // resize
    function handleResize() {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        setViewportHeight();
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const App = () => {
  vhHeight();

  return (
    <CategoryProvider>
      <Router>
        <OverlayProvider>
          <ScrollToTop />
          <LoadingOverlay />
          <AppRoutes />
        </OverlayProvider>
      </Router>
    </CategoryProvider>
  );
};

export default App;
