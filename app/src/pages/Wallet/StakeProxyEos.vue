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
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
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

        <q-step default :name="2" :done="step>2" title="Portfolio of Rewards" class=" bg-black workflow-step">
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
                        :value="rewards[index].value"
                        :min="0"
                        :max="100"
                        :step="10"
                        dark
                        markers
                        label
                        label-always
                        @input="monitor()"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>

              <div class="q-pa-sm" @click="step = 2" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="3" :done="step>3" title="Compound your Stake" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Compound your vote staking rewards</q-item-label>
                  <q-item-label caption>You can receive your reward already staked or liquid</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-toggle
                    v-model="staked"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    true-value="1"
                    false-value="0"
                    keep-color
                  />
                </q-item-section>
              </q-item>

              <div class="q-pa-md">
                <q-input
                  v-model="privateKeyPassword"
                  dark
                  color="green"
                  label="Private Key Password"
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
              <div class="q-pa-sm" @click="step = 2" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
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
      voted: false,
      valid: true,
      spinnervisible: false,
      isPwd: false,
      staked: 0,
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

    this.stakedAmount = +this.account.voter_info.staked / 10000
    this.currentProxy = this.account.voter_info.proxy

    this.rewards = await this.getRewards()
    console.table(this.rewards)

    let voter = await this.getVoter()
    if (voter[0].owner === this.walletName) {
      this.voted = true
      this.proxyModel = true
    }
    console.log('voter', voter)

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
    monitor () {
      console.log(this.rewards)
    },
    async stakeNext () {
      if (this.voted && !this.proxyModel) {
        console.log('unvoteProxy')
      } else if (!this.voted && !this.proxyModel) {

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
        console.log('apr table error', error)
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
        console.log('voters table error', error)
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
        console.log('rewards table error', error)
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
        console.log('proxy table error', error)
        userError(error.message)
      }
    },
    async voteProxy () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      try {
        const result = await eos.transact({
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
              staked: 1
            }
          }]
        }, { keyProvider: privateKey.key })

        console.log('vote result', result)
      } catch (error) {
        console.log('vote error', error)
        userError(error.message)
      }
    },
    async claimProxy () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      try {
        const result = await eos.transact({
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
        console.log('claim result', result)
      } catch (error) {
        console.log('claim error', error)
        userError(error.message)
      }
    },
    async getStake (node) {
      // try {
      //   const eos = new EosWrapper(node.private_key)
      //   const result = await eos.api.transact({
      //     actions: [{
      //       account: 'vdexdposvote',
      //       name: 'voteproducer',
      //       authorization: [{
      //         actor: node.account,
      //         permission: 'active'
      //       }],
      //       data: {
      //         voter_name: node.account,
      //         producers: node.producers
      //       }
      //     }]
      //   }, {
      //     blocksBehind: 3,
      //     expireSeconds: 30
      //   })
      //   console.log("vote", node.account)
      // } catch (error) {
      //   console.log(error)
      // }
    },
    async vote (node) {
    //   try {
    //     const eos = new EosWrapper(node.private_key)
    //     const result = await eos.api.transact({
    //       actions: [{
    //         account: 'vdexdposvote',
    //         name: 'voteproducer',
    //         authorization: [{
    //           actor: node.account,
    //           permission: 'active'
    //         }],
    //         data: {
    //           voter_name: node.account,
    //           producers: node.producers
    //         }
    //       }]
    //     }, {
    //       blocksBehind: 3,
    //       expireSeconds: 30
    //     })
    //     console.log("vote", node.account)
    //   } catch (error) {
    //     console.log(error)
    //   }
    }
  }
}
</script>

<style lang="stylus">
.q-item__label--caption
  color: grey
</style>
