import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import axios from "axios";
import HeaderSub from "../layout/HeaderSub";
import CategoryTab from "../component/CategoryTab";
import Tooltip from "../component/Tooltip";
import WordList from "../component/WordList";
import {logo, quotes} from '../assets/images.js';

const WordPage = () => {
  const categories = useCategories();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const category = categoryId ? categories.find((item) => String(item.id) === categoryId) : null;
  const [slangList, setSlangList] = useState([]);
  const [randomSlang, setRandomSlang] = useState(null); // 랜덤 단어 추출 (오늘의 신조어용)

  useEffect(() => {
    const fetchSlangs = async () => {
      try {
        let url = "/api/findSlangs";
        if (categoryId) {
          url = "/api/findSlangs?id=" + categoryId;
        }
        const response = await axios.get(url);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSlangList(response.data);

          // 카테고리별로 세션 스토리지 키 설정
          const sessionKey = "randomSlang_" + (categoryId || "all");
          const storedSlang = sessionStorage.getItem(sessionKey);

          if (storedSlang) {
            setRandomSlang(JSON.parse(storedSlang));
          } else {
            const newRandomSlang = response.data[Math.floor(Math.random() * response.data.length)];
            setRandomSlang(newRandomSlang);
            sessionStorage.setItem(sessionKey, JSON.stringify(newRandomSlang)); // 새 단어 저장
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSlangs();
  }, [categoryId]);

  // 오늘의 신조어 - 전체의 경우 카테고리를 랜덤에 맞추기 (아이콘 설정)
  let randomSlangCategory = null;
  if (!categoryId && randomSlang) {
    randomSlangCategory = categories.find((cat) => String(cat.id) === String(randomSlang.categoryId));
  } else {
    randomSlangCategory = category;
  }

  return (
    <div id="wrap" className="word-page">
      <HeaderSub />
      <main id="main" role="main">
        <section className="word-visual bg-gradient">
          <div className="inner">
            <h2 className="text-s-4">
              {categoryId ? "오늘의 " + (category?.categoryName || "") + " 신조어!" : "오늘의 신조어!"}
            </h2>
            {randomSlang ? (
              <>
                <dl>
                  <dt className={categoryId ? "quotes" : "underline"}>
                    {categoryId && (
                      <>
                        <span className="icon icon-quotes icon-quotes-left">
                          <object data={String(quotes)} type="image/svg+xml" />
                        </span>
                      </>
                    )}
                    <span className="text-sb-8">{randomSlang.slangName}</span>
                    {categoryId && (
                      <>
                        <span className="icon icon-quotes icon-quotes-right">
                          <object data={String(quotes)} type="image/svg+xml" />
                        </span>
                      </>
                    )}
                  </dt>
                  <dd className="text-r-4">{randomSlang.slangMeaning}</dd>
                </dl>
                {randomSlangCategory && (
                  <div className="d-flex justify-end">
                    <div className="icon icon-category">
                      <object data={randomSlangCategory.icon} type="image/svg+xml" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="no-data">데이터가 없습니다.</p>
            )}
          </div>
        </section>
        <div className="pull-wrap">
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
