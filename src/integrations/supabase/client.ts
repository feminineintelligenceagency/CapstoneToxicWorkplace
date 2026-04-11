import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client initialization.
 *
 * Expects environment variables (Vite-style):
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 *
 * Falls back to NODE env names if Vite vars aren't present.
 */

const SUPABASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_URL) ||
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" &&
    // Prefer the publishable key env var when present (Vite naming)
    ((import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
      (import.meta as any).env?.VITE_SUPABASE_ANON_KEY)) ||
  // Server / NODE fallbacks (support either ANON_KEY or PUBLISHABLE_KEY names)
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Warn instead of throwing so dev builds still start; runtime calls that depend on Supabase will fail.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing config: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_PUBLISHABLE_KEY). Authentication will not work until configured.",
  );
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      // Keep sessions persisted in localStorage for SPA behavior
      persistSession: true,
      // Detect sessions if Supabase places tokens in the URL (OAuth flows)
      detectSessionInUrl: true,
    },
  },
);

/**
 * Helper to get the current user (returns null if not available).
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[supabase] getUser error:", error);
      return null;
    }
    return data?.user ?? null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[supabase] getCurrentUser failed:", err);
    return null;
  }
}

/**
 * Require an authenticated user for protected actions (Scenario & Asset Manager).
 * Call this before performing any write or management operations that must be restricted.
 *
 * Example:
 *   await requireAuth();
 *   // safe to create/edit/delete scenarios and assets
 *
 * Throws an Error if no authenticated session is present.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
