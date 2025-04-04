import { useEffect, useState } from "react";
import axios from "axios";
import AdminPanel from "../../components/AdminPanel";
import "../../styles/CoursesPage.css";
import CourseModal from "../../components/CourseModal";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`);
      setCourses(data);
    } catch (error) {
      console.error("Ошибка загрузки курсов:", error);
    }
  };  

  const toggleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === courses.length ? [] : courses.map((course) => course._id)
    );
  };

  const toggleSelectCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleDeleteCourses = async () => {
    if (selectedCourses.length === 0) {
      alert("Выберите курсы для удаления!");
      return;
    }

    if (!window.confirm("Вы действительно хотите удалить выбранные курсы?")) {
      return;
    }

    try {
      for (const courseId of selectedCourses) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`);
      }
      fetchCourses();
      setSelectedCourses([]);
    } catch (error) {
      alert("Ошибка при удалении курсов!");
    }    
  };

  const handleEditCourse = () => {
    if (selectedCourses.length !== 1) {
      alert("Выберите один курс для редактирования!");
      return;
    }

    const courseToEdit = courses.find((course) => course._id === selectedCourses[0]);
    setEditingCourse(courseToEdit);
    setIsModalOpen(true);
  };

  return (
    <AdminPanel>
      <div className="courses-content">
        <div className="courses-actions">
          <button className="courses-add-btn" onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}>Добавить</button>
          <button className="courses-edit-btn" onClick={handleEditCourse}>Изменить</button>
          <button className="courses-delete-btn" onClick={handleDeleteCourses}>Удалить</button>
        </div>

        <div className="courses-table-container">
          <table className="courses-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === courses.length && courses.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>№</th>
                <th>Баннер</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Язык</th>
                <th>Формат</th>
                <th>Ментор</th>
                <th>Кол-во студентов</th>
                <th>Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => toggleSelectCourse(course._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${course.banner}`}
                    alt="Course Banner"
                    className="courses-banner"
                  />
                  </td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.language.toUpperCase()}</td>
                  <td>{course.format === "online" ? "Онлайн" : "Офлайн"}</td>
                  <td>{course.mentor?.fullName || "—"}</td>
                  <td>{course.students?.length || 0}</td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <CourseModal onClose={() => setIsModalOpen(false)} onCourseAdded={fetchCourses} editingCourse={editingCourse} />}
    </AdminPanel>
  );
};

export default CoursesPage;
