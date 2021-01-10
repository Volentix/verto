
export const updateTokens = (state, updatedtokens) => {
  updatedtokens = updatedtokens.map(o => {
    if (o.type === 'eth') {
      o.total = parseFloat(updatedtokens.filter(f => f.key === o.key).map(v => isNaN(v.usd) ? 0 : v.usd).reduce((a, b) => a + b, 0))
    }
    return o
  })
  updatedtokens = updatedtokens.map(o => {
    if (o.type === 'eos') {
      console.log(updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name), o.name, updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name).map(b => b.usd), parseFloat(updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name).map(o => isNaN(o.usd) ? 0 : o.usd).reduce((a, b) => a + b, 0)), 'total')
      o.total = parseFloat(updatedtokens.filter(f => f.chain === 'eos' && f.name === o.name).map(v => isNaN(v.usd) ? 0 : v.usd).reduce((a, b) => a + b, 0))
    }
    if (typeof window !== 'undefined') {
      var url = new URL(window.location.href)
      var connect = url.searchParams.get('url')

      if (connect) {
        let temp = updatedtokens
        let accounts = temp.map((token) => {
          delete token.privateKey
          delete token.privateKeyEncrypted
          delete token.origin

          return token
        })

        window.top.postMessage({ accounts: accounts }, '*')
      }
    }
    return o
  })
  // state.portfolioTotal = updatedtokens.map(o => isNaN(o.usd) ? 0 : o.usd).reduce((a, c) => a + c)
  state.tokens = updatedtokens
}
export const setLoadingState = (state, value) => {
  state.loaded.eos = value.hasOwnProperty('eos') ? value.eos : state.loaded.eos
  state.loaded.eth = value.hasOwnProperty('eth') ? value.eth : state.loaded.eth
}
export const updatePortfolioTotal = (state, updatedportfolioTotal) => {
  state.portfolioTotal = updatedportfolioTotal
}
