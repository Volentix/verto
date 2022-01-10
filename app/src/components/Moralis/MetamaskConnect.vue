<template>
  <q-item class="metamask-btn row flex items-center" v-show="false" >
    <q-item-section class="text-body1">
      <q-btn id="connectBtn" :loading="connectLoading" no-caps no-wrap class="address q-pr-sm" :class="user.address ? 'bg-green-1' : 'bg-red-1'"  @click="connectOptions = true" flat icon="fiber_manual_record" :color="!user.address ? 'red' : 'green'" :label="!user.address ? 'Connect' : user.addressFriendly"></q-btn>
    </q-item-section>

    <q-item-section class="logout" v-if="user.address" >
      <q-btn size="md" id="logoutBtn" outline flat no-caps no-wrap icon="logout" color="green-3" label="Disconnect" @click="logout()" />
    </q-item-section>
    <q-item-section v-show="false" v-if="user.address" class="deposit_button_wrapper">
      <q-btn id="depositBtn" color="black" @click="triggerDeposit()" class="q-pa-sm q-pr-md deposit_button" icon="vertical_align_bottom" no-wrap no-caps label="Deposit"/>

      <q-btn id="whitelistBtn" color="black" @click="triggerDeposit('whitelistRequired')" class="q-pa-sm q-pr-md deposit_button" icon="vertical_align_bottom" no-wrap no-caps label="Deposit"/>

      <q-btn id="withdrawBtn" color="black" @click="action = 'withdraw' ; showDialog = true ; trigger++" class="q-pa-sm q-pr-md deposit_button" icon="vertical_align_bottom" no-wrap no-caps label="Deposit"/>
    </q-item-section>

      <DepositPopup @setDialog="setDialog" :provider="provider" :actionType="action" :EnzymeData="EnzymeData" :key="trigger" v-if="user.address && $route.params.fundID && EnzymeData && showDialog"  :user="user" :fundAddress="$route.params.fundID" />

     <q-dialog  @hide="connectLoading = false" v-model="connectOptions">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center" v-if="!user.address">Select a wallet to connect</div>
           <div class="text-h6 text-center text-green" v-else>You are connected</div>
        </q-card-section>

        <q-card-section class="q-pt-none row text-center" style="max-width:300px">

        <div class="col-md-12 q-mb-md col-12" v-if="!user.address || user.wallet == 'walletconnect'">
         <q-btn :disable="user.address !== null" :loading="connectLoading && user.wallet == 'walletconnect'" @click="connect('walletconnect')" :color="!user.address ? 'indigo' : 'green'" outline icon="img:https://pbs.twimg.com/profile_images/998895674522353665/mQFAbUOX.jpg" class="full-width text-bold" :label="!user.address ? 'Walletconnect' : 'Connected'" />
        </div>
        <div v-if="$q.screen.gt.sm" class="col-md-12 col-12">
           <q-btn :disable="user.address !== null" :loading="connectLoading && user.wallet == 'metamask'" color="brown-6"  v-if="!user.address || user.wallet == 'metamask'"  outline icon="img:https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-svg-vector.svg" class="full-width text-bold"  :label="!user.address ? 'Metamask' : 'Connected'" @click="connect('metamask')" />
        </div>
        <div class="col-md-12 col-12">
           <q-btn label="continue" v-close-popup  v-if="user.address" class="full-width" flat />
        </div>

        </q-card-section>

      </q-card>
    </q-dialog>
  </q-item>
</template>
<script>
import WalletConnectProvider from '@walletconnect/web3-provider'

const walletConnectProvider = new WalletConnectProvider({
  infuraId: '97f755cb8e3841d19f3923a18246f2d0',
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

import Formatter from '../../mixins/Formatter'
const random = () => { return (Math.random() + 1).toString(36).substring(7) }
// import parseDb from 'boot/parseDb'
import DepositPopup from '../Staider/Fund/DepositPopup.vue'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
// import web3 from 'web3'
import Enzyme from '../../util/Staider/Enzyme'
const Parse = require('parse')

export default {
  mixins: [Formatter],
  components: {
    DepositPopup
  },
  props: ['type'],
  methods: {
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
      this.user.wallet = 'verto'

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
    async logout () {
      this.connectLoading = false
      this.user = {
        address: null,
        addressFriendly: null,
        wallet: null
      }

      this.connectLoading = false
      this.$store.commit('currentwallet/setLoggedIn', false)
      this.$store.commit('currentwallet/setLoggedData', null)
      if (this.user.wallet === 'metamask') {
        if (typeof Moralis === 'undefined') {
          await delay(5000)
        }
        await Moralis.User.logOut()
      } else if (this.user.wallet === 'verto') {
        Parse.User.logOut()
      } else if (this.user.wallet === 'walletconnect') {
        walletConnectProvider.disconnect()
      }
    },
    loadMoralis () {
      let element = document.createElement('script')
      let element2 = document.createElement('script')
      element.setAttribute('src', 'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js')
      document.head.appendChild(element)
      element2.setAttribute('src', 'https://unpkg.com/moralis/dist/moralis.js')
      document.head.appendChild(element2)
    },
    setUser (address, wallet = 'metamask') {
      this.user.address = address.toLowerCase()
      this.user.wallet = wallet
      this.user.addressFriendly = (this.user.address.substring(0, 6) + '...' + this.user.address.substr(this.user.address.length - 5)).toLowerCase()
      this.$store.commit('currentwallet/setLoggedIn', true)
      this.$store.commit('currentwallet/setLoggedData', this.user)
      this.connectOptions = false
    },
    async initServer () {
      if (typeof Moralis === 'undefined') {
        await delay(5000)
        return this.initServer()
      }

      setTimeout(async () => {
      /* global Moralis */
        Moralis.initialize('Y3EQRdHC128aqLOdXG4Hzs5eXzXbsiAqX5dBSCMi')
        Moralis.serverURL = 'https://blqup05sr0xr.usemoralis.com:2053/server'
        // this.getTokensData()
        if (Moralis.User.current()) {
          let user = Moralis.User.current()
          this.setUser(user.get('ethAddress'))
          Moralis.Web3.onAccountsChanged(async (accounts) => {
            this.setUser(accounts[0])
            await Moralis.Web3.link(accounts[0])
          })
        }
        this.connectLoading = false
      }, 1000)
    },

    async connect (wallet) {
      this.connectLoading = true
      this.user.wallet = wallet

      if (wallet === 'metamask') {
        if (typeof Moralis === 'undefined') {
          await delay(5000)
          return this.connect(wallet)
        }
        Moralis.Web3.authenticate().then(async (user) => {
          this.connectLoading = false
          this.setUser(user.get('ethAddress'))
          Moralis.Web3.onAccountsChanged(async (accounts) => {
            this.setUser(accounts[0])
            await Moralis.Web3.link(accounts[0])
          })
        }).catch(async (error) => {
          if (error.toString().includes('Parse.initialize')) {
            await delay(3000)
            this.connect()
          } else {
            this.connectLoading = false
          }
        })
      } else if (wallet === 'walletconnect') {
        walletConnectProvider.enable().then((accounts, e) => {
          this.connectLoading = false
          if (accounts && accounts[0]) {
            this.provider = walletConnectProvider
            this.setUser(accounts[0], 'walletconnect')

            walletConnectProvider.on('accountsChanged', (newAccounts) => {
              this.setUser(accounts[0], 'walletconnect')
            })
          }
        }).catch(e => {
          // console.log(e, 'error')
        })
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
  watch: {
    '$route.params.fundID': function (val) {
      if (val) {
        this.setEnzyme()
      }
    }
  },
  async created () {
    this.$store.commit('utils/setLoginState', false)
    var currentUser = Parse.User.current()

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
    }
    this.loadMoralis()
    this.initServer()
    this.setEnzyme()
  },
  data () {
    return {
      connectLoading: false,
      showDialog: false,
      action: 'deposit',
      connectOptions: false,
      provider: null,
      EnzymeData: null,
      trigger: 1,
      user: {
        wallet: null,
        avatar: null,
        address: null,
        addressFriendly: null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.metamask-btn {
  display: none  !important;
}
.logout button {
  margin-right: -20px;
    color: #4caf4f !important;
}
  .logout button {
    // color: #4caf4f !important;
    font-family: 'Comfortaa', cursive !important;
  }
  .address{
    font-family: 'Comfortaa', cursive !important;
  }
  .deposit_button_wrapper{
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .deposit_button{
    background: #0054ee !important;
    color: #FFF !important;
    background: linear-gradient(to right, #002044 0%, #0054ee 100%) !important;
    position: absolute;
    right: -165px;
    top: 85px;
    font-family: 'Comfortaa', cursive !important;
  }

</style>
