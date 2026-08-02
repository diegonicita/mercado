# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start          # Run with node app.js (port 8126)
npx nodemon app.js # Run with auto-reload

# Linting & formatting (Biome)
npx biome check .          # Check all files
npx biome check --write .  # Auto-fix formatting and linting issues
npx biome format --write . # Format only

# Database (Sequelize CLI)
npx sequelize db:migrate         # Run pending migrations
npx sequelize db:migrate:undo    # Rollback last migration
npx sequelize db:seed:all        # Run all seeders
```

No test suite is configured.

## Architecture

**Express.js + EJS + MySQL/Sequelize** platform serving two domains:
- `mercado.webapp.ar` — eCommerce marketplace
- `examenes.com.ar` — Quiz/exam system

### Request Flow

```
HTTP Request
  → app.js (middleware stack: CORS, cookie-parser, passport, morgan)
  → routes/ (main, user, products, api, auth-examenes, auth-mercado)
  → controllers/ (business logic)
  → database/models/ (Sequelize ORM → MySQL)
  → views/ (EJS templates rendered back to client)
```

### Authentication

Two parallel authentication systems:
1. **JWT** — Token stored in HTTP-only cookie, verified by `middlewares/verifyToken.js`
2. **Google OAuth** — Two separate Passport strategies in `middlewares/`:
   - `google-mercado.js` — for mercado domain
   - `google-examenes.js` — for examenes domain

Routes: `auth-mercado.js` and `auth-examenes.js` handle OAuth callbacks separately.

### Real-time (Socket.io)

`utils/socketManager.js` manages room-based chat. Rooms hold up to 10 messages of history. Initialized in `app.js` by wrapping the HTTP server.

### Key Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 8126) |
| `TOKEN_KEY` | JWT signing secret |
| `GOOGLE_CLIENT_ID / SECRET` | OAuth credentials |
| `ALLOWED_ORIGINS` | CORS whitelist (comma-separated) |
| `MP_ACCESS_TOKEN` | Mercado Pago payment key |
| Email vars | SMTP config for Nodemailer (Gmail) |

### Database Models

Located in `database/models/`. Key models:
- `User` → `usuarios` table (auth, email verification with UUID codes)
- `Product` → `productos` table
- `Pregunta` → exam questions (linked to `Clasificacion` categories)

Sequelize config: `database/config/config.js` (supports test/development/production environments).

### Code Style

Biome enforces: tabs, 80-char line width, double quotes, organized imports. Run `npx biome check --write .` before committing.
