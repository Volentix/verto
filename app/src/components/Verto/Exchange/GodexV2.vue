<template>
  <div
    :class="{
      'dark-theme text-white ': $store.state.settings.lightMode === 'true',
      'light-mode bg-white': $store.state.settings.lightMode === 'false',
    }"
    class="full-width"
  >
    <!-- <q-header class="bg-white">
      <q-toolbar  class="text-black" v-if="$q.platform.is.mobile">
          <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" to="/verto/dashboard"/>
          <q-toolbar-title> Exchange  </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <div v-if="!$q.platform.is.mobile">
      <UI v-if="false"/>
      <q-btn label="test" v-if="false" @click="testData()" />
      <div class="gdx-exchange-form q-px-md" v-show="step != 2">
        <div class="text-h6 full-width q-py-md">Exchange any to any</div>
        <div class="coins">
          <div class="gdx-exchange-coin" id="tx-tab">
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
                        class="select-input gdx-coin_wrapper"
                        popup-content-class="gdx_coin_wrapper_popup"
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
                                v-html="scope.opt.value.toUpperCase()"
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
                v-if="
                  depositCoin &&
                  depositCoin.minimum &&
                  currentDex &&
                  currentDex.dex == 'godex'
                "
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
                          popup-content-class="gdx_coin_wrapper_popup"
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
                                  v-html="scope.opt.value.toUpperCase()"
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
                  <q-spinner-dots v-if="spinner.amount" size="2em" />
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
            <div class="box">
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
            swapData.toAmount && !spinner.amount && !spinner.tx
              ? setPathTransaction(
                  paths.find(
                    (o) => o.fromToken === depositCoin.value.toLowerCase()
                  )
                )
              : ''
          "
          class="gdx-link theme-2"
          >Exchange</a
        >
        <p @click="getDepositTxData()" v-if="false">Test</p>

        <q-splitter
          v-model="splitterModel"
          class="full-width"
          :class="[swapData.dex + '-dex', 'full-width']"
          v-if="step == 1"
        >
          <template v-slot:before>
            <q-tabs dark v-model="tab" align="left" vertical class="q-tab-wrapper text-teal" v-if="swapData.dex !== 'renbridge'">
              <q-tab
                name="deposit"
                label="Deposit"
                class="flex_start"
                no-caps
                align="left"
                v-if="swapData.fromChains.length != 1"
              />
              <q-tab no-caps class="flex_start" name="destination" label="Destination" />
              <q-tab no-caps class="flex_start" name="tosend" label="Sending" />

              <q-tab no-caps
                name="waiting"
                class="waiting_tab flex_start"
                :icon=" tab == 'waiting' ? 'img:https://i.stack.imgur.com/qq8AE.gif' : ''"
                label="Waiting"
              />
              <q-tab no-caps
                :class="{'text-black': $store.state.settings.lightMode === 'false'}"
                name="reset"
                class="flex_start"
                dark
                @click="step = 0"
                label="Reset"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-btn
              icon="close"
              dense
              rounded
              class="absolute-top-right q-mt-sm q-mr-sm z_index"
              @click="switchAmounts()"
              flat
            />
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
                  v-if="path.length > 1 && innerStep.deposit == 1"
                  header
                  >Choose the network you are sending
                  {{ depositCoin.value.toUpperCase() }} from</q-item-label
                >

                <q-list separator>
                  <q-item
                    v-show="
                      swapData.fromChains.length > 1 && innerStep.deposit == 1
                    "
                    v-for="(path, index) in paths"
                    :key="index"
                    :dark="$store.state.settings.lightMode === 'true'"
                    tag="label"
                    v-ripple
                    @click="setPathData(path)"
                  >
                    <q-item-section
                      v-if="swapData.fromChains.length != 1"
                      side
                      top
                    >
                      <q-radio
                        v-model="swapData.fromChosenChain"
                        :val="path.fromChain"
                        label=""
                      />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label
                        >Send from {{ path.fromChain.toUpperCase() }}
                        {{
                          path.fromChain == path.toChain
                            ? ""
                            : " to " + path.toChain
                        }}
                        network</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-btn
                    v-if="
                      innerStep.deposit == 2 && swapData.fromChains.length > 1
                    "
                    icon="arrow_back"
                    label="Back"
                    class="q-mb-md"
                    flat
                    @click="innerStep.deposit = 1"
                  />
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
                      @input="
                        approvalCheckRun(
                          depositCoin.value,
                          destinationCoin.value,
                          swapData.fromAmount
                        )
                      "
                      outlined
                      style="max-width: 300px"
                      class="select-input accountDropdown q-my-md"
                      v-model="fromAccountSelected[swapData.fromChosenChain]"
                      :options="chainData.accounts"
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
                          <q-item-section
                            :dark="$store.state.settings.lightMode === 'true'"
                          >
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
                            <q-item-label
                              caption
                              class="ellipsis mw200"
                              :class="{
                                'text-white':
                                  $store.state.settings.lightMode === 'true',
                              }"
                              >{{
                                getKeyFormat(
                                  fromAccountSelected[swapData.fromChosenChain]
                                    .key
                                )
                              }}</q-item-label
                            >
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <span
                      class="text-green"
                      v-if="
                        swapData.mint &&
                        swapData.mint.status == 'Success' &&
                        !(
                          swapData.transferObject &&
                          swapData.transferObject.status == 'Success'
                        )
                      "
                      >Minting successful. You have received renBTC. Now you can
                      process the swap<br
                    /></span>

                    <GasSelector
                      ref="gas_global"
                      :key="'gas_global'"
                      v-if="
                        swapData.dex != 'oneinch' &&
                        swapData.approvalCheck &&
                        swapData.approval &&
                        !swapData.approval.required
                      "
                      @setGas="setSelectedGas"
                      :currentAccount="
                        fromAccountSelected[swapData.fromChosenChain]
                          ? fromAccountSelected[swapData.fromChosenChain]
                          : $store.state.wallets.tokens.find(
                              (o) => o.chain === swapData.fromChosenChain
                            )
                      "
                      :txData="{ amount: swapData.fromAmount }"
                      :type="depositCoin.value"
                    />
                    <GasSelector
                      ref="gas_approval"
                      :key="'gas_approval'"
                      :txObject="swapData.approval.transactionObject"
                      v-else-if="
                        swapData.dex == 'oneinch' &&
                        swapData.approvalCheck &&
                        swapData.approval &&
                        swapData.approval.required &&
                        swapData.approval.status != 'Success'
                      "
                      @setGas="setSelectedGas"
                      :currentAccount="
                        fromAccountSelected[swapData.fromChosenChain]
                      "
                      :txData="{
                        amount: swapData.fromAmount,
                        title: 'Approval',
                        method: 'txObject',
                      }"
                      :type="depositCoin.value"
                    />
                    <GasSelector
                      ref="gas_transfert"
                      :key="'gas_transfert'"
                      :txObject="swapData.transferObject"
                      v-else-if="
                        (swapData.dex == 'oneinch' &&
                          swapData.approvalCheck &&
                          swapData.transferObject) ||
                        (swapData.approval &&
                          swapData.approval.required &&
                          swapData.approval.status == 'Success')
                      "
                      @setGas="setSelectedGas"
                      :currentAccount="
                        fromAccountSelected[swapData.fromChosenChain]
                      "
                      :txData="{
                        amount: swapData.fromAmount,
                        title: 'Swap',
                        method: 'txObject',
                      }"
                      :type="depositCoin.value"
                    />

                    <span
                      v-if="
                        swapData.dex == 'oneinch' &&
                        swapData.mint &&
                        swapData.mint.status
                      "
                    >
                      <span
                        class="text-deep-purple-12"
                        v-if="
                          swapData.approval &&
                          swapData.approval.required &&
                          swapData.approval.status != 'Success'
                        "
                        >Proceed first with the approval transaction</span
                      >
                      <span
                        class="text-green"
                        v-else-if="
                          swapData.approval &&
                          swapData.approval.required &&
                          swapData.approval.status == 'Success'
                        "
                        >Approval successful. Click confirm to swap<br
                      /></span>
                      <span
                        class="text-grey cursor-pointer"
                        v-if="swapData.approval && swapData.approval.hash"
                        ><span class="text-deep-pruple-12">Approval</span> Tx
                        Hash: {{ getKeyFormat(swapData.approval.hash) }}<br
                      /></span>
                      <span
                        class="text-grey cursor-pointer"
                        v-if="
                          swapData.transferObject && swapData.transferObject.hash
                        "
                      >
                        <span class="text-deep-pruple-12">Tx Hash:</span>
                        {{ getKeyFormat(swapData.transferObject.hash) }}</span
                      >
                    </span>
                    <p
                      v-if="
                        swapData.dex == 'godex' &&
                        fromAccountSelected[swapData.fromChosenChain]
                      "
                      class="text-body2 q-my-sm"
                    >
                      We set this address as the return address in case the
                      transaction <br />needs to be refunded.
                    </p>
                  </div>
                  <div v-else-if="chainData">
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
                  <p v-if="swapData.error" class="text-red">
                    {{ swapData.error }}
                  </p>
                  <q-btn
                    outline
                    :loading="spinner.tx"
                    rounded
                    @click="processApproval()"
                    v-if="
                      swapData.approval &&
                      swapData.approval.required &&
                      swapData.approval.transactionObject &&
                      swapData.approval.status != 'Success'
                    "
                    label="Approve"
                  />
                  <q-btn
                    outline
                    :loading="spinner.tx"
                    rounded
                    @click="swapTokens()"
                    v-else-if="
                      swapData.approvalCheck &&
                    swapData.approval && (swapData.approval.status == 'Success' ||
                        !swapData.approval.required) &&
                      swapData.transferObject &&
                      swapData.transferObject.status != 'Success'
                    "
                    label="Swap"
                  />
                  <q-list
                    bordered
                    separator
                    v-if="swapData.dex == 'oneinch'"
                    class="q-mt-md"
                  >
                    <q-item
                      clickable
                      v-ripple
                      active-class="text-orange"
                      v-if="swapData.approval && swapData.approval.required"
                    >
                      <q-item-section avatar>
                        <q-spinner-dots
                          size="2em"
                          v-if="swapData.approval.status == 'Submitted'"
                        />
                        <q-icon name="lock" v-else />
                      </q-item-section>

                      <q-item-section
                        ><q-item-label>Approval transaction</q-item-label>
                        <q-item-label caption
                          >Status:
                          <span
                            :class="{
                              'text-green':
                                swapData.approval &&
                                swapData.approval.status == 'Success',
                            }"
                            >{{
                              swapData.approval.status
                                ? swapData.approval.status
                                : "To be sent"
                            }}</span
                          ></q-item-label
                        >
                        <q-item-label v-if="swapData.approval &&
                                swapData.approval.hash">{{getKeyFormat(swapData.approval.hash)}}</q-item-label>
                      </q-item-section>
                      <q-item-section side></q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      v-if="swapData.transferObject"
                      active-class="bg-teal-1 text-grey-8"
                    >
                      <q-item-section avatar>
                        <q-spinner-dots
                          size="2em"
                          v-if="swapData.transferObject.status == 'Submitted'"
                        />
                        <q-icon name="swap_horiz" v-else />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Swap</q-item-label>
                        <q-item-label caption
                          >Status:
                          <span
                            :class="{
                              'text-green':
                                swapData.transferObject &&
                                swapData.transferObject.status == 'Success',
                            }"
                            >{{
                              swapData.approval &&
                              swapData.approval.required &&
                              swapData.approval.status != "Success"
                                ? "Approval pending"
                                : swapData.transferObject.status
                            }}</span
                          ></q-item-label
                        >
                          <q-item-label v-if="swapData.transferObject &&
                                swapData.transferObject.hash">{{getKeyFormat(swapData.transferObject.hash)}}</q-item-label>
                      </q-item-section>

                      <q-item-section side></q-item-section>
                    </q-item>
                  </q-list>
                  <q-btn
                    :loading="spinner.tx"
                    v-if="
                      swapData.dex != 'oneinch' &&
                      ((swapData.fromChosenChain &&
                        (!chainData ||
                          !$store.state.settings.chainsSendEnabled.includes(
                            swapData.fromChosenChain.toLowerCase()
                          ) ||
                          !chainData.accounts ||
                          !chainData.accounts.length)) ||
                        fromAccountSelected[swapData.fromChosenChain])
                    "
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
                        ><b>To network:</b>
                        {{ swapData.toChosenChain.toUpperCase() }}
                      </q-item-label>
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
                              swapData.toDestinationAddresses[chain] =
                                toAccountSelected[chain]
                                  ? chain == 'eos'
                                    ? toAccountSelected[chain].name
                                    : toAccountSelected[chain].key
                                  : {}
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
                                <q-item-section
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                >
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
                                  <q-item-label
                                    caption
                                    class="ellipsis mw200"
                                    :class="{
                                      'text-white':
                                        $store.state.settings.lightMode ===
                                        'true',
                                    }"
                                    >{{
                                      getKeyFormat(toAccountSelected[chain].key)
                                    }}</q-item-label
                                  >
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>

                          <GasSelector
                            v-if="
                              swapData.dex == 'renbridge' && !swapData.order_id
                            "
                            @setGas="setSelectedGas"
                            :currentAccount="
                              $store.state.wallets.tokens.find(
                                (o) => o.chain === swapData.toChosenChain
                              )
                            "
                            :txData="{
                              amount: swapData.toAmount,
                              method: 'mint',
                              info:
                                'Fees to be paid for minting your ' +
                                destinationCoin.value.toUpperCase() +
                                ' on the ' +
                                swapData.toChosenChain.toUpperCase() +
                                ' network',
                            }"
                          />
                          <p v-if="swapData.error" class="text-red">
                            {{ swapData.error }}
                          </p>
                          <p v-if="swapData.status">
                            Transaction status:
                            <span class="text-deep-purple">{{
                              swapData.status
                            }}</span>
                          </p>
                          <p
                            v-if="
                              swapData.dex == 'renbridge' &&
                              swapData.fromChosenChain == 'btc'
                            "
                          >
                            Each transaction to this deposit address takes about
                            about 60 minutes to complete. For security reasons,
                            you will need to wait for 6 block confirmations
                          </p>
                          <div
                            v-if="swapData.dex == 'renbridge' && swapData.status"
                          >
                            <span
                              class="text-grey cursor-pointer"
                              v-if="swapData.hash"
                              >Tx Hash: {{ getKeyFormat(swapData.hash) }}</span
                            ><br />

                            <p
                              v-if="
                                exchangeDetails[swapData.order_id] &&
                                exchangeDetails[swapData.order_id].bridgeStatus
                              "
                            >
                              {{
                                exchangeDetails[swapData.order_id].bridgeStatus
                                  .msg
                              }}
                            </p>
                            <q-linear-progress
                              v-if="!swapData.error"
                              indeterminate
                              color="grey"
                              class="q-mt-sm"
                            />
                          </div>
                          <span
                            v-if="
                              swapData.dex == 'renbridge' && swapData.mint.status
                            "
                          >
                            <span
                              class="text-deep-purple-12"
                              v-if="
                                swapData.mint &&
                                swapData.mint.status == 'Submitted'
                              "
                            >
                              <q-spinner-dots v-if="spinner.amount" size="2em" />
                              Minting process started. Please wait... </span
                            ><br />
                            <span
                              class="text-green"
                              v-if="
                                swapData.mint &&
                                swapData.mint.status == 'Submitted'
                              "
                              >Approval successful. Click confirm to swap</span
                            ><br />
                            <span
                              class="text-green"
                              v-if="
                                swapData.mint && swapData.mint.status == 'Success'
                              "
                              >Minting successful. You have received renBTC. Now
                              you can process the swap</span
                            ><br />
                            <span
                              class="text-grey cursor-pointer"
                              v-if="swapData.mint && swapData.mint.hash"
                              >Tx Hash:
                              {{ getKeyFormat(swapData.mint.hash) }}</span
                            ><br />
                          </span>

                          <SendComponent
                            :isExchange="true"
                            :miniMode="true"
                            @setTransactionStatus="setTransactionStatus"
                            @setTab="setTab"
                            :key="
                              $store.state.investment.defaultAccount.key +
                              $store.state.investment.defaultAccount.name
                            "
                            v-if="
                              exchangeDetails &&
                              exchangeDetails[swapData.order_id] &&
                              exchangeDetails[swapData.order_id].status ==
                                'wait' &&
                              showSendComponent &&
                              $store.state.investment.defaultAccount &&
                              $store.state.investment.defaultAccount.key
                            "
                          />

                          <span
                            v-if="swapData.bridge && swapData.bridge == 'eos'"
                            class="text-red"
                          >
                            This is a multi path transaction. ({{
                              depositCoin.value.toUpperCase()
                            }}
                            -> {{ swapData.bridge.toUpperCase() }} ->
                            {{ destinationCoin.value.toUpperCase() }}). You might
                            need to convert manually the received
                            {{ swapData.bridge.toUpperCase() }}
                            if you leave this screen.
                          </span>
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
                        <span v-if="error" class="text-red">{{ error }}</span>
                        <q-btn
                          v-if="
                            !(swapData.dex == 'renbridge' && swapData.order_id)
                          "
                          :loading="spinner.tx"
                          :disable="
                            !swapData.toDestinationAddresses[chain] &&
                            (!toAccountSelected[chain] ||
                              !toAccountSelected[chain].key)
                          "
                          label="Confirm"
                          outline
                          @click="
                            swapData.toDestinationAddresses[chain] =
                              chain == 'eos'
                                ? toAccountSelected[chain].name
                                : toAccountSelected[chain].key;
                            createTransaction();
                          "
                          rounded
                          class="q-mt-sm"
                        />
                        <div
                          class="q-pt-md"
                          v-if="
                            swapData.dex == 'renbridge' &&
                            swapData.fromChosenChain == 'btc' &&
                            !exchangeDetails[swapData.order_id]
                          "
                        >
                          If you cannot complete this transaction within the
                          required time, please return at a later date.<br /><br />

                          If you do not finish your transactions within this
                          period/session/time frame, you risk losing the deposits
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <q-tab-panel
                name="tosend"
                style="max-width: 500px"
                v-if="exchangeDetails[swapData.order_id]"
              >
                <q-item-label header>
                  <span class="text-subtitle2">
                    <span class="text-bold text-body1">Status: </span>
                    <span
                      class="text-capitalize"
                      :class="{
                        'text-deep-purple-12': validStatus(
                          exchangeDetails[swapData.order_id].status
                        ),
                        'text-grey': !validStatus(
                          exchangeDetails[swapData.order_id].status
                        ),
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

                />
              </q-tab-panel>
              <q-tab-panel
                name="waiting"
                style="max-width: 500px"
                v-if="exchangeDetails[swapData.order_id]"
              >
                <q-item-label header>
                  <span class="text-subtitle2">
                    <span class="text-bold text-body1">Status: </span>
                    <span
                      class="text-capitalize"
                      :class="{
                        'text-deep-purple-12': validStatus(
                          exchangeDetails[swapData.order_id].status
                        ),
                        'text-grey': !validStatus(
                          exchangeDetails[swapData.order_id].status
                        ),
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
                    @click="
                      copyToClipboard(
                        exchangeDetails[swapData.order_id].order_id,
                        'Order ID'
                      )
                    "
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
                        @click="
                          copyToClipboard(
                            exchangeDetails[swapData.order_id].memo,
                            'Memo'
                          )
                        "
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
            <q-card
              :dark="$store.state.settings.lightMode === 'true'"
              flat
              bordered
              class="shadow-1 ongoing-orders"
            >
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col text-bdoy1">
                    <q-btn
                      icon="close"
                      dense
                      rounded
                      @click="removeLocalStorage(tx.order_id)"
                      class="absolute-top-right q-mt-sm q-mr-sm"
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
                      From: {{ parseFloat(tx.depositQuantity).toFixed(8) }}
                      {{ tx.from.toUpperCase() }} <br />
                      To:
                      {{
                        tx.mintObject
                          ? tx.mintObject.toAmount + " " + tx.mintObject.toToken
                          : tx.destinationQuantity +
                            " " +
                            (tx.toEosToken ? tx.toEosToken.toUpperCase() : tx.to)
                      }}<br />
                    </span>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions v-if="!tx.mintObject">
                <div class="text-subtitle2 q-pb-md q-pl-sm">
                  <span class="text-bold text-body1">Status: </span>
                  <span
                    class="text-capitalize"
                    :class="{
                      'text-deep-purple-12': validStatus(tx.status),
                      'text-grey': !validStatus(tx.status),
                      'text-green': tx.status == 'success',
                    }"
                    >{{ tx.status }}
                    <q-icon name="info">
                      <q-tooltip>
                        <span class="text-body1 info-tooltip">
                          {{ getStatusDesc(tx.status) }}
                        </span>
                      </q-tooltip>
                    </q-icon></span
                  >
                </div>
              </q-card-actions>
              <q-card-actions v-else>
                <div class="text-subtitle2 q-pb-md q-pl-sm">
                  <span class="text-bold text-body1">Action: </span>
                  <span
                    class="text-capitalize"
                    :class="{
                      'text-deep-purple-12': validStatus(tx.status),
                      'text-grey': !validStatus(tx.status),
                      'text-green': tx.status == 'success',
                    }"
                  >
                    <q-btn
                      :loading="spinner.tx"
                      flat
                      label="Resume"
                      @click="resumeMinting(tx)"
                  /></span>
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
      <!-- TABLE SECTION  -->
      <table
        v-if=" false && !($q.platform.is.mobile||$isbex) && paths.length && step != 2"
        class="AssetTable__Table-sc-1hzgxt1-1 hkPLhL"
      >
        <colgroup>
          <col style="width: 32px" />
        </colgroup>
        <thead class="AssetTableHelpers__Head-sc-1o9oxiy-0 igjkkt">
          <tr class="AssetTableHelpers__Row-sc-1o9oxiy-7 bOnkOC">
            <th v-if="false" class="AssetTableHelpers__Th-sc-1o9oxiy-4 jfBtrR">
              <div class="AssetTableHelpers__Column-sc-1o9oxiy-1 hBIYtO">
                <label
                  class="
                    TextElement__Spacer-hxkcw5-0
                    kFFKOl
                    Label__StyledLabel-sc-15jxzvg-0
                    gzXJpq
                    AssetTableHelpers__ColumnLabel-sc-1o9oxiy-2
                    ftxqkW
                  "
                  >#</label
                >
              </div>
            </th>
            <th class="AssetTableHelpers__Th-sc-1o9oxiy-4 jfBtrR">
              <div class="AssetTableHelpers__Column-sc-1o9oxiy-1 hBIYtO">
                <label
                  class="
                    TextElement__Spacer-hxkcw5-0
                    kFFKOl
                    Label__StyledLabel-sc-15jxzvg-0
                    gzXJpq
                    AssetTableHelpers__ColumnLabel-sc-1o9oxiy-2
                    ftxqkW
                  "
                  >You send</label
                >
              </div>
            </th>
            <th class="AssetTableHelpers__Th-sc-1o9oxiy-4 jfBtrR">
              <div class="AssetTableHelpers__Column-sc-1o9oxiy-1 hBIYtO">
                <label
                  class="
                    TextElement__Spacer-hxkcw5-0
                    kFFKOl
                    Label__StyledLabel-sc-15jxzvg-0
                    gzXJpq
                    AssetTableHelpers__ColumnLabel-sc-1o9oxiy-2
                    ftxqkW
                  "
                  >Your receive</label
                >
              </div>
            </th>
            <th class="AssetTableHelpers__Th-sc-1o9oxiy-4 jfBtrR">
              <div class="AssetTableHelpers__Column-sc-1o9oxiy-1 hBIYtO">
                <label
                  class="
                    TextElement__Spacer-hxkcw5-0
                    kFFKOl
                    Label__StyledLabel-sc-15jxzvg-0
                    gzXJpq
                    AssetTableHelpers__ColumnLabel-sc-1o9oxiy-2
                    ftxqkW
                  "
                  >Price</label
                >
              </div>
            </th>
            <th class="AssetTableHelpers__Th-sc-1o9oxiy-4 jfBtrR">
              <div class="AssetTableHelpers__Column-sc-1o9oxiy-1 hBIYtO">
                <label
                  class="
                    TextElement__Spacer-hxkcw5-0
                    kFFKOl
                    Label__StyledLabel-sc-15jxzvg-0
                    gzXJpq
                    AssetTableHelpers__ColumnLabel-sc-1o9oxiy-2
                    ftxqkW
                  "
                  >Chains</label
                >
              </div>
            </th>
            <th class="AssetTableHelpers__Th-sc-1o9oxiy-4 jfBtrR">
              <div class="AssetTableHelpers__Column-sc-1o9oxiy-1 hBIYtO">
                <label
                  class="
                    TextElement__Spacer-hxkcw5-0
                    kFFKOl
                    Label__StyledLabel-sc-15jxzvg-0
                    gzXJpq
                    AssetTableHelpers__ColumnLabel-sc-1o9oxiy-2
                    ftxqkW
                  "
                  >Exchange</label
                >
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="AssetTable__AssetTableBody-sc-1hzgxt1-0 gcVqXC">

          <tr
            v-for="(path, index) in paths"
            :key="index"
            data-element-handle="asset-table-row"
            data-slug="bitcoin"
            class="styles__Row-sc-4x2924-0 hqjdOn"
          >
            <td
              v-if="false"
              class="
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__IndexColumn-bzcx4v-2
                cxfONy
              "
            >
              <span
                class="
                  TextElement__Spacer-hxkcw5-0
                  cicsNy
                  Header__StyledHeader-sc-1xiyexz-0
                  bjBkPh
                  AssetTableRow__StyledHeader-bzcx4v-12
                  AssetTableRow__StyledHeaderLight-bzcx4v-13
                  jauJqX
                "
                >{{ index + 1 }}</span
              >
              <div
                class="AssetTableRow__ReorderListIconContainer-bzcx4v-17 hiXhZK"
              >
                <svg
                  viewBox="0 0 448 512"
                  data-element-handle="asset-table-row-drag-handle"
                  class="AssetTableRow__ReorderListIcon-bzcx4v-18 bowWEV"
                >
                  <path
                    d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
                    fill="#becada"
                  ></path>
                </svg>
              </div>
            </td>
            <td
              class="
                q-ml-lg
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__NameColumn-bzcx4v-3
                jwbgUu
              "
            >
              <div
                class="
                  Flex-l69ttv-0
                  AssetTableRow__NameColumnInner-bzcx4v-4
                  fWxga-D
                "
              >
                <q-input
                  flat
                  :dark="$store.state.settings.lightMode === 'true'"
                  v-model="paths[index].fromAmount"
                  style="max-width: 300px"
                >
                  <template v-slot:before>
                    <q-avatar>
                      <img :src="path.icon" />
                    </q-avatar>
                  </template>
                  <template v-slot:append>
                    <span class="kwgTEs kwgTEs_navigate_next">
                      {{ path.fromToken.toUpperCase() }}
                      <q-icon name="navigate_next" />
                    </span>
                  </template>
                </q-input>

                <picture v-if="false"
                  ><source :srcset="path.icon" />
                  <img
                    :src="path.icon"
                    loading="lazy"
                    height="36"
                    width="36"
                    class="AssetTableRow__Icon-bzcx4v-19 fgsiwR"
                /></picture>
                <div
                  v-if="false"
                  class="
                    Flex-l69ttv-0
                    AssetTableRow__NameColumnRow-bzcx4v-5
                    fjfeyD
                  "
                >
                  <span
                    class="
                      TextElement__Spacer-hxkcw5-0
                      cicsNy
                      Header__StyledHeader-sc-1xiyexz-0
                      kwgTEs
                      AssetTableRow__StyledHeader-bzcx4v-12
                      AssetTableRow__StyledHeaderDark-bzcx4v-14
                      hfJTMn
                    "
                    >$1,200<br /> </span
                  ><span
                    v-if="false"
                    class="
                      TextElement__Spacer-hxkcw5-0
                      cicsNy
                      Header__StyledHeader-sc-1xiyexz-0
                      bjBkPh
                      AssetTableRow__StyledHeader-bzcx4v-12
                      AssetTableRow__StyledHeaderLight-bzcx4v-13
                      jauJqX
                    "
                    >BTC</span
                  >
                </div>
              </div>
            </td>
            <td
              class="
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__PriceColumn-bzcx4v-6
                bkmkHF
              "
            >
              <div
                class="
                  Flex-l69ttv-0
                  AssetTableRow__PriceColumnInner-bzcx4v-7
                  hzLOxv
                "
              >
                <div class="q-pr-sm">
                  <span class="gdx-coin" v-if="destinationCoin"
                    ><span class="gdx-coin-icon icon-BTC">
                      <q-img style="width: 20px" :src="destinationCoin.image" />
                    </span>
                  </span>
                </div>
                <span
                  class="
                    TextElement__Spacer-hxkcw5-0
                    cicsNy
                    Header__StyledHeader-sc-1xiyexz-0
                    kwgTEs
                    AssetTableRow__StyledHeader-bzcx4v-12
                    AssetTableRow__StyledHeaderDark-bzcx4v-14
                    hfJTMn
                    hfJTMn_destinationCoin
                  "
                  >{{ formatNumber(path.toAmount, 5) }}
                  {{ destinationCoin.value.toUpperCase() }}</span
                >
              </div>
            </td>
            <td
              class="
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__PriceColumn-bzcx4v-6
                bkmkHF
              "
            >
              <div
                class="
                  Flex-l69ttv-0
                  AssetTableRow__PriceColumnInner-bzcx4v-7
                  hzLOxv
                "
              >
                <span
                  class="
                    TextElement__Spacer-hxkcw5-0
                    cicsNy
                    Header__StyledHeader-sc-1xiyexz-0
                    kwgTEs
                    AssetTableRow__StyledHeader-bzcx4v-12
                    AssetTableRow__StyledHeaderDark-bzcx4v-14
                    hfJTMn">
                    <span class="priceLabel">{{ path.fromToken.toUpperCase() }} to USD</span>
                    <br />
                    <span class="hfJTMn_tokenPrice">
                      {{ path.tokenPrice ? "$" + formatNumber(path.tokenPrice, 2) : "NAN" }}
                    </span>
                  </span>
              </div>
            </td>
            <td
              class="
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__PercentChangeColumn-bzcx4v-16
                gDZxaI
              "
            >
              <span
                class="
                  TextElement__Spacer-hxkcw5-0
                  cicsNy
                  Header__StyledHeader-sc-1xiyexz-0
                  iOKVsz
                  AssetTableRow__StyledHeader-bzcx4v-12
                  AssetTableRow__TabularNumeric-bzcx4v-15
                  eprtwk
                  asset-table-percent-change
                "
                >{{ path.txChainLabel }}</span
              >
            </td>
            <td
              class="
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__ChartColumn-bzcx4v-8
                jymnha
              "
            >
            <span class="dex_name">{{path.dex}}</span>
              <q-img v-if="false" style="max-width: 80px" :src="path.dexLogo" />
            </td>
            <td
              class="
                styles__Column-sc-4x2924-1
                AssetTableRow__AssetColumn-bzcx4v-1
                AssetTableRow__TradeColumn-bzcx4v-10
                leZMkh
              "
            >
          <span v-show="false">{{path}}</span>
              <button
                @click="setPathTransaction(path)"
                aria-label="Comprar Bitcoin"
                class="
                  flex flex-center
                  Button__Container-opcph8-0
                  vioLp
                  PricesTable__TradeButton-sc-1uwln1z-0
                  cPqKDE
                "
              >
                <span class="Button__Content-opcph8-1 emQNZK"
                  >Buy {{ destinationCoin.value.toUpperCase() }}
                </span>
                <q-icon
                  flat
                  v-if="isPathInvalid(path)"
                  name="info"
                  class="q-pl-sm"
                >
                  <q-tooltip>
                    {{ isPathInvalid(path) }}
                  </q-tooltip>
                </q-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- MOBILE VIEW ONLY  -->
      <ExchangeRowItem v-if="$q.platform.is.mobile||$isbex" :paths="paths" :formatNumber="formatNumber" :destinationCoin="destinationCoin" :setPathTransaction="setPathTransaction" :isPathInvalid="isPathInvalid" />
    </div>
     <!-- <ExchangeRowItem v-if="$q.platform.is.mobile||$isbex" :paths="paths" :formatNumber="formatNumber" :destinationCoin="destinationCoin" :setPathTransaction="setPathTransaction" :isPathInvalid="isPathInvalid" />
    -->

    <!-- <GodexDialog  v-if="$q.platform.is.mobile" :destinationCoinOptions.sync="destinationCoinOptions" :destinationCoinUnfilter="destinationCoinUnfilter" :depositCoinOptions.sync="depositCoinOptions" :hideDeposit.sync="hideDeposit" :hideDestination.sync="hideDestination" /> -->
    <div class="row">
     <div class="col-md-4 offset-md-2">
     <GodexDialog ref="txUi" style="width:400px;"   :step.sync="step" :paths="paths" :formatNumber="formatNumber" :isPathInvalid="isPathInvalid" :setMinimum="setMinimum" :getSwapInfo="getSwapInfo" :destinationCoinOptions.sync="destinationCoinOptions" :destinationCoinUnfilter="destinationCoinUnfilter" :depositCoin.sync="depositCoin" :depositCoinOptions.sync="depositCoinOptions" :depositCoinUnfilter="depositCoinUnfilter" :hideDeposit.sync="hideDeposit" :hideDestination.sync="hideDestination" :swapData="swapData" :spinner="spinner" :setPathTransaction="setPathTransaction" :getDepositTxData="getDepositTxData" :destinationCoin.sync="destinationCoin"  :filterDestinationCoin="filterDestinationCoin" :setSuccessData="setSuccessData" :currentDex="currentDex" :switchAmounts="switchAmounts"
                    :createTransaction="createTransaction" :error="error" :chains="chains" :path="path" :splitterModel="splitterModel" :tab.sync="tab" :setPathData="setPathData" :innerStep="innerStep" :chainData="chainData" :approvalCheckRun="approvalCheckRun" :fromAccountSelected="fromAccountSelected" :getKeyFormat="getKeyFormat" :setSelectedGas="setSelectedGas" :processApproval="processApproval" :swapTokens="swapTokens" :toAccountSelected="toAccountSelected" :setTransactionStatus="setTransactionStatus" :setTab="setTab" :exchangeDetails="exchangeDetails" :showSendComponent="showSendComponent" :validStatus="validStatus" :copyToClipboard="copyToClipboard" />
     </div>
     <div class="col-md-4">
       <ExchangeRowItem  :paths="paths" :formatNumber="formatNumber" :destinationCoin="destinationCoin" :setPathTransaction="setPathTransaction" :isPathInvalid="isPathInvalid" />
     </div>
      </div>
    <q-dialog :dark="$store.state.settings.lightMode === 'true'" v-model="showMessage">
      <q-card :dark="$store.state.settings.lightMode === 'true'">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Action Required</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="text-body1">
          {{ popupData.msg }}
          <div>
            <div class="text-body1 q-pt-sm">
              <div class="text-bold q-pb-sm"> Click here to import a wallet</div>
              <q-btn no-caps :color="$store.state.settings.lightMode === 'true' ? 'white':'black'" :label="'Import '+popupData.chain.toUpperCase()+' wallet'" :to="popupData.to" rounded outline/>
            </div>
            <div class="text-body1 q-pt-md" v-if="popupData.key">
              <div class="text-bold">or deposit funds in your Verto wallet</div>
              <q-input
                v-model="popupData.key"
                :dark="$store.state.settings.lightMode === 'true'"
                :light="$store.state.settings.lightMode === 'false'"
                color="green"
                label="Key"
                style="max-width:300px"
                readonly
              >
                <template v-slot:prepend>
                  <q-btn icon="file_copy" label="Copy key" outline rounded @click="copyToClipboard(popupData.key, 'Key')" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>
// Insuficient BTC balance (BITCOIN chain). Import your wallet into Verto // Or Deposit bitcoin into this account
import CrosschainDex from '@/util/CrosschainDex'
import Formatter from '@/mixins/Formatter'
import SendComponent from '@/pages/Verto/Send'
import Exchange from '../../../pages/Verto/Exchange.vue'
import UI from './NewUI'
import GasSelector from '../../../components/Verto/ETH/GasSelector.vue'
// import transactEOS from '../transactEOS'

import ExchangeRowItem from '../MobileUI/ExchangeRowItem.vue'
import GodexDialog from '../MobileUI/GodexDialog.vue'

let defaults = ['eos', 'eth', 'btc']
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
import Lib from '@/util/walletlib'
import initWallet from '@/util/Wallets2Tokens'
export default {
  components: {
    SendComponent,
    Exchange,
    GasSelector,
    UI,
    ExchangeRowItem,
    GodexDialog
    // transactEOS
  },
  props: ['fromAssetData', 'toAssetData'],
  data () {
    return {
      tab: 'deposit',
      showSendComponent: false,
      splitterModel: 10,
      showMessage: false,
      popupData: {
        msg: null,
        to: null,
        key: false,
        chain: ''
      },
      currentDex: null,
      error: null,
      chains: [],
      step: 0,
      pathQuantities: [],
      depositCoinOptions: [],
      spinner: {
        tx: false,
        amount: false
      },
      path: [],
      paths: [],
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
        chain: {},
        toDestinationAddresses: {},
        toAmount: 0,
        rate: 0,
        gas: {},
        mint: {},
        error: false,
        status: null,
        toChosenChain: null,
        transferObject: null,
        fromChosenChain: null,
        approvalCheck: false,
        approval: {
          error: false,
          hash: false,
          required: false,
          transactionObject: null,
          explorer_link: ''
        },
        toChains: [],
        fromChains: []
      },
      exchangeDetails: {
        depositAddress: ''
      },
      tabs: [],
      depositCoin: {
        label: 'BTC',
        value: 'btc',
        image:
          'https://api.godex.io/storage/coins/nlQJWbSb5SZ0CsXk0RTDFH2Tsg4bcRKuZLZwVyKr.png'
      },
      destinationCoin: {
        label: 'ETH',
        value: 'eth',
        image: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
      },
      destinationCoinOptions: [],
      transactions: [],
      depositCoinUnfilter: [],
      destinationCoinUnfilter: []
    }
  },
  async created () {
    this.$store.state.settings.defaultChainData = false
    let coins = CrosschainDex.getAllCoins()
    this.setDefaulValue()
    if (
      (!this.$store.state.settings.coins.godex ||
        !this.$store.state.settings.coins.godex.length) &&
      this.$store.state.settings.globalSettings.godexTokens
    ) {
      this.$store.state.settings.coins.godex =
        this.$store.state.settings.globalSettings.godexTokens.map((el) => {
          return {
            value: el.code.toLowerCase(),
            image: el.icon,
            label: el.name,
            minimum: el.min_amount
          }
        })
    }

    this.getOngoingTx()

    this.chains = this.setChains()
    this.depositCoinOptions = coins

    this.destinationCoinOptions = coins
    this.destinationCoinUnfilter = coins
    this.depositCoinUnfilter = coins

    // this.getSwapInfo()
  },
  watch: {
    'swapData.fromChosenChain': function (chain) {
      if (chain && chain.toLowerCase() === 'eos') {
        let token = this.$store.state.settings.coins.defibox.find(
          (o) => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()
        )
        if (token) {
          this.swapData.depositTokenContract = token.contract
        }
      }
    },
    depositCoin: function () {
      if (
        this.depositCoin.value.toLowerCase() ===
        this.destinationCoin.value.toLowerCase()
      ) {
        this.destinationCoin = this.destinationCoinUnfilter.find(
          (o) =>
            defaults.includes(o.value.toLowerCase()) &&
            this.depositCoin.value.toLowerCase() !== o.value.toLowerCase()
        )
        this.getSwapInfo()
      }
    },
    destinationCoin: function () {
      if (
        this.depositCoin.value.toLowerCase() ===
        this.destinationCoin.value.toLowerCase()
      ) {
        this.depositCoin = this.depositCoinUnfilter.find(
          (o) =>
            defaults.includes(o.value.toLowerCase()) &&
            this.destinationCoin.value.toLowerCase() !== o.value.toLowerCase()
        )
        this.getSwapInfo()
      }
    }
  },
  computed: {
    chainData () {
      return this.chains.find((o) => o.chain === this.swapData.fromChosenChain)
    }
  },
  methods: {
    setDefaulValue () {
      let from = this.fromAssetData && this.fromAssetData.type ? this.fromAssetData.type : (this.$route.params.from ? this.$route.params.from : null)
      let to = this.toAssetData && this.toAssetData.type ? this.toAssetData.type : (this.$route.params.to ? this.$route.params.to : null)

      if (from) {
        let img = Lib.getTokenImage(from)

        this.depositCoin = {
          label: from.toUpperCase(),
          value: from,
          image: img
        }
      }
      if (to) {
        let img = Lib.getTokenImage(to)

        this.destinationCoin = {
          label: to.toUpperCase(),
          value: to,
          image: img
        }
      }
    },
    testData () {
      this.swapData.approval = {
        error: false,
        status: 'Submitted',
        hash: '0xaCd398c95D7fb6fb4071C2892eADdaD12778dfDb',
        explorer_link: 'https://etherscan.io/address/0x2c13f9722540a3b0a75cc641005f4954cc7e8771',
        required: false,
        transactionObject: null
      }
    },
    generateSteps () {
      this.tabs = []
      if (this.swapData.dex === 'oneinch') {
        if (this.swapData.approval.required) {
          this.tabs.push('Approval')
        }
        if (this.swapData.transferObject) {
          this.tabs.push('Swap')
        }
      } else if (this.swapData.dex === 'godex') {
        if (this.swapData.fromChains.length > 1) {
          this.tabs.push('Deposit')
        }

        if (this.swapData.toChains.length > 1) {
          this.tabs.push('Destination')
        }
      } else if (this.swapData.dex === 'renbridge') {
        this.tabs = ['Deposit', 'Destination', 'Approval']
      }
    },
    swapTokens () {
      let data = {
        gasData: this.swapData.gas[this.swapData.fromChosenChain],
        txData: this.swapData.transferObject.data
      }
      this.spinner.tx = true
      let account = this.fromAccountSelected[this.swapData.fromChosenChain]
      console.log(this.swapData.transferObject, 'this.swapData.transferObject')
      Lib.send(
        this.swapData.fromChosenChain,
        this.destinationCoin.value.toLowerCase(),
        this.swapData.transferObject.from,
        this.swapData.transferObject.to,
        this.swapData.transferObject.value,
        data,
        account.privateKey,
        ''
      )
        .then(async (result) => {
          if (result.success) {
            this.swapData.transferObject.hash = result.transaction_id
            this.swapData.transferObject.status = 'Submitted'
            this.swapData.transferObject.explorer_link = result.message
            let status = await Lib.checkEvmTxStatus(
              this.swapData.transferObject.hash,
              this.swapData.fromChosenChain
            )
            if (status) {
              this.swapData.transferObject.status = 'Success'
            } else {
              this.swapData.transferObject.status = 'Failed'
            }
            initWallet(account.name)
            setTimeout(() => {
              this.getPathForToken(
                this.depositCoin.value,
                this.destinationCoin.value,
                this.swapData.fromAmount
              )
            })
          } else {
            this.swapData.error = result.message
            this.swapData.status = 'Error'
          }
          this.spinner.tx = false
        })
        .catch((error) => {
          this.swapData.status = 'Error'
          this.swapData.error = error
          this.spinner.tx = false
        })
    },
    mintRenBtc (order_id) {
      this.swapData.error = false
      let data = {
        gasData: this.swapData.gas[this.swapData.toChosenChain],
        txData: this.swapData.mint.data
      }
      this.spinner.tx = true
      let account = this.toAccountSelected[this.swapData.toChosenChain]

      Lib.send(
        this.swapData.toChosenChain,
        '',
        this.swapData.mint.from,
        this.swapData.mint.to,
        this.swapData.mint.value,
        data,
        account.privateKey,
        ''
      )
        .then(async (result) => {
          console.log(result, 'result')
          if (result.success) {
            this.swapData.mint.hash = result.transaction_id
            this.swapData.mint.status = 'Submitted'
            let status = await Lib.checkEvmTxStatus(
              this.swapData.mint.hash,
              this.swapData.toChosenChain
            )
            if (status) {
              this.swapData.mint.status = 'Success'
              localStorage.removeItem('vexchange_crosschain_' + order_id)
              this.swapData.fromChosenChain = this.swapData.toChosenChain
              this.fromAccountSelected[this.swapData.fromChosenChain] =
                this.toAccountSelected[this.swapData.toChosenChain]
              this.swapData.dex = 'oneinch'
              await this.approvalCheckRun(
                'renbtc',
                this.destinationCoin.value,
                this.swapData.mint.amount
              )
              this.innerStep.deposit = 2
              this.tab = 'deposit'
            } else {
              this.swapData.mint.status = 'Failed'
            }
            initWallet(account.name)
          } else {
            this.swapData.error = result.message
          }
          this.spinner.tx = false
        })
        .catch((error) => {
          console.log(error, 'error')
          this.swapData.error = error.message
          this.spinner.tx = false
        })
    },
    processApproval () {
      let data = {
        gasData: this.swapData.gas[this.swapData.fromChosenChain],
        txData: this.swapData.approval.transactionObject.data
      }
      this.spinner.tx = true
      let account = this.fromAccountSelected[this.swapData.fromChosenChain]

      Lib.send(
        this.swapData.fromChosenChain,
        this.destinationCoin.value.toLowerCase(),
        this.swapData.approval.transactionObject.from,
        this.swapData.approval.transactionObject.to,
        this.swapData.approval.transactionObject.value,
        data,
        account.privateKey,
        ''
      )
        .then(async (result) => {
          if (result.success) {
            this.swapData.approval.hash = result.transaction_id
            this.swapData.approval.status = 'Submitted'
            this.swapData.approval.explorer_link = result.message
            let status = await Lib.checkEvmTxStatus(
              this.swapData.approval.hash,
              this.swapData.fromChosenChain
            )
            if (status) {
              this.swapData.approval.status = 'Success'
              this.swapData.gas[this.swapData.fromChosenChain] = false
            } else {
              this.swapData.approval.status = 'Failed'
            }
            initWallet(account.name)
          } else {
            this.swapData.error = result.message
          }
          this.spinner.tx = false
        })
        .catch((error) => {
          console.log(error, 'error')
          this.swapData.error = error
          this.spinner.tx = false
        })
    },
    setTransactionStatus (data) {
      if (data.order_id) {
        if (this.exchangeDetails[data.order_id].mintObject) {
          if (data.chain === 'btc') {
            this.swapData.status = 'Unconfirmed'
          }
        }
      }
      if (data.hash) {
        this.swapData.hash = data.hash
      }
    },
    renDepositListener (mint, order_id, target) {
      const self = this
      console.log(mint, order_id, 1)
      mint.on('deposit', async (deposit) => {
        // Details of the deposit are available from `deposit.depositDetails`.
        let data = localStorage.getItem('vexchange_crosschain_' + order_id)
        data = JSON.parse(data)
        console.log(mint, order_id, 3, data)
        if (data && !data.depositDetails) {
          data.depositDetails = deposit.depositDetails
          localStorage.setItem(
            'vexchange_crosschain_' + order_id,
            JSON.stringify(data)
          )
        }
        console.log(mint, order_id, 4, data, deposit)
        const hash = deposit.txHash()
        const depositLog = (msg, confs) => {
          this.$set(this.exchangeDetails[order_id], 'bridgeStatus', {
            msg: msg,
            hash: hash,
            confirmed: parseInt(confs) === 6
          })

          console.log(mint, order_id, 5, deposit)
        }
        if (deposit.depositDetails) {
          localStorage.setItem(
            'safe_vexchange_crosschain_' + order_id,
            JSON.stringify({
              deposit: deposit.depositDetails,
              data: this.swapData
            })
          )
        }
        console.log(
          CrosschainDex.getRenMintTx(deposit, this.swapData.toChosenChain),
          deposit,
          mint,
          'mint',
          1
        )
        await deposit
          .confirmed()
          //  .on('target', (confs, target) => depositLog((target || 0) + '/6 confirmations', confs, target))
          .on('confirmation', (confs, target) => {
            depositLog(`Confirmation check : ${confs}/6 confirmations`, confs)
          })
        console.log(deposit, mint, 'mint', 3)
        self.swapData.mint = CrosschainDex.getRenMintTx(
          deposit,
          self.swapData.toChosenChain
        )
        console.log(deposit, mint, 'mint', 38)

        self.mintRenBtc(order_id)
        /*
        await deposit
          .signed()
          // Print RenVM status - "pending", "confirming" or "done".
          .on('status', (status) => depositLog(`Status: ${status}`))

        console.log(deposit, mint, 'mint', 3)
        await deposit
          .mint()
          // Print Ethereum transaction hash.
          .on('transactionHash', (txHash) => {
            console.log(deposit, mint, 'mint', 4)
          })
          .on('tx_details', (tx_details) => {
            console.log(tx_details, 'tx_details')

            /* {
              from: tx_details.from,
              to: tx_details.to,
              data: tx_details.data,
              amount: tx_details.amount,
              value: 0
            } */

        //
        //  })
      })
    },
    setSelectedGas (data) {
      this.swapData.gas[data.chain] = data.value
      console.log(
        this.swapData,
        '  this.swapData',
        this.fromAccountSelected[this.swapData.fromChosenChain]
      )
    },
    resumeMinting (tx) {
      this.spinner.tx = true
      for (let key in tx.swapData) {
        this.$set(this.swapData, key, tx.swapData[key])
      }
      const self = this
      console.log(tx, 'this.swapData 125', tx)
      this.error = false
      this.spinner.tx = true

      this.swapData.status = 'Unconfirmed'

      let to = tx.mintObject.toToken
      let from = tx.mintObject.fromToken

      this.depositCoin = CrosschainDex.getAllCoins().find(
        (o) => o.value.toLowerCase() === from.toLowerCase()
      )
      this.destinationCoin = CrosschainDex.getAllCoins().find(
        (o) => o.value.toLowerCase() === to.toLowerCase()
      )

      if (this.swapData.bridge) {
        to = this.swapData.bridge
      }
      if (this.swapData.dex) {
        CrosschainDex.setDex(this.swapData.dex)
      }

      CrosschainDex.createTransaction(
        this.depositCoin.value,
        to,
        this.swapData.fromAmount,
        this.swapData.toDestinationAddresses[this.swapData.toChosenChain],
        this.swapData.fromChosenChain,
        this.swapData.toChosenChain,
        ''
      ).then(async (data) => {
        this.spinner.tx = false

        if (data.tx) {
          // this.exchangeDetails[data.tx.order_id] = data.tx
          this.$set(this.exchangeDetails, tx.order_id, tx)

          const depositLog = (msg, confs) => {
            this.$set(this.exchangeDetails[tx.order_id], 'bridgeStatus', {
              msg: msg,

              confirmed: parseInt(confs) === 6
            })

            console.log(this.exchangeDetails, 'this.exchangeDetails')
          }

          let wallets = this.chains.find((o) => o.chain === this.swapData.toChosenChain)
          this.toAccountSelected[this.swapData.toChosenChain] = wallets.accounts.find(o => o.key.toLowerCase() === this.swapData.toDestinationAddresses[this.swapData.toChosenChain].toLowerCase())

          this.setExchangeData(
            {
              bridge: tx.dex,
              limitMinDepositCoin: 0,
              amount: tx.mintObject.toAmount,
              toChains: [tx.mintObject.toChain],
              fromChains: [tx.mintObject.fromChain],
              dex: tx.mintObject.dex
            },
            1
          )
          this.tab = 'destination'

          if (!tx.depositDetails) {
            this.renDepositListener(data.tx.mintObject, tx.order_id)
          } else {
            data.tx.mintObject
              .processDeposit(tx.depositDetails)
              .then(async (deposit) => {
                console.log(deposit, 'deposit deposit')
                await deposit
                  .confirmed()
                  //  .on('target', (confs, target) => depositLog((target || 0) + '/6 confirmations', confs, target))
                  .on('confirmation', (confs, target) => {
                    depositLog(
                      `Confirmation check : ${confs}/6 confirmations`,
                      confs
                    )
                    console.log(deposit, data.tx.mintObject, 'mint', 455)
                  })
                self.swapData.mint = CrosschainDex.getRenMintTx(
                  deposit,
                  tx.swapData.toChosenChain
                )
                console.log(self.swapData.mint, ' self.swapData.mint ', deposit)

                self.mintRenBtc(tx.order_id)
              })
          }
          // this.renDepositListener(data.tx.mintObject, tx.order_id)
        }
      })
    },
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
      this.exchangeDetails = {}
      this.fromAccountSelected = {}
      this.innerStep.deposit = 1
      let toReset = {
        toDestinationAddresses: {},
        txStatus: null,
        txStatusDescription: null,
        rate: 0,
        gas: {},
        status: false,
        order_id: false,
        transferObject: null,
        approval: null,
        error: false,
        bridge: false,
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
    setPathData (path) {
      this.swapData.fromChosenChain = path.fromChain
      this.swapData.toChosenChain = path.toChain
      this.swapData.dex = path.dex
    },
    changeInnerStep () {
      if (this.swapData.inChain) {
        this.getSwapInfo()
      } else {
        setTimeout(() => {
          this.innerStep.deposit = this.chainData ? 2 : this.innerStep.deposit
        }, 300)
      }
    },
    getRenbridgeFees (amount) {
      let renVmPercent = 0.4

      return (renVmPercent * amount) / 100
    },
    setSuccessData () {},
    async getPaths (from, to, amount) {
      let path = []

      if (from.toLowerCase() === 'eth' && to.toLowerCase() === 'vtx') {
        path.push({
          dex: 'coinswitch',
          fromChain: 'eth',
          toChain: 'eos',
          fromToken: from,
          toToken: to,
          toAmount: amount / CrosschainDex.vtxEquiv.eth
        })
      } else {
        let dexes = await CrosschainDex.getDex(
          from.toLowerCase(),
          to.toLowerCase()
        )

        await Promise.all(
          dexes
            .filter((o) => o.chains.length)
            .map(async (c) => {
              CrosschainDex.setDex(c.dex)

              let data = await CrosschainDex.getPair(
                from.toLowerCase(),
                to.toLowerCase(),
                amount
              )

              if (data && data.pair && data.pair.amount) {
                c.chains
                  .filter((j) => data.pair.fromChains.includes(j))
                  .forEach((b) => {
                    path.push({
                      dex: c.dex,
                      fromChain: b,
                      toChain: b,
                      fromToken: from,
                      toToken: to,
                      txParams: data.pair.txParams,
                      toAmount: data.pair.amount
                    })
                  })
              }
            })
        )
        if (dexes.find((o) => o.dex === 'godex')) {
          CrosschainDex.setDex('godex')
          let data = await CrosschainDex.getPair(
            from.toLowerCase(),
            to.toLowerCase(),
            amount
          )
          if (data && data.pair) {
            // fromChains = fromChains.concat(data.pair.fromChains)
            // toChains = toChains.concat(data.pair.toChains)
            data.pair.fromChains.forEach((o) => {
              data.pair.toChains.forEach((a) => {
                path.push({
                  dex: 'godex',
                  fromChain: o,
                  toChain: a,
                  fromToken: from,
                  toToken: to,
                  toAmount: data.pair.amount
                })
              })
            })
          }
        }

        let foundInGodex = this.$store.state.settings.coins.godex.find(
          (o) =>
            o.value.toLowerCase() === from.toLowerCase() &&
            from.toLowerCase() !== 'eos'
        )

        let defiBoxTokens = this.$store.state.settings.coins.defibox.filter(
          (o) =>
            o.value.toLowerCase() === to.toLowerCase() &&
            to.toLowerCase() !== 'eos'
        )

        if (foundInGodex && defiBoxTokens.length) {
          // does the EOS Pool exist ?
          CrosschainDex.setDex('godex')
          let godexPair = await CrosschainDex.getPair(
            from.toLowerCase(),
            'eos',
            amount
          )
          if (godexPair && godexPair.pair) {
            CrosschainDex.setDex('defibox')
            await Promise.all(
              defiBoxTokens.map(async (token) => {
                let pairData = await CrosschainDex.getPair(
                  'eos',
                  to.toLowerCase(),
                  godexPair.pair.amount,
                  token.contract
                )

                if (pairData && pairData.pair) {
                  godexPair.pair.fromChains.forEach((o) => {
                    path.push({
                      dex: 'godex',
                      fromChain: o,
                      fromToken: from,
                      toToken: to,
                      bridge: 'eos',
                      bridgeData: {
                        contract: token.contract,
                        pairData: pairData.pair.pairData
                      },
                      toChain: 'eos',
                      toAmount: pairData.pair.amount
                    })
                  })
                }
              })
            )
          }
        }

        if (
          from === 'btc' &&
          this.$store.state.settings.coins.oneinch.filter(
            (o) =>
              o.value.toLowerCase() === to.toLowerCase() &&
              to.toLowerCase() !== 'renbtc'
          ).length
        ) {
          CrosschainDex.setDex('oneinch')
          let data = await CrosschainDex.getPair(
            'renbtc',
            to.toLowerCase(),
            amount - this.getRenbridgeFees(amount)
          )
          console.log(data, 'data')
          if (data && data.pair && data.pair.amount) {
            data.pair.fromChains.forEach((b) => {
              path.push({
                dex: 'renbridge',
                fromChain: 'btc',
                toChain: b,
                bridge: 'renbtc',
                fromToken: from,
                toToken: to,
                toAmount: data.pair.amount
              })
            })
          }
        }
      }
      /*
      path.map(o => {
        if (o.fromToken === 'eth' && o.toToken === 'vtx' && o.fromChain === 'eth' && o.toChain === 'eos') {
          o.dex = 'coinswith'
        }
      }) */
      return path
    },
    async getPathForToken (from, to, amount) {
      // this.$store.state.wallets.tokens.filter(a => a.amount && !isNaN(a.amount))..
      this.paths = []
      let allPaths = []
      /* let wallet = [
        {
          type: 'eth',
          amount: 200
        },
        {
          type: 'eos',
          amount: 100
        },
        {
          type: 'tpt',
          amount: 200
        },
        {
          type: 'xmr',
          amount: 200
        },
        {
          type: 'dai',
          amount: 200
        },
        {
          type: 'btc',
          amount: 3
        },
        {
          type: 'bnb',
          amount: 2
        }
      ]
      */
      let list = []
      list.unshift({
        type: from.toLowerCase(),
        amount: amount,
        icon: this.depositCoin.image
      })

      list
        .filter((a) => a.amount && !isNaN(a.amount) && a.type !== this.destinationCoin.value.toLowerCase())
        .forEach(async (o) => {
          let values = await this.getPaths(
            o.type,
            this.destinationCoin.value.toLowerCase(),
            o.amount
          )

          if (values.length) {
            values.map((a) => {
              a.icon = o.icon
              let walletToken = this.$store.state.wallets.tokens.find(
                (w) => w.chain === a.fromChain && w.type === a.fromToken
              )
              a.walletToken = walletToken
              a.fromTokenPrice = walletToken
                ? walletToken.tokenPrice
                : o.tokenPrice
              a.fromAmount = o.amount

              a.fChainLabel = this.getChainLabel(a.fromChain)
              a.tChainLabel = this.getChainLabel(a.toChain)

              a.dexLogo = CrosschainDex.exchangeLogo[a.dex]
              a.txChainLabel =
                a.fChainLabel !== a.tChainLabel
                  ? a.fChainLabel + ' to ' + a.tChainLabel
                  : a.fChainLabel
            })

            if (values.length) {
              allPaths = allPaths.concat(
                values.filter((o) => o.toAmount)
              )

              if (allPaths.length) {
                let path = allPaths.find(
                  (o) => o.fromToken === this.depositCoin.value.toLowerCase()
                )
                if (path) {
                  /* allPaths = allPaths.filter(
                    (o) => o.fromToken !== this.depositCoin.value.toLowerCase()
                  )
                  allPaths.unshift(path)
                  */
                  this.swapData.toAmount = path.toAmount
                } else {
                  this.swapData.toAmount = 0
                }
              }
            }

            allPaths = allPaths.filter(z => z.fromChain === this.$refs.txUi.currentAccount.from.chain && z.toChain === this.$refs.txUi.currentAccount.to.chain).sort(
              (x, y) => (!x.walletToken ? 1 : 0) - (!y.walletToken ? 1 : 0)
            )
            this.paths = allPaths
          }
        })
    },
    async getSwapInfo (setStep = false) {
      this.spinner.amount = true
      this.resetSwapData()
      this.getPathForToken(
        this.depositCoin.value,
        this.destinationCoin.value,
        this.swapData.fromAmount
      )
      this.spinner.amount = false
      /*
      this.path = await this.getPaths(
        this.depositCoin.value,
        this.destinationCoin.value,
        this.swapData.fromAmount
      )

      this.currentDex = null
      this.resetSwapData()
      this.spinner.amount = true

      let eosToken = this.$store.state.settings.coins.defibox.find(
        (o) =>
          o.value.toLowerCase() === this.destinationCoin.value.toLowerCase() &&
          this.destinationCoin.value.toLowerCase() !== 'eos'
      )

      this.depositCoin.fromAmount = this.swapData.fromAmount
      this.dex = await CrosschainDex.getDex(
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
            limitMinDepositCoin: 0,
            amount: this.swapData.fromAmount / CrosschainDex.vtxEquiv.eth,
            toChains: ['eos'],
            fromChains: ['eth']
          },
          setStep
        )
      } else if (
        (!this.dex.length ||
          (this.dex.length === 1 && this.dex.find((o) => o.dex === 'godex'))) &&
        eosToken
      ) {
        this.swapData.toTokenContract = eosToken.contract
        let token = this.$store.state.settings.coins.godex.find(
          (o) => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()
        )
        if (token) {
          CrosschainDex.setDex('godex')
          this.swapData.bridge = true
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
                let pairData = await CrosschainDex.getPair(
                  'eos',
                  this.destinationCoin.value.toLowerCase(),
                  data.pair.amount
                )

                if (!pairData || !pairData.pair) return
                this.swapData.bridge = true
                this.swapData.eosPairId = pairData.pair.pair_id
                this.setExchangeData(
                  {
                    limitMinDepositCoin: data.pair.limitMinDepositCoin,
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
      } else if (
        this.dex.length === 2 &&
        this.dex.find((o) => o.dex === 'godex')
      ) {
        this.currentDex = this.dex.find((o) => o.dex !== 'godex')
        this.setDefaultWallet(this.currentDex.chains[0])
      } else if (this.dex.length >= 2) {
        if (this.swapData.fromChosenChain) {
          this.currentDex = this.currentDex = this.dex.find(
            (o) => o.chains.includes(this.swapData.fromChosenChain)
          )
        } else {
          this.tab = 'deposit'
          this.innerStep.deposit = 1
          let allChains = []
          allChains = this.dex.map((o) => allChains.concat(o.chains))
          this.setExchangeData(
            {
              limitMinDepositCoin: 0,
              toChains: [],
              fromChains: allChains,
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
      /*
      console.log(this.currentDex, 'this.currentDex 0', this.swapData)
      if (this.currentDex && this.currentDex.dex) {
        this.$store.commit('settings/setDex', {
          dex: this.currentDex.dex,
          destinationCoin: this.destinationCoin,
          depositCoin: this.depositCoin,
          fromAmount: parseFloat(this.swapData.fromAmount)
        })
      } */
    },
    async isApprovalRequired () {
      // let data = await CrosschainDex.isOneinchApprovalRequired('0x915f86d27e4E4A58E93E59459119fAaF610B5bE1', 'dai', '1inch', '777', 'eth')
      this.swapData.approval = await CrosschainDex.isOneinchApprovalRequired(
        this.fromAccountSelected[this.swapData.fromChosenChain].key,
        this.depositCoin.value,
        this.destinationCoin.value,
        this.swapData.fromAmount,
        this.swapData.fromChosenChain
      )
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
                actor:
                  this.fromAccountSelected[this.swapData.fromChosenChain].name,
                permission: 'active'
              }
            ],
            data: {
              from: this.fromAccountSelected[this.swapData.fromChosenChain]
                .name,
              to: this.exchangeDetails[this.swapData.order_id].depositAddress,
              memo: this.exchangeDetails[this.swapData.order_id].memo,
              quantity:
                this.exchangeDetails[this.swapData.order_id].depositQuantity.toFixed(4) +
                ' ' +
                this.exchangeDetails[this.swapData.order_id].from.toUpperCase()
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
              from: this.fromAccountSelected[this.swapData.fromChosenChain]
                .name,
              to: this.swapData.toDestinationAddresses[this.swapData.toChosenChain],
              memo: 'swap,1,' + this.swapData.eosPairId,
              quantity:
                this.exchangeDetails[this.swapData.order_id].amount.toFixed(4) +
                ' ' +
                this.exchangeDetails[this.swapData.order_id].from.toUpperCase()
            }
          }
        ],
        send: true
      }
      return tx
    },
    /*
    async setExchangeChains (data) {
      this.swapData.toChains = data.toChains
      this.swapData.dex = data.dex
      if (this.swapData.toChains.length === 1) {
        this.swapData.toChosenChain = this.swapData.toChains[0]
        let wallets = this.chains.find((o) => o.chain === this.swapData.toChosenChain)
        if (wallets && wallets.accounts.length === 1) {
          this.toAccountSelected[this.swapData.toChosenChain] = wallets.accounts[0]
          this.swapData.toDestinationAddresses[this.swapData.toChosenChain] = this.swapData.toChosenChain === 'eos'
            ? this.toAccountSelected[this.swapData.toChosenChain].name
            : this.toAccountSelected[this.swapData.toChosenChain].key
        }
      }
      if (data.bridge) {
        this.swapData.bridge = data.bridge
      }

      this.swapData.fromChains = data.fromChains

      if (data.dex !== 'oneinch') {
        this.swapData.approvalCheck = true
        this.swapData.approval = {
          required: false
        }
      }

      if (this.swapData.fromChains.length === 1) {
        this.swapData.fromChosenChain = this.swapData.fromChains[0]

        if (this.chainData.accounts.length === 1) {
          this.fromAccountSelected[this.swapData.fromChosenChain] = this.chainData.accounts[0]

          if (data.dex === 'oneinch') {
            let approval = await CrosschainDex.isOneinchApprovalRequired(this.fromAccountSelected[this.swapData.fromChosenChain].key, this.depositCoin.value, this.destinationCoin.value, this.swapData.fromAmount, this.swapData.fromChosenChain)
            this.swapData.approvalCheck = true
            this.swapData.approval = approval
          }
        }

        if (
          this.chainData &&
          this.chainData.accounts &&
          this.chainData.accounts.length
        ) {
          this.innerStep.deposit = 2
        }
      }
      if (
        this.swapData.fromChains.find((a) =>
          this.chains.find((o) => o.chain === a.toLowerCase())
        )
      ) {
        this.tab = 'deposit'
      } else {
        this.swapData.fromExternalWallet = true
        this.tab = 'destination'
      }
      console.log(this.chainData, this.swapData, data, 777)
    },
    */
    async approvalCheckRun (from, to, amount) {
      let approval = await CrosschainDex.isOneinchApprovalRequired(
        this.fromAccountSelected[this.swapData.fromChosenChain].key,
        from,
        this.destinationCoin.value,
        amount,
        this.swapData.fromChosenChain
      )
      this.swapData.approvalCheck = true
      this.swapData.approval = approval
      CrosschainDex.setDex(this.swapData.dex)
      let txData = await CrosschainDex.createTransaction(
        from,
        this.destinationCoin.value,
        this.swapData.fromAmount,
        this.swapData.toDestinationAddresses[this.swapData.toChosenChain],
        this.swapData.fromChosenChain,
        this.swapData.toChosenChain,
        null,
        this.fromAccountSelected[this.swapData.fromChosenChain].key
      )

      this.swapData.transferObject = txData
      this.swapData.transferObject.status = 'Pending payment'
    },

    async setExchangeData (data, setStep) {
      this.swapData.toAmount = data.amount
      this.swapData.inChain = data.inChain
      this.spinner.amount = false
      if (data.limitMinDepositCoin) {
        this.depositCoin.minimum = data.limitMinDepositCoin
      }
      if (data.bridge) {
        this.swapData.bridge = data.bridge
      }
      if (data.txParams) {
        this.swapData.txParams = data.txParams
      }

      if (data.dex) {
        this.swapData.dex = data.dex
      }
      if (!this.swapData.toAmount) {
        this.step = 0
      } else if (setStep) {
        this.step = setStep
      }

      if (data.dex !== 'oneinch') {
        this.swapData.approvalCheck = true
        this.swapData.approval = {
          required: false
        }
        this.splitterModel = 20
      } else {
        this.splitterModel = 0
      }
      this.swapData.toChains = data.toChains
      if (this.swapData.toChains.length === 1) {
        this.swapData.toChosenChain = this.swapData.toChains[0]
        let wallets = this.chains.find(
          (o) => o.chain === this.swapData.toChosenChain
        )
        if (wallets && wallets.accounts.length === 1) {
          this.toAccountSelected[this.swapData.toChosenChain] =
            wallets.accounts[0]
          this.swapData.toDestinationAddresses[this.swapData.toChosenChain] =
            this.swapData.toChosenChain === 'eos'
              ? this.toAccountSelected[this.swapData.toChosenChain].name
              : this.toAccountSelected[this.swapData.toChosenChain].key
        }
      }
      this.swapData.fromChains = data.fromChains

      if (this.swapData.fromChains.length === 1) {
        this.swapData.fromChosenChain = this.swapData.fromChains[0]

        if (this.chainData.accounts.length === 1) {
          this.fromAccountSelected[this.swapData.fromChosenChain] =
            this.chainData.accounts[0]

          if (data.dex === 'oneinch') {
            this.approvalCheckRun(
              this.depositCoin.value,
              this.destinationCoin.value,
              this.swapData.fromAmount
            )
          }
        }
        if (
          this.chainData &&
          this.chainData.accounts &&
          this.chainData.accounts.length
        ) {
          this.innerStep.deposit = 2
        }
      }
      if (
        this.swapData.fromChains.find((a) =>
          this.chains.find((o) => o.chain === a.toLowerCase())
        )
      ) {
        this.tab = 'deposit'
      } else {
        this.swapData.fromExternalWallet = true
        this.tab = 'destination'
      }
    },
    getRefundAddress () {
      return this.swapData.fromChosenChain
        ? this.swapData.fromChosenChain === 'eos'
          ? this.fromAccountSelected[this.swapData.fromChosenChain]?.name
          : this.fromAccountSelected[this.swapData.fromChosenChain]?.key
        : null
    },

    createTransaction () {
      this.error = false
      this.spinner.tx = true
      let to = this.destinationCoin.value

      if (this.swapData.bridge) {
        to = this.swapData.bridge
      }
      if (this.swapData.dex) {
        CrosschainDex.setDex(this.swapData.dex)
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
          console.log(data.tx, 'data.tx')
          if (data.tx) {
            // this.exchangeDetails[data.tx.order_id] = data.tx
            this.$set(this.exchangeDetails, data.tx.order_id, data.tx)
            this.exchangeDetails[data.tx.order_id].swapData = this.swapData
            this.swapData.order_id = data.tx.order_id

            if (data.tx.mintObject) {
              this.renDepositListener(data.tx.mintObject, data.tx.order_id)
            }
            if (
              this.$store.state.settings.chainsSendEnabled.includes(
                this.swapData.fromChosenChain
              )
            ) {
              this.spinner.tx = true

              setTimeout(() => {
                this.spinner.tx = false
              }, 6000)
              this.showSendComponent = false
              this.$store.commit('currentwallet/updateParams', {
                chainID: this.swapData.fromChosenChain.toLowerCase(),
                tokenID: this.depositCoin.value.toLowerCase(),
                accountName:
                  this.fromAccountSelected[this.swapData.fromChosenChain].name.toLowerCase(),
                to: data.tx.depositAddress,
                memo: data.tx.memo,
                disableMemoEdit: true,
                order_id: data.tx.order_id,
                sendTransaction: true,
                gasSelected:
                  this.swapData.gas[this.swapData.fromChosenChain.toLowerCase()],
                amount: data.tx.depositQuantity
              })

              this.$store.state.investment.defaultAccount =
                this.fromAccountSelected[this.swapData.fromChosenChain]

              this.showSendComponent = true
              //    this.setTransactionStatus({ order_id: data.tx.order_id, chain: 'btc', hash: '0xidjeidjiejdijeidjeidjiedjiejdiejdijdeijde' })
              // this.tab = 'tosend'
            } else if (
              this.swapData.fromChosenChain &&
              this.swapData.fromChosenChain === 'xxx'
            ) {
              this.showSendComponent = true
              data.tx.txObj = this.getDepositTxData()
              this.$store.state.investment.defaultAccount =
                this.fromAccountSelected[this.swapData.fromChosenChain]

              data.tx.toEosToken = true
              data.tx.bridge = this.swapData.bridge
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
            this.exchangeDetails[data.tx.order_id].description =
              txStatus[data.tx.status]
            if (data.tx.mintObject) {
              let obj = {
                dex: 'renbridge',
                fromChain: this.swapData.fromChosenChain,
                toChain: this.swapData.toChosenChain,
                bridge: 'renbtc',
                fromToken: this.depositCoin.value,
                toToken: this.destinationCoin.value,
                fromAmount: this.swapData.fromAmount,
                toAmount: this.swapData.toAmount
              }
              data.tx.mintObject = obj
            }
            localStorage.setItem(
              'vexchange_crosschain_' + data.tx.order_id,
              JSON.stringify(data.tx)
            )
            if (data.tx.fetchStatus) {
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
          }
        })
        .catch((e) => {
          this.error = e.error
          this.spinner.tx = false
        })
    },
    isPathInvalid (path) {
      let message = null
      if (path && !path.walletToken && path.dex !== 'godex') {
        message =
          'You do not own this token in your ' + path.fChainLabel + ' wallet.'
      } else if (
        path &&
        path.walletToken &&
        path.dex !== 'godex' &&
        path.walletToken.amount < path.fromAmount
      ) {
        message =
          'Insuficient ' +
          path.fromToken.toUpperCase() +
          ' balance (' +
          path.fChainLabel.toUpperCase() +
          ' chain)'
      }
      return message
    },
    setPathTransaction (path) {
      let errorMessage = this.isPathInvalid(path)
      let isDefault = this.setDefaultWallet(path.fromChain)
      if (!path) {
        this.$q.notify({
          type: 'my-notif',
          message: 'Transaction path not found',
          timeout: 3000
        })
        return
      } else if (errorMessage) {
        /* this.$q.notify({
          type: 'my-notif',
          message: this.isPathInvalid(path),
          timeout: 3000
        })
*/ this.popupData.chain = path.fromChain
        this.popupData.msg = errorMessage
        this.popupData.msg +=
          ''
        this.popupData.to = this.getImportLink(path.fromChain)
        this.popupData.key = isDefault
          ? isDefault.chain === 'eos'
            ? isDefault.name
            : isDefault.key
          : false
        this.showMessage = true
        return
      }

      this.depositCoin.value = path.fromToken
      this.depositCoin.image = path.icon
      this.swapData.fromAmount = path.fromAmount

      if (['godex', 'renbridge', 'oneinch'].includes(path.dex)) {
        this.setExchangeData(
          {
            bridge: path.bridge,
            limitMinDepositCoin: 0,
            txParams: path.txParams,
            amount: path.toAmount,
            toChains: [path.toChain],
            fromChains: [path.fromChain],
            dex: path.dex
          },
          1
        )
        this.scrollToElement('tx-tab')
      } else if (path.dex === 'oneinch') {
      } else {
        if (!isDefault || isDefault === undefined) {
          this.$q.notify({
            type: 'my-notif',
            message:
              `No ` +
              path.fromChain.toUpperCase() +
              ' found. Go to "Profile "to import ',
            timeout: 3000
          })
          return
        }

        this.$store.commit('settings/setDex', {
          dex: path.dex,
          destinationCoin: this.destinationCoin,
          depositCoin: this.depositCoin,
          fromAmount: parseFloat(this.swapData.fromAmount)
        })
        this.step = 2
      }
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
            if (
              data.status === 'success' &&
              oldTx.bridge &&
              !oldTx.proxyTxSent
            ) {
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
        if (keys[i].includes('vexchange_crosschain_') && !keys[i].includes('safe')) {
          let tx = JSON.parse(localStorage.getItem(keys[i]))
          if (!finalStatus.includes(tx.status)) {
            if (tx.fetchStatus) {
              let interval = setInterval(() => {
                this.getTxStatus(tx.order_id, tx.dex)
              }, 5000)
              this.intervals.push({
                order_id: tx.order_id,
                interval: interval
              })
            }
          }
          this.transactions.push(tx)
        }
      }
      console.log(this.transactions)
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
.gdx-exchange-form {
  display: none !important;
}
  /deep/ .q-tab-panel {
    max-width: 550px;
  }
  .renbridge-dex  /deep/ .q-splitter__panel {
      width: 10% !important;
  }
  .oneinch-dex /deep/ .q-splitter__before {
    display: none;
  }
  .ongoing-orders {
    border: 1px solid #626262;
  }
  .mask-section {
    /* visibility: hidden; */
    pointer-events: none;
    opacity: .3;
    background: #333 !important;
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
  .light-mode /deep/ .q-tab--active {
    background: #d7dddf;
  }
  .light-mode .gdx-input .gdx-input-label {
    color: black !important;
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
    overflow: hidden;
    position: relative;
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
    justify-content: flex-start;
    /* margin-left: 30px; */
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
  span.priceLabel {
    font-size: small;
    color: #606060;
  }
  /* Token Table */
  .cicsNy {
    display: block;
    margin: 0px;
  }

  .kFFKOl {
    display: block;
  }

  .bjBkPh {
    font-family: Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    line-height: 1.3;
    color: rgb(var(--gray60));
    font-size: 18px;
    font-weight: 400;
  }

  .kwgTEs {
    font-family: Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    line-height: 1.3;
    color: rgb(5, 15, 25);
    font-size: 18px;
    font-weight: 400;
  }

  .iOKVsz {
    font-family: Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    line-height: 1.3;
    color: rgb(223, 95, 103);
    font-size: 16px;
    font-weight: 400;
  }

  .gzXJpq {
    font-family: Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    color: rgb(var(--gray60));
    transition: color 80ms ease-in-out 0s;
  }

  .vioLp {
    position: relative;
    width: auto;
    min-width: 100px;
    margin: 0px;
    border-radius: 4px;
    color: rgb(72 75 102);
    cursor: pointer;
    transition: all 80ms ease-in-out 0s;
    padding: 12px 16px !important;
    font-size: 14px;
    border: 1px solid rgb(var(--green60));
    background-color: #e7e8e8;
  }

  .vioLp:disabled {
    opacity: 0.5;
  }

  .vioLp:focus {
    outline: rgb(0, 82, 255) solid 2px;
  }

  .vioLp:hover {
    background-color: #7272fa;

    color: rgb(255 255 255);
  }

  .vioLp:active {
    border: 1px solid rgb(var(--green60));
    background-color: rgb(var(--green60));
  }

  .emQNZK {
    display: contents;
    align-items: center;
    justify-content: center;
    width: 100%;
    pointer-events: none;
    flex-wrap: nowrap;
    white-space: nowrap;
    font-family: Graphik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    font-weight: 500;
  }

  .cdfFYq {
    display: block;
    fill: none;
  }

  .csnuAl {
    stroke-width: 1.7;
    stroke: rgba(17, 51, 83, 0.3);
    pointer-events: none;
  }

  .hqjdOn {
    background: rgb(255, 255, 255);
    user-select: none;
  }

  .hqjdOn:last-child {
    border-bottom: 0px;
  }

  .hqjdOn:hover {
    background: rgba(17, 51, 83, 0.02);
  }

  .cxfONy {
    padding: 14px 48px 14px 0px;
    border-top: 1px solid rgb(236, 239, 241);
    cursor: default;
    position: relative;
    width: 85px;
  }

  .cxfONy:first-child {
    padding-left: 32px;
  }

  @media (max-width: 768px) {
    .cxfONy {
      padding: 14px 24px 14px 0px;
    }
    .cxfONy:first-child {
      padding-left: 24px;
    }
  }

  @media (max-width: 768px) {
    .cxfONy {
      padding-right: 14px;
      width: unset;
    }
  }

  .jwbgUu {
    padding: 0px 5px 0px 30px;
    border-top: 1px solid rgb(236, 239, 241);
    cursor: pointer;
    min-width: 140px;
  }

  @media (max-width: 768px) {
    .jwbgUu {
      padding: 14px 24px 14px 0px;
    }
  }

  .fWxga-D {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    flex-direction: row;
  }

  .fjfeyD {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .fjfeyD span {
    padding-left: 16px;
  }

  @media (max-width: 768px) {
    .fjfeyD {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .bkmkHF {
    padding: 14px 8px 14px 0px;
    border-top: 1px solid rgb(236, 239, 241);
    cursor: default;
    width: 8px;
  }

  @media (max-width: 768px) {
    .bkmkHF {
      padding: 14px 24px 14px 0px;
    }
  }

  .hzLOxv {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .hzLOxv .asset-table-percent-change {
    display: none;
  }

  @media (max-width: 768px) {
    .hzLOxv {
      flex-direction: column;
      align-items: flex-end;
    }
    .hzLOxv .asset-table-percent-change {
      display: unset;
    }
  }

  .jymnha {
    border-top: 1px solid rgb(236, 239, 241);
    cursor: default;
    width: 100px;
    padding: 5px 25px 5px 5px;
  }

  @media (max-width: 768px) {
    .jymnha {
      padding: 14px 24px 14px 0px;
    }
  }

  .leZMkh {
    padding: 14px 48px 14px 0px;
    border-top: 1px solid rgb(236, 239, 241);
    cursor: default;
    width: 70px;
  }

  .leZMkh:last-child {
    padding-right: 32px;
  }

  @media (max-width: 768px) {
    .leZMkh {
      padding: 14px 24px 14px 0px;
    }
    .leZMkh:last-child {
      padding-right: 24px;
    }
  }

  .leZMkh:last-child {
    width: 70px;
  }

  .jauJqX {
    text-align: left;
  }

  .hfJTMn {
    text-align: left;
  }

  .eprtwk {
    width: 100%;
    text-align: left;
    font-variant-numeric: tabular-nums;
  }

  .gDZxaI {
    padding: 14px 48px 14px 0px;
    border-top: 1px solid rgb(236, 239, 241);
    cursor: default;
    width: 130px;
    margin-right: 20px;
    text-align: left;
  }

  @media (max-width: 768px) {
    .gDZxaI {
      padding: 14px 24px 14px 0px;
    }
  }

  @media (max-width: 768px) {
    .gDZxaI {
      text-align: right;
      margin-right: 0px;
    }
  }

  .hiXhZK {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    left: 0px;
    height: 100%;
    top: 0px;
    opacity: 0;
    padding: inherit;
    transition: opacity 0.25s ease 0s;
  }

  .bowWEV {
    display: block;
    width: 15px;
    height: 15px;
    margin-left: -6px;
    cursor: auto;
  }

  .fgsiwR {
    flex-shrink: 0;
    border-radius: 100%;
  }

  .gcVqXC {
    padding: 0px;
    border: none;
    transition: opacity 300ms ease 0s;
  }

  .hkPLhL {
    width: 100%;
    padding: 0px;
    background: rgb(255, 255, 255);
    border-spacing: 0px;
    border-collapse: separate;
    caption-side: top;
    padding-left: 20px;
  }

  .igjkkt {
    border: none;
  }

  .hBIYtO {
    display: flex;
    align-items: center;
  }

  .ftxqkW {
    font-weight: 400;
    white-space: nowrap;
  }

  .jfBtrR {
    padding: 16px 48px 16px 0px;
    border-bottom: none;
    text-align: left;
  }

  .jfBtrR:first-child {
    padding-left: 32px;
  }

  .jfBtrR:last-child {
    padding-right: 32px;
  }

  .jfBtrR label {
    width: auto;
  }

  .bOnkOC {
    border-bottom: 1px solid rgb(236, 239, 241);
  }

  .cPqKDE {
    padding: var(--spacing-1) var(--spacing-2);
    white-space: nowrap;
  }
  .q-field__native.row.items-center:hover  .gdx-coin-code {
      display: none;
  }

  .dark-theme .hkPLhL {
    background: transparent;
  }
  .dark-theme .hqjdOn{
    background: transparent;
  }
  .dark-theme .hqjdOn:hover {
    background: #081d33;
  }
  .dark-theme .jwbgUu,
  .dark-theme .bkmkHF,
  .dark-theme .gDZxaI,
  .dark-theme .jymnha,
  .dark-theme .leZMkh {
    border-top: 1px solid #081d33;
  }
  .dark-theme .kwgTEs_navigate_next,
  .dark-theme .hfJTMn_destinationCoin,
  .dark-theme .hfJTMn_tokenPrice{
    color: #FFF;
  }
  .dark-theme .jymnha .q-img{
    background-color: #fff;
    border: 6px solid #FFF;
    border-radius: 5px;
  }
  .vs__actions{
    position: absolute;
    left: 76%;
    top: 30%;
    pointer-events: none;
  }
  .q-splitter{
    margin-top: 10px;
    border-radius: 10px;
  }
  .dark-theme .q-splitter{
    background: #050a10;
    border-radius: 10px;
  }
  .dark-theme .q-splitter .q-dark{
    border-radius: 10px;
  }
  .q-tab-wrapper{
    padding-top: 0px;
  }
  .q-tab-wrapper /deep/ .q-tabs__content{
    padding-top: 20px;
    border-radius: 10px 25px 25px 10px;
  }
  .dark-theme .q-tab-wrapper /deep/ .q-tabs__content{
    background: #04070c;
  }
  .waiting_tab .q-tab__content{
    position: relative;
  }
  /deep/ .waiting_tab .q-tab__content .q-tab__icon{
    position: absolute;
    left: 70px;
  }
  .flex_start{
    align-items: flex-start !important;
    justify-content: flex-start !important;
    padding-left: 30px;
    font-family: 'Libre Franklin', sans-serif;
    font-size: 18px;
    letter-spacing: 1px;
  }
  /deep/ .q-field__input.q-placeholder.col.q-field__input--padding[type="search"]{
    /* width: 60px; */
    /* position: absolute; */
    /* left: 30px; */
    /* margin-right: -20px; */
  }
  .ongoing-orders {
    margin-left: -20px;
  }
  .dark-theme .ongoing-orders {
    border: 1px solid rgba(white, .4);
    background: transparent;
  }
  .z_index{
    z-index: 9;
  }
  .dark-theme .gdx-input .gdx-input-field {
    border: 2px solid transparent;
    background-color: transparent;
    box-shadow: 0px 10px 20px 0px #0b294b;
    border-radius: 10px 0px 0px 10px;
  }
  .dark-theme .gdx-select .vs__dropdown-toggle {
    border-radius: 0px 10px 10px 0px;
    background-color: #0b294b;
    border: none;
    box-shadow: 0px 10px 20px 0px #0b294b;
    padding: 0 12px 0 16px;
    overflow: hidden;
    position: relative;
  }
</style>
<style>
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll{
    margin-top: 20px !important;
    margin-left: 7.5vw !important;
    min-width: unset !important;
    width: 100% !important;
    max-width: 28vw !important;
    /* left: 59% !important; */
    left: 50% !important;
    /* top: 51% !important; */
    top: 340px !important;
    max-height: 190px;
    transform: translate(-50%, -50%) scale(1.2) !important;
    z-index: 9;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll{
    background: #fff !important;
    box-shadow: 0px 20px 50px 0px #ccc;
    border: 2px solid #ececec;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll.q-menu--dark.q-dark{
    background: #04111f !important;
    box-shadow: 0px 10px 30px 0px #0b294b;
    border: 1px solid #0a294b;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-focusable:focus > .q-focus-helper,
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-manual-focusable--focused > .q-focus-helper {
    opacity: .5;
    background: #CCC;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-item__section--avatar{
    border-right: 1px solid rgba(182, 182, 182, 0.1);
    margin-right: 20px !important;
    padding-right: 0px !important;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-item__label{
    color: #000 !important;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-focusable:focus > .q-focus-helper:before,
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-manual-focusable--focused > .q-focus-helper:before,
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-focusable:focus > .q-focus-helper:after,
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-manual-focusable--focused > .q-focus-helper:after {
    opacity: .5;
    background: #CCC;
  }
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-focusable:focus > .q-focus-helper,
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-manual-focusable--focused > .q-focus-helper {
    opacity: .5;
    background: #0b294b;
  }
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-item__label{
    color: #FFF !important;
  }
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-focusable:focus > .q-focus-helper:before,
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-manual-focusable--focused > .q-focus-helper:before,
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-focusable:focus > .q-focus-helper:after,
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll .q-manual-focusable--focused > .q-focus-helper:after {
    opacity: .5;
    background: #0b294b;
  }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 10px rgba(233, 233, 233, 0.05); border-radius: 10px; background-color: #e6e6e6; }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll::-webkit-scrollbar-thumb { border-radius: 10px; -webkit-box-shadow: inset 0 0 15px rgba(212, 212, 212, 0.2); background-color: #a7a7a7; }
  .gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll::-webkit-scrollbar { width: 10px; background-color: #e4e4e4; }

  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.05); border-radius: 10px; background-color: #0c2a4a; }
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll::-webkit-scrollbar-thumb { border-radius: 10px; -webkit-box-shadow: inset 0 0 15px rgba(0,0,0,0.2); background-color: #05111f; }
  .q-menu--dark.q-dark.gdx_coin_wrapper_popup.q-menu.q-position-engine.scroll::-webkit-scrollbar { width: 10px; background-color: #05111f; }

  .info-tooltip{
    max-width: 310px;
    display: block;
    text-align: justify;
    font-size: 14px;
    font-weight: 200;
  }
  .q-dialog .q-card.q-card--dark.q-dark{
    border: 1px solid #0e1829;
    padding: 20px 30px;
    border-radius: 40px;
  }
  @media screen and (max-width: 768px){
    .q-dialog .q-card.q-card--dark.q-dark{
      border: 1px solid #0e1829;
      padding: 0px;
      border-radius: 6px;
    }
  }
  .dex_name{
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Libre Franklin', sans-serif;
  }
  .gdx-coin_wrapper{
    /* width: 150px; */
  }
</style>
