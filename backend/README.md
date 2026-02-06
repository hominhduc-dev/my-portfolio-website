# Backend (Portfolio API)

Express + TypeScript API with Prisma (PostgreSQL), Supabase storage uploads, JWT auth, and SMTP email notifications.

## Requirements

- Node.js 18+ (recommended)
- PostgreSQL database (Supabase supported)

## Setup

```powershell
cd G:\my-portfolio-website\backend
npm install
```

Create `backend/.env` (see example below).

## Environment variables

Required:

- `DATABASE_URL` - Postgres connection string
- `JWT_SECRET` - secret for signing access tokens
- `ADMIN_EMAIL` - admin account email (seed)
- `ADMIN_PASSWORD` - admin account password (seed)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

Optional:

- `PORT` (default: 3000)
- `FRONTEND_URL` or `FRONTEND_URLS` (comma-separated)
- `JWT_EXPIRES_IN` (default: 15m)
- `REFRESH_EXPIRES_DAYS` (default: 14)
- `SUPABASE_BUCKET` (default: media)
- SMTP settings (see example)

Example `.env`:

```
PORT=4000
FRONTEND_URL=http://localhost:8080

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"

JWT_SECRET=replace-me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-me
ADMIN_NAME=Admin

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-me
SUPABASE_BUCKET=media_portfolio

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@example.com
SMTP_PASS="app-password"
SMTP_FROM="Your Name <you@example.com>"
SMTP_TO=you@example.com
```

## Database migrations and seed

If your Supabase database already exists and has data:

```powershell
npx prisma migrate deploy
npx prisma db seed
```

Notes:

- Migrations are in `prisma/migrations`.
- Seed will upsert the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Run the server

```powershell
npm run dev
```

The server listens on `PORT` (default `3000`).

## API overview

- Health: `GET /health`
- Auth: `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- CMS (protected): `/api/*`
  - Settings: `GET /api/settings`, `PUT /api/settings`, `PUT /api/settings/resume`
  - About: `GET /api/about`, `PUT /api/about`
  - Skills: `GET /api/skills`, `PUT /api/skills`
  - Projects: `GET/POST/PUT/DELETE /api/projects`
  - Posts: `GET/POST/PUT/DELETE /api/posts`
  - Repos: `GET/POST/PUT/DELETE /api/repos`
  - Messages: `GET /api/messages`, `PUT /api/messages/:id/read`, `DELETE /api/messages/:id`
- Public: `/public/*`
  - `GET /public/settings`, `GET /public/about`, `GET /public/skills`
  - `GET /public/projects`, `GET /public/posts`, `GET /public/repos`
  - `POST /public/contact`
- Uploads (protected): `POST /upload/avatar`, `POST /upload/resume`, `POST /upload/media`

## Notes

- CORS is controlled by `FRONTEND_URL` or `FRONTEND_URLS`.
- Refresh tokens are stored in the database and set as httpOnly cookies.
- Supabase storage is used for file uploads.
