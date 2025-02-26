import { useLocation } from 'react-router-dom';
import { useCategories } from '../context/categoryContext';
import SearchBar from '../component/SearchBar';
import SearchCategory from '../component/SearchCategory';
import WordList from '../component/WordList';
import {logo} from "../assets/images.js";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  const categories = useCategories();
  const matchCate = categories.find(item => item.id.toString() === categoryId);
  const matchCateIcon = matchCate?.icon ? matchCate.icon : "";
  const matchCateName = matchCate?.categoryName ? matchCate.categoryName : "";

  return (
    <div className="search-page">
      <section className="search-visual">
        <h2 className="title">오늘의 {matchCateName} 신조어!</h2>
        <dl className="today-word">
          <dt>"얼죽아"</dt>
          <dd>
            "얼어 죽어도 아이스" 의 줄임말로 날씨가 아무리 추워도 따뜻한 음료 대신
            차가운 음료를 선호하는 사람들을 뜻합니다.
          </dd>
        </dl>
        {matchCateIcon && (
          <div className="icon">
            <object data={matchCateIcon} type="image/svg+xml" />
          </div>
        )}
      </section>
      <div className="contents-wrap">
        <div className="search-bar-wrap">
          <SearchBar />
          <SearchCategory />
        </div>
        <div className="list-option-wrap">
          <h2>
            {matchCate?.categoryName || "전체"} <span>51</span>
          </h2>
          <button type="button">!</button>
        </div>
        <WordList />
      </div>
    </div>
  );
};

export default SearchPage;
