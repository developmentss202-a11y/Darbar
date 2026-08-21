import AppTable from "../components/AppTable";

const bets = [
  {
    id: 1,
    date: "23-08-22 06:29 PM",
    market: "Faridabad",
    number: "99",
    points: 10,
  },
  {
    id: 2,
    date: "23-08-22 06:29 PM",
    market: "Faridabad",
    number: "99",
    points: 10,
  },
  {
    id: 3,
    date: "23-08-22 06:29 PM",
    market: "Faridabad",
    number: "99",
    points: 10,
  },
  {
    id: 4,
    date: "23-08-22 06:29 PM",
    market: "Faridabad",
    number: "99",
    points: 10,
  },
  {
    id: 5,
    date: "23-08-22 06:29 PM",
    market: "Faridabad",
    number: "99",
    points: 10,
  },
  {
    id: 6,
    date: "23-08-22 06:29 PM",
    market: "Faridabad",
    number: "99",
    points: 10,
  },
];

const columns = [
  { key: "date", label: "Date" },
  { key: "market", label: "Market" },
  { key: "number", label: "Number" },
  { key: "points", label: "Points" },
];

function PlayHistory() {
  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">My Play History</h1>
        <p className="page-subheading">See your recent bets and market results</p>
        <hr className="page-divider" />
      </div>
      <AppTable columns={columns} rows={bets} />
    </div>
  );
}

export default PlayHistory;
