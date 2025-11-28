# Service Account Keys

## Security Notice

Service account keys provide administrative access to Firebase projects and must be handled with extreme care.

## Required Keys for Development

### Development Key (Required)
- **File**: `service-account-key-dev.json`
- **Project**: `tlm-2021-dev`
- **Purpose**: Local development, testing, seeding scripts
- **How to get it**:
  1. Go to [Firebase Console](https://console.firebase.google.com/)
  2. Select **tlm-2021-dev** project
  3. Go to Project Settings → Service Accounts
  4. Click "Generate New Private Key"
  5. Save as `service-account-key-dev.json` in project root

### Staging Key (Optional)
- **File**: `service-account-key-staging.json`
- **Project**: `tlm-2021-staging`
- **Purpose**: Staging environment testing
- **How to get it**: Same process as dev, but select staging project

## Production Key - DO NOT USE

⚠️ **CRITICAL**: The production service account key should **NEVER** be in this repository.

- **Legacy Live Project**: `tlm2021-41ce7` ⛔ NEVER TOUCH
- **Access**: Only through CI/CD pipeline
- **Storage**: GitHub Secrets only

### Why Production is Blocked

1. Contains live user data
2. Any mistakes could affect real users
3. All production changes must go through code review
4. Deployment is automated through CI/CD

## File Structure

```
project-root/
├── service-account-key-dev.json      ← You need this (gitignored)
├── service-account-key-staging.json  ← Optional (gitignored)
└── service-account-key.json          ← DELETED (was production)
```

## Safety Checks

All scripts that use service accounts include safety checks:

```typescript
// Verify we're not touching production
if (serviceAccount.project_id === 'tlm2021-41ce7') {
  console.error('❌ ERROR: Production project detected!');
  process.exit(1);
}
```

## If You Need Production Access

You don't. Here's what to do instead:

1. **Read data**: Export manually from Firebase Console
2. **Write data**: Deploy through GitHub → CI/CD pipeline
3. **Emergency**: Contact project admin with proper authorization

## Getting Started

1. Download the dev service account key (see above)
2. Place it in project root as `service-account-key-dev.json`
3. Run seed script: `pnpm seed:users`
4. Start developing: `pnpm --filter @lotus/aphrodite dev`

## Questions?

- Development issues: Use dev environment
- Staging testing: Use staging environment  
- Production changes: Create PR → Code review → CI/CD deployment
