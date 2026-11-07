import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mic, Settings, Volume2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/voice")({
  head: () => ({
    meta: [
      { title: "Voice Assistant — SeniorMate" },
      { name: "description", content: "Simple voice commands in Nepali and English for everyday tasks." },
      { property: "og:title", content: "Voice Assistant — SeniorMate" },
      { property: "og:description", content: "Simple voice commands for everyday tasks." },
    ],
  }),
  component: Voice,
});

const phrases = [
  { say: "Batti baldeu", mean: "Turn on the lights", danger: false },
  { say: "Aja ke ho?", mean: "What's the status today?", danger: false },
  { say: "Emergency sahayata", mean: "Emergency help", danger: true },
];

function Voice() {
  const [listening, setListening] = useState(true);
  return (
    <div className="relative -m-5 flex min-h-screen flex-col overflow-hidden bg-night-sky p-6 text-night-foreground md:-m-8 md:p-10">
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 w-full text-night" viewBox="0 0 1200 400" fill="currentColor" preserveAspectRatio="none">
        <path d="M0 400 L0 260 L160 120 L320 240 L520 60 L740 270 L950 140 L1200 230 L1200 400Z" />
      </svg>
      <div className="relative flex justify-between">
        <Link to="/home" className="flex items-center gap-2 rounded-xl border border-night-foreground/20 bg-night-foreground/10 px-4 py-2"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <Link to="/settings" aria-label="Settings" className="rounded-xl border border-night-foreground/20 bg-night-foreground/10 p-3"><Settings className="h-5 w-5" /></Link>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-extrabold">Voice Assistant</h1>
        <p className="mt-2 text-lg opacity-80">Simple voice commands for everyday tasks</p>
        <button
          onClick={() => setListening((l) => !l)}
          aria-label={listening ? "Stop listening" : "Start listening"}
          className="relative mt-12 flex h-44 w-44 items-center justify-center"
        >
          {listening && <span className="pulse-ring absolute inset-0 rounded-full bg-sky/20" />}
          <span className="absolute inset-4 rounded-full bg-night-foreground/20" />
          <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary shadow-glow"><Mic className="h-12 w-12" /></span>
        </button>
        <p className="mt-6 text-xl font-semibold tracking-wide">{listening ? "Listening…" : "Tap the mic to speak"}</p>
        <div className="mt-4 flex h-8 items-center gap-1.5">
          {listening && Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="wave-bar w-1.5 rounded-full bg-sky" style={{ height: 8 + ((i * 7) % 22), animationDelay: `${(i % 5) * 0.12}s` }} />
          ))}
        </div>
      </div>
      <div className="relative rounded-3xl bg-card p-6 text-card-foreground shadow-card">
        <h2 className="mb-4 text-xl font-bold">Try saying</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {phrases.map((p) => (
            <button key={p.say} onClick={() => toast.success(`"${p.say}" — ${p.mean}`)} className="flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:bg-muted">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${p.danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}><Volume2 className="h-5 w-5" /></span>
              <span className="font-bold">"{p.say}"</span>
              <span className="truncate text-sm text-muted-foreground">— {p.mean}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
