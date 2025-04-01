import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";
import "../styles/StudentPanel.css";

const StudentPanel = ({ children }) => {
  return (
    <div className="student-layout">
      <StudentSidebar />
      <div className="student-main">
        <StudentHeader />
        <div className="student-container">{children}</div> {/* Основной контент */}
      </div>
    </div>
  );
};

export default StudentPanel;
