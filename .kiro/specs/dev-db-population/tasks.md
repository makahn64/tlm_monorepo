# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Create `scripts/populate-dev-db.ts` file
  - Add necessary TypeScript types for Firebase Admin
  - Verify firebase-admin package is available
  - _Requirements: All_

- [x] 2. Implement CLI argument parsing and validation
- [x] 2.1 Create argument parser for --target parameter
  - Parse command line arguments
  - Extract target parameter with default to 'dev'
  - Return typed CLIOptions object
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.2 Implement target validation with production blocking
  - Check if target is 'production' or 'prod' and exit with error
  - Validate target is either 'dev' or 'staging'
  - Display clear error messages for invalid targets
  - _Requirements: 4.4_

- [x] 3. Implement service account initialization and safety checks
- [x] 3.1 Create service account loader
  - Load production service account from file
  - Load dev/staging service account based on target
  - Handle file not found errors gracefully
  - _Requirements: 2.1, 2.2_

- [x] 3.2 Initialize dual Firebase Admin instances
  - Create source app instance for production (read-only)
  - Create destination app instance for dev/staging (write)
  - Get Firestore instances for both apps
  - _Requirements: 2.4, 2.5_

- [x] 3.3 Implement critical safety validation
  - Verify source project ID is exactly 'tlm2021-41ce7'
  - Verify destination project ID matches target environment
  - Exit immediately if destination is production
  - Display clear safety check messages
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3.4 Write property test for safety validation
  - **Property 6: Fatal error immediate exit**
  - **Validates: Requirements 5.4**

- [x] 4. Implement collection discovery and processing
- [x] 4.1 Create collection discovery function
  - List all collections from source database
  - Return array of collection names
  - Handle errors in collection listing
  - _Requirements: 1.1_

- [x] 4.2 Implement single collection copy function
  - Read all documents from source collection
  - Write documents to destination in batches of 500
  - Preserve document IDs and all field data
  - Handle Firestore-specific types (Timestamp, GeoPoint, DocumentReference)
  - Return CollectionResult with stats
  - _Requirements: 1.2, 1.5_

- [ ]* 4.3 Write property test for type preservation
  - **Property 2: Firestore type preservation**
  - **Validates: Requirements 1.5**

- [x] 4.3 Implement batch writing logic
  - Create Firestore batch writer
  - Add documents to batch up to 500 limit
  - Commit batch and create new batch when limit reached
  - Commit final batch with remaining documents
  - _Requirements: 1.4_

- [x] 4.4 Add subcollection handling
  - For each document, discover subcollections
  - Recursively copy subcollections
  - Maintain document path structure
  - _Requirements: 1.3_

- [ ]* 4.5 Write property test for complete replication
  - **Property 1: Complete data replication**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 5. Implement progress reporting and logging
- [x] 5.1 Create progress display functions
  - Display script start message with source and destination projects
  - Display collection processing progress with name and count
  - Display collection completion with timing
  - Display separator lines for readability
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 5.2 Write property test for progress reporting
  - **Property 4: Progress reporting completeness**
  - **Validates: Requirements 3.2, 3.3**

- [x] 5.3 Implement summary report generation
  - Track successful and failed collections
  - Calculate total documents copied
  - Calculate total execution time
  - Display formatted summary at completion
  - _Requirements: 3.5, 5.3_

- [x] 6. Implement error handling and resilience
- [x] 6.1 Add collection-level error handling
  - Wrap collection copy in try-catch
  - Log error message with collection name
  - Continue processing remaining collections
  - Track failed collections for summary
  - _Requirements: 3.4, 5.1, 5.2_

- [ ]* 6.2 Write property test for error resilience
  - **Property 3: Error resilience**
  - **Validates: Requirements 3.4, 5.1, 5.2**

- [x] 6.2 Implement exit code handling
  - Return exit code 0 on complete success
  - Return exit code 1 if any collections failed
  - Return exit code 1 on fatal errors
  - _Requirements: 5.5_

- [ ]* 6.3 Write property test for exit codes
  - **Property 5: Non-zero exit on error**
  - **Validates: Requirements 5.5**

- [x] 7. Create main execution flow
- [x] 7.1 Wire together all components
  - Parse CLI arguments
  - Initialize Firebase Admin instances
  - Run safety checks
  - Discover collections
  - Process each collection with error handling
  - Display final summary
  - Exit with appropriate code
  - _Requirements: All_

- [x] 7.2 Add script execution wrapper
  - Create async main function
  - Handle top-level errors
  - Ensure proper cleanup on exit
  - _Requirements: 5.4_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create documentation and usage instructions
- [x] 9.1 Add inline code documentation
  - Document all functions with JSDoc comments
  - Add inline comments for complex logic
  - Document safety checks clearly
  - _Requirements: All_

- [x] 9.2 Create README or usage documentation
  - Document how to obtain production service account key
  - Provide usage examples for dev and staging
  - Document expected output format
  - List common errors and solutions
  - _Requirements: All_

- [x] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
