import { Link } from "react-router-dom";
import { back } from '../assets/images.js';

const HeaderSub = () => {
  return (
    <header id="header" className="sub-header">
      <Link to="/" className="icon">
        <object data={String(back)} type="image/svg+xml" aria-label="뒤로가기" />
      </Link>
      <h1 className="text-xb-4">전체보기</h1>
    </header>
  );
};

export default HeaderSub;
