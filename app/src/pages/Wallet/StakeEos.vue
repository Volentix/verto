<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center flex justify-between">
        <q-icon name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase col">Stake and Unstake EOS</big>
        <q-icon name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">

        <q-step default :name="1" :done="step>1" title="How many EOS" class=" bg-black workflow-step">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <div class="row">
              <div class="text-center">
                <span class="row text-h6 text-center">
                  EOS (Liquid)
                </span>
                <span class="row text-h4">
                  {{ eosbalance }}
                </span>
              </div>
              <div class="col">
                <q-linear-progress indeterminate rounded :reverse="progColor === 'red'" :color="progColor" size="xl" class="q-mt-md" />
              </div>
              <div class="col text-center">
                <span class="row text-h6 text-center">
                  EOS (Staked)
                </span>
                <span class="row text-h4">
                  {{ stakedAmount }}
                </span>
              </div>
            </div>
            <div>
              <br>
              <q-slider
                v-model="slider"
                :label-value="slider + '%'"
                :min="-100"
                :max="100"
                :step="5"
                color="orange"
                :label-color="progColor"
                dark
                markers
                label
                label-always
                @input="changeSlider()"
              />
              <q-input
                type="number"
                v-model="sendAmount"
                dark
                color="green"
                label="Amount"
                @input="checkAmount"
                @keyup.enter="goToPassword()"
              />
              </div>
              <div v-show="navigationButtons.amount" class="q-pa-sm" @click="step = 2" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="2" :done="step>2" title="Sign & Submit" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item-section>
                <q-item-label>Enter your private key password to sign the transaction</q-item-label>
              </q-item-section>

              <div class="q-pa-md">
                <q-input
                  v-model="privateKeyPassword"
                  dark
                  color="green"
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

              <div v-show="privateKey.success" class="q-pa-sm" @click="sendTransaction()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="3" :done="step>3" title="Result" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-inner-loading :visible="spinnervisible">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>

              <q-item-section>
                <q-item-label>Processing the transaction</q-item-label>
              </q-item-section>

              <div v-show="!transactionError" class="text-h6 text-uppercase text-green q-pa-md">
                {{ SuccessMessage }}
              </div>

              <div v-show="transactionError" class="text-h6 text-uppercase text-red q-pa-md">
                {{ ErrorMessage }}
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
import { userError } from '@/util/errorHandler'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  data () {
    return {
      step: 1,
      slider: 0,
      progColor: 'green',
      eosbalance: 0,
      vtxbalance: 0,
      stakedAmount: 0,
      vtxprice: 0,
      sendAmount: null,
      formatedAmount: null,
      currentProxy: null,
      ErrorMessage: null,
      SuccessMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      transactionId: null,
      transactionError: false,
      spinnervisible: false,
      isPwd: true,
      account: null,
      privateKeyPassword: null,
      showSendModal: false,
      navigationButtons: {
        to: false,
        token: false,
        amount: false,
        privateKeyPasswordBtn: false,
        showNextButtonToPassword: false
      }
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
  async created () {
    this.eosbalance = this.$route.params.eosbalance
    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
  },
  async mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.account = await eos.getAccount(this.walletName)

    if (this.account.voter_info) {
      this.stakedAmount = +this.account.voter_info.staked / 10000
      this.currentProxy = this.account.voter_info.proxy
    }
  },
  methods: {
    goToPassword () {
      if (this.navigationButtons.amount) {
        this.step = 2
      }
    },
    changeSlider () {
      if (this.slider >= 0) {
        this.sendAmount = Math.round(10000 * this.eosbalance * (this.slider / 100)) / 10000
      } else {
        this.sendAmount = Math.round(10000 * this.stakedAmount * (this.slider / 100)) / 10000
      }
      this.checkAmount()
    },
    checkAmount () {
      this.navigationButtons.amount = false

      if (+this.sendAmount > 0.0 && +this.sendAmount <= +this.eosbalance) {
        this.slider = Math.round(100 * (this.sendAmount / +this.eosbalance))
        this.navigationButtons.amount = true
        this.progColor = 'green'
      } else if (+this.sendAmount < 0.0 && +this.sendAmount <= +this.stakedAmount) {
        this.slider = Math.round(100 * (this.sendAmount / +this.stakedAmount))
        console.log('this.slider', this.slider)
        this.navigationButtons.amount = true
        this.progColor = 'red'
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
        this.SuccessMessage = 'Congratulations, your transactions have been record on the blockchain.  Check back in 24h to see the rewards received on your account.'
      } catch (error) {
        this.spinnervisible = false
        if (error.includes('maximum billable CPU time')) {
          this.voteError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.includes('user must stake before they can vote')) {
          this.voteError = true
          this.ErrorMessage = 'You must stake before you can vote!'
        }
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

<style lang="stylus">
.q-item__label--caption
  color: grey
</style>
