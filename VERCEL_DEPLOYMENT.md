# Vercel Deployment Setup

This repo is prepared for two separate Vercel projects from the same GitHub repository:

- `client/` -> frontend project
- `server/` -> backend project

## 1. Frontend Vercel project

- Import the same GitHub repository into Vercel
- Set the Root Directory to `client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Frontend environment variables

- `VITE_API_BASE_URL=https://your-backend-project.vercel.app/api`
- `VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id`

## 2. Backend Vercel project

- Import the same GitHub repository into Vercel
- Set the Root Directory to `server`
- Framework Preset: `Other`
- Install Command: `npm install`
- Build Command: leave empty

### Backend environment variables

- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_long_random_secret`
- `JWT_EXPIRES_IN=7d`
- `AUTH_COOKIE_NAME=ghf_auth`
- `GITHUB_CLIENT_ID=your_github_oauth_app_client_id`
- `GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret`
- `CLIENT_URL=https://your-frontend-project.vercel.app`
- `CLIENT_URLS=https://your-frontend-project.vercel.app`
- `ALLOW_VERCEL_PREVIEW_ORIGINS=true`

## 3. GitHub OAuth URLs

For production:

- Homepage URL: `https://your-frontend-project.vercel.app`
- Authorization callback URL: `https://your-frontend-project.vercel.app/auth/github/callback`

For local development:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/auth/github/callback`

## Notes

- Frontend SPA routing is handled by `client/vercel.json`
- Backend CORS is prepared for local, production, and optional Vercel preview origins
- The frontend should always call the backend using `VITE_API_BASE_URL`
