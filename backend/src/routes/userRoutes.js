const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

// 📌 1️⃣ Настройка `multer` для загрузки фото
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 📂 Сохраняем фото в папке uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // ✅ Уникальное имя файла
  },
});
const upload = multer({ storage });

// 📌 2️⃣ Получение списка всех пользователей
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ✅ Скрываем пароли
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при загрузке пользователей!", error });
  }
});

// 📌 3️⃣ Получение пользователя по ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "❌ Пользователь не найден!" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при загрузке пользователя!", error });
  }
});

// 📌 4️⃣ Добавление нового пользователя (с загрузкой фото)
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { fullName, role, phone, login, password, email, passport } = req.body;

    if (!fullName || !role || !login || !password) {
      return res.status(400).json({ message: "❌ Обязательные поля: ФИО, роль, логин, пароль!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      role,
      phone,
      login,
      password: hashedPassword,
      email,
      passport: passport ? JSON.parse(passport) : { series: "", number: "" },
      photo: req.file ? `uploads/${req.file.filename}` : "uploads/default.png", // ✅ Добавляем фото
    });

    await newUser.save();
    const savedUser = await User.findById(newUser._id).select("-password");

    res.status(201).json({
      message: "✅ Пользователь успешно добавлен!",
      user: savedUser
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при добавлении пользователя!", error });
  }
});

// 📌 5️⃣ Обновление пользователя (с обновлением фото)
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const { fullName, role, phone, login, email, passport } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "❌ Пользователь не найден!" });
    }

    user.fullName = fullName || user.fullName;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.login = login || user.login;
    user.email = email || user.email;
    user.passport = passport ? JSON.parse(passport) : user.passport;

    if (req.file) {
      user.photo = `uploads/${req.file.filename}`; // ✅ Обновляем фото, если загружено новое
    }

    await user.save();
    const updatedUser = await User.findById(userId).select("-password");

    res.json({ message: "✅ Пользователь успешно обновлён!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при обновлении пользователя!", error });
  }
});

// 📌 5️⃣ Удаление одного пользователя (Админ)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "❌ Пользователь не найден!" });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: "✅ Пользователь успешно удалён!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при удалении пользователя!", error });
  }
});

// 📌 6️⃣ Массовое удаление пользователей
router.delete("/", async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "❌ Укажите ID пользователей для удаления!" });
    }

    await User.deleteMany({ _id: { $in: userIds } });

    res.json({ message: `✅ Удалено пользователей: ${userIds.length}` });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при удалении пользователей!", error });
  }
});

module.exports = router;
