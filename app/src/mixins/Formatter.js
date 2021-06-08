import HD from '@/util/hdwallet'
import Lib from '@/util/walletlib'

export default {
  methods: {
    getAccountLabel (w) {
      let label = w.key.substring(0, 6).toLowerCase() +
                '...' +
                w.key.substr(w.key.length - 5).toLowerCase()
      if (w.chain === 'eos') {
        label = w.name
      }
      return label
    },
    getRandomColor () {
      const randomNumber = (min, max) => {
        return Math.floor(Math.random() * max) + min
      }
      let colors = 'red pink purple deep-purple indigo blue cyan teal amber blue-grey'
      let arrayColors = colors.split(' ')
      return arrayColors[randomNumber(0, arrayColors.length - 1)] + '-' + randomNumber(1, 4)
    },
    nFormatter2 (num, digits) {
      if (isNaN(num)) {
        return 0
      }
      var si = [
        { value: 1, symbol: '' },
        { value: 1E3, symbol: 'k' },
        { value: 1E6, symbol: 'M' },
        { value: 1E9, symbol: 'G' },
        { value: 1E12, symbol: 'T' },
        { value: 1E15, symbol: 'P' },
        { value: 1E18, symbol: 'E' }
      ]
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
      var i
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
    },
    setChains () {
      /*
        Hierarchy chains[]->accounts[]->tokenList[]
        chains: [
          {
           ...
           chain:'eth',
           accounts:[
             {
               tokenList:[]
             }
           ]
           ....
          },
           ...
           chain:'eos',
           accounts:[
             {
               tokenList:[]
             }
           ]
           ....,
        ]
      */
      let chains = JSON.parse(JSON.stringify(this.$store.state.wallets.tokens.filter((v, i, a) => (v.type === v.chain || !['eos', 'eth'].includes(v.chain)) && a.findIndex(t => (t.chain === v.chain)) === i)))
        .map(o => {
          let accounts = this.$store.state.wallets.tokens.filter(f => f.chain === o.chain)
          o.chainTotal = accounts.reduce((a, b) => +a + (isNaN(b.usd) ? 0 : +b.usd), 0)
          let evmChain = Lib.evms.find(a => a.chain === o.chain)
          o.accounts = evmChain ? accounts.filter((a, i, c) => a.chain === o.chain && c.findIndex(t => (t.key.toLowerCase() === a.key.toLowerCase())) === i) : accounts.filter(a => a.type === o.chain)
          o.accounts = JSON.parse(JSON.stringify(o.accounts)).map(q => {
            q.tokenList = this.$store.state.wallets.tokens.filter((f, i, c) => f.chain === q.chain && ((f.isEvm && f.key.toLowerCase() === q.key.toLowerCase() && c.findIndex(t => t.isEvm && t.key.toLowerCase() === q.key.toLowerCase() && f.type === t.type) === i) || (!f.isEvm && q.chain === f.chain && f.name.toLowerCase() === q.name.toLowerCase())))
            q.color = this.getRandomColor()
            return q
          })
          o.count = o.accounts.length
          if (evmChain) o.icon = evmChain.icon
          let chain = HD.names.find(a => a.value === o.chain)
          o.evmChain = evmChain

          o.label = evmChain ? evmChain.name : (chain ? chain.label : o.chain.toUpperCase())

          return o
        })
      return chains.sort((a, b) => parseFloat(b.chainTotal) - parseFloat(a.chainTotal))
    },
    formatNumber (num, decimals = 4) {
      decimals = decimals < 0 ? 0 : decimals
      let value = parseFloat(num ? num.toString().split(',').join('') : num).toFixed(decimals)
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals
      })

      return isNaN(value) ? '0.00' : formatter.format(value)
    },
    convertTimestamp (timestamp) {
      let d = new Date(timestamp * 1000),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time

      if (hh > 12) {
        h = hh - 12
        ampm = 'PM'
      } else if (hh === 12) {
        h = 12
        ampm = 'PM'
      } else if (hh === 0) {
        h = 12
      }

      time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm

      return time
    },
    formatDefiboxPool (pool) {
      return this.formatNumber(pool.split(' ')[0]) + ' ' + pool.split(' ')[1]
    }

  }
}
