import React from "react";

const LandingAbout = () => {
  return (
    <section id="about" className="about-section">
      {/* Section Heading */}
      <div className="about-heading">
        <span>ABOUT US</span>
        <h2>
          Get to Know <strong>GVSC</strong>
        </h2>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* Left Content */}
        <div className="about-content">
          <h3>
            Welcome to
            <br />
            <span>GVSC Online Games</span>
          </h3>

          <p>
            GVSC is an online gaming platform created to provide an exciting,
            smooth, and enjoyable gaming experience. Our goal is to bring
            everything you need to enjoy online games together in one simple
            platform.
          </p>

          <p>
            Whether you are looking for exciting games or simply want to enjoy
            your free time, GVSC gives you a place to play, explore, and enjoy.
          </p>
        </div>

        {/* Right Features */}
        <div className="about-features">
          <div className="about-feature">
            <div className="feature-number">01</div>

            <div>
              <h3>Exciting Games</h3>
              <p>
                Enjoy a variety of engaging online games designed for an
                exciting experience.
              </p>
            </div>
          </div>

          <div className="about-feature">
            <div className="feature-number">02</div>

            <div>
              <h3>Smooth Experience</h3>
              <p>
                Enjoy simple navigation and smooth gameplay across the platform.
              </p>
            </div>
          </div>

          <div className="about-feature">
            <div className="feature-number">03</div>

            <div>
              <h3>Play Anytime</h3>
              <p>
                Access your favorite games whenever you want and enjoy your
                gaming time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
