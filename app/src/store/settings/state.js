export default {
  newSettingsPage: false,
  rightOrder: false,
  network: 'mainnet',
  devMode: false,
  globalSettings: {},
  activityBar: false,
  coins: {
    coinswitch: [],
    oneinch: [],
    defibox: [],
    godex: []
  },
  show: {
    exchange: false,
    tokens: false,
    vtxstaking: false,
    tab: 'dashboard'
  },
  chainsSendEnabled: ['eos', 'eth', 'dot', 'ksm', 'bsc', 'avax', 'avaxc', 'matic', 'ftm', 'btc'],
  backupConfig: false,
  defiMenu: 'swap',
  isDemo: false,
  selectedDex: 'defibox',
  dexData: {
    depositCoin: null,
    destinationCoin: null,
    fromAmount: null
  },
  eos: {
    swapSlippage: 3
  },
  lightMode: true
}
