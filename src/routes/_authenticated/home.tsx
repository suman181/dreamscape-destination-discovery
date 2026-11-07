import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Sun, MapPin, Check, Lightbulb, CalendarDays, Heart, AlertTriangle, ChevronRight, Home as HomeIcon, Settings } from "lucide-react";
import { ClockChip } from "@/components/Clock";
import { displayName } from "@/lib/user";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — SeniorMate" },
      { name: "description", content: "Your SeniorMate dashboard: voice help, today's overview and quick actions." },
      { property: "og:title", content: "Home — SeniorMate" },
      { property: "og:description", content: "Your SeniorMate dashboard." },
    ],
  }),
  component: HomePage,
});

function Waves() {
  return (
    <div className="flex items-center gap-1.5">
      {[18, 30, 40, 26, 34].map((h, i) => (
        <span key={i} className="wave-bar w-1.5 rounded-full bg-primary/60" style={{ height: h, animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function HomePage() {
  const { user } = Route.useRouteContext();
  const overview = [
    { icon: Check, label: "Medicine at 8:00 AM", cls: "bg-success/10 text-success" },
    { icon: Lightbulb, label: "Lights off", cls: "bg-muted text-muted-foreground" },
    { icon: CalendarDays, label: "Breakfast time", cls: "bg-warning/15 text-warning" },
    { icon: Heart, label: "Your health is our priority", cls: "bg-destructive/10 text-destructive" },
  ];
  const quick = [
    { to: "/smart-home", label: "Smart Home", icon: HomeIcon, cls: "text-success", bg: "bg-success/10" },
    { to: "/routine", label: "Daily Routine", icon: CalendarDays, cls: "text-primary", bg: "bg-primary/10" },
    { to: "/emergency", label: "Emergency", icon: AlertTriangle, cls: "text-destructive", bg: "bg-destructive/10" },
    { to: "/settings", label: "Settings", icon: Settings, cls: "text-violet", bg: "bg-violet/10" },
  ] as const;
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Welcome back, {displayName(user)}!</h1>
          <p className="mt-1 text-lg text-muted-foreground">Stay safe, stay independent.</p>
        </div>
        <ClockChip />
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="flex flex-col items-center rounded-3xl border bg-card p-8 shadow-card">
          <div className="rounded-full border border-primary/20 bg-accent px-5 py-2 text-accent-foreground">
            Say hello, Try saying: <b>“Batti baldeu”</b>
          </div>
          <div className="my-12 flex items-center gap-6">
            <Waves />
            <Link to="/voice" aria-label="Open voice assistant" className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-105">
              <Mic className="h-10 w-10" />
            </Link>
            <Waves />
          </div>
          <h2 className="text-xl font-bold">Voice Assistant</h2>
          <p className="text-muted-foreground">Nepali • English • Tap mic to speak</p>
        </section>
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15"><Sun className="h-7 w-7 text-warning" /></div>
              <div><div className="text-xs font-medium text-muted-foreground">SUNNY</div><div className="text-2xl font-bold">20°C</div></div>
            </div>
            <div className="flex items-center gap-1 font-semibold"><MapPin className="h-4 w-4 text-success" /> Kathmandu</div>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Today's Overview</h3>
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">2 / 3 done</span>
            </div>
            <ul className="space-y-3">
              {overview.map((o) => (
                <li key={o.label} className="flex items-center gap-3 text-base">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full ${o.cls}`}><o.icon className="h-4 w-4" /></span>
                  {o.label}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/emergency" className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-4 transition hover:bg-destructive/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground"><AlertTriangle className="h-5 w-5" /></span>
              <div><div className="text-xs font-bold text-destructive">NEED HELP?</div><div className="font-semibold">Press and hold SOS for 3 seconds</div></div>
            </div>
            <ChevronRight className="text-destructive" />
          </Link>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
        {quick.map((q) => (
          <Link key={q.to} to={q.to} className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5">
            <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${q.bg}`}><q.icon className={`h-7 w-7 ${q.cls}`} /></span>
            <span className={`text-lg font-semibold ${q.cls}`}>{q.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
