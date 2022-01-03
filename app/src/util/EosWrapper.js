const { Api, JsonRpc } = require('eosjs') // { Api, JsonRpc, RpcError }
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
// const { TextEncoder, TextDecoder } = require('text-encoding')
import { userError } from '@/util/errorHandler'
import { userResult } from '@/util/resultHandler'
import store from '@/store'
import axios from 'axios'
import { Notify } from 'quasar'

// const floatRegex = /[^\d.-]/g
const ecc = require('eosjs-ecc')

class EosWrapper {
  constructor () {
    // console.log(process.env[store.state.settings.network].EOS_HISTORYAPI, 'process.env[store.state.settings.network].EOS_HISTORYAPI')
    this.rpc = new JsonRpc(process.env[store.state.settings.network].EOS_HISTORYAPI)
  }

  isPrivKeyValid (privKey) {
    const bool = ecc.isValidPrivate(privKey) === true
    return bool
  }
  isPubKeyValid (pubKey) {
    const bool = ecc.isValidPublic(pubKey) === true
    return bool
  }
  fromPrivToPub (wif) {
    const pubKey = ecc.privateToPublic(wif)
    return pubKey
  }

  //  ---- ACCOUNTS ----
  async getAccountNamesFromPubKeyP (pubKey) {
    let url = 'https://eos.greymass.com/v1/chain/get_accounts_by_authorizers'
    let names = []
    let data = await axios.post(url, { accounts: [], keys: [pubKey] })
    if (data.data && data.data.accounts) names = data.data.accounts

    return { account_names: names.map(o => o.account_name) }
  }
  async freePowerUp (name) {
    let lastpwUp = localStorage.getItem('freepwup_' + name)

    if (lastpwUp) {
      let today = new Date()
      lastpwUp = new Date(lastpwUp * 1000)
      lastpwUp.setHours(lastpwUp.getHours() + 12)
      if (lastpwUp.getTime() > today.getTime()) return
    }

    let response = await axios.get('https://api.eospowerup.io/freePowerup/' + name)
    if (response && response.data && response.data.result) {
      localStorage.setItem('freepwup_' + name, Math.round(+new Date() / 1000))
      Notify.create({
        progress: true,
        message: name + ' has been powered up for free',
        caption: 'Valid for 12 hours',
        color: 'deep-purple-14',
        position: 'bottom-left',
        avatar: 'https://verto.volentix.io/statics/icons/vtx-logo-1024x1024.png'
      })
    }
  }
  async getActions (accountName) {
    const actions = (await this.rpc.getActions(accountName)).actions
    return actions
  }

  async getAccount (accountName) {
    let account = (await this.rpc.get_account(accountName))
    // console.log('account', account)
    return account
  }

  // If you look at the result value, you can see an array in the form of a string.
  // This is because there could be tokens with many different symbols in the account
  async getCurrencyBalanceP (account, code = 'eosio.token', symbol = 'eos') {
    let balance = await this.rpc.get_currency_balance(code, account, symbol)
    return balance
  }

  async isAccount (account) {
    const result = await this.rpc.is_account(
      account
    )
    return result
  }

  async getTable (code, scope, table, lowerBound, limit) {
    const result = await this.rpc.get_table_rows({
      code,
      scope,
      table,
      lower_bound: lowerBound,
      limit,
      json: true
    })

    // console.log('getTable res', result)
    return result.rows
  }

  async transferToken (contractName = 'eosio.token', from, to, quantity, memo = '', keyProvider) {
    const actions = [{
      account: contractName,
      name: 'transfer',
      authorization: [{
        actor: from,
        permission: 'active'
      }
      ],
      data: {
        from,
        to,
        quantity,
        memo
      }
    }]

    const tr = await this.transact({ actions }, { keyProvider })
    return tr
  }

  async transact (actions, keyProvider, expireSeconds = 30) {
    const signatureProvider = new JsSignatureProvider([keyProvider.keyProvider])

    let api = new Api({
      rpc: this.rpc,
      signatureProvider,
      // chainId: process.env[store.state.settings.network].CHAIN_ID,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })

    const result = await api.transact(
      actions,
      {
        blocksBehind: 3,
        expireSeconds: expireSeconds
      }
    )

    return result
  }
  async transaction (contractAccount, action, authActor, data, successMessage, errorMessage, api) {
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: contractAccount,
              name: action,
              authorization: [
                {
                  actor: authActor,
                  permission: 'active'
                }
              ],
              data: data
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
      userResult(successMessage, result)
    } catch (error) {
      userError(error, errorMessage)
      if (error.message.includes('unable to complete by deadline')) {
        userError('Try at a later time when EOSIO network is not as busy or get more CPU.', 'Vote action')
      }
    }
  }
}

// Import style
export default EosWrapper
