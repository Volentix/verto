# Verto Authorization

  * [Intro](#intro)
  * [Other Peoples Good Ideas](#other-peoples-good-ideas)
  * [Unique Feature](#unique-feature)
  * [Encrypted At Rest](#encrypted-at-rest)
  * [Current State](#current-state)
  
## Intro

The goals of Verto authorization is to ensure users have access to desperate security services based on their own needs. For example, a user with small holdings may prefer ease of use over hardened security. In other cases, the user will require more complex protocols as they house significant holdings. In the former, a simple password may be sufficient, but the later will require hardware security features as well.

## Other Peoples Good Ideas

The following section holds the links to interesting articles and projects that will be referencial when designing the auth system security for Verto.

[Speakeasy](https://github.com/speakeasyjs/speakeasy) may be a little out of date, however, it seems to have a good overview to consider. It talks about standards like [otpauth](https://www.npmjs.com/package/otpauth) which may or may not be worth investigating.

[Q-Vault](https://github.com/Q-Vault/qvault) is a password manager system for the desktop. Some research is required to see of they have a pluggable architecture that we would be able to use. To read more, [see this article](https://medium.com/@lane.c.wagner/qvaults-dual-encryption-a224ce3de0)

## Unique Feature

One of the things that makes Verto unique is that it stores all configuration information locally. There is no, at this time, any backup services or centralized repos for recovery management. Ideally, in the future, Verto will be able to integrate into such a system easily. For now, we are concerned with local storage.

## Encrypted At Rest

It goes without saying... but we will say it anyways. Data is always encrypted at rest. For now, Verto uses the underlying file-system as its storage and retrieval layer. However, future versions of Verto may require different mechanics for such tasks. Regardless of the underlying platform, Verto will always store the data encrypted at rest.

## Current State

Currently, the user password is used to encrypt and decrypt the user data. No multi-tenancy exists. 

The algo uses the [Standford Javascript Crypto Library](https://github.com/bitwiseshiftleft/sjcl). This should be reviewed before moving forward.
