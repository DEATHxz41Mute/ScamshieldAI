import { Activity, AlertOctagon, Database, Network, ShieldAlert, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import ActivityChart from "../components/ActivityChart";
import StatCard from "../components/StatCard";
import ThreatTable from "../components/ThreatTable";
import { ErrorState, Loading } from "../components/ui";
import { PAGE_META } from "../lib/site";
import { useAsync } from "../lib/useApi";
import { useDocumentMeta } from "../lib/useDocumentMeta";

export default function Dashboard() {
  useDocumentMeta({ ...PAGE_META["/"], path: "/" });
  const { loading, error, data, reload } = useAsync(() => api.dashboardStats(), []);

  const seed = async () => {
    try {
      await api.seedDemo();
      reload();
    } catch {
      /* ignore */
    }
  };

  if (loading) return <Loading label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const s = data;
  const empty = s.total_events === 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time posture across SMS, email, URLs, QR codes and job offers.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={seed}>
            <Database className="h-4 w-4" /> Load demo data
          </button>
          <Link to="/analyze" className="btn btn-primary">
            <ShieldCheck className="h-4 w-4" /> Analyze something
          </Link>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Activity} label="Total analyzed" value={s.total_events} tone="accent" />
        <StatCard icon={ShieldAlert} label="High-risk scams" value={s.scams_detected} tone="danger" />
        <StatCard icon={AlertOctagon} label="Suspicious" value={s.suspicious_events} tone="warn" />
        <StatCard icon={ShieldCheck} label="Safe" value={s.safe_events} tone="safe" />
        <StatCard icon={Network} label="Active campaigns" value={s.active_campaigns} tone="violet" />
      </div>

      {empty ? (
        <div className="card flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid place-items-center h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20">
            <Database className="h-7 w-7 text-accent" />
          </div>
          <div className="text-lg font-semibold text-white">No events yet</div>
          <p className="text-sm text-slate-400 max-w-md">
            Load the demo dataset to explore a full cross-channel scam campaign, or analyze your
            own message.
          </p>
          <div className="flex gap-2 mt-1">
            <button className="btn btn-primary" onClick={seed}>
              <Database className="h-4 w-4" /> Load demo data
            </button>
            <Link to="/analyze" className="btn btn-ghost">
              Analyze manually
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* activity */}
          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white">Activity (7 days)</h2>
              <span className="chip text-xs">Events per day</span>
            </div>
            <ActivityChart data={s.activity} />
          </div>

          {/* quick posture */}
          <div className="card">
            <h2 className="font-semibold text-white mb-4">Detection breakdown</h2>
            <div className="space-y-4">
              <Bar label="High-risk" value={s.scams_detected} total={s.total_events} color="#fb7185" />
              <Bar label="Suspicious" value={s.suspicious_events} total={s.total_events} color="#fbbf24" />
              <Bar label="Safe" value={s.safe_events} total={s.total_events} color="#34d399" />
            </div>
            <Link to="/network" className="btn btn-ghost w-full mt-6">
              <Network className="h-4 w-4" /> View scam network
            </Link>
          </div>
        </div>
      )}

      {/* recent */}
      {!empty && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Recent threats</h2>
            <Link to="/history" className="text-sm text-accent hover:underline">
              View all →
            </Link>
          </div>
          <ThreatTable events={s.recent} />
        </div>
      )}
    </div>
  );
}

function Bar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 tabular-nums">
          {value} · {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}88` }}
        />
      </div>
    </div>
  );
}
