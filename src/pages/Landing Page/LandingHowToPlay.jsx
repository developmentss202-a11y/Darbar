import React from "react";

const LandingHowToPlay = () => {
  return (
    <section id="how-to-play" className="how-to-play-section">
      {/* =========================
          TOP HEADING
      ========================= */}
      <div className="how-to-play-heading">
        <span>HOW TO PLAY</span>

        <h2>
          Play Easy, <strong>Play Smart</strong>
        </h2>

        <p>
          Follow these simple steps and start enjoying your favorite online
          games with GVSC.
        </p>
      </div>

      {/* =========================
          STEPS
      ========================= */}
      <div className="how-to-play-container">
        <div className="play-step">
          <div className="step-number">01</div>

          <div className="step-content">
            <h3>Create Your Account</h3>

            <p>
              Sign up with your details and create your GVSC account to get
              started.
            </p>
          </div>
        </div>

        <div className="play-step">
          <div className="step-number">02</div>

          <div className="step-content">
            <h3>Login to Your Account</h3>

            <p>
              Login securely using your registered details and access the gaming
              platform.
            </p>
          </div>
        </div>

        <div className="play-step">
          <div className="step-number">03</div>

          <div className="step-content">
            <h3>Choose Your Game</h3>

            <p>
              Select the game you want to play and check the available game
              rates.
            </p>
          </div>
        </div>

        <div className="play-step">
          <div className="step-number">04</div>

          <div className="step-content">
            <h3>Start Playing</h3>

            <p>
              Choose your preferred option and enjoy a smooth and exciting
              online gaming experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHowToPlay;
