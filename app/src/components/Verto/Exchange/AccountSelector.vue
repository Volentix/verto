<template>
  <div>
    <div v-if="!chain" >
<q-btn v-if="accountOptions.length" :color="accountOption.color"  text-color="black" style="width:230px;" outline :icon="`img:${accountOption.icon}`" icon-right="fiber_manual_record" :label="accountOption.label" >
      <q-menu>
        <q-list bordered separator>
           <q-expansion-item  style="width:308px;"  dense-toggle class="chains" default-opened v-for="(tokChain, index) in chains"  :key="Math.random()+index" clickable  >
                        <template v-slot:header>
                            <q-item-section avatar>
                                <img class="coin-icon" width="25px" :src="tokChain.icon"  />
                            </q-item-section>
                            <q-item-section  class="item-name" >
                            <span class="item-name--name"> {{tokChain.label}}</span>
                            <q-item-label caption>
                            <span  class="item-name--staked" v-if="tokChain.count > 1">{{tokChain.count}} accounts</span>
                            <span   class="item-name--staked" v-else-if="tokChain.count == 1">{{getAccountLabel(tokChain)}}</span>
                            </q-item-label>

                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{nFormatter2(tokChain.chainTotal ? tokChain.chainTotal.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card class="accounts" :dark="$store.state.settings.lightMode === 'true'" dense>
                            <q-card-section>
                                <q-item  @click="accountOption = item ; setAccount(300) ;" :key="Math.random()+index"  v-for="(item, index) in tokChain.accounts"  :class="{'selected' : item.selected}" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div   class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                           <q-icon name="fiber_manual_record" :color="item.color"/>
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name" v-if="item.isEvm"> {{getAccountLabel(item)}}</span>
                                            <span class="item-name--name" v-else> {{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>
                                            <span  class="item-name--staked" v-if="item.tokenList">{{item.tokenList.length}} token{{ item.tokenList.length > 1 ? 's' : '' }}</span>
                                        </q-item-section>
                                        <q-item-section   side>
                                             <span class="item-info--amountUSD" v-if="item.total">${{nFormatter2(new Number(isNaN(item.total) ? 0 : item.total).toFixed(2),0)}}</span>
                                            <span class="item-info--amountUSD" v-else>${{nFormatter2(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>

                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                        </q-expansion-item>
        </q-list>
      </q-menu>
    </q-btn>
    <div class="text-center" v-else>No {{ chain }} account found</div>
  </div>
    <q-select
      :dark="$store.state.settings.lightMode === 'true'"
      :light="$store.state.settings.lightMode === 'false'"
      separator
      rounded
      outlined
      :color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'"
      class="select-input"
      label="Account name"
      :class="{
        'text-black': $store.state.settings.lightMode === 'false',
        'dark-input': $store.state.settings.lightMode === 'true',
      }"
      @input="setAccount(300)"
      v-model="accountOption"
      v-if="accountOptions.length && chain"
      :options="accountOptions"
    >
      <template v-slot:selected>
        <q-item
          :dark="$store.state.settings.lightMode === 'true'"
          v-if="accountOption"
          class="full-width"
        >
          <q-item-section class="q-pr-sm">
            <q-item-label
              caption
              class="ellipsis mw200 text-black flex items-center"
            >
              <q-icon
                :color="accountOption.color"
                name="fiber_manual_record"
                class="q-mr-xs"
              />
              <span
                :class="
                  $store.state.settings.lightMode === 'true' ? 'text-white' : ''
                "
                >{{ accountOption.label }}</span
              >
              <q-icon
                size="16px"
                class="q-ml-sm absolute-right"
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
            <q-item-label caption class="ellipsis mw200 q-pt-xs flex">
              <q-icon size="16px" :name="`img:${scope.opt.image}`" />
              <div style="width: 110px" class="q-pl-sm">
                {{ scope.opt.label }}
              </div>
              <q-icon
                :color="scope.opt.color"
                name="fiber_manual_record"
                :class="
                  'q-mr-sm ellipsis mw200 q-pt-xs text-' + scope.opt.color
                "
              />
              ${{ scope.opt.total ? formatNumber(scope.opt.total, 0) : 0 }}
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

  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'
export default {
  props: ['chain', 'showAllWallets', 'autoSelect'],
  data () {
    return {
      accountOptions: [],
      accountOption: null,
      chains: []
    }
  },
  created () {
    this.init()
    this.chains = this.setChains()
    this.chains = this.chains.filter(o => (!this.chain ||
          o.chain === this.chain))
  },
  methods: {
    getAccount (item) {

    },
    init (updateDefaultAccount = true) {
      let tableData = this.$store.state.wallets.tokens

      tableData.filter(
        (w) =>
          w.chain === 'eos' &&
          w.type === 'eos' &&
          (this.chain === w.chain || !this.chain) &&
          this.accountOptions.push({
            value: w.name,
            name: w.name,
            key: w.key,
            index: w.index,
            usd: w.usd,
            chain: 'eos',
            total: w.total,
            image: w.icon,
            icon: w.icon,
            type: w.type,
            label: w.name,
            color: this.getRandomColor()
          })
      )

      tableData.filter(
        (w) =>
          w.chain === 'eth' &&
          (this.chain === w.chain || !this.chain) &&
          w.type === 'eth' &&
          this.accountOptions.push({
            value: w.key,
            name: w.name,
            key: w.key,
            chain: 'eth',
            index: w.index,
            isEvm: w.isEvm,
            type: w.type,
            usd: w.usd,
            total: w.total,
            icon: w.icon,
            image: w.icon,
            label: this.getAccountLabel(w),
            color: this.getRandomColor()
          })
      )

      if (this.showAllWallets) {
        tableData.filter(
          (w, i, a) =>
            (w.chain !== 'eth' || w.isEvm) &&
            w.chain !== 'eos' &&
            a.findIndex((t) => t.key === w.key && t.chain === w.chain) === i &&
            this.accountOptions.push({
              value: w.key + '-' + w.chain,
              key: w.key,
              isEvm: w.isEvm,
              chain: w.chain,
              type: w.type,
              index: w.index,
              usd: w.usd,
              total: w.total,
              icon: w.icon,
              image: w.icon,
              name: w.name,
              label: this.getAccountLabel(w),
              color: this.getRandomColor()
            })
        )
      }
      this.accountOptions = this.accountOptions.filter((o) => o && o.name)
      if (this.$store.state.wallets.metamask.accounts.length) {
        this.accountOptions.push(
          this.$store.state.wallets.metamask.accounts.find(
            (o) => o.type === 'eth' && o.chain === 'eth'
          )
        )
      }

      this.accountOptions.sort(
        (a, b) =>
          (isNaN(parseFloat(b.total)) ? 0 : parseFloat(b.total)) -
          (isNaN(parseFloat(a.total)) ? 0 : parseFloat(a.total))
      )

      if (!updateDefaultAccount) return

      if (
        this.$store.state.currentwallet.wallet &&
        this.$store.state.currentwallet.wallet.type
      ) {
        this.accountOption = this.accountOptions.find(
          (a) =>
            a.key === this.$store.state.currentwallet.wallet.key &&
            a.chain === this.$store.state.currentwallet.wallet.chain &&
            a.name.toLowerCase() ===
              this.$store.state.currentwallet.wallet.name.toLowerCase()
        )
      } else if (
        this.$store.state.investment.defaultAccount &&
        this.$store.state.investment.defaultAccount !== undefined &&
        this.$store.state.investment.defaultAccount.name &&
        (!this.chain ||
          (this.$store.state.investment.defaultAccount.chain === this.chain &&
            this.$store.state.investment.defaultAccount.origin !== 'metamask'))
      ) {
        this.accountOption = this.accountOptions.find(
          (f) =>
            f.type === this.$store.state.investment.defaultAccount.type &&
            f.chain === this.$store.state.investment.defaultAccount.chain &&
            f.name.toLowerCase() ===
              this.$store.state.investment.defaultAccount.name.toLowerCase()
        )
      } else {
        let item = this.accountOptions.find(
          (o) =>
            (this.autoSelectChain && o.chain === this.autoSelectChain) ||
            (this.chain && o.chain === this.chain) ||
            o.chain === 'eos'
        )

        if (!item) {
          item = this.accountOptions.find(
            (o) => (this.chain && o.chain === this.chain) || o.chain === 'eth'
          )
        }

        this.accountOption = item
      }

      this.accountOptions = this.accountOptions.filter(o => (!this.chain ||
          o.chain === this.chain))

      if (!this.accountOption && this.accountOptions.length) {
        this.accountOption = this.accountOptions[0]
      }

      this.setAccount()
    },
    setAccount (time = 0) {
      setTimeout(() => {
        if (this.accountOption) {
          this.$store.commit(
            'investment/setDefaultAccount',
            this.accountOption
          )
          if (this.accountOption && this.accountOption.origin === 'metamask') {
            this.$store.commit(
              'investment/setAccountTokens',
              this.$store.state.wallets.metamask.tokens
            )
          } else {
            let tokens = this.$store.state.wallets.tokens.filter(
              (w) =>
                w.chain === this.accountOption.chain &&
                w.key === this.accountOption.key &&
                (this.accountOption.chain !== 'eos' ||
                  w.name.toLowerCase() ===
                    this.accountOption.name.toLowerCase())
            )

            this.$store.commit('investment/setAccountTokens', tokens)

            if (
              this.$store.state.currentwallet.wallet.chain &&
              this.$store.state.currentwallet.wallet.name !==
                this.accountOption.name &&
              this.$store.state.currentwallet.wallet.key !==
                this.accountOption.key
            ) {
              this.$store.commit('currentwallet/updateParams', {
                chainID: this.accountOption.chain,
                tokenID: this.accountOption.type,
                accountName: this.accountOption.name
              })
              this.$store.state.currentwallet.wallet = this.$store.state.wallets.tokens.find(
                (w) =>
                  w.chain === this.accountOption.chain &&
                  w.type === this.accountOption.type &&
                  w.name.toLowerCase() === this.accountOption.name.toLowerCase()
              )
            }
          }
        }
      }, time)
    }
  },
  watch: {
    '$store.state.wallets.tokens': {
      deep: true,
      handler (newVal, old) {
        if (newVal.length !== old.length) {
          this.accountOptions = []
          this.init(false)
          this.chains = this.setChains()
          this.chains = this.chains.filter(o => (!this.chain ||
          o.chain === this.chain))
        }
      }
    },
    '$store.state.currentwallet.wallet': function () {
      let item = this.accountOptions.find(
        (a) =>
          a.key === this.$store.state.currentwallet.wallet.key &&
          a.chain === this.$store.state.currentwallet.wallet.chain &&
          (this.$store.state.currentwallet.wallet.chain !== 'eos' ||
            (this.$store.state.currentwallet.wallet.chain === 'eos' &&
              this.$store.state.currentwallet.wallet.type !== 'verto' &&
              this.$store.state.currentwallet.wallet.name === a.name))
      )

      if (item) {
        this.setAccount()
        this.accountOption = item
      }
    },
    '$store.state.investment.defaultAccount': function (val) {
      if (!val || val.origin !== 'defi') return

      let w = this.$store.state.investment.defaultAccount

      this.accountOption = {
        value: w.key,
        isEvm: w.isEvm,
        key: w.key,
        chain: w.chain,
        usd: w.usd,
        name: w.name,
        type: w.type,
        total: w.total,
        icon: w.icon,
        image: w.icon,
        label: this.getAccountLabel(w),
        color: this.getRandomColor()
      }
      this.$store.commit(
        'investment/setAccountTokens',
        this.$store.state.wallets.tokens.filter(
          (w) =>
            w.chain === this.accountOption.chain &&
            (this.accountOption.chain !== 'eos' ||
              w.name === this.accountOption.name)
        )
      )
    },
    '$store.state.wallets.metamask': {
      deep: true,
      handler (val) {
        if (this.chain) return
        let w = val.tokens.find((a) => a.type === 'eth' && a.chain === 'eth')

        if (w) {
          this.accountOption = {
            value: w.key,
            key: w.key,
            chain: 'eth',
            isEvm: w.isEvm,
            usd: w.usd,
            type: w.type,
            total: w.total,
            image: w.icon,
            name: w.name,
            icon: w.icon,
            origin: 'metamask',
            label: this.getAccountLabel(w),
            color: this.getRandomColor()
          }
          let item = this.accountOptions.find(
            (a) => a && a.key === this.accountOption.key
          )
          if (!item) {
            this.accountOptions.push(this.accountOption)
          }
          this.setAccount()
        }
      }
    }
  },
  mixins: [Formatter]
}
</script>
<style lang="scss" scoped>
.item-info {
    max-width: 40px !important;
}
.chains:hover .accounts {
display: block;
background: #e7e8e8;
}
.chains:hover {
background: #e7e8e8;
}
.accounts {
display: none;
}
.accounts .q-card__section--vert {
    padding: 0px;
}
.select-input {
  border-radius: 100px !important;
  $height: 60px;
  height: $height;
  /deep/ .q-field__marginal {
    height: $height;
    min-height: unset;
  }
  /deep/ .q-field__control {
    height: $height;
    min-height: unset;
    .q-field__label.no-pointer-events {
      left: 15px;
      @media screen and (max-width: 1024px) {
        left: 31px;
      }
    }
    .q-field__native {
      padding-left: 0px;
      padding-top: 0px;
      padding-bottom: 0px;
      height: $height;
      min-height: unset;
      .q-item {
        padding: 0px;
        padding-left: 0px;
        min-height: $height;
        padding-bottom: 0px;
        .q-item__label--caption {
          margin-top: -35px;
        }
        .q-item__section {
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
.dark-input {
  &.select-input {
    /deep/ .q-field__control {
      .q-field__native {
        .q-item {
          .q-item__section {
            .q-item__label + .q-item__label {
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
</style>
