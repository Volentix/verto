<template>
  <q-page class="text-black bg-white">
    <div class="standard-content" style="padding-bottom: 70px">
      <div class="standard-content--body">
        <h2 class="standard-content--title">Create the Verto ID</h2>
        <div class="standard-content--body__img column flex-center">
          <img src="statics/crux_id_bg.png" alt="">
        </div>
        <div class="standard-content--body__form">
          <label class="label">choose an ID</label>
          <q-input v-model="cruxID" rounded outlined color="blue" type="text" label="example@verto.crux" hint="this is already taken." />
          <div class="flex-end flex justify-end">
            <q-btn flat class="action-link next" color="black" text-color="white" label="Next" />
          </div>
        </div>
      </div>
      <div class="standard-content--footer">
        <p class="crux-label">Powered by cruxpay.</p>
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
      cruxID: null,
      cruxIDRegistered: false,
      addressMap: null,
      showMap: false,
      showAvailableCruxID: true,
      state: null,
      status: '',
      progress: 0,
      available: false,
      assets: {}
    }
  },
  async created () {
  },
  async mounted () {
    let cruxKey = await HD.Wallet('crux')
    console.log('crux privateKey', cruxKey.privateKey, 'menonic', this.$store.state.currentwallet.config.mnemonic)

    cruxClient = new CruxPay.CruxClient({
      walletClientName: 'testwallet',
      privateKey: cruxKey.privateKey
      // privateKey: 'KyB21VpmpjXDTNi3DKC2ZnHJA8qYhGCMTk8FNjnXombYVDPyWXhc' //
    })

    await cruxClient.init()
    this.cruxID = (await cruxClient.getCruxIDState()).cruxID
    // Subdomain is queued for update and should be announced within the next few blocks.
    // Your subdomain was registered in transaction 6a24c1ad453a09a740f7792ca07f0f95cac530728cbfa35f32be6a0e0a550c01 -- it should propagate on the network once it has 6 confirmations."

    if (this.cruxID) {
      this.cruxIDRegistered = true
      this.addressMap = await cruxClient.getAddressMap()

      this.showMap = !!this.addressMap
      console.log('addressMap', this.addressMap, 'show?', this.showMap)
    }
  },
  computed: {
  },
  methods: {
    async register () {
      if (this.available) {
        cruxClient.registerCruxID(this.cruxID).then((res) => {
          // Deal with: keypair is already used in registration of CruxID: 'helo@testwallet.crux'
          this.cruxIDRegistered = true
          console.log('res', res)
        })
      }
    },
    async getAvailable () {
      this.$nextTick(async () => {
        if (!this.$refs['cruxID'].hasError) {
          this.available = await cruxClient.isCruxIDAvailable(this.cruxID)
        }
      })
    },
    async putAddress () {
      this.assets = await cruxClient.getAssetMap()
      delete this.assets['ada']
      let count = Object.keys(this.assets).length
      let map = []
      let i = 0

      Object.keys(this.assets).forEach(async symbol => {
        i++
        this.progress = Math.round(i / count * 10000) / 100
        this.status = 'creating keys for: ' + symbol
        let keys = await HD.Wallet(symbol)
        map[symbol] = { 'addressHash': keys.publicKey }
      })

      console.log('map', map)
      cruxClient.putAddressMap(map)
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
    margin-top: 40px;
    margin-bottom: 40px;
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
</style>
