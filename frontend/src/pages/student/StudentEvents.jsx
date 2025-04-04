import { useEffect, useState } from "react";
import axios from "axios";
import StudentPanel from "../../components/StudentPanel";
import "../../styles/MyCourses.css";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/student/courses`);
      setCourses(data);
    } catch (error) {
      console.error("❌ Ошибка загрузки курсов:", error);
    }
  };  

  return (
    <StudentPanel>
      <div className="courses-container">
        <h2>📖 Мои курсы</h2>
        <div className="courses-list">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Link to={`/student/course/${course._id}`} key={course._id} className="course-card">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${course.banner}`}
                  alt={course.title}
                  className="course-banner"
                />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>Вы пока не записаны на курсы.</p>
          )}
        </div>
      </div>
    </StudentPanel>
  );
};

export default MyCourses;
