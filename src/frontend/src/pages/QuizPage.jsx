import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeaderSub from "../layout/HeaderSub";
import ChatBar from "../component/ChatBar";
import axios from "axios";

const QuizPage = () => {
  const [messages, setMessages] = useState([]); // 메세지 상태
  const [isQuizStarted, setIsQuizStarted] = useState(false); // 퀴즈 시작 체크
  const [isWaitingForAI, setIsWaitingForAI] = useState(true); // AI 대기 상태

  // content 개행 처리
  const formatMessage = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 메시지 추가 (유저 / AI)
  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content: formatMessage(content) }]);
  };

  // API 호출 (유저 입력 → AI 응답)
  const fetchMessage = async (userMessage) => {
    if (isWaitingForAI || isQuizStarted) return; // AI 대기 중이거나 퀴즈 모드일 경우 입력 차단
    if (!userMessage.trim()) return; // 빈 입력 방지

    // 유저 메시지 추가
    addMessage("user", userMessage);
    setIsWaitingForAI(true); // 유저 입력 후 AI 응답을 기다림

    try {
      let response;

      // 퀴즈 시작 여부에 따른 API 분기
      if (isQuizStarted) {
        response = await axios.post("/api/clova/startQuiz",
          { message: userMessage },
          { headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post("/api/clova/startChat",
          { message: userMessage },
          { headers: { "Content-Type": "application/json" },
        });
        // 처음 유저가 답하면 퀴즈 시작 (startQuiz API로 변경)
        setIsQuizStarted(true);
        //console.log("퀴즈 모드 전환");
      }
      const aiMessage = response.data.result?.message?.content || "죄송합니다. 응답을 가져올 수 없습니다.";
      addMessage("assistant", aiMessage);
    } catch (error) {
      //console.error("Error:", error);
      addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
    } finally {
      setIsWaitingForAI(false); // AI 응답이 오면 입력 가능
    }
  };

  // 일반 대화 시작 시 첫 메시지 자동 호출
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await axios.post("/api/clova/startChat",
          { message: "안녕?"},
          { headers: { "Content-Type": "application/json" },
        });
        const aiMessage = response.data.result?.message?.content || "죄송합니다. 응답을 가져올 수 없습니다.";
        setMessages([{
          role: "assistant",
          content: formatMessage(aiMessage)
        }]);
      } catch (error) {
        setMessages([{
          role: "assistant",
          content: formatMessage("죄송합니다. 오류가 발생했습니다.")
        }]);
      } finally {
        setIsWaitingForAI(false); // 첫 메시지 도착 후 입력 가능
      }
    };

    fetchInitialMessage();
  }, []);

  // 퀴즈 시작 시 첫 메시지 자동 호출
  useEffect(() => {
    if (isQuizStarted) {
      const fetchQuizStartMessage = async () => {
        try {
          const response = await axios.post("/api/clova/startQuiz",
            { message: ""},
            { headers: { "Content-Type": "application/json" },
          });
          console.log(response.data);
          const aiMessage = response.data.result?.message?.content || "죄송합니다. 퀴즈를 시작할 수 없습니다.";
          addMessage("assistant", aiMessage);
        } catch (error) {
          addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
        }
      };
      fetchQuizStartMessage();
    }
  }, [isQuizStarted]);

  return (
    <div id="wrap" className="quiz-page">
      <HeaderSub />
      <main id="main" role="main">
        <div className="chat-wrap">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={"chat-item-wrap " + msg.role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chat-item">
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>
        <ChatBar
          onSendMessage={fetchMessage}
          isDisabled={isWaitingForAI || isQuizStarted}
          isQuizMode={isQuizStarted}
        />
      </main>
    </div>
  );
};

export default QuizPage;
