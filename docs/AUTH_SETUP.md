# Wix Members authentication (custom login)

Configure your existing Wix Headless OAuth app before testing `/login`:

1. Open **Headless Settings** for the Rewaya site OAuth app.
2. Set **Login URL** to `{SITE_URL}/login` (must match `SITE_URL` in `.env.local`).
3. Add **Allowed redirect URIs**:
   - `http://localhost:3000`
   - `http://localhost:3000/login/callback`
   - Your production `SITE_URL` (no trailing slash)
   - `{SITE_URL}/login/callback`
4. Enable **Members** and **Stores** on the site.
5. **Publish** the Wix site (required for member flows).

## Google sign-in

Google uses Wix’s hosted member login (via `getAuthUrl`). Enable it on the connected Wix site:

1. Wix Editor → **Pages** → **Signup & Login** → **Member Signup Form (Default)**.
2. Open the **Social & Community** tab.
3. Turn on **Google** login.
4. Publish the site.

After that, **Continue with Google** on `/login` redirects to Wix, then back to `/login/callback` to save the member session.

Environment variables (see `.env.local`):

- `WIX_CLIENT_ID` — OAuth app client ID
- `WIX_API_KEY` — admin API key (checkout / future account features)
- `SITE_URL` — e.g. `http://localhost:3000`
