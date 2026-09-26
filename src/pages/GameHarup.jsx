import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  expandHarupNumbers,
  placePattiBet,
  resolveMarketName,
  resolveUserId,
} from "../utils/betting";

export default function GameHarup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [marketName, setMarketName] = useState(location.state?.name || "");
  const [type, setType] = useState("Andar");
  const [digit, setDigit] = useState("");
  const [points, setPoints] = useState("");
  const [addedBets, setAddedBets] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let cancelled = false;

    resolveMarketName(id, location.state?.name).then((name) => {
      if (!cancelled) {
        setMarketName(name);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id, location.state?.name]);

  const handleAdd = () => {
    const expanded = expandHarupNumbers(digit, points, type);

    if (!expanded.length) {
      setError("Enter a digit (0-9) and points first.");
      return;
    }

    setError("");
    setAddedBets((prev) => {
      const next = [...prev];

      expanded.forEach((row) => {
        const existing = next.findIndex((bet) => bet.number === row.number);
        if (existing >= 0) {
          next[existing] = row;
        } else {
          next.push(row);
        }
      });

      return next;
    });
    setDigit("");
    setPoints("");
  };

  const handleRemove = (index) => {
    setAddedBets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!addedBets.length) {
      setError("Please add at least one bet.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const userId = await resolveUserId();
      if (!userId) {
        setError("Please login again.");
        return;
      }

      await placePattiBet({
        userId,
        marketId: id,
        betType: "Jodi",
        gameType: "harup",
        bets: addedBets,
      });
      setShowPopup(true);
    } catch (err) {
      setError(err.message || "Unable to place bet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">{marketName || "Market"} — HARUP</h1>
        <p className="page-subheading">
          Choose Andar/Bahar, enter digit &amp; points
        </p>
        <hr className="page-divider" />
      </div>

      <div className="harup-form">
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

        <div className="harup-row">
          <span className="harup-label">ENTER DIGIT</span>
          <input
            type="number"
            className="harup-input"
            value={digit}
            onChange={(e) =>
              setDigit(e.target.value.replace(/\D/g, "").slice(0, 1))
            }
            placeholder="0"
            min="0"
            max="9"
            inputMode="numeric"
          />
        </div>

        <div className="harup-row">
          <span className="harup-label">POINTS</span>
          <input
            type="number"
            className="harup-input"
            value={points}
            onChange={(e) => setPoints(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            inputMode="numeric"
          />
        </div>

        <button type="button" className="primary-button" onClick={handleAdd}>
          ADD
        </button>
      </div>

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
                <tr key={`${bet.type}-${bet.number}-${index}`}>
                  <td>{bet.type}</td>
                  <td>{bet.number}</td>
                  <td>{bet.amount}</td>
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

      {error ? <p className="form-error">{error}</p> : null}

      <div style={{ marginTop: "24px" }}>
        <button
          type="button"
          className="primary-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate(`/game/${id}`, { state: { name: marketName } })}
          aria-label="Go back"
        >
          GO BACK
        </button>
      </div>

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
