import { useEffect, useState } from "react";
import AppTable from "../components/AppTable";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";

const TRANSACTIONS_API = import.meta.env.DEV
  ? "/api/transaction-history"
  : `${import.meta.env.VITE_API_ROUTE}/api/transaction-history`;

const columns = [
  {
    key: "date",
    label: "Date",
    render: (row) => (
      <span className="table-datetime">
        <span>{row.date}</span>
        <span>{row.time}</span>
      </span>
    ),
  },
  { key: "type", label: "Type" },
  { key: "detail", label: "Detail" },
  { key: "points", label: "Points" },
];

function splitDateTime(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(.+?)\s+(\d{1,2}:\d{2}\s*[AP]M)$/i);

  if (match) {
    return { date: match[1], time: match[2] };
  }

  return { date: text || "-", time: "" };
}

function mapTransaction(item) {
  const { date, time } = splitDateTime(item.created_at);

  return {
    id: item.id,
    date,
    time,
    type: item.transaction_type || "-",
    detail: item.message || "-",
    points: item.amount ?? "-",
  };
}

async function fetchTransactionsPage(token, page) {
  const url =
    page > 1 ? `${TRANSACTIONS_API}?page=${page}` : TRANSACTIONS_API;

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

function Transactions() {
  const [rows, setRows] = useState([]);
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
        const first = await fetchTransactionsPage(token, 1);

        if (isUnauthorizedMessage(first.data.message)) {
          if (!cancelled) {
            setError("unauthorized");
            setRows([]);
          }
          return;
        }

        if (!first.response.ok || first.data.status === 0) {
          if (!cancelled) {
            setError(first.data.message || "Unable to load transactions.");
            setRows([]);
          }
          return;
        }

        const lastPage = Number(first.data.last_page) || 1;
        let list = Array.isArray(first.data.data) ? first.data.data : [];

        for (let page = 2; page <= lastPage; page += 1) {
          const next = await fetchTransactionsPage(token, page);
          if (cancelled) {
            return;
          }
          if (Array.isArray(next.data.data)) {
            list = list.concat(next.data.data);
          }
        }

        if (!cancelled) {
          setRows(list.map(mapTransaction));
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load transactions.");
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
    <div className="app-page transactions-page">
      <div className="page-header">
        <h1 className="page-heading">Transaction History</h1>
        <p className="page-subheading">
          Track deposits, withdrawals, bets and winnings
        </p>
        <hr className="page-divider" />
      </div>

      {loading && <p className="page-subheading">Loading transactions...</p>}

      {!loading && error === "unauthorized" && <AuthRequired />}

      {!loading && error && error !== "unauthorized" && (
        <p className="form-error">{error}</p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="history-empty">No transactions yet</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <AppTable columns={columns} rows={rows} />
      )}
    </div>
  );
}

export default Transactions;
