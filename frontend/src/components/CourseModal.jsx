import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CourseModal.css";

const CourseModal = ({ onClose, onCourseAdded, editingCourse }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "ru",
    duration: "",
    format: "online",
    banner: null,
    mentor: "",
  });

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentors();
    if (editingCourse) {
      setFormData({
        title: editingCourse.title,
        description: editingCourse.description,
        language: editingCourse.language,
        duration: editingCourse.duration,
        format: editingCourse.format,
        mentor: editingCourse.mentor?._id || "",
      });
    }
  }, [editingCourse]);

  const fetchMentors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/users");
      setMentors(data.filter(user => user.role === "teacher"));
    } catch (error) {
      console.error("Ошибка загрузки менторов:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, banner: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.duration || !formData.mentor) {
      alert("Все поля обязательны!");
      return;
    }

    setLoading(true);

    try {
      const courseData = new FormData();
      courseData.append("title", formData.title);
      courseData.append("description", formData.description);
      courseData.append("language", formData.language);
      courseData.append("duration", formData.duration);
      courseData.append("format", formData.format);
      courseData.append("mentor", formData.mentor);
      if (formData.banner) {
        courseData.append("banner", formData.banner);
      }

      if (editingCourse) {
        await axios.put(`http://localhost:5001/api/courses/${editingCourse._id}`, courseData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5001/api/courses", courseData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(editingCourse ? "Курс обновлен!" : "Курс добавлен!");
      onCourseAdded();
      onClose();
    } catch (error) {
      alert("Ошибка при сохранении курса!");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingCourse ? "Редактировать курс" : "Добавить курс"}</h2>
          <span className="close-icon" onClick={onClose}>×</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Название курса" value={formData.title} onChange={handleChange} required />

          <textarea name="description" placeholder="Описание курса" value={formData.description} onChange={handleChange} required />

          <div className="select-group">
            <select name="language" value={formData.language} onChange={handleChange}>
              <option value="ru">Русский</option>
              <option value="en">Английский</option>
              <option value="uz">Узбекский</option>
            </select>

            <input type="number" name="duration" placeholder="Длительность (мес.)" value={formData.duration} onChange={handleChange} required />
          </div>

          <div className="select-group">
            <select name="format" value={formData.format} onChange={handleChange}>
              <option value="online">Онлайн</option>
              <option value="offline">Офлайн</option>
            </select>

            <select name="mentor" value={formData.mentor} onChange={handleChange} required>
              <option value="">Выберите ментора</option>
              {mentors.map(mentor => (
                <option key={mentor._id} value={mentor._id}>{mentor.fullName}</option>
              ))}
            </select>
          </div>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
