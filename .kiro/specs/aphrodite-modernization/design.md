# Design Document: Aphrodite Modernization

## Overview

This document outlines the technical design for modernizing the Aphrodite admin/trainer portal. The design focuses on clean architecture, type safety, and maintainability while preserving all existing functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Aphrodite (React + Vite)                │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer                                         │
│  - Pages (routes)                                           │
│  - Components (UI elements)                                 │
│  - Hooks (data fetching, state)                            │
├─────────────────────────────────────────────────────────────┤
│  Application Layer                                          │
│  - @lotus/api-client (Firebase abstraction)                │
│  - @lotus/business-logic (pure functions)                  │
│  - @lotus/shared-types (TypeScript types)                  │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                       │
│  - Firebase Auth                                            │
│  - Firestore Database                                       │
│  - Cloud Storage                                            │
└─────────────────────────────────────────────────────────────┘
```

### Separation of Concerns

1. **Presentation Layer** - React components, pages, routing
2. **Application Layer** - Business logic, data access abstraction
3. **Infrastructure Layer** - Firebase services

This separation allows:
- Easy testing of business logic
- Potential future migration away from Firebase
- Clear boundaries between layers

## Components and Interfaces

### Package Structure

```
packages/
├── shared-types/          # TypeScript type definitions
│   ├── src/
│   │   ├── user.ts       # User, UserRole types
│   │   ├── client.ts     # Client, ClientType types
│   │   ├── exercise.ts   # Exercise types
│   │   ├── workout.ts    # Workout, PrebuiltWorkout types
│   │   ├── media.ts      # Media file types
│   │   ├── lead.ts       # Lead types
│   │   └── index.ts      # Barrel exports
│   └── package.json
│
├── business-logic/        # Pure business logic functions
│   ├── src/
│   │   ├── validation/   # Input validation
│   │   ├── formatting/   # Data formatting
│   │   ├── calculations/ # Workout calculations
│   │   └── index.ts
│   └── package.json
│
└── api-client/           # Firebase abstraction layer
    ├── src/
    │   ├── auth/         # Authentication operations
    │   ├── users/        # User CRUD operations
    │   ├── clients/      # Client CRUD operations
    │   ├── exercises/    # Exercise CRUD operations
    │   ├── workouts/     # Workout CRUD operations
    │   ├── media/        # Media operations
    │   └── index.ts
    └── package.json
```

### Core Interfaces

#### Authentication Context
```typescript
interface AuthContext {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

#### API Client Pattern
```typescript
interface ApiClient<T> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
```

## Data Models

### User
```typescript
export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  TRAINER: 'trainer',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  clients: string[]; // Client IDs for trainers
  createdAt: Date;
  updatedAt: Date;
}
```

### Client
```typescript
export const ClientType = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  PAST_DUE: 'pastDue',
  LEAD: 'lead',
  ARCHIVED: 'archived',
  FREE: 'free',
  APP_SUB_0: 'appSub0',
  APP_SUB_1: 'appSub1',
  APP_SUB_2: 'appSub2',
  APP_SUB_3: 'appSub3',
} as const;

export type ClientType = typeof ClientType[keyof typeof ClientType];

export interface Client {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  clientType: ClientType;
  trainerIds: string[]; // Array to support multiple trainers
  
  // Health & Fitness
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  dateOfBirth?: string;
  dueDate?: string;
  isPregnant: boolean;
  tryingToConceive?: boolean;
  
  // Physical Conditions
  backPain: 'none' | 'low' | 'high';
  sciatica: 'none' | 'low' | 'high';
  injuries: string[];
  postureConditions: string[];
  
  // Equipment
  equipment: string[];
  
  // App State
  themeMode: 'light' | 'dark' | 'auto';
  accountActive: boolean;
  hasAcceptedLiabilityWaiver?: boolean;
  hasCompletedOnboarding?: boolean;
  
  // Metadata
  markedForDeletion: boolean;
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Exercise
```typescript
export interface Exercise {
  docId: string;
  title: string;
  name: string;
  description: string;
  
  // Classification
  movementPattern: string;
  intensity: number; // 1-10
  
  // Tags
  stress: string[];
  releases: string[];
  activates: string[];
  equipment: string[];
  optionalEquipment: string[];
  
  // Instructions
  cues: string[];
  duration: number; // seconds
  
  // Video References
  prenatalVideo: MediaReference;
  postnatalVideo: MediaReference;
  instructionVideo: MediaReference;
  prenatalThumb: MediaReference;
  postnatalThumb: MediaReference;
  instructionThumb: MediaReference;
  
  // Flags
  isBreak?: boolean;
  isCustom?: boolean;
  published: boolean;
  archived: boolean;
  preComposited: boolean;
  
  // Metadata
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaReference {
  url?: string;
  path?: string;
  bucket?: string;
}
```

### Workout
```typescript
export const WorkoutType = {
  NORMAL: 'normal',
  MOBILITY: 'mobility',
} as const;

export type WorkoutType = typeof WorkoutType[keyof typeof WorkoutType];

export const WorkoutStatus = {
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  COMPLETE: 'complete',
} as const;

export type WorkoutStatus = typeof WorkoutStatus[keyof typeof WorkoutStatus];

export interface WorkoutProgress {
  status: WorkoutStatus;
  exerciseIndex: number;
  playbackTime: number;
  rounds?: number;
}

export interface Workout {
  id?: string;
  name?: string;
  workoutType: WorkoutType;
  exercises: Exercise[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  generatedBy: 'trainer' | 'algorithm';
  
  // Timing
  duration: number; // milliseconds
  startedOn?: Date;
  completedOn?: Date;
  
  // Notes
  clientNotes?: string;
  internalNotes?: string;
  feedback?: string;
  
  // Progress
  progress?: WorkoutProgress;
  favorite?: boolean;
  set?: number;
  
  // Algorithm Data
  clientSnapshot?: Client;
  prioritizations?: string[];
  eliminations?: string[];
  avgIntensity?: number;
}

export interface PrebuiltWorkout extends Workout {
  authorId: string;
  visibility: 'TLM' | 'private' | 'shared';
}
```

## Error Handling

### Error Types
```typescript
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Strategy

1. **API Layer** - Catch Firebase errors, convert to domain errors
2. **Component Layer** - Display user-friendly, fun error messages
3. **Global Error Boundary** - Catch unhandled errors, show fallback UI

## Testing Strategy

### Unit Testing
- Test business logic functions in `@lotus/business-logic`
- Test data transformations and validations
- Test utility functions
- Use Vitest as test runner

### Integration Testing
- Test API client operations against Firebase emulator
- Test authentication flows
- Test data persistence

### Component Testing
- Test React components with React Testing Library
- Test user interactions
- Test conditional rendering based on roles

### E2E Testing (Future)
- Test critical user flows with Playwright
- Test across different environments
- Test role-based access control

## Routing Structure

```
/                           → Dashboard
/login                      → Login Page

/exercises                  → Exercise List
/exercises/:id              → Exercise Detail
/exercises/:id/edit         → Exercise Edit
/exercises/new              → Exercise Create

/clients                    → Client List
/clients/:id                → Client Detail
/clients/:id/edit           → Client Edit
/clients/:id/workouts       → Client Workouts
/clients/:id/notes          → Client Notes
/clients/new                → Client Create

/workouts/prebuilt          → Prebuilt Workout List
/workouts/prebuilt/:id      → Prebuilt Workout Detail
/workouts/prebuilt/:id/edit → Prebuilt Workout Edit
/workouts/prebuilt/new      → Prebuilt Workout Create

/media                      → Media Library
/media/:id                  → Media Detail
/media/upload               → Media Upload

/users                      → User List (Admin only)
/users/:id/edit             → User Edit (Admin only)
/users/new                  → User Create (Admin only)

/leads                      → Lead List (Admin only)
/leads/:id                  → Lead Detail (Admin only)

/account                    → Account Settings
```

## State Management

### Approach: React Context + Hooks

No Redux or external state management library. Use:

1. **React Context** for global state (auth, user)
2. **Custom Hooks** for data fetching
3. **Local State** for component-specific state

### Auth Context
```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

### Data Fetching Pattern
```typescript
const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exerciseApi.getAll();
        setExercises(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  return { exercises, loading, error };
};
```

## Styling Approach

### CSS Solution: TBD

Options to consider:
1. **Tailwind CSS** - Utility-first, fast development
2. **CSS Modules** - Scoped styles, no runtime
3. **Styled Components** - CSS-in-JS (legacy uses this)

Recommendation: **Tailwind CSS** for speed and consistency

### Component Library: TBD

Options to consider:
1. **Headless UI** - Unstyled, accessible components
2. **Radix UI** - Unstyled primitives
3. **shadcn/ui** - Copy-paste components with Tailwind
4. **Ant Design** - Full component library (legacy uses this)

Recommendation: **shadcn/ui** for modern, customizable components

## Performance Considerations

### Code Splitting
- Route-based code splitting with React.lazy
- Lazy load heavy components (workout editor, media uploader)

### Data Fetching
- Cache Firestore queries where appropriate
- Use Firestore real-time listeners sparingly
- Implement pagination for large lists

### Bundle Size
- Tree-shake unused Firebase modules
- Lazy load Firebase services
- Monitor bundle size with Vite build analyzer

## Security Considerations

### Authentication
- Use Firebase Auth for all authentication
- Implement password reset flow
- No default passwords (use email invitation)

### Authorization
- Check user roles on every protected route
- Verify permissions in API client before operations
- Use Firestore security rules as backup

### Data Access
- Trainers can only access their own clients unless they make the client specifically visible to all trainers.
- Admins can access all data
- Editors can manage exercises and media only

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
    
    function isEditor() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'editor']);
    }
    
    function isTrainer() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'trainer']);
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Clients collection
    match /clients/{clientId} {
      allow read: if isTrainer();
      allow create: if isTrainer();
      allow update: if isTrainer() && 
        (isAdmin() || request.auth.uid in resource.data.trainerIds);
      allow delete: if isAdmin();
    }
    
    // Exercises collection
    match /exercises/{exerciseId} {
      allow read: if isAuthenticated();
      allow write: if isEditor();
    }
    
    // Media collection
    match /media/{mediaId} {
      allow read: if isAuthenticated();
      allow write: if isEditor();
    }
    
    // Prebuilt workouts
    match /prebuiltWorkouts/{workoutId} {
      allow read: if isAuthenticated();
      allow create: if isTrainer();
      allow update: if isTrainer() && 
        (isAdmin() || resource.data.authorId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Leads
    match /leads/{leadId} {
      allow read, write: if isAdmin();
    }
  }
}
```

## Deployment Strategy

### CI/CD Platform: GitHub Actions

Using GitHub Actions for CI/CD because:
- Free for public repos, generous for private
- Native GitHub integration
- Good Firebase support
- Simple YAML configuration

### Pipeline Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Aphrodite

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Type check
        run: pnpm type-check
      
      - name: Run tests
        run: pnpm test
      
      - name: Lint
        run: pnpm lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Determine environment
        id: env
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "environment=production" >> $GITHUB_OUTPUT
            echo "project_id=tlm-2021-prod" >> $GITHUB_OUTPUT
            echo "build_cmd=build" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" == "refs/heads/staging" ]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
            echo "project_id=tlm-2021-staging" >> $GITHUB_OUTPUT
            echo "build_cmd=build:staging" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
            echo "project_id=tlm-2021-dev" >> $GITHUB_OUTPUT
            echo "build_cmd=build:dev" >> $GITHUB_OUTPUT
          fi
      
      - name: Build
        run: pnpm --filter @lotus/aphrodite ${{ steps.env.outputs.build_cmd }}
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: ${{ steps.env.outputs.project_id }}
          channelId: live
```

### Branch Strategy

- **`develop`** → Development environment (`tlm-2021-dev`)
  - Automatic deployment on push
  - For testing new features
  
- **`staging`** → Staging environment (`tlm-2021-staging`)
  - Automatic deployment on push
  - For pre-production testing
  - Should mirror production data structure
  
- **`main`** → Production environment (`tlm-2021-prod`)
  - Automatic deployment on push
  - Protected branch (require PR reviews)
  - Only merge from staging after testing

### Firebase Hosting Configuration

```json
// firebase.json
{
  "hosting": {
    "public": "apps/aphrodite/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Required GitHub Secrets

Set these in GitHub repo settings → Secrets and variables → Actions:

1. **`FIREBASE_SERVICE_ACCOUNT`** - Service account JSON for Firebase deployments
   - Create in Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Copy entire JSON content

### Preview Deployments

For pull requests, Firebase Hosting can create preview channels:

```yaml
# Add to deploy.yml for PR previews
preview:
  if: github.event_name == 'pull_request'
  runs-on: ubuntu-latest
  steps:
    # ... build steps ...
    - name: Deploy to preview channel
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: tlm-2021-dev
        expires: 7d
```

### Manual Deployment

For local/manual deployments:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy to specific environment
firebase use tlm-2021-dev
pnpm --filter @lotus/aphrodite build:dev
firebase deploy --only hosting

# Or use project alias
firebase deploy --only hosting --project dev
```

### Deployment Checklist

Before deploying to production:
- [ ] All tests passing
- [ ] Type check passes
- [ ] Tested in staging environment
- [ ] Database migrations completed (if any)
- [ ] Firestore security rules updated (if needed)
- [ ] Environment variables verified
- [ ] PR reviewed and approved

## Migration Strategy

### Phase 1: Foundation (Weeks 1-2)
- ✅ Multi-environment setup
- ✅ Firebase SDK integration
- Authentication implementation
- Basic layout and navigation

### Phase 2: Core Features (Weeks 3-6)
- Exercise management
- Client management
- User management
- Basic workout creation

### Phase 3: Advanced Features (Weeks 7-10)
- Prebuilt workouts
- Media management
- Trainer notes
- Workout editor

### Phase 4: Polish (Weeks 11-12)
- Dashboard
- Lead management
- Performance optimization
- Testing and bug fixes

## Open Questions

1. **UI Component Library** - Which library should we use?
2. **Styling Approach** - Tailwind CSS or alternative?
3. **Workout Algorithm** - Where is it located in legacy code?
4. **Video Transcoding** - Keep manual or implement automated pipeline?
5. **Real-time Updates** - Which features need Firestore listeners?

---

**Last Updated:** November 26, 2025  
**Author:** Kiro AI with Mitch
