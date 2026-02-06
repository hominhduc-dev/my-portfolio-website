# Portfolio Website

Full-stack personal portfolio with an admin CMS, public site, and media uploads.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL (Supabase)
- ORM: Prisma
- Storage: Supabase Storage
- Auth: JWT + httpOnly cookies
- Email: Nodemailer (SMTP)

## Project Structure

- `frontend/` - Public site + admin dashboard
- `backend/` - REST API, auth, CMS, uploads

## Local Development

Backend:

```powershell
cd G:\my-portfolio-website\backend
npm install
npm run dev
```

Frontend:

```powershell
cd G:\my-portfolio-website\frontend
npm install
npm run dev
```

Notes:

- Set `backend/.env` (see `backend/.env.example`).
- Set `frontend/.env` with `VITE_API_URL=http://localhost:4000`.
- Run migrations + seed once:

```powershell
cd G:\my-portfolio-website\backend
npx prisma migrate deploy
npx prisma db seed
```

## Deploy Guide

This project is split into two deploys: backend on a VPS + frontend on Vercel, with Supabase as the database.

### 1) Supabase (Database + Storage)

- Create a Supabase project.
- Grab the Postgres connection string and set `DATABASE_URL` in backend env.
- Create a storage bucket and set `SUPABASE_BUCKET`.
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in backend env.

### 2) Deploy Backend on VPS

Requirements on the VPS:

- Node.js 18+
- Git
- (Optional) Nginx for reverse proxy + SSL
- (Optional) PM2 to keep the app running

Steps:

```bash
# 1) SSH into VPS
ssh user@your-vps-ip

# 2) Clone repo
git clone <your-repo-url> portfolio
cd portfolio/backend

# 3) Install deps
npm install

# 4) Create .env
cp .env.example .env
## Edit .env with production values

# 5) Run migrations + seed
npx prisma migrate deploy
npx prisma db seed
```

Run the server (simple):

```bash
npm run dev
```

Recommended (PM2):

```bash
npm install -g pm2
pm2 start "npm run dev" --name portfolio-backend
pm2 save
pm2 startup
```

Optional Nginx reverse proxy (example):

```
server {
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then issue SSL (Let’s Encrypt):

```bash
sudo certbot --nginx -d api.yourdomain.com
```

### 3) Deploy Frontend on Vercel

- Import `frontend/` as a Vite project.
- Set env: `VITE_API_URL=https://api.yourdomain.com`
- Build command: `npm run build`
- Output: `dist`

### 4) CORS

On the backend, set:

- `FRONTEND_URL=https://your-frontend-domain`

If you use multiple domains, set `FRONTEND_URLS` as a comma-separated list.

## Admin Login

- Login URL: `/admin/login`
- Credentials come from the seeded admin user (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
