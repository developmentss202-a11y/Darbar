export const WALLET_API = import.meta.env.DEV
  ? "/api/wallet"
  : `${import.meta.env.VITE_API_ROUTE}/api/wallet`;

export const SETTINGS_API = import.meta.env.DEV
  ? "/api/getSetting"
  : `${import.meta.env.VITE_API_ROUTE}/api/getSetting`;

export const walletSettings = {
  qrImageUrl: "",
};

export function loadAppSettings() {
  return fetch(SETTINGS_API)
    .then((response) => response.json().catch(() => ({})))
    .then((data) => data.data || {})
    .catch(() => ({}));
}

function indiaPhone(number) {
  let digits = String(number || "").replace(/\D/g, "");

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }

  if (digits.length === 10) {
    return "91" + digits;
  }

  return digits;
}

export function chatLink(type, number) {
  const phone = indiaPhone(number);

  if (!phone) {
    return type === "telegram" ? "https://t.me/" : "https://wa.me/";
  }

  if (type === "telegram") {
    return "https://t.me/+" + phone;
  }

  return "https://wa.me/+" + phone;
}

export function getWalletBalance(data) {
  const source = data?.data || data || {};
  const value =
    source.wallet ??
    source.balance ??
    source.wallet_balance ??
    source.amount ??
    0;

  return value === null || value === undefined || value === "" ? 0 : value;
}

export const referralSettings = {
  code: "GVSC1234",
  invited: 0,
  earned: 0,
  shareText: "Join GVSC and play with my referral code GVSC1234",
};
