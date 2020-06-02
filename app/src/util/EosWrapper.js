const { Api, JsonRpc } = require('eosjs') // { Api, JsonRpc, RpcError }
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
// const { TextEncoder, TextDecoder } = require('text-encoding')
import store from '@/store'

// const floatRegex = /[^\d.-]/g
const ecc = require('eosjs-ecc')

class EosWrapper {
  constructor () {
    this.rpc = new JsonRpc(process.env[store.state.settings.network].EOS_HISTORYAPI)
  }

  isPrivKeyValid (privKey) {
    const bool = ecc.isValidPrivate(privKey) === true
    return bool
  }

  fromPrivToPub (wif) {
    const pubKey = ecc.privateToPublic(wif)
    return pubKey
  }

  //  ---- ACCOUNTS ----
  async getAccountNamesFromPubKeyP (pubKey) {
    let names = await this.rpc.history_get_key_accounts(pubKey)
    return names
  }

  async getActions (accountName) {
    const actions = (await this.rpc.getActions(accountName)).actions
    return actions
  }

  async getAccount (accountName) {
    let account = (await this.rpc.get_account(accountName))
    console.log('account', account)
    return account
  }

  // If you look at the result value, you can see an array in the form of a string.
  // This is because there could be tokens with many different symbols in the account
  async getCurrencyBalanceP (account, code = 'eosio.token', symbol = 'VTX') {
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

    console.log('getTable res', result)
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

    console.log('actions', actions)
    const tr = await this.transact({ actions }, { keyProvider })
    return tr
  }

  async transact (actions, keyProvider) {
    const signatureProvider = new JsSignatureProvider([keyProvider.keyProvider])

    let api = new Api({
      rpc: this.rpc,
      signatureProvider,
      chainId: process.env[store.state.settings.network].CHAIN_ID,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })

    const result = await api.transact(
      actions,
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    )

    console.log('transact', result)
    return result
  }
}

// Import style
export default EosWrapper
