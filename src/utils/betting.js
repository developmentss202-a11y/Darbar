export const PATTI_BETTING_API = import.meta.env.DEV
  ? "/api/patti-betting"
  : `${import.meta.env.VITE_API_ROUTE}/api/patti-betting`;

export const PROFILE_API = import.meta.env.DEV
  ? "/api/profile-detail"
  : `${import.meta.env.VITE_API_ROUTE}/api/profile-detail`;

export const MARKETS_API = import.meta.env.DEV
  ? "/api/market_lists"
  : `${import.meta.env.VITE_API_ROUTE}/api/market_lists`;

export const USER_ID_KEY = "gvsc-user-id";
export const USER_NAME_KEY = "gvsc-user-name";

function getUserSource(data) {
  return data?.data || data?.user || data || {};
}

export function saveUserId(data) {
  const source = getUserSource(data);
  const id =
    source.user_id ??
    source.id ??
    source.userId ??
    data?.user_id ??
    data?.id;

  if (id !== undefined && id !== null && String(id).trim() !== "") {
    localStorage.setItem(USER_ID_KEY, String(id));
  }

  const name = source.name || source.user_name || source.username || data?.name;
  if (name && String(name).trim()) {
    localStorage.setItem(USER_NAME_KEY, String(name).trim());
  }

  return id !== undefined && id !== null ? String(id) : "";
}

export function getStoredUserName() {
  return localStorage.getItem(USER_NAME_KEY) || "";
}

export function clearUserId() {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}

export async function resolveUserName() {
  const stored = getStoredUserName();
  if (stored) {
    return stored;
  }

  const token = localStorage.getItem("gvsc-token");
  if (!token) {
    return "";
  }

  const response = await fetch(PROFILE_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const data = await response.json().catch(() => ({}));
  saveUserId(data);
  return getStoredUserName();
}

export async function resolveUserId() {
  const stored = localStorage.getItem(USER_ID_KEY);
  if (stored) {
    return stored;
  }

  const token = localStorage.getItem("gvsc-token");
  if (!token) {
    return "";
  }

  const response = await fetch(PROFILE_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const data = await response.json().catch(() => ({}));
  return saveUserId(data);
}

export async function resolveMarketName(marketId, fallback) {
  if (fallback) {
    return fallback;
  }

  const token = localStorage.getItem("gvsc-token");
  if (!token) {
    return String(marketId || "");
  }

  try {
    const response = await fetch(MARKETS_API, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await response.json().catch(() => ({}));
    const list = Array.isArray(data.data) ? data.data : [];
    const market = list.find(
      (item) => String(item.market_id) === String(marketId)
    );
    return market?.market_name || String(marketId || "");
  } catch (error) {
    return String(marketId || "");
  }
}

export function expandHarupNumbers(digit, points, type) {
  const d = String(digit).replace(/\D/g, "").slice(-1);
  const amount = String(points).trim();

  if (d === "" || !amount) {
    return [];
  }

  return Array.from({ length: 10 }, (_, index) => ({
    number: type === "Bahar" ? `${index}${d}` : `${d}${index}`,
    amount,
    type,
  }));
}

export async function placePattiBet({
  userId,
  marketId,
  betType,
  gameType,
  bets,
}) {
  const token = localStorage.getItem("gvsc-token");
  if (!token) {
    throw new Error("Please login again.");
  }

  const response = await fetch(PATTI_BETTING_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: Number(userId) || userId,
      market_id: Number(marketId) || marketId,
      bet_type: betType,
      game_type: gameType,
      bet_no: bets.map((bet) => ({
        number: String(bet.number),
        amount: String(bet.amount),
      })),
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === 0) {
    throw new Error(data.message || "Unable to place bet. Please try again.");
  }

  return data;
}
