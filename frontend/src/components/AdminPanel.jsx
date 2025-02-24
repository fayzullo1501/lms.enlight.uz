import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../styles/AdminPanel.css";

const AdminPanel = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-container">{children}</div> {/* Основной контент */}
      </div>
    </div>
  );
};

export default AdminPanel;
