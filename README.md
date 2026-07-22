# Capita-Lens

Capital Readiness platform for UK SMEs. A Turborepo monorepo with two Next.js
apps (user web app + admin console) sharing a dynamic questionnaire engine, a
Decision Intelligence scoring framework, Neon Postgres, Neon Auth and R2 storage.

```
apps/
  web/      User app + marketing landing page   (port 3000, role: user)
  admin/    Admin console                        (port 3001, role: admin/super_admin)
packages/
  db/       Neon + Drizzle schema, migrations, seed (Capital Readiness v1)
  auth/     Neon Auth (Stack Auth) config + role model
  core/     Questionnaire engine + scoring (Decision Intelligence Framework)
  ui/       Shared design system (tokens, primitives, charts)
  storage/  Cloudflare R2 client + presigned uploads
  config/   Shared tsconfig / eslint / tailwind preset
```

## Keys to add

Edit **`.env`** at the repo root (already gitignored). Both apps read from it.

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Neon console → your project → **Connection string** (use the **pooled** one, `-pooler` host). |
| `NEON_AUTH_BASE_URL` | Neon console → **Auth** tab → Configuration → **Auth URL** (ends in `/neondb/auth`). |
| `NEON_AUTH_COOKIE_SECRET` | Generate locally: `openssl rand -base64 32` (any 32+ char secret). |
| `R2_ACCOUNT_ID` | Cloudflare dashboard → R2 → account ID. |
| `R2_ACCESS_KEY_ID` | Cloudflare → R2 → **Manage API Tokens** → Access Key ID. |
| `R2_SECRET_ACCESS_KEY` | Same token → Secret Access Key. |
| `R2_BUCKET` | Your R2 bucket name (default `capita-lens`). |
| `R2_PUBLIC_URL` | Optional — public bucket / custom domain base URL for served files. |

Auth is **Neon Managed Better Auth** (`@neondatabase/auth`). Enable it in the Neon
console's **Auth** tab and turn on **Email/Password** (and Google, optionally) as a
sign-in method. Sign-in lives at `/auth/sign-in`, account management at `/account/*`.

> `DATABASE_URL`, `NEON_AUTH_BASE_URL`, R2 keys and a generated cookie secret are
> already filled in your local `.env`. Verify they're correct before going live.

## Getting started

```bash
pnpm install

# 1. Create the schema in your Neon database
pnpm db:generate      # generate SQL migration from the Drizzle schema (already run)
pnpm db:migrate       # apply migrations to DATABASE_URL
pnpm db:seed          # seed scoring categories + the Capital Readiness v1 template

# 2. Run both apps
pnpm dev              # web → http://localhost:3000, admin → http://localhost:3001
```

Useful scripts: `pnpm build`, `pnpm typecheck`, `pnpm db:studio` (Drizzle Studio).

## Making yourself a super admin

Roles live in our `users` table (synced from Neon Auth on sign-in, defaulting to
`user`). To seed an admin, add the email to **`SUPER_ADMIN_EMAILS`** in `.env`
(comma-separated) — those accounts are auto-promoted to `super_admin` the moment
they sign in. `sayo@acceler8.africa` is already listed.

```env
SUPER_ADMIN_EMAILS=sayo@acceler8.africa,teammate@example.com
```

Just sign up at `:3000/auth/sign-up`, then open the admin console at `:3001`.
(You can still promote anyone manually: `UPDATE users SET role='super_admin' WHERE email='…'`.)

## How the questionnaire engine works

- Admins build **templates → sections → questions** (typed, with scoring weights,
  conditional logic and conversational feedback) in the admin app.
- The user app renders the published template as a guided assessment.
- `@capita/core` runs the **Decision Intelligence Framework** — a pure function
  `(answers + template) → overall score, category scores, risks, roadmap` — driven
  entirely by data on the questions/categories, so admins tune behaviour without a
  deploy.

## Roadmap (next phases)

1. Assessment renderer (conversational, save & continue, R2 evidence uploads).
2. Admin questionnaire builder UI (drag-reorder, publish/versioning).
3. Submission drill-down + user role management actions.
4. Continuous reassessment, trends, AI explanations & funding reports.
