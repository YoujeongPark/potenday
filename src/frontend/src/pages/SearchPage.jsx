import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import HeaderSub from "../layout/HeaderSub";
import WordList from "../component/WordList";

// 초성 추출용 한글 유니코드
const CHOSUNG_LIST = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ",
  "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

const HANGUL_START = 0xac00; // '가'
const HANGUL_END = 0xd7a3; // '힣'
const CHOSUNG_INTERVAL = 588; // 초성 간격

// 단어에서 초성만 추출
const extractChosung = (word) => {
  return word.split("").map((char) => {
    const charCode = char.charCodeAt(0);
    if (charCode >= HANGUL_START && charCode <= HANGUL_END) {
      const chosungIndex = Math.floor((charCode - HANGUL_START) / CHOSUNG_INTERVAL);
      return CHOSUNG_LIST[chosungIndex];
    }
    return char; // 한글이 아니면 그대로 반환 (영어, 특수기호 등)
  }).join("");
};

// 검색 로직
const filterSlangList = (searchWord, slangList) => {
  if (!searchWord.trim()) return [];

  const lowerSearch = searchWord.toLowerCase();
  const searchChosung = extractChosung(searchWord); // 검색어에서 초성 추출
  const isChosungOnly = /^[ㄱ-ㅎ]+$/.test(searchWord); // 검색어가 초성만인가?

  return slangList.filter((item) => {
    const name = item.slangName; // 단어
    const nameChosung = extractChosung(name); // 단어 초성
    const lowerName = name.toLowerCase(); // 소문자로 변환

    // 검색어가 초성으로만 이루어진 경우 → 부분 초성 검색 허용
    if (isChosungOnly && nameChosung.includes(searchChosung)) return true;

    // 전방 검색 + 포함 검색
    return lowerName.startsWith(lowerSearch) || lowerName.includes(lowerSearch);
  });
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchWord = searchParams.get("word") || "";
  const [allSlangList, setAllSlangList] = useState([]);
  const [filteredSlangList, setFilteredSlangList] = useState([]);

  useEffect(() => {
    const fetchSlangs = async () => {
      try {
        const response = await axios.get("/api/findSlangs");
        if (Array.isArray(response.data)) {
          setAllSlangList(response.data);
        }
      } catch (error) {
        console.error("Error fetching slang data:", error);
      }
    };

    fetchSlangs();
  }, []);

  useEffect(() => {
    setFilteredSlangList(filterSlangList(searchWord, allSlangList));
  }, [searchWord, allSlangList]);

  return (
    <div id="wrap" className="search-page">
      <HeaderSub />
      <main id="main" role="main">
        <div className="search-result">
          <WordList slangList={filteredSlangList} isSearchPage={true} />
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
