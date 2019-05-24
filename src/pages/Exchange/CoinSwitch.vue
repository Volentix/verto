<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat class="bg-black">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-card flat class="bg-black" style="width: 100%">
        <q-card-section class="text-weight-bold text-center">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium uppercase">{{ $t('SettingsView.exchange') }}</big>
          <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
        </q-card-section>
      </q-card>
      <q-card flat class="bg-black" style="width: 100%">
        <q-stepper v-model="step" done-color="green" active-color="green" ref="stepper" header-nav alternative-labels animated>
          <q-step
            default
            :name="1"
            title="Select Coin to Deposit"
            class="bg-black workflow-step"
            :done="step > 1"
            :header-nav="step > 1"
          >
            <q-card-section>
              <div class="text-center text-white uppercase">
                <div class="q-pa-md">
                  <q-select
                      dark
                      label="Select Coin to Send"
                      separator
                      v-model="depositCoin"
                      :disabled="!depositCoinOptions"
                      :loading="!depositCoinOptions"
                      :options="depositCoinOptions"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        dark
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-section avatar>
                          <q-icon :name="`img:${scope.opt.image}`" />
                        </q-item-section>
                        <q-item-section dark>
                          <q-item-label v-html="scope.opt.label" />
                          <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:selected>
                      <q-item
                        v-if="depositCoin"
                      >
                        <q-item-section avatar>
                          <q-icon :name="`img:${depositCoin.image}`" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="depositCoin.label" />
                          <q-item-label caption>{{ depositCoin.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        v-else>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input
                    type="text"
                    dark
                    v-model="refundAddress.address"
                    color="green"
                    @input="verifyAddress()"
                    :label="returnAddressLabel"
                  />
                  <q-input
                    type="text"
                    dark
                    v-model="refundAddress.tag"
                    color="green"
                    label="Tag or Memo, often required by exchanges"
                  />
                </div>
                <div class="q-pa-sm" v-show="true" @click="getPairs(); $refs.stepper.next()">
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-card-section>
          </q-step>
          <q-step
            :name="2"
            title="Select Destination Coin"
            class="bg-black workflow-step"
            :done="step > 2"
            :header-nav="step > 2"
          >
            <q-card-section>
              <div class="text-center text-white uppercase">
                <div class="q-pa-md">
                  <q-select
                      dark
                      label="Select Coin to Receive"
                      separator
                      v-model="destinationCoin"
                      :disabled="!destinationCoinOptions"
                      :loading="!destinationCoinOptions"
                      :options="destinationCoinOptions"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-section avatar>
                          <q-icon :name="`img:${scope.opt.image}`" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="scope.opt.label" />
                          <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:selected>
                      <q-item
                        v-if="destinationCoin"
                      >
                        <q-item-section avatar>
                          <q-icon :name="`img:${destinationCoin.image}`" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="destinationCoin.label" />
                          <q-item-label caption>{{ destinationCoin.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        v-else>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input
                    type="text"
                    dark
                    v-model="destinationAddress.address"
                    color="green"
                    @input="verifyAddress()"
                    :label="destinationAddressLabel"
                  />
                  <q-input
                    type="text"
                    dark
                    v-model="destinationAddress.tag"
                    color="green"
                    label="Tag or Memo, often required by exchanges"
                  />
                </div>
                <div class="q-pa-sm" v-show="true" @click="getRate(); $refs.stepper.next()">
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-card-section>
          </q-step>
          <q-step
            :name="3"
            title="Select Quatity"
            class="bg-black workflow-step"
            :done="step > 3"
            :header-nav="step > 3"
          >
            <q-card-section>
              <div class="text-center text-white uppercase">
                <q-item>
                  <q-item-label>Choose Quantity</q-item-label>
                </q-item>
                <div class="q-pa-md">
                  <q-input
                    class="q-pa-sm"
                    type="number"
                    dark
                    v-model="depositQuantity"
                    color="green"
                    @input="quatityFromDeposit()"
                    :disabled="!rateData"
                    :loading="!rateData"
                    :label="depositQuantityLabel"
                    :rules="[ val => val >= rateData.limitMinDepositCoin || 'This is less than the minimum allowed',
                              val => val < rateData.limitMaxDepositCoin || 'This is more than the maximum allowed']"
                  />
                  <q-input
                    class="q-pa-sm"
                    type="number"
                    dark
                    v-model="destinationQuantity"
                    color="yellow"
                    @input="quatityFromDestination()"
                    :disabled="!rateData"
                    :loading="!rateData"
                    :label="destinationQuantityLabel"
                    :rules="[ val => val >= rateData.limitMinDestinationCoin || 'This is less than the minimum allowed',
                              val => val < rateData.limitMaxDestinationCoin || 'This is more than the maximum allowed']"
                  />
                </div>
                <div class="q-pa-sm" v-show="true" @click="postOrder(); $refs.stepper.next()">
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-card-section>
          </q-step>
          <q-step
            :name="4"
            title="View Order"
            class="bg-black workflow-step"
            :done="step > 4"
            :header-nav="step > 4"
          >
            <q-card-section>
              <div class="text-center text-white uppercase">
                <q-item>
                  <q-item-label>Execute Exchange by Sending the Coins</q-item-label>
                </q-item>
                <div class="q-pa-md">
                  <div class="col-auto flex flex-center">
                    <div class="q-pr-md">
                      <qrcode :value="exchangeAddress.address" :options="{size: 150}"></qrcode>
                    </div>
                  </div>
                  <div class="col flex items-center">
                    <div>
                      <div class="q-headline qr-wallet-title">{{ $t('Main.address') }}</div>
                      <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >{{exchangeAddress.address}}</p>
                      <q-btn flat icon="file_copy" label="Copy Key" @click="copyKey(exchangeAddress.address)" />
                    </div>
                  </div>
                  <div>
                    <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >{{expectedDepositCoinAmount}}</p>
                    <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >{{expectedDestinationCoinAmount}}</p>
                  </div>
                </div>
                <div class="q-pa-sm" v-show="true" @click="$refs.stepper.next()">
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-card-section>
          </q-step>
        </q-stepper>
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import store from '@/store'
import { userError } from '@/util/errorHandler'

const url = 'https://api.coinswitch.co'
const headers = {
  'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
}

const typeUpper = function (thing) {
  if (typeof thing === 'string' && thing.length >= 1) {
    return thing.toUpperCase()
  } else {
    return ''
  }
}

export default {
  components: {
  },
  data () {
    return {
      step: 1,
      optionsSanitize: false,
      spinnervisible: false,
      lastChangedValue: 'deposit',
      coins: [],
      depositCoin: null,
      depositQuantity: 0,
      depositCoinOptions: null,
      destinationCoin: null,
      destinationQuantity: 0,
      destinationCoinOptions: null,
      rateData: null,
      rateDataTemplate: {
        rate: 1,
        minerFee: 0,
        limitMinDepositCoin: 0,
        limitMaxDepositCoin: 1,
        limitMinDestinationCoin: 1,
        limitMaxDestinationCoin: 2
      },
      destinationAddress: {
        address: '',
        tag: null
      },
      refundAddress: {
        address: '',
        tag: null
      },
      exchangeAddress: {
        address: '',
        tag: null
      },
      expectedDepositCoinAmount: 0,
      expectedDestinationCoinAmount: 0
    }
  },
  computed: {
    depositQuantityLabel () {
      if (this.depositCoin != null) {
        return typeUpper(this.depositCoin.value) + ' to Send'
      } else {
        return 'Coin to Send'
      }
    },
    destinationQuantityLabel () {
      if (this.destinationCoin != null) {
        return typeUpper(this.destinationCoin.value) + ' to Receive'
      } else {
        return 'Coin to Receive'
      }
    },
    returnAddressLabel () {
      if (this.depositCoin != null) {
        return typeUpper(this.depositCoin.value) + ' Return Address'
      } else {
        return 'Coin Return Address'
      }
    },
    destinationAddressLabel () {
      if (this.destinationCoin != null) {
        return typeUpper(this.destinationCoin.value) + ' Destination Address'
      } else {
        return 'Coin Destination Address'
      }
    }
  },
  created () {
  },
  mounted () {
    const self = this
    this.$axios.get(url + '/v2/coins', { headers }).then(function (result) {
      console.log('coins results:', result.data)
      // will be using this coins array later with the destination select
      self.coins = result.data.data
      self.depositCoinOptions = self.coins.map(function (coin) {
        if (coin.isActive === true) {
          let row = {
            'label': coin.name,
            'value': coin.symbol,
            'image': coin.logoUrl
          }
          return row
        }
      }).filter(function (el) {
        return el != null
      }).sort(function (a, b) {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1
        }
        return 1
      })

      console.log('depositCoinOptions:', self.depositCoinOptions)
    })
  },
  methods: {
    verifyAddress () {
      // check validity of all keys
    },
    quatityFromDeposit () {
      // deal with precision
      this.destinationQuantity = (+this.depositQuantity * +this.rateData.rate) - +this.rateData.minerFee
      this.lastChangedValue = 'deposit'
      console.log('destinationQuantity: ', this.destinationQuantity)
    },
    quatityFromDestination () {
      // deal with precision
      this.depositQuantity = (+this.destinationQuantity + +this.rateData.minerFee) / +this.rateData.rate
      this.lastChangedValue = 'destination'
      console.log('depositQuantity: ', this.depositQuantity)
    },
    postOrder () {
      const self = this
      let depositCoinAmount = null
      let destinationCoinAmount = null

      if (self.lastChangedValue === 'deposit') {
        depositCoinAmount = self.depositQuantity
      } else {
        destinationCoinAmount = self.destinationQuantity
      }

      this.$axios.post(url + '/v2/order',
        {
          depositCoin: self.depositCoin.value,
          destinationCoin: self.destinationCoin.value,
          depositCoinAmount,
          destinationCoinAmount,
          destinationAddress: self.destinationAddress,
          refundAddress: self.refundAddress
        },
        { headers })
        .then((response) => {
          console.log('order results:', response.data)
          self.exchangeAddress = response.data.data.exchangeAddress
          self.expectedDepositCoinAmount = response.data.data.expectedDepositCoinAmount
          self.expectedDestinationCoinAmount = response.data.data.expectedDestinationCoinAmount
        })
        .catch((err) => {
          console.log(err)
          userError('There was a problem posting the order')
        })
    },
    getPairs () {
      const self = this
      this.$axios.post(url + '/v2/pairs',
        {
          depositCoin: self.depositCoin.value
        },
        { headers })
        .then((response) => {
          console.log('pairs results:', response.data)
          self.destinationCoinOptions = response.data.data.map(function (coin) {
            if (coin.isActive === true) {
              let row = {
                'label': self.coins.filter(coins => coins.symbol === coin.destinationCoin)[0].name,
                'value': coin.destinationCoin,
                'image': self.coins.filter(coins => coins.symbol === coin.destinationCoin)[0].logoUrl
              }
              return row
            } // deal with false, should not create empty option.
          }).filter(function (el) {
            return el != null
          }).sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) {
              return -1
            }
            return 1
          })
        })
        .catch((err) => {
          console.log(err)
          userError('There was a problem getting the destination coins')
        })
    },
    getRate () {
      const self = this
      this.$axios.post(url + '/v2/rate',
        {
          depositCoin: self.depositCoin.value,
          destinationCoin: self.destinationCoin.value
        },
        { headers })
        .then((response) => {
          console.log('rate results:', response.data)
          self.rateData = response.data.data
        })
        .catch((err) => {
          console.log(err)
          userError('There was a problem getting the rate data')
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-menu {
  background: #424242;
}
.q-item__label--caption {
  color: #848484;
}
</style>
