
export const logout = state => {
  Object.assign(state, {
    loggedIn: false,
    method: '',
    identity: {
      voted_i: [],
      voted_for: [],
      availble_for_retrieval: '0.0000 VTX'
    },
    status: {
      accountAdded: false,
      accountRegistered: false,
      accountRun: false,
      ram: '',
      cpu: '',
      net: ''
    },
    registered_nodes: [],
    daily_reward_next_calculation: 0
  })
}
export const setPrivateKey = (state, privateKey) => {
  state.identity.privateKey = privateKey
}
export const setPublicKey = (state, publicKey) => {
  state.identity.publicKey = publicKey
}
export const setAccountName = (state, accountName) => {
  state.identity.accountName = accountName
}
export const setLoggedIn = state => {
  state.loggedIn = true
}
export const setMethod = (state, method) => {
  state.method = method
}
export const setBalance = (state, balance) => {
  state.identity.balance = balance
}
export const setRank = (state, rank) => {
  state.identity.rank = rank
}
export const setTotalRanks = (state, total) => {
  state.identity.totalRanks = total
}
export const setDailyRewardNextCalculation = (state, timestamp) => {
  state.daily_reward_next_calculation = timestamp
}
export const setEarned = (state, earned) => {
  state.identity.earned = earned
}
export const setAvailbleForRetrieval = (state, data) => {
  state.identity.availble_for_retrieval = data
}
export const setVotedI = (state, data) => {
  state.identity.voted_i = data
}
export const setVotedFor = (state, data) => {
  state.identity.voted_for = data
}
export const setAccountAdded = (state, data) => {
  state.status.accountAdded = data
}
export const setAccountRegistered = (state, data) => {
  state.status.accountRegistered = data
}
export const setAccountRun = (state, data) => {
  state.status.accountRun = data
}
export const setAccountResources = (state, data) => {
  state.status.ram = data.ram
  state.status.cpu = data.cpu
  state.status.net = data.net
}
export const setRegisteredNodes = (state, data) => {
  state.registered_nodes = data
}
