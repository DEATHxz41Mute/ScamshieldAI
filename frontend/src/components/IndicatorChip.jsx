import { indicatorMeta } from "../lib/format";

export default function IndicatorChip({ type, value, highlight = false }) {
  const meta = indicatorMeta(type);
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors ${
        highlight
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-white/10 bg-white/5 text-slate-300"
      }`}
      title={`${meta.label}: ${value}`}
    >
      <Icon className="h-3.5 w-3.5 opacity-80" />
      <span className="max-w-[220px] truncate">{value}</span>
    </span>
  );
}
