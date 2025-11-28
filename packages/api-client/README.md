# @lotus/api-client

Firebase API client package for The Lotus Method platform. Provides a clean abstraction layer over Firebase services (Auth, Firestore, Storage).

## Overview

This package provides typed API functions for interacting with Firebase services. It abstracts away Firebase SDK details and provides a consistent interface for all data operations.

## Installation

This is a workspace package. Install dependencies from the root:

```bash
pnpm install
```

## Usage

### Authentication

```typescript
import { signInWithEmail, signInWithGoogle, signOut } from '@lotus/api-client';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

// Email/password sign in
await signInWithEmail(auth, 'user@example.com', 'password123');

// Google sign in
await signInWithGoogle(auth);

// Sign out
await signOut(auth);
```

### Users

```typescript
import { getAllUsers, getUserById, createUser, updateUser } from '@lotus/api-client';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

// Get all users
const users = await getAllUsers(db);

// Get user by ID
const user = await getUserById(db, 'user-id');

// Create user
const newUser = await createUser(db, {
  email: 'trainer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['trainer'],
  clients: [],
});

// Update user
await updateUser(db, 'user-id', {
  firstName: 'Jane',
});
```

### Clients

```typescript
import { 
  getAllClients, 
  getClientsByTrainer, 
  createClient,
  updateClient 
} from '@lotus/api-client';

// Get all clients
const clients = await getAllClients(db);

// Get clients for a specific trainer
const trainerClients = await getClientsByTrainer(db, 'trainer-id');

// Create client
const newClient = await createClient(db, {
  email: 'client@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  clientType: 'active',
  trainerIds: ['trainer-id'],
  fitnessLevel: 'intermediate',
  isPregnant: false,
  backPain: 'none',
  sciatica: 'none',
  injuries: [],
  postureConditions: [],
  equipment: ['mat', 'resistance-band'],
  themeMode: 'auto',
  accountActive: true,
  markedForDeletion: false,
  schemaVersion: 1,
});
```

### Exercises

```typescript
import { 
  getAllExercises, 
  getPublishedExercises,
  createExercise,
  archiveExercise 
} from '@lotus/api-client';

// Get all exercises
const exercises = await getAllExercises(db);

// Get published exercises only
const published = await getPublishedExercises(db);

// Create exercise
const newExercise = await createExercise(db, {
  title: 'Squat',
  name: 'squat',
  description: 'Basic squat exercise',
  movementPattern: 'squat',
  intensity: 5,
  duration: 60,
  stress: ['legs'],
  releases: ['hip-flexors'],
  activates: ['glutes', 'quads'],
  equipment: [],
  optionalEquipment: [],
  cues: ['Keep chest up', 'Push through heels'],
  prenatalVideo: {},
  postnatalVideo: {},
  instructionVideo: {},
  prenatalThumb: {},
  postnatalThumb: {},
  instructionThumb: {},
  published: true,
  archived: false,
  preComposited: false,
  metadata: null,
});

// Archive exercise
await archiveExercise(db, 'exercise-id');
```

### Workouts

```typescript
import { 
  createWorkoutForClient,
  getWorkoutsForClient,
  updateClientWorkout 
} from '@lotus/api-client';

// Create workout for client
const workout = await createWorkoutForClient(db, 'client-id', {
  name: 'Morning Routine',
  workoutType: 'normal',
  exercises: [exercise1, exercise2, exercise3],
  createdBy: 'trainer-id',
  duration: 1800000, // 30 minutes in milliseconds
  generatedBy: 'trainer',
});

// Get client's workouts
const workouts = await getWorkoutsForClient(db, 'client-id');

// Update workout
await updateClientWorkout(db, 'client-id', 'workout-id', {
  name: 'Updated Morning Routine',
});
```

### Prebuilt Workouts

```typescript
import { 
  createPrebuiltWorkout,
  getAccessiblePrebuiltWorkouts,
  copyPrebuiltWorkoutToClient 
} from '@lotus/api-client';

// Create prebuilt workout
const prebuilt = await createPrebuiltWorkout(db, {
  name: 'Beginner Full Body',
  workoutType: 'normal',
  exercises: [exercise1, exercise2],
  authorId: 'trainer-id',
  visibility: 'shared',
  duration: 1200000,
  generatedBy: 'trainer',
});

// Get accessible prebuilt workouts
const templates = await getAccessiblePrebuiltWorkouts(db, 'user-id');

// Copy prebuilt to client
const workoutId = await copyPrebuiltWorkoutToClient(
  db,
  'prebuilt-id',
  'client-id',
  'trainer-id'
);
```

### Media

```typescript
import { 
  uploadMedia,
  getAllMedia,
  getMediaByType,
  deleteMedia 
} from '@lotus/api-client';
import { getStorage } from 'firebase/storage';

const storage = getStorage();

// Upload media file
const media = await uploadMedia(
  db,
  storage,
  file, // File object from input
  'uploader-id',
  'videos', // folder
  (progress) => console.log(`Upload: ${progress}%`)
);

// Get all media
const allMedia = await getAllMedia(db);

// Get videos only
const videos = await getMediaByType(db, 'video');

// Delete media
await deleteMedia(db, storage, 'media-id', true);
```

## Error Handling

All API functions throw typed errors:

```typescript
import { 
  AuthenticationError,
  PermissionError,
  ValidationError,
  NotFoundError 
} from '@lotus/api-client';

try {
  await signInWithEmail(auth, email, password);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
  } else if (error instanceof ValidationError) {
    // Handle validation error
  }
}
```

## Architecture

This package follows these principles:

1. **Abstraction**: Hides Firebase SDK details from consuming code
2. **Type Safety**: All functions are fully typed with TypeScript
3. **Error Handling**: Converts Firebase errors to domain-specific errors
4. **Consistency**: Provides uniform CRUD operations across all resources
5. **Flexibility**: Supports both simple and complex queries

## Development

### Type Check

```bash
pnpm --filter @lotus/api-client type-check
```

### Build

```bash
pnpm --filter @lotus/api-client build
```

## Dependencies

- `firebase` - Firebase SDK
- `@lotus/shared-types` - Shared TypeScript types

## License

Private - The Lotus Method
