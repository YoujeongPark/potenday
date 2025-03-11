import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import HeaderSub from "../layout/HeaderSub";
import ChatBar from "../component/ChatBar";
import axios from "axios";

const QuizPage = () => {
  const [messages, setMessages] = useState([]);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false); // AI 응답 대기 상태
  const [nicknameConfirmed, setNicknameConfirmed] = useState(false); // 닉네임 체크
  const [isQuizMode, setIsQuizMode] = useState(false); // 퀴즈 모드 상태
  const [quizRound, setQuizRound] = useState(0); // 현재 퀴즈 라운드 (시작 전 0)
  const initialFetched = useRef(false); // startChat 중복 호출 방지

  // 메시지 내 개행 처리
  const formatMessage = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 메시지 추가 (role: "assistant" / "user")
  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content: formatMessage(content) }]);
  };

  // 로드시 startChat API 호출
  useEffect(() => {
    if (initialFetched.current) return;
    initialFetched.current = true;

    const fetchInitialMessage = async () => {
      setIsWaitingForAI(true);
      try {
        const response = await axios.post(
          "/api/clova/startChat",
          { message: "안녕?" },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("startChat 초기 응답:", response.data);
        const aiMessage =
          response.data.result?.message?.content ||
          "죄송합니다. 응답을 가져올 수 없습니다.";
        addMessage("assistant", aiMessage);
      } catch (error) {
        console.log("startChat 초기 요청 에러:", error);
        addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
      } finally {
        setIsWaitingForAI(false);
      }
    };

    fetchInitialMessage();
  }, []);

  // 사용자 입력 처리 : 닉네임 유효 시 첫 문제 출력 및 quizRound를 1로 설정
  const fetchMessage = async (userMessage) => {
    if (isWaitingForAI) return;
    if (!userMessage.trim()) return;

    // 확인 전이면 입력으로 처리
    if (!nicknameConfirmed) {
      addMessage("user", userMessage);
      setIsWaitingForAI(true);
      try {
        const response = await axios.post(
          "/api/clova/startChat",
          { message: userMessage },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("startChat (닉네임 입력) 응답:", response.data);
        const aiMessage =
          response.data.result?.message?.content ||
          "죄송합니다. 응답을 가져올 수 없습니다.";
        addMessage("assistant", aiMessage);

        if (aiMessage.includes("닉네임이 살짝 길어요")) { // 응답에 '닉네임이 살짝 길어요' 있으면 유효하지 않은 것으로 처리

        } else { // 닉네임이 확인된 경우
          setNicknameConfirmed(true);

          // startQuiz API 호출해 첫 퀴즈 문제 출력
          const quizResponse = await axios.post(
            "/api/clova/startQuiz",
            { message: "" },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("startQuiz 첫 문제 응답:", quizResponse.data);
          const quizMessage =
            quizResponse.data.result?.message?.content ||
            "죄송합니다. 응답을 가져올 수 없습니다.";
          addMessage("assistant", quizMessage);

          setIsQuizMode(true);
          setQuizRound(1);
        }
      } catch (error) {
        console.log("닉네임 처리 중 에러:", error);
        addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
      } finally {
        setIsWaitingForAI(false);
      }
    } else {
      addMessage("user", userMessage);
      setIsWaitingForAI(true);

      try {
        const response = await axios.post(
          "/api/clova/startQuiz",
          { message: userMessage },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log(`startQuiz round ${quizRound} 응답:`, response.data);

        const quizMessage =
          response.data.result?.message?.content ||
          "죄송합니다. 응답을 가져올 수 없습니다.";
        addMessage("assistant", quizMessage);

        setQuizRound((prev) => {
          const nextRound = prev + 1;
          if (nextRound >= 5) { // 5문제가 완료되면 최종 메시지 출력 및 퀴즈 종료 처리
            setIsQuizMode(false);
            addMessage("assistant", "퀴즈가 모두 종료되었습니다. 결과를 확인하세요.");
          }
          return nextRound;
        });
      } catch (error) {
        console.log("퀴즈 처리 중 에러:", error);
        addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
      } finally {
        setIsWaitingForAI(false);
      }
    }
  };

  return (
    <div id="wrap" className="quiz-page">
      <HeaderSub />
      <main id="main" role="main">
        <div className="chat-wrap">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`chat-item-wrap ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chat-item">{msg.content}</div>
            </motion.div>
          ))}
        </div>
      </main>
      <ChatBar
        onSendMessage={fetchMessage}
        // 퀴즈 모드가 종료되었거나 AI 응답 대기 시 입력 비활성화
        isDisabled={isWaitingForAI || (nicknameConfirmed && !isQuizMode && quizRound >= 5)}
        isQuizMode={isQuizMode}
      />
    </div>
  );
};

export default QuizPage;
