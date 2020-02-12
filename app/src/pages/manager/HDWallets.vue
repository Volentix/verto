<template>
  <q-page padding>
    <q-card flat class="bg-black text-center" style="width: 100%; max-width: 700px;">
    <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">
      <q-step default :name="1" :done="step>1" title="Enable new Wallet" class=" bg-black workflow-step">
        <q-card-section>
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
                <q-toggle dark color="green" v-model="item.enabled" :disable="item.inconfig" />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-pa-sm" @click="step=2" >
            <q-icon name="navigate_next" size="3.2rem" color="green"   >
              <q-tooltip>{{ $t('next') }}</q-tooltip>
            </q-icon>
          </div>
          </q-card-section>
        </q-step>
        <q-step default :name="2" :done="step>2" title="Password" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white">

              <q-item-section>
                <q-item-label>The new wallets will now be added to your config after confirming the Verto password</q-item-label>
              </q-item-section>

              <q-input
                v-model="vertoPassword"
                dark
                color="green"
                label="Verto Password"
                @input="checkVertoPassword"
                @keyup.enter="enable()"
                :type="isPwd ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            <div v-show="!!vertoPassword && !goodPassword" class="text-h6 text-uppercase text-red  q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div class="q-pa-md text-center" v-show="goodPassword" @click="enable()" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('WalletManager.submit') }}</q-tooltip>
              </q-icon>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
// import configManager from '@/util/ConfigManager'
import HD from '@/util/hdwallet'

export default {
  data () {
    return {
      step: 1,
      isPwd: true,
      goodPassword: false,
      vertoPassword: null,
      assets: {
        'verto': { 'symbol': 'EOS', 'name': 'EOS' },
        'eos': { 'symbol': 'EOS', 'name': 'EOS' },
        'btc': { 'symbol': 'BTC', 'name': 'Bitcoin' },
        'eth': { 'symbol': 'ETH', 'name': 'Ethereum' },
        'bnb': { 'symbol': 'BNB', 'name': 'Binance Coin' },
        'ltc': { 'symbol': 'LTC', 'name': 'Litecoin' },
        'dash': { 'symbol': 'DASH', 'name': 'DASH' },
        'xrp': { 'symbol': 'XRP', 'name': 'Ripple' },
        'xlm': { 'symbol': 'XLM', 'name': 'Stellar Lumens' },
        'xtz': { 'symbol': 'XTZ', 'name': 'Tezos' },
        'ada': { 'symbol': 'ADA', 'name': 'Cardano' } }
    }
  },
  async created () {
    const self = this
    this.$store.state.currentwallet.config.keys.forEach(key => {
      if (key.origin === 'mnemonic') {
        self.assets[key.type].enabled = true
        self.assets[key.type].inconfig = true
        console.log('assets', self.assets)
      }
    })
  },
  async mounted () {
  },
  computed: {
  },
  methods: {
    async enable () {
      Object.keys(this.assets).forEach(async symbol => {
        if (this.assets[symbol].enabled && !this.assets[symbol].inconfig) {
          console.log('assets', this.assets[symbol])
          const keys = await HD.Wallet(symbol)
          const result = await this.$configManager.saveWalletAndKey(this.assets[symbol].name, this.vertoPassword, null, keys.publicKey, keys.privateKey, symbol, 'mnemonic')
          console.log(result)
        }
      })
      this.$router.push({ path: '/wallet' })
    },
    async checkVertoPassword () {
      const results = await this.$configManager.getConfig(this.vertoPassword)
      if (results.success) {
        this.goodPassword = true
        this.config = results.config
      } else {
        this.goodPassword = false
        return false
      }
    },
    async getAssets () {
      // Object.keys(this.assets).forEach(async symbol => {
      //  this.assets[symbol].keys = await HD.Wallet(symbol)
      // })
    },
    getImages (symbol) {
      return 'https://files.coinswitch.co/public/coins/' + symbol.toLowerCase() + '.png'
    }
  }
}

</script>
