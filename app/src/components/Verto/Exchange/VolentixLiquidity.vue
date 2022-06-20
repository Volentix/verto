<template>
 <div class="" v-if="depositCoin && destinationCoin">
   <!-- $q.screen.width > 1024 &&  -->
  <div class="row">
   <div class="col col-12 col-md-8">
    <div class="apps-section">
     <!-- 1inch component -->
     <!-- add your code here -->
     <q-dialog v-model="getPassword" persistent>
      <q-card>
       <q-card-section>
        <div
         class="send-modal flex flex-center"
         :class="{ open: openModal }"
        >
         <div class="send-modal__content q-pa-md column flex-center">
          <div class="send-modal__content--head">
           <span class="text-h5 --amount">Private key password</span>
           <q-btn
            color="white"
            rounded
            flat
            unelevated
            @click="hideModalFun()"
            class="close-btn"
            text-color="black"
            label="+"
           />
          </div>
          <div
           class="send-modal__content--body column flex-center full-width"
          >
           <q-input
            v-model="privateKeyPassword"
            light
            rounded
            outlined
            class="full-width"
            color="green"
            label="Private Key Password"
            @input="checkPrivateKeyPassword"
            debounce="500"
            @keyup.enter="sendTransaction()"
            :type="isPwd ? 'password' : 'text'"
            :error="invalidPrivateKeyPassword"
            error-message="The private key password is invalid"
           >
            <template v-slot:append>
             <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
             />
            </template>
           </q-input>

           <div class="flex justify-start full-width">
            <q-btn
             v-close-popup
             @click="spinnervisible = false"
             unelevated
             color="grey"
             class="--next-btn mr10"
             rounded
             label="Cancel"
            />
            <q-btn
             @click="
              checkPrivateKeyPassword();
              sendTransaction();
             "
             unelevated
             color="deep-purple-14"
             class="--next-btn q-ml-md"
             rounded
             label="Submit transaction"
            />
           </div>
          </div>
          <div class="send-modal__content--footer">
           <div class="text-h4 --error" v-if="ErrorMessage">
            {{ ErrorMessage }}
           </div>
          </div>
         </div>
        </div>
       </q-card-section>
      </q-card>
     </q-dialog>
     <!-- Vdex component -->
     <div class="">
      <div class="chain-tools-wrapper--list open">
       <div class="list-wrapper">
        <div class="row">
         <div class="col col-12">
          <div class="trade-component">
           <!-- <img src="statics/theme1/Screenshot_208.png" alt="" style="opacity: .1"> -->
           <div v-if="step === 1" class="prototype">
            <q-tabs
             @click="
              getPairData();
              checkBalance();
             "
             v-if="false"
             flat
             v-model="tab"
             indicator-color="indigo-5"
             no-caps
             inline-label
             class="shadow-1 text-h6"
            >
             <q-tab name="swap" icon="swap_vert" label="Swap" />

             <q-tab
              name="liquidity"
              icon="add"
              label="Liquidity"
             />
            </q-tabs>
            <div class="head" v-if="tab == 'swap'">
             Get {{ destinationCoin.label }} with
             {{ depositCoin.label }} with one click
            </div>
            <div
             class="head"
             v-else-if="
              tab == 'liquidity' &&
              pairData &&
              pairData.liquidity_token !== 0
             "
            >
             Add liquidity to the
             {{ destinationCoin.label.toUpperCase() }} +
             {{ depositCoin.label.toUpperCase() }} pool
            </div>
            <div
             class="q-pl-lg"
             v-else-if="
              tab == 'liquidity' &&
              (!pairData ||
               (pairData && pairData.liquidity_token === 0))
             "
            >
             <p class="q-pt-md">
              Liquidity has not been created yet
             </p>
             <p class="text-body2 no-padding">
              Create liquidity and become the first liquidity
              provider
             </p>
            </div>
            <div class="you-pay">
             <div class="you-pay-head row items-center">
              <div class="col col-6">
               Payment {{ depositCoinOptions.length }}
              </div>
              <!-- <div class="col col-6 red text-right text-red">Max 0 USDT</div> -->
             </div>
             <div class="you-pay-body row items-center">
              <div class="col col-3 choose-coin">
               <span class="cursor">
                <q-select
                 class="select-input"
                 light
                 separator
                 use-input
                 borderless
                 rounded
                 v-model="depositCoin"
                 @input="
                  swapData.error = false;
                  getDestinationCoinOptions();
                  getPairData();
                 "
                 @filter="filterDepositCoin"
                 :disabled="!depositCoinOptions"
                 :loading="!depositCoinOptions"
                 :options="depositCoinOptions"
                >
                 <template v-slot:option="scope">
                  <q-item
                   class="custom-menu"
                   @click="depositCoin = scope.opt"
                   v-bind="scope.itemProps"
                   v-on="scope.itemEvents"
                  >
                   <q-item-section avatar>
                    <q-icon
                     :name="`img:${scope.opt.image}`"
                    />
                   </q-item-section>
                   <q-item-section>
                    <q-item-label
                     v-html="scope.opt.label"
                    />
                    <q-item-label caption>{{
                     scope.opt.contract
                    }}</q-item-label>
                    <q-item-label
                     v-if="scope.opt.amount"
                     caption
                     >{{ scope.opt.amount }}</q-item-label
                    >
                    <q-item-label
                     v-if="scope.opt.name"
                     caption
                     >{{ scope.opt.name }}</q-item-label
                    >
                   </q-item-section>
                  </q-item>
                 </template>
                 <template v-slot:selected>
                  <span class="text-h5 text-bold">{{
                   depositCoin.value.toUpperCase()
                  }}</span>
                  <q-item-label
                   v-if="depositCoin.name"
                   caption
                   >{{ depositCoin.name }}</q-item-label
                  >
                 </template>
                </q-select>
               </span>
              </div>
              <div class="col col-8 offset-1">
               <p
                class="no-padding text-body2"
                v-if="!pairData && tab != 'swap'"
               >
                Set the initial
                {{ depositCoin.value.toUpperCase() }} ratio
               </p>
               <q-input
                @blur="
                 swapData.fromAmount = parseFloat(
                  swapData.fromAmount
                 ).toFixed(depositCoin.precision)
                "
                outlined
                class="bg-white text-h5"
                ref="depositQuantity"
                @input="
                swapData.fromAmount = isNaN(swapData.fromAmount) ? 0 : swapData.fromAmount
                 amount1Input();
                 swapData.error = false;
                 getPairData();
                 privateKey = false;
                "
                v-model="swapData.fromAmount"

                :disabled="spinnervisible"
                :loading="spinnervisible"
                :rules="[
                 (val) =>
                 true ||
                  val <= depositCoin.amount ||
                  'Insufficient funds',
                ]"
               >
                <div
                 class="flex justify-end items-center"
                 style="width: 60px"
                >
                 <q-icon
                  v-if="depositCoin"
                  class="option--avatar"
                  :name="`img:${depositCoin.image}`"
                 />
                </div>
                <template v-slot:hint>
                 <div class="text-body1">
                  Balance: {{ depositCoin.amount }}
                 </div>
                </template>
               </q-input>
              </div>
             </div>
            </div>
            <div class="you-receive">
             <br />
             <q-btn
              outline
              round
              color="black"
              icon="swap_vert"
              @click="switchAmounts()"
              class="swap_vert"
             />
             <div class="you-receive-head row items-center">
              <div class="col col-6" v-if="tab != 'liquidity'">
               You Receive
              </div>
              <div
               v-if="rateData"
               class="col col-6 info_rate_holder small text-right flex justify-end items-center"
               :class="{ _loading: fetchingRate }"
              >
               <!-- 1 ETH = 374.705 USDT -->
               <span>{{
                "1 " +
                fromCoinType.toUpperCase() +
                "&nbsp;= &nbsp;" +
                rateData.rate.toFixed(5) +
                " " +
                destinationCoinType.toUpperCase()
               }}</span>
               <div class="info_rate">
                <span class="i-btn"
                 >i
                 <!-- <img src="statics/theme1/rate-info.png" class="rate-info-prototype" alt=""> -->
                 <div class="info_rate_wrapper text-left">
                  <div class="title">
                   We got you the best price
                  </div>
                  <hr />
                  <div
                   class="lineheight flex justify-between items-center"
                  >
                   <span>Max Deposit</span>
                   <span
                    >{{ rateData.limitMaxDepositCoin }}
                    {{ fromCoinType.toUpperCase() }}</span
                   >
                  </div>
                  <div
                   class="lineheight flex justify-between items-center"
                  >
                   <span>Max Destination</span>
                   <span
                    >{{ rateData.limitMaxDestinationCoin }}
                    {{
                     destinationCoinType.toUpperCase()
                    }}</span
                   >
                  </div>
                  <div
                   class="lineheight flex justify-between items-center"
                  >
                   <span>Min Deposit</span>
                   <span
                    >{{ rateData.limitMinDepositCoin }}
                    {{ fromCoinType.toUpperCase() }}</span
                   >
                  </div>
                  <div
                   class="lineheight flex justify-between items-center"
                  >
                   <span>Min Destination</span>
                   <span
                    >{{ rateData.limitMinDestinationCoin }}
                    {{
                     destinationCoinType.toUpperCase()
                    }}</span
                   >
                  </div>
                 </div>
                </span>
               </div>
              </div>
             </div>
             <div class="you-receive-body row items-center">
              <div class="col col-3 choose-coin">
               <span class="cursor">
                <q-select
                 class="select-input"
                 light
                 separator
                 use-input
                 rounded
                 borderless
                 @input="
                  swapData.error = false;
                  getPairData();
                 "
                 @filter="filterDestinationCoin"
                 v-model="destinationCoin"
                 :disabled="!destinationCoinOptions"
                 :loading="false"
                 :options="destinationCoinOptions"
                >
                 <template v-slot:option="scope">
                  <q-item
                   class="custom-menu"
                   v-bind="scope.itemProps"
                   v-on="scope.itemEvents"
                  >
                   <q-item-section avatar>
                    <q-icon
                     :name="`img:${scope.opt.image}`"
                    />
                   </q-item-section>
                   <q-item-section>
                    <q-item-label
                     v-html="scope.opt.label"
                    />
                    <q-item-label caption>{{
                     scope.opt.contract
                    }}</q-item-label>
                   </q-item-section>
                  </q-item>
                 </template>
                 <template v-slot:selected>
                  <span class="text-h5 text-bold">{{
                   destinationCoin.value.toUpperCase()
                  }}</span>
                 </template>
                </q-select>
               </span>
              </div>
              <div class="col col-8 offset-1">
               <p
                class="no-padding text-body2"
                v-if="!pairData && tab != 'swap'"
               >
                Set the initial
                {{ destinationCoin.value.toUpperCase() }} ratio
               </p>
               <q-input
               @input="swapData.toAmount = isNaN(swapData.toAmount) ? 0 : swapData.toAmount"
                @blur="
                 swapData.toAmount = parseFloat(
                  swapData.toAmount
                 ).toFixed(destinationCoin.precision)
                "
                :disable="
                 !(
                  tab == 'liquidity' &&
                  (!pairData ||
                   (pairData &&
                    pairData.liquidity_token === 0))
                 )
                "
                outlined
                class="bg-white text-h5"
                ref="destinationQuantity"
                :loading="spinnervisible"
                v-model="swapData.toAmount"

               >
                <div
                 class="flex justify-end items-center"
                 style="width: 60px"
                >
                 <q-icon
                  v-if="destinationCoin"
                  class="option--avatar"
                  :name="`img:${destinationCoin.image}`"
                 />
                </div>
                <template v-slot:hint>
                 <div class="text-body1">
                  Balance: {{ depositCoin.amount }}
                 </div>
                </template>
               </q-input>
              </div>
             </div>
             <div
              class="you-receive-body row items-center q-mt-sm"
              v-if="!pairData && tab != 'swap'"
             >
              <div class="col col-4 choose-coin">
               <span class="cursor text-body1 q-pt-md">
                INITIAL FEE <br />
               </span>
              </div>
              <div class="col col-3">
               <q-input
                :disable="
                 !(
                  tab == 'liquidity' &&
                  (!pairData ||
                   (pairData &&
                    pairData.liquidity_token === 0))
                 )
                "
                outlined
                class="bg-white text-h5"
                ref="fees"
                :loading="spinnervisible"
                v-model="swapData.feesAmount"
                @input="swapData.feesAmount = isNaN(swapData.feesAmount) ? 0 : swapData.feesAmount"
                @blur="
                 swapData.feesAmount =
                  parseFloat(swapData.feesAmount) < 0 ||
                  parseFloat(swapData.feesAmount) > 1
                   ? 0
                   : parseFloat(swapData.feesAmount)
                "

               >
                <template v-slot:append>
                 %
                </template>
                <template v-slot:hint>
                 <div class="text-body1">
                  Balance: {{ depositCoin.amount }}
                 </div>
                </template>
               </q-input>
              </div>

              <div class="normal-line-height">
               <span class="text-body2 q-pl-sm text-bold"
                >A decimal number from:</span
               ><br />
               <span class="text-body2 q-pl-sm"> 0 - 1</span>
              </div>
             </div>
             <div class="text-red text-body1 q-mt-sm" v-if="error">
              <span v-if="error == 'gas'">
               {{
                swapData.errorText
                 .replace("[from]", depositCoin.value)
                 .replace("[to]", destinationCoin.value)
               }}
              </span>
              <span class="hiddenError" >
               {{ error }}
              </span>
             </div>

             <q-btn
              v-if="error && tab != 'liquidity'"
              unelevated
              :disable="true"
              color="grey-4"
              text-color="black"
              :label="error"
              class="text-capitalize invalid_btn full-width"
             />
             <q-btn
              v-else-if="tab == 'liquidity'"
              unelevated
              @click="sendTransaction()"
              :loading="spinnervisible"
              :disable="
               tab != 'liquidity' &&
               (parseFloat(swapData.toAmount) === 0 ||
                parseFloat(depositCoin.amount) <
                 parseFloat(swapData.fromAmount) ||
                spinnervisible)
              "
              color="primary"
              text-color="black"
              :label="
               !pairData ||
               (pairData && pairData.liquidity_token === 0)
                ? 'Create liquidity'
                : 'Add liquidity'
              "
              class="text-capitalize chose_accounts full-width"
             />
             <q-btn
              v-else
              unelevated
              @click="sendTransaction()"
              :loading="spinnervisible"
              :disable="
               parseFloat(swapData.toAmount) === 0 ||

               spinnervisible
              "
              color="primary"
              text-color="black"
              :label="
               tab != 'liquidity' ? 'Swap now' : 'Add liquidity'
              "
              class="text-capitalize chose_accounts full-width"
             />
            </div>
           </div>
           <div v-if="step === 2" class="prototype">
            <div class="head">
             <q-btn
              flat
              @click="step = 1"
              unelevated
              icon="keyboard_arrow_left"
              rounded
              color="grey"
              label="Back"
              class="--next-btn q-mr-md"
             />
             Order Submitted
            </div>
            <div class="standard-content--body">
             <div
              class="standard-content--body__form q-pa-md q-pb-xl"
             >
              <div
               class="progress-custom-volentix column flex-center"
              >
               <svg
                class="svg_logo"
                fill="#7272FA"
                width="40"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 20.58"
               >
                <path
                 d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
                 transform="translate(-183 -18.21)"
                ></path>
               </svg>
               <span class="title">{{ transactionStatus }}</span>
               <q-linear-progress
                v-if="transactionStatus == 'Pending'"
                indeterminate
                stripe
                rounded
                size="md"
                class="q-mt-md"
               />
              </div>
              <hr style="height: 15px; opacity: 0" />
              <div class="text-black">
               <div class="text-h4 --subtitle">{{ "" }}</div>
               <p
                v-if="transactionHash && freeCPU"
                class="text-body2 text-center"
               >
                <b>You got FREE CPU from Volentix</b
                ><br />
                <!-- <a href="">Click here to learn more</a> -->
               </p>

               <q-input
                v-if="transactionHash"
                bottom-slots
                v-model="transactionHash"
                readonly
                rounded
                class="input-input pr80"
                outlined
                color="purple"
                type="text"
               >
                <template v-slot:append>
                 <div class="flex justify-end">
                  <q-btn
                   flat
                   unelevated
                   text-color="grey"
                   @click="
                    copyToClipboard(
                     transactionHash,
                     'Transaction hash'
                    )
                   "
                   round
                   class="btn-copy"
                   icon="file_copy"
                  />
                 </div>
                </template>
                <template v-slot:hint>
                 <div
                  class="cursor-pointer q-pl-lg q-pt-sm"
                  @click="step = 1"
                 >
                  <q-icon name="keyboard_backspace" /> Go Back
                 </div>
                </template>
                <template v-slot:counter>
                 <a
                  :href="
                   'https://bloks.io/transaction/' +
                   transactionHash
                  "
                  class="text-body2 text-black"
                  target="_blank"
                 >
                  Follow
                  <img
                   width="18"
                   src="https://bloks.io/favicon-32x32.png?v=BG7PP2QPNi"
                  />
                 </a>
                </template>
               </q-input>
              </div>
              <div
               style="margin-top: 40px"
               class="prototype text-center q-pa-md q-mt-lg"
               v-if="
                tab == 'liquidity' &&
                transactionStatus == 'Success'
               "
              >
               <div
                v-if="transaction.name == 'createpair'"
               >
                <p>
                 You successfully created the liquidity pool
                </p>
                <p>
                 {{ depositCoin.label.toUpperCase() }} +
                 {{ destinationCoin.label.toUpperCase() }}
                </p>

                <p class="cursor-pointer" @click="step = 1">
                 Go back to add liquidity
                </p>
               </div>
               <div v-else>
                <p>Successfully joined the liquidity pool</p>
                <p v-if="pairData && pairData.supply">
                 LP Tokens
                 {{
                  pairData.supply.symbol.code().to_string()

                 }}
                 <br />has been released to your account
                </p>

               </div>
              </div>
             </div>
            </div>
           </div>
          </div>
         </div>
         <!-- <div class="col col-6">
           <img src="statics/theme1/Screenshot_208.png" alt="">
          </div> -->
        </div>
        <!-- <br><br><br> -->
       </div>
      </div>
     </div>
    </div>
   </div>
   <div
   style="max-width:30%;"
    class="col summary-wrapper shadow-1 col-md-4 q-pa-lg column justify-center items-start"
   >
    <q-list class="summary-wrapper__list" separator>
     <q-item class="q-my-sm" clickable v-ripple>
      <div class="text-h6">Summary</div>
     </q-item>
     <q-item class="q-my-sm text-left" clickable v-ripple>
      <q-item-section avatar>
       <q-icon
        v-if="depositCoin"
        class="option--avatar"
        :name="`img:${depositCoin.image}`"
       />
      </q-item-section>

      <q-item-section>
       <q-item-label>You send</q-item-label>
       <q-item-label caption class="text-bold" lines="1"
        >{{ this.swapData.fromAmount }}
        {{ depositCoin.label.toUpperCase() }}</q-item-label
       >
      </q-item-section>
     </q-item>
     <q-item class="q-my-sm text-left" clickable v-ripple>
      <q-item-section avatar>
       <q-icon
        v-if="depositCoin"
        class="option--avatar"
        :name="`img:${destinationCoin.image}`"
       />
      </q-item-section>

      <q-item-section>
       <q-item-label>{{
        tab == "swap" ? "You will receive" : "You send"
       }}</q-item-label>
       <q-item-label class="text-bold" caption lines="1"
        >{{ this.swapData.toAmount }}
        {{ destinationCoin.label.toUpperCase() }}</q-item-label
       >
      </q-item-section>
     </q-item>

     <q-item
      class="q-my-sm"
      v-if="
       tab == 'liquidity' &&
       depositCoin.liquidityMultiplier &&
       pairData &&
       pairData.miningData
      "
      clickable
      v-ripple
     >
      <q-item-section>
       <q-item-label>You will receive</q-item-label>
       <q-item-label class="text-bold" caption lines="1"
        >{{
         parseInt(
          this.swapData.fromAmount *
           this.depositCoin.liquidityMultiplier
         )
        }}
        {{ pairData.miningData.code }}</q-item-label
       >
      </q-item-section>
     </q-item>

     <q-item class="q-my-sm text-left" v-if="pairData">
      <q-item-section>
       <q-item-label class="text-bold">Liquidity</q-item-label>

       <q-item-label lines="1">{{
        pairData.pool1.quantity
       }}</q-item-label>
       <q-item-label lines="1">{{
        pairData.pool2.quantity
       }}</q-item-label>
        <q-item-label lines="1">{{
         pairData.supply
       }}</q-item-label>
       <q-item-label lines="1"> Fees: {{
         pairData.fee * 0.01
       }}
       </q-item-label>
      </q-item-section>
     </q-item>
    </q-list>
    <div class="text-h6 q-pt-md" v-if="path.length && tab != 'liquidity'">
     Multi Swap Path
    </div>
    <q-list separator v-if="path.length && tab != 'liquidity'">
     <q-item class="q-my-sm" clickable v-ripple>
      <q-item-section>
       <q-icon
        v-if="depositCoin"
        class="option--avatar"
        :name="`img:${depositCoin.image}`"
       />
       <q-item-label caption class="text-bold text-center q-mt-sm">{{
        depositCoin.label
       }}</q-item-label>
      </q-item-section>

      <q-item-section>
       <q-item-label caption class="text-bold">></q-item-label>
      </q-item-section>
      <q-item-section>
       <q-icon
        v-if="depositCoin"
        class="option--avatar"
        :name="`img:https://defibox.s3.ap-northeast-1.amazonaws.com/eos/eosio.token-eos.png`"
       />
       <q-item-label caption class="text-bold text-center q-mt-sm">
        EOS</q-item-label
       >
      </q-item-section>

      <q-item-section>
       <q-item-label caption class="text-bold"> ></q-item-label>
      </q-item-section>

      <q-item-section>
       <q-icon
        v-if="depositCoin"
        class="option--avatar"
        :name="`img:${destinationCoin.image}`"
       />
       <q-item-label class="text-bold text-center q-mt-sm" caption>{{
        destinationCoin.label
       }}</q-item-label>
      </q-item-section>
     </q-item>

     <q-item class="q-my-sm" clickable v-ripple>
      <div class="text-h6">Summary</div>
     </q-item>
     <q-item class="q-my-sm text-left" clickable v-ripple>
      <q-item-section avatar>
       <q-icon
        v-if="depositCoin"
        class="option--avatar"
        :name="`img:${depositCoin.image}`"
       />
      </q-item-section>

      <q-item-section>
       <q-item-label>You send</q-item-label>
       <q-item-label caption class="text-bold" lines="1"
        >{{ this.swapData.fromAmount }}
        {{ depositCoin.label.toUpperCase() }}</q-item-label
       >
      </q-item-section>
     </q-item>
    </q-list>
    <div
     v-if="
      false &&
      tab == 'liquidity' &&
      (!pairData || (pairData && pairData.liquidity_token === 0))
     "
    >
     <p class="q-pt-md">Liquidity has not been created yet</p>
     <p class="q-pt-md">
      Create liquidity and become the first liquidity provider
     </p>
     <p class="q-pt-md">Set the initial swap price freely</p>
    </div>
   </div>
<TestnetPools class="full-width"/>
  </div>
 </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
let rpc, api, signatureProvider
import TestnetPools from '../../../components/Verto/Defi/TestnetPools'
import initWallet from '@/util/_Wallets2Tokens'
import DexInteraction from '../../../mixins/DexInteraction'
import EOSContract from '../../../mixins/EOSContract'
import { EosRPC, EosAPI } from '@/util/EosInterac'
import { asset, number_to_asset } from 'eos-common'
import { preparePool, computeBackward, computeForward } from '@/util/VolentixPools'
// /*, number_to_asset */ import { computeForward, computeBackward, calcPrice } from '@/util/VolentixPools'
let testnetApiObject, testnetRpc

export default {
  components: {
    TestnetPools
  },
  name: 'TestnetLiquidityPools',
  props: ['disableDestinationCoin', 'showLiquidity'],
  data () {
    return {
      eosAccountName: 'berthonytha2',
      tokensBalance: [],
      pools: [],
      openChannels: [],
      name: 'Swapeos',
      openModal: false,
      getPassword: false,
      privateKey: false,
      privateKeyPassword: null,
      invalidPrivateKeyPassword: false,
      ErrorMessage: false,
      isPwd: true,
      step: 1,
      tab: 'swap',
      vpoolsTrigger: 110,
      transactionStatus: 'Pending',
      freeCPU: false,
      spinnervisible: false,
      transactionHash: null,
      error: null,
      rateData: null,
      approvalRequired: false,
      gasOptions: [],
      swapData: {
        marketData: [],
        fromAmount: 1,
        toAmount: 1,
        feesAmount: 0.1,
        errorText:
     'Converting [from] to [to] cannot be done at this moment please try another coin',
        error: false,
        customPriceSlipage: null,
        termsAccepted: false,
        gasPrice: null,
        gas: null,
        ethToUsd: null,
        limitMinDepositCoin: 0,
        limitMaxDepositCoin: 2,
        limitMinDestinationCoin: 1,
        limitMaxDestinationCoin: 2,
        showDisclaimerWrapper: false,
        gasUsd: null
      },
      eosAccount: {
        name: 'berthonytha2'
      },
      eosAccounts: [],
      eos: null,
      tokens: [],
      depositCoin: null,
      destinationCoin: null,
      pairs: [],
      coins: [],
      currentPool: false,
      depositCoinOptions: [],
      depositCoinUnfilter: [],
      destinationCoinUnfilter: [],
      destinationCoinOptions: [],
      pairData: null,
      path: [],
      vpoolsTransactions: {
        initToken: false,
        actions: []
      },
      miningData: [],
      transaction: {}
    }
  },
  async created () {
    testnetRpc = new EosRPC(process.env[this.$store.state.settings.network].EOS_HISTORYAPI)

    testnetApiObject = new EosAPI(
      '5JDCvBSasZRiyHXCkGNQC7EXdTNjima4MXKoYCbs9asRiNvDukc',
      process.env[this.$store.state.settings.network].EOS_HISTORYAPI
    )

    this.getEOSPools()
    let tableData = await this.$store.state.wallets.tokens
    this.eosAccounts = tableData.filter((w) => w.chain === 'eos')
    rpc = new JsonRpc(
      process.env[this.$store.state.settings.network].CACHE +
    'https://eos.greymass.com:443'
    )

    if (this.$store.state.settings.dexData.depositCoin) {
      this.depositCoin = this.$store.state.settings.coins.defibox.find(
        (o) =>
          o.value.toLowerCase() ===
     this.$store.state.settings.dexData.depositCoin.value.toLowerCase()
      )
    }

    if (!this.depositCoin) {
      this.depositCoin = this.$store.state.settings.coins.defibox[0]
    }
    if (this.$store.state.settings.dexData.destinationCoin) {
      this.destinationCoin = this.$store.state.settings.coins.defibox.find(
        (o) =>
          o.value.toLowerCase() ===
     this.$store.state.settings.dexData.destinationCoin.value.toLowerCase()
      )
    }

    if (!this.destinationCoin) {
      this.destinationCoin = this.$store.state.settings.coins.defibox[1]
    }
    // await this.getMinePair()
    // await this.getPools()

    if (this.$store.state.settings.dexData.fromAmount) {
      this.swapData.fromAmount = parseFloat(
        this.$store.state.settings.dexData.fromAmount
      )
      this.getPairData()
    }
    if (this.showLiquidity) {
      this.tab = 'liquidity'
    }
  },
  computed: {
    tokenReceive () {
      const amount1 = this.inputToAsset(this.swapData.fromAmount, this.depositCoin.precision)
      const to_buy = computeBackward(
        amount1.amount,
        this.pairData.supply.amount,
        this.pairData.pool1.quantity.amount,
        this.pairData.fee
      )
      return to_buy
    },
    ...mapState('investment', ['selectedEOSPool'])
  },
  mounted () {
    this.depositCoinOptions = this.$store.state.settings.coins.defibox
    this.destinationCoinUnfilter = this.$store.state.settings.coins.defibox
    this.depositCoinUnfilter = this.$store.state.settings.coins.defibox
    this.depositCoinOptions = this.$store.state.settings.coins.defibox
  },
  methods: {
    async updatePool () {
      let pool = (await testnetRpc.getTable(
        'vpools2',
        this.pairData ? this.pairData.supply.symbol.code().to_string() : this.getTokenSymbol(),
        'stat'
      ))[0]

      this.pairData = preparePool(pool)
      let index = this.pools.findIndex(x => x.supply.symbol.code().to_string() === this.pairData.supply.symbol.code().to_string())

      if (index === -1) {
        this.pools.push(this.pairData)
      } else {
        this.pools[index] = this.pairData
      }
    },
    inputToAsset (input, precision) {
      return asset((parseFloat(input) || 0).toFixed(precision) + ' XXX')
    },
    urlExists (url) {
      return true
    },
    switchAmounts () {
      let depositCoinVar = this.depositCoin
      this.depositCoin = this.destinationCoin
      this.destinationCoin = depositCoinVar
      this.getPairData()
    },

    async getPairData () {
      if (!this.depositCoin) return
      this.error = false
      this.pairData = false
      this.vpoolsTransactions.actions.actions = []
      this.swapData.fromAmount = parseFloat(this.swapData.fromAmount).toFixed(
        this.depositCoin.precision
      )

      let data = this.pools.length ? this.pools.find(p => (p.pool1.quantity.symbol.code().to_string() === this.depositCoin.value.toUpperCase() && p.pool2.quantity.symbol.code().to_string() === this.destinationCoin.value.toUpperCase()) || (p.pool2.quantity.symbol.code().to_string() === this.depositCoin.value.toUpperCase() && p.pool1.quantity.symbol.code().to_string() === this.destinationCoin.value.toUpperCase())) : false
      if (data) {
        this.pairData = data
      }

      if (this.tab !== 'swap') {
        if (this.eosAccount) {
          this.vpoolsTransactions.actions = {
            actions: [
              {
                account: 'vpools2',
                name: 'openext',
                authorization: [
                  { actor: this.eosAccount.name, permission: 'active' }
                ],
                data: {
                  user: this.eosAccount.name,
                  payer: this.eosAccount.name,
                  ext_symbol: {
                    contract: this.destinationCoin.value.toUpperCase() === 'VTX'
                      ? 'volentixtsys'
                      : 'eosio.token',
                    symbol:
           this.destinationCoin.precision +
           ',' +
           this.destinationCoin.value.toUpperCase()
                  }
                }
              },

              {
                account: 'vpools2',
                name: 'openext',
                authorization: [
                  { actor: this.eosAccount.name, permission: 'active' }
                ],
                data: {
                  user: this.eosAccount.name,
                  payer: this.eosAccount.name,
                  ext_symbol: {
                    contract:
           this.depositCoin.value.toUpperCase() === 'VTX'
             ? 'volentixtsys'
             : 'eosio.token',
                    symbol:
           this.depositCoin.precision +
           ',' +
           this.depositCoin.value.toUpperCase()
                  }
                }
              },
              {
                account: this.depositCoin.value.toUpperCase() === 'VTX'
                  ? 'volentixtsys'
                  : 'eosio.token',
                name: 'transfer',
                authorization: [
                  { actor: this.eosAccount.name, permission: 'active' }
                ],
                data: {
                  from: this.eosAccount.name,
                  to: 'vpools2',
                  quantity:
          parseFloat(this.swapData.fromAmount).toFixed(
            4
          ) +
          ' ' +
          this.depositCoin.value.toUpperCase(),
                  memo: 'memo'
                }
              },
              {
                account: this.destinationCoin.value.toUpperCase() === 'VTX'
                  ? 'volentixtsys'
                  : 'eosio.token',
                name: 'transfer',
                authorization: [
                  { actor: this.eosAccount.name, permission: 'active' }
                ],
                data: {
                  from: this.eosAccount.name,
                  to: 'vpools2',
                  quantity:
          parseFloat(this.swapData.toAmount).toFixed(
            4
          ) +
          ' ' +
          this.destinationCoin.value.toUpperCase(),
                  memo: 'memo'
                }
              }
            ]
          }
        }
      } else {
        this.pushSwapAction()
      }

      if (this.tab === 'liquidity') {
        if (!this.pairData) {
          this.pushCreateTokenAction()
        } else {
          this.pushLiquidityActions()
        }
      }

      // this.validateTransaction()
    },

    updateSwapAmounts () {
      if (isNaN(this.swapData.fromAmount)) return

      let input = 'pool1'

      if (this.pairData.pool1.quantity.symbol.code().to_string() === this.depositCoin.value.toUpperCase()) {
        this.poolOne = this.pairData.pool1
        this.poolTwo = this.pairData.pool2
      } else {
        this.poolOne = this.pairData.pool2
        this.poolTwo = this.pairData.pool1
      }

      let a = (parseFloat(this.swapData.fromAmount) || 0).toFixed(this.poolOne.quantity.symbol.precision())

      a = asset(a + ' ' + this.poolOne.quantity.symbol.code().to_string()).amount

      const p1 = this.poolOne.quantity.amount
      const p2 = this.poolTwo.quantity.amount

      if (input === 'pool1') {
        const r = number_to_asset(0, this.poolTwo.quantity.symbol)
        r.set_amount(Math.abs(computeForward(a.multiply(-1), p2, p1.plus(a), this.pairData.fee)))

        this.amount2 = r.to_string().split(' ')[0]
      } else {
        const result = computeForward(
          a.multiply(-1),
          this.pairData.pool1.quantity.amount,
          this.pairData.pool2.quantity.amount + a,
          this.pairData.fee
        ).abs()

        const r = number_to_asset(0, this.pairData.pool1.quantity.symbol)
        r.set_amount(result)

        this.amount2 = r.to_string().split(' ')[0]
      }

      this.swapData.toAmount = this.amount2
    },
    updateLiquidityAmounts () {
      let amount1 = (parseFloat(this.swapData.fromAmount) || 0).toFixed(this.depositCoin.precision)

      amount1 = asset(amount1 + ' ' + this.depositCoin.value.toUpperCase()).amount

      const to_buy = computeBackward(
        amount1,
        this.pairData.supply.amount,
        this.pairData.pool1.quantity.amount,
        this.pairData.fee
      )

      const amount2 = number_to_asset(0, this.pairData.pool2.quantity.symbol)

      amount2.set_amount(
        computeForward(to_buy, this.pairData.pool2.quantity.amount, this.pairData.supply.amount, this.pairData.fee)
      )
      this.swapData.toAmount = amount2.to_string().split(' ')[0]
    },
    amount1Input () {
      if (!this.pairData || isNaN(this.swapData.fromAmount)) return

      if (this.tab === 'swap') {
        this.updateSwapAmounts()
      } else {
        this.updateLiquidityAmounts()
      }
    },
    getTokenSymbol () {
      let from = this.depositCoin.value.toUpperCase().substr(0, 4)
      let to = this.destinationCoin.value.toUpperCase().substr(0, 3)

      let symbol = this.depositCoin.value.toUpperCase() +
        this.destinationCoin.value.toUpperCase()

      if (symbol.length > 7) {
        symbol = from + to
      }

      return symbol
    },
    async getEOSPools () {
      this.accounts = await testnetRpc.getTableByScope(
        'vpools2',
        'stat',
        'accounts'
      )
      this.pools = []
      this.accounts.forEach(async o => {
        let balances = await testnetRpc.getTable(
          'vpools2',
          o.payer,
          'accounts'
        )
        balances.forEach(async o => {
          let token = asset(o.balance)
          let pool = await testnetRpc.getTable(
            'vpools2',
            token.symbol.code().to_string(),
            'stat'
          )
          // pool[0].pool2.quantity = '4.3898 EOS'
          // pool[0].pool1.quantity = '7.7223 USD'
          // pool[0].fee = 1
          if (pool[0]) {
            this.pools.push(preparePool(pool[0]))
          }
        })
      })
    },
    pushCreateTokenAction () {
      this.transaction.name = 'createpair'
      this.vpoolsTransactions.actions.actions.push({
        account: 'vpools2',
        name: 'inittoken',
        authorization: [
          { actor: this.eosAccount.name, permission: 'active' }
        ],
        data: {
          user: this.eosAccount.name,
          initial_pool1: {
            contract: this.depositCoin.value.toUpperCase() === 'VTX'
              ? 'volentixtsys'
              : 'eosio.token',
            quantity:
         parseFloat(this.swapData.fromAmount).toFixed(
           this.depositCoin.precision
         ) +
         ' ' +
         this.depositCoin.value.toUpperCase()
          },
          initial_pool2: {
            contract: this.destinationCoin.value.toUpperCase() === 'VTX'
              ? 'volentixtsys'
              : 'eosio.token',
            quantity:
         parseFloat(this.swapData.toAmount).toFixed(
           this.destinationCoin.precision
         ) +
         ' ' +
         this.destinationCoin.value.toUpperCase()
          },
          initial_fee: this.swapData.feesAmount * 100,
          fee_contract: this.eosAccount.name
        }
      })

      console.log(this.vpoolsTransactions.actions, JSON.stringify(this.vpoolsTransactions.actions))
    },
    pushLiquidityActions () {
      const amount1 = asset(`${this.swapData.fromAmount} ${this.depositCoin.value.toUpperCase()}`).to_string()
      const amount2 = asset(`${this.swapData.toAmount} ${this.destinationCoin.value.toUpperCase()}`).to_string()

      const to_buy = asset(this.tokenReceive, this.pairData.supply.symbol).to_string()
      this.vpoolsTransactions.actions.actions = this.vpoolsTransactions.actions.actions.concat([
        {
          account: 'vpools2',
          name: 'addliquidity',
          authorization: [
            { actor: this.eosAccount.name, permission: 'active' }
          ],
          data: {
            user: this.eosAccount.name,
            to_buy,
            max_asset1: amount1,
            max_asset2: amount2
          }
        }/*,
        {
          account: 'vpools2',
          name: 'closeext',
          authorization: [
            { actor: this.eosAccount.name, permission: 'active' }
          ],
          data: {
            user: this.eosAccount.name,
            to: this.eosAccount.name,
            ext_symbol: {
              contract:
           this.depositCoin.value.toUpperCase() === 'VTX'
             ? 'volentixtsys'
             : 'eosio.token',
              sym:
           this.depositCoin.precision +
           ',' +
           this.depositCoin.value.toUpperCase()
            },
            memo: ''
          }
        },
        {
          account: 'vpools2',
          name: 'closeext',
          authorization: [
            { actor: this.eosAccount.name, permission: 'active' }
          ],
          data: {
            user: this.eosAccount.name,
            to: this.eosAccount.name,
            ext_symbol: {
              contract:
           this.destinationCoin.value.toUpperCase() === 'VTX'
             ? 'volentixtsys'
             : 'eosio.token',
              sym:
           this.destinationCoin.precision +
           ',' +
           this.destinationCoin.value.toUpperCase()
            },
            memo: ''
          }
        } */])

      console.log(this.vpoolsTransactions, 'this.vpoolsTransactions')
    },
    async pushSwapAction () {
      if (!this.pairData) {
        this.error = 'No liquidity pool available'
        return
      }

      let amount1
      let amount2

      if (this.pairData.pool1.quantity.symbol.code().to_string() === this.depositCoin.value.toUpperCase()) {
        amount1 = number_to_asset(parseFloat(this.swapData.fromAmount), this.pairData.pool1.quantity.symbol).to_string()
        amount2 = number_to_asset(parseFloat(this.swapData.toAmount), this.pairData.pool2.quantity.symbol).to_string()
      } else {
        amount1 = number_to_asset(parseFloat(this.swapData.fromAmount), this.pairData.pool2.quantity.symbol).to_string()
        amount2 = number_to_asset(parseFloat(this.swapData.toAmount), this.pairData.pool1.quantity.symbol).to_string()
      }

      this.vpoolsTransactions.actions.actions = [
        {
          account: this.pairData.pool1.quantity.symbol.code().to_string() === this.depositCoin.value.toUpperCase() ? this.pairData.pool1.contract : this.pairData.pool2.contract,
          name: 'transfer',
          authorization: [
            { actor: this.eosAccount.name, permission: 'active' }
          ],
          data: {
            from: this.eosAccount.name,
            to: 'vpools2',
            quantity: amount1,
            memo: `exchange: ${this.pairData.supply.symbol.code().to_string()},${amount2}, Exchanged from Verto`
          }
        }
      ]
    },
    sendTransaction () {
      this.spinnervisible = true
      this.getPairData()
      console.log(this.vpoolsTransactions.actions, JSON.stringify(this.vpoolsTransactions.actions))
      testnetApiObject.api
        .transact(this.vpoolsTransactions.actions, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        .then((result) => {
          this.step = 2
          this.transactionStatus = 'Success'
          this.spinnervisible = false
          this.transactionHash = result.transaction_id

          this.vpoolsTrigger++
          this.updatePool()
          this.getPairData()
        })
        .catch((error) => {
          if (
            error
              .toString()
              .includes(
                'is greater than the maximum billable CPU time for the transaction'
              )
          ) {
            // this.freeCPU = true
            // this.sendFreeCPUTransaction(this.vpoolsTransactions.actions)
          } else {
            this.error = error.toString()
            this.transactionStatus = 'Failed'
            this.spinnervisible = false
          }
        })
      this.transaction.name = ''
    },

    addCoinToGlobalList (value, key) {
      let infosArray = value[key].symbol.split(',')
      let item = this.coins.find(
        (o) => o.value.toLowerCase() === infosArray[1].toLowerCase()
      )
      if (!item && !isNaN(value.price0_last)) {
        let url = this.getEOSTokenImageUrl(infosArray[1], value[key].contract)
        let account = this.eosAccounts.find(
          (o) => o.type === infosArray[1].toLowerCase()
        )
        let option = {
          label: infosArray[1],
          precision: infosArray[0],
          value: infosArray[1],
          contract: value[key].contract,
          image: url,
          data: {
            amount: account ? parseFloat(account.amount) : 0
          }
        }

        this.coins.push(option)
      }
    },
    async getPools () {
      this.coins = this.$store.state.settings.coins.defibox
      this.depositCoinOptions = this.coins
      this.depositCoinUnfilter = this.coins
      this.depositCoin = this.depositCoin
        ? this.coins.find(
          (w) =>
            w.value.toLowerCase() === this.depositCoin.value.toLowerCase()
        )
        : this.coins.find((w) => w.value.toLowerCase() === 'eos')
      this.getDestinationCoinOptions()
      this.destinationCoin = this.destinationCoin
        ? this.coins.find(
          (w) =>
            w.value.toLowerCase() === this.destinationCoin.value.toLowerCase()
        )
        : this.destinationCoinOptions[0]
      this.getPairData()
    },
    getDestinationCoinOptions () {
      this.destinationCoinOptions = this.coins.filter(
        (o) => o.value.toLowerCase() !== this.depositCoin.value.toLowerCase()
      ) // .filter(o => this.pairs.find(w => (w.token1.symbol.split(',')[1].toLowerCase() === o.value.toLowerCase() && this.depositCoin.value.toLowerCase() === w.token0.symbol.split(',')[1].toLowerCase()) || (w.token0.symbol.split(',')[1].toLowerCase() === o.value.toLowerCase() && this.depositCoin.value.toLowerCase() === w.token1.symbol.split(',')[1].toLowerCase())))
      this.destinationCoinUnfilter = this.destinationCoinOptions
      this.destinationCoinOptions = this.destinationCoinOptions.filter(
        (o) => o.value !== this.depositCoin.value
      )
      this.destinationCoin = !this.destinationCoin
        ? this.destinationCoinOptions[0]
        : this.destinationCoin
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
    validateTransaction () {
      this.error = null
      if (this.depositCoin.amount < this.swapData.fromAmount) {
        this.error = 'Insufficient ' + this.depositCoin.label + ' balance'
      } else if (
        this.tab === 'liquidity' &&
    this.destinationCoin.amount < parseFloat(this.swapData.toAmount)
      ) {
        this.error = 'Insufficient ' + this.destinationCoin.label + ' balance'
      }
    },
    checkPrivateKeyPassword () {
      this.eosAccount = this.eosAccounts.find(
        (o) =>
          o.type.toLowerCase() === this.depositCoin.value.toLowerCase() &&
     o.name.toLowerCase() === this.depositCoin.name.toLowerCase()
      )

      const privateKeyEncrypted = JSON.stringify(
        this.eosAccount.privateKeyEncrypted
      )
      let privateKey = this.$configManager.decryptPrivateKey(
        this.privateKeyPassword,
        privateKeyEncrypted
      )

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
    async sendTransaction_old () {
      this.spinnervisible = true
      this.freeCPU = false
      this.eosAccount = this.eosAccounts.find(
        (o) =>
          o.type.toLowerCase() === this.depositCoin.value.toLowerCase() &&
     o.name.toLowerCase() === this.depositCoin.name.toLowerCase()
      )

      if (this.privateKey && !this.eosAccount.privateKey) {
        this.eosAccount.privateKey = this.privateKey
      } else if (!this.eosAccount.privateKey) {
        this.getPassword = true
        this.openModal = true
        return
      }

      let transaction = {
        name: 'transfer',
        data: {
          from: this.eosAccount.name,
          to: 'swap.defi',
          quantity:
      this.swapData.fromAmount +
      ' ' +
      this.depositCoin.value.toUpperCase(),
          memo: this.getMemo()
        }
      }

      if (this.tab === 'liquidity' && this.transaction.name === 'createpair') {
        transaction = this.transaction
      }

      signatureProvider = new JsSignatureProvider([this.eosAccount.privateKey])
      api = new Api({
        rpc,
        signatureProvider
      })
      let transactionObject = {
        actions: [
          {
            account:
       this.transaction.name !== 'createpair'
         ? this.depositCoin.contract
         : 'swap.defi',
            name: transaction.name,
            authorization: [
              {
                actor: this.eosAccount.name,
                permission: 'active'
              }
            ],
            data: transaction.data
          }
        ]
      }

      if (this.tab === 'liquidity' && this.transaction.name !== 'createpair') {
        transactionObject.actions.push({
          account:
      this.transaction.name !== 'createpair'
        ? this.destinationCoin.contract
        : 'swap.defi',
          name: transaction.name,
          authorization: [
            {
              actor: this.eosAccount.name,
              permission: 'active'
            }
          ],
          data: {
            from: this.eosAccount.name,
            to: 'swap.defi',
            quantity:
       this.swapData.toAmount +
       ' ' +
       this.destinationCoin.value.toUpperCase(),
            memo: this.getMemo()
          }
        })
      }

      api
        .transact(transactionObject, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        .then((result) => {
          this.step = 2
          this.transactionStatus = 'Success'
          this.spinnervisible = false
          this.transactionHash = result.transaction_id
          initWallet()
          if (this.tab !== 'swap') {
            this.getPools()
          }
        })
        .catch((error) => {
          if (
            error
              .toString()
              .includes(
                'is greater than the maximum billable CPU time for the transaction'
              )
          ) {
            this.freeCPU = true
            this.sendFreeCPUTransaction(transactionObject.actions)
          } else {
            this.error = error
            this.transactionStatus = 'Failed'
            this.spinnervisible = false
          }
        })
    },
    getMemo () {
      let memo = ''

      if (this.tab === 'swap') {
        memo += 'swap,'.concat('1', ',')
        if (this.path.length) {
          memo += this.path.map((o) => o.id).join('-')
        } else {
          memo = memo.concat(this.pairData.id)
        }
      } else {
        memo += 'deposit,'.concat(this.pairData.id)
      }
      return memo
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
  watch: {
    depositCoin: function (newVal, oldVal) {
      if (newVal && newVal.amount) {
        this.swapData.fromAmount = parseFloat(newVal.amount).toFixed(
          this.depositCoin.precision
        )
      }
    },
    selectedEOSPool (val) {
      this.depositCoin = this.getAllCoins().find(
        (o) =>
          o.value.toLowerCase() ===
     this.$store.state.settings.dexData.depositCoin.value.toLowerCase()
      )

      this.destinationCoin = this.getAllCoins().find(
        (o) =>
          o.value.toLowerCase() ===
     this.$store.state.settings.dexData.destinationCoin.value.toLowerCase()
      )

      this.getPairData()
    },
    pools () {
      this.getPairData()
    },
    tab: function (newVal) {
      if (newVal === 'liquidity') {
        this.coins = this.$store.state.settings.coins.defibox
        this.depositCoinOptions = this.coins
        this.depositCoinUnfilter = this.coins
        this.getDestinationCoinOptions()
      } else {
        this.coins = this.getAllCoins()
        this.depositCoinOptions = this.coins
        this.depositCoinUnfilter = this.coins
        this.getDestinationCoinOptions()
      }
    }
  },
  mixins: [EOSContract, DexInteraction]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.normal-line-height {
 line-height: normal;
}
.q-tab--active {
 background: #dfdff1;
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
 background: #f3f3f3 !important;
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

 .send-modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(black, 0.5);
  left: 0px;
  top: 0px;
  z-index: 999999;
  visibility: hidden;
  opacity: 0;
  transition: opacity ease 0.4s;

  &.open {
   visibility: visible;
   opacity: 1;

   .send-modal__content {
    transform: scale(1);
   }
  }

  &__content {
   background-color: #fff;
   border-radius: 20px;
   max-width: 400px;
   padding: 20px;
   width: 100%;
   box-shadow: 0px -2px 9px 0px rgba(black, 0.29);
   position: relative;
   transform: scale(0);
   transition: ease transform 0.3s, opacity ease 0.2s;

   &--head {
    margin-bottom: 20px;

    .close-btn {
     position: absolute;
     right: 10px;
     top: 10px;
     font-size: 40px;
     font-weight: $light;
     font-family: $Titillium;
     height: 40px;
     width: 40px;
     min-height: unset;
     opacity: 0.3;

     /deep/ .q-btn__content {
      transform: rotate(45deg);
      min-height: unset;
      line-height: 30px;
      margin-left: 5px;
      margin-top: -4px;
     }
    }

    .--amount {
     font-size: 25px;
     font-weight: $bold;
     font-family: $Titillium;
     margin-top: 20px;
     position: relative;
     top: -9px;
    }
   }

   &--body {
    position: relative;

    .svg_logo {
     fill: #00d0ca;
     position: absolute;
     margin-top: 5px;
     width: 50px;
    }

    .--label {
     font-size: 14px;
     font-weight: $light;
     font-family: $Titillium;
     position: absolute;
     bottom: -15px;
     width: 150%;
     text-align: center;
     letter-spacing: 1.5px;
    }
   }

   &--footer {
    .--email {
     font-size: 16px;
     font-weight: $bold;
     font-family: $Titillium;
     margin-top: 20px;
    }

    .--error {
     color: red;
     font-size: 14px;
     margin-top: 20px;
     font-weight: $bold;
     font-family: $Titillium;
     line-height: 16px;
    }
   }
  }
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
   max-width: 150px;
   margin: auto;
   margin-top: 20px;

   .title {
    font-size: 13px;
    color: #7272fa;
    font-weight: $light;
    font-family: $Titillium;
    margin-bottom: -10px;
    margin-top: 10px;
   }

   /deep/ .q-linear-progress__model {
    background: #7272fa;
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
   color: #b0b0b0;
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

    .pay-wrapper {
    }

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
      color: #7272fa;
     }

     .right-icon {
      color: #7272fa;
     }
    }

    .label {
     font-size: 17px;
     color: #2a2a2a;
     font-family: $Titillium;
     font-weight: $light;
    }

    .value {
     font-size: 33px;
     color: #b0b0b0;
     font-family: $Titillium;
     font-weight: $regular;
    }

    .get-wrapper {
    }
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
   letter-spacing: 0.5px;
   border-radius: 40px;
   width: fit-content;
   margin-left: 0px;
   padding-left: 20px;
   padding-right: 20px;
   background-color: #7272fa !important;

   .left-icon {
    transform: scaleX(-1);
    margin-left: 6px;
    margin-right: 6px;
    margin-top: -1px;
   }

   // &.next{
   //  background-color: #7900FF !important;
   // }
   // &.back{
   //  background-color: #B0B0B0 !important;
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

     .q-item__label + .q-item__label {
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
   color: #7272fa !important;
  }

  .list-wrapper {
   overflow: hidden;
   visibility: hidden;
   height: 0px;
   opacity: 0;
   transform: translateY(-20px) scaleY(0.5);
   transform-origin: top;
   transition: ease transform 0.3s, ease opacity 0.4s;

   @media screen and (min-width: 1024px) {
    overflow: visible;
   }

   &--chain {
    &__type {
     background-color: #fff;
     margin-bottom: 10px;
     border-radius: 0px 0px 10px 10px;
     padding: 3% 8%;
     box-shadow: 0px 4px 16px 0px rgba(black, 0.09);
     font-family: $Titillium;
     font-size: 20px;
     color: #2a2a2a;
     font-weight: $bold;

     b {
      color: #7272fa;
      text-transform: uppercase;
     }

     .chain {
     }

     .token {
     }
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
         color: #454f63;
         font-weight: $bold;
         margin-right: auto;
        }

        .soon {
         font-size: 16px;
         color: #b0b0b0;
         display: flex;
         justify-content: space-between;
         flex-direction: row;
         align-items: center;
         align-content: center;
        }

        .icon {
         color: #78849e;
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
     box-shadow: 0px 4px 16px 0px rgba(black, 0.09);

     @media screen and (min-width: 1024px) {
      box-shadow: none;
     }

     &--title {
      font-size: 22px;
      font-family: $Titillium;
      font-weight: $bold;
      color: #2a2a2a;
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
      content: "";
      transform: translateX(-50%);
      width: 18px;
      background: #f3f3f3;
      // margin-top: -4px;
      // margin-bottom: -4px;
     }

     /deep/ .q-stepper__tab {
      .q-stepper__title {
       font-size: 20px;
       font-family: $Titillium;
       font-weight: $bold;
       color: #2a2a2a;
      }

      &.q-stepper__tab--active,
      &.q-stepper__tab--done {
       .q-stepper__title {
        color: #7272fa;
       }

       .q-stepper__dot {
        background: #7272fa;
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
        background: #ffb200 !important;
       }

       .text-green {
        background: #ffb200 !important;
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
        background: #ffb200;
       }

       .q-linear-progress__model--indeterminate:before,
       .q-linear-progress__model--indeterminate:after {
        background: #ffb200;
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
        color: #ffb200;

        span {
         color: #2a2a2a;
        }
       }
      }

      &__success {
       color: #00d0ca;
       font-weight: $bold;
       margin-bottom: 20px;
      }

      &__faild {
       color: #ffb200;
       font-weight: $bold;
       margin-bottom: 20px;
      }

      &__transLink {
       color: #2a2a2a;
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
        color: #b0b0b0;
       }
      }

      &__success {
       color: #00d0ca;
       font-weight: $bold;
       margin-bottom: 20px;
      }

      &__faild {
       color: #ffb200;
       font-weight: $bold;
       margin-bottom: 20px;
      }

      &__transLink {
       color: #2a2a2a;
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
        color: #b0b0b0;
       }
      }
     }

     .--title,
     .--amount {
      font-size: 13px;
      font-family: $Titillium;
      font-weight: $bold;
      color: #b0b0b0;
      text-transform: initial !important;
      line-height: 20px;
     }

     .--amount {
      color: #2a2a2a !important;
     }
    }
   }
  }

  &.open {
   margin-bottom: 0px;
   padding-left: 0%;
   padding-right: 0%;
   margin-top: 30px;

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
 box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14),
  0 1px 10px rgba(0, 0, 0, 0.12);
}

.accept-disclaimer {
 color: #fff !important;
 background-color: #00d0df !important;
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
  background-color: #f6f6f6;
  margin-bottom: 0px;
  border-radius: 40px;
  height: 40px;
  position: relative;

  &:before {
   content: "";
   width: 12%;
   position: absolute;
   left: 0px;
   top: 18px;
   height: 3px;
   background-color: #f6f6f6;
   transform: translateX(-100%);
  }

  &:after {
   content: "";
   width: 12%;
   position: absolute;
   right: 0px;
   top: 18px;
   height: 3px;
   background-color: #f6f6f6;
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

.trade-component {
 position: relative;
 // font-family: $Franklin;
 font-size: 18px;
 font-weight: $bold;
 // border: 1px solid #CCC;
 border-radius: 10px;
 // max-width: 500px;
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
    opacity: 0.7;
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
    background-color: #fff !important;

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
  border: 1px solid rgba(black, 0.2);
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
  box-shadow: 0px 10px 10px 0px rgba(black, 0.1);
  // font-family: $Franklin;
  font-weight: $regular;
  visibility: hidden;
  opacity: 0;
  transform: translateY(0px);
  transition: ease opacity 0.3s, transform ease 0.3s;

  hr {
   opacity: 0.2;
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
  opacity: 0.3;
 }
}

/* Standard syntax */
@keyframes infinite-rotate {
 0% {
  opacity: 1;
 }

 100% {
  opacity: 0.3;
 }
}

.option--avatar {
 border: 1px solid rgba(black, 0.1);
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

.summary-wrapper {
 background-color: rgba(black, 0.06);
 // min-height: 300px;
 margin-top: 31px;
 margin-left: 10px;
 max-width: 32%;
 border-radius: 8px;
 display: flex;
 flex-direction: row;
 @media screen and (max-width: 768px) {
  max-width: 100%;
 }
 &__list {
  width: 100%;
 }
}

.prototype {
 /deep/ .q-tabs {
  border-radius: 8px;
 }
}
</style>
