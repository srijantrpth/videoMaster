# VideoMaster

TypeScript/Express backend API for media (video) management. It provides JWT-based authentication, MongoDB persistence with Mongoose, secure file uploads with Multer, optional Cloudinary storage, request validation via Zod, and structured logging with Morgan and Winston.

## Features

- TypeScript-first Node.js backend (ESM)
- REST API with Express 5
- MongoDB + Mongoose (with aggregate pagination)
- Authentication with JWT and password hashing (bcrypt)
- File uploads via Multer; optional Cloudinary integration
- Request validation with Zod
- CORS, cookies, and environment-based configuration
- Developer-friendly logging (Morgan) + application logging (Winston)
- Hot-reload development via Nodemon, TS build via tsc

## Tech Stack

- Runtime: Node.js (ESM)
- Language: TypeScript
- Framework: Express 5
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- Uploads/Storage: Multer, Cloudinary (optional)
- Validation: Zod
- Logging: Morgan, Winston
- Tooling: ts-node/esm, tsc, Nodemon, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm (comes with Node)
- A MongoDB instance (local or hosted)
- (Optional) A Cloudinary account for media storage

### Installation

```bash
git clone https://github.com/srijantrpth/videoMaster.git
cd videoMaster
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env # if you maintain a template; otherwise create .env manually
```

Example `.env` values:

```env
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/videomaster

# Auth
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d

# Cloudinary (optional, required if enabling Cloudinary uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Logging
LOG_LEVEL=info
```

### Run in Development

```bash
npm run dev
```

This starts the server with Nodemon + ts-node/esm. By default it listens on `http://localhost:${PORT}`.

### Build and Run in Production

```bash
npm run build
npm run serve
```

- `npm run build` compiles TypeScript to `dist/`
- `npm run serve` runs the compiled JS from `dist/`

## Available Scripts

- `npm run dev` — Start in watch mode (Nodemon + ts-node/esm)
- `npm run build` — TypeScript compile to `dist/`
- `npm run serve` — Run compiled server from `dist/`
- `npm test` — Placeholder

You can also format code with Prettier:

```bash
npx prettier --write .
```

## Project Structure

```text
.
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ nodemon.json
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ src/
   └─ ... your TypeScript source files (routes, controllers, models, middlewares, utils)
```

A typical layout inside `src/` might be:

```text
src/
├─ index.ts                # App entrypoint (server bootstrap)
├─ app.ts                  # Express app setup (middlewares, routes)
├─ routes/                 # Route modules
├─ controllers/            # Route controllers
├─ models/                 # Mongoose models/schemas
├─ middlewares/            # Auth, error handling, validation, etc.
├─ services/               # Business logic and integrations
├─ utils/                  # Helpers (logger, cloudinary, etc.)
└─ config/                 # Env and configuration helpers
```

Adjust names and locations to match your implementation.

## Configuration Notes

- Express 5 requires ESM-compatible setup; this project uses `ts-node/esm` in development.
- Mongoose v8 requires a relatively recent Node.js version; Node 18+ is recommended.
- If you enable Cloudinary, ensure credentials are present and your upload flow routes/models handle Cloudinary URLs and metadata.
- Use Zod to validate request bodies, params, and query strings at route boundaries.

## API

- Base URL: `http://localhost:${PORT}`
- Auth: Bearer tokens via `Authorization: Bearer <jwt>`
- Content: JSON unless uploading files (Multer-based multipart/form-data)

Example request (adjust to your implemented routes):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

For file uploads:

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -H "Authorization: Bearer <jwt>" \
  -F "file=@/path/to/video.mp4"
```

Document concrete endpoints under this section as you implement them.

## Logging

- HTTP access logs: Morgan
- App logs: Winston (controlled by `LOG_LEVEL`)

## Security

- Keep `JWT_SECRET` strong and private
- Use HTTPS in production
- Configure CORS origins appropriately
- Validate all inputs with Zod
- Never commit `.env` or secrets

## License

ISC — see `package.json`.

## Contributing

Issues and PRs are welcome. Before submitting, please:
- Run the app locally and add tests or examples where applicable
- Keep code formatted with Prettier
- Follow the existing project conventions