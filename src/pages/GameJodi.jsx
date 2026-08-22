import { useState } from "react";
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

export default function GameJodi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bets, setBets] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const game = games.find((g) => g.id === id);
  const gameName = game?.name || id?.toUpperCase();

  const numbers = Array.from({ length: 100 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const handleBetChange = (num, value) => {
    setBets((prev) => ({ ...prev, [num]: value }));
  };

  const handleSubmit = () => {
    const validBets = Object.keys(bets).filter(
      (key) => bets[key] && parseInt(bets[key]) > 0,
    );
    if (validBets.length > 0) {
      /*
       * TODO: API call here
       * POST /api/game/{id}/jodi
       * body: { bets: validBets.map(n => ({ number: n, points: bets[n] })) }
       */
      setShowPopup(true);
    } else {
      alert("Please enter points for at least one number.");
    }
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">{gameName} — JODI</h1>
        <p className="page-subheading">
          Enter points on the numbers you want to play
        </p>
        <hr className="page-divider" />
      </div>

      <div className="jodi-grid">
        {numbers.map((num) => (
          <div key={num} className="jodi-cell">
            <div className="jodi-num">{num}</div>
            <input
              type="number"
              className="jodi-input"
              placeholder="–"
              value={bets[num] || ""}
              onChange={(e) => handleBetChange(num, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        <button type="button" className="primary-button" onClick={handleSubmit}>
          SUBMIT
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate(`/game/${id}`)}
          aria-label="Go back"
        >
          GO BACK
        </button>
      </div>

      {/* ===== Success Popup ===== */}
      {showPopup && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">SUCCESS</div>
            <div className="game-popup-body">
              <p className="game-popup-text">Bet Successfully Placed</p>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setShowPopup(false);
                  setBets({});
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
