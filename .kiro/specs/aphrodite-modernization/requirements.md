# Requirements Document: Aphrodite Modernization

## Introduction

Modernize the Aphrodite admin/trainer portal from a 2021 Create React App implementation to a modern Vite + TypeScript application with proper multi-environment support, clean architecture, and maintainable code.

## Glossary

- **Aphrodite:** The admin and trainer web portal for The Lotus Method
- **System:** The Aphrodite application
- **Trainer:** A user who creates workouts and manages clients
- **Admin:** A user with full system access including user management
- **Editor:** A user who can manage exercises, media, and prebuilt workouts
- **Client:** An end user who receives workouts from trainers
- **Exercise:** A single movement or activity with video content
- **Workout:** A collection of exercises assigned to a client
- **Prebuilt Workout:** A reusable workout template
- **Firebase:** The backend platform (Auth, Firestore, Storage)
- **Environment:** One of development, staging, or production

## Requirements

### Requirement 1: Multi-Environment Support

**User Story:** As a developer, I want separate development, staging, and production environments, so that I can safely test changes without affecting production users. I do not want to touch the LIVE legacy production environment in any destructive way. Only manual exports are allowed for development.

#### Acceptance Criteria

1. WHEN the system starts in development mode, THEN the system SHALL connect to the development Firebase project
2. WHEN the system starts in staging mode, THEN the system SHALL connect to the staging Firebase project
3. WHEN the system starts in production mode, THEN the system SHALL connect to the NEW production Firebase project
4. WHEN the environment is displayed in the UI, THEN the system SHALL show the current environment name
5. WHEN building for deployment, THEN the system SHALL use the correct environment configuration

### Requirement 2: Authentication

**User Story:** As a trainer or admin, I want to securely log in to Aphrodite, so that I can access my workspace and manage my clients.

#### Acceptance Criteria

1. WHEN a user visits Aphrodite without authentication, THEN the system SHALL display a login page
2. WHEN a user enters valid email and password credentials, THEN the system SHALL authenticate via Firebase Auth and grant access
3. WHEN a user enters invalid credentials, THEN the system SHALL display an error message and prevent access
4. WHEN a user is authenticated, THEN the system SHALL display the main application interface
5. WHEN a user clicks logout, THEN the system SHALL sign out via Firebase Auth and return to the login page
6. WHEN a user requests password reset, THEN the system SHALL send a password reset email via Firebase Auth

### Requirement 3: User Role Management

**User Story:** As an admin, I want to manage user roles (admin, editor, trainer), so that I can control access levels appropriately.

#### Acceptance Criteria

1. WHEN an admin creates a new user, THEN the system SHALL assign one or more roles (admin, editor, trainer)
2. WHEN a user logs in, THEN the system SHALL load their role information from Firestore
3. WHEN a user accesses a feature, THEN the system SHALL verify the user has the required role
4. WHEN a user lacks required permissions, THEN the system SHALL display an access denied message
5. WHEN an admin views the user list, THEN the system SHALL display each user's assigned roles

### Requirement 4: Exercise Management

**User Story:** As an editor or admin, I want to manage the exercise library, so that trainers can build workouts from available exercises.

#### Acceptance Criteria

1. WHEN a user views the exercise list, THEN the system SHALL display all exercises from Firestore
2. WHEN a user creates a new exercise, THEN the system SHALL save it to Firestore with all required fields
3. WHEN a user edits an exercise, THEN the system SHALL update the document in Firestore
4. WHEN a user archives an exercise, THEN the system SHALL mark it as archived without deleting
5. WHEN a user searches exercises, THEN the system SHALL filter results by name, movement pattern, or equipment
6. WHEN a user views exercise details, THEN the system SHALL display all exercise information including video references

### Requirement 5: Client Management

**User Story:** As a trainer, I want to manage my clients, so that I can track their information and assign workouts.

#### Acceptance Criteria

1. WHEN a trainer views their client list, THEN the system SHALL display only clients assigned to that trainer
2. WHEN an admin views the client list, THEN the system SHALL display all clients
3. WHEN a user creates a new client, THEN the system SHALL save client information to Firestore
4. WHEN a user edits client information, THEN the system SHALL update the client document in Firestore
5. WHEN a user views client details, THEN the system SHALL display all client information including health status and equipment
6. WHEN a user filters clients by type, THEN the system SHALL show only clients matching the selected type

### Requirement 6: Workout Creation

**User Story:** As a trainer, I want to create custom workouts for my clients, so that I can provide personalized training programs.

#### Acceptance Criteria

1. WHEN a trainer creates a workout, THEN the system SHALL allow selection of exercises from the library
2. WHEN a trainer adds exercises to a workout, THEN the system SHALL maintain the exercise order
3. WHEN a trainer saves a workout, THEN the system SHALL store it in Firestore with all exercise references
4. WHEN a trainer assigns a workout to a client, THEN the system SHALL link the workout to the client document
5. WHEN a trainer views a client's workouts, THEN the system SHALL display all assigned workouts
6. WHEN a trainer edits a workout, THEN the system SHALL update the workout document in Firestore

### Requirement 7: Prebuilt Workout Templates

**User Story:** As a trainer, I want to use prebuilt workout templates, so that I can quickly assign common workout patterns to clients.

#### Acceptance Criteria

1. WHEN a user views prebuilt workouts, THEN the system SHALL display all available templates
2. WHEN a trainer creates a prebuilt workout, THEN the system SHALL save it with visibility settings (private, shared, TLM)
3. WHEN a trainer assigns a prebuilt workout to a client, THEN the system SHALL create a copy linked to that client
4. WHEN a user filters prebuilt workouts by visibility, THEN the system SHALL show only workouts matching the filter
5. WHEN a user edits a prebuilt workout, THEN the system SHALL update the template without affecting assigned copies

### Requirement 8: Media Management

**User Story:** As an editor or admin, I want to manage video files, so that exercises have proper video content.

#### Acceptance Criteria

1. WHEN a user views the media library, THEN the system SHALL display all media files from Cloud Storage
2. WHEN a user uploads a video file, THEN the system SHALL store it in Cloud Storage and create a Firestore reference
3. WHEN a user views media details, THEN the system SHALL display file information and storage URL
4. WHEN a user filters media by type, THEN the system SHALL show only media matching the selected type
5. WHEN a user deletes media, THEN the system SHALL remove the Firestore reference and optionally the storage file

### Requirement 9: Trainer Notes and Recommendations

**User Story:** As a trainer, I want to add notes and recommendations for my clients, so that I can track progress and provide guidance.

#### Acceptance Criteria

1. WHEN a trainer views a client, THEN the system SHALL display all notes for that client
2. WHEN a trainer creates a note, THEN the system SHALL save it to Firestore with timestamp and author
3. WHEN a trainer adds a recommendation, THEN the system SHALL link it to the client document
4. WHEN a trainer views notes chronologically, THEN the system SHALL sort by creation date
5. WHEN a trainer edits their own note, THEN the system SHALL update the note document

### Requirement 10: Lead Management (Future)

**User Story:** As an admin, I want to manage trial signups, so that I can convert leads to paying clients.

#### Acceptance Criteria

1. WHEN a lead signs up, THEN the system SHALL create a lead document in Firestore
2. WHEN an admin views leads, THEN the system SHALL display all unprocessed leads
3. WHEN an admin processes a lead, THEN the system SHALL update the lead status
4. WHEN an admin accepts a lead, THEN the system SHALL convert the lead to a client
5. WHEN an admin drops a lead, THEN the system SHALL mark it as dropped with timestamp

### Requirement 11: Dashboard

**User Story:** As a user, I want to see a dashboard when I log in, so that I can quickly access common tasks.

#### Acceptance Criteria

1. WHEN a user logs in, THEN the system SHALL display the dashboard as the default view
2. WHEN the dashboard loads, THEN the system SHALL display quick action buttons for common tasks
3. WHEN a trainer views the dashboard, THEN the system SHALL show their client count
4. WHEN the dashboard displays, THEN the system SHALL NOT show slow-loading charts or analytics
5. WHEN a user clicks a quick action, THEN the system SHALL navigate to the appropriate page

### Requirement 12: Navigation

**User Story:** As a user, I want clear navigation, so that I can easily access different parts of the application.

#### Acceptance Criteria

1. WHEN a user is authenticated, THEN the system SHALL display a navigation menu
2. WHEN a user clicks a navigation item, THEN the system SHALL navigate to the corresponding page
3. WHEN a user views the navigation, THEN the system SHALL show only menu items they have permission to access
4. WHEN the current page changes, THEN the system SHALL highlight the active navigation item
5. WHEN a user views the navigation, THEN the system SHALL display their name and role

---

**Last Updated:** November 26, 2025  
**Author:** Kiro AI with Mitch
