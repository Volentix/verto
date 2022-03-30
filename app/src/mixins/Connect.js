import Enzyme from '@/util/Staider/Enzyme'
import WalletConnectProvider from '@walletconnect/web3-provider'
const Parse = require('parse')
const walletConnectProvider = new WalletConnectProvider({
  infuraId: '0dd5e7c7cbd14603a5c20124a76afe63',
  clientMeta: {
    description: 'WalletConnect Developer App',
    url: 'https://walletconnect.org',
    icons: ['https://walletconnect.org/walletconnect-logo.svg'],
    name: 'WalletConnect'
  },
  qrcodeModalOptions: {
    mobileLinks: [
      'rainbow',
      'metamask',
      'argent',
      'trust',
      'imtoken',
      'pillar'
    ]
  }
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
// import web3 from 'web3'
const random = () => { return (Math.random() + 1).toString(36).substring(7) }
export default {
  methods: {
    async initConnect () {
      this.$store.commit('currentwallet/setLoggedIn', false)
      /* var currentUser = Parse.User.current()

      if (currentUser) {
        const query = new Parse.Query(Parse.Object.extend('userMeta'))
        query
          .find()
          .then(results => {
            if (results.length) {
              this.setUser(results[0].get('key'), 'verto')
            }
          })
          .catch(() => {
            //  console.log(error)
          })
      } */
      await this.loadMoralis()
      await this.initServer()
    },
    setDialog (val) {
      this.showDialog = val
    },
    triggerDeposit (action = 'deposit') {
      if (!this.user.address) {
        this.connectOptions = true
        return
      }

      this.connectOptions = false
      this.action = action
      this.showDialog = true
      this.trigger++
    },
    listenToData () {
      var query = new Parse.Query('userMeta')
      query.subscribe().then((response) => {
        response.on('update', response => {
          this.connectLoading = false
          this.setUser(response.get('key'), 'verto')
        })
        response.on('create', response => {
          this.connectLoading = false
          this.setUser(response.get('key'), 'verto')
        })
      })
    },
    getNewUser () {
      this.connectLoading = true
      let user = Parse.User.current()

      this.$set(this.user, 'wallet', 'verto')

      if (!user) {
        let u = {
          usr: random(),
          pass: random()
        }
        user = new Parse.User()
        user.set('username', u.usr)
        user.set('password', u.pass)
        user.set('email', u.usr + '@temp.com')
        user.signUp().then((user) => {
          this.listenToData()
          this.openInNewTab(this.$app.getUrl() + 'connect/' + user.getSessionToken())
        }).catch(function () {
          this.connectLoading = false
        })
      } else {
        this.listenToData()
        this.openInNewTab(this.$app.getUrl() + 'connect/' + user.getSessionToken())
      }
    },
    async getWeb3 () {
      const web3 = await Moralis.Web3.enable()
      return web3
    },
    async setConnectDialog (value) {
    //  this.connectOptions = value
    },
    async sendTransaction (to, amount, utf8Data) {
      let from = this.user.address
      let web3 = await this.getWeb3()
      let data = web3.utils.utf8ToHex(utf8Data)
      let nonce = await web3.eth.getTransactionCount(from)
      let value = web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether'))

      let tx = {
        from,
        to,
        nonce,
        value,
        data,
        chainId: 1
      }

      let broadcast = web3.eth.sendTransaction(tx)
      return new Promise(async (resolve, reject) => {
        resolve({
          broadcast: broadcast
        })
      })
    },
    async logout (redirect = null) {
      this.$store.state.wallets.tokens = []
      this.connectLoading = false
      this.$route.params.key = null
      this.user = null

      this.connectLoading = false
      this.$store.state.currentwallet.user = null
      this.$store.state.currentwallet.userData = {}
      this.$store.commit('currentwallet/setLoggedIn', false)
      this.$store.commit('currentwallet/setLoggedData', null)
      this.$store.commit(
        'investment/setDefaultAccount',
        null
      )

      if (this.user.wallet === 'verto') {
        Parse.User.logOut()
      } else if (this.user.wallet === 'walletconnect') {
        walletConnectProvider.disconnect()
      }
      if (redirect) {
        this.$router.push(redirect)
      }
      if (typeof Moralis === 'undefined') {
        await delay(5000)
      }
      await Moralis.User.logOut()
    },
    loadMoralis () {
      let element = document.createElement('script')
      let element2 = document.createElement('script')
      element.setAttribute('src', 'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js')
      document.head.appendChild(element)
      element2.setAttribute('src', 'https://unpkg.com/moralis@1.5.1/dist/moralis.js')
      document.head.appendChild(element2)
    },
    setUser (address, wallet = 'metamask', balance = 0) {
      if (address) {
        this.$store.state.currentwallet.userData = {}
        this.$set(this.user, 'address', address.toLowerCase())
        this.$set(this.user, 'wallet', wallet)
        this.$set(this.user, 'balance', balance)
        this.$set(this.user, 'addressFriendly', (this.user.address.substring(0, 6) + '...' + this.user.address.substr(this.user.address.length - 5)).toLowerCase())
        this.$set(this.user, 'address', address.toLowerCase())

        this.$store.commit('currentwallet/setLoggedIn', true)
        this.$store.commit('currentwallet/setLoggedData', this.user)
        this.connectOptions = false
      }
    },
    async initServer () {
      console.log('6')
      if (typeof Moralis === 'undefined') {
        await delay(1000)
        await this.initServer()
        return
      }
      console.log('7')

      /* global Moralis */

      await Moralis.start({ serverUrl: 'https://blqup05sr0xr.usemoralis.com:2053/server', appId: 'Y3EQRdHC128aqLOdXG4Hzs5eXzXbsiAqX5dBSCMi' })
      console.log('8')
      // this.getTokensData()
      if (Moralis.User.current()) {
        console.log('9')
        let user = Moralis.User.current()
        let data = await Moralis.Web3API.account.getNativeBalance()
        this.setUser(user.get('ethAddress'), 'metamask', data.balance / (10 ** 18))
        await Moralis.enableWeb3()
        //  let Web3 = require('web3')
        //  let web3 = new Web3(Moralis.provider)
        Moralis.onAccountChanged(async (account) => {
          let data = await Moralis.Web3API.account.getNativeBalance()

          this.setUser(account, 'metamask', data.balance / (10 ** 18))
          await Moralis.link(account)
        })
      }
      this.connectLoading = false
    },
    async connect (wallet, data) {
      this.connectLoading = true
      this.$set(this.user, 'wallet', wallet)
      if (typeof Moralis === 'undefined') {
        await delay(1000)
        return this.connect(wallet)
      }
      if (wallet === 'metamask') {
        await Moralis.enableWeb3()
        Moralis.authenticate({ signingMessage: 'Log in with Staider' }).then(async (user) => {
          this.connectLoading = false
          let data = await Moralis.Web3API.account.getNativeBalance()
          this.setUser(user.get('ethAddress'), wallet, data.balance / (10 ** 18))
          Moralis.onAccountsChanged(async (account) => {
            let data = await Moralis.Web3API.account.getNativeBalance()

            this.setUser(account, wallet, data.balance / (10 ** 18))
            await Moralis.link(account)
          })
        }).catch(async (error) => {
          if (error.toString().includes('Parse.initialize')) {
            await delay(3000)
            this.connect()
          } else {
            this.connectLoading = false
            this.connectionError = error.message
            setTimeout(() => {
              this.connectionError = false
            }, 3000)
          }
        })
      } else if (wallet === 'walletconnect') {
        walletConnectProvider.enable().then(async (accounts, e) => {
          this.connectLoading = false
          if (accounts && accounts[0]) {
            this.provider = walletConnectProvider
            const options = { chain: 'eth', address: accounts[0] }
            let data = await Moralis.Web3API.account.getNativeBalance(options)
            this.setUser(accounts[0], 'walletconnect', data.balance / (10 ** 18))

            walletConnectProvider.on('accountsChanged', async (newAccounts) => {
              const options = { chain: 'eth', address: accounts[0] }
              let data = await Moralis.Web3API.account.getNativeBalance(options)
              this.setUser(newAccounts[0], 'walletconnect', data.balance / (10 ** 18))
            })
          }
        }).catch(e => {
          // console.log(e, 'error')
        })
      } else if (wallet === 'address' && data && data.address) {
        this.setUser(data.address, wallet)
      }
    }, /*
    async getTokensData () {
      let options = {
        address: Enzyme.denominationAssetData.id,
        chain: 'eth'
      }
      const price = await Moralis.Web3API.token.getTokenPrice(options)
      options = { chain: 'eth', symbols: [Enzyme.denominationAssetData.symbol] }
      const tokenMetadata = await Moralis.Web3API.token.getTokenMetadataBySymbol(options)

      console.log(price, 'price', tokenMetadata)
    }
  }, */

    async setEnzyme () {
      // this.$route.params.fundID = '0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a'
      if (this.$route.params.fundID) {
        this.EnzymeData = null
        await Enzyme.init(this.$route.params.fundID)
        this.EnzymeData = Enzyme
      }
    }
  },
  data () {
    return {
      connectLoading: false,
      showDialog: false,
      action: 'deposit',
      connectOptions: false,
      connectionError: false,
      provider: null,
      EnzymeData: null,
      trigger: 1,
      user: {}
    }
  }
}
