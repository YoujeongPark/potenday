import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const wordParam = searchParams.get("word") || "";
  const [searchWord, setSearchWord] = useState(wordParam);
  const [showClear, setShowClear] = useState(wordParam.length > 0); // 초기값

  // URL 변경 시 input 값 업데이트
  useEffect(function () {
    setSearchWord(wordParam);
    setShowClear(wordParam.length > 0);
  }, [wordParam]);

  // 검색 실행
  const handleSearchSubmit = function (e) {
    e.preventDefault();
    let trimmedWord = searchWord.trim();
    navigate(
      trimmedWord.length > 0 ? "/search?word=" + encodeURIComponent(trimmedWord) : "/search",
      {replace: true} // 히스토리 안 남게
    )
  };

  // clear 버튼 노출 여부
  const handleChange = function (e) {
    let value = e.target.value;
    setSearchWord(value);
    setShowClear(value.length > 0);
  };

  // clear 클릭 시
  const handleClear = function () {
    setSearchWord("");
    setShowClear(false);
  };

  return (
    <div className="search">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="search"
          placeholder="검색어를 입력하세요."
          value={searchWord}
          onChange={handleChange}
        />
        {showClear ? (
          <button type="button" className="btn btn-clear" onClick={handleClear}>
            <span className="hide">지우기</span>
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default Search;
