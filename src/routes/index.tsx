import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, GoogleButton, inputCls, primaryBtn } from "@/components/AuthLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — SeniorMate" },
      { name: "description", content: "Sign in to SeniorMate, your assistive living companion." },
      { property: "og:title", content: "Sign in — SeniorMate" },
      { property: "og:description", content: "Sign in to SeniorMate, your assistive living companion." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/home", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your SeniorMate account">
      <form onSubmit={submit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-base font-semibold">Email</span>
          <input className={inputCls} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-base font-semibold">Password</span>
          <input className={inputCls} type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className={primaryBtn} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <div className="my-6 flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton label="Continue with Google" />
      <p className="mt-8 text-center text-lg text-muted-foreground">
        New to SeniorMate?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
