import { Link } from "react-router-dom";

const TeacherPanel = () => {
  return (
    <div className="teacher-panel">
      <h1>Панель преподавателя</h1>
      <p>Здесь вы можете управлять своими курсами и учениками.</p>

      <div className="teacher-actions">
        <Link to="/teacher/courses" className="teacher-btn">📚 Мои курсы</Link>
        <Link to="/teacher/students" className="teacher-btn">👥 Управление учениками</Link>
      </div>
    </div>
  );
};

export default TeacherPanel;
