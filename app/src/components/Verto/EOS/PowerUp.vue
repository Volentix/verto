<template>
<div :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }">
<div class="row">

<div
  class="text-h6 text-bold q-pt-md q-pr-lg"
>
  <q-header v-if="$q.platform.is.mobile">
    <q-toolbar  id="scrollToID3" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
        <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="goBack()" />
        <q-toolbar-title style="margin-left: -25px"> Power up </q-toolbar-title>
    </q-toolbar>
  </q-header>
</div>
 <AccountSelector :chains="['eos']"    :chain="'eos'" class="q-pt-lg" />
 </div>
<div class="row full-width">
<div class="col-md-5">
    <q-tabs
      v-model="action"
       v-if="false"
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
      <q-tab name="ressources" label="Set ressources" />
      <q-tab name="eos" label="Set EOS amount" />
    </q-tabs>
    <q-separator v-if="false" />
    <q-tab-panels v-model="action" animated>
      <q-tab-panel :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" name="ressources">
        <div class="full-width">
          <p class="text-body1">CPU required (milliseconds)</p>
          <q-input label="Enter the CPU required (milliseconds)" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="cpuAmount" type="number" suffix="ms"  rounded outlined class="--input q-my-md" @input="getRessourceData()" />
          <p class="text-body1">NET required (kb)</p>
          <q-input label="Enter the NET required (kb)" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="netAmount" type="number" suffix="kb"  rounded outlined class="--input q-my-md" @input="getRessourceData()" />
          <p class="text-body1">Receiver</p>
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
<div class="col-md-4">
  <q-list :dark="$store.state.settings.lightMode === 'true'">
      <q-item>
        <q-item-section>
          <q-item-label>CPU Fee</q-item-label>
          <q-item-label caption lines="2">{{txData.cpu_fee}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>CPU Frac</q-item-label>
          <q-item-label caption>{{txData.cpu_frac}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item v-if="cpuAmount.toString().trim().length">
        <q-item-section>
          <q-item-label>CPU</q-item-label>
          <q-item-label caption>{{cpuAmount}} milliseconds</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>Net fee</q-item-label>
          <q-item-label caption>{{txData.net_fee}}</q-item-label>
        </q-item-section>

      </q-item>

      <q-separator spaced inset />

      <q-item v-if="netAmount.toString().trim().length">
        <q-item-section>
          <q-item-label>Net </q-item-label>
          <q-item-label caption>{{netAmount}}</q-item-label>
        </q-item-section>

      </q-item>
    </q-list>
    * All these values are estimates only.
</div>
</div>
</div>
</template>

<script>
import { Resources } from '@greymass/eosio-resources'
import AccountSelector from '../Exchange/AccountSelector.vue'
export default {
  name: 'BuyEosRam',
  components: {
    AccountSelector
  },
  data () {
    return {
      action: 'ressources',
      sendAmount: 0,
      bytes: 0,
      unit: 'eos',
      receiver: '',
      cpuAmount: ' ',
      netAmount: ' ',
      txData: {
        cpu_fee: '0 EOS',
        cpu_frac: 0,
        net_fee: '0 EOS',
        net_frac: 0
      }
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
      this.getRessourceData(100)
      if (this.currentAccount) { this.receiver = this.currentAccount.name }
    }
  },
  async created () {
    this.currentAccount = this.wallet
    this.getRessourceData(100)
    if (this.currentAccount) { this.receiver = this.currentAccount.name }
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
    async getRessourceData () {
      if (this.action === 'ressources') {
        const resources = new Resources({ url: process.env[this.$store.state.settings.network].EOS_HISTORYAPI })
        const [powerupState, usage] = await Promise.all([ resources.v1.powerup.get_state(), resources.getSampledUsage() ])
        this.txData.cpu_fee = powerupState.cpu.price_per_ms(usage, this.cpuAmount)
        this.txData.cpu_frac = powerupState.cpu.frac_by_ms(usage, this.cpuAmount)
        this.txData.net_frac = powerupState.net.frac_by_bytes(usage, this.netAmount)
        this.txData.net_fee = powerupState.net.price_per_kb(usage, this.netAmount)
        this.$emit('setTxData', this.getTxData())
      }
    },
    getTxData () {
      let transactionObject = {
        actions: [{
          account: 'eosio',
          name: 'powerup',
          authorization: [{
            actor: this.currentAccount.name,
            permission: `active`
          }],
          data: {
            cpu_frac: this.txData.cpu_frac,
            days: 1,
            max_payment: ((this.txData.cpu_fee + this.txData.net_fee) * 1.6).toFixed(4) + ' EOS',
            net_frac: this.txData.net_frac,
            payer: this.currentAccount.name,
            receiver: this.receiver.trim()
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
