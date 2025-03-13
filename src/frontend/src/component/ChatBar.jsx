import React, { useState } from "react";

const ChatBar = ({
                   onSend,
                   isWaiting,    // "AI 응답을 기다리는 중..." 상태
                   isQuizMode,   // 문제 1~5 진행 중이면 "지금은 선택지에서 골라주세요."
                   isChatEnded   // 대화 종료
                 }) => {
  const [message, setMessage] = useState("");

  // [placeholder 우선순위]
  // 1) isChatEnded → "대화가 종료되었습니다."
  // 2) else if isQuizMode → "지금은 선택지에서 골라주세요."
  // 3) else if isWaiting → "AI 응답을 기다리는 중..."
  // 4) else → "AI 챗봇에게 무엇이든 물어보세요."
  let placeholderText = "AI 챗봇에게 무엇이든 물어보세요";

  if (isChatEnded) {
    placeholderText = "대화가 종료되었습니다.";
  } else if (isQuizMode) {
    placeholderText = "지금은 선택지에서 골라주세요.";
  } else if (isWaiting) {
    placeholderText = "AI 응답을 기다리는 중...";
  }

  // [input / button disabled 여부]
  //  - 퀴즈 중 + 대화 종료 + AI 응답 대기 시에는 사용자 입력 불가
  const isDisabled = isQuizMode || isChatEnded || isWaiting;

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className={`chat-bar ${isDisabled ? "disabled" : ""}`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={placeholderText}
        disabled={isDisabled}
      />
      <button
        type="button"
        className="btn btn-submit"
        onClick={handleSend}
        disabled={isDisabled}
      >
        <span className="hide">전송</span>
      </button>
    </div>
  );
};

export default ChatBar;
