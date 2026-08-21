function HowToPlay() {
  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">How to Play / Notice</h1>
        <p className="page-subheading">
          Important rules for deposit and withdrawal
        </p>
        <hr className="page-divider" />
      </div>

      <div className="notice-card">
        <div className="notice-block">
          <p className="notice-line">Monday To Sunday</p>
          <p className="notice-line">
            विड्रॉल सोमवार से शनिवार तक चालू रहेगा
          </p>
        </div>

        <div className="notice-block">
          <p className="notice-line">Withdraw any time (24 Hours)</p>
          <p className="notice-line">
            कृपया विड्रॉल का मैसेज डालने के बाद 4 से 6 घंटे का इन्तज़ार करें।
            आपको आपका पेमेंट मिल जाएगा।
          </p>
        </div>

        <div className="notice-block">
          <p className="notice-line">Deposit any time (24 Hours)</p>
          <div className="notice-rates">
            <div className="notice-rate">
              <span>Minimum Add</span>
              <strong>100/-</strong>
            </div>
            <div className="notice-rate">
              <span>Minimum Withdraw</span>
              <strong>300/-</strong>
            </div>
          </div>
        </div>

        <p className="notice-highlight">
          रविवार को किसी भी प्रकार का मैसेज ना करें
        </p>
      </div>
    </div>
  );
}

export default HowToPlay;
