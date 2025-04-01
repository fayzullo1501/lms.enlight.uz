import { useState } from "react";
import axios from "axios";
import "../styles/LessonModal.css";

const LessonModal = ({ courseId, onClose, onLessonAdded }) => {
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    date: "",
    duration: "",
    conferenceLink: "",
    banner: null,
    material: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: files.length > 0 ? files[0] : null }));
  };

  const handleSubmit = async () => {
    if (!lessonData.title || !lessonData.description || !lessonData.date || !lessonData.duration) {
      alert("❌ Заполните все обязательные поля!");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", lessonData.title);
    formData.append("description", lessonData.description || "Описание отсутствует");
    formData.append("date", lessonData.date);
    formData.append("duration", lessonData.duration);
    formData.append("conferenceLink", lessonData.conferenceLink || "");
  
    if (lessonData.banner) formData.append("banner", lessonData.banner);
    if (lessonData.material) formData.append("material", lessonData.material);
  
    try {
      const response = await axios.post(
        `http://localhost:5001/api/courses/${courseId}/lessons`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("✅ Урок успешно добавлен:", response.data);
      onLessonAdded();
      onClose();
    } catch (error) {
      console.error("❌ Ошибка при добавлении урока:", error.response?.data || error.message);
      alert(`Ошибка при добавлении урока: ${error.response?.data?.message || "Неизвестная ошибка"}`);
    }
  };  

  return (
    <div className="lessons-modal-overlay">
      <div className="lessons-modal-content">
        <div className="lessons-modal-header">
          <span>Добавить урок</span>
          <span className="lessons-close-icon" onClick={onClose}>×</span>
        </div>

        <input type="text" name="title" placeholder="Название урока *" value={lessonData.title} onChange={handleChange} />
        <textarea name="description" placeholder="Описание урока" value={lessonData.description || ""} onChange={handleChange} />

        <div className="lessons-select-group">
          <input type="date" name="date" value={lessonData.date} onChange={handleChange} />
          <input type="number" name="duration" placeholder="Длительность (мин)" value={lessonData.duration} onChange={handleChange} />
        </div>

        <label>Баннер / Видео:</label>
        <input type="file" name="banner" accept="image/*,video/*" onChange={handleFileChange} />

        <label>Материал (PDF, DOC и т. д.):</label>
        <input type="file" name="material" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

        <input type="text" name="conferenceLink" placeholder="Ссылка на конференцию (Zoom/Meet)" value={lessonData.conferenceLink || ""} onChange={handleChange} />

        <button onClick={handleSubmit}>Добавить</button>
      </div>
    </div>
  );
};

export default LessonModal;
