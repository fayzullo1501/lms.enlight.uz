import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiStar, FiArrowRight } from "react-icons/fi";
import TeacherPanel from "../../components/TeacherPanel";
import "../../styles/MyCourses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [pinnedCourses, setPinnedCourses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const teacherId = localStorage.getItem("userId");
      if (!teacherId) {
        console.warn("❌ userId не найден в localStorage");
        return;
      }

      try {
        const { data } = await axios.get(`http://localhost:5001/api/courses/mentor/${teacherId}`);
        const formattedCourses = data.map((course) => ({
          ...course,
          bannerUrl: `http://localhost:5001/${course.banner}`,
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error("❌ Ошибка загрузки курсов:", error);
      }
    };

    fetchCourses();
  }, []);

  const togglePinCourse = (courseId) => {
    setPinnedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <TeacherPanel>
      <div className="teacher-panel my-courses-container">
        {courses.length === 0 ? (
          <p className="no-courses">Нет доступных курсов.</p>
        ) : (
          <div className="courses-grid">
            {courses
              .sort((a, b) => (pinnedCourses[b._id] ? 1 : 0) - (pinnedCourses[a._id] ? 1 : 0)) // Закрепленные курсы наверху
              .map((course) => (
                <div key={course._id} className="course-card">
                  {/* ✅ Баннер теперь с отступами */}
                  <div
                    className="course-banner"
                    style={{
                      backgroundImage: `url('${course.bannerUrl}')`,
                    }}
                  >
                    <span className="course-date">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    <FiStar
                      className={`pin-icon ${pinnedCourses[course._id] ? "pinned" : ""}`}
                      onClick={() => togglePinCourse(course._id)}
                    />
                  </div>

                  {/* Детали курса */}
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p><strong>Язык:</strong> {course.language.toUpperCase()}</p>
                    <p><strong>Продолжительность:</strong> {course.duration} мес.</p>

                    {/* ✅ Новый футер - формат и кнопка в одной строке */}
                    <div className="course-footer">
                      <p><strong>Формат:</strong> {course.format === "online" ? "Онлайн" : "Офлайн"}</p>
                      <button
                        className="enter-course-btn"
                        onClick={() => navigate(`/teacher/course/${course._id}`)}
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
    </TeacherPanel>
  );
};

export default MyCourses;
