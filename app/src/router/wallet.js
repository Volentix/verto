export default [
  {
    path: '/new-skin',
    // component: () => import('layouts/Default.vue'),
    component: () => import('layouts/Intro.vue'),
    children: [
      {
        name: 'landing',
        path: '/new-skin/landing',
        component: () => import('pages/NewSkin/Landing.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'secret-words',
        path: '/new-skin/secret-words',
        component: () => import('pages/NewSkin/SecretWords.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'create-verto-password',
        path: '/new-skin/create-verto-password',
        component: () => import('pages/NewSkin/CreateVertoPassword.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'confirm-verto-password',
        path: '/new-skin/confirm-verto-password',
        component: () => import('pages/NewSkin/ConfirmVertoPassword.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'create-restore-secret-seed-phrase',
        path: '/new-skin/create-restore-secret-seed-phrase',
        component: () => import('pages/NewSkin/CreateRestoreSecret.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'recovery-seed',
        path: '/new-skin/recovery-seed',
        component: () => import('pages/NewSkin/RecoverySeed.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'dashboard',
        path: '/new-skin/dashboard',
        component: () => import('pages/NewSkin/Dashboard.vue'),
        meta: {
          authRequired: false
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        name: 'profile',
        path: '/profile',
        component: () => import('pages/NewSkin/Profile.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wallets',
        path: '/wallets',
        component: () => import('pages/NewSkin/Wallets.vue'),
        meta: {
          authRequired: true
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
        name: 'wallets',
        path: 'wallets',
        component: () => import('pages/Wallet/Wallets.vue'),
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
