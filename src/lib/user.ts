import type { User } from "@supabase/supabase-js";

export function displayName(user: User) {
  const m = user.user_metadata ?? {};
  return (m.display_name || (m.full_name || m.name || "").split(" ")[0] || user.email?.split("@")[0] || "Friend") as string;
}

export function useNow() {
  return null;
}
