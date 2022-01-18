<template>
<div :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }">
<div class="row"><div
  class="text-h6 text-bold q-pt-md q-pr-lg"
>
  <q-header v-if="$q.platform.is.mobile">
    <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
        <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="goBack()" />
        <q-toolbar-title style="margin-left: -25px"> Buy / Sell Ram  </q-toolbar-title>
    </q-toolbar>
  </q-header>
</div>
 <AccountSelector :chains="['eos']"    :chain="'eos'" class="q-pt-lg" />
 </div>

<div style="max-width:400px;">
    <q-tabs
      v-model="action"
      dense
      :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
      class="text-grey q-mt-md"
      :class="{
        'text-white': $store.state.settings.lightMode === 'true'
      }"
      :active-color="$store.state.settings.lightMode === 'true' ? 'white':'primary'"
      :indicator-color="$store.state.settings.lightMode === 'true' ? 'white':'primary'"
      align="justify"
      narrow-indicator
      >
      <q-tab name="buy" label="Buy" />
      <q-tab name="sell" label="Sell" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="action" animated>
      <q-tab-panel :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" name="buy">
        <div class="full-width">
          <p class="text-body1">Enter EOS amount</p>
          <q-radio  v-if="false" v-model="unit" val="eos" label="EOS" />
          <q-radio  v-if="false" v-model="unit" val="bytes" label="Bytes" />
          <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="sendAmount" type="number" :suffix="unit.toUpperCase()"  rounded outlined class="--input q-my-md" @input="changeAmount()" />
          Buy {{sendAmount}} EOS of RAM
           <p class=" q-pt-md text-body1">Ram Receiver</p>
          <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="receiver" type="text"   rounded outlined class="--input q-my-md" @input="changeAmount()" />

        </div>
      </q-tab-panel>
      <q-tab-panel name="sell">
        <div class="full-width">
          <p class="text-body1">Amount of RAM to Sell (Bytes)</p>
          <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="sendAmount" type="number" suffix="Bytes"  rounded outlined class="--input q-mb-md" @input="changeAmount()" />
          Selling {{sendAmount}} Bytes

        </div>
      </q-tab-panel>
    </q-tab-panels>

</div>
</div>
</template>

<script>
import AccountSelector from './Exchange/AccountSelector.vue'
export default {
  components: {
    AccountSelector
  },
  name: 'BuyEosRam',
  data () {
    return {
      action: 'buy',
      sendAmount: 0,
      bytes: 0,
      unit: 'eos',
      receiver: ''
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },

  watch: {
    '$store.state.currentwallet.wallet': function () {
      this.currentAccount = this.wallet
      this.receiver = this.wallet.name
    }
  },
  async created () {
    this.currentAccount = this.wallet
    this.receiver = this.wallet.name
  },
  methods: {
    changeAmount () {
      if (+this.sendAmount > +this.wallet.amount && this.action === 'buy' && this.unit === 'eos') {
        this.sendAmount = +this.wallet.amount
      }

      if (this.sendAmount < 0) {
        this.sendAmount = 0
      }

      if (+this.sendAmount === 0 || isNaN(this.sendAmount)) {
        this.$emit('setTxData', false)
      } else {
        this.$emit('setTxData', this.getTxData())
      }
    },
    getTxData () {
      let transactionObject = {
        actions: [{
          account: 'eosio',
          name: this.action === 'buy' ? 'buyram' : 'sellram',
          authorization: [{
            actor: this.wallet.name,
            permission: 'active'
          }],
          data: this.action === 'buy' ? {
            payer: this.wallet.name,
            receiver: this.receiver,
            quant: parseFloat(this.sendAmount).toFixed(4) + ' EOS'
          } : {
            account: this.wallet.name,
            bytes: this.sendAmount
          }
        }]
      }

      return transactionObject
    },
    goBack () {
      this.$router.push({ name: 'wallets', params: { openDialog: true } })
    }
  }
}
</script>
<style lang="scss" scoped>
.dark-theme {
  /deep/ .q-tab-panels{
    background: #04111f !important;
  }
}
</style>
