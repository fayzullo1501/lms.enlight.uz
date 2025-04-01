import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CoursePanel from "../../components/CoursePanel";
import "../../styles/CourseDetails.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseStats, setCourseStats] = useState({
    students: 0,
    lessons: 0,
    paid: 0,
    unpaid: 0,
  });

  useEffect(() => {
    const fetchCourseStats = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/courses/${courseId}`);
        setCourseStats({
          students: data.students.length,
          lessons: data.lessons.length,
          paid: data.students.filter((s) => s.paymentStatus === "paid").length,
          unpaid: data.students.filter((s) => s.paymentStatus === "unpaid").length,
        });
      } catch (error) {
        console.error("Ошибка загрузки статистики курса:", error);
      }
    };

    fetchCourseStats();
  }, [courseId]);

  return (
    <CoursePanel courseId={courseId}>
      <div className="course-stats-container">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>👨‍🎓 Студенты</h4>
            <p>{courseStats.students}</p>
          </div>
          <div className="stat-card">
            <h4>📚 Уроки</h4>
            <p>{courseStats.lessons}</p>
          </div>
          <div className="stat-card paid">
            <h4>💳 Оплачено</h4>
            <p>{courseStats.paid}</p>
          </div>
          <div className="stat-card unpaid">
            <h4>🚫 Не оплачено</h4>
            <p>{courseStats.unpaid}</p>
          </div>
        </div>
      </div>
    </CoursePanel>
  );
};

export default CourseDetails;
