# Supabase Authentication (README)

This README explains the Supabase-based authentication integration added to the MVP. It describes what was added, how it works, what environment variables are required, and how to test the protected Scenario & Asset Manager features locally.

## Summary

- Authentication is implemented with Supabase email/password auth.
- UI-level protection prevents unauthenticated users from opening or interacting with the Scenario & Asset Manager (create/edit/delete scenarios and upload/delete assets).
- Key pieces:
  - `src/integrations/supabase/client.ts` — Supabase client + helpers
  - `src/contexts/AuthContext.tsx` — `AuthProvider` and `useAuth` hook
  - `src/components/ProtectedRoute.tsx` — route protection helper (redirects to `/auth`)
  - `src/pages/AuthPage.tsx` — sign-in / sign-up UI
  - `src/components/ScenarioEditor.tsx` — editor now checks auth and shows a sign-in prompt when necessary
  - `src/App.tsx` — application wrapped with `AuthProvider` and `/auth` route added

## How it works (high-level)

- The app is wrapped with `<AuthProvider>` which:
  - Reads Supabase session on mount
  - Subscribes to auth state changes
  - Exposes `user`, `session`, `loading`, `isAuthenticated`, and helpers: `signUp`, `signIn`, `signOut`
  - Use `const { isAuthenticated, loading, signIn, signUp, signOut } = useAuth()` in components
- UI protection:
  - `ProtectedRoute` will show a spinner while auth is loading, and redirect to `/auth` for unauthenticated users.
  - `ScenarioEditor` displays a friendly "Authentication required" card if the user is not signed in. It also disables writes (create, update, delete, upload) when not authenticated and surfaces a toast instructing the user to sign in.
- The Supabase client lives in `src/integrations/supabase/client.ts`. It preserves sessions in localStorage and detects session tokens in the URL (useful for OAuth flows). A small helper `getCurrentUser()` is available and `requireAuth()` was added as a convenience for code paths that want to throw on missing auth.

## Environment variables

The client looks for Vite-style environment variables. The important ones:

- `VITE_SUPABASE_URL` — your Supabase project URL (example: `https://xxxx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY` — the client (publishable/anon) key

In your `.env` (dev), ensure you have the Vite variables prefixed with `VITE_` so the client can pick them up in the browser. Example (single-line entries shown inline):

- `VITE_SUPABASE_URL="https://<your-project>.supabase.co"`
- `VITE_SUPABASE_PUBLISHABLE_KEY="<your-publishable-key>"`

Note: the code falls back to other env var names (`SUPABASE_ANON_KEY`, `SUPABASE_URL`) when appropriate, but using the `VITE_` prefix is recommended for the client bundle.

## Local testing steps

1. Ensure your `.env` contains the required variables (see above) and restart your dev server if you change them.
2. Start the dev server (typical command): run your normal dev command (e.g. `npm run dev` or `yarn dev`).
3. Open the app in the browser and confirm the auth page is reachable:
   - Visit `/auth` to sign up/sign in (UI is at `src/pages/AuthPage.tsx`).
4. Test flows:
   - Unauthenticated:
     - Click the settings / gear icon that opens the Scenario & Asset Manager (this opens `ScenarioEditor`).
     - Expected: the editor should either immediately close with a toast notifying you to sign in, or present a small card saying "Authentication required" with a "Sign In" button that navigates to `/auth`.
     - Any attempt to create/edit/delete/upload should show an error toast saying sign-in is required.
   - Sign up / Sign in:
     - Use the `/auth` page to create an account or sign in with an existing account.
     - After sign-in, return to the Scenario & Asset Manager. You should be able to create scenarios, edit fields, import/export, upload files, add links, and delete assets.
     - The header (and other UI) will reflect the signed-in state via `useAuth`.
5. Sign out:
   - Use `signOut()` exposed from `useAuth` (the app header or a sign-out button should call this). After signing out, protected UI will require sign-in again.

## Developer notes & recommended production hardening

- Client-side checks are important for UX, but do not replace server-side authorization:
  - Configure Row-Level Security (RLS) policies in Supabase for tables like `scenarios`, `scenario_roles`, and any `user_assets` table to ensure only authorized users can mutate/read rows.
  - Use Supabase Edge Functions or server-side endpoints for operations that require secret access or elevated privileges. Never ship a service role key to the client.
- Environment variables:
  - Double-check that the publishable key used in `.env` is the client-appropriate key (anon/publishable).
  - If you see the console warning "[supabase] Missing config..." ensure the correct env names are present and the dev server was restarted after any `.env` changes.
- Troubleshooting:
  - If sign-in appears successful but `isAuthenticated` is false, try clearing local storage and cookies for the app domain and reloading.
  - Check browser devtools console for Supabase auth errors (CORS, network, or invalid key).
  - Confirm the Supabase project's Authentication settings (email confirmations, enable sign-ups, etc.) match your expectations.

## Files to look at (quick reference)

- `src/integrations/supabase/client.ts` — client, `getCurrentUser()`, `requireAuth()`
- `src/contexts/AuthContext.tsx` — `AuthProvider` + `useAuth`
- `src/components/ProtectedRoute.tsx` — wrapper used to protect routes
- `src/pages/AuthPage.tsx` — sign in / sign up flow
- `src/components/ScenarioEditor.tsx` — shows auth-check UI and guards write actions
- `src/App.tsx` — app is wrapped with `<AuthProvider>` and exposes `/auth`

If you want, I can:
- Add explicit RLS policy examples for `scenarios` and `scenario_roles`.
- Add a small server-side endpoint to verify tokens and perform sensitive operations.
- Walk through enabling magic-link or OAuth providers in Supabase for alternative auth flows.
