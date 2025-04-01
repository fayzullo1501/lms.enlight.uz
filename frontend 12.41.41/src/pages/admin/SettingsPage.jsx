import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AdminPanel.css";

const SettingsPage = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        
      </div>
    </div>
  );
};

export default SettingsPage;
