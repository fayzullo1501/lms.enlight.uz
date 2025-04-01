import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import axios from "axios";
import "../styles/AdminHeader.css";

const AdminHeader = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const { data } = await axios.get(`http://localhost:5001/api/users/${userId}`);
        setUser(data);
      } catch (error) {
        console.error("❌ Ошибка загрузки пользователя:", error);
      }
    };

    fetchUser();
  }, []);

  const pageTitles = {
    "/dashboard": "Главная",
    "/admin/courses": "Курсы",
    "/admin/users": "Пользователи",
    "/admin/events": "Мероприятия",
    "/admin/settings": "Настройки",
  };

  const pageTitle = pageTitles[location.pathname] || "Панель администратора";

  const getShortName = (fullName) => {
    if (!fullName) return "Загрузка...";
    const parts = fullName.split(" ");
    return parts.length >= 2 ? `${parts[0]} ${parts[1][0]}.` : fullName;
  };

  return (
    <div className="admin-header">
      <h2 className="page-title">{pageTitle}</h2>

      <div className="header-right">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Поиск" />
        </div>
        <FiBell className="notification-icon" />
        <div className="user-profile">
          <span className="user-name">{user ? getShortName(user.fullName) : "Загрузка..."}</span>
          <img
            src={user?.photo ? `http://localhost:5001/${user.photo}` : "http://localhost:5001/uploads/default.png"}
            alt="User"
            className="user-avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
