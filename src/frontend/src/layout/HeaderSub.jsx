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

  const isWordPage = location.pathname === "/word";
  const isSearchPage = location.pathname === "/search";
  const isQuizPage = location.pathname === "/quiz";

  // 뒤로가기 버튼 클릭 시
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header id="header" className={isSearchPage ? "sub-header" : isQuizPage ? "sub-header none" : "sub-header shadow"}>
      {!isQuizPage && (
        <button className="btn btn-back" onClick={handleBack}>
          <span className="hide">뒤로가기</span>
        </button>
      )}

      {isSearchPage ? (
        <Search />
      ) : isQuizPage ? (
        <>
          <span></span>
          <h1 className="text-xb-4">
            AI 퀴즈봇
          </h1>
          <button className="btn btn-close" onClick={handleBack}>
            <span className="hide">페이지 닫기</span>
          </button>
        </>
      ) : (
        <h1 className="text-xb-4">
          {category ? category.categoryName : "전체보기"}
        </h1>
      )}

      {!isQuizPage && (
        <Link to="/search" className="btn btn-search">
          <span className="hide">전체검색</span>
        </Link>
      )}
    </header>
  );
};

export default HeaderSub;
