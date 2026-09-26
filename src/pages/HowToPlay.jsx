import { useEffect, useState } from "react";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";

const HOW_TO_PLAY_API = import.meta.env.DEV
  ? "/api/how-to-play"
  : `${import.meta.env.VITE_API_ROUTE}/api/how-to-play`;

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getLines(element) {
  return String(element.innerHTML || "")
    .split(/<br\s*\/?>/i)
    .map((part) => cleanText(part.replace(/<[^>]+>/g, "")))
    .filter(Boolean);
}

function parseNotice(html) {
  const blocks = [];
  const rates = [];
  let highlight = "";
  let current = null;
  let highlightTitle = "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  const nodes = root ? [...root.children] : [];

  const flush = () => {
    if (current && (current.title || current.lines.length)) {
      blocks.push(current);
    }
    current = null;
  };

  nodes.forEach((node) => {
    const tag = node.tagName;
    const text = cleanText(node.textContent);

    if (!text || tag === "BR") {
      return;
    }

    if (/^H[1-6]$/.test(tag)) {
      if (/^notice$/i.test(text)) {
        return;
      }

      if (/minimum/i.test(text) && text.includes(":")) {
        flush();
        const [label, ...rest] = text.split(":");
        rates.push({
          label: cleanText(label),
          value: cleanText(rest.join(":")) || "-",
        });
        return;
      }

      if (/sunday|no transaction/i.test(text)) {
        flush();
        highlightTitle = text;
        return;
      }

      flush();
      current = { title: text, lines: [] };
      return;
    }

    if (tag === "P") {
      const lines = getLines(node);

      if (highlightTitle || /sunday|मैसेज|बंद/i.test(lines.join(" "))) {
        highlight = [highlightTitle, ...lines].filter(Boolean).join(" ");
        highlightTitle = "";
        return;
      }

      if (!current) {
        current = { title: "", lines };
        return;
      }

      current.lines.push(...lines);
    }
  });

  flush();

  if (highlightTitle && !highlight) {
    highlight = highlightTitle;
  }

  return { blocks, rates, highlight };
}

function HowToPlay() {
  const [notice, setNotice] = useState({
    blocks: [],
    rates: [],
    highlight: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("gvsc-token");

    if (!token) {
      setError("unauthorized");
      setLoading(false);
      return;
    }

    fetch(HOW_TO_PLAY_API, {
      method: "GET",
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

        if (isUnauthorizedMessage(data.message)) {
          setError("unauthorized");
          return;
        }

        if (data.status === 0 || !data.data) {
          setError(data.message || "Unable to load how to play.");
          return;
        }

        setNotice(parseNotice(data.data));
        setError("");
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load how to play.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">How to Play / Notice</h1>
        <p className="page-subheading">
          Important rules for deposit and withdrawal
        </p>
        <hr className="page-divider" />
      </div>

      {loading && <p className="page-subheading">Loading notice...</p>}

      {!loading && error === "unauthorized" && <AuthRequired />}

      {!loading && error && error !== "unauthorized" && (
        <p className="form-error">{error}</p>
      )}

      {!loading && !error && (
        <div className="notice-card">
          {notice.blocks.map((block, index) => (
            <div className="notice-block" key={`${block.title}-${index}`}>
              {block.title ? <p className="notice-title">{block.title}</p> : null}
              {block.lines.map((line) => (
                <p className="notice-line" key={line}>
                  {line}
                </p>
              ))}
            </div>
          ))}

          {notice.rates.length > 0 && (
            <div className="notice-block">
              <div className="notice-rates">
                {notice.rates.map((rate) => (
                  <div className="notice-rate" key={rate.label}>
                    <span>{rate.label}</span>
                    <strong>{rate.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notice.highlight ? (
            <p className="notice-highlight">{notice.highlight}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default HowToPlay;
