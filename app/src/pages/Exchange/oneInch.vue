<template>
 
        <q-stepper animated :vertical="$q.screen.lt.sm" v-model="step" ref="stepper" class="stepper--desktop" alternative-labels color="primary" animated flat >
          <q-step :name="1" prefix="1" default  title="Select Coin to Send" :done="step > 1">
               <q-select
                  class="select-input"
                  light
                  separator
                  use-input
                  outlined
                  rounded
                  v-model="depositCoin" 
                  @filter="filterDepositCoin" 
                  :disabled="!depositCoinOptions" 
                  :loading="!depositCoinOptions" 
                  :options="depositCoinOptions"
                  >
                <template v-slot:option="scope">
                  <q-item
                    class="custom-menu"
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <q-icon :name="`img:${scope.opt.image}`" />
                    </q-item-section>
                    <q-item-section >
                      <q-item-label v-html="scope.opt.label" />
                      <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                 </template>
                <template v-slot:selected>
                  <q-item v-if="depositCoin">
                    <q-item-section avatar>
                      <q-icon :name="`img:${depositCoin.image}`" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="depositCoin.label" />
                      <q-item-label caption>{{ depositCoin.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </template>
              </q-select>  
              <q-stepper-navigation  class="flex justify-end">
                <q-btn @click="$refs.stepper.next()"  color="deep-purple-14" class="--next-btn q-px-md" rounded label="Next"  />
              </q-stepper-navigation>
           </q-step>

       <q-step :name="2" prefix="2" default  title="Select Coin to Receive" :done="step > 2">
         <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn absolute-top-right"/>
         <q-select
            class="select-input"
            light
            separator
            use-input
            rounded
            outlined
            @input="swapData.error = false"
            @filter="filterDestinationCoin"
            v-model="destinationCoin"
            :disabled="!destinationCoinOptions"
            :loading="!destinationCoinOptions"
            :options="destinationCoinOptions"
             >
            <template v-slot:option="scope">
              <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
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
              <q-item v-if="destinationCoin">
                <q-item-section avatar>
                  <q-icon :name="`img:${destinationCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="destinationCoin.label" />
                  <q-item-label caption>{{ destinationCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-else>
              </q-item>
            </template>
            </q-select>
           <div class="text-red text-body1 q-mt-sm" v-if="swapData.error">
             {{swapData.errorText.replace('[from]',depositCoin.value).replace('[to]',destinationCoin.value)}}</div>
         </div>
      
        <q-stepper-navigation  class="flex justify-end">
          <q-btn @click="getSwapQuote()" :loading="spinnervisible" :disable="spinnervisible"  color="deep-purple-14" class="--next-btn q-px-md" rounded label="Next" />
        </q-stepper-navigation>
      </q-step>

       <q-step :name="3" prefix="3" default  title="Select Quantity" :done="step > 3">
        <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn absolute-top-right"/>
        <div class="standard-content--body">
          <div class="standard-content--body__form">
            <div class="pay-get-wrapper column justify-between">
              <div class="pay-wrapper column">
                <span class="label">you pay</span>
                <span class="value">
                  <q-input v-if="depositCoin" bottom-slots ref="depositQuantity" type="number" @input="getSwapQuote()" :suffix="depositCoin.value.toUpperCase()" rounded class="full-width pl0" flat v-model="swapData.fromAmount" :disabled="spinnervisible" :loading="spinnervisible" :rules="[ val => val > swapData.limitMinDepositCoin || 'This is less than the minimum allowed', val => val < swapData.limitMaxDepositCoin || 'This is more than the maximum allowed']" >
                  <template v-slot:hint>
                    <div  v-if="swapData.marketData.length">{{convertETHToUSD(swapData.fromAmount)}}</div>        
                  </template>
                  </q-input>
                </span>
              </div>
              <q-btn flat unelevated class="exchange-btn" text-color="black">
                <q-icon name="arrow_downward" />
              </q-btn>
              <div class="get-wrapper column" v-if="destinationCoin">
                <span class="label">you get</span>
                <span class="value">
                  <q-input readonly rounded class="full-width pl0" flat ref="destinationQuantity" :suffix="destinationCoin.value.toUpperCase()" v-model="swapData.toAmount"  :disabled="spinnervisible" :loading="spinnervisible" type="number" />
                </span>
              </div>
            </div>
          
            <div class="flex justify-end" v-if="swapData.marketData.length">
               Gas Price: {{swapData.gasPrice}}
            </div>
            <br>
          </div>
          <q-stepper-navigation  class="flex justify-end">
            <q-btn @click="$refs.stepper.next()" :disable="spinnervisible" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
          </q-stepper-navigation>
        </div>
     
      </q-step>

      <q-step
        :name="4"
        title="Order review"
        icon="remove_red_eye"
      > <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn absolute-top-right"/>
        <div class="row"  v-if="depositCoin">
        
       <div class=" col-12 col-md-5">
       <div class="col-12 text-h6 q-mb-sm">Amount of {{depositCoin.value}} to swap </div>
        <q-input bottom-slots   type="number" min="0"  readonly input-class="text-left text-red"  class=" col-12 col-md-5 text-right" standout v-model="swapData.fromAmount"   :label="'Amount of '+depositCoin.value+' to swap'" >
        <template v-slot:prepend>
          <q-avatar>
            <q-icon :name="`img:${depositCoin.image}`" />
          </q-avatar>
        </template>
         <template v-if="false" v-slot:hint>
          <div :class="[$q.screen.gt.xs ? 'text-body1' : '', 'text-red']" >Gas Price: {{swapData.gasPrice}}</div> 
        </template>
       </q-input> 
        </div>
        <div class="col-12 col-md-2 flex flex-center text-weight-thin text-grey-4 ">
          <q-icon class="text-grey-5 q-px-lg" name="sync_alt" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        </div>
        <div class=" col-12 col-md-5">
        <div class="col-12 text-h6 q-mb-sm" v-if="destinationCoin">{{destinationCoin.value}} amount you will receive </div>
        <q-input bottom-slots  readonly type="number" min="0"  :loading="spinnervisible" input-class="text-left"  class=" col-12 text-right" standout v-model="swapData.toAmount"   label="Amount" >     
        <template v-slot:prepend>
          <q-avatar>
            <q-icon :name="`img:${destinationCoin.image}`" />
          </q-avatar>
        </template>
        <template v-slot:hint>
          <div  v-if="swapData.ethToUsd">{{convertETHToUSD(swapData.toAmount)}}</div>        
        </template>
       </q-input>    
       </div>
    </div> 
      <q-dialog persistent v-model="swapData.showDisclaimerWrapper">
      <q-card class="q-pa-md" style="width: 700px; max-width: 92vw;">
        <q-toolbar>
          <q-avatar><img src="statics/icon.png"></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Disclaimer</span> </q-toolbar-title>
        </q-toolbar>
        <q-card-section class="text-h6">
          <div class="parg">
            This transaction is carried out using an open API linked to various Exchanges.<br>
            By sending coins to the above address, you agreed to <a href="https://coinswitch.co/terms" target="_blank">the terms and conditions</a> of the selected provider.
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn flat label="Accept" class="accept-disclaimer" @click="swapData.termsAccepted = true" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

        
           <q-stepper-navigation  v-show="true" class="flex justify-end">
            <div class="row full-width" style="padding-left: 6px; margin-top: -20px;">
              <div class="q-gutter-sm">
                <q-btn color="white" flat @click="swapData.showDisclaimerWrapper = true" class="lower bold" text-color="black" label="Read the disclaimer" />
              </div>
            </div>
            <div class="row full-width" style="padding-left: 13px; margin-top: 10px;">
              <div class="q-gutter-sm"><q-checkbox label="I accept" color="deep-purple-14" v-model="swapData.termsAccepted" /></div>
            </div>
            <div class="standard-content--footer">
              <q-btn  :disable="!swapData.termsAccepted" @click="doSwap()" flat class="action-link next" color="black" text-color="white">
                <span v-if="depositCoin" class="label">Exchange {{ depositCoin.value.toUpperCase() }} <q-icon name="arrow_forward" color="white" class="left-icon" /> {{ destinationCoin.value.toUpperCase() }}</span>
              </q-btn>
            </div>
          </q-stepper-navigation>
       </q-step>
    </q-stepper>
</template>

<script>
  import store from '@/store'
  import {
    userError
  } from '@/util/errorHandler'
  const _1inch = 'https://api.1inch.exchange'
  const url = 'https://api.coinswitch.co'
  let headers = {
    // 'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
  }
  const typeUpper = function(thing) {
    if (typeof thing === 'string' && thing.length >= 1) {
      return thing.toUpperCase()
    } else {
      return ''
    }
  }
  export default {
    components: {},
    data() {
      return {
        tableData:null,
        swapData: {
          marketData:[],
          fromAmount: 1,
          toAmount: null,
          toAmount: 1,
          errorText: 'Converting [from] to [to] cannot be done at this moment please try another coin',
          error: false,
          customPriceSlipage: null,
          termsAccepted: false,
          gasPrice: null,
          ethToUsd:null,
          limitMinDepositCoin: 0,
          limitMaxDepositCoin: 2,
          limitMinDestinationCoin: 1,
          limitMaxDestinationCoin: 2,
          showDisclaimerWrapper:false
        },
        step: 1,
        web3:null,
        ethTokens: [],
        optionsSanitize: false,
        spinnervisible: false,
        lastChangedValue: 'deposit',
        coins: [],
        depositCoin: null,
        depositQuantity: 0,
        depositCoinOptions: null,
        depositCoinUnfilter: null,
        destinationCoin: null,
        destinationQuantity: 0,
        destinationCoinOptions: null,
        destinationCoinUnfilter: null,
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
        expectedDestinationCoinAmount: 0,
        orderId: null,
        status: null,
        requestStop: false,
        exchangesList: [],
        columns: [{
            name: 'exchange',
            required: true,
            label: 'Exchange',
            align: 'left',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true,
            headerClasses: 'text-h6'
          },
          {
            name: 'rate',
            align: 'left',
            label: 'Rate',
            field: 'rate',
            sortable: true
          },
          {
            name: 'txgas',
            label: 'Tx Gas',
            field: 'txgas',
            sortable: true
          },
          {
            name: 'diff',
            label: 'Diff',
            field: 'difference'
          },
        ],
        ethAccount:null,
        data: [{
          name: '1inch',
          rate: '47.4328584311 AAPL/aDAI',
          txgas: '≈ $17.54',
          difference: 'MATCH'
        }]
      }
    },
    computed: {
      getStatus() {
        let value = 0
        switch (this.status) {
          case null:
          case 'no_deposit':
          case 'failed':
          case 'refunded':
          case 'timeout':
            value = 0
            break
          case 'confirming':
            value = 25
            break
          case 'exchanging':
            value = 50
            break
          case 'sending':
            value = 75
            break
          case 'complete':
            value = 100
            break
        }
        return value
      },
      friendlyStatus() {
        let value = ''
        switch (this.status) {
          case null:
            value = ''
            break
          case 'no_deposit':
            value = 'No deposit detected yet'
            break
          case 'failed':
            value = 'The transaction has failed'
            break
          case 'refunded':
            value = 'The transaction has been refunded'
            break
          case 'timeout':
            value = 'The transaction has timed out'
            break
          case 'confirming':
            value = 'The transaction is confirming'
            break
          case 'exchanging':
            value = 'The transaction is exchanging'
            break
          case 'sending':
            value = 'The coins are being sent'
            break
          case 'complete':
            value = 'The transaction is complete'
            break
        }
        return value
      },
      trackColor() {
        let value = ''
        switch (this.status) {
          case null:
          case 'no_deposit':
          case 'confirming':
          case 'exchanging':
          case 'sending':
          case 'complete':
            value = 'white'
            break
          case 'failed':
          case 'refunded':
          case 'timeout':
            value = 'red'
            break
        }
        return value
      },
      logoUrl() {
        if (this.destinationCoin != null) {
          return '' // this.coins.filter(coins => coins.symbol === this.destinationCoin.value)[0].logoUrl
        } else {
          return '/static/icon.png'
        }
      },
      exchangeLabel() {
        if (this.depositCoin != null) {
          return 'Complete this exchange by sending ' + this.expectedDepositCoinAmount + ' ' + typeUpper(this.depositCoin.value) + ' to this address within the next 12 hours'
        } else {
          return 'Complete this exchange by sending the coins to this address within the next 12 hours'
        }
      },
      depositQuantityLabel() {
        if (this.depositCoin != null) {
          return typeUpper(this.depositCoin.value) + ' to Send'
        } else {
          return 'Coin to Send'
        }
      },
      destinationQuantityLabel() {
        if (this.destinationCoin != null) {
          return typeUpper(this.destinationCoin.value) + ' to Receive'
        } else {
          return 'Coin to Receive'
        }
      },
      returnAddressLabel() {
        if (this.depositCoin != null) {
          return 'Your ' + typeUpper(this.depositCoin.value) + ' return address [in case the transaction does not complete]'
        } else {
          return 'Your return address [in case the transaction does not complete]'
        }
      },
      destinationAddressLabel() {
        if (this.destinationCoin != null) {
          return 'Address to receive new ' + typeUpper(this.destinationCoin.value)
        } else {
          return 'Address to receive new coin'
        }
      }
    },
   async created () {
    
    this.getMarketDataVsUSD()
    this.getCoins()
    this.getExchanges()
    let tableData = await this.$store.state.wallets.tokens
    this.ethAccount = tableData.find(w => w.chain === 'eth' && w.type === 'eth')
    this.ethTokens = tableData.filter(w => w.chain === 'eth')
    console.log(this.ethAccount,'ethAccount', tableData)
  },
    mounted() {
  
      const Web3 = require('web3')
      this.web3  = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'))
    },
    watch: {
      step(newVal, oldVal) {
        //Remove selected coin from array of receiving coins 
        if (newVal == oldVal + 1) {
          this.destinationCoinOptions = this.destinationCoinUnfilter.filter(o => o.value.toLowerCase() != this.depositCoin.value.toLowerCase())
        }
      },
      'swapData.toAmount': function(newVal, oldVal) {
        if (newVal != null && this.step == 2) {
          this.$refs.stepper.next()
        }
      }
    },
    methods: {
      getCoins() {
          const self = this
          this.$axios.get(_1inch + '/v1.1/tokens').then(function(result) {
            // will be using this coins array later with the destination select
            self.coins = result.data

            let tokensArray = self.ethTokens.map(function(val, index) {
              return val.type.toLowerCase();
            })
            self.coins = Object.keys(self.coins).map(function(key, index) {

              let row = {
                'label': self.coins[key].name,
                'value': self.coins[key].symbol,
                'image': 'https://1inch.exchange/assets/tokens/' + self.coins[key].address.toLowerCase() + '.png',
                'address': self.coins[key].address
              }
              return row

            })
            self.depositCoinOptions = self.coins.filter(function(el) {
              return el != null
            }).sort(function(a, b) {
              if (a.label.toLowerCase() < b.label.toLowerCase()) {
                return -1
              }
              return 1
            })
            let coinsArray = self.coins.map(function(val, index) {
              return val.value.toLowerCase();
            })

            console.log('ETH  wallet tokens ->', tokensArray)
            console.log(' 1Inch Tokens ->', coinsArray)
            console.log('Intersection -> ', coinsArray.filter(value => tokensArray.includes(value)))
            console.log('Difference ->', tokensArray.filter(value => !coinsArray.includes(value)))

            self.destinationCoin = self.depositCoinOptions[self.depositCoinOptions.length - 1]
            self.depositCoinUnfilter = self.depositCoinOptions.filter(o => tokensArray.includes(o.value.toLowerCase()))
            self.destinationCoinUnfilter = self.depositCoinOptions.filter(o => !tokensArray.includes(o.value.toLowerCase()))
            self.depositCoin = self.depositCoinUnfilter[0]
            console.log('depositCoinOptions', self.depositCoinOptions)
          })
        },
        getExchanges() {
          const self = this
          this.$axios.get(_1inch + '/v1.1/exchanges').then(function(result) {
            self.exchangesList = result.data.map(function(exchange) {
              let row = {
                'label': exchange.name,
                'value': true
              }
              return row
            }).filter(function(el) {
              return el != null
            }).sort(function(a, b) {
              if (a.label.toLowerCase() < b.label.toLowerCase()) {
                return -1
              }
              return 1
            })
            console.log('getExchanges', self.exchangesList)
          })
        },
        getSwapQuote() {
          const self = this
          if (self.swapData.fromAmount <= 0) return
          self.spinnervisible = true
          console.log(self.swapData.fromAmount, 'fromAmount')
          let data = {
            fromTokenSymbol: self.depositCoin.value,
            toTokenSymbol: self.destinationCoin.value,
            amount: self.web3.utils.toWei(self.swapData.fromAmount.toString(), 'ether'),
            slippage: 2,
            fromAddress: self.depositCoin.address,
            toAddress: self.destinationCoin.address,
            disableEstimate: false
          }
          let swapRequestUrl = _1inch + '/v1.1/swapQuote?' + new URLSearchParams(data).toString()
          this.$axios.get(swapRequestUrl)
            .then(function(result) {
              self.swapData.toAmount = parseFloat(self.web3.utils.fromWei(result.data.toTokenAmount.toString(), 'ether'));
              self.spinnervisible = false
              console.log(result.data.gasPrice * result.data.gas)
              //Calculate total gas price and convert it to USD
              self.swapData.gasPrice = self.convertETHToUSD(self.web3.utils.fromWei((result.data.gasPrice * result.data.gas).toString(), 'ether'))
              console.log('getSwapQuote', result)
            }).catch(error => {
              self.spinnervisible = false
              self.swapData.toAmount = null
              self.swapData.error = true
              console.log('getSwapQuote', error)
            })
        },
        doSwap() {
          const EthereumTx = require('ethereumjs-tx').Transaction
          const self = this
          this.spinnervisible = true
          let data = {
            fromTokenSymbol: this.depositCoin.value,
            toTokenSymbol: this.destinationCoin.value,
            amount: self.web3.utils.toWei(this.swapData.fromAmount.toString(), 'ether'),
            slippage: 1,
            fromAddress: this.depositCoin.address,
            toAddress: this.destinationCoin.address,
            disableEstimate: true
          }
          let swapRequestUrl = _1inch + '/v1.1/swap?' + new URLSearchParams(data).toString()
          // JSON.stringify for easy copy paste
          this.$axios.get(swapRequestUrl)
            .then(function(result) {

              self.spinnervisible = false

              let transactionObject = {
                to: result.data.to,
                value: self.web3.utils.toHex(result.data.value),
                gas: self.web3.utils.toHex(result.data.gas),
                gasPrice: self.web3.utils.toHex(result.data.gasPrice),
                data: result.data.data
              }
              console.log(transactionObject, JSON.stringify(transactionObject), 'transactionObject')
              const transaction = new EthereumTx(transactionObject)

              console.log(transaction, JSON.stringify(transaction), 'new EthereumTx' )
              transaction.sign(Buffer.from(self.ethAccount.privateKey.substring(2), 'hex'))

              console.log(transaction,JSON.stringify(transaction), 'transaction.sign')
              const serializedTransaction = transaction.serialize()

              self.web3.eth.accounts.signTransaction(result.data.data, self.ethAccount.privateKey, function(error, result) {
              console.log(error, result,JSON.stringify(result),  'signTransaction callback')
              }).then(function(result) {

                console.log(result,JSON.stringify(result),'doSwap result')
                self.sendTransaction('0x' + serializedTransaction.toString('hex'))
                
              })
            
            }).catch(error => {
              self.spinnervisible = false
              self.swapData.error = true
              console.log('doSwap', error)
            })
        },
        convertETHToUSD(ethAmount) {

          const self = this
          let ethToUsd = self.swapData.marketData.find(o => o.symbol.toLowerCase() == 'eth').current_price
          console.log(ethAmount, ethToUsd * ethAmount, 'conversion')
          return ethToUsd ? `~ USD ${ethToUsd*ethAmount}` : null
        },
        async sendTransaction(rawTransaction){
          const self = this
          let receipt = await self.web3.eth.sendSignedTransaction(rawTransaction, (error, txHash)=>{
              if(error) {
                  return console.error(error,'sendSignedTransaction error');
              }
              console.log(txHash,'txHash');
          });
          console.log(receipt,'receipt')
        },
        getMarketDataVsUSD() {
          const self = this
          let coingeckoEndpoint = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
          this.$axios.get(coingeckoEndpoint)
            .then(function(result) {
              if (result.data.length) {
                self.swapData.marketData = result.data
              }
              console.log('getMarketDataVsUSD', result.data)
            }).catch(error => {
              console.log(error, 'Cannot get market data')
            })
        },
        convertWeiToUsd(weiAmount) {
          const self = this
          const ethAmount = parseFloat(self.web3.utils.fromWei(weiAmount.toString(), 'ether'));
          let ethToUsd = self.swapData.marketData.find(o => o.symbol.toLowerCase() == 'eth').current_price

          console.log('convertEtherToUSD', 'WEI ' + weiAmount, 'ETH' + ethAmount, ethToUsd)

          return '~ USD ' + (ethToUsd * ethAmount)
        },
      filterDepositCoin(val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
        })
      },
      filterDestinationCoin(val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.destinationCoinOptions = this.destinationCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
.q-select .q-field__input {
    cursor: pointer;
}
@media (min-width: 576px){
.page-container {
    max-width: 540px;
}
}
@media (min-width: 768px){
.page-container {
    max-width: 720px;
}
}
@media (min-width: 992px){
.page-container{ 
    max-width: 960px;
}
}
@media (min-width: 1200px){
.page-container {
    max-width: 1040px;
}
}
.standard-content--footer .action-link {
    height: 54px;
    text-transform: initial !important;
    font-size: 16px;
    letter-spacing: .5px;
    border-radius: 40px;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    margin-left: 0px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #7272FA !important;
}



</style>
