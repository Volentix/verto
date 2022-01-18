<template>
  <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="chain-tools-wrapper">
      <!-- <q-toggle v-model="active" label="Active" /> -->
      <div class="chain-tools-wrapper--list open">
        <div class="list-wrapper">
          <div class="list-wrapper--chain__eos-to-vtx-convertor">
            <q-tabs
              v-model="tab"
              dense
              :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="stake" label="Stake Now" class="full-width" />
              <q-tab name="staked" label="Staked Amounts" :disable="stakes.length === 0" class="full-width" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="stake">
                <div v-if="step >= 0" class="">
                  <q-stepper
                    v-model="step"
                    vertical
                    color="primary"
                    animated
                    flat
                    :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                  >
                    <q-step title="Choose an account"
                      :name="0"
                      prefix="0"
                      :done="step > 0"
                    >
                      <q-select
                          :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                          separator
                          rounded
                          outlined
                          class="select-input"
                          v-model="currentAccount"
                          use-input
                          :options="tableData"
                      >
                        <template v-slot:option="scope">
                          <q-item
                            class="custom-menu"
                            v-bind="scope.itemProps"
                            v-on="scope.itemEvents"
                          >
                            <q-item-section avatar>
                              <q-icon class="option--avatar" :name="`img:${scope.opt.icon}`" />
                            </q-item-section>
                            <q-item-section dark>
                              <q-item-label v-html="scope.opt.name" />
                              <q-item-label caption class="ellipsis">{{ scope.opt.key }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                        <template v-slot:selected>
                          <q-item
                            v-if="currentAccount"
                          >
                            <q-item-section avatar>
                              <q-icon class="option--avatar" :name="`img:${currentAccount.icon}`" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label v-html="currentAccount.name" />
                              <q-item-label caption class="ellipsis ellipsis_important">{{ currentAccount.key }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item
                            v-else>
                          </q-item>
                        </template>
                        <template v-slot:append>
                          <q-btn round flat unelevated text-color="grey" @click="copyToClipboard(currentAccount.type !== 'eos' && currentAccount.type !== 'verto'  ? currentAccount.name : currentAccount.key , 'Account name')" @click.stop icon="o_file_copy" />
                        </template>
                      </q-select>

                      <q-stepper-navigation v-if="currentAccount" class="flex justify-end">
                        <q-btn @click="step = 1" unelevated color="deep-purple-14" class="--next-btn" rounded label="Next" />
                      </q-stepper-navigation>

                    </q-step>
                    <q-step :title="`How many ${params.tokenID.toUpperCase()}`"
                      :name="1"
                      prefix="1"
                      :done="step > 1"
                    >
                      <q-btn flat @click="step = 0" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                      <div class="text-black">
                        <!-- <p class="text-h6 text-grey">Condition 1</p> -->
                        <div v-if="condition === 1" class="condition_1">
                          <p class="--alert text-indigo-6 text-h6">You do not have enough {{ params.tokenID.toUpperCase() }} available for staking.</p>
                          <div class="row">
                            <div class="">
                              <span class="--title row text-h6"> {{ params.tokenID.toUpperCase() }} (Liquid) </span>
                              <span class="--amount row text-h4"> {{ currentAccount.amount }} </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="condition === 2" class="condition_2">
                          <p class="--alert text-indigo-6 text-h6">Verto does not detect an {{ params.tokenID.toUpperCase() }} account</p>
                        </div>
                        <div v-if="condition === 3" class="condition_3">
                          <div class="text-black">
                            <div class="row">
                              <div class="">
                                <span class="--title row text-h6"> Current Balance<br>{{ params.tokenID.toUpperCase() }} (Liquid) </span>
                                <span class="--amount row text-h4"> {{ currentAccount.amount }} </span>
                              </div>
                              <div class="col --progress hr-vertical flex flex-center">
                                <span class="bar"></span>
                              </div>
                              <div class="col">
                                <span class="--title row text-h6"> Current Stake<br>{{ params.tokenID.toUpperCase() }} (Staked) </span>
                                <span class="--amount row text-h4"> {{ currentAccount.staked }} </span>
                              </div>
                            </div>
                            <div class="slider-holder stake-period">
                              <br>
                              <div class="row q-mb-lg">
                                <span class="--title row text-h6"> Stake period </span>
                              </div>
                              <br>
                              <!-- 90 days , 180 days, 300 days -->
                              <q-slider
                                v-model="stakePeriod"
                                :label-value="`${stakePeriod * 30}` + ' days'"
                                :min="2"
                                :max="10"
                                :step="4"
                                color="orange"
                                :label-color="progColor"
                                dark
                                markers
                                label
                                class="--slider"
                                label-always
                                @input="changeSlider()"
                              />
                            </div>
                              <br>
                              <br>
                            <div class="slider-holder">
                              <q-slider
                                v-model="slider"
                                :label-value="slider + '%'"
                                :min="0"
                                :max="100"
                                :step="1"
                                color="orange"
                                :label-color="progColor"
                                dark
                                markers
                                label
                                class="--slider"
                                label-always
                                @input="changeSlider()"
                              />
                            </div>
                            <div class="row q-mb-lg">
                              <div class="col col-4">
                                 <q-btn color="white" outline text-color="grey" class="full-width" label="25%" @click="sliderToPercent(25)" />
                              </div>
                              <div class="col col-4 q-pl-md">
                                 <q-btn color="white" outline text-color="grey" class="full-width" label="50%" @click="sliderToPercent(50)" />
                              </div>
                              <div class="col col-4 q-pl-md">
                                 <q-btn color="white" outline text-color="grey" class="full-width" label="100%" @click="sliderToPercent(100)" />
                              </div>
                            </div>
                            <div class="row full-width">
                              <div class="full-width">
                                <span class="--title row text-h6"> Amount to stake </span>
                                <span class="--amount row text-h4"> {{  sendAmount }} {{ params.tokenID.toUpperCase() }}</span>
                                <q-input
                                 :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                                  v-model="sendAmount"
                                  type="number"
                                  :suffix="params.tokenID.toUpperCase()"
                                  rounded
                                  outlined
                                  class="--input"
                                  @input="changeAmount()"
                                  :rules="[val => val >= 10000 || '10000 VTX Minimum']"
                                />
                                <br>
                              </div>
                            </div>

                            <div class="row full-width">
                              <div class="full-width">
                                <br>
                                <span class="--title row text-h6 text-indigo-6"> Estimated stake reward </span>
                                <span class="--amount row text-h4"> {{ estimatedReward }} {{ params.tokenID.toUpperCase() }} </span>
                                <br>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <q-stepper-navigation class="flex justify-end" v-show="sendAmount >= 10000">
                        <q-btn @click="step = 2" v-if="condition === 1" unelevated color="deep-purple-14" class="--next-btn" rounded :label="`Get ${ params.tokenID.toUpperCase() }`" />
                        <q-btn @click="step = 2" v-if="condition === 2" unelevated color="deep-purple-14" class="--next-btn" rounded label="Get EOS account" />
                        <q-btn @click="step = 2" v-if="condition === 3" unelevated color="deep-purple-14" class="--next-btn" rounded label="Next" />
                      </q-stepper-navigation>
                    </q-step>
                    <q-step v-if="isPrivateKeyEncrypted" title="Sign & Submit"
                      :name="2"
                      prefix="2"
                      :done="step > 2"
                    >
                      <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                      <div class="text-black">
                        <div class="text-h4 --subtitle">Enter your password to sign the transaction.</div>
                        <q-input
                          v-model="privateKeyPassword"
                          :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                          rounded
                          outlined
                          class="--input"
                          color="green"
                          label="Private Key Password"
                          debounce="500"
                          :error="invalidPrivateKeyPassword"
                          error-message="The password is incorrect"
                          @input="checkPrivateKeyPassword()"
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
                      <q-stepper-navigation class="flex justify-end">
                        <q-btn @click="sendTransaction()" color="deep-purple-14" class="--next-btn" rounded label="Submit" />
                      </q-stepper-navigation>
                    </q-step>
                    <q-step v-else title="Confirm & Submit"
                      :name="2"
                      prefix="2"
                      :done="step > 2"
                    >
                      <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                      <div class="text-black">
                        <div class="text-h4 --subtitle">Are you sure?</div>
                      </div>
                      <q-stepper-navigation class="flex justify-end">
                        <q-btn @click="sendTransaction()" color="deep-purple-14" class="--next-btn" rounded label="Submit" />
                      </q-stepper-navigation>
                    </q-step>
                    <q-step title="Result"
                      :name="4"
                      prefix="3"
                    >
                      <q-btn flat @click="step = 2" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                      <div v-if="!ErrorMessage" class="text-black">
                        <q-spinner />
                      </div>
                      <div v-if="!transactionError" class="content__success">
                        <img src="statics/success_icon.svg" class="success_icon" alt="">
                        <div class="text-h4 --subtitle text-center --subtitle__success">Successful completion</div>
                        <div class="text-h4 --subtitle text-center --subtitle__transLink" v-html="SuccessMessage"> {{ SuccessMessage }}</div>
                      </div>
                      <div v-else class="content__failed text-red q-pa-md">
                        <img src="statics/fail_icon.svg" class="failed_icon" alt="">
                        <div class="text-h4 --subtitle text-center --subtitle__faild">Something's wrong!</div>
                        <div class="text-h4 --subtitle text-center full-width --subtitle__transLink"> {{ ErrorMessage }}</div>
                      </div>

                    </q-step>
                  </q-stepper>
                </div>
              </q-tab-panel>
              <q-tab-panel name="staked">
                <div class="staked-wrapper">
                  <div v-for="(stake, i) in stakes" :key="i" class="item-wrapper row flex">
                    <div class="col col-9 q-pr-sm">
                      <div class="border column justify-between">
                        <span class="date">Staked date: {{stake.stake_date.toDateString()}}</span>
                        <div class="row flex item-wrapper--row justify-between items-end">
                          <div class="col">Amount: <br> <strong>{{stake.stake_amount}} VTX <q-icon class="q-mb-xs" :name="'img:' + currentAccount.icon" />
                          </strong></div>
                          <div class="col">Period: <br> <strong>{{stake.stake_period}} Days</strong></div>
                          <div class="col mobile-only">{{stake.time_left > 0 ? 'Time left' : 'Stake period ended'}}: <br> <strong>{{stake.time_left}}</strong></div>
                          <div class="col desktop-only">{{stake.time_left > 0 ? 'Time left' : 'Stake period ended'}}: <br>
                            <q-linear-progress rounded stripe size="25px" :value="( (stake.stake_period - stake.time_left) / stake.stake_period )" color="deep-purple-14">
                              <div class="absolute-full flex flex-center">
                                <q-badge color="white" text-color="black" :label="(stake.time_left) + ' Days'" />
                              </div>
                            </q-linear-progress>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div class="col col-3 column justify-end">
                      <div class="border total column justify-end">Total Earning: <br> <strong>{{stake.subsidy}} VTX</strong></div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <br><br><br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
import { userError } from '@/util/errorHandler'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
export default {
  name: 'VTXConverter',
  data () {
    return {
      tab: 'stake',
      step: 0,
      condition: 3,
      currentAccount: {},
      stakePeriod: 2,
      estimatedReward: 0,
      options: [],
      tableData: [],
      active: true,
      showWallet: false,
      showText: false,
      slider: 0,
      progColor: 'green',
      vtxbalance: 0,
      stakes: [],
      allocatable: 0,
      stakedAmount: 0,
      vtxprice: 0,
      sendAmount: 0,
      formatedAmount: null,
      currentProxy: null,
      ErrorMessage: null,
      SuccessMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      transactionId: null,
      transactionError: '',
      spinnervisible: false,
      isPwd: true,
      isPrivateKeyEncrypted: false,
      account: null,
      privateKeyPassword: null,
      showSendModal: false
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },
  async created () {
    let exchangeNotif = document.querySelector('.exchange-notif'); if (exchangeNotif !== null) { exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click')) }
    // console.log('---this.wallet---', this.wallet)
    if (this.wallet) {
      this.currentAccount = this.wallet
      this.params = {
        chainID: this.currentAccount.chain,
        tokenID: this.currentAccount.type,
        accountName: this.currentAccount.name
      }
    } else {
      this.params = this.$store.state.currentwallet.params
      this.tableData = await this.$store.state.wallets.tokens
      this.currentAccount = await this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
        w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName)
      )
    }
    // console.log('this.currentAccount ----------------- ', this.currentAccount)
    let stepParam = this.$route.params.step
    if (this.stakes.length === 0) {
      this.tab = 'stake'
    }
    if (stepParam !== undefined) {
      // console.log('step staking = ', stepParam)
      let highestVTXAccount = this.$store.state.highestVTXAccount.wallet
      this.$store.state.currentwallet.wallet = highestVTXAccount
      this.currentAccount = highestVTXAccount
      this.params = this.$store.state.highestVTXAccount.params
      this.slider = 100
      this.changeSlider()
      this.stakePeriod = 10
      this.changeSlider()
      this.step = parseInt(stepParam)
      this.tab = 'stake'
    }
    if (eos.isPrivKeyValid(this.currentAccount.privateKey)) {
      this.privateKey.key = this.currentAccount.privateKey
      this.isPrivateKeyEncrypted = false
    } else {
      this.isPrivateKeyEncrypted = true
    }
    if (this.params.tokenID === 'vtx' && this.currentAccount < 1000) {
      this.condition = 1
    } else if (this.params.tokenID === 'eos' && this.currentAccount <= 0) {
      this.condition = 1
    }
    let stakedAmounts = 0
    if (this.params.tokenID === 'vtx') {
      let totalBalance = (await eos.getCurrencyBalanceP('vtxstake1111', 'volentixgsys')).toString().split(' ')[0]
      let globalAmnts = (await eos.getTable('vtxstake1111', 'vtxstake1111', 'globalamount'))[0]
      let totalStake = globalAmnts.stake.split(' ')[0]
      let totalSubsidy = globalAmnts.subsidy.split(' ')[0]
      this.allocatable = +totalBalance - (+totalStake + +totalSubsidy)
      // console.log('allocatable', this.allocatable)
      this.stakes = await eos.getTable('vtxstake1111', this.params.accountName, 'accountstake')
      this.stakes.map(s => {
        // console.log('s', s)
        s.stake_date = new Date(s.stake_time * 1000)
        s.stake_done = new Date((s.stake_time * 1000) + (s.stake_period * 86400000))
        s.time_left = date.getDateDiff(s.stake_done, Date.now(), 'days')
        s.stake_amount = Math.round(+s.stake_amount.split(' ')[0] * 10000) / 10000
        s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 10000) / 10000
        stakedAmounts += +s.stake_amount
      })
      this.currentAccount.staked = stakedAmounts
    }
    // console.log('stakes', this.stakes)
  },
  async mounted () {
  },
  methods: {
    sliderToPercent (percent) {
      this.slider = percent
      this.changeSlider()
    },
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Key Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'warning',
        position: 'top'
      })
    },
    changeSlider () {
      if (this.slider >= 0) {
        this.sendAmount = Math.round(Math.pow(10, this.currentAccount.precision) * this.currentAccount.amount * (this.slider / 100)) / Math.pow(10, this.currentAccount.precision)
      } else {
        this.sendAmount = Math.round(Math.pow(10, this.currentAccount.precision) * this.stakedAmount * (this.slider / 100)) / Math.pow(10, this.currentAccount.precision)
      }
      this.checkAmount()
    },
    changeAmount () {
      if (this.sendAmount > +this.currentAccount.amount) {
        this.sendAmount = +this.currentAccount.amount
      }
      if (this.sendAmount >= 0) {
        this.slider = Math.round(10000 * (this.sendAmount / +this.currentAccount.amount)) / 100
      } else {
        this.slider = Math.round(Math.pow(10, this.currentAccount.precision) * this.stakedAmount * (this.slider / 100)) / Math.pow(10, this.currentAccount.precision)
      }
      this.checkAmount()
    },
    checkAmount () {
      let stake_per = Math.round((0.01 + (0.001 * this.stakePeriod)) * 1000) / 1000

      if (+this.sendAmount > 0.0 && +this.sendAmount <= +this.currentAccount.amount) {
        this.slider = Math.round(10000 * (this.sendAmount / +this.currentAccount.amount)) / 100

        if (this.sendAmount >= 10000) {
          this.progColor = 'green'
          // let sep = ' , '
          // console.log(this.sendAmount, sep, stake_per, sep, this.stakePeriod)
          this.estimatedReward = Math.round(this.sendAmount * stake_per * this.stakePeriod * 100) / 100
          // console.log('mul', stake_per)
        } else {
          this.estimatedReward = 0
          this.progColor = 'red'
        }
      }
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.currentAccount.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    async sendTransaction () {
      try {
        this.step = 4
        let memo = this.stakePeriod * 30
        this.formatedAmount = this.formatAmountString()
        const transaction = await eos.transferToken(
          'volentixgsys',
          this.currentAccount.name,
          'vtxstake1111',
          this.formatedAmount,
          memo.toString(),
          this.privateKey.key
        )
        this.transactionError = false
        this.transactionId = transaction.transaction_id
        this.SuccessMessage = 'Congratulations, your transactions have been recorded on the blockchain. You can check it on this <a href="https://bloks.io/transaction/' + this.transactionId + '" target="_blank">block explorer</a>'
      } catch (error) {
        // console.log('transaction errors', error)
        this.transactionError = true
        // console.log('error', error)
        if (error.message.includes('stake amount is too low')) {
          this.ErrorMessage = 'Your VTX stake amount is too low, you need at least 1000 VTX to stake.'
        } else if (error.message.includes('maximum billable CPU time')) {
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.message.includes('has insufficient ram')) {
          this.ErrorMessage = 'Your EOS account does not have enough RAM staked to process the transaction.'
        } else {
          this.ErrorMessage = 'Unknown Error: ' + error
        }
      }
    },
    async unStakeVTX () {
      try {
        await eos.transact({
          actions: [{
            account: 'vtxstake1111',
            name: 'unstake',
            authorization: [{
              actor: this.currentAccount.name,
              permission: 'active'
            }],
            data: {
              owner: this.currentAccount.name
            }
          }]
        }, { keyProvider: this.privateKey.key })
      } catch (error) {
        userError(error.message)
      }
    },
    formatAmountString () {
      let numberOfDecimals = 0
      let stringAmount = (Math.round(+this.sendAmount * Math.pow(10, this.currentAccount.precision)) / Math.pow(10, this.currentAccount.precision)).toString()
      const amountParsed = stringAmount.split('.')
      if (amountParsed && amountParsed.length > 1) {
        numberOfDecimals = amountParsed[1].length
      } else {
        stringAmount += '.'
      }
      for (;numberOfDecimals < this.currentAccount.precision; numberOfDecimals++) {
        stringAmount += '0'
      }
      return stringAmount + ' ' + this.params.tokenID.toUpperCase()
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .chain-tools-wrapper{
    padding: 0px 6%;
    &--list{
      &__hide-chain-tools{
        text-transform: initial !important;
        margin-top: 0px;
        margin-bottom: 10px;
        color: #7272FA !important;
      }
      .list-wrapper{
        overflow: hidden;
        visibility: hidden;
        height: 0px;
        opacity: 0;
        transform: translateY(-20px) scaleY(.5);
        transform-origin: top;
        transition: ease transform .3s, ease opacity .4s;
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
            .q-field__native{
              padding-left: 0px;
              padding-top: 0px;
              padding-bottom: 0px;
              height: $height;
              min-height: unset;
              .q-item{
                padding: 0px;
                padding-left: 18px;
                min-height: $height;
                padding-bottom: 0px;
                .q-item__section{
                  padding-right: 21px;
                  min-width: 36px;
                  margin-left: -15px;
                  .q-item__label + .q-item__label {
                    margin-top: 0px;
                  }
                }
              }
            }
          }
        }
        &--chain{
          &__type{
            background-color: #fff;
            margin-bottom: 10px;
            border-radius: 0px 0px 10px 10px;
            padding: 3% 8%;
            box-shadow: 0px 4px 16px 0px rgba(black, .09);
            font-family: $Titillium;
            font-size: 20px;
            color: #2A2A2A;
            font-weight: $bold;
            b{
              color: #7272FA;
              text-transform: uppercase;
            }
          }
          &__coming-soon{
            ul{
              list-style: none;
              padding: 0px;
              margin: 0px;
              padding: 5% 6%;
              li{
                &:not(:last-child){
                  border-bottom: 1px solid #707070;
                }
                .btn-soon{
                  text-transform: initial !important;
                  padding: 20px 10px;
                  border-radius: 0px;
                  /deep/ .q-btn__content{
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    align-items: center;
                    align-content: center;
                  }
                  .title{
                    font-size: 20px;
                    color: #454F63;
                    font-weight: $bold;
                    margin-right: auto;
                  }
                  .soon{
                    font-size: 16px;
                    color: #B0B0B0;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    align-items: center;
                    align-content: center;
                  }
                  .icon{
                    color: #78849E;
                    position: relative;
                    top: 2px;
                    margin-left: 20px;
                  }
                }
              }
            }
          }
          &__eos-to-vtx-convertor{
            background-color: #fff;
            margin-bottom: 10px;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            padding: 0%;
            box-shadow: 0px 4px 16px 0px rgba(black, .09);
            &--title{
              font-size: 22px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #2A2A2A;
              margin: 0px;
              padding-left: 22px;
              margin-top: 3px;
              position: relative;
            }
            .staked-wrapper{
              padding: 20px;
              @media screen and (min-width: 1024px) {
                padding: 30px 0px;
              }
              .item-wrapper{
                margin-bottom: 10px;
              }
              .date{
                font-size: 10px;
                @media screen and (min-width: 1024px) {
                  font-size: 20px;
                }
              }
              .total{
                $purple : #6C0DCB;
                font-size: 10px;
                color: $purple !important;
                @media screen and (min-width: 1024px) {
                  font-size: 24px;
                  font-weight: $bold;
                }
                strong{
                  color: $purple !important;
                }
              }
              .item-wrapper--row{
                height: 35px;
                @media screen and (min-width: 1024px) {
                  height: 50px;
                }
              }
              .col{
                color: #B0B0B0;
                font-size: 10px;
                @media screen and (min-width: 1024px) {
                  font-size: 16px;
                }
                font-family: $Titillium;
                font-weight: $regular;
                strong{
                  font-weight: $bold;
                  color: #2A2A2A;
                }
              }
              .border{
                border: 1px solid rgba(#707070, .09);
                border-radius: 10px;
                height: 100%;
                padding: 10px;
              }
            }
            .q-tabs{
              box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
            }
            /deep/ .q-tab__content{
              width: 100%;
              height: 50px;
              .q-tab__label{
                color: #B0B0B0;
                font-size: 16px !important;
                text-transform: capitalize;
                // margin-top: -5px;
                font-family: $Titillium;
                font-weight: $regular;
              }
              .q-tab__indicator{
                height: 4px;
              }
            }
            /deep/ .q-tab--active{
              .q-tab__indicator{
                color: #7272FA !important;
              }
              .q-tab__label{
                color: #7272FA;
                font-weight: $bold;
              }
            }
            /deep/ .q-tab-panel{
              padding: 0px;
            }
            /deep/ .q-tabs--dense .q-tab{
              padding: 0px;
            }
            /deep/ .q-stepper__step{
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
            /deep/ .q-stepper__tab{
              .q-stepper__title{
                font-size: 20px;
                font-family: $Titillium;
                font-weight: $bold;
                color: #2A2A2A;
              }
              &.q-stepper__tab--active,&.q-stepper__tab--done{
                .q-stepper__title{
                  color: #7272FA;
                }
                .q-stepper__dot{
                  background: #7272FA;
                }
              }
            }
            .--input{
              margin-top: 20px;
              /deep/ .q-field{
                height: 40px;
              }
              /deep/ .q-field__native,
              /deep/ .q-field__prefix,
              /deep/ .q-field__suffix{
                padding-top: 0px;
                padding-bottom: 0px;
              }
              /deep/ .q-field__label{
                top: 10px;
                font-size: 12px;
                font-weight: $bold;
                font-family: $Titillium;
              }
              /deep/ .q-field__marginal{
                height: 40px;
              }
              /deep/ .q-field__control{
                height: 40px;
              }
            }
            .--slider{
              /deep/ &.q-slider--dark {
                .q-slider__track-container{
                  background: rgba(0, 0, 0, 0.3);
                }
                .q-slider__pin-value-marker-text{
                  font-weight: $bold;
                  font-size: 11px;
                }
                .q-slider__pin-value-marker-bg{
                  background: #FFB200 !important;
                }
                .text-green{
                  // background: #FFB200 !important;
                }
              }
            }
            .--next-btn{
              width: fit-content;
              text-transform: initial !important;
              margin-left: 10px;
              margin-bottom: 10px;
            }
            .--progress{
              height: 20px;
              /deep/ .q-linear-progress{
                margin-top: 8px;
                height: 5px !important;
                max-width: 90%;
                margin-left: auto;
                margin-right: auto;
                .q-linear-progress__track{
                  background: #FFB200;
                }
                .q-linear-progress__model--indeterminate:before,
                .q-linear-progress__model--indeterminate:after{
                  background: #FFB200;
                }
              }
              &.hr-vertical{
                max-width: 50px;
                .bar{
                  height: 30px;
                  width: 4px;
                  background: #FFB200;
                  margin-top: 5px;
                  border-radius: 10px;
                }
              }
            }
            .--back-btn{
              position: absolute;
              right: 0px;
              top: 6px;
            }
            .content__success{
            border: 2px solid #00D0CA;
            padding: 10px 15px;
            border-radius: 20px;
            background-color: #fff;
            box-shadow: 0px 5px 10px 0px rgba(black, .1);
            position: relative;
            a{
              display: block;
              margin-top: 10px;
            }
            .success_icon{
              display: block;
              margin: auto;
              margin-top: -50px;
              margin-bottom: -10px;
              width: 80px;
            }
          }
          .content__failed{
            border: 2px solid #FFB200;
            padding: 10px 15px;
            border-radius: 20px;
            background-color: #fff;
            box-shadow: 0px 5px 10px 0px rgba(black, .1);
            position: relative;
            a{
              display: block;
              margin-top: 10px;
            }
            .failed_icon{
              display: block;
              margin: auto;
              margin-top: -50px;
              margin-bottom: -10px;
              width: 80px;
            }
          }
            .--subtitle{
              font-size: 17px;
              color: #000;
              font-family: $Titillium;
              font-weight: $regular;
              line-height: 20px;
              margin-top: 10px;
              margin-bottom: 30px;
              &__success{
                color: #00D0CA;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__faild{
                color: #FFB200;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__transLink{
                color: #2A2A2A;
                // border-bottom: 1px solid;
                width: fit-content;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__summary{
                margin-bottom: 20px;
                font-weight: $bold;
              }
              &__summary--list{
                list-style: disc;
                padding-left: 24px;
                margin-top: -10px;
                li{
                  color: #B0B0B0;
                }
              }
            }
            .--title,.--amount{
              font-size: 15px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #B0B0B0;
              text-transform: initial !important;
              line-height: 20px;
            }
            .--alert{
              font-size: 17px;
              line-height: 21px;
              font-family: $Titillium;
            }
            .--amount{
              color: #2A2A2A !important;
            }
          }
        }
      }
      &.open{
        margin-bottom: -100px;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 10px;
        }
      }
    }
  }
  /deep/ .ellipsis_important{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    max-width: 145px;
  }
  .dark-theme{
    .vtx-converter-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor{
      background-color: #04111F;
    }
    .vtx-converter-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor--title{
      color: #FFF;
    }
    .vtx-converter-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--subtitle{
        color: #CCC;
    }
    .vtx-converter-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--amount{
      color: #FFF !important;
    }
  }
  /deep/ .q-stepper{
    &.q-dark{
      background: #04111F;
      .q-stepper__title{
        color: #CCC !important;
      }
    }
  }
</style>
