import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AdminPanel.css";

const CoursesPage = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        
      </div>
    </div>
  );
};

export default CoursesPage;
