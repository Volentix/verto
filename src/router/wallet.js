export default [
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        name: 'get-vtx',
        path: 'get-vtx',
        component: () => import('pages/GetVtx/GetVtx.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'settings',
        path: '/settings',
        component: () => import('pages/Settings/Settings.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'begin-get-vtx',
        path: 'begin-get-vtx',
        component: () => import('pages/GetVtx/BeginGetVtx.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'summary-vtx',
        path: 'summary-vtx',
        component: () => import('pages/GetVtx/Summary.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'zixipay-get-vtx',
        path: 'zixipay-get-vtx',
        component: () => import('pages/Zixipay/GetVtx.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'zixipay-iframe',
        path: 'zixipay-iframe',
        component: () => import('pages/Zixipay/IFrame.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'crowd-sale',
        path: 'crowd-sale',
        component: () => import('pages/GetVtx/CrowdSale.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'request-native-chain-address',
        path: 'request-native-chain-address',
        component: () => import('pages/GetVtx/RequestNativeChainAddress.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'associate-venue',
        path: 'associate-venue',
        component: () => import('pages/Wallet/AssociateVenue.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'pending-transactions',
        path: 'pending-transactions',
        component: () => import('pages/Wallet/PendingTransactions.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'vdexnodes',
        path: '/vdexnodes',
        component: () => import('pages/vDex/Nodes.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'wallet',
        path: 'wallet',
        component: () => import('pages/Wallet/Wallet.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'change-password',
        path: 'change-password',
        component: () => import('pages/Wallet/ChangePassword.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'vertomanager',
        path: 'vertomanager',
        component: () => import('pages/manager/VertoManager.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'associations',
        path: '/associations',
        component: () => import('pages/Intro/Associations.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'eos-make-payment',
        path: 'eos-make-payment/:vtxbalance/:eosbalance',
        component: () => import('pages/Wallet/EosMakePayment.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'restore-wallet',
        path: 'restore-wallet/:returnto',
        component: () => import('pages/Wallet/RestoreWallet.vue'),
        meta: {}
      },
      {
        name: 'view-ledger-transactions',
        path: 'view-ledger-transactions',
        component: () => import('pages/Wallet/ViewLedgerTransactions.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'add-private-key',
        path: 'add-private-key',
        component: () => import('pages/manager/AddPrivateKey.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'remove-private-key',
        path: 'remove-private-key',
        component: () => import('pages/manager/RemovePrivateKey.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'delete-wallet',
        path: 'delete-wallet/:wallet',
        component: () => import('pages/manager/DeleteWallet.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'change-default',
        path: 'change-default/:wallet',
        component: () => import('pages/manager/ChangeDefault.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }
    ]
  }
]
