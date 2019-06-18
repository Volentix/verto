# Vision Document

  * [Vision](#vision)
  * [Principles](#principles)
    + [Principle 1: Anonymity](#principle-1-anonymity)
    + [Principle 2: Sovereign Identity (SI)](#principle-2-sovereign-identity-si)
    + [Principle 3: Decentralized](#principle-3-decentralized)
    + [Principle 4: Extensibility](#principle-4-extensibility)
    
## Vision

Easy Anonymity.  

## Principles

From day one, we have stuck to a few principles that drive decisions for integrating value into Verto. These principles are founded on the need to ensure users remain anonymous on the network. At times, this made the work more difficult. It would be easy to solution using common patterns for more user friendly workflows when the business asks for them, however, by agreeing on principles at the outset of the project we are able to ensure the integrity, and final vision, of Verto remains intact.

### Principle 1: Anonymity

The user must remain anonymous on the network in as much as is possible. In order to do that, the following rules apply:

 1. All configuration data is the responsibility of the user
 2. Verto does not not track the users usage
 3. Only the Verto public key is shared with integrated services by default
 4. Users decide what services are integrated into the wallet

### Principle 2: Sovereign Identity (SI)

The idea of SI needs to be a first class citizen within Verto, however, as most services will manage their data themselves, we must also accommodate centralized services as well. In order to accomplish this goal, Verto passes in the Verto public address of the current wallet to integrated services. In this fashion, centralized services can leverage the public id to associate themselves to a Verto user.


### Principle 3: Decentralized

As with Principle 2, we need to face the realities of the world we live in. While running, Verto requires no centralized service as all the configuration information is managed by the user on their device(s). However, we are still using centralized services like Github for version updates and S3 for web hosting. Overtime we expect to overcome these shortcomings in order to provide 100% decentralized utility.

### Principle 4: Extensibility

Everyone seems to want to make a wallet for their DApp. Verto is envisioned to allow third party developers to write plugins that further extend the value of Verto even from communities outside the Volentix ecosystem. It will also be able to protect the users from nefarious integration through an extensive governance process and cryptographic proofs.


