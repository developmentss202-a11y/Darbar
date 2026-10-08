import { useEffect, useState } from "react";
import AppTable from "../components/AppTable";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";
import { MARKETS_API } from "../utils/betting";

const LEAK_JODI_API = import.meta.env.DEV
  ? "/api/leak-jodi-result"
  : `${import.meta.env.VITE_API_ROUTE}/api/leak-jodi-result`;

const columns = [
  {
    key: "market",
    label: "Market Name",
    render: (row) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 600,
        }}
      >
        <span
          style={{
            color: "#FFD700",
            fontSize: "16px",
          }}
        >
          ●
        </span>
        {row.market}
      </div>
    ),
  },
  {
    key: "leakJodi",
    label: "Leak Jodi",
    render: (row) => (
      <span
        className="leak-jodi-value"
        style={{
          color: "#FFD700",
          fontWeight: 700,
          letterSpacing: "4px",
          fontSize: "18px",
        }}
      >
        {row.leakJodi}
      </span>
    ),
  },
];

function timeToMinutes(time) {
  const text = String(time || "").trim();
  if (!text) {
    return null;
  }

  const match = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(AM|PM))?$/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const mer = (match[3] || "").toUpperCase();

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  if (mer === "PM" && hour < 12) {
    hour += 12;
  }
  if (mer === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}

function shouldHideLeakJodi(markets) {
  const closeMinutes = markets
    .map((market) =>
      timeToMinutes(
        market.o_end_time ||
          market.close_end_time ||
          market.c_end_time ||
          market.close_time
      )
    )
    .filter((value) => value !== null);

  if (!closeMinutes.length) {
    return false;
  }

  const lastClose = Math.max(...closeMinutes);
  const hideAt = (lastClose + 60) % (24 * 60);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (lastClose + 60 >= 24 * 60) {
    return nowMinutes >= hideAt && nowMinutes < lastClose;
  }

  return nowMinutes >= hideAt;
}

function mapLeakRow(item, hideNumbers) {
  const leak = item.leak_jodi ?? item.value ?? "--";
  const value = leak === "" || leak == null ? "--" : String(leak);

  return {
    id: item.market_id || item.name,
    market: item.market_name || item.name || "-",
    leakJodi: hideNumbers ? "**" : value,
  };
}

async function fetchLeakPage(token, page) {
  const url = page > 1 ? `${LEAK_JODI_API}?page=${page}` : LEAK_JODI_API;

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

function LeakJodi() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("Leak Jodi");
  const [subtitle, setSubtitle] = useState("Latest leak jodi for all markets");
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
        const first = await fetchLeakPage(token, 1);

        if (isUnauthorizedMessage(first.data.message)) {
          if (!cancelled) {
            setError("unauthorized");
            setRows([]);
          }
          return;
        }

        if (!first.response.ok || first.data.status === 0) {
          if (!cancelled) {
            setError(first.data.message || "Unable to load leak jodi.");
            setRows([]);
          }
          return;
        }

        if (first.data.title) {
          setTitle(first.data.title);
        }
        if (first.data.subtitle) {
          setSubtitle(first.data.subtitle);
        }

        const lastPage = Number(first.data.last_page) || 1;
        let list = Array.isArray(first.data.data) ? first.data.data : [];

        for (let page = 2; page <= lastPage; page += 1) {
          const next = await fetchLeakPage(token, page);
          if (cancelled) {
            return;
          }
          if (Array.isArray(next.data.data)) {
            list = list.concat(next.data.data);
          }
        }

        let hideNumbers = false;
        try {
          const marketsResponse = await fetch(MARKETS_API, {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          const marketsData = await marketsResponse.json().catch(() => ({}));
          const markets = Array.isArray(marketsData.data) ? marketsData.data : [];
          hideNumbers = shouldHideLeakJodi(markets);
        } catch (err) {
          hideNumbers = false;
        }

        if (!cancelled) {
          setRows(list.map((item) => mapLeakRow(item, hideNumbers)));
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load leak jodi.");
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
    <div className="app-page leak-jodi-page">
      <div className="page-header">
        <h1 className="page-heading">{title}</h1>
        <p className="page-subheading">{subtitle}</p>
        <hr className="page-divider" />
      </div>

      {loading && <p className="page-subheading">Loading leak jodi...</p>}

      {!loading && error === "unauthorized" && <AuthRequired />}

      {!loading && error && error !== "unauthorized" && (
        <p className="form-error">{error}</p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="history-empty">No leak jodi available</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <AppTable columns={columns} rows={rows} />
      )}
    </div>
  );
}

export default LeakJodi;
