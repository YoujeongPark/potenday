import React, { useState } from 'react';

const SearchCategory = () => {
  return (
    <div>
      <button type="button">카테고리</button>
      <div className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            카테고리 모달
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCategory;
