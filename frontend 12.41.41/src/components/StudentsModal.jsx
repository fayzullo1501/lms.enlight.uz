import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StudentsModal.css";

const StudentsModal = ({ courseId, onClose, onStudentsAdded }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // ✅ Отфильтрованные студенты
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Стейт для поиска

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/users?role=student");
      const students = data.filter(user => user.role === "student"); // ✅ Оставляем только студентов
      setAllStudents(students);
      setFilteredStudents(students); // ✅ Инициализация отфильтрованного списка
    } catch (error) {
      console.error("Ошибка загрузки студентов:", error);
    }
  };

  const toggleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredStudents(allStudents.filter(student => student.fullName.toLowerCase().includes(query)));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:5001/api/courses/${courseId}/students`, { studentIds: selectedStudents });
      onStudentsAdded();
      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении студентов:", error.response?.data || error.message);
      alert("Ошибка при добавлении студентов!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Выберите студентов</h3>
          <span className="close-icon" onClick={onClose}>×</span>
        </div>

        {/* ✅ Рабочий поиск студентов */}
        <input 
          type="text" 
          placeholder="🔍 Поиск студента..." 
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="students-list">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className={`student-item ${selectedStudents.includes(student._id) ? "selected" : ""}`}
                onClick={() => toggleSelectStudent(student._id)}
              >
                {student.fullName}
              </div>
            ))
          ) : (
            <p className="no-students">Нет подходящих студентов</p>
          )}
        </div>

        <button className="save-btn" onClick={handleSubmit} disabled={selectedStudents.length === 0}>
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default StudentsModal;
