const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher", "student"], required: true },
    phone: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: "uploads/default.jpg" },
    passport: {
      series: { type: String },
      number: { type: String }
    },
    createdAt: { type: Date, default: Date.now } // ✅ Дата регистрации
  },
  { timestamps: true } // Автоматически добавляет createdAt и updatedAt
);

// 📌 Проверяем, существует ли модель, прежде чем её создать
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
