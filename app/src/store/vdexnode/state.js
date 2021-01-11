export default function () {
  return {
    loggedIn: false,
    method: '',
    identity: {
      voted_i: [],
      voted_for: [],
      availble_for_retrieval: '0.0000 VTX',
      accountName: ''
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
  }
}
