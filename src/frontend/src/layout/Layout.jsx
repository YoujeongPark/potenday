import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main id="main" role="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
