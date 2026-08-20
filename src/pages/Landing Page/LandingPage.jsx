import React from "react";
import "../../pages/Landing Page/css/Landing.css";
import LandingHeader from "./LandingHeader";
import LandingHome from "./LandingHome";
import LandingAbout from "./LandingAbout";
import LandingGames from "./LandingGames";
import LandingHowToPlay from "./LandingHowToPlay";
import LandingFooter from "./LandingFooter";

const LandingPage = () => {
  return (
    <div>
      <LandingHeader />
      <LandingHome />
      <LandingAbout />
      <LandingGames />
      <LandingHowToPlay />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
