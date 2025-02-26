const CategoryList = () => {
  return (
    <div className="word-list">
      <article className="card">
        <dl>
          <dt>얼죽아 <span>일상생활</span></dt>
          <dd>
            “얼어 죽어도 아이스” 의 줄임말로 날씨가 아무리 추워도 따뜻한 음료 대신 차가운 음료를 선호하는 사람들을 뜻합니다.
          </dd>
          <dd className="dd-item dd-example">
            <span className="badge bg-blue">예문</span>
            아무리 추워도 나는 <span className="text-blue">얼죽아</span>이기 때문에 아이스 아메리카노!
          </dd>
          <dd className="dd-item dd-change">
            <span className="badge bg-yellow">대치어</span>
            무조건 차가운 음료
          </dd>
        </dl>
      </article>
      <article className="card">
        <dl>
          <dt>냥아치 <span>일상생활</span></dt>
          <dd>
            “고양이(냥이) + 양아치” 의 합성어로 주로 애교를 부리다가도 갑자기 공격하거나, 도도한 태도를 보이는 고양이의 이중적인 모습을 표현할 때 사용됩니다.
          </dd>
          <dd className="dd-item dd-example">
            <span className="badge bg-blue">예문</span>
            애교 부리다가 갑자기 물어버린다니, 진짜 <span className="text-blue">냥아치</span>네.
          </dd>
          <dd className="dd-item dd-change">
            <span className="badge bg-yellow">대치어</span>
            못된 고양이
          </dd>
        </dl>
      </article>
      <article className="card">
        <dl>
          <dt>짬바 <span>일상생활</span></dt>
          <dd>
            “짬에서 나오는 바이브” 의 줄임말로 오랜 경험에서 나오는 노련함이나 실력을 뜻합니다.
          </dd>
          <dd className="dd-item dd-example">
            <span className="badge bg-blue">예문</span>
            그 선배는 아무리 힘든 일도 척척 해결해. <span className="text-blue">짬바</span>가 다르네.
          </dd>
          <dd className="dd-item dd-change">
            <span className="badge bg-yellow">대치어</span>
            경험치, 노련미
          </dd>
        </dl>
      </article>
      <article className="card">
        <dl>
          <dt>꾸안꾸 <span>일상생활</span></dt>
          <dd>
            “꾸민 듯 안 꾸민 듯”의 줄임말로 내추럴하지만 세련된 스타일링을 의미합니다.
          </dd>
          <dd className="dd-item dd-example">
            <span className="badge bg-blue">예문</span>
            너 오늘 옷 되게 <span className="text-blue">꾸안꾸</span> 느낌 난다.
          </dd>
          <dd className="dd-item dd-change">
            <span className="badge bg-yellow">대치어</span>
            내추럴 스타일
          </dd>
        </dl>
      </article>
    </div>
  );
};

export default CategoryList
