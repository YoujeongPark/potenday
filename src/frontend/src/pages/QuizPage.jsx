import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import HeaderSub from "../layout/HeaderSub";  // 프로젝트 구조에 맞춰 경로 조정
import ChatBar from "../component/ChatBar";   // 프로젝트 구조에 맞춰 경로 조정
import axios from "axios";

const QuizPage = () => {
  const [messages, setMessages] = useState([]);
  const mainRef = useRef(null);

  // [AI 응답 대기 / 대화 종료 / 일반 채팅 모드]
  const [isWaiting, setIsWaiting] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [isChatMode, setIsChatMode] = useState(true);

  // [닉네임]
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const [nickname, setNickname] = useState("");

  // [퀴즈]
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizTriggered, setQuizTriggered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizUserAnswers, setQuizUserAnswers] = useState([]);

  // 메시지가 추가될 때마다 스크롤을 하단으로 이동
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages]);

  //---------------------------------------------------------------------------
  // [메시지 추가 헬퍼]
  //   - role: "system" | "assistant" | "user"
  //   - 메시지를 추가할 때마다 콘솔에 표시
  //---------------------------------------------------------------------------
  const addMessage = (newMessage) => {
    const uniqueId = Date.now() + Math.random();
    setMessages((prev) => [...prev, { ...newMessage, id: uniqueId }]);
    console.log(`[MESSAGE - ${newMessage.role}]`, newMessage);
  };

  //---------------------------------------------------------------------------
  // [AI / 시스템 메시지를 "대기→추가→대기해제" 형태로 추가하는 헬퍼]
  //   - 로컬에서 즉시 띄울 메시지라도, 요구사항에 따라
  //     잠시 "AI 응답을 기다리는 중..."을 표시했다가 메시지를 보여주고 싶을 수 있음
  //---------------------------------------------------------------------------
  const addSystemOrAiMessageWithDelay = (messageObj, delay = 500) => {
    setIsWaiting(true);
    setTimeout(() => {
      addMessage(messageObj);
      setIsWaiting(false);
    }, delay);
  };

  //---------------------------------------------------------------------------
  // [페이지 첫 진입 시: "안녕?" → 서버 → 첫 메시지]
  //---------------------------------------------------------------------------
  useEffect(() => {
    const InitialMessage = async () => {
      try {
        setIsWaiting(true);
        const response = await axios.post("/api/clova/startChat", { message: "안녕?" });
        console.log("[startChat]:", response);

        const messageContent = response.data?.result?.message?.content ?? "죄송합니다. 응답을 받아올 수 없습니다.";
        setMessages([]);
        const newMessage = {
          role: "assistant",
          content: messageContent
        };
        addSystemOrAiMessageWithDelay(newMessage, 600);
      } catch (error) {
        console.log("[startChat Error]:", error);
        setMessages([]);
        const errorMessage = {
          role: "system",
          content: "오류가 발생했습니다. 다시 시도해주세요."
        };
        addSystemOrAiMessageWithDelay(errorMessage, 600);
      }
    };
    InitialMessage();
  }, []);

  //---------------------------------------------------------------------------
  // [퀴즈 모드 전환]
  //   - 닉네임이 설정되고, 일반 채팅 상태고, 아직 퀴즈 시작 안했으면 자동으로 퀴즈 시작
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (isNicknameSet && isChatMode && !isQuizMode && !quizTriggered && messages.length > 0) {
      setTimeout(() => {
        autoTriggerQuizStart();
        setQuizTriggered(true);
      }, 1000);
    }
  }, [isNicknameSet, isChatMode, isQuizMode, quizTriggered, messages]);

  //---------------------------------------------------------------------------
  // [자동 퀴즈 시작 → 서버 요청 → 5문제 파싱]
  //---------------------------------------------------------------------------
  const autoTriggerQuizStart = async () => {
    setIsChatMode(false); // 일반 채팅 중단
    setIsQuizMode(true);  // 퀴즈 모드 ON

    // AI 응답 대기
    setIsWaiting(true);
    try {
      const response = await axios.post("/api/clova/startQuiz", { message: "퀴즈 시작" });
      console.log("[startQuiz]:", response);

      const quizString = response.data?.result?.message?.content ?? "";
      const quizData = parseQuizResponse(quizString);
      setQuizQuestions(quizData);
      setCurrentQuizIndex(0);
      setQuizUserAnswers([]);

      // 첫 문제 메시지 표시
      if (quizData.length > 0) {
        addMessage({
          role: "system",
          type: "quizQuestion",
          questionNumber: 1,
          content: quizData[0].question,
          options: quizData[0].options
        });
      }
    } catch (error) {
      console.log("[startQuiz Error]:", error);
      const systemError = {
        role: "system",
        content: "퀴즈 중 오류가 발생했습니다. 다시 시도해주세요."
      };
      addSystemOrAiMessageWithDelay(systemError, 600);
      setIsQuizMode(false);
    } finally {
      setIsWaiting(false);
    }
  };

  //---------------------------------------------------------------------------
  // [닉네임 유효성 검사]
  //---------------------------------------------------------------------------
  const isValidNickname = (str) => {
    const validPattern = /^[가-힣a-zA-Z\s]+$/;
    const invalidPattern = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
    return validPattern.test(str) && !invalidPattern.test(str);
  };

  //---------------------------------------------------------------------------
  // [사용자 메시지 전송 → startChat 요청]
  //---------------------------------------------------------------------------
  const sendMessage = async (userMessage, role = "user") => {
    if (!userMessage.trim()) return;
    if (!isChatMode && role === "user") return;
    if (isChatEnded) return;

    const userMsgObj = { role, content: userMessage };
    setMessages((prev) => [...prev, { ...userMsgObj, id: Date.now() + Math.random() }]);
    console.log(`[MESSAGE]`, userMsgObj);

    if (role === "user") {
      setIsWaiting(true);

      // 닉네임 미설정이면
      if (!isNicknameSet) {
        if (!isValidNickname(userMessage)) {
          setTimeout(() => {
            const invalidNick = {
              role: "system",
              content: "유효하지 않은 닉네임입니다. 다시 입력해주세요."
            };
            addMessage(invalidNick);
            setIsWaiting(false);
          }, 600);
          return;
        } else {
          setIsNicknameSet(true);
          setNickname(userMessage);
        }
      }

      try {
        const response = await axios.post("/api/clova/startChat", { message: userMessage });
        console.log("[startChat sendMessage]:", response);

        const messageContent = response.data?.result?.message?.content ?? "죄송합니다. 응답을 받아올 수 없습니다.";
        const assistantMsg = {
          role: "assistant",
          content: messageContent
        };
        setTimeout(() => {
          addMessage(assistantMsg);
          setIsWaiting(false);
        }, 600);
      } catch (error) {
        console.log("[startChat sendMessage Error]:", error);
        const systemError = {
          role: "system",
          content: "오류가 발생했습니다. 다시 시도해주세요."
        };
        setTimeout(() => {
          addMessage(systemError);
          setIsWaiting(false);
        }, 600);
      }
    }
  };

  //---------------------------------------------------------------------------
  // [서버로 받은 퀴즈 문자열 파싱 → 문제/선택지/정답 배열]
  //---------------------------------------------------------------------------
  const parseQuizResponse = (responseText) => {
    console.log("[api 응답 퀴즈 5문제]:", responseText);
    const parts = responseText
      .split(/문제\s*\d+\s*:\s*/)
      .filter((part) => part.trim() !== "");

    const quizArray = [];

    parts.forEach((part) => {
      const lines = part
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== "");

      if (lines.length >= 3) {
        const questionText = lines[0];
        const optionsLine = lines.find((line) => line.startsWith("선택지"));
        const answerLine = lines.find((line) => line.includes("정답"));

        if (questionText && optionsLine && answerLine) {
          const options = optionsLine
            .replace(/선택지\s*:\s*/i, "")
            .split(",")
            .map((opt) => opt.trim());

          const answer = answerLine
            .replace(/정답\s*:\s*/i, "")
            .trim();

          quizArray.push({ question: questionText, options, answer });
        }
      }
    });
    console.log("[퀴즈 5문제 array]:", quizArray);
    return quizArray;
  };

  //---------------------------------------------------------------------------
  // [퀴즈 문제 메시지 추가]
  //---------------------------------------------------------------------------
  const addQuizQuestionMessage = (quizItem, questionNumber) => {
    const msgObj = {
      role: "system",
      type: "quizQuestion",
      questionNumber,
      content: quizItem.question,
      options: quizItem.options
    };
    addMessage(msgObj);
  };

  //---------------------------------------------------------------------------
  // [퀴즈 선택지 버튼 클릭]
  //   - 문제 1 ~ 5까지 클릭
  //   - 이미 선택한 문제는 disabled 처리
  //---------------------------------------------------------------------------
  const handleQuizOptionClick = (selectedOption, questionNumber) => {
    const userSelectionMessage = {
      role: "user",
      content: selectedOption
    };
    addMessage(userSelectionMessage);

    const questionIndex = questionNumber - 1;
    const updatedAnswers = [...quizUserAnswers];
    updatedAnswers[questionIndex] = selectedOption;
    setQuizUserAnswers(updatedAnswers);

    if (questionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setCurrentQuizIndex(nextIndex);
        addQuizQuestionMessage(quizQuestions[nextIndex], nextIndex + 1);
      }, 500);
    } else { // 마지막 문제 선택 → 채점
      setTimeout(() => {
        evaluateQuiz(updatedAnswers);
      }, 500);
    }
  };

  //---------------------------------------------------------------------------
  // [퀴즈 채점 후 → 해설 / 안내]
  //---------------------------------------------------------------------------
  const evaluateQuiz = async (finalAnswers) => {
    let wrongCount = 0;
    const wrongDetails = [];

    quizQuestions.forEach((q, idx) => {
      if (finalAnswers[idx] !== q.answer) {
        wrongCount++;
        wrongDetails.push({ questionNumber: idx + 1, correctAnswer: q.answer });
      }
    });

    const score = (quizQuestions.length - wrongCount) * 20;
    const userNickname = nickname || "사용자";

    setIsWaiting(true);
    setTimeout(() => {
      if (score === 100) {
        addMessage({
          role: "system",
          content: `짜잔! 🎊 ${userNickname}님의 신조어 점수는 ${score}점이에요! 대단해요!`
        });
      } else {
        addMessage({
          role: "system",
          content: `${userNickname}님의 신조어 점수는 ${score}점 입니다!`
        });
      }
      setIsWaiting(false);
    }, 500);

    // 100점 미만이라면 해설
    if (score < 100 && wrongDetails.length > 0) {
      setIsWaiting(true);
      const explanationRequest = wrongDetails
        .map((item) => `${item.questionNumber}번 {${item.correctAnswer}} 해설`)
        .join("\n");

      try {
        const response = await axios.post("/api/clova/startQuiz", {
          message: explanationRequest
        });
        console.log("[startQuiz explanationRequest]:", response);

        const explanationContent =
          response.data?.result?.message?.content ?? "죄송합니다. 응답을 받아올 수 없습니다.";

        setTimeout(() => {
          const assistantMsg = {
            role: "assistant",
            content: explanationContent
          };
          addMessage(assistantMsg);
          setIsWaiting(false);
        }, 1000);
      } catch (error) {
        console.log("[startQuiz explanationRequest Error]:", error);
        const systemError = {
          role: "system",
          content: "해설 요청 중 오류가 발생했습니다. 다시 시도해주세요."
        };
        setTimeout(() => {
          addMessage(systemError);
          setIsWaiting(false);
        }, 500);
      }
    }

    setIsQuizMode(false);

    setTimeout(() => {
      setIsWaiting(true);
      setTimeout(() => {
        const finalMsg = {
          role: "system",
          type: "finalOptions",
          content: "신조어 감이 좀 잡히셨나요? 🤔 아직 헷갈리시면, 저랑 조금 더 연습해볼까요?"
        };
        addMessage(finalMsg);
        setIsWaiting(false);
      }, 500);
    }, 2000);
  };

  // ---------------------------------------------------------
  // [모든 버튼 클릭 시 → 사용자 메시지 추가 후, 콜백 실행]
  // ---------------------------------------------------------
  const handleButtonClick = (label, callback) => {
    const userSelectionMessage = {
      role: "user",
      content: `${label}`,
    };
    addMessage(userSelectionMessage);
    callback();
  };

  //---------------------------------------------------------------------------
  // [마지막 안내 메시지 버튼 핸들러들]
  //---------------------------------------------------------------------------

  // 퀴즈 다시 풀기
  const handleRetryQuiz = () => {
    setIsWaiting(true);
    setTimeout(() => {
      setIsQuizMode(false);
      setQuizTriggered(false);
      setQuizQuestions([]);
      setCurrentQuizIndex(0);
      setQuizUserAnswers([]);
      autoTriggerQuizStart();
      setIsWaiting(false);
    }, 600);
  };

  // 신조어 활용 실전 대화
  const handlePracticeConversation = async () => {
    setIsWaiting(true);
    try {
      const response = await axios.post("/api/clova/addQuiz", { message: "안녕?" });
      console.log("[addQuiz practice start]:", response);

      const messageContent =
        response.data?.result?.message?.content ?? "죄송합니다. 응답을 받아올 수 없습니다.";

      setTimeout(() => {
        const assistantMsg = {
          role: "assistant",
          content: messageContent
        };
        addMessage(assistantMsg);

        // 일반 채팅 모드
        setIsChatMode(true);
        setIsQuizMode(false);
        setIsWaiting(false);
      }, 600);
    } catch (error) {
      console.log("[addQuiz practice start Error]:", error);
      setTimeout(() => {
        const systemError = {
          role: "system",
          content: "실전 대화 요청 중 오류가 발생했습니다. 다시 시도해주세요."
        };
        addMessage(systemError);
        setIsWaiting(false);
      }, 600);
    }
  };

  // 종료
  const handleExit = () => {
    setIsWaiting(true);
    setTimeout(() => {
      const exitMsg = {
        role: "system",
        content: "다음에 또 만나요!"
      };
      addMessage(exitMsg);
      setIsChatEnded(true);
      setIsWaiting(false);
    }, 500);
  };

  //---------------------------------------------------------------------------
  // [렌더링 파트]
  //---------------------------------------------------------------------------
  return (
    <div id="wrap" className="quiz-page">
      <HeaderSub />
      <main id="main" role="main" ref={mainRef}>
        {/* 메시지 영역 */}
        <div className="chat-wrap">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`chat-item-wrap ${msg.role} ${
                msg.type === "quizQuestion" ? "state-quiz" : ""
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.type === "quizQuestion" ? ( // 퀴즈 문제 메시지
                <div className="chat-item">
                  {`문제 ${msg.questionNumber} : ${msg.content}`}
                  <div className="options">
                    {msg.options.map((option, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleQuizOptionClick(option, msg.questionNumber)}
                        disabled={quizUserAnswers[msg.questionNumber - 1] !== undefined}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : msg.type === "finalOptions" ? ( // 마지막 안내 메시지
                <div className="chat-item system">
                  {msg.content}
                  <div className="options">
                    <button
                      type="button"
                      onClick={() => handleButtonClick("퀴즈 다시 풀기", handleRetryQuiz)}
                    >
                      퀴즈 다시 풀기
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleButtonClick("신조어 활용 실전 대화하기", handlePracticeConversation)
                      }
                    >
                      신조어 활용 실전 대화하기
                    </button>
                    <button
                      type="button"
                      onClick={() => handleButtonClick("종료", handleExit)}
                    >
                      종료
                    </button>
                  </div>
                </div>
              ) : ( // 그 외 (assistant/system/user) 일반 메시지
                <div
                  className={`chat-item ${msg.role} ${
                    msg.content.includes("신조어 점수") ? "state-score" : ""
                  }`}
                >
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      <ChatBar
        onSend={(msg) => sendMessage(msg, "user")}
        isWaiting={isWaiting}
        isQuizMode={isQuizMode}
        isChatEnded={isChatEnded}
      />
    </div>
  );
};

export default QuizPage;
