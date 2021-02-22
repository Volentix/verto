<template>
  <q-select
    :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
    separator
    rounded
    outlined
    :color="$store.state.settings.lightMode === 'true' ? 'white':'black'"
    class="select-input"
    label="Account name"
    :class="{
      'text-black': $store.state.settings.lightMode === 'false',
      'dark-input': $store.state.settings.lightMode === 'true'
      }"
    @input="setAccount()"
    v-model="accountOption"
    :options="accountOptions">
    <template v-slot:selected>
      <q-item
        :dark="$store.state.settings.lightMode === 'true'"
        v-if="accountOption"
        >
        <q-item-section class="q-pr-sm">
          <q-item-label caption class="ellipsis mw200 text-black flex items-center">
            <q-icon :color="accountOption.color" name="fiber_manual_record" class="q-mr-xs" />
            <span :class="$store.state.settings.lightMode === 'true' ? 'text-white':''">{{ accountOption.label }}</span>
            <q-icon size="16px" class="q-ml-sm" :name="`img:${accountOption.image}`" />
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
      icon: w.icon,
      type: w.type,
      label: w.name,
      color: palette[this.accountOptions.length]
    }))
    tableData.filter(w => w.chain === 'eth' && (this.chain === w.chain || !this.chain) && w.type === 'eth' && this.accountOptions.push({
      value: w.key,
      name: w.name,
      key: w.key,
      chain: 'eth',
      type: w.type,
      usd: w.usd,
      total: w.total,
      icon: w.icon,
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
        icon: w.icon,
        image: w.icon,
        name: w.name,
        label: w.key.substring(0, 6).toLowerCase() + '...' + w.key.substr(w.key.length - 5).toLowerCase(),
        color: palette[this.accountOptions.length]
      }))
    }

    if (this.$store.state.wallets.metamask.accounts.length) {
      this.accountOptions.push(this.$store.state.wallets.metamask.accounts.find(o => o.type === 'eth' && o.chain === 'eth'))
    }

    if (this.$store.state.currentwallet.wallet.type) {
      this.accountOption = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain)
    } else if (this.$store.state.investment.defaultAccount) {
      this.accountOption = this.accountOptions.find(f => f.type === this.$store.state.investment.defaultAccount.type && f.chain === this.$store.state.investment.defaultAccount.chain)
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
      if (this.accountOption) {
        this.$store.commit('investment/setDefaultAccount', this.accountOption)

        if (this.accountOption && this.accountOption.origin === 'metamask') {
          this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.metamask.tokens)
        } else {
          this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === this.accountOption.chain && w.key === this.accountOption.key))
        }
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
        name: w.name,
        type: w.type,
        total: w.total,
        icon: w.icon,
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
            name: w.name,
            icon: w.icon,
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
<style lang="scss" scoped>
  .select-input{
    border-radius: 100px !important;
    $height: 50px;
    height: $height;
    /deep/ .q-field__marginal{
      height: $height;
      min-height: unset;
    }
    /deep/ .q-field__control{
      height: $height;
      min-height: unset;
      .q-field__label.no-pointer-events{
        left: 20px;
      }
      .q-field__native{
        padding-left: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        height: $height;
        min-height: unset;
        .q-item{
          padding: 0px;
          padding-left: 0px;
          min-height: $height;
          padding-bottom: 0px;
          .q-item__label--caption{
            margin-top: -35px;
          }
          .q-item__section{
            padding-right: 0px;
            min-width: 36px;
            .q-item__label + .q-item__label {
              margin-top: 0px;
            }
          }
        }
      }
    }
  }
  .dark-input{
    &.select-input{
      /deep/ .q-field__control{
        .q-field__native{
          .q-item{
            .q-item__section{
              .q-item__label + .q-item__label {
                color: #CCC;
              }
            }
          }
        }
      }
    }
  }
</style>
