<template>
  <q-page class="flex flex-center  bg-black">
 
    <q-card flat class="bg-grey-14 page-container full-width">
      <q-card-section class="row text-center">
        <div class="col-3">
         <q-icon class="float-left q-px-lg" name="settings" size="md" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
         <q-icon class="float-left text-grey-5 q-px-lg gt-xs" name="add" size="md" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
         <q-icon class="float-left gt-xs text-grey-5 q-px-lg" name="opacity" size="md" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        </div>
        <div class="col-6 text-h5 text-weight-thin text-grey-4">
          Token Swap
        </div>
        <div class="col-3">
         <q-icon class="float-right text-grey-5 q-px-lg" name="bar_chart" size="md" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
         <q-icon class="float-right text-grey-5 q-px-lg gt-xs" name="refresh" size="md" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        </div>
      </q-card-section>
       <q-card-section class="row ">
     <q-stepper
     
     
      animated
      :vertical="$q.screen.lt.sm"
      v-model="step"
      ref="stepper"
      color="primary"
      class="col-12"
      animated
    >
      <q-step
        :name="1"
        title="Select coin to swap"
        icon="call_made"
        :done="step > 1"
      >
      <div class="row">
       <div class="col-12 text-h6 q-mb-sm">Select coin to swap from your wallet </div>
                     <q-select
                       class=" col-md-6  col-12"
                       dense
                       filled
                       use-input
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
                   
                  </div>
     
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()"  color="primary" label="Continue" />
        </q-stepper-navigation>
  
      </q-step>

      <q-step
        :name="2"
        title="Receiving coin"
        icon="call_received"
        :done="step > 2"
      >
     <div class="row">
       <div class="col-12 text-h6 q-mb-sm">Select coin to acquire </div>
         <q-select
                   class=" col-md-6  col-12"
                       dense
                       filled
                       use-input
                       @input="swapData.error = false"
                      @filter="filterDestinationCoin"
                      v-model="destinationCoin"
                      :disabled="!destinationCoinOptions"
                      :loading="!destinationCoinOptions"
                      :options="destinationCoinOptions"
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
                  <div class="text-red text-body1 q-mt-sm" v-if="swapData.error">{{swapData.errorText.replace('[from]',depositCoin.value).replace('[to]',destinationCoin.value)}}</div>
                  </div>
      
        <q-stepper-navigation>
          <q-btn @click="getSwapQuote()" :loading="spinnervisible" :disable="spinnervisible" color="primary" label="Continue" />
          <q-btn flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
 
      </q-step>

      <q-step
        :name="3"
        title="Amount to swap"
        icon="attach_money"
        :done="step > 3"
       
      >
       <div class="row"  v-if="depositCoin">
       <div class=" col-12 col-md-5">
       <div class="col-12 text-h6 q-mb-sm">Enter amount of {{depositCoin.value}} to swap </div>
        <q-input   type="number" min="0" @keydown="getSwapQuote()" input-class="text-left"  class=" col-12 col-md-5 text-right" standout v-model="swapData.fromAmount"   :label="'Amount of '+depositCoin.value+' to swap'" >
         <template v-slot:prepend>
          <q-avatar>
            <q-icon :name="`img:${depositCoin.image}`" />
          </q-avatar>
        </template>
       </q-input> 
        </div>
        <div class="col-12 col-md-2 flex flex-center text-weight-thin text-grey-4 ">
          <q-icon class="text-grey-5 q-px-lg" name="sync_alt" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        </div>
        <div class=" col-12 col-md-5">
        <div class="col-12 text-h6 q-mb-sm">{{destinationCoin.value}} amount you will receive </div>
        <q-input  readonly type="number" min="0"  :loading="spinnervisible" input-class="text-left"  class=" col-12 text-right" standout v-model="swapData.toAmount"   label="Amount" >
                  
                   <template v-slot:prepend>
          <q-avatar>
            <q-icon :name="`img:${destinationCoin.image}`" />
          </q-avatar>
        
        </template>
                  </q-input>           
        </div>
        <div class="text-red text-body1 q-mt-sm" v-if="swapData.gasPrice">Gas Price: {{swapData.gasPrice}}</div>
                
      </div>
      
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()" :disable="spinnervisible" color="primary" label="Continue" />
          <q-btn  flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
     
      </q-step>

      <q-step
        :name="4"
        title="Order review"
        icon="remove_red_eye"
      >
        <div class="row"  v-if="depositCoin">
        <div class="text-h5 col-12 q-mb-md text-bold">Review your order</div>
       <div class=" col-12 col-md-5">
       <div class="col-12 text-h6 q-mb-sm">Amount of {{depositCoin.value}} to swap </div>
        <q-input   type="number" min="0"  readonly input-class="text-left text-red"  class=" col-12 col-md-5 text-right" standout v-model="swapData.fromAmount"   :label="'Amount of '+depositCoin.value+' to swap'" >
         <template v-slot:prepend>
          <q-avatar>
            <q-icon :name="`img:${depositCoin.image}`" />
          </q-avatar>
        </template>
       </q-input> 
        </div>
        <div class="col-12 col-md-2 flex flex-center text-weight-thin text-grey-4 ">
          <q-icon class="text-grey-5 q-px-lg" name="sync_alt" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        </div>
        <div class=" col-12 col-md-5">
        <div class="col-12 text-h6 q-mb-sm">{{destinationCoin.value}} amount you will receive </div>
        <q-input  readonly type="number" min="0"   input-class="text-left text-red"  class=" col-12 text-right " standout v-model="swapData.toAmount"   label="Amount" >
                  
                   <template v-slot:prepend>
          <q-avatar>
            <q-icon :name="`img:${destinationCoin.image}`" />
          </q-avatar>
        
        </template>
                  </q-input>    
                       
        </div>
      <div class=" col-12 q-mt-md">
      <q-checkbox
        v-model="swapData.termsAccepted"
        color="primary"
        label="I have read the deisclaimer"

      />
    </div> 
      </div> 
       
        <q-stepper-navigation>
          <q-btn @click="doSwap()" :loading="spinnervisible" :disable="!swapData.termsAccepted" color="primary" label="Swap now" />
          <q-btn  flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
    
      </q-step>

   
    </q-stepper>
      
      </q-card-section>
      
       <q-separator  color="black" />
       <q-card-section class="row q-col-gutter-md flex flex-center" v-if="false">
         <div class="text-h6 text-weight-thin text-center col-12">Spread across DEXes:</div>
         <q-toggle
          v-for="(item, index) in exchangesList"
         :key="index"
         v-model="item.value"
         :label="item.label"
      />
        </q-card-section>
        <q-card-section v-if="false"> 
         
        <q-item class="text-center bg-grey-9" >
        <q-item-section class="text-body1"> Max price slippage: 0.1% </q-item-section>
        <div class="text-body1 flex flex-center"> <img style="width:30px" src="https://1inch.exchange/assets/tokens/0x0000000000004946c0e9f43f4dee607b0ef1fa1c.png" />Enable Chi</div>
        <q-item-section class="text-body1"> Gas price: 103 GWEI</q-item-section>
      </q-item>
      <q-item class="bg-grey-9" >
        <q-item-section class="text-body1"> 
       
           <q-item-label>  Max price slippage: 0.1% </q-item-label>
           <div class="row q-mt-md">
           <q-btn class="q-mr-sm" text-color="purple-5" label="0.1%" outline />
           <q-btn class="q-mr-sm" text-color="purple-5" label="0.5%" outline  />
           <q-btn class="q-mr-sm" text-color="purple-5" label="1%" outline />
           <q-btn class="q-mr-sm"  text-color="purple-5" label="3%"  outline />
           <q-input color="white" dark text-color="white"filled v-model="swapData.customPriceSlipage" dense label="Custom" >
          <template v-slot:after>
              %
          </template>
          </q-input>
            </div>
        </q-item-section>
       
        <q-item-section class="text-body1"> 
        
        
        <q-item-label> Gas price: 103 GWEI <q-icon name="help_outline" color="blue-grey-4" /></q-item-label>
           <div class="row q-mt-sm">
           <q-btn color="blue-grey-5" class="q-mr-sm" text-color="white" label="104 Standard" filled />
           <q-btn  class="q-mr-sm" text-color="green" label="109 Fast" outline  />
           <q-btn color="bg-grey-9" class="q-mr-sm" text-color="purple-5" label="117 instand" outline />
           <q-input color="white" style="max-width: 100px" dark text-color="white"filled v-model="swapData.customPriceSlipage" dense label="Custom"/>
        </div>
              <q-item-label class="q-pt-sm">GWEI</q-item-label>
        </q-item-section>
      </q-item>
         </q-card-section>
        
          <q-card-section class="text-center" v-if="false">
           <q-btn color="amber-6" text-color="black" size="lg">
          <q-avatar size="42px">
            <img src="https://1inch.exchange/assets/connect.svg">
          </q-avatar>
           <div class="q-pl-md"> CONNECT WALLET </div>
        </q-btn>
       </q-card-section>
        <q-card-section v-if="false"> >
        <div class="q-pa-md">
    <q-table
      color="primary"
      card-class="bg-grey-9 text-white"
      table-class="text-white"
      table-header-class="text-white text-h4"
      flat
      dark
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:header-cell-rate="props">
        <q-th :props="props">
          <q-select dark dense borderless  v-model="swapData.rateSelected" :options="['Amount','Rate', 'Inv Rate']"  />
        </q-th>
      </template>
    </q-table>
  </div>
   </q-card-section>
    </q-card>
    
    <q-card flat class="bg-black"  v-if="false">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-card flat class="bg-black" style="width: 100%">
        <q-card-section class="text-weight-bold text-center">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('exchange/coinswitch')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium text-uppercase">{{ $t('SettingsView.exchange') }}</big>
          <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
        </q-card-section>
      </q-card>
      <q-card flat class="bg-black" style="width: 100%">
        <q-stepper v-model="step" done-color="green" active-color="green" ref="stepper" header-nav alternative-labels animated>
          <q-step
            default
            :name="1"
            title="Select Coin to Send"
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
                      use-input
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
                    label="Optional tag or memo [some exchanges require this field]"
                  />
                </div>
                <div class="q-pa-sm" v-show="true" @click="checkToGetPairs()">
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
                      use-input
                      @filter="filterDestinationCoin"
                      v-model="destinationCoin"
                      :disabled="!destinationCoinOptions"
                      :loading="!destinationCoinOptions"
                      :options="destinationCoinOptions"
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
                    ref="destinationAddressAddress"
                    v-model="destinationAddress.address"
                    color="green"
                    @input="verifyAddress()"
                    :rules="[ val => val.length >= 3 || 'Destination Address Cannot less than 3 characters' ]"
                    :label="destinationAddressLabel"
                  />
                  <q-input
                    type="text"
                    dark
                    v-model="destinationAddress.tag"
                    color="green"
                    label="Optional tag or memo [some exchanges require this field]"
                  />
                </div>
                <div class="q-pa-sm" v-show="true" @click="checkToGetRate()">
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-card-section>
          </q-step>
          <q-step
            :name="3"
            title="Select Quantity"
            class="bg-black workflow-step"
            :done="step > 3"
            :header-nav="step > 3"
          >
            <q-card-section>
              <div class="text-center text-white uppercase">
                <q-item>
                  <q-item-label>Choose quantity</q-item-label>
                </q-item>
                <div class="q-pa-md">
                  <q-input
                    ref="depositQuantity"
                    class="q-pa-sm"
                    type="number"
                    dark
                    v-model="depositQuantity"
                    color="green"
                    @input="quantityFromDeposit()"
                    :disabled="!rateData"
                    :loading="!rateData"
                    :label="depositQuantityLabel"
                    :rules="[ val => val >= rateData.limitMinDepositCoin || 'This is less than the minimum allowed',
                              val => val < rateData.limitMaxDepositCoin || 'This is more than the maximum allowed']"
                  />
                  <q-input
                    ref="destinationQuantity"
                    class="q-pa-sm"
                    type="number"
                    dark
                    v-model="destinationQuantity"
                    color="green"
                    @input="quantityFromDestination()"
                    :disabled="!rateData"
                    :loading="!rateData"
                    :label="destinationQuantityLabel"
                    :rules="[ val => val >= rateData.limitMinDestinationCoin || 'This is less than the minimum allowed',
                              val => val < rateData.limitMaxDestinationCoin || 'This is more than the maximum allowed']"
                  />
                </div>
                <div class="q-pa-sm" v-show="true" @click="checkToPostOrder()">
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
                  <q-item-label>{{exchangeLabel}}</q-item-label>
                </q-item>
                <div class="col-auto flex flex-center">
                  <div class="q-pr-md">
                    <qrcode v-if="exchangeAddress.address" :value="exchangeAddress.address" :options="{size: 150}"></qrcode>
                  </div>
                </div>
                <q-btn class="full-width" no-caps flat @click="copy2clip(exchangeAddress.address)" size="sm">
                  <q-input class="fit"
                    dark
                    readonly
                    v-model="exchangeAddress.address"
                    hint=""
                  >
                    <template v-slot:append>
                      <q-icon name="file_copy" @click="copy2clip(exchangeAddress.address)" />
                    </template>
                  </q-input>
                </q-btn>
                <q-card dark bordered class="bg-grey-9 my-card">
                  <q-card-section>
                    <div class="text-h6">Status of the exchange checked every 30 seconds</div>
                  </q-card-section>
                  <q-separator dark inset />
                  <q-card-section>
                    <div class="row">
                      <div class="col">
                        {{ friendlyStatus }}
                      </div>
                      <div class="col">
                        <q-circular-progress
                          :indeterminate="!status"
                          show-value
                          :value="getStatus"
                          size="80px"
                          :thickness="0.25"
                          color="green"
                          :track-color="trackColor"
                        >
                          <q-avatar size="60px">
                            <img :src="`${logoUrl}`">
                          </q-avatar>
                        </q-circular-progress>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-card-section>
          </q-step>
        </q-stepper>
      </q-card>
      <p class="text-caption text-center">
        * Disclaimer:  This transaction is carried out using an open API linked to various Exchanges.<br>
        By sending coins to the above address, you agreed to <a href="https://coinswitch.co/terms">the terms and conditions</a> of the selected provider.
      </p>
    </q-card>
  </q-page>
</template>

<script>
import store from '@/store'
import { userError } from '@/util/errorHandler'
const _1inch = 'https://api.1inch.exchange'
const url = 'https://api.coinswitch.co'
let headers = {
 // 'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
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
      swapData:{
        fromAmount: 1,
        toAmount: null,
        toAmount: 1,
        errorText: 'Converting [from] to [to] cannot be done at this moment please try another coin',
        error:false,
        customPriceSlipage:null,
        termsAccepted:false,
        gasPrice:null
      },
      step: 1,
      coinsAvailable:['eth','btc','rpl','nmr'],
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
      exchangesList:[],
      columns: [
        {
          name: 'exchange',
          required: true,
          label: 'Exchange',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          headerClasses: 'text-h6'
        },
        { name: 'rate', align: 'left', label: 'Rate', field: 'rate', sortable: true },
        { name: 'txgas', label: 'Tx Gas', field: 'txgas', sortable: true },
        { name: 'diff', label: 'Diff', field: 'difference' },
       ],
      data: [
        {
          name: '1inch',
          rate: '47.4328584311 AAPL/aDAI',
          txgas: '≈ $17.54',
          difference: 'MATCH'
        }
      ]
    
    }
  },
  computed: {
    getStatus () {
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
    friendlyStatus () {
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
    trackColor () {
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
    logoUrl () {
      if (this.destinationCoin != null) {
        return ''  // this.coins.filter(coins => coins.symbol === this.destinationCoin.value)[0].logoUrl
      } else {
        return '/static/icon.png'
      }
    },
    exchangeLabel () {
      if (this.depositCoin != null) {
        return 'Complete this exchange by sending ' + this.expectedDepositCoinAmount + ' ' + typeUpper(this.depositCoin.value) + ' to this address within the next 12 hours'
      } else {
        return 'Complete this exchange by sending the coins to this address within the next 12 hours'
      }
    },
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
        return 'Your ' + typeUpper(this.depositCoin.value) + ' return address [in case the transaction does not complete]'
      } else {
        return 'Your return address [in case the transaction does not complete]'
      }
    },
    destinationAddressLabel () {
      if (this.destinationCoin != null) {
        return 'Address to receive new ' + typeUpper(this.destinationCoin.value)
      } else {
        return 'Address to receive new coin'
      }
    }
  },
  created () {
  },
  mounted () {
   
   this.getCoins()
   this.getExchanges()

   /*
    this.$axios.get(url + '/v2/coins', { headers }).then(function (result) {
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

      self.depositCoinUnfilter = self.depositCoinOptions
      console.log('depositCoinOptions', self.depositCoinOptions)
    })

    */
  },
  watch:{
    step(newVal, oldVal){
      if(newVal == 2 ){
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(o => o.value.toLowerCase() != this.depositCoin.value.toLowerCase())
      }
    },
     'swapData.toAmount':function(newVal, oldVal){
         if(newVal != null && this.step == 2){
          this.$refs.stepper.next() 
      }
    }
  },
  methods: {
    getCoins(){ 
      const self = this
      this.$axios.get( _1inch + '/v1.1/tokens').then(function (result) {
      // will be using this coins array later with the destination select
      self.coins = result.data

      self.coins  = Object.keys(self.coins).map(function(key, index) {
        
          let row = {
            'label': self.coins[key].name,
            'value': self.coins[key].symbol,
            'image':  'https://1inch.exchange/assets/tokens/'+self.coins[key].address.toLowerCase()+'.png',
            'address':self.coins[key].address
          }
          return row
        
      })
    
        self.depositCoinOptions = self.coins.filter(function (el) {
        return el != null
      }).sort(function (a, b) {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1
        }
        return 1
      })
      
      self.destinationCoin = self.depositCoinOptions[self.depositCoinOptions.length - 1]
      self.depositCoinUnfilter = self.depositCoinOptions.filter(o => self.coinsAvailable.includes(o.value.toLowerCase()))
      self.destinationCoinUnfilter = self.depositCoinOptions.filter(o => !self.coinsAvailable.includes(o.value.toLowerCase()))
      self.depositCoin = self.depositCoinUnfilter[0]
      
      console.log('depositCoinOptions', self.depositCoinOptions)
    })

    },
    getExchanges(){
          const self = this
          this.$axios.get( _1inch + '/v1.1/exchanges').then(function (result) {
          self.exchangesList =  result.data.map(function(exchange) {
        
          let row = {
            'label': exchange.name,
            'value': true
          }
          return row
        
      }).filter(function (el) {
            return el != null
          }).sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) {
              return -1
            }
            return 1
          })
            console.log('getExchanges', self.exchangesList)
        })
    },
    getSwapQuote(){
        const self = this
        this.spinnervisible = true 
        let data =  {
          fromTokenSymbol: this.depositCoin.value,
          toTokenSymbol: this.destinationCoin.value,
          amount: this.swapData.fromAmount ,
          slippage: 1 ,
          fromAddress: this.depositCoin.address ,
          toAddress: this.destinationCoin.address,
          disableEstimate: true
        }
        
        let swapRequestUrl =  _1inch + '/v1.1/swapQuote?'+ new URLSearchParams(data).toString()

         
          this.$axios.get( swapRequestUrl)
          .then(function (result) {
         self.swapData.toAmount = result.data.toTokenAmount
         self.swapData.gasPrice = result.data.gasPrice
         self.spinnervisible = false
       console.log('getSwapQuote', result)
        
      }).catch(error => {
         self.spinnervisible = false
         self.swapData.toAmount = null  
         self.swapData.error  = true
          console.log('getSwapQuote', error)
      })
    },
    doSwap(){
         const self = this
        this.spinnervisible = true 
        let data =  {
          fromTokenSymbol: this.depositCoin.value,
          toTokenSymbol: this.destinationCoin.value,
          amount: this.swapData.fromAmount ,
          slippage: 1 ,
          fromAddress: this.depositCoin.address ,
          toAddress: this.destinationCoin.address,
          disableEstimate: true
        }
        
        let swapRequestUrl =  _1inch + '/v1.1/swap?'+ new URLSearchParams(data).toString()

         
          this.$axios.get( swapRequestUrl)
          .then(function (result) {
         self.swapData.toAmount = result.data.toTokenAmount
         self.spinnervisible = false
       console.log('doSwap', result)
        
      }).catch(error => {
         self.spinnervisible = false
         self.swapData.toAmount = null  
         self.swapData.error  = true
          console.log('getSwapQuote', error)
      })
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
      })
    },
    copy2clip (value) {
      // more generic copy
      this.$clipboardWrite(value)
      this.$q.notify({
        message: this.$t('Main.copied'),
        color: 'positive'
      })
    },
    checkToPostOrder () {
      if (this.$refs.depositQuantity.hasError || this.$refs.destinationQuantity.hasError) {
        userError('There is a problem with the quantities')
      } else {
        this.postOrder()
        this.$refs.stepper.next()
      }
    },
    checkToGetPairs () {
      if (this.depositCoin === null) {
        userError('There is a problem with the coin selection')
      } else {
        this.getPairs()
        this.$refs.stepper.next()
      }
    },
    checkToGetRate () {
      if (this.$refs.destinationAddressAddress.hasError || this.destinationAddress.address === '' ||
      this.destinationCoin === null) {
        userError('There is a problem with the destination address or the coin is not selected')
      } else {
        this.getRate()
        this.$refs.stepper.next()
      }
    },
    verifyAddress () {
      // check validity of all keys
    },
    quantityFromDeposit () {
      // deal with precision
      this.destinationQuantity = (+this.depositQuantity * +this.rateData.rate) - +this.rateData.minerFee
      this.lastChangedValue = 'deposit'
    },
    quantityFromDestination () {
      // deal with precision
      this.depositQuantity = (+this.destinationQuantity + +this.rateData.minerFee) / +this.rateData.rate
      this.lastChangedValue = 'destination'
    },
    orderStatus () {
      const self = this
      this.$axios.get(url + '/v2/order/' + this.orderId, { headers }).then(function (result) {
        self.status = result.data.data.status

        if (self.status === 'no_deposit' ||
        self.status === 'confirming' ||
        self.status === 'exchanging' ||
        self.status === 'sending') {
          setTimeout(() => { self.orderStatus() }, 30000)
        }
      })
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
          self.orderId = response.data.data.orderId
          self.exchangeAddress = response.data.data.exchangeAddress
          self.expectedDepositCoinAmount = response.data.data.expectedDepositCoinAmount
          self.expectedDestinationCoinAmount = response.data.data.expectedDestinationCoinAmount

          this.orderStatus()
        })
        .catch((err) => {
          userError('There was a problem posting the order', err)
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

          self.destinationCoinUnfilter = self.destinationCoinOptions
        })
        .catch((err) => {
          userError('There was a problem getting the destination coins', err)
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
          self.rateData = response.data.data
        })
        .catch((err) => {
          userError('There was a problem getting the rate data', err)
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




</style>
