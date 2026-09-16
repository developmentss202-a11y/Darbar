import { useEffect, useState } from "react";
import { loadAppSettings, referralSettings } from "../data/wallet";
import { copyText, shareText } from "../utils/share";

function ReferAndEarn() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    loadAppSettings().then((settings) => {
      setShareUrl(settings.share_url || "");
    });
  }, []);

  const markCopied = () => {
    setCopied(true);
    setStatus("Code copied");
    window.setTimeout(() => {
      setCopied(false);
      setStatus("");
    }, 1800);
  };

  const handleCopy = () => {
    const ok = copyText(referralSettings.code);
    if (ok) {
      markCopied();
    }
  };

  const handleShare = () => {
    shareText({
      title: "GVSC Refer & Earn",
      text: referralSettings.shareText,
      url: shareUrl,
    }).then((result) => {
      if (result === "copied") {
        markCopied();
        setStatus("Link copied. Paste it to share.");
      }
    });
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">Refer & Earn</h1>
        <p className="page-subheading">
          Invite friends and earn rewards when they join
        </p>
        <hr className="page-divider" />
      </div>

      <div className="refer-code-card">
        <span className="wallet-hero-label">Your referral code</span>
        <strong className="refer-code">{referralSettings.code}</strong>
        <div className="refer-actions">
          <button
            type="button"
            className="refer-action-btn"
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            className="refer-action-btn"
            onClick={handleShare}
          >
            Share
          </button>
        </div>
        {status ? <p className="refer-status">{status}</p> : null}
      </div>

      <div className="refer-stats">
        <div className="refer-stat">
          <strong>{referralSettings.invited}</strong>
          <span>Friends joined</span>
        </div>
        <div className="refer-stat">
          <strong>{referralSettings.earned}</strong>
          <span>Coins earned</span>
        </div>
      </div>

      <div className="notice-card">
        <p className="notice-title">How it works</p>
        <p className="notice-line">1. Share your referral code with friends.</p>
        <p className="notice-line">2. They sign up using your code.</p>
        <p className="notice-line">3. You both get reward coins after they join.</p>
      </div>
    </div>
  );
}

export default ReferAndEarn;
