import CourseSidebar from "./CourseSidebar";
import CourseHeader from "./CourseHeader";
import "../styles/CoursePanel.css";

const CoursePanel = ({ courseId, children }) => {
  return (
    <div className="course-layout">
      <CourseSidebar courseId={courseId} />
      <div className="course-main">
        <CourseHeader courseId={courseId} />
        <div className="course-container">{children}</div>
      </div>
    </div>
  );
};

export default CoursePanel;
