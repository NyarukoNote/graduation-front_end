import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./aichatbot.css";

const AIChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // ✅ sessionStorage에서 채팅 내역 불러오기
  useEffect(() => {
    const savedChat = sessionStorage.getItem("chatHistory");
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat)); // JSON -> 객체 변환
    }
  }, []);

  // ✅ 채팅 내역 업데이트 및 저장
  const updateChatHistory = (newChat) => {
    setChatHistory(newChat);
    sessionStorage.setItem("chatHistory", JSON.stringify(newChat)); // JSON 문자열로 저장
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
  
    const newChat = [...chatHistory, { role: "user", content: userInput }];
    updateChatHistory(newChat);
    setUserInput(""); // 여기로 이동
  
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
  
      if (!response.ok) throw new Error("서버 응답 오류");
  
      const data = await response.json();
      console.log("서버 응답:", data);
  
      updateChatHistory([...newChat, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 입력 필드 제어 함수
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // ✅ 채팅창이 업데이트되면 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // ✅ Enter 키 입력 시 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
              <span className="sender">{msg.role === "user" ? "👤 You" : "🤖 AI"}</span>
              <p className="message-content">{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
        <input
  type="text"
  value={userInput}
  onChange={handleInputChange}
  placeholder="메시지를 입력하세요..."
  className="chat-input"
  onKeyDown={handleKeyPress}
/>
          <button onClick={sendMessage} className="send-button">
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}; 

export default AIChatbot;