const axios = require('axios')
const Web3 = require('web3')
import store from '@/store'
import abiArray from '../../statics/abi/erc20.json'
import ParaSwapper from './ParaSwap'
import CrosschainDex from '../CrosschainDex'
import Formatter from '@/mixins/Formatter'
import Lib from '..//walletlib'
const Format = Formatter.methods
let ETH = {
  name: 'Ethereum',
  chain: 'eth',
  nativeToken: 'eth',
  icon: 'https://zapper.fi/images/ETH-icon.png',
  provider: 'https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63',
  explorer: 'https://etherscan.io/tx/',
  gas: 'https://ethgas.watch/api/gas',
  network_id: 1
}

let web3 = new Web3(new Web3.providers.HttpProvider(ETH.provider))

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Enzyme {
  constructor () {
    this.fund = null
    this.denominationAssetData = null
    this.contractABIS = {}
    this.realeaseId = null
    this.comptrollerProxy = null
    this.fundData = null
  }
  async assetChange24h () {
    let assets = []
    let data = JSON.stringify({
      'operationName': 'AssetPrices',
      'variables': {
        'currency': 'usd',
        'network': 'ethereum'
      },
      'query': 'query AssetPrices($network: Deployment!, $currency: Currency!) {\n  assetPrices(network: $network, currency: $currency) {\n    id\n    price\n    change24h\n    __typename\n  }\n}'
    })

    let config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://app.enzyme.finance/api/graphql',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    axios(config)

    let response = await axios(config)
    if (response && response.data && response.data.data) {
      assets = response.data.data.assetPrices
    }
    return assets
  }
  async getMonthlyReturns (fundAddress) {
    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    let vaultMonthlyReturns = []
    let data = JSON.stringify({
      'operationName': 'VaultMonthlyReturns',
      'variables': {
        'currency': 'usd',
        'network': 'ethereum',
        'vault': fundAddress
      },
      'query': 'query VaultMonthlyReturns($currency: Currency!, $network: Deployment!, $vault: Address!) {\n  vaultMonthlyReturns(currency: $currency, network: $network, vault: $vault) {\n    yearMonth\n    year\n    month\n    monthlyReturn\n    valid\n    __typename\n  }\n}'
    })

    let config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://app.enzyme.finance/api/graphql',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    let response = await axios(config)
    if (response && response.data && response.data.data && response.data.data.vaultMonthlyReturns) {
      response.data.data.vaultMonthlyReturns.filter(o => o.valid).map(o => {
        let i = vaultMonthlyReturns.findIndex(y => y.year === o.year)
        if (i === -1) {
          i = vaultMonthlyReturns.length
          vaultMonthlyReturns.push({ year: o.year })
        }

        vaultMonthlyReturns[i][months[o.month - 1]] = o.monthlyReturn
      })
    }

    return vaultMonthlyReturns
  }
  async getTokenData (address) {
    let response = await axios.get(
      process.env[store.state.settings.network].CACHE +
        'https://api.ethplorer.io/getTokenInfo/' +
        address +
        '?apiKey=EK-kJ7LW-wCWTsAy-ALujf'
    )
    if (response && response.data) {
      this.denominationAssetData = response.data
    }
    return response.data
  }
  async getVaultBalance (fundAddress) {
    let balance = []
    let total = 0
    let data = JSON.stringify({
      'operationName': 'VaultBalances',
      'variables': {
        'currency': 'usd',
        'network': 'ethereum',
        'vault': fundAddress
      },
      'query': 'query VaultBalances($currency: Currency!, $network: Deployment!, $vault: Address!) {\n  vaultBalances(currency: $currency, network: $network, vault: $vault) {\n    assetAddress\n    balance\n    value\n    __typename\n  }\n}'
    })

    let config = {
      method: 'post',
      url:
        process.env[store.state.settings.network].CACHE +
        'https://app.enzyme.finance/api/graphql',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    let response = await axios(config)
    if (response && response.data && response.data.data) {
      total = response.data.data.vaultBalances.reduce(function (a, c) {
        return a + c.value
      }, 0)
      let tokens = await CrosschainDex.getCoinByChain('eth')
      let assets = await this.assetChange24h()
      balance = response.data.data.vaultBalances
        .map(o => {
          let token = tokens.find(
            a => a.address.toLowerCase() === o.assetAddress.toLowerCase()
          )
          if (token) {
            let a = assets.find(p => p.id === o.assetAddress)
            o.asset = token.value
            o.assetThicker = token.value
            o.assetName = token.label

            o.price = o.value / o.balance
            o.dailyChange = a && a.change24h ? a.change24h * 100 : 0

            o.allocation = (o.value / total) * 100
            o.currency = 'USD'
            o.icon =
              'https://env.enzyme.finance/ethereum/assets/' +
              o.assetAddress +
              '/logo.png'
          }
          return o
        })
        .filter(o => o.asset)
    }
    return { assets: balance, aum: Format.formatNumber(total, 2) }
  }
  async getVaultData (fundAddress) {
    let data = JSON.stringify({
      operationName: 'VaultDetails',
      variables: {
        id: fundAddress
      },
      query:
        'query VaultDetails($id: ID!) {\n  vault(id: $id) {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultDetails on Vault {\n  id\n  comptroller {\n    id\n    denomination {\n      ...Asset\n      __typename\n    }\n    gasRelayer {\n      id\n      balance\n      __typename\n    }\n    sharesActionTimelock\n    __typename\n  }\n  inception\n  depositCount\n  freelyTransferableShares\n  name\n  symbol\n  owner {\n    id\n    __typename\n  }\n  protocolFee {\n    id\n    rate\n    feeTracker\n    __typename\n  }\n  release {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment Asset on Asset {\n  id\n  name\n  symbol\n  decimals\n  __typename\n}'
    })

    let config = {
      method: 'post',
      url:
        process.env[store.state.settings.network].CACHE +
        'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme-core',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    let response = await axios(config)
    if (response && response.data.data) {
      let data = response.data.data.vault
      this.comptrollerProxy = data.comptroller.id
      data.vaultIcon = 'statics/staider/sif_logo_white.svg'
      data.icon =
        'https://env.enzyme.finance/ethereum/assets/' +
        data.comptroller.denomination.id +
        '/logo.png'
      data.vault = data.name
      data.denominationCoin = data.comptroller.denomination.name
      data.investors = data.depositCount

      data.network = 'Ethereum'
      this.fund = data
    }
    return this.fund
  }
  async getComptrollerProxy (fundAddress) {
    let proxy = null
    let response = await axios.post(
      process.env[store.state.settings.network].CACHE +
        'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      {
        operationName: 'FundAuthorizedUsers',
        variables: { id: fundAddress },
        query:
          'query FundAuthorizedUsers($id: ID!) {  fund(id: $id) {    id    accessor {      id      authUsers(first: 1000) {        id        __typename      }      __typename    }    __typename  }}'
      }
    )

    if (response && response.data && response.data.data) {
      proxy = response.data.data.fund.accessor.id
    }
    return proxy
  }
  // EnzymeV4
  async getNativeDepositTransaction (comptrollerProxy, denominationAsset, quantity, userAddress, expectedDenominationAmount) {
    let transaction = null
    let data = JSON.stringify({
      'operationName': 'NativeTokenDepositTransaction',
      'variables': {
        'comptrollerProxy': comptrollerProxy,
        'expectedDenominationAmount': expectedDenominationAmount.toString(),
        'incoming': denominationAsset,
        'maxSlippage': 0.03,
        'network': 'ethereum',
        'quantity': (quantity * (10 ** 18)).toString(),
        'userAddress': userAddress,
        'originAddress': userAddress
      },
      'query': 'query NativeTokenDepositTransaction($comptrollerProxy: Address!, $expectedDenominationAmount: BigNumber!, $incoming: Address!, $maxSlippage: Float!, $network: Deployment!, $originAddress: Address, $quantity: BigNumber!, $userAddress: Address!) {\n  nativeTokenDepositTransaction(\n    comptrollerProxy: $comptrollerProxy\n    expectedDenominationAmount: $expectedDenominationAmount\n    incoming: $incoming\n    maxSlippage: $maxSlippage\n    network: $network\n    originAddress: $originAddress\n    quantity: $quantity\n    userAddress: $userAddress\n  ) {\n    reason\n    status\n    transaction {\n      data\n      to\n      value\n      __typename\n    }\n    __typename\n  }\n}' })

    let config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://app.enzyme.finance/api/graphql',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    let response = await axios(config)
    if (response && response.data && response.data.data) {
      if (JSON.stringify(response.data.data).includes('insufficient funds')) {
        throw new Error('insufficient funds!')
      }
      transaction = response.data.data.nativeTokenDepositTransaction.transaction
      transaction.from = userAddress
      let gas = await web3.eth.estimateGas(transaction)
      if (gas) {
        transaction.gas = gas
        transaction.gasPrice = parseInt((await this.getGas()) * 1000000000)
      }
    }
    return transaction
  }
  async getAggregateVaultsData (vaultsIds) {
    let investor = {
    }
    let vaults = []

    await Promise.all(vaultsIds.map(async v => {
      vaults.push(await this.getVaultPerformance(v))
    }))
    investor.vaults = vaults

    let total = vaults.reduce(
      (a, b) =>
        a + b.grossAssetValue,
      0
    )
    /*
    investor.totalPValue = Format.formatNumber(
      total,
      2
    ) */

    investor.repartition = Object.assign([], vaults).map(
      f =>
        (f.grossAssetValue /
          total) *
        100
    )

    let AvApy =
      (vaults.reduce(
        (a, b) =>
          a + b.performanceYtd,
        0
      ) *
        100) /
      vaults.length
    investor.avApy = {
      color: AvApy < 0 ? 'red' : 'green',
      value: Format.formatNumber(AvApy, 2)
    }
    let sinceInception = (vaults.reduce(
      (a, b) =>
        a + b.performanceSinceInception,
      0
    ) *
      100) /
    vaults.length

    investor.sinceInception = {
      color: sinceInception < 0 ? 'red' : 'green',
      value: Format.formatNumber(sinceInception, 2)
    }
    investor.avgSharePrice = Format.formatNumber(

      vaults.reduce(
        (a, b) =>
          a + b.netShareValue,
        0
      ) / vaults.length,
      2
    )
    let thisMonth = Format.formatNumber(

      vaults.reduce(
        (a, b) =>
          a + b.performanceMtd,
        0
      ) / vaults.length,
      2
    )
    investor.thisMonth = {
      color: thisMonth < 0 ? 'red' : 'green',
      value: Format.formatNumber(thisMonth, 2)
    }

    return investor
  }
  async getVaultPerformance (fundAddress) {
    let performance = null
    let data = JSON.stringify({
      'operationName': 'VaultPerformanceLatest',
      'variables': {
        'currency': 'usd',
        'network': 'ethereum',
        'vault': fundAddress
      },
      'query': 'query VaultPerformanceLatest($currency: Currency!, $network: Deployment!, $vault: Address!) {\n  vaultPerformanceLatest(currency: $currency, network: $network, vault: $vault) {\n    totalSupply\n    netShareValue\n    grossAssetValue\n    netAssetValue\n    performance24h\n    performanceMtd\n    performanceQtd\n    performanceYtd\n    performanceSinceInception\n    __typename\n  }\n}'
    })
    let config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://app.enzyme.finance/api/graphql',
      headers: {
        'Content-type': 'application/json' },
      data: data
    }

    let response = await axios(config)
    if (response && response.data && response.data.data) {
      performance = response.data.data.vaultPerformanceLatest
      performance.aum = Format.formatNumber(performance.grossAssetValue, 2)
      performance.apy = Format.formatNumber(performance.performanceYtd * 100, 2)
      performance.apyStyle = performance.performanceYtd < 0 ? 'red' : 'green'
      performance.sharePrice = Format.formatNumber(performance.netShareValue)
      let change = performance.performance24h / performance.netShareValue * 100
      performance.dailyChange = Format.formatNumber(change, 2) + '%'
      performance.dailyChangeStyle = change < 0 ? 'red' : 'green'
    }
    return performance
  }
  async getInvestorData (userAddress) {
    let vaults = []
    let data = await this.getUserVaults(userAddress.toLowerCase())

    if (data && data.length) {
      vaults = await Promise.all(data.map(async v => {
        let f = v.vault

        f.icon = 'https://env.enzyme.finance/ethereum/assets/' + f.comptroller.denomination.id + '/logo.png'
        f.vault = f.name
        f.address = f.id
        f.denominationCoin = f.comptroller.denomination.symbol
        f.myshares = Format.formatNumber(v.shares, 2)
        let p = await this.getVaultPerformance(f.id)
        f.sharePrice = p.sharePrice + ' $US'
        f.totalUsd = (p.netShareValue * parseFloat(v.shares))
        f.value = Format.formatNumber(f.totalUsd, 2) + ' $US'
        f.apy = p.apy + '%'
        f.apyStyle = p.apyStyle
        f.network = 'Ethereum'
        return f
      }))
    /*
      investor.repartition = Object.assign({}, data).funds.map(
        f =>
          ((f.calculations.USD.price * f.investorShares) /
            data.aggregate.value.current.USD) *
          100
      )
      investor.totalPValue = Format.formatNumber(
        data.aggregate.value.current.USD,
        2
      )
      let AvApy =
        (investor.datasVaults.reduce(
          (a, b) =>
            (a ? a.performance['1y'].USD.price : 0) +
            (b ? b.performance['1y'].USD.price : 0),
          0
        ) *
          100) /
        investor.datasVaults.length
      investor.avApy = {
        color: AvApy < 0 ? 'red' : 'green',
        value: Format.formatNumber(AvApy, 2)
      }
      let sinceInception =
        data.aggregate.value.current.USD - data.aggregate.value.previous.USD

      investor.sinceInception = {
        color: sinceInception < 0 ? 'red' : 'green',
        value: Format.formatNumber(sinceInception, 2)
      }
      investor.avgSharePrice = Format.formatNumber(
        investor.datasVaults.reduce(
          (a, b) =>
            (a ? a.calculations.USD.price : 0) +
            (b ? b.calculations.USD.price : 0),
          0
        ) / investor.datasVaults.length,
        2
      )
      let thisMonth =
        (investor.datasVaults.reduce(
          (a, b) =>
            (a ? a.performance['1m'].USD.price : 0) +
            (b ? b.performance['1m'].USD.price : 0),
          0
        ) *
          100) /
        investor.datasVaults.length
      investor.thisMonth = {
        color: thisMonth < 0 ? 'red' : 'green',
        value: Format.formatNumber(thisMonth, 2)
      } */
    }
    return vaults
  }
  async getActivity (fundAddress, type = 'deposit', address = null) {
    let typeMap = {
      deposit: 'DepositorShares',
      f: 'FeeShares',
      p: 'ProtocolFee',
      trade: 'Trade',
      settings: 'VaultSettings'
    }
    let data = JSON.stringify({
      'operationName': 'VaultActivities',
      'variables': {
        'timestamp': 0,
        'activityTypes': [
          'DepositorShares',
          'FeeShares',
          'ProtocolFee',
          'Trade',
          'VaultSettings'
        ],
        'first': 100,
        'skip': 0,
        'vaults': [fundAddress]
      },
      'query': 'query VaultActivities($activityTypes: [ActivityType!]!, $vaults: [String!]!, $first: Int, $skip: Int, $timestamp: Int = 0) {\n  vaultActivities(\n    first: $first\n    skip: $skip\n    where: {activityType_in: $activityTypes, vault_in: $vaults, timestamp_gt: $timestamp}\n    orderBy: activityCounter\n    orderDirection: desc\n  ) {\n    ...VaultActivityCardRows\n    __typename\n  }\n}\n\nfragment VaultActivityCardRows on VaultActivity {\n  ... on ProtocolFeeBurned {\n    ...ProtocolFeeBurnedDetails\n    __typename\n  }\n  ... on ProtocolFeePaid {\n    ...ProtocolFeePaidDetails\n    __typename\n  }\n  ... on Trade {\n    ...TradeDetails\n    __typename\n  }\n  ... on VaultCreated {\n    ...VaultCreatedDetails\n    __typename\n  }\n  ... on VaultMigrationSignalled {\n    ...VaultMigrationSignalledDetails\n    __typename\n  }\n  ... on VaultMigrationCancelled {\n    ...VaultMigrationCancelledDetails\n    __typename\n  }\n  ... on VaultMigrationExecuted {\n    ...VaultMigrationExecutedDetails\n    __typename\n  }\n  ... on VaultReconfigurationSignalled {\n    ...VaultReconfigurationSignalledDetails\n    __typename\n  }\n  ... on VaultReconfigurationCancelled {\n    ...VaultReconfigurationCancelledDetails\n    __typename\n  }\n  ... on VaultReconfigurationExecuted {\n    ...VaultReconfigurationExecutedDetails\n    __typename\n  }\n  ... on VaultNominatedOwnerSet {\n    ...VaultNominatedOwnerSetDetails\n    __typename\n  }\n  ... on VaultNominatedOwnerRemoved {\n    ...VaultNominatedOwnerRemovedDetails\n    __typename\n  }\n  ... on VaultOwnershipTransferred {\n    ...VaultOwnershipTransferredDetails\n    __typename\n  }\n  ... on SharesBoughtEvent {\n    ...SharesBoughtEventDetails\n    __typename\n  }\n  ... on SharesTransferEvent {\n    ...SharesTransferEventDetails\n    __typename\n  }\n  ... on SharesRedeemedEvent {\n    ...SharesRedeemedEventDetails\n    __typename\n  }\n  ... on FeeSharesPaidEvent {\n    ...FeeSharesPaidEventDetails\n    __typename\n  }\n  ... on FeeSharesReceivedEvent {\n    ...FeeSharesReceivedEventDetails\n    __typename\n  }\n  ... on FeeSharesBurnedEvent {\n    ...FeeSharesBurnedEventDetails\n    __typename\n  }\n  ... on FeeSharesAllocationChangedEvent {\n    ...FeeSharesAllocationChangedEventDetails\n    __typename\n  }\n  ... on CompoundDebtPositionChange {\n    ...CompoundDebtPositionChangeDetails\n    __typename\n  }\n  ... on AaveDebtPositionChange {\n    ...AaveDebtPositionChangeDetails\n    __typename\n  }\n  ... on UniswapV3LiquidityPositionChange {\n    ...UniswapV3LiquidityPositionChangeDetails\n    __typename\n  }\n  ... on PolicyEnabledForVault {\n    ...PolicyEnabledForVaultDetails\n    __typename\n  }\n  ... on PolicyDisabledForVault {\n    ...PolicyDisabledForVaultDetails\n    __typename\n  }\n  ... on FreelyTransferableSharesSetEvent {\n    ...FreelyTransferableSharesSetEventDetails\n    __typename\n  }\n  __typename\n}\n\nfragment ProtocolFeeBurnedDetails on ProtocolFeeBurned {\n  activityType\n  id\n  timestamp\n  __typename\n  vault {\n    ...VaultDetails\n    __typename\n  }\n  shares\n  timestamp\n  mlnBurned\n}\n\nfragment VaultDetails on Vault {\n  id\n  comptroller {\n    id\n    denomination {\n      ...Asset\n      __typename\n    }\n    gasRelayer {\n      id\n      balance\n      __typename\n    }\n    sharesActionTimelock\n    __typename\n  }\n  inception\n  depositCount\n  freelyTransferableShares\n  name\n  symbol\n  owner {\n    id\n    __typename\n  }\n  protocolFee {\n    id\n    rate\n    feeTracker\n    __typename\n  }\n  release {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment Asset on Asset {\n  id\n  name\n  symbol\n  decimals\n  __typename\n}\n\nfragment ProtocolFeePaidDetails on ProtocolFeePaid {\n  activityType\n  id\n  timestamp\n  __typename\n  vault {\n    ...VaultDetails\n    __typename\n  }\n  shares\n  timestamp\n}\n\nfragment TradeDetails on Trade {\n  activityType\n  id\n  timestamp\n  __typename\n  incomingAssetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  incomingAssets {\n    ...Asset\n    __typename\n  }\n  outgoingAssetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  outgoingAssets {\n    ...Asset\n    __typename\n  }\n  tradeType\n  vault {\n    ...VaultDetails\n    __typename\n  }\n  adapter\n}\n\nfragment AssetAmount on AssetAmount {\n  id\n  asset {\n    ...Asset\n    __typename\n  }\n  amount\n  valueAud\n  valueBtc\n  valueChf\n  valueDenomination\n  valueEth\n  valueEur\n  valueGbp\n  valueJpy\n  valueUsd\n  timestamp\n  __typename\n}\n\nfragment VaultCreatedDetails on VaultCreated {\n  activityType\n  id\n  timestamp\n  __typename\n  creator {\n    ...Account\n    __typename\n  }\n  owner {\n    ...Account\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment Account on Account {\n  id\n  isOwner\n  isAssetManager\n  isDepositor\n  ownerSince\n  assetManagerSince\n  depositorSince\n  __typename\n}\n\nfragment VaultMigrationSignalledDetails on VaultMigrationSignalled {\n  activityType\n  id\n  timestamp\n  __typename\n  migration {\n    ...MigrationDetails\n    __typename\n  }\n  nextComptroller {\n    id\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment MigrationDetails on Migration {\n  cancelled\n  cancelledTimestamp\n  executed\n  executedTimestamp\n  nextRelease {\n    id\n    __typename\n  }\n  prevRelease {\n    id\n    __typename\n  }\n  executableTimestamp\n  __typename\n}\n\nfragment VaultMigrationCancelledDetails on VaultMigrationCancelled {\n  activityType\n  id\n  timestamp\n  __typename\n  migration {\n    ...MigrationDetails\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultMigrationExecutedDetails on VaultMigrationExecuted {\n  activityType\n  id\n  timestamp\n  __typename\n  migration {\n    ...MigrationDetails\n    __typename\n  }\n  nextComptroller {\n    id\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultReconfigurationSignalledDetails on VaultReconfigurationSignalled {\n  activityType\n  id\n  timestamp\n  __typename\n  nextComptroller {\n    id\n    __typename\n  }\n  reconfiguration {\n    ...ReconfigurationDetails\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment ReconfigurationDetails on Reconfiguration {\n  cancelled\n  cancelledTimestamp\n  executableTimestamp\n  executed\n  executedTimestamp\n  release {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment VaultReconfigurationCancelledDetails on VaultReconfigurationCancelled {\n  activityType\n  id\n  timestamp\n  __typename\n  reconfiguration {\n    ...ReconfigurationDetails\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultReconfigurationExecutedDetails on VaultReconfigurationExecuted {\n  activityType\n  id\n  timestamp\n  __typename\n  nextComptroller {\n    id\n    __typename\n  }\n  reconfiguration {\n    ...ReconfigurationDetails\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultNominatedOwnerSetDetails on VaultNominatedOwnerSet {\n  activityType\n  id\n  timestamp\n  __typename\n  nominatedOwner {\n    ...Account\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultNominatedOwnerRemovedDetails on VaultNominatedOwnerRemoved {\n  activityType\n  id\n  timestamp\n  __typename\n  nominatedOwner {\n    ...Account\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment VaultOwnershipTransferredDetails on VaultOwnershipTransferred {\n  activityType\n  id\n  timestamp\n  __typename\n  nextOwner {\n    ...Account\n    __typename\n  }\n  prevOwner {\n    ...Account\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment SharesBoughtEventDetails on SharesBoughtEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  depositAssetAmount {\n    ...AssetAmount\n    __typename\n  }\n  depositor {\n    ...Account\n    __typename\n  }\n  shares\n  sharesChangeType\n  sharesIssued\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment SharesTransferEventDetails on SharesTransferEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  from {\n    ...Account\n    __typename\n  }\n  shares\n  to {\n    ...Account\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment SharesRedeemedEventDetails on SharesRedeemedEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  depositor {\n    ...Account\n    __typename\n  }\n  payoutAssetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  shares\n  sharesChangeType\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment FeeSharesPaidEventDetails on FeeSharesPaidEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  timestamp\n  depositor {\n    ...Account\n    __typename\n  }\n  deposit {\n    ...Deposit\n    __typename\n  }\n  fee {\n    id\n    feeType\n    settings\n    __typename\n  }\n  shares\n  sharesChangeType\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment Deposit on Deposit {\n  id\n  since\n  vault {\n    ...VaultDetails\n    __typename\n  }\n  depositor {\n    id\n    __typename\n  }\n  shares\n  sharesChanges {\n    ...SharesChange\n    __typename\n  }\n  __typename\n}\n\nfragment SharesChange on SharesChange {\n  id\n  shares\n  timestamp\n  sharesChangeType\n  vault {\n    comptroller {\n      denomination {\n        ...Asset\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  depositor {\n    id\n    __typename\n  }\n  deposit {\n    id\n    __typename\n  }\n  shares\n  ...SharesBoughtEvent\n  ...SharesRedeemedEvent\n  __typename\n}\n\nfragment SharesBoughtEvent on SharesBoughtEvent {\n  depositAssetAmount {\n    ...AssetAmount\n    __typename\n  }\n  sharesIssued\n  __typename\n}\n\nfragment SharesRedeemedEvent on SharesRedeemedEvent {\n  payoutAssetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  __typename\n}\n\nfragment FeeSharesReceivedEventDetails on FeeSharesReceivedEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  depositor {\n    ...Account\n    __typename\n  }\n  deposit {\n    ...Deposit\n    __typename\n  }\n  fee {\n    ... on ManagementFee {\n      __typename\n      id\n      feeType\n      settings\n      ...ManagementFee\n    }\n    ... on PerformanceFee {\n      __typename\n      id\n      feeType\n      settings\n      ...PerformanceFee\n    }\n    ... on EntranceRateBurnFee {\n      __typename\n      id\n      feeType\n      settings\n      ...EntranceRateBurnFee\n    }\n    ... on EntranceRateDirectFee {\n      __typename\n      id\n      feeType\n      settings\n      ...EntranceRateDirectFee\n    }\n    ... on ExitRateBurnFee {\n      __typename\n      id\n      feeType\n      settings\n      ...ExitRateBurnFee\n    }\n    ... on ExitRateDirectFee {\n      __typename\n      id\n      feeType\n      settings\n      ...ExitRateDirectFee\n    }\n    ... on UnknownFee {\n      __typename\n      id\n      feeType\n      settings\n    }\n    __typename\n  }\n  shares\n  sharesChangeType\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment ManagementFee on ManagementFee {\n  scaledPerSecondRate\n  recipient {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment PerformanceFee on PerformanceFee {\n  rate\n  period\n  performanceFeeType\n  recipient {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment EntranceRateBurnFee on EntranceRateBurnFee {\n  rate\n  __typename\n}\n\nfragment EntranceRateDirectFee on EntranceRateDirectFee {\n  rate\n  recipient {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment ExitRateBurnFee on ExitRateBurnFee {\n  inKindRate\n  specificAssetsRate\n  __typename\n}\n\nfragment ExitRateDirectFee on ExitRateDirectFee {\n  inKindRate\n  specificAssetsRate\n  recipient {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment FeeSharesBurnedEventDetails on FeeSharesBurnedEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  depositor {\n    ...Account\n    __typename\n  }\n  deposit {\n    ...Deposit\n    __typename\n  }\n  shares\n  sharesChangeType\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment FeeSharesAllocationChangedEventDetails on FeeSharesAllocationChangedEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  depositor {\n    ...Account\n    __typename\n  }\n  fee {\n    id\n    feeType\n    __typename\n  }\n  shares\n  sharesChangeType\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment CompoundDebtPositionChangeDetails on CompoundDebtPositionChange {\n  activityType\n  id\n  timestamp\n  __typename\n  assetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  compoundDebtPositionChangeType\n  externalPosition {\n    id\n    active\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment AaveDebtPositionChangeDetails on AaveDebtPositionChange {\n  activityType\n  id\n  timestamp\n  __typename\n  assetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  aaveDebtPositionChangeType\n  externalPosition {\n    id\n    active\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment UniswapV3LiquidityPositionChangeDetails on UniswapV3LiquidityPositionChange {\n  activityType\n  id\n  timestamp\n  __typename\n  assetAmounts {\n    ...AssetAmount\n    __typename\n  }\n  uniswapV3LiquidityPositionChangeType\n  externalPosition {\n    id\n    active\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment PolicyEnabledForVaultDetails on PolicyEnabledForVault {\n  activityType\n  id\n  timestamp\n  __typename\n  policy {\n    ...PolicyDetails\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment PolicyDetails on Policy {\n  __typename\n  id\n  policy\n  policyType\n  enabled\n  settings\n  ... on AdapterBlacklistPolicy {\n    ...AdapterBlacklistPolicyDetails\n    __typename\n  }\n  ... on AdapterWhitelistPolicy {\n    ...AdapterWhitelistPolicyDetails\n    __typename\n  }\n  ... on AllowedAdapterIncomingAssetsPolicy {\n    ...AllowedAdapterIncomingAssetsPolicyDetails\n    __typename\n  }\n  ... on AllowedAdaptersPolicy {\n    ...AllowedAdaptersPolicyDetails\n    __typename\n  }\n  ... on AllowedAssetsForRedemptionPolicy {\n    ...AllowedAssetsForRedemptionPolicyDetails\n    __typename\n  }\n  ... on AllowedDepositRecipientsPolicy {\n    ...AllowedDepositRecipientsPolicyDetails\n    __typename\n  }\n  ... on AllowedExternalPositionTypesPolicy {\n    ...AllowedExternalPositionTypesPolicyDetails\n    __typename\n  }\n  ... on AllowedSharesTransferRecipientsPolicy {\n    ...AllowedSharesTransferRecipientsPolicyDetails\n    __typename\n  }\n  ... on AssetBlacklistPolicy {\n    ...AssetBlacklistPolicyDetails\n    __typename\n  }\n  ... on AssetWhitelistPolicy {\n    ...AssetWhitelistPolicyDetails\n    __typename\n  }\n  ... on BuySharesCallerWhitelistPolicy {\n    ...BuySharesCallerWhitelistPolicyDetails\n    __typename\n  }\n  ... on CumulativeSlippageTolerancePolicy {\n    ...CumulativeSlippageTolerancePolicyDetails\n    __typename\n  }\n  ... on DepositorWhitelistPolicy {\n    ...DepositorWhitelistPolicyDetails\n    __typename\n  }\n  ... on GuaranteedRedemptionPolicy {\n    ...GuaranteedRedemptionPolicyDetails\n    __typename\n  }\n  ... on MaxConcentrationPolicy {\n    ...MaxConcentrationPolicyDetails\n    __typename\n  }\n  ... on MinMaxDepositPolicy {\n    ...MinMaxDepositPolicyDetails\n    __typename\n  }\n  ... on MinAssetBalancesPostRedemptionPolicy {\n    ...MinAssetBalancesPostRedemptionPolicyDetails\n    __typename\n  }\n  ... on UnknownPolicy {\n    ...UnknownPolicyDetails\n    __typename\n  }\n}\n\nfragment AdapterBlacklistPolicyDetails on AdapterBlacklistPolicy {\n  adapters\n  __typename\n}\n\nfragment AdapterWhitelistPolicyDetails on AdapterWhitelistPolicy {\n  adapters\n  __typename\n}\n\nfragment AllowedAdapterIncomingAssetsPolicyDetails on AllowedAdapterIncomingAssetsPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AddressList on AddressList {\n  id\n  createdAt\n  updatedAt\n  creator\n  owner\n  updateType\n  items\n  __typename\n}\n\nfragment AllowedAdaptersPolicyDetails on AllowedAdaptersPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AllowedAssetsForRedemptionPolicyDetails on AllowedAssetsForRedemptionPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AllowedDepositRecipientsPolicyDetails on AllowedDepositRecipientsPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AllowedExternalPositionTypesPolicyDetails on AllowedExternalPositionTypesPolicy {\n  externalPositionTypes\n  __typename\n}\n\nfragment AllowedSharesTransferRecipientsPolicyDetails on AllowedSharesTransferRecipientsPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AssetBlacklistPolicyDetails on AssetBlacklistPolicy {\n  assets\n  __typename\n}\n\nfragment AssetWhitelistPolicyDetails on AssetWhitelistPolicy {\n  assets\n  __typename\n}\n\nfragment BuySharesCallerWhitelistPolicyDetails on BuySharesCallerWhitelistPolicy {\n  callers\n  __typename\n}\n\nfragment CumulativeSlippageTolerancePolicyDetails on CumulativeSlippageTolerancePolicy {\n  tolerance\n  cumulativeSlippage\n  lastSlippageTimestamp\n  __typename\n}\n\nfragment DepositorWhitelistPolicyDetails on DepositorWhitelistPolicy {\n  depositors\n  updatedAt\n  __typename\n}\n\nfragment GuaranteedRedemptionPolicyDetails on GuaranteedRedemptionPolicy {\n  startTimestamp\n  duration\n  __typename\n}\n\nfragment MaxConcentrationPolicyDetails on MaxConcentrationPolicy {\n  maxConcentration\n  __typename\n}\n\nfragment MinMaxDepositPolicyDetails on MinMaxDepositPolicy {\n  minDepositAmount\n  maxDepositAmount\n  updatedAt\n  __typename\n}\n\nfragment MinAssetBalancesPostRedemptionPolicyDetails on MinAssetBalancesPostRedemptionPolicy {\n  assetBalances {\n    ...AssetBalance\n    __typename\n  }\n  __typename\n}\n\nfragment AssetBalance on AssetBalance {\n  id\n  asset {\n    ...Asset\n    __typename\n  }\n  amount\n  __typename\n}\n\nfragment UnknownPolicyDetails on UnknownPolicy {\n  enabled\n  __typename\n}\n\nfragment PolicyDisabledForVaultDetails on PolicyDisabledForVault {\n  activityType\n  id\n  timestamp\n  __typename\n  policy {\n    ...PolicyDetails\n    __typename\n  }\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}\n\nfragment FreelyTransferableSharesSetEventDetails on FreelyTransferableSharesSetEvent {\n  activityType\n  id\n  timestamp\n  __typename\n  vault {\n    ...VaultDetails\n    __typename\n  }\n}'
    })

    var config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme-core',
      headers: {
        'content-type': 'application/json'
      },
      data: data
    }

    let response = await axios(config)

    if (response && response.data && response.data.data) {
      data = response.data.data.vaultActivities
        .filter(o => typeMap[type] === o.activityType && (!address || !o.depositor || o.depositor.id === address))
        .map(o => {
          if (o.__typename === 'SharesBoughtEvent') {
            o.network = 'Ethereum'

            o.icon = 'https://env.enzyme.finance/ethereum/assets/' + o.depositAssetAmount.asset.id + '/logo.png'
            o.denominationCoin = o.depositAssetAmount.asset.symbol
            o.amount =
              o.depositAssetAmount.valueDenomination +
              ' ' +
              o.depositAssetAmount.asset.symbol
            o.sharePrice =
              Format.formatNumber(o.investmentAmount / o.shares, 2) + ' $US'
            o.shares = Format.formatNumber(o.sharesIssued, 2)
            o.date = new Date(o.timestamp * 1000)
              .toLocaleString()
              .substring(0, 9)
            o.price = Format.formatNumber(o.depositAssetAmount.valueUsd, 2)
            o.tx = Format.getKeyFormat(o.id.split('/')[0])
          } else if (o.__typename === 'SharesRedeemedEvent') {
            let asset = o.payoutAssetAmounts[0].asset

            o.icon = 'https://env.enzyme.finance/ethereum/assets/' + asset.id + '/logo.png'
            o.date = new Date(o.timestamp * 1000)
              .toLocaleString()
              .substring(0, 9)
            o.amount = o.payoutAssetAmounts[0].amount + ' ' + asset.symbol
            o.denominationCoin = asset.symbol
            o.sharePrice =
              Format.formatNumber(o.investmentAmount / o.shares, 2) + ' $US'
            o.tx = Format.getKeyFormat(o.id.split('/')[0])
          }
          return o
        })
    }
    return data
  }
  async getFund (fundAddress) {
    let fund = null
    let response = await axios.post(
      process.env[store.state.settings.network].CACHE +
        'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      {
        operationName: 'FundDetails',
        variables: { id: fundAddress },
        query:
          'query FundDetails($id: ID!) {  fund(id: $id) {    ...FundDetails    __typename  }}fragment FundDetails on Fund {  id  accessor {    id    sharesActionTimelock    denominationAsset {      ...AssetWithPrice      __typename    }    __typename  }  inception  investmentCount  name  manager {    id    manager    __typename  }  release {    id    __typename  }  shares {    id    totalSupply    __typename  }  __typename}fragment AssetWithPrice on Asset {  ...Asset  price {    id    price    timestamp    __typename  }  __typename}fragment Asset on Asset {  id  name  symbol  decimals  type  __typename}'
      }
    )
    if (response && response.data && response.data.data) {
      fund = response.data.data.fund
    }
    return fund
  }
  async getUserVaults (investorAddress, fundAddress = null) {
    let vaults = []

    let data = JSON.stringify({
      'operationName': 'VaultList',
      'variables': {
        'ids': [
          investorAddress
        ]
      },
      'query': 'query VaultList($ids: [ID!]!) {\n  accounts(where: {id_in: $ids}) {\n    id\n    depositorSince\n    ownerSince\n    ownerships(first: 1000) {\n      ...VaultListItem\n      __typename\n    }\n    deposits(first: 1000) {\n      id\n      shares\n      vault {\n        ...VaultListItem\n        __typename\n      }\n      __typename\n    }\n    assetManagements {\n      ...VaultListItem\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment VaultListItem on Vault {\n  id\n  name\n  inception\n  depositCount\n  release {\n    id\n    __typename\n  }\n  comptroller {\n    id\n    denomination {\n      ...Asset\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Asset on Asset {\n  id\n  name\n  symbol\n  decimals\n  __typename\n}'
    })

    let config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme-core',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    let response = await axios(config)

    if (response && response.data && response.data.data && response.data.data.accounts && response.data.data.accounts.length) {
      response.data.data.accounts.forEach(element => {
        element.deposits.filter(x => !fundAddress || fundAddress === x.vault.id).forEach(o => {
          vaults.push(o)
        })
      })
    }
    return vaults
  }
  async isInvestor (fundAddress, investorAddress) {
    if (!this.comptrollerProxy) {
      this.getVaultData(fundAddress)
    }
    let data = JSON.stringify({
      'operationName': 'VaultPolicies',
      'variables': {
        'comptroller': this.comptrollerProxy
      },
      'query': 'query VaultPolicies($comptroller: ID!) {\n  comptroller(id: $comptroller) {\n    id\n    policies {\n      ...PolicyDetails\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PolicyDetails on Policy {\n  __typename\n  id\n  policy\n  policyType\n  enabled\n  settings\n  ... on AdapterBlacklistPolicy {\n    ...AdapterBlacklistPolicyDetails\n    __typename\n  }\n  ... on AdapterWhitelistPolicy {\n    ...AdapterWhitelistPolicyDetails\n    __typename\n  }\n  ... on AllowedAdapterIncomingAssetsPolicy {\n    ...AllowedAdapterIncomingAssetsPolicyDetails\n    __typename\n  }\n  ... on AllowedAdaptersPolicy {\n    ...AllowedAdaptersPolicyDetails\n    __typename\n  }\n  ... on AllowedAssetsForRedemptionPolicy {\n    ...AllowedAssetsForRedemptionPolicyDetails\n    __typename\n  }\n  ... on AllowedDepositRecipientsPolicy {\n    ...AllowedDepositRecipientsPolicyDetails\n    __typename\n  }\n  ... on AllowedExternalPositionTypesPolicy {\n    ...AllowedExternalPositionTypesPolicyDetails\n    __typename\n  }\n  ... on AllowedSharesTransferRecipientsPolicy {\n    ...AllowedSharesTransferRecipientsPolicyDetails\n    __typename\n  }\n  ... on AssetBlacklistPolicy {\n    ...AssetBlacklistPolicyDetails\n    __typename\n  }\n  ... on AssetWhitelistPolicy {\n    ...AssetWhitelistPolicyDetails\n    __typename\n  }\n  ... on BuySharesCallerWhitelistPolicy {\n    ...BuySharesCallerWhitelistPolicyDetails\n    __typename\n  }\n  ... on CumulativeSlippageTolerancePolicy {\n    ...CumulativeSlippageTolerancePolicyDetails\n    __typename\n  }\n  ... on DepositorWhitelistPolicy {\n    ...DepositorWhitelistPolicyDetails\n    __typename\n  }\n  ... on GuaranteedRedemptionPolicy {\n    ...GuaranteedRedemptionPolicyDetails\n    __typename\n  }\n  ... on MaxConcentrationPolicy {\n    ...MaxConcentrationPolicyDetails\n    __typename\n  }\n  ... on MinMaxDepositPolicy {\n    ...MinMaxDepositPolicyDetails\n    __typename\n  }\n  ... on MinAssetBalancesPostRedemptionPolicy {\n    ...MinAssetBalancesPostRedemptionPolicyDetails\n    __typename\n  }\n  ... on UnknownPolicy {\n    ...UnknownPolicyDetails\n    __typename\n  }\n}\n\nfragment AdapterBlacklistPolicyDetails on AdapterBlacklistPolicy {\n  adapters\n  __typename\n}\n\nfragment AdapterWhitelistPolicyDetails on AdapterWhitelistPolicy {\n  adapters\n  __typename\n}\n\nfragment AllowedAdapterIncomingAssetsPolicyDetails on AllowedAdapterIncomingAssetsPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AddressList on AddressList {\n  id\n  createdAt\n  updatedAt\n  creator\n  owner\n  updateType\n  items\n  __typename\n}\n\nfragment AllowedAdaptersPolicyDetails on AllowedAdaptersPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AllowedAssetsForRedemptionPolicyDetails on AllowedAssetsForRedemptionPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AllowedDepositRecipientsPolicyDetails on AllowedDepositRecipientsPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AllowedExternalPositionTypesPolicyDetails on AllowedExternalPositionTypesPolicy {\n  externalPositionTypes\n  __typename\n}\n\nfragment AllowedSharesTransferRecipientsPolicyDetails on AllowedSharesTransferRecipientsPolicy {\n  addressLists {\n    ...AddressList\n    __typename\n  }\n  __typename\n}\n\nfragment AssetBlacklistPolicyDetails on AssetBlacklistPolicy {\n  assets\n  __typename\n}\n\nfragment AssetWhitelistPolicyDetails on AssetWhitelistPolicy {\n  assets\n  __typename\n}\n\nfragment BuySharesCallerWhitelistPolicyDetails on BuySharesCallerWhitelistPolicy {\n  callers\n  __typename\n}\n\nfragment CumulativeSlippageTolerancePolicyDetails on CumulativeSlippageTolerancePolicy {\n  tolerance\n  cumulativeSlippage\n  lastSlippageTimestamp\n  __typename\n}\n\nfragment DepositorWhitelistPolicyDetails on DepositorWhitelistPolicy {\n  depositors\n  updatedAt\n  __typename\n}\n\nfragment GuaranteedRedemptionPolicyDetails on GuaranteedRedemptionPolicy {\n  startTimestamp\n  duration\n  __typename\n}\n\nfragment MaxConcentrationPolicyDetails on MaxConcentrationPolicy {\n  maxConcentration\n  __typename\n}\n\nfragment MinMaxDepositPolicyDetails on MinMaxDepositPolicy {\n  minDepositAmount\n  maxDepositAmount\n  updatedAt\n  __typename\n}\n\nfragment MinAssetBalancesPostRedemptionPolicyDetails on MinAssetBalancesPostRedemptionPolicy {\n  assetBalances {\n    ...AssetBalance\n    __typename\n  }\n  __typename\n}\n\nfragment AssetBalance on AssetBalance {\n  id\n  asset {\n    ...Asset\n    __typename\n  }\n  amount\n  __typename\n}\n\nfragment Asset on Asset {\n  id\n  name\n  symbol\n  decimals\n  __typename\n}\n\nfragment UnknownPolicyDetails on UnknownPolicy {\n  enabled\n  __typename\n}'
    })

    let config = {
      method: 'post',
      url: process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme-core',
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }

    let res = await axios(config)

    let found = res && res.data ? JSON.stringify(res.data).includes(investorAddress) : false
    return found ? 'whitelisted' : false
  }
  async getUserInvestments (userAddress) {
    let funds = null
    let response = await axios.post(
      process.env[store.state.settings.network].CACHE +
        'https://services.enzyme.finance/api/enzyme/investor/funds?address=' +
        userAddress
    )
    if (response && response.data && response.data.data) {
      funds = response.data.data
    }
    return funds
  }

  async getTrades (fundAddress) {
    let trades = null
    let response = await axios.post(
      process.env[store.state.settings.network].CACHE +
        'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      {
        operationName: 'FundTrades',
        variables: { id: fundAddress },
        query:
          'query FundTrades($id: ID!) {  fund(id: $id) {    id    trades(first: 1000) {      ...Trade      __typename    }    __typename  }}fragment Trade on Trade {  id  method  timestamp  adapter {    id    identifier    __typename  }  ...AddTrackedAssetsTrade  ...ApproveAssetsTrade  ...LendTrade  ...LendAndStakeTrade  ...ClaimRewardsAndReinvestTrade  ...ClaimRewardsAndSwapTrade  ...MultiLendTrade  ...MultiRedeemTrade  ...MultiTokenSwapTrade  ...RedeemTrade  ...TokenSwapTrade  ...UnstakeAndRedeemTrade  __typename}fragment AddTrackedAssetsTrade on AddTrackedAssetsTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment AssetAmount on AssetAmount {  asset {    ...Asset    __typename  }  amount  price {    price    __typename  }  __typename}fragment Asset on Asset {  id  name  symbol  decimals  type  __typename}fragment CurrencyPrice on CurrencyPrice {  id  price  currency {    id    __typename  }  __typename}fragment ApproveAssetsTrade on ApproveAssetsTrade {  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment LendTrade on LendTrade {  price  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment LendAndStakeTrade on LendAndStakeTrade {  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment ClaimRewardsAndReinvestTrade on ClaimRewardsAndReinvestTrade {  incomingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment ClaimRewardsAndSwapTrade on ClaimRewardsAndSwapTrade {  incomingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment MultiLendTrade on MultiLendTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment MultiRedeemTrade on MultiRedeemTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment MultiTokenSwapTrade on MultiTokenSwapTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment RedeemTrade on RedeemTrade {  price  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment TokenSwapTrade on TokenSwapTrade {  price  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment UnstakeAndRedeemTrade on UnstakeAndRedeemTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}'
      }
    )
    if (response && response.data && response.data.data) {
      trades = response.data.data.fund.trades
    }
    return trades
  }
  async getGas () {
    let gas = await Lib.getEtherereumPriceGas()
    return gas
  }

  async checkEvmTxStatus (transactonHash) {
    const expectedBlockTime = 5000

    let transactionReceipt = null

    while (transactionReceipt == null) {
      transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash)
      await sleep(expectedBlockTime)
    }

    return transactionReceipt.status
  }
  async getContractABI (address) {
    let abi = this.contractABIS[address]
    let abiCall =
      process.env[store.state.settings.network].CACHE +
      'https://api.etherscan.io/api?apikey=YBABRIF5FBIVNZZK3R8USGI94444WQHHBN&module=contract&action=getabi&address=' +
      address +
      ''

    if (!abi) {
      try {
        let result = await axios.get(abiCall)
        abi = result.data.result
        this.contractABIS[address] = abi
      } catch (e) {
        alert(e)
      }
    }

    return abi
  }
  getContractToInteract (address) {
    let interact = {
      '0x9134c9975244b46692ad9a7da36dba8734ec6da3':
        '0x2891b9b2cec874c46f252196964cbc6fe17ebfde',
      '0x7e6d3b1161df9c9c7527f68d651b297d2fdb820b':
        '0xbc9a63cad5a825bD5854Abca4f3D42d6aCF9Bffa'
    }
    return interact[address.toLowerCase()]
  }
  async init (address) {
    await this.getFundData(address)
    this.fundData = await this.getFund(address)

    this.realeaseId = this.fundData.release.id

    this.comptrollerProxy = await this.getComptrollerProxy(this.fund.address)
    this.denominationAssetData = await this.getTokenData(
      this.fund.denominationAsset.id
    )
  }
  async getUserShares (fundID, address) {
    let deposits = await this.getDeposits(fundID)
    let total = 0
    if (deposits) {
      deposits = deposits.filter(
        o =>
          o.__typename === 'SharesBoughtEvent' ||
          o.__typename === 'SharesRedeemedEvent'
      )

      total = deposits
        .filter(o => o.investor.id.toLowerCase() === address.toLowerCase())
        .filter(o => o.__typename === 'SharesBoughtEvent')
        .reduce(function (a, b) {
          return a + parseFloat(b['shares'])
        }, 0)
    }
    return total
  }
  async getShareWithdrawalData (userAddress, fromToken, sendAmount, toAddress) {
    let address = '0x94F262802806BE3646612D0705802710dD5B58dF'
    const ABI = await this.getContractABI(address)
    const contract = new web3.eth.Contract(JSON.parse(ABI), address)

    const txData = contract.methods
      .redeemSharesDetailed(
        web3.utils.toHex(sendAmount * 10 ** fromToken.decimals),
        [],
        []
      )
      .encodeABI()

    let tx = {
      from: userAddress,
      to: toAddress,
      data: txData,
      value: 0
    }

    return tx
  }
  async getErc20DepositData (userAddress, fromToken, sendAmount, toAddress) {
    const ABI = `[
      {
          "constant": true,
          "inputs": [
            {
                "name": "stake_asset_amount",
                "type": "uint256"
            }, {
                "name": "image_asset_amount",
                "type": "uint256"
            }
          ],
          "name": "buyShares",
          "outputs": [
              {
                  "name": "",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "pure",
          "type": "function"
      }
  ]`

    const contract = new web3.eth.Contract(JSON.parse(ABI), toAddress)

    const txData = contract.methods
      .buyShares(
        web3.utils.toHex(sendAmount * (10 ** fromToken.decimals)),
        1
      )
      .encodeABI()

    let tx = {
      from: userAddress,
      to: toAddress,
      data: txData,
      value: 0
    }

    return tx
  }
  async getContractData (
    proxy,
    denom,
    userAddress,
    minShares,
    exchange,
    exchangeApproveTarget,
    data,
    minAmount,
    sendAmount
  ) {
    let address = this.getContractToInteract(this.realeaseId)
    const ABI = await this.getContractABI(address)

    const contract = new web3.eth.Contract(JSON.parse(ABI), address)

    const txData = contract.methods
      .exchangeAndBuyShares(
        proxy,
        denom,
        userAddress,
        minShares,
        exchange,
        exchangeApproveTarget,
        data,
        minAmount
      )
      .encodeABI()

    let tx = {
      from: userAddress,
      to: address,
      data: txData,
      value: sendAmount * 10 ** 18
    }

    return tx
  }
  async getWithdrawalTxObject (userAddress, amount, token) {
    let tx = await this.getShareWithdrawalData(
      userAddress,
      token,
      amount,
      this.comptrollerProxy
    )
    let gas = await web3.eth.estimateGas(tx)
    if (gas) {
      tx.gas = gas
      tx.gasPrice = parseInt((await this.getGas()) * 1000000000)
    }
    return tx
  }
  async getBuyShareTxObjectForErc20 (userAddress, amount, token, comptrollerProxy) {
    let tx = await this.getErc20DepositData(
      userAddress,
      token,
      amount,
      comptrollerProxy
    )
    let gas = await web3.eth.estimateGas(tx)
    if (gas) {
      tx.gas = gas + 150000
      let val = parseInt(await this.getGas())
      tx.gasPrice = parseInt(val * 1000000000)
    }
    return tx
  }
  async getBuyShareTxObjectForEth (userAddress, amount) {
    let from = {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18
    }
    let to = {}

    to.address = this.fund.denominationAsset.id
    to.decimals = this.denominationAssetData.decimals
    let exchangeApproveTarget = '0xb70Bc06D2c9Bf03b3373799606dc7d39346c06B3'

    let res = await ParaSwapper.swap(amount, from, to, amount)
    if (res.transaction && res.transaction.to) {
      let tx = await this.getContractData(
        this.comptrollerProxy,
        to.address,
        userAddress,
        1,
        res.transaction.to,
        exchangeApproveTarget,
        res.transaction.data,
        res.minAmount,
        amount
      )
      let gas = await web3.eth.estimateGas(tx)
      if (gas) {
        tx.gas = gas
        tx.gasPrice = parseInt((await this.getGas()) * 1000000000)
      }

      return tx
    } else {
      // console.log(res, 'res.transaction')
    }
  }
  async isErc20ApprovalRequired (fromUserAddress, fromToken, amount, toAddress) {
    let transactionObject = {}

    let check = {
      required: false,
      error: false,
      transactionObject: null
    }
    try {
      const tokenContract = new web3.eth.Contract(abiArray, fromToken.address)

      const allowance = await tokenContract.methods
        .allowance(fromUserAddress, toAddress)
        .call()

      if (
        parseFloat(allowance) === 0 ||
      parseFloat(allowance) / (10 ** parseInt(fromToken.decimals)) < parseFloat(amount)
      ) {
        let nonce = await web3.eth.getTransactionCount(fromUserAddress, 'latest')
        check.required = true
        let tx = tokenContract.methods.approve(
          toAddress,
          web3.utils.toHex(amount * 100000000 * 10 ** fromToken.decimals)
        )

        transactionObject = {
          from: fromUserAddress,
          to: fromToken.address,
          data: tx.encodeABI(),
          nonce: nonce,
          value: 0
        }

        let gas = await web3.eth.estimateGas(transactionObject)
        if (gas) {
          transactionObject.gas = gas
          transactionObject.gasPrice = parseInt((await this.getGas()) * 1000000000)
        }
        check.transactionObject = transactionObject
      }
    } catch (error) {
      console.log(error, 'error')
    }

    return check
  }
}
window.Enzyme = new Enzyme()
export default window.Enzyme
