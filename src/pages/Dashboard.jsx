import heroImage from "../assets/hero-image.png";

const games = [
  {
    id: "gali",
    name: "Gali",
    result: "89",
    status: "Closed",
    time: "02:55 PM",
  },
  {
    id: "desawar",
    name: "Desawar",
    result: "89",
    status: "Closed",
    time: "02:55 PM",
  },
  {
    id: "ghaziabad",
    name: "Ghaziabad",
    result: "**",
    status: "Running",
    time: "02:55 PM",
  },
  {
    id: "faridabad",
    name: "Faridabad",
    result: "**",
    status: "Running",
    time: "02:55 PM",
  },
  {
    id: "darbar",
    name: "Darbar",
    result: "**",
    status: "Running",
    time: "02:55 PM",
  },
];

function HourglassIcon() {
  return (
    <svg className="game-hourglass-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3.5h12v3.2c0 2.1-1.3 3.9-3.2 4.6 1.9.7 3.2 2.5 3.2 4.6v3.2H6v-3.2c0-2.1 1.3-3.9 3.2-4.6C7.3 10.6 6 8.8 6 6.7V3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        className="game-hourglass-sand-top"
        d="M8.2 5.2h7.6v1.2c0 1.8-1.7 3.2-3.8 3.2s-3.8-1.4-3.8-3.2V5.2z"
        fill="currentColor"
      />
      <path
        className="game-hourglass-sand-bottom"
        d="M9.4 18.8h5.2v-1.1c0-1.3-1.2-2.3-2.6-2.3s-2.6 1-2.6 2.3v1.1z"
        fill="currentColor"
      />
    </svg>
  );
}

const Dashboard = () => {
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
                <p className="game-card-result">
                  <span className="game-card-number">{game.result}</span>{" "}
                  <span
                    className={`game-card-status game-card-status--${statusClass}`}
                  >
                    {game.status}
                  </span>
                </p>
              </div>

              <div className="game-card-timer">
                <span className="game-hourglass" aria-hidden="true">
                  <HourglassIcon />
                </span>
                <span className="game-card-time">Time - {game.time}</span>
              </div>

              <button type="button" className="game-play-button">
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
