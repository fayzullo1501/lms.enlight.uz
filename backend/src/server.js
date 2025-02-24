import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 📌 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 📌 Раздача статических файлов (фото пользователей)
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// 📌 API Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Добавили маршруты для загрузки фото

// 📌 Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
