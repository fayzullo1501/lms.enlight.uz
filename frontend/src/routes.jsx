import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/admin/CoursesPage";
import UsersPage from "./pages/admin/UsersPage";
import EventsPage from "./pages/admin/EventsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Страница авторизации */}
        <Route path="/" element={<LoginPage />} />

        {/* Панель управления (доступна только после авторизации) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Разделы админ-панели */}
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
