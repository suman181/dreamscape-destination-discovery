import type { User } from "@supabase/supabase-js";

export function meta(user: User, key: string): string {
  const v = (user.user_metadata ?? {})[key];
  return typeof v === "string" ? v : "";
}

export function displayName(user: User) {
  return (
    meta(user, "display_name") ||
    (meta(user, "full_name") || meta(user, "name")).split(" ")[0] ||
    user.email?.split("@")[0] ||
    "Friend"
  );
}
