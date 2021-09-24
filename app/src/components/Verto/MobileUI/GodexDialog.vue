<template>
    <div>
        <q-dialog
            v-model="dialog"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
        <q-card class=" text-black" style="background: #f2f2f2 !important">
            <q-toolbar >
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                <q-toolbar-title> Token Exchange </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
            </q-toolbar>

            <q-card-section :class="{
                'dark-theme text-white ': $store.state.settings.lightMode === 'true',
                'light-mode bg-white': $store.state.settings.lightMode === 'false',
                }"
            >
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
                                        changeDepositCoin()
                                        $emit('update:hideDeposit', false);
                                        setMinimum();
                                        getSwapInfo();
                                        "
                                        @blur="hideDeposit = false"
                                        class="select-input gdx-coin_wrapper"
                                        popup-content-class="gdx_coin_wrapper_popup"
                                        :dark="false"
                                        :light="true"
                                        separator
                                        use-input
                                        borderless
                                        rounded
                                        v-model="depositCoinLocal"
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
                                v-model="swapDataFromAmountLocal"
                                @input="getSwapInfoLocal()"
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
                                            $emit('update:hideDestination', false);
                                            getSwapInfo();
                                        "
                                        @blur="$emit('update:hideDestination', false)"
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
                                                @click="$emit('update:hideDestination', true)"
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

                    <!-- TOP SEARCH PANEL END  -->

                </div>

            </q-card-section>
        </q-card>
        </q-dialog>
    </div>
</template>

<script>

export default {
  name: 'GodexDialogMobile',
  props: ['step', 'setMinimum', 'getSwapInfo', 'hideDeposit', 'depositCoin', 'filterDepositCoin', 'depositCoinOptions', 'swapData', 'spinner', 'setPathTransaction', 'paths', 'getDepositTxData', 'fromPreview', 'depositQuantity', 'assetBalance', 'destinationCoin', 'destinationCoinOptions', 'sendTo', 'memo', 'isTxValid', 'triggerAction', 'goToExchange', 'spinnerVisible', 'filterDestinationCoin', 'setSuccessData', 'currentDex', 'hideDestination'],
  // components: { PriceChart, ImportView, SendComponent, AccountSelector, transactEOS, TokenByAccount },
  data () {
    return {
      maximizedToggle: true,
      open: false,
      tabIndex: 'assets',
      previousTab: '',
      dialog: true,
      text: '',
      ph: '',
      dense: false,
      depositCoinLocal: {},
      swapDataFromAmountLocal: 1
    }
  },
  mounted () {
    this.depositCoinLocal = this.depositCoin
  },
  methods: {
    getSwapInfoLocal () {
      let swapData = this.swapData
      swapData.fromAmount = this.swapDataFromAmountLocal
      this.$emit('update:swapData', swapData)
      this.getSwapInfo()
    },
    changeDepositCoin () {
      this.$emit('update:depositCoin', this.depositCoinLocal)
    },
    closeDialog () {
      this.dialog = false
      //   this.$emit('update:dialog', false)
      this.$router.push({ name: 'dashboard', params: { tab: 'assets' } })
    }
  }

}
</script>

<style scoped>
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
