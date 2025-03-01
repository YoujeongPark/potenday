import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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
  const [transitionDirection, setTransitionDirection] = useState('next');
  const nodeRefs = useRef({});
  const [historyIndex, setHistoryIndex] = useState(window.history.state?.idx || 0);
  const isSearchPage = location.pathname === "/search";
  const isQuizPage = location.pathname === "/quiz";

  useEffect(() => {
    const newIndex = window.history.state?.idx || 0;
    setTransitionDirection(newIndex > historyIndex ? 'next' : 'prev');
    setHistoryIndex(newIndex);
  }, [location.pathname]);

  if (!nodeRefs.current[location.pathname]) {
    nodeRefs.current[location.pathname] = React.createRef();
  }

  return (
    <>
      <IntroContainer />
      <TransitionGroup className={"page-wrapper " + transitionDirection}>
        {routes.map(({ path, Component }) =>
            location.pathname === path && (
              <CSSTransition
                key={path}
                nodeRef={nodeRefs.current[path]}
                timeout={300}
                unmountOnExit
              >
                <div ref={nodeRefs.current[path]} className="page">
                  <Component />
                </div>
              </CSSTransition>
            )
        )}
      </TransitionGroup>
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
