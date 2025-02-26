import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import HeaderSub from "./HeaderSub";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const renderHeader = location.pathname === "/search" ? <HeaderSub /> : <Header />;

  useEffect(() => {
    setIsFirstLoad(false); // 첫 로딩 이후 애니메이션 활성화
  }, []);

  return (
    <>
      {renderHeader}
      <main id="main" role="main">
        <motion.div
          key={location.pathname}
          initial={
            isFirstLoad ? false
              : location.pathname === "/"
                ? { opacity: 0 } // 홈 이동 시
                : { x: "100%", opacity: 0 } // 일반 페이지 이동 시
          }
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
