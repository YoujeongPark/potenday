import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { category01, category02, category03, category04, category05, category06, category07, category08, category09, category10 } from "../assets/images.js";

const CategoryList = () => {
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  // 카테고리 데이터 가져오기
  useEffect(() => {
    axios.get('/api/getCategories')
      .then(response => {
        //console.log('데이터:', response.data);
        setCategory(response.data);
      })
      .catch(error => {
        console.error("error:", error);
      });
  }, []);

  // 추가 정보 매핑
  const categoryDetails = {
    1: {
      description: '카테고리 1에 대한 설명입니다.',
      icon: category01,
    },
    2: {
      description: '카테고리 2에 대한 설명입니다.',
      icon: category02,
    },
  };

  return (
    <div className="category-list">
      {category.map((item) => {
        const details = categoryDetails[item.id];
        return (
          <article key={item.id} className="card">
            <Link to={'/' + item.id}>
              <h3 className="text-xb-4">
                {item.categoryName}
              </h3>
              <p className="text-s-6">
                {details ? details.description : ''}
              </p>
              <div className="icon">
                <object data={details ? details.icon : ''} type="image/svg+xml" aria-label={item.categoryName} />
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
};

export default CategoryList
