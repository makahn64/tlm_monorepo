# Aphrodite - The Lotus Method Admin Portal

Admin and trainer portal for managing exercises, workouts, and clients.

## Development

### Running Locally

```bash
# Development environment (default)
pnpm dev

# Staging environment
pnpm dev:staging

# Production environment (use with caution)
pnpm dev:prod
```

### Building

```bash
# Build for production
pnpm build

# Build for development
pnpm build:dev

# Build for staging
pnpm build:staging
```

### Type Checking

```bash
pnpm type-check
```

## Environments

The app supports three Firebase environments:

- **Development** (`tlm-2021-dev`) - For local development and testing
- **Staging** (`tlm-2021-staging`) - For pre-production testing
- **Production** (`tlm-2021-prod`) - Live production environment

Environment is controlled by:
1. The `--mode` flag in Vite commands
2. Corresponding `.env.{environment}` files
3. Firebase config in `src/config/firebase.ts`

## Project Structure

```
src/
├── config/          # Configuration (Firebase, etc.)
├── components/      # React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Styling:** TBD (migrating from legacy)

## Firebase Setup

Firebase configuration is managed in `src/config/firebase.ts`. The configs are safe to commit as they're client-side public keys. Firebase security is handled by Firestore security rules, not by hiding these values.

## Legacy Code

The original Aphrodite implementation is in `/legacy/AphroditeUI`. Reference it during migration but do not import from it.
