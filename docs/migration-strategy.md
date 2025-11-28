# Migration Strategy & Goals

**Date:** November 25, 2025  
**Project:** The Lotus Method Platform Modernization

## Executive Summary

Modernizing a 2021 fitness platform codebase to current standards while maintaining a working production system. The goal is incremental improvement, not a big-bang rewrite.

## Current State Assessment

### What's Working
- Production system is live and functional
- Firebase Auth + Firestore + Cloud Functions architecture
- Video content delivery via Cloud Storage
- Three applications: admin/trainer web app, mobile client app, web client app

### What's Problematic
- **Single environment** - no dev/staging, testing in production
- **Outdated tooling** - Create React App, old dependencies
- **Poor code organization** - business logic mixed with Firebase SDK calls
- **No shared code strategy** - duplication across apps
- **Unclear architecture** - hard to understand and modify
- **No type safety** - limited TypeScript usage
- **Testing gaps** - minimal or no tests

## Primary Goals

### 1. Establish Multi-Environment Workflow
**Priority:** CRITICAL  
**Why:** Cannot safely develop or test without breaking production

- Separate Firebase projects for dev/staging/prod
- Environment-specific configuration
- CI/CD pipelines for each environment
- Ability to test changes before production deployment

### 2. Modernize Aphrodite (Admin/Trainer App)
**Priority:** HIGH  
**Why:** Most critical app for business operations

- Migrate from Create React App to Vite
- Implement proper TypeScript throughout
- Extract business logic from UI components
- Use shared packages for common functionality
- Modern React patterns (hooks, functional components)

### 3. Create Proper Monorepo Structure
**Priority:** HIGH  
**Why:** Foundation for code sharing and maintainability

- Workspace packages for shared code
- Clear separation of concerns
- Proper dependency management
- Consistent tooling across all apps

### 4. Separate Business Logic from Infrastructure
**Priority:** MEDIUM  
**Why:** Maintainability and future optionality

- Pure functions in `@lotus/business-logic`
- Firebase SDK calls abstracted in `@lotus/api-client`
- Easier to test, easier to migrate if needed
- Clear boundaries between layers

### 5. Modernize Lucy (Mobile App)
**Priority:** LOW  
**Why:** Client-facing app, but less critical than admin tools. This may end up being a complete rewrite using the latest Expo features.

- Evaluate existing React Native implementation
- Decide: fix existing or rewrite
- Share code with web apps via workspace packages
- Modern React Native patterns

### 6. Modernize Lucy in the Sky (Web Client App)
**Priority:** LOW  
**Why:** Less used, may need full rewrite

- Evaluate if worth migrating or rewriting
- Could be built from Lucy mobile app code
- Lower priority than other apps

## Key Concerns

### Technical Debt
- **Concern:** Accumulating more debt while migrating
- **Mitigation:** Follow strict coding guidelines, establish patterns early
- **Acceptance:** Some debt is acceptable to maintain velocity

### Production Stability
- **Concern:** Breaking production during migration. This project will not touch the current Google Cloud production project at all (READ ONLY). There are already 3 new google cloud projects setup to support this effort. When we are done, we will simply switch out the old project for the new one. 
- **Mitigation:** Multi-environment setup first, incremental migration
- **Strategy:** Keep legacy code running until new code is proven

### Migration Timeline
- **Concern:** Taking too long, losing momentum
- **Mitigation:** Feature-by-feature migration, not all-or-nothing
- **Strategy:** Deliver value incrementally, each feature is shippable

### Team Velocity
- **Concern:** Slowing down feature development during migration
- **Mitigation:** Migrate features as they need changes, not all at once
- **Strategy:** New features in new codebase, old features stay until touched

### Data Migration
- **Concern:** Firestore data structure changes
- **Mitigation:** Avoid schema changes if possible, use data migrations if needed
- **Strategy:** Keep data structure compatible during transition

### Learning Curve
- **Concern:** New patterns and architecture to learn
- **Mitigation:** Document patterns as we establish them
- **Strategy:** Start with one feature, replicate pattern for others

## Non-Goals

### What We're NOT Doing

- **Not migrating off Google Cloud** - staying with Firebase/GCP
- **Not rewriting everything** - incremental migration only
- **Not changing data models** - unless absolutely necessary
- **Not adding features during migration** - focus on parity first
- **Not optimizing prematurely** - get it working, then optimize
- **Not achieving 100% test coverage** - pragmatic testing only

## Success Criteria

### Phase 1: Foundation (Current)
- [x] Monorepo structure established
- [x] Coding guidelines documented
- [x] Backend architecture decision made
- [ ] Multi-environment Firebase setup
- [ ] CI/CD pipeline for Aphrodite
- [ ] One feature migrated end-to-end

### Phase 2: Aphrodite Migration
- [ ] All critical features migrated
- [ ] Legacy AphroditeUI can be archived
- [ ] Production deployment successful
- [ ] Team comfortable with new patterns

### Phase 3: Mobile & Web Client
- [ ] Lucy mobile app modernized
- [ ] Lucy in the Sky evaluated and path forward decided
- [ ] Shared code packages mature and stable

### Phase 4: Backend Modernization
- [ ] Cloud Functions refactored with proper abstraction
- [ ] Business logic extracted and tested
- [ ] API client package complete

## Migration Approach

### Strategy: Strangler Fig Pattern

Gradually replace old system with new system, feature by feature:

1. **New features** → built in new codebase
2. **Changed features** → migrated to new codebase
3. **Unchanged features** → stay in legacy until touched
4. **Critical features** → migrated early for risk reduction

### Feature Migration Process

For each feature being migrated:

1. **Analyze** - understand legacy implementation
2. **Design** - plan new implementation with proper architecture
3. **Types** - define TypeScript types in shared-types
4. **Logic** - implement business logic (pure functions)
5. **API** - implement Firebase integration in api-client
6. **UI** - build React components in Aphrodite
7. **Test** - verify in dev/staging environments
8. **Deploy** - ship to production
9. **Monitor** - ensure no regressions
10. **Archive** - mark legacy code as deprecated

### Parallel Development

- Legacy code stays functional during migration
- Can switch between old and new with feature flags if needed
- No pressure to migrate everything at once
- Production stability maintained throughout

## Risk Management

### High Risk Areas

1. **Authentication** - breaking auth breaks everything
   - Mitigation: Test thoroughly, have rollback plan
   
2. **Data access** - Firestore query changes could break things
   - Mitigation: Keep queries compatible, test extensively
   
3. **Video playback** - core feature, complex
   - Mitigation: Migrate late, test on multiple devices
   
4. **Payment processing** - if applicable
   - Mitigation: Extra testing, staged rollout

### Rollback Strategy

- Keep legacy code deployable at all times
- Feature flags for new features
- Database migrations are reversible
- Can revert to legacy app if critical issues arise

## Timeline Expectations

### Realistic Estimates

- **Phase 1 (Foundation):** 2-3 weeks
- **Phase 2 (Aphrodite):** 2-3 months
- **Phase 3 (Mobile/Web):** 2-4 months
- **Phase 4 (Backend):** 1-2 months

**Total:** 6-12 months for complete migration

### Factors Affecting Timeline

- Team size and availability
- Production incidents requiring attention
- New feature requests during migration
- Complexity of legacy code
- Quality of legacy documentation

## Decision Framework

When facing migration decisions, prioritize:

1. **Production stability** - don't break what's working
2. **Developer experience** - make it easier to work with
3. **Maintainability** - code should be understandable
4. **Performance** - but not at the cost of maintainability
5. **Future optionality** - avoid lock-in where reasonable

## Next Steps

1. Set up multi-environment Firebase projects
2. Choose first feature to migrate (recommendation: Exercise Management)
3. Establish migration pattern with that feature
4. Document pattern for team
5. Repeat for other features

## Context & Constraints

### Team & Users
- **Team:** Solo developer (Mitch) with AI assistance
- **Current users:** 20 trainers + 2 admins using Aphrodite
- **Target users:** Thousands of clients on mobile app (not yet launched)
- **Timeline:** 6 months to mobile launch is reasonable

### Business Model
- **Aphrodite:** Work-for-hire, TLM pays for hosting
- **Lucy mobile:** B2C subscription model (future revenue)
- **Current state:** Aphrodite is production, client apps never launched

### Platform Strategy
- **Phase 1:** Mobile first (iOS/Android via React Native)
- **Phase 2:** Web and TV platforms later (based on demand)
- **Rationale:** Validate product and subscription model before expanding

### Technical Decisions Made
- **Backend:** Staying with Google Cloud Platform (Firebase/Firestore/Cloud Functions)
- **Monorepo:** pnpm workspaces + Turborepo
- **Language:** TypeScript throughout
- **Build tool:** Vite for web apps
- **Mobile:** React Native (Expo likely)

### Authentication
- **Trainers/Admins:** Manual creation, currently weak (default password)
  - **Fix:** Use Firebase Auth password reset flow
- **Clients:** Self-signup with email/password, phone, Google, Apple
  - **Note:** Apple Sign-In required for App Store
  - **Remove:** Facebook/Twitter auth from legacy code

### Video Infrastructure
- **Current:** Manual transcoding, direct URL playback from Cloud Storage
- **Short term:** Keep as-is, ensure mobile playback works
- **Future:** Automated transcoding pipeline (Cloud Functions or service like Mux)

### Open Questions for TLM
- [ ] How do clients connect to trainers? (trainer code, invitation, etc.)
- [ ] Is the 30-day trial feature being used?
- [ ] Any other business requirements for mobile launch?

### Security Issues to Fix
- [ ] Remove default password for trainers (use password reset flow)
- [ ] Audit and update payment processing code (likely outdated)
- [ ] Review Firebase security rules

## Immediate Plan

### Phase 1: Modernize Aphrodite (Current Focus)
**Goal:** Get the trainer tool modernized with proper dev/staging/prod workflow

1. Set up multi-environment Firebase projects (dev/staging/prod)
2. Migrate Aphrodite features from legacy to new codebase
3. Establish CI/CD pipeline
4. Document patterns for future development

**Why first:** 
- Trainers need a working tool
- Establishes patterns for Lucy development
- Provides safe environments for testing
- Immediate value delivery

### Phase 2: Audit & Plan Lucy
**Goal:** Understand what exists and what needs building

1. Audit legacy Lucy mobile app code
2. Audit Firestore data model
3. Document findings and gaps
4. Create Lucy development plan

### Phase 3: Build Lucy Mobile
**Goal:** Launch mobile app with subscription model

1. Build/finish Lucy mobile app
2. Implement/update payment processing
3. Testing across devices
4. App Store submission and launch

### Phase 4: Future Platforms
**Goal:** Expand based on success and demand

1. Web client (Lucy in the Sky revival)
2. TV platforms (AppleTV, Firestick)

## Future Features (Post-Launch)
- Chat between clients and trainers (TLM request)
- Automated video transcoding pipeline
- Enhanced analytics and progress tracking

---

**This is a living document.** Update as we learn more and make decisions.
