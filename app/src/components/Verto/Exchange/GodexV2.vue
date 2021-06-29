<template>
  <div
    :class="{ 'dark-theme text-white ': $store.state.settings.lightMode === 'true' ,  'light-mode bg-white': $store.state.settings.lightMode === 'false' }"
    class=" full-width "
  >
    <div class="gdx-exchange-form q-px-md" v-show="step != 2">
     <div class="text-h6 full-width q-py-md">Exchange any to any</div>
      <div class="coins">
        <div class="gdx-exchange-coin">
          <div
            dir="auto"
            blockedvalue="BTC,ETH"
            data-fetch-key="GdxCoinSelect:0"
            class="
              v-select
              gdx-select gdx-coin-select gdx-exchange-coin-select
              vs--single vs--searchable
            "
          >
            <div
              id="vs4__combobox"
              role="combobox"
              aria-expanded="false"
              aria-owns="vs4__listbox"
              aria-label="Search for option"
              class="vs__dropdown-toggle"
            >
              <div class="vs__selected-options">
                <span class="vs__selected"
                  ><div class="gdx-select__selected-option">
                    <q-select
                      @input="
                        hideDeposit = false;
                        setMinimum();
                        getSwapInfo();
                      "
                      @blur="hideDeposit = false"
                      class="select-input"
                      :dark="$store.state.settings.lightMode === 'true'"
                      :light="$store.state.settings.lightMode === 'false'"
                      separator
                      use-input
                      borderless
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
                          <q-item-section>
                            <q-item-label
                              v-html="scope.opt.label.toUpperCase()"
                            />
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:selected>
                        <div>
                          <span
                            class="gdx-coin"
                            v-if="
                              depositCoin && !hideDeposit && depositCoin.value
                            "
                            @click="hideDeposit = true"
                            ><span class="gdx-coin-icon icon-BTC">
                              <q-img
                                style="width: 30px"
                                :src="depositCoin.image"
                              />
                            </span>
                            <span class="gdx-coin-name"></span>
                            <span class="gdx-coin-code">{{
                              depositCoin.value.toUpperCase()
                            }}</span></span
                          >
                        </div>
                      </template>
                    </q-select>
                  </div>
                  <!----></span
                >
                <input
                  aria-autocomplete="list"
                  aria-labelledby="vs4__combobox"
                  aria-controls="vs4__listbox"
                  type="search"
                  autocomplete="off"
                  value=""
                  class="vs__search"
                />
              </div>
              <div class="vs__actions">
                <button
                  type="button"
                  title="Clear Selected"
                  aria-label="Clear Selected"
                  class="vs__clear"
                  style="display: none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                  >
                    <path
                      d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z"
                    ></path>
                  </svg>
                </button>
                <img
                  src="https://godex.io/.nuxt_next/affcbccb20f94c6df96042f8d146a5a7.svg"
                  alt="arrow-bottom"
                  role="presentation"
                  class="gdx-image vs__open-indicator"
                />
                <div class="vs__spinner" style="display: none">Loading...</div>
              </div>
            </div>
          </div>
          <div class="gdx-exchange-coin-input gdx-input">
            <input
              id="ccb64da7-24eb-4aa2-8a1a-e399d74a9dcc"
              placeholder="Type amount"
              name="exchange_inputs_y_send"
              v-model="swapData.fromAmount"
              @input="getSwapInfo()"
              class="gdx-input-field no-border"
            />
            <label
              for="0b8fcb69-5046-4761-b565-fd45f501c3c4"
              class="gdx-input-label"
              >You Send</label
            >
            <span
              v-if="depositCoin && depositCoin.minimum"
              class="gdx-input-error absolute-top-right text-body2"
              >Min: {{ depositCoin.minimum }}
            </span>
          </div>
        </div>

        <div class="gdx-exchange-coin">
          <div
            dir="auto"
            blockedvalue="BTC,ETH"
            data-fetch-key="GdxCoinSelect:1"
            class="
              v-select
              gdx-select gdx-coin-select gdx-exchange-coin-select
              vs--single vs--searchable
            "
          >
            <div
              id="vs5__combobox"
              role="combobox"
              aria-expanded="false"
              aria-owns="vs5__listbox"
              aria-label="Search for option"
              class="vs__dropdown-toggle"
            >
              <div class="vs__selected-options">
                <span class="vs__selected"
                  ><div class="gdx-select__selected-option">
                    <div>
                      <q-select
                        @input="
                          hideDestination = false;
                          getSwapInfo();
                        "
                        @blur="hideDestination = false"
                        class="select-input"
                        :dark="$store.state.settings.lightMode === 'true'"
                        :light="$store.state.settings.lightMode === 'false'"
                        separator
                        use-input
                        borderless
                        rounded
                        v-model="destinationCoin"
                        @filter="filterDestinationCoin"
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
                              <q-item-label
                                v-html="scope.opt.label.toUpperCase()"
                              />
                            </q-item-section>
                          </q-item>
                        </template>
                        <template v-slot:selected>
                          <div>
                            <span
                              class="gdx-coin"
                              v-if="destinationCoin && !hideDestination"
                              @click="hideDestination = true"
                              ><span class="gdx-coin-icon icon-BTC">
                                <q-img
                                  style="width: 30px"
                                  :src="destinationCoin.image"
                                />
                              </span>
                              <span class="gdx-coin-name"></span>
                              <span class="gdx-coin-code">{{
                                destinationCoin.value.toUpperCase()
                              }}</span></span
                            >
                          </div>
                        </template>
                      </q-select>
                    </div>
                  </div>
                  <!----></span
                >
                <q-spinner-dots
                  v-if="spinner.amount"
                  color="primary"
                  size="2em"
                />
                <input
                  v-else
                  aria-autocomplete="list"
                  aria-labelledby="vs5__combobox"
                  aria-controls="vs5__listbox"
                  type="search"
                  autocomplete="off"
                  v-model="swapData.toAmount"
                  class="vs__search"
                />
              </div>
              <div class="vs__actions">
                <button
                  type="button"
                  title="Clear Selected"
                  aria-label="Clear Selected"
                  class="vs__clear"
                  style="display: none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                  >
                    <path
                      d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z"
                    ></path>
                  </svg>
                </button>
                <img
                  src="https://godex.io/.nuxt_next/affcbccb20f94c6df96042f8d146a5a7.svg"
                  alt="arrow-bottom"
                  role="presentation"
                  class="gdx-image vs__open-indicator"
                />
                <div class="vs__spinner" style="display: none">Loading...</div>
              </div>
            </div>
            <ul
              id="vs5__listbox"
              role="listbox"
              style="display: none; visibility: hidden"
            ></ul>
          </div>
          <div class="gdx-exchange-coin-input gdx-input">
            <input
              id="5c16fa25-44bf-4c1c-9ad7-b90babb59f5c"
              placeholder="Type amount"
              name="exchange_inputs_y_get"
              v-model="swapData.toAmount"
              class="gdx-input-field no-border"
            />
            <label
              for="2dd3c157-34e2-406d-9f62-7cc3c7bf320c"
              class="gdx-input-label"
              ><q-spinner-dots
                color="white"
                size="2em"
                v-if="spinner.amount"
              /><span v-else>You Get</span>
            </label>
            <!---->
          </div>
        </div>
        <button
          type="default"
          class="gdx-replace-button gdx-button"
          @click="switchAmounts()"

        >
          <div class="box" >
            <img
              src="https://godex.io/.nuxt_next/80dfd238ff9fbd794aae9ada0f9fcb5f.svg"
              alt="arrow-blue"
              class="gdx-image"

            />
            <img
              src="https://godex.io/.nuxt_next/d184a0be7e04a5c7f6b4bb9468fc8c0c.svg"
              alt="arrow-white"
              class="gdx-image"

            />
          </div>
        </button>
      </div>

      <a
        href="javascript:void(0)"
        :class="{
          'mask-section': step != 0,
          'inactive-btn': !swapData.toAmount || spinner.tx || spinner.amount,
        }"
        @click="
          swapData.toAmount && !spinner.amount && !spinner.tx ? showSteps() : ''
        "
        class="gdx-link theme-2"

        >Exchange</a
      >
      <p @click="getDepositTxData()" v-if="false">Test</p>

      <q-splitter
        v-model="splitterModel"

        class="full-width"
        v-if="step == 1"
        style="height: 1050px"
      >
        <template v-slot:before>
          <q-tabs
            v-model="tab"
            align="left"

            vertical
            class="text-teal"
          >
            <q-tab
              name="deposit"

              label="Deposit"
              v-if="
                swapData.fromChains.length != 1
              "
            />
            <q-tab name="destination" label="Destination" />
            <q-tab name="tosend" label="Sending" />

            <q-tab
              name="waiting"
              :icon="
                tab == 'waiting'
                  ? 'img:https://i.stack.imgur.com/qq8AE.gif'
                  : ''
              "
              label="Waiting"
            />
            <q-tab
              class="text-black"
              name="reset"
              @click="step = 0"
              label="Reset"
            />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            :dark="$store.state.settings.lightMode === 'true'"
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="deposit">
              <q-item-label
                v-if="swapData.fromChains.length > 1 && innerStep.deposit == 1"
                header
                >Choose the network you are sending
                {{ depositCoin.value.toUpperCase() }} from</q-item-label
              >
              <q-list separator>
                <q-item
                  v-show="swapData.fromChains.length > 1 && innerStep.deposit == 1"
                  v-for="chain in swapData.fromChains"
                  :key="chain"
                  :dark="$store.state.settings.lightMode === 'true'"
                  tag="label"
                  v-ripple
                  @click="changeInnerStep()"
                >
                  <q-item-section
                    v-if="swapData.fromChains.length != 1"
                    side
                    top

                  >
                    <q-radio

                      v-model="swapData.fromChosenChain"
                      :val="chain"
                      label=""
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                      >Send from {{ chain.toUpperCase() }} network</q-item-label
                    >
                  </q-item-section>
                </q-item>
               <q-btn v-if="innerStep.deposit == 2" icon="arrow_back"  label="Back"  class="q-mb-md" flat @click="innerStep.deposit = 1"/>
                <div
                  v-if="
                    swapData.fromChosenChain &&
                    chainData &&
                    chainData.accounts.length &&
                    innerStep.deposit == 2
                  "
                >
                  Select {{ swapData.fromChosenChain.toUpperCase() }}
                  {{
                    swapData.fromChosenChain == "eos" ? "account" : "address"
                  }}
                  to send
                  {{ swapData.fromAmount }}
                  {{ depositCoin.value.toUpperCase() }}
                  <q-select
                    :dark="$store.state.settings.lightMode === 'true'"
                    :light="$store.state.settings.lightMode === 'false'"
                    separator
                    rounded
                    outlined
                    style="max-width: 300px"
                    class="select-input accountDropdown q-my-md"
                    v-model="fromAccountSelected[swapData.fromChosenChain]"
                    :options="
                      chainData.accounts
                    "
                  >
                    <template v-slot:option="scope">
                      <q-item
                        class="custom-menu"
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-section avatar>
                          <q-icon
                            class="option--avatar"
                            :name="`img:${scope.opt.icon}`"
                          />
                        </q-item-section>
                        <q-item-section :dark="$store.state.settings.lightMode === 'true'">
                          <q-item-label v-html="scope.opt.name" />
                          <q-item-label caption class="ellipsis mw200">{{
                            scope.opt.key
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template
                      v-if="
                        fromAccountSelected[swapData.fromChosenChain] &&
                        fromAccountSelected[swapData.fromChosenChain].icon
                      "
                      v-slot:selected
                    >
                      <q-item>
                        <q-item-section avatar>
                          <q-icon
                            class="option--avatar"
                            :name="`img:${
                              fromAccountSelected[swapData.fromChosenChain].icon
                            }`"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            v-html="
                              fromAccountSelected[swapData.fromChosenChain].name
                            "
                          />
                          <q-item-label caption class="ellipsis mw200" :class="{'text-white' : $store.state.settings.lightMode === 'true'}">{{
                            getKeyFormat(
                              fromAccountSelected[swapData.fromChosenChain].key
                            )
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <p
                        v-if="fromAccountSelected[swapData.fromChosenChain]"
                        class="text-body2 q-my-sm"
                      >
                        We set this address as the return address in case the
                        transaction <br />needs to be refunded.
                      </p>
                </div>
                <div

                  v-else-if="chainData"
                >
                  <p
                    v-if="
                      $store.state.settings.chainsSendEnabled.includes(
                        swapData.fromChosenChain.toLowerCase()
                      ) &&
                      chainData &&
                      (!chainData.accounts || !chainData.accounts.length)
                    "
                  >
                    No {{ swapData.fromChosenChain.toUpperCase() }} wallet
                    found. Import this wallet and start using it inside Verto.
                    If you decide to continue with this exchange without having
                    your wallet in Verto, you will need an external wallet to
                    make the deposit
                  </p>

                  <div
                    v-else-if="
                      chainData &&
                      !$store.state.settings.chainsSendEnabled.includes(
                        swapData.fromChosenChain.toLowerCase()
                      )
                    "
                  >
                    Verto will support asset transfer for this chain Very soon.
                    You will need an external wallet to make the deposit to
                    finalize this exchange
                  </div>
                </div>
                <div v-else-if="swapData.fromChosenChain">
                  Verto will support this chain very soon. You will need an
                  external wallet to make the deposit to finalize this exchange
                </div>

                <q-btn
                  :loading="spinner.tx"
                  v-if="swapData.fromChosenChain
                  && (!chainData
                   || !$store.state.settings.chainsSendEnabled.includes(
                        swapData.fromChosenChain.toLowerCase()
                      )
                   || !chainData.accounts
                   || !chainData.accounts.length)
                   || fromAccountSelected[swapData.fromChosenChain]"
                  :disable="!swapData.fromChosenChain"
                  label="Next"
                  outline
                  @click="tab = 'destination'"
                  rounded
                  class="q-mt-sm"
                />
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="destination">
             <q-item-label v-if="swapData.toChains.length > 1" header
                >Choose a network to receive your coins</q-item-label
              >
              <q-list separator>
                <q-item
                  v-for="chain in swapData.toChains"
                  :key="chain"
                  :dark="$store.state.settings.lightMode === 'true'"
                  tag="label"
                  v-ripple
                >
                  <q-item-section v-if="swapData.toChains.length != 1" side top>
                    <q-radio
                      v-model="swapData.toChosenChain"
                      :val="chain"
                      label=""
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="q-pb-sm"
                      >Send to {{ chain.toUpperCase() }} network</q-item-label
                    >

                    <div
                      v-if="
                        swapData.toChosenChain === chain ||
                        swapData.toChains.length == 1
                      "
                    >
                      <div
                        v-if="
                          chains.find((o) => o.chain == chain) &&
                          chains.find((o) => o.chain == chain).accounts.length
                        "
                      >
                        Select {{ chain.toUpperCase() }}
                        {{ chain == "eos" ? "account" : "address" }} to receive
                        {{ swapData.toAmount }}
                        {{ destinationCoin.value.toUpperCase() }}
                        <q-select
                          :dark="$store.state.settings.lightMode === 'true'"
                          :light="$store.state.settings.lightMode === 'false'"
                          separator
                          rounded
                          outlined
                          style="max-width: 300px"
                          class="select-input accountDropdown q-my-md"
                          @input="
                            swapData.toDestinationAddresses[chain] = toAccountSelected[chain] ?
                             ( chain == 'eos'
                                ? toAccountSelected[chain].name
                                : toAccountSelected[chain].key
                             ) : {}
                          "
                          v-model="toAccountSelected[chain]"
                          :options="
                            chains.find((o) => o.chain == chain).accounts
                          "
                        >
                          <template v-slot:option="scope">
                            <q-item
                              class="custom-menu"
                              v-bind="scope.itemProps"
                              v-on="scope.itemEvents"
                            >
                              <q-item-section avatar>
                                <q-icon
                                  class="option--avatar"
                                  :name="`img:${scope.opt.icon}`"
                                />
                              </q-item-section>
                              <q-item-section :dark="$store.state.settings.lightMode === 'true'">
                                <q-item-label v-html="scope.opt.label" />
                                <q-item-label caption class="ellipsis mw200">{{
                                  scope.opt[
                                    chain == "eos" ? "key" : "value"
                                  ].substring(0, 10) + "..."
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                          <template
                            v-if="
                              toAccountSelected[chain] &&
                              toAccountSelected[chain].icon
                            "
                            v-slot:selected
                          >
                            <q-item>
                              <q-item-section avatar>
                                <q-icon
                                  class="option--avatar"
                                  :name="`img:${toAccountSelected[chain].icon}`"
                                />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label
                                  v-html="toAccountSelected[chain].name"
                                />
                                <q-item-label caption class="ellipsis mw200" :class="{'text-white' : $store.state.settings.lightMode === 'true'}">{{
                            getKeyFormat(
                              toAccountSelected[chain].key
                            )
                          }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div v-else>
                        <q-item-label class="q-py-sm" caption>
                          {{ chain.toUpperCase() }} address to receive
                          {{ swapData.toAmount }}
                          {{ destinationCoin.value.toUpperCase() }}.
                        </q-item-label>
                        <q-input
                          style="max-width: 400px"
                          filled
                          :dark="$store.state.settings.lightMode === 'true'"
                          :label="'Paste your ' + chain + ' address'"
                          v-model="swapData.toDestinationAddresses[chain]"
                        />
                      </div>
                    <span v-if="error" class="text-red">{{error}}</span>
                      <q-btn
                        :loading="spinner.tx"
                        :disable="!swapData.toDestinationAddresses[chain] && (!toAccountSelected[chain] || !toAccountSelected[chain].key)"
                        label="Confirm"
                        outline
                        @click="swapData.toDestinationAddresses[chain] =
                              chain == 'eos'
                                ? toAccountSelected[chain].name
                                : toAccountSelected[chain].key ; createTransaction()"
                        rounded
                        class="q-mt-sm"
                      />
                    </div>
                    {{tab}}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="tosend" style="max-width: 500px" v-if="exchangeDetails[swapData.order_id]">

              <q-item-label header>
               <span class="text-subtitle2 ">
                <span class="text-bold text-body1">Status: </span>
                <span
                  class="text-capitalize"
                  :class="{
                    'text-deep-purple-12': validStatus(exchangeDetails[swapData.order_id].status),
                    'text-grey': !validStatus(exchangeDetails[swapData.order_id].status),
                  }"
                  >{{ exchangeDetails[swapData.order_id].status }}</span
                >
              </span>
              </q-item-label>
              <p>{{ exchangeDetails[swapData.order_id].description }}</p>
               <!--<transactEOS
                  :hideLabels="true"
                  :key="$store.state.investment.defaultAccount.key"
                  v-if="swapData.fromChosenChain === 'eos' && showSendComponent && $store.state.investment.defaultAccount && $store.state.investment.defaultAccount.key"
                  @setSuccessData="setSuccessData"
                  ref="transact"
                  class="q-py-md"
                /> -->
            <SendComponent :isExchange="true" :miniMode="true" @setTab="setTab" :key="$store.state.investment.defaultAccount.key+$store.state.investment.defaultAccount.name" v-if="showSendComponent && $store.state.investment.defaultAccount && $store.state.investment.defaultAccount.key" />

           </q-tab-panel>
            <q-tab-panel name="waiting" style="max-width: 500px" v-if="exchangeDetails[swapData.order_id]">
              <q-item-label header>
               <span class="text-subtitle2 ">
                <span class="text-bold text-body1">Status: </span>
                <span
                  class="text-capitalize"
                  :class="{
                    'text-deep-purple-12': validStatus(exchangeDetails[swapData.order_id].status),
                    'text-grey': !validStatus(exchangeDetails[swapData.order_id].status),
                  }"
                  >{{ exchangeDetails[swapData.order_id].status }}</span
                >
              </span>
              </q-item-label>
              <q-item-label
                >SEND {{ swapData.fromAmount }}
                {{ depositCoin.value.toUpperCase() }} TO THE DEPOSIT
                ADDRESS</q-item-label
              >
              <p class="q-pt-md">
                The exchange will start automatically when the deposit arrives
                to the address specified below
              </p>
              <q-input
                :dark="$store.state.settings.lightMode === 'true'"
                v-model="exchangeDetails[swapData.order_id].depositAddress"
                readonly
                rounded
                class="input-input pr80"
                outlined
                type="text"
              >
                <template v-slot:append>
                  <div class="flex justify-end">
                    <q-btn
                      filled
                      unelevated
                      @click="
                        copyToClipboard(
                          exchangeDetails[swapData.order_id].depositAddress,
                          'Exchange Address'
                        )
                      "
                      round
                      class="btn-copy"
                      icon="file_copy"
                    />
                  </div>
                </template>
              </q-input>
              <p class="q-pt-sm">
                Order ID:
                <span
                  @click="copyToClipboard(exchangeDetails[swapData.order_id].order_id, 'Order ID')"
                  class="cursor-pointer text-deep-purple-12"
                  >{{ exchangeDetails[swapData.order_id].order_id }}</span
                >
              </p>

              <q-input
                v-if="exchangeDetails[swapData.order_id].memo"
                :dark="$store.state.settings.lightMode === 'true'"
                v-model="exchangeDetails[swapData.order_id].memo"
                label="Mandatory memo"
                readonly
                rounded
                class="input-input pr80"
                outlined
                type="text"
              >
                <template v-slot:append>
                  <div class="flex justify-end">
                    <q-btn
                      filled
                      unelevated
                      @click="copyToClipboard(exchangeDetails[swapData.order_id].memo, 'Memo')"
                      round
                      class="btn-copy"
                      icon="file_copy"
                    />
                  </div>
                </template>
              </q-input>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
    <div class="q-pa-lg" v-if="transactions.length && step != 2">
      <div class="q-pb-md">Recent orders:</div>
      <div class="row full-width q-col-gutter-md">
        <div class="col-md-3" v-for="(tx, index) in transactions" :key="index">
          <q-card :dark="$store.state.settings.lightMode === 'true'" flat bordered class="shadow-1 ongoing-orders">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col text-bdoy1">
                  <q-btn
                    icon="close"
                    @click="removeLocalStorage(tx.order_id)"
                    class="absolute-top-right"
                    color="white"
                    flat
                  />
                  <p class="q-pt-sm">
                     ID:
                    <span
                      @click="copyToClipboard(tx.order_id, 'Order ID')"
                      class="cursor-pointer text-deep-purple-12"
                      >{{ tx.order_id }}</span
                    >
                  </p>

                  <span class="text-body2">
                    From: {{ parseFloat(tx.depositQuantity).toFixed(8) }} {{ tx.from }} <br>
                    To: {{ tx.destinationQuantity }}{{ tx.toEosToken ? tx.toEosToken.toUpperCase() : tx.to
                    }}<br />
                  </span>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <div class="text-subtitle2 q-pb-md q-pl-sm">
                <span class="text-bold text-body1">Status: </span>
                <span
                  class="text-capitalize"
                  :class="{
                    'text-deep-purple-12': validStatus(tx.status),
                    'text-grey': !validStatus(tx.status),
                    'text-green': tx.status == 'success',
                  }"
                  >{{ tx.status }} <q-icon  name="info">
        <q-tooltip
          transition-show="flip-right"

          transition-hide="flip-left"
        >
        <span
        class="text-body1"
        >
         {{ getStatusDesc(tx.status) }}
        </span>

        </q-tooltip>
      </q-icon></span
                >
              </div>

            </q-card-actions>
            <q-card-actions v-if="false">
              <q-btn flat v-if="validStatus(tx.status)">View details</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <div v-if="step == 2">
    <Exchange :miniMode="true" @setStep="setStep" />
    </div>
  </div>
</template>
<script>
import CrosschainDex from '@/util/CrosschainDex'
import Formatter from '@/mixins/Formatter'
import SendComponent from '@/pages/Verto/Send'
import Exchange from '../../../pages/Verto/Exchange.vue'
// import transactEOS from '../transactEOS'
let defaults = ['eos', 'eth', 'vtx']
const txStatus = {
  error:
    'Transaction has failed. In most cases, the amount was sent differs from specified one when creating the transaction.',
  overdue: 'Deposit receiving time for this transaction has expired.',
  refunded: "Exchange was failed and coins were refunded to user's wallet.",
  confirmed:
    'User’s payment is confirmed, the exchange process is about to start.',
  confirmation:
    'The transaction appears in mempool and now it is waiting for necessary network confirmations to start.',
  exchanging: 'The exchange process is running.',
  success:
    'The exchange is completed and currency is successfully sent to your address.',
  sending: 'Currency is being sent to the recipient address.',
  sending_confirmation:
    'Outgoing transaction is waiting for network confirmations.',
  wait: 'The exchange has just been created and it’s waiting for coins to reach the deposit wallet'
}
export default {
  components: {
    SendComponent,
    Exchange
    // transactEOS
  },
  data () {
    return {
      tab: 'deposit',
      showSendComponent: false,
      splitterModel: 20,
      currentDex: null,
      error: null,
      chains: [],
      step: 0,
      depositCoinOptions: [],
      spinner: {
        tx: false,
        amount: false
      },
      innerStep: {
        deposit: 1,
        destination: 1
      },
      intervals: [],
      hideDeposit: false,
      hideDestination: false,
      toAccountSelected: {},
      fromAccountSelected: {},
      dex: null,
      swapData: {
        fromAmount: 1,
        toDestinationAddresses: {},
        toAmount: 0,
        rate: 0,
        toChosenChain: null,
        fromChosenChain: null,
        toChains: [],
        fromChains: []
      },
      exchangeDetails: {
        depositAddress: ''
      },
      depositCoin: {
        label: 'BTC',
        value: 'btc',
        image:
          'https://api.godex.io/storage/coins/nlQJWbSb5SZ0CsXk0RTDFH2Tsg4bcRKuZLZwVyKr.png'
      },
      destinationCoin: {
        label: 'ETH',
        value: 'eth',
        image: 'https://zapper.fi/images/ETH-icon.png'
      },
      destinationCoinOptions: [],
      transactions: [],
      depositCoinUnfilter: [],
      destinationCoinUnfilter: []
    }
  },
  async created () {
    if ((!this.$store.state.settings.coins.godex || !this.$store.state.settings.coins.godex.length) && this.$store.state.settings.globalSettings.godexTokens) {
      this.$store.state.settings.coins.godex = this.$store.state.settings.globalSettings.godexTokens.map(el => {
        return {
          value: el.code.toLowerCase(),
          image: el.icon,
          label: el.name,
          minimum: el.min_amount
        }
      })
    }

    this.getOngoingTx()
    let coins = CrosschainDex.getAllCoins()
    this.chains = this.setChains()
    this.depositCoinOptions = coins

    this.destinationCoinOptions = coins
    this.destinationCoinUnfilter = coins
    this.depositCoinUnfilter = coins

    this.getSwapInfo()
  },
  watch: {
    'swapData.fromChosenChain': function (chain) {
      if (chain && chain.toLowerCase() === 'eos') {
        let token = this.$store.state.settings.coins.defibox.find(
          (o) =>
            o.value.toLowerCase() === this.depositCoin.value.toLowerCase()
        )
        if (token) { this.swapData.depositTokenContract = token.contract }
      }
    },
    'depositCoin': function () {
      if (this.depositCoin.value.toLowerCase() === this.destinationCoin.value.toLowerCase()) {
        this.destinationCoin = this.destinationCoinUnfilter.find(o => defaults.includes(o.value.toLowerCase()) && this.depositCoin.value.toLowerCase() !== o.value.toLowerCase())
        this.getSwapInfo()
      }
    }
  },
  computed: {
    chainData () {
      return this.chains.find(
        (o) => o.chain === this.swapData.fromChosenChain
      )
    }
  },
  methods: {
    setTab (tab) {
      this.tab = tab
    },
    setStep (step) {
      this.step = step
    },
    removeLocalStorage (order_id) {
      localStorage.removeItem('vexchange_crosschain_' + order_id)
      this.getOngoingTx()
    },
    validStatus (status) {
      return !['overdue', 'error', 'refunded'].includes(status)
    },
    showSteps () {
      this.chains = this.setChains()

      if (this.currentDex && this.currentDex.dex !== 'godex') {
        // this.step = 2
        this.getSwapInfo(2)
      } else {
        this.getSwapInfo(1)
      }
      // this.getSwapInfo(1)
    },
    resetSwapData () {
      this.step = 0
      this.exchangeDetails = {

      }
      this.fromAccountSelected = {

      }
      this.innerStep.deposit = 1
      let toReset = {
        toDestinationAddresses: {},
        txStatus: null,
        txStatusDescription: null,
        rate: 0,
        eosProxy: false,
        fromChosenChain: null,
        toTokenContract: false,
        toChosenChain: null,
        toChains: [],
        fromChains: []
      }
      for (let item in toReset) {
        this.swapData[item] = toReset[item]
      }
      if (this.step !== 1) {
        this.step = 0
      }
    },
    switchAmounts () {
      let depositCoinVar = this.depositCoin
      this.depositCoin = this.destinationCoin
      this.destinationCoin = depositCoinVar
      this.getSwapInfo()
    },
    changeInnerStep () {
      if (this.swapData.inChain) {
        this.getSwapInfo()
      } else {
        setTimeout(() => { this.innerStep.deposit = this.chainData ? 2 : this.innerStep.deposit }, 300)
      }
    },
    setSuccessData () {

    },
    getSwapInfo (setStep = false) {
      this.currentDex = null
      this.resetSwapData()
      this.spinner.amount = true
      let eosToken = this.$store.state.settings.coins.defibox.find(
        (o) =>
          o.value.toLowerCase() === this.destinationCoin.value.toLowerCase() &&
          !['btc', 'eth'].includes(o.value.toLowerCase()) && this.destinationCoin.value.toLowerCase() !== 'eos'
      )

      this.depositCoin.fromAmount = this.swapData.fromAmount
      this.dex = CrosschainDex.getDex(
        this.depositCoin.value.toLowerCase(),
        this.destinationCoin.value.toLowerCase()
      )

      if (
        this.depositCoin.value.toLowerCase() === 'eth' &&
        this.destinationCoin.value.toLowerCase() === 'vtx'
      ) {
        this.currentDex = {
          chain: false,
          dex: 'coinswitch'
        }
        this.setDefaultWallet('eth')
        this.setExchangeData(
          {
            amount: this.swapData.fromAmount / CrosschainDex.vtxEquiv.eth,
            toChains: ['eos'],
            fromChains: ['eth']
          },
          setStep
        )
      } else if ((!this.dex.length || (this.dex.length === 1 && this.dex.find(o => o.dex === 'godex'))) && eosToken) {
        this.swapData.toTokenContract = eosToken.contract
        let token = this.$store.state.settings.coins.godex.find(
          (o) => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()
        )
        if (token) {
          CrosschainDex.setDex('godex')
          this.swapData.eosProxy = true
          CrosschainDex.getPair(
            this.depositCoin.value,
            'eos',
            this.swapData.fromAmount
          )
            .then(async (data) => {
              this.spinner.amount = false
              this.checkChangeMinimum(data)
              if (data && data.pair && data.pair.amount) {
                CrosschainDex.setDex('defibox')
                let pairData = await CrosschainDex.getPair('eos', this.destinationCoin.value.toLowerCase(), data.pair.amount)

                if (!pairData || !pairData.pair) return
                this.swapData.eosProxy = true
                this.swapData.eosPairId = pairData.pair.pair_id
                this.setExchangeData(
                  {
                    toChains: ['eos'],
                    fromChains: data.pair.fromChains,
                    amount: pairData.pair.amount
                  },
                  setStep
                )
              }
            })
            .catch((e) => {
              this.spinner.amount = false
            })
        }
      } else if (this.dex.length === 2 && this.dex.find(o => o.dex === 'godex')) {
        this.currentDex = this.dex.find(o => o.dex !== 'godex')
        this.setDefaultWallet(this.currentDex.chain)
      } else if (this.dex.length >= 2) {
        if (this.swapData.fromChosenChain) {
          this.currentDex = this.currentDex = this.dex.find(o => o.chain === this.swapData.fromChosenChain)
        } else {
          this.tab = 'deposit'
          this.innerStep.deposit = 1
          this.setExchangeData(
            {
              toChains: [],
              fromChains: this.dex.map(o => o.chain).filter(o => o.chain),
              amount: 0,
              inChain: true
            },
            setStep
          )
        }
      } else if (this.dex.length) {
        this.currentDex = this.dex[0]
      }

      if (this.currentDex && this.currentDex.dex !== 'coinswitch') {
        CrosschainDex.setDex(this.currentDex.dex)
        this.spinner.amount = true
        CrosschainDex.getPair(
          this.depositCoin.value,
          this.destinationCoin.value,
          this.swapData.fromAmount
        )
          .then((data) => {
            this.spinner.amount = false
            this.checkChangeMinimum(data)
            if (data && data.pair) {
              data.pair.dex = this.currentDex.dex
              this.setExchangeData(data.pair, setStep)
            }
          })
          .catch((e) => {
            this.spinner.amount = false
          })
      }
      if (this.currentDex && this.currentDex.dex) {
        this.$store.commit('settings/setDex', {
          dex: this.currentDex.dex,
          destinationCoin: this.destinationCoin,
          depositCoin: this.depositCoin,
          fromAmount: parseFloat(this.swapData.fromAmount)
        })
      }
    },
    checkChangeMinimum (data) {
      if (data && data.pair && !data.pair.amount && data.pair.minimum) {
        this.swapData.fromAmount = parseFloat(data.pair.minimum)
        this.getSwapInfo()
      }
    },
    getDepositTxData () {
      let tx = {
        actions: [
          {
            account: this.swapData.depositTokenContract,
            name: 'transfer',
            authorization: [
              {
                actor: this.fromAccountSelected[this.swapData.fromChosenChain].name,
                permission: 'active'
              }
            ],
            data: {
              from: this.fromAccountSelected[this.swapData.fromChosenChain].name,
              to: this.exchangeDetails[this.swapData.order_id].depositAddress,
              memo: this.exchangeDetails[this.swapData.order_id].memo,
              quantity: this.exchangeDetails[this.swapData.order_id].depositQuantity.toFixed(4) + ' ' + this.exchangeDetails[this.swapData.order_id].from.toUpperCase()
            }
          }
        ],
        send: true
      }

      return tx
    },

    getSwapTxData () {
      let tx = {
        actions: [
          {
            account: this.swapData.toTokenContract,
            name: 'transfer',
            authorization: [
              {
                actor: this.to[this.swapData.fromChosenChain].name,
                permission: 'active'
              }
            ],
            data: {
              from: this.fromAccountSelected[this.swapData.fromChosenChain].name,
              to: this.swapData.toDestinationAddresses[this.swapData.toChosenChain],
              memo: 'swap,1,' + this.swapData.eosPairId,
              quantity: this.exchangeDetails[this.swapData.order_id].amount.toFixed(4) + ' ' + this.exchangeDetails[this.swapData.order_id].from.toUpperCase()
            }
          }
        ],
        send: true
      }
      return tx
    },
    setExchangeData (data, setStep) {
      this.swapData.toAmount = data.amount
      this.swapData.inChain = data.inChain
      this.spinner.amount = false

      if (!this.swapData.toAmount) {
        this.step = 0
      } else if (setStep) {
        this.step = setStep
      }

      this.swapData.toChains = data.toChains
      if (this.swapData.toChains.length === 1) {
        this.swapData.toChosenChain = this.swapData.toChains[0]
      }
      this.swapData.fromChains = data.fromChains

      if (this.swapData.fromChains.length === 1) {
        this.swapData.fromChosenChain = this.swapData.fromChains[0]
        if (this.chainData && this.chainData.accounts && this.chainData.accounts.length) { this.innerStep.deposit = 2 }
      }
      if (
        this.swapData.fromChains.find((a) =>
          this.chains.find(o => o.chain === a.toLowerCase())
        )
      ) {
        this.tab = 'deposit'
      } else {
        this.swapData.fromExternalWallet = true
        this.tab = 'destination'
      }
    },
    getRefundAddress () {
      return this.swapData.fromChosenChain ? (this.swapData.fromChosenChain === 'eos' ? this.fromAccountSelected[this.swapData.fromChosenChain]?.name : this.fromAccountSelected[this.swapData.fromChosenChain]?.key) : null
    },
    createTransaction () {
      this.error = false
      this.spinner.tx = true
      let to = this.destinationCoin.value

      if (this.swapData.eosProxy) {
        to = 'eos'
      }
      CrosschainDex.createTransaction(
        this.depositCoin.value,
        to,
        this.swapData.fromAmount,
        this.swapData.toDestinationAddresses[this.swapData.toChosenChain],
        this.swapData.fromChosenChain,
        this.swapData.toChosenChain,
        this.getRefundAddress()
      )
        .then((data) => {
          this.spinner.tx = false

          if (data.tx) {
            this.exchangeDetails[data.tx.order_id] = data.tx
            this.swapData.order_id = data.tx.order_id
            if (this.$store.state.settings.chainsSendEnabled.includes(
              this.swapData.fromChosenChain

            )) {
              this.$store.commit('currentwallet/updateParams', {
                chainID: this.swapData.fromChosenChain.toLowerCase(),
                tokenID: this.depositCoin.value.toLowerCase(),
                accountName: this.fromAccountSelected[this.swapData.fromChosenChain].name.toLowerCase(),
                to: data.tx.depositAddress,
                memo: data.tx.memo,
                disableMemoEdit: true,
                amount: data.tx.depositQuantity
              })

              this.$store.state.investment.defaultAccount = this.fromAccountSelected[this.swapData.fromChosenChain]
              this.showSendComponent = true
              this.tab = 'tosend'
            } else if (this.swapData.fromChosenChain && this.swapData.fromChosenChain === 'xxx') {
              this.showSendComponent = true
              data.tx.txObj = this.getDepositTxData()
              this.$store.state.investment.defaultAccount = this.fromAccountSelected[this.swapData.fromChosenChain]

              data.tx.toEosToken = true
              data.tx.eosProxy = this.swapData.eosProxy
              data.tx.toEosToken = this.destinationCoin.value.toLowerCase()
              data.tx.depositCoin = this.depositCoin
              data.tx.destinationCoin = this.destinationCoin

              this.showSendComponent = true
              this.tab = 'tosend'

              // this.$refs.transact.setTxData(data.tx.txObj)
            } else {
              this.tab = 'waiting'
            }

            data.tx.created = new Date().getTime()
            data.tx.dex = CrosschainDex.currentExchange

            this.exchangeDetails[data.tx.order_id].status = data.tx.status
            this.exchangeDetails[data.tx.order_id].description = txStatus[data.tx.status]

            localStorage.setItem(
              'vexchange_crosschain_' + data.tx.order_id,
              JSON.stringify(data.tx)
            )
            this.intervals.push({
              order_id: data.tx.order_id,
              interval: setInterval(() => {
                this.getTxStatus(
                  data.tx.order_id,
                  CrosschainDex.currentExchange
                )
              }, 5000)
            })
          }
        })
        .catch((e) => {
          this.error = e.error
          this.spinner.tx = false
        })
    },
    setMinimum () {
      let from = this.$store.state.settings.coins.godex.find(
        (o) => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()
      )
      if (from && from.minimum) {
        this.depositCoin.minimum = parseFloat(from.minimum)
        this.swapData.minimum = parseFloat(from.minimum)
      }
    },
    getTxStatus (order_id, dex) {
      CrosschainDex.getTxStatus(order_id, dex).then((data) => {
        if (data.status) {
          let errors = ['overdue', 'error', 'refunded']
          if (errors.includes(data.status) || data.status === 'success') {
            let intvObj = this.intervals.find((o) => o.order_id === order_id)
            if (intvObj) {
              clearInterval(intvObj.interval)
            }
          }

          let oldTx = JSON.parse(
            localStorage.getItem('vexchange_crosschain_' + order_id)
          )

          if (data.depositQuantity) {
            oldTx.depositQuantity = data.depositQuantity
            oldTx.destinationQuantity = data.destinationQuantity
          }

          if (oldTx) {
            oldTx.status = data.status
            if (data.status === 'success' && oldTx.eosProxy && !oldTx.proxyTxSent) {
              data.proxyTxSent = true
              this.$refs.transact.setTxData(data.txObj)
            }

            localStorage.setItem(
              'vexchange_crosschain_' + order_id,
              JSON.stringify(oldTx)
            )
          }
          this.exchangeDetails[order_id] = oldTx

          let index = this.transactions.findIndex(
            (o) => o.order_id === order_id
          )

          if (index) {
            this.transactions[index] = oldTx
          }

          this.exchangeDetails[order_id].status = data.status
          this.exchangeDetails[order_id].description = txStatus[data.status]
        }
      })
    },
    getOngoingTx () {
      let keys = Object.keys(localStorage),
        i = keys.length
      this.transactions = []
      let finalStatus = ['overdue', 'error', 'refunded', 'success']
      while (i--) {
        if (keys[i].includes('vexchange_crosschain_')) {
          let tx = JSON.parse(localStorage.getItem(keys[i]))
          if (!finalStatus.includes(tx.status)) {
            let interval = setInterval(() => {
              this.getTxStatus(tx.order_id, tx.dex)
            }, 5000)
            this.intervals.push({
              order_id: tx.order_id,
              interval: interval
            })
          }
          this.transactions.push(tx)
        }
      }
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(
          (v) =>
            v.value.toLowerCase().indexOf(needle) > -1 ||
            v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    getStatusDesc (status) {
      return txStatus[status]
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(
          (v) =>
            v.value.toLowerCase().indexOf(needle) > -1 ||
            v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  },
  destroyed () {
    this.intervals.forEach((o) => {
      clearInterval(o.interval)
    })
  },
  mixins: [Formatter]
}
</script>
<style scoped>
/deep/ .q-tab-panel {
    max-width: 500px;
}
.ongoing-orders {
  border: 1px solid #626262;
}
.mask-section {
  visibility: hidden;
}
.qbtn-start {
  text-transform: initial !important;
  background: transparent !important;
  border: 1px solid rgba(#ccc, 0.7);
  font-size: 12px !important;
  border-radius: 40px;
  font-weight: $bold;
  min-height: 20px;
  margin-bottom: 0px;
  min-width: fit-content;
}
.dark-theme /deep/ .q-radio__inner {
  color: white !important;
}
.gdx-input-error {
  position: absolute;
  font-size: 12px;
  right: 15px;
  top: 5px;

  transition: 0.5s;
}
.dark-theme /deep/ .q-tab--active {
  background: #062229;
}
.light-mode /deep/ .q-tab--active{
  background: #d7dddf
}
.light-mode .gdx-input .gdx-input-label {
color: black !important;
}
a,
div,
img,
label,
span,
ul {
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
ul {
  list-style: none;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
a,
a:visited {
  color: #000;
}
.inactive-btn {
  background-color: #888995 !important;
  cursor: no-drop;
}
button {
  box-shadow: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
}
input {
  border: none;
  outline: none;
  padding: 0;
}
.icon-BTC .path1:before {
  content: "";
  color: #101012;
}
.icon-BTC .path2:before {
  content: "";
  margin-left: -1em;
  color: #0d7dfd;
}
.icon-BTC .path3:before {
  content: "";
  margin-left: -1em;
  color: #0d7dfd;
}
.icon-BTC .path4:before {
  content: "";
  margin-left: -1em;
  color: #0d7dfd;
}
.icon-ETH .path1:before {
  content: "";
  color: #101012;
}
.icon-ETH .path2:before {
  content: "";
  margin-left: -1em;
  color: #0d7dfd;
}
.no-border:focus {
  border-color: transparent !important;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #262529;
}
::-webkit-scrollbar-thumb {
  background: #0d7dfd;
  border-radius: 5px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.v-select {
  position: relative;
  cursor: pointer;
}
.v-select .vs__dropdown-toggle,
.v-select .vs__dropdown-toggle .vs__selected-options {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.v-select .vs__dropdown-toggle .vs__selected-options .vs__search {
  width: 0;
  height: 100%;
  background-color: transparent;
}
.v-select .vs__dropdown-toggle .vs__actions .vs__clear {
  display: none;
}
.v-select .vs__dropdown-toggle .vs__actions .vs__open-indicator {
  transition: 0.5s;
  fill: #fff;
}
.v-select.vs--searchable
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  width: 100%;
}
.gdx-link.theme-2 {
  background: #4f5ce2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  transition: 0.5s;
  color: #fff;
}
.gdx-link.theme-2:hover {
  background: #4f5ce2;
  color: #fff !important;
}
.gdx-select .vs__dropdown-toggle {
  border-radius: 5px;
  background-color: #262529;
  border: 1px solid rgba(233, 236, 241, 0.1);
  padding: 0 12px 0 16px;
}
.gdx-select .vs__dropdown-toggle .vs__selected-options {
  margin-right: 8px;
}
.gdx-select .vs__dropdown-toggle .vs__selected-options .vs__search {
  font-size: 22px;
  color: #fff;
}
.gdx-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search::-moz-placeholder {
  color: #f7f8f8;
  font-size: 16px;
}
.gdx-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search:-ms-input-placeholder {
  color: #f7f8f8;
  font-size: 16px;
}
.gdx-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search::placeholder {
  color: #f7f8f8;
  font-size: 16px;
}
.home .gdx-exchange-form {
  margin-top: 60px;
}
.gdx-exchange-form {
  display: flex;
  flex-wrap: wrap;
}
.light-mode .gdx-input .gdx-input-field {
      color: #000 !important;
    border: 2px solid transparent !important;
    background-color: #fcfcfc !important;
        border: 2px solid #dbdbdb !important;
    }
   .light-mode .gdx-select .vs__dropdown-toggle {

    background-color: #d7dddf !important;
    }
.gdx-exchange-form .coins {
  flex: 1;
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.gdx-exchange-form .coins .gdx-exchange-coin {
  width: 50%;
}
@media (max-width: 55.5em) {
  .gdx-exchange-form .coins .gdx-exchange-coin {
    width: 100%;
  }
  .gdx-exchange-form .coins .gdx-exchange-coin:first-child {
    margin-bottom: 5px;
  }
}
.gdx-exchange-form .coins .gdx-replace-button {
  position: absolute;
  left: calc(50% - 16px);
  top: 15px;
}
@media (max-width: 55.5em) {
  .gdx-exchange-form .coins .gdx-replace-button {
    top: calc(50% - 16px);
    left: calc(65% - 16px);
  }
}
.gdx-exchange-form .gdx-link {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
}
@media (max-width: 55.5em) {
  .gdx-exchange-form .gdx-link {
    width: 100%;
    margin-left: 0;
    margin-top: 15px;
    height: 56px;
  }
}
.gdx-exchange-coin {
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  flex-direction: row-reverse;
}
.gdx-exchange-coin .gdx-exchange-coin-input {
  flex: 1;
}
.gdx-exchange-coin .gdx-exchange-coin-input .gdx-input-field {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-left: 25px;
  font-family: "Roboto Mono";
}
.gdx-exchange-coin .gdx-exchange-coin-input .gdx-input-field::-moz-placeholder {
  color: #fff;
}
.gdx-exchange-coin
  .gdx-exchange-coin-input
  .gdx-input-field:-ms-input-placeholder {
  color: #fff;
}
.gdx-exchange-coin .gdx-exchange-coin-input .gdx-input-field::placeholder {
  color: #fff;
}
.gdx-exchange-coin
  .gdx-exchange-coin-input
  .gdx-input-field:-ms-input-placeholder
  ~ .gdx-input-label {
  transform: scale(0.7) translateY(-8px) translateX(20px);
}
.gdx-exchange-coin .gdx-exchange-coin-select {
  transition: 0.5s;
  width: 35%;
}
.gdx-exchange-coin .gdx-exchange-coin-select .vs__dropdown-toggle {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-color: transparent;
  padding-right: 25px;
}
.gdx-coin {
  display: flex;
  align-items: center;
}
.gdx-coin .gdx-coin-code,
.gdx-coin .gdx-coin-name {
  margin-left: 10px;
}
.gdx-coin .gdx-coin-name.gdx-coin-name {
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}
.gdx-coin:not(.theme-1) .gdx-coin-name {
  display: none;
}
.gdx-coin-icon {
  font-family: "icomoon" !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-feature-settings: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  font-size: 24px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.gdx-coin-icon,
.gdx-coin-icon:hover {
  text-decoration: none !important;
}
.gdx-input {
  position: relative;
}
.gdx-input .gdx-input-label {
  position: absolute;
  height: 100%;
  left: 10px;
  top: 0;
  line-height: 50px;
  color: hsla(0, 0%, 100%, 0.5);
  transform-origin: top left;
  transition: 0.5s;
}
.gdx-input .gdx-input-field {
  border-radius: 5px;
  color: #fff;
  padding: 22px 8px 10px;
  border: 2px solid transparent;
  background-color: #2a2b2f;
  width: 100%;
  font-size: 22px;
  transition: 0.5s;
}
.gdx-input .gdx-input-field::-moz-placeholder {
  color: transparent;
}
.gdx-input .gdx-input-field:-ms-input-placeholder {
  color: transparent;
}
.gdx-input .gdx-input-field::placeholder {
  color: transparent;
}
.gdx-input .gdx-input-field:not(:-moz-placeholder-shown) ~ .gdx-input-label {
  transform: scale(0.7) translateY(-8px) translateX(20px);
}
.gdx-input .gdx-input-field:focus ~ .gdx-input-label,
.gdx-input .gdx-input-field:not(:placeholder-shown) ~ .gdx-input-label {
  transform: scale(0.7) translateY(-8px) translateX(20px);
}
.gdx-input:not(.error) .gdx-input-field:focus {
  border-color: #0d7dfd;
}
.gdx-replace-button {
  z-index: 0;
  width: 32px;
  height: 32px;
  background-color: #262529;
  border: 2px solid #0d7dfd;
}
.gdx-replace-button .box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
}

</style>
