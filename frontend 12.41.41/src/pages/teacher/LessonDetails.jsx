import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CoursePanel from "../../components/CoursePanel";
import { FiVideo, FiDownload, FiHeart, FiArrowLeft } from "react-icons/fi";
import "../../styles/LessonDetails.css";

const LessonDetails = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLesson();
  }, [courseId, lessonId]);

  const fetchLesson = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/courses/${courseId}/lessons/${lessonId}`);
      setLesson(data);
    } catch (error) {
      console.error("❌ Ошибка загрузки деталей урока:", error);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <CoursePanel courseId={courseId}>
      <div className="lesson-details-container">
        {lesson ? (
          <>
            {/* ✅ Кнопка "Назад" с иконкой */}
            <div className="lesson-back" onClick={() => navigate(-1)}>
              <FiArrowLeft className="back-icon" />
              <span>Назад</span>
            </div>

            {/* ✅ Баннер с заголовком в левом верхнем углу */}
            <div className="lesson-media">
              {lesson.banner ? (
                <div className="lesson-banner-container">
                  <h2 className="lesson-title-overlay">{lesson.title}</h2>
                  <img src={`http://localhost:5001/${lesson.banner}`} alt="Lesson Banner" className="teacher-lesson-banner" />
                </div>
              ) : (
                <div className="lesson-placeholder">
                  <h2 className="lesson-title-overlay">{lesson.title}</h2>
                  Баннер или видео материал
                </div>
              )}
            </div>

            {/* ✅ Заголовок и иконки действий */}
            <div className="lesson-header">
              <h3>Детали урока</h3>
              <div className="lesson-actions">
                {lesson.conferenceLink && (
                  <a href={lesson.conferenceLink} target="_blank" rel="noopener noreferrer">
                    <FiVideo className="lesson-icon" title="Перейти к конференции" />
                  </a>
                )}

                {lesson.materials.length > 0 && (
                  <a href={`http://localhost:5001/${lesson.materials[0].fileUrl}`} target="_blank" rel="noopener noreferrer">
                    <FiDownload className="lesson-icon" title="Открыть материал в новой вкладке" />
                  </a>
                )}

                <FiHeart className={`lesson-icon ${liked ? "liked" : ""}`} title="Отметить" onClick={handleLike} />
              </div>
            </div>

            <p>{lesson.description}</p>

            <div className="lesson-footer">
              <div className="mentor-info">
                <strong>👨‍🏫 Ментор:</strong> {lesson.mentor?.fullName || "Не указан"}
              </div>
            </div>
          </>
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </CoursePanel>
  );
};

export default LessonDetails;
