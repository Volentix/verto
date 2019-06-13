# Verto Roadmap

This document outlines the development plan from a high level and will be updated as the project progresses. It should be noted that this roadmap applies only to the Verto software and not to the other tools and utilities such as vDex which will have their own teams and dedicated roadmaps.

- [Version 1](#version-1)
  * [Features](#features)
    + [Build Pipeline](#build-pipeline)
    + [Webview vs Electron](#webview-vs-electron)
    + [Sovereign Identity](#sovereign-identity)
    + [Third Party Plugins](#third-party-plugins)
    + [Installer](#installer)
    + [2FA Research](#2fa-research)
  * [Phases](#phases)
    + [1 Architecture](#1-architecture)
    + [2 System Setup](#2-system-setup)
    + [3 Development](#3-development)
  * [Assumptions](#assumptions)
  * [Dependancies](#dependancies)
  * [Summary](#summary)$

**Everything contained in this document is in draft form and subject to change at any time and provided for information purposes only. Volentix does not guarantee the accuracy of the information contained in this roadmap and the information is provided “as is” with no representations or warranties, express or implied.**

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

### Build Pipeline

**When:** ???

The goal of this feature is to create a build pipeline that will, upon all pull requests, build and test the software for all platforms. For this phase of development, we are looking at an MVP with the following tasks:

1. Linter
2. Automated Security Audit
3. Test suite
4. Build artifacts

Out of scope, for the first version:
1. Release Management
2. E2E 
3. Platform specific test

### Webview vs Electron
Research and POC

go/nogo we will update the roadmap once a decision is made.
Autoupdate.

### Sovereign Identity
V1 only has local storage.
V2 Gateways to other SIs.

Multitenant Persona Management

Schema
  GraphmL
  Existing Spec? Metadata section
    Sovrn whitepaper: 
      https://sovrin.org/wp-content/uploads/Sovrin-Protocol-and-Token-White-Paper.pdf
      W3C: https://w3c-ccg.github.io/did-spec/
      JSON-LD: https://json-ld.org/

Storage
  GunDB: https://gun.eco/
    all data is encrypted
    Update graph
    Security graph
    Multi-sig data
    FoaF (Friend of a Friend)
    
  Messaging Reading: http://zguide.zeromq.org/page:all

### Third Party Plugins

App extension that is the host for these plugins.
- html
- js
- css

Third party plugin review, acceptance and publication process.
 - Technical review committee... to be community managed over time.


Distribution:
  P2P under investigation via GUN (version 2.X)

Sandbox.

### Installer
Light App
- download and start the latest stable release for your platform
- allow to integrate plugins


### 2FA Research

The goal of this feature is to create a proposal for 2fa.

## Phases

The workload above will be broken down into phases.

### 1 Architecture

**Duration**
XXX days

**Goal**
In this phase, research will be conducted and generic POC's will be created.

**SPS Team Members**
1 System Architect - 100%
1 Senior Developer - 50%

**Estimate**
High level (+- 100%) estimates on the level of effort.

**Outcome**
1. Architecture components seclected.
2. System architecture documented and avaiilable for public review

### 2 System Setup

**Duration**
XXX days

**Goal**
This phase is about setting up the system for developers to begin developing the features in a clear, productive, and intuative way. This, in general, consists of the following facets:
1. Build infustructure: This is the local build as well as CI build environments.
2. Developer experience: Tools that facilite the developers experience and maximize their contribution.
3. Documenation: The strategy, location, and management of documenation as the system begins to take form.

Additional goals, outside of engineering, is to publish broadly in order to recieve community feedback on the direction of the architecture.

**SPS Team Members**
1 System Architect - 100%
1 Senior Developer - 50%

**Estimate**
High level (+- 100%) estimates on the level of effort.

**Outcome**
1. Build integrity complete with local and CI build functions.
2. Developer experience maximized for broader community contributions.
3. Community feedback channels created and monitored

### 3 Development

**Estimated Duration**
XXX days
Perhaps we can break this down from a feature level

**Goal**
This is the phase of developing a feature and preparing it for release. The phase follows the guidelines for Volentix such as:
1. Code lifecycle management
2. Documentation
3. Security

For a full description of the documenation process please see [our documenation.](https://volentixdocumenation.readthedocs.io/en/latest/partnership/featureLifecycle.html)

**SPS Team Members**
1 System Architect - 25%
X Senior Developer - XX%
X Junior Developer - XX%

**Outcome**
1. Features meetings the standards of Volenix and is ready for release.

## Assumptions

These are the list of assumptions about the roadmap.

## Dependancies

1s

## Summary

asdas