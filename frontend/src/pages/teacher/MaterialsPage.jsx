import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CoursePanel from "../../components/CoursePanel"; // ✅ Теперь загружается `CourseSidebar`
import MaterialsModal from "../../components/MaterialsModal";
import "../../styles/MaterialsPage.css";

const MaterialsPage = () => {
  const { courseId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/materials`);
      setMaterials(data);
    } catch (error) {
      console.error("❌ Ошибка загрузки материалов:", error);
    }
  };

  const toggleSelectAll = () => {
    setSelectedMaterials(
      selectedMaterials.length === materials.length ? [] : materials.map((material) => material._id)
    );
  };

  const toggleSelectMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId]
    );
  };

  const handleDeleteMaterials = async () => {
    if (selectedMaterials.length === 0) {
      alert("Выберите материалы для удаления!");
      return;
    }

    if (!window.confirm("Вы действительно хотите удалить выбранные материалы?")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/materials`, {
        data: { materialIds: selectedMaterials }
      });
    
      alert("✅ Материалы успешно удалены!");
      fetchMaterials();
      setSelectedMaterials([]);
    } catch (error) {
      alert("❌ Ошибка при удалении материалов!");
    }    
  };

  return (
    <CoursePanel courseId={courseId}>
      <div className="materials-content">
        <div className="materials-actions">
          <button className="materials-add-btn" onClick={() => setIsModalOpen(true)}>Добавить</button>
          <button className="materials-delete-btn" onClick={handleDeleteMaterials}>Удалить</button>
        </div>

        <div className="materials-table-container">
          <table className="materials-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.length === materials.length && materials.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>№</th>
                <th>Название</th>
                <th>Файл / Ссылка</th>
                <th>Дата добавления</th>
              </tr>
            </thead>
            <tbody>
            {materials.length === 0 ? (
                <tr>
                <td colSpan="5" className="no-materials">ℹ️ В этом курсе пока нет материалов.</td>
                </tr>
            ) : (
                materials.map((material, index) => (
                <tr key={material._id}>
                    <td className="checkbox-column">
                    <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material._id)}
                        onChange={() => toggleSelectMaterial(material._id)}
                    />
                    </td>
                    <td>{index + 1}</td>
                    <td>{material.title}</td> {/* ✅ Теперь отображается правильное название */}
                    <td>
                    {material.fileType === "link" ? (
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="material-link">
                        Открыть ссылку
                        </a>
                    ) : (
                      <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${material.fileUrl}`} download className="material-link">
                      Скачать файл
                    </a>                    
                    )}
                    </td>
                    <td>{new Date(material.createdAt).toLocaleDateString()}</td> {/* ✅ Дата исправлена */}
                </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <MaterialsModal courseId={courseId} onClose={() => setIsModalOpen(false)} onMaterialAdded={fetchMaterials} />}
    </CoursePanel>
  );
};

export default MaterialsPage;
