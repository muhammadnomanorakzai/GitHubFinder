# GitHub Finder

A full-stack GitHub Finder application built with a React frontend and an Express/MongoDB backend.

This project allows users to:

- search GitHub users and repositories
- view GitHub profile details in a modal
- use debounced username suggestions while typing
- submit contact messages
- authenticate with GitHub OAuth
- create, edit, and delete authenticated reviews

The project is organized as a clean monorepo:

```text
root/
├── client/   # React + Vite frontend
├── server/   # Express + MongoDB backend
└── README.md
```

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API + Reducers
- TailwindCSS
- Framer Motion
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- GitHub OAuth
- Cookie Parser
- Helmet
- CORS
- Morgan

## Features

### GitHub Search

- Search GitHub users and repositories
- Filter by:
  - username
  - display name
  - repository name
  - language
  - location
- Debounced username suggestion dropdown
- Match-percentage badges for results

### GitHub Profile Modal

- Fetches full user data from GitHub
- Shows avatar, bio, stats, social details, and top repositories

### Authenticated Review System

- GitHub OAuth login
- JWT-based session authentication
- HTTP-only cookie session support
- Everyone can read reviews
- Only authenticated users can create reviews
- Only review owner can update
- Only review owner or admin can delete

### Contact Form

- Frontend submits to backend API
- Backend validates and sanitizes input
- Messages are stored in MongoDB

## Monorepo Structure

```text
client/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json

server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── validations/
├── .env.example
├── app.js
├── index.js
├── package.json
└── vercel.json
```

## Local Development

### 1. Install dependencies

From the root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2. Configure environment variables

Create these files:

- `client/.env`
- `server/.env`

Use the examples:

- [client/.env.example](client/.env.example)
- [server/.env.example](server/.env.example)

### 3. Run both frontend and backend

From the root:

```bash
npm run dev
```

This starts:

- frontend on `http://localhost:3000`
- backend on `http://localhost:5000`

## Environment Variables

### Frontend: `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
```

### Backend: `server/.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
CLIENT_URLS=http://localhost:3000
ALLOW_VERCEL_PREVIEW_ORIGINS=true
MONGODB_URI=mongodb://127.0.0.1:27017/github-finder
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
AUTH_COOKIE_NAME=ghf_auth
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
```

## GitHub OAuth Setup

Use these values for local development:

### Homepage URL

```text
http://localhost:3000
```

### Authorization callback URL

```text
http://localhost:3000/auth/github/callback
```

## API Overview

### Auth Routes

- `POST /api/auth/github`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Review Routes

- `GET /api/reviews`
- `POST /api/reviews`
- `PATCH /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Contact Routes

- `POST /api/contact`

### Health Check

- `GET /api/health`

## Architecture Notes

### Frontend State Management

The frontend uses Context API with reducers for:

- GitHub state
- Authentication state
- Review state
- Alert state

This keeps the app lightweight while still giving predictable state updates.

### Backend Layering

The backend follows a clean layered structure:

- `routes/` define API endpoints
- `controllers/` handle request/response flow
- `services/` contain business logic and data operations
- `models/` define MongoDB schemas
- `middleware/` handles auth, validation, and errors
- `utils/` contains shared helpers
- `validations/` centralize request validation

## Security

This project includes:

- JWT token generation and verification
- backend-enforced authorization
- ownership validation for review update/delete
- input sanitization
- request validation
- HTTP-only cookies
- CORS restrictions
- Helmet security headers
- centralized error handling

## Search Implementation

GitHub search is built using the GitHub Search API from the frontend.

The search flow includes:

- query construction with search qualifiers
- parallel user/repository search logic
- deduplication using `Map`
- dynamic matching badges
- debounced username suggestion dropdown

## Deployment

This repository is prepared for Vercel with separate frontend and backend projects.

See:

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

Recommended deployment model:

- one Vercel project for `client/`
- one Vercel project for `server/`
- both connected to the same GitHub repository

## Scripts

### Root

```bash
npm run dev
```

Starts frontend and backend together with `concurrently`.

### Client

```bash
npm run dev --prefix client
npm run build --prefix client
```

### Server

```bash
npm run dev --prefix server
npm run start --prefix server
```

## Interview Summary

If someone asks what this project is, a strong short answer is:

> GitHub Finder is a full-stack application that combines GitHub search, GitHub OAuth authentication, and an authenticated review system. The frontend is built with React, Vite, TailwindCSS, and Context API, while the backend is built with Express, MongoDB, JWT, and GitHub OAuth. It supports secure review ownership rules, contact form submissions, and a monorepo setup ready for Vercel deployment.

## Future Improvements

- server-side rate limiting
- admin dashboard for contact messages
- caching for GitHub search
- test coverage for auth and review flows
- pagination from backend for reviews

## License

This project is for educational and portfolio use unless you define a separate license.
