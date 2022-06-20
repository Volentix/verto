
let routes = []

if (process.env.QMODE !== 'bex') {
  routes = [ // {
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
    /* {
      name: 'HearDefiDashboard',
      path: '/account/:key?',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('pages/Heartdefi/LandingPage.vue') }
      ]
    },
    {
      name: 'Connect',
      path: '/connect/:action',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('pages/Heartdefi/LandingPage.vue') }
      ]
    }, {
      name: 'Bridge',
      path: '/Bridge',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/HeartDefi/Bridge.vue') }
      ]
    }, {
      name: 'HearDefiDashboard',
      path: '/',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('pages/Heartdefi/LandingPage.vue') }
      ]
    },
    {
      name: 'pulsexsac',
      path: '/pulsexsac/:key',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/Heartdefi/Sacrifices.vue') }
      ]
    },
    { name: 'HearDefiHistory',
      path: '/account/:key/history',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('pages/Verto/History.vue') }
      ]
    }, { name: 'HearDefiCommunity',
      path: '/community',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/HeartDefi/NewsArea.vue') }
      ]
    }, { name: 'HearDefiProjects',
      path: '/projects',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/HeartDefi/Projects.vue') }
      ]
    }, { name: 'HearDefiProjects',
      path: '/project/:projectId',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/HeartDefi/ProjectDetails.vue') }
      ]
    }, { name: 'HearDefiCommunity',
      path: '/community/:platform/:id',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/HeartDefi/NewsArea.vue') }
      ]
    },
    {
      path: '/heart-layout',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('pages/Heartdefi/LandingPage.vue') }
      ]
    }, {
      path: '/heart-intro',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('pages/Heartdefi/Intro.vue') }
      ]
    }, {
      path: '/list',
      component: () => import('layouts/HeartDefi.vue'),
      children: [
        { path: '', component: () => import('components/HeartDefi/ListProject.vue') }
      ]
    } /*,
    {
      path: '/',
      component: () => import('layouts/staiderLayout.vue'),
      children: [
        {
          path: '/staider/fund/:fundID',
          component: () => import('components/Staider/SingleFund.vue')
        },
        {
          path: '/staider/dashboard',
          component: () => import('components/Staider/Fund/Dashboard.vue')
        },
        {
          path: '/staider/explore'
        },
        { component: () => import('pages/Staider/Faqs.vue'),
          path: '/staider/faqs'
        },
        {
          path: '/staider/private',
          component: () => import('components/Verto/Token/AssetsExplorer.vue')
        }
      ]
    }

 {
      path: '/te',
      component: () => import('layouts/staiderLayoutNewPrototype.vue'),
      children: [
        {
          path: '/te/staider-new-prototype/summary',
          meta: { site: false },
          component: () => import('pages/StaiderPrototype/Summary.vue')
        },
        {
          path: '/te/staider-new-prototype/vault',
          meta: { site: false },
          component: () => import('pages/StaiderPrototype/Vault.vue')
        },
        {
          path: '/te/staider-new-prototype/vaults',
          meta: { site: true },
          component: () => import('pages/StaiderPrototype/Vaults.vue')
        },
        {
          path: '/te/staider-new-prototype/landing',
          meta: { site: true },
          component: () => import('pages/StaiderPrototype/Landing.vue')
        },
        {
          path: '/te/staider-new-prototype/landing/:currentSection',
          meta: { site: true },
          component: () => import('pages/StaiderPrototype/Landing.vue')
        }
      ]
    },    */{
      path: '/',
      component: () => import('layouts/Staider/MainLayout.vue'),
      children: [
        { meta: {
          site: true
        },
        path: '/',
        component: () => import('pages/StaiderPrototype/Landing.vue')
        },
        {
          path: '/vaults',
          meta: { site: true },
          component: () => import('pages/StaiderPrototype/Vaults.vue')
        },
        {
          path: '/summary',
          component: () => import('pages/Staider/Summary.vue')
        },
        {
          path: '/vault/:fundID',
          component: () => import('components/Staider/Vault.vue')
        },
        {
          path: '/privacy-policy',
          meta: { site: true },
          component: () => import('pages/StaiderPrototype/PrivacyPolicy.vue')
        },
        {
          path: '/terms-of-Use',
          meta: { site: true },
          component: () => import('pages/StaiderPrototype/TermsOfUse.vue')
        }
      ]
    } /*
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
    } */
  ]
}
export default routes
