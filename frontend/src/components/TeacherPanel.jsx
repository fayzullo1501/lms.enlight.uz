import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";
import "../styles/TeacherPanel.css";

const TeacherPanel = ({ children }) => {
  return (
    <div className="teacher-layout">
      <TeacherSidebar />
      <div className="teacher-main">
        <TeacherHeader />
        <div className="teacher-container">{children}</div> {/* Основной контент */}
      </div>
    </div>
  );
};

export default TeacherPanel;
