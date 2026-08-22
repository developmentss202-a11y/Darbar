import { useParams, useNavigate } from "react-router-dom";

const games = [
  { id: "delhi-star-dl", name: "DELHI STAR-DL" },
  { id: "rawased", name: "RAWASED" },
  { id: "ilag", name: "ILAG" },
  { id: "delhi-bazaar", name: "DELHI BAZAAR" },
  { id: "shree-ganesh", name: "SHREE GANESH" },
  { id: "faridabad", name: "FARIDABAD" },
  { id: "ghaziabad", name: "GAZIABAD" },
  { id: "gali", name: "GALI" },
  { id: "ncr", name: "NCR" },
  { id: "disawar", name: "DISAWAR" },
];

export default function GameOptions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = games.find((g) => g.id === id);
  const gameName = game?.name || id?.toUpperCase();

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">{gameName}</h1>
        <p className="page-subheading">Select game type to play</p>
        <hr className="page-divider" />
      </div>

      <div className="game-type-grid">
        {/* JODI Card */}
        <button
          type="button"
          className="game-type-card"
          onClick={() => navigate(`/game/${id}/jodi`)}
        >
          <span className="game-type-icon game-type-icon--jodi">💎</span>
          <span className="game-type-name game-type-name--jodi">JODI</span>
        </button>

        {/* HARUP Card */}
        <button
          type="button"
          className="game-type-card"
          onClick={() => navigate(`/game/${id}/harup`)}
        >
          <span className="game-type-icon game-type-icon--harup">🔶</span>
          <span className="game-type-name game-type-name--harup">HARUP</span>
        </button>
      </div>
      <div className="page-footer">
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go back"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
