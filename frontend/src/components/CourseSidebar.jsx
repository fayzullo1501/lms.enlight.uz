import { NavLink, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBarChart, FiBook, FiUsers, FiFileText, FiMessageCircle, FiLogOut } from "react-icons/fi";
import "../styles/CourseSidebar.css";

const CourseSidebar = ({ courseId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="course-sidebar">
      <div className="logo">
        <h2>Enlight<span className="dot">.</span></h2>
      </div>
      <nav className="menu">
        {/* ✅ Новая "Главная", которая ведет в общую панель менторов */}
        <NavLink to={`/teacher/courses`} className="menu-item">
          <FiArrowLeft className="icon" /> Назад
        </NavLink>
        {/* ✅ "Главная" курса переименована в "Статистика" */}
        <NavLink to={`/teacher/course/${courseId}`} end className="menu-item">
          <FiBarChart className="icon" /> Статистика
        </NavLink>
        <NavLink to={`/teacher/course/${courseId}/lessons`} className="menu-item">
          <FiBook className="icon" /> Уроки
        </NavLink>
        <NavLink to={`/teacher/course/${courseId}/students`} className="menu-item">
          <FiUsers className="icon" /> Студенты
        </NavLink>
        <NavLink to={`/teacher/course/${courseId}/materials`} className="menu-item">
          <FiFileText className="icon" /> Материалы
        </NavLink>
        <NavLink to={`/teacher/course/${courseId}/chat`} className="menu-item">
          <FiMessageCircle className="icon" /> Чат
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

export default CourseSidebar;
