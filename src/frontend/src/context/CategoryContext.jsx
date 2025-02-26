import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import categoryData from "../assets/categoryData.js";

// Context 생성
const CategoryContext = createContext([]);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  /** API 데이터 적용 완료되면 활성화
  useEffect(() => {
    axios.get("/api/getCategories")
      .then(response => {
        console.log("API 데이터 : ", response.data);

        // API 데이터와 categoryData 매핑
        if (Array.isArray(response.data)) {
          const mappedCategories = response.data.map(item => {
            const mapCategoryData = categoryData[item.id] || {};
            return {
              ...item,
              description: mapCategoryData.description || "", // 추가설명
              icon: mapCategoryData.icon || null, // 이미지
            };
          });
          console.log("매핑 데이터 : ", mappedCategories);
          setCategories(mappedCategories);
        } else {
          console.error("error array", response.data);
        }
      })
      .catch(error => {
        console.error("error api:", error);
      });
  }, []);
  */

  // 임시 더미 데이터 사용
  useEffect(() => {
    const dummyData = [
      { id: 1, categoryName: "일상생활" },
      { id: 2, categoryName: "직장/학교" },
      { id: 3, categoryName: "연애/관계" },
      { id: 4, categoryName: "디지털/인터넷" },
      { id: 5, categoryName: "유행/패션" },
      { id: 6, categoryName: "감정/상태" },
      { id: 7, categoryName: "소비/경제" },
      { id: 8, categoryName: "정치/사회" },
      { id: 9, categoryName: "음식/취미" },
      { id: 10, categoryName: "기타" },
    ];

    const mappedCategories = dummyData.map(item => {
      const mapCategoryData = categoryData[item.id] || {};
      return {
        ...item,
        description: mapCategoryData.description || "",
        icon: mapCategoryData.icon || null,
      };
    });
    console.log("더미 데이터 : ", mappedCategories);
    setCategories(mappedCategories);
  }, []);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
};

// provider 내부인지 확인
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("not provider");
  }
  return context;
};
