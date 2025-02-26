import { Link } from 'react-router-dom';
import SearchBar from '../component/SearchBar';
import CategoryList from '../component/CategoryList';
import { character, game } from '../assets/images.js';

const MainPage = () => {
  return (
    <div className="main-page">
      <section className="main-visual">
        <h2 className="text-sb-11 text-white">
          <object data={String(character)} type="image/svg+xml" className="character" />
          요즘에는 이런말이?! <br />
          요즘 신조어 나는 얼마나 알고있을까?
        </h2>
        <Link to="/quiz" className="btn btn-outline-white text-white">
          <div className="icon">
            <object data={String(game)} type="image/svg+xml" aria-label="It Dictionary" />
          </div>
          신조어 AI 퀴즈 풀러가기
        </Link>
      </section>
      <div className="contents-wrap">
        <section className="main-search">
          <h2 className="text-sb-11">
            알고싶은 신조어를 검색하세요!
          </h2>
          <SearchBar />
        </section>
        <section className="main-category">
          <h2 className="text-sb-11">
            신조어 카테고리
          </h2>
          <CategoryList />
        </section>
      </div>
    </div>
  );
};

export default MainPage;
