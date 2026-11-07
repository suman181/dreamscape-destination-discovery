import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sun, Pill, Utensils, Moon, CheckCircle2, CalendarDays, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, useClock } from "@/components/Clock";

export const Route = createFileRoute("/_authenticated/routine")({
  head: () => ({
    meta: [
      { title: "Daily Routine — SeniorMate" },
      { name: "description", content: "Your personal daily schedule with gentle reminders." },
      { property: "og:title", content: "Daily Routine — SeniorMate" },
      { property: "og:description", content: "Your personal daily schedule." },
    ],
  }),
  component: Routine,
});

function Checklist({ items, onToggle }: { items: { label: string; done: boolean }[]; onToggle: (i: number) => void }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((it, i) => (
        <li key={it.label}>
          <label className="flex cursor-pointer items-center gap-3 text-lg">
            <input type="checkbox" checked={it.done} onChange={() => onToggle(i)} className="h-6 w-6 accent-primary" />
            <span className={it.done ? "text-muted-foreground line-through" : ""}>{it.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function useList(labels: string[], done: number[]) {
  const [items, setItems] = useState(labels.map((l, i) => ({ label: l, done: done.includes(i) })));
  return {
    items,
    toggle: (i: number) => setItems((s) => s.map((x, j) => (j === i ? { ...x, done: !x.done } : x))),
    all: () => setItems((s) => s.map((x) => ({ ...x, done: true }))),
  };
}

function Card({ icon: Icon, tint, title, sub, children }: { icon: typeof Sun; tint: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <article className="flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-card">
      <div>
        <div className="flex items-center gap-4">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}><Icon className="h-6 w-6" /></span>
          <div><h2 className="text-xl font-bold">{title}</h2><p className="text-muted-foreground">{sub}</p></div>
        </div>
      </div>
      {children}
    </article>
  );
}

function Routine() {
  const now = useClock();
  const morning = useList(["Open curtains", "Drink water", "Light exercise"], [0]);
  const breakfast = useList(["Prepare meal", "Stay hydrated"], [0]);
  const evening = useList(["Turn off lights", "Take medicine"], [0]);
  const [med, setMed] = useState(false);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Daily Routine"
        subtitle="Your personal daily schedule"
        right={
          <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2 font-semibold shadow-card">
            {now?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card icon={Sun} tint="bg-warning/15 text-warning" title="Morning Routine" sub="Wake up & get ready">
          <Checklist items={morning.items} onToggle={morning.toggle} />
          <button onClick={() => { morning.all(); toast.success("Morning routine complete!"); }} className="mt-6 h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-glow">Start Routine</button>
        </Card>
        <Card icon={Pill} tint="bg-warning/15 text-destructive" title="Medication Reminder" sub="Time to take your medicine">
          <p className="mt-5 flex flex-1 items-start gap-3 text-lg"><CheckCircle2 className="h-6 w-6 text-success" /> {med ? "Taken today — well done!" : <>Next dose: <b>8:00 AM</b></>}</p>
          <button onClick={() => { setMed(true); toast.success("Medicine marked as taken"); }} className="mt-6 h-12 w-full rounded-xl border border-primary/40 font-semibold text-primary hover:bg-accent">{med ? "Done ✓" : "Mark as Done"}</button>
        </Card>
        <Card icon={Utensils} tint="bg-warning/15 text-warning" title="Breakfast" sub="Have a healthy meal">
          <Checklist items={breakfast.items} onToggle={breakfast.toggle} />
          <div className="mt-6 flex justify-end gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border bg-warning/10 text-warning"><Plus className="h-4 w-4" /></span>
            <button onClick={() => { breakfast.all(); toast.success("Enjoy your breakfast!"); }} className="h-11 rounded-xl border px-6 font-semibold hover:bg-muted">Done</button>
          </div>
        </Card>
        <Card icon={Moon} tint="bg-violet/10 text-violet" title="Evening Routine" sub="Prepare for bed">
          <Checklist items={evening.items} onToggle={evening.toggle} />
          <div className="mt-6 flex justify-end">
            <button onClick={() => { evening.all(); toast.success("Good night!"); }} className="h-11 rounded-xl border border-violet/30 bg-violet/10 px-6 font-semibold text-violet">Start</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
