export default [
  {
    path: '/verto',
    component: () => import('layouts/Intro.vue'),
    children: [
      {
        name: 'restoreWallet',
        path: '/verto/restore-wallet/:returnto',
        component: () => import('pages/Verto/RestoreWallet.vue'),
        meta: {}
      },
      {
        name: 'landing',
        path: '/verto/landing',
        component: () => import('pages/Verto/Landing.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'secret-words',
        path: '/verto/secret-words',
        component: () => import('pages/Verto/SecretWords.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'create-verto-password',
        path: '/verto/create-verto-password',
        component: () => import('pages/Verto/CreateVertoPassword.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'confirm-verto-password',
        path: '/verto/confirm-verto-password',
        component: () => import('pages/Verto/ConfirmVertoPassword.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'create-restore-secret-seed-phrase',
        path: '/verto/create-restore-secret-seed-phrase',
        component: () => import('pages/Verto/CreateRestoreSecret.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'recovery-seed',
        path: '/verto/recovery-seed',
        component: () => import('pages/Verto/RecoverySeed.vue'),
        meta: {
          authRequired: false
        }
      },
      {
        name: 'mnemonic2',
        path: '/intro/mnemonic2',
        component: () => import('pages/Intro/Mnemonic.vue')
      }

    ]
  },
  {
    path: '/verto',
    component: () => import('layouts/IntroWithTabs.vue'),
    children: [
      {
        name: 'import-private-key',
        path: '/verto/import-private-key',
        component: () => import('pages/Verto/ImportPrivateKey.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'import-public-key',
        path: '/verto/import-public-key',
        component: () => import('pages/Verto/ImportPublicKey.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'earn',
        path: '/verto/earn',
        component: () => import('pages/Verto/Earn.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'use-referral-account',
        path: '/verto/earn/use-referral-account',
        component: () => import('pages/Verto/UseReferralAccount.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'use-referral',
        path: '/verto/earn/use-referral',
        component: () => import('pages/Verto/UseReferral.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'refer-friend',
        path: '/verto/eos-account',
        component: () => import('pages/Verto/EOSAccount.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'eos-account-name',
        path: '/verto/eos-account/:accountName',
        component: () => import('pages/Verto/EOSAccount.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'stake',
        path: '/verto/stake',
        component: () => import('pages/Verto/Stake.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'exchange',
        path: '/verto/exchange',
        component: () => import('pages/Verto/Exchange.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps',
        path: '/verto/card-wps',
        component: () => import('pages/Verto/WPS.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps-public-proposals',
        path: '/verto/card-wps/public-proposals',
        component: () => import('pages/Verto/WPSPublicProposals.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps-public-proposal-detail',
        path: '/verto/card-wps/public-proposals/proposal/:proposalName',
        component: () => import('pages/Verto/WPSPublicProposalDetail.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps-draft-proposal-detail',
        path: '/verto/card-wps/draft-proposals/proposal/:proposalName',
        component: () => import('pages/Verto/WPSDraftProposalDetail.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps-draft-proposal-edit',
        path: '/verto/card-wps/draft-proposals/proposal/edit/:proposalName',
        component: () => import('pages/Verto/WPSPublicProposalsEdit.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps-public-proposals-create',
        path: '/verto/card-wps/public-proposals/create',
        component: () => import('pages/Verto/WPSPublicProposalsCreate.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wps-public-proposals-draft',
        path: '/verto/card-wps/public-proposals/draft',
        component: () => import('pages/Verto/WPSPublicProposalsDraft.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'send',
        path: '/verto/wallets/send',
        component: () => import('pages/Verto/Send.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'receive',
        path: '/verto/wallets/receive',
        component: () => import('pages/Verto/Receive.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'converter',
        path: '/verto/converter',
        component: () => import('pages/Verto/VTXConverter.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'history',
        path: '/verto/history',
        component: () => import('pages/Verto/History.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'dashboard',
        path: '/verto/dashboard',
        component: () => import('pages/Verto/Dashboard.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'profile',
        path: '/verto/profile',
        component: () => import('pages/Verto/Profile.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'change-password-profile',
        path: '/verto/profile/change-password',
        component: () => import('pages/Verto/ChangePasswordProfile.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wallets',
        path: '/verto/wallets',
        component: () => import('pages/Verto/Wallets.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'wallet',
        path: '/verto/wallets/:chainID/:tokenID/:accountName',
        component: () => import('pages/Verto/WalletDetail.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'privateKey',
        path: '/verto/wallet/privateKey',
        component: () => import('pages/Verto/PrivateKey.vue'),
        meta: {
          authRequired: true
        }
      },
      {
        name: 'coinHistory',
        path: '/verto/wallet/coinHistory',
        component: () => import('pages/Verto/CoinHistory.vue'),
        meta: {
          authRequired: true
        }
      }

    ]
  },
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
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
        name: 'cruxpay',
        path: '/cruxpay',
        component: () => import('pages/CRUX/Dashboard.vue'),
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
        name: 'mnemonic',
        path: 'mnemonic',
        component: () => import('pages/Intro/Mnemonic.vue'),
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
        name: 'hdwallets',
        path: 'hdwallets',
        component: () => import('pages/manager/HDWallets.vue'),
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
        name: 'stakeproxyeos',
        path: '/stakeproxyeos',
        component: () => import('pages/Wallet/StakeProxyEos.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'stakeeos',
        path: '/stakeeos',
        component: () => import('pages/Wallet/StakeEos.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'vtxconverter',
        path: '/vtxconverter/:eosbalance',
        component: () => import('pages/Wallet/VtxConverter.vue'),
        meta: {
          authRequired: true,
          needskeyscreated: true
        }
      },
      {
        name: 'createaccounteos',
        path: '/createaccounteos/:eosbalance',
        component: () => import('pages/Wallet/CreateAccountEos.vue'),
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
