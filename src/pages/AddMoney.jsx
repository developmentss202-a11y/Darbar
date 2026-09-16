import { useEffect, useState } from "react";
import singleCoin from "../assets/singlegold-coin.png";
import qrPlaceholder from "../assets/qr-placeholder.svg";
import AppTable from "../components/AppTable";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";
import { WALLET_API, getWalletBalance, loadAppSettings } from "../data/wallet";

const ADD_MONEY_API = import.meta.env.DEV
  ? "/api/add-money"
  : `${import.meta.env.VITE_API_ROUTE}/api/add-money`;

const ADD_MONEY_LIST_API = import.meta.env.DEV
  ? "/api/add-money-list"
  : `${import.meta.env.VITE_API_ROUTE}/api/add-money-list`;

const quickAmounts = [500, 1000, 2000, 3000];

const historyColumns = [
  {
    key: "date",
    label: "Date",
    render: (row) => row.created_at || row.date || "-",
  },
  {
    key: "amount",
    label: "Amount",
    render: (row) => (
      <span className="history-amount-in">{row.amount ?? "-"}</span>
    ),
  },
  { key: "status", label: "Status" },
  {
    key: "message",
    label: "Message",
    render: (row) => row.pending_message || row.message || "-",
  },
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

function getAddMoneyList(data) {
  const list = data.data || data.list || data.add_money || [];
  if (Array.isArray(list)) {
    return list;
  }
  if (list && typeof list === "object") {
    const nested = list.list || list.data || list.records;
    if (Array.isArray(nested)) {
      return nested;
    }
  }
  return [];
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AddMoney() {
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [showPending, setShowPending] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [qrSrc, setQrSrc] = useState(qrPlaceholder);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);
  const [historyMessage, setHistoryMessage] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyOrder, setHistoryOrder] = useState("latest");

  useEffect(() => {
    loadAppSettings().then((settings) => {
      if (settings.qr_code) {
        setQrSrc(settings.qr_code);
      }
    });

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
      const response = await fetch(ADD_MONEY_LIST_API, {
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
      const rows = sortHistory(getAddMoneyList(data), order);

      setHistoryRows(rows);
      setHistoryMessage(rows.length ? "" : "No Add Money requests");
    } catch (err) {
      setHistoryRows([]);
      setHistoryMessage("Unable to load add money history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleScreenshot = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!amount || !screenshot) {
      return;
    }

    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setError("Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const receipt = await toBase64(screenshot);
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("receipt", receipt);

      const response = await fetch(ADD_MONEY_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        setError(
          isUnauthorizedMessage(data.message)
            ? "unauthorized"
            : data.message || "Unable to submit add money request."
        );
        return;
      }

      setPopupMessage(data.message || "Request submitted.");
      setShowPending(true);
      if (showHistory) {
        loadHistory(historyOrder);
      }
    } catch (err) {
      setError("Unable to submit add money request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupOk = () => {
    setShowPending(false);
    setPopupMessage("");
    setAmount("");
    setScreenshot(null);
    setPreview("");
    setFileKey((current) => current + 1);
  };

  return (
    <div className="app-page money-page">
      <div className="page-header">
        <h1 className="page-heading">Add Money</h1>
        <p className="page-subheading">
          Scan, pay, upload screenshot and wait for admin approval
        </p>
        <hr className="page-divider" />
      </div>

      <div className="wallet-hero">
        <div className="wallet-qr-wrap">
          <img src={qrSrc} alt="Payment QR" className="wallet-qr-image" />
          <span className="wallet-qr-caption">Scan to pay</span>
        </div>
        <span className="wallet-hero-label">Wallet Balance</span>
        <strong className="wallet-hero-amount">
          <img src={singleCoin} alt="" className="wallet-hero-coin" />
          {balance}
        </strong>
      </div>

      <form className="money-form" onSubmit={handleSubmit}>
        <label className="money-label" htmlFor="add-amount">
          Enter Amount
        </label>
        <input
          id="add-amount"
          className="money-input"
          type="number"
          inputMode="numeric"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <div className="amount-chips">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              className={`amount-chip ${
                String(amount) === String(value) ? "active" : ""
              }`}
              onClick={() => setAmount(String(value))}
            >
              {value}
            </button>
          ))}
        </div>

        <label className="money-label" htmlFor="payment-screenshot">
          Upload Screenshot
        </label>
        <label className="screenshot-upload" htmlFor="payment-screenshot">
          {preview ? (
            <img src={preview} alt="Payment screenshot" />
          ) : (
            <span>Tap to upload payment screenshot</span>
          )}
        </label>
        <input
          key={fileKey}
          id="payment-screenshot"
          className="screenshot-input"
          type="file"
          accept="image/*"
          onChange={handleScreenshot}
          required
        />

        <div className="notice-card money-note">
          <p className="notice-title">Important</p>
          <p className="notice-line">
            Scan the QR, pay the amount, then upload the payment screenshot.
          </p>
          <p className="notice-line">
            Cash is added to your wallet only after admin verification.
          </p>
        </div>

        {error === "unauthorized" ? (
          <AuthRequired />
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Add Cash"}
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
          <span>Add Amount History</span>
          <span>{showHistory ? "−" : "+"}</span>
        </button>

        {showHistory && (
          <div className="history-accordion-body">
            <div className="history-filter">
              <label htmlFor="add-history-order">Sort</label>
              <select
                id="add-history-order"
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
                {historyMessage || "No Add Money requests"}
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
              <p className="game-popup-text">{popupMessage}</p>
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

export default AddMoney;
