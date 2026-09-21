export default function StatCard({ icon: Icon, label, value, tone = "accent", hint }) {
  const tones = {
    accent: "from-accent/20 to-accent/5 text-accent border-accent/20",
    danger: "from-danger/20 to-danger/5 text-danger border-danger/20",
    warn: "from-warn/20 to-warn/5 text-warn border-warn/20",
    safe: "from-safe/20 to-safe/5 text-safe border-safe/20",
    violet: "from-accent-violet/20 to-accent-violet/5 text-accent-violet border-accent-violet/20",
  };
  const t = tones[tone] || tones.accent;
  return (
    <div className="card card-hover flex items-center gap-4">
      <div className={`grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br border ${t}`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold text-white tabular-nums leading-tight">{value}</div>
        <div className="text-sm text-slate-400 truncate">{label}</div>
        {hint && <div className="text-[11px] text-slate-500 mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}
