import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5001"); // ✅ Подключаемся к серверу

const Chat = ({ courseId, userId }) => {
  const [messages, setMessages] = useState([]); // Список сообщений
  const [newMessage, setNewMessage] = useState(""); // Новое сообщение

  useEffect(() => {
    // 📌 Загружаем историю чата при загрузке компонента
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/chat/${courseId}/messages`);
        setMessages(data);
      } catch (error) {
        console.error("Ошибка загрузки сообщений:", error);
      }
    };
    fetchMessages();

    // 📌 Подписываемся на новые сообщения
    socket.on(`chat:${courseId}`, (message) => {
      console.log("📩 Новое сообщение:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off(`chat:${courseId}`);
    };
  }, [courseId]);

  // 📌 Отправка нового сообщения
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      courseId,
      sender: userId,
      message: newMessage,
    };

    try {
      // 📌 Отправляем сообщение в API
      await axios.post(`http://localhost:5001/api/chat/${courseId}/messages`, messageData);
      
      // 📌 Отправляем сообщение в реальном времени через `Socket.io`
      socket.emit("sendMessage", messageData);

      setNewMessage(""); // Очищаем поле ввода
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Чат курса</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === userId ? "sent" : "received"}`}>
            <strong>{msg.sender === userId ? "Вы" : msg.sender.fullName}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default Chat;
