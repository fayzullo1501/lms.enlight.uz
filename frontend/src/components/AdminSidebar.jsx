import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiCalendar, FiLogOut } from "react-icons/fi";
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate(); // Хук для навигации

  // Функция выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // Перенаправление на страницу входа
  };

  return (
    <div className="admin-sidebar">
      <div className="logo">
        <h2>Enlight<span className="dot">.</span></h2>
      </div>
      <nav className="menu">
        <NavLink to="/dashboard" className="menu-item">
          <FiHome className="icon" /> Главная
        </NavLink>
        <NavLink to="/admin/courses" className="menu-item">
          <FiBook className="icon" /> Курсы
        </NavLink>
        <NavLink to="/admin/users" className="menu-item">
          <FiUsers className="icon" /> Пользователи
        </NavLink>
        <NavLink to="/admin/events" className="menu-item">
          <FiCalendar className="icon" /> Мероприятия
        </NavLink>
      </nav>
      <div className="logout">
        <button className="menu-item logout-btn" onClick={handleLogout}>
          <FiLogOut className="icon" /> Выйти
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
