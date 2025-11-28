# Aphrodite Setup Documentation

This document describes the project setup and configuration completed in Task 1.

## ✅ Completed Setup

### 1. Tailwind CSS + shadcn/ui
- **Installed**: `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/forms`, `tailwindcss-animate`
- **Configuration**: `tailwind.config.js` with shadcn/ui theme variables
- **CSS Variables**: Configured in `src/index.css` with light/dark mode support
- **Utilities**: `cn()` helper function in `src/lib/utils.ts`
- **Components Config**: `components.json` for shadcn/ui CLI

### 2. Vitest Testing Framework
- **Installed**: `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Configuration**: `vitest.config.ts` with jsdom environment
- **Setup File**: `src/test/setup.ts` with cleanup and jest-dom matchers
- **Coverage**: Configured with v8 provider
- **Scripts**:
  - `pnpm test` - Run tests once
  - `pnpm test:watch` - Run tests in watch mode
  - `pnpm test:ui` - Open Vitest UI

### 3. React Router v6
- **Installed**: `react-router-dom` v7 (latest, backwards compatible with v6)
- **Router Setup**: Basic router configuration in `src/routes/index.tsx`
- **Ready for**: Route definitions, nested routes, protected routes

### 4. ESLint
- **Installed**: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **Configuration**: `eslint.config.js` (ESLint 9 flat config)
- **Rules**: TypeScript strict mode, React best practices, React Hooks rules
- **Scripts**:
  - `pnpm lint` - Check for linting errors
  - `pnpm lint:fix` - Auto-fix linting errors

### 5. Prettier
- **Installed**: `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- **Configuration**: `.prettierrc` with project standards
- **Ignore File**: `.prettierignore` for build artifacts
- **Integration**: Integrated with ESLint via `eslint-plugin-prettier`
- **Scripts**:
  - `pnpm format` - Format all source files

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

Configured in:
- `vite.config.ts` - For Vite bundling
- `tsconfig.json` - For TypeScript
- `components.json` - For shadcn/ui CLI

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server (development mode)
pnpm dev:staging      # Start dev server (staging mode)
pnpm dev:prod         # Start dev server (production mode)

# Building
pnpm build            # Build for production
pnpm build:dev        # Build for development
pnpm build:staging    # Build for staging

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Open Vitest UI

# Code Quality
pnpm type-check       # TypeScript type checking
pnpm lint             # Check for linting errors
pnpm lint:fix         # Auto-fix linting errors
pnpm format           # Format code with Prettier
```

## Next Steps

The foundation is ready for:
- Creating shared type definitions (Task 2)
- Setting up API client package (Task 3)
- Implementing authentication (Task 4)
- Building UI components with shadcn/ui

## Testing the Setup

All tools are verified working:
- ✅ TypeScript compilation passes
- ✅ ESLint runs without errors
- ✅ Prettier formatting works
- ✅ Vitest runs existing tests
- ✅ Tailwind CSS is configured
- ✅ React Router is ready

Run `pnpm type-check && pnpm lint && pnpm test` to verify everything works.
