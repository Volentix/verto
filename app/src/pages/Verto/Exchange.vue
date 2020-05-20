<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 100px;background: #f3f3f3 !important">
    <div class="chain-tools-wrapper">
        <div class="standard-content">
            <h2 class="standard-content--title flex justify-center">
                <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="black" icon="keyboard_backspace" />
                  Exchange
            </h2>
            <div class="exchange_picto flex flex-center"><img src="statics/exchange_picto.svg" alt=""></div>
        </div>
        <div class="chain-tools-wrapper--list open">
            <div class="list-wrapper">
                <div class="list-wrapper--chain__eos-to-vtx-convertor">
                  <q-stepper v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                    <!-- 1. Select Coin to Send -->
                    <q-step default title="Select Coin to Send" :name="1" prefix="1" :done="step > 1">
                      <div class="text-black">
                        <!-- <span class="lab-input">Select Coin to Send</span> -->
                        <q-select
                            light
                            separator
                            rounded
                            outlined
                            class="select-input"
                            v-model="depositCoin"
                            use-input
                            @filter="filterDepositCoin"
                            @input="checkGetPairs()"
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
                                <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
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
                                <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
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
                        <q-stepper-navigation v-show="true" class="flex justify-end">
                        <q-btn @click="checkToGetPairs()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                        </q-stepper-navigation>
                      </div>
                    </q-step>
                    <!-- 2. Select Coin to Receive -->
                    <q-step default title="Select Coin to Receive" :name="2" prefix="2" :done="step > 2">
                      <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                      <div class="text-black">
                        <!-- <span class="lab-input">Select Coin to receive</span> -->
                        <q-select
                            light
                            separator
                            rounded
                            outlined
                            class="select-input"
                            v-model="destinationCoin"
                            use-input
                            @filter="filterDestinationCoin"
                            @input="updateCoinName()"
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
                                <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
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
                                <q-icon class="option--avatar option--avatar__custom" :name="`img:${destinationCoin.image}`" />
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
                        <q-stepper-navigation v-show="true" class="flex justify-end">
                          <q-btn @click="checkToGetRate()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                        </q-stepper-navigation>
                      </div>
                    </q-step>
                    <!-- 3. Select Quantity -->
                    <q-step default title="Select Quantity" :name="3" prefix="3" :done="step > 3">
                      <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                      <div class="standard-content--body">
                        <div class="standard-content--body__form">
                          <div class="pay-get-wrapper column justify-between">
                            <div class="pay-wrapper column">
                              <span class="label">you pay</span>
                              <span class="value">
                                <q-input ref="depositQuantity" @input="quantityFromDeposit()" :suffix="fromCoinType.toUpperCase()" rounded class="full-width pl0" flat v-model="depositQuantity" type="number" :disabled="!rateData" :loading="!rateData" :rules="[ val => val >= rateData.limitMinDepositCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDepositCoin || 'This is more than the maximum allowed']" />
                              </span>
                            </div>
                            <q-btn flat unelevated class="exchange-btn" @click="switchAmounts()" text-color="black">
                              <q-icon name="keyboard_backspace" class="left-icon" />
                              <q-icon name="keyboard_backspace" class="right-icon" />
                            </q-btn>
                            <div class="get-wrapper column">
                              <span class="label">you get</span>
                              <span class="value">
                                <q-input rounded class="full-width pl0" flat ref="destinationQuantity" :suffix="toCoinType.toUpperCase()" v-model="destinationQuantity" @input="quantityFromDestination()" :disabled="!rateData" :loading="!rateData" :rules="[ val => val >= rateData.limitMinDestinationCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDestinationCoin || 'This is more than the maximum allowed']" type="number" />
                              </span>
                            </div>
                          </div>
                          <div class="rate-value flex justify-end">
                            <span class="label">Rate {{fromCoinType.toUpperCase() + '&nbsp;'}} </span>
                            <span class="value"> = {{ rateData !== null ? rateData.rate : '0.03254'}} {{toCoinType.toUpperCase()}}</span>
                          </div>
                          <br>
                        </div>
                        <q-stepper-navigation v-show="true" class="flex justify-end">
                          <q-btn @click="checkToGetRate()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                        </q-stepper-navigation>
                      </div>
                    </q-step>
                    <!-- 4. Chose account -->
                    <q-step default title="Chose account" :name="4" prefix="4" :done="step > 4">
                      <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                      <div class="standard-content--body">
                        <div class="standard-content--body__form">
                          <span v-show="fromCoin === null || (fromCoin.type !== 'new_public_key')" class="lab-input">From</span>
                          <q-select
                            v-show="fromCoin === null || (fromCoin.type !== 'new_public_key')"
                            light
                            separator
                            rounded
                            outlined
                            class="select-input"
                            @input="checkGetPairs()"
                            v-model="fromCoin"
                            :options="optionsFrom"
                            >
                            <template v-slot:option="scope">
                              <q-item
                                class="custom-menu"
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                              >
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
                              <q-item
                                v-if="fromCoin"
                              >
                                <q-item-section avatar>
                                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromCoin.image}`" />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label v-html="fromCoin.label" />
                                  <q-item-label caption class="ellipsis mw160">{{ fromCoin.value }}</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-item
                                v-else>
                              </q-item>
                            </template>
                          </q-select>
                          <span v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" class="lab-input">Your <strong>{{ depositCoin !== null ? depositCoin.value.toUpperCase() : '' }}</strong> return address </span>
                          <q-input v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" v-model="refundAddress.address" @input="verifyAddress()" class="input-input" rounded outlined color="purple" type="text" hint="[ in case the transaction does not complete ]">
                            <template v-slot:append>
                              <div class="flex justify-end">
                                <q-btn color="purple" rounded class="q-mb-sm" @click="fromCoin = null" outlined unelevated flat text-color="black" label="Hide" />
                              </div>
                            </template>
                          </q-input>
                          <br v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')">
                          <span class="lab-input" v-show="fromCoinMemo" />
                          <q-input v-show="fromCoinMemo" class="input-input" rounded outlined color="purple" type="text" v-model="refundAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
                            <template v-slot:append>
                              <div class="flex justify-end">
                                <q-btn color="purple" rounded class="q-mb-sm" @click="fromCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
                              </div>
                            </template>
                          </q-input>
                          <br v-show="fromCoinMemo">
                          <q-btn v-show="!fromCoinMemo" flat class="q-mt-sm q-mb-sm --next-btn align-left full-width" :icon-right="fromCoinMemo ? 'close':'add'" rounded :label="fromCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="fromCoinMemo = !fromCoinMemo" />
                          <br>
                          <hr>
                          <span v-show="toCoin === null || (toCoin.type !== 'new_public_key')" class="lab-input">To</span>
                          <q-select
                              v-show="toCoin === null || (toCoin.type !== 'new_public_key')"
                              light
                              separator
                              rounded
                              outlined
                              class="select-input"
                              v-model="toCoin"
                              @input="updateCoinName()"
                              use-input
                              :options="optionsTo"
                            >
                            <template v-slot:option="scope">
                              <q-item
                                class="custom-menu"
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                              >
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
                              <q-item
                                v-if="toCoin"
                              >
                                <q-item-section avatar>
                                  <q-icon class="option--avatar option--avatar__custom" :class="toCoin.value" :name="`img:${toCoin.image}`" />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label v-html="toCoin.label" />
                                  <q-item-label caption class="ellipsis mw160">{{ toCoin.value }}</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-item
                                v-else>
                              </q-item>
                            </template>
                          </q-select>
                          <span v-show="toCoin !== null && toCoin.type === 'new_public_key'" class="lab-input">{{ destinationAddressLabel }}</span>
                          <q-input v-show="toCoin !== null && toCoin.type === 'new_public_key'" ref="destinationAddressAddress" v-model="destinationAddress.address" :rules="[ val => val.length >= 3 || 'Destination Address Cannot less than 3 characters' ]" @input="verifyAddress()" class="input-input" rounded outlined color="purple" type="text">
                            <template v-slot:append>
                              <div class="flex justify-end">
                                <q-btn color="purple" rounded class="q-mb-sm" @click="toCoin = null" outlined unelevated flat text-color="black" label="Hide" />
                              </div>
                            </template>
                          </q-input>
                          <span class="lab-input" v-show="toCoinMemo" />
                          <q-input v-show="toCoinMemo" class="input-input" rounded outlined color="purple" type="text" v-model="destinationAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
                            <template v-slot:append>
                              <div class="flex justify-end">
                                <q-btn color="purple" rounded class="q-mb-sm" @click="toCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
                              </div>
                            </template>
                          </q-input>
                          <br v-show="toCoinMemo">
                          <q-btn v-show="!toCoinMemo" flat class="q-mt-sm q-mb-sm --next-btn align-left full-width" :icon-right="toCoinMemo ? 'close':'add'" rounded :label="toCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="toCoinMemo = !toCoinMemo" />
                        </div>
                      </div>
                      <q-stepper-navigation v-show="true" class="flex justify-end">
                        <div class="row full-width" style="padding-left: 6px; margin-top: -20px;">
                          <div class="q-gutter-sm">
                            <q-btn color="white" flat @click="showDisclaimerWrapper = true" class="lower bold" text-color="black" label="Read the disclaimer" />
                          </div>
                        </div>
                        <div class="row full-width" style="padding-left: 13px; margin-top: 10px;">
                          <div class="q-gutter-sm"><q-checkbox label="I accept" color="deep-purple-14" v-model="disclaimerCheck" /></div>
                        </div>
                        <div class="standard-content--footer">
                          <q-btn @click="checkAddressMatchCoins()" :disable="!disclaimerCheck" flat class="action-link next" color="black" text-color="white">
                            <span class="label">Exchange {{ fromCoinType.toUpperCase() }} <q-icon name="keyboard_backspace" color="white" class="left-icon" /> {{ toCoinType.toUpperCase() }}</span>
                          </q-btn>
                        </div>
                      </q-stepper-navigation>
                    </q-step>
                    <!-- 5. View Order -->
                    <q-step default title="View Order" :name="5" prefix="5" :done="step > 5">
                      <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                      <div class="standard-content--body">
                        <div class="standard-content--body__form" style="margin-left: -35px;">
                          <div class="progress-custom-volentix column flex-center">
                            <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
                            <span class="title">{{ friendlyStatus }}</span>
                            <q-linear-progress indeterminate stripe rounded size="md" :value="progress" class="q-mt-md" />
                          </div>
                          <hr style="height:15px;opacity:0" />
                          <div class="text-black">
                            <div class="text-h4 --subtitle">
                              <ul>
                                <li><span>{{exchangeLabel}}</span></li>
                              </ul>
                            </div>
                            <q-input v-model="exchangeAddress.address" readonly rounded class="input-input pr80" outlined color="purple" type="text">
                              <template v-slot:append>
                                <div class="flex justify-end">
                                  <q-btn flat unelevated text-color="grey" @click="copyToClipboard(exchangeAddress.address , 'Exchange Address')" round class="btn-copy" icon="o_file_copy" />
                                </div>
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </div>
                    </q-step>
                  </q-stepper>
                </div>
                <br><br><br>
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

    <div class="standard-content" style="display: none">
      <h2 class="standard-content--title flex justify-center">
        <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="black" icon="keyboard_backspace" />
        Exchange
      </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <span class="lab-input">From</span>
          <q-select
            light
            separator
            rounded
            outlined
            class="select-input"
            @input="checkGetPairs()"
            v-model="fromCoin"
            :options="optionsFrom"
            >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="fromCoin"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="fromCoin.label" />
                  <q-item-label caption class="ellipsis mw200">{{ fromCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
          <!-- --------------------------------------- -->
          <span v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" class="lab-input">Select Coin to Send</span>
          <q-select
              v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')"
              light
              separator
              rounded
              outlined
              class="select-input"
              v-model="depositCoin"
              use-input
              @filter="filterDepositCoin"
              @input="checkGetPairs()"
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
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
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
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
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
          <!-- --------------------------------------- -->
          <span v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" class="lab-input">Your <strong>{{ depositCoin !== null ? depositCoin.value.toUpperCase() : '' }}</strong> return address <br>[in case the transaction does not complete]</span>
          <q-input v-show="fromCoin !== null && (fromCoin.type === 'new_public_key')" v-model="refundAddress.address" @input="verifyAddress()" class="input-input" rounded outlined color="purple" type="text" />
          <span class="lab-input" v-show="fromCoinMemo" />
          <q-input v-show="fromCoinMemo" class="input-input" rounded outlined color="purple" type="text" v-model="refundAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn color="purple" rounded class="q-mb-sm" @click="fromCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
              </div>
            </template>
          </q-input>
          <br v-show="fromCoinMemo">
          <q-btn v-show="!fromCoinMemo" flat class="q-mt-sm q-mb-sm --next-btn" :icon-right="fromCoinMemo ? 'close':'add'" rounded :label="fromCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="fromCoinMemo = !fromCoinMemo" />
          <br>
          <span class="lab-input">To</span>
          <q-select
              light
              separator
              rounded
              outlined
              class="select-input"
              v-model="toCoin"
              @input="updateCoinName()"
              use-input
              :options="optionsTo"
            >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="toCoin"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :class="toCoin.value" :name="`img:${toCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="toCoin.label" />
                  <q-item-label caption class="ellipsis mw200">{{ toCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
          <!-- --------------------------------------- -->
          <span v-show="toCoin !== null && toCoin.type === 'new_public_key'" class="lab-input">Select Coin to receive</span>
          <q-select
              v-show="toCoin !== null && toCoin.type === 'new_public_key'"
              light
              separator
              rounded
              outlined
              class="select-input"
              v-model="destinationCoin"
              use-input
              @filter="filterDestinationCoin"
              @input="updateCoinName()"
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
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
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
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${destinationCoin.image}`" />
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
          <!-- --------------------------------------- -->
          <span v-show="toCoin !== null && toCoin.type === 'new_public_key'" class="lab-input">{{ destinationAddressLabel }}</span>
          <q-input v-show="toCoin !== null && toCoin.type === 'new_public_key'" ref="destinationAddressAddress" v-model="destinationAddress.address" :rules="[ val => val.length >= 3 || 'Destination Address Cannot less than 3 characters' ]" @input="verifyAddress()" class="input-input" rounded outlined color="purple" type="text" />
          <span class="lab-input" v-show="toCoinMemo" />
          <q-input v-show="toCoinMemo" class="input-input" rounded outlined color="purple" type="text" v-model="destinationAddress.tag" label="Optional tag or memo" hint="some exchanges require this field">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn color="purple" rounded class="q-mb-sm" @click="toCoinMemo = false" outlined unelevated flat text-color="black" label="Hide" />
              </div>
            </template>
          </q-input>
          <br v-show="toCoinMemo">
          <q-btn v-show="!toCoinMemo" flat class="q-mt-sm q-mb-sm --next-btn" :icon-right="toCoinMemo ? 'close':'add'" rounded :label="toCoinMemo ? 'Hide Tag/Memo':'Add Tag/Memo'" @click="toCoinMemo = !toCoinMemo" />

          <q-btn color="white" text-color="black" label="Get Rate" @click="getRate()" />
          <!-- --------------------------------------- -->
          <br>
          <div class="pay-get-wrapper flex justify-between item-center content-center">
            <div class="pay-wrapper column">
              <span class="label">you pay</span>
              <span class="value">
                <q-input ref="depositQuantity" @input="quantityFromDeposit()" rounded class="mw100 pl0" flat v-model="depositQuantity" type="number" :disabled="!rateData" :loading="!rateData" :rules="[ val => val >= rateData.limitMinDepositCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDepositCoin || 'This is more than the maximum allowed']" />
                {{ fromCoinType.toUpperCase() }}
              </span>
            </div>
            <q-btn flat unelevated class="exchange-btn" @click="switchAmounts()" text-color="black">
              <q-icon name="keyboard_backspace" class="left-icon" />
              <q-icon name="keyboard_backspace" class="right-icon" />
            </q-btn>
            <div class="get-wrapper column">
              <span class="label">you get</span>
              <span class="value">
                <q-input rounded class="mw100 pl0" flat ref="destinationQuantity" v-model="destinationQuantity" @input="quantityFromDestination()" :disabled="!rateData" :loading="!rateData" :rules="[ val => val >= rateData.limitMinDestinationCoin || 'This is less than the minimum allowed', val => val < rateData.limitMaxDestinationCoin || 'This is more than the maximum allowed']" type="number" />
                {{ toCoinType.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
        <br>
        <div class="rate-value flex justify-center">
          <span class="label">Rate {{fromCoinType.toUpperCase()}}=</span>
          <span class="value"> {{ rateData !== null ? rateData.rate : '0.03254'}} {{toCoinType.toUpperCase()}}</span>
        </div>
        <br>
        <div class="standard-content--footer">
          <q-btn flat class="action-link next" color="black" text-color="white">
            <span class="label">Exchange EOS <q-icon name="keyboard_backspace" color="white" class="left-icon" /> VTX</span>
          </q-btn>
        </div>
        <div class="progress-custom-volentix column flex-center">
          <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
          <span class="title">Processing</span>
          <q-linear-progress rounded size="md" :value="progress" class="q-mt-md" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import store from '@/store'
import { userError } from '@/util/errorHandler'

const url = 'https://api.coinswitch.co'
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

export default {
  components: {},
  data () {
    return {
      disclaimerCheck: false,
      showDisclaimerWrapper: false,
      fromCoin: null,
      fromCoinAmount: 0,
      toCoinAmount: 0,
      fromCoinType: 'EOS',
      toCoinType: 'VTX',
      toCoin: null,
      progress: 0.2,
      to: '',
      amount: '',
      memo: '',
      optionsFrom: [],
      optionsTo: [],
      minimizedModal: false,
      params: null,
      tableData: [],
      currentAccount: null,
      goBack: '/verto/dashboard',
      fetchCurrentWalletFromState: true,
      fromCoinMemo: false,
      toCoinMemo: false,
      // -------------------------
      step: 1,
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
      requestStop: false
    }
  },
  updated () {
  },
  watch: {
    fromCoin (val) {
      if (val.type !== 'new_public_key') {
        this.fromCoinType = this.fromCoin.type
      } else {
        return 'EOS'
      }
    },
    toCoin (val) {
      if (val.type !== 'new_public_key') {
        this.toCoinType = this.toCoin.type
      } else {
        return 'VTX'
      }
    }
  },
  async created () {
    // console.log('created - created - created - created')
    this.params = this.$store.state.currentwallet.params
    this.tableData = await this.$store.state.wallets.tokens
    let self = this
    this.tableData.map(token => {
      self.optionsFrom.push({
        label: token.name.toLowerCase(),
        value: token.key,
        image: token.icon,
        type: token.type
      })
      self.optionsTo.push({
        label: token.name.toLowerCase(),
        value: token.key,
        image: token.icon,
        type: token.type
      })
    })
    this.optionsFrom.unshift({
      label: 'New Public Key',
      value: '',
      image: '/statics/img/door-key.png',
      type: 'new_public_key'
    })
    this.optionsTo.unshift({
      label: 'New Public Key',
      value: '',
      image: '/statics/img/door-key.png',
      type: 'new_public_key'
    })
    this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName)
    )
    // console.log('this.currentAccount', this.currentAccount)
    if (this.currentAccount !== null && this.currentAccount !== undefined) {
      // this.fromCoin = {
      //   label: this.currentAccount.name,
      //   value: this.currentAccount.key,
      //   image: this.currentAccount.icon,
      //   type: this.currentAccount.type
      // }
      this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'
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
        return this.coins.filter(coins => coins.symbol === this.destinationCoin.value)[0].logoUrl
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
  mounted () {
    const self = this
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
      // console.log('depositCoinOptions', self.depositCoinOptions)
    })
  },
  methods: {
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
      this.postOrder()
      this.$refs.stepper.next()
    },
    checkDepositAndDestination () {
      if (this.destinationAddress.address === '' || this.depositCoin.address === '') {}
    },
    updateCoinName () {
      if (this.destinationCoin !== null) {
        this.toCoinType = this.destinationCoin.value
        this.getPairs()
      } else {
        this.toCoinType = this.toCoin.type
      }
    },
    checkGetPairs () {
      if (this.depositCoin !== null) {
        this.fromCoinType = this.depositCoin.value
        this.getPairs()
      } else {
        this.fromCoinType = this.fromCoin.type
      }
    },
    switchAmounts () {
      // let fromCoinTypeVar = this.fromCoinType
      // this.fromCoinType = this.toCoinType
      // this.toCoinType = fromCoinTypeVar

      let depositQuantityVar = this.depositQuantity
      this.depositQuantity = this.destinationQuantity
      this.destinationQuantity = depositQuantityVar
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
      // if (this.$refs.destinationAddressAddress.hasError || this.destinationAddress.address === '' ||
      // console.log('this.depositCoin.value', this.depositCoin.value)
      let self = this
      this.optionsFrom = []
      this.optionsTo = []
      this.tableData.map(token => {
        if (this.depositCoin.value.toLowerCase() === token.type) {
          self.optionsFrom.push({
            label: token.name.toLowerCase(),
            value: token.type === 'eos' ? token.name.toLowerCase() : token.key,
            image: token.icon,
            type: token.type
          })
        }
        if (this.destinationCoin.value.toLowerCase() === token.type) {
          self.optionsTo.push({
            label: token.name.toLowerCase(),
            value: token.type === 'eos' ? token.name.toLowerCase() : token.key,
            image: token.icon,
            type: token.type
          })
        }
      })
      this.optionsFrom.unshift({
        label: 'New Public Key',
        value: '',
        image: '/statics/img/door-key.png',
        type: 'new_public_key'
      })
      this.optionsTo.unshift({
        label: 'New Public Key',
        value: '',
        image: '/statics/img/door-key.png',
        type: 'new_public_key'
      })
      if (this.destinationCoin === null) {
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

      this.refundAddress.address = this.refundAddress.address === '' ? this.fromCoin.value : this.refundAddress.address
      // console.log('this.refundAddress', this.refundAddress)
      this.destinationAddress.address = this.destinationAddress.address === '' ? this.toCoin.value : this.destinationAddress.address

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
          // console.log('response - order', response)
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
          // console.log('------------Response------------', response)
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
          // console.log('self.rateData -------------- ', self.rateData)
        })
        .catch((err) => {
          userError('There was a problem getting the rate data', err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // justify-content: space-start;
    // min-height: calc(100vh + 100px) !important;
    // padding-bottom: 100px;
    .exchange_picto{
      margin-top: -60px;
      img{
        width: 100%;
        max-width: 270px;
        margin-top: 20px;
        margin-bottom: -30px;
      }
      @media screen and (min-width: 768px) {
        margin-top: -20px;
        img{
          width: 100%;
          max-width: 380px;
        }
      }
    }
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 0px;
      .btn-align-left{
        position: absolute;
        left: -15px;
        top: 10px;
      }
    }
    &--desc{
      margin-top: -20px;
      margin-bottom: 40px;
      font-size: 18px;
      font-weight: $regular;
      position: relative;
      line-height: 26px;
      font-family: $Titillium;
      color: $mainColor;
    }
    &--body{
      .progress-custom-volentix{
        max-width: 150px;
        margin: auto;
        margin-top: 20px;
        .title{
          font-size: 13px;
          color: #7272FA;
          font-weight: $light;
          font-family: $Titillium;
          margin-bottom: -10px;
          margin-top: 10px;
        }
        /deep/ .q-linear-progress__model{
          background: #7272FA;
        }
      }
      &__img{
        min-height: 250px;
        img{
          max-width: 90%;
        }
      }
      .rate-value{
        padding: 0px 0px;
        font-family: $Titillium;
        font-weight: $regular;
        color: #B0B0B0;
        font-size: 16px;
        margin-bottom: -20px;
        margin-top: -20px;
      }
      &__form{
        .pay-get-wrapper{
          // border-bottom: 1px solid rgba(#707070, .4);
          padding: 0px;
          padding-bottom: 10px;
          margin-bottom: 20px;
          .pay-wrapper{}
          .exchange-btn{
            height: fit-content;
            align-self: flex-end;
            padding-top: 15px;
            transform: rotate(90deg);
            margin: auto;
            margin-top: 10px;
            padding: 12px 10px 0px 10px;
            .left-icon{
              transform: scaleX(-1);
              margin-left: 0px;
              margin-right: -26px;
              margin-top: -24px;
              color: #7272FA;
            }
            .right-icon{
              color: #7272FA;
            }
          }
          .label{
            font-size: 17px;
            color: #2A2A2A;
            font-family: $Titillium;
            font-weight: $light;
          }
          .value{
            font-size: 33px;
            color: #B0B0B0;
            font-family: $Titillium;
            font-weight: $regular;
          }
          .get-wrapper{}
        }
        /deep/ .q-field__native{
          padding-left: 8px;
          font-size: 16px;
          font-weight: $regular;
        }
        /deep/ .q-field__label{
          font-family: $Titillium;
          font-weight: $regular;
          font-size: 18px;
          padding-left: 10px;
          margin-top: -2px;
        }
        .input-input{
          height: 50px;
          padding-bottom: 0px;
          /deep/ .q-field__control{
            height: 50px;
            min-height: unset;
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
        /deep/ .option--avatar{
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
          &.vtx{
            background-color: #000;
            padding: 3px;
          }
        }
      }
    }
    &--footer{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-height: 100px;
      .action-link{
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
        .left-icon{
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
  .lab-input{
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
  .mw200{
    max-width: 220px;
  }
  .mw160{
    max-width: 160px;
  }
  .mw100{
    max-width: 110px;
  }
  .pl0{
    padding-left: 0px !important;
    /deep/ .q-field__native{
      padding-left: 1px !important;
    }
  }
  .align-left{
    /deep/ .q-btn__content{
      text-align: left;
      justify-content: start;
      padding-left: 7px;
      .q-icon{
        font-size: 1em;
      }
    }
  }
  .--next-btn{
    text-transform: initial !important;
  }
  .chain-tools-wrapper{
    // padding: 0px 6%;
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
            .chain{}
            .token{}
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
            padding: 1% 2%;
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
            /deep/ .q-stepper__step{
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
                padding-top: 10px;
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
                  background: #FFB200 !important;
                }
              }
            }
            .--next-btn{
              width: 100px;
              text-transform: initial !important;
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
            }
            .--back-btn{
              position: absolute;
              right: 0px;
              top: 6px;
            }
            .--subtitle{
              font-size: 16px;
              color: #000;
              font-family: $Titillium;
              font-weight: $light;
              line-height: 20px;
              margin-top: 10px;
              margin-bottom: 10px;
              ul{
                padding: 0px;
                margin: 0px;
                margin-left: 20px;
                li{
                  font-size: 15px;
                  font-weight: $light;
                  margin-bottom: 10px;
                  line-height: 21px;
                  color: #FFB200;
                  span{
                    color: #2A2A2A;
                  }
                }
              }
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
                border-bottom: 1px solid;
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
                border-bottom: 1px solid;
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
              font-size: 13px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #B0B0B0;
              text-transform: initial !important;
              line-height: 20px;
            }
            .--amount{
              color: #2A2A2A !important;
            }
          }
        }
      }
      &.open{
        margin-bottom: 0px;
        padding-left: 6%;
        padding-right: 6%;
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
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
  .accept-disclaimer{
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
  }
  .parg{
    font-size: 16px;
    font-weight: $regular;
    font-family: $Titillium;
    line-height: 22px;
    a{
      font-weight: $bold;
      border-bottom: 1px solid ;
      text-decoration: none;
    }
  }
  .lower{
    text-transform: initial !important;
  }
  .bold{
    font-weight: $bold !important;
  }
</style>
<style lang="scss">
  .option--avatar{
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
    &__custom{
      border: 1px solid;
      margin-left: -10px;
      padding-right: 0px;
    }
    &.vtx{
      background-color: #000;
      padding: 3px;
    }
  }
  .q-field__messages{
    margin-top: 5px;
  }
</style>
