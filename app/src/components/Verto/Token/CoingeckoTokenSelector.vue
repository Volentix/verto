<template>

       <q-dialog :dark="$store.state.settings.lightMode === 'true'" v-model="dialog" :maximized="$q.platform.is.mobile">
        <q-card :dark="$store.state.settings.lightMode === 'true'" style="width:350px;">
          <div
            id="id-svk40f"
            role="dialog"
            tabindex="-1"
            aria-modal="true"
            data-dialog="true"
            class="_2ml_U"
            aria-label="Select token to send"
            :style=" $q.platform.is.mobile ? 'height: 100%; max-width: 450px; border-radius: 12px; overflow: hidden; ' : 'height: 470px; max-width: 450px; border-radius: 12px; overflow: hidden; '"
          >
            <div class="_1_oPM">
              <div
                kind="h/5_sb"
                color="currentColor"
                class="UIText-sc-96tl0y-0 iwPgYG"
                style="text-align: center"
              >
                Select Tokens
              </div>
              <button
                type="button"
                aria-label="close"
                @click="dialog = false"
                class="UnstyledButton-sc-1d365uh-0 iiKClY"
                style="position: absolute; right: 20px; top: 20px"
              >
                <svg viewBox="0 0 24 24" fill="none" style="width: 24px">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.66 4.34a1.16 1.16 0 00-1.642 0l-6.02 6.02-6.016-6.017A1.16 1.16 0 104.34 5.984l6.017 6.018-6.017 6.017a1.16 1.16 0 001.641 1.642L12 13.643l6.02 6.02a1.16 1.16 0 001.641-1.642l-6.02-6.02 6.02-6.019a1.16 1.16 0 000-1.641z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="_149f3"></div>
            <div style="display: flex; flex-direction: column; flex-grow: 1">
              <div class="AssetSelect__Padding-sc-2uja83-0 fAsUxA">
                <div
                  height="12px"
                  width="auto"
                  class="Spacer__SpacerElement-sc-6ie5tt-0 jIsCjR"
                ></div>
                <div class="SearchInput__Wr-sc-15wgvpl-3 kfsUqO">
                  <q-input :dark="$store.state.settings.lightMode === 'true'" v-model="searchVal" :label="options.length == optionsUnfiltered.length ? 'Search '+options.length+'+ tokens' : 'Result: '+options.length+' tokens'" dense filled @input="mobileFilter()">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div
                  height="20px"
                  width="auto"
                  class="Spacer__SpacerElement-sc-6ie5tt-0 cOuiNY"
                ></div>
              </div>
              <q-scroll-area
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
                style="height: 100%"
                id="scroll-area-with-virtual-scroll-1"
              >
                <q-virtual-scroll
                  scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
                  :items="options"
                  :virtual-scroll-item-size="42"
                >
                  <template v-slot="{ item, index }">
                    <q-item
                      :key="index"

                      clickable
                      @click="selectToken(item)"
                    >
                      <q-item-section side v-if="item.icon">
                        <q-avatar rounded>
                            <img  :src="item.icon" style="max-width: 40px" alt="image" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{item.type.toUpperCase()}}</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                      <q-item-label caption>{{getChainLabel(item.chain)}}</q-item-label>
                    </q-item-section>
                    </q-item>
                  </template>
                </q-virtual-scroll>
                <p v-if="options.filter(o => o.type.includes(searchVal.trim()) || !searchVal.trim().length).length == 0" class="q-pl-md">No assets found</p>
              </q-scroll-area>
            </div>
            <div class="_1BCaw" style="background-color: var(--zeric10)"></div>
          </div>
        </q-card>
      </q-dialog>

</template>

<script>
// import configManager from '@/util/ConfigManager'
// import { VTextMarquee } from 'vue-text-marquee'

import Formatter from '@/mixins/Formatter'

import Lib from '@/util/walletlib'

export default {
  name: 'CoingeckoTokenSelector',
  mixins: [Formatter],
  components: {

  },
  props: ['openSearch', 'chains'],
  data () {
    return {
      dialog: true,
      optionsUnfiltered: [],

      searchVal: '',
      barStyle: {
        right: '2px',
        borderRadius: '14px',
        backgroundColor: '#BCC2C7',
        width: '14px',
        opacity: 0.2,
        marginTop: '-3px',
        marginBottom: '-3px',
        paddingTop: '3px',
        paddingBottom: '3px'
      },
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#C7CBCE',
        width: '8px',
        opacity: 0.75
      },
      options: []

    }
  },
  created () {
    this.getTokens()
  },
  watch: {
    '$store.state.tokens.list': function () {
      this.getTokens()
    }
  },
  methods: {
    selectToken (asset) {
      console.log('seletcToken ROUTE Push ', asset)
      // if (asset.value) {
      setTimeout(() => {
        this.options = this.optionsUnfiltered
        this.searchVal = ''

        this.$router.push({
          name: this.getPageName('token'),
          path: '/verto/token/' + asset.chain + '/' + asset.value,
          params: {
            asset: asset
          }
        })
        this.$emit('update:openSearch', false)
      }, 300)
      // }
    },

    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.optionsUnfiltered
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.optionsUnfiltered.filter(v => v.value.toLowerCase().indexOf(needle) > -1).sort(function (a, b) {
          return a.value.length - b.value.length
        })
      })
    },
    mobileFilter () {
      const needle = this.searchVal.toLowerCase()
      if (needle.length > 0) {
        this.options = this.optionsUnfiltered.filter(v => v.value.toLowerCase().indexOf(needle) > -1).sort(function (a, b) {
          return a.value.length - b.value.length
        })
      } else this.options = this.optionsUnfiltered
    },
    getTokens () {
      if (!this.$store.state.tokens.list || !this.$store.state.tokens.list.length) return
      let top20 = ['btc', 'eth', 'ada', 'usdt', 'bnb', 'xrp', 'doge', 'usdc', 'dot', 'uni', 'sol', 'ltc', 'bch', 'busd', 'link', 'matic', 'icp', 'wbtc', 'xlm', 'etc'].reverse()
      let options = [{
        label: 'Ethereum',
        value: 'eth',
        chain: 'eth',
        type: 'eth',
        coinGeckoId: 'ethereum',
        icon: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
      } ]

      this.$store.state.tokens.list.filter(t => {
        let chains = Object.keys(t.platforms)
        if (chains && chains.length) {
          let chain = chains.find(a => a === 'ethereum')
          chain = chain || chains[0]
          chain = Lib.getCoingeckoChain(chain)

          if (chain === 'eth' && t.platforms.ethereum.length) {
            // let image = Lib.getTokenImage(t.symbol.toLowerCase())
            // if (!image) return
            options.push({
              label: t.name,
              icon: 'https://token.enzyme.finance//' + t.platforms.ethereum,
              value: t.symbol.toLowerCase(),
              chain: chain,
              coinGeckoId: t.id,
              type: t.symbol.toLowerCase()
            })
          }
        }
      })
      options = options.filter((e, i, a) => a.findIndex(j => j.value === e.value) === i).sort(function (a, b) {
        return top20.indexOf(b.type) - top20.indexOf(a.type)
      })
      this.options = options
      this.optionsUnfiltered = options

      if (this.$q.platform.is.mobile) {
        this.options = options.filter((item, idx) => idx < 100)
        setTimeout(() => {
          this.options = options
        }, 100)
      }
      /*
      console.log(a, 'a', this.$store.state.tokens.list) */
    }

  },
  destroyed () {
    clearInterval(this.interval)
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.select-token /deep/ .q-menu {
  max-width: 100px !important;
  min-width: 50px !important;
}
/deep/ .select-token {
  border-radius: 100px !important;
}
/deep/ .select-token .q-field__control,
/deep/ .select-token .q-field__native {
  border-radius: 100px !important;
}
.menu-top-wrapper {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  $height: 60px;
  height: $height;
  // background-color: #fff;
  background: #e7e8e8;
  z-index: 9;
  // @extend .shad;
  .row {
    .col {
      height: $height;
      &.menu {
        position: relative;
        right: -45px;
        a {
          font-weight: $regular;
          font-family: $Titillium;
          font-size: 16px;
          color: #333;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 5px;

          &:hover {
            background-color: rgba(black, 0.02);
          }
        }
      }

      &.app-logo {
        svg {
          fill: #000;
        }
        a {
          font-weight: $bold;
          text-transform: uppercase;
          font-family: $Titillium;
          font-size: 20px;
          color: #333;
          text-decoration: none;
        }
      }

      cursor: pointer;
      position: relative;
    }
  }
  &.dark-theme {
    .select-input{
      font-size: 16px;
      font-weight: $light;
      font-family: $Franklin;
      .text-black{
        color: #FFF !important;
      }
    }
    background: #04111f;
    .date-scrolling-msg {
      .date {
        color: #fff;
      }
    }
    .row {
      .col {
        &.app-logo {
          svg {
            fill: #fff;
          }
        }
        &.menu {
          a {
            color: #fff;
          }
        }
        &.app-logo {
          a {
            color: #fff;
          }
        }
      }
    }
  }
}

.reverse {
  transform: scaleX(-1);
}
.date-scrolling-msg {
  /deep/ .v-marquee {
    max-width: 360px;
    margin-left: 20px;
  }
}
.select-input{
  font-size: 16px;
  font-weight: $light;
  font-family: $Franklin;
}
.q-item--dark{
  .text-black{
    color: #FFF !important;
  }
}
.q-list--dark{
  background: #050a10;
  border-radius: 0px;
}
.main_portfolio{
  margin-top: -12px;
  margin-left: -65px;
  h3{
    font-size: 14px;
    font-weight: $regular;
  }
  h2{
    font-size: 16px;
    font-weight: $bold;
  }
}

._2ml_U {
  background-color: var(--zericWhite);
  border-radius: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.focus-not-visible ._2ml_U {
  outline: none;
}
@media (max-width: 768px) {
  ._2ml_U {
    border-radius: 0;
    width: 100%;
    max-width: initial;
    height: 100vh;
  }
}
._1_oPM {
  position: relative;
  --horizontal-padding: var(--header-horizontal-padding, 54px);
  padding-left: var(--horizontal-padding);
  padding-right: var(--horizontal-padding);
  padding-top: 18px;
  padding-bottom: 18px;
}
._149f3 {
  background-color: var(--zeric10);
  height: 1px;
  flex-shrink: 0;
}
._3CxWb > * {
  box-shadow: 0 4px 18px rgba(7, 7, 22, 0.2);
  max-width: 610px;
  max-height: 100%;
}
@media (max-width: 768px) {
  ._3lhyU > * {
    height: 100%;
  }
}
._1BCaw {
  width: 100%;
  height: 1px;
  background-color: var(--frame-border-color, currentColor);
}
/*! CSS Used from: Embedded */
.ehgTIN {
  height: 36px;
  width: 36px;
}
.gJTQkQ {
  display: block;
  height: 100%;
  width: 100%;
}
.cNZEJa {
  font-family: Graphik, sans-serif;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background: var(--zeric10);
  line-height: 16px;
  color: var(--zeric80);
  font-weight: 500;
  font-size: 10px;
}
.bhdSQn {
  font-family: inherit;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: initial;
}
.jYYAZx {
  vertical-align: bottom;
}
.khcNgA {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: currentcolor;
      margin-top: -14px;
    text-align: right;
}
.iwPgYG {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: currentcolor;
}
.jIsCjR {
  height: 12px;
  width: auto;
}
.IaLFF {
  height: 16px;
  width: auto;
}
.cOuiNY {
  height: 20px;
  width: auto;
}
.iiKClY {
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  border: none;
  background: transparent;
  color: currentcolor;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  line-height: inherit;
}
.focus-not-visible .iiKClY {
  outline: none;
}
.iPFffQ {
  display: grid;
  gap: 4px;
  grid-template-columns: minmax(0px, auto);
}
.iPFffM {
  display: grid;
  gap: 0px;
  grid-template-columns: minmax(0px, auto);
}
.icuFOW {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  gap: 4px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
}
.iXubSr {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  gap: 8px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: initial;
  justify-content: initial;
}
.cqCjKr {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: currentcolor;
  word-break: break-word;
}
.fzDPir {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: var(--zeric60);
  word-break: break-word;
}
.MYSLu {
  appearance: none;
  display: block;
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--zeric05);
  color: var(--zeric100);
  outline: none;
  padding-left: 44px;
  padding-right: 44px;
  font-family: Graphik;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
@media (hover: hover) {
  .MYSLu:hover {
    border-color: var(--zeric10);
    background-color: var(--zericWhite);
  }
}
.MYSLu:focus {
  background-color: var(--zericWhite);
  border-color: var(--zeric10);
  box-shadow: rgba(16, 36, 87, 0.12) 0px 8px 28px;
}
.gZTczu {
  pointer-events: none;
  position: absolute;
  display: block;
  left: 12px;
  top: 6px;
  color: var(--zeric60);
}
.kfsUqO {
  position: relative;
}
.RUBUj {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
}
.RUBUj .ps {
  overflow-anchor: none;
  touch-action: auto;
  overflow: auto !important;
}
.RUBUj .ps__rail-x {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear 0s, opacity 0.2s linear 0s;
  height: 15px;
  bottom: 0px;
  position: absolute;
}
.RUBUj .ps__rail-y {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear 0s, opacity 0.2s linear 0s;
  width: 15px;
  right: 0px;
  position: absolute;
}
.RUBUj .ps--active-y > .ps__rail-y {
  display: block;
  background-color: transparent;
}
.RUBUj .ps:hover > .ps__rail-x,
.RUBUj .ps:hover > .ps__rail-y {
  opacity: 0.6;
}
.RUBUj .ps .ps__rail-x:hover,
.RUBUj .ps .ps__rail-y:hover,
.RUBUj .ps .ps__rail-x:focus,
.RUBUj .ps .ps__rail-y:focus {
  background-color: rgb(238, 238, 238);
  opacity: 0.9;
}
.RUBUj .ps__thumb-x {
  background-color: rgb(170, 170, 170);
  border-radius: 6px;
  transition: background-color 0.2s linear 0s, height 0.2s ease-in-out 0s;
  height: 6px;
  bottom: 2px;
  position: absolute;
}
.RUBUj .ps__thumb-y {
  background-color: rgb(170, 170, 170);
  border-radius: 6px;
  transition: background-color 0.2s linear 0s, width 0.2s ease-in-out 0s;
  width: 6px;
  right: 2px;
  position: absolute;
}
.RUBUj .ps__rail-x:hover > .ps__thumb-x,
.RUBUj .ps__rail-x:focus > .ps__thumb-x {
  background-color: rgb(153, 153, 153);
  height: 11px;
}
.RUBUj .ps__rail-y:hover > .ps__thumb-y,
.RUBUj .ps__rail-y:focus > .ps__thumb-y {
  background-color: rgb(153, 153, 153);
  width: 11px;
}
@media not all, not all {
  .RUBUj .ps {
    overflow: auto !important;
  }
}
.RUBUj .ps .ps__rail-y {
  right: 0px;
  background: rgb(255, 255, 255);
}
.RUBUj .ps .ps__rail-y:hover,
.RUBUj .ps .ps__rail-y:focus {
  width: 14px;
  background: rgb(255, 255, 255);
}
.RUBUj .ps .ps__rail-y > .ps__thumb-y {
  background: rgba(132, 133, 143, 0.3);
  border-radius: 8px;
  width: 6px;
  right: 4px;
}
.RUBUj .ps .ps__rail-y:hover > .ps__thumb-y,
.RUBUj .ps .ps__rail-y:focus > .ps__thumb-y {
  background: rgba(132, 133, 143, 0.3);
}
.RUBUj .ps > .ps__rail-x,
.RUBUj .ps > .ps__rail-y,
.RUBUj .ps:hover > .ps__rail-x,
.RUBUj .ps:hover > .ps__rail-y {
  opacity: 1;
}
.kfPoNl {
  height: 100%;
  flex: 1 1 0%;
}
.hnbMXD {
  position: relative;
  overflow: unset;
}
.fAsUxA {
  padding-left: 20px;
  padding-right: 20px;
}
.gAlxcT {
  cursor: pointer;
  padding: 0px 12px;
  margin: 0px 8px;
  border: none;
  background: transparent;
  color: currentcolor;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  line-height: inherit;
  border-radius: 8px;
}
.focus-not-visible .gAlxcT {
  outline: none;
}
@media (hover: hover) {
  .gAlxcT:hover {
    background-color: var(--zeric05);
  }
}
.gAlxcT:active {
  background-color: var(--zeric10);
}

._34zH_ {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
}
._34zH_:hover {
  background-color: var(--zeric05);
}
.rounded {
border-radius: 50%;
}
button:hover {
  background: #f2f2f2 !important;
}

.q-dialog .q-card.q-card--dark.q-dark button:hover {
  background: #0e1829 !important;
}
</style>
