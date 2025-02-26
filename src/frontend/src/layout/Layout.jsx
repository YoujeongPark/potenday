import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <div className="page-transition">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
