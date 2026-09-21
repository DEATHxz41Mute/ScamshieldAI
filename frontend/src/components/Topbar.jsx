import { Menu, ScanSearch, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DemoToggle, StatusPill } from "./ui";

const TITLES = {
  "/": "Dashboard",
  "/analyze": "Analyze",
  "/network": "Scam Network",
  "/history": "History",
};

export default function Topbar({ status, onMenu }) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || (pathname.startsWith("/report") ? "Threat Report" : "ScamShield AI");

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16 max-w-[1400px] mx-auto">
        <button
          className="lg:hidden text-slate-300 hover:text-white"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* mobile brand */}
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <span className="font-bold text-white">ScamShield</span>
        </Link>

        {/* section title (desktop) — not an <h1>; each page owns its single h1 */}
        <div className="hidden lg:block text-lg font-semibold text-white">{title}</div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <StatusPill status={status} />
          </div>
          <DemoToggle />
          <Link to="/analyze" className="btn btn-primary hidden sm:inline-flex">
            <ScanSearch className="h-4 w-4" />
            New Analysis
          </Link>
        </div>
      </div>
    </header>
  );
}
