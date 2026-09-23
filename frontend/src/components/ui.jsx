import { AlertTriangle, Inbox, Loader2, RefreshCw, Zap } from "lucide-react";
import { useDemoMode } from "../context/DemoMode";

/* ---------- Spinner / loading ---------- */
export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function Loading({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-slate-400 ${className}`}>
      <Spinner className="h-7 w-7 text-accent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/* ---------- Error state ---------- */
export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="grid place-items-center h-12 w-12 rounded-full bg-danger/15 border border-danger/30">
        <AlertTriangle className="h-6 w-6 text-danger" />
      </div>
      <div className="text-sm text-slate-300 max-w-md">{message}</div>
      {onRetry && (
        <button className="btn btn-ghost mt-1" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      )}
    </div>
  );
}

/* ---------- Empty state ---------- */
export function Empty({ icon: Icon = Inbox, title = "Nothing here yet", hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="grid place-items-center h-12 w-12 rounded-full bg-white/5 border border-white/10">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <div className="text-slate-200 font-medium">{title}</div>
      {hint && <div className="text-sm text-slate-500 max-w-sm">{hint}</div>}
      {action}
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className = "" }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

/* ---------- Status pill ---------- */
const PILL = {
  online: { dot: "bg-safe", text: "text-safe", label: "Engine Online" },
  connecting: { dot: "bg-warn", text: "text-warn", label: "Connecting" },
  offline: { dot: "bg-danger", text: "text-danger", label: "Offline" },
};

export function StatusPill({ status = "connecting" }) {
  const s = PILL[status] || PILL.connecting;
  return (
    <div className="chip gap-2">
      <span className={`h-2 w-2 rounded-full ${s.dot} ${status === "online" ? "shadow-[0_0_8px_2px_rgba(52,211,153,0.55)]" : ""}`} />
      <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
    </div>
  );
}

/* ---------- Demo mode toggle ---------- */
export function DemoToggle() {
  const { demo, toggle } = useDemoMode();
  return (
    <button
      onClick={toggle}
      title="Demo Mode runs entirely on realistic sample data — no external APIs required. Ideal for live demos."
      className={`chip gap-2 transition-all ${
        demo
          ? "border-accent/50 bg-accent/15 text-accent"
          : "text-silver/60 hover:text-white hover:border-white/20"
      }`}
    >
      <Zap className={`h-3.5 w-3.5 ${demo ? "fill-accent/40" : ""}`} />
      <span className="text-xs font-medium">Demo {demo ? "On" : "Off"}</span>
      <span
        className={`relative ml-0.5 inline-flex h-4 w-7 items-center rounded-full transition-colors ${
          demo ? "bg-accent/70" : "bg-white/15"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            demo ? "translate-x-3.5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
