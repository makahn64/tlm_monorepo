# The Lotus Method

Monorepo for The Lotus Method platform.

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Build all apps
pnpm build

# Type check all packages
pnpm type-check
```

## Structure

- `apps/aphrodite` - Admin/trainer web app (Vite + React)
- `apps/lucy` - React Native mobile app (TODO)
- `apps/lucy-in-the-sky` - Client web app (TODO)
- `packages/shared-types` - Shared TypeScript types
- `packages/business-logic` - Pure business logic functions
- `packages/shared-ui` - Shared React components (TODO)
- `packages/shared-utils` - Common utilities (TODO)
- `packages/api-client` - API/Cloud Functions client (TODO)
- `functions/` - Google Cloud Functions (TODO)
- `legacy/` - Legacy code being migrated

## Documentation

See `/docs` for detailed documentation.
