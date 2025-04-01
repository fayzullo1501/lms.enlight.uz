import { useParams } from "react-router-dom";
import StudentCourseSidebar from "./StudentCourseSidebar";
import StudentCourseHeader from "./StudentCourseHeader";
import "../styles/StudentCoursePanel.css"; 

const StudentCoursePanel = ({ children }) => {
  const { courseId } = useParams();

  return (
    <div className="student-course-layout">
      <StudentCourseSidebar courseId={courseId} />
      <div className="student-course-main">
        <StudentCourseHeader courseId={courseId} />
        <div className="student-course-container">{children}</div>
      </div>
    </div>
  );
};

export default StudentCoursePanel;
