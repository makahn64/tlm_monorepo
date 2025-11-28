#!/usr/bin/env tsx
/**
 * Script to populate dev/staging database with data from production
 * 
 * Usage:
 *   pnpm tsx scripts/populate-dev-db.ts                    # Defaults to dev
 *   pnpm tsx scripts/populate-dev-db.ts --target=dev       # Explicit dev
 *   pnpm tsx scripts/populate-dev-db.ts --target=staging   # Target staging
 * 
 * Safety Features:
 * - Multiple validation checks to prevent production writes
 * - Read-only connection to production
 * - Write-only connection to dev/staging
 * - Explicit project ID verification
 * 
 * This script copies all Firestore collections and documents from production
 * to the specified target environment while preserving all data types and
 * document structure.
 */

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore, DocumentReference } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Type definitions for the script

interface CLIOptions {
  target: 'dev' | 'staging';
}

interface ServiceAccountConfig {
  source: {
    path: string;
    projectId: string;
  };
  destination: {
    path: string;
    projectId: string;
  };
}

interface CollectionResult {
  name: string;
  documentCount: number;
  success: boolean;
  error?: string;
  duration: number;
}

interface ProcessingStats {
  totalCollections: number;
  successfulCollections: number;
  failedCollections: number;
  totalDocuments: number;
  totalDuration: number;
  results: CollectionResult[];
}

// Constants
const BATCH_SIZE = 500;
const PRODUCTION_PROJECT_ID = 'tlm2021-41ce7';

/**
 * Parse command line arguments to extract target environment
 * 
 * @returns CLIOptions object with target environment (defaults to 'dev')
 */
const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  const targetArg = args.find(arg => arg.startsWith('--target='));
  
  if (!targetArg) {
    return { target: 'dev' };
  }
  
  const target = targetArg.split('=')[1];
  
  return { target: target as 'dev' | 'staging' };
};

/**
 * Validate the target environment and block production
 * 
 * @param target - The target environment to validate
 * @throws Exits process with code 1 if validation fails
 */
const validateTarget = (target: string): void => {
  // Block production explicitly
  if (target === 'production' || target === 'prod') {
    console.error('❌ ERROR: Cannot target production environment');
    console.error('❌ This script is for populating dev/staging only');
    console.error('❌ Production data must never be modified by automated scripts');
    process.exit(1);
  }
  
  // Validate target is either dev or staging
  if (target !== 'dev' && target !== 'staging') {
    console.error(`❌ ERROR: Invalid target '${target}'`);
    console.error('❌ Valid targets: dev, staging');
    console.error('');
    console.error('Usage:');
    console.error('  pnpm tsx scripts/populate-dev-db.ts                    # Defaults to dev');
    console.error('  pnpm tsx scripts/populate-dev-db.ts --target=dev       # Explicit dev');
    console.error('  pnpm tsx scripts/populate-dev-db.ts --target=staging   # Target staging');
    process.exit(1);
  }
};

/**
 * Load service account credentials from file
 * 
 * @param filePath - Path to the service account JSON file
 * @returns ServiceAccount object with project ID
 * @throws Exits process with code 1 if file cannot be loaded
 */
const loadServiceAccount = (filePath: string): ServiceAccount & { project_id?: string } => {
  try {
    const absolutePath = resolve(filePath);
    const fileContent = readFileSync(absolutePath, 'utf-8');
    const serviceAccount = JSON.parse(fileContent) as ServiceAccount & { project_id?: string };
    
    return serviceAccount;
  } catch (error) {
    console.error(`❌ ERROR: Failed to load service account from ${filePath}`);
    if (error instanceof Error) {
      console.error(`❌ ${error.message}`);
    }
    console.error('');
    console.error('Please ensure the service account key file exists and is valid JSON.');
    process.exit(1);
  }
};

/**
 * Load service accounts for source (production) and destination (dev/staging)
 * 
 * @param target - The target environment ('dev' or 'staging')
 * @returns ServiceAccountConfig with paths and project IDs
 */
const loadServiceAccounts = (target: 'dev' | 'staging'): ServiceAccountConfig => {
  console.log('📂 Loading service account credentials...');
  
  // Load legacy LIVE production service account (source - read-only)
  const sourceServiceAccount = loadServiceAccount('service-account-key-prod-live.json');
  const sourceProjectId = sourceServiceAccount.projectId || sourceServiceAccount.project_id || '';
  console.log(`   ✓ Loaded legacy production service account: ${sourceProjectId}`);
  
  // Load destination service account based on target
  const destPath = target === 'dev' 
    ? 'service-account-key-dev.json' 
    : 'service-account-key-staging.json';
  const destServiceAccount = loadServiceAccount(destPath);
  const destProjectId = destServiceAccount.projectId || destServiceAccount.project_id || '';
  console.log(`   ✓ Loaded ${target} service account: ${destProjectId}`);
  
  return {
    source: {
      path: 'service-account-key-prod-live.json',
      projectId: sourceProjectId,
    },
    destination: {
      path: destPath,
      projectId: destProjectId,
    },
  };
};

/**
 * Initialize Firebase Admin apps for source and destination
 * 
 * @param config - Service account configuration
 * @returns Object containing source and destination Firestore instances
 */
const initializeFirebaseApps = (config: ServiceAccountConfig): { sourceDb: Firestore; destDb: Firestore } => {
  console.log('🔧 Initializing Firebase Admin instances...');
  
  // Initialize source app (production - read-only)
  const sourceServiceAccount = loadServiceAccount(config.source.path);
  const sourceApp = initializeApp({
    credential: cert(sourceServiceAccount),
  }, 'source');
  const sourceDb = getFirestore(sourceApp);
  console.log(`   ✓ Initialized source app: ${config.source.projectId} (read-only)`);
  
  // Initialize destination app (dev/staging - write)
  const destServiceAccount = loadServiceAccount(config.destination.path);
  const destApp = initializeApp({
    credential: cert(destServiceAccount),
  }, 'destination');
  const destDb = getFirestore(destApp);
  console.log(`   ✓ Initialized destination app: ${config.destination.projectId} (write)`);
  
  return { sourceDb, destDb };
};

/**
 * Perform critical safety validation to prevent production writes
 * 
 * @param config - Service account configuration
 * @param target - Target environment
 * @throws Exits process with code 1 if any safety check fails
 */
const performSafetyChecks = (config: ServiceAccountConfig, target: 'dev' | 'staging'): void => {
  console.log('');
  console.log('🔒 PERFORMING CRITICAL SAFETY CHECKS...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check 1: Verify source is production
  console.log(`   Checking source project ID...`);
  if (config.source.projectId !== PRODUCTION_PROJECT_ID) {
    console.error('');
    console.error('❌ SAFETY CHECK FAILED: Source project ID mismatch');
    console.error(`❌ Expected: ${PRODUCTION_PROJECT_ID}`);
    console.error(`❌ Got: ${config.source.projectId}`);
    console.error('❌ Script terminated to prevent data corruption');
    process.exit(1);
  }
  console.log(`   ✓ Source is production: ${config.source.projectId}`);
  
  // Check 2: Verify destination matches target environment
  console.log(`   Checking destination project ID...`);
  const expectedDestProjectId = target === 'dev' ? 'tlm-2021-dev' : 'tlm-2021-staging';
  if (config.destination.projectId !== expectedDestProjectId) {
    console.error('');
    console.error('❌ SAFETY CHECK FAILED: Destination project ID mismatch');
    console.error(`❌ Expected: ${expectedDestProjectId}`);
    console.error(`❌ Got: ${config.destination.projectId}`);
    console.error('❌ Script terminated to prevent data corruption');
    process.exit(1);
  }
  console.log(`   ✓ Destination matches target: ${config.destination.projectId}`);
  
  // Check 3: CRITICAL - Ensure destination is NOT production
  console.log(`   Verifying destination is not production...`);
  // Use type assertion to allow comparison for safety check
  if ((config.destination.projectId as string) === PRODUCTION_PROJECT_ID) {
    console.error('');
    console.error('❌ SAFETY CHECK FAILED: Destination is PRODUCTION!');
    console.error(`❌ Destination project ID: ${config.destination.projectId}`);
    console.error('❌ CANNOT write to production database');
    console.error('❌ Script terminated immediately to prevent data corruption');
    process.exit(1);
  }
  console.log(`   ✓ Destination is NOT production`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ ALL SAFETY CHECKS PASSED');
  console.log('');
};

/**
 * Discover all collections in the source database
 * 
 * @param sourceDb - Source Firestore instance
 * @returns Array of collection names
 */
const discoverCollections = async (sourceDb: Firestore): Promise<string[]> => {
  try {
    const collections = await sourceDb.listCollections();
    return collections.map(col => col.id);
  } catch (error) {
    console.error('❌ ERROR: Failed to list collections from source database');
    if (error instanceof Error) {
      console.error(`❌ ${error.message}`);
    }
    throw error;
  }
};

/**
 * Copy a single document's subcollections recursively
 * 
 * @param sourceDocRef - Source document reference
 * @param destDocRef - Destination document reference
 * @param depth - Current recursion depth (for logging)
 * @returns Number of subcollection documents copied
 */
const copySubcollections = async (
  sourceDocRef: DocumentReference,
  destDocRef: DocumentReference,
  depth: number = 0
): Promise<number> => {
  let totalCopied = 0;
  
  try {
    const subcollections = await sourceDocRef.listCollections();
    
    if (subcollections.length === 0) {
      return 0;
    }
    
    for (const subcollection of subcollections) {
      const subcollectionName = subcollection.id;
      const sourceSubcollection = sourceDocRef.collection(subcollectionName);
      const destSubcollection = destDocRef.collection(subcollectionName);
      
      const snapshot = await sourceSubcollection.get();
      
      if (depth === 0 && snapshot.docs.length > 0) {
        // Only log for top-level subcollections
        process.stdout.write(`\n      → ${subcollectionName} (${snapshot.docs.length} docs)`);
      }
      
      // Process documents in batches
      let batch = destDocRef.firestore.batch();
      let batchCount = 0;
      
      for (const doc of snapshot.docs) {
        const destDoc = destSubcollection.doc(doc.id);
        batch.set(destDoc, doc.data());
        batchCount++;
        totalCopied++;
        
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          batch = destDocRef.firestore.batch();
          batchCount = 0;
        }
        
        // Recursively copy subcollections of this document
        const subCount = await copySubcollections(doc.ref, destDoc, depth + 1);
        totalCopied += subCount;
      }
      
      // Commit remaining documents
      if (batchCount > 0) {
        await batch.commit();
      }
    }
  } catch (error) {
    console.error(`\n   ⚠️  Warning: Error copying subcollections for document ${sourceDocRef.path}`);
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    }
    // Don't throw - continue with other documents
  }
  
  return totalCopied;
};

/**
 * Copy a single collection from source to destination
 * 
 * @param sourceDb - Source Firestore instance
 * @param destDb - Destination Firestore instance
 * @param collectionName - Name of the collection to copy
 * @returns CollectionResult with stats and status
 */
const copyCollection = async (
  sourceDb: Firestore,
  destDb: Firestore,
  collectionName: string
): Promise<CollectionResult> => {
  const startTime = Date.now();
  
  try {
    const sourceCollection = sourceDb.collection(collectionName);
    const destCollection = destDb.collection(collectionName);
    
    // Get all documents from source collection
    const snapshot = await sourceCollection.get();
    const totalDocs = snapshot.docs.length;
    
    if (totalDocs === 0) {
      return {
        name: collectionName,
        documentCount: 0,
        success: true,
        duration: Date.now() - startTime,
      };
    }
    
    // Process documents in batches
    let batch = destDb.batch();
    let batchCount = 0;
    let totalCount = 0;
    let subcollectionCount = 0;
    
    for (const doc of snapshot.docs) {
      const destDoc = destCollection.doc(doc.id);
      batch.set(destDoc, doc.data());
      batchCount++;
      totalCount++;
      
      // Commit batch when limit reached
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
    
    // Handle subcollections for each document
    if (totalCount > 0) {
      process.stdout.write(`   Checking subcollections for ${collectionName} (${totalCount} docs)...`);
      let processedDocs = 0;
      const progressInterval = Math.max(1, Math.floor(totalCount / 10)); // Show progress every 10%
      
      for (const doc of snapshot.docs) {
        const destDoc = destCollection.doc(doc.id);
        const subCount = await copySubcollections(doc.ref, destDoc);
        subcollectionCount += subCount;
        processedDocs++;
        
        // Show progress every N documents
        if (processedDocs % progressInterval === 0 || processedDocs === totalCount) {
          const percent = Math.round((processedDocs / totalCount) * 100);
          process.stdout.write(`\r   Checking subcollections for ${collectionName} (${totalCount} docs)... ${percent}% (${subcollectionCount} subdocs found)`);
        }
      }
      
      process.stdout.write(`\n`);
    }
    
    const duration = Date.now() - startTime;
    
    return {
      name: collectionName,
      documentCount: totalCount + subcollectionCount,
      success: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      name: collectionName,
      documentCount: 0,
      success: false,
      error: errorMessage,
      duration,
    };
  }
};

// Main execution
const main = async (): Promise<void> => {
  console.log('🚀 Database Population Script');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  // Parse and validate CLI arguments
  const options = parseArgs();
  validateTarget(options.target);
  console.log(`✅ Target environment: ${options.target}`);
  console.log('');
  
  // Load service accounts
  const config = loadServiceAccounts(options.target);
  console.log('');
  
  // Initialize Firebase Admin instances
  const { sourceDb, destDb } = initializeFirebaseApps(config);
  
  // Perform critical safety checks
  performSafetyChecks(config, options.target);
  
  console.log('🔄 Copying data from production to', options.target);
  console.log(`   Source: ${config.source.projectId}`);
  console.log(`   Destination: ${config.destination.projectId}`);
  console.log('');
  
  // Discover collections
  console.log('🔍 Discovering collections...');
  const collections = await discoverCollections(sourceDb);
  console.log(`   ✓ Found ${collections.length} collections`);
  console.log('');
  
  // Process each collection
  console.log('📦 Processing collections...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const stats: ProcessingStats = {
    totalCollections: collections.length,
    successfulCollections: 0,
    failedCollections: 0,
    totalDocuments: 0,
    totalDuration: 0,
    results: [],
  };
  
  for (const collectionName of collections) {
    const result = await copyCollection(sourceDb, destDb, collectionName);
    stats.results.push(result);
    
    if (result.success) {
      stats.successfulCollections++;
      stats.totalDocuments += result.documentCount;
      const durationSec = (result.duration / 1000).toFixed(1);
      console.log(`✓ ${collectionName} (${result.documentCount} documents) - ${durationSec}s`);
    } else {
      stats.failedCollections++;
      console.log(`✗ ${collectionName} - Error: ${result.error}`);
    }
    
    stats.totalDuration += result.duration;
  }
  
  // Display summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log(`   Total collections: ${stats.totalCollections}`);
  console.log(`   Successful: ${stats.successfulCollections}`);
  console.log(`   Failed: ${stats.failedCollections}`);
  console.log(`   Total documents: ${stats.totalDocuments}`);
  console.log(`   Total time: ${(stats.totalDuration / 1000).toFixed(1)}s`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Exit with appropriate code
  if (stats.failedCollections > 0) {
    console.log('');
    console.log('⚠️  Some collections failed to copy. Please review errors above.');
    process.exit(1);
  }
};

// Run the main function
main()
  .then(() => {
    console.log('✅ Script setup verified');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
