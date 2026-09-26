import { useEffect, useMemo, useState } from "react";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";

const RESULT_HISTORY_API = import.meta.env.DEV
  ? "/api/result-history"
  : `${import.meta.env.VITE_API_ROUTE}/api/result-history`;

function mapHistory(item) {
  return {
    id: `${item.market_id}-${item.date}-${item.game_type}`,
    date: item.date || "-",
    title: item.title || `${item.market_name || "-"} - ${item.game_type || ""}`.trim(),
    results: Array.isArray(item.items) ? item.items : [],
  };
}

async function fetchResultsPage(token, page) {
  const url =
    page > 1 ? `${RESULT_HISTORY_API}?page=${page}` : RESULT_HISTORY_API;

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

function ResultHistory() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
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
        const first = await fetchResultsPage(token, 1);

        if (isUnauthorizedMessage(first.data.message)) {
          if (!cancelled) {
            setError("unauthorized");
            setHistory([]);
          }
          return;
        }

        if (!first.response.ok || first.data.status === 0) {
          if (!cancelled) {
            setError(first.data.message || "Unable to load result history.");
            setHistory([]);
          }
          return;
        }

        const lastPage = Number(first.data.last_page) || 1;
        let list = Array.isArray(first.data.data) ? first.data.data : [];

        for (let nextPage = 2; nextPage <= lastPage; nextPage += 1) {
          const next = await fetchResultsPage(token, nextPage);
          if (cancelled) {
            return;
          }
          if (Array.isArray(next.data.data)) {
            list = list.concat(next.data.data);
          }
        }

        if (!cancelled) {
          setHistory(list.map(mapHistory));
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load result history.");
          setHistory([]);
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

  const pageCount = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const pagedHistory = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return history.slice(start, start + PAGE_SIZE);
  }, [history, page]);

  return (
    <div className="app-page result-history-page">
      <div className="page-header">
        <h1 className="page-heading">Result History</h1>
        <p className="page-subheading">Check your previous market results</p>
        <hr className="page-divider" />
      </div>

      {loading && <p className="page-subheading">Loading result history...</p>}

      {!loading && error === "unauthorized" && <AuthRequired />}

      {!loading && error && error !== "unauthorized" && (
        <p className="form-error">{error}</p>
      )}

      {!loading && !error && history.length === 0 && (
        <p className="history-empty">No result history yet</p>
      )}

      {!loading && !error && history.length > 0 && (
        <>
          <div className="result-history-list">
            {pagedHistory.map((item) => (
              <div className="result-history-card" key={item.id}>
                <div className="result-card-header">
                  <span className="result-card-date">Date: {item.date}</span>
                  <span className="result-card-game">{item.title}</span>
                </div>

                <div className="result-table-scroll">
                  <div className="result-table-header">
                    <span>Session</span>
                    <span>Number</span>
                    <span>Status</span>
                    <span>Bid</span>
                    <span>Won</span>
                  </div>

                  <div className="result-table-body">
                    {item.results.length === 0 ? (
                      <div className="result-table-row">
                        <span style={{ gridColumn: "1 / -1" }}>No results</span>
                      </div>
                    ) : (
                      item.results.map((result) => (
                        <div className="result-table-row" key={result.id}>
                          <span>{result.session || "-"}</span>
                          <span>{result.number ?? "-"}</span>
                          <span
                            className={`result-status ${String(result.status || "")
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {result.status || "-"}
                          </span>
                          <span>{result.bid ?? 0}</span>
                          <span className="result-won">{result.won ?? 0}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            className="resultPagination"
          />
        </>
      )}
    </div>
  );
}

export default ResultHistory;
