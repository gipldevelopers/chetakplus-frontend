import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
  </div>
);

export const Panel = ({ className, children }) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]",
      className,
    )}
  >
    {children}
  </div>
);

export const MetricCard = ({ title, value, trend, icon: Icon, gradient }) => (
  <Panel className="group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
    <div className={cn("absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20", gradient)} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{title}</p>
        <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {trend}
        </p>
      </div>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </Panel>
);

const toneMap = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  shipped: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  inactive: "border-slate-200 bg-slate-100 text-slate-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

export const StatusBadge = ({ value }) => {
  const normalized = String(value || "").toLowerCase();
  const tone = toneMap[normalized] || "border-slate-200 bg-slate-100 text-slate-700";

  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", tone)}>
      {value}
    </span>
  );
};

export const SectionTitle = ({ title, caption }) => (
  <div>
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    {caption ? <p className="mt-1 text-sm text-slate-500">{caption}</p> : null}
  </div>
);

export const StatLabel = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
  </div>
);

export const TextHint = ({ children }) => <p className="text-xs text-slate-500">{children}</p>;

export const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-1">
        {[...Array(Math.max(1, totalPages))].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
              currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
