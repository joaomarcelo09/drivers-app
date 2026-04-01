# AGENTS.md - Coding Agent Instructions

## Project Overview

Brazilian driving school marketplace API ("Condutores / DriveApp"). Express 5 + TypeScript + Prisma ORM + PostgreSQL. Connects driving students (Drivers) with driving Instructors.

## Tech Stack

- **Runtime:** Node.js 22 (see `.nvmrc`)
- **Language:** TypeScript 5.9, targeting Node 22 (`@tsconfig/node22`)
- **Framework:** Express 5
- **ORM:** Prisma with `@prisma/adapter-pg` (PostgreSQL)
- **Validation:** Zod 4
- **Auth:** JWT (access + refresh tokens via HTTP-only cookies), `express-jwt`
- **Package manager:** pnpm 10.26 (monorepo workspace, `pnpm-workspace.yaml`)
- **Runner:** tsx (dev), tsc (build)

## Build / Lint / Test Commands

```bash
pnpm install              # Install dependencies
pnpm build                # TypeScript compile (tsc)
pnpm type-check           # Type check without emitting (tsc --noEmit)
pnpm lint                 # ESLint (NOTE: config is currently commented out)
pnpm lint:fix             # ESLint with auto-fix
pnpm format               # Prettier format all files
pnpm format:check         # Prettier check formatting
pnpm dev                  # Start Docker DB + dev server (tsx --watch)
pnpm start:dev            # Dev server only (tsx --watch, uses .env)
pnpm db:migrate           # Run Prisma migrations
pnpm db:generate          # Generate Prisma client
pnpm db:format            # Format Prisma schema
pnpm seed                 # Run database seeders
```

### Testing

There is **no test framework configured** yet. The `test` script is a placeholder. If adding tests, install vitest or jest and add appropriate config. No test files exist in the codebase.

### Verifying Changes

After making code changes, always run:

```bash
pnpm type-check           # Ensure no type errors
pnpm format               # Format with Prettier
```

## Project Structure

```
src/
  index.ts                          # Express app entry, middleware, error handler
  database/client.ts                # Prisma client singleton
  docs/swagger.ts                   # Swagger/OpenAPI config
  middleware/
    securityMiddleware.ts           # JWT auth (express-jwt)
    uploadMiddleware.ts             # Multer file upload
    validationMiddleware.ts         # Zod request body validation
  models/
    http-exception.model.ts         # Custom HttpException error class
  repositories/                     # Data access layer (Prisma queries)
    drivers.repository.ts
    instructor.repository.ts
    user.repository.ts
  routes/
    routes.ts                       # Central router
    auth/auth.controller.ts         # Auth endpoints
    instructor/instructor.controller.ts
    user/user.controller.ts
  schemas/                          # Zod schemas for validation & response shaping
    instructorSchema.ts
    userSchema.ts
  services/                         # Business logic layer
    instructors.service.ts
    user.service.ts
  types/                            # TypeScript interfaces
    registerInput.ts
  utils/                            # Shared utilities
    bcrypt.ts, email.ts, firebaseStorage.ts, generateToken.ts
prisma/
  schema.prisma                     # Database schema
  migrations/                       # Prisma migrations
  seed.ts                           # Seed entry point
  seeders/                          # Individual seed files
generated/prisma/                   # Generated Prisma client (gitignored)
```

## Architecture

Layered architecture: **Controller -> Service -> Repository -> Prisma Client**

- **Controllers** (`routes/`): Handle HTTP, parse request, call services, send response. Use `try/catch` with `next(error)`.
- **Services** (`services/`): Business logic, orchestrate repositories, handle transactions.
- **Repositories** (`repositories/`): Raw Prisma queries. Accept optional `tx` param for transactions.
- **Schemas** (`schemas/`): Zod schemas for request validation and response shaping.

## Code Style Guidelines

### Formatting (Prettier)

- Print width: **150** characters (see `.prettierrc`)
- Default Prettier settings otherwise (double quotes, trailing commas, semicolons)
- Run `pnpm format` before committing

### Imports

- Use **double-quoted** string literals for import paths
- **Relative paths only** -- no path aliases are configured (use `../../` as needed)
- **Named exports** for services, repositories, utils, schemas
- **Default exports** for middleware, models, route modules (controllers export `default Router()`)
- Import from generated Prisma client: `../../generated/prisma/client` or `../../generated/prisma/models`

### Naming Conventions

- **Files:** `camelCase` with descriptive suffixes: `.controller.ts`, `.service.ts`, `.repository.ts`, `.model.ts`, `.schema.ts`
- **Functions:** `camelCase` with verb prefixes (`createUser`, `getInstructors`, `hashPassword`)
- **Repository functions:** End with `Repository` (e.g., `getUserRepository`, `createUserRespository`)
- **Interfaces/Types:** `PascalCase` (e.g., `UserRegisterInput`)
- **Constants:** `camelCase` (e.g., `isProduction`, `MAX_FILE_SIZE`)
- **Zod schemas:** `camelCase` ending in `Schema` (e.g., `userLoginSchema`, `driverRegistrationSchema`)

### TypeScript

- Prefer explicit types for function parameters and return values in services/repositories
- Use Prisma-generated types where available (`UserWhereInput`, `Prisma.TransactionClient`)
- Use Zod schemas for runtime validation; use `.parse()` on outgoing response data
- Avoid `any` -- use specific types. Existing `any` casts and `@ts-ignore` are technical debt, not precedent

### Error Handling

- Throw `HttpException(statusCode, message)` from `src/models/http-exception.model.ts`
- Use HTTP status codes from the `http-status-codes` package (`StatusCodes.BAD_REQUEST`, etc.)
- Controllers: wrap async handlers in `try/catch`, call `next(error)` in catch block
- Error messages are in **Brazilian Portuguese** (e.g., "Usuário não encontrado")
- Global error handler in `src/index.ts` catches all errors passed via `next()`

### Validation

- Define Zod schemas in `src/schemas/`
- Use `validateData(schema)` middleware for request body validation
- Use `.parse()` on response data to enforce response shape

### Authentication

- JWT access tokens (24h) and refresh tokens (7d)
- Refresh tokens stored in HTTP-only cookies and in the database
- Protected routes use `authMiddleware` from `src/middleware/securityMiddleware.ts`
- User ID extracted from JWT payload in `req.auth.user.id`

### Database

- Prisma ORM with PostgreSQL
- Global singleton client in `src/database/client.ts`
- Use `prisma.$transaction()` for multi-model writes
- Repository functions accept optional `tx?: Prisma.TransactionClient` for transaction support
- After schema changes: `pnpm db:migrate` then `pnpm db:generate`

### API Documentation

- Swagger/OpenAPI via JSDoc annotations in controller files
- Available at `/docs` endpoint
- Add `@swagger` JSDoc blocks to all new endpoints

### File Uploads

- Multer in-memory storage via `photoUploadMiddleware`
- Files uploaded to Firebase Storage via `src/utils/firebaseStorage.ts`

## Environment

- Copy `.env.example` to `.env` for local development
- Required: `DATABASE_URL`, `PORT`, Brevo email keys, Firebase credentials, JWT secrets
- Docker Compose provides PostgreSQL 16 at `localhost:5432`
- Start DB: `pnpm docker:start` or `docker compose up -d postgres`
