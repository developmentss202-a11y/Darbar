import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.png";
import whatsappIcon from "../assets/whatsapp.png";

const games = [
  {
    id: "delhi-star-dl",
    name: "DELHI STAR-DL",
    result: "**",
    status: "Closed",
    closeTime: "12:00 PM",
    resultTime: "12:30 PM",
  },
  {
    id: "rawased",
    name: "RAWASED",
    result: "**",
    status: "Running",
    closeTime: "01:00 PM",
    resultTime: "01:30 PM",
  },
  {
    id: "ilag",
    name: "ILAG",
    result: "**",
    status: "Running",
    closeTime: "02:00 PM",
    resultTime: "02:20 PM",
  },
  {
    id: "delhi-bazaar",
    name: "DELHI BAZAAR",
    result: "**",
    status: "Running",
    closeTime: "03:00 PM",
    resultTime: "03:10 PM",
  },
  {
    id: "shree-ganesh",
    name: "SHREE GANESH",
    result: "**",
    status: "Running",
    closeTime: "04:30 PM",
    resultTime: "04:40 PM",
  },
  {
    id: "faridabad",
    name: "FARIDABAD",
    result: "**",
    status: "Running",
    closeTime: "05:40 PM",
    resultTime: "06:10 PM",
  },
  {
    id: "ghaziabad",
    name: "GAZIABAD",
    result: "**",
    status: "Running",
    closeTime: "09:40 PM",
    resultTime: "10:00 PM",
  },
  {
    id: "gali",
    name: "GALI",
    result: "**",
    status: "Running",
    closeTime: "11:40 PM",
    resultTime: "12:00 AM",
  },
  {
    id: "ncr",
    name: "NCR",
    result: "**",
    status: "Running",
    closeTime: "01:00 AM",
    resultTime: "01:30 AM",
  },
  {
    id: "disawar",
    name: "DISAWAR",
    result: "**",
    status: "Running",
    closeTime: "05:00 AM",
    resultTime: "05:10 AM",
  },
];

function CloseTimeIcon() {
  return (
    <svg className="game-time-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7.5v4.7l3.2 1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResultTimeIcon() {
  return (
    <svg className="game-time-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 4.5v15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 5.2h9.2c.7 0 1.1.8.7 1.4L14.2 10l2.2 3.4c.4.6 0 1.4-.7 1.4H6.5"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      className="dashboard-contact-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M21.5 3.6 2.9 10.8c-1.3.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8 1 .8.3 0 .5-.1.7-.4l2.6-3.5 5.1 3.8c.9.5 1.6.2 1.8-.9L22.9 4.8c.3-1.2-.4-1.7-1.4-1.2zM8.7 13.4l9.8-6.1c.5-.3.9 0 .6.3l-7.9 7.1-.3 3.4-2.2-4.7z"
      />
    </svg>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <section className="dashboard-banner">
        <img
          className="dashboard-banner-image"
          src={heroImage}
          alt="Casino cards and roulette banner"
        />

        <div className="dashboard-banner-overlay">
          <span className="dashboard-banner-kicker">GVSC Live</span>
          <h1 className="dashboard-banner-title">Play. Win. Repeat.</h1>
          <p className="dashboard-banner-text">
            Cards, casino-style action, and daily markets — all in one place.
          </p>
        </div>
      </section>

      <div className="dashboard-contact-strip">
        <a
          className="dashboard-contact-btn dashboard-contact-btn--telegram"
          href="https://t.me/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon />
          <span>Telegram</span>
        </a>
        <a
          className="dashboard-contact-btn dashboard-contact-btn--whatsapp"
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={whatsappIcon} alt="Whatsapp Icon" />
          <span>WhatsApp</span>
        </a>
      </div>

      <section className="dashboard-games" aria-label="Game markets">
        {games.map((game) => {
          const statusClass = game.status.toLowerCase();

          return (
            <article
              key={game.id}
              className={`game-card game-card--${statusClass}`}
            >
              <div className="game-card-header">
                <h2 className="game-card-name">{game.name}</h2>
                <span
                  className={`game-card-status game-card-status--${statusClass}`}
                >
                  {game.status}
                </span>
              </div>

              <div className="game-card-timer">
                <span className="game-time-pill">
                  <span className="game-time-icon" aria-hidden="true">
                    <CloseTimeIcon />
                  </span>
                  <span className="game-time-text">
                    Close Time
                    <strong>{game.closeTime}</strong>
                  </span>
                </span>
                <span className="game-time-pill">
                  <span className="game-time-icon" aria-hidden="true">
                    <ResultTimeIcon />
                  </span>
                  <span className="game-time-text">
                    Result Time
                    <strong>{game.resultTime}</strong>
                  </span>
                </span>
              </div>

              <button
                type="button"
                className="game-play-button"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                Play Now
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Dashboard;
