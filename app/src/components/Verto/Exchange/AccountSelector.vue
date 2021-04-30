<template>
<div>
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
    v-if="accountOptions.length"
    :options="accountOptions">
    <template v-slot:selected>
      <q-item
        :dark="$store.state.settings.lightMode === 'true'"
        v-if="accountOption"
        class="full-width"
        >
        <q-item-section class="q-pr-sm">
          <q-item-label caption class="ellipsis mw200 text-black flex items-center">
            <q-icon :color="accountOption.color" name="fiber_manual_record" class="q-mr-xs" />
            <span :class="$store.state.settings.lightMode === 'true' ? 'text-white':''">{{ accountOption.label }}</span>
            <q-icon size="16px" class="q-ml-sm absolute-right" :name="`img:${accountOption.image}`" />
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
        />  <div style="width:110px" class="q-pl-sm">{{ scope.opt.label }}</div> <q-icon :color="scope.opt.color" name="fiber_manual_record"  :class="'q-mr-sm ellipsis mw200 q-pt-xs text-'+scope.opt.color" /> ${{ scope.opt.total ? formatNumber(scope.opt.total, 0) : 0 }}
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
  <div class="text-center" v-else>No {{chain}} account found</div>
  </div>
</template>
<script>
const palette = ['cyan', 'teal', 'light-blue', 'blue-1', 'pink', 'purple']
import Formatter from '@/mixins/Formatter'
export default {
  props: ['chain', 'showAllWallets', 'autoSelect'],
  data () {
    return {
      accountOptions: [],
      accountOption: null
    }
  },
  created () {
    this.init()
  },
  methods: {
    init (updateDefaultAccount = true) {
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

      this.accountOptions.sort((a, b) => (isNaN(parseFloat(b.total)) ? 0 : parseFloat(b.total)) - (isNaN(parseFloat(a.total)) ? 0 : parseFloat(a.total)))

      if (!updateDefaultAccount) return
      if (this.$store.state.currentwallet.wallet && this.$store.state.currentwallet.wallet.type) {
        this.accountOption = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain && a.name.toLowerCase() === this.$store.state.currentwallet.wallet.name.toLowerCase())
      } else if (this.$store.state.investment.defaultAccount && this.$store.state.investment.defaultAccount !== undefined && (!this.chain || this.$store.state.investment.defaultAccount.chain === this.chain)) {
        this.accountOption = this.accountOptions.find(f => f.type === this.$store.state.investment.defaultAccount.type && f.chain === this.$store.state.investment.defaultAccount.chain && f.name.toLowerCase() === this.$store.state.investment.defaultAccount.name.toLowerCase())
      } else {
        let item = this.accountOptions.find(o => (this.autoSelectChain && o.chain === this.autoSelectChain) || (this.chain && o.chain === this.chain) || o.chain === 'eos')

        if (!item) {
          item = this.accountOptions.find(o => (this.chain && o.chain === this.chain) || o.chain === 'eth')
        }

        this.accountOption = item
      }
      this.setAccount()
    },
    setAccount () {
      if (this.accountOption) {
        this.$store.commit('investment/setDefaultAccount', this.accountOption)
        if (this.accountOption && this.accountOption.origin === 'metamask') {
          this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.metamask.tokens)
        } else {
          let tokens = this.$store.state.wallets.tokens.filter(w => w.chain === this.accountOption.chain && w.key === this.accountOption.key && (this.accountOption.chain !== 'eos' || w.name.toLowerCase() === this.accountOption.name.toLowerCase()))

          this.$store.commit('investment/setAccountTokens', tokens)
        }
      }
    }
  },
  watch: {
    '$store.state.wallets.tokens': {
      deep: true,
      handler (newVal, old) {
        if (newVal.length !== old.length) {
          this.accountOptions = []
          this.init(false)
        }
      }
    },
    '$store.state.currentwallet.wallet': function () {
      let item = this.accountOptions.find(a => a.key === this.$store.state.currentwallet.wallet.key && a.chain === this.$store.state.currentwallet.wallet.chain && (this.$store.state.currentwallet.wallet.chain !== 'eos' || (this.$store.state.currentwallet.wallet.chain === 'eos' && this.$store.state.currentwallet.wallet.type !== 'verto' && this.$store.state.currentwallet.wallet.name === a.name)))

      if (item) {
        this.setAccount()
        this.accountOption = item
      }
    },
    '$store.state.investment.defaultAccount': function (val) {
      if (!val || val.origin !== 'defi') return
      console.log(val, 'origin')
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
        label: w.label,
        color: palette[this.accountOptions.length]
      }
      this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === this.accountOption.chain && (this.accountOption.chain !== 'eos' || w.name === this.accountOption.name)))
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
  },
  mixins: [Formatter]
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
        left: 15px;
        @media screen and (max-width: 1024px) {
          left: 31px;
        }
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
