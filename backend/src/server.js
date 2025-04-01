import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import morgan from "morgan"; // ✅ Логирование запросов

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 📌 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Парсинг form-data
app.use(cors());

// 📌 Проверяем, установлен ли `morgan`
if (fs.existsSync("./node_modules/morgan")) {
  app.use(morgan("dev")); // ✅ Логируем все входящие запросы
}

// 📌 Раздача статических файлов
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// 📌 API Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chat", chatRoutes);

// 📌 Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 📌 Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err);
  res.status(500).json({ message: "❌ Внутренняя ошибка сервера" });
});

// 📌 Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
