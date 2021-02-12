import axios from 'axios'
import Web3 from 'web3'
let api = {}
let web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'))
class Bridge {
  constructor () {
    this.payer = `vertofreecpu`
    // this.eThReceivingAccount = `0x2C13f9722540a3b0a75Cc641005F4954CC7E8771`
    this.eThToVTXPrice = false
    this.transactions = []
    this.sendErrors = []
    this.successfullTransactions = []
  }
  sendVtxToAll (transactions) {
    this.sendErrors = []
    this.successfullTransactions = []
    let actions = transactions.map(async (tx) => {
      this.sendVtx(tx)
    })
    return Promise.all(actions)
  }
  async sendVtx (data) {
    try {
      let actions = [{
        account: this.payer,
        name: 'transfer',
        authorization: [{
          actor: this.payer,
          permission: `active`
        }],
        data: data
      }]

      let response = await api.transact(
        actions,
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
      let succcess = {
        response: response,
        tx: data,
        success: true
      }
      this.successfullTransactions.push(succcess)

      return succcess
    } catch (err) {
      let error = {
        success: false,
        tx: data,
        error: err.message
      }
      this.sendErrors.push(error)
      return error
    }
  }
  removeDuplicateTransactions () {
    let duplicates = []

    return history.map((el) => {
      let search = history.filter(o => el.transID === o.transID)
      let value = search[0]

      if (search.length !== 1 && !duplicates.includes(el.transID)) {
        duplicates.push(el.transID)
      } else if (search.length !== 1) {
        value = null
      }
      return value
    }).filter(o => o != null)
  }

  async eThToVTX (amount) {
    let vtxAmount = false

    if (!this.eThToVTXPrice) {
      let response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=volentix-vtx&vs_currencies=eth')
      if (response.data && response.data['volentix-vtx'] && response.data['volentix-vtx'].eth) {
        this.eThToVTXPrice = parseFloat(response.data['volentix-vtx'].eth)
      }
    }

    if (this.eThToVTXPrice) {
      vtxAmount = amount / this.eThToVTXPrice
    }

    return vtxAmount
  }

  async getLatestTransactions (hash) {
    this.transactions = []

    let txData = await web3.eth.getTransactionReceipt(hash)
    let response = await axios.get('https://api.etherscan.io/api?module=account&action=txlist&address=' + this.eThReceivingAccount + '&startblock=' + txData.blockNumber + '&endblock=99999999&sort=asc&apikey=YBABRIF5FBIVNZZK3R8USGI94444WQHHBN')
    if (response) {
      console.log(response.data, 'response.data')
      if (response && response.data && response.data.result) {
        console.log(response.data, ' response.data')
        let actions = response.data.result.map(async (tx) => {
          let transaction = {}
          if (tx.from !== this.eThReceivingAccount && tx.input !== '0x' && !parseInt(tx.isError) && parseInt(tx.txreceipt_status)) {
            try {
              let data = web3.utils.hexToUtf8(tx.input)
              if (!data) {
                transaction.to = data
                transaction.from = this.payer
                transaction.memo = 'ethtovtx,' + tx.hash
                let vtxAmount = await this.eThToVTX(web3.utils.fromWei(tx.value, 'ether'))
                if (vtxAmount) {
                  transaction.amount = vtxAmount.toFixed(8) + ' VTX'
                  this.transactions.push(transaction)
                }
                console.log(vtxAmount, 'vtxAmount', transaction, tx.input, tx)
              }
            } catch (err) {
              return {
                error: err.message
              }
            }
          }
        })
        return Promise.all(actions)
      }
    }
  }

  getUnpaidTransactions (history) {
    let recentOutgoingTransaction = history.find(o => o.from === this.payer && o.typeTran === 'transfer' && o.memo.includes('tovtx'))
    if (recentOutgoingTransaction) {
      let lastETHTXHash = recentOutgoingTransaction.memo.split(',')[0]
      this.getLatestTransactions(lastETHTXHash)
    }
  }
  async getHistory (key) {
    let actions = []
    await axios.post('https://eos.greymass.com/v1/history/get_actions', {
      'account_name': key
    })
      .then(function (result) {
        if (result.length !== 0) {
          result.data.actions.reverse().map(a => {
            // console.log('split', a.action_trace.act.name === 'transfer' ? a.action_trace.act.data.quantity.toString().split(' ')[1].toLowerCase() : 'not transfer')
            if (
              a.action_trace.act.name === 'transfer' &&
                a.action_trace.receiver === key &&
                a.action_trace.act.data.quantity.toString().split(' ')[1].toLowerCase() === 'vtx') {
              // console.log('walletlib history actions', a)

              let amount = ''
              switch (a.action_trace.act.name) {
                case 'transfer':
                  amount = a.action_trace.act.data.to !== key ? '-' + a.action_trace.act.data.quantity : a.action_trace.act.data.quantity
                  break
                case 'deposit':
                  amount = a.action_trace.act.data.to !== key ? '-' + a.action_trace.act.data.amount : a.action_trace.act.data.amount
                  break
                case 'rentcpu':
                  amount = a.action_trace.act.data.to !== key ? '-' + a.action_trace.act.data.loan_payment : a.action_trace.act.data.loan_payment
                  break
              }

              actions.push({
                transID: a.action_trace.trx_id,
                from: a.action_trace.act.data.from,
                to: a.action_trace.act.data.to,
                memo: a.action_trace.act.data.memo,
                typeTran: a.action_trace.act.name,
                desc: a.action_trace.act.data.memo ? a.action_trace.act.data.memo.substring(0, 20) : '',
                amount
              })
            }
          })
          return actions
        }
      })

    // Promise.all(balProm)
    return {
      history: actions
    }
  }

  async getTransactions () {
    let data = (await this.getHistory(this.payer))
    if (data && data.hasOwnProperty('history')) {
      let history = data.history
      history = this.removeDuplicateTransactions(history)
      this.getUnpaidTransactions(history)
    }
  }
}

window.Bridge = new Bridge()

/*

    //From one transaction
    await Bridge.getLatestTransactions('0xba5d0ebbcb85b77f6cbfbe2426ea0f63fef07424dbdb3f0ebb1f91e438528965')
    await Bridge.sendVtxToAll(Bridge.transactions)

    //From one transaction

 */

export default window.Bridge
