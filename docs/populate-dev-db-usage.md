# Database Population Script - Usage Guide

## Overview

The `populate-dev-db.ts` script safely copies all Firestore data from the LIVE production database to either the development or staging environment. This allows developers to work with realistic data structures and relationships without risking production data.

## Prerequisites

### Required Files

1. **Legacy Production Service Account Key** (source - read-only)
   - File: `service-account-key-prod-live.json`
   - Location: Project root directory
   - **IMPORTANT**: This file is NOT in the repository for security reasons
   - Named `-prod-live` to differentiate from the new production database (`tlm-2021-prod`)

2. **Development Service Account Key** (destination - write)
   - File: `service-account-key-dev.json`
   - Location: Project root directory
   - Already in repository (safe for development use)

3. **Staging Service Account Key** (destination - write)
   - File: `service-account-key-staging.json`
   - Location: Project root directory
   - Already in repository (safe for staging use)

### How to Obtain Legacy Production Service Account Key

The legacy production service account key must be obtained manually from an authorized team member or the Firebase Console:

1. **Via Firebase Console** (requires admin access):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select the `tlm2021-41ce7` project (legacy LIVE production)
   - Navigate to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the file as `service-account-key-prod-live.json` in the project root
   - **NEVER commit this file to version control**

2. **Via Team Member**:
   - Request the legacy production service account key from a team lead
   - Save it as `service-account-key-prod-live.json` in the project root
   - Verify the `project_id` field is `tlm2021-41ce7`

**Note:** This is for the legacy production database (`tlm2021-41ce7`). The new production database (`tlm-2021-prod`) will use `service-account-key-prod.json` when it goes live.

### Permissions

- **Production service account**: Read-only access is sufficient and recommended
- **Dev/Staging service accounts**: Write access required

## Usage

### Basic Usage (Default to Dev)

```bash
pnpm tsx scripts/populate-dev-db.ts
```

This will copy all data from production to the development environment.

### Target Development Environment

```bash
pnpm tsx scripts/populate-dev-db.ts --target=dev
```

Explicitly specifies the development environment as the destination.

### Target Staging Environment

```bash
pnpm tsx scripts/populate-dev-db.ts --target=staging
```

Copies data to the staging environment instead of development.

## Expected Output

### Successful Execution

```
🚀 Database Population Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Target environment: dev

📂 Loading service account credentials...
   ✓ Loaded production service account: tlm2021-41ce7
   ✓ Loaded dev service account: tlm-2021-dev

🔧 Initializing Firebase Admin instances...
   ✓ Initialized source app: tlm2021-41ce7 (read-only)
   ✓ Initialized destination app: tlm-2021-dev (write)

🔒 PERFORMING CRITICAL SAFETY CHECKS...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Checking source project ID...
   ✓ Source is production: tlm2021-41ce7
   Checking destination project ID...
   ✓ Destination matches target: tlm-2021-dev
   Verifying destination is not production...
   ✓ Destination is NOT production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ALL SAFETY CHECKS PASSED

🔄 Copying data from production to dev
   Source: tlm2021-41ce7
   Destination: tlm-2021-dev

🔍 Discovering collections...
   ✓ Found 12 collections

📦 Processing collections...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ clients (234 documents) - 2.3s
✓ exercises (567 documents) - 4.1s
✓ media (89 documents) - 1.2s
✓ programs (45 documents) - 0.8s
✓ trainers (12 documents) - 0.3s
✓ users (156 documents) - 1.5s
✓ workouts (423 documents) - 3.7s
✓ settings (8 documents) - 0.2s
✓ notifications (234 documents) - 2.1s
✓ analytics (1024 documents) - 8.4s
✓ feedback (67 documents) - 0.9s
✓ subscriptions (89 documents) - 1.1s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
   Total collections: 12
   Successful: 12
   Failed: 0
   Total documents: 2,948
   Total time: 26.6s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Script setup verified
```

### Execution with Errors

If some collections fail to copy, the script will continue with remaining collections:

```
📦 Processing collections...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ clients (234 documents) - 2.3s
✗ exercises - Error: Permission denied
✓ media (89 documents) - 1.2s
✓ programs (45 documents) - 0.8s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
   Total collections: 4
   Successful: 3
   Failed: 1
   Total documents: 368
   Total time: 4.3s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Some collections failed to copy. Please review errors above.
```

## Safety Features

The script includes multiple layers of protection to prevent accidental production writes:

### 1. Target Validation
- Blocks `--target=production` and `--target=prod` explicitly
- Only allows `dev` and `staging` as valid targets

### 2. Project ID Verification
- Verifies source project ID is exactly `tlm2021-41ce7`
- Verifies destination project ID matches the target environment
- Ensures destination is NOT production

### 3. Dual Firebase Instances
- Separate Firebase Admin instances for source and destination
- Complete isolation between environments
- No possibility of cross-contamination

### 4. Read-Only Source Connection
- Production connection uses read-only credentials
- No write operations possible on production

## Common Errors and Solutions

### Error: Cannot find service account file

```
❌ ERROR: Failed to load service account from service-account-key-prod-live.json
❌ ENOENT: no such file or directory
```

**Solution**: Obtain the legacy production service account key and save it as `service-account-key-prod-live.json` in the project root. See "How to Obtain Legacy Production Service Account Key" above.

---

### Error: Invalid target

```
❌ ERROR: Invalid target 'production'
❌ This script is for populating dev/staging only
```

**Solution**: Use `--target=dev` or `--target=staging`. Production cannot be targeted by this script for safety reasons.

---

### Error: Source project ID mismatch

```
❌ SAFETY CHECK FAILED: Source project ID mismatch
❌ Expected: tlm2021-41ce7
❌ Got: some-other-project
```

**Solution**: Verify you're using the correct legacy production service account key. The `project_id` field in `service-account-key-prod-live.json` must be `tlm2021-41ce7`.

---

### Error: Destination project ID mismatch

```
❌ SAFETY CHECK FAILED: Destination project ID mismatch
❌ Expected: tlm-2021-dev
❌ Got: tlm-2021-staging
```

**Solution**: The service account file doesn't match the target environment. If targeting dev, ensure `service-account-key-dev.json` has `project_id: tlm-2021-dev`. If targeting staging, ensure `service-account-key-staging.json` has `project_id: tlm-2021-staging`.

---

### Error: Permission denied

```
✗ exercises - Error: Permission denied
```

**Solution**: The service account lacks permissions to read the collection. Contact a Firebase admin to grant the necessary permissions to the service account.

---

### Error: Network timeout

```
✗ media - Error: Deadline exceeded
```

**Solution**: Network connectivity issue or Firestore is experiencing high latency. Try running the script again. If the problem persists, check your internet connection and Firebase status.

---

### Error: Quota exceeded

```
❌ Fatal error: Quota exceeded
```

**Solution**: You've hit Firestore quota limits. Wait for the quota to reset (usually daily) or contact Firebase support to increase quotas.

---

### Error: Invalid JSON in service account

```
❌ ERROR: Failed to load service account from service-account-key-prod-live.json
❌ Unexpected token in JSON at position 0
```

**Solution**: The service account file is corrupted or not valid JSON. Re-download the service account key from Firebase Console.

## Performance Considerations

### Execution Time

- **Small databases** (< 1,000 documents): ~10-30 seconds
- **Medium databases** (1,000-10,000 documents): ~1-5 minutes
- **Large databases** (> 10,000 documents): ~5-30 minutes

Actual time depends on:
- Number of collections and documents
- Document size and complexity
- Network speed and latency
- Firestore performance

### Batch Processing

The script processes documents in batches of 500 (Firestore's maximum batch size) to:
- Minimize memory usage
- Optimize network efficiency
- Reduce the risk of timeouts

### Subcollections

The script recursively copies all subcollections, which can significantly increase:
- Total document count
- Execution time
- Network usage

## Data Preservation

The script preserves all Firestore data types:

- **Primitives**: strings, numbers, booleans, null
- **Timestamps**: Firestore Timestamp objects
- **GeoPoints**: Firestore GeoPoint objects
- **References**: DocumentReference objects
- **Arrays**: Including nested arrays
- **Maps**: Nested object structures
- **Binary**: Bytes data

Document IDs are preserved exactly as they appear in the source database.

## Security Best Practices

### Service Account Key Management

1. **Never commit production keys to version control**
   - Add `service-account-key-prod-live.json` to `.gitignore`
   - Store production keys securely (password manager, secure vault)

2. **Use read-only permissions for production**
   - Production service account should have minimal permissions
   - Only read access is required for this script

3. **Rotate keys regularly**
   - Generate new service account keys periodically
   - Revoke old keys after rotation

4. **Limit access**
   - Only authorized team members should have production keys
   - Track who has access to production credentials

### Data Sensitivity

Be aware that after running this script:
- Dev/staging environments contain production data
- This may include sensitive user information
- Apply appropriate access controls to dev/staging
- Consider data anonymization for development use

## Troubleshooting

### Script Hangs or Freezes

If the script appears to hang:
1. Check your network connection
2. Verify Firestore is accessible (check Firebase status page)
3. Try running with a smaller dataset first (if possible)
4. Check for rate limiting or quota issues

### Incomplete Data Copy

If data appears incomplete:
1. Check the summary output for failed collections
2. Review error messages for specific failures
3. Verify service account permissions
4. Re-run the script (it will overwrite existing data)

### Exit Codes

- **Exit code 0**: Success - all collections copied successfully
- **Exit code 1**: Failure - one or more collections failed or fatal error occurred

Use exit codes in CI/CD pipelines or automation scripts to detect failures.

## Advanced Usage

### Running in CI/CD

```bash
# Example GitHub Actions workflow
- name: Populate staging database
  run: pnpm tsx scripts/populate-dev-db.ts --target=staging
  env:
    GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.PROD_SERVICE_ACCOUNT }}
```

### Scheduling Regular Updates

```bash
# Example cron job (daily at 2 AM)
0 2 * * * cd /path/to/project && pnpm tsx scripts/populate-dev-db.ts --target=dev
```

### Logging Output

```bash
# Save output to log file
pnpm tsx scripts/populate-dev-db.ts --target=dev 2>&1 | tee db-population.log
```

## Support

If you encounter issues not covered in this guide:

1. Check the error message carefully
2. Review the "Common Errors and Solutions" section
3. Verify all prerequisites are met
4. Contact the development team for assistance

## Related Documentation

- [Production Protection Rules](./PRODUCTION_SAFEGUARDS.md)
- [Firebase Setup Guide](./firebase-setup.md)
- [Service Accounts Documentation](./service-accounts.md)
