import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  const add = (p: number | '...') => { if (!pages.includes(p)) pages.push(p); };

  add(1);
  if (page - 1 > 2) add('...');
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) add(p);
  if (page + 1 < totalPages - 1) add('...');
  if (totalPages > 1) add(totalPages);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex h-9 w-9 items-center justify-center border-2 border-ink/15 text-ink/50 transition-all duration-150 hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="select-none px-2 text-sm text-ink/35">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`inline-flex h-9 w-9 items-center justify-center border-2 text-sm font-bold transition-all duration-150 ${
              p === page
                ? 'border-signal bg-signal text-white'
                : 'border-ink/15 text-ink/55 hover:border-ink/40 hover:text-ink'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex h-9 w-9 items-center justify-center border-2 border-ink/15 text-ink/50 transition-all duration-150 hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
