import AppTable from "../components/AppTable";

const transactions = [
  {
    id: 1,
    date: "23-08-22",
    time: "06:40 PM",
    type: "Deposit",
    detail: "By Admin",
    points: 100,
  },
  {
    id: 2,
    date: "23-08-22",
    time: "06:40 PM",
    type: "Withdraw",
    detail: "By Admin",
    points: 100,
  },
  {
    id: 3,
    date: "23-08-22",
    time: "06:40 PM",
    type: "Bet",
    detail: "Faridabad",
    points: 100,
  },
  {
    id: 4,
    date: "23-08-22",
    time: "06:40 PM",
    type: "Winning",
    detail: "Faridabad - 22",
    points: 100,
  },
  {
    id: 5,
    date: "23-08-22",
    time: "06:40 PM",
    type: "Deposit",
    detail: "By Admin",
    points: 100,
  },
];

const columns = [
  {
    key: "date",
    label: "Date",
    render: (row) => (
      <span className="table-datetime">
        <span>{row.date}</span>
        <span>{row.time}</span>
      </span>
    ),
  },
  { key: "type", label: "Type" },
  { key: "detail", label: "Detail" },
  { key: "points", label: "Points" },
];

function Transactions() {
  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">Transaction History</h1>
        <p className="page-subheading">Track deposits, withdrawals, bets and winnings</p>
        <hr className="page-divider" />
      </div>
      <AppTable columns={columns} rows={transactions} />
    </div>
  );
}

export default Transactions;
