import Vue from 'vue'
import { Dialog } from 'quasar'
import { userError } from '@/util/errorHandler'
import { userResult } from '@/util/resultHandler'
// import * as utils from '@/util/utils'
import {
  EosRPC
} from '@/util/EosInterac'
import store from '@/store'
import router from '@/router'

// import path from 'path'
// import { config } from 'bluebird-lst'
// import ScatterJS from '@scatterjs/core'
// import ScatterEOS from '@scatterjs/eosjs2'
// import { Api, JsonRpc } from 'eosjs'
// var fetch = require('node-fetch')

// const Store = require('electron-store')
// const { app, dialog } = require('electron').remote
// const fs = require('fs')
// const configFile = path.join(app.getPath('userData'), '/User/config.json')
// const schema = {
//   eos_endpoint: {
//     type: 'string',
//     format: 'url',
//     default: 'https://eos.greymass.com:443'
//   },
//   nodes_api: {
//     type: 'string',
//     format: 'url',
//     default: 'http://140.82.56.143:8000'
//   },
//   node_readme: {
//     type: 'string',
//     format: 'url'
//   }
// }
// const configStore = new Store({ schema, name: 'vdexnode' })
// const exampleNet = {
//   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
//   rpcEndpoints: [{
//     protocol: 'http',
//     host: 'localhost',
//     port: 8888
//   }]
// }
let votingContract = 'volentixvote' // 'vdexdposvote'
let distributionContract = 'vistribution' // 'vtxdistribut'
class VDexNodeConfigManager {
  currentConfig
  currentWallet

  constructor () {
    this.rpcWrapper = new EosRPC(process.env[store.state.settings.network].EOS_HISTORYAPI)
    // this.rpc = new JsonRpc('https:////api.eosio.cr', { fetch })
  }

  // async function login () {
  // privateKey = '5HtQsXDrUMtH8XEU6omNiUKZfiTM9YjG8Geiv4Qj78mYXD8mpwH'
  // publicKey = 'EOS6PdTCWZgWMh4s5EDxYK3aL6DPC2ksDusTQpxE38QVmUzYLjLt9'// rpc.privateToPublic(privateKey)
  // accountName = 'volentixtst2'
  // try {
  //   router.push('/')
  //   var rpc = new EosRPC()
  //   Vue.prototype.$rpc = rpc
  // } catch (error) {
  //   userError(error, 'Login action: instance of EosRPC')
  //   throw error
  // }
  // try {
  //   eosApi = new EosAPI(rpc, identity.privateKey)
  // } catch (error) {
  //   userError(error, 'Login action: instance of EosAPI')
  //   throw error
  // }
  // try {
  //   // publicKey = 'EOS6PdTCWZgWMh4s5EDxYK3aL6DPC2ksDusTQpxE38QVmUzYLjLt9'// rpc.privateToPublic(privateKey)
  // } catch (error) {
  //   userError(error, 'Login action: get public key')
  //   throw error
  // }
  // try {
  // let accounts = await rpc.getAccounts(publicKey)
  // if (accounts.account_names.length === 1) {
  //   // var accountName = accounts.account_names[0] ? accounts.account_names[0] : ''
  //   if (accountName) auth(privateKey, publicKey, accountName)
  //   else throw Error('There is no account for this key')
  // } else if (accounts.account_names.length > 1) {
  //   chooseAccount(accounts.account_names, result => {
  //     var accountName = result
  //     if (accountName) auth(privateKey, publicKey, accountName)
  //     else throw Error('There is no account for this key')
  //   })
  // } else {
  //   userError('Oops, no account found for this key. You have to create one.', 'Login action: Get accounts ')
  // }
  // } catch (error) {
  //   userError(error, 'Login action: get account name')
  //   throw error
  // }
  // }

  hasConfig () {
    // fs.access(configStore.path, error => {
    //   if (error) {
    //     configStore.set('eos_endpoint', process.env.EOS_ENDPOINT)
    //     configStore.set('node_api', process.env.NODES_API)
    //     configStore.set('node_readme', process.env.README)
    //     Vue.prototype.$configStore = configStore
    //   } else {
    //     Vue.prototype.$configStore = configStore
    //   }
    // })
  }
  getEndpoint (endpoint) {
    const schema = {
      eos_endpoint: {
        type: 'string',
        format: 'url',
        default: process.env[store.state.settings.network].EOS_HISTORYAPI // 'https://eos.greymass.com:443'
      },
      nodes_api: {
        type: 'string',
        format: 'url',
        default: 'http://199.247.30.155:8000'
      },
      jungle_api: {
        default: 'https://jungle2.cryptolions.io:443'
      },
      node_readme: {
        type: 'string',
        format: 'url'
      }
    }

    return schema[endpoint].default
  }
  logout () {
    store.dispatch('vdexnode/logout').then(() => {
      router.push('/login')
    })
  }
  async accountRegistered (accountName) {
    try {
      let isRegistered = false
      const result = await Vue.prototype.$rpc.getTable(votingContract, votingContract, 'producers')
      let nodeStats = result.find(row => row.owner === accountName)
      if (nodeStats) {
        store.commit('vdexnode/setAccountRegistered', true)
        isRegistered = true
      } else {
        userResult('Account: ' + accountName + ' is not registered to the voting contract. Please Register it.')
        store.commit('vdexnode/setAccountRegistered', false)
      }
      return isRegistered
    } catch (error) {
      userError(error, 'Account register status check')
      throw error
    }
  }

  async accountRun (accountName) {
    try {
      const result = await Vue.prototype.$rpc.getTable(votingContract, votingContract, 'producers')
      let nodeStats = result.find(row => row.owner === accountName)
      if (nodeStats) {
        store.commit('vdexnode/setAccountRun', true)
      } else {
        userResult(
          'Account: ' +
          accountName +
          ' is not initialized for getting the reward in the voting contract. Please Init it by clicking the Run button.'
        )
        store.commit('vdexnode/setAccountRun', false)
      }
    } catch (error) {
      userError(error, 'Account run status check')
      throw error
    }
  }

  async getRewardHistoryData () {
    try {
      const result = await Vue.prototype.$rpc.getTable(distributionContract, distributionContract, 'rewardhistor')
      let dailyRewardData = result.find(row => row.reward_id === 1)
      let dailyRewardLastCalculation = dailyRewardData.last_timestamp
      const rewardRules = await Vue.prototype.$rpc.getTable(distributionContract, distributionContract, 'rewards')
      let dailyRewardRules = rewardRules.find(row => row.reward_id === 1)
      let dailyRewardPeriod = dailyRewardRules.reward_period
      let dailyRewardNextCalculation = dailyRewardLastCalculation && dailyRewardPeriod ? dailyRewardLastCalculation + dailyRewardPeriod : 0
      store.commit('vdexnode/setDailyRewardNextCalculation', dailyRewardNextCalculation)
    } catch (error) {
      userError(error, 'Get last reward calculation timestaml')
    }
  }

  async getAvailbleForRetrieval (accountName) {
    try {
      const result = await Vue.prototype.$rpc.getTable(distributionContract, accountName, 'nodereward')
      let amount = result.map(item => parseFloat(item.amount)).reduce((a, b) => a + b, 0).toFixed(4)
      store.commit('vdexnode/setAvailbleForRetrieval', `${amount} VTX`)
    } catch (error) {
      userError(error, 'Get availble for retrieval')
    }
  }

  async getUserRank (accountName) {
    try {
      const result = await Vue.prototype.$rpc.getTable(votingContract, votingContract, 'producers')
      let voteStats = result.find(row => row.owner === accountName)
      let ranks = []
      if (voteStats) {
        result.forEach(item => {
          let owner = item.owner
          let votes = item.total_votes
          ranks.push({ owner, votes })
        })
        ranks.sort((a, b) => b.votes - a.votes)
        store.commit('vdexnode/setRank', ranks.map(e => e.owner).indexOf(accountName) + 1)
        store.commit('vdexnode/setTotalRanks', ranks.length)
      } else {
        store.commit('vdexnode/setRank', 0)
        store.commit('vdexnode/setTotalRanks', 0)
      }
      return ranks.length
    } catch (error) {
      userError(error, 'Get rank action')
    }
  }

  async getUserBalance (accountName, currentUser = false, precision = 4, includeToken = false) {
    try {
      let result = await this.rpcWrapper.getVTXBalance(accountName)
      let balance = parseFloat(result.balance).toFixed(precision)

      if (includeToken) {
        balance = balance + ' ' + result.token
      }
      if (currentUser) { store.commit('vdexnode/setBalance', balance) }

      return balance
    } catch (error) {
      userError(error, 'Get balance action failed for user ' + accountName)
    }
  }

  async getUserResources (accountName) {
    try {
      const result = await this.rpcWrapper.getResources(accountName)
      store.commit('vdexnode/setAccountResources', {
        ram: result.ram ? result.ram : 'unknown',
        cpu: result.cpu ? result.cpu : 'unknown',
        net: result.net ? result.net : 'unknown'
      })
    } catch (error) {
      userError(error, 'Get account resources action')
    }
  }

  async getUserVoted (accountName) {
    try {
      const result = await Vue.prototype.$rpc.getTable(votingContract, votingContract, 'voters')
      let nodeStats = result.find(row => row.owner === accountName)
      if (nodeStats) {
        store.commit('vdexnode/setVotedI', nodeStats.producers)
      } else {
        store.commit('vdexnode/setVotedI', [])
      }
      var votedFor = []
      result.forEach(function (item) {
        if (item.producers.includes(accountName)) {
          votedFor.push(item.owner)
        }
      })
      store.commit('vdexnode/setVotedFor', votedFor)
      return nodeStats.length
    } catch (error) {
      userError(error, 'Get voted lists action')
    }
  }

  async getRegisteredNodes () {
    const result = await Vue.prototype.$rpc.getTable(votingContract, votingContract, 'producers')
    var registeredNodes = []
    result.forEach(function (item) {
      registeredNodes.push(item.owner)
    })
    if (registeredNodes.length) {
      store.commit('vdexnode/setRegisteredNodes', registeredNodes)
    } else {
      throw Error
    }
  }

  async addNode (accountName, eosApi) {
    await eosApi.transaction(
      distributionContract,
      'addnode',
      accountName,
      {
        account: accountName
      },
      'The account added successfully!',
      'Add the account action'
    )
  }

  async registerNode (accountName, options, eosApi) {
    var jobs = new Int32Array()
    options.forEach(element => {
    // cf https://github.com/Volentix/volentix_contracts/blob/216e81a4b916684bd361c6f6092f093dbce27a6d/vdexdposvote/vdexdposvote.hpp#L17
      if (element === 'vote') {
        jobs[0] = 1
      } else if (element === 'btc') {
        jobs[1] = 2
      }
    })

    let actions = [{
      account: votingContract,
      name: 'regproducer',
      authorization: [
        {
          actor: accountName,
          permission: 'active'
        }
      ],
      data: {
        producer: accountName,
        producer_name: accountName,
        url: 'test 1',
        key: 'EOS8UrDjUkeVxfUzUS1hZQtmaGkdWbGLExyzKF6569kRMR5TzSnQT',
        node_id: Math.random(),
        job_ids: [1, 2]
      }
    }, {
      account: distributionContract,
      name: 'initup',
      authorization: [
        {
          actor: accountName,
          permission: 'active'
        }
      ],
      data: {
        account: accountName
      }
    }]
    return eosApi.multiActionsTransaction(
      actions,
      'The account registered successfully!',
      'Register the account action'
    )
  }

  async retreiveReward (accountName, eosApi) {
    await eosApi.transaction(
      distributionContract,
      'uptime',
      accountName,
      { account: accountName,
        node_id: accountName,
        memo: ''
      },
      "Transaction 'Retreive reward' executed successfully!",
      'Retreive reward action'
    )
    await this.getAvailbleForRetrieval()
  }

  async vote (votingList, accountName, eosApi) {
    let nodesToVote = []
    for (var i = 0; i < votingList.length; i++) {
      nodesToVote.push(votingList[i].account)
    }
    if (nodesToVote.length) {
      eosApi.transaction(
        votingContract,
        'voteproducer',
        accountName,
        {
          voter_name: accountName,
          producers: nodesToVote
        },
        'Voted successfully!',
        'Vote action'
      )
    } else {
      userError('Oops, I can not build the voting object', 'Vote action')
    }
  }

  auth (privateKey, publicKey, accountName) {
    store
      .dispatch('login', { privateKey, publicKey, accountName })
      .then(() => {
        router.push('/')
      })
      .catch(error => {
        userError(error, 'Auth action: Saving')
      })
  }

  chooseAccount (accounts, callback) {
    const acc = []
    accounts.forEach(account => {
      acc.push({ label: account, value: account })
    })
    Dialog.create({
      title: 'Choose account',
      dark: true,
      color: 'vgreen',
      message: 'Found more than one account for this key, please choose one',
      options: {
        type: 'radio',
        model: '',
        items: acc
      },
      cancel: true,
      persistent: true
    })
      .onOk(data => {
        if (data) callback(data)
        else userError('You have to choose an account to continue', 'Login action: Choosing account')
      })
      .onCancel(() => {})
      .onDismiss(() => {})
  }

  // export {
  //   configStore,
  //   hasConfig,
  //   logout,
  //   accountRegistered,
  //   accountRun,
  //   getUserRank,
  //   getUserBalance,
  //   getUserResources,
  //   getUserVoted,
  //   getRegisteredNodes,
  //   addNode,
  //   registerNode,
  //   retreiveReward,
  //   vote,
  //   login,
  //   getRewardHistoryData,
  //   getAvailbleForRetrieval
  // }
}

export default VDexNodeConfigManager
