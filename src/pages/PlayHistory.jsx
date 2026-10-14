import { useEffect, useState } from "react";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";

const BET_HISTORY_API = import.meta.env.DEV
  ? "/api/bet-history"
  : `${import.meta.env.VITE_API_ROUTE}/api/bet-history`;

function splitDateTime(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(.+?)\s+(\d{1,2}:\d{2}\s*[AP]M)$/i);

  if (match) {
    return { date: match[1], time: match[2] };
  }

  return { date: text || "-", time: "" };
}

function mapBet(item) {
  const { date, time } = splitDateTime(item.created_at);

  return {
    id: item.id,
    date,
    time,
    market: item.market?.name || "-",
    type: item.bet_type || item.patti_type || "-",
    number: item.selected_number ?? "-",
    points: item.value_on_number ?? "-",
  };
}

function mergeBets(list) {
  const grouped = new Map();

  list.forEach((item) => {
    const bet = mapBet(item);
    const key = `${bet.date}|${bet.market}|${bet.type}`;
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        id: bet.id || key,
        date: bet.date,
        time: bet.time,
        market: bet.market,
        type: bet.type,
        bets: [bet],
      });
      return;
    }

    existing.bets.push(bet);
    if (!existing.time && bet.time) {
      existing.time = bet.time;
    }
  });

  return [...grouped.values()];
}

async function fetchBetsPage(token, page) {
  const url = page > 1 ? `${BET_HISTORY_API}?page=${page}` : BET_HISTORY_API;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

function PlayHistory() {
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const token = localStorage.getItem("gvsc-token");
      if (!token) {
        setError("unauthorized");
        setLoading(false);
        return;
      }

      try {
        const first = await fetchBetsPage(token, 1);

        if (isUnauthorizedMessage(first.data.message)) {
          if (!cancelled) {
            setError("unauthorized");
            setRows([]);
          }
          return;
        }

        if (!first.response.ok || first.data.status === 0) {
          if (!cancelled) {
            setError(first.data.message || "Unable to load play history.");
            setRows([]);
          }
          return;
        }

        const lastPage = Number(first.data.last_page) || 1;
        let list = Array.isArray(first.data.data) ? first.data.data : [];

        for (let page = 2; page <= lastPage; page += 1) {
          const next = await fetchBetsPage(token, page);
          if (cancelled) {
            return;
          }
          if (Array.isArray(next.data.data)) {
            list = list.concat(next.data.data);
          }
        }

        if (!cancelled) {
          const grouped = mergeBets(list);
          setRows(grouped);
          setOpenId(grouped[0]?.id || "");
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load play history.");
          setRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-page play-history-page">
      <div className="page-header">
        <h1 className="page-heading">My Play History</h1>
        <p className="page-subheading">See your recent bets and market results</p>
        <hr className="page-divider" />
      </div>

      {loading && <p className="page-subheading">Loading play history...</p>}

      {!loading && error === "unauthorized" && <AuthRequired />}

      {!loading && error && error !== "unauthorized" && (
        <p className="form-error">{error}</p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="history-empty">No play history yet</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="play-history-list">
          {rows.map((row) => {
            const isOpen = openId === row.id;

            return (
              <article
                className={`play-history-card ${isOpen ? "is-open" : ""}`}
                key={row.id}
              >
                <button
                  type="button"
                  className="play-history-accordion-btn"
                  onClick={() => setOpenId(isOpen ? "" : row.id)}
                  aria-expanded={isOpen}
                >
                  <div className="play-history-when">
                    <strong>{row.date}</strong>
                    {row.time ? <span>{row.time}</span> : null}
                  </div>
                  <div className="play-history-summary">
                    <span className="play-history-market">{row.market}</span>
                    <span className="play-history-type">{row.type}</span>
                  </div>
                  <span className="play-history-toggle" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen ? (
                  <div className="play-history-body">
                    <div className="play-history-table">
                      <div className="play-history-table-head">
                        <span>Number</span>
                        <span>Points</span>
                      </div>
                      {row.bets.map((bet, index) => (
                        <div
                          className="play-history-table-row"
                          key={bet.id || `${row.id}-${bet.number}-${index}`}
                        >
                          <strong>{bet.number}</strong>
                          <strong>{bet.points}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PlayHistory;
