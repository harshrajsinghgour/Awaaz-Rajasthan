# आवाज़ राजस्थान

Production-oriented Rajasthan news platform with a mobile-first React frontend, Express/MongoDB API and owner-controlled admin console.

## Structure

- \`frontend/\` — Vite + React public website and PWA
- \`frontend/public/admin/\` — integrated admin console
- \`backend/\` — Express + MongoDB production API
- \`render.yaml\` — Render deployment blueprint

## Backend

1. Configure the variables in \`backend/.env.example\` in Render.
2. Set a strong \`JWT_SECRET\`, MongoDB connection string and the real Vercel frontend URL.
3. Set \`OWNER_EMAIL\` and a strong \`OWNER_PASSWORD\`. The owner is bootstrapped once if that email does not already exist.
4. Deploy \`backend/\` as the Render service. Health check: \`/api/health\`.

## Frontend

Set these Vercel environment variables:

- \`VITE_API_URL\` — deployed Render API origin, without a trailing slash.
- \`VITE_E_PAPER_URL\` — optional e-paper URL.
- \`VITE_VAPID_PUBLIC_KEY\` — optional Web Push public key.

Build command: \`npm run build\`
Output directory: \`dist\`

## Admin

Open \`/admin\` on the Vercel site. Enter the Render API URL on first login; it is stored locally in the browser. Advertising and admin-management authorization is enforced by the backend, not merely hidden in the UI.

## Security model

- HttpOnly signed JWT cookie for admin sessions
- bcrypt password hashing
- role and permission middleware
- owner-only advertising and admin management
- rate limiting
- Helmet security headers
- CORS allow-list
- upload size/type restrictions
- production cookie configuration
- session-version invalidation for password changes/logout-all

## Important production step

Do not commit real secrets. Configure them in Vercel/Render environment settings. The repository contains example values only.
