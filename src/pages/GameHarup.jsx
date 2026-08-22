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

export default function GameHarup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("Andar");
  const [digit, setDigit] = useState("");
  const [points, setPoints] = useState("");
  const [addedBets, setAddedBets] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const game = games.find((g) => g.id === id);
  const gameName = game?.name || id?.toUpperCase();

  const handleAdd = () => {
    if (!digit || !points) return;
    setAddedBets((prev) => [...prev, { digit, points, type }]);
    setDigit("");
    setPoints("");
  };

  const handleRemove = (index) => {
    setAddedBets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (addedBets.length > 0) {
      /*
       * TODO: API call here
       * POST /api/game/{id}/harup
       * body: { bets: addedBets }
       */
      setShowPopup(true);
    } else {
      alert("Please add at least one bet.");
    }
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">{gameName} — HARUP</h1>
        <p className="page-subheading">
          Choose Andar/Bahar, enter digit &amp; points
        </p>
        <hr className="page-divider" />
      </div>

      {/* ===== Form ===== */}
      <div className="harup-form">
        {/* Andar / Bahar */}
        <div className="harup-row">
          <span className="harup-label">CHOOSE ANDAR / BAHAR</span>
          <div className="harup-radios">
            <label className="harup-radio">
              <input
                type="radio"
                name="andarBahar"
                value="Andar"
                checked={type === "Andar"}
                onChange={() => setType("Andar")}
              />
              <span>Andar</span>
            </label>
            <label className="harup-radio">
              <input
                type="radio"
                name="andarBahar"
                value="Bahar"
                checked={type === "Bahar"}
                onChange={() => setType("Bahar")}
              />
              <span>Bahar</span>
            </label>
          </div>
        </div>

        {/* Digit */}
        <div className="harup-row">
          <span className="harup-label">ENTER DIGIT</span>
          <input
            type="number"
            className="harup-input"
            value={digit}
            onChange={(e) => setDigit(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Points */}
        <div className="harup-row">
          <span className="harup-label">POINTS</span>
          <input
            type="number"
            className="harup-input"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="0"
          />
        </div>

        <button type="button" className="primary-button" onClick={handleAdd}>
          ADD
        </button>
      </div>

      {/* ===== Bet Table ===== */}
      <div className="app-table-wrap" style={{ marginTop: "20px" }}>
        <table className="app-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Number</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addedBets.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ color: "#777", padding: "18px" }}>
                  No bets added yet
                </td>
              </tr>
            ) : (
              addedBets.map((bet, index) => (
                <tr key={index}>
                  <td>{bet.type}</td>
                  <td>{bet.digit}</td>
                  <td>{bet.points}</td>
                  <td>
                    <button
                      type="button"
                      className="harup-remove-btn"
                      onClick={() => handleRemove(index)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                  setAddedBets([]);
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
