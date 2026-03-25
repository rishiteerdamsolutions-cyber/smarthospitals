# Smart Hospitals

Mobile-first hospital web application (Next.js App Router): lead capture, CRM, quotation, and admin surfaces.

## Demo mode (no database)

Leads are stored **in memory** on the server. Nothing is persisted to MongoDB or any other database—fine for local demos. After a server restart or a new Vercel cold start, lead data is empty again.

## Stack

- **Cursor** — development
- **Git** — version control
- **Vercel** — hosting (optional)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for correct sitemap/OG URLs in production.

## Deploy on Vercel

1. Push with Git and import the repo in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL (optional but recommended).
3. Deploy.

## Routes

- `/` — Marketing site and themes
- `/quotation` — Plans and pricing
- `/crm` — Lead dashboard (polls `/api/leads`)
- `/admin`, `/admin/appointments`, `/admin/inventory`, `/admin/prescriptions`
- `POST /api/leads`, `GET /api/leads`, `PATCH /api/leads/[id]`

## Swapping to a real database later

Replace the helpers in [`lib/leads-store.ts`](lib/leads-store.ts) with your own persistence (for example MongoDB) and keep the same function signatures so API routes stay unchanged.
