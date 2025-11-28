# Requirements Document

## Introduction

This feature provides a safe, automated way to populate the development Firebase database with data from the LIVE production database. The script must be read-only on production and write-only to development, with multiple safety checks to prevent any accidental writes to production.

## Glossary

- **LIVE Production**: The production Firebase project `tlm2021-41ce7` containing real user data that must never be modified
- **Dev Environment**: The development Firebase project `tlm-2021-dev` used for testing and development
- **Service Account**: A Firebase credential file used to authenticate administrative operations
- **Firestore**: Google's NoSQL document database used by the application
- **Firebase Auth**: Google's authentication service managing user accounts
- **Collection**: A top-level container for documents in Firestore
- **Document**: A single record in Firestore containing data fields
- **Batch Write**: A Firestore operation that writes multiple documents atomically

## Requirements

### Requirement 1

**User Story:** As a developer, I want to populate my dev database with production data, so that I can test features with realistic data structures and relationships.

#### Acceptance Criteria

1. WHEN the script executes, THE Script SHALL read all collections from the LIVE production database
2. WHEN the script executes, THE Script SHALL write the exported data to the dev database as well as to a local copy in JSON
3. WHEN the script completes, THE Dev Database SHALL contain a complete copy of production data
4. WHEN the script processes large collections, THE Script SHALL use batching to handle memory efficiently
5. WHEN the script encounters Firestore-specific data types, THE Script SHALL preserve timestamps, references, and geopoints correctly

### Requirement 2

**User Story:** As a developer, I want the script to have multiple safety checks, so that I can be confident production will never be accidentally modified.

#### Acceptance Criteria

1. WHEN the script initializes, THE Script SHALL verify the source project ID matches `tlm2021-41ce7`
2. WHEN the script initializes, THE Script SHALL verify the destination project ID matches either `tlm-2021-dev` or `tlm-2021-staging`
3. IF the destination project ID is `tlm2021-41ce7`, THEN THE Script SHALL exit immediately with an error
4. WHEN the script connects to production, THE Script SHALL use read-only credentials
5. WHEN the script connects to dev, THE Script SHALL use write-capable credentials

### Requirement 3

**User Story:** As a developer, I want clear progress reporting during execution, so that I can monitor the script's progress and identify any issues.

#### Acceptance Criteria

1. WHEN the script starts, THE Script SHALL display which projects are being used as source and destination
2. WHEN the script processes each collection, THE Script SHALL display the collection name and document count
3. WHEN the script completes a collection, THE Script SHALL display success confirmation with timing information
4. WHEN the script encounters an error, THE Script SHALL display the error message and continue with remaining collections
5. WHEN the script completes, THE Script SHALL display a summary of all collections processed

### Requirement 4

**User Story:** As a developer, I want to target either dev or staging environments, so that I can populate different environments with production data.

#### Acceptance Criteria

1. WHEN the script is invoked without a target parameter, THE Script SHALL default to the dev environment
2. WHEN the script is invoked with `--target=staging`, THE Script SHALL write to the staging database
3. WHEN the script is invoked with `--target=dev`, THE Script SHALL write to the dev database
4. IF the script is invoked with `--target=production` or `--target=prod`, THEN THE Script SHALL exit immediately with an error
5. WHEN the script displays progress, THE Script SHALL clearly show which target environment is being used

### Requirement 5

**User Story:** As a developer, I want the script to handle errors gracefully, so that a failure in one collection doesn't prevent other collections from being copied.

#### Acceptance Criteria

1. WHEN an error occurs reading a collection, THE Script SHALL log the error and continue with remaining collections
2. WHEN an error occurs writing a collection, THE Script SHALL log the error and continue with remaining collections
3. WHEN the script completes, THE Script SHALL display a summary of successful and failed operations
4. WHEN a fatal error occurs during initialization, THE Script SHALL exit immediately with a clear error message
5. WHEN the script exits due to error, THE Script SHALL use a non-zero exit code


