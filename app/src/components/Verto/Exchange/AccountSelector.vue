<template>
 <q-select

            :dark="$store.state.settings.lightMode === 'true'"

            filled
            dense
            color="white"
             style="max-width:200px"
            :class="{'bg-indigo-1 text-black': $store.state.settings.lightMode === 'false'}"
            @input="setAccount()"
            v-model="accountOption"
            :options="accountOptions">
              <template v-slot:selected>
                <q-item
                  :dark="$store.state.settings.lightMode === 'true'"
                  v-if="accountOption"
                  dense >

                  <q-item-section class="q-pr-sm">
                    <q-item-label caption class="ellipsis mw200 q-pt-xs text-black"><q-icon :color="accountOption.color" name="fiber_manual_record"  class="q-mr-sm" /> {{ accountOption.label }}
                    </q-item-label>
                   </q-item-section>
                </q-item>

              </template>
              <template v-slot:option="scope">
                <q-item
                  class="custom-menu"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"

                >

                  <q-item-section>
                   <q-item-label caption class="ellipsis mw200 q-pt-xs "> <q-icon

                    :name="`img:${scope.opt.image}`"
                  />  {{ scope.opt.label }}
                    </q-item-label>
                   <q-item-label caption :class="'ellipsis mw200 q-pt-xs text-'+scope.opt.color"><q-icon :color="scope.opt.color" name="fiber_manual_record"  class="q-mr-sm" />- ${{ scope.opt.total.toFixed(2)  }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <!-- <template v-slot:append>
                  <q-avatar>
                      <img src="https://www.volentix.io/statics/icons_svg/svg_logo.svg">
                  </q-avatar>
              </template> -->
            </q-select>
</template>
<script>
export default {
  props: ['chain'],
  data () {
    return {
      accountOptions: [],
      accountOption: null
    }
  },
  created () {
    var palette = ['cyan', 'teal', 'light-blue', 'blue-1', 'pink', 'purple', '#FC9D9A', '#F9CDAD', '#C8C8A9', '#83AF9B']
    let tableData = this.$store.state.wallets.tokens

    tableData.filter(w => w.chain === 'eos' && w.type === 'eos' && (this.chain === w.chain || !this.chain) && this.accountOptions.push({
      value: w.name,
      name: w.name,
      key: w.key,
      usd: w.usd,
      chain: 'eos',
      total: w.total,
      image: w.icon,
      label: w.name,
      color: palette[this.accountOptions.length]
    }))
    tableData.filter(w => w.chain === 'eth' && (this.chain === w.chain || !this.chain) && w.type === 'eth' && this.accountOptions.push({
      value: w.key,
      key: w.key,
      chain: 'eth',
      usd: w.usd,
      total: w.total,
      image: w.icon,
      label: w.key.substring(0, 6) + '...' + w.key.substr(w.key.length - 5),
      color: palette[this.accountOptions.length]
    }))
    console.log('ref', this.accountOptions, this.accountOption, this.chain)
    if (this.$store.state.currentwallet.wallet.type) {
      this.accountOption = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain)
    } else if (this.$store.state.investment.defaultAccount) {
      this.accountOption = this.$store.state.investment.defaultAccount
    } else {
      this.accountOption = this.accountOptions[0]
    }
    this.setAccount()
  },
  methods: {
    formatNumber (num, decimals = 4) {
      return parseFloat(num).toFixed(decimals).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    },
    setAccount () {
      console.log(this.accountOption, 1)
      this.$store.commit('investment/setDefaultAccount', this.accountOption)
      this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === this.accountOption.chain && w.key === this.accountOption.key))
    }
  },
  watch: {
    '$store.state.currentwallet.wallet': function () {
      this.accountOption = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain)
      this.setAccount()
    }
  }
}
</script>
