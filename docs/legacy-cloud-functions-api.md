# Legacy Cloud Functions API Documentation

This document describes the Cloud Functions endpoints in `legacy/tlm-gcf-core` and how they are used by the legacy Aphrodite UI.

## Overview

The legacy backend is an Express.js application deployed as a Google Cloud Function. It provides REST API endpoints for user management, client management, workout generation, and media storage operations.

**Base URL (Production):** `https://us-central1-tlm2021-41ce7.cloudfunctions.net/tlm`

**Local Development:** `http://localhost:5555`

## Authentication

All endpoints use JWT-based authentication via Firebase Auth tokens passed in the `Authorization` header:

```
Authorization: Bearer <firebase-jwt-token>
```

The middleware (`addClaims`) extracts custom claims from the JWT:
- `admin`: Admin user (full access)
- `trainer`: Trainer user (can manage clients)
- `client`: Client user (limited access)

### Authorization Policies

- **isAdmin**: Requires `admin` claim
- **isAdminOrTrainer**: Requires `admin` OR `trainer` claim
- **No policy**: Public or client-accessible endpoint

---

## Team/User Management Endpoints

These endpoints manage "team" accounts (admins and trainers) who have access to Aphrodite. In the data model, these are stored in the `users` collection.

### POST /team

**Create a new team member account**

**Authorization:** Admin only

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string (optional, defaults to INITIAL_TEAM_MEMBER_PASSWORD)",
  "isAdmin": "boolean",
  "isTrainer": "boolean"
}
```

**Response:**
```json
{
  "uid": "string"
}
```

**What it does:**
1. Creates Firebase Auth account with email/password
2. Sets custom claims (`admin`, `trainer`) on the auth account
3. Creates document in `users` collection with user details

**Used in Aphrodite:**
- `src/services/gcf/createPortalUser.ts`
- Called when creating new admin/trainer users

---

### DELETE /team/:uid

**Delete a team member account**

**Authorization:** Admin only

**Response:** `"Team account deleted"`

**What it does:**
1. Deletes Firebase Auth account
2. Deletes document from `users` collection

**Used in Aphrodite:**
- `src/services/gcf/deletePortalUser.ts`
- Called when removing admin/trainer users

---

### PATCH /team/:uid

**Update a team member account**

**Authorization:** Admin only

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "email": "string (optional)",
  "isAdmin": "boolean (optional)",
  "isTrainer": "boolean (optional)"
}
```

**Response:** Updated user object

**What it does:**
1. Updates custom claims if `isAdmin` or `isTrainer` provided
2. Updates display name in Firebase Auth if name provided
3. Updates document in `users` collection

**Used in Aphrodite:**
- User edit pages
- Updating team member roles and information

---

### PATCH /team/:uid/pwd

**Change team member password**

**Authorization:** Admin or Trainer

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:** Success message

**What it does:**
- Updates password in Firebase Auth

**Used in Aphrodite:**
- Password reset functionality for team members

---

## Client Management Endpoints

These endpoints manage client accounts (end users who use the Lucy mobile app or LucyInTheSky web app).

### POST /client

**Create a new client account**

**Authorization:** Admin or Trainer

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string (optional, defaults to 'TLM1234')",
  "mobilePhone": "string (optional)",
  "clientType": "number (optional, defaults to 0 for 'active')"
}
```

**Response:**
```json
{
  "uid": "string"
}
```

**What it does:**
1. Creates Firebase Auth account
2. Sets `client: true` custom claim
3. Creates document in `clients` collection with timestamp

**Used in Aphrodite:**
- `src/services/gcf/createClient.ts`
- Client creation forms

---

### DELETE /client/:uid

**Delete a client account**

**Authorization:** Admin or Trainer

**Response:** `"Client deleted"`

**What it does:**
1. Deletes Firebase Auth account (errors are swallowed)
2. Deletes document from `clients` collection

**Used in Aphrodite:**
- `src/services/gcf/deleteClient.ts`
- Client management pages

---

### PATCH /client/:uid/pwd

**Reset client password**

**Authorization:** None (public endpoint)

**Response:** New password string (e.g., `"TLM-HAPPY-PUPPY"`)

**What it does:**
- Generates a random memorable password using word combinations
- Updates password in Firebase Auth
- Returns the new password

**Password Format:** `TLM-{ADJECTIVE}-{ANIMAL}`
- Adjectives: DREAMING, WALKING, HAPPY, JUMPING, NAPPING, SMILING
- Animals: BUNNY, PUPPY, KITTEN, PANDA, HAMSTER, BIRDIE

**Used in Aphrodite:**
- Password reset functionality for clients

---

### PATCH /client/:uid/email

**Change client email address**

**Authorization:** None (public endpoint)

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "newEmail": "string"
}
```

**What it does:**
- Updates email address in Firebase Auth

**Used in Aphrodite:**
- Client profile editing

---

### POST /mobileclient

**Create mobile client account (self-registration)**

**Authorization:** None (public endpoint)

**Request Body:**
```json
{
  "uid": "string"
}
```

**Response:**
```json
{
  "clientState": "exists" | "created"
}
```

**What it does:**
1. Checks if client document already exists
2. If not, sets `client: true` claim
3. Extracts name from Firebase Auth displayName
4. Creates document in `clients` collection with:
   - Basic profile info
   - `clientType: 6` (basic mobile subscription)
   - Default health/fitness settings
   - Empty arrays for injuries, equipment, etc.

**Used in:**
- Lucy mobile app self-registration flow
- Not used in Aphrodite

---

## Workout Generation Endpoints

These endpoints use the `tlm-algo` package to generate personalized workouts and journeys.

### POST /workout

**Generate a workout for a client**

**Authorization:** None (public endpoint)

**Request Body:**
```json
{
  "clientId": "string",
  "workoutType": "number (optional, defaults to 0)"
}
```

**Response:** Generated workout object

**What it does:**
1. Fetches client data from `clients` collection
2. Fetches all exercises from `exercises` collection
3. Fetches client's past workouts
4. Calls `tlm-algo` package's `workoutAssembler` function
5. Returns generated workout (not saved to database)

**Used in:**
- Workout generation features
- Not directly called from Aphrodite UI (workouts are created manually)

---

### POST /journey/:clientId

**Generate and assign a journey (workout program) for a client**

**Authorization:** None (public endpoint)

**Response:** Array of journeys (including newly added one)

**What it does:**
1. Fetches client data
2. Determines appropriate journey based on client's:
   - Pregnancy status (`isPregnant`)
   - Trying to conceive status (`tryingToConceive`)
   - Injuries and conditions
   - Goals
   - Equipment availability
   - Due date / postpartum timeline
3. Fetches matching journey from `journeys` collection by tag
4. Appends journey to client's `journeys` array
5. Updates client document

**Journey Selection Logic:**

**Pregnant Clients:**
- Pubic pain → PRE-SPD
- Groin pain → PRE-PGP
- Sciatica → PRE-SPD
- Incontinence/prolapse → PRE-ICP
- Hypertonic → PRE-HYP
- Diastasis recti → PRE-DRC
- Back pain → PRE-BKP
- Labor prep goal → PRE-LBP
- Strength goal → PRE-FGD
- Default → PRE-FGD

**Postpartum Clients:**
- Incontinence/prolapse → POST-SUI
- Hypertonic → POST-HYP
- Diastasis recti → POST-DRC
- Back pain → POST-BKP
- < 6 weeks postpartum → POST-6WW
- Fitness goal → POST-FGD
- Pelvic floor goal → POST-SUI
- Recovery goal → POST-6WW
- C-section goal → POST-CSC
- Default → POST-FGD

**Trying to Conceive:**
- TTC journey

**Journey Tags:** Each journey has a tag suffix based on equipment:
- `-WTS` (weights: kettlebell or dumbbell)
- `-BND` (bands only)

**Used in:**
- Journey assignment features
- Mobile app onboarding

---

## Statistics Endpoint

### GET /stats

**Get client statistics**

**Authorization:** None (public endpoint)

**Response:**
```json
{
  "clientsByStage": {
    "pregnant": "number",
    "postpartum": "number",
    "ttc": "number"
  },
  "clientsByType": {
    "active": "number",
    "inactive": "number",
    ...
  }
}
```

**What it does:**
1. Fetches all clients from `clients` collection
2. Bucketizes by pregnancy stage
3. Bucketizes by client type
4. Returns aggregated statistics

**Used in Aphrodite:**
- `src/services/gcf/getStats.ts`
- Dashboard statistics display

---

## Lead Management Endpoint

### POST /leads

**Create a new lead from website form**

**Authorization:** None (public endpoint)

**Request Body:**
```json
{
  "contactInfo": {
    "recaptchaToken": "string",
    ...
  },
  ...
}
```

**Response:**
```json
{
  "message": "recorded"
}
```

**What it does:**
1. Verifies reCAPTCHA token with Google
2. If valid, adds lead document to `leads` collection
3. Returns success message

**Used in:**
- Public website lead capture forms
- Aphrodite lead management pages

---

## Storage Endpoints

These endpoints interact with Google Cloud Storage for media file management.

### GET /surl

**Get signed URL for file upload**

**Authorization:** None (public endpoint)

**Response:** Signed URL string

**What it does:**
- Generates a signed URL for uploading a file to GCS
- URL expires in 10 minutes
- Hardcoded to test file: `signedUrlTest.png`

**Note:** This appears to be a test/demo endpoint

**Used in:**
- File upload functionality (limited use)

---

### GET /files

**List files in storage bucket (legacy)**

**Authorization:** None (public endpoint)

**Query Parameters:**
- `prefix`: Filter files by prefix (optional)

**Response:** Array of file metadata objects (max 200)

**What it does:**
- Lists files from the legacy storage bucket
- Optionally filters by prefix
- Returns file metadata

**Used in Aphrodite:**
- Legacy media library features

---

### GET /f

**List files in storage bucket (2022 version)**

**Authorization:** None (public endpoint)

**Query Parameters:**
- `folder`: Filter files by folder (optional)

**Response:** Array of file metadata objects (max 200)

**What it does:**
- Lists files from the 2022 media bucket
- Filters by folder if provided
- Excludes folder marker files

**Used in Aphrodite:**
- `src/services/gcf/gcsMedia.ts`
- Media library and file browser

---

## Utility Endpoints

### GET /ping

**Health check endpoint**

**Authorization:** None

**Response:**
```json
{
  "version": "string"
}
```

**What it does:**
- Returns the version from package.json
- Used for health checks and version verification

---

## Data Flow in Aphrodite

### User Management Flow
1. Admin logs into Aphrodite
2. Creates team member via `POST /team`
3. Team member can log in with credentials
4. Admin can update roles via `PATCH /team/:uid`
5. Admin can reset password via `PATCH /team/:uid/pwd`

### Client Management Flow
1. Trainer creates client via `POST /client`
2. Client receives default password `TLM1234`
3. Trainer can reset password via `PATCH /client/:uid/pwd`
4. Client logs into Lucy mobile app
5. Client data synced via Firestore

### Workout Creation Flow
1. Trainer views client in Aphrodite
2. Manually creates workout using workout editor
3. Workout saved directly to Firestore
4. Client sees workout in mobile app
5. (Algorithm endpoint available but not used in UI)

### Journey Assignment Flow
1. Client completes onboarding in mobile app
2. Mobile app calls `POST /journey/:clientId`
3. Journey assigned based on client profile
4. Journey workouts appear in client's program

---

## Migration Notes

### Current State
- All endpoints point to production project `tlm2021-41ce7`
- No environment-based configuration
- Mixed authorization patterns (some endpoints are public)
- Direct Firestore access from Cloud Functions

### Modernization Considerations
1. **Environment Support**: Add dev/staging/prod configuration
2. **Authorization**: Standardize auth requirements
3. **API Client**: Create typed API client package
4. **Validation**: Add request validation
5. **Error Handling**: Standardize error responses
6. **Testing**: Add endpoint tests
7. **Documentation**: Generate OpenAPI spec

### Security Concerns
1. Some endpoints lack proper authorization
2. Password reset endpoints are public
3. No rate limiting
4. Hardcoded secrets in code
5. No input validation

---

## Related Files

### Cloud Functions
- `legacy/tlm-gcf-core/index.js` - Main Express app
- `legacy/tlm-gcf-core/src/endpoints/` - Endpoint implementations
- `legacy/tlm-gcf-core/src/policies/` - Auth middleware

### Aphrodite UI
- `legacy/AphroditeUI/src/services/gcf/` - API client functions
- `legacy/AphroditeUI/src/services/gcf/gcfCommon.ts` - Base URLs
- `legacy/AphroditeUI/src/services/gcf/jwtRequests.ts` - Auth wrapper

### Shared Packages
- `legacy/tlm-common/` - Shared TypeScript types
- External: `tlm-algo` - Workout generation algorithm
