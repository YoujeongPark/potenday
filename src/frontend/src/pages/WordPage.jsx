import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCategories } from "../context/CategoryContext";
import axios from "axios";
import HeaderSub from "../layout/HeaderSub";
import CategoryTab from "../component/CategoryTab";
import Tooltip from "../component/Tooltip";
import WordList from "../component/WordList";
import { quotes } from '../assets/images.js';

const WordPage = () => {
  const categories = useCategories();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const category = categoryId ? categories.find((item) => String(item.id) === categoryId) : null;

  const [slangList, setSlangList] = useState([]); // 현재 선택된 카테고리 목록
  const [allSlangList, setAllSlangList] = useState([]); // 전체 데이터 목록
  const [randomSlang, setRandomSlang] = useState(null); // 랜덤 단어 추출 (오늘의 신조어용)

  useEffect(() => {
    const fetchSlangs = async () => {
      try {
        let url = "/api/findSlangs";
        const response = await axios.get(url);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setAllSlangList(response.data); // 전체 데이터를 저장

          // 현재 선택된 카테고리에 해당하는 데이터 필터링
          const filteredSlangs = categoryId
            ? response.data.filter((item) => String(item.categoryId) === categoryId)
            : response.data; // 전체일 때는 모든 데이터

          setSlangList(filteredSlangs);
          //console.log("slangList:", filteredSlangs);

          // 카테고리별로 세션 스토리지 키 설정
          const sessionKey = "randomSlang_" + (categoryId || "all");
          const storedSlang = sessionStorage.getItem(sessionKey);

          if (storedSlang) {
            const parsedSlang = JSON.parse(storedSlang);

            // randomSlang이 현재 카테고리와 맞는지 확인
            if (!categoryId || String(parsedSlang.categoryId) === categoryId) {
              setRandomSlang(parsedSlang);
              //console.log("randomSlang:", parsedSlang);
              return;
            }
          }

          // 현재 카테고리 내에서 랜덤 단어 선택
          if (filteredSlangs.length > 0) {
            const newRandomSlang = filteredSlangs[Math.floor(Math.random() * filteredSlangs.length)];
            setRandomSlang(newRandomSlang);
            //console.log("new randomSlang:", newRandomSlang);
            sessionStorage.setItem(sessionKey, JSON.stringify(newRandomSlang)); // 새 단어 저장
          } else {
            setRandomSlang(null); // 해당 카테고리에 단어가 없을 경우
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSlangs();
  }, [categoryId]);

  // 전체의 경우 카테고리를 랜덤 단어에 맞추기 (아이콘 설정을 위함)
  let randomSlangCategory = categoryId ? category : (randomSlang ? categories.find(cat => String(cat.id) === String(randomSlang.categoryId)) : null);

  // 스크롤 애니메이션용
  const containerRef = useRef(null);
  const visualRef = useRef(null);
  const [visualHeight, setVisualHeight] = useState(0);

  // visual 높이 업데이트
  const updateHeight = () => {
    if (visualRef.current) {
      setVisualHeight(visualRef.current.offsetHeight);
    }
  };

  // visual 높이 설정 및 리사이즈
  useEffect(() => {
    const updateHeight = () => {
      if (visualRef.current) {
        setTimeout(() => {
          setVisualHeight(visualRef.current.offsetHeight);
        }, 0);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    // 요소 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => updateHeight());
    if (visualRef.current) {
      resizeObserver.observe(visualRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
      resizeObserver.disconnect();
    };
  }, [categoryId, searchParams]); // URL 변경 감지

  // contents-wrap가 visual 위로 가게
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -visualHeight]);

  return (
    <div id="wrap" className="word-page" ref={containerRef}>
      <HeaderSub />
      <main id="main" role="main">
        <motion.section
          ref={visualRef}
          className="word-visual bg-gradient"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 10,
          }}
        >
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
        </motion.section>

        {/* 스크롤용 fake div */}
        <div style={{ position: "relative", zIndex: 11, height: visualHeight }} />

        <motion.section
          className="contents-wrap"
          style={{
            y: yTransform,
            position: "relative",
            zIndex: 11,
          }}
        >
          <CategoryTab />
          <div className="word-list-wrap">
            <div className="word-title">
              <h2 className="text-sb-6">
                {category ? category.categoryName : "전체"}
                <span className="text-xr-8 text-blue">
                  {category ? slangList.length : allSlangList.length}
                </span>
              </h2>
              <Tooltip />
            </div>
            <WordList slangList={slangList} />
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default WordPage;
