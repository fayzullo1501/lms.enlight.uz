const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const User = mongoose.model("User", new mongoose.Schema({
  fullName: String,
  role: String,
  phone: String,
  login: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  passport: { series: String, number: String }
}));

// 🔐 Регистрация нового пользователя
router.post("/register", async (req, res) => {
  const { login, password, fullName, role, phone, email, passportSeries, passportNumber } = req.body;

  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ message: "Этот логин уже занят" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      login,
      password: hashedPassword,
      fullName,
      role,
      phone,
      email,
      passport: { series: passportSeries, number: passportNumber },
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Пользователь зарегистрирован", 
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone,
        login: newUser.login,
        email: newUser.email,
        passport: newUser.passport,
        createdAt: newUser.createdAt
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка регистрации" });
  }
});

// 🔐 Авторизация пользователя
router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ login }, { email: login }] });

    if (!user) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
