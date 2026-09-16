import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import LandingFooter from "../pages/Landing Page/LandingFooter";
// import Footer from "../components/Footer";

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!localStorage.getItem("gvsc-token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={`app-layout${showNotifications ? " notifications-open" : ""}${
        isMenuOpen ? " menu-open" : ""
      }`}
    >
      {/* Header */}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />

      {/* Sidebar */}
      <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      {/* Page Content */}
      <div className="app-scroll">
        <main className={`app-content ${isMenuOpen ? "sidebar-open" : ""}`}>
          <Outlet />
        </main>
      </div>

      {/* <Footer /> */}
      <LandingFooter />
    </div>
  );
}

export default AppLayout;
