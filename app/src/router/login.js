export default [
  {
    path: '/',
    redirect: { name: 'login' }
  },
  {
    name: 'intro',
    path: '/intro',
    component: () => import('layouts/Intro.vue'),
    children: [
      {
        name: 'login',
        path: '/login',
        component: () => import('pages/Verto/Landing.vue')
      },
      {
        name: 'create-password',
        path: '/create-password',
        component: () => import('pages/Verto/CreateVertoPassword.vue')
      },
      {
        name: 'recovery-seed',
        path: '/recovery-seed',
        component: () => import('pages/Verto/RecoverySeed.vue')
      },
      {
        name: 'create-wallet-options',
        path: '/create-wallet-options',
        component: () => import('pages/Intro/CreateWalletOptions.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'add-verto-wallet',
        path: '/add-verto-wallet',
        component: () => import('pages/Intro/AddVertoWallet.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'create-keys',
        path: '/create-keys',
        component: () => import('pages/Intro/CreateKeys.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'eos-account',
        path: '/eos-account',
        component: () => import('pages/Wallet/EosAccount.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'exchange',
        path: '/exchange',
        component: () => import('pages/Exchange/CoinSwitch.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'save-to-file',
        path: '/save-to-file',
        component: () => import('pages/Intro/SaveToFile.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'write-it-down',
        path: '/write-it-down',
        component: () => import('pages/Intro/WriteItDown.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'Verto',
        path: '/Verto',
        component: () => import('pages/Verto/CreateVertoPassword.vue'),
        meta: {}
      },
      {
        name: 'restore-wallet',
        path: 'restore-wallet/:returnto',
        component: () => import('pages/Wallet/RestoreWallet.vue'),
        meta: {}
      }
    ]
  }
]
