# Verto Roadmap

This document outlines the development plan from a high level and will be updated as the project progresses. It should be noted that this roadmap applies only to the Verto software and not to the other tools and utilities such as vDex which will have their own teams and dedicated roadmaps.

> Everything contained in this document is in draft form and subject to change at any time and provided for information purposes only. Volentix does not guarantee the accuracy of the information contained in this roadmap and the information is provided “as is” with no representations or warranties, express or implied.

- [Version 1](#version-1)
  * [Features](#features)
    + [1 Build Pipeline](#1-build-pipeline)
    + [2 Webview vs Electron](#2-webview-vs-electron)
    + [3 Sovereign Identity](#3-sovereign-identity)
    + [4 Third Party Plugins](#4-third-party-plugins)
    + [5 Installer](#5-installer)
    + [6 2FA Research](#6-2fa-research)
  * [Phases](#phases)
    + [1 Architecture](#1-architecture)
      - [Duration](#duration)
      - [Goal](#goal)
      - [SPS Team Members](#sps-team-members)
      - [Estimate](#estimate)
      - [Outcome](#outcome)
    + [2 System Setup](#2-system-setup)
      - [Duration](#duration-1)
      - [SPS Team Members](#sps-team-members-1)
      - [Estimate](#estimate-1)
      - [Outcome](#outcome-1)
    + [3 Development](#3-development)
      - [Estimated Duration](#estimated-duration)
      - [Goal](#goal-1)
      - [SPS Team Members](#sps-team-members-2)
      - [Outcome](#outcome-2)
  * [Dependencies](#dependencies)
      - [Items](#items)


# Version 1

```
Note:

Only the desktop version of the software is considered within scope for the v1 release. Follow up releases will be applied to all other platforms in order to catch up. The desktop version was selected as it supports the integration of all features.
```

## Features

The following outlines the necessary features required in order to meet the objective for a verion 1 release of Verto. All facets are to be considered complete before a final version 1 release.

In short, this version will focus on the following: 

1. Maximization of Security
2. Data Sovereignty
3. Third Party Plugin Mechanics
4. Build Integrity

In order to accomplish our goal, we will break down this roadmap into the following features.

### 1 Build Pipeline

#### Goal

The goal of this feature is to create a build pipeline that will, upon all pull requests, build and test the software for all platforms. 

#### Outcomes

For this phase of development, we are looking at an MVP with the following tasks:

1. Linter
2. Automated Security Audit
3. Test suite
4. Build artifacts

Out of scope, for the first version:
1. Release Management
2. E2E 
3. Platform specific test

### 2 Webview vs Electron

#### Goal

The goal of this phase is:
1. Research
2. Impact assessment
3. Estimation of effort

#### Notes

Note that `feature` is to conclude in a `go/no go` decision on moving off of Electron and onto Webview. In the event that it has impacts on the release of V1, this roadmap will be updated.

Although security is the primary objective for this feature, we must also look at the impacts of autoupdating the system.

#### Outcomes

1. Go / No Go decision on the migration efforts for migrating to webview
2. Updated roadmap to reflect the deccision made

### 3 Sovereign Identity

#### Goal

The goal of this phase is to create the MVP for the management of identity within Verto. This MVP includes:
1. Local storage

#### Outcomes
V1 only has local storage.
V2 Gateways to other SIs.

###  4 Third Party Plugins

App extension that is the host for these plugins.
- html
- js
- css

Third party plugin review, acceptance and publication process.
 - Technical review committee... to be community managed over time.


Distribution:
  P2P under investigation via GUN (version 2.X)

Sandbox.

### 5 Installer
Light App
- download and start the latest stable release for your platform
- allow to integrate plugins


### 6 2FA Research

The goal of this feature is to create a proposal for 2fa.

## Phases

The workload above will be broken down into phases.

### 1 Architecture

#### Duration
XXX days

#### Goal
In this phase:

1. Research will be conducted
2. Documenation repo set up
3. System level documentation

#### SPS Team Members
1 System Architect - 100%
1 Senior Developer - 50%

#### Estimate
High level (+- 100%) estimates on the level of effort.

#### Outcome
1. Architecture components selected.
2. System architecture documented and avaiilable for public review

### 2 System Setup

#### Duration
XXX days

**Goal**
This phase is about setting up the system for developers to begin developing the features in a clear, productive, and intuative way. This, in general, consists of the following facets:
1. Build infrastructure: This is the local build as well as CI build environments.
2. Developer experience: Tools that facilite the developers experience and maximize their contribution.
3. Documentation: The strategy, location, and management of documentation as the system begins to take form.

Additional goals, outside of engineering, is to publish broadly in order to receive community feedback on the direction of the architecture.

#### SPS Team Members
- 1 System Architect - 100%
- 1 Senior Developer - 50%
- 1 Security Analyst - 25%

#### Estimate
High level (+- 100%) estimates on the level of effort.

#### Outcome
1. Build integrity complete with local and CI build functions.
2. Developer experience maximized for broader community contributions.
3. Community feedback channels created and monitored

### 3 Development

#### Estimated Duration
XXX days

Perhaps we can break this down from a feature level

#### Goal
This is the phase of developing a feature and preparing it for release. The phase follows the guidelines for Volentix such as:
1. Code lifecycle management
2. Documentation
3. Security

For a full description of the documenation process please see [our documenation.](https://volentixdocumenation.readthedocs.io/en/latest/partnership/featureLifecycle.html)

#### SPS Team Members
- 1 Security Analyst - 25%
- 1 System Architect - 25%
- 2 Senior Developer - 100%
- 2 Junior Developer - 100%

#### Outcome
1. Features meetings the standards of Volenix and is ready for release.

## Dependencies

In some cases, dependencies between other systems and other teams exist in order to facilitate a feature's completion. For example, VDex may be required to publish an API in order for Verto to consume it.

#### Items 
There are no known dependencies at this time.

## Summary

asdas