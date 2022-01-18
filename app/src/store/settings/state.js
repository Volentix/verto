export default {
  newSettingsPage: false,
  rightOrder: false,
  network: 'mainnet',
  accountTab: null,
  devMode: false,
  defaultChainData: null,
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
  chainsSendEnabled: ['eos', 'bnb', 'eth', 'dot', 'ksm', 'bsc', 'avax', 'avaxc', 'matic', 'ftm', 'btc'],
  disableChains: ['xtz', 'xlm', 'ltc', 'dash'],
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
