
const routes = [
  // {
  //   path: '/createPassword',
  //   component: () => import('layouts/NoWallet.vue'),
  //   children: [

  //   ]
  // },
  // {
  //   path: '/keepYourKeysafe',
  //   component: () => import('layouts/Default.vue'),
  //   children: [
  //     { path: '', component: () => import('components/createwallet/KeepYourKeysSafe.vue') }
  //   ]
  // },

  // {
  //   path: '/saveToFile',
  //   component: () => import('layouts/Default.vue'),
  //   children: [
  //     { path: '', component: () => import('components/createwallet/SaveToFile.vue') }
  //   ]
  // },
  {
    path: '/blocktopusCreate',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        component: () => import('components/blocktopus/Create.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }
    ]
  },
  {
    path: '/blocktopusAssociate',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        component: () => import('components/blocktopus/Associate.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }
    ]
  },
  {
    path: '/KycError',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        component: () => import('components/blocktopus/KycError.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }
    ]
  },
  {
    name: 'blocktopus-success',
    path: '/blocktopusSuccess',
    component: () => import('layouts/Login-old.vue'),
    children: [
      {
        path: '',
        component: () => import('components/blocktopus/Success.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      }
    ]
  }
]

export default routes
