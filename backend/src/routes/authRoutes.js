import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router(); // <-- ОБЯЗАТЕЛЬНО!

const User = mongoose.model("User", new mongoose.Schema({
  fullName: String,
  role: String,
  phone: String,
  login: String,
  email: String,
  password: String,
  passport: { series: String, number: String }
}));

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  console.log("Получен логин:", login);

  try {
    const user = await User.findOne({ $or: [{ login }, { email: login }] });
    console.log("Найден пользователь:", user);

    if (!user) {
      console.log("Пользователь не найден!");
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Результат проверки пароля:", isMatch);

    if (!isMatch) {
      console.log("Пароль не совпадает!");
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Добавляем user._id в ответ
    res.json({
      token,
      user: {
        _id: user._id, // <-- ВАЖНО!
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


export default router;
