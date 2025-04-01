import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel.jsx"; // Панель администратора
import TeacherPanel from "../components/TeacherPanel"; // Панель учителя
import StudentPanel from "../components/StudentPanel"; // Панель студента

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (!userRole) {
      navigate("/"); // Если нет роли — отправить на логин
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Рендерим контент в зависимости от роли */}
      {role === "admin" && <AdminPanel />}
      {role === "teacher" && <TeacherPanel />}
      {role === "student" && <StudentPanel />}
      {!role && <p>Загрузка...</p>}
    </div>
  );
};

export default Dashboard;
