const express = require("express");
const multer = require("multer");
const Course = require("../models/Course");

const router = express.Router();

// 📌 Настройка `multer` (используется и для баннера курса, и для материалов)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Файлы сохраняем в `uploads/`
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Уникальное имя файла
  },
});

const upload = multer({ storage });

// 📌 1️⃣ Создание курса (Админ)
router.post("/", upload.single("banner"), async (req, res) => {
  try {
    const { title, description, language, duration, format, mentor } = req.body;

    if (!title || !description || !language || !duration || !format || !mentor) {
      return res.status(400).json({ message: "❌ Все поля обязательны!" });
    }

    const newCourse = new Course({
      title,
      description,
      language,
      duration,
      format,
      banner: req.file ? `uploads/${req.file.filename}` : "uploads/default-banner.jpg",
      mentor,
    });

    await newCourse.save();
    res.status(201).json({ message: "✅ Курс успешно создан!", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при создании курса!", error });
  }
});

// 📌 2️⃣ Получение всех курсов
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("mentor", "fullName");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при загрузке курсов!" });
  }
});

// 📌 3️⃣ Получение курса по ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("mentor students");
    if (!course) return res.status(404).json({ message: "❌ Курс не найден!" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});

// 📌 4️⃣ Удаление курса
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "❌ Курс не найден!" });

    res.json({ message: "✅ Курс успешно удалён!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Ошибка при удалении курса!" });
  }
});

// 📌 5️⃣ Обновление курса
router.put("/:id", upload.single("banner"), async (req, res) => {
  try {
    console.log("📌 Данные для обновления курса:", req.body); // ✅ Логируем данные запроса

    const { title, description, language, duration, format, mentor } = req.body;
    const courseId = req.params.id;

    // Проверяем, существует ли курс
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    // Обновляем данные курса
    course.title = title || course.title;
    course.description = description || course.description;
    course.language = language || course.language;
    course.duration = duration || course.duration;
    course.format = format || course.format;
    course.mentor = mentor || course.mentor;

    // Если загружен новый баннер, обновляем
    if (req.file) {
      course.banner = `uploads/${req.file.filename}`;
    }

    // Сохраняем изменения
    await course.save();
    res.json({ message: "✅ Курс успешно обновлён!", course });
  } catch (error) {
    console.error("❌ Ошибка при обновлении курса:", error);
    res.status(500).json({ message: "❌ Ошибка при обновлении курса!", error });
  }
});

// 📌 6️⃣ Удаление курса
router.delete("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    // Проверяем, существует ли курс
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    // Удаляем курс
    await Course.findByIdAndDelete(courseId);
    res.json({ message: "✅ Курс успешно удалён!" });
  } catch (error) {
    console.error("❌ Ошибка при удалении курса:", error);
    res.status(500).json({ message: "❌ Ошибка при удалении курса!", error });
  }
});

// 📌 7️⃣ Получение курсов для конкретного ментора
router.get("/mentor/:mentorId", async (req, res) => {
  try {
    const mentorId = req.params.mentorId;

    // Проверяем, есть ли такой пользователь и является ли он teacher
    const courses = await Course.find({ mentor: mentorId }).populate("mentor", "fullName");
    
    if (!courses.length) {
      return res.status(404).json({ message: "❌ У этого ментора нет курсов!" });
    }

    res.json(courses);
  } catch (error) {
    console.error("❌ Ошибка при получении курсов ментора:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});

// 📌 8️⃣ Добавление урока в курс (с учетом файлов)
router.post("/:id/lessons", upload.fields([{ name: "banner", maxCount: 1 }, { name: "material", maxCount: 1 }]), async (req, res) => {
  try {
    console.log("📌 Данные от клиента:", req.body);
    console.log("📌 Файлы:", req.files);

    const { title, description, date, duration, conferenceLink } = req.body;
    const courseId = req.params.id;

    if (!title || !description || !date || !duration) {
      return res.status(400).json({ message: "❌ Название, описание, дата и длительность обязательны!" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    // ✅ Формируем объект нового урока
    const newLesson = {
      title,
      description,
      date,
      duration,
      banner: req.files["banner"] ? `uploads/${req.files["banner"][0].filename}` : "",
      conferenceLink,
      mentor: course.mentor || null,
      materials: []
    };

    // ✅ Если прикреплен материал, добавляем его правильно
    if (req.files["material"] && req.files["material"].length > 0) {
      const uploadedFile = req.files["material"][0];
      newLesson.materials.push({
        title: uploadedFile.originalname, // ✅ Берем реальное имя файла как title
        fileName: uploadedFile.originalname,
        fileUrl: `uploads/${uploadedFile.filename}`,
        fileType: "file" // ✅ Теперь явно указываем "file", а не MIME-тип
      });
    }

    console.log("📌 Новый урок:", newLesson);

    // ✅ Добавляем урок в курс
    course.lessons.push(newLesson);
    await course.save();

    res.json({ message: "✅ Урок успешно добавлен!", lessons: course.lessons });
  } catch (error) {
    console.error("❌ Ошибка при добавлении урока:", error);
    res.status(500).json({ message: "❌ Внутренняя ошибка сервера", error });
  }
});


// 📌 9️⃣ Удаление урока из курса
router.delete("/:id/lessons/:lessonId", async (req, res) => {
  try {
    const { id, lessonId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    const updatedLessons = course.lessons.filter(lesson => lesson._id.toString() !== lessonId);

    if (updatedLessons.length === course.lessons.length) {
      return res.status(404).json({ message: "❌ Урок не найден!" });
    }

    course.lessons = updatedLessons;
    await course.save();

    res.json({ message: "✅ Урок успешно удалён!", lessons: course.lessons });
  } catch (error) {
    console.error("❌ Ошибка при удалении урока:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});

// 📌 🔟 Получение всех уроков курса
router.get("/:id/lessons", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    if (!course.lessons || course.lessons.length === 0) {
      return res.status(200).json({ message: "ℹ️ Уроки отсутствуют.", lessons: [] });
    }

    const lessonsWithMentor = await Course.findById(req.params.id).populate("lessons.mentor", "fullName");
    res.json({ message: "✅ Уроки загружены!", lessons: lessonsWithMentor.lessons });
  } catch (error) {
    console.error("❌ Ошибка при получении уроков:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


// 📌 1️⃣1️⃣ Добавление студентов в курс (массив студентов)
router.post("/:id/students", async (req, res) => {
  try {
    const { studentIds } = req.body; // ✅ Теперь получаем массив студентов
    const courseId = req.params.id;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "❌ Выберите хотя бы одного студента!" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    // ✅ Добавляем только новых студентов (без дубликатов)
    const newStudents = studentIds.filter(id => !course.students.includes(id));
    course.students.push(...newStudents);
    
    await course.save();
    res.json({ message: "✅ Студенты успешно добавлены в курс!", students: course.students });
  } catch (error) {
    console.error("❌ Ошибка при добавлении студентов:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});

// 📌 1️⃣2️⃣ Удаление студентов из курса (групповое удаление)
router.delete("/:id/students", async (req, res) => {
  try {
    const { studentIds } = req.body;
    const courseId = req.params.id;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "❌ Не выбраны студенты для удаления!" });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: { $in: studentIds } } },
      { new: true }
    ).populate("students", "fullName phone email");

    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    res.json({ message: "✅ Студенты успешно удалены!", students: course.students });
  } catch (error) {
    console.error("❌ Ошибка при удалении студентов:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


// 📌 1️⃣3️⃣ Получение списка студентов курса
router.get("/:id/students", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("students", "fullName phone email");
    
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    res.json(course.students);
  } catch (error) {
    console.error("❌ Ошибка при получении студентов курса:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


/// 📌 1️⃣4️⃣ Добавление материала в курс
router.post("/:id/materials", upload.single("file"), async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, fileType, fileUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "❌ Название материала обязательно!" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    // ✅ Определяем URL файла (если это файл — берем из `req.file`)
    const newMaterial = {
      title,
      fileName: req.file ? req.file.originalname : title, // Если файл, берем реальное имя
      fileUrl: req.file ? `uploads/${req.file.filename}` : fileUrl,
      fileType: req.file ? "file" : "link"
    };

    course.materials.push(newMaterial);
    await course.save();

    res.json({ message: "✅ Материал успешно добавлен!", materials: course.materials });
  } catch (error) {
    console.error("❌ Ошибка при добавлении материала:", error);
    res.status(500).json({ message: "❌ Ошибка при добавлении материала!" });
  }
});

// 📌 1️⃣5️⃣ Удаление материала из курса
router.delete("/:id/materials/:materialId", async (req, res) => {
  try {
    const { id, materialId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    const materialIndex = course.materials.findIndex(material => material._id.toString() === materialId);
    if (materialIndex === -1) {
      return res.status(404).json({ message: "❌ Материал не найден!" });
    }

    course.materials.splice(materialIndex, 1);
    await course.save();

    res.json({ message: "✅ Материал успешно удалён!", materials: course.materials });
  } catch (error) {
    console.error("❌ Ошибка при удалении материала:", error);
    res.status(500).json({ message: "❌ Ошибка при удалении материала!" });
  }
});

// 📌 1️⃣6️⃣ Получение списка материалов курса
router.get("/:id/materials", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "❌ Курс не найден!" });
    }

    res.json(course.materials);
  } catch (error) {
    console.error("❌ Ошибка при получении материалов:", error);
    res.status(500).json({ message: "❌ Ошибка при получении материалов!" });
  }
});


// 📌 1️⃣7️⃣ Получение курсов, в которых участвует студент
router.get("/student/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Находим курсы, в которых этот студент записан
    const courses = await Course.find({ students: studentId }).populate("mentor", "fullName");

    res.json(courses);
  } catch (error) {
    console.error("❌ Ошибка при получении курсов студента:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


// 📌 18 API для получения одного урока
router.get("/:courseId/lessons/:lessonId", async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId).populate("lessons.mentor", "fullName");
    if (!course) return res.status(404).json({ message: "❌ Курс не найден!" });

    const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
    if (!lesson) return res.status(404).json({ message: "❌ Урок не найден!" });

    res.json(lesson);
  } catch (error) {
    console.error("❌ Ошибка при получении урока:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


// 📌 19 API для лайков к уроку
router.post("/:courseId/lessons/:lessonId/like", async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "❌ Курс не найден!" });

    const lessonIndex = course.lessons.findIndex(lesson => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) return res.status(404).json({ message: "❌ Урок не найден!" });

    let lesson = course.lessons[lessonIndex];

    if (!lesson.likes) lesson.likes = []; // Инициализируем массив лайков

    if (lesson.likes.includes(userId)) {
      // Убираем лайк
      lesson.likes = lesson.likes.filter(id => id.toString() !== userId);
    } else {
      // Добавляем лайк
      lesson.likes.push(userId);
    }

    await course.save();
    res.json({ message: "✅ Лайк обновлён!", likes: lesson.likes });
  } catch (error) {
    console.error("❌ Ошибка при лайке урока:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


// 📌 20 API для скачивания материалов урока
router.get("/:courseId/lessons/:lessonId/materials/:materialId", async (req, res) => {
  try {
    const { courseId, lessonId, materialId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "❌ Курс не найден!" });

    const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
    if (!lesson) return res.status(404).json({ message: "❌ Урок не найден!" });

    const material = lesson.materials.find(mat => mat._id.toString() === materialId);
    if (!material) return res.status(404).json({ message: "❌ Материал не найден!" });

    res.json({ fileUrl: material.fileUrl });
  } catch (error) {
    console.error("❌ Ошибка при скачивании материала:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


// 📌 21 API для обновления данных урока
router.put("/:courseId/lessons/:lessonId", async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, description, date, duration, conferenceLink, banner } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "❌ Курс не найден!" });

    const lessonIndex = course.lessons.findIndex(lesson => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) return res.status(404).json({ message: "❌ Урок не найден!" });

    let lesson = course.lessons[lessonIndex];

    // Обновляем данные
    lesson.title = title || lesson.title;
    lesson.description = description || lesson.description;
    lesson.date = date || lesson.date;
    lesson.duration = duration || lesson.duration;
    lesson.conferenceLink = conferenceLink || lesson.conferenceLink;
    lesson.banner = banner || lesson.banner;

    await course.save();
    res.json({ message: "✅ Урок обновлён!", lesson });
  } catch (error) {
    console.error("❌ Ошибка при обновлении урока:", error);
    res.status(500).json({ message: "❌ Ошибка сервера!" });
  }
});


module.exports = router;
