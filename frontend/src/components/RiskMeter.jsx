import { useEffect, useState } from "react";
import { scoreColor, severityMeta } from "../lib/format";

/**
 * Circular risk gauge. Animates from 0 to `score` on mount.
 */
export default function RiskMeter({ score = 0, severity, size = 200 }) {
  const [val, setVal] = useState(0);
  const color = scoreColor(score);
  const sev = severityMeta(severity);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - val / 100);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color}66)`, transition: "stroke 0.3s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-extrabold tabular-nums" style={{ color }}>
          {val}
        </div>
        <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Risk Score</div>
        <div className={`mt-2 text-sm font-semibold ${sev.text}`}>{sev.label}</div>
      </div>
    </div>
  );
}
