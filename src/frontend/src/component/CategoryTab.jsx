import { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import { categoryTabAll } from "../assets/images.js";

const CategoryTab = () => {
  const categories = useCategories();
  const location = useLocation();
  const categoryTabRef = useRef(null); // 스크롤 컨테이너
  const activeTabRef = useRef(null); // 활성화 탭

  // 현재 카테고리 체크
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  useLayoutEffect(() => {
    if (categoryTabRef.current && activeTabRef.current) {
      const container = categoryTabRef.current;
      const activeItem = activeTabRef.current;

      // 컨테이너의 현재 스크롤 위치
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;

      // 활성화된 아이템의 위치
      const itemLeft = activeItem.offsetLeft;
      const itemRight = itemLeft + activeItem.clientWidth;

      // 활성화된 아이템이 보이지 않으면 스크롤 이동
      if (itemLeft < containerLeft) {
        container.scrollLeft = itemLeft - 24;
      } else if (itemRight > containerRight) {
        container.scrollLeft = itemRight - container.clientWidth + 24;
      }
    }
  }, [category]);

  return (
    <div className="category-tab" ref={categoryTabRef}>
      <ul>
        {categories.length > 0 ? (
          <>
            <li ref={!category ? activeTabRef : null} className={!category ? "active" : ""}>
              <Link to="/word">
                <div className="icon">
                  <object data={String(categoryTabAll)} type="image/svg+xml" />
                </div>
                <span className="text-r-10">전체</span>
              </Link>
            </li>
            {categories.map((item) => (
              <li
                key={item.id}
                ref={category == item.id ? activeTabRef : null}
                className={category == item.id ? "active" : ""}
              >
                <Link to={"/word?category=" + item.id}>
                  {item.tabIcon && (
                    <div className="icon">
                      <object data={item.tabIcon} type="image/svg+xml" />
                    </div>
                  )}
                  <span className="text-r-10">{item.categoryName}</span>
                </Link>
              </li>
            ))}
          </>
        ) : (
          <li className="no-data">카테고리가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default CategoryTab;
