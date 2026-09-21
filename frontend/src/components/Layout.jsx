import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { api } from "../api/client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState("connecting"); // connecting | online | offline

  useEffect(() => {
    let alive = true;
    const ping = () =>
      api
        .warmup()
        .then(() => alive && setStatus("online"))
        .catch(() => alive && setStatus("offline"));
    ping();
    const t = setInterval(ping, 30000); // keep the Render instance warm
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="min-h-screen lg:pl-[264px]">
      <Sidebar status={status} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Topbar status={status} onMenu={() => setMobileOpen(true)} />
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
