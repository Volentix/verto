import HD from '@/util/hdwallet'
import Lib from '@/util/walletlib'
import { scroll, openURL } from 'quasar'
import { toSvg } from 'jdenticon'
import initWallet from '@/util/_Wallets2Tokens'

export default {
  computed: {
    fundTotal () {
      let total = 0
      if (this.$store.state.wallets.customTotal.show) {
        total = this.nFormatter2(this.$store.state.wallets.customTotal.usd, 3)
      } else {
        total = this.nFormatter2(this.$store.state.investment.investmentTotal + this.$store.state.wallets.portfolioTotal, 3)
      }
      return total
    }
  },
  methods: {
    defaultToken (chain) {
      return "this.src='" + Lib.getDefaultToken(chain) + "'"
    },
    toAvatar (name) {
      return toSvg(name, 30)
    },
    clickBtn (id) {
      document.getElementById(id).click()
    },
    isValidUrl (string) {
      let url

      try {
        url = new URL(string)
      } catch (_) {
        return false
      }

      return url.protocol === 'http:' || url.protocol === 'https:'
    },
    getImportLink (chain, watch = false) {
      let to = '/verto/import-wallet/' + chain + (watch ? '/watch' : '')

      let routes = {
        eth: '/verto/import-private-key/eth' + (watch ? '/watch' : ''),
        eos: '/verto/eos-account/import' + (watch ? '/watch' : ''),
        btc: '/verto/import-wallet/btc' + (watch ? '/watch' : '')
      }
      if (!watch && routes[chain]) {
        to = routes[chain]
      }
      return to
    },
    getAssets (chain = null, account = null) {
      let assets = []
      if (
        this.$store.state.investment.defaultAccount
      ) {
        account = this.$store.state.investment.defaultAccount
        // this.getChainLabel(account.chain)
      }
      this.$store.state.wallets.tokens
        .filter(
          (o) =>
            (!account && !chain) ||
            (chain && o.chain === chain && !account) ||
            (account &&
              o.chain === account.chain &&
              ((account.isEvm && o.key === account.key) ||
                (!account.isEvm && o.name === account.name)))
        )
        .forEach((asset, i) => {
          let token = Object.assign({}, asset)

          token.amount = parseFloat(token.amount)
          token.usd = parseFloat(token.usd)

          if (
            (!isNaN(token.amount) && token.amount !== 0) ||
            token.isEvm ||
            !this.$store.state.wallets.portfolioTotal
          ) {
            let index = assets.findIndex(
              (o) =>
                o.type === token.type &&
                o.chain === token.chain &&
                (token.chain !== 'eos' || o.contract === token.contract)
            )

            if (index !== -1) {
              assets[index].amount += token.amount
              assets[index].usd += isNaN(token.usd) ? 0 : token.usd
              assets[index].rateUsd = isNaN(token.tokenPrice)
                ? 0
                : token.tokenPrice
              assets[index].percentage =
                (assets[index].usd /
                  parseFloat(this.$store.state.wallets.portfolioTotal)) *
                100
            } else {
              token.percentage =
                (token.usd /
                  parseFloat(this.$store.state.wallets.portfolioTotal)) *
                100
              token.index = assets.length
              token.rateUsd = isNaN(token.tokenPrice) ? 0 : token.tokenPrice
              token.friendlyType =
                token.type.length > 6
                  ? token.type.substring(0, 6) + '...'
                  : token.type
              token.chainLabel = this.getChainLabel(token.chain)
              assets.push(token)
            }
            assets.sort(
              (a, b) =>
                (isNaN(parseFloat(b.usd)) ? 0 : parseFloat(b.usd)) -
                (isNaN(parseFloat(a.usd)) ? 0 : parseFloat(a.usd))
            )
          }
        })
      return assets
    },
    getAccountLabel (w) {
      let label = this.getKeyFormat(w.key)
      if (w.chain === 'eos') {
        label = w.name
      } else if (w.isEvm) {
        label = !w.name.toLowerCase().includes('coin') ? (w.name) + ' ' + label.substring(6) : label
      }
      return label
    },
    getKeyFormat (key, last = 4) {
      return key ? key.substring(0, 4).toLowerCase() +
      '...' +
      key.substr(key.length - last).toLowerCase() : ''
    },
    redirectToLastRoute () {
      const lastRoute = localStorage.getItem('prev_route') ? JSON.parse(localStorage.getItem('prev_route')) : null

      if (lastRoute && this.$route.name !== lastRoute.name) {
        this.$router.push({
          name: lastRoute.name,
          query: lastRoute.query,
          params: lastRoute.params
        })
      }
    },
    getPageName (name) {
      let pages = {
        token: ['token-page', 'single-token-page']
      }
      if (pages[name]) {
        name = pages[name].find(a => a !== this.$route.name)
      }
      return name
    },
    scrollToElement (id) {
      const { getScrollTarget, setScrollPosition } = scroll
      let el = document.getElementById(id)

      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 300
      setScrollPosition(target, offset, duration)
    },
    getChainLabel (chain) {
      chain = chain.toLowerCase()
      let isEvm = Lib.evms.find(a => a.chain === chain)
      let chainLabel = HD.names.find(a => a.value === chain)

      if (chain === 'bsc') {
        isEvm.name = 'BSC'
      }
      return isEvm ? isEvm.name : (chainLabel ? chainLabel.label : chain.toUpperCase())
    },
    isEvm (type) {
      return ['ftm', 'avaxc', 'eth', 'bsc', 'matic'].includes(type.toLowerCase())
    },
    formatAccoountOption (w) {
      let account = {
        value: w.key + '-' + w.chain + (w.name),
        key: w.key,
        isEvm: w.isEvm || this.isEvm(w.type),
        chain: w.chain,
        amount: w.amount,
        type: w.type,
        watch: w.watch,
        index: w.index,
        usd: w.usd,
        total: w.total,
        icon: w.icon,
        image: w.icon,
        name: w.name,
        label: this.getAccountLabel(w),
        color: this.getRandomColor()
      }
      for (let key in w) {
        if (!account[key]) { account[key] = w[key] }
      }
      return account
    },
    groupday (values, key) {
      let days = {}
      values.forEach(o => {
        let d = new Date(o[key])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        if (!days[d]) {
          days[d] = []
        }
        days[d].push(o)
      })
      return days
    },
    groupweek (value, index, array) {
      let byweek = {}
      let d = new Date(value.timestamp)
      d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24 * 7))
      byweek[d] = byweek[d] || []
      byweek[d].push(value)
      return byweek
    },
    groupmonth (value, index, array) {
      let bymonth = {}
      let d = new Date(value.timestamp)
      d = (d.getFullYear() - 1970) * 12 + d.getMonth()
      bymonth[d] = bymonth[d] || []
      bymonth[d].push(value)
      return bymonth
    },
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'primary',
        position: 'top'
      })
    },
    deleteVertoAccount (key, value, account) {
      if (account.watch) {
        let watchAccounts = localStorage.getItem('watchAccounts')
        watchAccounts = watchAccounts ? JSON.parse(watchAccounts) : []
        watchAccounts = watchAccounts.filter(o => o[key].toLowerCase() !== value.toLowerCase())
        localStorage.setItem('watchAccounts', JSON.stringify(watchAccounts))
      }

      let data = localStorage.getItem('walletPublicDatav2')
      data = data ? JSON.parse(data) : []
      data = data.filter(o => o[key].toLowerCase() !== value.toLowerCase())
      localStorage.setItem('walletPublicDatav2', JSON.stringify(data))

      this.$store.state.wallets.tokens = this.$store.state.wallets.tokens.filter(o => o[key].toLowerCase() !== value.toLowerCase())
      initWallet()
    },
    getRandomColor () {
      const randomNumber = (min, max) => {
        return Math.floor(Math.random() * max) + min
      }
      let colors = 'red pink purple deep-purple indigo blue cyan teal amber blue-grey'
      let arrayColors = colors.split(' ')
      return arrayColors[randomNumber(0, arrayColors.length - 1)] + '-' + randomNumber(1, 4)
    },
    formatNumberWithSign (change) {
      return (change > 0 ? '+' : '-') + '$' + this.formatNumber(Math.abs(change), 2)
    },
    toFormData: function (data) {
      var form_data = new FormData()

      for (var key in data) {
        if (data[key] !== null) {
          form_data.append(key, data[key])
        }
      }
      return form_data
    },
    goToLink (url) {
      openURL(url)
    },
    nFormatter2 (num, digits) {
      if (isNaN(num)) {
        return 0
      }
      var si = [
        { value: 1, symbol: '' },
        { value: 1E3, symbol: 'k' },
        { value: 1E6, symbol: 'M' },
        { value: 1E9, symbol: 'B' },
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
    setDefaultWallet (chain) {
      if (this.$store.state.investment.defaultAccount && this.$store.state.investment.defaultAccount.chain) {
        if (chain === this.$store.state.investment.defaultAccount.chain) return this.$store.state.investment.defaultAccount
      }

      let w = this.setChains().find(o => o.chain === chain)

      if (w && w.accounts && w.accounts.length) {
        this.$store.commit('investment/setDefaultAccount', this.formatAccoountOption(w.accounts[0]))
      }

      return w
    },
    getChainIcon (chain) {
      let chainsData = HD.getVertoChains()
      let c = chainsData.find(p => p.chain === chain)
      return c ? c.icon : 'statics/empty-token.png'
    },
    exchangeToken (token, action = 'buy', experience = 'exchange') {
      this.setDefaultWallet(token.chain)
      token.type = token.type.toUpperCase()
      setTimeout(() => {
        this.$router.push({
          name: 'crosschain-exchange',
          params: { asset: token, after_experience: experience === 'exchange' ? token.after_experience : null, action: action, experience: experience }
        })
      }, 200)
    },
    triggerTokenAction (token) {
      let found = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === token.type.toLowerCase() && o.chain === token.chain.toLowerCase())
      if (token.protocol === 'Enzyme') {
        return openURL('https://staider.finance/vault/0xe00d15b722a3c3a5ae2d4dd68a302ec8fdc2ccba')
      } else if (!found) {
        this.error.data.token = token
        this.error.msg = 'You seems very excited to ' + token.action.toLowerCase() + ' ' + token.type + '. However your wallet balance for this token is zero.'

        return
      }

      if (token.actionTrigger && token.actionTrigger.type === 'link') {
        this.setDefaultWallet(token.chain)
        setTimeout(() => {
          this.$router.push(token.actionTrigger.path)
        }, 200)
      } else if (token.experience === 'deposit_ust') {
        this.exchangeToken(token, 'sell', token.experience)
      }
    },
    setChains () {
      let walletData = {
        tokensCount: this.$store.state.wallets.tokens.length,
        chainsData: null
      }
      if (this.$store.state.currentwallet.userData.walletData && this.$store.state.currentwallet.userData.walletData.tokensCount === this.$store.state.wallets.tokens.length) {
        walletData.chainsData = this.$store.state.currentwallet.userData.walletData.chainsData
      }

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
      if (!walletData.chainsData) {
        let chainsData = HD.getVertoChains()
        let chains = JSON.parse(JSON.stringify(this.$store.state.wallets.tokens.filter((v, i, a) => (v.type === v.chain || v.multitoken) && a.findIndex(t => (t.chain === v.chain)) === i)))

        chains.map(o => {
          let accounts = this.$store.state.wallets.tokens.filter(f => f.chain === o.chain)
          o.chainTotal = accounts.filter(g => g.usd).reduce((a, b) => +(a || 0) + (isNaN(b.usd) || !b.usd ? 0 : +b.usd), 0)
          let evmChain = Lib.evms.find(a => a.chain === o.chain)
          let c = chainsData.find(p => p.chain === o.chain)
          if (c) {
            o.icon = c.icon
          }
          o.accounts = evmChain ? accounts.filter((a, i, c) => a.chain === o.chain && c.findIndex(t => (t.key.toLowerCase() === a.key.toLowerCase())) === i) : (o.multitoken && o.chain !== 'eos' ? accounts.filter((a, i, c) => a.chain === o.chain && c.findIndex(t => (t.key.toLowerCase() === a.key.toLowerCase())) === i) : accounts.filter(a => a.type === o.chain))

          o.accounts = JSON.parse(JSON.stringify(o.accounts)).map(q => {
            q.tokenList = this.$store.state.wallets.tokens.filter((f, i, c) => f.chain === q.chain && ((f.multitoken && f.key.toLowerCase() === q.key.toLowerCase() && c.findIndex(t => t.isEvm && t.key.toLowerCase() === q.key.toLowerCase() && f.type === t.type) === i) || (!f.isEvm && q.chain === f.chain && f.name.toLowerCase() === q.name.toLowerCase())))
            q.color = this.getRandomColor()
            q.value = o.chain === 'eos' ? q.name : q.key
            q.label = o.chain === 'eos' ? q.name : q.key

            q.icon = c ? c.icon : q.icon
            return q
          })
          o.count = o.accounts.length
          if (evmChain) o.icon = evmChain.icon
          let chain = HD.names.find(a => a.value === o.chain)
          o.evmChain = evmChain

          o.label = evmChain ? evmChain.name : (chain ? chain.label : o.chain.toUpperCase())

          return o
        })
        walletData.chainsData = chains.sort((a, b) => parseFloat(b.chainTotal) - parseFloat(a.chainTotal))
        let data = { walletData: walletData }
        this.$store.commit('currentwallet/setUserData', data)
      }

      return walletData.chainsData
    },
    isAssetValuable (asset) {
      let not_valuable = localStorage.getItem('not_valuable')
      let found = -1
      if (not_valuable) {
        not_valuable = JSON.parse(not_valuable)
        found = not_valuable.findIndex(o => o.chain === asset.chain && o.type === asset.type)
      }
      return found
    },
    markAsValuable (asset) {
      let not_valuable = localStorage.getItem('not_valuable')
      if (not_valuable) {
        not_valuable = JSON.parse(not_valuable)
        let found = this.isAssetValuable(asset)
        console.log(found, 'found')
        if (found === -1) return
        not_valuable.splice(found, 1)
        localStorage.setItem('not_valuable', JSON.stringify(Lib.removePrivateData(not_valuable)))
      }
      this.$store.state.currentwallet.userData.walletData = null
      initWallet()
    },
    markAssetNotValuable (asset) {
      let not_valuable = localStorage.getItem('not_valuable')
      if (not_valuable) {
        not_valuable = JSON.parse(not_valuable)
        not_valuable.push(asset)
        localStorage.setItem('not_valuable', JSON.stringify(Lib.removePrivateData(not_valuable)))
      } else {
        localStorage.setItem('not_valuable', JSON.stringify(Lib.removePrivateData([asset])))
      }
      this.$store.state.currentwallet.userData.walletData = null
      initWallet({ fromCache: true })
    },
    async setCurrentWallet (chain) {
      this.$store.state.currentwallet.wallet = chain

      this.selectedCoin = chain

      this.$store.commit('currentwallet/updateParams', {
        chainID: this.$route.params.chainID || this.selectedCoin.chain,
        tokenID: this.$route.params.tokenID || this.selectedCoin.type,
        accountName: this.$route.params.accountName || this.selectedCoin.name.toLowerCase()
      })

      // this.setRessourcesInfos()
    },
    formatNumber (num, decimals = 4, scientific = true, removeZero = false) {
      num = isNaN(num) ? 0 : num
      if (num && decimals !== 2 && decimals !== 0 && !removeZero) {
        decimals = (parseFloat(num) - parseInt(num)) === 0 ? 0 : decimals
      }
      decimals = decimals < 0 ? 0 : decimals

      let value = parseFloat(num ? num.toString().split(',').join('') : num).toFixed(decimals)
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals
      })

      let amount = isNaN(value) ? '0.00' : formatter.format(value)
      if (parseFloat(num) >= 9999999) amount = this.nFormatter2(num, decimals, 1)
      if (parseFloat(amount) === 0 && parseFloat(num) !== 0 && !isNaN(amount) && decimals !== 0 && Math.abs(parseFloat(num)) < 0.00001) {
        if (scientific) {
          amount = parseFloat(num).toExponential().replace(/e\+?/, ' x10^')
          let a = amount.toString().split('x')
          amount = parseFloat(a).toFixed(0).toString() + 'x' + a[1]
        } else {
          amount = parseFloat(num)
        }
      }
      return amount.toString()
    },
    secondsTotime: function (secondsValue, text = false, pad = true, prefix = true, short = false, concat = 4) {
      if (concat === 0) {
        concat = 4
      }
      var days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        future = parseInt(secondsValue) >= 0

      let value = future ? 'In ' : ''

      secondsValue = Math.abs(secondsValue)
      if (secondsValue >= 0) {
        days = this.pad(parseInt(secondsValue / 86400), pad)
        secondsValue = secondsValue % 86400

        hours = this.pad(parseInt(secondsValue / 3600), pad)
        secondsValue = secondsValue % 3600

        minutes = this.pad(parseInt(secondsValue / 60), pad)
        seconds = this.pad(parseInt(secondsValue % 60), pad)
      } else {
        days = hours = minutes = seconds = 0
      }

      if (text === true) {
        if (days && days.toString() !== '00' && days !== 0) {
          if (concat > 0) {
            concat -= 1
            value += parseInt(days).toString()

            value += short ? 'd ' : parseInt(days) === 1 ? 'day ' : 'days '
          }
        }
        if (hours && hours.toString() !== '00' && hours !== 0) {
          if (concat > 0) {
            concat -= 1
            value += parseInt(hours).toString()
            value += short ? 'h ' : parseInt(hours) === 1 ? 'hour ' : 'hours '
          }
        }
        if (minutes && minutes.toString() !== '00' && minutes !== 0) {
          if (concat > 0) {
            concat -= 1
            value += parseInt(minutes).toString()
            value += short ? 'm ' : parseInt(minutes) === 1 ? 'min. ' : 'min. '
          }
        }

        if (parseInt(secondsValue) === 0) {
          value += ' just now'
        } else if (seconds && seconds.toString() !== '00' && seconds !== 0) {
          if (concat > 0) {
            concat -= 1
            value += parseInt(seconds).toString()
            value += parseInt(seconds) === 1 ? 's ' : 's '
          }
        }

        if (parseInt(secondsValue) !== 0) { value += future ? '' : 'ago' }
      } else {
        value = {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        }
      }

      return value
    },
    pad: function (n, use = true) {
      if (use) {
        return (n < 10 ? '0' : '') + n
      } else {
        return n
      }
    },
    getTimeAgo (date_from, short = false, concat = 4, multiple = 1000) {
      var date_now = new Date()
      var time = new Date(date_from * multiple)
      time = time.getTime()
      var diff = time - date_now.getTime()
      diff /= 1000
      return this.secondsTotime(Math.round(diff), true, true, true, short, concat)
    },
    convertTimestamp (timestamp) {
      let d = isNaN(timestamp) ? new Date(timestamp) : new Date(timestamp * 1000),
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
