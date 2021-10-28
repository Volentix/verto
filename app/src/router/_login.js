let shared_auth_urls = [
]
if (process.env.MODE === 'bex' || window.screen.width < 500) {
  shared_auth_urls = [
    {
      name: 'storesync',
      path: '/storesync',
      component: () => import('pages/Verto/bex/StorageSync.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('pages/Verto/bex/Landing.vue')
    },
    {
      name: 'import-restore',
      path: '/import-restore',
      component: () => import('pages/Verto/bex/ImportOrRestore.vue')
    },
    {
      name: 'setup',
      path: '/setup',
      component: () => import('pages/Verto/bex/Setup.vue')
    },
    {
      name: 'create-password',
      path: '/create-password',
      component: () => import('pages/Verto/bex/CreateVertoPassword.vue')
    },
    {
      name: 'create--password-recover',
      path: '/create-password/:recover',
      component: () => import('pages/Verto/bex/CreateVertoPassword.vue')
    },
    {
      name: 'recovery-seed',
      path: '/recovery-seed',
      component: () => import('pages/Verto/bex/RecoverySeed.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'create-keys',
      path: '/create-keys',
      component: () => import('pages/Verto/bex/CreateKeys.vue'),
      meta: {
        authRequired: true
      }
    },

    {
      name: 'import-restore',
      path: '/import-restore',
      component: () => import('pages/Verto/bex/ImportOrRestore.vue')
    },
    {
      name: 'setup',
      path: '/setup',
      component: () => import('pages/Verto/bex/Setup.vue')
    },
    {
      name: 'create-password',
      path: '/create-password',
      component: () => import('pages/Verto/bex/CreateVertoPassword.vue')
    },
    {
      name: 'create--password-recover',
      path: '/create-password/:recover',
      component: () => import('pages/Verto/bex/CreateVertoPassword.vue')
    },
    {
      name: 'recovery-seed',
      path: '/recovery-seed',
      component: () => import('pages/Verto/bex/RecoverySeed.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'create-keys',
      path: '/create-keys',
      component: () => import('pages/Verto/bex/CreateKeys.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'verto',
      path: '/verto',
      component: () => import('pages/Verto/bex/CreateVertoPassword.vue'),
      meta: {}
    }
  ]
} else {
  console.log('else route path')
  shared_auth_urls = [
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
      component: () => import('pages/Verto/RecoverySeed.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'create-keys',
      path: '/create-keys',
      component: () => import('pages/Verto/CreateKeys.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'create-password',
      path: '/create-password',
      component: () => import('pages/Verto/CreateVertoPassword.vue')
    },
    {
      name: 'create--password-recover',
      path: '/create-password/:recover',
      component: () => import('pages/Verto/CreateVertoPassword.vue')
    },
    {
      name: 'recovery-seed',
      path: '/recovery-seed',
      component: () => import('pages/Verto/RecoverySeed.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'create-keys',
      path: '/create-keys',
      component: () => import('pages/Verto/CreateKeys.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      name: 'verto',
      path: '/verto',
      component: () => import('pages/Verto/CreateVertoPassword.vue'),
      meta: {}
    }
  ]
}
let redirectRoute = {}
if (process.env.MODE === 'bex') {
  redirectRoute = { name: 'storesync' }
} else {
  redirectRoute = { name: 'login' }
}

export default [
  {
    path: '/',
    redirect: redirectRoute
  },
  {
    name: 'intro',
    path: '/intro',
    component: () => import('layouts/Intro.vue'),
    children: [
      ...shared_auth_urls,
      {
        name: 'login',
        path: '/login/transaction/:fromCoin/:toCoin/:amount',
        component: () => import('pages/Verto/ConnectToVerto.vue')
      }, {
        name: 'login',
        path: '/login/:nextUrl',
        component: () => import('pages/Verto/ConnectToVerto.vue')
      },
      {
        name: 'connect',
        path: '/connect/:session',
        component: () => import('pages/Verto/ConnectToVerto.vue')
      },
      {
        name: 'sign',
        path: '/sign/:txId/:session',
        component: () => import('pages/Verto/ConnectToVerto.vue')
      },
      {
        name: 'cruxpay',
        path: '/cruxpay/:fromStep',
        component: () => import('pages/Verto/CruxPaySetup.vue'),
        meta: {
          authRequired: false
        }
      },
      // {
      //   path: '/vdexnode/login',
      //   component: () => import('pages/vDexNode/Login.vue'),
      //   meta: {
      //     requiresAuth: true
      //   }
      // },
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
        name: 'restore-wallet',
        path: 'restore-wallet/:returnto',
        component: () => import('pages/Wallet/RestoreWallet.vue'),
        meta: {}
      }
    ]
  }
]
