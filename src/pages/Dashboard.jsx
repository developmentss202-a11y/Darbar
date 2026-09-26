import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.png";
import whatsappIcon from "../assets/whatsapp.png";
import { chatLink, loadAppSettings } from "../data/wallet";

const SLIDERS_API = import.meta.env.DEV
  ? "/api/app-sliders"
  : `${import.meta.env.VITE_API_ROUTE}/api/app-sliders`;

const MARKETS_API = import.meta.env.DEV
  ? "/api/market_lists"
  : `${import.meta.env.VITE_API_ROUTE}/api/market_lists`;

const OPEN_RESULT = "**";

function getSliderImages(data) {
  const list = data.data || data.sliders || [];
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .map((item, index) => {
      const imageUrl =
        typeof item === "string"
          ? item
          : item.image || item.imageUrl || item.url || "";
      return imageUrl ? { id: index + 1, imageUrl } : null;
    })
    .filter(Boolean);
}

function toAmPm(time) {
  if (!time) {
    return "-";
  }

  const parts = String(time).split(":");
  const hour = Number(parts[0]);
  const minute = parts[1] || "00";

  if (Number.isNaN(hour)) {
    return String(time);
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${minute} ${suffix}`;
}

function resultDisplay(result) {
  const value = String(result || "").trim();

  if (!value || value === "**" || /^[*]+(\s+[*]+)*$/.test(value)) {
    return OPEN_RESULT;
  }

  return value.replace(/[-_+]/g, " ");
}

function CloseTimeIcon() {
  return (
    <svg className="game-time-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7.5v4.7l3.2 1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResultTimeIcon() {
  return (
    <svg className="game-time-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 4.5v15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 5.2h9.2c.7 0 1.1.8.7 1.4L14.2 10l2.2 3.4c.4.6 0 1.4-.7 1.4H6.5"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      className="dashboard-contact-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M21.5 3.6 2.9 10.8c-1.3.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8 1 .8.3 0 .5-.1.7-.4l2.6-3.5 5.1 3.8c.9.5 1.6.2 1.8-.9L22.9 4.8c.3-1.2-.4-1.7-1.4-1.2zM8.7 13.4l9.8-6.1c.5-.3.9 0 .6.3l-7.9 7.1-.3 3.4-2.2-4.7z"
      />
    </svg>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState([{ id: 1, imageUrl: heroImage }]);
  const [telegramHref, setTelegramHref] = useState("https://t.me/");
  const [whatsappHref, setWhatsappHref] = useState("https://wa.me/");
  const [markets, setMarkets] = useState([]);
  const [marketsLoading, setMarketsLoading] = useState(true);
  const [marketsError, setMarketsError] = useState("");

  useEffect(() => {
    fetch(SLIDERS_API)
      .then((response) => response.json().catch(() => ({})))
      .then((data) => {
        const images = getSliderImages(data);
        if (images.length) {
          setBannerImages(images);
          setBannerIndex(0);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (bannerImages.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      setBannerIndex((current) => (current + 1) % bannerImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  useEffect(() => {
    loadAppSettings().then((settings) => {
      setTelegramHref(chatLink("telegram", settings.telegram_no || settings.contact_no));
      setWhatsappHref(
        chatLink("whatsapp", settings.whatsapp || settings.contact_no)
      );
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMarkets = (retry) => {
      const token = localStorage.getItem("gvsc-token");
      if (!token) {
        setMarkets([]);
        setMarketsError("Can't able to load markets rn");
        setMarketsLoading(false);
        return;
      }

      fetch(MARKETS_API, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((response) => response.json().catch(() => ({})))
        .then((data) => {
          if (cancelled) {
            return;
          }

          const list = Array.isArray(data.data) ? data.data : [];
          if (data.status === 0 || !list.length) {
            if (!retry) {
              window.setTimeout(() => loadMarkets(true), 400);
              return;
            }
            setMarkets([]);
            setMarketsError("Can't able to load markets rn");
            setMarketsLoading(false);
            return;
          }

          setMarketsError("");
          setMarkets(list);
          setMarketsLoading(false);
        })
        .catch(() => {
          if (cancelled) {
            return;
          }
          if (!retry) {
            window.setTimeout(() => loadMarkets(true), 400);
            return;
          }
          setMarkets([]);
          setMarketsError("Can't able to load markets rn");
          setMarketsLoading(false);
        });
    };

    loadMarkets(false);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <section className="dashboard-banner" aria-label="Promotional banners">
        {bannerImages.map((banner, index) => (
          <img
            key={banner.id}
            className={`dashboard-banner-image ${
              index === bannerIndex ? "is-active" : ""
            }`}
            src={banner.imageUrl}
            alt=""
          />
        ))}
        <div className="dashboard-banner-dots">
          {bannerImages.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              className={`dashboard-banner-dot ${
                index === bannerIndex ? "is-active" : ""
              }`}
              onClick={() => setBannerIndex(index)}
              aria-label={`Banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="dashboard-contact-strip">
        <a
          className="dashboard-contact-btn dashboard-contact-btn--telegram"
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon />
          <span>Telegram</span>
        </a>
        <a
          className="dashboard-contact-btn dashboard-contact-btn--whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={whatsappIcon} alt="Whatsapp Icon" />
          <span>WhatsApp</span>
        </a>
      </div>

      <section className="dashboard-games" aria-label="Game markets">
        {marketsLoading && (
          <p className="history-empty">Loading markets...</p>
        )}

        {!marketsLoading && marketsError ? (
          <p className="history-empty">{marketsError}</p>
        ) : null}

        {!marketsLoading &&
          !marketsError &&
          markets.map((market) => {
            const isRunning = market.running_status === true;
            const statusClass = isRunning ? "running" : "closed";
            const statusLabel = isRunning ? "Running" : "Closed";
            const resultParts = resultDisplay(market.result)
              .split(/\s+/)
              .filter(Boolean);

            return (
              <article
                key={market.market_id}
                className={`game-card game-card--${statusClass}`}
              >
                <div className="game-card-header">
                  <h2 className="game-card-name">{market.market_name}</h2>
                  <span
                    className={`game-card-status game-card-status--${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <p className="game-card-result">
                  {resultParts.map((part, index) => (
                    <span
                      key={`${market.market_id}-result-${index}`}
                      className={`game-card-result-part game-card-result-part--${index}`}
                    >
                      {part}
                    </span>
                  ))}
                </p>

                <div className="game-card-timer">
                  <span className="game-time-pill">
                    <span className="game-time-icon" aria-hidden="true">
                      <CloseTimeIcon />
                    </span>
                    <span className="game-time-text">
                      Close
                      <strong>{toAmPm(market.o_end_time)}</strong>
                    </span>
                  </span>
                  <span className="game-time-pill">
                    <span className="game-time-icon" aria-hidden="true">
                      <ResultTimeIcon />
                    </span>
                    <span className="game-time-text">
                      Result
                      <strong>{toAmPm(market.result_time)}</strong>
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  className="game-play-button"
                  disabled={!isRunning}
                  onClick={() => {
                    if (isRunning) {
                      navigate(`/game/${market.market_id}`, {
                        state: { name: market.market_name },
                      });
                    }
                  }}
                >
                  Play Now
                </button>
              </article>
            );
          })}
      </section>
    </div>
  );
};

export default Dashboard;
