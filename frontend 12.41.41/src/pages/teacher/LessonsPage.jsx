import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CoursePanel from "../../components/CoursePanel";
import LessonModal from "../../components/LessonModal";
import "../../styles/LessonsPage.css";

const LessonsPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/courses/${courseId}/lessons`);
      setLessons(data.lessons || []);
    } catch (error) {
      console.error("❌ Ошибка загрузки уроков:", error);
      setLessons([]);
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Удалить урок?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/courses/${courseId}/lessons/${lessonId}`);
      fetchLessons();
    } catch (error) {
      console.error("❌ Ошибка при удалении урока:", error);
    }
  };

  return (
    <CoursePanel courseId={courseId}>
      <div className="lessons-container">
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>Добавить</button>

        {lessons === null ? (
          <p>Загрузка уроков...</p>
        ) : lessons.length === 0 ? (
          <p>ℹ️ Уроков пока нет. Добавьте первый урок!</p>
        ) : (
          <ul className="lesson-list">
            {lessons.map((lesson) => (
              <li 
                key={lesson._id} 
                className="lesson-item" 
                onClick={() => navigate(`/teacher/course/${courseId}/lessons/${lesson._id}`)}
              >
                {lesson.banner && (
                  <img
                    src={`http://localhost:5001/${lesson.banner}`}
                    alt="Lesson"
                    className="lesson-banner"
                  />
                )}
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p><strong>📅 Дата:</strong> {new Date(lesson.date).toLocaleDateString()}</p>
                  <p><strong>⏳ Длительность:</strong> {lesson.duration} минут</p>
                  <p><strong>👨‍🏫 Ментор:</strong> {lesson.mentor ? lesson.mentor.fullName : "Без ментора"}</p>
                </div>
                <button 
                  className="delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation(); // Чтобы клик не открывал детали
                    deleteLesson(lesson._id);
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && <LessonModal courseId={courseId} onClose={() => setIsModalOpen(false)} onLessonAdded={fetchLessons} />}
    </CoursePanel>
  );
};

export default LessonsPage;
