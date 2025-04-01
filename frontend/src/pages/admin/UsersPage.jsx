import { useEffect, useState } from "react";
import axios from "axios";
import AdminPanel from "../../components/AdminPanel";
import "../../styles/UsersPage.css";
import UserModal from "../../components/UserModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/users");
      setUsers(data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  };  

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const toggleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((user) => user._id));
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // 🔥 Удаление пользователей
  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      alert("Выберите пользователя!");
      return;
    }

    if (!window.confirm("Вы действительно хотите удалить выбранных пользователей?")) {
      return;
    }

    try {
      await axios.delete("http://localhost:5001/api/users", { data: { userIds: selectedUsers } });
      alert("Пользователи успешно удалены!");
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      alert("Ошибка при удалении пользователей!");
    }
  };

  // 🔥 Изменение пользователя
  const handleEditUser = () => {
    if (selectedUsers.length !== 1) {
      alert("Выберите одного пользователя для редактирования!");
      return;
    }

    const userToEdit = users.find((user) => user._id === selectedUsers[0]);
    setEditingUser(userToEdit);
    setIsModalOpen(true);
  };

  return (
    <AdminPanel>
      <div className="users-content">
        <div className="users-actions">
          <button className="users-add-btn" onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>Добавить</button>
          <button className="users-edit-btn" onClick={handleEditUser}>Изменить</button>
          <button className="users-delete-btn" onClick={handleDeleteUsers}>Удалить</button>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>№</th>
                <th>Фото</th>
                <th>ФИО</th>
                <th>Роль</th>
                <th>Телефон</th>
                <th>Логин</th>
                <th>Пароль</th>
                <th>Email</th>
                <th>Паспорт</th>
                <th>Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleSelectUser(user._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={user.photo ? `http://localhost:5001/${user.photo}` : "http://localhost:5001/uploads/default.png"}
                      alt="User"
                      className="users-avatar"
                    />
                  </td>
                  <td>{user.fullName || "—"}</td>
                  <td>{user.role || "—"}</td>
                  <td>{user.phone || "—"}</td>
                  <td>{user.login}</td>
                  <td className="password-column">
                    <span>{visiblePasswords[user._id] ? user.password : "••••••••"}</span>
                    <button className="eye-btn" onClick={() => togglePasswordVisibility(user._id)}>
                      {visiblePasswords[user._id] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </td>
                  <td>{user.email || "—"}</td>
                  <td>{user.passport?.series || "—"} {user.passport?.number || "—"}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} onUserAdded={fetchUsers} editingUser={editingUser} />}
    </AdminPanel>
  );
};

export default UsersPage;
