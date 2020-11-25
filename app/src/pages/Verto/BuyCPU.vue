<template>

 <q-page  :class="$q.screen.width > 1024 ? 'desktop-marg': 'mobile-pad'">
    <div class="desktop-version" v-if="$q.screen.width > 1024">
      <div class="row">
        <div class="col col-md-3">
          <div class="wallets-container">
            <profile-header :isMobile="false" class="marg" version="type2222" :fetchCurrentWalletFromState="true" />
            <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
            <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
          </div>
        </div>
        <div class="col col-md-9">
          <div class="desktop-card-style apps-section q-mb-sm">
            <div class="standard-content">
             <div class="standard-content--body">
                <div class="standard-content--body__form">
                   <div class="chain-tools-wrapper">
        <!-- <q-toggle v-model="active" label="Active" /> -->
        <div class="chain-tools-wrapper--list open">
            <div class="list-wrapper">
                <div class="list-wrapper--chain__eos-to-vtx-convertor">

    <q-card flat  style="width: 100%; max-width:700px">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper vertical  ref="stepper" alternative-labels animated v-model="step" class="q-pb-md">

        <q-step default :name="1" :done="step>1" title="Buy / CPU" class="  ">
          <q-card-section>
            <div class="  text-uppercase">

              <q-item class="">
                <q-item-section class="col-auto">
                  <q-chip dense :color="currentProxy ? 'deep-purple-14' : 'gray'" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label class="col-6 text-left">Current Staking Proxy: {{ currentProxy }}</q-item-label>
              </q-item>

              <q-item class="">
                <q-item-section class="col-auto">
                  <q-chip dense :color="stakedAmount ? 'deep-purple-14' : 'gray'" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label class="col-6 text-left">Staked EOS: {{ stakedAmount }}</q-item-label>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Proxy to EOS Nation for an APR of {{ apr }}%</q-item-label>
                  <q-item-label caption>APR is calculated at the time of claim and is subject to change based on the amount of EOS proxied.</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-toggle
                    checked-icon="check"
                    color="deep-purple-14"
                    unchecked-icon="clear"
                    keep-color v-model="proxyModel"/>
                </q-item-section>
              </q-item>
              <p class="text-red q-pt-sm" v-if="stakedAmount < 1.5"> Your need 1.5 STAKED EOS minimum to proceed </p>
              <div v-show="showNext" class="q-pa-sm"  >
                <q-btn label="Next"  :disable="stakedAmount < 1.5" @click="step = 2" color="deep-purple-14"/>
              </div>

            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="2" :done="step>2" title="Portfolio" class="  ">
          <q-card-section>
            <div class="  text-uppercase">

              <q-item tag="label">
                <q-item-section>
                  <q-item-label>Select your rewards Portfolio %</q-item-label>
                  <q-item-label caption></q-item-label>
                </q-item-section>
              </q-item>
                <q-list dense>
                  <q-item v-for="(item, index) in rewards" :key="index">
                    <q-item-section>
                      <q-item-label caption>
                        <q-badge color="deep-purple-14" class="q-mb-lg text-h7">
                          {{ item.symbol.split(",")[1] }}
                        </q-badge>
                      </q-item-label>
                      <q-slider
                        v-model="rewards[index].value"
                        :label-value="rewards[index].value || 0 + '%'"
                        :min="0"
                        :max="100"
                        :step="5"
                        color="black"

                        markers
                        label
                        label-always
                        @input="monitor(index)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>

              <div class="q-pa-sm" >
                 <q-btn label="Next"  color="deep-purple-14" @click="formatRewards()"/>

                <q-icon name="keyboard_arrow_up" size="3rem" @click="step = step - 1" color="black"/>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="3" :done="step>3" title="Compound" class="  ">
          <q-card-section>
            <div class="  text-uppercase">

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Compound your vote staking rewards</q-item-label>
                  <q-item-label caption>You can choose to receive your EOS rewards already staked</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-toggle
                    v-model="staked"
                    checked-icon="check"
                    color="deep-purple-14"
                    unchecked-icon="clear"
                    :true-value="1"
                    :false-value="0"
                    keep-color
                  />
                </q-item-section>
              </q-item>

              <div class="q-pa-sm"  >
                 <q-btn :label="$store.state.currentwallet.wallet.privateKey ? 'Submit' : 'Next'"  color="deep-purple-14" @click="$store.state.currentwallet.wallet.privateKey ? voteProxy() : step = 4"/>
                  <q-icon name="keyboard_arrow_up" size="3rem" @click="step = step - 1" color="black"/>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step v-if="!$store.state.currentwallet.wallet.privateKey" default :name="4" :done="step>4" title="Sign & Submit" class="  ">
          <q-card-section>
            <div class="  text-uppercase">

              <q-item-section>
                <q-item-label>Enter your private key password to sign the transaction</q-item-label>
              </q-item-section>

              <div class="q-pa-md">
                <q-input
                  v-model="privateKeyPassword"
                  dark
                  color="deep-purple-14"
                  label="Private Key Password"
                  debounce="500"
                  :error="invalidPrivateKeyPassword"
                  error-message="The password is incorrect"
                  @input="checkPrivateKeyPassword"
                  :type="isPwd ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <div v-show="privateKey.success" class="q-pa-sm"  >
               <q-btn label="Submit"  color="deep-purple-14" @click="voteProxy()"/>
               <q-icon name="keyboard_arrow_up" size="3rem" @click="step = step - 1" color="deep-purple-14"/>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="5" :done="step>5" title="Result" class="  ">
          <q-card-section>
            <div class="  text-uppercase">
              <q-inner-loading :visible="spinnervisible">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>

              <q-item-section>
                <q-item-label>Processing the transaction</q-item-label>
              </q-item-section>

              <div v-show="!voteError" class="text-h6 text-uppercase text-deep-purple-14 q-pa-md">
                {{ SuccessMessage }}
              </div>

              <div v-show="voteError" class="text-h6 text-uppercase text-red q-pa-md">
                {{ ErrorMessage }}
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
      <q-card-section v-if="false">
        <q-item-label>Provided By:
          <img width="100" src="statics/img/eosnation.png">
        </q-item-label>
      </q-card-section>
    </q-card>
  </div> </div> </div> </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import { userError } from '@/util/errorHandler'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
import ProfileHeader from '../../components/Verto/ProfileHeader'
import Wallets from '../../components/Verto/Wallets'
export default {
  components: {
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      step: 1,
      apr: 0,
      rewards: [],
      proxyRewards: '',
      proxyPercentages: '',
      voteError: false,
      ErrorMessage: null,
      SuccessMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      voted: false,
      valid: true,
      spinnervisible: false,
      isPwd: true,
      staked: 1,
      proxy: null,
      proxyModel: false,
      proxies: [],
      stakedAmount: null,
      currentProxy: 0,
      account: null,
      privateKeyPassword: null
    }
  },
  computed: {
    showNext: function () {
      if (!this.voted && !this.proxyModel) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.eosbalance = this.$route.params.eosbalance
    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
  },
  async mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.account = await eos.getAccount(this.walletName)
    console.log(this.$store.state.currentwallet)
    if (this.account.voter_info) {
      this.stakedAmount = +this.account.voter_info.staked / 10000
      this.currentProxy = this.account.voter_info.proxy
    }

    this.rewards = await this.getRewards()
    // look into checking current reward allocations
    this.rewards[0].value = 100

    let voter = await this.getVoter()
    if (voter[0].owner === this.walletName) {
      this.voted = true
      this.proxyModel = true
    }

    let APRs = await this.getAPR()
    APRs.forEach(apr => {
      if (apr.paused === 0) {
        this.apr += apr.rate / 100
      }
    })

    let proxies = await this.getProxies()
    proxies.forEach(proxy => {
      if (proxy.active === 1) {
        this.proxy = proxy.proxy
      }
    })
  },
  methods: {
    monitor (val) {
      let sum = 0

      this.rewards.forEach(reward => {
        if (reward.value) {
          sum += reward.value
        }
      })

      while (sum > 100) {
        for (var i = 0; this.rewards.length; i++) {
          if (i !== val && this.rewards[i].value > 0) {
            this.rewards[i].value -= 5
            sum -= 5
            break
          }
        }
      }

      while (sum < 100) {
        this.rewards[0].value += 5
        sum += 5
      }
    },
    async formatRewards () {
      let proxyPercentagesArr = []
      let proxyRewardsArr = []

      this.rewards.forEach(reward => {
        if (reward.value) {
          proxyPercentagesArr.push(reward.value * 100)
          proxyRewardsArr.push(reward.symbol.split(',')[1])
        }
      })

      this.proxyPercentages = proxyPercentagesArr
      this.proxyRewards = proxyRewardsArr

      this.step = 3
    },
    async stakeNext () {
      if (this.voted && !this.proxyModel) {
        // console.log('unvoteProxy')
      } else if (!this.voted && !this.proxyModel) {
        // console.log('Nothing to do, not voted and not voting.')
      } else {
        this.step = 2
      }
    },
    async getAPR () {
      try {
        const result = await eos.getTable(
          'proxy4nation', 'proxy4nation', 'settings'
        )
        return result
      } catch (error) {
        userError(error.message)
      }
    },
    async getVoter () {
      try {
        const result = await eos.getTable(
          'proxy4nation', 'proxy4nation', 'voters', this.walletName, '1'
        )
        return result
      } catch (error) {
        userError(error.message)
      }
    },
    async getRewards () {
      try {
        const result = await eos.getTable(
          'proxy4nation', 'proxy4nation', 'rewards'
        )
        return result
      } catch (error) {
        userError(error.message)
      }
    },
    async getProxies () {
      try {
        const result = await eos.getTable(
          'proxy4nation', 'proxy4nation', 'proxies'
        )
        return result
      } catch (error) {
        userError(error.message)
      }
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    async voteProxy () {
      try {
        this.step = 5
        this.spinnervisible = true

        await eos.transact({
          actions: [{
            account: 'eosio',
            name: 'voteproducer',
            authorization: [{
              actor: this.walletName,
              permission: 'active'
            }],
            data: {
              voter: this.walletName,
              proxy: this.proxy
            }
          }, {
            account: 'proxy4nation',
            name: 'signup',
            authorization: [{
              actor: this.walletName,
              permission: 'active'
            }],
            data: {
              owner: this.walletName,
              referral: 'converttovtx'
            }
          }, {
            account: 'proxy4nation',
            name: 'setstaked',
            authorization: [{
              actor: this.walletName,
              permission: 'active'
            }],
            data: {
              owner: this.walletName,
              staked: this.staked
            }
          }, {
            account: 'proxy4nation',
            name: 'setportfolio',
            authorization: [{
              actor: this.walletName,
              permission: 'active'
            }],
            data: {
              owner: this.walletName,
              rewards: this.proxyRewards,
              percentages: this.proxyPercentages
            }
          }]
        }, { keyProvider: this.privateKey.key })

        this.spinnervisible = false
        this.SuccessMessage = 'Congratulations, your transactions have been recorded on the blockchain.  Check back in 24h to see the rewards received on your account.'
      } catch (error) {
        this.spinnervisible = false

        console.log(error, 'error')
        /*
         if (error.includes('maximum billable CPU time')) {
          this.voteError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.includes('user must stake before they can vote')) {
          this.voteError = true
          this.ErrorMessage = 'You must stake before you can vote!'
        }
        */
      }

      this.privateKey.key = null
    },
    async claimProxy () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      try {
        await eos.transact({
          actions: [{
            account: 'proxy4nation',
            name: 'claim',
            authorization: [{
              actor: this.walletName,
              permission: 'active'
            }],
            data: {
              owner: this.walletName
            }
          }]
        }, { keyProvider: privateKey.key })
      } catch (error) {
        userError(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.chain-tools-wrapper {

    &--list {
        &__hide-chain-tools {
            text-transform: initial !important;
            margin-top: 0px;
            margin-bottom: 10px;
            color: #7272FA !important;
        }

        .list-wrapper {
            overflow: hidden;
            visibility: hidden;
            height: 0px;
            opacity: 0;
            transform: translateY(-20px) scaleY(.5);
            transform-origin: top;
            transition: ease transform .3s, ease opacity .4s;

            .select-input {
                border-radius: 100px !important;
                $height: 50px;
                height: $height;

                /deep/ .q-field__marginal {
                    height: $height;
                    min-height: unset;
                }

                /deep/ .q-field__control {
                    height: $height;
                    min-height: unset;

                    .q-field__native {
                        padding-left: 0px;
                        padding-top: 0px;
                        padding-bottom: 0px;
                        height: $height;
                        min-height: unset;

                        .q-item {
                            padding: 0px;
                            padding-left: 18px;
                            min-height: $height;
                            padding-bottom: 0px;

                            .q-item__section {
                                padding-right: 21px;
                                min-width: 36px;
                                margin-left: -15px;

                                .q-item__label+.q-item__label {
                                    margin-top: 0px;
                                }
                            }
                        }
                    }
                }
            }

            &--chain {
                &__type {
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 0px 0px 10px 10px;
                    padding: 3% 8%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);
                    font-family: $Titillium;
                    font-size: 20px;
                    color: #2A2A2A;
                    font-weight: $bold;

                    b {
                        color: #7272FA;
                        text-transform: uppercase;
                    }
                }

                &__coming-soon {
                    ul {
                        list-style: none;
                        padding: 0px;
                        margin: 0px;
                        padding: 5% 6%;

                        li {
                            &:not(:last-child) {
                                border-bottom: 1px solid #707070;
                            }

                            .btn-soon {
                                text-transform: initial !important;
                                padding: 20px 10px;
                                border-radius: 0px;

                                /deep/ .q-btn__content {
                                    display: flex;
                                    justify-content: space-between;
                                    flex-direction: row;
                                    align-items: center;
                                    align-content: center;
                                }

                                .title {
                                    font-size: 20px;
                                    color: #454F63;
                                    font-weight: $bold;
                                    margin-right: auto;
                                }

                                .soon {
                                    font-size: 16px;
                                    color: #B0B0B0;
                                    display: flex;
                                    justify-content: space-between;
                                    flex-direction: row;
                                    align-items: center;
                                    align-content: center;
                                }

                                .icon {
                                    color: #78849E;
                                    position: relative;
                                    top: 2px;
                                    margin-left: 20px;
                                }
                            }
                        }
                    }
                }

                &__eos-to-vtx-convertor {
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    position: relative;
                    overflow: hidden;
                    padding: 0%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);

                    &--title {
                        font-size: 22px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #2A2A2A;
                        margin: 0px;
                        padding-left: 22px;
                        margin-top: 3px;
                        position: relative;
                    }

                    .staked-wrapper {
                        padding: 20px;

                        @media screen and (min-width: 1024px) {
                            padding: 30px 0px;
                        }

                        .item-wrapper {
                            margin-bottom: 10px;
                        }

                        .date {
                            font-size: 10px;

                            @media screen and (min-width: 1024px) {
                                font-size: 20px;
                            }
                        }

                        .total {
                            $purple: #6C0DCB;
                            font-size: 10px;
                            color: $purple !important;

                            @media screen and (min-width: 1024px) {
                                font-size: 24px;
                                font-weight: $bold;
                            }

                            strong {
                                color: $purple !important;
                            }
                        }

                        .item-wrapper--row {
                            height: 35px;

                            @media screen and (min-width: 1024px) {
                                height: 50px;
                            }
                        }

                        .col {
                            color: #B0B0B0;
                            font-size: 10px;

                            @media screen and (min-width: 1024px) {
                                font-size: 16px;
                            }

                            font-family: $Titillium;
                            font-weight: $regular;

                            strong {
                                font-weight: $bold;
                                color: #2A2A2A;
                            }
                        }

                        .border {
                            border: 1px solid rgba(#707070, .09);
                            border-radius: 10px;
                            height: 100%;
                            padding: 10px;
                        }
                    }

                    .q-tabs {
                        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
                    }

                    /deep/ .q-tab__content {
                        width: 100%;
                        height: 50px;

                        .q-tab__label {
                            color: #B0B0B0;
                            font-size: 16px !important;
                            text-transform: capitalize;
                            // margin-top: -5px;
                            font-family: $Titillium;
                            font-weight: $regular;
                        }

                        .q-tab__indicator {
                            height: 4px;
                        }
                    }

                    /deep/ .q-tab--active {
                        .q-tab__indicator {
                            color: #7272FA !important;
                        }

                        .q-tab__label {
                            color: #7272FA;
                            font-weight: $bold;
                        }
                    }

                    /deep/ .q-tab-panel {
                        padding: 0px;
                    }

                    /deep/ .q-tabs--dense .q-tab {
                        padding: 0px;
                    }

                    /deep/ .q-stepper__step {
                        position: relative;

                        .q-stepper__tab {
                            padding: 12px 14px;
                        }

                        .q-stepper__step-inner {
                            padding: 0 14px 12px 50px;
                        }
                    }

                    /deep/ .q-stepper--vertical .q-stepper__dot:before,
                    /deep/ .q-stepper--vertical .q-stepper__dot:after {
                        content: '';
                        transform: translateX(-50%);
                        width: 18px;
                        background: #F3F3F3;
                        // margin-top: -4px;
                        // margin-bottom: -4px;
                    }

                    /deep/ .q-stepper__tab {
                        .q-stepper__title {
                            font-size: 20px;
                            font-family: $Titillium;
                            font-weight: $bold;
                            color: #2A2A2A;
                        }

                        &.q-stepper__tab--active,
                        &.q-stepper__tab--done {
                            .q-stepper__title {
                                color: #7272FA;
                            }

                            .q-stepper__dot {
                                background: #7272FA;
                            }
                        }
                    }

                    .--input {
                        margin-top: 20px;

                        /deep/ .q-field {
                            height: 40px;
                        }

                        /deep/ .q-field__native,
                        /deep/ .q-field__prefix,
                        /deep/ .q-field__suffix {
                            padding-top: 0px;
                            padding-bottom: 0px;
                        }

                        /deep/ .q-field__label {
                            top: 10px;
                            font-size: 12px;
                            font-weight: $bold;
                            font-family: $Titillium;
                        }

                        /deep/ .q-field__marginal {
                            height: 40px;
                        }

                        /deep/ .q-field__control {
                            height: 40px;
                        }
                    }

                    .--slider {
                        /deep/ &.q-slider--dark {
                            .q-slider__track-container {
                                background: rgba(0, 0, 0, 0.3);
                            }

                            .q-slider__pin-value-marker-text {
                                font-weight: $bold;
                                font-size: 11px;
                            }

                            .q-slider__pin-value-marker-bg {
                                background: #FFB200 !important;
                            }

                            .text-green {
                                // background: #FFB200 !important;
                            }
                        }
                    }

                    .--next-btn {
                        width: fit-content;
                        text-transform: initial !important;
                        margin-left: 10px;
                        margin-bottom: 10px;
                    }

                    .--progress {
                        height: 20px;

                        /deep/ .q-linear-progress {
                            margin-top: 8px;
                            height: 5px !important;
                            max-width: 90%;
                            margin-left: auto;
                            margin-right: auto;

                            .q-linear-progress__track {
                                background: #FFB200;
                            }

                            .q-linear-progress__model--indeterminate:before,
                            .q-linear-progress__model--indeterminate:after {
                                background: #FFB200;
                            }
                        }

                        &.hr-vertical {
                            max-width: 50px;

                            .bar {
                                height: 30px;
                                width: 4px;
                                background: #FFB200;
                                margin-top: 5px;
                                border-radius: 10px;
                            }
                        }
                    }

                    .--back-btn {
                        position: absolute;
                        right: 0px;
                        top: 6px;
                    }

                    .content__success {
                        border: 2px solid #00D0CA;
                        padding: 10px 15px;
                        border-radius: 20px;
                        background-color: #fff;
                        box-shadow: 0px 5px 10px 0px rgba(black, .1);
                        position: relative;

                        a {
                            display: block;
                            margin-top: 10px;
                        }

                        .success_icon {
                            display: block;
                            margin: auto;
                            margin-top: -50px;
                            margin-bottom: -10px;
                            width: 80px;
                        }
                    }

                    .content__failed {
                        border: 2px solid #FFB200;
                        padding: 10px 15px;
                        border-radius: 20px;
                        background-color: #fff;
                        box-shadow: 0px 5px 10px 0px rgba(black, .1);
                        position: relative;

                        a {
                            display: block;
                            margin-top: 10px;
                        }

                        .failed_icon {
                            display: block;
                            margin: auto;
                            margin-top: -50px;
                            margin-bottom: -10px;
                            width: 80px;
                        }
                    }

                    .--subtitle {
                        font-size: 17px;
                        color: #000;
                        font-family: $Titillium;
                        font-weight: $regular;
                        line-height: 20px;
                        margin-top: 10px;
                        margin-bottom: 30px;

                        &__success {
                            color: #00D0CA;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__faild {
                            color: #FFB200;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__transLink {
                            color: #2A2A2A;
                            // border-bottom: 1px solid;
                            width: fit-content;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__summary {
                            margin-bottom: 20px;
                            font-weight: $bold;
                        }

                        &__summary--list {
                            list-style: disc;
                            padding-left: 24px;
                            margin-top: -10px;

                            li {
                                color: #B0B0B0;
                            }
                        }
                    }

                    .--title,
                    .--amount {
                        font-size: 15px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #B0B0B0;
                        text-transform: initial !important;
                        line-height: 20px;
                    }

                    .--alert {
                        font-size: 17px;
                        line-height: 21px;
                        font-family: $Titillium;
                    }

                    .--amount {
                        color: #2A2A2A !important;
                    }
                }
            }
        }

        &.open {
            margin-bottom: -100px;

            .list-wrapper {
                visibility: visible;
                height: auto;
                opacity: 1;
                transform: translateY(0px) scaleY(1);
                margin-bottom: 10px;
            }
        }
    }
}

/deep/ .ellipsis_important {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    max-width: 145px;
}
.desktop-version {
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px;
    padding-right: 2%;
}
.list-wrapper--chain__eos-to-vtx-convertor > .q-card {
    width: 100%;
    max-width: 700px;
    padding-bottom: 100px;
}
.q-chip {
    width: 21px;
    margin-top: -10px;
}
</style>
