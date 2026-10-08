import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  placePattiBet,
  resolveMarketName,
  resolveUserId,
} from "../utils/betting";
import { loadAvailableWallet, notifyWalletChanged } from "../data/wallet";

const JODI_MIN_LENGTH = 2;
const JODI_MAX_LENGTH = 4;

export default function GameJodi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [marketName, setMarketName] = useState(location.state?.name || "");
  const [bets, setBets] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmptyPopup, setShowEmptyPopup] = useState(false);

  const numbers = Array.from({ length: 100 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

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

  const handleBetChange = (num, value) => {
    const digits = String(value).replace(/\D/g, "").slice(0, JODI_MAX_LENGTH);
    setBets((prev) => ({ ...prev, [num]: digits }));
  };

  const handleSubmit = async () => {
    const filled = Object.entries(bets)
      .filter(([, amount]) => String(amount || "").trim())
      .map(([number, amount]) => ({ number, amount: String(amount) }));
    const validBets = filled.filter(
      (bet) =>
        bet.amount.length >= JODI_MIN_LENGTH &&
        bet.amount.length <= JODI_MAX_LENGTH
    );

    if (!filled.length || validBets.length !== filled.length) {
      setShowEmptyPopup(true);
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

      const total = validBets.reduce(
        (sum, bet) => sum + (Number(bet.amount) || 0),
        0
      );
      const available = await loadAvailableWallet();
      if (total > Number(available)) {
        setError("Not enough wallet balance for this bet.");
        return;
      }

      await placePattiBet({
        userId,
        marketId: id,
        betType: "Jodi",
        gameType: "jodi",
        bets: validBets,
      });
      notifyWalletChanged();
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
        <h1 className="page-heading">{marketName || "Market"} — JODI</h1>
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
              type="text"
              inputMode="numeric"
              className="jodi-input"
              placeholder="–"
              maxLength={JODI_MAX_LENGTH}
              value={bets[num] || ""}
              onChange={(e) => handleBetChange(num, e.target.value)}
            />
          </div>
        ))}
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

      {showEmptyPopup && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">ADD SOMETHING</div>
            <div className="game-popup-body">
              <p className="game-popup-text">
                Please add points of 2 to 4 digits on at least one number.
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowEmptyPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

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
