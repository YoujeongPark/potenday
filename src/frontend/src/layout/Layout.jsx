import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  return (
    <>
      <div className="page-transition">
        <Outlet />
      </div>
      {!isSearchPage && <Footer />}
    </>
  );
};

export default Layout;
