import { useState } from "react";
import axios from "axios";
import "../styles/ReportModal.css";

const ReportModal = ({ onClose }) => {
  const [section, setSection] = useState("students");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("excel");

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("⚠️ Выберите период!");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/${section}`, {
        params: { startDate, endDate, format },
        responseType: format === "excel" ? "blob" : "json"
      });      

      if (format === "excel") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${section}_report.xlsx`);
        document.body.appendChild(link);
        link.click();
      } else {
        console.log("📊 Данные отчета:", response.data);
      }

      onClose();
    } catch (error) {
      console.error("❌ Ошибка генерации отчета:", error);
      alert("Ошибка при создании отчета!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span>📊 Сформировать отчет</span>
          <span className="close-icon" onClick={onClose}>×</span>
        </div>

        <label>Выберите раздел:</label>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="courses">Курсы</option>
          <option value="teachers">Преподаватели</option>
          <option value="students">Студенты</option>
          <option value="events">Мероприятия</option>
          <option value="leads">Лиды</option>
          <option value="rooms">Комнаты</option>
        </select>

        <label>Выберите период:</label>
        <div className="date-range">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <label>Формат:</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="excel">Excel</option>
          <option value="html">HTML</option>
        </select>

        <button onClick={handleGenerateReport}>📥 Сформировать</button>
      </div>
    </div>
  );
};

export default ReportModal;
