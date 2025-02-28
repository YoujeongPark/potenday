import { Link } from 'react-router-dom';

const CategoryList = () => {
  return (
    <div className="category-list">
      <article className="card">
        <Link to="/word">
          <h3 className="text-xb-4">카테고리명</h3>
          <p className="text-xr-6">카테고리 설명</p>
          <div className="icon">
            아이콘
            {/*<img src={item.icon} alt={item.categoryName} />*/}
          </div>
        </Link>
      </article>
    </div>
  );
};

export default CategoryList;
