#!/usr/bin/env tsx
/**
 * Seed script to create test users in Firebase Auth and Firestore
 * 
 * Usage:
 *   pnpm tsx scripts/seed-users.ts
 * 
 * This will create test accounts with different roles for development/testing
 */

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load service account key - ALWAYS use dev for seeding
const serviceAccountPath = resolve(__dirname, '../service-account-key-dev.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8')) as ServiceAccount;

// Safety check - ensure we're not touching production
if (serviceAccount.project_id === 'tlm2021-41ce7') {
  console.error('❌ ERROR: This script is trying to use the PRODUCTION service account!');
  console.error('❌ This is not allowed. Please use service-account-key-dev.json');
  process.exit(1);
}

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);
const db = getFirestore(app);

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  clients?: string[];
}

const testUsers: TestUser[] = [
  {
    email: 'admin@test.com',
    password: 'Test123!',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin', 'trainer', 'editor'],
    clients: [],
  },
  {
    email: 'trainer@test.com',
    password: 'Test123!',
    firstName: 'Trainer',
    lastName: 'Smith',
    roles: ['trainer'],
    clients: [],
  },
  {
    email: 'editor@test.com',
    password: 'Test123!',
    firstName: 'Editor',
    lastName: 'Jones',
    roles: ['editor'],
    clients: [],
  },
  {
    email: 'trainer2@test.com',
    password: 'Test123!',
    firstName: 'Sarah',
    lastName: 'Johnson',
    roles: ['trainer'],
    clients: [],
  },
];

const seedUsers = async () => {
  console.log('🌱 Starting user seeding process...\n');

  for (const testUser of testUsers) {
    try {
      console.log(`Creating user: ${testUser.email}`);

      // Check if user already exists
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(testUser.email);
        console.log(`  ✓ User already exists in Auth (${userRecord.uid})`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create user in Firebase Auth
          userRecord = await auth.createUser({
            email: testUser.email,
            password: testUser.password,
            emailVerified: true,
            displayName: `${testUser.firstName} ${testUser.lastName}`,
          });
          console.log(`  ✓ Created in Firebase Auth (${userRecord.uid})`);
        } else {
          throw error;
        }
      }

      // Create or update user document in Firestore
      const userDoc = {
        uid: userRecord.uid,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        roles: testUser.roles,
        clients: testUser.clients || [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await db.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });
      console.log(`  ✓ Created/updated in Firestore`);
      console.log(`  → Roles: ${testUser.roles.join(', ')}`);
      console.log('');
    } catch (error) {
      console.error(`  ✗ Error creating user ${testUser.email}:`, error);
      console.log('');
    }
  }

  console.log('✅ User seeding complete!\n');
  console.log('Test accounts created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testUsers.forEach(user => {
    console.log(`📧 ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Roles: ${user.roles.join(', ')}`);
    console.log('');
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 You can now log in with any of these accounts at http://localhost:5173/login\n');
};

// Run the seed function
seedUsers()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
