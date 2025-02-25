import { Link } from "react-router-dom";
import { book, home } from "../assets/images.js";

const Footer = () => {
  return (
    <footer id="footer">
      <nav>
        <h2 className="hide">네비게이션</h2>
        <Link to="/">
          <div className="icon">
            <object data={String(home)} type="image/svg+xml" />
          </div>
          HOME
        </Link>
        <Link to="/quiz" className="btn">
          AI<br />퀴즈봇
        </Link>
        <Link to="/search">
          <div className="icon">
            <object data={String(book)} type="image/svg+xml" />
          </div>
          DICTIONARY
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
