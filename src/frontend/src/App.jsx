import React, { Suspense, lazy } from 'react';
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

const App = () => {
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
