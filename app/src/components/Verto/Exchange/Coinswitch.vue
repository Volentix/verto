<template>
<div class="column text-black bg-grey-12" :class="{'mobile-pad': screenSize < 1024 , 'desktop-marg': screenSize > 1024,'dark-theme': $store.state.settings.lightMode === 'true'}">
    <!-- padding-bottom: 100px;background: #f3f3f3 !important -->
    <div v-if="screenSize > 1024">
        <div class="row">
            <div class="col col-md-12">
                <div class="desktop-card-style apps-section q-mb-sm">
                    <div class="chain-tools-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                        <div class="chain-tools-wrapper--list open">
                            <div class="list-wrapper">
                                <div class="row">
                                    <div class="col col-12">
                                        <div class="trade-component">

                                            <div v-show="pStep === 1" class="prototype">
                                                <div class="head">Market Order <span class="float-right cursor-pointer " @click="offer=true"><q-img style="width:25px;" src="https://www.joypixels.com/images/jp-home/fire.gif" /> Get a FREE EOS account</span></div>
                                                  <q-dialog
                                                        v-model="offer"
                                                        :dark="$store.state.settings.lightMode === 'true'"
                                                        >

                                                       <q-card :dark="$store.state.settings.lightMode === 'true'" class="q-pa-md" style="width: 700px; max-width: 80vw;">

                                                            <q-card-section>
                                                             <q-btn flat round dense v-close-popup icon="close" class="float-right" @click="hidePromo('freeEosAccount')" />
                                                            <div class="text-h5 text-center text-bold ">   <q-img style="width:25px;" src="https://www.joypixels.com/images/jp-home/fire.gif" /> Get a FREE EOS account</div>
                                                             <div class="text-h6 text-center q-pt-md" v-show="false">when getting and staking at least 10,000 VTX </div>
                                                            </q-card-section>

                                                            <q-card-section class="q-pt-none">
                                                             <q-stepper
                                                        v-model="freeEOSAccountStepper"
                                                        class="freeEOSAccountStepper"
                                                        :dark="$store.state.settings.lightMode === 'true'"
                                                        flat
                                                        >
                                                        <q-step
                                                            :color="$store.state.settings.lightMode === 'true' ? 'white' : ''"
                                                            :name="1"
                                                            title="Choose EOS account"
                                                            :caption="freeeAccountName"
                                                            icon="settings"
                                                            :done="freeEOSAccountStepper > 1"
                                                        >
                                                        </q-step>

                                                        <q-step
                                                            v-if="stakingRequirements"
                                                            :name="2"
                                                            title="Get VTX"
                                                            caption="Next step"
                                                            icon="create_new_folder"
                                                            :done="freeEOSAccountStepper > 2"
                                                        />
                                                        <q-step
                                                            v-else
                                                            :name="2"
                                                            title="Get VTX with ETH"

                                                            icon="compare_arrows"
                                                            :done="freeEOSAccountStepper > 2"
                                                        >
                                                        </q-step>

                                                        </q-stepper>
                                                        <div  class=" row shadow-1 rounded-borders q-pb-md q-pt-lg q-mb-md" :style="$store.state.settings.lightMode === 'true' ? '' : 'background: #f6f6f9; border: 1px solid #3c40732e;'">

                                                        <div class="col  col-6  q-pr-none q-pl-md">
                                                           <b><q-icon color="grey" name="fiber_manual_record" /> Step 1 </b><br>
                                                           <p class="text-body1 q-pt-sm">Choose your EOS account name
                                                           <span class="text-body2">Choose a 12 Letter and/or Number (1-5)</span></p>
                                                        </div>

                                                        <div class="col col-5 red text-right text-red">
                                                           <q-input counter maxlength="12" autofocus :disable="pStep != 1 || !destinationCoin || destinationCoin.value != 'vtx'" rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5 " :label="accountToBeCreated ? 'Account chosen' : 'Enter account name'" v-model="freeeAccountName"  :error="inError" :error-message="errorMessage" @input="checkName" :rules="[ val => val && val.trim().length === 12  || 'Account name should be 12 characters']"/>
                                                        </div>

                                                             </div>
                                                        <div classs="q-pl-md" v-if="stakingRequirements"><q-icon color="grey" name="help" /> Why staking VTX ? </div>
                                                        <div class="text-center"  v-if="accountToBeCreated">
                                                        <p  class=" col-12 text-center q-mb-none   q-pb-none text-h6"><b>{{freeeAccountName}}</b> is available </p>
                                                        <p  class="text-green col-12 text-center q-pt-none text-h6"  v-if=" $store.state.wallets.metamask.accounts.length == 0">Connect with an external Wallet </p>
                                                        <p  class="text-green col-12 text-center q-pt-none text-h6"  v-else>You are connected with Metamask </p>
                                                        <q-item  dense class="metamask-btn row flex flex-center" >
                                                            <q-item-section class="text-body1 q-pr-sm" style="max-width:200px">
                                                                <q-btn :loading="connectLoading" :class=" $store.state.wallets.metamask.accounts.length ? 'bg-green-1' : 'bg-red-1'"  @click=" $store.state.wallets.metamask.accounts.length ? offer = false : connectWallet('metamask')" flat icon="fiber_manual_record" :color="!$store.state.wallets.metamask.accounts.length ? 'red' : 'green'" :label="!$store.state.wallets.metamask.accounts.length ? 'Connect' : 'Get VTX'">
                                                                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                                                                </q-btn>

                                                            </q-item-section>
                                                        </q-item>
                                                        <q-btn v-if=" $store.state.wallets.metamask.accounts.length == 0" flat label="Use Verto wallet" v-close-popup dense />
                                                        </div>
                                                            </q-card-section>

                                                            <q-card-actions  align="right" class="bg-white text-teal q-pr-lg " v-if="false && ( !freeeAccountName || !freeeAccountName.length)">
                                                            <q-btn flat color="primary" label="Reject offer" v-close-popup />
                                                            <q-btn  label="Accept offer" color="primary"  />
                                                            </q-card-actions>

                                                        </q-card>
                                                        </q-dialog>
                                                        <div class="row  float-right full-width  text-red q-mb-md">
                                                        <div class="col-md-12 flex justify-end">
                                                        <AccountSelector  />
                                                        <q-item dense class="metamask-btn float-right" style="max-width:350px">
                                                            <q-item-section class="text-body1 q-pr-sm">
                                                                <q-btn :loading="connectLoading" :class=" $store.state.wallets.metamask.accounts.length ? 'bg-green-1' : 'bg-red-1'" @click="connectWallet('metamask')" flat icon="fiber_manual_record" :color="!$store.state.wallets.metamask.accounts.length ? 'red' : 'green'" :label="!$store.state.wallets.metamask.accounts.length ? 'Connect' : 'Connected'">
                                                                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                                                                </q-btn>
                                                                 <span v-if="$store.state.wallets.metamask.accounts.length" @click="disconnectMetamask()" class="text-black  text-body2 text-center cursor-pointer">Disconnect</span>
                                                            </q-item-section>
                                                        </q-item>

                                                         </div>
                                                        </div>

                                                       <q-stepper
                                                        v-model="freeEOSAccountStepper"
                                                        class="flex flex-center full-width freeEOSAccountStepper"
                                                        :dark="$store.state.settings.lightMode === 'true'"
                                                        color="primary"
                                                        flat
                                                        v-if="accountToBeCreated"
                                                        >
                                                        <q-step
                                                            :name="1"
                                                            title="Chosen account"
                                                            :caption="freeeAccountName"
                                                            icon="settings"
                                                            :color="$store.state.settings.lightMode === 'true' ? 'white' : ''"
                                                            :done="freeEOSAccountStepper > 1"
                                                        >
                                                        </q-step>

                                                        <q-step
                                                            v-if="stakingRequirements"
                                                            :name="2"
                                                            title="Get VTX & Stake"
                                                            icon="create_new_folder"
                                                            :done="freeEOSAccountStepper > 2"
                                                        >
                                                        </q-step>
                                                        <q-step
                                                            v-else
                                                            :name="2"
                                                            title="Get VTX"
                                                            caption="10 000 Minimum"
                                                            icon="create_new_folder"
                                                            :done="freeEOSAccountStepper > 2"
                                                        >
                                                        </q-step>

                                                        <q-step
                                                            :name="3"
                                                            title="Enjoy your free account"
                                                            icon="assignment"
                                                            disable
                                                        >

                                                        </q-step>

                                                        </q-stepper>

                                                <div class="you-pay">

                                                    <div class="you-pay-head row full-width">
                                                        <div class="col col-6 text-left">You Pay</div>

                                                    </div>
                                                    <div class="you-pay-body row items-center">
                                                        <div class="col col-12 pay-coin">
                                                            <!-- class="select-input" -->
                                                            <span class="paycoin-search hidden">Type BTC</span>
                                                            <span class="receivecoin-search hidden">Type BTC</span>
                                                            <q-select :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" filled options-cover stack-label class="pay-coin-select" popup-content-class="pay-coin-select-popup" v-model="depositCoin" @filter="filterDepositCoin" @input="checkGetPairs()" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label caption>{{ scope.opt.value.toUpperCase() }}</q-item-label>
                                                                            <q-item-label v-html="scope.opt.label.toUpperCase()" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="depositCoin">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label caption>{{ depositCoin.value }}</q-item-label>
                                                                            <q-item-label v-html="depositCoin.label" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                            <q-select :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" filled options-cover stack-label class="receive-coin-select" popup-content-class="receive-coin-select-popup" @popup-show="addSearchField" v-model="destinationCoin" @filter="filterDestinationCoin" @input="updateCoinName()" :disabled="!destinationCoinOptions" :loading="!destinationCoinOptions" :options="destinationCoinOptions">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label caption>{{ scope.opt.value.toUpperCase() }}</q-item-label>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="destinationCoin">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${destinationCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label caption>{{ destinationCoin.value }}</q-item-label>
                                                                            <q-item-label v-html="destinationCoin.label" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                        <div class="col col-3 choose-coin">
                                                            <span class="cursor">
                                                                <q-select class="select-input" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator use-input borderless rounded v-model="depositCoin" @input="updateCoinName()" @filter="filterDepositCoin" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                                                                    <template v-slot:option="scope">
                                                                        <q-item class="custom-menu" @click="depositCoin = scope.opt" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                            <q-item-section avatar>
                                                                                <q-icon :name="`img:${scope.opt.image}`" />
                                                                            </q-item-section>
                                                                            <q-item-section>
                                                                                <q-item-label v-html="scope.opt.label.toUpperCase()" />
                                                                                <q-item-label caption>{{ scope.opt.contract }}</q-item-label>
                                                                                 <q-item-label v-if="scope.opt.amount" caption>{{ scope.opt.amount }}</q-item-label>
                                                                            </q-item-section>
                                                                        </q-item>
                                                                    </template>
                                                                    <template v-slot:selected>
                                                                        <div class="selected-coin">
                                                                          <q-item-label><span class="text-h5 text-bold">{{depositCoin.value.toUpperCase()}}</span></q-item-label>
                                                                          <q-item-label v-if="depositCoin.amount" caption class="text-bold" :class="{'text-deep-purple-10': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{ depositCoin.amount }}</q-item-label>
                                                                         </div>
                                                                    </template>
                                                                </q-select>

                                                            </span>
                                                        </div>

                                                        <div class="col col-8 offset-1">
                                                            <q-input rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5" ref="depositQuantity" @input="customQuantity = true ; quantityFromDeposit()" v-model="depositQuantity"  :disabled="!rateData" :loading="isLoading" :rules="[ val => val >= rateData.limitMinDepositCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDepositCoin || 'This is more than the maximum allowed']">
                                                                <div class="flex justify-end items-center" style="width: 60px">
                                                                    <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${depositCoin.image}`" />
                                                                </div>
                                                                <template v-slot:hint>
                                                                <span v-if="rateData">
                                                                 Min: {{rateData.limitMinDepositCoin}}
                                                                </span>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="you-receive">
                                                    <br>
                                                    <q-btn :disable="accountToBeCreated" outline round :color="$store.state.settings.lightMode === 'true' ? 'white':'black'" icon="swap_vert" @click="switchAmounts()" class="swap_vert" />
                                                    <div class="you-receive-head row items-center">
                                                        <div class="col col-4 text-left">You Receive</div>
                                                        <div v-if="!ErrorMessage || !ErrorMessage.length" class="col col-8 info_rate_holder  text-right  justify-end items-center" :class="{'_loading': fetchingRate}">
                                                        <p :class="{'text-green' :freeEOS.qualified, 'text-red' : !freeEOS.qualified , 'text-body2' : true }">{{freeEOS.message}}</p>
                                                        <span v-if="freeEOS.qualified && !accountToBeCreated" class="float-right cursor-pointer " @click="offer=true"><q-btn flat icon="img:https://www.joypixels.com/images/jp-home/fire.gif" label="Choose account name" /></span>
                                                        </div>
                                                        <div v-if="destinationCoin && destinationCoin.value.toLowerCase() != 'vtx' && rateData && ErrorMessage.length == 0 && fromCoinType && !isLoading" class="col col-6 info_rate_holder small text-right flex justify-end items-center" :class="{'_loading': fetchingRate}">
                                                            <!-- 1 ETH = 374.705 USDT -->
                                                            <span >{{ '1 ' + fromCoinType.toUpperCase() + '&nbsp;= &nbsp;' + rateData.rate.toFixed(5) + ' ' + toCoinType.toUpperCase() }}</span>
                                                            <div class="info_rate">
                                                                <span class="i-btn">
                                                                    <!-- <img src="statics/theme1/rate-info.png" class="rate-info-prototype" alt=""> -->
                                                                    <div class="info_rate_wrapper text-left">
                                                                        <div class="title">We got you the best price</div>
                                                                        <hr>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Max Deposit</span>
                                                                            <span>{{rateData.limitMaxDepositCoin}} {{fromCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Max Destination</span>
                                                                            <span>{{rateData.limitMaxDestinationCoin}} {{toCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Min Deposit</span>
                                                                            <span>{{rateData.limitMinDepositCoin}} {{fromCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Min Destination</span>
                                                                            <span>{{rateData.limitMinDestinationCoin}} {{toCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="you-receive-body row items-center">
                                                        <div class="col col-3 choose-coin"><span class="cursor">
                                                                <q-select class="select-input" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator use-input borderless rounded v-model="destinationCoin"  @input="updateCoinName()" @filter="filterDestinationCoin" :disable="accountToBeCreated || disableDestinationCoin || !destinationCoinOptions" :loading="!destinationCoinOptions && !disableDestinationCoin" :options="destinationCoinOptions">
                                                                    <template v-slot:option="scope">
                                                                        <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                            <q-item-section avatar>
                                                                                <q-icon :name="`img:${scope.opt.image}`" />
                                                                            </q-item-section>
                                                                            <q-item-section>
                                                                                <q-item-label v-html="scope.opt.label" />
                                                                                <q-item-label caption>{{ scope.opt.contract }}</q-item-label>
                                                                            </q-item-section>
                                                                        </q-item>
                                                                    </template>
                                                                    <template v-slot:selected>
                                                                        <span class="text-h5 text-bold">{{destinationCoin.value.toUpperCase()}}</span>
                                                                    </template>
                                                                </q-select>
                                                            </span>
                                                        </div>
                                                        <div class="col col-8 offset-1">
                                                            <q-input rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5" ref="destinationQuantity" v-model="destinationQuantity" @input="customQuantity = true ; quantityFromDestination(); calculateReward()" :disabled="!rateData" :loading="isLoading"  :rules="[ val => ErrorMessage.length || val >= rateData.limitMinDestinationCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDestinationCoin || 'This is more than the maximum allowed']">
                                                                <div class="flex justify-end items-center" style="width: 60px">
                                                                    <q-icon v-if="destinationCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
                                                                </div>
                                                                <template v-slot:hint>
                                                                <span v-if="rateData">
                                                                Min: {{rateData.limitMinDestinationCoin}}
                                                                </span>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                    <div class="text-body1 text-red q-py-md insuficient-text" v-if="ErrorMessage">{{ ErrorMessage }}</div>

                                                    <q-btn :disable=" ErrorMessage.length != 0 || depositQuantity == 0 || depositQuantity < rateData.limitMinDepositCoin || destinationQuantity > rateData.limitMaxDestinationCoin" unelevated  @click="checkToGetRate() ; pStep = 2" color="light-grey" text-color="black" :label="accountToBeCreated ? 'Continue': 'Choose Accounts'" class="text-capitalize chose_accounts full-width" />
                                                </div>
                                                <p v-if="accountToBeCreated" class="text-body1 q-pt-sm q-pl-md cursor-pointer reject_offer" @click="accountToBeCreated = false ; freeeAccountName = null">Reject offer</p>
                                            </div>
                                            <div v-if="pStep === 2" class="prototype">
                                                <div class="head">
                                                    <q-btn flat @click="pStep = 1" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back" class="--next-btn q-mr-md" />
                                                    Choose Accounts
                                                </div>
                                                <div class="you-pay" v-if="isEthToVtx && accountToBeCreated">
                                                    <div class="you-pay-head row items-center" >
                                                        <div class="col col-6">Key to be used</div>
                                                        <!-- <div class="col col-6 red text-right text-red">Max 0 USDT</div> -->
                                                    </div>
                                                    <div class="you-pay-body row items-center" >
                                                        <div class="col col-12 pay-coin">
                                                          <q-select v-show="fromKey === null || (fromKey.type !== 'new_public_key')" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator outlined class="select-input"  v-model="fromKey" :options="optionsFromKey">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="fromKey">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromKey.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="fromKey.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ fromKey.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                    </div>
                                                    </div>
                                                  <div class="you-pay"  v-if="!isEthToVtx">
                                                    <div class="you-pay-head row items-center">
                                                        <div class="col col-6">From</div>
                                                        <!-- <div class="col col-6 red text-right text-red">Max 0 USDT</div> -->
                                                    </div>
                                                    <div class="you-pay-body row items-center">
                                                        <div class="col col-12 pay-coin">
                                                            <!-- class="select-input" -->
                                                            <q-select v-show="fromCoin === null || (fromCoin.type !== 'new_public_key')" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator outlined class="select-input" @input="checkGetPairs()" v-model="fromCoin" :options="optionsFrom">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="fromCoin">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="fromCoin.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ fromCoin.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" v-model="refundAddress.address" @input="verifyAddress()" class="input-input" :label="depositCoin !== null ? 'Your ' + depositCoin.value.toUpperCase() + ' return address' : ' Your return address'" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end items-center">
                                                                        <q-btn color="purple" rounded class="q-mb-xs" @click="fromCoin = null" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                        <div class="col col-12">
                                                            <q-btn v-show="!fromCoinMemo" flat class="q-mt-sm q-mb-sm --next-btn align-left full-width" :icon-right="fromCoinMemo ? 'close':'add'" :label="fromCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="fromCoinMemo = !fromCoinMemo" />
                                                            <hr v-show="fromCoinMemo" style="opacity:0; height: 5px;margin: 0px">
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="fromCoinMemo" class="input-input" outlined color="purple" type="text" v-model="refundAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end items-center">
                                                                        <q-btn color="purple" rounded class="q-mb-xs" @click="fromCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                    <!-- <br> -->
                                                </div>
                                                <div class="you-receive">
                                                    <div class="you-receive-head row items-center">
                                                        <div class="col col-6">To: <span class="text-body2 q-ml-md"> (Account to receive {{destinationCoin.value.toUpperCase()}})</span></div>
                                                    </div>
                                                    <div class="you-receive-body row items-center">
                                                        <div class="col col-12">
                                                            <q-select :disable="eThToVTX && accountToBeCreated && freeEOS.qualified" v-show="!toCoin || (toCoin.type !== 'new_public_key')"  :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator outlined class="select-input" v-model="toCoin" @input="updateCoinName()" use-input :options="optionsTo">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="toCoin">
                                                                        <q-item-section v-if="toCoin.image" avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :class="toCoin.value" :name="`img:${toCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="toCoin.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ toCoin.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                        <div class="col col-12">
                                                            <!-- :rules="[ val => val.length >= 3 || 'Destination Address Cannot less than 3 characters' ]" -->

                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="toCoin && toCoin.type === 'new_public_key'" ref="destinationAddressAddress" :label="destinationAddressLabel" v-model="destinationAddress.address" @input="verifyAddress()" class="input-input destinationAddressAddress" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn color="purple" rounded class="q-mb-sm" @click="toCoin = null" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                            <hr v-show="toCoinMemo " style="opacity:0; height: 5px;margin: 0px">
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="toCoinMemo" class="input-input" outlined color="purple" type="text" v-model="destinationAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn color="purple" rounded class="q-mb-sm" @click="toCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                            <q-btn v-show="!toCoinMemo && !isEthToVtx" flat class="q-mt-sm q-mb-sm --next-btn align-left full-width" :icon-right="toCoinMemo ? 'close':'add'" :label="toCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="toCoinMemo = !toCoinMemo" />
                                                            <hr v-show="toCoinMemo" style="opacity:0; height: 35px;margin: 0px">
                                                        </div>
                                                        <div v-if="!isEthToVtx" class="col col-12 flex justify-end disclaimer-wrapper">
                                                            <div class="row full-width">
                                                                <div class="q-gutter-sm">
                                                                    <q-btn color="white" flat @click="showDisclaimerWrapper = true" class="lower bold" text-color="black" label="Read the disclaimer" />
                                                                </div>
                                                            </div>
                                                            <div class="row full-width" style="padding-left: 13px; margin-top: 10px;">
                                                                <div class="q-gutter-sm">
                                                                    <q-checkbox :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" label="I accept" color="deep-purple-14" v-model="disclaimerCheck" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <q-list v-if="gasOptions.length" class="col col-12 gasfield q-pt-md"  style="max-width:800px" separator>
                                                         <div class="you-receive-head row items-center ">
                                                          <div class="col col-6">Select gas option: </div>
                                                       </div>
                                                        <q-item :dark="$store.state.settings.lightMode === 'true'" dense class="gasSelector">
                                                            <q-item-section v-for="(gas, index) in gasOptions" :key="index">
                                                                <q-item :class="[gasSelected.label == gas.label ? 'selected bg-black text-white' : '' , gas.label]" @click="gasSelected = gas" clickable separator v-ripple>
                                                                    <q-item-section>
                                                                        <q-item-label :class="[gasSelected.label == gas.label ? 'text-black' : 'text-body1']">${{gas.value }}</q-item-label>
                                                                        <q-item-label class="text-body1 text-grey"> {{gas.label }}</q-item-label>
                                                                    </q-item-section>
                                                                    <q-item-section avatar>
                                                                        <q-icon color="primary" name="local_gas_station" />
                                                                    </q-item-section>
                                                                </q-item>
                                                            </q-item-section>
                                                        </q-item>
                                                    </q-list>
                                                    </div>
                                                    <br>

                                                    <q-btn unelevated @click="checkAddressMatchCoins()" :disable="(isEthToVtx && accountToBeCreated && fromKey == null) || (!disclaimerCheck && !isEthToVtx) || (!toCoin) && (destinationAddress.address && destinationAddress.address.length == 0)" color="light-grey" text-color="black" label="Place Order" class="text-capitalize chose_accounts full-width" />
                                                </div>
                                            </div>
                                            <div v-if="pStep === 3 && !isEthToVtx" class="prototype">
                                                <div class="head">
                                                    <q-btn flat @click="pStep = 2" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back" class="--next-btn q-mr-md" />
                                                    Order in progress
                                                </div>
                                                <Send class="minisend" :embedded="true" v-if=" $store.state.currentwallet.wallet && showTXComponent && status != 'complete' "/>
                                                <div class="standard-content--body">
                                                    <div class="standard-content--body__form q-pa-xl">
                                                        <div class="progress-custom-volentix column flex-center">
                                                            <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                                                                <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                                                            </svg>
                                                            <span class="title">{{ friendlyStatus }}</span>
                                                            <q-linear-progress v-if="isTransactionPending" indeterminate stripe rounded size="md" :value="progress" class="q-mt-md" />
                                                        </div>
                                                        <hr style="height:15px;opacity:0" />
                                                        <div class="text-black">
                                                            <div class="text-h4 --subtitle" v-if="isTransactionPending">{{exchangeLabel}}</div>
                                                            <q-input v-model="exchangeAddress.address" label="Destination account" readonly rounded class="input-input pr80" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(exchangeAddress.address , 'Exchange Address')" round class="btn-copy" icon="file_copy" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                            <p v-if="destinationCoin.value === 'vtx'" class="text-body1 q-pt-md q-py-md text-center">This is a multi path transaction. ({{depositCoin.value.toUpperCase()}} -> EOS -> VTX). <br>If you close this page you might need to do the Swap from EOS to VTX manually</p>
                                                            <br v-if="exchangeAddress.tag">
                                                            <q-input v-if="exchangeAddress.tag" v-model="exchangeAddress.tag" label="Mandatory memo"  readonly rounded class="input-input pr80" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(exchangeAddress.tag , 'Exchange Tag')" round class="btn-copy" icon="file_copy" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                             <div v-else-if="pStep === 3 && isEthToVtx" class="prototype">
                                                <div class="head">
                                                    <q-btn flat @click="pStep = 2" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back" class="--next-btn q-mr-md" />
                                                    Order in progress
                                                </div>

                                                <div class="standard-content--body">
                                                    <div class="standard-content--body__form q-pa-xl">
                                                        <div class="progress-custom-volentix column flex-center">
                                                            <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                                                                <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                                                            </svg>
                                                            <span class="title">{{ globalTx.status }}</span>
                                                            <q-linear-progress v-if="globalTx.status == 'Pending' || globalTx.status == 'Confirming'" indeterminate stripe rounded size="md" :value="progress" class="q-mt-md" />
                                                        </div>
                                                        <hr style="height:15px;opacity:0" />
                                                        <div class="text-black">
                                                            <div class="text-h4 --subtitle" >{{globalTx.label}}</div>
                                                            <div v-if="globalTx.status == 'Completed' && accountToBeCreated" class="q-pb-md text-center">
                                                               <span> <span class="unbold">You can add this account to verto anytime.</span> <br>Just select the {{fromKey.name}}  wallet account and click <b @click="intervalSeconds < 0 && goToAssociateEosAccount()"  class="text-deep-purple-14 cursor-pointer">{{ fromKey.type == 'verto' ?  'Associate with EOS' : 'Import another account'}}</b></span>
                                                               <div class="q-py-sm unbold"  v-if="intervalSeconds > 0" > Available around 3 minutes after the transaction</div>
                                                               <div v-if="intervalSeconds > 0">
                                                               Ready in {{intervalSeconds > 0 ? parseInt(intervalSeconds / 60)+ 'm : ' + (intervalSeconds % 60) + ' seconds': 'Account ready'}}...
                                                               </div>
                                                               <div class="q-py-sm" v-if="intervalSeconds < 0" > Account ready: Click the button below to proceed</div>
                                                               <q-btn v-if="intervalSeconds < 0" label="Add to Verto" @click="goToAssociateEosAccount()" />
                                                             </div>
                                                            <q-input v-model="globalTx.hash" readonly rounded class="input-input pr80" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(globalTx.hash , 'Exchange Address')" round class="btn-copy" icon="file_copy" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                             <a :href="'https://etherscan.io/tx/'+ globalTx.hash" target="_blank" class="text-body2 text-black"> More info</a>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <!-- <br><br><br> -->
                            </div>
                        </div>
         <div v-if="accountToBeCreated && stakingRequirements" class=" summary-wrapper shadow-1 col-md-4 column  items-start">
        <q-list class="summary-wrapper__list" separator>
          <q-item class="q-my-sm" clickable v-ripple>
            <div class="text-h6">Summary</div>
          </q-item>
          <q-item class="q-my-sm text-left"  >
            <q-item-section avatar>
              <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
            </q-item-section>

            <q-item-section>
              <q-item-label >Staking amount:</q-item-label>
              <q-item-label caption class="text-bold" lines="1">{{ destinationQuantity }} {{ destinationCoin.label.toUpperCase() }}</q-item-label>
            </q-item-section>
          </q-item>
           <q-item class="q-my-sm text-left" clickable v-ripple >
            <q-item-section avatar>
             {{period}}
            </q-item-section>

            <q-item-section>
              <q-item-label >Staking period:</q-item-label>
             <q-select  @input="calculateReward()" v-model="period" :options="[30, 60, 120,150, 180,210,240,270,300]" label="Change" >

            </q-select>
            </q-item-section>
          </q-item>
          <q-item class="q-my-sm text-left" clickable v-ripple >
            <q-item-section avatar>
             <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
            </q-item-section>

            <q-item-section>
              <q-item-label >Estimated reward :</q-item-label>
              <q-item-label caption class="text-bold" lines="1">{{estimatedReward}} {{ destinationCoin.label.toUpperCase() }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="chain-tools-wrapper">
        <!-- <div class="standard-content"> -->
            <!-- <h2 class="standard-content--title flex justify-center">
                <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="black" icon="keyboard_backspace" />
                Exchange
            </h2> -->
            <!-- <div class="exchange_picto flex flex-center"><img src="statics/exchange_picto.svg" alt=""></div> -->
        <!-- </div> -->
        <div class="col col-md-12">
            <div class="desktop-card-style apps-section q-mb-sm">

                <!-- 1inch component -->
                <!-- add your code here -->

                <!-- Vdex component -->
                <div class="chain-tools-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                        <div class="chain-tools-wrapper--list open">
                            <div class="list-wrapper">
                                <div class="row">
                                    <div class="col col-12">
                                        <div class="trade-component">
                                            <div v-show="pStep === 1" class="prototype">
                                                <div class="head">Market Order <span class="float-right cursor-pointer " @click="offer=true"><q-img style="width:25px;" src="https://www.joypixels.com/images/jp-home/fire.gif" /> Get a FREE EOS account</span></div>
                                                  <q-dialog
                                                        v-model="offer"
                                                        :dark="$store.state.settings.lightMode === 'true'"
                                                        >

                                                       <q-card :dark="$store.state.settings.lightMode === 'true'" class="q-pa-md" style="width: 700px; max-width: 80vw;">

                                                            <q-card-section>
                                                             <q-btn flat round dense v-close-popup icon="close" class="float-right" @click="hidePromo('freeEosAccount')" />
                                                            <div class="text-h5 text-center text-bold ">   <q-img style="width:25px;" src="https://www.joypixels.com/images/jp-home/fire.gif" /> Get a FREE EOS account</div>
                                                             <div class="text-h6 text-center q-pt-md" v-show="false">when getting and staking at least 10,000 VTX </div>
                                                            </q-card-section>

                                                            <q-card-section class="q-pt-none">
                                                             <q-stepper
                                                        v-model="freeEOSAccountStepper"
                                                        class="freeEOSAccountStepper"
                                                        :dark="$store.state.settings.lightMode === 'true'"
                                                        flat
                                                        >
                                                        <q-step
                                                            :color="$store.state.settings.lightMode === 'true' ? 'white' : ''"
                                                            :name="1"
                                                            title="Choose EOS account"
                                                            :caption="freeeAccountName"
                                                            icon="settings"
                                                            :done="freeEOSAccountStepper > 1"
                                                        >
                                                        </q-step>

                                                        <q-step
                                                            v-if="stakingRequirements"
                                                            :name="2"
                                                            title="Get VTX"
                                                            caption="Next step"
                                                            icon="create_new_folder"
                                                            :done="freeEOSAccountStepper > 2"
                                                        />
                                                        <q-step
                                                            v-else
                                                            :name="2"
                                                            title="Get VTX with ETH"

                                                            icon="compare_arrows"
                                                            :done="freeEOSAccountStepper > 2"
                                                        >
                                                        </q-step>

                                                        </q-stepper>
                                                        <div  class=" row shadow-1 rounded-borders q-pb-md q-pt-lg q-mb-md" :style="$store.state.settings.lightMode === 'true' ? '' : 'background: #f6f6f9; border: 1px solid #3c40732e;'">

                                                        <div class="col  col-6  q-pr-none q-pl-md">
                                                           <b><q-icon color="grey" name="fiber_manual_record" /> Step 1 </b><br>
                                                           <p class="text-body1 q-pt-sm">Choose your EOS account name
                                                           <span class="text-body2">Choose a 12 Letter and/or Number (1-5)</span></p>
                                                        </div>

                                                        <div class="col col-5 red text-right text-red">
                                                           <q-input counter maxlength="12" autofocus :disable="pStep != 1 || !destinationCoin || destinationCoin.value != 'vtx'" rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5 " :label="accountToBeCreated ? 'Account chosen' : 'Enter account name'" v-model="freeeAccountName"  :error="inError" :error-message="errorMessage" @input="checkName" :rules="[ val => val && val.trim().length === 12  || 'Account name should be 12 characters']"/>
                                                        </div>

                                                             </div>
                                                        <div classs="q-pl-md" v-if="stakingRequirements"><q-icon color="grey" name="help" /> Why staking VTX ? </div>
                                                        <div class="text-center"  v-if="accountToBeCreated">
                                                        <p  class=" col-12 text-center q-mb-none   q-pb-none text-h6"><b>{{freeeAccountName}}</b> is available </p>
                                                        <p  class="text-green col-12 text-center q-pt-none text-h6"  v-if=" $store.state.wallets.metamask.accounts.length == 0">Connect with an external Wallet </p>
                                                        <p  class="text-green col-12 text-center q-pt-none text-h6"  v-else>You are connected with Metamask </p>
                                                        <q-item  dense class="metamask-btn row flex flex-center" >
                                                            <q-item-section class="text-body1 q-pr-sm" style="max-width:200px">
                                                                <q-btn :loading="connectLoading" :class=" $store.state.wallets.metamask.accounts.length ? 'bg-green-1' : 'bg-red-1'"  @click=" $store.state.wallets.metamask.accounts.length ? offer = false : connectWallet('metamask')" flat icon="fiber_manual_record" :color="!$store.state.wallets.metamask.accounts.length ? 'red' : 'green'" :label="!$store.state.wallets.metamask.accounts.length ? 'Connect' : 'Get VTX'">
                                                                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                                                                </q-btn>

                                                            </q-item-section>
                                                        </q-item>
                                                        <q-btn v-if=" $store.state.wallets.metamask.accounts.length == 0" flat label="Use Verto wallet" v-close-popup dense />
                                                        </div>
                                                            </q-card-section>

                                                            <q-card-actions  align="right" class="bg-white text-teal q-pr-lg " v-if="false && ( !freeeAccountName || !freeeAccountName.length)">
                                                            <q-btn flat color="primary" label="Reject offer" v-close-popup />
                                                            <q-btn  label="Accept offer" color="primary"  />
                                                            </q-card-actions>

                                                        </q-card>
                                                        </q-dialog>
                                                       <div class="row  float-right full-width  text-red q-mb-md">
                                                       <div class="col-md-12 flex justify-end ">
                                                       <AccountSelector  />
                                                        <q-item   dense class="metamask-btn float-right" style="max-width:350px">
                                                            <q-item-section class="text-body1 q-pr-sm">
                                                                <q-btn :loading="connectLoading" :class=" $store.state.wallets.metamask.accounts.length ? 'bg-green-1' : 'bg-red-1'" @click="connectWallet('metamask')" flat icon="fiber_manual_record" :color="!$store.state.wallets.metamask.accounts.length ? 'red' : 'green'" :label="!$store.state.wallets.metamask.accounts.length ? 'Connect' : 'Connected'">
                                                                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                                                                </q-btn>
                                                                 <span v-if="$store.state.wallets.metamask.accounts.length" @click="disconnectMetamask()" class="text-black  text-body2 text-center cursor-pointer">Disconnect</span>
                                                            </q-item-section>
                                                        </q-item>

                                                         </div>
                                                        </div>

                                                       <q-stepper
                                                        v-model="freeEOSAccountStepper"
                                                        class="flex flex-center full-width freeEOSAccountStepper"
                                                        :dark="$store.state.settings.lightMode === 'true'"
                                                        color="primary"
                                                        flat
                                                        v-if="accountToBeCreated"
                                                        >
                                                        <q-step
                                                            :name="1"
                                                            title="Chosen account"
                                                            :caption="freeeAccountName"
                                                            icon="settings"
                                                            :color="$store.state.settings.lightMode === 'true' ? 'white' : ''"
                                                            :done="freeEOSAccountStepper > 1"
                                                        >
                                                        </q-step>

                                                        <q-step
                                                            v-if="stakingRequirements"
                                                            :name="2"
                                                            title="Get VTX & Stake"
                                                            icon="create_new_folder"
                                                            :done="freeEOSAccountStepper > 2"
                                                        >
                                                        </q-step>
                                                        <q-step
                                                            v-else
                                                            :name="2"
                                                            title="Get VTX"
                                                            caption="10 000 Minimum"
                                                            icon="create_new_folder"
                                                            :done="freeEOSAccountStepper > 2"
                                                        >
                                                        </q-step>

                                                        <q-step
                                                            :name="3"
                                                            title="Enjoy your free account"
                                                            icon="assignment"
                                                            disable
                                                        >

                                                        </q-step>

                                                        </q-stepper>

                                                <div class="you-pay">

                                                    <div class="you-pay-head row full-width">
                                                        <div class="col col-6 text-left">You Pay</div>

                                                    </div>
                                                    <div class="you-pay-body row items-center">
                                                        <div class="col col-12 pay-coin">
                                                            <!-- class="select-input" -->
                                                            <span class="paycoin-search hidden">Type BTC</span>
                                                            <span class="receivecoin-search hidden">Type BTC</span>
                                                            <q-select :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" filled options-cover stack-label class="pay-coin-select" popup-content-class="pay-coin-select-popup" v-model="depositCoin" @filter="filterDepositCoin" @input="checkGetPairs()" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label caption>{{ scope.opt.value.toUpperCase() }}</q-item-label>
                                                                            <q-item-label v-html="scope.opt.label.toUpperCase()" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="depositCoin">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label caption>{{ depositCoin.value }}</q-item-label>
                                                                            <q-item-label v-html="depositCoin.label" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                            <q-select :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" filled options-cover stack-label class="receive-coin-select" popup-content-class="receive-coin-select-popup" @popup-show="addSearchField" v-model="destinationCoin" @filter="filterDestinationCoin" @input="updateCoinName()" :disabled="!destinationCoinOptions" :loading="!destinationCoinOptions" :options="destinationCoinOptions">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label caption>{{ scope.opt.value.toUpperCase() }}</q-item-label>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="destinationCoin">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${destinationCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label caption>{{ destinationCoin.value }}</q-item-label>
                                                                            <q-item-label v-html="destinationCoin.label" />
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                        <div class="col col-3 choose-coin">
                                                            <span class="cursor">
                                                                <q-select class="select-input" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator use-input borderless rounded v-model="depositCoin" @input="updateCoinName()" @filter="filterDepositCoin" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                                                                    <template v-slot:option="scope">
                                                                        <q-item class="custom-menu" @click="depositCoin = scope.opt" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                            <q-item-section avatar>
                                                                                <q-icon :name="`img:${scope.opt.image}`" />
                                                                            </q-item-section>
                                                                            <q-item-section>
                                                                                <q-item-label v-html="scope.opt.label.toUpperCase()" />
                                                                                <q-item-label caption>{{ scope.opt.contract }}</q-item-label>
                                                                                 <q-item-label v-if="scope.opt.amount" caption>{{ scope.opt.amount }}</q-item-label>
                                                                            </q-item-section>
                                                                        </q-item>
                                                                    </template>
                                                                    <template v-slot:selected>
                                                                        <div class="selected-coin">
                                                                          <q-item-label><span class="text-h5 text-bold">{{depositCoin.value.toUpperCase()}}</span></q-item-label>
                                                                          <q-item-label v-if="depositCoin.amount" caption class="text-bold" :class="{'text-deep-purple-10': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{ depositCoin.amount }}</q-item-label>
                                                                         </div>
                                                                    </template>
                                                                </q-select>

                                                            </span>
                                                        </div>

                                                        <div class="col col-8 offset-1">
                                                            <q-input rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5" ref="depositQuantity" @input="customQuantity = true ; quantityFromDeposit()" v-model="depositQuantity"  :disabled="!rateData" :loading="isLoading" :rules="[ val => val >= rateData.limitMinDepositCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDepositCoin || 'This is more than the maximum allowed']">
                                                                <div class="flex justify-end items-center" style="width: 60px">
                                                                    <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${depositCoin.image}`" />
                                                                </div>
                                                                <template v-slot:hint>
                                                                <span v-if="rateData">
                                                                 Min: {{rateData.limitMinDepositCoin}}
                                                                </span>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="you-receive">
                                                    <br>
                                                    <q-btn :disable="accountToBeCreated" outline round color="black" icon="swap_vert" @click="switchAmounts()" class="swap_vert" />
                                                    <div class="you-receive-head row items-center">
                                                        <div class="col col-4 text-left">You Receive</div>
                                                        <div v-if="!ErrorMessage || !ErrorMessage.length" class="col col-8 info_rate_holder  text-right  justify-end items-center" :class="{'_loading': fetchingRate}">
                                                        <p :class="{'text-green' :freeEOS.qualified, 'text-red' : !freeEOS.qualified , 'text-body2' : true }">{{freeEOS.message}}</p>
                                                        <span v-if="freeEOS.qualified && !accountToBeCreated" class="float-right cursor-pointer " @click="offer=true"><q-btn flat icon="img:https://www.joypixels.com/images/jp-home/fire.gif" label="Choose account name" /></span>
                                                        </div>
                                                        <div v-if="destinationCoin && destinationCoin.value.toLowerCase() != 'vtx' && rateData && ErrorMessage.length == 0 && fromCoinType && !isLoading" class="col col-6 info_rate_holder small text-right flex justify-end items-center" :class="{'_loading': fetchingRate}">
                                                            <!-- 1 ETH = 374.705 USDT -->
                                                            <span >{{ '1 ' + fromCoinType.toUpperCase() + '&nbsp;= &nbsp;' + rateData.rate.toFixed(5) + ' ' + toCoinType.toUpperCase() }}</span>
                                                            <div class="info_rate">
                                                                <span class="i-btn">
                                                                    <!-- <img src="statics/theme1/rate-info.png" class="rate-info-prototype" alt=""> -->
                                                                    <div class="info_rate_wrapper text-left">
                                                                        <div class="title">We got you the best price</div>
                                                                        <hr>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Max Deposit</span>
                                                                            <span>{{rateData.limitMaxDepositCoin}} {{fromCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Max Destination</span>
                                                                            <span>{{rateData.limitMaxDestinationCoin}} {{toCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Min Deposit</span>
                                                                            <span>{{rateData.limitMinDepositCoin}} {{fromCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                        <div class="lineheight flex justify-between items-center">
                                                                            <span>Min Destination</span>
                                                                            <span>{{rateData.limitMinDestinationCoin}} {{toCoinType.toUpperCase()}}</span>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="you-receive-body row items-center">
                                                        <div class="col col-3 choose-coin"><span class="cursor">
                                                                <q-select class="select-input" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator use-input borderless rounded v-model="destinationCoin"  @input="updateCoinName()" @filter="filterDestinationCoin" :disable="accountToBeCreated || disableDestinationCoin || !destinationCoinOptions" :loading="!destinationCoinOptions && !disableDestinationCoin" :options="destinationCoinOptions">
                                                                    <template v-slot:option="scope">
                                                                        <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                            <q-item-section avatar>
                                                                                <q-icon :name="`img:${scope.opt.image}`" />
                                                                            </q-item-section>
                                                                            <q-item-section>
                                                                                <q-item-label v-html="scope.opt.label" />
                                                                                <q-item-label caption>{{ scope.opt.contract }}</q-item-label>
                                                                            </q-item-section>
                                                                        </q-item>
                                                                    </template>
                                                                    <template v-slot:selected>
                                                                        <span class="text-h5 text-bold">{{destinationCoin.value.toUpperCase()}}</span>
                                                                    </template>
                                                                </q-select>
                                                            </span>
                                                        </div>
                                                        <div class="col col-8 offset-1">
                                                            <q-input rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5" ref="destinationQuantity" v-model="destinationQuantity" @input="customQuantity = true ; quantityFromDestination(); calculateReward()" :disabled="!rateData" :loading="isLoading"  :rules="[ val => ErrorMessage.length || val >= rateData.limitMinDestinationCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDestinationCoin || 'This is more than the maximum allowed']">
                                                                <div class="flex justify-end items-center" style="width: 60px">
                                                                    <q-icon v-if="destinationCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
                                                                </div>
                                                                <template v-slot:hint>
                                                                <span v-if="rateData">
                                                                Min: {{rateData.limitMinDestinationCoin}}
                                                                </span>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                    <div class="text-body1 text-red q-py-md insuficient-text" v-if="ErrorMessage">{{ ErrorMessage }}</div>

                                                    <q-btn :disable=" ErrorMessage.length != 0 || depositQuantity == 0 || depositQuantity < rateData.limitMinDepositCoin || destinationQuantity > rateData.limitMaxDestinationCoin" unelevated  @click="checkToGetRate() ; pStep = 2" color="light-grey" text-color="black" :label="accountToBeCreated ? 'Continue': 'Choose Accounts'" class="text-capitalize chose_accounts full-width" />
                                                </div>
                                                <p v-if="accountToBeCreated" class="text-body1 q-pt-sm q-pl-md cursor-pointer" @click="accountToBeCreated = false ; freeeAccountName = null">Reject offer</p>
                                            </div>
                                            <div v-if="pStep === 2" class="prototype">
                                                <div class="head">
                                                    <q-btn flat @click="pStep = 1" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back" class="--next-btn q-mr-md" />
                                                    Choose Accounts
                                                </div>
                                                <div class="you-pay" v-if="isEthToVtx && accountToBeCreated">
                                                    <div class="you-pay-head row items-center" >
                                                        <div class="col col-6">Key to be used</div>
                                                        <!-- <div class="col col-6 red text-right text-red">Max 0 USDT</div> -->
                                                    </div>
                                                    <div class="you-pay-body row items-center" >
                                                        <div class="col col-12 pay-coin">
                                                          <q-select v-show="fromKey === null || (fromKey.type !== 'new_public_key')" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator outlined class="select-input"  v-model="fromKey" :options="optionsFromKey">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="fromKey">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromKey.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="fromKey.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ fromKey.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                    </div>
                                                    </div>
                                                  <div class="you-pay"  v-if="!isEthToVtx">
                                                    <div class="you-pay-head row items-center">
                                                        <div class="col col-6">From</div>
                                                        <!-- <div class="col col-6 red text-right text-red">Max 0 USDT</div> -->
                                                    </div>
                                                    <div class="you-pay-body row items-center">
                                                        <div class="col col-12 pay-coin">
                                                            <!-- class="select-input" -->
                                                            <q-select v-show="fromCoin === null || (fromCoin.type !== 'new_public_key')" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator outlined class="select-input" @input="checkGetPairs()" v-model="fromCoin" :options="optionsFrom">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="fromCoin">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="fromCoin.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ fromCoin.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" v-model="refundAddress.address" @input="verifyAddress()" class="input-input" :label="depositCoin !== null ? 'Your ' + depositCoin.value.toUpperCase() + ' return address' : ' Your return address'" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end items-center">
                                                                        <q-btn color="purple" rounded class="q-mb-xs" @click="fromCoin = null" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                        <div class="col col-12">
                                                            <q-btn v-show="!fromCoinMemo" flat class="q-mt-sm q-mb-sm --next-btn align-left full-width" :icon-right="fromCoinMemo ? 'close':'add'" :label="fromCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="fromCoinMemo = !fromCoinMemo" />
                                                            <hr v-show="fromCoinMemo" style="opacity:0; height: 5px;margin: 0px">
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="fromCoinMemo" class="input-input" outlined color="purple" type="text" v-model="refundAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end items-center">
                                                                        <q-btn color="purple" rounded class="q-mb-xs" @click="fromCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                    <!-- <br> -->
                                                </div>
                                                <div class="you-receive">
                                                    <div class="you-receive-head row items-center">
                                                        <div class="col col-6">To: <span class="text-body2 q-ml-md"> (Account to receive {{destinationCoin.value.toUpperCase()}})</span></div>
                                                    </div>
                                                    <div class="you-receive-body row items-center">
                                                        <div class="col col-12">
                                                            <q-select :disable="eThToVTX && accountToBeCreated && freeEOS.qualified" v-show="!toCoin || (toCoin.type !== 'new_public_key')"  :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator outlined class="select-input" v-model="toCoin" @input="updateCoinName()" use-input :options="optionsTo">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section dark>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <q-item v-if="toCoin">
                                                                        <q-item-section v-if="toCoin.image" avatar>
                                                                            <q-icon class="option--avatar option--avatar__custom" :class="toCoin.value" :name="`img:${toCoin.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="toCoin.label" />
                                                                            <q-item-label caption class="ellipsis mw160">{{ toCoin.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                    <q-item v-else>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                        <div class="col col-12">
                                                            <!-- :rules="[ val => val.length >= 3 || 'Destination Address Cannot less than 3 characters' ]" -->
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="toCoin && toCoin.type === 'new_public_key'" ref="destinationAddressAddress" :label="destinationAddressLabel" v-model="destinationAddress.address" @input="verifyAddress()" class="input-input destinationAddressAddress" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn color="purple" rounded class="q-mb-sm" @click="toCoin = null" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                            <hr v-show="toCoinMemo " style="opacity:0; height: 5px;margin: 0px">
                                                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-show="toCoinMemo" class="input-input" outlined color="purple" type="text" v-model="destinationAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn color="purple" rounded class="q-mb-sm" @click="toCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                            <q-btn v-show="!toCoinMemo && !isEthToVtx" flat class="q-mt-sm q-mb-sm --next-btn align-left full-width" :icon-right="toCoinMemo ? 'close':'add'" :label="toCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="toCoinMemo = !toCoinMemo" />
                                                            <hr v-show="toCoinMemo" style="opacity:0; height: 35px;margin: 0px">
                                                        </div>
                                                        <div v-if="!isEthToVtx" class="col col-12 flex justify-end disclaimer-wrapper">
                                                            <div class="row full-width">
                                                                <div class="q-gutter-sm">
                                                                    <q-btn color="white" flat @click="showDisclaimerWrapper = true" class="lower bold" text-color="black" label="Read the disclaimer" />
                                                                </div>
                                                            </div>
                                                            <div class="row full-width" style="padding-left: 13px; margin-top: 10px;">
                                                                <div class="q-gutter-sm">
                                                                    <q-checkbox :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" label="I accept" color="deep-purple-14" v-model="disclaimerCheck" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <q-list v-if="gasOptions.length" class="col col-12 gasfield q-pt-md"  style="max-width:800px" separator>
                                                         <div class="you-receive-head row items-center ">
                                                          <div class="col col-6">Select gas option: </div>
                                                       </div>
                                                        <q-item :dark="$store.state.settings.lightMode === 'true'" dense class="gasSelector">
                                                            <q-item-section v-for="(gas, index) in gasOptions" :key="index">
                                                                <q-item :class="[gasSelected.label == gas.label ? 'selected bg-black text-white' : '' , gas.label]" @click="gasSelected = gas" clickable separator v-ripple>
                                                                    <q-item-section>
                                                                        <q-item-label :class="[gasSelected.label == gas.label ? '' : 'text-body1 ']">${{gas.value }}</q-item-label>
                                                                        <q-item-label class="text-body1 text-grey"> {{gas.label }}</q-item-label>
                                                                    </q-item-section>
                                                                    <q-item-section avatar>
                                                                        <q-icon color="primary" name="local_gas_station" />
                                                                    </q-item-section>
                                                                </q-item>
                                                            </q-item-section>
                                                        </q-item>
                                                    </q-list>
                                                    </div>
                                                    <br>

                                                    <q-btn unelevated @click="checkAddressMatchCoins()" :disable="(isEthToVtx && accountToBeCreated && fromKey == null) || (!disclaimerCheck && !isEthToVtx) || (!toCoin) && (destinationAddress.address && destinationAddress.address.length == 0)" color="light-grey" text-color="black" label="Place Order" class="text-capitalize chose_accounts full-width" />
                                                </div>
                                            </div>
                                            <div v-if="pStep === 3 && !isEthToVtx" class="prototype">
                                                <div class="head">
                                                    <q-btn flat @click="pStep = 2" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back" class="--next-btn q-mr-md" />
                                                    Order in progress
                                                </div>
                                                <Send class="minisend" :embedded="true" v-if=" $store.state.currentwallet.wallet && showTXComponent && status != 'complete' "/>
                                                <div class="standard-content--body">
                                                    <div class="standard-content--body__form q-pa-xl">
                                                        <div class="progress-custom-volentix column flex-center">
                                                            <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                                                                <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                                                            </svg>
                                                            <span class="title">{{ friendlyStatus }}</span>
                                                            <q-linear-progress v-if="isTransactionPending" indeterminate stripe rounded size="md" :value="progress" class="q-mt-md" />
                                                        </div>
                                                        <hr style="height:15px;opacity:0" />
                                                        <div class="text-black">
                                                            <div class="text-h4 --subtitle" v-if="isTransactionPending">{{exchangeLabel}}</div>
                                                            <q-input v-model="exchangeAddress.address" label="Destination account" readonly rounded class="input-input pr80" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(exchangeAddress.address , 'Exchange Address')" round class="btn-copy" icon="file_copy" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                            <p v-if="destinationCoin.value === 'vtx'" class="text-body1 q-pt-md q-py-md text-center">This is a multi path transaction. ({{depositCoin.value.toUpperCase()}} -> EOS -> VTX). <br>If you close this page you might need to do the Swap from EOS to VTX manually</p>
                                                            <br v-if="exchangeAddress.tag">
                                                            <q-input v-if="exchangeAddress.tag" v-model="exchangeAddress.tag" label="Mandatory memo"  readonly rounded class="input-input pr80" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(exchangeAddress.tag , 'Exchange Tag')" round class="btn-copy" icon="file_copy" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                             <div v-else-if="pStep === 3 && isEthToVtx" class="prototype">
                                                <div class="head">
                                                    <q-btn flat @click="pStep = 2" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back" class="--next-btn q-mr-md" />
                                                    Order in progress
                                                </div>

                                                <div class="standard-content--body">
                                                    <div class="standard-content--body__form q-pa-xl">
                                                        <div class="progress-custom-volentix column flex-center">
                                                            <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                                                                <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                                                            </svg>
                                                            <span class="title">{{ globalTx.status }}</span>
                                                            <q-linear-progress v-if="globalTx.status == 'Pending' || globalTx.status == 'Confirming'" indeterminate stripe rounded size="md" :value="progress" class="q-mt-md" />
                                                        </div>
                                                        <hr style="height:15px;opacity:0" />
                                                        <div class="text-black">
                                                            <div class="text-h4 --subtitle" >{{globalTx.label}}</div>
                                                            <div v-if="globalTx.status == 'Completed' && accountToBeCreated" class="q-pb-md text-center">
                                                               <span> <span class="unbold">You can add this account to verto anytime.</span> <br>Just select the {{fromKey.name}}  wallet account and click <b @click="goToAssociateEosAccount()"  class="text-deep-purple-14 cursor-pointer">{{ fromKey.type == 'verto' ?  'Associate with EOS' : 'Import another account'}}</b></span>
                                                               <div class="q-py-sm unbold"  v-if="intervalSeconds > 0" > Available around 3 minutes after the transaction</div>
                                                               <div v-if="intervalSeconds > 0">
                                                               Ready in {{intervalSeconds > 0 ? parseInt(intervalSeconds / 60)+ 'm : ' + (intervalSeconds % 60) + ' seconds': 'Account ready'}}...
                                                               </div>
                                                               <div class="q-py-sm" v-if="intervalSeconds < 0" > Account ready: Click the button below to proceed</div>
                                                               <q-btn v-if="intervalSeconds < 0" label="Add to Verto" @click="goToAssociateEosAccount()" />
                                                             </div>
                                                            <q-input v-model="globalTx.hash" readonly rounded class="input-input pr80" outlined color="purple" type="text">
                                                                <template v-slot:append>
                                                                    <div class="flex justify-end">
                                                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(globalTx.hash , 'Exchange Address')" round class="btn-copy" icon="file_copy" />
                                                                    </div>
                                                                </template>
                                                            </q-input>
                                                             <a :href="'https://etherscan.io/tx/'+ globalTx.hash" target="_blank" class="text-body2 text-black"> More info</a>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <!-- <br><br><br> -->
                            </div>
                        </div>
         <div v-if="accountToBeCreated && stakingRequirements" class=" summary-wrapper shadow-1 col-md-4 column  items-start">
        <q-list class="summary-wrapper__list" separator>
          <q-item class="q-my-sm" clickable v-ripple>
            <div class="text-h6">Summary</div>
          </q-item>
          <q-item class="q-my-sm text-left"  >
            <q-item-section avatar>
              <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
            </q-item-section>

            <q-item-section>
              <q-item-label >Staking amount:</q-item-label>
              <q-item-label caption class="text-bold" lines="1">{{ destinationQuantity }} {{ destinationCoin.label.toUpperCase() }}</q-item-label>
            </q-item-section>
          </q-item>
           <q-item class="q-my-sm text-left" clickable v-ripple >
            <q-item-section avatar>
             {{period}}
            </q-item-section>

            <q-item-section>
              <q-item-label >Staking period:</q-item-label>
             <q-select  @input="calculateReward()" v-model="period" :options="[30, 60, 120,150, 180,210,240,270,300]" label="Change" >

            </q-select>
            </q-item-section>
          </q-item>
          <q-item class="q-my-sm text-left" clickable v-ripple >
            <q-item-section avatar>
             <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
            </q-item-section>

            <q-item-section>
              <q-item-label >Estimated reward :</q-item-label>
              <q-item-label caption class="text-bold" lines="1">{{estimatedReward}} {{ destinationCoin.label.toUpperCase() }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
        </div>
                </div>
            </div>
        </div>
    </div>
    <q-dialog persistent v-model="showDisclaimerWrapper">
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
                <q-btn flat label="Accept" class="accept-disclaimer" @click="disclaimerCheck = true" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="getPassword" persistent>
        <q-card :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'">
            <q-card-section>
                <div class="send-modal flex flex-center" :class="{ open: openModal }">
                <div class="send-modal__content q-pa-md column flex-center">
                    <div class="send-modal__content--head">
                    <span class="text-h5 --amount">Private key password</span>
                    <q-btn color="white" rounded flat unelevated @click="hideModalFun()" class="close-btn" text-color="black" label="+" />
                    </div>
                    <div class="send-modal__content--body column flex-center full-width">
                    <q-input
                        v-model="privateKeyPassword"
                        :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                        rounded
                        outlined
                        class="full-width"
                        color="green"
                        label="Private Key Password"
                        @input="checkPrivateKeyPassword"
                        debounce="500"
                        @keyup.enter="postOrder()"
                        :type="isPwd ? 'password' : 'text'"
                        :error="invalidPrivateKeyPassword"
                        error-message="The private key password is invalid"
                    >
                        <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                        </template>
                    </q-input>

                    <div class="flex justify-start full-width">
                        <q-btn v-close-popup @click="spinnervisible = false" unelevated color="grey" class="--next-btn mr10" rounded label="Cancel" />
                        <q-btn @click="postOrder();" unelevated color="deep-purple-14" class="--next-btn q-ml-md" rounded label="Submit transaction" />
                    </div>
                    </div>
                    <div class="send-modal__content--footer">
                    <div class="text-h4 --error" v-if="ErrorMessage">{{ ErrorMessage }}</div>
                    </div>
                </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</div>
</template>

<script>
import store from '@/store'
// import { userError } from '@/util/errorHandler'
import ExternalWallets from '@/util/ExternalWallets'
const url = 'http://api.godex.io/api/v1/'
let headers = {
  'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
}

const typeUpper = function (thing) {
  if (typeof thing === 'string' && thing.length >= 1) {
    return thing.toUpperCase()
  } else {
    return ''
  }
}
let ethVTxAddress = '0xCD41C348DC78869A93bc9571F3c175e1997048B4'
import AccountSelector from './AccountSelector.vue'
import DexInteraction from '../../../mixins/DexInteraction'
import Lib from '@/util/walletlib'
import EosWrapper from '@/util/EosWrapper'
import EOSContract from '@/mixins/EOSContract'
import ETHContract from '@/mixins/EthContract'
import Send from '@/pages/Verto/Send'
let metamask = new ExternalWallets('metamask')
const eos = new EosWrapper()

const Web3 = require('web3')
let web3

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default {
  name: 'Coinswitch',
  props: ['disableDestinationCoin', 'crossChain'],
  components: {
    Send,
    AccountSelector
  },
  data () {
    return {
      openModal: false,
      stakingRequirements: false,
      freeEOSAccountStepper: 1,
      optionsFromKey: [],
      fromKey: null,
      isLoading: true,
      offer: true,
      period: 60,
      gasOptions: [],
      gasSelected: null,
      estimatedReward: 0,
      connectLoading: false,
      currentWallet: null,
      ethWallets: [],
      accountToBeCreated: false,
      getPassword: false,
      privateKey: false,
      privateKeyPassword: null,
      showTXComponent: false,
      invalidPrivateKeyPassword: false,
      ErrorMessage: '',
      isPwd: true,
      pStep: 1,
      freeeAccountName: '',
      fetchingRate: false,
      model: null,
      receiveCoin: 'ETH',
      payCoin: 'BTC',
      osName: '',
      disclaimerCheck: false,
      showDisclaimerWrapper: false,
      fromCoin: null,
      fromCoinAmount: 1,
      toCoinAmount: 0,
      toCoinTemp: {},
      fromCoinType: 'BTC',
      toCoinType: 'ETH',
      toCoin: null,
      progress: 0.2,
      to: '',
      amount: '',
      memo: '',
      optionsFrom: [],
      globalTx: {
        hash: '',
        status: 'Pending',
        label: 'Waiting for confirmation...'
      },
      optionsTo: [],
      minimizedModal: false,
      params: null,
      tableData: [],
      intervalObject: null,
      intervalSeconds: 180,
      currentAccount: null,
      goBack: '/verto/dashboard',
      fetchCurrentWalletFromState: true,
      fromCoinMemo: false,
      toCoinMemo: false,
      // -------------------------
      timeoutNotif: 0,
      notif: false,
      step: 1,
      optionsSanitize: false,
      spinnervisible: false,
      lastChangedValue: 'deposit',
      coins: [],
      freeEOS: {
        message: '',
        qualified: false
      },
      depositCoin: {
        'label': 'Bitcoin',
        'value': 'btc',
        'image': 'https://files.coinswitch.co/public/coins/btc.png'
      },
      depositQuantity: null,
      depositCoinOptions: null,
      maxVtxAvailable: null,
      depositCoinUnfilter: null,
      eThToVTXPrice: null,
      destinationCoin: {
        'label': 'Ethereum',
        'value': 'eth',
        'image': 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
      },
      destinationQuantity: 0,
      destinationCoinOptions: null,
      destinationCoinUnfilter: null,
      trial: 0,
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
      customQuantity: false,
      expectedDepositCoinAmount: 0,
      expectedDestinationCoinAmount: 0,
      orderId: null,
      status: null,
      requestStop: false,
      destinationCoinAmount: null,
      vtxEosPrice: null,
      rateDataVtx: null,
      rateDataEos: null,
      inError: false,
      errorMessage: ''
    }
  },
  updated () {},
  watch: {
    pStep (newVal, oldVal) {
      if (this.pStep === 2) {
        this.checkGas()
        if (this.eThToVTX && this.accountToBeCreated && this.freeEOS.qualified) {
          this.toCoin = this.toCoinTemp
        } else {
          if (this.toCoinTemp && this.toCoinTemp.freeeos) { this.toCoin = null }
        }
      }

      if (this.pStep !== 3) {
        this.status = null
      }
    },
    depositCoin (val) {
      if (val && val.origin && val.origin === 'metamask') {
        this.fromCoin = this.currentWallet
      }

      this.payCoin = val.value.toUpperCase()
      this.checkBalance()
    },
    destinationCoin (val) {
      this.receiveCoin = val.value.toUpperCase()
      this.checkBalance()
    },
    fromCoin (val) {
      if (val.type !== 'new_public_key') {
        this.fromCoinType = this.fromCoin.type
      } else {
        return 'EOS'
      }
    },
    '$store.state.wallets.metamask.tokens': function (val) {
      this.initMetamask()
    },
    '$store.state.investment.accountTokens': function (val) {
      this.coins = this.$store.state.settings.coins.coinswitch
      this.depositCoinOptions = this.getUniqueTokens(this.coins).filter(t => val.find(o => o.type === t.value)).map(o => {
        let token = this.$store.state.investment.accountTokens.find(t => t.type === o.value)
        o.usd = token.usd
        o.amount = token.amount
        return o
      })

      this.depositCoinUnfilter = this.depositCoinOptions

      if (!this.depositCoin || !this.depositCoinOptions.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())) {
        let item = this.depositCoinOptions.find(v => v.value === this.$store.state.investment.defaultAccount.chain)
        if (item) { this.depositCoin = item }
      } else if (this.depositCoin && this.depositCoin.value) {
        this.depositCoin = this.depositCoinOptions.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())
      }
      console.log(this.$store.state.settings.dexData, 4, this.depositCoin, this.destinationCoin)
    },
    toCoin (val) {
      // console.log(val, 'toCoin')

      if (val && val.type !== 'new_public_key' && !this.eThToVTX) {
        this.toCoinType = this.toCoin.type
      } else {
        return 'VTX'
      }
    }
  },
  async created () {
    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63'))
    let disable = localStorage.getItem('disable_freeospopup')

    if (disable && this.$route.params.action !== 'free-eos-account') {
      this.offer = false
    }

    this.getWindowWidth()
    this.rateData = this.rateDataTemplate
    this.$store.commit('settings/setDex', {
      dex: 'coinswitch'
    })

    this.gasInterval = setInterval(() => {
      this.$store.dispatch('investment/getGasPrice')
    }, 60000)

    window.addEventListener('resize', this.getWindowWidth)

    this.params = this.$store.state.currentwallet.params
    this.tableData = await this.$store.state.wallets.tokens

    /*
    this.tableData.forEach(token => {
      self.optionsFrom.push({
        label: token.name.toLowerCase(),
        value: token.key,
        image: token.icon,
        type: token.type
      })
      self.optionsTo.push({
        label: token.name.toLowerCase(),
        value: token.key,
        privateKey: token.privateKey,
        image: token.icon,
        type: token.type
      })
    })
    this.optionsFrom.unshift({
      label: 'Other public key / Account',
      value: '',
      image: '/statics/img/door-key.png',
      type: 'new_public_key'
    })
    this.optionsTo.unshift({
      label: 'Other public key / Account',
      value: '',
      image: '/statics/img/door-key.png',
      type: 'new_public_key'
    })
    */
    this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName))
    // //console.log('this.currentAccount', this.currentAccount)
    if (this.currentAccount !== null && this.currentAccount !== undefined) {
      // this.fromCoin = {
      //   label: this.currentAccount.name,
      //   value: this.currentAccount.key,
      //   image: this.currentAccount.icon,
      //   type: this.currentAccount.type
      // }
      this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'
    }
    this.$q.notify.registerType('my-notif', {
      icon: 'announcement',
      progress: false,
      persistent: true,
      timeout: this.timeoutNotif,
      color: 'deep-purple-14',
      textColor: 'white',
      position: 'bottom-right'
    })
  },
  destoryed () {
    clearInterval(this.gasInterval)
    clearInterval(this.intervalObject)
  },
  computed: {
    isTransactionPending () {
      return this.status === 'no_deposit' || this.status === 'confirming' || this.status === 'exchanging' || this.status === 'sending'
    },
    sendingFrom () {
      return this.isEthToVtx ? this.$store.state.wallets.tokens.find(o => o.chain === 'eth' && o.key === this.fromCoin.key) : this.toCoin
    },
    isEthToVtx () {
      return this.depositCoin.value === 'eth' && this.destinationCoin.value === 'vtx'
    },
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
        case 'limit_exceeded':
          value = 'The destination amount limit was exceeded'
          break
        case 'invalid_address':
          value = 'The destination address is invalid'
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
        case 'limit_exceeded':
        case 'invalid_address':
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
        return this.coins.filter(coins => coins.symbol === this.destinationCoin.value)[0].logoUrl
      } else {
        return '/static/icon.png'
      }
    },
    exchangeLabel () {
      if (this.depositCoin != null) {
        return 'Complete this exchange by sending ' + this.expectedDepositCoinAmount + ' ' + typeUpper(this.depositCoin.value) + ' to this address within the next 1 hour'
      } else {
        return 'Complete this exchange by sending the coins to this address within the next 1 hour'
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
        return 'Account to receive new ' + typeUpper(this.destinationCoin.value)
      } else {
        return 'Address to receive new coin'
      }
    }
  },
  async mounted () {
    const self = this

    self.coins = this.crossChain ? this.getAllCoins('coinswitch') : this.$store.state.settings.coins.coinswitch
    self.depositCoinOptions = this.getUniqueTokens(self.coins)
    self.destinationCoinUnfilter = self.depositCoinOptions
    self.depositCoinUnfilter = self.depositCoinOptions
    console.log(this.$store.state.settings.dexData, 1, this.depositCoin, this.destinationCoin)
    if (this.$store.state.settings.dexData.depositCoin) {
      this.depositCoin = this.$store.state.settings.coins.coinswitch.find((o) => o.value.toLowerCase() === this.$store.state.settings.dexData.depositCoin.value.toLowerCase())
      if (this.$store.state.settings.dexData.destinationCoin) {
        this.destinationCoin = this.$store.state.settings.coins.coinswitch.find((o) => o.value.toLowerCase() === this.$store.state.settings.dexData.destinationCoin.value.toLowerCase())
      }
      this.checkGetPairs()
      this.checkToGetPairs()
      this.step = 2

      if (this.$store.state.settings.dexData.destinationCoin) {
        this.updateCoinName()
        this.checkToGetRate()
        this.step = 3
      }
    } else {
      this.depositCoin = this.depositCoinOptions[0]
      this.destinationCoin = this.depositCoinOptions[1]
    }

    this.initMetamask()
    this.$store.dispatch('investment/getMarketDataVsUSD')
    if (this.$store.state.wallets.metamask.accounts.length) {
      this.connectWallet('metamask')
    }
    console.log(this.$store.state.settings.dexData, 2, this.depositCoin, this.destinationCoin)
  },
  methods: {
    disconnectMetamask () {
      this.$store.commit('wallets/disconnectMetamask')

      let w = this.$store.state.wallets.tokens.find(w => w.chain === 'eth' && w.type === 'eth')

      if (!w) {
        w = this.$store.state.wallets.tokens.find(w => w.chain === 'eos' && w.type === 'eos')
      }

      let accountOption = {
        value: w.key,
        key: w.key,
        chain: w.chain,
        usd: w.usd,
        name: w.name,
        type: w.type,
        total: w.total,
        icon: w.icon,
        image: w.icon,
        label: w.key.substring(0, 6) + '...' + w.key.substr(w.key.length - 5),
        color: 'teal'
      }

      this.$store.commit('investment/setDefaultAccount', accountOption)
    },
    checkFreeEOsAccountRequirements () {
      if (this.isEthToVtx) {
        if (this.destinationQuantity >= 10000) {
          if (this.accountToBeCreated) {
            this.freeEOS.message = 'Your free account EOS account "' + this.freeeAccountName + '" will be created'
          } else {
            this.freeEOS.message = 'Your qualify to get a free EOS account'
          }
          this.freeEOS.qualified = true
        } else {
          this.freeEOS.message = 'You need to get at least 10 000 VTX to get a free EOS account.'
          this.freeEOS.qualified = false
        }
      } else {
        this.freeEOS.message = 'You can only get an EOS account right now when Swapping ETH to VTX'
        this.freeEOS.qualified = false
      }
    },
    async getAccountNames (key, name) {
      const expectedBlockTime = 5000

      let names = await eos.getAccountNamesFromPubKeyP(key)

      if (names.account_names.includes(name)) {
        this.$q.notify({
          message: 'Account ready'
        })
        clearInterval(this.intervalObject)
        this.intervalSeconds = -1

        return true
      } else {
        await sleep(expectedBlockTime)
      }

      if (this.intervalSeconds <= 10) {
        this.intervalSeconds = 180
      }

      this.getAccountNames(key, name)
    },
    goToAssociateEosAccount () {
      this.$store.commit('currentwallet/updateParams', {
        chainID: this.fromKey.chain,
        tokenID: this.fromKey.type,
        accountName: this.fromKey.name
      })
      this.$store.state.currentwallet.wallet = this.fromKey
      this.$router.push('/verto/eos-account')
    },
    async checkTxStatus (transactonHash) {
      this.trial++

      if (this.trial > 8) {
        this.globalTx.label = 'Transaction submitted. Your tokens are on the way. Check your balance in a few hours.'
        this.globalTx.status = 'Submitted'
        return
      }

      this.pStep = 3

      const expectedBlockTime = 5000

      let transactionReceipt = null
      while (transactionReceipt == null) {
        transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash)

        await sleep(expectedBlockTime)
      }

      if (transactionReceipt.status) {
        this.$axios.post('https://cpu.volentix.io/api/eos/getVtx').then(response => {
          let label = this.accountToBeCreated ? 'Confirmation & Account creation will take a few minutes' : 'Confirming transaction status...'

          if (response.data.hasOwnProperty('transferred')) {
            let error = response.data.errors.find(e => e.tx.memo.toLowerCase().includes(transactonHash.toLowerCase()))
            let tx = response.data.transferred.find(e => e.tx.memo.toLowerCase().includes(transactonHash.toLowerCase()))

            if (tx) {
              this.globalTx.label = tx.tx.quantity + ' has been sent to your account ' + tx.tx.to + ''
              this.globalTx.status = 'Completed'

              if (this.accountToBeCreated) {
                this.intervalObject = setInterval(
                  () => {
                    this.intervalSeconds -= 1
                  }
                  ,
                  1000
                )
                this.getAccountNames(this.fromKey.key, this.toCoin.value)
              }
            } else if (error) {
              this.globalTx.label = label
              this.globalTx.status = 'Confirming'
              this.checkTxStatus(transactonHash)
            } else {
              this.globalTx.label = label
              this.globalTx.status = 'Confirming'
              this.checkTxStatus(transactonHash)
            }
          } else {
            this.globalTx.label = label
            this.globalTx.status = 'Confirming'
            this.checkTxStatus(transactonHash)
          }
        })
      } else {
        this.globalTx.status = 'Failed'
        this.globalTx.label = "Your transaction couldn't be completed. Click more info to see the reason."
      }
    },
    checkGas () {
      try {
        let from = this.fromCoin.value
        if (this.fromCoin.value && this.fromCoin.value) {
          from = this.fromCoin.value.split('-')[0]
        }
        if (this.isEthToVtx) {
          Lib.getRawETHTransaction(
            this.depositCoin.value,
            from,
            ethVTxAddress,
            this.depositQuantity,
            '',
            this.fromCoin.address,
            ''
          ).then((tx) => {
            // console.log(this.toCoin.value, 'this.toCoin.value ')
            // Set dummy 12 letter account name if account is not yet chosen by user
            tx.data = Web3.utils.utf8ToHex(this.toCoin && this.toCoin.value ? this.toCoin.value : 'loremipsum12' + (this.accountToBeCreated ? 'EOS6SqpdkwBc9zPPuaJYcGqRQN1VtXAXmPXN26jqWHW5T1rCm6rui' : ''))
            this.getGasOptions(tx, 30000)
          })
        }
      } catch (error) {
        this.ErrorMessage = error.message
      }
    },
    hidePromo () {
      this.offer = false
      localStorage.setItem('disable_freeospopup', 'true')
    },
    initMetamask () {
      let allCoins = JSON.parse(JSON.stringify(this.coins))

      if (this.$store.state.wallets.metamask.accounts.length) {
        if (!this.currentWallet) { this.currentWallet = this.$store.state.wallets.metamask.accounts[0] }

        allCoins = allCoins.map((o) => {
          let token = this.$store.state.wallets.metamask.tokens.find(a => this.currentWallet.value === a.key && a.type.toLowerCase() === o.value.toLowerCase())

          if (token) {
            token.amount = isNaN(token.amount) ? 0 : token.amount
            token.value = token.type
            token.label = token.type
            token.image = token.icon
            return token
          } else {
            return false
          }
        }).filter(o => o !== false)
        this.depositCoinOptions = allCoins
        this.depositCoinUnfilter = this.depositCoinOptions
        this.depositCoin = allCoins.find(o => o.value === 'eth')

        if (!this.depositCoin || !allCoins.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())) {
          let item = allCoins.find(o => o.value === 'eth')
          if (item) { this.depositCoin = item }
        } else if (this.depositCoin && this.depositCoin.value) {
          this.depositCoin = allCoins.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())
        }
      }
    },
    sendExternalTransaction (externalWallet) {
      if (externalWallet === 'metamask') {
        Lib.getRawETHTransaction(
          this.depositCoin.value,
          this.fromCoin.value,
          this.exchangeAddress.address,
          this.expectedDepositCoinAmount,
          '',
          this.fromCoin.address,
          this.depositCoin.origin
        ).then((tx) => {
          metamask.pushTransaction(tx).then(result => {
            result.transaction.on('transactionHash', hash => {
              this.pStep = 3
            })

            result.transaction.on('error', error => {
              this.$q.notify({
                message: error || 'Transaction failed',
                color: 'negative',
                type: 'warning'
              })
            })
          })
        }).catch((error) => {
          console.log(error, 'error')
        })
      }
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    connectWallet (walletName) {
      this.connectLoading = false

      metamask.connect().then((data) => {
        if (data.success) {

        }
        this.connectLoading = false
      }).catch((error) => {
        this.connectLoading = false
        console.log(error, 'error')
      })
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
    checkAddressMatchCoins () {
      if (!this.isEthToVtx) {
        this.postOrder()
      } else {
        if (this.accountToBeCreated && !this.freeEOS.qualified) {
          // this.pStep = 2
        //  return
        }
        if (!this.toCoin) {
          this.$q.notify({
            message: 'account name error',
            color: 'negative',
            type: 'warning'
          })
          return
        }
        let account = this.fromKey
        if (this.toCoin && this.toCoin.type === 'new_public_key') {
          if ((!this.destinationAddress || this.destinationAddress.address) && this.destinationAddress.address.trim().length !== 12) {
            return this.$q.notify('Account name should be 12 characters')
          }
          this.toCoin.value = this.destinationAddress.address
        } else if (this.toCoin && !this.toCoin.value && this.toCoin.type !== 'new_public_key') {
          return this.$q.notify('Please set the receiving account ')
        }
        let data = {
          gasData: this.gasSelected,
          txData: web3.utils.utf8ToHex(this.toCoin.value + (this.accountToBeCreated ? account.key : '')),
          gasLimit: 30000
        }

        if (/* this.$store.state.investment.defaultAccount.origin === 'metamask' || */this.$store.state.wallets.metamask.accounts.length) {
          Lib.getRawETHTransaction(
            this.depositCoin.value,
            this.fromCoin.value,
            ethVTxAddress,
            this.depositQuantity,
            data,
            this.fromCoin.address,
            ''
          ).then((tx) => {
            // Set dummy 12 letter account name if account is not yet chosen by user
            tx.data = web3.utils.utf8ToHex(data.txData)
            tx.gas = data.gasData.gas
            tx.gasPrice = data.gasData.gasPrice
            metamask.pushTransaction(tx).then(result => {
              // console.log(result, 'metamask result')
              result.transaction.on('transactionHash', hash => {
                this.pStep = 3
                this.globalTx.hash = hash
                this.checkTxStatus(hash)
              })

              result.transaction.catch(error => {
                this.$q.notify({
                  message: error.message,
                  color: 'negative',
                  type: 'warning'
                })
              })
            })
          })
        } else {
          this.openModal = false
          this.isPrivateKeyEncrypted()
          if (this.openModal) return

          Lib.send(
            'eth',
            'eth',
            this.fromCoin.value,
            ethVTxAddress,
            this.depositQuantity,
            data,
            this.privateKey.key,
            ''
          ).then(result => {
            this.pStep = 3

            if (result.success) {
              this.globalTx.hash = result.transaction_id
              this.checkTxStatus(result.transaction_id)
            } else {
              this.$q.notify({
                message: result.message,
                color: 'negative',
                type: 'warning'
              })
            }
          }).catch((error) => {
            this.$q.notify({
              message: error.message,
              color: 'negative',
              type: 'warning'
            })
          })
        }
      }
    },
    checkDepositAndDestination () {
      if (this.destinationAddress.address === '' || this.depositCoin.address === '') {}
    },
    calculateReward () {
      if (this.accountToBeCreated) {
        let stake_per = (1 + parseInt(this.period) / 10.0) / 100
        if (+this.destinationQuantity > 0.0 && +this.destinationQuantity >= 10000) {
          this.estimatedReward = (Math.round(this.destinationQuantity * stake_per * 100) / 100) * this.period
        // //console.log('mul', stake_per)
        } else {
          this.estimatedReward = 0
        }
      }
    },
    updateCoinName () {
      if (this.destinationCoin !== null) {
        this.toCoinType = this.destinationCoin.value
        this.getPairs()
        this.checkToGetRate()
      } else {
        this.toCoinType = this.toCoin.type
      }
    },
    async getVtx () {
      this.checkTxStatus('0x1ea590c732563b6d83547ea8d01b1ea7b774d4c0975b5f4b2a2c6570581a1114')

      // await Bridge.sendVtxToAll(Bridge.transactions)
    },
    checkGetPairs () {
      if (this.depositCoin !== null) {
        this.fromCoinType = this.depositCoin.value
        this.getPairs()
        this.checkToGetPairs()
        this.checkToGetRate()
      } else {
        this.fromCoinType = this.fromCoin.type
      }
    },
    switchAmounts () {
      let depositCoinVar = this.depositCoin
      this.depositCoin = this.destinationCoin
      this.destinationCoin = depositCoinVar

      let fromCoinTypeVar = this.fromCoinType
      this.fromCoinType = this.toCoinType
      this.toCoinType = fromCoinTypeVar

      let depositQuantityVar = this.depositQuantity
      this.depositQuantity = this.destinationQuantity
      this.destinationQuantity = depositQuantityVar

      this.getRate()
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1 || v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(v => (v.value && v.value.toLowerCase().indexOf(needle) > -1) || (v.value && v.value.toLowerCase().indexOf(needle) > -1))
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
        // userError()
        // //console.error('There is a problem with the quantities')
      } else {
        this.postOrder()
        // this.$refs.stepper.next()
      }
    },
    checkToGetPairs () {
      if (this.depositCoin === null) {
        // userError('There is a problem with the coin selection')
        // //console.error('There is a problem with the coin selection')
      } else {
        this.getPairs()
        // this.$refs.stepper.next()
      }
    },
    checkToGetRate () {
      let self = this
      this.optionsFrom = []
      this.optionsTo = []
      this.tableData.forEach(token => {
        if (token.type === 'eos') {
          let account = token

          account.label = token.name.toLowerCase()
          account.value = token.chain === 'eos' ? token.name.toLowerCase() : token.key
          account.image = token.icon

          self.optionsFromKey.push(account)
        }

        if (this.depositCoin.value.toLowerCase() === token.type) {
          self.optionsFrom.push({
            label: token.name.toLowerCase(),
            value: token.chain === 'eos' ? token.name.toLowerCase() : token.key,
            key: token.key,
            privateKey: token.privateKey,
            privateKeyEncrypted: token.privateKeyEncrypted,
            image: token.icon,
            type: token.type
          })
        }
        if ((this.destinationCoin.value.toLowerCase() === token.type)) {
          self.optionsTo.push({
            label: token.name.toLowerCase(),
            value: token.chain === 'eos' ? token.name.toLowerCase() : token.key,
            key: token.key,
            privateKey: token.privateKey,
            image: token.icon,
            type: token.type
          })
        }
      })
      this.optionsFrom.unshift({
        label: 'Other public key / Account',
        value: '',
        image: '/statics/img/door-key.png',
        type: 'new_public_key'
      })
      this.optionsTo.unshift({
        label: 'Other public key / Account',
        value: '',
        image: '/statics/img/door-key.png',
        type: 'new_public_key'
      })
      if (this.destinationCoin === null) {
        // userError()
        // //console.error('There is a problem with the destination address or the coin is not selected')
      } else {
        this.getRate()
        // this.$refs.stepper.next()
      }

      if (this.isEthToVtx) {
        this.fromCoin = this.$store.state.investment.defaultAccount
        this.checkGas()

        if (!this.toCoin) {
          let eosAccounts = this.$store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type === 'vtx')
          if (eosAccounts.length === 1) { this.toCoin = JSON.parse(JSON.stringify(eosAccounts[0])) }
        }
      }
    },
    verifyAddress () {
      // check validity of all keys
    },
    quantityFromDeposit () {
      // deal with precision
      this.ErrorMessage = ''
      this.depositQuantity = isNaN(this.depositQuantity) ? 0 : this.depositQuantity
      if (this.destinationCoin.value === 'vtx' && this.depositCoin.value === 'eth') {
        this.destinationQuantity = (+this.depositQuantity / +this.rateData.rate) - +this.rateData.minerFee
      } else {
        this.destinationQuantity = (+this.depositQuantity * +this.rateData.rate) - +this.rateData.minerFee
      }
      this.destinationQuantity = this.destinationQuantity <= 0 ? 0 : this.destinationQuantity
      this.lastChangedValue = 'deposit'
      this.checkBalance()

      this.checkFreeEOsAccountRequirements()
    },
    quantityFromDestination () {
      // deal with precision
      this.ErrorMessage = ''

      if (this.destinationCoin.value === 'vtx' && this.depositCoin.value === 'eth') {
        if (this.accountToBeCreated && this.destinationQuantity < 10000) {
          // this.destinationQuantity = 10000
        }

        this.depositQuantity = (+this.destinationQuantity + +this.rateData.minerFee) * +this.rateData.rate
      } else {
        this.depositQuantity = (+this.destinationQuantity + +this.rateData.minerFee) / +this.rateData.rate
      }

      this.lastChangedValue = 'destination'
      this.checkBalance()
      this.checkFreeEOsAccountRequirements()
    },
    orderStatus () {
      const self = this
      this.$axios.get(url + '/v2/order/' + this.orderId, {
        headers
      }).then(function (result) {
        self.status = result.data.data.status
        if (self.status === 'no_deposit') {
          if (!self.notif) {
            self.triggerCustomRegisteredType1()
          }
        } else {
          self.timeoutNotif = 1000
        }
        if (self.status === 'no_deposit' ||
                    self.status === 'confirming' ||
                    self.status === 'exchanging' ||
                    self.status === 'sending') {
          setTimeout(() => {
            self.orderStatus()
          }, 30000)
        } else if (self.status === 'complete' && self.destinationCoin.value === 'vtx') {
          self.destinationCoinAmount = Math.trunc(result.data.data.destinationCoinAmount * 10000) / 10000
          if (self.accountToBeCreated) {
            self.createFreeEOSAccount(self.freeeAccountName, self.toCoin.key, self.fromCoin.key)
          } else {
            self.orderVTX()
          }
        }
      }
      )
    },
    async checkName () {
      this.inError = false
      this.accountToBeCreated = false
      if (this.freeeAccountName.length === 12) {
        if (/(^[a-z1-5]{1}([a-z1-5.]{0,10}[a-z1-5])?$)/g.test(this.freeeAccountName)) {
          this.showNextButtonToPassword = true
          try {
            await eos.getAccount(this.freeeAccountName)
            this.inError = true
            this.errorMessage = 'Account Name Taken'
          } catch (error) {
            this.inError = false
            this.accountToBeCreated = true
            let account = this.$store.state.wallets.tokens.find(o => o.type === 'verto' && o.chain === 'eos')

            if (account) {
              this.toCoinTemp = JSON.parse(JSON.stringify(account))
            } else {
              account = this.$store.state.wallets.tokens.find(o => o.chain === 'eos')
              this.toCoinTemp = JSON.parse(JSON.stringify(account))
            }
            this.toCoinTemp.value =
            this.toCoinTemp.name = this.destinationAddress.address = this.toCoinTemp.value = this.freeeAccountName
            this.toCoinTemp.image = 'https://files.coinswitch.co/public/coins/eos.png'
            this.toCoinTemp.freeeos = true
            this.freeEOSAccountStepper = 2
          }
        } else {
          this.inError = true
          this.errorMessage = 'Invalid Account Name'
        }
      } else {
        this.inError = true
        this.errorMessage = 'You need exactly 12 characters'
      }
    },
    createFreeEOSAccount (accountName, eosKey, fromkey, fromSymbol) {
      let url = 'https://cpu.volentix.io/api/eos/signup'
      this.$axios.post(url, {
        name: accountName,
        eosKey: eosKey,
        fromkey: fromkey,
        fromSymbol: fromSymbol
      }).then(function (result) {
        if (result.data.transaction_id) {
          self.orderVTX()
        }
      })
    },
    async orderVTX () {
      // check balance then...
      // let eosBal = Lib.balance('eos', this.toCoin.value, 'eos')

      let eosBal = (await eos.getCurrencyBalanceP(this.toCoin.value)).toString().split(' ')[0]

      if (+eosBal < +this.destinationCoinAmount) {
        // console.log('eos balance is yet to low to proceed: ', eosBal)
        setTimeout(() => {
          self.orderVTX()
        }, 1000)
      } else {
        console.log('before Lib.send', this.toCoin, this.destinationCoinAmount, (this.privateKey && this.privateKey.key) ? this.privateKey.key.length : false)

        Lib.send(
          'eos',
          'eos',
          this.toCoin.value,
          'swap.defi', // 'newdexpublic',
          this.destinationCoinAmount,
          'swap,0,448', // '{"type":"buy-market","symbol":"volentixgsys-vtx-eos","price":"0.00000","channel":"dapp","ref":"verto"}',
          this.privateKey.key,
          'eosio.token'
        ).then(result => {
          console.log(result, 'Lib.send')

          if (result.success) {
            this.$q.notify({
              message: 'Your VTX have been received',
              color: 'positive'
            })
          } else if (result.message.toString().includes('is greater than the maximum billable CPU time for the transaction') || result.message.toString().includes('the current CPU usage limit imposed on the transaction')) {
            this.payForUserCPU()
          } else {
            this.$q.notify({
              message: 'Could not convert EOS to VTX',
              color: 'negative',
              type: 'warning'
            })
          }
        }).catch((error) => {
          console.log(error, 'error lib send catch')

          if (error.toString().includes('is greater than the maximum billable CPU time for the transaction') || error.toString().includes('the current CPU usage limit imposed on the transaction')) {
            this.payForUserCPU()
          } else {
            this.$q.notify({
              message: 'Could not convert EOS to VTX',
              color: 'negative',
              type: 'warning'
            })
          }
        })
      }
    },
    payForUserCPU () {
      const actions = [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: this.toCoin.value,
          permission: 'active'
        }
        ],
        data: {
          from: this.toCoin.value.toLowerCase(),
          to: 'swap.defi',
          quantity: parseFloat(this.destinationCoinAmount).toFixed(4) + ' EOS',
          memo: 'swap,0,448'
        }
      }]

      let account = {
        name: this.toCoin.value,
        privateKey: this.toCoin.privateKey
      }
      this.sendFreeCPUTransaction(actions, account).then(result => {
        console.log(result, 'sendFreeCPUTransaction')

        if (result.success) {
          this.$q.notify({
            message: 'Your VTX have been received',
            color: 'positive'
          })
        } else {
          this.$q.notify({
            message: 'Could not convert EOS to VTX',
            color: 'negative',
            type: 'warning'
          })
        }
      }).catch((error) => {
        console.log(error, 'sendFreeCPUTransaction catch')

        this.$q.notify({
          message: error,
          color: 'negative',
          type: 'warning'
        })
      })
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.sendingFrom.privateKeyEncrypted)
      let privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      if (privateKey.success) {
        this.privateKey = privateKey.key
        this.invalidPrivateKeyPassword = false
        this.hideModalFun()
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    hideModalFun: function () {
      this.openModal = false
      this.openModalProgress = false
    },
    isPrivateKeyEncrypted () {
      if (this.destinationCoin.value === 'vtx' && !this.sendingFrom.privateKey && this.sendingFrom.privateKeyEncrypted) {
        this.getPassword = true
        this.openModal = true
        this.checkPrivateKeyPassword()
      } else {
        this.privateKey = {
          key: this.sendingFrom.privateKey
        }
      }
    },
    swapEthToVTX () {
      this.ErrorMessage = 'No liquidity available'

      /*
      const self = this
       this.isPrivateKeyEncrypted()
      if (this.openModal) return

         self.$store.commit('currentwallet/updateParams', {
              chainID: self.fromCoin.chain,
              tokenID: self.fromCoin.type,
              accountName: self.fromCoin.name,
              to: self.exchangeAddress.address,
              amount: self.expectedDepositCoinAmount
            })
            if (self.currentWallet && self.$store.state.wallets.metamask.accounts.find(o => o.value === self.currentWallet.value)) {
              self.sendExternalTransaction('metamask')
            } else {
              self.$store.state.currentwallet.wallet = self.tableData.find(a => a.key === self.fromCoin.key && a.type === self.fromCoin.type)
              self.showTXComponent = true
            }
            */
    },
    postOrder () {
      const self = this

      let depositCoinAmount = null
      let destinationCoinAmount = null

      if (self.destinationCoin.value === 'vtx' && self.depositCoin.value === 'eth') {
        return this.checkAddressMatchCoins()
      }

      if (self.lastChangedValue === 'deposit') {
        depositCoinAmount = self.depositQuantity
      } else {
        destinationCoinAmount = self.destinationCoin.value === 'vtx' ? self.destinationQuantity * self.vtxEosPrice : self.destinationQuantity
      }

      this.refundAddress.address = this.refundAddress.address === '' ? this.fromCoin.value : this.refundAddress.address
      // //console.log('this.refundAddress', this.refundAddress)
      this.destinationAddress.address = this.destinationAddress.address === '' ? this.toCoin.value : this.destinationAddress.address
      this.openModal = false
      this.isPrivateKeyEncrypted()
      if (this.openModal) return

      this.pStep = 3

      self.exchangeAddress = ''

      this.$axios.post(url + '/v2/order', {
        depositCoin: self.depositCoin.value,
        destinationCoin: self.destinationCoin.value === 'vtx' ? 'eos' : self.destinationCoin.value,
        depositCoinAmount,
        destinationCoinAmount,
        destinationAddress: self.destinationAddress,
        refundAddress: self.refundAddress
      }, {
        headers
      })
        .then((response) => {
          if (!response.data.success) {
            self.ErrorMessage = response.data.msg
            self.pStep = 1
            return
          }
          self.orderId = response.data.data.orderId
          self.exchangeAddress = response.data.data.exchangeAddress
          self.expectedDepositCoinAmount = response.data.data.expectedDepositCoinAmount
          self.expectedDestinationCoinAmount = response.data.data.expectedDestinationCoinAmount

          if (self.fromCoin.type !== 'new_public_key') {
            self.$store.commit('currentwallet/updateParams', {
              chainID: self.fromCoin.chain,
              tokenID: self.fromCoin.type,
              accountName: self.fromCoin.name,
              to: self.exchangeAddress.address,
              memo: self.exchangeAddress.tag,
              disableMemoEdit: true,
              amount: self.expectedDepositCoinAmount
            })
            if (self.currentWallet && self.$store.state.wallets.metamask.accounts.find(o => o.value === self.currentWallet.value)) {
              self.sendExternalTransaction('metamask')
            } else {
              let account = self.tableData.find(a => a.key === self.fromCoin.key && a.type === self.depositCoin.value && (self.fromCoin.chain === 'eth' || a.name === self.fromCoin.value))

              self.$store.state.currentwallet.wallet = account
              self.showTXComponent = true
            }
          }
          this.orderStatus()
        })
        .catch((err) => {
          self.ErrorMessage = err
          self.pStep = 1
        })
    },
    getPairs () {
      const self = this
      this.$axios.post(url + '/coins', {
        depositCoin: self.depositCoin.value
      }, {
        headers
      })
        .then((response) => {
          // //console.log('------------Response------------', response)
          let inject = {}
          self.destinationCoinOptions = response.data.data.map(function (coin) {
            if (coin.isActive === true) {
              let row = {
                'label': self.coins.filter(coins => coins.symbol === coin.destinationCoin)[0].name,
                'value': coin.destinationCoin,
                'image': self.coins.filter(coins => coins.symbol === coin.destinationCoin)[0].logoUrl
              }
              if (coin.destinationCoin === 'eos') {
                inject = {
                  'label': 'Volentix',
                  'value': 'vtx',
                  'chain': 'eos',
                  'image': '/statics/vtx_icon.png'
                }
              }
              return row
            } // deal with false, should not create empty option.
          }).filter(function (el) {
            return el != null && el.depositCoin
          }).sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) {
              return -1
            }
            return 1
          })
          self.destinationCoinOptions.push(inject)
          self.destinationCoinOptions.sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) {
              return -1
            }
            return 1
          })
          if (self.destinationCoinOptions.length) { self.destinationCoinUnfilter = self.destinationCoinOptions }
        })
        .catch((err) => {
          if (err) {}
          // userError()
          // //console.error('There was a problem getting the destination coins', err)
        })
    },
    async eThToVTX (amount) {
      let vtxAmount = false

      if (!this.eThToVTXPrice) {
        let response = await this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=volentix-vtx&vs_currencies=eth')
        if (response.data && response.data['volentix-vtx'] && response.data['volentix-vtx'].eth) {
          this.eThToVTXPrice = parseFloat(response.data['volentix-vtx'].eth)
        }
      }
      if (this.eThToVTXPrice) {
        if (!this.maxVtxAvailable) {
          let max = await eos.getCurrencyBalanceP('vtxisforhodl', 'volentixgsys', 'VTX')

          if (max) {
            this.maxVtxAvailable = parseFloat(max[0].split(' ')[0])
          }
        }

        if (this.$route.params.amount && !this.depositQuantity) {
          this.depositQuantity = this.$route.params.amount
        } else if (!this.depositQuantity) {
          this.depositQuantity = this.$store.state.settings.dexData && this.$store.state.settings.dexData.fromAmount ? this.$store.state.settings.dexData.fromAmount : 1
        }

        this.rateDataVtx = {
          limitMaxDepositCoin: this.maxVtxAvailable * this.eThToVTXPrice,
          limitMaxDestinationCoin: this.maxVtxAvailable,
          limitMinDepositCoin: 0,
          limitMinDestinationCoin: 0,
          minerFee: 0,
          rate: this.eThToVTXPrice
        }
        this.rateData = this.rateDataVtx

        this.isLoading = false
        this.quantityFromDeposit()
      }

      return vtxAmount
    },
    async getRate () {
      const self = this
      if (self.destinationCoin.value === 'vtx') {
        this.vtxEosPrice = (await this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://api.newdex.io/v1/price?symbol=volentixgsys-vtx-eos')).data.data.price
      }
      this.isLoading = true
      this.ErrorMessage = ''

      if (self.destinationCoin.value === 'vtx' && self.depositCoin.value === 'eth') {
        return this.eThToVTX()
      }

      this.$axios.post(url + '/v2/rate', {
        depositCoin: self.depositCoin.value.toLowerCase(),
        destinationCoin: self.destinationCoin.value === 'vtx' ? 'eos' : self.destinationCoin.value.toLowerCase()
      }, {
        headers
      })
        .then((response) => {
          this.isLoading = false
          if (response.data.data) {
            self.rateData = response.data.data

            if (self.destinationCoin.value === 'vtx') {
              self.rateDataVtx = {
                limitMaxDepositCoin: self.rateData.limitMaxDepositCoin,
                limitMaxDestinationCoin: self.rateData.limitMaxDestinationCoin / self.vtxEosPrice,
                limitMinDepositCoin: self.rateData.limitMinDepositCoin,
                limitMinDestinationCoin: self.rateData.limitMinDestinationCoin / self.vtxEosPrice,
                minerFee: self.rateData.minerFee,
                rate: self.rateData.rate / self.vtxEosPrice
              }
              self.rateDataEos = self.rateData
              self.rateData = self.rateDataVtx
            } else {
              // self.depositQuantity = self.rateData.limitMinDepositCoin
              self.quantityFromDeposit()
            }

            if (!self.depositQuantity) {
              if (self.$route.params.amount) {
                self.depositQuantity = self.$route.params.amount
              } else {
                self.depositQuantity = 1
              }
              self.quantityFromDeposit()
            }

            this.checkBalance()
          } else {
            self.rateData = {
              rate: 1,
              minerFee: 0,
              limitMinDepositCoin: 0,
              limitMaxDepositCoin: 1,
              limitMinDestinationCoin: 1,
              limitMaxDestinationCoin: 2
            }
            this.destinationQuantity = this.depositQuantity = 0
            this.ErrorMessage = 'Cannot swap ' + this.depositCoin.value.toUpperCase() + ' to ' + this.destinationCoin.value.toUpperCase()
          }
        })
        .catch((err) => {
          if (err) {}
          // userError()
          this.isLoading = false
        })
    },
    checkBalance () {
      if (this.currentWallet || (this.depositCoin.amount && this.$store.state.wallets.tokens.filter(a => a.type.toLowerCase() === this.depositCoin.value.toLowerCase()).length === 1)) {
        if (this.rateData.limitMinDepositCoin > this.depositCoin.amount) {
          /// this.ErrorMessage = 'Insuficient ' + this.depositCoin.value.toUpperCase() + ' balance. (Minimum deposit required: ' + this.rateData.limitMinDepositCoin + ' ' + this.depositCoin.value.toUpperCase() + ')'
        }
      }
      if (this.isEthToVtx) {
        this.ErrorMessage = ''
        if (this.depositCoin.amount < parseFloat(this.depositQuantity)) {
          this.ErrorMessage = 'Insuficient ' + this.depositCoin.value.toUpperCase() + ' balance'
        }
      }
    },
    triggerCustomRegisteredType1 () {
      this.notif = true
      this.$q.notify({
        type: 'my-notif',
        closeBtn: '+',
        classes: 'exchange-notif',
        message: `This may take a few minutes.`,
        caption: 'If you leave this page, you will no longer be able to track the status of this transaction.'
      })
    },
    addSearchField () {
      // console.log('addSearchField triggered')
    },
    changeText () {
      // console.log('changeText triggered')
    },
    triggerPayCoinSelect () {
      // //console.log('triggerPayCoinSelect triggered')
      document.querySelector('.pay-coin-select .q-field__control').dispatchEvent(new Event('click'))
      setTimeout(() => {
        let payCoinSelectPopup = document.querySelector('.pay-coin-select-popup')
        let paycoinSearch = document.querySelector('.paycoin-search').cloneNode(true)
        // //console.log('paycoinSearch', paycoinSearch)
        payCoinSelectPopup.prepend(paycoinSearch)
        payCoinSelectPopup.querySelector('.paycoin-search').classList.remove('hidden')
      }, 100)
      // paycoin-search
      // pay-coin-select-popup
    },
    triggerReceiveCoinSelect () {
      // //console.log('triggerReceiveCoinSelect triggered')
      document.querySelector('.receive-coin-select .q-field__control').dispatchEvent(new Event('click'))
      setTimeout(() => {
        let receiveCoinSelectPopup = document.querySelector('.receive-coin-select-popup')
        let receivecoinSearch = document.querySelector('.receivecoin-search').cloneNode(true)
        // //console.log('receivecoinSearch', receivecoinSearch)
        receiveCoinSelectPopup.prepend(receivecoinSearch)
        receiveCoinSelectPopup.querySelector('.receivecoin-search').classList.remove('hidden')
      }, 100)
      // paycoin-search
      // pay-coin-select-popup
    }
  },
  mixins: [DexInteraction, EOSContract, ETHContract]
}
</script>

<style lang="scss" scoped>

.unbold {
      font-weight: 300;
}

.gasfield {
    /deep/ .q-item.gasSelector {
        padding-left: 0px;
        padding-right: 0px;

        .q-item__section {
            .q-item--clickable {
                border-radius: 40px;
                margin-right: 20px;
                padding: 15px 30px;
            }
        }
    }
}

  .gasSelector .q-item {
    border: 1px solid #f1e7e7
}

.Slow i {
    color: #a0afae !important;
}

.Fast i {
    color: #00d0ca !important;
}

.Instant i {
    color: #7272fa !important;
}

.gasfield .selected {
    background: #dfdff1 !important;
}

/deep/ .q-panel-parent {
   display:none !important
}

@import "~@/assets/styles/variables.scss";
/deep/ .desktop-version {

    padding-top: 0vh !important;
    padding-left: 0vh !important;
}
/deep/ .q-page {
    min-height: 0 !important;
}
.standard-content--body__form {
    padding-bottom:0px;
     padding-top:0px;

}

/deep/ .desktop-version[data-v-5c57f246] {
    background: #ffffff;
}
/deep/ .wallets-wrapper {
    padding-bottom: 0px !important;
}

/deep/ .wallets-wrapper--list {
    box-shadow: none;
    margin-top: 0px;
}

.marg {
    /deep/ .profile-wrapper {
        &--header {
            margin-bottom: 0px;
        }
    }
}

.mobile-pad {
    padding-bottom: 100px;
    background: #f3f3f3 !important
}

.desktop-version {
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px;
    padding-right: 2%;
}

.desktop-card-style {
    height: 100%;
}

.standard-content {
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // justify-content: space-start;
    // min-height: calc(100vh + 100px) !important;
    // padding-bottom: 100px;
    @media screen and (min-width: 768px) {
        padding: 2%;
        flex-direction: column;
        justify-content: flex-start;
        min-height: unset !important;
        padding-bottom: 20px;
    }

    .exchange_picto {
        margin-top: -60px;

        img {
            width: 100%;
            max-width: 270px;
            margin-top: 20px;
            margin-bottom: -30px;
        }

        @media screen and (min-width: 768px) {
            margin-top: -20px;

            img {
                width: 100%;
                max-width: 380px;
            }
        }
    }

    &--title {
        font-size: 35px;
        font-weight: $bold;
        position: relative;
        line-height: 50px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 0px;

        @media screen and (min-width: 768px) {
            margin-top: -20px;
            font-size: 25px;
        }

        .btn-align-left {
            position: absolute;
            left: -15px;
            top: 10px;
        }
    }

    &--desc {
        margin-top: -20px;
        margin-bottom: 40px;
        font-size: 18px;
        font-weight: $regular;
        position: relative;
        line-height: 26px;
        font-family: $Titillium;
        color: $mainColor;
    }

    &--body {
        .progress-custom-volentix {
            max-width: 190px;
            margin: auto;
            margin-top: 20px;

            .title {
                font-size: 13px;
                color: #7272FA;
                font-weight: $light;
                font-family: $Titillium;
                margin-bottom: -10px;
                margin-top: 10px;
            }

            /deep/ .q-linear-progress__model {
                background: #7272FA;
            }
        }

        &__img {
            min-height: 250px;

            img {
                max-width: 90%;
            }
        }

        .rate-value {
            padding: 0px 0px;
            font-family: $Titillium;
            font-weight: $regular;
            color: #B0B0B0;
            font-size: 16px;
            margin-bottom: -20px;
            margin-top: -20px;
        }

        &__form {
            .pay-get-wrapper {
                // border-bottom: 1px solid rgba(#707070, .4);
                padding: 0px;
                padding-bottom: 10px;
                margin-bottom: 20px;

                .pay-wrapper {}

                .exchange-btn {
                    height: fit-content;
                    align-self: flex-end;
                    padding-top: 15px;
                    transform: rotate(90deg);
                    margin: auto;
                    margin-top: 10px;
                    padding: 12px 10px 0px 10px;

                    .left-icon {
                        transform: scaleX(-1);
                        margin-left: 0px;
                        margin-right: -26px;
                        margin-top: -24px;
                        color: #7272FA;
                    }

                    .right-icon {
                        color: #7272FA;
                    }
                }

                .label {
                    font-size: 17px;
                    color: #2A2A2A;
                    font-family: $Titillium;
                    font-weight: $light;
                }

                .value {
                    font-size: 33px;
                    color: #B0B0B0;
                    font-family: $Titillium;
                    font-weight: $regular;
                }

                .get-wrapper {}
            }

            /deep/ .q-field__native {
                padding-left: 8px;
                font-size: 16px;
                font-weight: $regular;
            }

            /deep/ .q-field__label {
                font-family: $Titillium;
                font-weight: $regular;
                font-size: 18px;
                padding-left: 10px;
                margin-top: -2px;
            }

            .input-input {
                height: 50px;
                padding-bottom: 0px;

                /deep/ .q-field__control {
                    height: 50px;
                    min-height: unset;

                    @media screen and (min-width: 1024px) {
                        margin-left: 20px;
                    }
                }

                .btn-copy {
                    // height: 30px;
                    position: relative;
                    top: -3px;
                    margin-right: 0px;
                    padding: 6px 13px;
                }

                .qr-btn {
                    width: 30px;
                    height: 30px;
                    padding-right: 8px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 25px;
                        height: 25px;
                        position: relative;
                        right: -5px;
                        transform: scale3d(1, 1, 1);
                    }
                }
            }

            /deep/ .option--avatar {
                border: 1px solid;
                width: 35px;
                height: 35px;
                max-width: 40px;
                padding: 0px;
                min-width: unset;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
                overflow: hidden;
                margin-left: -10px;
                padding-right: 0px;

                &.vtx {
                    background-color: #000;
                    padding: 3px;
                }
            }
        }
    }

    &--footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-height: 100px;

        .action-link {
            height: 54px;
            text-transform: initial !important;
            font-size: 16px;
            letter-spacing: .5px;
            border-radius: 40px;
            width: fit-content;
            margin-left: 0px;
            padding-left: 20px;
            padding-right: 20px;
            background-color: #7272FA !important;

            .left-icon {
                transform: scaleX(-1);
                margin-left: 6px;
                margin-right: 6px;
                margin-top: -1px;
            }

            // &.next{
            //   background-color: #7900FF !important;
            // }
            // &.back{
            //   background-color: #B0B0B0 !important;
            // }
        }

    }
}

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
                    padding-right: 0px;
                    min-width: 36px;

                    .q-item__label+.q-item__label {
                        margin-top: 0px;
                    }
                }
            }
        }
    }
}

.lab-input {
    font-family: $Titillium;
    font-weight: $regular;
    font-size: 16px;
    color: black;
    padding-left: 20px;
    padding-bottom: 5px;
    display: block;
    margin-top: 10px;
    line-height: 17px;
}

.tlab-input {
    font-family: $Titillium;
    font-weight: $bold;
    font-size: 26px;
    color: black;
    padding-left: 20px;
    padding-bottom: 25px;
    display: block;
    margin-top: 0px;
    line-height: 17px;
}

.sublab-input {
    font-family: $Titillium;
    font-weight: $regular;
    font-size: 14px;
    color: #333;
    padding-left: 20px;
    padding-bottom: 5px;
    display: block;
    margin-top: -50px;
    line-height: 17px;
}

.mw200 {
    max-width: 220px;
}

.mw160 {
    max-width: 160px;
}

.mw100 {
    max-width: 110px;
}

.pl0 {
    padding-left: 0px !important;

    /deep/ .q-field__native {
        padding-left: 1px !important;
    }
}

.align-left {
    /deep/ .q-btn__content {
        text-align: left;
        justify-content: start;
        padding-left: 7px;

        .q-icon {
            font-size: 1em;
        }
    }
}

.--next-btn {
    text-transform: initial !important;
}

.chain-tools-wrapper {

    // padding: 0px 6%;
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

            @media screen and (min-width: 1024px) {
                overflow: visible;
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

                    .chain {}

                    .token {}
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
                    padding: 1% 2%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);

                    @media screen and (min-width: 1024px) {
                        box-shadow: none;
                    }

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

                    /deep/ .q-stepper__step {
                        position: relative;
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
                            padding-top: 10px;
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
                                background: #FFB200 !important;
                            }
                        }
                    }

                    .--next-btn {
                        width: 100px;
                        text-transform: initial !important;
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
                    }

                    .--back-btn {
                        position: absolute;
                        right: 0px;
                        top: 6px;

                        @media screen and (min-width: 1024px) {
                            right: unset;
                            left: 5px;
                            top: 5px;
                            width: 90px;

                            /deep/ .q-focus-helper {
                                display: none !important;
                            }

                            /deep/ .q-btn__wrapper {
                                padding-left: 0px;
                                padding-right: 0px;
                            }
                        }
                    }

                    .--subtitle {
                        font-size: 16px;
                        color: #000;
                        font-family: $Titillium;
                        font-weight: $light;
                        line-height: 20px;
                        margin-top: 10px;
                        margin-bottom: 10px;

                        ul {
                            padding: 0px;
                            margin: 0px;
                            margin-left: 20px;

                            li {
                                font-size: 15px;
                                font-weight: $light;
                                margin-bottom: 10px;
                                line-height: 21px;
                                color: #FFB200;

                                span {
                                    color: #2A2A2A;
                                }
                            }
                        }

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
                            border-bottom: 1px solid;
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
                            border-bottom: 1px solid;
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
                        font-size: 13px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #B0B0B0;
                        text-transform: initial !important;
                        line-height: 20px;
                    }

                    .--amount {
                        color: #2A2A2A !important;
                    }
                }
            }
        }

        &.open {
            margin-bottom: 0px;
            padding-left: 0%;
            padding-right: 0%;
            @media screen {

            }
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

.q-card {
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
}

.accept-disclaimer {
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
}

.parg {
    font-size: 16px;
    font-weight: $regular;
    font-family: $Titillium;
    line-height: 22px;

    a {
        font-weight: $bold;
        border-bottom: 1px solid;
        text-decoration: none;
    }
}

.lower {
    text-transform: initial !important;
}

.bold {
    font-weight: $bold !important;
}

.stepper--desktop {
    /deep/ .q-stepper__content {
        max-width: 600px;
        margin: auto;
        margin-top: 50px;

        .q-stepper__step-inner {
            padding-top: 60px;
        }
    }

    /deep/ .q-stepper__header {
        // padding: 0px 10%;
        background-color: #F6F6F6;
        margin-bottom: 0px;
        border-radius: 40px;
        height: 40px;
        position: relative;

        &:before {
            content: '';
            width: 12%;
            position: absolute;
            left: 0px;
            top: 18px;
            height: 3px;
            background-color: #F6F6F6;
            transform: translateX(-100%);
        }

        &:after {
            content: '';
            width: 12%;
            position: absolute;
            right: 0px;
            top: 18px;
            height: 3px;
            background-color: #F6F6F6;
            transform: translateX(100%);
        }

        .q-stepper__tab {
            height: 40px;
            min-height: 40px;
            padding: 0px 10px;
            display: flex;
            flex-direction: row;
            align-items: center;

            &--active,
            &--done {
                .q-stepper__label {
                    .q-stepper__title {
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
            }
        }

        .q-stepper__dot {
            &:after {
                display: none;
            }
        }

        .q-stepper__label {
            margin-top: 0px;
            padding-left: 6px;

            .q-stepper__title {
                font-size: 12px;
                font-weight: normal;
            }
        }
    }
}
</style><style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.trade-component {
    position: relative;
    // font-family: $Franklin;
    font-size: 18px;
    font-weight: $bold;
    border: 1px solid #CCC;
    border-radius: 10px;
    //max-width: 500px;
    padding-bottom: 10px;

    .prototype {
        // position: absolute;
        z-index: 0;
        left: 0px;
        top: 0px;

        .--subtitle {
            font-size: 14px;
            // font-family: $Franklin;
            font-weight: $light;
            line-height: 20px;
            margin-bottom: 20px;
            text-align: center;
            padding-left: 10px;
            padding-right: 10px;
        }

        /deep/ .q-field--with-bottom {
            .q-field__messages.col div {
                padding-bottom: 0px;
                margin-bottom: 0px;
                margin-top: -8px;
                font-size: 10px;
                margin-left: -13px;
            }
        }

        .head {
            padding: 16px 30px;
            border-bottom: 1px solid #f6f6f9;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .you-pay {
            &-head {
                padding: 0px 30px;
                margin-bottom: 18px;
                font-size: 16px;

                .col {
                    &.red {
                        font-size: 12px;
                        font-weight: $light;
                    }
                }
            }

            &-body {
                padding: 0px 30px;
                font-size: 24px;
                font-weight: $bold;
            }
        }

        .choose-coin {
            cursor: pointer;

            &:hover {
                opacity: .7;
            }

            position: relative;
        }

        .pay-coin {
            position: relative;

            .pay-coin-select {
                position: absolute;
                left: -29px;
                top: 40px;
                z-index: -10;
                width: 348px;
                opacity: 0;
            }

            .receive-coin-select {
                position: absolute;
                left: -29px;
                top: 40px;
                z-index: -10;
                width: 348px;
                opacity: 0;
            }
        }

        .you-receive {
            background-color: #f6f6f9;
            margin: 0px 10px;
            margin-top: 20px;
            padding: 15px 10px;
            border-radius: 10px;
            position: relative;

            /deep/ .chose_accounts {
                background-color: #dfdff1 !important;
                font-weight: $bold;
                font-size: 14px !important;
                // font-family: $Franklin !important;
                color: #5e5e88 !important;
                border-radius: 10px;
                margin-top: 20px;
                height: 54px;
            }

            /deep/.swap_vert {
                position: absolute;
                top: 0px;
                left: 20px;
                transform: translateY(-50%) scale(1.15);
                background-color: #FFF !important;

                .q-btn__wrapper:before {
                    border: 3px solid #f4f4f4;
                }
            }

            &-head {
                padding: 0px 15px;
                margin-bottom: 18px;
                font-size: 16px;

                .col {
                    &.small {
                        font-size: 11px;
                        font-weight: $light;
                    }

                    &._loading {
                        -webkit-animation: infiniteRotate 1s linear infinite;
                        /* Safari */
                        animation: infiniteRotate 1s linear infinite;
                    }
                }
            }

            &-body {
                padding: 0px 15px;
                font-size: 24px;
                font-weight: $bold;
            }
        }
    }
}

.info_rate_holder {
    .i-btn {
        &:hover {
            .info_rate_wrapper {
                visibility: visible;
                opacity: 1;
                transform: translateY(-10px);
            }
        }
    }
}

.info_rate {
    position: relative;

    .i-btn {
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 1px solid rgba(black, .2);
        display: flex;
        justify-content: center;
        margin-left: 10px;
    }

    .rate-info-prototype {
        position: absolute;
        left: -220px;
        top: 0px;
        z-index: 9;
        display: none;
    }

    .info_rate_wrapper {
        position: absolute;
        right: 0px;
        top: 30px;
        z-index: 9;
        width: 220px;
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0px 10px 10px 0px rgba(black, .1);
        // font-family: $Franklin;
        font-weight: $regular;
        visibility: hidden;
        opacity: 0;
        transform: translateY(0px);
        transition: ease opacity .3s, transform ease .3s;

        hr {
            opacity: .2;
        }

        .title {
            font-size: 15px;
            padding-top: 5px;
            padding-bottom: 5px;
            // font-weight: $semibold;
        }
    }
}

.disclaimer-wrapper {
    font-size: 14px;
    // font-family: $Franklin;
    font-weight: $light;
}

/* Safari 4.0 - 8.0 */
@-webkit-keyframes infiniteRotate {
    0% {
        opacity: 1;
    }

    100% {
        opacity: .3;
    }
}

/* Standard syntax */
@keyframes infinite-rotate {
    0% {
        opacity: 1;
    }

    100% {
        opacity: .3;
    }
}
.desktop-marg{
    background: transparent !important;
}
.desktop-card-style{
    box-shadow: none;
    margin-bottom: 0px;
    padding: 0%;
    .list-wrapper{
        margin-bottom: 120px;
    }
}
.chain-tools-wrapper--list.open {
    @media screen and (max-width: 768px) {
        margin-bottom: 0px;
        padding-left: 0%;
        padding-right: 0%;
        .trade-component{
            border: none;
            .prototype{
                padding-top: 30px;
                .head{
                    display: none;
                }
            }
        }
        .mobile-pad{
            background: transparent !important;
        }
        .desktop-card-style{
            box-shadow: none;
            margin-bottom: 0px;
            padding: 0%;
            .list-wrapper{
                margin-bottom: 120px;
            }
        }
    }
}
.insuficient-text{
  color: #6200ea !important;
  padding-left: 15px;
}
.reject_offer{
  border: 1px solid #CCC;
  border-radius: 40px;
  width: fit-content;
  transform: translate(30px, 23px);
  height: 42px;
  padding-right: 15px;
  padding-left: 15px;
  text-align: center;
}
.freeEOSAccountStepper{
  /deep/ .q-stepper__title,
  /deep/ .q-stepper__caption{
    color: #333 !important;
  }
  /deep/ .q-stepper__dot span{
    color: #FFF !important;
  }
}
.freeEOSAccountStepper{
  &.q-dark{
    /deep/ .q-stepper__title,
    /deep/ .q-stepper__caption{
      color: #FFF !important;
    }
    /deep/ .q-stepper__dot span{
      color: #333 !important;
    }
  }
}
.dark-theme{
  .insuficient-text{
    color: #fff !important;
    text-shadow: 2px 2px 2px #6200ea;
  }
  .reject_offer{
    color: #FFF !important;
  }
    .desktop-card-style{
        background-color: #04111F;
        border-radius: 0px;
        padding: 0px;
    }
    .chain-tools-wrapper--list.open {
        margin-bottom: 0px;
        padding-left: 0%;
        padding-right: 0%;
    }
    .trade-component{
        .prototype{
            .head,.you-receive-head,.you-pay-head{
                color: #FFF;
            }
            .you-receive {
                background-color: #04111F;
                border: 1px solid #627797;
            }
        }
    }
}
</style><style lang="scss">
.option--avatar {
    border: 1px solid rgba(black, .1);
    width: 35px;
    height: 35px;
    max-width: 40px;
    padding: 0px;
    min-width: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    overflow: hidden;

    &__custom {
        border: 1px solid;
        margin-left: -10px;
        padding-right: 0px;
    }

    &.vtx {
        background-color: #000;
        padding: 3px;
    }
}

.q-field__messages {
    margin-top: 5px;
}
</style>
<style>
.q-field--dark.q-field--focused .q-field__label{
  color: #FFF !important;
}
.q-stepper--dark.q-dark .q-stepper__tab--active, .q-stepper__tab--done{
  color: #FFF !important;
}
.dark-theme .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .q-stepper__tab .q-stepper__title{
  color: #FFF !important;
}
</style>
