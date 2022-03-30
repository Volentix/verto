import axios from 'axios'
import store from '@/store'
import { computeForward } from '@/util/VolentixPools'
import { number_to_asset, asset } from 'eos-common'
import RenJS from '@renproject/ren'
import { Bitcoin, Ethereum } from '@renproject/chains'
import Lib from '@/util/walletlib'
import { Coins, MsgExecuteContract } from '@terra-money/terra.js'
import HD from '@/util/hdwallet'
import abiArray from '@/statics/abi/erc20.json'
const _1inch = process.env[store.state.settings.network].CACHE + 'https://api.1inch.exchange'
import {
  JsonRpc
} from 'eosjs'
import CW20s from '@/statics/json/cw20.json'
class Crosschaindex {
  constructor () {
    this.base = {
      godex: 'https://api.godex.io/api/v1/',
      oneinch: 'https://api.1inch.exchange/v3.0/'
    }
    this.cache = {}
    this['cwpairs'] = null
    this.exchangeLogo = {
      oneinch: 'https://duneanalytics.com/projects/pages/1inch/1inch.svg',
      defibox: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiUSq9pt4nXXFxXuyWhIxw7mOB1oH0wRgw6tBtb0bfLZAMX3aqTKjz6V4oma4u3zVYOfA&usqp=CAU',
      godex: 'https://api.bytecoin.org/storage/godex2.png',
      coinswitch: 'statics/icons/vtx-logo-1024x1024.png',
      renbridge: 'https://images.saymedia-content.com/.image/t_share/MTgxNzU2MTk4NTExNTg0ODc1/ren-cryptocurrency.png',
      terraswap: 'https://pbs.twimg.com/profile_images/1404064247651344392/FGavU7CT_400x400.png'
    }
    this.exchanges = ['godex']
    this.coinList = {
      godex: []
    }
    this.vtxEquiv = null
    this.getVtxEquivalent()
    this.currentExchange = null
  }
  setDex = exchange => {
    this.currentExchange = exchange
  }
  getRenMintTx (deposit, fromChain) {
    let amount = deposit._state.queryTxResult.out.amount
    let nhash = deposit._state.queryTxResult.out.nhash
    let sig = deposit._state.queryTxResult.out.signature

    // console.log(deposit, fromChain, 'mint, fromChain')
    // const utils_1 = require('@renproject/utils')
    const web3 = Lib.getWeb3Instance(fromChain)
    let params = deposit.params.contractCalls[0]
    let contractFn = params.contractFn
    const ABI = '[{"inputs":[{"internalType":"contract IGatewayRegistry","name":"_registry","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldRelayHub","type":"address"},{"indexed":true,"internalType":"address","name":"newRelayHub","type":"address"}],"name":"RelayHubChanged","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"relay","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"bytes","name":"encodedFunction","type":"bytes"},{"internalType":"uint256","name":"transactionFee","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"uint256","name":"gasLimit","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"approvalData","type":"bytes"},{"internalType":"uint256","name":"maxPossibleCharge","type":"uint256"}],"name":"acceptRelayedCall","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"bytes","name":"_to","type":"bytes"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHubAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes32","name":"_nHash","type":"bytes32"},{"internalType":"bytes","name":"_sig","type":"bytes"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"context","type":"bytes"},{"internalType":"bool","name":"success","type":"bool"},{"internalType":"uint256","name":"actualCharge","type":"uint256"},{"internalType":"bytes32","name":"preRetVal","type":"bytes32"}],"name":"postRelayedCall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"context","type":"bytes"}],"name":"preRelayedCall","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"relayHubVersion","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"setDefaultRelayHub","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'

    // let a = utils_1.payloadToABI(contractFn, params.contractParams)

    const contract = new web3.eth.Contract(JSON.parse(ABI), params.sendTo)
    let from = params.contractParams.find(o => o.name === '_address').value
    let symbol = params.contractParams.find(o => o.name === '_symbol').value
    // let callParams = params.contractParams.map((value) => value.value)
    //  console.log(callParams, symbol, from, amount, nhash, sig, contractFn)
    const txData = contract.methods[contractFn](symbol, from, amount, nhash, sig).encodeABI()

    let tx = {
      from: from,
      to: params.sendTo,
      data: txData,
      amount: parseFloat(deposit.depositDetails.amount) / 100000000,
      value: 0
    }
    return tx
  }
  getTxStatus = (order_id, exchange) => {
    const self = this
    let list = {
      godex () {
        return new Promise(async (resolve, reject) => {
          axios.get(self.base[exchange] + 'transaction/' + order_id).then(res => {
            if (res && res.data && res.data.status) {
              let data = {
                status: res.data.status
              }
              if (res.data.real_deposit_amount) {
                data.depositQuantity = parseFloat(res.data.real_deposit_amount)
                data.destinationQuantity = parseFloat(res.data.real_withdrawal_amount)
              }
              resolve(data)
            }
          })
        })
      }
    }

    return list[exchange]()
  };
  getCoinList = exchange => {
    const self = this
    let list = {
      godex () {
        return new Promise(async (resolve, reject) => {
          axios.get(self.base[exchange] + 'coins').then(res => {
            self.coinList[exchange] = []
            if (res && res.data && res.data.length) {
              // Remove support for multi address tokens (Ex. ZEC - Extra UI needed)
              res.data.filter(o => !o.multi).forEach(el => {
                let token = {
                  value: el.code.toLowerCase(),
                  image: el.icon,
                  label: el.name,
                  minimum: el.min_amount
                }
                self.coinList[exchange].push(token)
              })
              resolve({
                coins: self.coinList[exchange]
              })
            }
          })
        })
      }
    }
    return list[exchange]()
  }

  format1InchTokens (coins, chain) {
    coins = Object.keys(coins).map((key, index) => {
      let image = coins[key].symbol.toLowerCase() === 'eth' ? 'https://s3.amazonaws.com/token-icons/eth.png' : 'https://tokens.1inch.io/' + coins[key].address + '.png'

      let row = {
        'label': coins[key].name.toUpperCase(),
        'value': coins[key].symbol,
        'image': image,
        'address': coins[key].address,
        'decimals': coins[key].decimals,
        'price': coins[key].current_price,
        'dex': 'oneinch',
        'priority': ['eth', 'dai', 'hex', 'usdt', 'usdc'].reverse().indexOf(coins[key].symbol.toLowerCase())
      }
      return row
    })
    return coins.filter(function (el) {
      return el != null && el.address.toString() !== 'unknown'
    }).sort(function (a, b) {
      if (a.label && b.label && a.label.toLowerCase() < b.label.toLowerCase()) {
        return -1
      }
      return 1
    }).sort((a, b) => b.priority - a.priority)
  }
  async getCoinByChain (chain) {
    let self = this
    let coins = {
      async eth () {
        let result = await axios.get(_1inch + '/v3.0/1/tokens')
        coins = result.data.tokens
        return self.format1InchTokens(coins, 'bsc')
      },
      eos () {
        return store.state.settings.coins.defibox.sort((a, b) => b.priority - a.priority)
      },
      async bsc () {
        let result = await axios.get(_1inch + '/v3.0/56/tokens')
        coins = result.data.tokens
        return self.format1InchTokens(coins, 'bsc')
      },
      async matic () {
        let result = await axios.get(_1inch + '/v3.0/137/tokens')
        coins = result.data.tokens
        return self.format1InchTokens(coins, 'matic')
      },
      async terra () {
        /// let result = await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.terraswap.io/tokens')
        let c = [{ 'name': 'Ños Terra Test v2 reloaded', 'symbol': 'tNYOSTEST', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra15pr9sk7qkr46ys4gaxmsyl825m4fgl7fdjwqaj', 'verified': false }, { 'name': 'HAPPYJOY', 'symbol': 'JOY', 'decimals': 4, 'total_supply': '100000000000', 'contract_addr': 'terra1zppj8uz7w6xz3ktg6nj2r4ntzzypgpcy07t5qa', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4430', 'contract_addr': 'terra1m9dlyzueyqy3pdl3tzwn60lc7myhum7j0zq5p6', 'verified': false }, { 'name': 'TerraWeed', 'symbol': 'TerraWeed', 'decimals': 6, 'total_supply': '420000000000', 'contract_addr': 'terra1zvhvg09zeyl3txrc7v3crnqnnwc0d2nvgxvdhd', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3000000', 'contract_addr': 'terra10jmlz5uwz6w5hks8y9tretjjk4f8ad2me44lve', 'verified': false }, { 'name': 'BURNED TERRA', 'symbol': 'FIRE', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1f9h22l730vxxj5jmrakuwh3neuhdynwy42ezvv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '103652573411', 'contract_addr': 'terra1snem5zhmzj3q4wzm59tf98f0czsf6hcfpf703z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1d0zt56yn4lx24ewxy3n40ry6jg7e7xvrp2uhpq', 'verified': false }, { 'name': 'DogeKwon', 'symbol': 'DKWON', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra16xtp5rmhx4agcas4cyg3srp6m6gauqagh02v9z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '357275784644', 'contract_addr': 'terra122asauhmv083p02rhgyp7jn7kmjjm4ksexjnks', 'verified': false }, { 'name': 'Lido DAO Token (Wormhole)', 'symbol': 'weLDO', 'decimals': 8, 'total_supply': '20017578766220', 'contract_addr': 'terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z', 'icon': 'https://static.lido.fi/LDO/LDO.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1937752952479', 'contract_addr': 'terra1fepqumj8lea8w0au7mqluuthv0jly22tx0rcls', 'verified': false }, { 'name': 'Prism Governance Token', 'symbol': 'xPRISM', 'decimals': 6, 'total_supply': '30345574970506', 'contract_addr': 'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz', 'icon': 'https://prismprotocol.app/xprism.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2236067', 'contract_addr': 'terra1esgjh8xnmnrndcctdjz6ux5khdylcmgenyyq9r', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1208842992', 'contract_addr': 'terra1cmrl4txa7cwd7cygpp4yzu7xu8g7c772els2y8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3000000', 'contract_addr': 'terra1fa6hue6yjt90ytjuxqv6mlsmrm2agc7w6vjhd4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '941118572334', 'contract_addr': 'terra14ffp0waxcck733a9jfd58d86h9rac2chf5xhev', 'verified': false }, { 'name': 'WELCOMETOHELL', 'symbol': 'HELL', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra16pektynpxqrs66gk6cgqpwr7rjsudyfzustm6s', 'verified': false }, { 'name': 'iShares Gold Trust', 'symbol': 'mIAU (Delisted)', 'decimals': 6, 'total_supply': '525473266130', 'contract_addr': 'terra15hp9pr8y4qsvqvxf3m4xeptlk7l8h60634gqec', 'icon': 'https://whitelist.mirror.finance/icon/IAU.png', 'verified': true }, { 'name': 'Nexus Governance Token', 'symbol': 'Psi', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra12897djskt9rge8dtmm86w654g7kzckkd698608', 'icon': 'https://terra.nexusprotocol.app/assets/psi.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '14686312', 'contract_addr': 'terra105j7u0yn7gjx6sdnahd35a6n6f2hm6y6saqz07', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1jm8tx0aump43epcd8u0fspqp47agykvmmfrzh6', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '764088197', 'contract_addr': 'terra1k67ut87c2up66tury4qc4n96d85t43u20v24sy', 'verified': false }, { 'name': 'Uniswap (Wormhole)', 'symbol': 'weUNI', 'decimals': 8, 'total_supply': '0', 'contract_addr': 'terra1wyxkuy5jq545fn7xfn3enpvs5zg9f9dghf6gxf', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/8FU95xFJhUUkyyCLU13HSzDLs7oC4QZdXQHL6SCeab36/logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '31622776601', 'contract_addr': 'terra1tsg6xz8n86lz538psktzfca7fe35gp84pn487v', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100', 'contract_addr': 'terra1qajzf4lefy6wcvpc0dk7fvundp8arcukz7jwp4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486832', 'contract_addr': 'terra1wg3dhzz6m5q3dm738u6sxzxhld60l0chgvpele', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '6000000', 'contract_addr': 'terra1z36hglaqjgv867xr7e4jsz32pr7mcstjg2xm6u', 'verified': false }, { 'name': 'Terra Pump It Up', 'symbol': 'tPUMP', 'decimals': 6, 'total_supply': '95994342060508', 'contract_addr': 'terra1kp8vne240370hn722ec5sacsdluyt2j0gc5nph', 'verified': false }, { 'name': 'Derby Stars', 'symbol': 'DRBY', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1jusuf8pcuw56pmj0len5tcsdu9dm4xpqwqk48p', 'verified': false }, { 'name': 'TerraRX Token', 'symbol': 'TRX', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra18ky9ln4g6x3n9f9s8a5ttshynv6lgzfppmrmyg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1x9rpp68cesaf9mavgyy037pqpdpvp2mllt8yg3', 'verified': false }, { 'name': 'SHIT', 'symbol': 'SHIT', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1lkjq6f2sqlqjk0crs2a7fv6m5pquhl8nuesp3j', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '12524232970', 'contract_addr': 'terra14cee0hdd45fu3wwvkw5nr942f54dp0jsuta203', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '483040379', 'contract_addr': 'terra1nknmv45l04ft6t38zvw3xg0kqnwgqtqrewf2dh', 'verified': false }, { 'name': 'Starbucks Corporation', 'symbol': 'mSBUX', 'decimals': 6, 'total_supply': '12637281827', 'contract_addr': 'terra1246zy658dfgtausf0c4a6ly8sc2e285q4kxqga', 'verified': false }, { 'name': 'Kwon Bots', 'symbol': 'Kbots', 'decimals': 3, 'total_supply': '1000000000000000', 'contract_addr': 'terra1kqsgl8p84szmmv0npvsv0u5qlq5fng3zk8c4w0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3862', 'contract_addr': 'terra1423vexq03kadycrhzu4phqrwal8nrls6yzzv45', 'verified': false }, { 'name': 'Terra Squid', 'symbol': 'TSquid', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra18lx7nzwlp8sr83y2wymhj37fnrlehm7rj6lhlf', 'verified': false }, { 'name': 'Tether USD (Wormhole)', 'symbol': 'USDT', 'decimals': 8, 'total_supply': '78374100817', 'contract_addr': 'terra1vlqeghv5mt5udh96kt5zxlh2wkh8q4kewkr0dd', 'verified': false }, { 'name': 'AWESOME Money', 'symbol': 'AWE', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra14q0a4tfmdkwrvzakv7nq9jg2d36w8uj9jkhgee', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '766523', 'contract_addr': 'terra15mewh6pgu8lvwjvyp692ez0yfu386mtydw3vp7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3267072150', 'contract_addr': 'terra1gcutnc7f30xz22v3652twfvmfmj6utqsfn8wlc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra1yat0hf40dwwery3p060tvdh8glf7a8mza2rrmp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '78294807170', 'contract_addr': 'terra15uzdzdpv7gfzl84yhx53uz6769krhf6krd3s7c', 'verified': false }, { 'name': 'Tesla, Inc.', 'symbol': 'mTSLA', 'decimals': 6, 'total_supply': '12451146274', 'contract_addr': 'terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh', 'icon': 'https://whitelist.mirror.finance/icon/TSLA.png', 'verified': true }, { 'name': 'Angel Protocol Token', 'symbol': 'HALO', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1w8kvd6cqpsthupsk4l0clwnmek4l3zr7c84kwq', 'icon': 'https://angelprotocol.io/favicon.png', 'verified': true }, { 'name': 'LOOP token', 'symbol': 'LOOP', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1nef5jf6c7js9x6gkntlehgywvjlpytm7pcgkn4', 'icon': 'https://loop.markets/token/logo2.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3030000', 'contract_addr': 'terra15qmh9jl388v2hr2yn75v8psdj0q9ghfwwxzckg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '15955318685', 'contract_addr': 'terra16auz7uhnuxrj2dzrynz2elthx5zpps5gs6tyln', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1372290786971', 'contract_addr': 'terra17dkr9rnmtmu7x4azrpupukvur2crnptyfvsrvr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1cv5l73x70wjcs7tz94tz24y874wgu8xktn02t9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '211925231509', 'contract_addr': 'terra1s0dgcsdy9kgunnf3gnwl40uwy9rxtmc39mhy2m', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2544460764302', 'contract_addr': 'terra1y9kxxm97vu4ex3uy0rgdr5h2vt7aze5sqx7jyl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2210845941', 'contract_addr': 'terra1mtvslkm2tgsmh908dsfksnqu7r7lulh24a6knv', 'verified': false }, { 'name': 'DogeKwon Terra', 'symbol': 'DKWON', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra14f7u8z4eqpxcrp4xr6knhgfp5n4h68nwy3yzg5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '38633564', 'contract_addr': 'terra16gqa7q433a2q7d6ankxz0qk4pwet53fakazqv9', 'verified': false }, { 'name': 'umnt', 'symbol': 'MNT', 'decimals': 6, 'contract_addr': 'umnt', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/MNT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5400704139', 'contract_addr': 'terra1mc4tyswf0msvm2358x7eyrlswn54n6x973v60a', 'verified': false }, { 'name': 'FINISH', 'symbol': 'FINAAAZ', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra105hjuy8z0j0w4m0frlaynrnu8smk8qrsk36mas', 'verified': false }, { 'name': 'LunaApe2', 'symbol': 'APE', 'decimals': 6, 'total_supply': '96284325533784', 'contract_addr': 'terra1zf00lfqwe6ackx0lcl5ys6lzmdhmvmn6sz2rh8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '132241928861', 'contract_addr': 'terra18fafa8k888gyu3zza7dhcc77xvfzwplnqe909y', 'verified': false }, { 'name': 'ProShares VIX Short-Term Futures ETF', 'symbol': 'mVIXY', 'decimals': 6, 'total_supply': '506403438040', 'contract_addr': 'terra19cmt6vzvhnnnfsmccaaxzy2uaj06zjktu6yzjx', 'icon': 'https://whitelist.mirror.finance/icon/VIXY.png', 'verified': true }, { 'name': 'Osmosis', 'symbol': 'OSMO', 'decimals': 6, 'contract_addr': 'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B', 'icon': 'https://assets.terra.money/icon/svg/ibc/OSMO.svg', 'verified': true }, { 'name': 'LUART Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1cu7zc3q8089cuu4z5ed5nl4c9w59qqhs2mmfyy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3737', 'contract_addr': 'terra1pg9ukye32aga2z8kqxdkdmyeyx8un6lhdvszrc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '34917941699', 'contract_addr': 'terra1k5kumxd24cyvhf52r5u4ywlr3ztktj657wnf7a', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1mmjzshcvdhtalmtugqalam7l9vk507ncmpu3q2', 'verified': false }, { 'name': 'uaud', 'symbol': 'AUT', 'decimals': 6, 'contract_addr': 'uaud', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/AUT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1wfms03rc04cdc0xvs7rh8z3s498ns2zgqctq7y', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '411096085', 'contract_addr': 'terra1hrrdpncsr6z978kekdamdaw9jrxjr5r5qtsdas', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1skhn7p85uyqle4yyxvdvr92d0lj70hvctdu9dw', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1aeusm5e93ptz2twem0vpfy370c7d7vy2dp0vke', 'verified': false }, { 'name': 'DogeKwon Terra', 'symbol': 'DKWON', 'decimals': 6, 'total_supply': '110000000000000', 'contract_addr': 'terra17zhwz3s95dwcw373eklrscvn4jr6f7sd7qpk7y', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277', 'contract_addr': 'terra1grmmss2wq0e52uz77wudxfqdgwt6gxqmdrvajc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5222493162', 'contract_addr': 'terra19umy5s6eal7kekrddw792wmcftxvsktc2wxzpf', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '695', 'contract_addr': 'terra13p06gkedafgwg57fdhvsrxra88q6ydx97l55nl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra12pltplchslx9wmsc2mey5hvramycnmnra974f2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '353975067', 'contract_addr': 'terra1jyy5a49r77le4l566m4wfun3pkpm0ed7n0luk8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766016', 'contract_addr': 'terra14dgkwkplgmw9tkdf4rc72ppk6q5p2mu0uhfl09', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '41871539422', 'contract_addr': 'terra1n3gt4k3vth0uppk0urche6m3geu9eqcyujt88q', 'verified': false }, { 'name': 'GUILDONG', 'symbol': 'HONG', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra18tc5vrxzvxwlcchq83d4nxy635cu87v8g0030y', 'verified': false }, { 'name': 'Lido staked SOL (Wormhole)', 'symbol': 'wsstSOL', 'decimals': 8, 'total_supply': '1083369007631', 'contract_addr': 'terra1t9ul45l7m6jw6sxgvnp8e5hj8xzkjsg82g84ap', 'icon': 'https://static.lido.fi/stSOL/stSOL.png', 'verified': true }, { 'name': 'BOUNTY', 'symbol': 'BUG', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1d6vy3aueuucu3sf5qkrccnq7v58uwegh9m9x74', 'verified': false }, { 'name': 'PayPal Holdings Inc', 'symbol': 'mPYPL', 'decimals': 6, 'total_supply': '9716443383', 'contract_addr': 'terra1rh2907984nudl7vh56qjdtvv7947z4dujj92sx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '105001906720', 'contract_addr': 'terra1veqh8yc55mhw0ttjr5h6g9a6r9nylmrc0nzhr7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '22360679774', 'contract_addr': 'terra1ze0k9tty5hrn0t0m2dt4j0sde7vgjsrttczt7g', 'verified': false }, { 'name': '1 COIN is 1 NFT', 'symbol': 'DEGEN', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1c0awzlg4ujlt0c2prwtukqeapg2m4qty5fdgs2', 'verified': false }, { 'name': 'utwd', 'symbol': 'TWT', 'decimals': 6, 'contract_addr': 'utwd', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/TWT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '432137806221', 'contract_addr': 'terra1lzacmnuaceg2578lpxemnx5mts5es8fnf2d6u2', 'verified': false }, { 'name': 'somethingcool.xom2', 'symbol': 'someee', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1hfyxtste6842zulmjv9n92srv803q6rhn7t8d4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1fhvkxz23x2w5kgsag0dteecwmfu9zk9l0frurh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '155091761243', 'contract_addr': 'terra1p60datmmf25wgssguv65ltds3z6ea3me74nm2e', 'verified': false }, { 'name': 'VKR Token', 'symbol': 'VKR', 'decimals': 6, 'total_supply': '954641846561782', 'contract_addr': 'terra1dy9kmlm4anr92e42mrkjwzyvfqwz66un00rwr5', 'icon': 'https://app.valkyrieprotocol.com/icon_vkr.png', 'verified': true }, { 'name': 'dsh', 'symbol': 'DSHA', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra194a6jn3cyydhrfpdnz5r5zkj6wx3t3cr673z4r', 'verified': false }, { 'name': 'Ños Terra Tes v3t', 'symbol': 'tNYOSTESTIII', 'total_supply': '1000000000000000', 'contract_addr': 'terra155kdqp7le4fw8z8m7wk6c62d6dg5mgdug924nq', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3692', 'contract_addr': 'terra1vc96k8egcj6wejqjd9k2ng52qlnk4ncucaa2dh', 'verified': false }, { 'name': 'Apollo DAO Token', 'symbol': 'APOLLO', 'decimals': 6, 'total_supply': '64700000000000', 'contract_addr': 'terra100yeqvww74h4yaejj6h733thgcafdaukjtw397', 'icon': 'https://finder.extraterrestrial.money/images/APOLLO60.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '6338531457644', 'contract_addr': 'terra1q6r8hfdl203htfvpsmyh8x689lp2g0m7856fwd', 'verified': false }, { 'name': 'Locker Test', 'symbol': 'LOCK', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra14s3g6jmytjjg2jcxmmaj6k837vcr6h98muxc07', 'verified': false }, { 'name': 'L Test', 'symbol': 'TLU', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra14zeffuryjlzw566k7cfrnzf9dy94qeat2xvcda', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '15039202382243', 'contract_addr': 'terra1swpfg0q9uz0ct4tqfdunrumnxx8zxxzdlnlfkw', 'verified': false }, { 'name': 'Facebook Inc.', 'symbol': 'mFB', 'decimals': 6, 'total_supply': '7188108941', 'contract_addr': 'terra1mqsjugsugfprn3cvgxsrr8akkvdxv2pzc74us7', 'icon': 'https://whitelist.mirror.finance/icon/FB.png', 'verified': true }, { 'name': 'LUART Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1ckvmptla24qm80yrwkxluhptee4y8h3gemwkw7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2236067977', 'contract_addr': 'terra166y3h6l4k42lrrj83y4lp9cdyqyxhv4cnkrjs7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1414213', 'contract_addr': 'terra19ekpmkxnysep0tuxza66z475vfd79xput6dw9l', 'verified': false }, { 'name': 'ProShares VIX Short-Term Futures ETF', 'symbol': 'mVIXY (Delisted)', 'decimals': 6, 'total_supply': '2176087637763', 'contract_addr': 'terra1zp3a6q6q4953cz376906g5qfmxnlg77hx3te45', 'icon': 'https://whitelist.mirror.finance/icon/VIXY.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1034311', 'contract_addr': 'terra1mt0k2prm85vp937uevm9p2390j9f58plvk2m59', 'verified': false }, { 'name': 'NIO Inc.', 'symbol': 'mNIO', 'decimals': 6, 'total_supply': '42136895555', 'contract_addr': 'terra1dj2cj02zak0nvwy3uj9r9dhhxhdwxnw6psse6p', 'verified': false }, { 'name': '1BIL', 'symbol': 'ONEBIL', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1cjf3m2zsx4lu6c0edhfcvp0v4hps6gfr79hyc4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '7296625050627', 'contract_addr': 'terra10n7l0rxnmwjehufywtvd3lj952rxdt7n8e9skp', 'verified': false }, { 'name': 'United States Oil Fund, LP', 'symbol': 'mUSO', 'decimals': 6, 'total_supply': '156113528819', 'contract_addr': 'terra1lvmx8fsagy70tv0fhmfzdw9h6s3sy4prz38ugf', 'icon': 'https://whitelist.mirror.finance/icon/USO.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1340728811', 'contract_addr': 'terra1azk43zydh3sdxelg3h4csv4a4uef7fmjy0hu20', 'verified': false }, { 'name': 'ujpy', 'symbol': 'JPT', 'decimals': 6, 'contract_addr': 'ujpy', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/JPT.png', 'verified': true }, { 'name': 'Prism yLuna Token', 'symbol': 'yLuna', 'decimals': 6, 'total_supply': '596704876751', 'contract_addr': 'terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz', 'icon': 'https://home.prismprotocol.app/yluna.png', 'verified': true }, { 'name': 'GOOD COFFEE', 'symbol': 'COFFEE', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1d633fx8wlpgqnns9j4xw66cq6ypdy4u8r0rr7j', 'verified': false }, { 'name': 'RoboHero', 'symbol': 'ROBO', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra19qad83kr29qg89fpl4qh8m02wapmlwzpw5hvc4', 'verified': false }, { 'name': 'Kishu Inu Need 🌗💵 ', 'symbol': 'KINU', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1c5fr3wdf2trj3dkxcckhmzzxlnnpepqn8cu8f8', 'verified': false }, { 'name': 'TerraPunks', 'symbol': 'TPUNKS', 'decimals': 6, 'total_supply': '752000000000000', 'contract_addr': 'terra1rfqm5zwkep3jk845nf565yyua66uj654y2vzx3', 'verified': false }, { 'name': 'TerraLand', 'symbol': 'LAND', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1ckkyhfxnqkumqrvmpl6rnrjzvklephzvsse57z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1xsfjx985rvkchme4wws0fjt79x3wylmjyhvvv2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '63245553', 'contract_addr': 'terra1hz2xxt4saxl79k4p3c9pqutldyqcugwuh8fzpl', 'verified': false }, { 'name': 'RoboHero Token', 'symbol': 'ROBO', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1l4uygw365sgdgvasmckkd7lcawyemzn9k83lrh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1tctqptkl50uxqt3wgpt02cmk8vxye3a3fvcm7f', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1ksymk0cy2lvhqljsa97c0t7098843289k6pneu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3478505426', 'contract_addr': 'terra1qsem5279xw6ry5ntcffwh0ypnexhhz474j4yhm', 'verified': false }, { 'name': 'Safe Luna', 'symbol': 'sLUNA', 'decimals': 6, 'total_supply': '750000000000000', 'contract_addr': 'terra10famrcyze8z9c84x5726aplefwuf4k2zqf3rxr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2621297544', 'contract_addr': 'terra1xqeym28j9xgv0p93pwwt6qcxf9tdvf9ztfxf0w', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '37817', 'contract_addr': 'terra18y8qtp8slkdrfdf8hvfjhk6w7rn5vm4hhegngy', 'verified': false }, { 'name': 'Twitter, Inc.', 'symbol': 'mTWTR', 'decimals': 6, 'total_supply': '207209538933', 'contract_addr': 'terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg', 'icon': 'https://whitelist.mirror.finance/icon/TWTR.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra1kdx0f3un67ds5a0pnx38krgpvkfar98gl3myfu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1knrlem7cg0ywg5hldmghlj8eqh0f8lw2fhc599', 'verified': false }, { 'name': 'Alto Protocol', 'symbol': 'ALTO', 'decimals': 6, 'total_supply': '200000000000000', 'contract_addr': 'terra1q93ws00plywc5prwv7mf2gdf7alhuqgk5w68lq', 'verified': false }, { 'name': 'Magic Internet Money (Wormhole)', 'symbol': 'MIM', 'decimals': 8, 'total_supply': '6581073890114', 'contract_addr': 'terra15a9dr3a2a2lj5fclrw35xxg9yuxg0d908wpf2y', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4226', 'contract_addr': 'terra1wrwxmmea6nxktx09hf2f2m5m0473wnq9lxhn66', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1p7zqell9644a5dn5347dz4gy7uzlfckp3l9jru', 'verified': false }, { 'name': 'Terra Squad', 'symbol': 'SQUAD', 'decimals': 6, 'total_supply': '800000000000000', 'contract_addr': 'terra1ng3nsd3u3emflmp4rv7ac70ug3g87pt930g6t5', 'verified': false }, { 'name': 'Prism pLuna Token', 'symbol': 'pLuna', 'decimals': 6, 'total_supply': '596742876751', 'contract_addr': 'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2', 'icon': 'https://home.prismprotocol.app/pluna.png', 'verified': true }, { 'name': 'Microsoft Corporation', 'symbol': 'mMSFT', 'decimals': 6, 'total_supply': '30988072828', 'contract_addr': 'terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6', 'icon': 'https://whitelist.mirror.finance/icon/MSFT.png', 'verified': true }, { 'name': 'Sushi🍣', 'symbol': 'SUSHI', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1cnsxjj0378qwu3p5vmrja6j9f84gepvt6r62rw', 'verified': false }, { 'name': 'NIKE, Inc.', 'symbol': 'mNKE', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra17ana8hvzea0q7w367dm0dw48sxwql39qekpt7g', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '63002719090', 'contract_addr': 'terra1xwyhu8geetx2mv8429a3z5dyzr0ajqnmmn4rtr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '88207152896', 'contract_addr': 'terra17rm53s5vhjpfrjkhappmswczcmhl8zqdwlfwtm', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '20000', 'contract_addr': 'terra126pa5vgw2ca80yd8gnk4fs08ef94g6j2f4kjcu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1y3c0z35uju9apsn0faewjdw630tqalhmtpgtc5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1455030781646', 'contract_addr': 'terra1t4uuc09t4ld560vg2k9w2f5m9e5trftnym50zj', 'verified': false }, { 'name': 'Dan Token', 'symbol': 'DAN', 'decimals': 6, 'total_supply': '36000000000', 'contract_addr': 'terra1vru3mk2ne3jqpwg24wm5mg2356cg5ead0tae2s', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000010', 'contract_addr': 'terra14y8k4uux6x76wjqdy9vpqqunhtmjsd5vu0jxv5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1ldlsayhau0qdj92j9r5nzy4mfr2gunqv6qukdj', 'verified': false }, { 'name': '𝐌azaterra', 'symbol': 'maza', 'decimals': 3, 'total_supply': '100000000', 'contract_addr': 'terra15823sstx9pl2fqacnpaxsj9jsku2rjrk4aj34z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '63437716871', 'contract_addr': 'terra1ktckr8v7judrr6wkwv476pwsv8mht0zqzw2t0h', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1622776', 'contract_addr': 'terra1s26qlejx4lhqd3ruc7tp2lg3xu40rk2wpxssrn', 'verified': false }, { 'name': 'TOKENTOKEN', 'symbol': 'TOKO', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra17zucl25842g99vytr9yzw0eqmql3wwpql357cx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra19pztt2p6wuy63dehanjeuyf7vx399ptwdq93zj', 'verified': false }, { 'name': 'LOOPR token', 'symbol': 'LOOPR', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra1jx4lmmke2srcvpjeereetc9hgegp4g5j0p9r2q', 'icon': 'https://loop.markets/token/logo3.png', 'verified': true }, { 'name': 'YUMIs', 'symbol': 'CELL', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1xk0a738cxushekjtvf6f9qtr7uz36yxc3egne4', 'verified': false }, { 'name': 'SolanaSail Governance Token V2', 'symbol': 'whgSAIL', 'decimals': 8, 'total_supply': '200000000', 'contract_addr': 'terra1rl0cpwgtwl4utnaynugevdje37fnmsea7rv4uu', 'icon': 'https://ipfs.io/ipfs/QmNNt1xoyB7gwjLLzUYMELYGY277ZzZXJw1vhnZW18Wozq?filename=logo_GSAIL.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1373010102863', 'contract_addr': 'terra1cmqv3sjew8kcm3j907x2026e4n0ejl2jackxlx', 'verified': false }, { 'name': 'TOKENTOKEN', 'symbol': 'TOKO', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra145627szryw7lxr58cvclx9aj468qupld4vnf88', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '63245553', 'contract_addr': 'terra120zjj4dze8wll9c0xtxsmds7zv26n0cam852kp', 'verified': false }, { 'name': 'Testtttt', 'symbol': 'Testtttt', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1js38ca30k0gt9rz53jc8x47yt638l8f86d5lpt', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1erl67wndtyf2nngpy2lr0xj5z7yrustt3v2jew', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '56394226334', 'contract_addr': 'terra1jvewsf7922dm47wr872crumps7ktxd7srwcgte', 'verified': false }, { 'name': 'terraSUN', 'symbol': 'SUN', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1ghnll5fz4n6c0vt47jdnnyrjgfg4fgnqnchwys', 'verified': false }, { 'name': 'Luart Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra12flsr4mk5sxmu8yk7m8zc5f44tfx00yjvzj7v4', 'verified': false }, { 'name': 'Astroport Token', 'symbol': 'ASTRO', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3', 'icon': 'https://astroport.fi/astro_logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '7292', 'contract_addr': 'terra1da9qfgpar8v427x9me632qpk3jna4q37z2asn8', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra1jwnz2uet8f4yjqyntgsfrplp503wutt24n7srk', 'verified': false }, { 'name': 'BLUESKY', 'symbol': 'SKY', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1x95tutcwe4tjxcdvtgrjg5jxkf24sm74xz3leq', 'verified': false }, { 'name': 'justatest', 'symbol': 'justatest', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1dkhqqfc4gkrcs35xjndvea7fl3mur0uptzmaxr', 'verified': false }, { 'name': 'AstroPug Token', 'symbol': 'PUG', 'decimals': 6, 'total_supply': '100000000000000000', 'contract_addr': 'terra1kdfsdm3c4reun9j3m4mk3nmyw4a4ns7mj24q3j', 'icon': 'https://raw.githubusercontent.com/astropug/astropug-world/master/logo.png', 'verified': true }, { 'name': 'iShares Silver Trust', 'symbol': 'mSLV', 'decimals': 6, 'total_supply': '483688238165', 'contract_addr': 'terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp', 'icon': 'https://whitelist.mirror.finance/icon/SLV.png', 'verified': true }, { 'name': 'Coinhall🚀', 'symbol': 'THEBEST', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1q9ec5g6q0s3ncl9v068jkk5s2eae8ng3lxqtlf', 'verified': false }, { 'name': 'Terra Raca', 'symbol': 'tRACA', 'decimals': 6, 'total_supply': '5000000000000', 'contract_addr': 'terra1jsxp2vt60nqfsuru6s6ewgfld7vpwgkvv5qqgl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '54424146098', 'contract_addr': 'terra17smg3rl9vdpawwpe7ex4ea4xm6q038gp2chge5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2419075', 'contract_addr': 'terra1nafrz6yep84lvphmj03gryht3exa624ttgkf06', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '116669428312', 'contract_addr': 'terra1tuw46dwfvahpcwf3ulempzsn9a0vhazut87zec', 'verified': false }, { 'name': 'Wrapped BTC (Wormhole)', 'symbol': 'weWBTC', 'decimals': 8, 'total_supply': '428663347', 'contract_addr': 'terra1aa7upykmmqqc63l924l5qfap8mrmx5rfdm0v55', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh/logo.png', 'verified': true }, { 'name': 'BabyTerraFloki', 'symbol': 'BabyTFLOKI', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra13sg4qarsjual8ew8sr4nwtkv6ut4dd3378820r', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10', 'contract_addr': 'terra1ceg8925w6y833wsn5lv7srpf64uw9rf3fsgwxf', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1udkgg8n4ynny7njj7fra88lkmjw8f3ggy0crdu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1ky8la6rcvuj7ks02lj0vqsg808jj8rq6sy5lux', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5931', 'contract_addr': 'terra1mkmwqqzdhy6lvlxy3xel7m9uxsaq7n22rvs7t5', 'verified': false }, { 'name': 'KIMCHI COIN', 'symbol': 'KIMCHI', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1a59ns8fnk04sj982ymkvx9ygscmf4jjtm4sltg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra15rsfzmyk0vfch3dg3wve6l2cggppmuuyfxjawx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '16166292441', 'contract_addr': 'terra1y8kxhfg22px5er32ctsgjvayaj8q36tr590qtp', 'verified': false }, { 'name': 'MAGA Coin', 'symbol': 'MAGA', 'decimals': 6, 'total_supply': '20240000000000000', 'contract_addr': 'terra1qxfhvu3w83azgs4ghk3v5z2nvmzg8td5gqfd69', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '63245553203', 'contract_addr': 'terra13wn4sj9c09638wdxn73d2hgzlzg2dp5gh4fj4c', 'verified': false }, { 'name': 'Alphabet Inc.', 'symbol': 'mGOOGL', 'decimals': 6, 'total_supply': '3578299849', 'contract_addr': 'terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt', 'icon': 'https://whitelist.mirror.finance/icon/GOOGL.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '44568433', 'contract_addr': 'terra1s3v0ftwx0vuhy9482hudf5z8u0vsmrkn4nremh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '875972', 'contract_addr': 'terra13k9lu3kcvee27lw66fw075t9jvza9xjyhyaz0z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4456666405658', 'contract_addr': 'terra1khm4az2cjlzl76885x2n7re48l9ygckjuye0mt', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '94868329', 'contract_addr': 'terra1u2f86x2fagtz3fghdc4ymc6dat3arepfu3rtum', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '444402', 'contract_addr': 'terra1svwqdq0gcuw2q2vzmy76qjvl2pnwaz65d4xvs0', 'verified': false }, { 'name': 'Terra Cats', 'symbol': 'Cats', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1hc9zu9jx0vy5gt8yl7evu0wk6xvjl0ylnsg75x', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '6435941460', 'contract_addr': 'terra184ufgqclvjkuycs82j0fp4xha8r6rryp7luj7g', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra15rsfe8x9w3p7hl9n4ptawzw40x29t4w4h0hhnq', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '114905137995', 'contract_addr': 'terra1halhfnaul7c0u9t5aywj430jnlu2hgauftdvdq', 'verified': false }, { 'name': 'howtest', 'symbol': 'howtest', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra16hwgds2089kktskluq8dh5ntw7eu5e4q4z6ud4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '287628344', 'contract_addr': 'terra1f3wqhqe7sad8f8vjvsjjv0na3w2xcc639njxjm', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1ade4g64fk6jx3udjxrxz0lppqne3y2turx7cc7', 'verified': false }, { 'name': 'ucny', 'symbol': 'CNT', 'decimals': 6, 'contract_addr': 'ucny', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/CNT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2725', 'contract_addr': 'terra1a9z6wmutvfnl7va3e85mmfu90uph0lx3jtq9m4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '17211765825', 'contract_addr': 'terra14r3jnk537uwkgvuwg227jj3z50xcetwtjcj7sh', 'verified': false }, { 'name': 'test dont buy 100', 'symbol': 'testd', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1rxfw0y02hfhnase727dqpn8kn2uu49qwrwul8t', 'verified': false }, { 'name': 'Spectrum Token', 'symbol': 'SPEC', 'decimals': 6, 'total_supply': '10405196326351', 'contract_addr': 'terra1s5eczhe0h0jutf46re52x5z4r03c8hupacxmdr', 'icon': 'https://terra.spec.finance/assets/SPEC.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '31939003', 'contract_addr': 'terra166h9t9xrsy0wq8t7hpdjx52eecze4gcussgr44', 'verified': false }, { 'name': 'ChainLink Token (Wormhole)', 'symbol': 'weLINK', 'decimals': 8, 'total_supply': '0', 'contract_addr': 'terra12dfv3f0e6m22z6cnhfn3nxk2en3z3zeqy6ctym', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2wpTofQ8SkACrkZWrZDjXPitYa8AwWgX8AfxdeBRRVLX/logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1962315554', 'contract_addr': 'terra13gq946x6dddjzfa2dwpr2pq6uknqnafspzkzr0', 'verified': false }, { 'name': 'DragonSB Token', 'symbol': 'DragonSB', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra1nh6theuhf4pv67pcyqnz58czljr382mxrp2rdh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra143szxpzsamn9x6z2uwjm58369n9dmzt2rr77sk', 'verified': false }, { 'name': 'TLP', 'symbol': 'TLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1j0te9qwyxggd9xq7vhscnnek7yg7cv5gpgurer', 'verified': false }, { 'name': 'SAS Token', 'symbol': 'SAS', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1ypgjelmtp0mv5akzwmnj5xhukhd3fy9gd28wpj', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '136165698493', 'contract_addr': 'terra1mwu3cqzvhygqg7vrsa6kfstgg9d6yzkgs6yy3t', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '500000000', 'contract_addr': 'terra16rc4cgt4a70jfzlylyqu534m3c64tvklch2p0m', 'verified': false }, { 'name': 'dsh', 'symbol': 'FSH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1e6lfxnuyqg3wxvczuz0zkmvr40ldvqx26eqk5g', 'verified': false }, { 'name': 'SWAP finance', 'symbol': 'SWAP', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1gcfdqwp2ztyn22mu845n7axlua6nwt38s4nkdl', 'verified': false }, { 'name': 'TOKENTOKEN', 'symbol': 'TOKO', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra1z0ewtcsaskfmsp6ue59skulunehzv27ndw5yl0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486', 'contract_addr': 'terra1gggcqzd4su09erq8e3g8f9qdf7dydcj7mj9qdc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4821', 'contract_addr': 'terra1a6unyqwce532dq9z9uez3l5du2zqhqlek8cg2p', 'verified': false }, { 'name': 'Terraformer', 'symbol': 'TFM', 'decimals': 6, 'total_supply': '200000000000000', 'contract_addr': 'terra17qkws34rpkzp5clc86xkyal8235lugj38dhk5v', 'verified': false }, { 'name': 'STAR TERRA', 'symbol': 'STAR', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1wky9xanuqfjjy4kxt8xa2pcrf7x6lf0zlwenq0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1q88d7swxfd36kcfeqhgdncjrht9rsh7c0a9vm3', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '387508979', 'contract_addr': 'terra1l8jgxd9uv430rdt2u58h4h7kdfxsle4w6w2ecq', 'verified': false }, { 'name': 'Darth Vader Token', 'symbol': 'DVT', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1nzvqd5mr0jn58cvam9j06k9kry4myu0vp7a9ug', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra147g92kn88fhyjxgt4lut827smfgtjqngpg8873', 'verified': false }, { 'name': 'Coca Cola', 'symbol': 'COKE', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1yuvwz0wzd49mjlvh24g23jst89dllua0nc3knt', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000', 'contract_addr': 'terra1wdjsxymg424mw4sv6zmw4luqajwxa5e7qfvfxw', 'verified': false }, { 'name': 'Orion Money Token', 'symbol': 'ORION', 'decimals': 8, 'total_supply': '1813178893898476', 'contract_addr': 'terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03', 'icon': 'https://orion.money/assets/ORION-LOGO-2.1-GREEN@256x256.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '908570411', 'contract_addr': 'terra1srwc8xh9d5zx700n7n7unq4eww620vw384pwvg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1ter57huylshhqmkjr0m8kkl773tk7f5p3dgjqv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1938334864', 'contract_addr': 'terra1tnpd7tzz7nyd7a2uq2kcu0r9pue5fwmafph9qg', 'verified': false }, { 'name': 'ugbp', 'symbol': 'GBT', 'decimals': 6, 'contract_addr': 'ugbp', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/GBT.png', 'verified': true }, { 'symbol': 'aUST', 'decimals': 6, 'total_supply': '4867506998101195', 'contract_addr': 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu', 'icon': 'https://whitelist.anchorprotocol.com/logo/aUST.png', 'verified': true }, { 'name': 'test ttoken', 'symbol': 'tTEST', 'decimals': 3, 'total_supply': '1000000000000000', 'contract_addr': 'terra172hwjglf7rsgrnwet52zqnzjhg7vjgcpm7nctn', 'verified': false }, { 'name': 'ucad', 'symbol': 'CAT', 'decimals': 6, 'contract_addr': 'ucad', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/CAT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486', 'contract_addr': 'terra1cdhk0p72gn7fyhkgj229ynzt5j8n6xlkuteeha', 'verified': false }, { 'name': 'PancakeSwap Token (Wormhole)', 'symbol': 'wbCake', 'decimals': 8, 'total_supply': '0', 'contract_addr': 'terra1xvqlpjl2dxyel9qrp6qvtrg04xe3jh9cyxc6av', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J8LKx7pr9Zxh9nMhhT7X3EBmj5RzuhFrHKyJAe2F2i9S/logo.png', 'verified': true }, { 'name': 'Terra CATE', 'symbol': 'tCATE', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1f77l2dprlhg2h47uvhzp2zhkdrkcy8fse90xkk', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '64857084682', 'contract_addr': 'terra1rqkyau9hanxtn63mjrdfhpnkpddztv3qav0tq2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra10n748ua6aktwge5387w5gez45nvava0dzn2r9e', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10', 'contract_addr': 'terra1f0l9d3dedr3au4frre8uc7w7s2chs73a9xqwjp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10', 'contract_addr': 'terra16kw4vsl0wm3lt55cn4a47cz2y7d7ydsjwwfu08', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '344057551', 'contract_addr': 'terra1c6p2vl3xcc2ggufa0a9mkn2wjh9qy0v8y9zxha', 'verified': false }, { 'name': 'XXX Token', 'symbol': 'XXX', 'decimals': 6, 'total_supply': '142500000000000', 'contract_addr': 'terra1lj2t6zem4kk3cf400srvhaczpv2lg8kzpy5xr5', 'verified': false }, { 'name': 'USD Coin (Wormhole)', 'symbol': 'weUSDC', 'decimals': 6, 'total_supply': '901224400', 'contract_addr': 'terra1pepwcav40nvj3kh60qqgrk8k07ydmc00xyat06', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM/logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '49518639', 'contract_addr': 'terra13wgcwjzgcphqgcay6k06th604rdggjf2plcyjz', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '281143771607', 'contract_addr': 'terra1umup8qvslkayek0af8u7x2r3r5ndhk2fwhdxz5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '74900', 'contract_addr': 'terra1zaj3vee3qrperz3djkmjzhvsdnt80vy2a9szgw', 'verified': false }, { 'name': 'Test Token', 'symbol': 'TEST', 'decimals': 6, 'total_supply': '52000000000000', 'contract_addr': 'terra12yvwzt5ayh396hgmyd0rwnamgg4g3mxrdgg7c6', 'verified': false }, { 'name': 'Test', 'symbol': 'Test', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra17ggkh9upvkmeyew240lz95zcdytpd2j9m55he5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1844848160', 'contract_addr': 'terra1nannmaymqrxt00ya03ytfkhr027zrrgckuq7fg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '109087121146', 'contract_addr': 'terra1phcujfuv584t5mrmmxtag00pn36kscspec80gy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra1qffrtdpnj9afjw30njnw84f5rfmkxv8c86246h', 'verified': false }, { 'name': 'uusd', 'symbol': 'UST', 'decimals': 6, 'contract_addr': 'uusd', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/UST.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '336107766815', 'contract_addr': 'terra1stfeev27wdf7er2uja34gsmrv58yv397dlxmyn', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9893', 'contract_addr': 'terra1s54fm8ttuwavqsc7m9salge348upw5p53jnj8a', 'verified': false }, { 'name': 'Apple Inc.', 'symbol': 'mAAPL', 'decimals': 6, 'total_supply': '67406160347', 'contract_addr': 'terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz', 'icon': 'https://whitelist.mirror.finance/icon/AAPL.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '7568', 'contract_addr': 'terra1ea6srqjggq3j8spanguqfekcklwnqwren6km9t', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1cyaj8agnyzqtw2k5095ysxxgjpgqptyam283dj', 'verified': false }, { 'name': 'Moon Token', 'symbol': 'WEN', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1zdpymdwpyg5gj5ye4uvr0mqmxw8c88k5vqegfr', 'verified': false }, { 'name': 'LOVEKKU', 'symbol': 'KKU', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra182740uw8nh6tk3yjfcf7gu5phg3kqryhtuxp0p', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '948683298', 'contract_addr': 'terra143v5xc8zll66xq8zljxulacqylsdhlzwaraz02', 'verified': false }, { 'name': 'altered', 'symbol': 'ALTE', 'decimals': 6, 'total_supply': '384517859390', 'contract_addr': 'terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '77781745929', 'contract_addr': 'terra1nazd47xg74dg4a2eld2qxaynarv67d2l24z3y4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1131370849898', 'contract_addr': 'terra1l0wqwge0vtfmukx028pluxsr7ee2vk8gl5mlxr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '55368882', 'contract_addr': 'terra1ftd4p3rfcry6sgrwjs78s0562kmut3p6cpnq77', 'verified': false }, { 'name': 'Squid Green Token', 'symbol': 'GREEN', 'decimals': 6, 'total_supply': '2386493827263', 'contract_addr': 'terra1av86k92kuj9jem24pmrv3j6xkrltr2xluz4665', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '51598604', 'contract_addr': 'terra1p3urvqahfp6pup8xw6lp3zcruw8kv3xrkjwk4l', 'verified': false }, { 'name': 'xyz Bonus Token', 'symbol': 'xyzBONUS', 'decimals': 6, 'total_supply': '626000000', 'contract_addr': 'terra1jm9jv95f0w3e0kk3kxxvtqg50456mf2c92xd7f', 'verified': false }, { 'name': 'Global Transaction Payment Solu', 'symbol': 'whGTPS', 'decimals': 8, 'total_supply': '4006512026417000000', 'contract_addr': 'terra1y3d5qexmyac0fg53pfglh2pjk0664ymfvcq9mc', 'icon': 'https://img1.wsimg.com/blobby/go/f561f953-0bdd-48bf-a39b-982ecbd1698b/downloads/32x32coinlogo.png?ver=1640952410118', 'verified': true }, { 'name': 'Mars', 'symbol': 'MARS', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1a7zxk56c72elupp7p44hn4k94fsvavnhylhr6h', 'icon': 'https://marsprotocol.io/mars_logo_colored.svg', 'verified': true }, { 'name': 'Nexus Token', 'symbol': 'TNT', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra1ucme9gd7wr7lx0sysnydhdhaqtrg4403nrqm0l', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra14a2t4c4a8us6q24k2hkfm7kdenzxu0yxph35wd', 'verified': false }, { 'name': 'SHIT', 'symbol': 'SUCK', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra14pwhc79alqnxdhtzm0rrxt64uh4s568u8mluhu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '194755', 'contract_addr': 'terra1hmuhs99qw938edq07c4sguhnpmwaulxjmufm9u', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1hdthg6xxx5svjh079x0frrzwl5wyytw2l5qm65', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1kslvxkarlrneqddynteuwhd4uqy2w3a36h0ce5', 'verified': false }, { 'name': 'NVIDIA Corporation', 'symbol': 'mNVDA', 'decimals': 6, 'total_supply': '4933471082', 'contract_addr': 'terra1drsjzvzej4h4qlehcfwclxg4w5l3h5tuvd3jd8', 'verified': false }, { 'name': '6DEC', 'symbol': 'DEC', 'decimals': 6, 'total_supply': '1000000000000000000', 'contract_addr': 'terra1zey5xuv48yfjf9y0v6zkyfdtv2du5kau2kdrna', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1seymtr0r73sahrl2y8ul7afjp87ldrct8vtksh', 'verified': false }, { 'name': 'GLZA', 'symbol': 'GLZA', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1ktrxxylv7796wsd8rm7u0dftqhrjfs75r72wnn', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1yxlq4zezzvkha2e8wmck0nzx9e26xrjylk2dax', 'verified': false }, { 'name': 'Doge Bonk', 'symbol': 'DOBO', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra18cs7aktav46v3pwxr8r2hfkl9pdfmrthcn58qf', 'verified': false }, { 'name': 'BORED', 'symbol': 'APE', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1xktc8znx48tuypg3p47fcgfxrhc07hex0qgpex', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '86139377', 'contract_addr': 'terra1mm72fhs0t0sxnvvdu34srcqfk4c8zgcaf2xzd3', 'verified': false }, { 'name': 'CATSA', 'symbol': 'CATSA', 'decimals': 6, 'total_supply': '542000000000000', 'contract_addr': 'terra16pj0sful7hl87j8h5qwnv6j4vv76mxj6a6026v', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '158146643', 'contract_addr': 'terra1xhjavlxlfwqw2w5hj4395m7stl4ut5zus6mn4x', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '39432806', 'contract_addr': 'terra1d9myqs75njsaymp9yhrnzkkwhg0rsv9gpwcx60', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '32012888637', 'contract_addr': 'terra12dnl585uxzddjw9hw4ca694f054shgpg93cg90', 'verified': false }, { 'name': 'Terra SSS', 'symbol': 'tSSS', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1zf5jn0nsureuqaeqmj4pwkrtcm9m7rmlkdjxra', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1d8h5yckrkgzneng72c8yskgdfd2s9870fuxnfy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '141421356237', 'contract_addr': 'terra1kg0wdgxsqgy4trqmjmag5qd00hlygh2df8th8m', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '17769769147', 'contract_addr': 'terra1wy2cweqqxf0w23g3c9t8e8n5wukcf24fujfhpt', 'verified': false }, { 'name': 'Software', 'symbol': 'SWE', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1dy469h5zdej955zgn4dlewrqxw2nq2wdegq3y7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3743479891', 'contract_addr': 'terra1srcv0x7huzrxce3awyl4u5g9rpt4fqn5nwcw6m', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '942513882685', 'contract_addr': 'terra1k7pvdmk0z4hxhcncanp4pxl6ev3hqzeekzu437', 'verified': false }, { 'name': 'Terra Shiba', 'symbol': 'tSHIBA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra14lmsae6e4d5lu74yt67pkfsdaut4csjtq32a7x', 'verified': false }, { 'name': 'KAB Token', 'symbol': 'KAB', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1kujvztl5p8a45k56u42fq39jxldxcvuejtpfq5', 'verified': false }, { 'name': 'uhkd', 'symbol': 'HKT', 'decimals': 6, 'contract_addr': 'uhkd', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/HKT.png', 'verified': true }, { 'name': 'uinr', 'symbol': 'INT', 'decimals': 6, 'contract_addr': 'uinr', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/INT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2515', 'contract_addr': 'terra1gj5azdr9y80d3reegwumpz48ww09sqqym68vrz', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '447213595', 'contract_addr': 'terra1uu0xsadf4x7v5q9vpgp2dd9t9x2khwqlal5rl9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1susaylhx8sed45ljaww6wrdafqm7hccxhtwyyt', 'verified': false }, { 'name': 'TOKENTOKEN', 'symbol': 'TOKO', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra174muj5m4c83mvtr49dm4gvf5h2zp24nzphwvmc', 'verified': false }, { 'name': 'Johnson \u0026 Johnson', 'symbol': 'mJNJ', 'decimals': 6, 'total_supply': '7785294818', 'contract_addr': 'terra1ptdxmj3xmmljzx02nr4auwfuelmj0cnkh8egs2', 'verified': false }, { 'name': 'OMICRON', 'symbol': 'OMICRON', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1clqsjgv98sa2ewwlmyt3pv4uuzz68u45w9pkyw', 'verified': false }, { 'name': 'TestKwonT', 'symbol': 'TKWONT', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra18zg84fg56lthpjd8skj70l4zd3puyul5weqfer', 'verified': false }, { 'name': '300 Terrans', 'symbol': 'TERRANS', 'decimals': 6, 'total_supply': '276291483444056', 'contract_addr': 'terra1qt0j6rzqrc0rxpxxlyrvljmjkxrss2frsef5n0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '39009488524', 'contract_addr': 'terra1svt83amwsvghu9elhme382em26vupp0uprur9p', 'verified': false }, { 'name': 'WOLF', 'symbol': 'WOLF', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra10gpgrr85u4g42uu6c3hkkxkggg2nw5kt95yc7x', 'verified': false }, { 'name': 'ibc/FA0006F056DB6719B8C16C551FC392B62F5729978FC0B125AC9A432DBB2AA1A5', 'symbol': 'ATOM', 'decimals': 6, 'contract_addr': 'ibc/FA0006F056DB6719B8C16C551FC392B62F5729978FC0B125AC9A432DBB2AA1A5', 'icon': 'https://assets.terra.money/icon/60/ATOM.png', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1094578410213', 'contract_addr': 'terra1ndlx5ndkknvmgj6s5ggmdlhjjsz0w6wrnwn5cf', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486', 'contract_addr': 'terra1aarnpmtzs2nrkpr7tylsh8zevewjgg8gjp3djr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2832794111575', 'contract_addr': 'terra17gjf2zehfvnyjtdgua9p9ygquk6gukxe7ucgwh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1w4kqk5dxef3f6mlc6rcx35csyc4qk5axd0g827', 'verified': false }, { 'name': 'TERRA BRIDGE', 'symbol': 'BRIDGE', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1we9tgz73r6q3nqxwre5375l0nxh0s7ry47s6j8', 'verified': false }, { 'name': 'C2X Token', 'symbol': 'C2X', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra1rl20t79ffsrqfa29rke48tj05gj9jxumm92vg8', 'icon': 'https://c2x.world/c2x-station/icon/C2X.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '14145022755', 'contract_addr': 'terra1gtkh07x4puthw7tufyn4lnwyp625djczf4rvvq', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra13ek9x87hp9t3gf5ltchzhl3xuhhakm26jyj4vz', 'verified': false }, { 'name': 'usek', 'symbol': 'SET', 'decimals': 6, 'contract_addr': 'usek', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/SET.png', 'verified': true }, { 'name': 'MicroPets', 'symbol': 'PETS', 'decimals': 6, 'total_supply': '20000000000', 'contract_addr': 'terra1mgyht7c5usg40gqt57zmcd93cdwt49eehysm9p', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2000000', 'contract_addr': 'terra14z7t45phqgnx67n6qdvs4ac4cwy0rvflugzyew', 'verified': false }, { 'name': 'Juta Club Token', 'symbol': 'JUTA', 'decimals': 2, 'total_supply': '100000000', 'contract_addr': 'terra1l6nqyv78m3kj8v4wa7r5fr3vhp0qzrauwkx5av', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '58132858951', 'contract_addr': 'terra1t4xype7nzjxrzttuwuyh9sglwaaeszr8l78u6e', 'verified': false }, { 'name': 'ZERG', 'symbol': 'ZUG', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1gazefv0j5m0hhalp0qea5smypej2r0matncl88', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3872983346', 'contract_addr': 'terra174gmmzaxtrxq6z0tamu2lcekjkjy4vwhvxn93y', 'verified': false }, { 'name': 'CUTE HAPPY', 'symbol': 'CAT', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1jju99w456sm6w2snkmatm00gve7cvvzda0j6pn', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1peprsfuh0kt3xz8zgjmy9rfgx40jpf36cp24sa', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2000000', 'contract_addr': 'terra1hq2t2lgg6frwpr9sycwc5cyqqdlv7pam5qehe7', 'verified': false }, { 'name': 'uphp', 'symbol': 'PHT', 'decimals': 6, 'contract_addr': 'uphp', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/PHT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1', 'contract_addr': 'terra1eqxhcr0phgthnjyn2dseewfg28pqp97lv7ryym', 'verified': false }, { 'name': 'ONLY TERRANS', 'symbol': 'ONLY', 'decimals': 6, 'total_supply': '84217051787835', 'contract_addr': 'terra1zawrkv57eh7rne45zjta7s876jqc59slrev9xy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '18973665961', 'contract_addr': 'terra13wlheafzjwwgctnxh9t9jr0pnqejuu63ykr36w', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '271944470', 'contract_addr': 'terra1edum55hjxu0fts7wxq5j0umjzm359fenausrup', 'verified': false }, { 'name': 'dsh', 'symbol': 'DSHA', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1esezx70a44cqc4pjq0qt3k7k93ksuvepfksscy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra14fy4yzl893m0wqh89mv6c00lnutmgrml08ndrm', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2253456430', 'contract_addr': 'terra1wlh8acne68zmuyp4n2rmsnpc9atay9s5xn3s0a', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '18973665961', 'contract_addr': 'terra1s72ztquh9j0rj5w84kxlflkwz0kwyaflgxtstd', 'verified': false }, { 'name': 'Bitcoin', 'symbol': 'BTC', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1vpehfldr2u2m2gw38zaryp4tfw7fe2kw2lryjf', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra107tg7rwfd3mjxzzev305r6qg52z0xl7yxq7s2z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4472135', 'contract_addr': 'terra1vm8kxc6wzvkmqyh0rl6rdzmextnwejnlmz7u8j', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '51441908', 'contract_addr': 'terra1668hdgce50nwxs8myp33f4ywvs6lanzxvvu9sx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '281092302467', 'contract_addr': 'terra10t6a287n4flvjpvdwuhre79ws9plufaagdj4r4', 'verified': false }, { 'name': 'TerraKub', 'symbol': 'TKUB', 'decimals': 6, 'total_supply': '866080042795586', 'contract_addr': 'terra1sn208s2cmya87707w4r9hf36znv8ml8dcnhr2d', 'verified': false }, { 'name': 'Stest', 'symbol': 'Stest', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra146fhkmq8d7ae3e6jemufy4h5eq9zerftm8wzmt', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '400000', 'contract_addr': 'terra18cul84v9tt4nmxmmyxm2z74vpgjmrj6py73pus', 'verified': false }, { 'name': 'TestFlok', 'symbol': 'TestFlo', 'decimals': 6, 'total_supply': '92947959999997', 'contract_addr': 'terra1sussd2d7r3y5k6up6n6sxap3ee75gegxah96up', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '93377425583', 'contract_addr': 'terra1ygazp9w7tx64rkx5wmevszu38y5cpg6h3fk86e', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '47820093548', 'contract_addr': 'terra13sjghs2r7seamgr4g9c4p2eeacknggetsrhcar', 'verified': false }, { 'name': 'UUZ Token', 'symbol': 'UUZ', 'decimals': 6, 'total_supply': '142500000000000', 'contract_addr': 'terra1l2stn9sszzg6qwfqd6ckfa5n58hs4x5wwjaehh', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra1r98ydsd3jdjpnq8hhcdd5rnptf2l0r7zvaxu48', 'verified': false }, { 'name': 'Polkadot', 'symbol': 'mDOT', 'decimals': 6, 'total_supply': '81097145794', 'contract_addr': 'terra19ya4jpvjvvtggepvmmj6ftmwly3p7way0tt08r', 'icon': 'https://whitelist.mirror.finance/icon/DOT.png', 'verified': true }, { 'name': 'GOD', 'symbol': 'JESUS', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1hw6q5ecr0gp09v668szzx3qz86w08jru9rqyq7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '141421', 'contract_addr': 'terra1uf5xpl99zm7c8jxtq4c3y32ygjufjk6x6ggrav', 'verified': false }, { 'name': 'ARK Innovation ETF', 'symbol': 'mARKK', 'decimals': 6, 'total_supply': '17531468614', 'contract_addr': 'terra1qqfx5jph0rsmkur2zgzyqnfucra45rtjae5vh6', 'icon': 'https://whitelist.mirror.finance/icon/ARKK.png', 'verified': true }, { 'name': 'ALL TIME High', 'symbol': 'ATH', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1ukk89gn25p7xseqc4s4d45yarjlwychrwx7umv', 'verified': false }, { 'name': 'ukrw', 'symbol': 'KRT', 'decimals': 6, 'contract_addr': 'ukrw', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/KRT.png', 'verified': true }, { 'name': 'GameStop Corp', 'symbol': 'mGME', 'decimals': 6, 'total_supply': '315669964', 'contract_addr': 'terra1m6j6j9gw728n82k78s0j9kq8l5p6ne0xcc820p', 'icon': 'https://whitelist.mirror.finance/icon/GME.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '16283960959242', 'contract_addr': 'terra17pqpurglgfqnvkhypask28c3llnf69cstaquke', 'verified': false }, { 'name': 'dsh', 'symbol': 'DSH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1g2dz304juraseqdqq6ufnktqgeqen67sct3p7d', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '255659831972', 'contract_addr': 'terra16j09nh806vaql0wujw8ktmvdj7ph8h09ltjs2r', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1yq8pm98kadrxj835eeknhuhzrhzgxv7hy9nelz', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '325269118', 'contract_addr': 'terra1wn8t6kcaqhxrhtexkctyfaftrtvczkkh4u4p5w', 'verified': false }, { 'name': 'TWD Token', 'symbol': 'TWD', 'decimals': 6, 'total_supply': '2499999998000000', 'contract_addr': 'terra19djkaepjjswucys4npd5ltaxgsntl7jf0xz7w6', 'icon': 'https://terraoffice.world/twd_logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000', 'contract_addr': 'terra1qn4mpmcjwky96v0cqk0ru8azrk36ghasn8raue', 'verified': false }, { 'name': 'MDR-Token', 'symbol': 'MDR', 'decimals': 3, 'total_supply': '10000', 'contract_addr': 'terra13km0x6rn7fj23ruqdqdqut7p7p7570xyjz35qe', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '46925984', 'contract_addr': 'terra10fh6hy5f9t8mn09qzrps889qtew2km3zs44q9x', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5623075938', 'contract_addr': 'terra12ma0hyjetxx2w2vz0vagd4huyuf54v4uf69uc0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra1rdjzzqdcqasnu4kgk796e3rr9nvrhx5y9xdg7e', 'verified': false }, { 'name': 'Go to SUN', 'symbol': 'SUM', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1jzvh42e8auxk63dg5vdp4lh0fct8vw8pn2s34d', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277', 'contract_addr': 'terra1srmemhy8etjaam7ksnl2062x9emwg7ykrfvnz2', 'verified': false }, { 'name': 'SuperSaiyan', 'symbol': 'SUPER', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1k8fakrhcg5h87zux06hlds3eswej8389l8fdlc', 'verified': false }, { 'name': 'PRO TOKEN', 'symbol': 'PRO', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1tzkc6jejskv5qnqfa866qrlltx4240n3hwpeay', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2577', 'contract_addr': 'terra143h0kw3eyt8xjfl8pg77xpjd4alpkns4su3gls', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '125857109', 'contract_addr': 'terra184dw47xvmz29g7aem7evwe55pqhy96xq8fy8rv', 'verified': false }, { 'name': 'Terra META', 'symbol': 'TMeta', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1u72jtyujxu8dmpxedrrtmt5tekn0usf09r2a9h', 'verified': false }, { 'name': 'SPDR S\u0026P 500', 'symbol': 'mSPY', 'decimals': 6, 'total_supply': '7132206028', 'contract_addr': 'terra1aa00lpfexyycedfg5k2p60l9djcmw0ue5l8fhc', 'icon': 'https://whitelist.mirror.finance/icon/SPY.png', 'verified': true }, { 'name': 'TFLOKI New World Ticket', 'symbol': 'TFTICII', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1xt9fgu7965kgvunnjts9zkprd8986kcc444q86', 'icon': 'https://terrafloki.io/ticket2_logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '24494897427', 'contract_addr': 'terra1ug8jeyh65zxffe5wwj3j88fntdjdaj8xft6g95', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1868110451827332909', 'contract_addr': 'terra1wlssklspcq2arkl0vqgha5rg2sz8jfufvmjj82', 'verified': false }, { 'name': 'dosh', 'symbol': 'DOSH', 'decimals': 6, 'total_supply': '18000000000', 'contract_addr': 'terra1y77avpcwxc49ezmex8nsupklgc0qt7le44z4qd', 'verified': false }, { 'name': 'mocart', 'symbol': 'mcrt', 'decimals': 3, 'total_supply': '100000000000', 'contract_addr': 'terra19cxwwhtkpp4qvf4tvjmhh8lnh8lle7uw7ndqjw', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '42564866', 'contract_addr': 'terra1g5pe82m6hv90h2ed8esz5ldw8jpcw6y209k788', 'verified': false }, { 'name': 'Test Token', 'symbol': 'BDC', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra1f0us6p9axmzacwq2fn7sm5ke8k302tx7hg7s49', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '463329058879', 'contract_addr': 'terra1hvz34zmk4h6k896t94vd8d5qjdchhnkdndunzx', 'verified': false }, { 'name': 'DWONS BIG DONG', 'symbol': 'DBD', 'decimals': 6, 'total_supply': '91491748257878', 'contract_addr': 'terra1pzjd5axw303jt40l4pmakfa88d0jpjf8rpmj8n', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '203570177', 'contract_addr': 'terra1js00fmassgas3hvnurd5va8u72el0ehvjxjw2f', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100059311', 'contract_addr': 'terra19rc9ttpt80k7mgmy8e0t9e3r6q4m5mwvwyjwul', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '109087121146', 'contract_addr': 'terra19kadah8p79e4m766e3q869jv5f67s60qfxznmp', 'verified': false }, { 'name': 'Undead Shiba', 'symbol': 'USHIBA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1v7vp6ywlymprx9mk7ngm4uf0xgrz2ektg5wd6z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '15677515899', 'contract_addr': 'terra1mrs4cvfg8s8anlyvyf9ttfv4uf49p4q0qc44ws', 'verified': false }, { 'name': 'LUART Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1jwjweh50vrd2gg55y8cr50e32jwwc0vuhvdymh', 'verified': false }, { 'name': 'uthb', 'symbol': 'THT', 'decimals': 6, 'contract_addr': 'uthb', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/THT.png', 'verified': true }, { 'name': 'LUART Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1z454qecteghkd8m3shgd48cdc7j7vtnsgxh4z7', 'verified': false }, { 'name': 'FOC Token', 'symbol': 'FOC', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra157n30a667ethsknneaavga2txtze58eajyfv45', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '200000000', 'contract_addr': 'terra1crkatrwuxvp3348vjl42r3v8n59lqjpullpm77', 'verified': false }, { 'name': '10BIL', 'symbol': 'TENBIL', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1xjxegty6mmdr5jwqwde9rqhz758sy8c73vxzea', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '769898059709', 'contract_addr': 'terra178cf7xf4r9d3z03tj3pftewmhx0x2p77s0k6yh', 'verified': false }, { 'name': 'Pylon MINE Token', 'symbol': 'MINE', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy', 'icon': 'https://assets.pylon.rocks/logo/MINE.png', 'verified': true }, { 'name': 'Terra Doge', 'symbol': 'tDOGE', 'decimals': 3, 'total_supply': '1000000000000000', 'contract_addr': 'terra10pvdslu4j8x6rqm2uuvh7dwd3rtaw9qq37g7v7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '42217', 'contract_addr': 'terra146dmpuj9zyzk6a47qdfn0djup3kddey5vdpk0c', 'verified': false }, { 'name': 'TerraLand Token', 'symbol': 'TLAND', 'decimals': 6, 'total_supply': '99975337759987', 'contract_addr': 'terra1r5506ckw5tfr3z52jwlek8vg9sn3yflrqrzfsc', 'icon': 'https://terralandio-site.s3.eu-central-1.amazonaws.com/TerraLand-logo-v1c-4x.png', 'verified': true }, { 'symbol': 'LOTA', 'decimals': 6, 'total_supply': '6240932314705', 'contract_addr': 'terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr', 'icon': 'https://loterra.io/LOTA.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1218635', 'contract_addr': 'terra1adrqsdqtnhsvadl9gzuqcrh63vyye2zdzsj64g', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1007876', 'contract_addr': 'terra172unvcgg9tys53l8m5hxedw7uey4cya39e5agc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '7362064', 'contract_addr': 'terra1k0zuu3ljmwqmvaufz0d22d37evsrzju3cz4xru', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277660', 'contract_addr': 'terra1xj8v6a4wajsjdc4r74a0285zuvst2rmkau5txl', 'verified': false }, { 'name': '🐶DogeKwon v2 Terra ', 'symbol': 'DKWON', 'decimals': 6, 'total_supply': '8500000000000000', 'contract_addr': 'terra19953ttzk3mxghgwpdt85gua3gzzcj9a6wjwek6', 'verified': false }, { 'name': 'Square, Inc.', 'symbol': 'mSQ', 'decimals': 6, 'total_supply': '10150505766', 'contract_addr': 'terra1u43zu5amjlsgty5j64445fr9yglhm53m576ugh', 'icon': 'https://whitelist.mirror.finance/icon/SQ.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '829223780', 'contract_addr': 'terra1pc6fvx7vzk220uj840kmkrnyjhjwxcrneuffnk', 'verified': false }, { 'name': 'Nexus Token', 'symbol': 'TNT', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra1xzn8e3h9k4qk7082z330sn8ptz99lnghyua9xy', 'verified': false }, { 'name': 'META', 'symbol': 'MVRS', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1t0csdwp5u9592522n35ededwt2e46sur5u4mkg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra15ua5xjmgyurtrltn9gp6r7cap79xdfjksxecms', 'verified': false }, { 'name': 'Terra Man', 'symbol': 'MEN', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra122anargqcp9anz2cmuwc3u5m4nww6fpvyc39tz', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra13u54znnd3m8xx6cmujxk6z8mgmr8mzmcjvkc0a', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '30', 'contract_addr': 'terra1hwdhxcm974vmlva2u9cd272ck5aegna8uh9t7n', 'verified': false }, { 'name': 'Glow Token', 'symbol': 'GLOW', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra13zx49nk8wjavedjzu8xkk95r3t0ta43c9ptul7', 'icon': 'https://glowyield.com/assets/img/icons/glow.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '841950185261', 'contract_addr': 'terra1ekd58y58vq4gmxlzpc27dwuhw7wmms928ftuep', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486', 'contract_addr': 'terra1e4uxrgeezzcw33cfek64u7kq55jyn5dsartakt', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '58345182315', 'contract_addr': 'terra1jh2dh4g65hptsrwjv53nhsnkwlw8jdrxaxrca0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000', 'contract_addr': 'terra1rhy9tsda27exlwlwkx62u4t2e6c0uq7469p0el', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1jlme2556ygty3va4sw2k2p8j7lz5felpclvq0q', 'verified': false }, { 'name': 'PRO TOKEN', 'symbol': 'OWL', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1pwu44z0gwlfqecwxuxh6kwn46d8930x226drxw', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '34641016151', 'contract_addr': 'terra1ldy8tjaqa9zjq6h2290ac2k40ta94e4hky8caa', 'verified': false }, { 'name': 'Whale Token', 'symbol': 'WHALE', 'decimals': 6, 'total_supply': '951724000000000', 'contract_addr': 'terra1php5m8a6qd68z02t3zpw4jv2pj4vgw4wz0t8mz', 'icon': 'https://www.whitewhale.money/tokenlogo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '35199279331', 'contract_addr': 'terra1npak6kyfz07etkg7hk027yge7h83pp2h5u0t26', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000001', 'contract_addr': 'terra1ll78pl5a256d7lgqk49mc0r4cj9fnn544pwr0e', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra19zju3mkymrhfefd9lv7mq0u9ke0xmveemuu33g', 'verified': false }, { 'name': 'HOHO', 'symbol': 'HOHO', 'decimals': 3, 'total_supply': '1000000000500', 'contract_addr': 'terra1wfau60yqgdtrqay0cdtcp5rre3l50khacyyhhz', 'verified': false }, { 'name': 'Nexus bETH token share representation', 'symbol': 'nETH', 'decimals': 6, 'total_supply': '6430159375', 'contract_addr': 'terra178v546c407pdnx5rer3hu8s2c0fc924k74ymnn', 'verified': false }, { 'name': 'jennycoin3', 'symbol': 'jennnycoin', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1ewvul5j47zpsr6dtyt0fup6q3tquqq3cvxpjhp', 'verified': false }, { 'name': 'dsh', 'symbol': 'DSH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra128vws7v3ruqpysj0wwy95nl8a7an7nnyctmvle', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '6708203932', 'contract_addr': 'terra168j6qa84dmcuamp4pv7xuudgp96884ktp3cxuy', 'verified': false }, { 'name': 'PlayNity Token', 'symbol': 'PLY', 'decimals': 6, 'total_supply': '150000000000000', 'contract_addr': 'terra13awdgcx40tz5uygkgm79dytez3x87rpg4uhnvu', 'icon': 'https://playnity.io/uploads/logo/logo100.png', 'verified': true }, { 'name': 'Tether USD (Wormhole)', 'symbol': 'weUSDT', 'decimals': 6, 'total_supply': '1353000000', 'contract_addr': 'terra1ce06wkrdm4vl6t0hvc0g86rsy27pu8yadg3dva', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Dn4noZ5jgGfkntzcQSUZ8czkreiZ1ForXYoV2H8Dm7S1/logo.png', 'verified': true }, { 'name': 'dsh', 'symbol': 'GSH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1czqey2sj9h2w625ez5kefp6j7d5s08e7lj2yhd', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1lcs47eqhugywzrf83xhk65skmfqmxgvkqfq64g', 'verified': false }, { 'name': 'test token', 'symbol': 'TTT', 'decimals': 6, 'total_supply': '3500000000000000', 'contract_addr': 'terra1ch852sflpmw500y9jzvkpspzw8ej2jf5934g2n', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra108gn88qjjm0zmd0sjg39dwnksq6j2ehmp6pf27', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4897427', 'contract_addr': 'terra1njsea05lp96jt50f7nc0euc8sjmak6drz8ajdf', 'verified': false }, { 'name': 'Terra Name Service', 'symbol': 'TNS', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra14vz4v8adanzph278xyeggll4tfww7teh0xtw2y', 'icon': 'https://tns.money/static/images/tns.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '101891810', 'contract_addr': 'terra1mlkgz49lqndlgjfe3m5m4et7kz258fx89re28p', 'verified': false }, { 'name': 'Do Kwon', 'symbol': 'KWON', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1akwn8y34upderjyw07hgepunte8mza00vafzfd', 'verified': false }, { 'name': 'dsh', 'symbol': 'DSH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra12j5fqlxaurnvxr27dfsg2lku57rnmgqs6nm6ja', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9680608986', 'contract_addr': 'terra1epjldscwcyn3nerwmnf0qnfk8rue7pc73v6u20', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '91832816532', 'contract_addr': 'terra1m09t5cs473tvl7lsregj024d3dwg65su6ufpfh', 'verified': false }, { 'name': 'Wrapped SOL (Wormhole)', 'symbol': 'wsSOL', 'decimals': 8, 'total_supply': '636470176150', 'contract_addr': 'terra190tqwgqx7s8qrknz6kckct7v607cu068gfujpk', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', 'verified': true }, { 'name': 'Nexus Token', 'symbol': 'TNT', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra1ax3mp4cs78xkryavm733s2m4exsv72kd9c4c5g', 'verified': false }, { 'name': 'Hey Jude', 'symbol': 'HEY', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra10en35kwlud79z2nljssvhp85ep5kx9k0ezzz8s', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '290860', 'contract_addr': 'terra1v0qd7s259lr83t7qp8aknmn6jeq679u4xnnhpz', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra15as2k330rp40z3yp8ufs2uqnmdurlzgl643fsp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '15287581257', 'contract_addr': 'terra1arxzxdelkjpz6fgh37vszpw23qpsncy4rfatsx', 'verified': false }, { 'name': 'BLUE TREE', 'symbol': 'TREE', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1r7qpupdxkkh58vw9u8y9n9wjp6d9lr08u39j0z', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1892289093944', 'contract_addr': 'terra1znt9ness8ayxvpmldqser8ess07engetmrxwfd', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277660', 'contract_addr': 'terra10dlmpyedw742sjg99kkh3sfyy4e0tqkjfd3qyh', 'verified': false }, { 'name': 'RoboHero', 'symbol': 'ROBO', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra1gpwkclxwwuzd5wyjw2qn3km0r5ge4t4f4mnf0x', 'verified': false }, { 'name': 'TOKENTOKEN', 'symbol': 'TOKO', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra14eqahu3wavvesuyplmstsrnfu7uglxxy3m96dl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '78929903580', 'contract_addr': 'terra1jqqegd35rg2gjde54adpj3t6ecu0khfeaarzy9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4682464', 'contract_addr': 'terra1yrthzcrf6p0l568rk2uumzfg0355zedywmaf8z', 'verified': false }, { 'name': '\u003cBig Green Dildo\u003e', 'symbol': 'BGD', 'decimals': 6, 'total_supply': '90530936146192', 'contract_addr': 'terra1dwyd6vds479kv54f7kucevny97lge20c3s9w2k', 'verified': false }, { 'name': 'Lido staked Luna', 'symbol': 'stLuna', 'decimals': 6, 'total_supply': '565276090393', 'contract_addr': 'terra1yg3j2s986nyp5z7r2lvt0hx3r0lnd7kwvwwtsc', 'icon': 'https://static.lido.fi/stLUNA/stLUNA.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '18178863554', 'contract_addr': 'terra1gjasf5qq2jlmzle066tylul3d0s7vd6g667p7e', 'verified': false }, { 'name': 'Vault UST', 'symbol': 'vUST', 'decimals': 6, 'total_supply': '500000000000', 'contract_addr': 'terra1w0p5zre38ecdy3ez8efd5h9fvgum5s206xknrg', 'icon': 'https://www.whitewhale.money/vustlogo.png', 'verified': true }, { 'name': 'Nexus Token', 'symbol': 'TNT', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra1cwretz2zmeqe2uhq4fuk2mrp4ptuvsct890c6f', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '7071067811', 'contract_addr': 'terra19lttrz4lxk8pxaz8w650t3rupzz2avzud9lm3s', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '539412', 'contract_addr': 'terra1jnn5xpmeythug88hu66pwl3x9fz2s0ms034aw6', 'verified': false }, { 'name': 'Galaxy Digital Holdings Ltd', 'symbol': 'mGLXY', 'decimals': 6, 'total_supply': '95738771938', 'contract_addr': 'terra1l5lrxtwd98ylfy09fn866au6dp76gu8ywnudls', 'icon': 'https://whitelist.mirror.finance/icon/GLXY.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1ydqalj4l3ztvn3pr0rmz42d6wam95nae2e2xz5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '669403638', 'contract_addr': 'terra1qxlp0q3z20llu0gz9c7urzw7rmlnchm23yk8xc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '170000000000', 'contract_addr': 'terra1wq2tmhvx2yn3zqdah26sg3xzlaaxwd3fhsnj2y', 'verified': false }, { 'name': 'SHEISMINE', 'symbol': 'HER', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1gxztmp6dlu8xv8kdlty6259gl845mw53gakw9t', 'verified': false }, { 'name': 'Santas Big Sack', 'symbol': 'SBS', 'decimals': 6, 'total_supply': '94953555012473', 'contract_addr': 'terra1lchkxy5ednukxepwxejak8xevqlmz89ukjh6hl', 'verified': false }, { 'name': 'Ether', 'symbol': 'mETH', 'decimals': 6, 'total_supply': '1871823551', 'contract_addr': 'terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx', 'icon': 'https://whitelist.mirror.finance/icon/ETH.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra17a995wgrz7ch4qvk3s748tzs9u89a274yk8qh0', 'verified': false }, { 'name': 'CUTE', 'symbol': 'CUTE', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra172xf4zehmdla56h2x8ergqmejg70f4zczzt74w', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4473843828', 'contract_addr': 'terra1vheyufspfcfh3ka9nafmxec0lwzls80cuf3sd7', 'verified': false }, { 'name': 'Advanced Micro Devices, Inc.', 'symbol': 'mAMD', 'decimals': 6, 'total_supply': '9268211678', 'contract_addr': 'terra18ej5nsuu867fkx4tuy2aglpvqjrkcrjjslap3z', 'icon': 'https://whitelist.mirror.finance/icon/AMD.png', 'verified': true }, { 'name': 'Luart.io token', 'symbol': 'LUA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1rwph273axfefh8gh57scw3jfm7kn4s7t5hlu03', 'verified': false }, { 'name': 'Netflix, Inc.', 'symbol': 'mNFLX', 'decimals': 6, 'total_supply': '20670799711', 'contract_addr': 'terra1jsxngqasf2zynj5kyh0tgq9mj3zksa5gk35j4k', 'icon': 'https://whitelist.mirror.finance/icon/NFLX.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '386121785', 'contract_addr': 'terra1cx9shhtqmxcacs8jhcdgxce8hqum2u6u68d0sv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2481398530', 'contract_addr': 'terra1qmr8j3m9x53dhws0yxhymzsvnkjq886yk8k93m', 'verified': false }, { 'name': 'GRAY Token', 'symbol': 'GRYT', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1gmpn6gy7tdm39tc97te2f5prjdpgml760pke8k', 'verified': false }, { 'name': 'Donghwan and Kate', 'symbol': 'DAK', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1c2mghp27ysrmmw0na4cvvsmn5s4n27hq4hhfqd', 'verified': false }, { 'name': 'SAP 500', 'symbol': 'SAP', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1q2k77qmnujgk0w89wx55rsnqxecz5wd86y2p2q', 'verified': false }, { 'name': 'FINISH', 'symbol': 'FINA', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1mqug8fps3zqsywzrukz5m6shcnj4j4rqna3kzf', 'verified': false }, { 'name': 'Goldman Sachs Group Inc.', 'symbol': 'mGS', 'decimals': 6, 'total_supply': '3619326366', 'contract_addr': 'terra137drsu8gce5thf6jr5mxlfghw36rpljt3zj73v', 'icon': 'https://whitelist.mirror.finance/icon/GS.png', 'verified': true }, { 'name': 'StarTerra Token', 'symbol': 'STT', 'decimals': 6, 'total_supply': '91281049867175', 'contract_addr': 'terra13xujxcrc9dqft4p9a8ls0w3j0xnzm6y2uvve8n', 'icon': 'https://starterra.io/assets/100x100_starterra.png', 'verified': true }, { 'name': 'We are Hive', 'symbol': 'HIVE', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1c6jwuklh3262naafvnlw8llvns9856uvc50z95', 'verified': false }, { 'name': 'Meta Kwon', 'symbol': 'mKWON', 'decimals': 6, 'total_supply': '7500000000000', 'contract_addr': 'terra1w45ywafn2srq3q6svsam067uh8l2smlu7ljzv4', 'verified': false }, { 'name': 'dsh', 'symbol': 'DSH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1hd4hgml43g4k50nlyhuntsaw8p7rvnrht0f9e0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '71414284285', 'contract_addr': 'terra12wmaguvdvjf225ua9xjwpj5k5euy6nhtu334n3', 'verified': false }, { 'name': 'TFLOKI Genesis Ticket', 'symbol': 'TFTIC', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1a8k3jyv3wf6k3zngza5h6srrxcckdf7zv90p6u', 'icon': 'https://terrafloki.io/ticket_logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '14356325202', 'contract_addr': 'terra1y3k4vj8qhgultc388wwmx6m4mdlt2098fyj2h8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3999', 'contract_addr': 'terra1z6x7xnsgye3gzs2mlj5v2gmyw8c35amrgu5327', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '12441546550', 'contract_addr': 'terra13cvk06h0e64y3x8c3ds3lts8pwfq955ypw08v5', 'verified': false }, { 'name': 'Elon Tweets on Terra', 'symbol': 'tELONTWEETS', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1cvdaetw5ljrtkxax8z0pgpdyhhhln3saxl8xsg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra12sjz9t2pnjxvytczwl6ynk2ptw6g3c9q0xy6zf', 'verified': false }, { 'name': 'MCP', 'symbol': 'MCP', 'decimals': 6, 'total_supply': '100100', 'contract_addr': 'terra1x5t6zkvhc6dg2jjug34tfreme3hcufpuy77da2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '66199938958', 'contract_addr': 'terra1jmauv302lfvpdfau5nhzy06q0j2f9te4hy2d07', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '44454863154', 'contract_addr': 'terra1x6dwnqnr890whm0wtzz9td052s7008g2tg8ffp', 'verified': false }, { 'name': 'Bitlocus Token', 'symbol': 'BTL', 'decimals': 6, 'total_supply': '500000000000000', 'contract_addr': 'terra193c42lfwmlkasvcw22l9qqzc5q2dx208tkd7wl', 'icon': 'https://bitlocus.com/assets/btl-token.png', 'verified': true }, { 'name': 'unok', 'symbol': 'NOT', 'decimals': 6, 'contract_addr': 'unok', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/NOT.png', 'verified': true }, { 'name': 'LUNI', 'symbol': 'LUNI', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1m3tdguf59xq3pa2twk5fjte5g6szj5y9x5npy7', 'icon': 'https://d2s3n99uw51hng.cloudfront.net/static/100_100_LUNI_logo.png', 'verified': true }, { 'name': 'Dtest', 'symbol': 'Dtest', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1jvg4ls8jz098g77t04u4hw2gg2c64w8t5g8jdz', 'verified': false }, { 'name': 'Dogecoin (Wormhole)', 'symbol': 'DOGE', 'decimals': 8, 'total_supply': '3445208442', 'contract_addr': 'terra1gtjr689cyaau20k8ezdxy8eup34tntun5xr9l2', 'verified': false }, { 'name': 'Mirror BNB', 'symbol': 'mBNB', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1e47v67sld3p2pre5skqh05ddld22rwhu30fnwm', 'verified': false }, { 'name': 'umyr', 'symbol': 'MYT', 'decimals': 6, 'contract_addr': 'umyr', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/MYT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '126399846', 'contract_addr': 'terra15pclv9fqytszqlmjymshyk9cfytaaqrs4h87sf', 'verified': false }, { 'name': 'Dogelon Luna t.me/dogelonluna', 'symbol': 'ELON', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra107pw6g56gfch98r3xw9gr3glcxvmmm8326rdg7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3833428285', 'contract_addr': 'terra1spagsh9rgcpdgl5pj6lfyftmhtz9elugurfl92', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '7422', 'contract_addr': 'terra19uca4zxqr8e9t9l6lcz3rztzaygnawwlex8g8l', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '65525407623', 'contract_addr': 'terra1495vu7s83d8kyqk4lzawajqt5d27pjfd8ym398', 'verified': false }, { 'name': 'Terra Farm', 'symbol': 'TFarm', 'decimals': 6, 'total_supply': '752000000000000', 'contract_addr': 'terra1p3z96mc9gr66yruc3c0v73u0e574kjpgeledm3', 'verified': false }, { 'name': 'Orne Token', 'symbol': 'ORNE', 'decimals': 6, 'total_supply': '100000000003000', 'contract_addr': 'terra1hnezwjqlhzawcrfysczcxs6xqxu2jawn729kkf', 'icon': 'https://orne.io/img/token_icon.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5697077', 'contract_addr': 'terra1fcfl5xa6kwgtmymwgjr2rgq3j2h8q00vy39gs8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '200000', 'contract_addr': 'terra19ahlx8uhyslmt8u6a6tzsugepm8a3kfemjeucl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '508728045', 'contract_addr': 'terra17mau5a2q453vf4e33ffaa4cvtn0twle5vm0zuf', 'verified': false }, { 'name': 'KwonVault', 'symbol': 'KwonVault', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1ffute26m0e5uq3wmzys3452dge62m99u0xz30u', 'verified': false }, { 'name': 'Allbridge', 'symbol': 'ABR', 'decimals': 6, 'total_supply': '152739427977', 'contract_addr': 'terra1a7ye2splpfzyenu0yrdu8t83uzgusx2malkc7u', 'icon': 'https://raw.githubusercontent.com/allbridge-io/media/main/token.svg', 'verified': true }, { 'name': 'Cutegom', 'symbol': 'GOM', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra144w7e54fwkpz2aavq33p6d2upyc0u006udf32g', 'verified': false }, { 'name': 'Terra Infinity', 'symbol': 'INFINITY', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1353an33z0u5dd0yajwjazfnyt4585q5085c5mg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5856', 'contract_addr': 'terra1z9xh489wp8wksdqh43wsmmyvm9qepdltq87aqy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1d49ve0m99xz250uyj848yd9sgwuh5vw30kxm9h', 'verified': false }, { 'symbol': 'bETH', 'decimals': 6, 'total_supply': '206879857685', 'contract_addr': 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun', 'icon': 'https://whitelist.anchorprotocol.com/logo/bETH.png', 'verified': true }, { 'name': 'Lido Bonded ETH (Wormhole)', 'symbol': 'webETH', 'decimals': 8, 'total_supply': '20737081329042', 'contract_addr': 'terra1u5szg038ur9kzuular3cae8hq6q5rk5u27tuvz', 'icon': 'https://static.lido.fi/bETH_Wormhole/bETH_Wormhole.svg', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '85742841637', 'contract_addr': 'terra1mv3pgkzs4krcennqj442jscg6jv84cejrs50n2', 'verified': false }, { 'name': 'Doge Land', 'symbol': 'DOGEL', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra182vnsj0rv9dnrc7xnccz0wajp69hu73706h2p4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5181', 'contract_addr': 'terra1dletuefu2w56d4nptmtptrglnxm0vf4snm8l32', 'verified': false }, { 'name': 'Inha Seo Token', 'symbol': 'INHA', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1ghtspakevqnazc3jtceag7uc3tnjujs94edlkf', 'verified': false }, { 'name': '100BIL', 'symbol': 'HUNDBIL', 'decimals': 6, 'total_supply': '100000000000000000', 'contract_addr': 'terra12qeh8p79q6jrnlmw09hvtytv9e99yl2077cmgz', 'verified': false }, { 'name': 'ESS Token', 'symbol': 'ESS', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1h0jk42weh0urhgdtjql93rrvgdccspnp7vyf49', 'verified': false }, { 'name': 'Thorstarter', 'symbol': 'XRUNE', 'decimals': 6, 'total_supply': '6748030755230', 'contract_addr': 'terra1td743l5k5cmfy7tqq202g7vkmdvq35q48u2jfm', 'icon': 'https://thorstarter.org/static/img/src/favicon.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra14j965wgdyyrkryjem570jh7y7lzgyrs0jp6xud', 'verified': false }, { 'name': 'somethingcool.xom', 'symbol': 'scx', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1ddjp4wgu52cktzgzvahwkr4dcd95mxaqad2pmu', 'verified': false }, { 'name': 'UFO finance', 'symbol': 'UFO', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1yv2fdec6ej4g8pv9sru5ezcz75a2zrczllxn86', 'verified': false }, { 'name': 'Token test dont buy', 'symbol': 'LLL', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1h8hmr0em0avkz4kzuwgakyxrdvxqwg5d3cg4sd', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '76064754', 'contract_addr': 'terra1p3pky64g3jq6s466g8jskszt2k7e07ygt9z8z2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra1u6ua0t8url95p2dh7tp6kvqp04h48dxx5njclp', 'verified': false }, { 'name': 'Asan King Token', 'symbol': 'AKT', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra129796y06jrejsk9hjmvhkhat92mxt76k6qpyfw', 'verified': false }, { 'name': 'SEXY', 'symbol': 'SEX', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1v60qvtprpwt65w5tfamt4l4wpp3jk5mfeh64rt', 'verified': false }, { 'name': 'Airbnb Inc.', 'symbol': 'mABNB', 'decimals': 6, 'total_supply': '6711706120', 'contract_addr': 'terra1g4x2pzmkc9z3mseewxf758rllg08z3797xly0n', 'icon': 'https://whitelist.mirror.finance/icon/ABNB.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '28', 'contract_addr': 'terra14cukkjnldflzke4x5xq5fgf3txkfq99zw5l35q', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra15g2lqpqvv2zn3hz63q2m26vfle3vlgj6cqvny8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '282842712474', 'contract_addr': 'terra1wqa24s7qzqess0pwrx3q70lh0uj04vajx6uf58', 'verified': false }, { 'name': 'Luart.io token', 'symbol': 'LUA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1n6eltvex47mta0me66ygqw0fgvjx2ul7qm9fjp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4926648158', 'contract_addr': 'terra1tragr8vkyx52rzy9f8n42etl6la42zylhcfkwa', 'verified': false }, { 'name': 'Squid Red Token', 'symbol': 'RED', 'decimals': 6, 'total_supply': '2362253441682', 'contract_addr': 'terra1ye68rx8etwj7xylwc4nd4vp58zz236mlhk0cpx', 'verified': false }, { 'name': 'AMC Entertainment Holdings Inc.', 'symbol': 'mAMC', 'decimals': 6, 'total_supply': '1994110782', 'contract_addr': 'terra1qelfthdanju7wavc5tq0k5r0rhsyzyyrsn09qy', 'icon': 'https://whitelist.mirror.finance/icon/AMC.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '67933573515', 'contract_addr': 'terra1falkl6jy4087h4z567y2l59defm9acmwcs70ts', 'verified': false }, { 'name': 'Digipharm', 'symbol': 'DPH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra17jnhankdfl8vyzj6vejt7ag8uz0cjc9crkl2h7', 'icon': 'https://digipharm.io/wp-content/uploads/2021/02/digipharm_etherscan_logo.png', 'verified': true }, { 'name': 'usgd', 'symbol': 'SGT', 'decimals': 6, 'contract_addr': 'usgd', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/SGT.png', 'verified': true }, { 'symbol': 'bLuna', 'decimals': 6, 'total_supply': '63928401432850', 'contract_addr': 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp', 'icon': 'https://whitelist.anchorprotocol.com/logo/bLUNA.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9', 'contract_addr': 'terra1e3t3td7uas3ed0gyu9xcyvmh6gxn6xe96yat8w', 'verified': false }, { 'name': 'Space Dollar', 'symbol': 'SDOLLAR', 'decimals': 2, 'total_supply': '1524027855', 'contract_addr': 'terra1l0y8yg0s86x299nqw0p6fhh7ngex3r4phtjeuq', 'icon': 'https://sdollars.wpengine.com/wp-content/uploads/2021/10/spacedollars512x512.png', 'verified': true }, { 'name': 'Terra Bots', 'symbol': 'BOT', 'decimals': 6, 'total_supply': '11000000000', 'contract_addr': 'terra15kqr498g9r2j5mnddy27qgppcp8a759lcegsz0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '26370303', 'contract_addr': 'terra1h70xcjaq5a4p4r02qjwqgvvpe9k5l9aafnyelh', 'verified': false }, { 'name': 'Squid Green Test Token', 'symbol': 'GREENTEST', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1dssh7fk2gjjgf7yhcrd29repaz2gnxcs9yj9ay', 'verified': false }, { 'name': 'Coca-Cola', 'symbol': 'mKO', 'decimals': 6, 'total_supply': '125519245453', 'contract_addr': 'terra1qsnj5gvq8rgs7yws8x5u02gwd5wvtu4tks0hjm', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1hpkk7ar777hx8ne5vgkkg5tvntm8j9m32w6zam', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '20000000', 'contract_addr': 'terra1ku5mkpj7nr402ncduym4mgs8ggva67qcjw72hd', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277', 'contract_addr': 'terra1qs8frq6vn59u4hv6l7k0rvf8m5xd4n46n0vzwa', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277660', 'contract_addr': 'terra1dp54cd4mq449w0x6gnxlw6v0yg9dtpjpm4urv3', 'verified': false }, { 'name': 'MAGNETX', 'symbol': 'MAX', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1ehcjwxwf96c278n2ks84zes3ece5fqy78fa749', 'verified': false }, { 'name': 'DogCat', 'symbol': 'DOGCAT', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra14kat7dptmcydvhn0l5ur3g3evs65n33925n7w7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '201758093860', 'contract_addr': 'terra1pjgzke6h5v4nz978z3a92gqajwhn8yyh5kv4zv', 'verified': false }, { 'name': 'Amazon.com, Inc.', 'symbol': 'mAMZN', 'decimals': 6, 'total_supply': '3004624447', 'contract_addr': 'terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2', 'icon': 'https://whitelist.mirror.finance/icon/AMZN.png', 'verified': true }, { 'name': 'TerraMoonDoge', 'symbol': 'TMoonDoge', 'decimals': 6, 'total_supply': '50000000000000', 'contract_addr': 'terra1tgfw423t34rwaezm4u4vwy5d80tfgzuyx2s6x0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '172555338502', 'contract_addr': 'terra1je3y5wnfm5v884j3vdegcc8045kje39g6aflce', 'verified': false }, { 'name': 'FOX Token', 'symbol': 'FOX', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra17ckx25kqhwzf3fudprs78kqgp3lhpr2w74yf7t', 'verified': false }, { 'name': 'usdr', 'symbol': 'SDT', 'decimals': 6, 'contract_addr': 'usdr', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/SDT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra13hf5j4de47zx42ak2sleh4wkyvt0hsz2dfl2zl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '18973665961', 'contract_addr': 'terra1uz6m6h6seck9q870hnc8g2t8rxtzn5nwg7txts', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1045729', 'contract_addr': 'terra1cvnn7tz7fuxx8u8ym8gdfa7dp2jwv6e3le9ame', 'verified': false }, { 'name': 'Terra Reflection - Hold2Earn', 'symbol': 'H2E', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1nl9dx4pkat90gzw2j99n338n984e4cw7nxq65w', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1muk54uc0pqjwe6w26tpwun0x55ncttnadxrr6l', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2135623', 'contract_addr': 'terra1ukk0exsl5cejgnsn4jrdju83wrpdcwg0thfzpm', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2006827408', 'contract_addr': 'terra1lcrpz5rgtqu6dejec7nrglh6qqgt8326ecwral', 'verified': false }, { 'name': 'ueur', 'symbol': 'EUT', 'decimals': 6, 'contract_addr': 'ueur', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/EUT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1p5qffpcsqjk6t9v0dn3luzj2lhxnep09d8pgep', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '208876834724', 'contract_addr': 'terra14uaqudeylx6tegamqmygh85lfq8qg2jmg7uucc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1523932058499', 'contract_addr': 'terra1h69kvcmg8jnq7ph2r45k6md4afkl96ugg73amc', 'verified': false }, { 'name': 'Coin Swap', 'symbol': 'SWAP', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1fy4yf7n076wqmcfhsfh543xu35024lw2wlcxq7', 'verified': false }, { 'name': 'TFLOKI', 'symbol': 'TFLOKI', 'decimals': 6, 'total_supply': '90929487649623', 'contract_addr': 'terra1u2k0nkenw0p25ljsr4ksh7rxm65y466vkdewwj', 'icon': 'https://terrafloki.io/terrafloki_logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1350025334338', 'contract_addr': 'terra1kg9vmu4e43d3pz0dfsdg9vzwgnnuf6uf3z9jwj', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1v5e88rv3easl8630pf8g2ylzlg73nv5hx0km4k', 'verified': false }, { 'name': 'Robinhood Markets, Inc.', 'symbol': 'mHOOD', 'decimals': 6, 'total_supply': '82814913936', 'contract_addr': 'terra18yqdfzfhnguerz9du5mnvxsh5kxlknqhcxzjfr', 'verified': false }, { 'name': 'Test UwU', 'symbol': 'UwU', 'decimals': 3, 'total_supply': '1000000000000000', 'contract_addr': 'terra1zvncquef39sne2adlvl3xpzcsge0fypakp00zx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1', 'contract_addr': 'terra15n4mgtumehlzy3h4ldnz5m4vrp7n3z8yu9c005', 'verified': false }, { 'name': 'SAIL', 'symbol': 'whSAIL', 'decimals': 6, 'total_supply': '3000000', 'contract_addr': 'terra1ku5e0dhutxhuxudsmsn5647wwcz6ndr3rsh90k', 'icon': 'https://cloudflare-ipfs.com/ipfs/QmPcQfofQNfiv36EAsGQrgAhiPbqGf17i1Cz648JhXFW9m/logo_solana_sail_v2.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '40175', 'contract_addr': 'terra102l9yp0zpzrgse96mwgnfyc0rmunpyzrxg7999', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra19w95ffdpqeweglhzadwcaa0amu0g7m490kx5ch', 'verified': false }, { 'name': 'Terra Doge GF', 'symbol': 'DOGEGF', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1txlylfvu2s9p3tt2fa82xj6qy6pp86avs0t43w', 'verified': false }, { 'name': '2 Girls 1 Dkwon 🌗💵 ', 'symbol': 'GIDK', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1aft2zjfhmetslqvy0jg6d0ywhf9r5zf5zqratc', 'verified': false }, { 'name': 'Mirror', 'symbol': 'MIR', 'decimals': 6, 'total_supply': '370575000000000', 'contract_addr': 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6', 'icon': 'https://whitelist.mirror.finance/icon/MIR.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra1gk602sa0jwk73xlr8tpkd3fpukhfa8hjety68r', 'verified': false }, { 'name': 'Sarcophagus (Wormhole)', 'symbol': 'SARCO', 'decimals': 8, 'total_supply': '100000000', 'contract_addr': 'terra19th22mng47zxe9ndrtvd470fjkn7n7ymmn28mr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1hdnfxxn7j84t4jwjxsegd9qmcksfa8zjldc37l', 'verified': false }, { 'name': 'yout_token_name', 'symbol': 'SYMBOL', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra1ltfq7n4x383t8wjmp8ujjzrvyskk6eu4y2p3qh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '154310', 'contract_addr': 'terra1u9ytts0kz3lsfg2z9804u8pdyz79283n5jevum', 'verified': false }, { 'name': 'Wrapped Ether (Wormhole)', 'symbol': 'weWETH', 'decimals': 8, 'total_supply': '10282945378', 'contract_addr': 'terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '47268157', 'contract_addr': 'terra1w34xlv8euhjfffp3mu98qtc9umcwy79jw7pfxe', 'verified': false }, { 'name': 'Terra Pepe🌗💵 Join https://t.me/terrapepe', 'symbol': 'PEPE', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1twcwynuvhs778m8x46n7e6gyvu7srtkjcaufxd', 'verified': false }, { 'name': 'Nexus Token', 'symbol': 'TNT', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra15z4tj56cdpdk5jxf28nep3ep0myu0frhlh6f3u', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '20000000000', 'contract_addr': 'terra105wahgnrx7t2dsxfx9wer2mtcfrvfpr5hjxyt8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1q94p9qjlykvzd2m0uv22r6uaj2k7gde0grzjcu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1h0lllt9mecr69e4r7qs8jtnupz6vnk30l87egc', 'verified': false }, { 'name': 'GRAY', 'symbol': 'GRY', 'decimals': 3, 'total_supply': '20000', 'contract_addr': 'terra1xs3pv5rd2xu36w9vg05shkgxcrxkvz40fhnfsv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277660', 'contract_addr': 'terra125gygqsnr8sv58w7y8nh2ewdcexxrfkae53pak', 'verified': false }, { 'name': 'Terra GO', 'symbol': 'tGO', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1tqjzureahwdezhy64uw7x9vpywgxvxcngexecf', 'verified': false }, { 'name': 'Prism cLuna Token', 'symbol': 'cLuna', 'decimals': 6, 'total_supply': '620297118167', 'contract_addr': 'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau', 'icon': 'https://home.prismprotocol.app/cluna.png', 'verified': true }, { 'name': 'Moon Token', 'symbol': 'MOON', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1hmxxq0y8h79f3228vs0czc4uz5jdgjt0appp26', 'icon': 'https://moon.gl/logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '31938927', 'contract_addr': 'terra1gs3hkq6qylxukkklscswd98ar9lxqguzu8aed2', 'verified': false }, { 'name': 'Art Token', 'symbol': 'ART', 'decimals': 6, 'total_supply': '344522000000', 'contract_addr': 'terra1yjlqptvn3al5402jp600l7n3l5yl8man8d4kex', 'verified': false }, { 'name': 'MIAW Token', 'symbol': 'MIAW', 'decimals': 6, 'total_supply': '29967507000000', 'contract_addr': 'terra1vtr50tw0pgqpes34zqu60n554p9x4950wk8f63', 'icon': 'https://www.miaw-trader.com/logo.png', 'verified': true }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '5332146560', 'contract_addr': 'terra19u8cgzsmgg27mnevcc22293yl3j82f26l8nvtz', 'verified': false }, { 'name': 'Cake Terra', 'symbol': 'CAKE', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra16ea8pnh3hu69kzqqps5gqw0zdd94hgul9tfnzw', 'verified': false }, { 'name': 'Terra Squid', 'symbol': 'TSquid', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra15dcd0j3tqtefj96nhqryt59qyr820tyxq3l0dr', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra174tuptw39sd3s5yqq466xc5lygh9z8gp05wf4j', 'verified': false }, { 'name': 'Mini Kwon', 'symbol': 'mKWON', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1t4hgtl3uqukaas9lzswl9hr7d55mn3tq3tt3rd', 'verified': false }, { 'name': 'hello', 'symbol': 'HELLO', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra17yjdhu7pk865t0jeswtpecukg0uw8xelzvfmdq', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1001232597', 'contract_addr': 'terra1ka9qplck0h0kj2jxmnagt8vh64c5qczwkwp0hx', 'verified': false }, { 'name': 'Hands of Terra', 'symbol': 'HOT', 'decimals': 6, 'total_supply': '700000000000000', 'contract_addr': 'terra1y8w753jk2x2j6f7a9ea30xc2qk5esharn89sk2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5417730626', 'contract_addr': 'terra1pxst9epy9cz5rmdh3d7f4lvch9xz4xp30xa4sj', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000', 'contract_addr': 'terra147kcqfp5kw9m5axds4ulz0h9z4wcc9uga7yfsh', 'verified': false }, { 'name': 'Alibaba Group Holding Limited', 'symbol': 'mBABA', 'decimals': 6, 'total_supply': '80221049463', 'contract_addr': 'terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa', 'icon': 'https://whitelist.mirror.finance/icon/BABA.png', 'verified': true }, { 'name': 'dsh', 'symbol': 'DSHA', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra10thstrfuexp5nf9rnazzs433p7zeu9yxr322r9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '378959894884', 'contract_addr': 'terra1fc5a5gsxatjey9syq93c2n3xq90n06t60nkj6l', 'verified': false }, { 'name': 'Squid Red Test Token', 'symbol': 'REDTEST', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1tt9jmf58nvaj8l0lckwfekfl43verjdpywcdwa', 'verified': false }, { 'name': 'DeFiato Token', 'symbol': 'DFIAT', 'decimals': 6, 'total_supply': '200000000000000', 'contract_addr': 'terra1cq4lkf7dlygdp23yql8a4daunnxr4xd5tymszl', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1442691832', 'contract_addr': 'terra1jl4vkz3fllvj6fchnj2trrm9argtqxq6335ews', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '375980904', 'contract_addr': 'terra1ym24m9vg93hgq8hmvc8njquls9sq2x0wqjssvw', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1763689075459', 'contract_addr': 'terra1x3musrr03tl3dy9xhagm6r5nthwwxgx0hezc79', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3399', 'contract_addr': 'terra18jwvd3w34eudhvz97gtut5qtas57al7ez0kg4c', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1uc59nf6kzep09k4fruxh2kzfq5kztlqwrnezk5', 'verified': false }, { 'name': 'VikingDoge Terra', 'symbol': 'VKDoge', 'decimals': 6, 'total_supply': '400000000000000000', 'contract_addr': 'terra18n2k7nwwkgn20epntr4usy8nrs4l9ecu6wzqv6', 'verified': false }, { 'name': 'Squid VIP Red Token', 'symbol': 'VRED', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1hj9g4kecf9gncxsa2257w4glhwgrdp7vjsnncv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '53969100', 'contract_addr': 'terra1tpx744z60ysm4ntrpk84whqp9tunmrgzm6utcf', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 3, 'total_supply': '10000000000', 'contract_addr': 'terra183x8jduwtdgcqkwtqxdzjlq2mq0rlnj6hm22j7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '42825295113', 'contract_addr': 'terra1vwx88jskew3sdf2wpzj6e03mtw2t0c0rajg72u', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '238295', 'contract_addr': 'terra1dy3ylyzykr7ykl0kyruuf5edmvqm4lm5y73n9k', 'verified': false }, { 'name': 'METAVERSE', 'symbol': 'META', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra12hesat74nzz6av5hw2c5qxxqkhafxsgjhgnd6y', 'verified': false }, { 'name': 'jennycoin2', 'symbol': 'jennycoin', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1cxaky6tfw4j0xqx8ezxw60cukmkewpx70kr9du', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '491874072379', 'contract_addr': 'terra1uwhf02zuaw7grj6gjs7pxt5vuwm79y87ct5p70', 'verified': false }, { 'name': 'Terra Doge', 'symbol': 'tDOGE', 'decimals': 3, 'total_supply': '451000000000000', 'contract_addr': 'terra1f3gyvkfwy6lvst5c63gx7alp6547clceaamyyp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1', 'contract_addr': 'terra1dchs757cqkjarjyl3cwk37kcd9tkvhkuypfr2f', 'verified': false }, { 'name': 'INGI_t', 'symbol': 'INGT', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra153qrdszuq65avs9flpeve43e46ypvt4clj6p4p', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '447222799681', 'contract_addr': 'terra1utf3tm35qk6fkft7ltcnscwml737vfz7xghwn5', 'verified': false }, { 'name': 'SOC Token', 'symbol': 'SOC', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1xmd43yrfxm4xy3lnptc7kr4rr93pzh5u0z0wgt', 'verified': false }, { 'name': 'TerraKwonDo', 'symbol': 'TKwonDo', 'decimals': 6, 'total_supply': '5000000000000', 'contract_addr': 'terra14pv5z9j9auwf7p4dg3ds0gch8sr8gnnf0psk8c', 'verified': false }, { 'name': 'CAPITRADE TOKEN', 'symbol': 'CDE', 'decimals': 9, 'total_supply': '50000000000000000', 'contract_addr': 'terra13fs83g5atgjwuh7c5ydzh6n7gecel6xyhhy2t5', 'icon': 'https://raw.githubusercontent.com/Lotaxgizmo/images/57f862e3c2a68708775dae5f962885f2ed309b2d/ICON%20COLOURED%404x%201.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5000000', 'contract_addr': 'terra1768vz98dnfxlvwjnx25r520pfevk7djfc3ymhx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '399264035', 'contract_addr': 'terra1vcecxknz3rc8ktpc9pgrxg578fsxlkksnuwx72', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3198853090593', 'contract_addr': 'terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm', 'verified': false }, { 'name': 'Nexus bLuna token share representation', 'symbol': 'nLuna', 'decimals': 6, 'total_supply': '270409304537', 'contract_addr': 'terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j', 'verified': false }, { 'name': 'Terra Musk', 'symbol': 'TerraMusk', 'decimals': 6, 'total_supply': '1000000000000000000', 'contract_addr': 'terra1dwvauhhpsmhwjf2x32uqeukg3zdgm89zy6004g', 'verified': false }, { 'name': 'LUART Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1lesh2dshyf8a7wfm9fkxfrxjxc6yuyqnvspuvw', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1zg9vp5w4xtasrua7kx3rn4smm3e2nrda4u3432', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '8767355', 'contract_addr': 'terra1gm0vm4fpr9xe93tw3nc2vdp9ju3g9knwd75afn', 'verified': false }, { 'symbol': 'ANC', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76', 'icon': 'https://whitelist.anchorprotocol.com/logo/ANC.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1140175', 'contract_addr': 'terra1t5tg7jrmsk6mj9xs3fk0ey092wfkqqlapuevwr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '12539', 'contract_addr': 'terra1y3k5urh9ahwzsxr08dlspds4vpywsat49aklvn', 'verified': false }, { 'name': 'SDK Token', 'symbol': 'SDK', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra14ec8v4c5dnwu2pq9plfquaffutu59tq9hld77e', 'verified': false }, { 'name': 'SushiToken (Wormhole)', 'symbol': 'weSUSHI', 'decimals': 8, 'total_supply': '0', 'contract_addr': 'terra1csvuzlf92nyemu6tv25h0l79etpe8hz3h5vn4a', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ChVzxWRmrTeSgwd3Ui3UumcN8KX7VK3WaD4KGeSKpypj/logo.png', 'verified': true }, { 'name': 'Terra Finance', 'symbol': 'TEFI', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1t9m52s6gey6mcy9upq5ucujl5n6ewwqk80hp8t', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '448190887515', 'contract_addr': 'terra1ktld67cnuc592xd6xjgfh2n4d3f8av4mn53lul', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '46925984', 'contract_addr': 'terra1kr5twwkkdr38wa3t2477cmmrwwpjuggxl962y9', 'verified': false }, { 'name': 'dsh', 'symbol': 'DSHA', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra18ykszsm06k0suqjvz0q040lm36u7pn9eeq4uc4', 'verified': false }, { 'name': 'REKT', 'symbol': 'REKT', 'decimals': 6, 'total_supply': '2000000000000', 'contract_addr': 'terra19cnnyaah7c32hhcdt5m83pvdxa7ts64caarcm8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '142828568570', 'contract_addr': 'terra13pnaneaclmvtd52pl7crf74dwvau9r9r430uk6', 'verified': false }, { 'name': 'DDD', 'symbol': 'DDD', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1kuwc30mjvwx8jysn77jqq8mamhxn7tvxlpj70l', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9182', 'contract_addr': 'terra1kksfhstvdl9ht4pxzx900279s7fdaqp3un6l40', 'verified': false }, { 'name': 'SQUIDGAME', 'symbol': 'SQUID', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1r6pcn0wdes6lrtxty3xu253c02grcvuxmqg4s9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10', 'contract_addr': 'terra1004n2l4z26cuvchplkkrkxamx3un7lk702f0xy', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '631334', 'contract_addr': 'terra1llqsh0fr47vxpgv2s8l0d3k8h2g2lqcg87zhts', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '101397526', 'contract_addr': 'terra1qjlakmnnswdzmssfzurpdg48ygu5cnw4lg9h80', 'verified': false }, { 'name': 'Nexus Token', 'symbol': 'TNT', 'decimals': 6, 'total_supply': '2500000000000000', 'contract_addr': 'terra1w94fk75p0qeas276kfvy0m0zhnwgcy49c7vu77', 'verified': false }, { 'name': 'LunaX Token', 'symbol': 'LunaX', 'decimals': 6, 'total_supply': '1466033251876', 'contract_addr': 'terra17y9qkl8dfkeg4py7n0g5407emqnemc3yqk5rup', 'icon': 'https://raw.githubusercontent.com/stader-labs/assets/main/terra/LunaX_1.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '547722557505', 'contract_addr': 'terra1jed2nwcyz0xx8qutczeze08axeetcagawf32lc', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2005037', 'contract_addr': 'terra1kucdkxvceeue4lknqdjc49jazkuw3hmx6jqr2l', 'verified': false }, { 'name': 'TFLOKI Aviator Ticket', 'symbol': 'TFTICIII', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1vte2xv7dr8sfnrnwdf9arcyprqgr0hty5ads28', 'icon': 'https://terrafloki.io/ticket3_logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1', 'contract_addr': 'terra1fwwxakw6ue3jt398uneyf8agnwyf2pys8dcjcz', 'verified': false }, { 'name': 'uluna', 'symbol': 'Luna', 'decimals': 6, 'contract_addr': 'uluna', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/Luna.png', 'verified': true }, { 'name': 'Woffff Token', 'symbol': 'WOFFFF', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1999psgmwex5f7fs0u9nnxrnu82c0c6s7qczhxy', 'verified': false }, { 'name': 'Kingsman DAO', 'symbol': 'KINGS', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra19mcqz609t5vcudfatwexuhta0mrs49fu9dqj2s', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '12247448', 'contract_addr': 'terra1w22ns4l6sz3t39tx2z4lvxlnu8ejus20k0f2ts', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1wwaj9xx6apx5d3pta8rss4tn6lzgdhavs6wgnu', 'verified': false }, { 'name': 'LunaApe', 'symbol': 'APE', 'decimals': 6, 'total_supply': '96399999999999858', 'contract_addr': 'terra1j4kt7mns290trwlwyxrun5n7nlfkxxcak57ck2', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '253084', 'contract_addr': 'terra10etw4xh7ymehx3ngpknfa0p9nq2w7c97vhjzw8', 'verified': false }, { 'name': 'Thelawenforcer', 'symbol': 'TLE', 'decimals': 18, 'total_supply': '10000000000000000000000000000', 'contract_addr': 'terra1gtjtyyhj2cu0ekzju4rj86vsvg7d2uu576rrl7', 'verified': false }, { 'name': 'AguilarBoys', 'symbol': 'AGB', 'decimals': 6, 'total_supply': '9999000000', 'contract_addr': 'terra12qxyx2l90c37kylw4jqe8t40ppnrnu8wqmx940', 'verified': false }, { 'name': 'LunaticDoge', 'symbol': 'LDoge', 'decimals': 6, 'total_supply': '250000000', 'contract_addr': 'terra1fj06x3hq2xum56htlrdeame70knzl765cq4txr', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4443044138064', 'contract_addr': 'terra1c9wr85y8p8989tr58flz5gjkqp8q2r6murwpm9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1juspa927c7kdr0jf7wc0lxg6wfjz2cersm9r82', 'verified': false }, { 'name': 'SIFCHAIN FINANCE', 'symbol': 'ROWAN', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1p9wk5tns7jagwch6cdasgd753nzfj544v75qxr', 'verified': false }, { 'name': 'Lunaverse', 'symbol': 'LUV', 'decimals': 6, 'total_supply': '2000000000000000', 'contract_addr': 'terra1kd4rfff04cvw7vae0szgawj0xye90fkchljv7y', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4', 'contract_addr': 'terra143lm2z3y0atfzwqzgknse2t4wf7majdtrw4vps', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '16277390731', 'contract_addr': 'terra1ah6vn794y3fjvn5jvcv0pzrzky7gar3tp8zuyu', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '18728475', 'contract_addr': 'terra1efsarez7elxhvgeulu4zgmtg6g9rm3smasgglg', 'verified': false }, { 'name': 'Wrapped liquid staked Ether 2.0 (Wormhole)', 'symbol': 'wewstETH', 'decimals': 8, 'total_supply': '54610384374', 'contract_addr': 'terra133chr09wu8sakfte5v7vd8qzq9vghtkv4tn0ur', 'icon': 'https://static.lido.fi/wstETH/wstETH.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '89722041', 'contract_addr': 'terra1zn5ycnftj4lplwwtjrt6jtvqtqwc2xl0ypyegs', 'verified': false }, { 'name': 'uchf', 'symbol': 'CHT', 'decimals': 6, 'contract_addr': 'uchf', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/CHT.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '168', 'contract_addr': 'terra1uysyjwea5505rk3h6caeax3thnnpfp4vx885gp', 'verified': false }, { 'name': 'Terra SpaceX', 'symbol': 'tSPACEX', 'decimals': 3, 'total_supply': '10000000000000', 'contract_addr': 'terra1em52fj74ezgeqp5s6mp96y494s2gkjmtqy46sq', 'verified': false }, { 'name': 'The Walt Disney Company', 'symbol': 'mDIS', 'decimals': 6, 'total_supply': '5565100210', 'contract_addr': 'terra149755r3y0rve30e209awkhn5cxgkn5c8ju9pm5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '11', 'contract_addr': 'terra1e3fdfzrs0dw2tr9hkv8r3d649rydcwrx9zhum6', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5367168097', 'contract_addr': 'terra1d34edutzwcz6jgecgk26mpyynqh74j3emdsnq5', 'verified': false }, { 'name': 'iShares Gold Trust', 'symbol': 'mIAU', 'decimals': 6, 'total_supply': '236850195158', 'contract_addr': 'terra10h7ry7apm55h4ez502dqdv9gr53juu85nkd4aq', 'icon': 'https://whitelist.mirror.finance/icon/IAU.png', 'verified': true }, { 'name': 'GOD', 'symbol': 'GOD', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1lkszqh6duver9s9h0qfr2dcktj605km3hzfzjd', 'verified': false }, { 'name': 'Test Token ABL', 'symbol': 'TESTABL', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra16hhm24fc3wle66m3529n2jctqqsds57wv4c087', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1099670', 'contract_addr': 'terra1ujttg4pcvkjj9z8xazhzemv8kpexn3vexq4vpp', 'verified': false }, { 'name': 'Squid VIP Green Token', 'symbol': 'VGREEN', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1kntmj30tuu0fyu7vmgcrxuzax8gzt7mdmuppwv', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1f2mpaw7jmm7jzhkgf2x7yg50vr9m4aplu7gkxg', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '285734', 'contract_addr': 'terra1z373t5nj0jnh0tjr7ljpdwgh046gq3ym9vk775', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '67303940', 'contract_addr': 'terra1c5khguw3ensqawepuxh7vdzfpxa9ulwauhm0r5', 'verified': false }, { 'name': 'Matic Token (Wormhole)', 'symbol': 'weMATIC', 'decimals': 8, 'total_supply': '30000000000', 'contract_addr': 'terra1dfasranqm4uyaz72r960umxy0w8t6zewqlnkuq', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/C7NNPWuZCNjZBfW5p6JvGsR8pUdsRpEdP1ZAhnoDwj7h/logo.png', 'verified': true }, { 'name': 'TERRA miniWhale 🐳', 'symbol': 'miniWhale', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra13jkds0xx2hy2xrqwggzkt4navhremx2cjyl7aw', 'verified': false }, { 'name': 'CoinHall', 'symbol': 'CHALL', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1n8awtfqa0wphx90pd2zc9v8vccc65f0gvv6rq5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1myejqyh8u3q5prx6h8p9hplswdhwtuxuk5stc4', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '11123248695329', 'contract_addr': 'terra1p4pfnpsv8ly4mgzsmegz52kgjq8gp64almryky', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '492149011432', 'contract_addr': 'terra1nuy34nwnsh53ygpc4xprlj263cztw7vc99leh2', 'verified': false }, { 'name': 'Meta Trans', 'symbol': 'MTT', 'decimals': 6, 'total_supply': '91982170386736', 'contract_addr': 'terra1p8yhtrp8ttcrrl90kqez0602yl2sx2gvrw4h23', 'verified': false }, { 'name': 'Wanaka Farm', 'symbol': 'WANA', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1wwpxtgrrfn0jxq8f0hlrzngx8m28r8kd5umaq8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '11', 'contract_addr': 'terra1g7a4hl64r0pmjmdrd3cwsy2cdg2st5x7xlc6m0', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'ZMT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra10qjtgmpsnx7kn53nxmw2mfx626g8y4xaw04pd8', 'verified': false }, { 'name': 'Terra Cardano', 'symbol': 'tADA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1t5kcd9285mqczsyy2ztu96h8h8ecpy5sf6h0qu', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'ZMT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1lnrphdxwfre5w7rwazzfnp0k9d4glm63t7gg70', 'verified': false }, { 'name': 'Invesco QQQ Trust', 'symbol': 'mQQQ', 'decimals': 6, 'total_supply': '26950205740', 'contract_addr': 'terra1csk6tc7pdmpr782w527hwhez6gfv632tyf72cp', 'icon': 'https://whitelist.mirror.finance/icon/QQQ.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '2500672903912', 'contract_addr': 'terra1mxpq2xc6k7zasj4wmlz07x4wh9la8dqn3nrxja', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra1n9w80dcemd9uys5fjfv6detru9vcftservvj5n', 'verified': false }, { 'name': 'Secret', 'symbol': 'SCRT', 'decimals': 6, 'contract_addr': 'ibc/EB2CED20AB0466F18BE49285E56B31306D4C60438A022EA995BA65D5E3CF7E09', 'icon': 'https://assets.terra.money/icon/svg/ibc/SCRT.svg', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486', 'contract_addr': 'terra1jaw7xw5904fsarqgugk0h4tl32w385zv5zaax9', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '24233734072', 'contract_addr': 'terra1fgc9vy7hhzjgv90chemxgs0p5j5dfhkzsfexlt', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '719721343891', 'contract_addr': 'terra17fysmcl52xjrs8ldswhz7n6mt37r9cmpcguack', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '15811388300', 'contract_addr': 'terra1dt5n5tf9afjzms493nfkt3telqtvp5mmmftu0e', 'verified': false }, { 'name': 'WrappedOrion', 'symbol': 'wORION', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1jl0egxpdfw0eqkzsgedzzet9zgwmhet2rd3s6u', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '4472', 'contract_addr': 'terra1w3ffc33tpmwc3fa0ga8jlqne647k3jtjftrsfl', 'verified': false }, { 'name': 'PTT Token', 'symbol': 'PTT', 'decimals': 6, 'total_supply': '142500000000000', 'contract_addr': 'terra1k637r8ucfp585tv57gsnqzfdmsw6mnm9zn59zy', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1qxfl4e8gjnunk0t3kq7a6ladu2p4cddk95s5jj', 'verified': false }, { 'name': 'udkk', 'symbol': 'DKT', 'decimals': 6, 'contract_addr': 'udkk', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/DKT.png', 'verified': true }, { 'name': 'Terra Musk', 'symbol': 'tMUSK', 'decimals': 3, 'total_supply': '1000000000000000', 'contract_addr': 'terra1asq6hza8spaeghqt4k7fnj4m7nfaag07ljdqz7', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277', 'contract_addr': 'terra12zl9vnd4rt0xrgt4zylztjcm40u7fmfcf33vn0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000000', 'contract_addr': 'terra13698ymrlv2xpy8l28r6qx5fx420w744zg24qzp', 'verified': false }, { 'name': 'xzx', 'symbol': 'xzx', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra15pv3xxp2d5f65qeu2v27vqf9zpqjx0fuztfwcu', 'verified': false }, { 'name': 'Luart Token', 'symbol': 'LUART', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1vjgnhlv9h0nlta2v7s5hts75h2mc065c6ap3j5', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '46925984', 'contract_addr': 'terra183pmt26qpwy4xnpunzmckjydsnyw43hejgaucf', 'verified': false }, { 'name': 'Luna Bullish', 'symbol': 'BULL', 'decimals': 6, 'total_supply': '10000000000000', 'contract_addr': 'terra1tm2jhnfh6hmnpvzsyfteqhcn6h5uw2qafr48yh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1283547617', 'contract_addr': 'terra1t6chem282fju8jhgnkrpcm5ltc3frxq93qsped', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '152046', 'contract_addr': 'terra122pv8ln4s5kled99288gn8sfk4ep5pw05yynez', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '62311465988', 'contract_addr': 'terra1q7m2qsj3nzlz5ng25z5q5w5qcqldclfe3ljup9', 'verified': false }, { 'name': 'TEST DONOT BUY', 'symbol': 'DONT', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra1kf3ez7z2kzvvv7z7kte4en35gxm8keurgl09nj', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '14709852903', 'contract_addr': 'terra1mspnuehp4h68f03t35lr0dzz8ajhzdq9jazjk8', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '690948', 'contract_addr': 'terra1u4474h3hqesjwkrtkxekjw065fduc92wke4clq', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '63245553203', 'contract_addr': 'terra1zrlt4v8jzrsst0zq4ug98xaz0rmerpajff63yf', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1293662398', 'contract_addr': 'terra147g65flk0wtqej7k87ggc53ftwu74w3l9vj6ln', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '9486', 'contract_addr': 'terra132njtndm2rjcn4x95tq5qm5h98smn8a7hnvwj7', 'verified': false }, { 'name': 'GUILDONG', 'symbol': 'HONGB', 'decimals': 6, 'total_supply': '100000000000', 'contract_addr': 'terra1v8wg6yr69cu842w053f8qk909f4swp4cn2waqp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '398294166', 'contract_addr': 'terra1u2ksckpcec73mmy3gl3l2uc473vl4vh864npt6', 'verified': false }, { 'name': 'TerraFormer', 'symbol': 'TFM', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1kx73zld4tmv24r66h7jp8gaz2rrl4asxlzq2g4', 'verified': false }, { 'name': 'Bitcoin', 'symbol': 'mBTC', 'decimals': 6, 'total_supply': '105152728', 'contract_addr': 'terra1rhhvx8nzfrx5fufkuft06q5marfkucdqwq5sjw', 'icon': 'https://whitelist.mirror.finance/icon/BTC.png', 'verified': true }, { 'name': 'Wrapped BNB (Wormhole)', 'symbol': 'wbWBNB', 'decimals': 8, 'total_supply': '1251828923', 'contract_addr': 'terra1cetg5wruw2wsdjp7j46rj44xdel00z006e9yg8', 'icon': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa/logo.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '80', 'contract_addr': 'terra1z038v5j6mlwluahjjy6z73q6ckq6rwkllj5xue', 'verified': false }, { 'name': 'CLAW', 'symbol': 'CLAW', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1f85kt39ar3tkscq6w8ylxv2t9qh4ktzayw35ta', 'verified': false }, { 'name': 'Prism Protocol Token', 'symbol': 'PRISM', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw', 'icon': 'https://prismprotocol.app/prism.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra1pk0vx4t0aum2jlyv6v0hanq3unvkhl4lxp6zl3', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '316227766', 'contract_addr': 'terra1m386g65qjvcf6nrz6p0ael59y37l5suf6ys6sm', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra12xvfjxzqw22n55ck4x2vqegev2qgf32vu3j9vc', 'verified': false }, { 'name': 'Coinbase Global, Inc.', 'symbol': 'mCOIN', 'decimals': 6, 'total_supply': '10456223810', 'contract_addr': 'terra18wayjpyq28gd970qzgjfmsjj7dmgdk039duhph', 'icon': 'https://whitelist.mirror.finance/icon/COIN.png', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '5117096399', 'contract_addr': 'terra16t34llthsfwdjazglwamhv4f20f4ux4wmm9zzy', 'verified': false }, { 'name': 'Terra CAT', 'symbol': 'CAT', 'decimals': 6, 'total_supply': '1000000000000', 'contract_addr': 'terra1677xekxjqc4f3jqut8yr6p29e8h5zfay37et58', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000000', 'contract_addr': 'terra1t46rhfcgqpz9xkx33qpzk55yudp7wdaygj7yfw', 'verified': false }, { 'name': 'Top Terra', 'symbol': 'TOP', 'decimals': 6, 'total_supply': '900000000000000', 'contract_addr': 'terra1lm2lwzrpmyyt2qfhkmj7rwvh7yrh0npzpl6k7v', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '0', 'contract_addr': 'terra16r76trzhj48rj8tmq82f8set2mm6v7qrje3rn3', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '537048032', 'contract_addr': 'terra17k56585u8yu084060vjlgf4jgmswxahguee47n', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '3162277660', 'contract_addr': 'terra1a05a50wz2n8mlr5nzwlsftzrdf9gvy5sypxdg9', 'verified': false }, { 'name': 'MiniDoge', 'symbol': 'MINI', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1q0q09duq6jsth9m0gfj7fpxlxwlj5fcxgchuza', 'verified': false }, { 'name': 'XDEFI (Wormhole)', 'symbol': 'XDEFI', 'decimals': 8, 'total_supply': '561437434134549', 'contract_addr': 'terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh', 'icon': 'https://github.com/sushiswap/assets/blob/master/blockchains/ethereum/assets/0x72B886d09C117654aB7dA13A14d603001dE0B777/logo.png?raw=true', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '89206067004', 'contract_addr': 'terra1yjvlgj80jkzwakqv65tzfwctdehqav4jujgx37', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '55517', 'contract_addr': 'terra1mljg7dvzknqh3gc62emagf7hwxxg8efemennp8', 'verified': false }, { 'name': 'Terra Shiba', 'symbol': 'tSHIBA', 'decimals': 3, 'total_supply': '1000000000000000', 'contract_addr': 'terra140k6k2pmh2lmy4q4wyz5znqmtgwvs3gkgfeevq', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10', 'contract_addr': 'terra12wg09c4azptm8yaw7cadhz8u2nvthj0xm99rva', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1572501529', 'contract_addr': 'terra12v03at235nxnmsyfg09akh4tp02mr60ne6flry', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '28284271247', 'contract_addr': 'terra16znt4xty0md2k7e6evq8thsumhn6lm4kavqzzy', 'verified': false }, { 'name': 'aaaavar', 'symbol': 'AAAv', 'decimals': 3, 'total_supply': '100000000000000', 'contract_addr': 'terra1dyptd3795l57lencr2eltut973kum8wgu36f7p', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '10000000', 'contract_addr': 'terra198pmh4mhd42ltqlcntja99fzg4psw7en4w3z7l', 'verified': false }, { 'name': 'Kujira Token', 'symbol': 'KUJI', 'decimals': 6, 'total_supply': '125529124660584', 'contract_addr': 'terra1xfsdgcemqwxp4hhnyk4rle6wr22sseq7j07dnn', 'icon': 'https://assets.kujira.app/kuji.png', 'verified': true }, { 'name': 'dosh', 'symbol': 'DOSH', 'decimals': 6, 'total_supply': '100018011383493833971', 'contract_addr': 'terra14mvkydkwm2pzz62cgrkpeusphm4trrqrzd88ju', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '8499', 'contract_addr': 'terra1uvlukgsje5cp6pnczg3y4etkctrh7yjps5tewj', 'verified': false }, { 'name': 'Atlo', 'symbol': 'ATLO', 'decimals': 6, 'total_supply': '200000000000000', 'contract_addr': 'terra1cl7whtrqmz5ldr553q69qahck8xvk80fm33qjx', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '792559197', 'contract_addr': 'terra1cksuxx4ryfyhkk2c6lw3mpnn4hahkxlkml82rp', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '84476500319', 'contract_addr': 'terra1m8mr9u3su46ezxwf7z7xnvm0jsapl2jd8vgefh', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '50658719', 'contract_addr': 'terra1a3n5ryr8ud3mw0cdu6gm8yqdcjjmelu5d79g7q', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '420', 'contract_addr': 'terra1j0j79nurur9fhqf5hrl8uav75pqmrt0t06a4ap', 'verified': false }, { 'name': '25K', 'symbol': 'TFK', 'decimals': 6, 'total_supply': '10000000000000000', 'contract_addr': 'terra1t7apedqrzywmrl89feackcalpknfzu5mr8t3xg', 'verified': false }, { 'name': 'Pylon bDP Token for Gateway Psi 24m Pool', 'symbol': 'bPsiDP-24m', 'decimals': 6, 'total_supply': '17885852861060', 'contract_addr': 'terra1zsaswh926ey8qa5x4vj93kzzlfnef0pstuca0y', 'icon': 'https://assets.pylon.rocks/logo/bPsiDP.png', 'verified': true }, { 'name': 'NFT LUNAtisc', 'symbol': 'LUNATISC', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1rp3mdhrwxhdlx923t2q50f0n6z6660z9yqghpv', 'verified': false }, { 'name': 'uidr', 'symbol': 'IDT', 'decimals': 6, 'contract_addr': 'uidr', 'icon': 'https://raw.githubusercontent.com/terra-money/assets/master/icon/60/IDT.png', 'verified': true }, { 'name': 'Terra Dao', 'symbol': 'TDAO', 'decimals': 6, 'total_supply': '6000000000000', 'contract_addr': 'terra1uc4fwlh2wn59qqk8y7ld0vxc9hvsufaa5gv5z8', 'verified': false }, { 'name': 'RoboHero Token', 'symbol': 'ROBO', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1mfek3m9s0sazd40kjraw5qv3963t5n3gwk408u', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '1000060000', 'contract_addr': 'terra1gq6ulqmrxnzx8uyrmjmqu4kguqxyy8xwky5mh4', 'verified': false }, { 'name': 'TerraEarth', 'symbol': 'EARTH', 'decimals': 6, 'total_supply': '100000000000000', 'contract_addr': 'terra1cxvsl5qdvctc537a8q9ynv0seu4r5ceacptwx0', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '100000000', 'contract_addr': 'terra16ejgdv4scnaedcjrser8lc73w2gerggx2cqv5c', 'verified': false }, { 'name': 'Alpha Pack Token', 'symbol': 'aLOT', 'total_supply': '8176', 'contract_addr': 'terra1366wmr8t8rrkh6mag8fagqxntmf2qe4kyte784', 'icon': 'https://ipfs.playlot.io/icon/profile-logo.png', 'verified': true }, { 'name': 'Mini Luna', 'symbol': 'mLuna', 'decimals': 6, 'total_supply': '10000000000', 'contract_addr': 'terra160hntqlsd7wzyydhzw653lw8puftnwaj327xyd', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '107117437', 'contract_addr': 'terra17vddhyh8zulk4yx2zapsk9z5y5r5mjaf9w6egv', 'verified': false }, { 'name': 'CatDog', 'symbol': 'CATDOG', 'decimals': 6, 'total_supply': '542000000000000', 'contract_addr': 'terra1laqzmwrpyrd5tumpx5hs638tzhle4nc42k9jak', 'verified': false }, { 'name': 'Kaizen Finance', 'symbol': 'KAIZEN', 'decimals': 6, 'total_supply': '2000000000000000000', 'contract_addr': 'terra1tmar57largkrtts55q8szey2q78zc9em43ej5n', 'verified': false }, { 'name': 'Safe Terra', 'symbol': 'sTERRA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1yfjk0jn42krryudpv04mg0c3ghuq4u3qtyztgq', 'verified': false }, { 'name': 'CurioSITY play to earn token', 'symbol': 'SITY', 'decimals': 6, 'total_supply': '3275795943', 'contract_addr': 'terra1z09gnzufuflz6ckd9k0u456l9dnpgsynu0yyhe', 'icon': 'https://www.curio.art/img/logo.svg', 'verified': true }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '11453926', 'contract_addr': 'terra17y23mq28m6df9gghnf0d4tzedrsga2v4k36k56', 'verified': false }, { 'name': 'Terra miniShiba', 'symbol': 'miniSHIBA', 'decimals': 6, 'total_supply': '1000000000000000', 'contract_addr': 'terra1ml4r2ry9pf9evmahn0nh5nzjzntf63wzmnull3', 'verified': false }, { 'name': 'terraswap liquidity token', 'symbol': 'uLP', 'decimals': 6, 'total_supply': '18972', 'contract_addr': 'terra1u7v3aqt6uv2y60kwur5zk3sxpcjn609s4xyzx6', 'verified': false }]

        return c.map(o => {
          let row = {
            'label': o.symbol,
            'value': o.symbol,
            'name': o.name,
            'image': o.verified ? o.icon : 'https://app.terraswap.io/static/media/Token.e64247ab1508a84ab52cc99f73746dfb.svg',
            'address': o.contract_addr ? o.contract_addr : o.denom,
            'isCW20': o.contract_addr.includes('terra'),
            'decimals': o.decimals,
            'price': o.current_price,
            'dex': 'terraswap',
            'priority': (o.verified ? 1 : 0) + ['ust', 'luna', 'eut', 'krt', 'mnt', 'sdt'].reverse().indexOf(o.symbol.toLowerCase())
          }
          return row
        }).sort((a, b) => b.priority - a.priority)
      }
    }
    let v = coins[chain]
    let data = null
    if (v) {
      data = await coins[chain]()
    } else if (!Lib.isEvm(chain)) {
      let x = HD.names.find(o => o.value === chain)
      if (x) {
        x.image = x.icon ? x.icon : 'https://files.coinswitch.co/public/coins/' + x.value + '.png'
        data = [x]
      }
    }

    return data
  }
  getAllCoins (unique = true, dex = false) {
    let coins = store.state.settings.coins.coinswitch.concat(store.state.settings.coins.oneinch).concat(store.state.settings.coins.defibox).concat(store.state.settings.coins.godex)

    coins = coins.filter(o => !(store.state.wallets.tokens.filter(x => x.chain === 'eos').map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))

    store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type !== 'verto').forEach((coin) => {
      let row = {
        'label': coin.type.toUpperCase(),
        'name': coin.name,
        'value': coin.type,
        'contract': coin.contract,
        'precision': coin.precision,
        'image': coin.icon,
        // 'image': 'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/' + coin.contract + '-' + coin.type + '.png',
        'dex': 'coinswitch',
        'amount': parseFloat(coin.amount),
        'amountUSD': coin.usd
      }

      coins.unshift(row)
    })
    const getImage = (type) => {
      let images = {
        eth: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
        btc: 'https://api.godex.io/storage/coins/nlQJWbSb5SZ0CsXk0RTDFH2Tsg4bcRKuZLZwVyKr.png',
        usdc: 'https://tokens.1inch.exchange/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
      }
      if (images[type]) {
        return images[type]
      }
    }
    coins.map(o => {
      let image = getImage(o.value.toLowerCase())
      o.image = image || o.image
    })
    // coins = this.getUniqueTokens(coins)
    return coins.sort(function (a, b) {
      return a.name ? -1 : 1
    }).filter((o, i) => !unique || coins.findIndex(a => a.value.toLowerCase() === o.value.toLowerCase()) === i)
  }

  getApprovalDataV3 (tokenAddress, evmData) {
    let response = axios.get(process.env[store.state.settings.network].CACHE + 'https://api.1inch.exchange/v3.0/' + evmData.network_id + '/approve/calldata?tokenAddress=' + tokenAddress)
    return response
  }

  getSpender1Inchv3 (evmData) {
    let response = axios.get(process.env[store.state.settings.network].CACHE + 'https://api.1inch.exchange/v3.0/' + evmData.network_id + '/approve/spender')
    return response
  }
  async isOneinchApprovalRequired (fromUserAddress, fromToken, toToken, amountToSend, fromChain) {
    let transactionObject = {}
    let check = {
      required: false,
      error: false,
      entity: '1inch',
      transactionObject: null
    }
    const web3 = Lib.getWeb3Instance(fromChain)
    let evmData = Lib.evms.find(o => o.chain === fromChain)
    let tokenData = await this.getOneInchCoinData(fromToken, toToken, evmData.network_id)
    console.log(tokenData, 5, fromUserAddress, fromToken, toToken, amountToSend, fromChain)
    if (tokenData && tokenData.fromData && tokenData.toData && evmData.nativeToken !== fromToken.toLowerCase()) {
      const tokenContract = new web3.eth.Contract(abiArray, tokenData.fromData.address)

      let spenderData = await this.getSpender1Inchv3(evmData)

      if (spenderData.data && spenderData.data.address) {
        let toAddress = spenderData.data.address

        const allowance = await tokenContract.methods.allowance(fromUserAddress, toAddress).call()

        if (parseFloat(allowance) === 0 || parseFloat(allowance) < parseFloat(amountToSend)) {
          let nonce = await web3.eth.getTransactionCount(fromUserAddress, 'latest')

          transactionObject = {
            from: fromUserAddress,
            nonce: nonce
          }
          check.required = true

          let approvalData = await this.getApprovalDataV3(tokenData.fromData.address, evmData)

          if (approvalData.data && approvalData.data.data) {
            transactionObject.data = approvalData.data.data
            transactionObject.value = web3.utils.toHex(approvalData.data.value)
            transactionObject.gasPrice = web3.utils.toHex(approvalData.data.gasPrice)
          }
          transactionObject.to = tokenData.fromData.address
          transactionObject.chainId = evmData.network_id
          check.transactionObject = transactionObject
        }
      } else {
        check.error = 'Spender address not found'
      }
    } else {
      check.error = 'Token not found'
    }

    return check
  }
  async getDefiboxPairs () {
    let pairs = []

    if (store.state.settings.globalSettings && store.state.settings.globalSettings.defiboxPairs) {
      pairs = store.state.settings.globalSettings.defiboxPairs
    } else {
      let rpc = new JsonRpc(process.env[store.state.settings.network].CACHE + 'https://eos.greymass.com:443')

      let pairs = this.cache['defibox_pairs']
      if (!pairs) {
        pairs = (await rpc.get_table_rows({
          json: true,
          code: 'swap.defi',
          scope: 'swap.defi',
          table: 'pairs',
          limit: -1
        })).rows
        this.cache['defibox_pairs'] = pairs
      }
    }

    return pairs
  }
  async getDefiboxPairData (to, from) {
    this.ErrorMessage = null
    let pairs = await this.getDefiboxPairs()
    let pair = pairs.find(
      (w) =>
        (w.token1.symbol.split(',')[1].toLowerCase() === from &&
            to ===
              w.token0.symbol.split(',')[1].toLowerCase()) ||
          (w.token0.symbol.split(',')[1].toLowerCase() === from &&
            to ===
              w.token1.symbol.split(',')[1].toLowerCase())
    )
    if (pair && pair.liquidity_token === 0) {
      pair = false
    }
    return pair
  }
   getDex = async (from, to, chain) => {
     let dex = []

     if (['eth', 'matic', 'bsc'].includes(chain) && store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === to.toLowerCase())) {
       dex.push({ chains: ['eth', 'matic', 'bsc'], dex: 'oneinch' })
     }
     if (chain === 'eos' && store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === to.toLowerCase())) {
       let pairDefibox = await this.getDefiboxPairData(to, from)
       if (pairDefibox) {
         dex.push({ chains: ['eos'], dex: 'defibox' })
       }
     }

     if (chain === 'terra') {
       dex.push({ chains: [chain], dex: 'terraswap' })
     }

     if (chain === 'btc' && ['btc'].includes(from.toLowerCase()) && ['renbtc'].includes(to.toLowerCase())) {
       dex.push({ chains: [], dex: 'renbridge' })
     }

     if (store.state.settings.coins.godex.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.godex.find(o => o.value.toLowerCase() === to.toLowerCase())) {
       dex.push({ chains: [], dex: 'godex' })
     }
     return dex
   }
   async getOneInchCoinData (from, to, chainId) {
     let coins = this.cache['oneinch_' + chainId]
     if (!coins) {
       let result = await axios.get(_1inch + '/v3.0/' + chainId + '/tokens')
       coins = result.data.tokens
       this.cache['oneinch_' + chainId] = coins
     }

     let fromData = Object.keys(coins).filter(o => coins[o].symbol.toLowerCase() === from.toLowerCase()).map(o => coins[o])
     let toData = Object.keys(coins).filter(o => coins[o].symbol.toLowerCase() === to.toLowerCase()).map(o => coins[o])

     let pair = {
       fromData: fromData ? fromData[0] : null,
       toData: toData ? toData[0] : null
     }

     return pair
   }
   getCW20Pairs () {
     return CW20s
   }
   getPair = (from, to, amount, chain) => {
     const self = this
     if (!parseFloat(amount) || !from || !to) return
     let list = {
       oneinch () {
         return new Promise(async (resolve, reject) => {
           let fromToken = store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === from.toLowerCase())
           let toToken = store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === to.toLowerCase())
           let validChains = []
           let evmData = null
           await Promise.all([chain].map(async chain => {
             evmData = Lib.evms.find(o => o.chain === chain)
             console.log(evmData, 'evmData', chain)
             let pair = await self.getOneInchCoinData(from, to, evmData.network_id)

             if (pair.fromData && pair.toData) {
               validChains.push(evmData.chain)
             }
           }))

           if (amount < 0.0000001) {
             reject()
             return
           }
           // if (validChains.length) { evmData = Lib.evms.find(o => o.chain === validChains[0]) }
           let data = {
             fromTokenAddress: fromToken.address,
             toTokenAddress: toToken.address,
             amount: Math.round(amount * 10 ** fromToken.decimals)
           }
           axios
             .get(process.env[store.state.settings.network].CACHE + self.base.oneinch + evmData.network_id + '/quote?' + new URLSearchParams(data).toString())
             .then(async res => {
               data.amount = res.data.toTokenAmount.toString() / (10 ** toToken.decimals)
               data.fromChains = validChains
               data.toChains = validChains
               data.isCrosschain = false
               data.limitMaxDepositCoin = 0
               data.limitMinDepositCoin = 0

               data.approval = await self.isOneinchApprovalRequired(
                 store.state.investment.defaultAccount.key,
                 from,
                 to,
                 amount,
                 chain
               )
               data.fee = {}
               let gas = res.data.estimatedGas, gasPrice = 0
               let web3 = Lib.getWeb3Instance(chain)
               if (data.approval.required) {
                 let obj = Object.assign({}, data.approval.transactionObject)
                 delete obj.nonce
                 delete obj.chainId
                 delete obj.gasPrice

                 gas = await web3.eth.estimateGas(obj)
                 data.approval.transactionObject.gas = gas
                 data.approval.transactionObject.gas = web3.utils.toHex(gas.toString())
                 data.txParams = data.approval.transactionObject
                 gasPrice = parseInt(data.txParams.gasPrice) / 1000000000
               } else {
                 data.txParams = await self.createTransaction(from, to, amount, null, chain, chain, store.state.investment.defaultAccount.key, store.state.investment.defaultAccount.key)
                 let g = await Lib.getEtherereumPriceGas()
                 gasPrice = g
                 data.txParams.gas = web3.utils.toHex(gas.toString())
                 data.txParams.gasPrice = web3.utils.toHex(parseInt((g * 1000000000)).toString())
               }
               data.fee.native = (gas * (gasPrice) * 1000000000) / 10 ** 18
               data.fee.usd = data.fee.native * (await Lib.getCoinGeckoPrice('ethereum'))

               resolve({
                 pair: data
               })
             })
             .catch(e => {
               reject({
                 error: e
               })
             })
         })
       },
       terraswap () {
       //  let router = 'terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex'
         return new Promise(async (resolve, reject) => {
           let tokens = await self.getCoinByChain('terra')
           let data = {
             amount: 0,
             path: null
           }
           let fromToken = tokens.find(o => o.value.toLowerCase() === from.toLowerCase())
           let toToken = tokens.find(o => o.value.toLowerCase() === to.toLowerCase())
           let r = await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.terraswap.io/tx/swap?amount=' + amount + '&from=' + fromToken.address + '&to=' + toToken.address + '&sender=-&max_spread=0&belief_price=0')

           if (r && r.data) {
             const simulateQueries = r.data.map((msg) => {
               let { contract, execute_msg } = (Array.isArray(msg)
                 ? msg[0].value
                 : msg.value)

               if (execute_msg?.send) {
                 contract = execute_msg?.send?.contract
                 execute_msg = execute_msg?.send?.msg
               }
               if (execute_msg?.execute_swap_operations) {
                 const { operations } = execute_msg.execute_swap_operations
                 if (execute_msg.execute_swap_operations) {
                   execute_msg.execute_swap_operations.offer_amount = parseInt(amount * 10 ** fromToken.decimals).toString()
                 }
                 return {
                   contract,
                   tx: {
                     contract,
                     execute_msg
                   },
                   msg: {
                     simulate_swap_operations: {
                       offer_amount: parseInt(amount * 10 ** fromToken.decimals).toString(),
                       operations
                     }
                   }
                 }
               }
               if (execute_msg?.swap) {
                 const offer_asset = execute_msg?.swap?.offer_asset || {
                   amount: parseInt(amount * 10 ** fromToken.decimals).toString(),
                   info: {
                     token: {
                       contract_addr: fromToken.address
                     }
                   }
                 }

                 return {
                   contract,
                   tx: {
                     contract,
                     execute_msg
                   },
                   msg: {
                     simulation: { offer_asset }
                   }
                 }
               }
               return undefined
             })
             let returnAmount = 0
             await Promise.all(simulateQueries.map(async route => {
               /*   const execute_msg = route[0].value
                ?.execute_msg
               const tokenRoutes = []
               const operations =
                execute_msg?.execute_swap_operations?.operations ||
                execute_msg?.send?.msg?.execute_swap_operations?.operations
               console.log(execute_msg, operations)
               if (operations) {
                 operations.forEach((operation, index) => {
                   if (operation?.terra_swap?.offer_asset_info?.native_token?.denom) {
                     tokenRoutes.push(
                      operation?.terra_swap?.offer_asset_info?.native_token?.denom
                     )
                   } else if (
                    operation?.terra_swap?.offer_asset_info?.token?.contract_addr
                   ) {
                     tokenRoutes.push(
                      operation?.terra_swap?.offer_asset_info?.token?.contract_addr
                     )
                   } else if (operation?.native_swap?.offer_denom) {
                     tokenRoutes.push(operation?.native_swap?.offer_denom)
                   }

                   if (index >= operations.length - 1) {
                     if (operation?.terra_swap?.ask_asset_info?.native_token?.denom) {
                       tokenRoutes.push(
                        operation?.terra_swap?.ask_asset_info?.native_token?.denom
                       )
                     } else if (
                      operation?.terra_swap?.ask_asset_info?.token?.contract_addr
                     ) {
                       tokenRoutes.push(
                        operation?.terra_swap?.ask_asset_info?.token?.contract_addr
                       )
                     } else if (operation?.native_swap?.ask_denom) {
                       tokenRoutes.push(operation?.native_swap?.ask_denom)
                     }
                   }
                 })
               }
               console.log(tokenRoutes, 'tokenRoutes')
               */

               let config = {
                 method: 'get',
                 url: process.env[store.state.settings.network].CACHE + 'https://fcd.terra.dev/wasm/contracts/' + route.contract + '/store?query_msg=' + encodeURIComponent(JSON.stringify(route.msg))
               }

               let res = await axios(config)
               let key = 'return_amount'
               if (res && res.data && res.data.result) {
                 if (res.data.result.amount) {
                   key = 'amount'
                 }
                 if (res.data.result[key]) {
                   let newAmount = parseFloat(res.data.result[key] / (10 ** toToken.decimals))
                   if (returnAmount > newAmount) {
                     return
                   }
                   data.amount = returnAmount = newAmount
                   if (route.tx.execute_msg.execute_swap_operations) {
                     route.tx.execute_msg.execute_swap_operations.minimum_receive = parseInt(res.data.result[key] - res.data.result[key] * 0.03).toString()
                   }
                   if (route.tx.execute_msg.swap && route.tx.execute_msg.swap.belief_price === '0' && route.tx.execute_msg.swap.max_spread === '0') {
                     route.tx.execute_msg.swap.max_spread = '0.005'
                     route.tx.execute_msg.swap.belief_price = (amount / data.amount).toString()
                   }
                   if (fromToken.isCW20) {
                     let params = { send: {
                       msg: '',
                       amount: (amount * (10 ** fromToken.decimals)).toString(),
                       contract: route.tx.contract
                     } }

                     params.send.msg = Buffer.from(JSON.stringify(route.tx.execute_msg),
                       'utf8'
                     ).toString('base64')

                     data.txParams = new MsgExecuteContract(
                       store.state.investment.defaultAccount.key,
                       fromToken.address,
                       params
                     )
                   } else {
                     let params = {}
                     params[fromToken.address] = amount * (10 ** fromToken.decimals)
                     data.txParams = new MsgExecuteContract(
                       store.state.investment.defaultAccount.key,
                       route.tx.contract,
                       JSON.parse(JSON.stringify(route.tx.execute_msg)),
                       new Coins(params)
                     )
                   }
                 }
               }
             }))
           }
           /*
           let pairs = self.getCW20Pairs()

           // Non efficient. better solution ?
           let directPair = pairs.find(o => (o.asset_infos[0][!fromToken.isCW20 ? 'native_token' : 'token'] && o.asset_infos[0][!fromToken.isCW20 ? 'native_token' : 'token'][fromToken.isCW20 ? 'contract_addr' : 'denom'] === fromToken.address && o.asset_infos[1][!toToken.isCW20 ? 'native_token' : 'token'] && o.asset_infos[1][!toToken.isCW20 ? 'native_token' : 'token'][toToken.isCW20 ? 'contract_addr' : 'denom'] === toToken.address) || (o.asset_infos[0][!toToken.isCW20 ? 'native_token' : 'token'] && o.asset_infos[0][!toToken.isCW20 ? 'native_token' : 'token'][toToken.isCW20 ? 'contract_addr' : 'denom'] === toToken.address && o.asset_infos[1][!fromToken.isCW20 ? 'native_token' : 'token'] && o.asset_infos[1][!fromToken.isCW20 ? 'native_token' : 'token'][fromToken.isCW20 ? 'contract_addr' : 'denom'] === fromToken.address))

           console.log(fromToken, 'fromToken', toToken, 'toToken', directPair)

           if (directPair) {
             let query = {
               simulation: {
                 offer_asset: {
                   amount: (amount * (10 ** fromToken.decimals)).toString(),
                   info: {

                   }
                 }
               }
             }

             query.simulation.offer_asset.info = fromToken.isCW20 ? { token: {
               contract_addr: fromToken.address
             } } : { native_token: {
               denom: fromToken.address
             } }

             let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://fcd.terra.dev/wasm/contracts/' + directPair.contract_addr + '/store?query_msg=' + encodeURIComponent(JSON.stringify(query)))
             if (res && res.data && res.data.result && res.data.result.return_amount) {
               data.amount = parseFloat(res.data.result.return_amount / (10 ** fromToken.decimals))
               data.path = directPair
             }
           }

           let paths = pairs.filter(o => o.asset_infos.find(a => a.token) && o.asset_infos.find(i => i.token).token.contract_addr === fromToken.address && o.asset_infos.find(o => o.native_token))

           await Promise.all(paths.map(async p => {
             let path2 = pairs.find(o => o.asset_infos.find(a => a.token) && o.asset_infos.find(i => i.token).token.contract_addr === toToken.address && p.asset_infos.find(o => o.native_token))
             if (path2) {
               let q = {
                 'simulate_swap_operations': {
                   'offer_amount': (amount * (10 ** fromToken.decimals)).toString(),
                   'operations': [
                     {
                       'terra_swap': {
                         'offer_asset_info': {
                           'token': {
                             'contract_addr': fromToken.address
                           }
                         },
                         'ask_asset_info': {
                           'native_token': {
                             'denom': p.asset_infos.find(o => o.native_token).native_token.denom
                           }
                         }
                       }
                     },
                     {
                       'terra_swap': {
                         'offer_asset_info': {
                           'native_token': {
                             'denom': p.asset_infos.find(o => o.native_token).native_token.denom
                           }
                         },
                         'ask_asset_info': {
                           'token': {
                             'contract_addr': toToken.address
                           }
                         }
                       }
                     }
                   ]
                 } }
               let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://fcd.terra.dev/wasm/contracts/' + router + '/store?query_msg=' + encodeURIComponent(JSON.stringify(q)))
               if (res && res.data && res.data.result && res.data.result.amount) {
                 let amt = parseFloat(res.data.result.amount / (10 ** fromToken.decimals))
                 console.log(amount, data)
                 if (!data.amount || data.amount < amt) {
                   data.amount = amt
                   data.path = q
                 }
               }
               console.log(amount, data, 2)
             }
           }))
         */
           data.fromChains = ['terra']
           data.toChains = ['terra']
           data.isCrosschain = false
           data.limitMaxDepositCoin = 0
           data.limitMinDepositCoin = 0

           resolve({
             pair: data
           })
         })
       },
       async defibox () {
         return new Promise(async (resolve, reject) => {
           let pairData = await self.getDefiboxPairData(to, from)
           let poolOne, poolTwo, toAmount

           let input = 'pool1'
           if (!pairData || pairData.liquidity_token === 0) {
             resolve({
               pair: false
             })
             return
           }

           pairData.pool1 = asset(pairData.reserve0)
           pairData.pool2 = asset(pairData.reserve1)
           // let mul = 0.0001
           if (pairData.pool1.symbol.code().to_string() === from.toUpperCase()) {
             poolOne = pairData.pool1
             poolTwo = pairData.pool2

             // mul = 10000
           } else {
             poolOne = pairData.pool2
             poolTwo = pairData.pool1
           }

           // console.log(parseFloat(this.swapData.fromAmount), parseFloat(poolTwo.amount), parseFloat(poolOne.amount), parseFloat(mul), 'mul')
           pairData.price = (poolTwo.amount / poolOne.amount)

           pairData.fee = 0

           let a = (parseFloat(amount) || 0).toFixed(poolOne.symbol.precision())

           a = asset(a + ' ' + poolOne.symbol.code().to_string()).amount

           const p1 = poolOne.amount
           const p2 = poolTwo.amount

           if (input === 'pool1') {
             const r = number_to_asset(0, poolTwo.symbol)
             r.set_amount(Math.abs(computeForward(a.multiply(-1), p2, p1.plus(a), pairData.fee)))

             toAmount = r.to_string().split(' ')[0]
           } else {
             const result = computeForward(
               a.multiply(-1),
               pairData.pool1.amount,
               pairData.pool2.amount + a,
               pairData.fee
             ).abs()

             const r = number_to_asset(0, pairData.pool1.symbol)
             r.set_amount(result)

             toAmount = r.to_string().split(' ')[0]
           }
           let data = {}
           data.amount = parseFloat(toAmount)
           data.fromChains = ['eos']
           data.toChains = ['eos']
           data.isCrosschain = false
           data.limitMaxDepositCoin = parseFloat(poolOne.amount)
           data.limitMinDepositCoin = 0
           data.pair_id = pairData.id
           data.pairData = pairData
           resolve({
             pair: data
           })
         })
       },
       godex () {
         return new Promise(async (resolve, reject) => {
           let data = {
             from: from.toUpperCase(),
             to: to.toUpperCase(),
             amount: amount
           }
           axios
             .post(self.base[self.currentExchange] + 'info', data)
             .then(async res => {
               data.minimum = parseFloat(res.data.min_amount)
               data.amount = res.data.amount
               data.fromAmount = res.data.amount
               data.fromChains = res.data.networks_from ? res.data.networks_from.map(o => o.network.toLowerCase()) : []
               data.toChains = res.data.networks_to ? res.data.networks_to.map(o => o.network.toLowerCase()) : []
               data.limitMaxDepositCoin = res.data.max_amount
               data.isCrosschain = true
               data.limitMinDepositCoin = res.data.min_amount
               data.minerFee = res.data.fee
               data.rate = res.data.rate
               resolve({
                 pair: data
               })
             })
             .catch(e => {
               reject({
                 error: e
               })
             })
         })
       }
     }
     return list[this.currentExchange]()
   }
  getVtxEquivalent = () => {
    axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=volentix-vtx&vs_currencies=eth,eos')
      .then(res => {
        if (res && res.data && res.data['volentix-vtx']) { this.vtxEquiv = res.data['volentix-vtx'] }
      })
  }
  renDepositListener (mint) {
    mint.on('deposit', async (deposit) => {
      // Details of the deposit are available from `deposit.depositDetails`.

      const hash = deposit.txHash()
      const depositLog = (msg) => console.log(`[${hash.slice(0, 8)}][${deposit.status}] ${msg}`)

      await deposit.confirmed()
        .on('target', (confs, target) => depositLog(`${confs}/${target} confirmations`))
        .on('confirmation', (confs, target) => depositLog(`${confs}/${target} confirmations`))

      await deposit.signed()
        // Print RenVM status - "pending", "confirming" or "done".
        .on('status', (status) => depositLog(`Status: ${status}`))

      await deposit.mint()
        // Print Ethereum transaction hash.
        .on('transactionHash', (txHash) => depositLog(`Mint tx: ${txHash}`))
        .on('tx_details', (tx_details) => {
          console.log(tx_details, 'tx_details')
        })
    })
  }

  createTransaction = (from, to, amount, toAddress, fromChain, toChain, refundAddress, fromAddress) => {
    const self = this

    let list = {
      oneinch () {
        return new Promise(async (resolve, reject) => {
          let web3 = Lib.getWeb3Instance(fromChain)
          let evmData = Lib.evms.find(o => o.chain === fromChain)
          let pair = await self.getOneInchCoinData(from, to, evmData.network_id)
          if (!pair.fromData || !pair.toData) {
            reject('Data not available')
            return
          }
          let params = {
            fromTokenAddress: pair.fromData.address,
            toTokenAddress: pair.toData.address,
            amount: Math.round(amount * 10 ** pair.fromData.decimals),
            slippage: 2,
            fromAddress: fromAddress,
            disableEstimate: true,
            referrerAddress: '0x91B9dAda77e2eb76d6F36B96F448c1F9A066BE74',
            fee: store.state.settings.globalSettings ? store.state.settings.globalSettings.fee1inch : 0.75
          }
          let swapRequestUrl = _1inch + '/v3.0/' + evmData.network_id + '/swap?' + new URLSearchParams(params).toString()
          axios.get(swapRequestUrl)
            .then(async function (result) {
              let nonce = await web3.eth.getTransactionCount(fromAddress, 'latest')
              let txObject = result.data.tx
              txObject.nonce = nonce
              txObject.value = web3.utils.toHex(txObject.value)
              txObject.chainId = evmData.network_id
              resolve(txObject)
            })
        })
      },
      renbridge () {
        return new Promise(async (resolve, reject) => {
          let mintFromChain = {
            async btc () {
              let minToChain = {
                async eth () {
                  const ren = new RenJS()
                  // await window.ethereum.enable()
                  let web3 = Lib.getWeb3Instance('eth')

                  // if (account) return

                  web3.eth.defaultAccount = toAddress

                  let mint = await ren.lockAndMint({
                    asset: from.toUpperCase(),
                    from: Bitcoin(),
                    to: Ethereum(web3.currentProvider)
                      .Address(toAddress)
                  })

                  return mint
                }
              }
              const mint = await minToChain[toChain]()

              //   self.renDepositListener(mint)

              let tx = {
                mintObject: mint,
                status: 'wait',
                from: from,
                to: to,
                depositQuantity: amount,
                depositAddress: mint.gatewayAddress,
                destinationAddress: toAddress,
                order_id: parseInt(Date.now() + Math.random())
              }

              resolve({
                tx: tx
              })
            }
          }
          mintFromChain[fromChain]()
        })
      },
      godex () {
        return new Promise(async (resolve, reject) => {
          let data = {
            coin_from: from.toUpperCase(),
            coin_to: to.toUpperCase(),
            deposit_amount: amount,
            withdrawal: toAddress,
            return: refundAddress,
            refundAddress: refundAddress,
            coin_from_network: fromChain.toUpperCase(),
            coin_to_network: toChain.toUpperCase(),
            withdrawal_extra_id: null
          }
          axios
            .post(self.base[self.currentExchange] + 'transaction', data)
            .then(res => {
              let tx = {
                status: res.data.status,
                from: res.data.coin_from,
                to: res.data.coin_to,
                depositQuantity: res.data.deposit_amount,
                destinationAddress: res.data.withdrawal,
                destinationQuantity: res.data.withdrawal_amount,
                depositAddress: res.data.deposit,
                memo: res.data.deposit_extra_id,
                rate: res.data.rate,
                fee: res.data.fee,
                fetchStatus: true,
                order_id: res.data.transaction_id
              }
              resolve({
                tx: tx
              })
            })
            .catch(e => {
              reject({
                error: e
              })
            })
        })
      }
    }
    return list[ this.currentExchange ]()
  }
}
window.CrosschainDex = new Crosschaindex()
export default window.CrosschainDex
