import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";
import "../styles/TeacherPanel.css";

const TeacherPanel = ({ children }) => {
  const location = useLocation();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    events: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const teacherId = localStorage.getItem("userId");
        if (!teacherId) return;

        const [coursesRes, eventsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/mentor/${teacherId}`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/events`)
        ]);

        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];

        // Подсчёт всех студентов во всех курсах ментора
        const studentCount = courses.reduce((acc, course) => {
          return acc + (Array.isArray(course.students) ? course.students.length : 0);
        }, 0);

        // Фильтрация мероприятий, где ментор является организатором или назначен
        const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        const myEvents = events.filter((event) =>
          [event.organizer, event.mentor].includes(teacherId)
        );

        setStats({
          courses: courses.length,
          students: studentCount,
          events: myEvents.length,
        });
      } catch (error) {
        console.error("❌ Ошибка загрузки статистики:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="teacher-layout">
      <TeacherSidebar />
      <div className="teacher-main">
        <TeacherHeader />
        <div className="teacher-container">
          {location.pathname === "/dashboard" && (
            <div className="dashboard-cards">
              <div className="card">
                <h3>📚 Мои курсы</h3>
                <p>{stats.courses}</p>
              </div>
              <div className="card">
                <h3>🧑‍🎓 Мои студенты</h3>
                <p>{stats.students}</p>
              </div>
              <div className="card">
                <h3>📅 Мероприятия</h3>
                <p>{stats.events}</p>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
