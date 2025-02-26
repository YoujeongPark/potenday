import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoryContext.jsx";

const CategoryList = () => {
  const categories = useCategories();

  return (
    <div className="category-list">
      {categories.length > 0 ? (
        categories.map((item) => (
          <article key={item.id} className="card">
            <Link to={'/search?category=' + item.id}>
              <h3 className="text-xb-4">{item.categoryName}</h3>
              <p className="text-s-6">{item.description}</p>
              {item.icon && (
                <div className="icon">
                  <img src={item.icon} alt={item.categoryName} />
                </div>
              )}
            </Link>
          </article>
        ))
      ) : (
        <p>카테고리가 없습니다.</p>
      )}
    </div>
  );
};

export default CategoryList;
