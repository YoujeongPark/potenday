const ChatBar = () => {
  return (
    <div className="chat-bar">
      <input
        type="text"
        placeholder="AI 챗봇에게 무엇이든 물어보세요"
      />
      <button type="submit" className="btn btn-submit">
        <span className="hide">전송</span>
      </button>
    </div>
  );
};

export default ChatBar;
