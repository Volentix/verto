Vision
=============

Easy Anonymity

============
Principles
============

From day one, we have stuck to a few principles that drive decisions for integrating value into Verto. These principles are founded on the need to ensure users remain anonomous on the network. At times, this made the work more difficult. It would be easy to solution using common patterns for more user friendly workflows when the business asks for them, however, by agreeing on principles at the outset of the project we are able to ensure the integrity, and final vision, of Verto remains intact.

Principle 1: Anonymity
-----------------------

The user must remain anonmous on the network in as much as is possible. In order to do that, the following rules apply:

  1. All configuration data is the responsibility of the user
  2. Verto does not not track the users usage
  3. Only the Verto public key is shared with integrated services by default
  4. Users decide what services are integrated into the wallet

Principle 2: Sovereign Identity (SI)
-------------------------------------

The idea of SI needs to be a first class citizen within Verto, however, as most services will manage their data themselves, we must also accomodate centralized services as well. I order to accomoplish this goal, Verto passes in the Verto public address of the current wallet to integrated services. In this fashion, centralized services can leverage the public id to associate themselves to a Verto user.


Principle 3: Decentralized
------------------------------

As with Principle 2, we need to face the reailties of the world we live in. While running, Verto requires no centralized service as all the configuation information is managed by the user on their device(s). However, we are still using centralized services like Github for version updates and S3 for web hosting. Overtime we expect to overcome these shortcommings in order to provide 100% decentralized utility.