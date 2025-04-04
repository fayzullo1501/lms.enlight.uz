import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";
import StudentPanel from "../../components/StudentPanel"; // ✅ Используем панель студента
import "../../styles/StudentMyCourses.css";

const StudentMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const studentId = localStorage.getItem("userId");
      if (!studentId) {
        console.warn("❌ userId не найден в localStorage");
        return;
      }

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/student/${studentId}`);
        const formattedCourses = data.map((course) => ({
          ...course,
          bannerUrl: `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${course.banner}`,
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error("❌ Ошибка загрузки курсов студента:", error);
      }      
    };

    fetchCourses();
  }, []);

  return (
    <StudentPanel>
      <div className="student-panel my-courses-container">
        {courses.length === 0 ? (
          <p className="no-courses">Нет доступных курсов.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                {/* ✅ Баннер курса */}
                <div
                  className="course-banner"
                  style={{
                    backgroundImage: `url('${course.bannerUrl}')`,
                  }}
                >
                  <span className="course-date">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Детали курса */}
                <div className="course-details">
                  <h3>{course.title}</h3>
                  <p><strong>Язык:</strong> {course.language.toUpperCase()}</p>
                  <p><strong>Продолжительность:</strong> {course.duration} мес.</p>

                  {/* ✅ Формат и кнопка */}
                  <div className="course-footer">
                    <p><strong>Формат:</strong> {course.format === "online" ? "Онлайн" : "Офлайн"}</p>
                    <button
                      className="enter-course-btn"
                      onClick={() => navigate(`/student/course/${course._id}`)}
                    >
                      Войти <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentPanel>
  );
};

export default StudentMyCourses;
