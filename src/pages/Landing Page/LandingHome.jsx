import React from "react";
import logo3 from "../../assets/logo3.png";
import { useNavigate } from "react-router-dom";

const LandingHome = () => {
  const navigate = useNavigate();

  const onClickPlay = () => {
    navigate("/login");
  };

  return (
    <div>
      <section id="home" className="home-section">
        <div className="home-container">
          {/* Left - Logo */}
          <div className="home-logo">
            <img src={logo3} alt="Darbar Online" />
          </div>

          {/* Right - Content */}
          <div className="home-content">
            <h1>
              Play Best Online <br />
              Games with GVSC!
            </h1>

            <p>Enjoy smooth gameplay and endless entertainment.</p>

            <button className="download-btn" onClick={onClickPlay}>
              Play Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingHome;
