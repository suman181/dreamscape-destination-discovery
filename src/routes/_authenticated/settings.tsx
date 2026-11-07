import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, User, Monitor, Bell, Camera, Users, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/Clock";
import { displayName, meta } from "@/lib/user";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Preferences — SeniorMate" },
      { name: "description", content: "Manage your account, caregivers, voice and display preferences." },
      { property: "og:title", content: "Settings & Preferences — SeniorMate" },
      { property: "og:description", content: "Customize your SeniorMate experience." },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { id: "voice", label: "Voice & Language", icon: Mic },
  { id: "account", label: "Account", icon: User },
  { id: "display", label: "Display", icon: Monitor },
  { id: "notif", label: "Notifications", icon: Bell },
];

const field = "h-14 w-full rounded-xl border border-input bg-card px-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

function Toggle({ title, desc, initial = true }: { title: string; desc: string; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border p-5">
      <div><div className="text-lg font-semibold">{title}</div><div className="text-muted-foreground">{desc}</div></div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const router = useRouter();
  
  const [tab, setTab] = useState("account");
  const [fullName, setFullName] = useState<string>(meta(user, "full_name") || meta(user, "name"));
  const [nick, setNick] = useState<string>(displayName(user));
  const [phone, setPhone] = useState<string>(meta(user, "phone"));
  const [saving, setSaving] = useState(false);
  const initial = (nick || "U").charAt(0).toUpperCase();
  const since = new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  async function save() {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName, display_name: nick, phone } });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Your changes are saved");
    router.invalidate();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Settings & Preferences" subtitle="Customize your experience" />
      <div className="mb-6 flex gap-6 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-lg font-medium ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            <t.icon className="h-5 w-5" /> {t.label}
          </button>
        ))}
      </div>
      <section className="rounded-3xl border bg-card p-6 shadow-card md:p-8">
        {tab === "account" ? (
          <>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-2xl font-bold">Account & Profile</h2><p className="text-muted-foreground">Personal details, linked caregivers, and remote assistance</p></div>
              <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground"><span className="h-2 w-2 rounded-full bg-success" /> Family Connected: Active</span>
            </div>
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border bg-muted/40 p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-glow">{initial}</div>
              <div className="flex-1">
                <div className="text-xl font-bold">{nick}{fullName && ` (${fullName})`}</div>
                <div className="text-sm text-muted-foreground">Kathmandu, Nepal • Member since {since}</div>
                <div className="text-sm font-medium text-primary">SeniorMate ID: #SM-{user.id.slice(0, 4).toUpperCase()}</div>
              </div>
              <button onClick={() => toast("Photo upload coming soon")} className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2 font-medium"><Camera className="h-4 w-4" /> Edit Photo</button>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className="mb-2 block text-lg font-semibold">Full Name</span><input className={field} value={fullName} onChange={(e) => setFullName(e.target.value)} /></label>
              <label><span className="mb-2 block text-lg font-semibold">Preferred Display Name (Voice Call-name)</span><input className={field} value={nick} onChange={(e) => setNick(e.target.value)} /></label>
              <label><span className="mb-2 block text-lg font-semibold">Phone Number</span><input className={field} value={phone} placeholder="+977 98…" onChange={(e) => setPhone(e.target.value)} /></label>
              <label><span className="mb-2 block text-lg font-semibold">Account Email</span><input className={`${field} bg-muted text-muted-foreground`} value={user.email ?? ""} readOnly /></label>
            </div>
            <div className="mt-6 rounded-2xl border border-primary/20 bg-accent/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold"><Users className="h-5 w-5 text-primary" /> Primary Caregiver & Family Link</div>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Emergency Contact #1</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent font-bold text-primary">PS</span>
                <div className="flex-1"><div className="font-bold">Pooja Sharma <span className="text-sm font-normal text-muted-foreground">(Daughter)</span></div><div className="text-sm text-muted-foreground">+977 984-1234567 • Full Emergency & Assist Permissions</div></div>
                <button onClick={() => toast("Caregiver update coming soon")} className="rounded-lg border border-primary/30 bg-accent px-3 py-2 text-sm font-semibold text-primary">Update Caregiver</button>
                <button onClick={() => toast("Invite sent")} className="rounded-lg border px-3 py-2 text-sm font-semibold">Invite Member</button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Toggle title="Caregiver Remote Access" desc="Allows daughter to manage daily routine and medication alerts" />
              <Toggle title="Voice PIN Protection" desc="Requires 4-digit spoken PIN for smart home lock adjustments" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-destructive" /> <b>Emergency Medical ID:</b> Blood Type: O+ • Allergies: Penicillin • Doctor: Dr. Sharma</div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={save} disabled={saving} className="h-14 rounded-xl bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-glow disabled:opacity-60">{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          </>
        ) : tab === "voice" ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Voice & Language</h2>
            <Toggle title="Nepali voice commands" desc="Understand commands spoken in Nepali" />
            <Toggle title="English voice commands" desc="Understand commands spoken in English" />
            <Toggle title="Spoken replies" desc="Read answers out loud" />
          </div>
        ) : tab === "display" ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Display</h2>
            <Toggle title="Large text" desc="Make words easier to read" />
            <Toggle title="High contrast" desc="Stronger colors for better visibility" initial={false} />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Toggle title="Medicine reminders" desc="Remind me when it's time for medicine" />
            <Toggle title="Quiet hours" desc="Soften notifications until 8:00 AM" />
            <Toggle title="Family updates" desc="Let me know when family checks in" />
          </div>
        )}
      </section>
    </div>
  );
}
