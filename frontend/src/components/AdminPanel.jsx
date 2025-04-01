import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../styles/AdminPanel.css";

const AdminPanel = ({ children }) => {
  const location = useLocation();
  const [stats, setStats] = useState({
    courses: 0,
    teachers: 0,
    students: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesRes = await axios.get("http://localhost:5001/api/courses");
        const usersRes = await axios.get("http://localhost:5001/api/users");

        const teachersCount = usersRes.data.filter((user) => user.role === "teacher").length;
        const studentsCount = usersRes.data.filter((user) => user.role === "student").length;

        setStats({
          courses: coursesRes.data.length,
          teachers: teachersCount,
          students: studentsCount,
        });
      } catch (error) {
        console.error("❌ Ошибка загрузки статистики:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-container">
          {/* Отображаем карточки только на главной (`/dashboard`) */}
          {location.pathname === "/dashboard" && (
            <div className="dashboard-cards">
              <div className="card">
                <h3>📚 Курсы</h3>
                <p>{stats.courses}</p>
              </div>
              <div className="card">
                <h3>👨‍🏫 Преподаватели</h3>
                <p>{stats.teachers}</p>
              </div>
              <div className="card">
                <h3>🧑‍🎓 Студенты</h3>
                <p>{stats.students}</p>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
