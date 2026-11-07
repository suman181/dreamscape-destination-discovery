import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Phone, User, Stethoscope, Building2, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { ClockChip, PageHeader } from "@/components/Clock";

export const Route = createFileRoute("/_authenticated/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Safety — SeniorMate" },
      { name: "description", content: "Quick help and emergency contacts for immediate care." },
      { property: "og:title", content: "Emergency Safety — SeniorMate" },
      { property: "og:description", content: "Quick help and emergency assistance." },
    ],
  }),
  component: Emergency,
});

const contacts = [
  { name: "Daughter", detail: "984-1234567", tel: "9841234567", icon: User, tint: "bg-warning/15 text-warning" },
  { name: "Son", detail: "984-7654321", tel: "9847654321", icon: User, tint: "bg-primary/10 text-primary" },
  { name: "Doctor", detail: "Dr. Sharma 01-4477690", tel: "014477690", icon: Stethoscope, tint: "bg-success/10 text-success" },
];

function Emergency() {
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  function start() {
    let p = 0;
    timer.current = setInterval(() => {
      p += 100 / 30;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        stop();
        toast.error("SOS sent! Your family and caregiver are being alerted.");
      }
    }, 100);
  }
  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setProgress(0);
  }
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Emergency Safety" subtitle="Quick help and emergency assistance for immediate care" right={<ClockChip place="Kathmandu" />} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-sos p-8 text-center text-destructive-foreground shadow-card">
          <span className="absolute h-[420px] w-[420px] rounded-full border border-destructive-foreground/15" />
          <span className="absolute h-[300px] w-[300px] rounded-full border border-destructive-foreground/20" />
          <button
            onPointerDown={start}
            onPointerUp={stop}
            onPointerLeave={stop}
            aria-label="Press and hold for 3 seconds to send SOS"
            className="relative flex h-52 w-52 select-none items-center justify-center"
          >
            <span className="pulse-ring absolute inset-0 rounded-full bg-destructive-foreground/20" />
            <span className="absolute inset-6 rounded-full bg-destructive-foreground/25" />
            <span
              className="relative flex h-28 w-28 items-center justify-center rounded-full bg-card text-4xl font-black text-destructive"
              style={{ boxShadow: `0 0 0 ${progress / 10}px oklch(1 0 0 / 0.6)` }}
            >
              SOS
            </span>
          </button>
          <h2 className="relative mt-6 text-3xl font-extrabold">Emergency Help</h2>
          <p className="relative mt-2 text-lg opacity-90">{progress > 0 ? `Keep holding… ${Math.ceil(3 - (progress / 100) * 3)}` : "Press and hold for 3 seconds"}</p>
        </section>
        <section className="rounded-3xl border bg-card p-6 shadow-card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Emergency Contacts</h2>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">Primary Network</span>
          </div>
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c.name} className="flex items-center gap-4 rounded-2xl border bg-muted/40 p-4">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${c.tint}`}><c.icon className="h-5 w-5" /></span>
                <div className="flex-1"><div className="text-lg font-bold">{c.name}</div><div className="text-muted-foreground">{c.detail}</div></div>
                <a href={`tel:${c.tel}`} aria-label={`Call ${c.name}`} className="flex h-12 w-12 items-center justify-center rounded-xl bg-success text-primary-foreground"><Phone className="h-5 w-5" /></a>
              </div>
            ))}
            <div className="flex items-center gap-4 rounded-2xl border bg-muted/40 p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet"><Building2 className="h-5 w-5" /></span>
              <div className="flex-1"><div className="text-lg font-bold">Nearby Hospital</div><div className="text-muted-foreground">Civil Hospital</div></div>
              <a href="https://maps.google.com/?q=Civil+Hospital+Kathmandu" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-semibold"><MapPin className="h-4 w-4" /> Get Directions</a>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><Plus className="h-8 w-8" /></span>
          <div><h3 className="text-xl font-bold">Medical Emergency</h3><p className="text-muted-foreground">Serious health issue or accident?</p></div>
        </div>
        <a href="tel:102" className="flex items-center gap-3 rounded-2xl bg-destructive px-8 py-4 text-lg font-bold text-destructive-foreground shadow-card"><Phone className="h-5 w-5" /> Call Ambulance</a>
      </section>
    </div>
  );
}
