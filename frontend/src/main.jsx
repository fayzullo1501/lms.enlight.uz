import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import axios from "axios";

// 📌 Устанавливаем базовый адрес API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
