# Implementation Tasks: Aphrodite Modernization

## Phase 1: Foundation & Setup

- [x] 1. Project Setup and Configuration
  - Set up Tailwind CSS and shadcn/ui components
  - Configure Vitest for testing
  - Set up React Router v6
  - Configure ESLint and Prettier
  - _Requirements: All_

- [x] 2. Create Shared Type Definitions
  - [x] 2.1 Create User types in @lotus/shared-types
    - Define UserRole constants
    - Define User interface
    - Export from index
    - _Requirements: 2.1, 3.1_
  
  - [x] 2.2 Create Client types in @lotus/shared-types
    - Define ClientType constants
    - Define Client interface with trainerIds array
    - Define ClientInjuries and ClientEquipment interfaces
    - _Requirements: 5.1_
  
  - [x] 2.3 Create Exercise types in @lotus/shared-types
    - Define Exercise interface
    - Define MediaReference interface
    - Define movement pattern and equipment constants
    - _Requirements: 4.1_
  
  - [x] 2.4 Create Workout types in @lotus/shared-types
    - Define WorkoutType and WorkoutStatus constants
    - Define Workout and PrebuiltWorkout interfaces
    - Define WorkoutProgress interface
    - _Requirements: 6.1, 7.1_

- [x] 3. Create API Client Package
  - [x] 3.1 Set up @lotus/api-client package structure
    - Create package.json
    - Set up TypeScript configuration
    - Create barrel exports
    - _Requirements: All_
  
  - [x] 3.2 Implement authentication API
    - Create auth module with signInWithEmail, signInWithGoogle, signInWithApple, signInWithPhone
    - Implement signOut and resetPassword
    - Handle Firebase Auth errors
    - _Requirements: 2.1-2.6_
  
  - [x] 3.3 Implement users API
    - Create CRUD operations for users
    - Implement role-based filtering
    - _Requirements: 3.1-3.5_
  
  - [x] 3.4 Implement clients API
    - Create CRUD operations for clients
    - Implement trainer-based filtering
    - _Requirements: 5.1-5.6_
  
  - [x] 3.5 Implement exercises API
    - Create CRUD operations for exercises
    - Implement search and filtering
    - _Requirements: 4.1-4.6_
  
  - [x] 3.6 Implement workouts API
    - Create CRUD operations for workouts
    - Implement workout assignment to clients
    - _Requirements: 6.1-6.6_
  
  - [x] 3.7 Implement prebuilt workouts API
    - Create CRUD operations for prebuilt workouts
    - Implement visibility filtering
    - _Requirements: 7.1-7.5_
  
  - [x] 3.8 Implement media API
    - Create CRUD operations for media
    - Implement Cloud Storage upload/download
    - _Requirements: 8.1-8.5_

## Phase 2: Authentication & Layout

- [x] 4. Implement Authentication
  - [x] 4.1 Create AuthContext and AuthProvider
    - Implement auth state management
    - Handle Firebase Auth state changes
    - Provide auth methods to app
    - _Requirements: 2.1-2.6_
  
  - [x] 4.2 Create Login page
    - Build login form with email/password
    - Add Google sign-in button
    - Add Apple sign-in button
    - Add password reset link
    - Handle loading and error states
    - _Requirements: 2.1-2.6_
  
  - [x] 4.3 Create ProtectedRoute component
    - Check authentication status
    - Redirect to login if not authenticated
    - _Requirements: 2.1_
  
  - [x] 4.4 Create RoleProtectedRoute component
    - Check user roles
    - Show access denied for insufficient permissions
    - _Requirements: 3.3, 3.4_

- [x] 5. Create Application Layout
  - [x] 5.1 Create main layout component
    - Build responsive layout structure
    - Add navigation sidebar
    - Add header with user info
    - _Requirements: 12.1-12.5_
  
  - [x] 5.2 Create navigation component
    - Implement role-based menu items
    - Add active route highlighting
    - Add logout button
    - _Requirements: 12.1-12.5_
  
  - [x] 5.3 Create Dashboard page
    - Build simple dashboard with quick actions
    - Show client count for trainers
    - Add navigation cards
    - _Requirements: 11.1-11.5_

## Phase 3: Core Features

- [x] 6. Implement Exercise Management
  - [x] 6.1 Create Exercise List page
    - Display all exercises in a table/grid
    - Add search and filter functionality
    - Add create new exercise button
    - _Requirements: 4.1, 4.5_
  
  - [x] 6.2 Create Exercise Detail page
    - Display all exercise information
    - Show video references
    - Add edit and archive buttons
    - _Requirements: 4.6_
  
  - [x] 6.3 Create Exercise Form component
    - Build form for create/edit
    - Add validation
    - Handle video reference inputs
    - _Requirements: 4.2, 4.3_
  
  - [x] 6.4 Implement exercise search and filtering
    - Filter by movement pattern
    - Filter by equipment
    - Search by name
    - _Requirements: 4.5_

- [x] 7. Implement Client Management
  - [x] 7.1 Create Client List page
    - Display clients based on user role
    - Add filter by client type
    - Add create new client button
    - _Requirements: 5.1, 5.2, 5.6_
  
  - [x] 7.2 Create Client Detail page
    - Display all client information
    - Show health status and equipment
    - Add edit button
    - _Requirements: 5.5_
  
  - [x] 7.3 Create Client Form component
    - Build comprehensive client form
    - Add health status fields
    - Add equipment selection
    - Add injury/condition selection
    - Implement validation
    - _Requirements: 5.3, 5.4_
  
  - [x] 7.4 Create Client Notes section
    - Display trainer notes chronologically
    - Add create note form
    - Allow editing own notes
    - _Requirements: 9.1-9.5_

- [x] 8. Implement Workout Management
  - [x] 8.1 Create Workout Editor component
    - Build exercise selection interface
    - Implement drag-and-drop ordering
    - Add exercise search
    - _Requirements: 6.1, 6.2_
  
  - [x] 8.2 Create Client Workouts page
    - Display all workouts for a client
    - Add create new workout button
    - Show workout status
    - _Requirements: 6.5_
  
  - [x] 8.3 Create Workout Detail page
    - Display workout exercises
    - Show workout metadata
    - Add edit button
    - _Requirements: 6.5_
  
  - [x] 8.4 Implement workout assignment
    - Link workout to client
    - Save to Firestore
    - _Requirements: 6.4_

- [x] 9. Implement Prebuilt Workouts
  - [x] 9.1 Create Prebuilt Workout List page
    - Display all prebuilt workouts
    - Filter by visibility
    - Add create new button
    - _Requirements: 7.1, 7.4_
  
  - [x] 9.2 Create Prebuilt Workout Form
    - Reuse workout editor
    - Add visibility selection
    - _Requirements: 7.2_
  
  - [x] 9.3 Implement workout template assignment
    - Create copy of prebuilt workout
    - Link to client
    - _Requirements: 7.3_

- [x] 10. Implement User Management
  - [x] 10.1 Create User List page (Admin only)
    - Display all users
    - Show roles
    - Add create new user button
    - _Requirements: 3.5_
  
  - [x] 10.2 Create User Form component (Admin only)
    - Build user creation/edit form
    - Add role selection (multiple roles)
    - Send password reset email for new users
    - _Requirements: 3.1, 3.2_

- [x] 11. Implement Media Management
  - [x] 11.1 Create Media Library page
    - Display all media files
    - Filter by type
    - Add upload button
    - _Requirements: 8.1, 8.4_
  
  - [x] 11.2 Create Media Upload component
    - Build file upload interface
    - Handle Cloud Storage upload
    - Create Firestore reference
    - _Requirements: 8.2_
  
  - [x] 11.3 Create Media Detail page
    - Display media information
    - Show storage URL
    - Add delete button
    - _Requirements: 8.3, 8.5_

## Phase 4: Advanced Features & Polish

- [ ] 12. Implement Lead Management (Future)
  - [ ] 12.1 Create Lead List page (Admin only)
    - Display unprocessed leads
    - Add process button
    - _Requirements: 10.2_
  
  - [ ] 12.2 Create Lead Detail page (Admin only)
    - Display lead information
    - Add accept/drop buttons
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ] 12.3 Implement lead to client conversion
    - Create client from lead data
    - Update lead status
    - _Requirements: 10.4_

- [ ] 13. Deploy Firestore Security Rules
  - Create security rules file
  - Implement role-based access control
  - Deploy to all environments
  - Test security rules
  - _Requirements: All_

- [ ] 14. Set Up CI/CD Pipeline
  - Create GitHub Actions workflow
  - Configure Firebase deployment
  - Set up branch strategy
  - Add required secrets
  - Test deployments
  - _Requirements: 1.5_

- [ ] 15. Testing & Bug Fixes
  - Write unit tests for business logic
  - Write component tests for key features
  - Test role-based access control
  - Fix any discovered bugs
  - _Requirements: All_

- [ ] 16. Performance Optimization
  - Implement code splitting
  - Optimize bundle size
  - Add loading states
  - Implement pagination for large lists
  - _Requirements: All_

- [ ] 17. Final Polish
  - Add error boundaries
  - Improve error messages
  - Add loading skeletons
  - Test across environments
  - Update documentation
  - _Requirements: All_

---

**Last Updated:** November 26, 2025  
**Total Tasks:** 17 main tasks, 50+ subtasks
