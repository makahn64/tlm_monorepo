// Quick script to export sample documents from Firestore
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize with service account
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const exportSamples = async () => {
  const collections = [
    'clientMetadata',
    'clients',
    'exercises',
    'journeys',
    'leads',
    'media',
    'onDemandWorkouts',
    'prebuiltWorkouts',
    'upstreamMessages',
    'users'
  ];

  const samples = {};

  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).limit(2).get();
      samples[collectionName] = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamps to ISO strings for JSON
        const converted = JSON.parse(JSON.stringify(data, (key, value) => {
          if (value && value._seconds !== undefined) {
            return new Date(value._seconds * 1000).toISOString();
          }
          return value;
        }));
        return {
          id: doc.id,
          ...converted
        };
      });
      console.log(`✓ Exported ${samples[collectionName].length} sample(s) from ${collectionName}`);
    } catch (error) {
      console.log(`✗ Error exporting ${collectionName}:`, error.message);
      samples[collectionName] = [];
    }
  }

  fs.writeFileSync('firestore-export-samples.json', JSON.stringify(samples, null, 2));
  console.log('\n✓ Exported to firestore-export-samples.json');
  process.exit(0);
};

exportSamples();
