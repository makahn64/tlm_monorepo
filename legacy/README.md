# Legacy Code

This directory contains code from the original 2021 implementation that is being phased out during the modernization effort.

## Contents

### AphroditeUI/
Original Create React App implementation of the admin/trainer web app before migration to Vite.

**Status:** Being migrated to `apps/aphrodite/`  
**Keep until:** Migration complete and tested in production

### lucy2022/
An unfinished user app written in bare React Native (no expo). Unclear if this app works or not.

**Status:** Being migrated to `apps/lucy/`  
**Keep until:** Migration complete and tested in production

### tlm-gcf-core/
Original Cloud Functions implementation before refactoring to separate business logic from Firebase SDK calls.

**Status:** Being refactored with proper abstraction layers  
**Keep until:** All functions migrated and deployed

### tlm-common/
Assets and code shared between the various apps.

**Status:** Being migrated to proper workspace packages  
**Keep until:** All shared code moved to `packages/`

### mak-common/
Common helper functions I have used in various projects. It is not important for this to be its own package.
You can see it imported from like below in various places. 

```ts 
import { hashMapFilterFactory } from '@bertco/mak-common';
```

**Status:** Being migrated to proper workspace packages  
**Keep until:** All shared code moved to `packages/`

### tlm-client-portal/
Lucy in the sky app. This was supposed to a proper web version of the Lucy app, but it leaves out a lot of features as it was put together quickly.

**Status:** Being migrated to `apps/lsd` (low priority, may be a total rewrite) 
**Keep until:** Migration complete and tested in production

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
