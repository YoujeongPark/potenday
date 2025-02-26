import { Link } from "react-router-dom";
import { logo } from '../assets/images.js';

const Header = () => {
  return (
    <header id="header">
      <h1 className="logo">
        <Link to="/">
          <object data={String(logo)} type="image/svg+xml" aria-label="It Dictionary" />
        </Link>
      </h1>
    </header>
  );
};

export default Header;
