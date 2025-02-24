const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 📌 API для получения списка всех пользователей
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select(
      "_id fullName role phone login email passport photo createdAt"
    );

    // Форматируем дату регистрации
    const formattedUsers = users.map((user) => ({
      ...user._doc,
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Нет данных",
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("❌ Ошибка при получении списка пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 📌 API для получения профиля пользователя
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "❌ Некорректный ID пользователя" });
    }

    console.log("🔍 Запрос профиля пользователя:", id);

    const user = await User.findById(id).select("fullName role photo");
    if (!user) {
      return res.status(404).json({ message: "❌ Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Ошибка при получении профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
