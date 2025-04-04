import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css"; 

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", { login, password });

      console.log("✅ Ответ сервера при логине:", data);

      // ✅ Проверяем, есть ли ID пользователя в ответе
      if (!data.user || !data.user._id) {
        alert("Ошибка авторизации: отсутствует ID пользователя.");
        return;
      }

      // ✅ Сохраняем данные в localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user._id);

      // ✅ Перенаправляем без alert
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Неверный логин или пароль!");
      } else {
        alert("Ошибка сервера. Попробуйте позже.");
      }
    }
  };

  return (
    <div className="login-container">
      {/* Левая часть с фоном */}
      <div className="left-side">
        <a href="https://edu.enlight.uz" className="back-to-site">
          ← Вернуться на сайт
        </a>
      </div>

      {/* Правая часть с формой */}
      <div className="right-side">
        <div className="form-container">
          <h2>Вход в систему</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Логин</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot-password">
              <a href="#">Забыли пароль?</a>
            </div>
            <button type="submit" className="submit-btn">Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
