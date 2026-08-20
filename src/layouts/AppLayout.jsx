import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Sidebar */}
      <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      {/* Page Content */}
      <main className={`app-content ${isMenuOpen ? "sidebar-open" : ""}`}>
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default AppLayout;
