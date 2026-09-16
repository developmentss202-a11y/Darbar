import { useEffect, useState } from "react";
import singleCoin from "../assets/singlegold-coin.png";
import { WALLET_API, getWalletBalance } from "../data/wallet";
import AppTable from "../components/AppTable";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";

const WITHDRAW_API = import.meta.env.DEV
  ? "/api/amount-request"
  : `${import.meta.env.VITE_API_ROUTE}/api/amount-request`;

const WITHDRAW_LIST_API = import.meta.env.DEV
  ? "/api/withdraw-list"
  : `${import.meta.env.VITE_API_ROUTE}/api/withdraw-list`;

const historyColumns = [
  {
    key: "date",
    label: "Date",
    render: (row) => row.created_at || row.date || "-",
  },
  { key: "amount", label: "Amount" },
  {
    key: "upi",
    label: "UPI ID",
    render: (row) => row.upi_id || row.upi || "-",
  },
  { key: "status", label: "Status" },
];

function sortHistory(list, order) {
  return [...list].sort((a, b) => {
    const aTime = new Date(a.created_at || a.date || 0).getTime();
    const bTime = new Date(b.created_at || b.date || 0).getTime();
    const diff = bTime - aTime;
    if (diff !== 0) {
      return order === "oldest" ? -diff : diff;
    }
    const idDiff = (b.id || 0) - (a.id || 0);
    return order === "oldest" ? -idDiff : idDiff;
  });
}

function WithdrawMoney() {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);
  const [historyMessage, setHistoryMessage] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyOrder, setHistoryOrder] = useState("latest");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      return;
    }

    fetch(WALLET_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json().catch(() => ({})))
      .then((data) => {
        if (data.status === 0) {
          return;
        }
        setBalance(getWalletBalance(data));
      })
      .catch(() => {});
  }, []);

  const loadHistory = async (order = historyOrder) => {
    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setHistoryRows([]);
      setHistoryMessage("unauthorized");
      return;
    }

    setHistoryLoading(true);

    try {
      const response = await fetch(WITHDRAW_LIST_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => ({}));
      if (isUnauthorizedMessage(data.message)) {
        setHistoryRows([]);
        setHistoryMessage("unauthorized");
        return;
      }
      const list = data.data || data.list || data.withdraws || [];
      const rows = Array.isArray(list) ? sortHistory(list, order) : [];

      setHistoryRows(rows);
      setHistoryMessage(rows.length ? "" : "No Withdrawals");
    } catch (err) {
      setHistoryRows([]);
      setHistoryMessage("Unable to load withdrawal history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!amount || !upiId) {
      return;
    }

    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setError("Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(WITHDRAW_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          upi_id: upiId.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        setError(
          isUnauthorizedMessage(data.message)
            ? "unauthorized"
            : data.message || "Unable to submit withdraw request."
        );
        return;
      }

      setShowPending(true);
    } catch (err) {
      setError("Unable to submit withdraw request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupOk = () => {
    setShowPending(false);
    setAmount("");
    setUpiId("");
  };

  return (
    <div className="app-page money-page">
      <div className="page-header">
        <h1 className="page-heading">Withdraw Money</h1>
        <p className="page-subheading">
          Enter your UPI ID to receive the withdrawal
        </p>
        <hr className="page-divider" />
      </div>

      <div className="wallet-hero">
        <span className="wallet-hero-label">Wallet Balance</span>
        <strong className="wallet-hero-amount">
          <img src={singleCoin} alt="" className="wallet-hero-coin" />
          {balance}
        </strong>
      </div>

      <form className="money-form" onSubmit={handleSubmit}>
        <label className="money-label" htmlFor="withdraw-upi">
          UPI ID
        </label>
        <input
          id="withdraw-upi"
          className="money-input"
          type="text"
          inputMode="email"
          placeholder="name@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          required
        />

        <label className="money-label" htmlFor="withdraw-amount">
          Enter Amount
        </label>
        <input
          id="withdraw-amount"
          className="money-input"
          type="number"
          inputMode="numeric"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {error === "unauthorized" ? (
          <AuthRequired />
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Withdraw"}
        </button>
      </form>

      <div className="history-accordion">
        <button
          type="button"
          className="history-accordion-btn"
          onClick={() => {
            const nextOpen = !showHistory;
            setShowHistory(nextOpen);
            if (nextOpen) {
              loadHistory(historyOrder);
            }
          }}
        >
          <span>Withdrawal History</span>
          <span>{showHistory ? "−" : "+"}</span>
        </button>

        {showHistory && (
          <div className="history-accordion-body">
            <div className="history-filter">
              <label htmlFor="history-order">Sort</label>
              <select
                id="history-order"
                className="history-filter-select"
                value={historyOrder}
                onChange={(event) => {
                  const nextOrder = event.target.value;
                  setHistoryOrder(nextOrder);
                  setHistoryRows((current) => sortHistory(current, nextOrder));
                }}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {historyLoading && (
              <p className="page-subheading">Loading history...</p>
            )}

            {!historyLoading && historyMessage === "unauthorized" && (
              <AuthRequired />
            )}

            {!historyLoading &&
              historyMessage !== "unauthorized" &&
              historyRows.length === 0 && (
              <p className="history-empty">
                {historyMessage || "No Withdrawals"}
              </p>
            )}

            {!historyLoading && historyRows.length > 0 && (
              <AppTable columns={historyColumns} rows={historyRows} />
            )}
          </div>
        )}
      </div>

      {showPending && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">REQUEST SENT</div>
            <div className="game-popup-body">
              <p className="game-popup-text">
                Withdraw request submitted. Amount will be sent to your UPI
                after verification.
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={handlePopupOk}
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

export default WithdrawMoney;
