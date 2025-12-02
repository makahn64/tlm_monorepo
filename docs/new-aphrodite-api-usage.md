# New Aphrodite API Usage Analysis

## Summary

The new Aphrodite application **does NOT call any Cloud Functions endpoints**. Instead, it uses **direct Firestore access** through the Firebase SDK.

## Architecture Difference

### Legacy Aphrodite
- Calls Cloud Functions REST API endpoints
- Uses JWT authentication with custom middleware
- Server-side business logic in Cloud Functions
- Example: `POST /team`, `POST /client`, `POST /workout`

### New Aphrodite
- Direct Firestore database access
- Uses Firebase Auth SDK for authentication
- Client-side business logic
- No Cloud Functions dependency for CRUD operations

## API Client Package

The new Aphrodite uses the `@lotus/api-client` package which provides typed functions for Firestore operations.

### Modules

1. **auth.ts** - Firebase Authentication
   - `signInWithEmail()`
   - `signInWithGoogle()`
   - `signInWithApple()`
   - `signOut()`
   - `resetPassword()`

2. **users.ts** - Team Member Management (Firestore: `users` collection)
   - `getAllUsers()`
   - `getUserById()`
   - `getUsersByRole()`
   - `createUser()`
   - `updateUser()`
   - `deleteUser()`

3. **clients.ts** - Client Management (Firestore: `clients` collection)
   - `getAllClients()`
   - `getClientById()`
   - `getClientsByTrainer()`
   - `getClientsByType()`
   - `createClient()`
   - `updateClient()`
   - `deleteClient()`
   - `addTrainerToClient()`
   - `removeTrainerFromClient()`

4. **exercises.ts** - Exercise Library (Firestore: `exercises` collection)
   - `getAllExercises()`
   - `getExerciseById()`
   - `getPublishedExercises()`
   - `searchExercisesByName()`
   - `getExercisesByMovementPattern()`
   - `createExercise()`
   - `updateExercise()`
   - `archiveExercise()`
   - `deleteExercise()`

5. **workouts.ts** - Client Workouts (Firestore: `clients/{id}/workouts` subcollection)
   - `getAllWorkouts()`
   - `getWorkoutById()`
   - `getWorkoutsForClient()`
   - `createWorkout()`
   - `createWorkoutForClient()`
   - `updateWorkout()`
   - `updateClientWorkout()`
   - `deleteWorkout()`
   - `deleteClientWorkout()`
   - `startWorkout()`
   - `completeWorkout()`

6. **prebuilt-workouts.ts** - Workout Templates (Firestore: `prebuiltWorkouts` collection)
   - `getAllPrebuiltWorkouts()`
   - `getPrebuiltWorkoutById()`
   - `getPrebuiltWorkoutsByAuthor()`
   - `getPrebuiltWorkoutsByVisibility()`
   - `getAccessiblePrebuiltWorkouts()`
   - `createPrebuiltWorkout()`
   - `updatePrebuiltWorkout()`
   - `deletePrebuiltWorkout()`
   - `copyPrebuiltWorkoutToClient()`

7. **media.ts** - Media File Management (Firestore: `media` collection + Cloud Storage)
   - `getAllMedia()`
   - `getMediaById()`
   - `getMediaByType()`
   - `uploadMedia()` - Uploads to Cloud Storage + creates Firestore record
   - `updateMedia()`
   - `deleteMedia()` - Deletes from both Storage and Firestore
   - `getMediaDownloadURL()`
   - `searchMediaByName()`

8. **notes.ts** - Trainer Notes & Recommendations (Firestore: `trainerNotes`, `recommendations` collections)
   - `getNotesByClient()`
   - `getNoteById()`
   - `createNote()`
   - `updateNote()`
   - `deleteNote()`
   - `getRecommendationsByClient()`
   - `createRecommendation()`
   - `deleteRecommendation()`

9. **leads.ts** - Lead Management (Firestore: `leads` collection)
   - `getAllLeads()`
   - `getLeadsByDisposition()`
   - `getUnprocessedLeads()`
   - `getLeadById()`
   - `updateLead()`
   - `acceptLead()`
   - `dropLead()`

## What's Missing from New Aphrodite

Comparing to the legacy Cloud Functions API, the new Aphrodite is **missing** these capabilities:

### 1. Workout Generation Algorithm
**Legacy:** `POST /workout` - Generates personalized workout using `tlm-algo` package
**New:** Not implemented - workouts are created manually

### 2. Journey Assignment
**Legacy:** `POST /journey/:clientId` - Assigns workout program based on client profile
**New:** Not implemented

### 3. Statistics Aggregation
**Legacy:** `GET /stats` - Returns client statistics by stage and type
**New:** Not implemented

### 4. Password Management
**Legacy:** 
- `PATCH /team/:uid/pwd` - Change team member password
- `PATCH /client/:uid/pwd` - Reset client password (generates memorable password)
- `PATCH /client/:uid/email` - Change client email

**New:** Only has `resetPassword()` which sends email reset link

### 5. Mobile Client Self-Registration
**Legacy:** `POST /mobileclient` - Creates client account from mobile app
**New:** Not needed (mobile app would use Firebase Auth directly)

### 6. Cloud Storage File Listing
**Legacy:** 
- `GET /files` - List files in legacy bucket
- `GET /f` - List files in 2022 bucket
- `GET /surl` - Get signed upload URL

**New:** Has `uploadMedia()` and `getAllMedia()` but no direct bucket listing

### 7. Lead Creation from Public Form
**Legacy:** `POST /leads` - Creates lead with reCAPTCHA verification
**New:** Has `updateLead()` but no creation endpoint (would need Cloud Function)

## Authentication Differences

### Legacy
- JWT tokens passed in `Authorization: Bearer <token>` header
- Custom middleware extracts claims (`admin`, `trainer`, `client`)
- Server-side authorization checks

### New
- Firebase Auth SDK handles authentication
- Custom claims still used (`admin`, `trainer`, `client`)
- Client-side authorization checks using `useAuth()` hook
- Firestore Security Rules enforce server-side authorization

## Security Model

### Legacy
- Cloud Functions middleware checks JWT claims
- Business logic runs server-side
- Firestore has minimal security rules (relies on Cloud Functions)

### New
- Firestore Security Rules enforce all authorization
- Business logic runs client-side
- More granular permission control
- Example rules needed:
  ```javascript
  // Users can only read/write their own data
  match /clients/{clientId} {
    allow read: if request.auth.uid == clientId 
                || hasRole('admin') 
                || hasRole('trainer');
    allow write: if hasRole('admin') || hasRole('trainer');
  }
  ```

## Benefits of New Architecture

1. **Simpler deployment** - No Cloud Functions to manage
2. **Lower latency** - Direct Firestore access
3. **Lower cost** - No Cloud Functions invocations
4. **Type safety** - Full TypeScript types throughout
5. **Better offline support** - Firestore SDK handles offline mode
6. **Real-time updates** - Can use Firestore listeners

## Drawbacks of New Architecture

1. **No server-side business logic** - Complex operations must run client-side
2. **Larger client bundle** - More code shipped to browser
3. **Security rules complexity** - Must replicate authorization logic in rules
4. **No workout algorithm** - Can't use `tlm-algo` package client-side
5. **Limited aggregations** - Can't do complex queries/stats server-side

## Recommendations

### Keep Direct Firestore Access For:
- CRUD operations (users, clients, exercises, workouts)
- Real-time data (workout progress, client updates)
- Simple queries and filters

### Add Cloud Functions For:
1. **Workout generation** - Port `POST /workout` endpoint
2. **Journey assignment** - Port `POST /journey/:clientId` endpoint
3. **Statistics** - Port `GET /stats` endpoint
4. **Password management** - Add admin password reset functions
5. **Lead creation** - Port `POST /leads` with reCAPTCHA
6. **Email notifications** - Send workout assignments, etc.
7. **Data migrations** - Background jobs for schema updates
8. **Scheduled tasks** - Cleanup, reminders, etc.

### Hybrid Approach
Use direct Firestore for most operations, but add Cloud Functions for:
- Complex business logic (workout algorithm)
- Server-side validation (lead creation)
- Background processing (statistics, cleanup)
- Third-party integrations (email, payment)
- Operations requiring elevated privileges

## Migration Path

To fully replace legacy Cloud Functions:

1. ✅ **Done:** Direct Firestore CRUD operations
2. ✅ **Done:** Firebase Auth integration
3. ✅ **Done:** Media upload to Cloud Storage
4. ⏳ **TODO:** Workout generation algorithm
5. ⏳ **TODO:** Journey assignment logic
6. ⏳ **TODO:** Statistics aggregation
7. ⏳ **TODO:** Admin password management
8. ⏳ **TODO:** Firestore Security Rules
9. ⏳ **TODO:** Email notifications
10. ⏳ **TODO:** Background jobs

## Conclusion

The new Aphrodite has successfully eliminated the dependency on Cloud Functions for basic CRUD operations by using direct Firestore access. However, some advanced features (workout generation, journey assignment, statistics) will need to be reimplemented, either as:

1. **Client-side logic** - If the algorithm can run in the browser
2. **New Cloud Functions** - If server-side processing is required
3. **Firestore triggers** - For background processing

The current architecture is simpler and more cost-effective for the implemented features, but will need Cloud Functions added back for the missing advanced capabilities.
