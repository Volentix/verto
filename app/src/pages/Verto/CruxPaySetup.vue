<template>
  <q-page class="text-black bg-white">
    <div v-if="step===1" class="standard-content" style="padding-bottom: 70px">
      <div class="standard-content--body">
        <h2 class="standard-content--title">Create the Verto ID</h2>
        <div class="standard-content--body__img column flex-center">
          <img src="statics/crux_id_bg.svg" alt="">
        </div>
        <div class="standard-content--body__form">
          <label class="label">choose an ID</label>
          <q-input
            v-model="cruxID"
            ref="cruxID"
            @input="getAvailable()"
            rounded outlined color="blue"
            type="text"
            :loading="!cruxKey || loading"
            :suffix="'@' + walletClientName + '.crux'"
            :error="error"
            :error-message="errorMessage"
          />
          <div class="flex-end flex justify-end">
            <q-btn flat class="action-link next" color="black" text-color="white" @click="register()" label="Register" :disable="!available" />
          </div>
        </div>
      </div>
      <div class="standard-content--footer">
        <p class="crux-label">Powered by cruxpay.</p>
      </div>
    </div>
    <div v-if="step===2" class="standard-content" style="padding-bottom: 70px">
      <div class="standard-content--body">
        <h2 class="standard-content--title"> Registering your wallet addresses in your ID</h2>
        <!-- <p class="diclaimer"> {{ status }} </p> -->
        <div class="standard-content--body__form">
          <div class="send-modal__content--body column flex-center">
            <q-circular-progress
              :value="progress"
              size="170px"
              :thickness="0.05"
              color="cyan-5"
              track-color="grey-3"
              class="q-ma-md"
              show-value
              font-size="20px"
            />
            <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
            <div class="--label text-cyan-5 text-h6">{{ progress }} %</div>
          </div>
          <div class="send-modal__content--footer">
            <div class="text-h4 --status">{{ status }}</div>
          </div>
          <div class="flex-end flex justify-end">
            <q-btn flat class="action-link next" color="black" text-color="white" label="Next" @click="step=3" :disable="!mapped" />
          </div>
        </div>
      </div>
      <div class="standard-content--footer">
        <p class="crux-label">Powered by cruxpay.</p>
      </div>
    </div>
    <div v-if="step===3" class="standard-content" style="padding-bottom: 70px">
      <div class="standard-content--body">
        <h2 class="standard-content--title">You're all set. <span class="cruxid">{{ existingCruxID }}</span> Enjoy using verto</h2>
        <p class="diclaimer"><strong>Disclaimer</strong> These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.</p>

      </div>
      <div class="standard-content--body__form">
        <div class="flex-end flex justify-end">
          <q-btn flat class="action-link next" color="black" text-color="white" label="Next" to="/verto/dashboard" />
        </div>
        <div class="standard-content--footer">
          <p class="crux-label">Powered by cruxpay.</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { CruxPay } from '@cruxpay/js-sdk'
import HD from '@/util/hdwallet'
let cruxClient

// I have setup your symbols into a sandbox wallet named testwallet.
// You can proceed with development with this as your walletName.
// IDs will be created as foo@testwallet.crux

export default {
  data () {
    return {
      step: 1,
      cruxKey: null,
      existingCruxID: null,
      error: false,
      errorMessage: '',
      walletClientName: 'testwallet', // should be 'verto' when in prod
      vertoPassword: this.$store.state.settings.temporary,
      loading: false,
      mapped: false,
      cruxID: null,
      cruxIDRegistered: false,
      addressMap: null,
      showMap: false,
      showAvailableCruxID: true,
      state: null,
      status: '',
      progress: 0,
      available: false,
      assets: {},
      names: [
        { 'value': 'eos', 'label': 'EOS Key - HD' },
        { 'value': 'btc', 'label': 'Bitcoin - HD' },
        { 'value': 'eth', 'label': 'Ethereum - HD' },
        { 'value': 'bnb', 'label': 'Binance Coin - HD' },
        { 'value': 'ltc', 'label': 'Litecoin - HD' },
        { 'value': 'dash', 'label': 'DASH - HD' },
        { 'value': 'steem', 'label': 'STEEM Key - HD' },
        { 'value': 'xrp', 'label': 'Ripple - HD' },
        { 'value': 'xlm', 'label': 'Stellar Lumens - HD' },
        { 'value': 'xtz', 'label': 'Tezos - HD' },
        { 'value': 'ada', 'label': 'Cardano - HD' } ]
    }
  },
  async created () {
  },
  async mounted () {
    this.$nextTick(() => {
      this.$refs.cruxID.focus()
    })

    this.cruxKey = await HD.Wallet('crux')
    console.log('crux privateKey', this.cruxKey.privateKey, 'menonic', this.$store.state.currentwallet.config.mnemonic)

    cruxClient = new CruxPay.CruxClient({
      walletClientName: this.walletClientName,
      privateKey: this.cruxKey.privateKey
      // privateKey: 'KyB21VpmpjXDTNi3DKC2ZnHJA8qYhGCMTk8FNjnXombYVDPyWXhc' //
    })

    await cruxClient.init()
    this.existingCruxID = (await cruxClient.getCruxIDState()).cruxID
    // Subdomain is queued for update and should be announced within the next few blocks.
    // Your subdomain was registered in transaction 6a24c1ad453a09a740f7792ca07f0f95cac530728cbfa35f32be6a0e0a550c01 -- it should propagate on the network once it has 6 confirmations."

    if (this.existingCruxID) {
      this.cruxIDRegistered = true
      this.addressMap = await cruxClient.getAddressMap()
      this.step = 2
      this.showMap = !!this.addressMap
      console.log('addressMap', this.addressMap, 'show?', this.showMap)
    }
  },
  computed: {
  },
  methods: {
    async register () {
      if (this.available) {
        this.loading = true
        const res = await cruxClient.registerCruxID(this.cruxID)
        console.log('response should be undef:', res)
        if (!res) {
          // Deal with: keypair is already used in registration of CruxID: 'helo@testwallet.crux'
          this.cruxIDRegistered = true
          this.existingCruxID = this.cruxID + '@' + this.walletClientName + '.crux'
          this.step = 2
          this.$nextTick(() => {
            this.putAddress()
          })
        } else {
          // this.existingCruxID = err.split('CruxID: ')[1].replace(/'/g, '')
          this.step = 2
          console.log('err', res)
        }
      }
    },
    async getAvailable () {
      if (this.cruxID.length >= 4 && this.cruxID.length <= 20) {
        this.available = await cruxClient.isCruxIDAvailable(this.cruxID)
        if (this.available) {
          this.error = false
        } else {
          this.error = true
          this.errorMessage = 'This ID is already taken'
        }
      } else {
        this.error = true
        this.errorMessage = 'Must start with a letter & length must be between 4 to 20'
      }
    },
    async putAddress () {
      this.assets = await cruxClient.getAssetMap()
      delete this.assets['ada'] // Key generation not working yet.
      delete this.assets['eos'] // Need account to be created first!
      let count = Object.keys(this.assets).length
      let map = []
      let i = 0

      for (const symbol of Object.keys(this.assets)) {
        i++
        this.progress = Math.round(i / count * 10000) / 100
        console.log('this.progress', this.progress)
        this.status = 'Creating keys for: ' + symbol
        let keys = await HD.Wallet(symbol)
        let result = await this.$configManager.saveWalletAndKey(this.names.find(o => o.value === symbol).label, this.vertoPassword, null, keys.publicKey, keys.privateKey, symbol, 'mnemonic')
        console.log('key creation', result)
        map[symbol] = { 'addressHash': keys.publicKey }
      }

      console.log('map', map)
      cruxClient.putAddressMap(map)
      await this.$configManager.backupConfig()
      this.mapped = true
    },
    async getAssets () {
      this.assets = await cruxClient.getAssetMap()
      console.log('pre assets', this.assets)

      Object.keys(this.assets).forEach(async symbol => {
        console.log('creating keys for: ', symbol)
        if (symbol === 'ada') {
          this.assets[symbol].keys = { publicKey: 'no key for ada' }
        } else {
          this.assets[symbol].keys = await HD.Wallet(symbol)
        }
      })
      console.log('post assets', this.assets)
    },
    getImages (symbol) {
      return 'https://files.coinswitch.co/public/coins/' + symbol.toLowerCase() + '.png'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.standard-content{
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh !important;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 10px;
    margin-bottom: 30px;
    word-break: break-all;
    .cruxid{
      font-size: 18px;
      font-weight: $light;
      display: block;
      background-color: rgba(black, .02);
      padding: 0px 20px;
      border-radius: 10px;
    }
  }
  &--desc{
    margin-top: -20px;
    margin-bottom: 40px;
    font-size: 18px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: $mainColor;
  }
  &--body{
    min-height: 62vh;
    .diclaimer{
      strong{
        display: block;
        font-size: 18px;
        font-family: $Titillium;
        font-weight: $bold;
        margin-bottom: 10px;
      }
    }
    &__img{
      // min-height: 200px;
      $width: 170px;
      width: $width;
      height: $width;
      border-radius: $width;
      overflow: hidden;
      margin: 0px auto;
      margin-top: -10px;
      margin-bottom: 40px;
      img{
        max-width: 100%;
      }
    }
    &__form{
      .label{
        padding-left: 21px;
        font-size: 18px;
        margin-bottom: 5px;
        display: block;
      }
      /deep/ .q-field__messages{
        font-size: 14px;
        font-weight: 600;
        color: #FFB200;
        padding-left: 11px;
      }
      /deep/ .q-field__native{
        padding-left: 8px;
        font-size: 16px;
        font-weight: $regular;
      }
      /deep/ .q-field__label{
        font-family: $Titillium;
        font-weight: $bold;
        font-size: 18px;
        padding-left: 10px;
      }
      .flex-end{
        margin-top: 30px;
      }
      .action-link{
        height: 50px;
        text-transform: initial !important;
        background-color: #7272FA !important;
        font-size: 16px;
        letter-spacing: .5px;
        border-radius: 40px;
        width: 110px;
        margin-left: 10px;
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    min-height: 50px;
    .crux-label{
      font-size: 14px;
      color: #B0B0B0;
      font-weight: $light;
      font-family: $Titillium;
    }
  }
}
.send-modal{
    &__content{
      &--body{
        /deep/ .q-circular-progress__text{
          display: none !important;
        }
        position: relative;
        .svg_logo{
          fill: #00D0CA;
          position: absolute;
          margin-top: 5px;
          width: 90px;
        }
        .--label{
          font-size: 20px;
          font-weight: $light;
          font-family: $Titillium;
          position: absolute;
          bottom: -20px;
        }
      }
      &--footer{
        .--status{
          font-size: 20px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 10px;
          text-align: center;
          margin-bottom: 70px;
        }
      }
    }
  }
</style>
