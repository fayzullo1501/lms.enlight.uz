import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiCalendar, FiSettings, FiLogOut } from "react-icons/fi";
import "../styles/StudentSidebar.css";

const StudentSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="student-sidebar">
      <div className="logo">
        <h2>Enlight<span className="dot">.</span></h2>
      </div>
      <nav className="menu">
        <NavLink to="/dashboard" className="menu-item">
          <FiHome className="icon" /> Главная
        </NavLink>
        <NavLink to="/student/courses" className="menu-item">
          <FiBook className="icon" /> Мои курсы
        </NavLink>
        <NavLink to="/student/events" className="menu-item">
          <FiCalendar className="icon" /> Мероприятия
        </NavLink>
        <NavLink to="/student/settings" className="menu-item">
          <FiSettings className="icon" /> Настройки
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

export default StudentSidebar;
