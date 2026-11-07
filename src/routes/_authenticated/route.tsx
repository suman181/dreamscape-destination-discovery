import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Home, Mic, CalendarDays, Lightbulb, AlertTriangle, Settings, LogOut, Mountain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/AuthLayout";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/" });
    return { user: data.user };
  },
  component: Shell,
});

const nav = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/voice", label: "Voice Assistant", icon: Mic },
  { to: "/routine", label: "Daily Routine", icon: CalendarDays },
  { to: "/smart-home", label: "Smart Home", icon: Lightbulb },
  { to: "/emergency", label: "Emergency", icon: AlertTriangle, danger: true },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Shell() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="flex shrink-0 flex-col justify-between bg-sidebar p-4 text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64">
        <div>
          <div className="px-2 py-3 text-sidebar-accent-foreground"><BrandMark /></div>
          <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition hover:bg-sidebar-accent ${"danger" in n ? "text-destructive" : ""}`}
                activeProps={{ className: "!bg-sidebar-primary !text-sidebar-primary-foreground shadow-glow" }}
              >
                <n.icon className="h-5 w-5" />
                <span>{n.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 hidden space-y-3 md:block">
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent p-4 text-center">
            <Mountain className="mx-auto h-7 w-7 opacity-60" />
            <div className="mt-2 text-sm font-semibold text-sidebar-accent-foreground">Peaceful Environment</div>
            <div className="text-xs opacity-70">Quiet hours active</div>
          </div>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-sidebar-accent">
            <LogOut className="h-5 w-5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
