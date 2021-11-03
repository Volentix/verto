<template>
  <q-dialog :dark="$store.state.settings.lightMode === 'true'" v-model="alert" :maximized="$q.platform.is.mobile||$isbex">
    <q-card :dark="$store.state.settings.lightMode === 'true'" :style="!($q.platform.is.mobile||$isbex) ? 'width:380px;': ''">
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
            Select token
          </div>
          <button
            type="button"
            aria-label="close"
            @click="alert = false"
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
              <q-input :dark="$store.state.settings.lightMode === 'true'" v-model="searchVal" label="Search assets" dense filled >
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
          <div class="Scrollable__Wr-sc-1haiovs-0 RUBUj">
            <div class="Scrollable__ContainerWr-sc-1haiovs-1 kfPoNl">
              <div
                class="Scrollable__Container-sc-1haiovs-2 hnbMXD ps ps--active-y"
                :style="$q.platform.is.mobile ? 'height: 100vh; padding-right: 14px' : 'height: 620px; padding-right: 14px'"
              >
               <div class="VStack-sc-1vdo21d-0 iPFffM" style="padding-bottom:200px;">
                <button
                  class="
                    UnstyledButton-sc-1d365uh-0
                    AssetSelect__AssetOption-sc-2uja83-1
                    gAlxcT
                    _34zH_
                  "
                  @click="selectToken(token)"
                  :key="index"
                  v-for="(token , index) in tokens.filter(o => o.type.includes(searchVal.trim()) || !searchVal.trim().length)"
                  >
                    <div class="shared__HStack-sc-1qg837v-1 icuFOW">
                      <div class="shared__HStack-sc-1qg837v-1 iXubSr">
                        <div size="36" class="TokenIcon__Wr-sc-1tdh4mp-0 ehgTIN">
                          <img width="36"  :src="token.icon" class="rounded" onerror="this.src='https://etherscan.io/images/main/empty-token.png';"/>
                        </div>
                        <div class="VStack-sc-1vdo21d-0 iPFffQ">
                          <div
                            kind="subtitle/m_med"
                            color="currentColor"
                            class="
                              UIText-sc-96tl0y-0
                              BreakWordText-sc-1s64evs-0
                              cqCjKr
                            "
                          >
                            <span style="white-space: nowrap" class="text-bold"
                              >{{token.type.toUpperCase()}} <span style="vertical-align: middle"></span
                            ></span>
                          </div>
                          <div
                            kind="subtitle/m_reg"
                            color="var(--zeric60)"
                            class="
                              UIText-sc-96tl0y-0
                              BreakWordText-sc-1s64evs-0
                              fzDPir
                            "
                          >
                            <span  class="text-caption" style="cursor: pointer"
                              ><span class="TokenValue__Value-sc-1yym8iz-0 bhdSQn"
                                >{{formatNumber(token.amount, 2)}}</span
                              >&nbsp;<span
                                class="TokenValue__Text-sc-1yym8iz-1 jYYAZx "
                                >{{token.type.toUpperCase()}}</span
                              ></span
                            >
                            · ${{formatNumber(token.tokenPrice, 2)}}
                          </div>
                        </div>
                      </div>
                      <div
                        kind="subtitle/m_med"
                        color="currentColor"
                        class="UIText-sc-96tl0y-0 khcNgA"
                      ><span class="text-caption">{{getChainLabel(token.chain)}}</span><br/>
                        ${{nFormatter2(token.usd, 2)}}
                      </div>
                    </div></button
                  >
                  <p v-if="tokens.filter(o => o.type.includes(searchVal.trim()) || !searchVal.trim().length).length == 0" class="q-pl-md">No assets found</p>
                </div>
                <div
                  height="16px"
                  width="auto"
                  class="Spacer__SpacerElement-sc-6ie5tt-0 IaLFF"
                ></div>
                <div class="ps__rail-x" style="left: 0px; bottom: -269px">
                  <div
                    class="ps__thumb-x"
                    tabindex="0"
                    style="left: 0px; width: 0px"
                  ></div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="_1BCaw" style="background-color: var(--zeric10)"></div>
        <div
          height="16px"
          width="auto"
          class="Spacer__SpacerElement-sc-6ie5tt-0 IaLFF"
        ></div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import Formatter from '@/mixins/Formatter'
export default {
  mixins: [Formatter],
  props: ['selectedChain'],
  data () {
    return {
      alert: true,
      searchVal: '',
      tokens: []
    }
  },
  mounted () {
    this.tokens = this.getAssets()
    // only for mobile version
    if (this.selectedChain) {
      this.tokens = this.tokens.filter(item => item.chain === this.selectedChain)
    }
  },
  methods: {
    selectToken (asset) {
      this.$router.push({
        name: this.getPageName('token'),
        path: '/verto/token/' + asset.chain + '/' + asset.type,
        params: {
          asset: asset,
          assets: this.$store.state.wallets.tokens,
          openDialog: true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

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
  overflow: hidden;
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
