<template>
<div>
<div
  class="text-h6 text-bold q-pt-md"
>
  Buy / Sell Ram
</div>
<div style="max-width:400px;">
<q-tabs
    v-model="action"
    dense
    :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
    class="text-grey q-mt-md"
    active-color="primary"
    indicator-color="primary"
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

export default {
  name: 'BuyEosRam',
  data () {
    return {
      action: 'buy',
      sendAmount: 0,
      bytes: 0,
      unit: 'eos'
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },
  async created () {
    this.currentAccount = this.wallet
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
            receiver: this.wallet.name,
            quant: parseFloat(this.sendAmount).toFixed(4) + ' EOS'
          } : {
            account: this.wallet.name,
            bytes: this.sendAmount
          }
        }]
      }

      return transactionObject
    }
  }
}
</script>
