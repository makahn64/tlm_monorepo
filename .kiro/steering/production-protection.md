---
inclusion: always
---

# Production Environment Protection Rules

## CRITICAL: Never Touch Production

The production Firebase project `tlm2021-41ce7` contains LIVE user data and must NEVER be modified by development scripts or automated processes.

## Protected Projects

- **LEGACY LIVE Production**: `tlm2021-41ce7` ⛔ NEVER TOUCH
- **New Production** (not yet live): `tlm-2021-prod` (safe for CI/CD deployment)

## Rules for AI Agents

1. **NEVER** create, modify, or run scripts that connect to `tlm2021-41ce7`
2. **NEVER** use `service-account-key.json` (production key) in any scripts
3. **ALWAYS** use `service-account-key-dev.json` for development scripts
4. **ALWAYS** add safety checks to verify project ID before any write operations
5. **ALWAYS** default to development environment unless explicitly told otherwise

## Allowed Projects for Development

- **Development**: `tlm-2021-dev` (safe for testing, seeding, experimentation)
- **Staging**: `tlm-2021-staging` (safe for pre-production testing)

## Script Safety Pattern

All scripts that interact with Firebase MUST include this safety check:

```typescript
// Safety check - ensure we're not touching production
if (serviceAccount.project_id === 'tlm2021-41ce7') {
  console.error('❌ ERROR: Attempting to use PRODUCTION project!');
  console.error('❌ This is not allowed.');
  process.exit(1);
}

// Note: tlm-2021-prod (new production) is okay for CI/CD
// Only tlm2021-41ce7 (legacy live) is completely blocked
```

## Manual Operations Only

The ONLY way to interact with production is:
- Manual exports (read-only) by authorized developers
- Deployment through CI/CD pipeline after code review
- Firebase Console access by authorized admins

## If Production Access is Needed

If you genuinely need to work with production data:
1. Export data manually from Firebase Console
2. Import into development environment
3. Work with the development copy
4. NEVER write back to production

## Enforcement

- All scripts must check project ID before any write operations
- Service account keys for production should be stored securely and separately
- Development should use `service-account-key-dev.json` exclusively
