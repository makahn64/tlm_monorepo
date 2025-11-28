# Design Document

## Overview

This script provides a safe, automated way to copy all Firestore data from the LIVE production database (`tlm2021-41ce7`) to either the dev (`tlm-2021-dev`) or staging (`tlm-2021-staging`) environment. The design prioritizes safety through multiple validation layers and clear progress reporting.

The script will be implemented as a TypeScript file using Firebase Admin SDK, following the patterns established in the existing `seed-users.ts` script.

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Parse CLI Arguments & Validate Target Environment       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Initialize Source (Production) - Read-Only Connection   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Initialize Destination (Dev/Staging) - Write Connection │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Safety Validation - Verify Project IDs                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Discover All Collections in Source                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. For Each Collection:                                    │
│    a. Read all documents from source                       │
│    b. Write documents to destination in batches            │
│    c. Report progress                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Display Summary Report                                  │
└─────────────────────────────────────────────────────────────┘
```

### Multi-App Firebase Admin Pattern

The script will initialize two separate Firebase Admin app instances:
- **Source App**: Connected to production (read-only credentials)
- **Destination App**: Connected to dev or staging (write credentials)

This ensures complete isolation between the two environments and prevents any accidental cross-contamination.

## Components and Interfaces

### CLI Interface

```typescript
interface CLIOptions {
  target: 'dev' | 'staging';
}
```

The script will accept a single optional parameter:
- `--target=dev` (default)
- `--target=staging`

Usage examples:
```bash
pnpm tsx scripts/populate-dev-db.ts
pnpm tsx scripts/populate-dev-db.ts --target=staging
```

### Service Account Configuration

```typescript
interface ServiceAccountConfig {
  source: {
    path: string;  // Path to production service account key
    projectId: string;  // Expected: 'tlm2021-41ce7'
  };
  destination: {
    path: string;  // Path to dev or staging service account key
    projectId: string;  // Expected: 'tlm-2021-dev' or 'tlm-2021-staging'
  };
}
```

### Collection Processing

```typescript
interface CollectionResult {
  name: string;
  documentCount: number;
  success: boolean;
  error?: string;
  duration: number;  // milliseconds
}

interface ProcessingStats {
  totalCollections: number;
  successfulCollections: number;
  failedCollections: number;
  totalDocuments: number;
  totalDuration: number;
  results: CollectionResult[];
}
```

## Data Models

### Firestore Data Types

The script must handle all Firestore data types correctly:

1. **Primitives**: string, number, boolean, null
2. **Timestamp**: Firestore Timestamp objects
3. **GeoPoint**: Firestore GeoPoint objects
4. **DocumentReference**: References to other documents
5. **Arrays**: Including nested arrays
6. **Maps**: Nested object structures
7. **Bytes**: Binary data

### Document Structure

Each document will be copied with:
- Document ID (preserved from source)
- All field data (with proper type preservation)
- Subcollections (handled recursively)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Complete data replication
*For any* source database state, after the script completes successfully, the destination database should contain all collections and documents from the source with identical data.
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Firestore type preservation
*For any* document containing Firestore-specific data types (Timestamp, GeoPoint, DocumentReference), copying that document should preserve the exact type and value of each field.
**Validates: Requirements 1.5**

### Property 3: Error resilience
*For any* collection that fails to copy (due to read or write errors), the script should continue processing remaining collections and report the failure in the final summary.
**Validates: Requirements 3.4, 5.1, 5.2**

### Property 4: Progress reporting completeness
*For any* collection being processed, the script output should include the collection name, document count, and timing information.
**Validates: Requirements 3.2, 3.3**

### Property 5: Non-zero exit on error
*For any* execution where one or more collections fail to copy, the script should exit with a non-zero exit code.
**Validates: Requirements 5.5**

### Property 6: Fatal error immediate exit
*For any* fatal error during initialization (invalid credentials, network failure, safety check failure), the script should exit immediately with a clear error message and non-zero exit code.
**Validates: Requirements 5.4**

## Error Handling

### Safety Check Failures

The script will perform multiple safety checks at initialization. Any failure will result in immediate termination:

1. **Production Write Protection**: If destination project ID is `tlm2021-41ce7`, exit with error
2. **Invalid Target**: If target parameter is not 'dev' or 'staging', exit with error
3. **Source Validation**: If source project ID is not `tlm2021-41ce7`, exit with error
4. **Destination Validation**: If destination project ID doesn't match target, exit with error

Error message format:
```
❌ SAFETY CHECK FAILED: [specific issue]
❌ Script terminated to prevent data corruption
```

### Collection-Level Errors

If a collection fails to copy, the script will:
1. Log the error with collection name and error message
2. Continue processing remaining collections
3. Include the failure in the final summary

Error message format:
```
✗ Error copying collection 'collectionName': [error message]
```

### Network and Permission Errors

Common errors and handling:
- **Network timeout**: Retry with exponential backoff (3 attempts)
- **Permission denied**: Log error and skip collection
- **Quota exceeded**: Log error and terminate (cannot continue)
- **Invalid credentials**: Fatal error, terminate immediately

## Testing Strategy

### Unit Testing

Unit tests will cover:
1. **CLI argument parsing**: Verify correct handling of --target parameter
2. **Safety validation logic**: Test all safety check scenarios
3. **Project ID validation**: Test valid and invalid project IDs
4. **Error message formatting**: Verify error messages are clear and actionable
5. **Summary report generation**: Test summary with various success/failure combinations

### Property-Based Testing

We will use **fast-check** (JavaScript/TypeScript property-based testing library) for property-based tests. Each test will run a minimum of 100 iterations.

Property-based tests will cover:

1. **Property 1: Complete data replication**
   - Generate random Firestore database states
   - Run copy operation
   - Verify destination matches source
   - **Feature: dev-db-population, Property 1: Complete data replication**

2. **Property 2: Firestore type preservation**
   - Generate documents with various Firestore types
   - Copy documents
   - Verify types are preserved exactly
   - **Feature: dev-db-population, Property 2: Firestore type preservation**

3. **Property 3: Error resilience**
   - Generate random collection lists with simulated failures
   - Verify script continues after errors
   - Verify all non-failing collections are processed
   - **Feature: dev-db-population, Property 3: Error resilience**

4. **Property 4: Progress reporting completeness**
   - Generate random collection sets
   - Capture output
   - Verify all required information is present
   - **Feature: dev-db-population, Property 4: Progress reporting completeness**

5. **Property 5: Non-zero exit on error**
   - Generate scenarios with various error conditions
   - Verify exit code is non-zero when errors occur
   - **Feature: dev-db-population, Property 5: Non-zero exit on error**

6. **Property 6: Fatal error immediate exit**
   - Generate various fatal error conditions
   - Verify immediate termination
   - Verify clear error message
   - **Feature: dev-db-population, Property 6: Fatal error immediate exit**

### Integration Testing

Integration tests will use Firebase Emulator Suite:
1. Set up emulator with test data
2. Run script against emulator
3. Verify data copied correctly
4. Test with various data sizes and structures

### Manual Testing

Before using with production:
1. Test with Firebase Emulator Suite
2. Test copying from staging to dev
3. Verify all collections and document counts
4. Verify data types are preserved
5. Test error scenarios (network interruption, permission issues)

## Implementation Details

### Batch Writing

To handle large collections efficiently:
- Read documents in batches of 500 (Firestore limit)
- Write documents in batches of 500 (Firestore limit)
- Commit each batch before proceeding to next

```typescript
const BATCH_SIZE = 500;

const copyCollection = async (
  sourceDb: Firestore,
  destDb: Firestore,
  collectionName: string
): Promise<CollectionResult> => {
  const sourceCollection = sourceDb.collection(collectionName);
  const destCollection = destDb.collection(collectionName);
  
  let batch = destDb.batch();
  let batchCount = 0;
  let totalCount = 0;
  
  const snapshot = await sourceCollection.get();
  
  for (const doc of snapshot.docs) {
    const destDoc = destCollection.doc(doc.id);
    batch.set(destDoc, doc.data());
    batchCount++;
    totalCount++;
    
    if (batchCount >= BATCH_SIZE) {
      await batch.commit();
      batch = destDb.batch();
      batchCount = 0;
    }
  }
  
  // Commit remaining documents
  if (batchCount > 0) {
    await batch.commit();
  }
  
  return {
    name: collectionName,
    documentCount: totalCount,
    success: true,
    duration: 0 // calculated by caller
  };
};
```

### Subcollection Handling

The script will handle subcollections recursively:
1. For each document, check for subcollections
2. Recursively copy subcollections
3. Maintain document path structure

### Progress Reporting

Progress will be reported in real-time:
```
🔄 Copying from tlm2021-41ce7 to tlm-2021-dev
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ clients (1,234 documents) - 2.3s
✓ exercises (567 documents) - 1.1s
✗ media (error: permission denied)
✓ users (89 documents) - 0.5s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary:
  Total collections: 10
  Successful: 9
  Failed: 1
  Total documents: 1,890
  Total time: 12.4s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Service Account Key Management

The script will require two service account keys:
1. **Production (source)**: Must be obtained manually and stored securely
   - Not committed to repository
   - Read-only permissions preferred
   - Path: `service-account-key-prod.json` (or similar)

2. **Dev/Staging (destination)**: Already in repository
   - Path: `service-account-key-dev.json` or `service-account-key-staging.json`
   - Write permissions required

### Command Line Interface

The script will use a simple argument parser:
```typescript
const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  const targetArg = args.find(arg => arg.startsWith('--target='));
  
  if (!targetArg) {
    return { target: 'dev' };
  }
  
  const target = targetArg.split('=')[1];
  
  if (target === 'production' || target === 'prod') {
    console.error('❌ ERROR: Cannot target production environment');
    console.error('❌ This script is for populating dev/staging only');
    process.exit(1);
  }
  
  if (target !== 'dev' && target !== 'staging') {
    console.error(`❌ ERROR: Invalid target '${target}'`);
    console.error('❌ Valid targets: dev, staging');
    process.exit(1);
  }
  
  return { target: target as 'dev' | 'staging' };
};
```

## Security Considerations

1. **Service Account Keys**: Production key should never be committed to repository
2. **Read-Only Access**: Production service account should have minimal permissions
3. **Audit Logging**: All operations should be logged for audit trail
4. **Network Security**: Use secure connections (HTTPS) for all Firebase operations
5. **Data Sensitivity**: Be aware that dev/staging will contain production data

## Performance Considerations

1. **Batch Size**: 500 documents per batch (Firestore limit)
2. **Parallel Processing**: Process collections sequentially to avoid rate limits
3. **Memory Usage**: Stream documents rather than loading all into memory
4. **Network Efficiency**: Use batch operations to minimize round trips
5. **Estimated Time**: ~1-2 minutes per 10,000 documents (varies by network)

## Future Enhancements

Potential improvements for future versions:
1. **Incremental Sync**: Only copy documents that have changed since last sync
2. **Selective Collections**: Allow specifying which collections to copy
3. **Data Transformation**: Apply transformations during copy (e.g., anonymize PII)
4. **Parallel Collection Processing**: Copy multiple collections simultaneously
5. **Resume Capability**: Resume from last successful collection if interrupted
6. **Dry Run Mode**: Preview what would be copied without actually copying
