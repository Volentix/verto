export default {
  newSettingsPage: false,
  rightOrder: false,
  network: 'mainnet',
  accountTab: null,
  components: {},
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
  projects: [
    {
      title: 'FreePulse.io',
      id: 'freepulseio',
      chain: 'tpls',
      icon: 'https://freepulse.io/_assets/img/logo.png',
      tokens: [],
      website: 'https://freepulse.io',
      telegram: 'https://t.me/FreePulse',
      twitter: 'https://twitter.com/FreePulseio',
      type: 'project',
      featuredVideo: 'QnO-5cM6b8s',
      description:
        'Claim up to $200 of free PLS / hour. A possible onboarding tool for @PulseChainCom.'
    }, {
      title: 'Liquid loans',
      id: 'liquid-loans',
      chain: 'tpls',
      icon: 'https://pbs.twimg.com/profile_images/1478148626605957122/nUTE6oYY_400x400.jpg',
      tokens: [],
      website: 'https://liquidloans.io/',
      telegram: 'https://t.me/liquidloans',
      twitter: 'https://twitter.com/liquidloansio/',
      type: 'project',
      youtube: 'https://www.youtube.com/c/liquidloans',
      featuredVideo: 'iNKMhHub64o',
      description:
        'Liquid Loans is the first truly decentralized lending protocol built specifically for PulseChain. Algorithmic Stablecoin. Low 110% Collateral Ratio. No Repayment Schedule. Immutable. Governance-Free. No Admin Keys.'
    }, {
      title: 'Hedron',
      id: 'hedron',
      chain: 'tpls',
      icon: 'https://pbs.twimg.com/profile_images/1469438286452121605/oDLrCcI6_400x400.png',
      tokens: [],
      website: 'https://hedron.pro',
      telegram: 'https://t.me/HedronCrypto',
      featuredVideo: 'sRMXhL6PEfU',
      twitter: 'https://twitter.com/HedronCrypto',
      type: 'project',
      youtube: '',
      description:
        'Hedron (HDRN) is a collection of smart contracts that live on the Ethereum and PulseChain blockchain(s). Hedron builds on top of HEX to allow stakers to mint and borrow HDRN tokens against their active HEX stakes. Hedron also allows stakers to trade their HEX stakes as NFT tokens on any compatible NFT marketplace. Hedron has no admin keys and no kill switches. Just like HEX, Hedron is completely decentralized with zero counterparty risk.'
    }, {
      title: 'Pulsedoge',
      id: 'pulsedoge',
      chain: 'tpls',
      icon: 'https://pulsedoge.win/wp-content/uploads/2021/08/2021-08-16-16.27.40.jpg',
      tokens: [],
      website: 'https://pulsedoge.win/',
      telegram: 'https://t.me/Pulsedoge',
      twitter: 'https://twitter.com/pulsedogewin',
      type: 'project',
      description:
      'Pulsedoge is a community meme token on Binance Smart Chain. We’re here to bring adoption to PulseChain, and show the world which doge has the biggest swinging bollocks in crypto. All holders will receive an equal 1 : 1 airdrop on PulseChain at launch.'
    }, {
      title: 'NFTonpulse',
      id: 'nftonpulse',
      chain: 'tpls',
      icon: 'https://nftonpulse.io/assets/img/nft_line_final2_black.svg',
      tokens: [],
      website: 'https://nftonpulse.io/',
      telegram: 'https://t.me/nftonpulse',
      twitter: 'https://twitter.com/nftonpulse',
      type: 'project',
      description:
      'NFTonPulse.io is a decentralized peer-to-peer marketplace. Buy, sell, trade, auction NFTs, and other non-fungible tokens all powered by the Pulse blockchain.'
    }, {
      title: 'Verto',
      id: 'verto',
      featuredVideo: 'zfhdTLBbZm4',
      chain: 'tpls',
      icon: 'https://verto.volentix.io/statics/icons/vtx-logo-1024x1024.png',
      tokens: [],
      website: 'https://verto.volentix.io/',
      twitter: 'https://twitter.com/volentix',
      type: 'project',
      telegram: 'https://t.me/Volentix',
      youtube: 'https://www.youtube.com/channel/UCGjUbCE-kht1gK6y5neD1cQ',
      description:
        'Verto is an extension being built as a multi-chain wallet for integrating sovereign services into one, user controlled and managed, anonymous, and decentralized tool. The focus of Verto is to simplify the usage of blockchain technology in a way that is intuative for those unfamiliar with the technology.'
    }, {
      title: 'Pulsex',
      id: 'pulsex',
      featuredVideo: 'LZJVx0auUcI',
      chain: 'tpls',
      icon: 'https://pbs.twimg.com/profile_images/1472191685736255489/oYHR8Nqd_400x400.jpg',
      tokens: [],
      website: 'https://pulsex.com/',
      twitter: 'https://twitter.com/PulseXcom',
      type: 'project',
      telegram: 'https://t.me/PulseXcom',
      youtube: 'https://www.youtube.com/c/RichardHeart',
      description:
        "PulseX enables you to exchange tokens ('PRC20s') on PulseChain for one another. For example you could swap PulseChain's native token PLS for PulseX's token PLSX. It works like Uniswap on Ethereum. Bridges also let people trade currencies from other chains on PulseX."
    }, {
      title: 'HeartDefi',
      chain: 'tpls',
      id: 'heartDefi',
      icon: 'https://images-na.ssl-images-amazon.com/images/I/71koX05yioL._AC_SL1500_.jpg',
      tokens: [],
      website: '',
      twitter: '',
      type: 'project',
      youtube: '',
      description:
        'The portal to the Pulsechain ecosystem. 1 place to access everything you need for Pulse Chain DeFi and decentralized crypto in general.'
    }
  ],
  show: {
    exchange: false,
    tokens: false,
    vtxstaking: false,
    tab: 'dashboard'
  },
  chainsSendEnabled: ['eos', 'bnb', 'eth', 'dot', 'ksm', 'bsc', 'avax', 'avaxc', 'matic', 'ftm', 'btc', 'terra'],
  disableChains: ['xtz', 'xlm', 'ltc', 'dash'],
  importDisabled: ['bnb', 'dot', 'ksm', 'avax', 'sol'],
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
  lightMode: true,
  upvotes: [],
  comments: [],
  replies: [],
  subscribed_comments: null,
  subscribed_replies: null
}
