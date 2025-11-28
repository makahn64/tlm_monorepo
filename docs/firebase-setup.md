# Firebase Setup

## Overview

The Lotus Method uses Firebase for:
- **Authentication** - User login and management
- **Firestore** - NoSQL database for workouts, exercises, users
- **Cloud Storage** - Video file storage
- **Cloud Functions** - Backend API logic (future)

## Environments

Three Firebase projects are configured:

| Environment | Project ID | Purpose |
|------------|------------|---------|
| Development | `tlm-2021-dev` | Local development and testing |
| Staging | `tlm-2021-staging` | Pre-production testing |
| Production | `tlm-2021-prod` | Live production environment |

## Configuration

Firebase configuration is managed in `apps/aphrodite/src/config/firebase.ts`:

```typescript
import { firebaseConfig, currentEnvironment } from './config/firebase';
```

The environment is automatically selected based on the Vite mode:
- `pnpm dev` → development
- `pnpm dev:staging` → staging
- `pnpm dev:prod` → production

## Using Firebase Services

Import Firebase services from `src/lib/firebase.ts`:

```typescript
import { auth, db, storage } from '../lib/firebase';

// Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// Firestore
import { collection, getDocs } from 'firebase/firestore';
const snapshot = await getDocs(collection(db, 'exercises'));

// Storage
import { ref, uploadBytes } from 'firebase/storage';
const storageRef = ref(storage, 'videos/exercise.mp4');
await uploadBytes(storageRef, file);
```

## Security

### Client-Side Config
Firebase web config (apiKey, projectId, etc.) is safe to expose in client-side code. These are public identifiers, not secrets.

### Security Rules
Security is enforced by:
- **Firestore Security Rules** - Control database access
- **Storage Security Rules** - Control file access
- **Firebase Auth** - User authentication and authorization

### Sensitive Data
The `FIREBASE_CONFIGS_SECURE.md` file is in `.gitignore` for organizational purposes, but the configs themselves are not secrets.

## Firebase Console Access

- **Development:** https://console.firebase.google.com/project/tlm-2021-dev
- **Staging:** https://console.firebase.google.com/project/tlm-2021-staging
- **Production:** https://console.firebase.google.com/project/tlm-2021-prod

## Next Steps

1. Set up Firestore security rules for each environment
2. Set up Storage security rules for each environment
3. Configure Firebase Authentication providers (email, Google, Apple)
4. Set up Firebase Hosting for deployments
5. Configure CI/CD for automated deployments

## Legacy Environment

The original production environment (`tlm2021-41ce7`) remains untouched during this modernization. It will be phased out once the new production environment is stable.
