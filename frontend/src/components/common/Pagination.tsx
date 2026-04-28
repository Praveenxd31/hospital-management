interface PaginationProps {
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ total, page, limit, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-base-content/60">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          «
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`join-item btn btn-sm ${p === page ? 'btn-active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="join-item btn btn-sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          »
        </button>
      </div>
    </div>
  )
}