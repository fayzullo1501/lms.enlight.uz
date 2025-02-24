import { Link } from "react-router-dom";

const StudentPanel = () => {
  return (
    <div className="student-panel">
      <h1>Панель студента</h1>
      <p>Здесь вы можете просматривать свои курсы и материалы.</p>

      <div className="student-actions">
        <Link to="/student/courses" className="student-btn">📖 Мои курсы</Link>
        <Link to="/student/materials" className="student-btn">📂 Учебные материалы</Link>
      </div>
    </div>
  );
};

export default StudentPanel;
