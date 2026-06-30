# EcoCash Withdraw App

Full-stack application with a React frontend and Node.js/Express backend, designed to match the provided mobile withdrawal screen.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Validation: Zod
- Security/HTTP middleware: Helmet, CORS, Morgan
- Tooling: npm workspaces, concurrently, Prettier

## Project Structure

- `client/` React UI
- `client/src/components/` reusable UI components
- `client/src/pages/` page-level components
- `client/src/services/` API calls
- `client/src/styles/` style layers
- `server/` Express API
- `server/src/controllers/` request handlers
- `server/src/services/` business logic
- `server/src/routes/` route definitions
- `server/src/validators/` schema validation
- `server/src/middleware/` centralized middleware
- `server/src/config/` environment config

## Setup

1. Install dependencies from the project root:

```bash
npm install
```

2. Create environment files:

- Copy `client/.env.example` to `client/.env`
- Copy `server/.env.example` to `server/.env`

3. Start both frontend and backend:

```bash
npm run dev
```

## Scripts

- `npm run dev` run frontend and backend together
- `npm run dev:client` run only frontend
- `npm run dev:server` run only backend
- `npm run build` build frontend
- `npm run start` start backend in production mode
- `npm run lint` lint all workspaces

## API

- `GET /api/health` service health check
- `POST /api/v1/withdraw`

Request body:

```json
{
  "phone": "0771234567",
  "pin": "1234"
}
```

## Notes

- This demo returns a mock transaction response.
- PIN is validated and masked in the response to avoid exposing raw values.
