const axios = require('axios')
const Web3 = require('web3')
import store from '@/store'
import abiArray from '../../statics/abi/erc20.json'
import ParaSwapper from './ParaSwap'
import Formatter from '@/mixins/Formatter'
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

const sleep = (milliseconds) => {
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
  setFundAddress () {

  }
  async getTokenData (address) {
    let response = await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.ethplorer.io/getTokenInfo/' + address + '?apiKey=EK-kJ7LW-wCWTsAy-ALujf')
    if (response && response.data) {
      this.denominationAssetData = response.data
    }
    return response.data
  }
  async getFundData (fundAddress) {
    const enzymeEndPoint = 'https://data.enzyme.finance/api/fund/metrics/current?address=' + fundAddress
    let response = await axios.get(enzymeEndPoint)
    if (response && response.data.data) {
      this.fund = response.data.data
    }
  }
  async getComptrollerProxy (fundAddress) {
    let proxy = null
    let response = await axios.post(process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      { 'operationName': 'FundAuthorizedUsers', 'variables': { 'id': fundAddress }, 'query': 'query FundAuthorizedUsers($id: ID!) {  fund(id: $id) {    id    accessor {      id      authUsers(first: 1000) {        id        __typename      }      __typename    }    __typename  }}' })

    if (response && response.data && response.data.data) {
      proxy = response.data.data.fund.accessor.id
    }
    return proxy
  }
  async getInvestorData (userAddress) {
    let investor = null
    let data = (await this.getUserInvestments(userAddress.toLowerCase()))
    console.log(data, 'data 1')
    if (data && data.funds.length) {
      investor = {}
      investor.datasVaults = data.funds.map(f => {
        f.icon = 'https://token.enzyme.finance/' + f.denominationAsset.id
        f.vault = f.name
        f.denominationCoin = f.denominationAsset.symbol
        f.myshares = Format.formatNumber(f.investorShares, 2) + ' $US'
        f.sharePrice = Format.formatNumber(f.calculations.USD.price, 2) + ' $US'
        f.value = Format.formatNumber(f.calculations.USD.price * f.investorShares, 2) + ' $US'
        f.apy = Format.formatNumber(f.performance['1y'].USD.price * 100, 2) + '%'
        f.apyStyle = f.performance['1y'].USD.price < 0 ? 'red' : 'green'
        f.network = 'Ethereum'
        return f
      })
      investor.repartition = Object.assign({}, data).funds.map(f => f.calculations.USD.price * f.investorShares / data.aggregate.value.current.USD * 100)
      investor.totalPValue = Format.formatNumber(data.aggregate.value.current.USD, 2)
      let AvApy = investor.datasVaults.reduce((a, b) => (a ? a.performance['1y'].USD.price : 0) + (b ? b.performance['1y'].USD.price : 0), 0) * 100 / investor.datasVaults.length
      investor.avApy = {
        color: AvApy < 0 ? 'red' : 'green',
        value: Format.formatNumber(AvApy, 2)
      }
      let sinceInception = data.aggregate.value.current.USD - data.aggregate.value.previous.USD

      investor.sinceInception = {
        color: sinceInception < 0 ? 'red' : 'green',
        value: Format.formatNumber(sinceInception, 2)
      }
      investor.avgSharePrice = Format.formatNumber(investor.datasVaults.reduce((a, b) => (a ? a.calculations.USD.price : 0) + (b ? b.calculations.USD.price : 0), 0) / investor.datasVaults.length, 2)
      let thisMonth = investor.datasVaults.reduce((a, b) => (a ? a.performance['1m'].USD.price : 0) + (b ? b.performance['1m'].USD.price : 0), 0) * 100 / investor.datasVaults.length
      investor.thisMonth = {
        color: thisMonth < 0 ? 'red' : 'green',
        value: Format.formatNumber(thisMonth, 2)
      }
    }
    return investor
  }
  async getDeposits (fundAddress) {
    let data = null
    let response = await axios.post(process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      { 'operationName': 'FundInvestmentSharesChanges', 'variables': { 'id': fundAddress }, 'query': 'query FundInvestmentSharesChanges($id: ID!) {  fund(id: $id) {    id    investmentSharesChanges(first: 1000) {      ...InvestmentSharesChangeWithInvestor      __typename    }    __typename  }}fragment InvestmentSharesChangeWithInvestor on InvestmentSharesChangeInterface {  ...InvestmentSharesChange  investor {    id    __typename  }  __typename}fragment InvestmentSharesChange on InvestmentSharesChangeInterface {  shares  timestamp  fundState {    id    portfolio {      id      holdings {        id        asset {          id          __typename        }        price {          price          __typename        }        __typename      }      __typename    }    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  ...SharesBoughtEvent  ...SharesRedeemedEvent  __typename}fragment CurrencyPrice on CurrencyPrice {  id  price  currency {    id    __typename  }  __typename}fragment SharesBoughtEvent on SharesBoughtEvent {  id  investmentAmount  asset {    ...Asset    __typename  }  transaction {    id    __typename  }  __typename}fragment Asset on Asset {  id  name  symbol  decimals  type  __typename}fragment SharesRedeemedEvent on SharesRedeemedEvent {  id  fund {    accessor {      denominationAsset {        ...Asset        __typename      }      __typename    }    __typename  }  payoutAssetAmounts {    ...AssetAmount    __typename  }  transaction {    id    __typename  }  __typename}fragment AssetAmount on AssetAmount {  asset {    ...Asset    __typename  }  amount  price {    price    __typename  }  __typename}' })

    if (response && response.data && response.data.data) {
      data = response.data.data.fund.investmentSharesChanges.map(o => {
        o.network = 'Ethereum'

        if (o.asset) {
          o.icon = 'https://token.enzyme.finance/' + o.asset.id
          o.denominationCoin = o.asset.symbol
          o.amount = o.investmentAmount + ' ' + o.asset.symbol
          o.sharePrice = Format.formatNumber(o.investmentAmount / o.shares, 2) + ' $US'
        } else {
          let asset = o.payoutAssetAmounts[0].asset
          o.icon = 'https://token.enzyme.finance/' + asset.id
          o.amount = o.payoutAssetAmounts[0].amount + ' ' + asset.symbol
          o.denominationCoin = asset.symbol
          o.sharePrice = Format.formatNumber(o.investmentAmount / o.shares, 2) + ' $US'
        }
        o.date = (new Date(o.timestamp * 1000)).toLocaleString().substring(0, 9)
        o.price = o.fundState.currencyPrices.find(o => o.currency.id === 'USD').price

        o.tx = Format.getKeyFormat(o.transaction.id)
        for (let k in o) {
          if (!isNaN(o[k]) && !o[k].toString().includes('0x')) {
            o[k] = Format.formatNumber(o[k], 2)
          }
        }
        return o
      })
    }
    return data
  }
  async getFund (fundAddress) {
    let fund = null
    let response = await axios.post(process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      { 'operationName': 'FundDetails', 'variables': { 'id': fundAddress }, 'query': 'query FundDetails($id: ID!) {  fund(id: $id) {    ...FundDetails    __typename  }}fragment FundDetails on Fund {  id  accessor {    id    sharesActionTimelock    denominationAsset {      ...AssetWithPrice      __typename    }    __typename  }  inception  investmentCount  name  manager {    id    manager    __typename  }  release {    id    __typename  }  shares {    id    totalSupply    __typename  }  __typename}fragment AssetWithPrice on Asset {  ...Asset  price {    id    price    timestamp    __typename  }  __typename}fragment Asset on Asset {  id  name  symbol  decimals  type  __typename}' })
    if (response && response.data && response.data.data) {
      fund = response.data.data.fund
    }
    return fund
  }
  async isInvestor (fundAddress, investorAddress) {
    let found = false
    let comptrollerProxy = await this.getComptrollerProxy(fundAddress)
    let response = await axios.post(process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      { 'operationName': 'FundPolicies', 'variables': { 'comptrollerProxy': comptrollerProxy }, 'query': 'query FundPolicies($comptrollerProxy: ID!) {   comptrollerProxy(id: $comptrollerProxy) {     id     policySettings {       id       policy {         id         __typename       }       ...AdapterBlacklistSetting       ...AdapterWhitelistSetting       ...AssetBlacklistSetting       ...AssetWhitelistSetting       ...InvestorWhitelistSetting       ...MaxConcentrationSetting       ...MinMaxInvestmentSetting       ...BuySharesCallerWhitelistSetting       ...GuaranteedRedemptionSetting       __typename     }     __typename   } }  fragment AdapterBlacklistSetting on AdapterBlacklistSetting {   listed   enabled   __typename }  fragment AdapterWhitelistSetting on AdapterWhitelistSetting {   listed   enabled   __typename }  fragment AssetBlacklistSetting on AssetBlacklistSetting {   listed   enabled   __typename }  fragment AssetWhitelistSetting on AssetWhitelistSetting {   listed   enabled   __typename }  fragment InvestorWhitelistSetting on InvestorWhitelistSetting {   enabled   listedInvestors: listed(first: 1000) {     id     __typename   }   __typename }  fragment MaxConcentrationSetting on MaxConcentrationSetting {   enabled   maxConcentration   __typename }  fragment MinMaxInvestmentSetting on MinMaxInvestmentSetting {   enabled   minInvestmentAmount   maxInvestmentAmount   __typename }  fragment BuySharesCallerWhitelistSetting on BuySharesCallerWhitelistSetting {   enabled   listed   __typename }  fragment GuaranteedRedemptionSetting on GuaranteedRedemptionSetting {   enabled   startTimestamp   duration   __typename }' })
    if (response && response.data && response.data.data) {
      found = response.data.data.comptrollerProxy.policySettings.find(o => o.__typename === 'InvestorWhitelistSetting').listedInvestors.map(o => o.id.toLowerCase()).includes(investorAddress.toLowerCase())
    }
    return found ? 'whitelisted' : false
  }
  async getUserInvestments (userAddress) {
    let funds = null
    let response = await axios.post(process.env[store.state.settings.network].CACHE + 'https://services.enzyme.finance/api/enzyme/investor/funds?address=' + userAddress)
    if (response && response.data && response.data.data) {
      funds = response.data.data
    }
    return funds
  }

  async getTrades (fundAddress) {
    let trades = null
    let response = await axios.post(process.env[store.state.settings.network].CACHE + 'https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme',
      { 'operationName': 'FundTrades', 'variables': { 'id': fundAddress }, 'query': 'query FundTrades($id: ID!) {  fund(id: $id) {    id    trades(first: 1000) {      ...Trade      __typename    }    __typename  }}fragment Trade on Trade {  id  method  timestamp  adapter {    id    identifier    __typename  }  ...AddTrackedAssetsTrade  ...ApproveAssetsTrade  ...LendTrade  ...LendAndStakeTrade  ...ClaimRewardsAndReinvestTrade  ...ClaimRewardsAndSwapTrade  ...MultiLendTrade  ...MultiRedeemTrade  ...MultiTokenSwapTrade  ...RedeemTrade  ...TokenSwapTrade  ...UnstakeAndRedeemTrade  __typename}fragment AddTrackedAssetsTrade on AddTrackedAssetsTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment AssetAmount on AssetAmount {  asset {    ...Asset    __typename  }  amount  price {    price    __typename  }  __typename}fragment Asset on Asset {  id  name  symbol  decimals  type  __typename}fragment CurrencyPrice on CurrencyPrice {  id  price  currency {    id    __typename  }  __typename}fragment ApproveAssetsTrade on ApproveAssetsTrade {  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment LendTrade on LendTrade {  price  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment LendAndStakeTrade on LendAndStakeTrade {  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment ClaimRewardsAndReinvestTrade on ClaimRewardsAndReinvestTrade {  incomingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment ClaimRewardsAndSwapTrade on ClaimRewardsAndSwapTrade {  incomingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment MultiLendTrade on MultiLendTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment MultiRedeemTrade on MultiRedeemTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment MultiTokenSwapTrade on MultiTokenSwapTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmounts {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment RedeemTrade on RedeemTrade {  price  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment TokenSwapTrade on TokenSwapTrade {  price  incomingAssetAmount {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}fragment UnstakeAndRedeemTrade on UnstakeAndRedeemTrade {  incomingAssetAmounts {    ...AssetAmount    __typename  }  outgoingAssetAmount {    ...AssetAmount    __typename  }  fundState {    id    currencyPrices {      ...CurrencyPrice      __typename    }    __typename  }  __typename}' })
    if (response && response.data && response.data.data) {
      trades = response.data.data.fund.trades
    }
    return trades
  }
  async getGas () {
    let gas = false
    let res = await axios.get('https://services.enzyme.finance/api/gas')
    if (res && res.data && res.data.standard) {
      gas = parseFloat(res.data.standard)
    }
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
    let abiCall = process.env[store.state.settings.network].CACHE + 'https://api.etherscan.io/api?apikey=YBABRIF5FBIVNZZK3R8USGI94444WQHHBN&module=contract&action=getabi&address=' + address + ''

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
      '0x9134c9975244b46692ad9a7da36dba8734ec6da3': '0x2891b9b2cec874c46f252196964cbc6fe17ebfde',
      '0x7e6d3b1161df9c9c7527f68d651b297d2fdb820b': '0xbc9a63cad5a825bD5854Abca4f3D42d6aCF9Bffa'
    }
    return interact[address.toLowerCase()]
  }
  async init (address) {
    await this.getFundData(address)
    this.fundData = await this.getFund(address)

    this.realeaseId = this.fundData.release.id

    this.comptrollerProxy = await this.getComptrollerProxy(this.fund.address)
    this.denominationAssetData = await this.getTokenData(this.fund.denominationAsset.id)
  }
  async getUserShares (fundID, address) {
    let deposits = await this.getDeposits(fundID)
    let total = 0
    if (deposits) {
      deposits = deposits.filter(
        (o) =>
          o.__typename === 'SharesBoughtEvent' ||
            o.__typename === 'SharesRedeemedEvent'
      )

      total = deposits.filter(
        (o) => o.investor.id.toLowerCase() === address.toLowerCase()
      ).filter((o) => o.__typename === 'SharesBoughtEvent')
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

    const txData = contract.methods.redeemSharesDetailed(web3.utils.toHex(sendAmount * (10 ** fromToken.decimals)), [], []).encodeABI()

    let tx = {
      from: userAddress,
      to: toAddress,
      data: txData,
      value: 0
    }

    return tx
  }
  async getErc20DepositData (userAddress, fromToken, sendAmount, toAddress) {
    let address = '0x94F262802806BE3646612D0705802710dD5B58dF'
    const ABI = await this.getContractABI(address)
    const contract = new web3.eth.Contract(JSON.parse(ABI), address)

    const txData = contract.methods.buyShares([userAddress], [web3.utils.toHex(sendAmount * (10 ** fromToken.decimals))], [1]).encodeABI()

    let tx = {
      from: userAddress,
      to: toAddress,
      data: txData,
      value: 0
    }

    return tx
  }
  async getContractData (proxy, denom, userAddress, minShares, exchange, exchangeApproveTarget, data, minAmount, sendAmount) {
    let address = this.getContractToInteract(this.realeaseId)
    const ABI = await this.getContractABI(address)

    const contract = new web3.eth.Contract(JSON.parse(ABI), address)

    const txData = contract.methods.exchangeAndBuyShares(proxy, denom, userAddress, minShares, exchange, exchangeApproveTarget, data, minAmount).encodeABI()

    let tx = {
      from: userAddress,
      to: address,
      data: txData,
      value: sendAmount * 10 ** 18
    }

    return tx
  }
  async getWithdrawalTxObject (userAddress, amount, token) {
    let tx = await this.getShareWithdrawalData(userAddress, token, amount, this.comptrollerProxy)
    let gas = await web3.eth.estimateGas(tx)
    if (gas) {
      tx.gas = gas
      tx.gasPrice = (await this.getGas()) * 1000000000
    }
    return tx
  }
  async getBuyShareTxObjectForErc20 (userAddress, amount, token) {
    let tx = await this.getErc20DepositData(userAddress, token, amount, this.comptrollerProxy)
    let gas = await web3.eth.estimateGas(tx)
    if (gas) {
      tx.gas = gas
      tx.gasPrice = (await this.getGas()) * 1000000000
    }
    return tx
  }
  async getBuyShareTxObjectForEth (userAddress, amount) {
    let from = {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18
    }
    let to = { }

    to.address = this.fund.denominationAsset.id
    to.decimals = this.denominationAssetData.decimals
    let exchangeApproveTarget = '0xb70Bc06D2c9Bf03b3373799606dc7d39346c06B3'

    let res = await ParaSwapper.swap(amount, from, to, amount)
    if (res.transaction && res.transaction.to) {
      let tx = await this.getContractData(this.comptrollerProxy, to.address, userAddress, 1, res.transaction.to, exchangeApproveTarget, res.transaction.data, res.minAmount, amount)
      let gas = await web3.eth.estimateGas(tx)
      if (gas) {
        tx.gas = gas
        tx.gasPrice = (await this.getGas()) * 1000000000
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
    const tokenContract = new web3.eth.Contract(abiArray, fromToken.address)

    const allowance = await tokenContract.methods.allowance(fromUserAddress, toAddress).call()

    if (parseFloat(allowance) === 0 || parseFloat(allowance) < parseFloat(amount)) {
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
        transactionObject.gasPrice = (await this.getGas()) * 1000000000
      }
      check.transactionObject = transactionObject
    }

    return check
  }
}
window.Enzyme = new Enzyme()
export default window.Enzyme
