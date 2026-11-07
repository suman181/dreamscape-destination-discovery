import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Lightbulb, Thermometer, KeyRound, Video, Lock, Unlock, CheckCircle2, Eye, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const CAMERA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuClziwWLZmdpzTEYLoNW4fQCo8Niool5bzquyrNWoZqBiG8FvKAJMfeiAVBUU87ZjX1wlIdOaNZgHEKlT_ogCHG7BxVjZ3netprwS3RzGw2L5SA8z8VitNfJp-rfk6gV4c7WYLKKYYxmP8t3oimQyOt2WtpfySXbnxXjV5JDsTTKd2xwWLAEblAsMKqTUahg1IX9gkpru62-FGK71ziSR2Phu2Bc9zQgC36QYRTBg";

export const Route = createFileRoute("/_authenticated/smart-home")({
  head: () => ({
    meta: [
      { title: "Smart Home — SeniorMate" },
      { name: "description", content: "Control lights, temperature, doors and cameras from one place." },
      { property: "og:title", content: "Smart Home — SeniorMate" },
      { property: "og:description", content: "Control your home environment." },
    ],
  }),
  component: SmartHome,
});

const rooms = ["Living Room", "Bedroom", "Kitchen"];

function Panel({ icon: Icon, tint, title, sub, right, children, footer }: { icon: typeof Home; tint: string; title: string; sub: string; right?: React.ReactNode; children?: React.ReactNode; footer: React.ReactNode }) {
  return (
    <section className="flex min-h-[420px] flex-col rounded-3xl border bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tint}`}><Icon className="h-6 w-6" /></span>
        <div className="flex-1"><h2 className="text-xl font-bold">{title}</h2><p className="text-sm text-muted-foreground">{sub}</p></div>
        {right}
      </div>
      <div className="mt-6 flex-1">{children}</div>
      <div className="mt-6">{footer}</div>
    </section>
  );
}

function SmartHome() {
  const [room, setRoom] = useState("Living Room");
  const [lights, setLights] = useState(true);
  const [temp, setTemp] = useState(22);
  const [auto, setAuto] = useState(true);
  const [locks, setLocks] = useState({ "Main Door": true, "Back Door": true } as Record<string, boolean>);
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success"><Home className="h-7 w-7" /></span>
          <div><h1 className="text-3xl font-extrabold md:text-4xl">Smart Home</h1><p className="text-lg text-muted-foreground">Control your home environment</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {rooms.map((r) => (
            <button key={r} onClick={() => setRoom(r)} className={`rounded-full border px-5 py-2.5 font-medium transition ${room === r ? "border-success bg-success text-primary-foreground" : "bg-card hover:bg-muted"}`}>{r}</button>
          ))}
        </div>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Panel icon={Lightbulb} tint="bg-warning/15 text-warning" title="Lights" sub={`${room} Lights`} right={<Switch checked={lights} onCheckedChange={setLights} className="data-[state=checked]:bg-success" />}
          footer={<div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setLights(false); toast("All lights off"); }} className="h-12 rounded-xl border font-semibold hover:bg-muted">All Off</button>
            <button onClick={() => { setLights(true); toast.success("All lights on"); }} className="h-12 rounded-xl bg-primary font-semibold text-primary-foreground">All On</button>
          </div>}>
          <label className="text-xs font-semibold tracking-wider text-muted-foreground">ROOM</label>
          <select value={room} onChange={(e) => setRoom(e.target.value)} className="mt-2 h-12 w-full rounded-xl border bg-card px-3 text-base">
            {rooms.map((r) => <option key={r}>{r}</option>)}
          </select>
          <p className="mt-4 text-muted-foreground">Lights are <b className="text-foreground">{lights ? "on" : "off"}</b>.</p>
        </Panel>
        <Panel icon={Thermometer} tint="bg-primary/10 text-primary" title="Temperature" sub={`Current: ${temp}°C`}
          footer={<button onClick={() => toast.success(`Temperature set to ${temp}°C`)} className="h-12 w-full rounded-xl bg-success font-semibold text-primary-foreground">Save</button>}>
          <div className="text-center text-7xl font-extrabold">{temp}°C</div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <button aria-label="Cooler" onClick={() => setTemp((t) => t - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border hover:bg-muted"><Minus className="h-4 w-4" /></button>
            <button aria-label="Warmer" onClick={() => setTemp((t) => t + 1)} className="flex h-11 w-11 items-center justify-center rounded-full border hover:bg-muted"><Plus className="h-4 w-4" /></button>
            <span className="ml-2 text-xs font-semibold text-muted-foreground">AUTO</span>
            <Switch checked={auto} onCheckedChange={setAuto} className="data-[state=checked]:bg-success" />
          </div>
        </Panel>
        <Panel icon={KeyRound} tint="bg-muted text-muted-foreground" title="Doors" sub={Object.values(locks).every(Boolean) ? "All doors locked" : "A door is unlocked"}
          footer={<button onClick={() => toast.success(Object.values(locks).every(Boolean) ? "All doors are locked" : "Please lock all doors")} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border font-semibold hover:bg-muted"><CheckCircle2 className="h-4 w-4 text-success" /> Verify Locks</button>}>
          <div className="space-y-3">
            {Object.entries(locks).map(([name, locked]) => (
              <button key={name} onClick={() => setLocks((s) => ({ ...s, [name]: !locked }))} className="flex w-full items-center gap-3 rounded-2xl border bg-muted/50 p-4 text-left">
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${locked ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}>{locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}</span>
                <span className="flex-1"><span className="block font-semibold">{name}</span><span className="text-sm text-muted-foreground">{locked ? "Locked" : "Unlocked"}</span></span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${locked ? "bg-success/10 text-success" : "bg-warning/15 text-warning"}`}>{locked ? "Secure" : "Open"}</span>
              </button>
            ))}
          </div>
        </Panel>
        <Panel icon={Video} tint="bg-sky/15 text-sky" title="Security" sub="Outside Camera"
          footer={<button onClick={() => toast("Opening live feed…")} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"><Eye className="h-4 w-4" /> View Live Feed</button>}>
          <div className="relative overflow-hidden rounded-2xl">
            <img src={CAMERA} alt="Outside camera view of the garden path" className="h-40 w-full object-cover" />
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground"><span className="h-1.5 w-1.5 rounded-full bg-destructive-foreground" /> LIVE</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
