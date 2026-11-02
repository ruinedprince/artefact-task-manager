# Forma — Artefact technical challenge

Forma is a small task manager built for Artefact's Software Engineer written case. It demonstrates a Next.js 15 application with a type-safe tRPC backend, server-rendered initial data, and a deliberately focused task-management flow.

**Live demo:** [artefact-task-manager.onrender.com](https://artefact-task-manager.onrender.com)
**Repository:** [ruinedprince/artefact-task-manager](https://github.com/ruinedprince/artefact-task-manager)

## Features

- Create, list, update, and delete tasks.
- Required title, optional description, generated identifier, and creation timestamp.
- Server-side rendering for the initial task list.
- Cursor-based incremental loading with automatic infinite scroll and a manual fallback control.
- Clear loading, success, validation, retry, and error feedback.
- Portuguese, English, and Spanish interface, powered by a centralized i18next configuration.
- An in-app section containing the theoretical answers in all three languages.

## Stack

- Next.js 15 and React 19
- tRPC 11 for the API layer
- Zod for server-side input validation
- TypeScript
- i18next / react-i18next

## Run locally

Requirements: Node.js 20.9+ and npm. No database, environment variables, or external credentials are required.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the production build locally:

```sh
npm run build
npm start
```

## Validate

```sh
npm test
npm run build
npm run test:integration
```

- `npm test` covers domain validation, pagination behavior, concurrent request handling, and translations.
- `npm run build` compiles the production application and checks types.
- `npm run test:integration` starts a production server and verifies CRUD requests plus server-rendered HTML. Run it after `npm run build`.

For a dependency audit, run `npm audit`.

## Architecture and decisions

The home route is dynamic and obtains the initial page through the tRPC router on the server. Once hydrated, the client uses the tRPC HTTP client for mutations and subsequent queries. This gives the first visit meaningful server-rendered content while preserving a responsive client-side workflow.

The router validates every write at the server boundary with Zod. Task pagination uses a composite cursor (`createdAt` + `id`), so a cursor remains valid even when its referenced task is deleted.

Tasks intentionally live only in memory, as requested by the case. A restart or deploy clears the list, and separate Node processes do not share it. Run the application as a single process and use only fictional task data. There is no authentication layer.

## Project layout

```text
app/          Next.js pages and the tRPC HTTP route
components/   client workspace interface
server/       tRPC router, in-memory store, and domain tests
lib/          i18n and request-concurrency utilities
src/lib/      theoretical-answer content
tests/        HTTP and SSR integration test
```

## Deploy

The repository includes [`render.yaml`](./render.yaml) for a Render Node Web Service. It builds with `npm ci && npm run build` and starts with `npm start -- -p $PORT`.

The free demo is deployed at [artefact-task-manager.onrender.com](https://artefact-task-manager.onrender.com). Because its storage is in process memory, all tasks disappear whenever Render restarts or redeploys the service.
