import React from "react";
import AppTable from "../components/AppTable";

const leakJodiData = [
  {
    id: 1,
    market: "NCR",
    leakJodi: "*****",
  },
  {
    id: 2,
    market: "DISAWAR",
    leakJodi: "*****",
  },
  {
    id: 3,
    market: "DELHI STAR-DL",
    leakJodi: "*****",
  },
  {
    id: 4,
    market: "RAWASED",
    leakJodi: "*****",
  },
  {
    id: 5,
    market: "ILAG",
    leakJodi: "*****",
  },
  {
    id: 6,
    market: "DELHI BAZAR",
    leakJodi: "*****",
  },
  {
    id: 7,
    market: "SHREE GANESH",
    leakJodi: "*****",
  },
  {
    id: 8,
    market: "FARIDABAD",
    leakJodi: "*****",
  },
  {
    id: 9,
    market: "GAZIABAD",
    leakJodi: "*****",
  },
  {
    id: 10,
    market: "GALI",
    leakJodi: "*****",
  },
];

const columns = [
  {
    key: "market",
    label: "Market Name",
    render: (row) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 600,
        }}
      >
        <span
          style={{
            color: "#FFD700",
            fontSize: "16px",
          }}
        >
          ●
        </span>
        {row.market}
      </div>
    ),
  },
  {
    key: "leakJodi",
    label: "Leak Jodi",
    render: (row) => (
      <span
        className="leak-jodi-value"
        style={{
          color: "#FFD700",
          fontWeight: 700,
          letterSpacing: "4px",
          fontSize: "18px",
        }}
      >
        {row.leakJodi}
      </span>
    ),
  },
];

function LeakJodi() {
  return (
    <div className="app-page leak-jodi-page">
      <div className="page-header">
        <h1 className="page-heading">
          Leak Jodi
        </h1>

        <p className="page-subheading">
          Latest leak jodi for all markets
        </p>

        <hr className="page-divider" />
      </div>

      <AppTable
        columns={columns}
        rows={leakJodiData}
        emptyText="No leak jodi available"
      />
    </div>
  );
}

export default LeakJodi;