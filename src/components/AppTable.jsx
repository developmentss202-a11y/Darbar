import { useEffect, useMemo, useState } from "react";
import Pagination, { PAGE_SIZE } from "./Pagination";

function AppTable({ columns, rows }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil((rows?.length || 0) / PAGE_SIZE));

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (rows || []).slice(start, start + PAGE_SIZE);
  }, [page, rows]);

  return (
    <div className="app-table-block">
      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}

export default AppTable;
