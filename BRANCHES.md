# Branch Strategy

This document outlines the branching strategy for the PVT Hostel Leo project.

## Main Branches

### `main`
- **Purpose**: Production-ready code
- **Protection**: Protected branch
- **Deployment**: Auto-deploys to production
- **Merge Strategy**: Only merge from `staging` after thorough testing

### `develop`
- **Purpose**: Integration branch for ongoing development
- **Merges From**: Feature branches
- **Merges To**: `staging`
- **Description**: Latest development changes, may be unstable

### `staging`
- **Purpose**: Pre-production testing environment
- **Merges From**: `develop`
- **Merges To**: `main`
- **Description**: Staging environment for final QA and testing before production

## Feature Branches

### `feature/booking-enhancements`
- **Purpose**: Enhancements to the booking system
- **Base Branch**: `develop`
- **Related Milestone**: v1.1 - Booking Enhancements

### `feature/ui-improvements`
- **Purpose**: UI/UX improvements and design refinements
- **Base Branch**: `develop`
- **Related Milestone**: v1.2 - UI/UX Improvements

## A/B Testing Branches

### `variant-a`
- **Purpose**: A/B test variant A
- **Use Case**: Testing alternative implementations, designs, or features
- **Base Branch**: `develop`
- **Label**: `variant-a`, `a/b-testing`
- **Merge Strategy**: Compare metrics with variant-b before merging winner to develop

### `variant-b`
- **Purpose**: A/B test variant B
- **Use Case**: Alternative version for comparison with variant-a
- **Base Branch**: `develop`
- **Label**: `variant-b`, `a/b-testing`
- **Merge Strategy**: Compare metrics with variant-a before merging winner to develop

### A/B Testing Workflow
1. Create identical branches from `develop`: `variant-a` and `variant-b`
2. Implement different approaches in each branch
3. Deploy both variants to test environments
4. Collect metrics and user feedback
5. Merge the winning variant back to `develop`
6. Delete or reset losing variant for next test

## Experimental Branch

### `experimental`
- **Purpose**: Experimental features and proof-of-concepts
- **Use Case**: Testing new technologies, major refactors, or risky changes
- **Base Branch**: `develop`
- **Label**: `experimental`
- **Merge Strategy**: Only merge to develop after thorough review and testing
- **Warning**: May contain unstable or incomplete features

### Experimental Workflow
1. Branch from `develop` when testing new ideas
2. Experiment freely without affecting other branches
3. Document findings and results
4. If successful, clean up and merge to `develop`
5. If unsuccessful, document learnings and delete branch

## Branch Naming Conventions

### Feature Branches
```
feature/<feature-name>
```
Example: `feature/booking-enhancements`, `feature/payment-integration`

### Bug Fix Branches
```
fix/<bug-description>
```
Example: `fix/booking-date-validation`, `fix/mobile-menu-overlap`

### A/B Testing Branches
```
variant-a
variant-b
```
Or for multiple concurrent tests:
```
variant-a/<test-name>
variant-b/<test-name>
```

### Experimental Branches
```
experimental
experimental/<experiment-name>
```
Example: `experimental/new-search-algorithm`

## Workflow

### Standard Development Flow
```
feature branch → develop → staging → main
```

### A/B Testing Flow
```
develop → variant-a (implement option A)
       → variant-b (implement option B)

After testing:
winning variant → develop → staging → main
```

### Experimental Flow
```
develop → experimental (test new ideas)

If successful:
experimental → develop → staging → main

If unsuccessful:
experimental → documentation → delete branch
```

## Branch Protection Rules

### `main` ✓ PROTECTED
**Status**: Active branch protection enabled

Protection rules:
- ✓ **Require pull request reviews**: Minimum 1 approving review required
- ✓ **Dismiss stale reviews**: Automatically dismiss when new commits are pushed
- ✓ **Require status checks**: Branches must be up to date before merging
- ✓ **Enforce for administrators**: Rules apply to all users including admins
- ✓ **Require conversation resolution**: All discussions must be resolved
- ✓ **Block force pushes**: No force pushes allowed
- ✓ **Block deletions**: Branch cannot be deleted
- ✗ Code owner reviews: Not required (can be enabled if CODEOWNERS file exists)

**Direct commits to main are blocked**. All changes must go through pull requests.

### `staging` (Recommended)
Recommended protection rules:
- Require pull request reviews (minimum 1)
- Require status checks to pass
- No force pushes
- Allow deletions (for cleanup)

### `develop` (Recommended)
Recommended protection rules:
- Require status checks to pass
- Allow force pushes (for rebasing and cleanup)
- No deletion protection needed

## Deployment Strategy

| Branch | Environment | Auto-Deploy | URL Pattern |
|--------|-------------|-------------|-------------|
| `main` | Production | Yes | leo.pvthostel.com |
| `staging` | Staging | Yes | staging-leo.pvthostel.com |
| `develop` | Development | Yes | dev-leo.pvthostel.com |
| `variant-a` | Test A | Manual | variant-a-leo.vercel.app |
| `variant-b` | Test B | Manual | variant-b-leo.vercel.app |
| `experimental` | Experimental | Manual | exp-leo.vercel.app |

## Best Practices

1. **Always branch from `develop`** for new features
2. **Keep branches up to date** by regularly merging from base branch
3. **Use descriptive branch names** that explain the purpose
4. **Delete merged branches** to keep repository clean
5. **Document A/B test results** before merging or deleting
6. **Tag experimental learnings** in documentation
7. **Run tests** before creating pull requests
8. **Keep commits atomic** and well-documented

## Labels for Branch Management

- `a/b-testing` - A/B testing experiments
- `experimental` - Experimental features
- `variant-a` - Variant A specific changes
- `variant-b` - Variant B specific changes
- `needs-review` - Ready for code review
- `priority:high` - High priority work
- `booking-system` - Booking functionality changes
- `design` - Design and UI/UX work

## Questions?

For questions about branch strategy, contact the development team or refer to the project documentation.
