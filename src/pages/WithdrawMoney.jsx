import { useState } from "react";

function WithdrawMoney() {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app-page money-page">
      <div className="page-header">
        <h1 className="page-heading">Withdraw Money</h1>
        <p className="page-subheading">Withdraw your winnings to your account</p>
        <hr className="page-divider" />
      </div>

      <div className="wallet-hero">
        <span className="wallet-hero-label">Wallet Balance</span>
        <strong className="wallet-hero-amount">₹ 1000</strong>
      </div>

      <form className="money-form" onSubmit={handleSubmit}>
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
        />

        <button type="submit" className="primary-button">
          Withdraw
        </button>
      </form>
    </div>
  );
}

export default WithdrawMoney;
