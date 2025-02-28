import { character } from '../assets/images.js';
import { useSearchParams } from "react-router-dom";

const WordList = ({ slangList, isSearchPage = false }) => {
  const [searchParams] = useSearchParams();
  const wordParam = searchParams.get("word") || ""; // 현재 검색어 가져오기

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
              <dd>{slang.slangMeaning}</dd>
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
              <dd className="dd-item dd-change">
                <span className="badge bg-yellow">대체어</span>
                {slang.slangSubstitutes ? (
                  <>
                    {slang.slangSubstitutes}
                  </>
                ) : (
                  <>
                    {slang.slangName}의 대체어가 없어요!
                  </>
                )}
              </dd>
            </dl>
          </article>
        ))
      ) : (
        isSearchPage ? (
          <div className="no-data-wrap">
            <div className="icon icon-character">
              <img src={String(character)} alt="" />
            </div>
            <div className="text">
              <strong className="text-xb-4">
                {wordParam ? "검색 결과가 없습니다." : "검색해보세요"}
              </strong>
              <p className="text-r-6"
                dangerouslySetInnerHTML={{
                  __html: wordParam
                    ? "단어가 존재하지 않아요.<br />현재 서비스에서 지원하지 않는 단어일 수 있어요!"
                    : "요즘 신조어, 얼마나 알고 있나요?<br />궁금한 단어를 검색해 보세요!"
                }}
              />
            </div>
          </div>
        ) : (
          <p className="no-data">등록된 신조어가 없습니다.</p>
        )
      )}
    </div>
  );
};

export default WordList;
