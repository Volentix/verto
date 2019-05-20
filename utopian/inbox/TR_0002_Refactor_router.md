# Development Task Request - Refactor God Router File Into Smaller Files Based On Directory Structure

![alt text](https://steemitimages.com/p/RGgukq5E6HBM2jscGd4Sszpv94XxHH2uqxMY9z21vaqHt5DacenbPxUP9zMFd4sJTWTa9NX4pjRuZ6TUCaCjwzbkiRDLsfwYMeQRHQRvcbNX1E2qpP5nqNhu5RzWCyL?format=match&mode=fit&width=640 "Verto Multi Platform Portfolio Manager")

## Repository

https://github.com/Volentix/verto

## What is Verto
[Verto](https://volentix.io/verto/) it is the Crypto Asset Manager of a decentraized ecosystem for normal everyday users.

Verto is:

1. User friendly
2. Peer to peer
3. Multi-blockchain
4. Multi-platform
5. Data management controlled by the user

Verto also integrates functionality of other DApps:

1. Orderbook settlement through [VDEX](https://volentix.io/documentation/vdex-whitepaper/)
2. KYC with [Blocktopus](https://blocktopus.io/)
3. Multi-payment gateways like [Zixipay](https://zixipay.com/login)
4. A crypto ratings and rankings dashboard from [Vespucci](https://vespucci.site/)
5. Anonymous coin trading with with [Coinswitch](https://coinswitch.co/)

## Task Request

### Tech

1. [Quasar](https://quasar-framework.org/)
2. [Electron](https://electronjs.org/)

### Goal

As a developer, I want to refactor the router/wallet.js file so that it is broken up into smaller and more digestable pieces.

### Details

Please break down the  src/router/wallet.js file, into multiple files. To do this you will need to create muliple new files for routes as well as wire them into the bootstrapping of the application in the src/router/index.js file.

The breakdown of the file can be based on the current src/pages directory structure that is reflected in the `component` configuration element.

For example, the following, will be placed in the src/router/manager.js file.

```
      {
        name: 'delete-wallet',
        path: 'delete-wallet/:wallet',
        component: () => import('pages/manager/DeleteWallet.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }

```

The following will be placed in the src/router/get-vtx.js

```
    {
        name: 'begin-get-vtx',
        path: 'begin-get-vtx',
        component: () => import('pages/GetVtx/BeginGetVtx.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }
```

All the newly created files will have the following as the parent (as in the src/router/wallet.js file)

```
export default [
    {
        path: '/',
        component: () => import('layouts/Default.vue'),
        children: [
            ... PAGE CONFIGS GO HERE       
        ]
    }
]
```

### What Success Looks Like

The application runs as before and page navigation remains intact and working.

## Bounty

### Prerequisite

In order to receive the VTX bounty, as we are not yet listed, you must:

1. Not be an American citizen
2. KYC with [Blocktopus](https://blocktopus.io/)

### Amount

A bonus amount of VTX tokens matching the BTC value of the Utopian reward will be given. Effectively doubling the rewards for the contributor when working on Volentix related tasks.

### Deadline

<DEADLINE_DETAILS>

## Communication
Contributor can get in touch with us on Discord: https://discord.gg/xDwczRk

## GitHub Account
https://github.com/<GIT_HUB_USER_NAME>