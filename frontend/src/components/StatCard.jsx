export default function StatCard({ icon: Icon, label, value, tone = "accent", hint }) {
  const tones = {
    accent: "border-accent/30 text-accent bg-accent/10",
    danger: "border-danger/30 text-danger bg-danger/10",
    warn: "border-warn/30 text-warn bg-warn/10",
    safe: "border-safe/30 text-safe bg-safe/10",
    silver: "border-silver/30 text-silver bg-silver/10",
  };
  const t = tones[tone] || tones.accent;
  return (
    <div className="card card-hover flex items-center gap-4">
      <div className={`grid place-items-center h-12 w-12 rounded-xl border ${t}`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold text-white tabular-nums leading-tight">{value}</div>
        <div className="text-sm text-silver/70 truncate">{label}</div>
        {hint && <div className="text-[11px] text-silver/50 mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}
