<template>
  <q-page padding class="flex flex-center text-white bg-black">
    <q-card flat class="bg-black text-center" style="width: 100%; max-width: 700px;">
    <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">
      <q-step default :name="1" :done="step>1" title="Enable new Wallet" class=" bg-black workflow-step">
        <q-card-section>
          <q-select
            dark
            label="Select Chain to add"
            separator
            v-model="selected"
            :options="assets"
          >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon :name="`img:${getImages(scope.opt.value)}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="selected"
              >
                <q-item-section avatar>
                  <q-icon :name="`img:${getImages(selected.value)}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="selected.label" />
                  <q-item-label caption>{{ selected.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>

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
      selected: null,
      assets: [
        { 'value': 'verto', 'label': 'EOS' },
        { 'value': 'eos', 'label': 'EOS' },
        { 'value': 'btc', 'label': 'Bitcoin' },
        { 'value': 'eth', 'label': 'Ethereum' },
        { 'value': 'bnb', 'label': 'Binance Coin' },
        { 'value': 'ltc', 'label': 'Litecoin' },
        { 'value': 'dash', 'label': 'DASH' },
        { 'value': 'xrp', 'label': 'Ripple' },
        { 'value': 'xlm', 'label': 'Stellar Lumens' },
        { 'value': 'xtz', 'label': 'Tezos' },
        { 'value': 'ada', 'label': 'Cardano' } ]
    }
  },
  async created () {
    const self = this
    this.$store.state.currentwallet.config.keys.forEach(key => {
      if (key.origin === 'mnemonic') {
        self.assets = self.assets.filter(function (type) {
          return type.value !== key.type
        })

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
      const keys = await HD.Wallet(this.selected.value)
      const result = await this.$configManager.saveWalletAndKey(this.selected.label, this.vertoPassword, null, keys.publicKey, keys.privateKey, this.selected.value, 'mnemonic')
      console.log(result)

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
      return 'https://files.coinswitch.co/public/coins/' + symbol + '.png'
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
