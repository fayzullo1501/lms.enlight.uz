import { useState } from "react";
import axios from "axios";
import "../styles/MaterialsModal.css";

const MaterialsModal = ({ courseId, onClose, onMaterialAdded }) => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [type, setType] = useState("file");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLink(""); // Очищаем ссылку, если выбран файл
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!fileName) {
      alert("Введите название материала!");
      return;
    }
  
    if (type === "file" && !file) {
      alert("Выберите файл!");
      return;
    }
    if (type === "link" && !link) {
      alert("Введите ссылку!");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", fileName); // ✅ Теперь название отправляется правильно
    formData.append("fileType", type);
    if (type === "file") {
      formData.append("file", file);
    } else {
      formData.append("fileUrl", link);
    }
  
    try {
      await axios.post(`http://localhost:5001/api/courses/${courseId}/materials`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onMaterialAdded();
      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении материала:", error);
      alert("Ошибка при добавлении материала!");
    }
  };  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span>Добавить материал</span>
          <span className="close-icon" onClick={onClose}>×</span>
        </div>

        <input type="text" placeholder="Название файла" value={fileName} onChange={(e) => setFileName(e.target.value)} />

        <select value={type} onChange={(e) => setType(e.target.value)} className="material-type">
          <option value="file">Файл</option>
          <option value="link">Ссылка</option>
        </select>

        {type === "file" ? (
          <input type="file" onChange={handleFileChange} />
        ) : (
          <input type="text" placeholder="Введите ссылку" value={link} onChange={handleLinkChange} />
        )}

        <button onClick={handleSubmit}>Сохранить</button>
      </div>
    </div>
  );
};

export default MaterialsModal;
