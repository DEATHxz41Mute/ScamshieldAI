import { Clock, FileText, LayoutDashboard, ScanSearch, Share2, ShieldCheck, ShieldAlert, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDemoMode } from "../context/DemoMode";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/analyze", label: "Analyze", icon: ScanSearch },
  { to: "/network", label: "Scam Network", icon: Share2 },
  { to: "/history", label: "History", icon: Clock },
  { to: "/privacy", label: "Privacy", icon: ShieldAlert },
  { to: "/terms", label: "Terms", icon: FileText },
];

const STATUS_META = {
  online: { dot: "bg-safe", ring: "shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]", label: "Online" },
  connecting: { dot: "bg-warn", ring: "", label: "Connecting…" },
  offline: { dot: "bg-danger", ring: "", label: "Offline" },
};

export default function Sidebar({ status = "connecting", open, onClose }) {
  const { demo } = useDemoMode();
  const s = STATUS_META[status] || STATUS_META.connecting;

  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-[264px] p-4 flex flex-col
          border-r border-white/10 bg-ink-900/80 backdrop-blur-xl
          transition-transform duration-300 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* brand */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative grid place-items-center h-10 w-10 rounded-xl bg-accent/10 border border-accent/40">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-white">
              ScamShield <span className="text-accent">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Threat Intelligence</div>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* nav */}
        <nav className="mt-6 space-y-1">
          <div className="label px-3 mb-2">Navigation</div>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-accent/10 text-white border border-accent/30 shadow-glow"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-[18px] w-[18px] ${isActive ? "text-accent" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          {demo && (
            <div className="chip w-full justify-center border-accent/40 bg-accent/10 text-accent">
              ● Demo Mode active
            </div>
          )}
          {/* engine status */}
          <div className="glass p-3 flex items-center gap-3">
            <div className="relative">
              <span className={`block h-2.5 w-2.5 rounded-full ${s.dot} ${s.ring}`} />
              {status === "online" && (
                <span className="absolute inset-0 rounded-full bg-safe animate-pulse-ring" />
              )}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">AI Protection Engine</div>
              <div className={`text-xs ${status === "online" ? "text-safe" : status === "offline" ? "text-danger" : "text-warn"}`}>
                {s.label}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
