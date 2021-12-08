import store from '@/store'

const removePrivateData = data => {
  return JSON.parse(JSON.stringify(data)).map(o => {
    o.privateKeyEncrypted = null
    delete o.privateKeyEncrypted
    o.privateKey = null
    delete o.privateKey
    return o
  })
}
// Create index for Easy Access
const getWalletIndex = wallet => {
  let index =
    wallet.key +
    '-' +
    wallet.chain +
    (wallet.chain === 'eos' ? '-' + wallet.name : '')
  return index
}
export const updateTokens = (state, updatedtokens) => {
  if (!updatedtokens) {
    updatedtokens = []
  }
  updatedtokens = updatedtokens.map((o) => {
    o.index = getWalletIndex(o)
    return o
  })

  // Get all Evm chains main accounts and set the total

  let not_valuable = localStorage.getItem('not_valuable')
  not_valuable = not_valuable ? JSON.parse(not_valuable) : []
  updatedtokens = updatedtokens.map((o, index) => {
    o.index = getWalletIndex(o)

    if (not_valuable.length && not_valuable.find(z => z.chain === o.chain && z.type === o.type)) {
      o.tokenPrice = 0
      o.usd = 0
    }
    if (o.type === 'eos') {
      // console.log(updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name), o.name, updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name).map(b => b.usd), parseFloat(updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name).map(o => isNaN(o.usd) ? 0 : o.usd).reduce((a, b) => a + b, 0)), 'total')
      o.total = parseFloat(
        updatedtokens
          .filter(f => f.chain === 'eos' && f.name === o.name)
          .map(v => (isNaN(v.usd) ? 0 : +v.usd))
          .reduce((a, b) => a + b, 0)
      )
    }
    if (typeof window !== 'undefined') {
      var url = new URL(window.location.href)
      var connect = url.searchParams.get('url')

      if (connect) {
        let temp = updatedtokens
        let accounts = temp.map(token => {
          delete token.privateKey
          delete token.privateKeyEncrypted
          delete token.origin

          return token
        })

        window.parent.postMessage({
          accounts: accounts
        }, '*')
      }
    }

    return o
  })
  updatedtokens.filter((o, idx, all) => o.isEvm && all.findIndex(t => t.chain === o.chain && t.key === o.key && t.isEvm) === idx)
    .forEach(account => {
      let accountIndex = updatedtokens.findIndex(
        o => o.index === account.index
      )
      updatedtokens[accountIndex].total = parseFloat(
        updatedtokens
          .filter(f => f.key === account.key && f.chain === account.chain)
          .map(v => (isNaN(v.usd) ? 0 : +v.usd))
          .reduce((a, b) => a + b, 0)
      )
    })
  let total = updatedtokens
    .map(o => (isNaN(o.usd) ? 0 : +o.usd))
    .reduce((a, c) => a + c, 0)

  if (total && !isNaN(total)) state.portfolioTotal = total

  state.tokens = updatedtokens

  localStorage.setItem(
    'walletPublicDatav2',
    JSON.stringify(removePrivateData(updatedtokens))
  )

  store.dispatch('tokens/getTokensMarketsData', state.tokens)
}
export const setLoadingState = (state, value) => {
  state.loaded.eos = value.hasOwnProperty('eos') ? value.eos : state.loaded.eos
  state.loaded.eth = value.hasOwnProperty('eth') ? value.eth : state.loaded.eth
}
export const disconnectMetamask = state => {
  state.metamask.accounts = []
  state.metamask.tokens = []
}
export const updateHistory = (state, value) => {
  // let index = state.history.findIndex(o => o.month === value.month && o.day === value.day && o.year === value.year)
  // if(index < 0 )
  state.history.push(history)
}
export const setHistory = (state, history) => {
  state.history = history
}
export const updatePortfolioTotal = (state, updatedportfolioTotal) => {
  state.portfolioTotal = updatedportfolioTotal
}
export const updateExternalWalletAccounts = (state, data) => {
  state[data.wallet].accounts = data.accounts
}
export const updateExternalWalletTokens = (state, data) => {
  state[data.wallet].tokens = data.tokens
}
