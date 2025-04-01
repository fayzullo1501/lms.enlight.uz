import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import axios from "axios";
import "../styles/StudentCourseHeader.css";

const StudentCourseHeader = ({ courseId }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ✅ Определяем заголовки страниц
  const pageTitles = {
    "": "Главная",
    "/lessons": "Уроки",
    "/participants": "Участники",
    "/materials": "Материалы",
    "/chat": "Чат",
  };

  // ✅ Получаем текущий заголовок страницы
  const getPageTitle = () => {
    const path = location.pathname.replace(`/student/course/${courseId}`, ""); // Убираем courseId
    return pageTitles[path] || "Главная"; // Если путь пустой, значит "Главная"
  };

  const pageTitle = getPageTitle();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const { data } = await axios.get(`http://localhost:5001/api/users/profile/${userId}`);
        setUser(data);
      } catch (error) {
        console.error("❌ Ошибка загрузки пользователя:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="student-course-header">
      <h2 className="page-title">{pageTitle}</h2>

      <div className="header-right">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Поиск..." />
        </div>
        <FiBell className="notification-icon" />

        {user && (
          <div className="user-profile">
            <span className="user-name">{user.fullName || "Пользователь"}</span>
            <img
              src={user.photo ? `http://localhost:5001/${user.photo}` : "/default-avatar.png"}
              alt="User Avatar"
              className="user-avatar"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseHeader;
