import { useParams } from "react-router-dom";
import StudentCoursePanel from "../../components/StudentCoursePanel";
import "../../styles/StudentCourseDetails.css";

const StudentCourseDetails = () => {
  const { courseId } = useParams();

  return (
    <StudentCoursePanel courseId={courseId}>
      <div className="course-details-container">
        <h3>📌 Добро пожаловать в курс</h3>
        <p>Выберите раздел в меню, чтобы начать обучение.</p>
      </div>
    </StudentCoursePanel>
  );
};

export default StudentCourseDetails;
