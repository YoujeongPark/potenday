import HeaderSub from "../layout/HeaderSub";
import ChatBar from "../component/ChatBar";

const QuizPage = () => {
  return (
    <div id="wrap" className="quiz-page">
      <HeaderSub />
      <main id="main" role="main">
        <div className="quiz-chat-wrap">
          {/*
          <div className="chat-item">
            반갑습니다! 😊 요즘 신조어, 어렵지 않나요? 퀴즈를 풀면서 재미있게 배워볼까요?
            먼저, 어떻게 불러드리면 될까요?
          </div>
          <div className="chat-item user">
            난 지민이야
          </div>
          <div className="chat-item">
            총 다섯 개의 문제를 풀 거예요. 첫 번째 문제 나갑니다! [OOO]에 들어갈 단어를 골라주세요.

            ‘여러분 모두 [OOO] 입니다 🙇🏻‍♀️'
            <div className="quiz-list">
              <button type="button">만반잘부</button>
              <button type="button">플렉스</button>
              <button type="button">꾸안꾸</button>
              <button type="button">펭수</button>
            </div>
          </div>
          */}
        </div>
        <ChatBar />
      </main>
    </div>
  );
};

export default QuizPage;
