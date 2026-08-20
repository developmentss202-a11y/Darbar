import React, { useEffect, useState } from "react";
import Logo3 from "../../assets/Logo3.png";
import { useNavigate } from "react-router-dom";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    { id: "home", label: "HOME" },
    { id: "about", label: "ABOUT US" },
    { id: "games", label: "RATE CHART" },
    { id: "how-to-play", label: "HOW TO PLAY" },
  ];

  /* =========================
     LOGIN / SIGNUP
  ========================= */

  const onLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const onSignIn = () => {
    setMenuOpen(false);
    navigate("/signup");
  };

  /* =========================
     SCROLL DETECTION
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 20);

      const headerOffset = window.innerWidth <= 800 ? 95 : 105;
      const scrollPosition = scrollY + headerOffset;

      let currentSection = "home";

      menuItems.forEach((item) => {
        const section = document.getElementById(item.id);

        if (section && scrollPosition >= section.offsetTop) {
          currentSection = item.id;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /* =========================
     MENU CLICK
  ========================= */

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setMenuOpen(false);

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =========================
     LOGO CLICK
  ========================= */

  const handleLogoClick = (e) => {
    e.preventDefault();

    handleMenuClick("home");
  };

  /* =========================
     CLOSE MENU ON DESKTOP
  ========================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================
     RENDER
  ========================= */

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* =========================
            LOGO
        ========================= */}

        <a href="#home" className="logo-wrapper" onClick={handleLogoClick}>
          <img src={Logo3} alt="GVSC Logo" className="landing-header-logo" />
        </a>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeSection === item.id ? "active" : ""}
              onClick={() => handleMenuClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* =========================
            DESKTOP AUTH
        ========================= */}

        <div className="auth-buttons desktop-auth">
          <button type="button" className="login-btn" onClick={onLogin}>
            Login
          </button>

          <button type="button" className="signup-btn" onClick={onSignIn}>
            Signup
          </button>
        </div>

        {/* =========================
            HAMBURGER
        ========================= */}

        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* =========================
            MOBILE MENU
        ========================= */}

        <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
          {/* Mobile Navigation */}

          <nav className="mobile-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeSection === item.id ? "active" : ""}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Auth Buttons */}

          <div className="mobile-auth">
            <button type="button" className="login-btn" onClick={onLogin}>
              Login
            </button>

            <button type="button" className="signup-btn" onClick={onSignIn}>
              Signup
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
