import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentCoursePanel from "../../components/StudentCoursePanel";
import "../../styles/StudentLessonsPage.css";

const StudentLessonsPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/lessons`);
      setLessons(data.lessons || []);
    } catch (error) {
      console.error("❌ Ошибка загрузки уроков:", error);
      setLessons([]);
    }
  };

  return (
    <StudentCoursePanel courseId={courseId}>
      <div className="lessons-container">
        {lessons === null ? (
          <p>Загрузка уроков...</p>
        ) : lessons.length === 0 ? (
          <p>ℹ️ В этом курсе пока нет уроков.</p>
        ) : (
          <ul className="lesson-list">
            {lessons.map((lesson) => (
              <li
                key={lesson._id}
                className="lesson-item"
                onClick={() => navigate(`/student/course/${courseId}/lessons/${lesson._id}`)}
              >
                {lesson.banner && (
                  <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${lesson.banner}`} alt="Lesson" className="lesson-banner" />
                )}
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p>📅 {new Date(lesson.date).toLocaleDateString()}</p>
                  <p>⏱ {lesson.duration} мин.</p>
                  <p>👨‍🏫 {lesson.mentor?.fullName || "Без ментора"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StudentCoursePanel>
  );
};

export default StudentLessonsPage;
