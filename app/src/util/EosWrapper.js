const { JsonRpc } = require('eosjs') // { Api, JsonRpc, RpcError }
// const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
import store from '@/store'

// const floatRegex = /[^\d.-]/g
const ecc = require('elliptic')

class EosWrapper {
  constructor () {
    this.eos = new JsonRpc(process.env[store.state.settings.network].EOS_HISTORYAPI, { fetch })
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
  getAccountNamesFromPubKeyP (pubKey) {
    /* eslint-disable no-new */
    return new Promise((resolve, reject) => {
      this.eos.get_key_accounts(pubKey, (error, result) => {
        if (error) reject(error)
        resolve(result)
      // array of account names, can be multiples
      // output example: { account_names: [ 'itamnetwork1', ... ] }
      })
    })
  }

  async getActions (accountName) {
    const actions = (await this.eos.getActions(accountName)).actions
    return actions
  }

  async getAccount (accountName) {
    let account = (await this.eos.get_account(accountName))
    return account
  }

  // If you look at the result value, you can see an array in the form of a string.
  // This is because there could be tokens with many different symbols in the account
  getCurrencyBalanceP (accountName, contractName = 'eosio.token', token = 'VTX') {
    return new Promise((resolve, reject) => {
      this.eos.get_currency_balance(contractName, accountName, token, (error, result) => {
        if (error) reject(error)
        resolve(result)
      })
    })
  }

  //  ---- TRANSACTIONS ----
  // https://eosio.stackexchange.com/questions/3587/how-to-transfer-eos-token-using-scatter-js-or-eos-js
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
    const tr = await this.eos.transaction({ actions }, { keyProvider })
    return tr
  }

  async transact (actions, keyProvider) {
    const result = await this.eos.transaction(
      actions,
      keyProvider
    )
    return result
  }

  async isAccount (account) {
    const result = await this.eos.is_account(
      account
    )
    return result
  }

  async getTable (code, scope, table, lowerBound, limit) {
    const result = await this.eos.get_table_rows({
      code,
      scope,
      table,
      lower_bound: lowerBound,
      limit,
      json: true
    })
    return result.rows
  }
}

// Import style
export default EosWrapper
