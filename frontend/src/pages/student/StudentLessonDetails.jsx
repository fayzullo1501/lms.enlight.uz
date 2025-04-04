import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentCoursePanel from "../../components/StudentCoursePanel";
import { FiVideo, FiDownload, FiHeart, FiArrowLeft } from "react-icons/fi";
import "../../styles/LessonDetails.css";

const StudentLessonDetails = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLesson();
  }, [courseId, lessonId]);

  const fetchLesson = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`);
      setLesson(data);
    } catch (error) {
      console.error("❌ Ошибка загрузки деталей урока:", error);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <StudentCoursePanel courseId={courseId}>
      <div className="lesson-details-container">
        {lesson ? (
          <>
            <div className="lesson-back" onClick={() => navigate(-1)}>
              <FiArrowLeft className="back-icon" />
              <span>Назад</span>
            </div>

            <div className="lesson-media">
              {lesson.banner ? (
                <div className="lesson-banner-container">
                  <h2 className="lesson-title-overlay">{lesson.title}</h2>
                  <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${lesson.banner}`} alt="Lesson Banner" className="teacher-lesson-banner" />
                </div>
              ) : (
                <div className="lesson-placeholder">
                  <h2 className="lesson-title-overlay">{lesson.title}</h2>
                  Баннер или видео материал
                </div>
              )}
            </div>

            <div className="lesson-header">
              <h3>Детали урока</h3>
              <div className="lesson-actions">
                {lesson.conferenceLink && (
                  <a href={lesson.conferenceLink} target="_blank" rel="noopener noreferrer">
                    <FiVideo className="lesson-icon" title="Перейти к конференции" />
                  </a>
                )}
                {lesson.materials.length > 0 && (
                  <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${lesson.materials[0].fileUrl}`} target="_blank" rel="noopener noreferrer">
                  <FiDownload className="lesson-icon" title="Открыть материал в новой вкладке" />
                </a>                
                )}
                <FiHeart
                  className={`lesson-icon ${liked ? "liked" : ""}`}
                  title="Отметить"
                  onClick={handleLike}
                />
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
    </StudentCoursePanel>
  );
};

export default StudentLessonDetails;
