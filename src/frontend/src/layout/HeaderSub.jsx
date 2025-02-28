import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import Search from "../component/Search";

const HeaderSub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  const categories = useCategories();
  const category = categories.find((item) => String(item.id) === categoryId);

  // 현재 경로가 '/word'일 때만 카테고리명을 표시
  const isWordPage = location.pathname === "/word";
  const isSearchPage = location.pathname === "/search";

  // 뒤로가기 버튼 클릭 시
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header id="header" className={"sub-header" + (!isSearchPage ? " shadow" : "")}>
      <button className="btn btn-back" onClick={handleBack}>
        <span className="hide">뒤로가기</span>
      </button>

      {isWordPage ? (
        <h1 className="text-xb-4">
          {category ? category.categoryName : "전체보기"}
        </h1>
      ) : (
        <Search />
      )}

      <Link to="/search" className="btn btn-search">
        <span className="hide">전체검색</span>
      </Link>
    </header>
  );
};

export default HeaderSub;
