import React from "react";
import gameImage from "../../assets/gold-coins.png";

const LandingGames = () => {
  return (
    <section id="games" className="games-section">
      {/* =========================
          TOP HEADING
      ========================= */}
      <div className="games-heading">
        <span>RATE CHART</span>

        <h2>
          Know the Rates, <strong>Play Smart</strong>
        </h2>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="games-container">
        {/* Left - Rate Chart */}
        <div className="games-content">
          <p className="games-description">
            Check our game rates and enjoy exciting online gameplay with simple
            and transparent rates.
          </p>

          {/* Rates */}
          <div className="rate-list">
            <div className="rate-card">
              <div className="rate-name">
                <span>JODI</span>
                <small>1 Ka Game</small>
              </div>

              <div className="rate-value">₹90</div>
            </div>

            <div className="rate-card">
              <div className="rate-name">
                <span>HARUP</span>
                <small>10 Ka Game</small>
              </div>

              <div className="rate-value">₹900</div>
            </div>
          </div>
        </div>

        {/* Right - Image */}
        <div className="games-image">
          <img src={gameImage} alt="GVSC Coins" />
        </div>
      </div>
    </section>
  );
};

export default LandingGames;
