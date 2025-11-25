# Legacy Code

This directory contains code from the original 2021 implementation that is being phased out during the modernization effort.

## Contents

### old-aphrodite/
Original Create React App implementation of the admin/trainer web app before migration to Vite.

**Status:** Being migrated to `apps/aphrodite/`  
**Keep until:** Migration complete and tested in production

### old-functions/
Original Cloud Functions implementation before refactoring to separate business logic from Firebase SDK calls.

**Status:** Being refactored with proper abstraction layers  
**Keep until:** All functions migrated and deployed

### deprecated-packages/
Original package structure before monorepo reorganization.

**Status:** Being migrated to proper workspace packages  
**Keep until:** All shared code moved to `packages/`

## Migration Guidelines

- Reference legacy code for understanding original implementation
- Do not import or depend on legacy code in new implementations
- Document any quirks or edge cases discovered during migration
- Update this README as migration progresses
- Delete entire `legacy/` folder once migration is complete

## Deletion Checklist

Before deleting legacy code, ensure:
- [ ] All functionality has been reimplemented
- [ ] New implementation is tested
- [ ] New implementation is deployed to production
- [ ] No references to legacy code exist in active codebase
- [ ] Team has been notified of deletion

## Timeline

**Started:** November 2025  
**Target Completion:** TBD  
**Safe to Delete:** After all checkboxes above are complete
