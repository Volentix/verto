export default {
  newSettingsPage: false,
  rightOrder: false,
  network: 'mainnet',
  devMode: false,
  globalSettings: {},
  coins: {
    coinswitch: [],
    oneinch: [],
    defibox: [],
    godex: []
  },
  chainsSendEnabled: ['eos', 'eth', 'dot', 'ksm', 'bsc', 'avax', 'avaxc', 'matic', 'ftm'],
  backupConfig: false,
  defiMenu: 'swap',
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
