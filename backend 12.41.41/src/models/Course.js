const mongoose = require("mongoose");

// ✅ Схема материалов (для файлов и ссылок)
const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Название, введенное пользователем
  fileName: { type: String, required: true }, // Реальное имя файла
  fileUrl: { type: String, required: true }, // URL файла или ссылка
  fileType: { type: String, enum: ["file", "link"], required: true }, // Файл или ссылка
  createdAt: { type: Date, default: Date.now } // Дата добавления
});

// ✅ Схема уроков
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, default: "Описание отсутствует" },
  date: { type: Date, required: true },
  duration: { type: Number, required: true, default: 60 },
  banner: { type: String, default: "" },
  materials: [MaterialSchema], // Используем MaterialSchema
  conferenceLink: { type: String, default: "" },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Список пользователей, поставивших лайк
}, { timestamps: true });

// ✅ Схема курса
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, enum: ["ru", "en", "uz"], required: true },
  duration: { type: Number, required: true },
  format: { type: String, enum: ["online", "offline"], required: true },
  banner: { type: String, default: "uploads/default-banner.jpg" },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Связь студентов с пользователями
  payments: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    status: { type: String, enum: ["paid", "pending"], default: "pending" }
  }],
  lessons: [LessonSchema], // Связь с уроками
  materials: [MaterialSchema], // Общие материалы курса
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
module.exports = Course;
