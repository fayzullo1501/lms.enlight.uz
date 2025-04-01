import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Курс
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // Отправитель
    message: { type: String, required: true },                                        // Сообщение
    timestamp: { type: Date, default: Date.now },                                     // Время
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
