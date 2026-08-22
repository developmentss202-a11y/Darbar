import React from "react";

/*
 * ============================================================
 * MARKET DATA
 * ============================================================
 *
 * This is your existing games data.
 *
 * IMPORTANT:
 * Later this entire array should come from your API.
 * For now, it is hardcoded for UI development.
 */

const games = [
  {
    id: "delhi-star-dl",
    name: "DELHI STAR-DL",
    result: "**",
    status: "Closed",
    closeTime: "12:00 PM",
    resultTime: "12:30 PM",
  },
  {
    id: "rawased",
    name: "RAWASED",
    result: "**",
    status: "Running",
    closeTime: "01:00 PM",
    resultTime: "01:30 PM",
  },
  {
    id: "ilag",
    name: "ILAG",
    result: "**",
    status: "Running",
    closeTime: "02:00 PM",
    resultTime: "02:20 PM",
  },
  {
    id: "delhi-bazaar",
    name: "DELHI BAZAAR",
    result: "**",
    status: "Running",
    closeTime: "03:00 PM",
    resultTime: "03:10 PM",
  },
  {
    id: "shree-ganesh",
    name: "SHREE GANESH",
    result: "**",
    status: "Running",
    closeTime: "04:30 PM",
    resultTime: "04:40 PM",
  },
  {
    id: "faridabad",
    name: "FARIDABAD",
    result: "**",
    status: "Running",
    closeTime: "05:40 PM",
    resultTime: "06:10 PM",
  },
  {
    id: "ghaziabad",
    name: "GAZIABAD",
    result: "**",
    status: "Running",
    closeTime: "09:40 PM",
    resultTime: "10:00 PM",
  },
  {
    id: "gali",
    name: "GALI",
    result: "**",
    status: "Running",
    closeTime: "11:40 PM",
    resultTime: "12:00 AM",
  },
  {
    id: "ncr",
    name: "NCR",
    result: "**",
    status: "Running",
    closeTime: "01:00 AM",
    resultTime: "01:30 AM",
  },
  {
    id: "disawar",
    name: "DISAWAR",
    result: "**",
    status: "Running",
    closeTime: "05:00 AM",
    resultTime: "05:10 AM",
  },
];

/*
 * ============================================================
 * DEMO RESULT HISTORY
 * ============================================================
 *
 * TEMPORARY HARDCODED DATA
 *
 * Replace this with API response later.
 *
 * Structure:
 *
 * gameId
 * date
 * type
 * session
 * number
 * status
 * bid
 * won
 *
 * "type" can be:
 * - Jodi
 * - Haruf Andar
 * - Haruf Bahar
 *
 * Later your API can return these dynamically.
 */

const resultHistory = [
  {
    gameId: "gali",
    date: "23-08-2022",
    type: "Jodi",

    results: [
      {
        id: 1,
        session: "Close",
        number: "24",
        status: "Pending",
        bid: 200,
        won: 0,
      },
      {
        id: 2,
        session: "Close",
        number: "35",
        status: "Winner",
        bid: 100,
        won: 900,
      },
    ],
  },

  {
    gameId: "gali",
    date: "23-08-2022",
    type: "Haruf Andar",

    results: [
      {
        id: 3,
        session: "Close",
        number: "2",
        status: "Winner",
        bid: 200,
        won: 1900,
      },
      {
        id: 4,
        session: "Close",
        number: "4",
        status: "Loser",
        bid: 200,
        won: 0,
      },
    ],
  },

  {
    gameId: "gali",
    date: "22-08-2022",
    type: "Jodi",

    results: [
      {
        id: 5,
        session: "Close",
        number: "44",
        status: "Pending",
        bid: 100,
        won: 0,
      },
    ],
  },

  {
    gameId: "faridabad",
    date: "23-08-2022",
    type: "Jodi",

    results: [
      {
        id: 6,
        session: "Close",
        number: "99",
        status: "Winner",
        bid: 100,
        won: 900,
      },
    ],
  },

  {
    gameId: "faridabad",
    date: "23-08-2022",
    type: "Haruf Andar",

    results: [
      {
        id: 7,
        session: "Close",
        number: "9",
        status: "Winner",
        bid: 200,
        won: 1900,
      },
    ],
  },

  {
    gameId: "disawar",
    date: "22-08-2022",
    type: "Jodi",

    results: [
      {
        id: 8,
        session: "Close",
        number: "63",
        status: "Loser",
        bid: 100,
        won: 0,
      },
    ],
  },
];

/*
 * ============================================================
 * RESULT HISTORY COMPONENT
 * ============================================================
 */

function ResultHistory() {
  return (
    <div className="app-page">
      {/* ======================================================
          PAGE HEADER
          Same header structure as Play History
      ====================================================== */}

      <div className="page-header">
        <h1 className="page-heading">Result History</h1>

        <p className="page-subheading">Check your previous market results</p>

        <hr className="page-divider" />
      </div>

      {/* ======================================================
          RESULT CARDS
      ====================================================== */}

      <div className="result-history-list">
        {resultHistory.map((history) => {
          /*
           * Find the market/game from the games array.
           *
           * LATER:
           * If your API already returns the game name,
           * you won't need this lookup.
           */
          const game = games.find((item) => item.id === history.gameId);

          return (
            <div
              className="result-history-card"
              key={`${history.gameId}-${history.date}-${history.type}`}
            >
              {/* =================================================
                  CARD HEADER
              ================================================= */}

              <div className="result-card-header">
                <span className="result-card-date">Date: {history.date}</span>

                <span className="result-card-game">
                  {game?.name || history.gameId} - {history.type}
                </span>
              </div>

              {/* =================================================
                  TABLE HEADER
              ================================================= */}

              <div className="result-table-header">
                <span>Session</span>
                <span>Number</span>
                <span>Status</span>
                <span>Bid</span>
                <span>Won</span>
              </div>

              {/* =================================================
                  RESULT ROWS
              ================================================= */}

              <div className="result-table-body">
                {history.results.map((result) => (
                  <div className="result-table-row" key={result.id}>
                    <span>{result.session}</span>

                    <span>{result.number}</span>

                    <span
                      className={`result-status ${result.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {result.status}
                    </span>

                    <span>{result.bid}</span>

                    <span className="result-won">{result.won}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultHistory;
