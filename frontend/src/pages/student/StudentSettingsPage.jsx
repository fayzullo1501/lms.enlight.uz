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
      
    </StudentPanel>
  );
};

export default MyCourses;
