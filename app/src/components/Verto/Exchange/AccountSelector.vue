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
                    <q-item-label caption class="ellipsis mw200 q-pt-xs text-black"><q-icon :color="accountOption.color" name="fiber_manual_record"  class="q-mr-sm" /> {{ accountOption.label }} <q-icon
                     size="16px"
                    :name="`img:${accountOption.image}`"
                  />
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
                   <q-item-label caption class="ellipsis mw200 q-pt-xs flex"> <q-icon
                     size="16px"
                    :name="`img:${scope.opt.image}`"
                  />  <div style="width:110px" class="q-pl-sm">{{ scope.opt.label }}</div> <q-icon :color="scope.opt.color" name="fiber_manual_record"  :class="'q-mr-sm ellipsis mw200 q-pt-xs text-'+scope.opt.color" /> ${{ scope.opt.total ? scope.opt.total.toFixed(2) : 0 }}
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
const palette = ['cyan', 'teal', 'light-blue', 'blue-1', 'pink', 'purple']
export default {
  props: ['chain', 'showAllWallets'],
  data () {
    return {
      accountOptions: [],
      accountOption: null
    }
  },
  created () {
    let tableData = this.$store.state.wallets.tokens

    tableData.filter(w => w.chain === 'eos' && w.type === 'eos' && (this.chain === w.chain || !this.chain) && this.accountOptions.push({
      value: w.name,
      name: w.name,
      key: w.key,
      usd: w.usd,
      chain: 'eos',
      total: w.total,
      image: w.icon,
      type: w.type,
      label: w.name,
      color: palette[this.accountOptions.length]
    }))
    tableData.filter(w => w.chain === 'eth' && (this.chain === w.chain || !this.chain) && w.type === 'eth' && this.accountOptions.push({
      value: w.key,
      key: w.key,
      chain: 'eth',
      type: w.type,
      usd: w.usd,
      total: w.total,
      image: w.icon,
      label: w.key.substring(0, 6) + '...' + w.key.substr(w.key.length - 5),
      color: palette[this.accountOptions.length]
    }))

    if (this.showAllWallets) {
      tableData.filter(w => w.chain !== 'eth' && w.chain !== 'eos' && this.accountOptions.push({
        value: w.key,
        key: w.key,
        chain: w.chain,
        type: w.type,
        usd: w.usd,
        total: w.total,
        image: w.icon,
        label: w.key.substring(0, 6).toLowerCase() + '...' + w.key.substr(w.key.length - 5).toLowerCase(),
        color: palette[this.accountOptions.length]
      }))
    }

    if (this.$store.state.wallets.metamask.accounts.length) {
      this.accountOptions.push(this.$store.state.wallets.metamask.accounts.find(o => o.type === 'eth' && o.chain === 'eth'))
    }
    /*  console.log(55774, this.$store.state.currentwallet.wallet.type)
    if (this.$store.state.currentwallet.wallet.type) {
      this.accountOption = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain)
    } else */ if (this.$store.state.investment.defaultAccount) {
      this.accountOption = this.$store.state.investment.defaultAccount
    } else {
      this.accountOption = this.accountOptions.find(o => o.chain === 'eth')
    }

    this.setAccount()
  },
  methods: {
    formatNumber (num, decimals = 4) {
      return parseFloat(num).toFixed(decimals).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    },
    setAccount () {
      // console.log(this.accountOption, this.accountOption.chain, ' this.accountOption', this.$store.state.investment.defaultAccount.chain)
      this.$store.commit('investment/setDefaultAccount', this.accountOption)

      if (this.accountOption.origin && this.accountOption.origin === 'metamask') {
        this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.metamask.tokens)
      } else {
        this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === this.accountOption.chain && w.key === this.accountOption.key))
      }
    }
  },
  watch: {
    '$store.state.currentwallet.wallet': function () {
      this.accountOption = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain)
      this.setAccount()
    },
    '$store.state.investment.defaultAccount': function () {
      let w = this.$store.state.investment.defaultAccount
      this.accountOption = {
        value: w.key,
        key: w.key,
        chain: w.chain,
        usd: w.usd,
        type: w.type,
        total: w.total,
        image: w.icon,
        origin: 'metamask',
        label: w.label,
        color: palette[this.accountOptions.length]
      }
      this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === this.accountOption.chain && w.key === this.accountOption.key))
    },
    '$store.state.wallets.metamask': {
      deep: true,
      handler (val) {
        let w = val.tokens.find(a => a.type === 'eth' && a.chain === 'eth')

        if (w) {
          this.accountOption = {
            value: w.key,
            key: w.key,
            chain: 'eth',
            usd: w.usd,
            type: w.type,
            total: w.total,
            image: w.icon,
            origin: 'metamask',
            label: w.key.substring(0, 6) + '...' + w.key.substr(w.key.length - 5),
            color: palette[this.accountOptions.length]
          }
          let item = this.accountOptions.find(a => a.key === this.accountOption.key)
          if (!item) { this.accountOptions.push(this.accountOption) }
          this.setAccount()
        }
      }
    }
  }
}
</script>
