import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import HeaderSub from "../layout/HeaderSub";
import SearchBar from '../component/SearchBar';
import WordList from '../component/WordList';
import {searchCategory, check, tooltip, logo} from "../assets/images.js";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || ""; // 검색어
  const categoryId = queryParams.get("category"); // 카테고리 ID
  const categories = useCategories();

  // 랜덤 카테고리 ID 만들기
  const [randomCategoryId, setRandomCategoryId] = useState(null);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setRandomCategoryId(randomCategory.id);
    }
  }, [categoryId, categories]);

  // search-visual용 카테고리 ID 설정
  const visualCategoryId = categoryId || randomCategoryId || "";
  const visualCate = categories.find(item => item.id.toString() === visualCategoryId.toString());
  const visualCateIcon = visualCate?.icon || "";
  const visualCateName = visualCate?.categoryName || "전체";

  // 카테고리 ID 설정
  const finalCategoryId = categoryId || "";
  const matchCate = categories.find(item => item.id.toString() === finalCategoryId.toString());
  const matchCateName = matchCate?.categoryName || "전체";

  // 카테고리 선택 모달
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = (e) => {
    if (e.target.classList.contains("modal")) {
      setIsOpen(false);
    }
  };

  return (
    <div id="wrap" className="search-page">
      <HeaderSub />
      <main id="main" role="main">
        <section className="search-visual bg-gradient">
          <div className="inner">
            <h2 className="text-s-4">오늘의 신조어!</h2>
            <dl>
              <dt><span className="text-sb-8">얼죽아</span></dt>
              <dd className="text-r-4">
                "얼어 죽어도 아이스" 의 줄임말로
                날씨가 아무리 추워도 따뜻한 음료 대신
                차가운 음료를 선호하는 사람들을 뜻합니다.
              </dd>
            </dl>
            <div className="icon">
              {visualCateIcon ? (
                <object data={visualCateIcon} type="image/svg+xml" />
              ) : null}
            </div>
          </div>
        </section>
        <div className="contents-wrap">
          <section className="search-option-wrap">
            <SearchBar />
            <div className="search-category">
              <button type="button" className="btn btn-open-modal" onClick={openModal}>
                <div className="icon">
                  <object data={String(searchCategory)} type="image/svg+xml" />
                </div>
                <span className="text-xb-10">{matchCateName}</span>
              </button>
            </div>
          </section>
          <section className="search-result-wrap">
            <div className="d-flex justify-space-between align-items-center">
              <h2>{matchCateName} <span className="text-blue">51</span></h2>
              <div className="tooltip">
                <div className="icon">
                  <object data={String(tooltip)} type="image/svg+xml" />
                </div>
                <div className="tooltip-box">
                  <p>
                    대체어는 국립국어원에서 선정한 <br />
                    신조어를 대체할 우리말입니다.
                  </p>
                </div>
              </div>
            </div>
            <WordList />
          </section>
        </div>
        {isOpen && (
          <div id="modal-category" className="modal show" onClick={closeModal}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">카테고리 선택</h2>
                </div>
                <div className="modal-body">
                  <ul className="select-category-list">
                    <li className={!categoryId ? 'active' : ''}>
                      <Link to="/search" onClick={() => setIsOpen(false)}>
                        전체
                        {!categoryId && (
                          <div className="icon">
                            <object data={String(check)} type="image/svg+xml" />
                          </div>
                        )}
                      </Link>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id} className={categoryId === category.id.toString() ? 'active' : ''}>
                        <Link
                          to={'?query=' + query + '&category=' + category.id}
                          onClick={() => setIsOpen(false)}
                        >
                          {category.categoryName}
                          {categoryId === category.id.toString() && (
                            <div className="icon">
                              <object data={String(check)} type="image/svg+xml" />
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
