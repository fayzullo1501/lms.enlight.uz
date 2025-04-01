import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiFileText, FiMessageCircle, FiLogOut, FiArrowLeft } from "react-icons/fi";
import "../styles/StudentCourseSidebar.css";

const StudentCourseSidebar = ({ courseId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="student-course-sidebar">
      <div className="logo">
        <h2>Enlight<span className="dot">.</span></h2>
      </div>
      <nav className="menu">
      <NavLink to={`/student/courses`} className="menu-item">
          <FiArrowLeft className="icon" /> Назад
        </NavLink>
        <NavLink to={`/student/course/${courseId}`} end className="menu-item">
          <FiHome className="icon" /> Главная
        </NavLink>
        <NavLink to={`/student/course/${courseId}/lessons`} className="menu-item">
          <FiBook className="icon" /> Уроки
        </NavLink>
        <NavLink to={`/student/course/${courseId}/participants`} className="menu-item">
          <FiUsers className="icon" /> Участники
        </NavLink>
        <NavLink to={`/student/course/${courseId}/materials`} className="menu-item">
          <FiFileText className="icon" /> Материалы
        </NavLink>
        <NavLink to={`/student/course/${courseId}/chat`} className="menu-item">
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

export default StudentCourseSidebar;
