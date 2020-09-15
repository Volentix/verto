<template>
    <q-card class="q-pa-lg modal-dialog-wrapper" style="width: 800px; max-width: 90vw;">
        <q-toolbar>
            <q-toolbar-title><span class="text-weight-bold q-pl-sm">Add Liquidity</span></q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">
            <div class="text-h6 q-mb-md q-pl-sm flex items-center">
              <h4 class="lab-title q-pr-md">Available {{currentToken}}:</h4> {{tokenInWallet ? tokenInWallet.amount : 0}}
              <span class="link-to-exchange" @click="goToExchange" v-if="!tokenInWallet">Get {{currentToken}}</span>
            </div>
            <div class="row">
            <div class="col col-3">
                <!-- <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" /> -->
                <q-input @input="validateInput()"  v-model="sendAmount" filled rounded outlined class="input-input" color="purple" type="number">
                  <template v-slot:append>
                    <div class="flex justify-end items-center q-pb-xs">
                      <q-btn color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
                    </div>
                  </template>
                </q-input>
            </div>
            <div class="col col-3 q-ml-md">
                <q-select class="select-input"  @input="getMaxBalance()" filled rounded outlined  color="purple" v-model="currentToken" :options="tokenOptions" />
           <div class="text-body2 col-12 q-pt-sm text-red" v-if="!tokenInWallet">
              Token not in wallet
            </div>
           </div>
            
            </div>
            <hr style="opacity: .1" class="q-mt-lg">
            <h4 class="lab-title">Choose your Allocation</h4>
            <div class="row">
            <div class="col col-4 q-pr-md">
                <strong class="lab-sub q-pl-md">Platform</strong>
                <q-select class="select-input full-width" filled v-model="platform" color="purple" @input="filterPoolsByPlatform()"   :options="['Any','Uniswap V2','Balancer-labs','yEarn','Curve']" />
            </div>
            <div class="col col-4 q-pr-md">
                <strong class="lab-sub q-pl-md">Pool</strong>
                <q-select class="select-input full-width"  @filter="filterPoolsByUserInput"   input-debounce="0" use-input filled @input="tokenOptions = pool.tokens ; isTokenInWallet() ; " v-model="pool" color="purple"  :options="poolOptions" >
                   <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
           
            </div>
            <!-- <div class="col col-3 q-pr-md text-center">
                <strong class="lab-sub q-pl-md text-center">Allocation</strong>
                <div class="lab-value flex flex-center text-center q-pl-lg q-pr-sm">90 % RPL 10% WETH</div>
            </div> -->
            <div v-if="pool === 'DAI/ETH'" class="col col-4 q-pl-md">
                <strong class="lab-sub q-pl-lg">Approx. Pool Output</strong>
                <div class="lab-value output column q-pl-lg q-pr-sm">
                  <span class="flex flex-start q-mb-sm"><img src="https://zapper.fi/images/ETH-icon.png" class="q-mr-sm" alt=""> 1.4922 ETH</span>
                  <span class="flex flex-start"><img src="https://zapper.fi/images/DAI-icon.png" class="q-mr-sm" alt=""> 703.0724 DAI</span>
                </div>
            </div>
            </div>
            <!-- <hr style="opacity: .1" class="q-mt-lg">
            <h4 class="lab-title q-pb-md">Select Gas Setting</h4>
            <div class="row">
              <div class="col col-4">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
              <div class="col col-4 q-pl-md q-pr-md">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
              <div class="col col-4">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
            </div> -->
        </q-card-section>
        <q-card-actions align="right" class="q-pr-sm q-mb-sm q-mt-xl">
            <q-btn label="Cancel" flat class="qbtn-start q-mr-sm cancel" color="black" v-close-popup/>
            <q-btn unelevated :disable="!tokenInWallet" class="qbtn-start" color="black" text-color="white" label="Confirm" />
        </q-card-actions>
    </q-card>
</template>

<script>
export default {
  name: 'AddLiquidityDialog',
  data () {
    return {
      platform: '',
      pool: '',
      sendAmount: 0,
      poolOptions:[],
      tokenOptions:[],
      currentToken:'',
      platform: 'Any',
      ethTokens:[],
      ethAccount:null,
      availableAmount:0,
      tokenInWallet:false
    }
  },
  props:['standalone'],
  updated () {
  },
  async created () {

    let config = {
          headers: {
              'api-key': '22779110-b1a7-4b99-ac6e-827d0a39ef70',
          }
        }

     if(this.standalone && false){
     await this.$store.dispatch('investment/getZapperTokens',config);
     this.$store.dispatch('investment/getBalancerPools');
     this.$store.dispatch('investment/getUniswapPools');
     this.$store.dispatch('investment/getYvaultsPools', config);
     this.$store.dispatch('investment/getCurvesPools', config);
     }

   this.tokenOptions = this.$store.state.investment.selectedPool.tokens
   this.currentToken = this.tokenOptions[0]
   this.getTokenAvailableAmount()
   this.poolOptions =  this.$store.state.investment.pools.map(o => { return {label:o.poolName, value:o.id, tokens:o.tokens} })
   this.pool =  this.poolOptions[0]
   this.isTokenInWallet()
  },
  methods: {
    async isTokenInWallet(){
        console.log(this.pool, this.tokenOptions)
        let tableData = await this.$store.state.wallets.tokens
        this.ethTokens = tableData.filter(w => w.chain === 'eth')
        this.tokenInWallet =  this.ethTokens.find(w =>  this.tokenOptions.find(o => o.toLowerCase() == w.type.toLowerCase())) 
        this.currentToken = this.tokenInWallet ? this.tokenInWallet.name : this.tokenOptions[0] ; 
        this.sendAmount = this.tokenInWallet ? this.tokenInWallet.amount : 0
    
      },
    getMaxBalance () {
      this.tokenInWallet = this.ethTokens.find(w => this.currentToken.toLowerCase() == w.type.toLowerCase())
     this.sendAmount = this.tokenInWallet ?   this.tokenInWallet.amount : 0
    },
    validateInput(){
        if(this.sendAmount <= 0){
          this.sendAmount  = 0
        } else {
           this.sendAmount = this.tokenInWallet && this.sendAmount > this.tokenInWallet.amount  ? this.tokenInWallet.amount  : this.sendAmount
        }
    },
    filterPoolsByUserInput(val, update) {
       
      if (val === '') {
        update(() => {
           self.poolOptions =  this.$store.state.investment.pools.map(o => { return {label:o.poolName, value:o.id, tokens:o.tokens} })
        })
        return
      }
      this.pool = ''
      update(() => {
        const needle = val.toLowerCase()
         this.poolOptions = this.$store.state.investment.pools.filter(v => v.poolName.toLowerCase().indexOf(needle) > -1).map(o => { return {label:o.poolName, value:o.id, tokens:o.tokens} })
      
      })
    },
    filterPoolsByPlatform  (){
      this.poolOptions = this.$store.state.investment.pools.filter(o => this.platform == 'Any' || o.platform.toLowerCase() == this.platform.toLowerCase()).map(o => { return {label:o.poolName, value:o.id, tokens:o.tokens} })
      this.pool =  this.poolOptions[0]
      this.tokenOptions = this.pool.tokens ;
      this.isTokenInWallet()
   
    },
    getTokenAvailableAmount(){
      let found = this.ethTokens.find(o => o.type.toLowerCase() ==  this.currentToken.toLowerCase() )
      this.availableAmount = found ? found.amount : 0
    },
    goToExchange () {
      // console.log('this.depositCoin', this.depositCoin)
      let depositCoin = {
        image: 'https://files.coinswitch.co/public/coins/btc.png',
        label: 'Bitcoin',
        value: 'btc'
      }
      let destinationCoin = {
        image: 'https://files.coinswitch.co/public/coins/eth.png',
        label: 'Ethereum',
        value: 'eth'
      }
      this.$router.push({ path: '/verto/exchange/:coinToSend/:coinToReceive', name: 'exchange-v3', params: { depositCoin: depositCoin, destinationCoin: destinationCoin } })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .link-to-exchange{
    text-decoration: underline;
    color: blue;
    padding-left: 15px;
    font-size: 14px;
    cursor: pointer;
    font-weight: $bold;
  }
  .modal-dialog-wrapper{
    .qbtn-start{
      border-radius: 30px;
      height: 44px;
      background: #00D0CA !important;
      width: 120px;
      margin-left: 0px;
      padding: 5px 10px;
      &.cancel{
        background: #CCC !important;
        width: 100px;
      }
      /deep/ .q-btn__wrapper{
        min-height: unset;
        padding: 0px 10px;
        .q-btn__content{
          text-transform: initial;
          font-size: 14px;
        }
      }
    }
    .lab-title{
      font-weight: $bold;
      font-size: 18px;
      font-family: $Titillium;
      color: #7272FA;
      margin: 0px;
    }
    /deep/ .btn-gas{
      border: 2px solid #CCC;
      &.active{
        border-color: #00D0CA;
      }
      .q-btn__content{
        @extend .lab-title;
        font-size: 14px;
        text-transform: initial;
      }
    }
    .lab-sub{
      font-size: 14px;
    }
    .lab-value{
      @extend .lab-title;
      font-size: 16px;
      color: #627797;
      line-height: 24px;
      &.output{
        font-size: 12px;
      }
      img{
        max-width: 25px;
      }
    }
    .input-input{
      height: 50px;
      /deep/ .q-field__control{
        height: 50px;
        min-height: unset;
        border-radius: 50px;
      }
      .btn-copy{
        height: 30px;
        position: relative;
        top: -3px;
        margin-right: 0px;
        padding: 6px 13px;
      }
      .qr-btn{
        width: 30px;
        height: 30px;
        padding-right: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          width: 25px;
          height: 25px;
          position: relative;
          right: -5px;
          transform: scale3d(1, 1, 1);
        }
      }
    }
    .select-input{
      // border-radius: 100px !important;
      $height: 50px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        // border-radius: 50px;
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
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
  }
  .select-input{
      border-radius: 100px !important;
      $height: 35px;
      width: 140px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        height: $height;
        min-height: unset;
        border-radius: 50px;
        .option--avatar__custom{
          font-size: 19px;
          max-width: 20px;
          max-height: 20px;
          border: none;
          margin-left: 0px;
        }
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          .q-field__input{
            max-width: 50px !important;
            min-width: unset !important;
            position: absolute;
            left: 60px;
            font-size: 10px;
          }
          .q-item__label{
            font-size: 10px;
            font-weight: 600;
            margin-bottom: -2px;
            margin-left: -10px;
          }
          .q-item{
            padding: 0px;
            padding-left: 0px;
            min-height: $height;
            padding-bottom: 0px;
            .q-item__section{
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
</style>
