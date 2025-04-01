import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AdminPanel.css";

const EventsPage = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        
      </div>
    </div>
  );
};

export default EventsPage;
