import { useState } from "react";

const quickAmounts = [500, 1000, 2000, 3000];

function AddMoney() {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app-page money-page">
      <div className="page-header">
        <h1 className="page-heading">Add Money</h1>
        <p className="page-subheading">Add cash to your wallet to start playing</p>
        <hr className="page-divider" />
      </div>

      <div className="wallet-hero">
        <span className="wallet-hero-label">Wallet Balance</span>
        <strong className="wallet-hero-amount">₹ 1000</strong>
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

        <button type="submit" className="primary-button">
          Add Cash
        </button>
      </form>
    </div>
  );
}

export default AddMoney;
