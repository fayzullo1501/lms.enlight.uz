const multer = require("multer");
const path = require("path");

// Хранилище файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // Папка для хранения фото
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Фильтр: только изображения
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("❌ Разрешены только изображения!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
