import React, { useState } from "react";

const ChatBar = ({ onSendMessage, isDisabled, isQuizMode }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || isDisabled) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className={"chat-bar" + (isDisabled ? " disabled" : "")}>
      <input
        type="text"
        placeholder={
          isDisabled
            ? (isQuizMode ? "지금은 선택지에서 골라주세요" : "AI 응답을 기다리는 중...")
            : "AI 챗봇에게 무엇이든 물어보세요"
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={isDisabled}
      />
      <button type="button" className="btn btn-submit" onClick={handleSubmit} disabled={isDisabled}>
        <span className="hide">전송</span>
      </button>
    </div>
  );
};

export default ChatBar;
