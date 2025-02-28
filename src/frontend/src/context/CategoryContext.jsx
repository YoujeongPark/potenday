import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import categoryData from "../assets/categoryData.js";

// Context 생성
const CategoryContext = createContext([]);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

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
              icon: mapCategoryData.icon || null, // 아이콘
              tabIcon: mapCategoryData.tabIcon || null, // 탭아이콘
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
