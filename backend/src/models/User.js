const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher", "student"], required: true },
    phone: { type: String },
    login: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: "uploads/default.png" },
    passport: {
      series: { type: String, default: "" },
      number: { type: String, default: "" }
    }
  },
  { timestamps: true } // ✅ Автоматическое создание `createdAt` и `updatedAt`
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
