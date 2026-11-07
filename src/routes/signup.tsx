import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, GoogleButton, inputCls, primaryBtn } from "@/components/AuthLayout";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — SeniorMate" },
      { name: "description", content: "Create your free SeniorMate account in a minute." },
      { property: "og:title", content: "Create account — SeniorMate" },
      { property: "og:description", content: "Create your free SeniorMate account in a minute." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name, display_name: name.split(" ")[0] } },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
  }

  if (sent)
    return (
      <AuthLayout title="Check your email" subtitle={`We sent a confirmation link to ${email}.`}>
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-card">
          <MailCheck className="h-10 w-10 text-success" />
          <p className="text-lg">Open the link in the email to finish creating your account, then sign in.</p>
        </div>
        <Link to="/" className={`${primaryBtn} mt-6 flex items-center justify-center`}>Back to sign in</Link>
      </AuthLayout>
    );

  return (
    <AuthLayout title="Create your account" subtitle="Join SeniorMate in less than a minute">
      <form onSubmit={submit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-base font-semibold">Full name</span>
          <input className={inputCls} required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-base font-semibold">Email</span>
          <input className={inputCls} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-base font-semibold">Password</span>
          <input className={inputCls} type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="mt-1 block text-sm text-muted-foreground">At least 6 characters</span>
        </label>
        <button className={primaryBtn} disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <div className="my-6 flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton label="Continue with Google" />
      <p className="mt-8 text-center text-lg text-muted-foreground">
        Already have an account?{" "}
        <Link to="/" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
