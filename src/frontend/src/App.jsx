import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { CategoryProvider } from "./context/CategoryContext";
import ScrollToTop from "./context/ScrollToTop";
import Footer from './layout/Footer';
import MainPage from './pages/MainPage';
import WordPage from './pages/WordPage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';
import './scss/style.scss';

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isBackNavigation = navigationType === 'POP';
  const isMainPage = location.pathname === "/";
  const isSearchPage = location.pathname === "/search";

  // 애니메이션 설정
  const pageVariants = isMainPage
    ? {
      initial: { x: 0 },
      animate: { x: 0 },
      exit: { x: 0 }
    } : {
      initial: { x: isBackNavigation ? '-100%' : '100%', zIndex: 1 },
      animate: { x: 0, zIndex: 1, transition: { duration: 0.3 } },
      exit: { zIndex: 0, transition: { duration: 0 } },
    };

  return (
    <>
      <div className="routes-wrapper">
        <AnimatePresence initial={false}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <motion.div key={location.pathname} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="page-container">
                  <MainPage />
                </motion.div>
              }
            />
            <Route
              path="search"
              element={
                <motion.div key={location.pathname} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="page-container">
                  <SearchPage />
                </motion.div>
              }
            />
            <Route
              path="word"
              element={
                <motion.div key={location.pathname} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="page-container">
                  <WordPage />
                </motion.div>
              }
            />
            <Route
              path="quiz"
              element={
                <motion.div key={location.pathname} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="page-container">
                  <QuizPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      {!isSearchPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <CategoryProvider>
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </CategoryProvider>
  );
};

export default App;
