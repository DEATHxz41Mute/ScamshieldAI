import { severityMeta } from "../lib/format";

export default function SeverityBadge({ severity, score, size = "md" }) {
  const s = severityMeta(severity);
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${pad} ${s.text} ${s.bg} ${s.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
      {typeof score === "number" && <span className="opacity-70">· {score}</span>}
    </span>
  );
}
