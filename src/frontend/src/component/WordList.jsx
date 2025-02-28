const WordList = ({ slangList }) => {
  return (
    <div className="word-list">
      {slangList.length > 0 ? (
        slangList.map((slang) => (
          <article className="card" key={slang.id}>
            <dl>
              <dt>
                {slang.slangName}
                <span>{slang.categoryName}</span>
              </dt>
              <dd>
                {slang.slangMeaning}
              </dd>
              {slang.slangExample && (
                <dd className="dd-item dd-example">
                  <span className="badge bg-blue">예문</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: slang.slangExample.split(slang.slangName).join(
                        "<span class='text-blue'>" + slang.slangName + "</span>"
                      ),
                    }}
                  />
                </dd>
              )}
              {slang.slangSubstitutes && (
                <dd className="dd-item dd-change">
                  <span className="badge bg-yellow">대치어</span>
                  {slang.slangSubstitutes}
                </dd>
              )}
            </dl>
          </article>
        ))
      ) : (
        <p className="no-data">등록된 신조어가 없습니다.</p>
      )}
    </div>
  );
};

export default WordList;
