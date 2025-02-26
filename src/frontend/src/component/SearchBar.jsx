import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ URL에서 query 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const [searchWord, setSearchWord] = useState(query);

  useEffect(() => {
    setSearchWord(query);
  }, [query]);

  // ✅ Submit 실행 시
  const searchSubmit = (e) => {
    e.preventDefault();
    if (searchWord.trim()) {
      queryParams.set('query', searchWord);
      navigate('/search?' + queryParams.toString());
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={searchSubmit}>
        <div className="input-group">
          <input
            type="search"
            placeholder="검색어를 입력하세요."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <button type="submit" className="btn btn-search">검색</button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
