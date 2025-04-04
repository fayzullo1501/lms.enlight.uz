import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import "../styles/CourseHeader.css";

const CourseHeader = ({ courseId }) => {
  const location = useLocation();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`);
        setCourse(data);
      } catch (error) {
        console.error("Ошибка загрузки курса:", error);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // ✅ Определяем заголовок страницы на основе маршрута
  const pageTitles = {
    "/dashboard": "Главная",
    "/teacher/courses": "Мои курсы",
    [`/teacher/course/${courseId}`]: "Статистика курса",
    [`/teacher/course/${courseId}/lessons`]: "Уроки",
    [`/teacher/course/${courseId}/students`]: "Студенты",
    [`/teacher/course/${courseId}/materials`]: "Материалы",
    [`/teacher/course/${courseId}/lessons/:lessonId`]: "Детали урока",
    "/student/courses": "Мои курсы",
    [`/student/course/${courseId}`]: course ? course.title : "Курс",
    [`/student/course/${courseId}/lessons`]: "Уроки",
  };

  // ✅ Находим наиболее подходящий заголовок
  let pageTitle = "Загрузка...";
  Object.keys(pageTitles).forEach((path) => {
    if (location.pathname.includes(path.replace(":courseId", courseId || "").replace(":lessonId", ""))) {
      pageTitle = pageTitles[path];
    }
  });

  return (
    <div className="course-header">
      <h2 className="page-title">{pageTitle}</h2>
      <div className="header-right">
        <FiBell className="notification-icon" />
      </div>
    </div>
  );
};

export default CourseHeader;
