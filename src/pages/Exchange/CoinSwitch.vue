<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat>
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-card-section class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium uppercase">{{ $t('SettingsView.exchange') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
      <q-stepper v-model="step" done-color="green" active-color="green" ref="stepper" alternative-labels animated>
        <q-step default :name="1" title="Select Coin to Deposit" class="bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white uppercase">
              <q-item>
                <q-item-label>Coin you Send</q-item-label>
              </q-item>
              <div class="q-pa-md">
                <q-select
                    dark
                    label="Select Coin to Exchange"
                    separator
                    v-model="depositCoin"
                    :options="depositCoinOptions"
                    :options-sanitize="false"
                    :sanitize="false"
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
        <q-step :name="2" title="Select Destination Coin" class="bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white uppercase">
              <q-item>
                <q-item-label>Coin you Get</q-item-label>
              </q-item>
              <div class="q-pa-md">
                <q-select
                    dark
                    label="Select Coin to Exchange"
                    separator
                    v-model="destinationCoin"
                    :options="destinationCoinOptions"
                    :options-sanitize="false"
                    :sanitize="false"
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
        <q-step :name="3" title="Select Quatity" class="bg-black workflow-step">
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
                  :float-label="depositQuantityLabel"
                />
                <q-input
                  class="q-pa-sm"
                  type="number"
                  dark
                  v-model="destinationQuantity"
                  color="yellow"
                  @input="quatityFromDestination()"
                  :float-label="destinationQuantityLabel"
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
        <q-step :name="4" title="View Order" class="bg-black workflow-step">
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
  </q-page>
</template>

<script>
import store from '@/store'
import { userError } from '@/util/errorHandler'

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

let url = ''
if (process.env.PROD) {
  url = 'https://api.coinswitch.co'
} else {
  url = 'https://cors-anywhere.herokuapp.com/https://api.coinswitch.co'
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
      depositCoinOptions: [{
        label: 'Bitcoin',
        value: 'btc',
        image: 'https://files.coinswitch.co/public/coins/btc.png'
      }],
      destinationCoin: null,
      destinationQuantity: 0,
      destinationCoinOptions: [{
        label: 'EOS',
        value: 'eos',
        image: 'https://files.coinswitch.co/public/coins/eos.png'
      }],
      rateData: {
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
      return typeUpper(this.depositCoin) + ' to Send'
    },
    destinationQuantityLabel () {
      return typeUpper(this.destinationCoin) + ' to Receive'
    },
    returnAddressLabel () {
      return typeUpper(this.depositCoin) + ' Return Address'
    },
    destinationAddressLabel () {
      return typeUpper(this.destinationCoin) + ' Destination Address'
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
      })
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
          depositCoin: self.depositCoin,
          destinationCoin: self.destinationCoin,
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
          depositCoin: self.depositCoin
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
          depositCoin: self.depositCoin,
          destinationCoin: self.destinationCoin
        },
        { headers })
        .then((response) => {
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
.q-item-side-left img {
    min-width: 18px !important;
    max-width: 18px !important;
    max-height: 18px !important;
}
</style>
