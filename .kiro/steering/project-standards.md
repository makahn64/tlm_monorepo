---
inclusion: always
---

# The Lotus Method - Project Standards

## Project Overview

The Lotus Method platform consists of three main applications:
- **Aphrodite:** React web app for admins and trainers
- **Lucy:** React Native mobile app for client workout playback
- **LucyInTheSky:** React web app for client workout playback

## Technology Stack

### Frontend
- **Framework:** React (web apps), React Native (mobile)
- **Build Tool:** Vite (migrating from Create React App)
- **Language:** TypeScript
- **Monorepo:** pnpm workspaces + Turborepo

### Backend
- **Platform:** Google Cloud Platform
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Functions:** Google Cloud Functions v2
- **Storage:** Google Cloud Storage (video content)

### Environments
- **Development:** dev Firebase project
- **Staging:** staging Firebase project
- **Production:** prod Firebase project

## Code Organization

### Monorepo Structure
```
lotus-method/
├── apps/
│   ├── aphrodite/          # Admin/trainer web app
│   ├── lucy/               # React Native mobile app
│   └── lucy-in-the-sky/    # Client web app
├── packages/
│   ├── shared-ui/          # Shared React components
│   ├── shared-utils/       # Common utilities
│   ├── shared-types/       # TypeScript types
│   ├── api-client/         # API/Cloud Functions client
│   └── business-logic/     # Pure functions, no Firebase deps
├── functions/              # Google Cloud Functions
└── docs/                   # All documentation
```

## Development Standards

### Documentation
- All documentation must be placed in the `/docs` folder
- Use Markdown format
- Keep documentation up to date with code changes

### Code Principles
- **Abstraction:** Separate business logic from Firebase SDK calls
- **Type Safety:** Use TypeScript throughout
- **Shared Code:** Use workspace packages for shared functionality
- **Testing:** Write tests for business logic (when requested)

### Architecture Principles
- Keep business logic independent of infrastructure
- Structure code to maintain future migration optionality
- Prefer incremental improvements over big rewrites

## Migration Notes

This project is being modernized from a 2021 codebase:
- Migrating from Create React App to Vite
- Converting separate packages to proper monorepo structure
- Adding proper multi-environment support
- Updating to modern dependencies and tooling
