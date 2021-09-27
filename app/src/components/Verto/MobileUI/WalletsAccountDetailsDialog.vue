<template>
    <div>
        <q-dialog
            v-model="dialog"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
        <q-card flat class=" text-black" style="background: #f2f2f2 !important">
            <q-toolbar >
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                <q-toolbar-title> {{$store.state.currentwallet.wallet.name}}  </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
            </q-toolbar>
            <div class="column wrap justify-center items-center content-center">
                <div class="text-h9">Total Balance</div>
                <div class="text-h6 text-bold" v-if="selectedCoin.total">${{formatNumber(new Number(isNaN(selectedCoin.total) ? 0 : selectedCoin.total).toFixed(2),0)}} USD</div>
                <span class="text-h6 text-bold" v-else>${{formatNumber(new Number(isNaN(selectedCoin.usd) ? 0 : selectedCoin.usd).toFixed(2),0)}}</span>
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
                    <q-list  bordered separator class="rounded-borders bg-white">
                        <q-item  data-name='Staking' clickable v-ripple class="p-relative" to="/verto/stake">
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6">Stake VTX </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                        <q-item  data-name='Stake Proxy EOS' class="p-relative" >
                            <q-item-section>
                                <q-item-label lines="1" class="text-h6"><a href="https://volentix.io/node/" target="_blank"> Run a node </a> </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div v-if="$store.state.currentwallet.wallet.chain === 'eos'" >
                    <q-item style="margin-left: -14px;">
                        <q-item-section>
                            <q-item-label class=" text-h5">Chain tools</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-list  bordered separator class="rounded-borders bg-white">
                        <q-item  data-name='Staking' clickable v-ripple class="p-relative" to="/verto/stake">
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
                        </q-item>
                    </q-list>
                </div>

                <div>
                    <q-item style="margin-left: -14px;">
                        <q-item-section>
                            <q-item-label class=" text-h5">Security & History </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders bg-white">
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
                        <q-item data-name='History' clickable to="/verto/history" v-ripple class="p-relative">
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
    </div>
</template>

<script>

export default {
  name: 'WalletsAccountDetailsDialogMobile',
  props: ['dialog', 'circularProgress', 'focusOnChainTools', 'alertSecurity', 'hideCurrency', 'selectedCoin', 'formatNumber'],
  // components: { ChainItemList },
  data () {
    return {
      maximizedToggle: true,
      open: false,
      tabIndex: 'assets',
      previousTab: ''
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:dialog', false)
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
