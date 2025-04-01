const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Курс
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Отправитель (учитель/студент)
    message: { type: String, required: true }, // Текст сообщения
    timestamp: { type: Date, default: Date.now }, // Время отправки
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
