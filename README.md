# I_AM_BENJAMIN_SERVER

Minimal Express + TypeScript API for a personal portfolio backend (Postgres + Cloudinary image uploads).

**Contents**

- Project overview
- Requirements
- Setup & run
- Environment variables
- Database schema (example)
- API endpoints
- File uploads
- Troubleshooting

---

## Project

Backend server for a portfolio website. Provides endpoints to manage About, Projects, Experience, Certifications, Skills and Social links. Uses `pg` for Postgres and `cloudinary` for image hosting. Uses `express-fileupload` for multipart uploads.

## Requirements

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database
- Cloudinary account (for image uploads)

## Setup & Run

1. Install dependencies

```bash
npm install
```

2. Create an `.env` file at the project root with the variables below (example):

```env
# Postgres
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# or explicit parts
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=portfolio
DB_PORT=5432

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
PORT=3000
```

3. Ensure TypeScript / ESM config

- Current `tsconfig.json` uses `module: "nodenext"` and `verbatimModuleSyntax: true`. For runtime resolution you should set `"type": "module"` in `package.json`. Alternatively adjust `tsconfig` to `module: "commonjs"` and remove `verbatimModuleSyntax`.

4. Start development server (example script expected in `package.json`):

```bash
npm run dev    # runs nodemon / ts-node for development
```

Build and run (optional):

```bash
npm run build  # tsc
npm start      # node dist/index.js
```

## Database (example)

Below are example SQL statements you can run to create the minimal tables used by the controllers. Adjust types and constraints to your needs.

```sql
CREATE TABLE about (
  id serial PRIMARY KEY,
  about_me text
);

CREATE TABLE projects (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  github_url text,
  live_url text,
  project_status text,
  tools_used text,
  project_image text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE experience (
  id serial PRIMARY KEY,
  role text NOT NULL,
  company_name text NOT NULL,
  years text NOT NULL,
  description text,
  projects_done text
);
```

Run these in `psql` or your DB client against the database referenced by `DATABASE_URL`.

## API Endpoints (summary)

Assumes the router mounts under `/api`.

- About

  - `POST /api/about` — create the single about row (server prevents multiple entries). Body: `{ "about_me": "..." }`
  - `GET  /api/about` — get the single about row
  - `PUT  /api/about/:id` — update about entry. Body: `{ "about_me": "..." }`

- Projects

  - `POST /api/projects` — create project. Supports multipart/form-data (field `project_image`) or JSON `project_image` (base64 or remote URL). Required fields: `title`.
  - `GET  /api/projects` — list projects
  - `PUT  /api/projects/:id` — update project (dynamic fields). To upload a new image use multipart `project_image`.

- Experience
  - `POST /api/experience` — add experience. Body fields: `role`, `company_name`, `years`, `description`, `projects_done` (all required in current controller)
  - `GET  /api/experience` — list experience
  - `PUT  /api/experience/:id` — update experience
  - `DELETE /api/experience/:id` — delete experience

(Other controllers `skills`, `resume`, `social`, `certifications` follow similar patterns.)

## File uploads

- This project uses `express-fileupload` with `useTempFiles: true` in `src/index.ts`.
- When uploading via multipart/form-data, include a file field named `project_image`. Example curl:

```bash
curl -X POST http://localhost:3000/api/projects \
  -F "title=My Project" \
  -F "description=..." \
  -F "project_image=@/path/to/image.jpg"
```

If you send JSON with `project_image` as a base64 string, the controller will attempt to upload that string to Cloudinary.

## Where to go next

- Add automated migrations (eg. Prisma Migrate, node-pg-migrate, or simple SQL migration scripts).
- Add tests for API endpoints.
