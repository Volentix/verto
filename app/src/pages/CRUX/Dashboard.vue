<template>
  <q-page padding>
    <div v-if="!cruxIDRegistered">
      <q-input
        dark
        filled
        ref="cruxID"
        debounce="500"
        error-message="'Must start with a letter & length must be between 4 to 20'"
        v-model="cruxID"
        @input="getAvailable()"
        :rules="[ val => val && val.length >= 4 && val.length <= 20]"
      />
      <q-item>
        <q-item-label> Available: {{ available }} </q-item-label>
      </q-item>
      <q-btn dark color="green" text-color="white" @click="register()" label="Register" :disable="!available" />
    </div>
    <div v-if="cruxIDRegistered">
      <q-item>
        <q-item-label>Registered Verto ID: {{ cruxID }} </q-item-label>
      </q-item>
      <q-circular-progress
        :value="progress"
        size="90px"
        :thickness="0.2"
        show-value
        font-size="12px"
        color="green"
        center-color="grey-8"
        track-color="transparent"
        class="q-ma-md"
      />
      <q-item>
        <q-item-label> {{ status }} </q-item-label>
      </q-item>
      <q-btn dark color="green" text-color="white" @click="putAddress()" label="Link Addresses" />
    </div>
    <div v-if="showMap">
      <q-list dark bordered separator>
        <q-item v-for="(item, index) in addressMap" :key="index">
          <q-item-section avatar>
            <q-avatar>
              <img :src="getImages(item.symbol)">
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-2">
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption>{{ item.symbol }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <!-- q-input dark filled v-model="item.keys.publicKey"/ -->
            <q-item-label>{{ item.keys.publicKey }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
      walletClientName: 'verto'
      // privateKey: cruxKey.privateKey
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

<style lang="stylus" scoped>
.custom-menu {
  background: #424242
}
.q-item__label {
  color: #ffffff;
}
.q-item__label--caption {
  color: #848484;
}
</style>
