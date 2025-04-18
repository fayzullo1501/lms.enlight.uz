import { useEffect, useState } from "react";
import axios from "axios";
import AdminPanel from "../../components/AdminPanel";
import "../../styles/UsersPage.css";
import UserModal from "../../components/UserModal";
import { FiSearch, FiFilter } from "react-icons/fi";


const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
      setUsers(data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  };

  const toggleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((user) => user._id));
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      alert("Выберите пользователя!");
      return;
    }

    if (!window.confirm("Вы действительно хотите удалить выбранных пользователей?")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        data: { userIds: selectedUsers },
      });
      alert("Пользователи успешно удалены!");
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      alert("Ошибка при удалении пользователей!");
    }
  };

  const handleEditUser = () => {
    if (selectedUsers.length !== 1) {
      alert("Выберите одного пользователя для редактирования!");
      return;
    }

    const userToEdit = users.find((user) => user._id === selectedUsers[0]);
    setEditingUser(userToEdit);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      `${user.passport?.series} ${user.passport?.number}`.toLowerCase().includes(query)
    );
  });

  return (
    <AdminPanel>
      <div className="users-content">
      <div className="users-top-bar">
        <div className="users-actions">
          <button className="users-add-btn" onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>Добавить</button>
          <button className="users-edit-btn" onClick={handleEditUser}>Изменить</button>
          <button className="users-delete-btn" onClick={handleDeleteUsers}>Удалить</button>
        </div>

        <div className="users-toolbar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-btn" onClick={() => alert("Открыть фильтр")}>
            <FiFilter className="filter-icon" />
            <span>Фильтр</span>
          </button>
        </div>
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
                <th>Email</th>
                <th>Паспорт</th>
                <th>Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
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
                      src={user.photo
                        ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${user.photo}`
                        : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/uploads/default.png`}
                      alt="User"
                      className="users-avatar"
                    />
                  </td>
                  <td>{user.fullName || "—"}</td>
                  <td>{user.role || "—"}</td>
                  <td>{user.phone || "—"}</td>
                  <td>{user.login}</td>
                  <td>{user.email || "—"}</td>
                  <td>{user.passport?.series || "—"} {user.passport?.number || "—"}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} onUserAdded={fetchUsers} editingUser={editingUser} />}
    </AdminPanel>
  );
};

export default UsersPage;
