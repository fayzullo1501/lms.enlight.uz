import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/admin/CoursesPage";
import UsersPage from "./pages/admin/UsersPage";
import EventsPage from "./pages/admin/EventsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import MyCourses from "./pages/teacher/MyCourses";
import CourseDetails from "./pages/teacher/CourseDetails";
import LessonsPage from "./pages/teacher/LessonsPage"; 
import StudentsPage from "./pages/teacher/StudentsPage";
import LessonDetails from "./pages/teacher/LessonDetails";
import StudentMyCourses from "./pages/student/StudentMyCourses"
import StudentEvents from "./pages/student/StudentEvents"
import StudentSettingsPage from "./pages/student/StudentSettingsPage"
import ProtectedRoute from "./components/ProtectedRoute";
import MaterialsPage from "./pages/teacher/MaterialsPage";
import StudentCourseDetails from "./pages/student/StudentCourseDetails";
import StudentLessonsPage from "./pages/student/StudentLessonsPage"; 
import StudentLessonDetails from "./pages/student/StudentLessonDetails"; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 📌 Страница авторизации */}
        <Route path="/" element={<LoginPage />} />

        {/* 📌 Панель управления (общая для всех пользователей) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 📌 Разделы админ-панели */}
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
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 📌 Разделы панели преподавателя */}
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/course/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/course/:courseId/lessons"
          element={
            <ProtectedRoute>
              <LessonsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/course/:courseId/students" // ✅ Новый маршрут для страницы студентов
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/course/:courseId/materials" // ✅ Новый маршрут для страницы студентов
          element={
            <ProtectedRoute>
              <MaterialsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/course/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonDetails />
            </ProtectedRoute>
          }
        />
        {/* 📌 Разделы панели студента */}
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute>
              <StudentMyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute>
              <StudentEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute>
              <StudentSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId"
          element={
            <ProtectedRoute>
              <StudentCourseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/lessons"
          element={
            <ProtectedRoute>
              <StudentLessonsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <StudentLessonDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
