export const WALLET_API = import.meta.env.DEV
  ? "/api/wallet"
  : `${import.meta.env.VITE_API_ROUTE}/api/wallet`;

export const WITHDRAW_LIST_API = import.meta.env.DEV
  ? "/api/withdraw-list"
  : `${import.meta.env.VITE_API_ROUTE}/api/withdraw-list`;

export const SETTINGS_API = import.meta.env.DEV
  ? "/api/getSetting"
  : `${import.meta.env.VITE_API_ROUTE}/api/getSetting`;

export const WALLET_REFRESH_EVENT = "gvsc-wallet-refresh";

export function notifyWalletChanged() {
  window.dispatchEvent(new Event(WALLET_REFRESH_EVENT));
}

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

function isPendingWithdraw(row) {
  const status = String(row?.status || "").toLowerCase();
  if (!status) {
    return false;
  }
  if (
    status.includes("success") ||
    status.includes("approv") ||
    status.includes("complete") ||
    status.includes("paid") ||
    status.includes("fail") ||
    status.includes("reject") ||
    status.includes("cancel") ||
    status.includes("decline")
  ) {
    return false;
  }
  return (
    status.includes("pending") ||
    status.includes("process") ||
    status.includes("request") ||
    status.includes("hold") ||
    status.includes("wait")
  );
}

function getWithdrawList(data) {
  const list = data?.data || data?.list || data?.withdraws || [];
  return Array.isArray(list) ? list : [];
}

export function pendingWithdrawTotal(data) {
  return getWithdrawList(data).reduce((sum, row) => {
    if (!isPendingWithdraw(row)) {
      return sum;
    }
    return sum + (Number(row.amount) || 0);
  }, 0);
}

export function availableWallet(walletData, withdrawData) {
  const source = walletData?.data || walletData || {};
  const direct =
    source.available_balance ??
    source.available_wallet ??
    source.usable_balance;

  if (direct !== undefined && direct !== null && direct !== "") {
    return Math.max(0, Number(direct) || 0);
  }

  const wallet = Number(getWalletBalance(walletData)) || 0;
  const pending = pendingWithdrawTotal(withdrawData);
  return Math.max(0, wallet - pending);
}

export async function loadAvailableWallet() {
  const token = localStorage.getItem("gvsc-token");
  if (!token) {
    return 0;
  }

  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  try {
    const [walletRes, withdrawRes] = await Promise.all([
      fetch(WALLET_API, { method: "GET", headers }),
      fetch(WITHDRAW_LIST_API, { method: "GET", headers }),
    ]);
    const walletData = await walletRes.json().catch(() => ({}));
    const withdrawData = await withdrawRes.json().catch(() => ({}));
    const extraPages = Math.min(Number(withdrawData.last_page) || 1, 10);
    let mergedWithdraw = withdrawData;

    if (extraPages > 1) {
      const extra = await Promise.all(
        Array.from({ length: extraPages - 1 }, (_, index) =>
          fetch(`${WITHDRAW_LIST_API}?page=${index + 2}`, {
            method: "GET",
            headers,
          }).then((response) => response.json().catch(() => ({})))
        )
      );
      mergedWithdraw = {
        ...withdrawData,
        data: [
          ...getWithdrawList(withdrawData),
          ...extra.flatMap((page) => getWithdrawList(page)),
        ],
      };
    }

    return availableWallet(walletData, mergedWithdraw);
  } catch (error) {
    return 0;
  }
}

export const referralSettings = {
  code: "GVSC1234",
  invited: 0,
  earned: 0,
  shareText: "Join GVSC and play with my referral code GVSC1234",
};
