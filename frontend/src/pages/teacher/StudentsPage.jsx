import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CoursePanel from "../../components/CoursePanel"; // ✅ Заменили `TeacherPanel` на `CoursePanel`
import "../../styles/StudentsPage.css";
import StudentsModal from "../../components/StudentsModal";

const StudentsPage = () => {
  const { courseId } = useParams(); // ✅ Получаем ID курса из URL
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/students`); // ✅ Запрос только для студентов этого курса
      setStudents(data);
    } catch (error) {
      console.error("❌ Ошибка загрузки студентов:", error);
    }
  };

  const toggleSelectAll = () => {
    setSelectedStudents(selectedStudents.length === students.length ? [] : students.map((student) => student._id));
  };

  const toggleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleDeleteStudents = async () => {
    if (selectedStudents.length === 0) {
      alert("Выберите студентов для удаления!");
      return;
    }

    if (!window.confirm("Вы действительно хотите удалить выбранных студентов из курса?")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/students`, { 
        data: { studentIds: selectedStudents } 
      });
    
      alert("✅ Студенты успешно удалены из курса!");
      fetchStudents();
      setSelectedStudents([]);
    } catch (error) {
      alert("❌ Ошибка при удалении студентов!");
    }    
  };

  return (
    <CoursePanel courseId={courseId}> {/* ✅ Теперь загружается `CourseSidebar` */}
      <div className="students-content">
        <div className="students-actions">
          <button className="students-add-btn" onClick={() => setIsModalOpen(true)}>Добавить</button>
          <button className="students-delete-btn" onClick={handleDeleteStudents}>Удалить</button>
        </div>

        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length && students.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>№</th>
                <th>Фото</th>
                <th>ФИО</th>
                <th>Телефон</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-students">ℹ️ В этом курсе пока нет студентов.</td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => toggleSelectStudent(student._id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                    <img
                      src={student.photo
                        ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${student.photo}`
                        : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/uploads/default.jpg`}
                      alt="Student"
                      className="students-avatar"
                    />
                    </td>
                    <td>{student.fullName || "—"}</td>
                    <td>{student.phone || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно выбора студентов */}
      {isModalOpen && <StudentsModal courseId={courseId} onClose={() => setIsModalOpen(false)} onStudentsAdded={fetchStudents} />}
    </CoursePanel>
  );
};

export default StudentsPage;
