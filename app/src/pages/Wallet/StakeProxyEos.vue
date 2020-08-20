<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center flex justify-between">
        <q-icon name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase col">Stake for EOS Proxy</big>
        <q-icon name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">

        <q-step default :name="1" :done="step>1" title="Stake or Unstake" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item class="flex-center">
                <q-item-section class="col-auto">
                  <q-chip dense :color="currentProxy ? 'green' : 'red'" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label class="col-6 text-left">Current Staking Proxy: {{ currentProxy }}</q-item-label>
              </q-item>

              <q-item class="flex-center">
                <q-item-section class="col-auto">
                  <q-chip dense :color="stakedAmount ? 'green' : 'red'" class="shadow-1">&nbsp;</q-chip>
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
                    color="green"
                    unchecked-icon="clear"
                    keep-color v-model="proxyModel"/>
                </q-item-section>
              </q-item>
              <div v-show="showNext" class="q-pa-sm" @click="step = 2" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="2" :done="step>2" title="Portfolio" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

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
                        <q-badge color="green" class="q-mb-lg text-h7">
                          {{ item.symbol.split(",")[1] }}
                        </q-badge>
                      </q-item-label>
                      <q-slider
                        v-model="rewards[index].value"
                        :label-value="rewards[index].value || 0 + '%'"
                        :min="0"
                        :max="100"
                        :step="5"
                        color="orange"
                        dark
                        markers
                        label
                        label-always
                        @input="monitor(index)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>

              <div class="q-pa-sm" @click="formatRewards()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="3" :done="step>3" title="Compound" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Compound your vote staking rewards</q-item-label>
                  <q-item-label caption>You can choose to receive your EOS rewards already staked</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-toggle
                    v-model="staked"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    :true-value="1"
                    :false-value="0"
                    keep-color
                  />
                </q-item-section>
              </q-item>

              <div class="q-pa-sm" @click="step = 4" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="4" :done="step>4" title="Sign & Submit" class=" bg-black workflow-step">
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

              <div v-show="privateKey.success" class="q-pa-sm" @click="voteProxy()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="5" :done="step>5" title="Result" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-inner-loading :visible="spinnervisible">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>

              <q-item-section>
                <q-item-label>Processing the transaction</q-item-label>
              </q-item-section>

              <div v-show="!voteError" class="text-h6 text-uppercase text-green q-pa-md">
                {{ SuccessMessage }}
              </div>

              <div v-show="voteError" class="text-h6 text-uppercase text-red q-pa-md">
                {{ ErrorMessage }}
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
      <q-card-section>
        <q-item-label>Provided By:
          <img width="100" src="statics/img/eosnation.png">
        </q-item-label>
      </q-card-section>
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
      currentProxy: null,
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
