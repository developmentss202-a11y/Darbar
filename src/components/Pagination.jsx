const PAGE_SIZE = 10;

function getVisiblePages(current, total) {
  if (total <= 1) {
    return [1];
  }

  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current]);

  if (current - 1 > 1) {
    pages.add(current - 1);
  }

  if (current + 1 < total) {
    pages.add(current + 1);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push(`ellipsis-${sorted[index - 1]}`);
    }
    items.push(page);
  });

  return items;
}

function Pagination({ page, pageCount, onPageChange, className = "" }) {
  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;
  const items = getVisiblePages(page, Math.max(1, pageCount));

  return (
    <nav className={`app-pagination ${className}`} aria-label="Pagination">
      <button
        type="button"
        className="app-pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev}
      >
        Prev
      </button>

      <div className="app-pagination-pages">
        {items.map((item) =>
          String(item).startsWith("ellipsis") ? (
            <span key={item} className="app-pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={item}
              className={`app-pagination-page ${
                item === page ? "active" : ""
              }`}
              onClick={() => onPageChange(item)}
              disabled={pageCount <= 1}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="app-pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
      >
        Next
      </button>
    </nav>
  );
}

export { PAGE_SIZE, getVisiblePages };
export default Pagination;
