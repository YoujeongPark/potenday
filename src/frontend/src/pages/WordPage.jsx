import HeaderSub from "../layout/HeaderSub";
import CategoryTab from "../component/CategoryTab";
import Tooltip from "../component/Tooltip";
import WordList from '../component/WordList';

const WordPage = () => {
  return (
    <div id="wrap" className="word-page">
      <HeaderSub />
      <main id="main" role="main">
        <section className="word-visual bg-gradient">
          <div className="inner">
            <h2 className="text-s-4">오늘의 신조어!</h2>
            <dl>
              <dt><span className="text-sb-8">단어명</span></dt>
              <dd className="text-r-4">
                단어뜻
              </dd>
            </dl>
            <div className="icon">
              아이콘 영역
              {/*<object data="" type="image/svg+xml" />*/}
            </div>
          </div>
        </section>
        <div className="contents-wrap">
          <CategoryTab />
          <section className="word-list-wrap">
            <div className="word-title-wrap">
              <h2 className="text-sb-6">
                카테고리명
                <span className="text-xr-8 text-blue">51</span>
              </h2>
              <Tooltip />
            </div>
            <WordList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default WordPage;
