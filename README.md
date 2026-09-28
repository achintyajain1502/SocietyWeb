# Society Website

## Deploying the backend

The backend is the Express app in `server/`. Deploy that folder as a Node service on a
host that supports a persistent disk, because the current SQLite database is stored in
`server/society.db`.

Set these backend environment variables in the hosting dashboard:

- `NODE_ENV=production`
- `JWT_SECRET` to a long random value
- `FRONTEND_URL` to the deployed frontend URL

The backend start command is `npm start` and its health check is `/api/health`.

When building the Vite frontend, set `VITE_API_URL` to the public backend URL, for example
`https://society-api.example.com`. The frontend includes credentials so the login session
cookie can be used across the two deployed services.

For local development, install dependencies in both folders, start the backend with
`npm run dev` from `server/`, and start the frontend with `npm run dev` from the project
root. The seeded demo login is `john@horizon.com` / `password123`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
