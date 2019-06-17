# Build Pipeline

  * [Intro](#intro)
  * [Platforms](#platforms)
  * [Release Management](#release-management)
  * [Targets](#targets)

## Intro

This is a fairly simple one. We need to ramp up our CI server strategy. Currently, we have Verto building on CircleCi, however, it has been neglected and is in need of a little TLC.

## Platforms

Verto supports many platforms, and as a result, the builds for iOS, at this time, will need to be conducted manually, at least the code signing will. Additionally, platform specific testing is not really in scope. This is due to an impediment with CircleCI and the propriety nature of Apple.

## Release Management

Due to the platforms issue listed above, we will not be able to have a completed automated build env. that can also be leveraged as a release manager. Just to note, as it was above, Apples processes and restrictions make it overly prohibited to have an end to end release management strategy. Ideally, sometime in the future, we will be able to over come these restrictions.

## Targets

The V1 version of the build will include the following targets:

1. Linter
2. Automated Security Audit
3. Test Suite
4. Build Artifacts

Out of scope for the first version:
1. Release Management
2. E2E 
3. Platform specific testing