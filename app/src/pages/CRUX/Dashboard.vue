<template>
  <q-page padding>
    <q-list dark bordered separator>
      <q-item v-for="(item, index) in assets" :key="index">
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
          <q-input dark filled v-model="item.assetIdentifierValue"/>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { CruxPay } from '@cruxpay/js-sdk'

let cruxClient = new CruxPay.CruxClient({
  walletClientName: 'testwallet',
  getEncryptionKey: () => 'dummyUserPass'
})

// I have setup your symbols into a sandbox wallet named testwallet.
// You can proceed with development with this as your walletName.
// IDs will be created as foo@testwallet.crux

export default {
  data () {
    return {
      assets: null
    }
  },
  async created () {
  },
  async mounted () {
    await cruxClient.init()
    this.getAssets()
  },
  computed: {
  },
  methods: {
    async getAssets () {
      this.assets = await cruxClient.getAssetMap()
      console.log('assets', this.assets)

      let state = await cruxClient.getCruxIDState()
      console.log('state', state)
    },
    getImages (symbol) {
      return 'https://files.coinswitch.co/public/coins/' + symbol.toLowerCase() + '.png'
    }
  }
}

</script>
