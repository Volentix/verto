<template>
  <q-dialog :dark="$store.state.settings.lightMode === 'true'" v-model="alert">
    <div
      :class="{ dark_dialog_deposit: $store.state.settings.lightMode === 'true' }"
      class="
        deposit_popup_wrapper
        relative
        inline-block
        align-bottom
        bg-white
        dark:bg-gray-850
        rounded-xl
        text-left
        overflow-hidden
        shadow-xl
        sm:my-8
        sm:align-middle
        sm:max-w-lg
        w-full
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      style="opacity: 1; transform: none"
    >
      <q-scroll-area
        :visible="true"
        :dark="$store.state.settings.lightMode === 'true'"
        class="full-width"
        style="height: 60vh !important"
      >
        <div
          class="
            deposit_header_bg
            bg-gray-50
            dark:bg-gray-850
            px-4
            py-3
            sm:py-4
            sm:px-6
            flex
            items-center
            justify-between
          "
        >
          <h3
            class="
              text-lg text-capitalize
              leading-6
              font-medium
              text-gray-900
              dark:text-gray-100
            "
            id="modal-headline"
          >
            {{ actionType }}
          </h3>
          <button
            class="
              close_button
              flex-shrink-0
              inline-flex
              items-center
              justify-center
              disabled:opacity-50
              disabled:cursor-default
              border
              focus:outline-none
              focus:ring-2 focus:ring-violet-500
              dark:focus:ring-violet-500
              focus:ring-offset-2
              dark:focus:ring-offset-gray-900
              transition
              bg-gray-50
              dark:bg-gray-850
              border-transparent
              font-medium
              p-1
              relative
              rounded-md
              text-gray-400
              dark:text-gray-500
              hover:text-gray-900
              dark:hover:text-white
              active:text-gray-900
              dark:active:text-white
              text-xs
              leading-4
            "
            type="button"
          >
            <span
              @click="alert = false ; $emit('setDialog',false)"
              class="flex-1 flex items-center justify-center"
              ><span class="sr-only">Close</span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5 flex-none"
                height="20"
                width="20"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path></svg
            ></span>
          </button>
        </div>
        <div class="q-pa-md" v-show="whitelistRequired">
          <p class="text-body1 vault_operates_text" :class="{ 'text-white': $store.state.settings.lightMode === 'true' }">
            This vault operates a depositor whitelist and your wallet address
            ({{ user.address }}) is not on it. If you want your address to be
            whitelisted, please contact by submitting this form.
          </p>
          <Contact />
        </div>
        <div v-if="pendingAction" class="text-body1 q-pa-md" :class="{ 'text-white': $store.state.settings.lightMode === 'true' }">
          This vault requires you to hold your shares for at least
          {{ pendingAction.time }} before
          {{ actionType == "deposit" ? "depositing" : "withdrawing" }}. You will
          be able to {{ actionType }} in {{ pendingAction.timer }}.
        </div>
        <div
        :class="{ 'text-white': $store.state.settings.lightMode === 'true' }"
          class="q-pt-md text-center"
          v-else-if="status == 'Submitted' || txHash"
        >
          <div  class="text-h6 full-width text-center">
            Transaction submitted
          </div>
          <br />
          <p class="text-body1 full-width text-center">
            Status:
            <span
              :class="
                status == 'Success' ? 'text-green' : 'text-deep-purple-12'
              "
              >{{ status }}</span
            >
          </p>
          <br />
          <div
            v-if="txHash"
            style="width: 300px; margin: 0 auto"
            :class="{ 'bg-grey-3': $store.state.settings.lightMode === 'true' }"
            class="cursor-pointer  q-pa-sm q-mt-md flex flex-center"
          >
            <a target="_blank" :href="'https://etherscan.io/tx/' + txHash"
              ><div>{{ getKeyFormat(txHash, 30) }}</div></a
            >
          </div>

          <br />
          <div
            class="flex flex-center"
            v-if="status == 'Submitted' || status == 'Pending'"
          >
            <q-spinner
              color="primary"
              class="q-pt-md"
              size="4em"
              :thickness="2"
            />
          </div>

          <br />
          <div class="flex flex-center q-pb-md">
            <q-btn
              v-if="status == 'Success' && approvalRequired"
              flat
              @click="
                status = false;
                hash = null;
                getTransactionObject();
                approvalRequired = false;
              "
              label="Go back to deposit"
            />
            <a
              v-else-if="txHash"
              target="_blank"
              :href="'https://etherscan.io/tx/' + txHash"
              ><q-btn
                flat
                label="View Tx"
                :icon="'img:https://etherscan.io/images/favicon3.ico'" /><q-icon
                name="navigate_next"
            /></a>
          </div>
        </div>
        <div
          class="text-center q-pt-md"
          v-if="confirmWindow && user.wallet == 'verto'"
          :class="{ 'text-white': $store.state.settings.lightMode === 'true' }"
        >
          <div class="text-h6">Complete transaction</div>
          <div class="q-pb-md">Click this button to go to Verto</div>
          <div v-if="error">{{ error }}</div>
          <q-btn
            :loading="spinnerVisible"
            outline
            rounded
            icon="img:https://verto.volentix.io/statics/icons/safari-pinned-tab.svg"
            label="Go to verto"
            @click="pushTransaction()"
          />
          <br />
          <q-btn flat label="Go back" @click="confirmWindow = false ; spinnerVisible = false" />
        </div>
        <div
          class="bg-white whitelist_wrapper dark:bg-gray-850 px-4 py-5 sm:p-6"
          v-show="
            !confirmWindow &&
            !pendingAction &&
            !whitelistRequired &&
            !txHash &&
            !(status == 'Submitted' || status == 'Pending')
          "
        >
          <div class="flex flex-col sm:min-h-[320px]">
            <div class="">
              <p
                class="mb-8"
                v-if="actionType === 'deposit' && tokens[0].price"
              >
                Choose Amount and Token to deposit
              </p>
              <p class="mb-8" v-else-if="actionType === 'withdraw'">
                Set number of shares to withdraw
              </p>

              <p class="q-pb-md text-green">{{ message }}</p>
              <form action="#" class="flex-1 flex flex-col">
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <div
                      class="
                        sm:flex
                        sm:justify-between
                        space-y-4
                        sm:space-y-0 sm:space-x-4
                      "
                    >
                      <div class="flex-1 min-w-0" v-if="tokens[0].price">
                        <div class="flex-1 space-y-2">
                          <div class="space-y-1">
                            <div
                              class="
                                flex
                                items-end
                                justify-between
                                space-x-2
                                max-w-full
                              "
                            >
                              <label
                                for="investmentAmount"
                                class="
                                  block
                                  font-medium
                                  text-sm text-gray-700
                                  dark:text-gray-300
                                "
                                >{{
                                  actionType == "deposit"
                                    ? "Amount"
                                    : "Number of shares"
                                }}</label
                              ><span
                                v-if="selected || actionType == 'withdraw'"
                                class="
                                  min-w-0
                                  text-sm text-gray-500
                                  dark:text-gray-400
                                "
                                id="investmentAmount-corner-hint"
                                ><span
                                  class="
                                    max-w-full
                                    space-x-2
                                    inline-flex
                                    items-center
                                  "
                                  ><span class="truncate inline-flex"
                                    ><span
                                      class="inline-flex min-w-0 max-w-full"
                                      ><span
                                        class="
                                          text-gray-900
                                          dark:text-gray-100
                                          truncate
                                          text-gray-600
                                          dark:text-gray-400
                                        "
                                        >{{
                                          maxDeposit
                                            .toString()
                                            .includes("0.0000")
                                            ? maxDeposit
                                            : maxDeposit.toFixed(4)
                                        }}
                                        {{
                                          actionType == "deposit"
                                            ? selected.type
                                            : ""
                                        }}</span
                                      ></span
                                    ></span
                                  ><button
                                  v-if="selected && selected.type.toLowerCase() !== 'eth'"
                                    @click="
                                      amount = maxDeposit;
                                      getTransactionObject();
                                    "
                                    class="
                                      flex-1
                                      bg-violet-500
                                      dark:bg-violet-400
                                      text-white
                                      dark:text-gray-900
                                      disabled:opacity-50
                                      disabled:cursor-default
                                      text-xs
                                      font-medium
                                      rounded-lg
                                      px-1.5
                                      py-0.5
                                      focus:outline-none
                                      focus:ring-2 focus:ring-violet-500
                                      dark:focus:ring-violet-500
                                      focus:ring-offset-2
                                      dark:focus:ring-offset-gray-900
                                      transition
                                      hover:bg-violet-600
                                      dark:hover:bg-violet-300
                                    "
                                    type="button"
                                  >
                                    Max
                                  </button></span
                                ></span
                              >
                            </div>
                            <div class="relative flex rounded-md shadow-sm">
                              <q-input
                                :class="{ 'q-mb-md': actionType == 'withdraw' }"
                                :dark="$store.state.settings.lightMode === 'true'"
                                @input="getTransactionObject()"
                                dense
                                filled
                                class="full-width"
                                v-model="amount"
                              />
                              <div
                                class="
                                  absolute
                                  inset-y-0
                                  right-0
                                  pr-3
                                  flex
                                  items-center
                                  pointer-events-none
                                "
                              ></div>
                            </div>
                          </div>
                          <div
                            v-if="tokens[0].price && actionType === 'deposit'"
                            class="text-sm text-gray-500 dark:text-gray-400"
                            id="investmentAmount-description"
                          >
                            <span class="text-gray-600 dark:text-gray-400"
                              ><span class="inline-flex min-w-0 max-w-full"
                                ><span class="truncate"
                                  >${{
                                    formatNumber(selected.price * amount, 2)
                                  }}</span
                                ></span
                              ></span
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="sm:pt-6"
                        @click="checkData()"
                        v-if="actionType === 'deposit'"
                      >
                        <span
                          class="
                            relative
                            toggle_buttons
                            z-0
                            inline-flex
                            shadow-sm
                            rounded-md
                          "
                        >
                          <span v-if="!tokens[0].price" class="q-mb-md"
                            >Loading fund data..</span
                          >
                          <button
                            v-if="selected"
                            type="button"
                            :dark="$store.state.settings.lightMode === 'true'"
                            @click="selected = tokens[0]"
                            :class="{
                              'not-selected': selected.type !== tokens[0].type,
                            }"
                            class="
                              -ml-px
                              first:ml-0
                              relative
                              inline-flex
                              items-center
                              py-2
                              first:rounded-l-md
                              last:rounded-r-md
                              border
                              focus-visible:border-violet-500
                              dark:focus-visible:border-violet-500
                              focus-visible:ring-1 focus-visible:ring-violet-500
                              dark:focus-visible:ring-violet-500
                              focus-visible:z-30
                              text-sm
                              font-medium
                              text-gray-700
                              dark:text-gray-200
                              focus:outline-none
                              disabled:cursor-default
                              disabled:opacity-50
                              focus:z-10
                              transition
                              border-gray-300
                              dark:border-gray-600
                              bg-white
                              dark:bg-gray-800
                              hover:bg-gray-50
                              dark:hover:bg-gray-700
                              px-2
                            "
                          >
                            <span class="flex items-center space-x-2">
                              <img
                                height="20"
                                width="20"
                                src="https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
                                alt="ETH"
                                class="
                                  flex-none
                                  bg-white
                                  dark:bg-gray-600
                                  rounded-full
                                  overflow-hidden
                                  h-5
                                  w-5
                                "
                              />
                              <span>ETH</span>
                            </span>
                          </button>
                          <button
                            v-if="tokens.length > 1"
                            @click="selected = tokens[1]"
                            :class="{
                              'not-selected': selected.type !== tokens[1].type,
                            }"
                            type="button"
                            class="
                              -ml-px
                              first:ml-0
                              relative
                              inline-flex
                              items-center
                              py-2
                              first:rounded-l-md
                              last:rounded-r-md
                              border
                              focus-visible:border-violet-500
                              dark:focus-visible:border-violet-500
                              focus-visible:ring-1 focus-visible:ring-violet-500
                              dark:focus-visible:ring-violet-500
                              focus-visible:z-30
                              text-sm
                              font-medium
                              text-gray-700
                              dark:text-gray-200
                              focus:outline-none
                              disabled:cursor-default
                              disabled:opacity-50
                              focus:z-10
                              transition
                              border-gray-400
                              dark:border-gray-500
                              bg-gray-50
                              dark:bg-gray-700
                              z-20
                              px-2
                            "
                          >
                            <span class="flex items-center space-x-2"
                              ><img
                                height="20"
                                width="20"
                                :src="tokens[1].image"
                                class="
                                  flex-none
                                  bg-white
                                  dark:bg-gray-600
                                  rounded-full
                                  overflow-hidden
                                  h-5
                                  w-5
                                "
                              /><span>{{ tokens[1].type }}</span></span
                            >
                          </button></span
                        >
                      </div>
                    </div>
                    <div class="mt-6" v-if="false">
                      <span class="flex flex-col"
                        ><span class="flex"
                          ><h3
                            class="
                              text-sm
                              font-medium
                              leading-5
                              text-gray-700
                              dark:text-gray-300
                            "
                          >
                            Shares Lockup Time
                          </h3>
                          <div>
                            <span class="inline-flex pl-1 transition"
                              ><svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="h-5 w-5 flex-none"
                                height="20"
                                width="20"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                  clip-rule="evenodd"
                                ></path></svg
                            ></span></div></span
                        ><span class="text-sm text-gray-600 dark:text-gray-400"
                          >1 day</span
                        ></span
                      >
                    </div>
                    <button
                      class="
                        flex
                        cursor-pointer
                        items-center
                        mt-4
                        text-sm
                        leading-5
                        font-normal
                        text-violet-500
                        dark:text-violet-500
                        focus:outline-none
                      "
                      type="button"
                    >
                      Advanced settings
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="h-4 w-4 flex-none ml-1"
                        height="16"
                        width="16"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 15l7-7 7 7"
                        ></path>
                      </svg>
                    </button>
                    <div class="my-3">
                      <div class="flex-1 space-y-2">
                        <div class="space-y-1">
                          <div
                            class="
                              flex
                              items-end
                              justify-between
                              space-x-2
                              max-w-full
                            "
                          >
                            <label
                              for="maxSlippage"
                              class="
                                block
                                font-medium
                                text-sm text-gray-700
                                dark:text-gray-300
                              "
                              >Maximum Slippage</label
                            ><span
                              class="
                                min-w-0
                                text-sm text-gray-500
                                dark:text-gray-400
                              "
                              id="maxSlippage-corner-hint"
                              ><span
                                class="
                                  max-w-full
                                  space-x-2
                                  inline-flex
                                  items-center
                                "
                                ><span
                                  class="truncate inline-flex"
                                ></span></span
                            ></span>
                          </div>
                          <div class="relative flex rounded-md shadow-sm">
                            <input
                              class="
                                peer
                                block
                                w-full
                                bg-white
                                dark:bg-gray-800
                                sm:text-sm
                                transition
                                border-gray-300
                                dark:border-gray-600
                                focus:border-violet-500
                                dark:focus:border-violet-500
                                focus:ring-violet-500
                                dark:focus:ring-violet-500
                                text-gray-900
                                dark:text-white
                                placeholder-gray-400
                                dark:placeholder-gray-500
                                rounded-md
                              "
                              id="maxSlippage"
                              name="maxSlippage"
                              type="text"
                              aria-describedby="maxSlippage-corner-hint"
                              inputmode="decimal"
                              autocomplete="off"
                              autocorrect="off"
                              placeholder="0.00%"
                              spellcheck="false"
                              value="3%"
                            />
                            <div
                              class="
                                absolute
                                inset-y-0
                                right-0
                                pr-3
                                flex
                                items-center
                                pointer-events-none
                              "
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col q-mt-md col-md-6" v-if="tokens[0].price">
                        <span class="text-bold">Transaction cost</span>
                        <span
                          class="text-red full-width"
                          v-if="
                            maxDeposit < parseFloat(amount) &&
                            !error.toString().includes('nsufficient')
                          "
                          ><br />Insufficient Balance</span
                        >
                        <span
                          class="text-body2"
                          v-if="
                            maxDeposit >= parseFloat(amount) &&
                            amount.toString().trim().length > 0 &&
                            parseFloat(amount) != 0 &&
                            !gas.usd &&
                            !isNaN(amount) &&
                            !error
                          "
                          ><br />Fetching data...</span
                        >
                        <span
                          class="text-body2"
                          v-else-if="parseFloat(amount) != 0 && gas.eth"
                          ><br />
                          $ {{ formatNumber(gas.usd, 2) }}<br />
                          {{ formatNumber(gas.eth, 6) }} ETH
                        </span>
                        <span v-else-if="error" class="text-red"
                          ><br />{{ error }}</span
                        >
                        <span class="text-body2" v-else-if="!parseFloat(amount)"
                          ><br />Enter deposit amount</span
                        >
                      </div>
                      <div class="col col-md-6">
                        <div class="q-my-md" v-if="approvalRequired">
                          <q-btn
                            @click="pushTransaction"
                            :loading="spinnerVisible"
                            class="full-width"
                            size="md"
                            :disable="
                              maxDeposit < parseFloat(amount) ||
                              !gas.eth ||
                              !txObject
                            "
                            label="Approve"
                            color="black"
                          />
                        </div>
                        <q-btn
                          @click="pushTransaction"
                          :loading="spinnerVisible && !approvalRequired"
                          class="full-width text-capitalize"
                          size="md"
                          :disable="
                            maxDeposit < parseFloat(amount) ||
                            !gas.eth ||
                            !txObject ||
                            approvalRequired
                          "
                          :label="actionType"
                          :color="approvalRequired ? 'grey' : 'black'"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="mt-4 flex flex-col space-y-4">
                      <button
                        v-if="false"
                        class="
                          flex-shrink-0
                          inline-flex
                          items-center
                          justify-center
                          disabled:opacity-50
                          disabled:cursor-default
                          border
                          focus:outline-none
                          focus:ring-2 focus:ring-violet-500
                          dark:focus:ring-violet-500
                          focus:ring-offset-2
                          dark:focus:ring-offset-gray-900
                          transition
                          bg-violet-500
                          dark:bg-violet-500
                          active:bg-violet-500
                          dark:active:bg-violet-500
                          border-transparent
                          font-medium
                          px-4
                          py-2
                          rounded-md
                          shadow-sm
                          text-sm text-white
                          dark:text-white
                        "
                        disabled=""
                        type="submit"
                      >
                        <span
                          class="
                            flex-1 flex
                            items-center
                            justify-center
                            space-x-2
                          "
                          >Approve USDC</span
                        >
                      </button>
                      <div
                        class="
                          hidden
                          col-span-2
                          relative
                          md:grid
                          grid-cols-2
                          justify-between
                        "
                      >
                        <span
                          class="
                            absolute
                            w-1/2
                            left-1/4
                            top-1/2
                            border-b border-violet-400
                            dark:border-violet-600
                            opacity-50
                          "
                        ></span
                        ><span
                          class="
                            relative
                            rounded-full
                            mx-auto
                            w-5
                            h-5
                            dark:bg-gray-800
                          "
                          ><span
                            class="
                              absolute
                              inset-0
                              text-xs
                              font-semibold
                              flex
                              items-center
                              justify-center
                              rounded-full
                              bg-violet-600
                              opacity-25
                              text-white
                              dark:text-white
                            "
                            >1</span
                          ></span
                        ><span
                          class="
                            relative
                            rounded-full
                            mx-auto
                            w-5
                            h-5
                            dark:bg-gray-800
                          "
                          ><span
                            class="
                              absolute
                              inset-0
                              text-xs
                              font-semibold
                              flex
                              items-center
                              justify-center
                              rounded-full
                              bg-violet-600
                              text-white
                              opacity-25
                            "
                            >2</span
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </q-dialog>
</template>
<script>
import Web3 from 'web3'
import Enzyme from '../../../util/Staider/Enzyme'
import ParseDb from '../../../util/Staider/ParseWrapper'
import Formatter from '../../../mixins/Formatter'
import Contact from './Contact.vue'
const Parse = require('parse')
export default {
  components: {
    Contact
  },
  mixins: [Formatter],
  props: ['user', 'fundAddress', 'actionType', 'EnzymeData', 'action', 'provider'],
  methods: {
    async getTransactionObject () {
      this.error = false
      this.confirmWindow = false
      if (!parseFloat(this.amount)) return
      this.spinnerVisible = true
      if (this.actionType === 'withdraw') {
        this.EnzymeData.getWithdrawalTxObject(this.user.address, this.amount, {
          decimals: 18
        })
          .then((tx) => {
            this.gas.eth = (tx.gas * tx.gasPrice) / 10 ** 18
            this.gas.usd = this.gas.eth * this.tokens[0].price
            this.txObject = tx
            this.spinnerVisible = false
          })
          .catch((e) => {
            if (e.toString().includes('INVESTOR_WHITELIST')) {
              this.whitelistRequired = true
            } else if (e.toString().includes('insufficient funds')) {
              this.error = 'Insufficient funds'
            } else if (e.toString().includes('Shares action timelocked')) {
              this.error =
                'You have to wait before redeeming shares (Shares Lockup)'
            } else {
              this.error = e
            }
            this.spinnerVisible = false
          })
      } else if (this.selected.type.toLowerCase() !== 'eth') {
        let approval = await this.EnzymeData.isErc20ApprovalRequired(
          this.user.address,
          this.selected,
          this.amount,
          this.EnzymeData.comptrollerProxy
        )

        if (approval.required) {
          this.spinnerVisible = false
          this.txObject = approval.transactionObject
          this.gas.eth =
            (this.txObject.gas * this.txObject.gasPrice) / 10 ** 18
          this.gas.usd = this.gas.eth * this.tokens[0].price
          this.approvalRequired = true
        } else {
          this.EnzymeData.getBuyShareTxObjectForErc20(
            this.user.address,
            this.amount,
            this.selected
          )
            .then((tx) => {
              this.gas.eth = (tx.gas * tx.gasPrice) / 10 ** 18
              this.gas.usd = this.gas.eth * this.tokens[0].price
              this.txObject = tx
              this.spinnerVisible = false
            })
            .catch((e) => {
              if (e.toString().includes('INVESTOR_WHITELIST')) {
                this.whitelistRequired = true
              } else if (e.toString().includes('insufficient funds')) {
                this.error = 'Insufficient funds'
              } else if (e.toString().includes('Shares action timelocked')) {
                this.error =
                  'You have to wait before creating new shares (Shares Lockup)'
              } else {
                this.error = e
              }
              this.spinnerVisible = false
            })
        }
      } else {
        this.EnzymeData.getBuyShareTxObjectForEth(
          this.user.address,
          this.amount
        )
          .then((tx) => {
            this.gas.eth = (tx.gas * tx.gasPrice) / 10 ** 18
            this.gas.usd = this.gas.eth * this.tokens[0].price
            this.txObject = tx
            this.spinnerVisible = false
          })
          .catch((e) => {
            if (e.toString().includes('INVESTOR_WHITELIST')) {
              this.whitelistRequired = true
            } else if (e.toString().includes('insufficient funds')) {
              this.error = 'Insufficient funds'
            } else if (e.toString().includes('Shares action timelocked')) {
              this.error =
                'You have to wait before creating new shares (Shares Lockup)'
            } else {
              this.error = e
            }
            this.spinnerVisible = false
          })
      }
    },
    async pushTransaction () {
      /* global Moralis */
      if (this.user.wallet === 'metamask' || this.user.wallet === 'walletconnect') {
        let web3 = null
        this.status = 'Submitted'
        this.spinnerVisible = true
     
        if (this.user.wallet === 'metamask') {
          await Moralis.enableWeb3()
          web3 = new Web3(Moralis.provider)
        } else {
          web3 = new Web3(this.provider)
        }
        
        web3.eth.sendTransaction(this.txObject, async (error, hash) => {
          if (hash) {
            this.txHash = hash
            this.status = 'Pending'
            localStorage.setItem('last_order', { hash: this.txHash })
            let status = await this.EnzymeData.checkEvmTxStatus(hash)

            if (status) {
              this.status = 'Success'
            } else {
              this.status = 'Failed'
            }
          } else {
            this.status = false
            this.error = error.toString()
          }

          this.spinnerVisible = false
        }).catch(error => {
          this.error = error.toString()
          this.spinnerVisible = false
        })
      } else if (this.user.wallet === 'verto') {
        if (this.confirmWindow) {
          this.spinnerVisible = true
          this.txObject.chain = 'eth'
          let tx = await ParseDb.createUseACLObject(
            'Transaction',
            this.txObject,
            {
              read: true,
              write: false
            }
          )
          let user = Parse.User.current()
          this.listenToData(tx.id)
          this.openInNewTab(
            this.$app.getUrl() + 'sign/' + tx.id + '/' + user.getSessionToken()
          )
        } else {
          this.confirmWindow = true
        }
      }
    },
    listenToData (objectId) {
      let query = new Parse.Query('TransactionEvents')
      query.equalTo('txId', objectId)
      query.subscribe().then((response) => {
        response.on('create', async (response) => {
          let hash = response.get('hash')
          let status = response.get('status')
          if (hash) {
            this.confirmWindow = false
            this.txHash = hash
            this.status = 'Pending'
            localStorage.setItem('last_order', { hash: this.txHash })
            let status = await this.EnzymeData.checkEvmTxStatus(hash)

            if (status) {
              this.status = 'Success'
            } else {
              this.status = 'Failed'
            }
          } else if (status === 'declined') {
            this.xf = 'Transaction was rejected'
          }
          this.spinnerVisible = false
        })
      })
    },
    checkData () {
      setTimeout(() => {
        this.getTransactionObject()
      }, 100)
    },
    async getDeposits () {
      let deposits = await Enzyme.getDeposits(this.$route.params.fundID)

      if (deposits) {
        deposits = deposits.filter(
          (o) =>
            o.__typename === 'SharesBoughtEvent' ||
            o.__typename === 'SharesRedeemedEvent'
        )

        this.currentUserDeposits = deposits.filter(
          (o) => o.investor.id.toLowerCase() === this.user.address.toLowerCase()
        )
        if (this.currentUserDeposits && this.currentUserDeposits.length) {
          const getLatestAction = (o) => {
            let now = new Date()
            return (now.getTime() - parseFloat(o.timestamp) * 1000) / 1000
          }
          let pending = this.currentUserDeposits.find(
            (o) =>
              getLatestAction(o) <
              parseFloat(this.EnzymeData.fundData.accessor.sharesActionTimelock)
          )
          if (pending) {
            let i =
              parseFloat(
                this.EnzymeData.fundData.accessor.sharesActionTimelock
              ) - getLatestAction(pending)
            let days =
              this.EnzymeData.fundData.accessor.sharesActionTimelock / 3600

            this.pendingAction = {
              time: days + ' hours',
              timer: this.secondsTotime(i, true)
            }
          }
        }
      }
    },
    getUserBalance () {
      this.$axios
        .get(
          process.env[this.$store.state.settings.network].CACHE + 'https://api.ethplorer.io/getAddressInfo/' +
            this.user.address +
            '?apiKey=EK-kJ7LW-wCWTsAy-ALujf'
        )
        .then((res) => {
          let ethplorer = res ? res.data : false
          if (ethplorer && ethplorer.ETH) {
            this.tokens[0].usd =
              ethplorer.ETH.balance * ethplorer.ETH.price.rate
            this.tokens[0].amount = ethplorer.ETH.balance
            this.tokens[0].price = ethplorer.ETH.price.rate
            let data = ethplorer.tokens
              ? ethplorer.tokens.find(
                (o) =>
                  o.tokenInfo.address.toLowerCase() ===
                    this.denominationData.address.toLowerCase()
              )
              : false

            this.tokens.push({
              address: this.denominationData.address,
              type: this.denominationData.symbol,
              decimals: data ? data.tokenInfo.decimals : null,
              image:
                'https://token.enzyme.finance/' + this.denominationData.address,
              amount: data ? data.balance / 10 ** data.tokenInfo.decimals : 0,
              usd: data
                ? (data.balance / 10 ** data.tokenInfo.decimals) *
                  data.tokenInfo.price.rate
                : 0,
              price: data ? data.tokenInfo.price.rate : 0
            })
            if (this.actionType === 'deposit') {
              this.selected =
                this.tokens[0].amount === 0 ? this.tokens[1] : this.tokens[0]
            }
          }
        })
    }
  },
  computed: {
    maxDeposit () {
      let amount = 0
      if (this.actionType === 'deposit') {
        amount = this.selected
          ? this.selected.amount -
            (this.gas.eth && this.selected.type === 'ETH' ? this.gas.eth : 0)
          : 0
      } else if (this.actionType === 'withdraw' && this.currentUserDeposits) {
        let totalDeposits = this.currentUserDeposits
          .filter((o) => o.__typename === 'SharesBoughtEvent')
          .reduce(function (a, b) {
            return a + parseFloat(b['shares'])
          }, 0)
        let totalRedeems = this.currentUserDeposits
          .filter((o) => o.__typename === 'SharesRedeemedEvent')
          .reduce(function (a, b) {
            return a + parseFloat(b['shares'])
          }, 0)
        amount = totalDeposits - totalRedeems
      }
      return amount
    }
  },
  watch: {
    maxDeposit () {
      if (parseFloat(this.amount) > this.maxDeposit) {
        this.amount = this.maxDeposit
        this.message =
          'Max deposit amount changed to ' +
          this.maxDeposit +
          ' because of gas fees'
        this.txObject = null
        this.getTransactionObject()
      }
    }
  },
  data () {
    return {
      alert: true,
      currentUserDeposits: null,
      approvalRequired: false,
      confirmWindow: false,
      status: false,
      pendingAction: null,
      txObject: null,
      whitelistRequired: false,
      message: '',
      selected: null,
      denominationData: null,
      gas: {
        usd: null,
        eth: null
      },
      txHash: false,
      spinnerVisible: false,
      error: null,
      amount: 0,
      tokens: [
        {
          type: 'ETH',
          image: '',
          amount: null,
          usd: null
        }
      ]
    }
  },
  async created () {
    if (this.actionType === 'whitelistRequired') { this.whitelistRequired = true }
    this.denominationData = this.EnzymeData.denominationAssetData
    this.getDeposits()
    this.getUserBalance()
    this.spinnerVisible = false
  }
}
</script>
<style lang="scss" scoped>
/deep/ .q-btn {
  text-transform: capitalize !important;
}
.my-3,
.leading-5 {
  display: none !important;
}
.not-selected {
  background: #e9e9e9 !important ;
  color: #a1a1a1 !important ;
}

*,
::after,
::before {
  box-sizing: border-box;
}
button,
input {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
button {
  text-transform: none;
}
[type="button"],
[type="submit"],
button {
  -webkit-appearance: button;
}
::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
:-moz-focusring {
  outline: 1px dotted ButtonText;
}
h3,
p {
  margin: 0;
}
button {
  background-color: transparent;
  background-image: none;
}
*,
::after,
::before {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
img {
  border-style: solid;
}
input::-moz-placeholder {
  opacity: 1;
  color: #9ca3af;
}
input:-ms-input-placeholder {
  opacity: 1;
  color: #9ca3af;
}
input::placeholder {
  opacity: 1;
  color: #9ca3af;
}
button {
  cursor: pointer;
}
h3 {
  font-size: inherit;
  font-weight: inherit;
}
button,
input {
  padding: 0;
  line-height: inherit;
  color: inherit;
}
img,
svg {
  display: block;
  vertical-align: middle;
}
img {
  max-width: 100%;
  height: auto;
}
*,
::after,
::before {
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-transform: translateX(var(--tw-translate-x))
    translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
    scaleY(var(--tw-scale-y));
  --tw-border-opacity: 1;
  border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  --tw-ring-offset-shadow: 0 0 rgba(0, 0, 0, 0);
  --tw-ring-shadow: 0 0 rgba(0, 0, 0, 0);
  --tw-shadow: 0 0 rgba(0, 0, 0, 0);
  --tw-ring-inset: var(--tw-empty);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(59, 130, 246, 0.5);
  --tw-ring-offset-shadow: 0 0 rgba(0, 0, 0, 0);
  --tw-ring-shadow: 0 0 rgba(0, 0, 0, 0);
  --tw-shadow: 0 0 rgba(0, 0, 0, 0);
  --tw-blur: var(--tw-empty);
  --tw-brightness: var(--tw-empty);
  --tw-contrast: var(--tw-empty);
  --tw-grayscale: var(--tw-empty);
  --tw-hue-rotate: var(--tw-empty);
  --tw-invert: var(--tw-empty);
  --tw-saturate: var(--tw-empty);
  --tw-sepia: var(--tw-empty);
  --tw-drop-shadow: var(--tw-empty);
  --tw-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
    var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate)
    var(--tw-sepia) var(--tw-drop-shadow);
  --tw-backdrop-blur: var(--tw-empty);
  --tw-backdrop-brightness: var(--tw-empty);
  --tw-backdrop-contrast: var(--tw-empty);
  --tw-backdrop-grayscale: var(--tw-empty);
  --tw-backdrop-hue-rotate: var(--tw-empty);
  --tw-backdrop-invert: var(--tw-empty);
  --tw-backdrop-opacity: var(--tw-empty);
  --tw-backdrop-saturate: var(--tw-empty);
  --tw-backdrop-sepia: var(--tw-empty);
  --tw-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);
}
[type="text"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  border-radius: 0;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
}
[type="text"]:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    0 0 transparent;
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 transparent);
  border-color: #2563eb;
}
input::-moz-placeholder {
  color: #6b7280;
  opacity: 1;
}
input:-ms-input-placeholder {
  color: #6b7280;
  opacity: 1;
}
input::placeholder {
  color: #6b7280;
  opacity: 1;
}
button {
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.pointer-events-none {
  pointer-events: none;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.inset-y-0 {
  top: 0;
  bottom: 0;
}
.right-0 {
  right: 0;
}
.left-1\/4 {
  left: 25%;
}
.top-1\/2 {
  top: 50%;
}
.z-20 {
  z-index: 20;
}
.z-0 {
  z-index: 0;
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-3 {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}
.-ml-px {
  margin-left: -1px;
}
.mt-4 {
  margin-top: 1rem;
}
.mb-8 {
  margin-bottom: 0.4rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.hidden {
  display: none;
}
.h-5 {
  height: 1.25rem;
}
.h-4 {
  height: 1rem;
}
.w-full {
  width: 100%;
}
.w-4 {
  width: 1rem;
}
.w-5 {
  width: 1.25rem;
}
.w-1\/2 {
  width: 50%;
}
.min-w-0 {
  min-width: 0;
}
.max-w-full {
  max-width: 100%;
}
.flex-none {
  flex: none;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.cursor-pointer {
  cursor: pointer;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.items-end {
  align-items: flex-end;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.overflow-hidden {
  overflow: hidden;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mt-6 {
  display: none;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.border {
  border-width: 1px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity));
}
.border-transparent {
  border-color: transparent;
}
.border-gray-400 {
  --tw-border-opacity: 1;
  border-color: rgba(156, 163, 175, var(--tw-border-opacity));
}
.border-violet-400 {
  --tw-border-opacity: 1;
  border-color: rgba(140, 120, 253, var(--tw-border-opacity));
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}
.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
}
.bg-violet-600 {
  --tw-bg-opacity: 1;
  background-color: rgba(89, 69, 202, var(--tw-bg-opacity));
}
.bg-violet-500 {
  --tw-bg-opacity: 1;
  background-color: rgba(111, 86, 253, var(--tw-bg-opacity));
}
.p-1 {
  padding: 0.25rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-0\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
.px-1\.5 {
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.pr-3 {
  padding-right: 0.75rem;
}
.pl-1 {
  padding-left: 0.25rem;
}
.text-left {
  text-align: left;
}
.align-bottom {
  vertical-align: bottom;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-normal {
  font-weight: 400;
}
.leading-5 {
  line-height: 1.25rem;
}
.leading-4 {
  line-height: 1rem;
}
.leading-6 {
  line-height: 1.5rem;
}
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
}
.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-text-opacity));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgba(107, 114, 128, var(--tw-text-opacity));
}
.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgba(75, 85, 99, var(--tw-text-opacity));
}
.text-violet-500 {
  --tw-text-opacity: 1;
  color: rgba(111, 86, 253, var(--tw-text-opacity));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgba(255, 255, 255, var(--tw-text-opacity));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgba(55, 65, 81, var(--tw-text-opacity));
}
.placeholder-gray-400::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
}
.placeholder-gray-400:-ms-input-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
}
.placeholder-gray-400::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-25 {
  opacity: 0.25;
}
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 transparent, 0 0 transparent, var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 transparent),
    var(--tw-ring-shadow, 0 0 transparent), var(--tw-shadow);
}
.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  box-shadow: 0 0 transparent, 0 0 transparent, var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 transparent),
    var(--tw-ring-shadow, 0 0 transparent), var(--tw-shadow);
}
.transition {
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter,
    -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.first\:ml-0:first-child {
  margin-left: 0;
}
.first\:rounded-l-md:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}
.last\:rounded-r-md:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
.hover\:bg-violet-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(89, 69, 202, var(--tw-bg-opacity));
}
.hover\:bg-gray-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
}
.hover\:text-gray-900:hover {
  --tw-text-opacity: 1;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
}
.focus\:z-10:focus {
  z-index: 10;
}
.focus\:border-violet-500:focus {
  --tw-border-opacity: 1;
  border-color: rgba(111, 86, 253, var(--tw-border-opacity));
}
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    0 0 transparent;
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 transparent);
}
.focus\:ring-violet-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgba(111, 86, 253, var(--tw-ring-opacity));
}
.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}
.active\:bg-violet-500:active {
  --tw-bg-opacity: 1;
  background-color: rgba(111, 86, 253, var(--tw-bg-opacity));
}
.active\:text-gray-900:active {
  --tw-text-opacity: 1;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
}
.disabled\:cursor-default:disabled {
  cursor: default;
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.dark .dark\:border-gray-600 {
  --tw-border-opacity: 1;
  border-color: rgba(75, 85, 99, var(--tw-border-opacity));
}
.dark .dark\:border-gray-500 {
  --tw-border-opacity: 1;
  border-color: rgba(107, 114, 128, var(--tw-border-opacity));
}
.dark .dark\:border-violet-600 {
  --tw-border-opacity: 1;
  border-color: rgba(89, 69, 202, var(--tw-border-opacity));
}
.dark .dark\:bg-gray-800 {
  --tw-bg-opacity: 1;
  background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
}
.dark .dark\:bg-gray-600 {
  --tw-bg-opacity: 1;
  background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
}
.dark .dark\:bg-gray-850 {
  --tw-bg-opacity: 1;
  background-color: rgba(24, 32, 50, var(--tw-bg-opacity));
}
.dark .dark\:bg-violet-400 {
  --tw-bg-opacity: 1;
  background-color: rgba(140, 120, 253, var(--tw-bg-opacity));
}
.dark .dark\:bg-gray-700 {
  --tw-bg-opacity: 1;
  background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
}
.dark .dark\:bg-violet-500 {
  --tw-bg-opacity: 1;
  background-color: rgba(111, 86, 253, var(--tw-bg-opacity));
}
.dark .dark\:text-gray-200 {
  --tw-text-opacity: 1;
  color: rgba(229, 231, 235, var(--tw-text-opacity));
}
.dark .dark\:text-gray-100 {
  --tw-text-opacity: 1;
  color: rgba(243, 244, 246, var(--tw-text-opacity));
}
.dark .dark\:text-white {
  --tw-text-opacity: 1;
  color: rgba(255, 255, 255, var(--tw-text-opacity));
}
.dark .dark\:text-gray-400 {
  --tw-text-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-text-opacity));
}
.dark .dark\:text-gray-300 {
  --tw-text-opacity: 1;
  color: rgba(209, 213, 219, var(--tw-text-opacity));
}
.dark .dark\:text-violet-500 {
  --tw-text-opacity: 1;
  color: rgba(111, 86, 253, var(--tw-text-opacity));
}
.dark .dark\:text-gray-500 {
  --tw-text-opacity: 1;
  color: rgba(107, 114, 128, var(--tw-text-opacity));
}
.dark .dark\:text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
}
@media (min-width: 640px) {
  .sm\:my-8 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .sm\:flex {
    display: flex;
  }
  .sm\:min-h-\[320px\] {
    /* min-height: 320px; */
  }
  .sm\:max-w-lg {
    max-width: 32rem;
  }
  .sm\:justify-between {
    justify-content: space-between;
  }
  .sm\:space-y-0 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
  }
  .sm\:space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .sm\:p-6 {
    padding: 1.5rem;
  }
  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .sm\:py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .sm\:pt-6 {
    padding-top: 1.5rem;
  }
  .sm\:align-middle {
    vertical-align: middle;
  }
  .sm\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}
@media (min-width: 768px) {
  .md\:flex {
    display: flex;
  }
  .md\:grid {
    display: grid;
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\:justify-end {
    justify-content: flex-end;
  }
  .md\:gap-4 {
    grid-gap: 1rem;
    gap: 1rem;
  }
  .md\:space-y-0 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
  }
}
</style>
<style lang="scss" scoped>
.dark_dialog_deposit {
  background: #111827 !important;
  border-radius: 30px !important;
  .deposit_header_bg {
    color: #fff !important;
    background: #111827 !important;
    border-bottom: 1px solid rgba(white, 0.1);
  }
  .whitelist_wrapper {
    color: #fff !important;
    background: #111827 !important;
  }
  #modal-headline {
    color: #fff !important;
  }
  .toggle_buttons {
    button {
      color: #fff !important;
      background: #1a253d !important;
      border: 1px solid rgba(white, 0.05);
      &.not-selected {
        background: #111827 !important;
        border: 1px solid rgba(white, 0.5);
        opacity: 0.2;
      }
    }
  }
  .close_button {
    background: #111827 !important;
    color: #fff !important;
  }
  .vault_operates_text {
    color: #fff !important;
  }
  .hs-form-d7de67c5-a85b-4bce-b380-b09d2d73d4ad_9c56a944-347c-4d38-a396-03c57d7aed26
    .hs-form-field
    label {
    color: #ccc !important;
    span {
      color: #ccc !important;
    }
  }
}
.vault_operates_text {
  padding-left: 15px;
  padding-right: 15px;
}
.deposit_button {
  margin-top: 20px;
}
a {
  text-decoration: none;
}
</style>
