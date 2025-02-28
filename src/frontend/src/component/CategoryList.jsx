import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import {logo} from "../assets/images.js";

const CategoryList = () => {
  const categories = useCategories();

  return (
    <div className="category-list">
      {categories.length > 0 ? (
        categories.map((item) => (
          <article className="card" key={item.id}>
            <Link to={"/word?category=" + item.id}>
              <h3 className="text-xb-4">
                {item.categoryName}
              </h3>
              {item.description && (
                <p className="text-xr-6">
                  {item.description}
                </p>
              )}
              {item.icon && (
                <div className="icon icon-category">
                  <object data={item.icon} type="image/svg+xml" />
                </div>
              )}
            </Link>
          </article>
        ))
      ) : (
        <div className="no-data">
          카테고리가 없습니다.
        </div>
      )}
    </div>
  );
};

export default CategoryList;
