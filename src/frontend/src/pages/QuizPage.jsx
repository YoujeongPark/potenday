import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import HeaderSub from "../layout/HeaderSub";
import ChatBar from "../component/ChatBar";
import axios from "axios";

const QuizPage = () => {
  const [messages, setMessages] = useState([]); // 메세지
  const [isWaitingForAI, setIsWaitingForAI] = useState(false); // ai 응답 대기
  const [nickname, setNickname] = useState("");
  const [nicknameConfirmed, setNicknameConfirmed] = useState(false); // 닉네임 통과 상태
  const [isQuizMode, setIsQuizMode] = useState(false); // 퀴즈모드 진입
  const [quizRound, setQuizRound] = useState(0); // 퀴즈 라운드 설정
  const [correctAnswers, setCorrectAnswers] = useState([]); // 정답 리스트
  const [correctCount, setCorrectCount] = useState(0); // 정답 갯수 카운트
  const [hasAnswered, setHasAnswered] = useState(false); // 현재 문제에 답변 완료 여부
  const initialFetched = useRef(false);
  const chatWrapRef = useRef(null);

  useEffect(() => {
    if (chatWrapRef.current) {
      chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 내 개행 처리
  const formatMessage = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 메시지 추가 함수
  const addMessage = (role, content, extra = {}) => {
    let additionalClass = extra.className || "";

    if (content.includes("신조어 점수는")) {
      additionalClass = "state-score";
    }

    setMessages((prev) => [
      ...prev,
      { role, content: formatMessage(content), raw: content, className: additionalClass, ...extra }
    ]);
  };

  // 퀴즈 메시지에서 문제와 선택지 분리
  const parseQuizMessage = (content) => {
    let correctAnswer = null;
    let textWithoutAnswer = content;

    if (content.includes("정답 :")) {
      const answerSplit = content.split("정답 :");
      correctAnswer = answerSplit[1].trim();
      textWithoutAnswer = answerSplit[0].trim();
    }

    const parts = textWithoutAnswer.split("선택지 :");
    if (parts.length < 2) {
      return {question: textWithoutAnswer, options: [], correctAnswer};
    }

    const question = parts[0].replace(/문제\s*\d+\s*:/, "").trim();
    const options = parts[1].split(",").map((opt) => opt.trim());
    return { question, options, correctAnswer };
  };

  // 퀴즈 메시지 추가 (중복 방지)
  const addQuizMessage = (content) => {
    const { question, options, correctAnswer } = parseQuizMessage(content);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", type: "quiz", question, options, raw: content }
    ]);

    if (correctAnswer) {
      setCorrectAnswers((prev) => [...prev, correctAnswer]);
    }

    // 새로운 문제 시작 시 답변 상태 초기화
    setHasAnswered(false);
  };

  // 초기 Clova 메시지 요청 (첫 인사)
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
        const aiMessage =
          response.data.result?.message?.content ||
          "죄송합니다. 응답을 가져올 수 없습니다.";
        addMessage("assistant", aiMessage.replace(/{user_name}/g, ""));
      } catch (error) {
        console.error("Clova API 오류:", error);
        addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
      } finally {
        setIsWaitingForAI(false);
      }
    };

    fetchInitialMessage();
  }, []);

  // 사용자 입력 처리
  const fetchMessage = async (userMessage) => {
    if (isQuizMode && hasAnswered) return;
    if (isWaitingForAI || !userMessage.trim()) return;
    if (nicknameConfirmed && !isQuizMode) return;

    // 퀴즈 모드라면, 첫 클릭 후 답변 완료 처리
    if (isQuizMode) {
      setHasAnswered(true);
    }

    addMessage("user", userMessage);
    setIsWaitingForAI(true);

    try {
      // 닉네임 입력 단계
      if (!nicknameConfirmed) {
        const response = await axios.post("/api/clova/startChat", { message: userMessage });
        const aiMessage = response.data.result?.message?.content || "응답을 가져올 수 없습니다.";
        //console.log(`Clova 응답 (닉네임 단계): ${aiMessage}`);

        if (aiMessage.includes("닉네임이 살짝 길어요")) {
          addMessage("assistant", "입력하신 닉네임이 유효하지 않습니다. 다시 입력해주세요.");
        } else {
          addMessage("assistant", aiMessage);
          setNickname(userMessage);
          setNicknameConfirmed(true);

          // 첫 번째 문제 출제 요청
          const quizResponse = await axios.post("/api/clova/startQuiz", { message: "퀴즈 시작" });
          let quizMessage = quizResponse.data.result?.message?.content || "응답을 가져올 수 없습니다.";
          addQuizMessage(quizMessage.replace(/{user_name}/g, userMessage));
          console.log(`Clova 응답 (퀴즈 시작): ${quizMessage}`);

          setIsQuizMode(true);
          setQuizRound(1);
        }
      } else {
        // 퀴즈 진행
        const currentCorrectAnswer = correctAnswers[quizRound - 1] || "";
        const isCorrect = userMessage.trim() === currentCorrectAnswer;

        if (isCorrect) {
          setCorrectCount((prev) => prev + 1);
        }

        //console.log(`현재 정답 리스트: ${correctAnswers}`);
        //console.log(`현재 라운드: ${quizRound}, 비교 대상 정답: ${currentCorrectAnswer}`);
        //console.log(`사용자 입력: ${userMessage}, 정답 여부: ${isCorrect}`);

        setTimeout(() => {
          let requestMessage;

          if (quizRound < 5) {
            requestMessage = `현재 ${quizRound + 1}번째 문제 진행중 입니다. \n다음 문제`;
          } else {
            requestMessage = `점수 출력중`;

            // 최종 점수 계산
            const finalScore = correctCount * 20;

            setTimeout(() => {
              if (finalScore === 100) {
                addMessage("assistant", `짜잔! 🎊 ${nickname}님의 신조어 점수는 ${finalScore}점이에요! 대단해요!`, { className: "state-score" });
                requestMessage = `퀴즈 종료`;
                setIsQuizMode(false); // 퀴즈모드 종료
              } else {
                addMessage("assistant", `${nickname}님의 신조어 점수는 ${finalScore}점이에요.`, { className: "state-score" });
                requestMessage = `정답 확인`;
                setIsQuizMode(false); // 퀴즈모드 종료
              }
            }, 1000);
          }

          console.log(`출제 요청 메시지: ${requestMessage}`);

          axios.post("/api/clova/startQuiz", {
            message: requestMessage,
            nickname,
          })
          .then((quizResponse) => {
            let quizMessage = quizResponse.data.result?.message?.content || "응답을 가져올 수 없습니다.";
            //console.log("퀴즈 API 응답:", JSON.stringify(quizResponse.data));
            console.log(`Clova 응답 (퀴즈 진행): ${quizMessage}`);

            addQuizMessage(quizMessage.replace(/{user_name}/g, nickname));
            setQuizRound((prev) => (prev < 5 ? prev + 1 : prev));
          })
          .catch((error) => {
            console.error("🚨 Clova API 오류:", error);
            addMessage("assistant", "죄송합니다. 오류가 발생했습니다.");
          })
          .finally(() => {
            setIsWaitingForAI(false);
          });
        }, 0);
      }
    } catch (error) {
      addMessage("assistant", "오류가 발생했습니다.");
    } finally {
      setIsWaitingForAI(false);
    }
  };

  return (
    <div id="wrap" className="quiz-page">
      <HeaderSub />
      <main id="main" role="main" ref={chatWrapRef}>
        <div className="chat-wrap">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`chat-item-wrap ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.type === "quiz" ? (
                <div className={`chat-item ${msg.className || ""} ${isQuizMode ? "state-quiz" : ""}`}>
                  {msg.question}
                  <div className="options">
                    {msg.options.map((option, idx) => (
                      <button
                        key={idx}
                        disabled={!isQuizMode}
                        onClick={() => fetchMessage(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="chat-item">{msg.content}</div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
      <ChatBar
        onSendMessage={fetchMessage}
        isDisabled={isWaitingForAI || (nicknameConfirmed && !isQuizMode)}
        isQuizMode={isQuizMode}
      />
    </div>
  );
};

export default QuizPage;
