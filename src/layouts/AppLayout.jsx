import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import LandingFooter from "../pages/Landing Page/LandingFooter";
// import Footer from "../components/Footer";

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const shell = document.querySelector(".app-shell");

    if (!shell) {
      return;
    }

    shell.style.overflowY = isMenuOpen ? "hidden" : "auto";

    return () => {
      shell.style.overflowY = "auto";
    };
  }, [isMenuOpen]);

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
      <LandingFooter />
    </div>
  );
}

export default AppLayout;
