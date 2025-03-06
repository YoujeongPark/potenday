import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { arrowWhite, chat } from "../assets/images.js";

const ChatShortCut = () => {
  const [isOpen, setIsOpen] = useState(false); // open 상태
  const [isReadyToClick, setIsReadyToClick] = useState(false); // able 상태
  const navigate = useNavigate();
  const linkRef = useRef(null);

  // 외부 클릭 시 상태 초기화
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (linkRef.current && !linkRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsReadyToClick(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // 클릭 시 open / able 처리
  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        setIsReadyToClick(true);
      }, 100);
      return;
    }

    if (!isReadyToClick) {
      return;
    }

    // open + able 상태라면 이동
    navigate("/quiz");
  };

  return (
    <Link
      to="/quiz"
      ref={linkRef}
      onClick={(e) => {
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          setTimeout(() => setIsReadyToClick(true), 100);
        } else if (!isReadyToClick) {
          e.preventDefault();
        }
      }}
      className={
        "chat-shortcut" +
        (isOpen ? " open" : "") +
        (isReadyToClick ? " able" : "")
      }
    >
      <div className="icon icon-chat">
        <object data={String(chat)} type="image/svg+xml" />
      </div>
      <div className="text text-r-6 text-white">
        신조어를 활용하여 <br />
        챗봇과 대화하러 가기
      </div>
      <div className="icon icon-arrow">
        <object data={String(arrowWhite)} type="image/svg+xml" />
      </div>
    </Link>
  );
};

export default ChatShortCut;
