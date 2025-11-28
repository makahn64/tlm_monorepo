# Production Safeguards

This document describes all the safeguards in place to prevent accidental modification of the production environment.

## Protected Production Project

- **Project ID**: `tlm2021-41ce7`
- **Firebase Config**: `tlm-2021-prod`
- **Status**: ⛔ COMPLETELY BLOCKED from local development

## Safeguards Implemented

### 1. Service Account Key Removed ✅
- Production service account key (`service-account-key.json`) has been **deleted** from the repository
- Only development and staging keys are allowed
- See `SERVICE_ACCOUNTS_README.md` for setup instructions

### 2. Firebase Config Protection ✅
**File**: `apps/aphrodite/src/config/firebase.ts`

- Production credentials removed from config file
- Runtime check prevents production mode from running locally
- Throws error if production project ID is detected

```typescript
// Production mode is completely blocked
if (env === 'production') {
  throw new Error('Production mode is not allowed in local development');
}
```

### 3. Build Script Protection ✅
**File**: `apps/aphrodite/package.json`

Production build commands are disabled:
```bash
pnpm build        # ❌ Blocked
pnpm build:prod   # ❌ Blocked
pnpm build:dev    # ✅ Allowed
pnpm build:staging # ✅ Allowed
```

### 4. Seed Script Protection ✅
**File**: `scripts/seed-users.ts`

- Requires `service-account-key-dev.json` (not production key)
- Includes safety check that exits if production project detected
- Will not run if production credentials are present

### 5. AI Agent Rules ✅
**File**: `.kiro/steering/production-protection.md`

Permanent rules that prevent AI agents from:
- Creating scripts that connect to production
- Using production credentials
- Modifying production data
- Defaulting to production environment

### 6. Git Ignore Protection ✅
**File**: `.gitignore`

All service account keys are explicitly ignored:
```
service-account-key*.json
*-service-account*.json
*firebase-adminsdk*.json
```

## How to Work Safely

### Development (Safe) ✅
```bash
# 1. Get dev service account key (see SERVICE_ACCOUNTS_README.md)
# 2. Save as service-account-key-dev.json

# Run dev server
pnpm --filter @lotus/aphrodite dev

# Seed test data
pnpm seed:users

# Build for dev
pnpm --filter @lotus/aphrodite build:dev
```

### Staging (Safe) ✅
```bash
# Run staging server
pnpm --filter @lotus/aphrodite dev:staging

# Build for staging
pnpm --filter @lotus/aphrodite build:staging
```

### Production (Blocked Locally) ⛔
```bash
# These commands will FAIL:
pnpm --filter @lotus/aphrodite build        # ❌ Blocked
pnpm --filter @lotus/aphrodite build:prod   # ❌ Blocked
pnpm --filter @lotus/aphrodite dev:prod     # ❌ Blocked (runtime error)
```

## Production Deployment Process

Production can ONLY be deployed through the CI/CD pipeline:

1. **Create PR** with your changes
2. **Code Review** by team member
3. **Merge to main** branch
4. **GitHub Actions** automatically builds and deploys
5. **Firebase Hosting** serves the production build

### CI/CD Configuration
- Production credentials stored in **GitHub Secrets**
- Automatic deployment on merge to `main`
- No manual production deployments allowed

## If You Need Production Data

### ✅ Allowed: Read-Only Export
1. Go to Firebase Console
2. Manually export data
3. Import into development environment
4. Work with the copy

### ⛔ Not Allowed: Direct Modification
- No scripts that write to production
- No manual database changes
- No direct Firebase Admin SDK access

## Emergency Override

If you absolutely must access production (extremely rare):

1. **Stop** - Are you sure this can't be done through CI/CD?
2. **Document** - Write down exactly what you need to do and why
3. **Review** - Get approval from project lead
4. **Backup** - Export current production data first
5. **Execute** - Use Firebase Console only (not scripts)
6. **Verify** - Check that changes are correct
7. **Document** - Record what was changed and when

## Verification

To verify safeguards are working:

```bash
# This should fail
pnpm --filter @lotus/aphrodite build
# Output: ❌ Production builds are disabled locally

# This should fail
pnpm seed:users
# Output: ❌ ERROR: service-account-key-dev.json not found

# This should work (after setting up dev key)
pnpm --filter @lotus/aphrodite build:dev
# Output: ✓ built successfully
```

## Questions?

- **Setup issues**: See `SERVICE_ACCOUNTS_README.md`
- **Development**: Use `tlm-2021-dev` environment
- **Staging testing**: Use `tlm-2021-staging` environment
- **Production changes**: Create PR → Review → CI/CD

---

**Last Updated**: November 28, 2025  
**Status**: All safeguards active and tested ✅
