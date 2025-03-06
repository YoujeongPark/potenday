import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import CategoryList from '../component/CategoryList';
import ChatShortCut from '../component/ChatShortCut';
import { arrow, character, game } from '../assets/images.js';

const MainPage = () => {
  return (
    <div id="wrap" className="main-page">
      <Header />
      <main id="main" role="main">
        <section className="main-visual bg-gradient">
          <div className="inner">
            <h2 className="text-sb-11 text-white">
              <div className="icon icon-character">
                <img src={String(character)} alt="" />
              </div>
              요즘에는 이런말이?! <br />
              요즘 신조어 나는 얼마나 알고있을까?
            </h2>
            <Link to="/quiz" className="btn btn-outline-white text-white">
              <div className="icon">
                <object data={String(game)} type="image/svg+xml" aria-label="It Dictionary" />
              </div>
              신조어 AI 퀴즈 풀러가기
            </Link>
          </div>
        </section>
        <div className="contents-wrap">
          <section className="main-search">
            <h2 className="text-sb-11">
              알고싶은 신조어를 검색하세요!
            </h2>
            <Link to="/search" className="search-bar">
              <p>검색어를 입력하세요.</p>
              <div className="btn btn-search">
                <span className="hide">검색</span>
              </div>
            </Link>
          </section>
          <section className="main-category">
            <div className="d-flex justify-space-between align-items-center">
              <h2 className="text-sb-11">
                신조어 카테고리
              </h2>
              <Link to="/word" className="btn btn-text-sm">
                <span>전체보기</span>
                <object data={String(arrow)} type="image/svg+xml" />
              </Link>
            </div>
            <CategoryList />
          </section>
        </div>
        <ChatShortCut />
      </main>
    </div>
  );
};

export default MainPage;
