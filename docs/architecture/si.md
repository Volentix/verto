# Sovereign Identity Architecture

In order to begin the documenation process, the following notes where taken out of the roadmap document in favor of collenting them here for now until this document is extended.

**Specs**
The more post MVP will provide access to other SI networks. So it is noted that the MVP holds compliance with the [W3C spec on digital identity](https://w3c-ccg.github.io/did-spec/).
Additional reading includes the [Sovrin Whitepaper](https://sovrin.org/wp-content/uploads/Sovrin-Protocol-and-Token-White-Paper.pdf) as well as its underlying specification for [JSON-LD](https://json-ld.org/)

It was also mentioned, that 3rd party applications will need to publish their own JSON-LD files to be included in the marketplace. This must be considered as the `curators` will need to manage their data based on the JSON-DL spec. Note that the spec must be able to import, or extend, other specs as well

**Storage**
Current thinking is to use [GunDB](https://gun.eco/) graph database as the mechanic to store and secure data. An issue that needs to be resolved is on the mechanic, using the decentralized mesh of GunDB, we can isolate data sharing without broadcasting it to the whole network. Meaning, if:

1. We have 3 users on the network. UserA, UserB, and UserC.
2. UserA is friends with both UserB and UserC
3. UserB and UserC do not share data

In this scenario, data from UserB MUST NOT be copied, even if it is encrypted, onto UserC storage or vice-versa.

One way is to have separate graphs for different shared data and personas.... not sure of the expense of doing that. Additionally, should this approach be taken, we could have update graphs and security graphs...

Another thing that was brough up was being able to multi-sig data. For example:

1. Three users exist. One is the original owner of the data.
2. The user wants to back up the data and replicate it, encrypted, but on 2 of their friends graphs
3. In the case of emergency, the two friends would be able to unlock the data. But one of the friends, without the other friend, will not be able to open and view the data.

**Personas**
Multitenant Persona Management (DID... the work you, the friend you, the brother you)

**Misc**

It was recommended to look at the ZeroMQ guys stuff for [some ideas on the management of data}(http://zguide.zeromq.org/page:all)
