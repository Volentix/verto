<template>
    <div >
        <q-dialog
            v-model="dialog"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
        <q-card flat :class="$store.state.settings.lightMode === 'true' ? 'text-white' : 'text-black'"  :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': 'background: #f2f2f2 !important'">
            <q-page-sticky expand position="top" style="margin-top: -50px;">
                <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'" >
                    <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                    <q-toolbar-title> {{$store.state.currentwallet.wallet.name}}  </q-toolbar-title>
                    <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
                </q-toolbar>
            </q-page-sticky>
            <!-- <div class="column wrap justify-center items-center content-center">
                <div class="text-h9">Total Balance</div>
                <div class="text-h6 text-bold" v-if="selectedCoin.total">${{formatNumber(new Number(isNaN(selectedCoin.total) ? 0 : selectedCoin.total).toFixed(2),0)}} USD</div>
                <span class="text-h6 text-bold" v-else>${{formatNumber(new Number(isNaN(selectedCoin.usd) ? 0 : selectedCoin.usd).toFixed(2),0)}}</span>
            </div> -->
            <div v-if="$q.platform.is.mobile" class="q-mt-xl">
                <div class="q-pa-md " >
                    <div class="q-pb-md">
                        <div class="text-h4 text-bold" v-if="selectedCoin.total">
                        US${{formatNumber(new Number(isNaN(selectedCoin.total) ? 0 : selectedCoin.total).toFixed(2),0)}}
                        </div>
                        <div class="text-h4 text-bold" v-else>
                        US${{formatNumber(new Number(isNaN(selectedCoin.usd) ? 0 : selectedCoin.usd).toFixed(2),0)}}
                        </div>
                    </div>
                    <div class="q-pb-lg">
                        <div class=" shadow-2 rounded-borders row justify-between q-pa-sm" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'text-black bg-white'">
                            <div>
                                <q-btn flat round dense  icon="send"  style="margin-right:-10px;"/>
                                <q-btn flat  class="text-bold" @click="callChainTools"> Send </q-btn>
                            </div>
                            <q-separator vertical inset color="grey"/>
                            <div>
                                <q-btn flat round dense  icon="call_received" class="q-pl-md" style="margin-right:-10px;"/>
                                <q-btn flat  class="text-bold" @click="shoKeysStatus()"> Receive</q-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <q-card-section v-if="$store.state.currentwallet.wallet.chain">
                <div class="row text-center q-pb-md" v-if="$store.state.currentwallet.wallet.type === 'eos'" >
                    <div class="row col-4  flex flex-center ">
                        <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="circularProgress.cpu"
                            size="70px"
                            :thickness="0.22"
                            color="deep-purple-2"
                            track-color="grey-1"
                            class="q-ma-md"
                            >
                            {{ circularProgress.cpu }}%
                        </q-circular-progress>
                        <span class="accountInfos">{{circularProgress.cpuInfos}} µs</span>
                        <div class="col-12">CPU</div>
                    </div>
                    <div class="row col-4  flex flex-center ">
                        <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="circularProgress.net"
                            size="70px"
                            :thickness="0.22"
                            color="deep-purple-2"
                            track-color="grey-1"
                            class="q-ma-md"
                            >
                            {{ circularProgress.net }}%
                        </q-circular-progress>
                        <span class="accountInfos">{{circularProgress.netInfos}} KB</span>
                        <div class="col-12">NET</div>
                    </div>

                    <div class="row col-4  flex flex-center ">
                        <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="circularProgress.ram"
                            size="70px"
                            :thickness="0.22"
                            color="deep-purple-2"
                            track-color="grey-1"
                            class="q-ma-md"
                        >
                            {{ circularProgress.ram }}%
                            </q-circular-progress>
                            <span class="accountInfos">{{circularProgress.ramInfos}} KB</span>
                            <div class="col-12">RAM</div>
                    </div>
                </div>
                <div v-if="$store.state.currentwallet.wallet.type === 'vtx'" >
                    <q-item style="margin-left: -14px;">
                        <q-item-section>
                            <q-item-label class=" text-h5">VTX tools</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-list  :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">
                        <q-item  data-name='Staking' clickable v-ripple class="p-relative" to="/verto/stake/eos/vtx">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Stake VTX </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item v-if="false"  clickable v-ripple data-name='Stake Proxy EOS' class="p-relative" >
                            <q-item-section @click="goNewWindow()">
                                <q-item-label lines="1" class="text-h6">Run a node </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>

                <div v-if="$store.state.currentwallet.wallet.chain === 'eos' || $store.state.currentwallet.wallet.chain === 'eth'" >
                    <q-item style="margin-left: -14px;">
                        <q-item-section>
                            <q-item-label class=" text-h5">Chain tools</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-list  :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">
                        <q-item  data-name='Staking' clickable v-ripple class="p-relative" :to="path.to" v-for="(path, index) in ( $store.state.currentwallet.wallet ? tools[$store.state.currentwallet.wallet.chain] : [])" :key="index"  v-show="!($store.state.currentwallet.wallet.type === 'vtx' && path.to ==='/verto/stake/eos/vtx')">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">{{path.title}} </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>

                        <!-- <q-item  data-name='Staking' clickable v-ripple class="p-relative" to="/verto/stake">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Stake VTX </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                         <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Stake / Unstake CPU' clickable v-ripple class="p-relative" to="/verto/stake">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Stake / Unstake CPU </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Buy/Sell Ram' clickable v-ripple class="p-relative" to="/verto/ram-market">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Buy / Sell Ram </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Power up' clickable v-ripple class="p-relative" to="/verto/wallet/eos/powerup">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Power up </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>

                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" to="/verto/stakeproxy">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Stake Proxy EOS </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item data-name='Create new account' v-if="$store.state.currentwallet.wallet.type !== 'verto' && $store.state.currentwallet.wallet.chain === 'eos'" to="/verto/eos-account/create" clickable v-ripple class="p-relative ">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Create account </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item data-name='Import  account' v-if="$store.state.currentwallet.wallet.type !== 'verto' && $store.state.currentwallet.wallet.chain === 'eos'" to="/verto/eos-account/import" clickable v-ripple class="p-relative">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Import another account </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Custom Transaction' clickable v-ripple class="p-relative" to="/verto/custom-transactions">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Custom Transaction </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item> -->
                    </q-list>
                </div>

                <div>
                    <q-item style="margin-left: -14px;">
                        <q-item-section>
                            <q-item-label class=" text-h5">Security & History </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">
                        <!-- <q-separator style="margin-top: -20px" /> -->

                        <q-item data-name='Create EOS account' v-if="$store.state.currentwallet.wallet.type === 'verto'" to="/verto/eos-account/create" clickable v-ripple class="p-relative bold-btn">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Create EOS account</q-item-label>
                            </q-item-section>
                                <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>

                        <q-item data-name='Import EOS account' v-if="$store.state.currentwallet.wallet.type === 'verto'" to="/verto/eos-account/import" clickable v-ripple class="p-relative bold-btn">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Import EOS account</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos'" data-name='EOS to VTX Converter' clickable v-ripple class="p-relative" to="/verto/converter">EOS to VTX Converter
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item> -->
                        <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos' || $store.state.currentwallet.wallet.type === 'vtx'" data-name='Staking / Unstaking CPU' clickable v-ripple class="p-relative" to="/verto/stake">{{$store.state.currentwallet.wallet.type === 'eos' ? 'Staking / Unstaking CPU' : 'Staking'}}
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item> -->
                        <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos'" data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" to="/verto/stakeproxy">Stake Proxy EOS
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item> -->

                        <q-item data-name='Security' clickable @click="$emit('update:alertSecurity', true)" v-ripple class="p-relative">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Security</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item data-name='History' clickable @click="goTo('history')" v-ripple class="p-relative">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">History</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <!-- <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                            <q-item-section>
                                <q-item-label>{{$store.state.currentwallet.wallet.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                            </q-item-section>
                            <q-item-section avatar>
                                <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="$store.state.currentwallet.wallet.hidden" />
                            </q-item-section>
                        </q-item> -->
                    </q-list>
                </div>

            </q-card-section>

        </q-card>
        </q-dialog>
        <SelectTokenPopup :key="keys2.send" v-if="chainTools.send" :selectedChain="selectedCoin.chain" />
        <ShowKeys
            :key="keys.keying"
            v-if="keys.chain"
            :chain="keys.chain"
            :field="keys.field"
        />
    </div>
</template>

<script>
import Formatter from '@/mixins/Formatter'
import SelectTokenPopup from '../../Verto/Token/SelectTokenPopup.vue'
import ShowKeys from '@/components/Verto/ShowKeys'

export default {
  name: 'WalletsAccountDetailsDialogMobile',
  props: ['dialog', 'circularProgress', 'focusOnChainTools', 'alertSecurity', 'hideCurrency', 'selectedCoin', 'accountChain'],
  components: { SelectTokenPopup, ShowKeys },
  mixins: [Formatter],
  data () {
    return {
      maximizedToggle: true,
      open: false,
      tabIndex: 'assets',
      previousTab: '',
      chainTools: { send: false },
      keys2: { send: 1 },
      keys: {
        chain: null,
        field: '',
        keying: 1
      },
      tools: {
        eth: [{
          icon: 'img:https://ethplorer.io/images/HEX2b591e99.png',
          to: '/verto/stake/eth/hex',
          title: 'Stake HEX',
          activeAccRequired: true
        }],
        eos: [{
          icon: 'bolt',
          to: '/verto/wallet/eos/powerup',
          title: 'Power up',
          activeAccRequired: true
        }, {
          icon: 'img:https://www.api.bloks.io/image-proxy/display?w=100&h=100&url=https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png&op=resize',
          title: 'Stake VTX',
          activeAccRequired: true,
          to: '/verto/stake/eos/vtx'
        }, {
          icon: 'battery_charging_full',
          title: 'Buy / Sell Ram',
          activeAccRequired: true,
          to: '/verto/ram-market'
        }, /* {
          icon: 'shield',
          title: 'Stake Proxy EOS',
          activeAccRequired: true,
          to: '/verto/stakeproxy',
        }, */ {
          icon: 'swap_vert',
          title: 'Stake EOS',
          activeAccRequired: true,
          to: '/verto/stake/eos/eos'
        }, {
          activeAccRequired: true,
          to: '/verto/custom-transactions',
          icon: 'tune',
          title: 'Transact'
        }]
      }

    }
  },
  methods: {
    shoKeysStatus () {
      this.$router.push({ name: 'receive', params: { chainID: this.selectedCoin.chain, tokenID: this.selectedCoin.type, name: this.selectedCoin.name, value: this.selectedCoin.value, icon: this.selectedCoin.icon } })
    //   let tempChain = JSON.parse(JSON.stringify(this.accountChain))
    //   this.keys.keying++
    //   this.keys.field = 'key'
    //   this.keys.chain = this.accountChain
    //   if (this.accountChain) {
    //     for (let i = 0; i < this.accountChain.accounts.length; i++) {
    //       if (this.$store.state.currentwallet.wallet.name !== this.accountChain.accounts[i].name) {
    //         tempChain.accounts.splice(i, 1)
    //         this.keys.chain = tempChain
    //       }
    //     }
    //   }
    },
    closeDialog () {
      if (!this.$store.state.investment.defaultAccount) {
        this.$emit('update:dialog', false)
      } else {
        this.$router.push('/verto/dashboard')
      }
    },
    goNewWindow () {
      window.open('https://volentix.io/node/', '_blank')
    },
    goTo (path) {
      // this.$router.push(`/verto/${path}`)
      this.$router.push({ path: `/verto/${path}`, query: { return: 'wallets' } })
    },
    callChainTools () {
      this.chainTools.send = true
      this.keys2.send++
    }
  }

}
</script>

<style lang="scss" scoped>
.mobile-card{
    background-color: #04111F !important;
  }
</style>
