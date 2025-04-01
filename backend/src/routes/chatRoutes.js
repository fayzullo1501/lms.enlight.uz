import express from "express";
import Chat from "../models/Chat.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const router = express.Router();

// 📌 1️⃣ Отправка сообщения в чат курса
router.post("/:courseId/messages", async (req, res) => {
  try {
    const { sender, message } = req.body;
    const { courseId } = req.params;

    if (!sender || !message) {
      return res.status(400).json({ message: "❌ Отправитель и сообщение обязательны!" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    const newMessage = new Chat({ course: courseId, sender, message });
    await newMessage.save();

    res.status(201).json({ message: "✅ Сообщение отправлено!", chat: newMessage });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при отправке сообщения!", error });
  }
});

// 📌 2️⃣ Получение всех сообщений чата курса
router.get("/:courseId/messages", async (req, res) => {
  try {
    const { courseId } = req.params;

    const messages = await Chat.find({ course: courseId })
      .populate("sender", "fullName role")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при загрузке сообщений!", error });
  }
});

// 📌 3️⃣ Удаление сообщения из чата
router.delete("/:courseId/messages/:messageId", async (req, res) => {
  try {
    const { courseId, messageId } = req.params;

    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "❌ Сообщение не найдено!" });
    }

    await Chat.findByIdAndDelete(messageId);
    res.json({ message: "✅ Сообщение удалено!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при удалении сообщения!", error });
  }
});

export default router;
