import React, { useState } from 'react';

const SearchBar = () => {
  const [searchWord, setSearchWord] = useState('');

  // Submit 실행 시
  const searchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={searchSubmit}>
      <div className="search-bar">
        <input
          type="search"
          placeholder="검색어를 입력하세요."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
        <button type="submit" className="btn btn-search">검색</button>
      </div>
    </form>
  );
};

export default SearchBar;
