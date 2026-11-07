import type { ReactNode } from "react";
import { Home, ShieldCheck, Mic, CalendarDays } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-10 w-10 rounded-xl";
  return (
    <div className="flex items-center gap-3">
      <div className={`${box} flex items-center justify-center bg-primary text-primary-foreground shadow-glow`}>
        <Home className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
      </div>
      <div>
        <div className={`${size === "lg" ? "text-2xl" : "text-lg"} font-bold leading-tight`}>
          Senior<span className="text-sky">Mate</span>
        </div>
        <div className="text-[11px] font-medium uppercase tracking-wider opacity-70">Assistive Living</div>
      </div>
    </div>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-night-sky p-12 text-night-foreground lg:flex">
        <BrandMark size="lg" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">Stay safe,<br />stay independent.</h2>
          <ul className="space-y-4 text-lg opacity-90">
            <li className="flex items-center gap-3"><Mic className="h-6 w-6 text-sky" /> Speak in Nepali or English</li>
            <li className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-sky" /> Gentle daily reminders</li>
            <li className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-sky" /> One-touch emergency help</li>
          </ul>
        </div>
        <svg className="absolute inset-x-0 bottom-0 w-full text-night opacity-80" viewBox="0 0 600 200" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 200 L0 120 L120 40 L230 140 L340 30 L470 130 L600 70 L600 200Z" />
        </svg>
      </aside>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><BrandMark /></div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  async function go() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Google sign-in didn't work. Please try again.");
  }
  return (
    <button
      type="button"
      onClick={go}
      className="flex h-14 w-full items-center justify-center gap-[10px] rounded-xl border border-[#747775] bg-[#FFFFFF] px-3 text-base font-medium text-[#1F1F1F] transition hover:shadow-card"
    >
      <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.450 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.770 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
      {label}
    </button>
  );
}

export const inputCls =
  "h-14 w-full rounded-xl border border-input bg-card px-4 text-lg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
export const primaryBtn =
  "h-14 w-full rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-60";
