import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./aichatbot.css";

const AIChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // 처음 로드될 때 sessionStorage에서 초기 메시지 가져오기
  useEffect(() => {
    const initialQuery = sessionStorage.getItem("initialQuery");
    if (initialQuery) {
      sessionStorage.removeItem("initialQuery"); // 사용 후 삭제
      sendMessage(initialQuery); // 바로 메시지 전송
    }
  }, []);

  const sendMessage = async (message = userInput) => {
    if (!message.trim()) return;

    setUserInput("");

    const newChat = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newChat);

    try {
      const response = await fetch("http://192.168.0.96:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemma3:4b",
          prompt: message,
        }),
      });

      if (!response.ok) throw new Error("서버 응답 오류");

      const data = await response.json();

      setChatHistory([
        ...newChat,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // 줄바꿈 방지
      sendMessage();
    }
  };

  return (
    <div className="ai-chatbot">
      <Navbar />
      <Header activeItem="AI" />
      <div className="chat-container">
        <h1>AI Chatbot</h1>
        <div className="chat-box" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <span className="sender">
                {msg.role === "user" ? "👤 You" : "🤖 AI"}
              </span>
              <p className="message-content">{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="chat-input"
          />
          <button onClick={() => sendMessage()} className="send-button">
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
