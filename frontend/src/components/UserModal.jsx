import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserModal.css";

const UserModal = ({ onClose, onUserAdded, editingUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    phone: "",
    login: "",
    password: "",
    email: "",
    passportSeries: "",
    passportNumber: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  // 📌 Заполняем форму при редактировании
  useEffect(() => {
    if (editingUser) {
      setFormData({
        fullName: editingUser.fullName || "",
        role: editingUser.role || "",
        phone: editingUser.phone || "",
        login: editingUser.login || "",
        password: "", // Пароль при редактировании не меняем
        email: editingUser.email || "",
        passportSeries: editingUser.passport?.series || "",
        passportNumber: editingUser.passport?.number || "",
        photo: null,
      });
    }
  }, [editingUser]);

  // 📌 Обработчик полей ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 📌 Обработчик загрузки фото
  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // 📌 Отправка формы (добавление/редактирование пользователя)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userData = new FormData();
      userData.append("fullName", formData.fullName);
      userData.append("role", formData.role);
      userData.append("phone", formData.phone);
      userData.append("login", formData.login);
      userData.append("email", formData.email);
      userData.append("passport", JSON.stringify({ series: formData.passportSeries, number: formData.passportNumber }));

      if (formData.password) {
        userData.append("password", formData.password);
      }

      if (formData.photo) {
        userData.append("photo", formData.photo);
      }

      if (editingUser) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${editingUser._id}`, userData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, userData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }      

      alert(`✅ Пользователь ${editingUser ? "обновлён" : "добавлен"} успешно!`);
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении пользователя:", error);
      alert("❌ Ошибка при сохранении пользователя!");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Закрытие модального окна при клике вне формы
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-contentt" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingUser ? "Редактировать пользователя" : "Добавить пользователя"}</h2>
          <span className="close-icon" onClick={onClose}>×</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="ФИО" value={formData.fullName} onChange={handleChange} required />

          <div className="imagerole-fields">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Выберите роль</option>
              <option value="admin">Администратор</option>
              <option value="teacher">Преподаватель</option>
              <option value="student">Студент</option>
            </select>
          </div>

          <input type="text" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} />
          
          <div className="loginpassword-fields">
            <input type="text" name="login" placeholder="Логин *" value={formData.login} onChange={handleChange} required />
            <input type="password" name="password" placeholder={editingUser ? "Новый пароль (необязательно)" : "Пароль *"} value={formData.password} onChange={handleChange} />
          </div>

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

          <div className="passport-fields">
            <input type="text" name="passportSeries" placeholder="Серия паспорта" value={formData.passportSeries} onChange={handleChange} />
            <input type="text" name="passportNumber" placeholder="Номер паспорта" value={formData.passportNumber} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading}>{loading ? "Сохранение..." : "Сохранить"}</button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
