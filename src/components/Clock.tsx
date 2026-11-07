import { useEffect, useState } from "react";
import { User } from "lucide-react";

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function ClockChip({ place }: { place?: string }) {
  const now = useClock();
  const date = now?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).toUpperCase();
  const time = now?.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <div className="flex items-center gap-3 rounded-full border bg-card py-2 pl-5 pr-2 shadow-card">
      <div className="text-right">
        <div className="text-xs font-medium tracking-wide text-muted-foreground">{date}</div>
        <div className="text-lg font-bold leading-tight">{time} {place && <span className="text-sm font-normal text-muted-foreground">{place}</span>}</div>
      </div>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <User className="h-5 w-5 text-muted-foreground" />
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>
      </div>
      {right}
    </header>
  );
}
