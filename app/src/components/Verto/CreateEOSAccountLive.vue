<template>
  <div :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }">
    <div class="chain-tools-wrapper q-pa-none">
      <!-- <q-toggle v-model="active" label="Active" /> -->
      <div :class="!$q.platform.is.mobile ? 'chain-tools-wrapper--list open' : 'open' ">
        <div class="list-wrapper">
          <div class="list-wrapper--chain__eos-to-vtx-convertor">
           <q-tabs
                v-model="tab"
                align="left"
                inline-label

                :class="{
                  'text-white': $store.state.settings.lightMode === 'true',
                }"
                class="text-grey-8 flex"
              >
                <q-tab
                  name="import"
                  icon="call_received"
                  label="Import"
                  @click="$router.push('/verto/eos-account/import')"
                />
                 <q-tab
                  name="create"
                  icon="add"
                  @click="$router.push('/verto/eos-account/create')"
                  label="Create new account"
                />
           </q-tabs>
            <div v-if="step >= 0" class="">
              <div>
                <q-stepper
                  :dark="$store.state.settings.lightMode === 'true'"
                  :light="$store.state.settings.lightMode === 'false'"
                  flat
                  v-model="step"
                  vertical
                  ref="stepper"
                  color="primary"
                  animated
                >
                  <q-step
                    :title="$route.params.action == 'create'  ? 'Create EOS account' : 'Import EOS account'"
                    :name="1"
                    prefix="2"
                    :done="step > 1"
                  >

                    <div class="text-black">
                      <q-list padding :dark="$store.state.settings.lightMode === 'true'">
                        <q-item-label  v-if="$route.params.action == 'create'" header
                          >The account will be associated with a private key
                        </q-item-label>

                        <q-item v-if="tokensOption.length" tag="label" v-ripple @click="publicKey = currentToken.value ; privateKey.key =  currentToken.privateKey ">
                          <q-item-section side top>
                            <q-radio
                              v-model="source"
                              val="accounts"
                              label=""
                              color="teal"
                            />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="q-pb-sm"
                              >Choose a Verto EOS account</q-item-label
                            >
                            <q-item-label caption class="q-mb-md">
                              Choose a EOS key from your Verto Wallet
                            </q-item-label>

                            <q-select
                              @input="publicKey = currentToken.value ; privateKey.key =  currentToken.privateKey "

                              v-if="source == 'accounts' && tokensOption.length"
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              separator
                              rounded
                              outlined
                              class="select-input q-px-md"
                              v-model="currentToken"
                              :options="tokensOption"
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
                                      :name="`img:${scope.opt.image}`"
                                    />
                                  </q-item-section>
                                  <q-item-section dark>
                                    <q-item-label
                                      class="ellipsis"
                                      v-html="getKeyFormat(scope.opt.label)"
                                    />
                                    <q-item-label caption>{{
                                      scope.opt.value
                                    }}</q-item-label>
                                  </q-item-section>
                                </q-item>
                              </template>

                              <template v-slot:selected>
                                <q-item v-if="currentToken">
                                  <q-item-section avatar>
                                    <q-icon
                                      class="option--avatar"
                                      :name="`img:${currentToken.image}`"
                                    />
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label
                                      class="ellipsis"
                                      v-html="getKeyFormat(currentToken.label)"
                                    />
                                    <q-item-label caption>{{
                                      currentToken.value
                                    }}</q-item-label>
                                  </q-item-section>
                                </q-item>
                                <q-item v-else> </q-item>
                              </template>

                              <template v-slot:append>
                                <q-btn
                                  round
                                  flat
                                  unelevated
                                  text-color="grey"
                                  @click="copyToClipboard(currentToken.value)"
                                  icon="o_file_copy"
                                />
                              </template>
                            </q-select>
                          </q-item-section>
                        </q-item>

                        <q-item v-if="$route.params.action == 'create'" @click="generateKeyPair()" tag="label" v-ripple>
                          <q-item-section side top>
                            <q-radio
                              v-model="source"
                              val="new"
                              label=""
                              color="orange"
                            />
                          </q-item-section>

                          <q-item-section  >
                            <q-item-label>Generate new key pair</q-item-label>
                            <q-item-label caption>
                              Get a new set of Public/Private key.
                            </q-item-label>
                            <q-linear-progress
                              color="deep-purple-12"
                              class="q-mt-md"
                              indeterminate
                              v-if="!privateKey.key && source == 'new'"
                            />
                            <q-input
                              readonly
                              :type="isPwd ? 'password' : 'text'"
                              v-if="privateKey.key && source == 'new'"
                              v-model="privateKey.key"
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              rounded
                              outlined
                              class="--input"
                              color="deep-purple-14"
                              label="Private key"
                              debounce="500"
                            >
                              <template v-slot:append>
                                <q-icon
                                  :name="
                                    isPwd ? 'visibility_off' : 'visibility'
                                  "
                                  class="cursor-pointer"
                                  @click="isPwd = !isPwd"
                                />
                              </template>
                            </q-input>
                            <div
                              v-if="privateKey.key && source == 'new'"
                              class="text-body2 q-mt-sm q-pl-sm"
                            >
                              Public key: {{ publicKey }}
                            </div>

                            <div
                              v-if="privateKey.key && source == 'new'"
                              class="q-pt-md text-body2"
                            >
                              This key was generated from your mnemonic. (Key
                              Index : #{{ mnemonicAccounts.length + 1 }})
                            </div>
                          </q-item-section>
                        </q-item>

                        <q-item
                          tag="label"
                          @click="
                            publicKey = '';
                            privateKey = { success: null, key: null };
                          "

                          v-ripple
                        >
                          <q-item-section side top>
                            <q-radio
                              v-model="source"
                              val="private"
                              label=""
                              color="red"

                            />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label>Paste a Private Key</q-item-label>
                            <q-item-label caption>
                              From your private we will derive the public key
                            </q-item-label>
                            <q-input
                              :type="isPwd ? 'password' : 'text'"
                              v-if="source == 'private'"
                              @input="getPublicKeyFromPrivate()"
                              v-model="privateKey.key"
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              rounded
                              outlined
                              class="--input"
                              color="deep-purple-14"
                              label="Private key"
                              debounce="500"
                            >
                              <template v-slot:append>
                                <q-icon
                                  :name="
                                    isPwd ? 'visibility_off' : 'visibility'
                                  "
                                  class="cursor-pointer"
                                  @click="isPwd = !isPwd"
                                />
                              </template>
                            </q-input>
                            <div
                              v-if="publicKey && source == 'private'"
                              class="text-body2 q-mt-sm q-pl-sm"
                            >
                              Public key: {{ publicKey }}
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item
                          tag="label"
                          @click="
                            publicKey = '';
                            privateKey = { success: null, key: null };
                          "
                          v-if="$route.params.action == 'create'"
                          v-ripple
                        >
                          <q-item-section side top>
                            <q-radio
                              v-model="source"
                              val="public"
                              label=""
                              color="cyan"
                            />
                          </q-item-section>

                          <q-item-section v-if="$route.params.action == 'create'" >
                            <q-item-label>Paste a Public key</q-item-label>
                            <q-item-label caption>
                              The public key will be used to create your account
                            </q-item-label>
                            <q-input
                              v-if="source == 'public'"
                              @input="validatePublicKey"
                              v-model="publicKeyUnchecked"
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              rounded
                              outlined
                              class="--input"
                              color="deep-purple-14"
                              label="Public key"
                              debounce="500"
                            />
                            <q-item-label
                              v-if="source == 'public'"
                              class="text-red q-pt-sm"
                              caption
                            >
                              To add this wallet to Verto, you will need to
                              import the private key
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <q-stepper-navigation class="flex justify-end">
                      <q-btn
                        @click="step++"
                        v-if="publicKey"
                        color="deep-purple-14"
                        class="--next-btn"
                        rounded
                        label="Next"
                      />
                    </q-stepper-navigation>
                  </q-step>
                   <q-step
                    :name="2"
                    title="Choose account name"
                    icon="settings"
                    :done="step > 2"
                    style="max-width: 600px"
                  >
                    <q-btn
                      flat
                      @click="step--"
                      unelevated
                      icon="keyboard_arrow_up"
                      :color="
                        $store.state.settings.lightMode === 'false'
                          ? 'primary'
                          : 'white'
                      "
                      class="--back-btn"
                    />

                    <span v-if="tab == 'new'">Click import if you want to import an existing account</span>
                    <q-tabs
                      v-model="tab"
                      inline-label
                       v-if="privateKey.key && $route.params.action == 'create'"
                      class=" optionTab q-mt-md"
                    >
                      <q-tab name="new" icon="add" label="New account" />
                      <q-tab
                        alert="purple"
                        name="import"
                        icon="get_app"
                        label="Import"

                      >
                        <q-badge
                          color="white"
                          text-color="deep-purple-12"
                          floating
                          >{{ accountNames.length }}</q-badge
                        >
                      </q-tab>
                    </q-tabs>
                    <div class="text-black" v-if="tab == 'new'">
                      <div :class="!$q.platform.is.mobile ? 'text-h4 --subtitle q-pt-md q-pb-none' : 'q-pt-md q-pb-none text-bold'">
                        <ul>
                          <li>
                            <span
                              >Choose a 12 letter and/or (1-5)EOS account
                              name</span
                            >
                          </li>
                          <!-- <li><span>0.35 EOS is required to be transferred to the new account</span></li> -->
                        </ul>
                      </div>
                      <q-input
                        counter
                        autocomplete="off"
                        v-model="accountNew"
                        :dark="$store.state.settings.lightMode === 'true'"
                        :light="$store.state.settings.lightMode === 'false'"
                        color="green"
                        label="Account Name"
                        hint="Choose a 12 Letter and/or Number (1-5)"
                        :error="inError"
                        :error-message="errorMessage"
                        @input="checkName"
                        @keyup.enter="step = 2"
                      />
                      <p class="text-body1" :class="{ 'text-white': $store.state.settings.lightMode === 'true'}" >
                        The way EOS works is that new accounts can only be
                        created by someone with an existing account. Creating an
                        account also requires to stake a certain amount of EOS
                        and to buy some RAM.
                      </p>
                    </div>
                    <div class="text-black text-body1" v-if="tab == 'import'">

                      <p
                        v-if="accountsInVerto.length && !accountNames.length"
                        class="q-pt-md"
                        :class="{ 'text-white': $store.state.settings.lightMode === 'true'}"
                      >
                        All
                        {{
                          accountsInVerto.length > 2
                            ? accountsInVerto.length
                            : ""
                        }}
                        accounts associated with this key are already in Verto
                      </p>
                      <p  class="q-pt-md" :class="{ 'text-white': $store.state.settings.lightMode === 'true'}" v-if="accountsInVerto.length == 0 &&  accountNames.length == 0"> No EOS accounts found</p>
                      <q-btn class="float-right" :color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'" :loading="spinnervisible" dense label="Refetch accounts" icon="refresh"  @click="getAccountNames()"  flat/>
                      <div
                        :class="$store.state.settings.lightMode === 'true' ? '': 'text-h4 --subtitle'"
                        v-if="accountNames.length"
                      >
                        <ul>

                          <li><span>Choose EOS account</span></li>
                        </ul>
                      </div>

                      <p :class="{ 'text-white': $store.state.settings.lightMode === 'true'}" v-if="accountsInVerto.length && accountNames.length">
                        {{ accountsInVerto.length }}  already added in Verto.
                        You can add {{ accountNames.length }} more.
                      </p>
                     <p :class="{ 'text-white': $store.state.settings.lightMode === 'true'}"  v-if="!(accountsInVerto.length && !accountNames.length) && accountNames.length !== 0 && !spinnervisible" class="text-body2">You can click on multiple accounts name to import multiples accounts <br/> or <q-btn @click="accountNameList = accountNames" outline size="sm" class="q-mt-sm" label="Select all" /></p>
                     <p  v-if="status" class="text-green">{{status}}</p>
                      <q-select
                        v-if="accountNames.length && !spinnervisible"
                        label="Select EOS Accounts in the list"
                        :dark="$store.state.settings.lightMode === 'true'"
                        :light="$store.state.settings.lightMode === 'false'"
                        separator
                        rounded
                        outlined

                        multiple
                        v-model="accountNameList"
                        :options="accountNames.filter(o => !accountNameList.find(a => a.value === o.value))"
                        :error="accountNameError"
                        error-message="This account  is already in your wallet"
                        :loading="!accountNames"

                      />

                      <q-input
                        v-if="accountNames.length && !spinnervisible"
                        v-model="vertoPassword"
                        :dark="$store.state.settings.lightMode === 'true'"
                        :light="$store.state.settings.lightMode === 'false'"
                        color="green"
                        outlined
                        label="Enter Verto Password"
                        debounce="500"
                        :class="{'q-pt-sm':accountNameError}"
                        :error="vertoPasswordWrong"
                        error-message="The password is incorrect"
                        @input="checkVertoPassword"
                        @keyup.enter="
                          upgradeAccountName();
                          prompt = false;
                        "
                        :type="isPwd ? 'password' : 'text'"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>
                    </div>

                    <q-stepper-navigation
                      class="flex justify-end"
                      v-if="!spinnervisible"
                    >
                      <q-btn
                         v-if="tab == 'import' &&  (accountsInVerto.length != 0 ||  accountNames.length != 0)"
                        @click="addAccountList(true)"
                        unelevated
                        color="deep-purple-14"
                        class="--next-btn"
                        rounded
                        :loading="spinnervisible"
                        :disable="!vertoPassword || !vertoPassordValid || !accountNameList.length || accountNameError"
                        label="Import new account"
                      />
                      <q-btn
                       v-else-if="tab == 'new' && !inError"
                        @click="step = 3"
                        unelevated
                        color="deep-purple-14"
                        class="--next-btn"
                        rounded
                        label="Go to Payment"
                      />
                    </q-stepper-navigation>
                  </q-step>
                   <q-step
                    :name="4"
                    title="Success"
                    icon="check_circle"
                    :done="step > 4"
                    v-if="step == 4"
                  >
                  <div class="text-h6 text-green q-mb-md">Imported Successfully:</div>
                  <q-btn to="/verto/dashboard" outline label="Go to Dashboard" />
                  </q-step>
                  <q-step
                    :name="3"
                    v-if="tab == 'new'"
                    title="Payment"
                    icon="attach_money"
                    :done="step > 3"
                  >

                    <q-btn
                      flat
                      @click="step--"
                      unelevated
                      icon="keyboard_arrow_up"
                      :color="
                        $store.state.settings.lightMode === 'false'
                          ? 'primary'
                          : 'white'
                      "
                      class="--back-btn"
                    />
                    <div v-if="!$store.state.wallets.tokens.filter(f => f.type == 'eos').length">
                        <div class="text-black">
                            <div class="text-h4 --subtitle">
                                <ul>
                                    <li><span>Send 0.35 EOS to Create the Account</span></li>
                                    <!-- <li><span>0.35 EOS is required to be transferred to the new account</span></li> -->
                                </ul>
                            </div>
                            <q-input v-model="accountAmount" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Minimum Amount:" readonly>
                                <template v-slot:append>
                                    <q-icon name="file_copy" @click="copyToClipboard(accountAmount, 'Amount')" />
                                </template>
                            </q-input>
                            <q-input v-model="accountTo" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Send To:" readonly>
                                <template v-slot:append>
                                    <q-icon name="file_copy" @click="copyToClipboard(accountTo, 'To Account')" />
                                </template>
                            </q-input>
                            <q-input v-model="accountMemo" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Mandatory Memo:" readonly>
                                <template v-slot:append>
                                    <q-icon name="file_copy" @click="copyToClipboard(accountMemo, 'Memo')" />
                                </template>
                            </q-input>
                            <div class="text-body1 q-mt-md" :class="{ 'text-white': $store.state.settings.lightMode === 'true'}">After completing this payment, you will need to import the account so it can be ready inside Verto.</div>
                            <div class="text-body1 q-mt-md" :class="{ 'text-white': $store.state.settings.lightMode === 'true'}">Have you completed the payment ? </div>
                            <q-btn
                            unelevated
                            @click="step = 2 ; tab = 'import' ; "
                            color="deep-purple-14"
                            class="--next-btn q-mt-sm"
                            rounded
                            label="Click here to import"
                          />
                        </div>
                    </div>
                    <div class="row"  v-else>
                      <q-list separator class="col-md-6 q-pa-md">
                        <q-item>
                          <q-item-section>
                            <q-item-label>Account name</q-item-label>
                            <q-item-label caption>{{
                              accountNew
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label overline
                              >Owner & active keys</q-item-label
                            >
                            <q-item-label
                              >...{{ publicKey.substring(15) }}</q-item-label
                            >
                          </q-item-section>
                        </q-item>

                        <q-item
                          v-if="
                            paymentOption &&
                            paymentOption.chain == 'eos' &&
                            paymentOption.type != 'eos' &&
                            pairData &&
                            pairData.eosQuivalent
                          "
                        >
                          <q-item-section>
                            <q-item-label overline
                              >Pay with
                              {{
                                paymentOption.value.toUpperCase()
                              }}</q-item-label
                            >
                            <q-item-label
                              >Pay {{ pairData.eosQuivalent }}
                              {{
                                paymentOption.value.toUpperCase()
                              }}</q-item-label
                            >
                            <q-item-label
                              ><span class="text-deep-purple-12 text-body2"
                                >(Equivalent of 0.35 EOS)</span
                              >
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item v-else>
                          <q-item-section>
                            <q-item-label overline>Payment</q-item-label>
                            <q-item-label>0.35 EOS</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item-label
                          v-if="ErrorMessage"
                          class="text-red"
                          overline
                          >{{ ErrorMessage }}</q-item-label
                        >
                      </q-list>
                      <div class="q-pa-md col-md-6">
                        <div v-if="!success">
                        <p class="text-h6 text-bold">Payment</p>
                        <p class="text-body1">Select account and token</p>
                        <AccountSelector :chain="'eos'" />
                        <q-select
                          v-if="paymentOptions.length"
                          :dark="$store.state.settings.lightMode === 'true'"
                          :light="$store.state.settings.lightMode === 'false'"
                          separator
                          rounded
                          outlined
                          class="select-input q-pt-md"
                          v-model="paymentOption"
                          :options="paymentOptions"
                          :virtual-scroll-slice-size="4"
                          :virtual-scroll-item-size="220"
                          :virtual-scroll-sticky-size-end="48"
                          :virtual-scroll-sticky-size-start="0"
                          :virtual-scroll-slice-ratio-after="4"

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
                                  :name="`img:${scope.opt.image}`"
                                />
                              </q-item-section>
                              <q-item-section dark>
                                <q-item-label
                                  class="ellipsis"
                                  v-html="scope.opt.label.toUpperCase()"
                                />
                                <q-item-label
                                  caption
                                  v-html="scope.opt.amount"
                                />
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-slot:selected>
                            <q-item v-if="paymentOption">
                              <q-item-section avatar>
                                <q-icon
                                  class="option--avatar"
                                  :name="`img:${paymentOption.image}`"
                                />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label
                                  class="ellipsis"
                                  v-html="paymentOption.label.toUpperCase()"
                                />
                                <q-item-label
                                  caption
                                  v-html="paymentOption.amount"
                                />
                              </q-item-section>
                            </q-item>
                            <q-item v-else> </q-item>
                          </template>
                        </q-select>
                       </div>
                        <div v-else >

                          <p class="text-green text-body1 q-mt-md">Account created succesfully</p>
                          <div v-if="privateKey.key">
                          <p class="text-body1">Enter your Verto Password to add this account to your wallet</p>
                        <q-input

                        v-model="vertoPassword"
                        :dark="$store.state.settings.lightMode === 'true'"
                        :light="$store.state.settings.lightMode === 'false'"
                        color="green"
                        outlined
                        label="Enter Verto Password"
                        debounce="500"
                        :error="vertoPasswordWrong"
                        error-message="The password is incorrect"
                        @input="checkVertoPassword"
                        @keyup.enter="
                          upgradeAccountName();
                          prompt = false;
                        "
                        :type="isPwd ? 'password' : 'text'"
                      />
                       <q-btn

                        @click="upgradeAccountName()"
                        unelevated
                        color="deep-purple-14"
                        class="--next-btn"
                        rounded
                        :disable="!vertoPassordValid"
                        label="Add new account"
                      />
                      </div>
                      </div>
                        <transactEOS @setSuccessData="setSuccessData" ref="transact" class="q-pt-md" />
                      </div>
                    </div>
                  </q-step>
                </q-stepper>
              </div>
            </div>
          </div>
          <br /><br /><br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
import { userError } from '@/util/errorHandler'
import ecc from 'eosjs-ecc'
import configManager from '@/util/ConfigManager'
import Formatter from '@/mixins/Formatter'
import HD from '@/util/hdwallet'
import { JsonRpc } from 'eosjs'
import transactEOS from './transactEOS'
import AccountSelector from './Exchange/AccountSelector.vue'
import initWallet from '@/util/_Wallets2Tokens'
import { sleep } from '@/util/utils'
export default {
  mixins: [Formatter],
  name: 'VTXConverter',
  components: { AccountSelector, transactEOS },
  data () {
    return {
      accountNames: [],
      walletName: '',
      accountNew: '',
      mnemonicAccounts: [],
      accountAmount: '0.35',
      accountTo: 'signupeoseos',
      source: 'accounts',
      accountName: null,
      password: '',
      passHasError: false,
      showSubmit: false,
      vertoPassword: null,
      vertoPassordValid: false,
      accountNameError: false,
      accountNameList: [],
      errorMessage: '',
      vertoPasswordWrong: false,
      showNextButtonToVertoPassword: false,
      showNextButtonToPassword: false,
      inError: true,
      step: 1,
      step2: 1,
      active: true,
      publicKey: '',
      options: [],
      showWallet: false,
      showText: false,
      slider: 0,
      progColor: 'green',
      eosbalance: 0,
      vtxbalance: 0,
      stakedAmount: 0,
      vtxprice: 0,
      sendAmount: null,
      formatedAmount: null,
      currentProxy: null,
      status: null,
      ErrorMessage: null,
      SuccessMessage: null,
      success: false,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null,
        key: null
      },
      pairs: [],
      origin: 'mnemonic',
      pairData: false,
      paymentOptions: [],
      tab: 'new',
      paymentOption: null,
      addWallet: {},
      transactionId: null,
      transactionError: false,
      spinnervisible: false,
      isPwd: true,
      currentAccount: {},
      currentToken: null,
      creator: {},
      account: null,
      privateKeyPassword: null,
      showSendModal: false,
      publicKeyUnchecked: '',
      accountsInVerto: [],
      navigationButtons: {
        to: false,
        token: false,
        amount: false,
        privateKeyPasswordBtn: false,
        showNextButtonToPassword: false
      },
      tableData: [],
      tokensOption: [],
      params: null
    }
  },
  computed: {
    noPrivateKey () {
      if (
        typeof this.currentWallet !== 'undefined' &&
        this.currentWallet !== null &&
        this.currentWallet.hasOwnProperty('privateKeyEncrypted') &&
        this.currentWallet.privateKeyEncrypted
      ) {
        return false
      } else {
        return true
      }
    },
    wallet () {
      return this.$store.state.investment.defaultAccount || {}
    },
    validateAccountPayment () {
      let invalid = true

      if (
        this.paymentOption &&
        this.paymentOption.type === 'eos' &&
        parseFloat(this.paymentOption.amount) > 0.35
      ) {
        invalid = false
      } else if (
        this.paymentOption &&
        this.paymentOption.type === 'vtx' &&
        parseFloat(this.paymentOption.amount) > 21
      ) {
        invalid = false
      }

      return invalid
    },
    showNext: function () {
      if (!this.voted && !this.proxyModel) {
        return false
      } else {
        return true
      }
    },
    accountMemo () {
      if (this.currentToken) {
        return this.accountNew + '-' + this.currentToken.value
      } else {
        return false
      }
    }
  },
  async created () {
    this.tab = this.$route.params.action === 'create' ? 'new' : 'import'
    this.params = this.$store.state.currentwallet.params
    this.tableData = await this.$store.state.wallets.tokens
    let self = this
    this.tableData
      .filter(
        (o, i, self) =>
          o.chain === 'eos' &&
          (o.type === 'eos' || o.type === 'verto') &&
          self.findIndex((a) => a.key === o.key) === i
      )
      .map((token) => {
        let accounts = this.tableData
          .filter(
            (o, i, self) =>
              o.chain === 'eos' && o.type === 'eos' && o.key === token.key
          )
          .map((a) => a.name)
        self.tokensOption.push({
          label:
            accounts.slice(0, 2).join(', ') +
            (accounts.length > 2
              ? ' + ' + (accounts.length - 2) + ' more accounts'
              : ''),
          value: token.key,
          image: token.icon,
          privateKey: token.privateKey
        })
      })

    if (!self.tokensOption.length) {
      this.source = 'private'
    }

    this.tableData
      .filter(
        (o) =>
          ['eos', 'eth'].includes(o.chain) && !isNaN(o.amount) && o.amount > 0
      )
      .map((token) => {
        let item = self.paymentOptions.find((o) => o.type === token.type)
        if (item) return
        self.paymentOptions.push({
          label: token.type.toUpperCase(),
          value: token.type,
          image: token.icon

        })
      })

    if (self.tokensOption.length === 1) {
      this.currentToken = self.tokensOption[0]
      this.publicKey = this.currentToken.value
      this.privateKey.key = this.currentToken.privateKey
    }

    let rpc = new JsonRpc(
      process.env[this.$store.state.settings.network].CACHE +
       'https://eos.greymass.com:443'
    )
    this.pairs = (
      await rpc.get_table_rows({
        json: true,
        code: 'swap.defi',
        scope: 'swap.defi',
        table: 'pairs',
        limit: -1
      })
    ).rows
  },
  updated () {},
  watch: {
    $route (to, from) {
      if (to !== from) {
        this.step = 1
        this.tab = this.$route.params.action === 'create' ? 'new' : 'import'
      }
    },
    '$store.state.investment.accountTokens': function () {
      this.paymentOptions = this.$store.state.investment.accountTokens.map(
        (o, i, all) => {
          o.label = o.type
          o.value = o.type
          o.amount = isNaN(o.amount) ? 0 : o.amount
          o.image = o.icon
          return o
        }
      )
      if (this.paymentOptions.length) {
        this.paymentOption = this.paymentOptions.find(
          (o) => o.type === this.paymentOptions[0].chain
        )
        if (
          !this.paymentOption &&
          this.paymentOptions.length === 1 &&
          this.paymentOptions[0].chain === 'eos'
        ) {
          this.paymentOption = this.paymentOptions[0]
        }
      }

      this.triggerTxData()
    },
    paymentOption () {
      this.triggerTxData()
    },
    step (newVal, old) {
      if (newVal === 2) {
        this.getAccountNames()
      }
    }
  },
  methods: {
    triggerTxData () {
      this.ErrorMessage = null

      this.pairData = false

      if (
        this.paymentOption.chain === 'eos' &&
        this.paymentOption.value !== 'eos'
      ) {
        this.pairData = this.pairs.find(
          (w) =>
            (w.token1.symbol.split(',')[1].toLowerCase() === 'eos' &&
              this.paymentOption.value.toLowerCase() ===
                w.token0.symbol.split(',')[1].toLowerCase()) ||
            (w.token0.symbol.split(',')[1].toLowerCase() === 'eos' &&
              this.paymentOption.value.toLowerCase() ===
                w.token1.symbol.split(',')[1].toLowerCase())
        )

        if (this.pairData && parseFloat(this.pairData.liquidity_token) !== 0) {
          let multiplier = parseFloat(this.pairData.price1_last)
          let contract = this.pairData.token0.contract
          let precision = this.pairData.token0.symbol.split(',')[0]
          if (
            this.pairData.token0.symbol.split(',')[1].toLowerCase() === 'eos'
          ) {
            multiplier = parseFloat(this.pairData.price0_last)
            contract = this.pairData.token1.contract
            precision = this.pairData.token1.symbol.split(',')[0]
          }

          this.pairData.contract = contract
          this.pairData.eosQuivalent = parseFloat(0.35 * multiplier).toFixed(precision)
          // this.$refs.transact.setTxData(this.getTxData())
        } else {
          this.pairData = false
        }
      }

      this.validate()

      this.$refs.transact.setTxData(this.getTxData())
    },
    setSuccessData () {
      this.success = true
    },
    validate () {
      if (
        (this.paymentOption.value === 'eos' &&
          (+this.paymentOption.amount === 0 ||
            +this.paymentOption.amount < 0.35)) ||
        (this.paymentOption.value !== 'eos' &&
          this.pairData &&
          this.pairData.eosQuivalent > +this.paymentOption.amount)
      ) {
        this.ErrorMessage = 'Insufficient funds'
      } else if (this.paymentOption.value !== 'eos' && !this.pairData) {
        this.ErrorMessage =
          'Cannot Pay with ' + this.paymentOption.value.toUpperCase()
      }
    },
    generateKeyPair () {
      this.mnemonicAccounts = this.$store.state.wallets.tokens.filter(
        (o, i, self) =>
          o.chain === 'eos' &&
          o.origin === 'mnemonic' &&
          self.findIndex((a) => a.key === o.key) === i
      )
      setTimeout(async () => {
        await HD.Wallet('eos', this.mnemonicAccounts.length).then(
          async (keys) => {
            this.publicKey = keys.publicKey
            this.privateKey.key = keys.privateKey
            // return self.$configManager.saveWalletAndKey(name.label, self.vertoPassword, null, keys.publicKey, keys.privateKey, name.value, 'mnemonic')
          }
        )
      }, 100)
      /*
      ecc.randomKey().then(privateWif => {
        this.publicKey = ecc.privateToPublic(privateWif)
        this.privateKey.key = privateWif
      })
      */
    },
    validatePublicKey () {
      this.publicKey = false
      this.publicKeyUnchecked = this.publicKeyUnchecked.trim()
      if (eos.isPubKeyValid(this.publicKeyUnchecked)) {
        this.publicKey = this.publicKeyUnchecked
      }
    },
    getPublicKeyFromPrivate () {
      this.publicKey = false

      if (!this.privateKey.key) return

      if (eos.isPrivKeyValid(this.privateKey.key.trim())) {
        this.publicKey = ecc.privateToPublic(this.privateKey.key)
      } else {
        this.publicKey = null
      }
    },
    checkVertoPassword () {
      this.vertoPasswordWrong = false
      this.vertoPassordValid = false
      if (this.vertoPassword.length > 7) {
        try {
          const self = this
          this.$configManager
            .getConfig(this.vertoPassword)
            .then(function (result) {
              self.vertoPasswordWrong = false
              self.vertoPassordValid = true
            })
            .catch(function (err) {
              self.vertoPasswordWrong = true
              userError(err)
            })
        } catch (err) {
          self.vertoPasswordWrong = true
          userError(err)
        }
      }
    },
    validAccountName () {
      if (
        this.$store.state.currentwallet.config.keys.some(
          (key) =>
            key.name.toLowerCase() === this.accountName.label.toLowerCase()
        )
      ) {
        this.accountNameError = true
      } else {
        this.accountNameError = false
      }
    },
    cancelAccountName () {
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      this.step = 1
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
    getAccountNames () {
      const self = this
      this.spinnervisible = true
      eos
        .getAccountNamesFromPubKeyP(this.publicKey)
        .then(function (result) {
          self.accountNames = []
          self.accountsInVerto = []
          self.spinnervisible = false
          for (var i = 0; i < result.account_names.length; i++) {
            let account = self.$store.state.wallets.tokens.find(
              (o) =>
                o.chain === 'eos' &&
                o.name.toLowerCase() === result.account_names[i].toLowerCase()
            )
            if (!account) {
              self.accountNames.push({
                label: result.account_names[i],
                value: result.account_names[i]
              })
            } else {
              self.accountsInVerto.push(account)
            }
          }
          self.walletName = result.account_names[0]
        })
        .catch((err) => {
          self.spinnervisible = false
          userError('There was a problem getting account names', err)
        })
      this.prompt = true
    },
    async login () {
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        return
      }
      const results = await configManager.login(this.password)
      if (results.success) {
        this.step = 3
        this.upgradeAccountName()
      } else {
        if (results.message === 'no_default_key') {
        } else {
          this.passHasError = true
        }
      }
    },
    async createAccount () {
      this.$configManager
        .getConfig(this.vertoPassword)
        .then(async () => {
          try {
            await eos.transact(
              {
                actions: [
                  {
                    account: 'eosio',
                    name: 'newaccount',
                    authorization: [
                      {
                        actor: this.creator.name,
                        permission: 'active'
                      }
                    ],
                    data: {
                      creator: this.creator.name,
                      name: this.accountNew,
                      owner: {
                        threshold: 1,
                        keys: [
                          {
                            key: this.publicKey,
                            weight: 1
                          }
                        ],
                        accounts: [],
                        waits: []
                      },
                      active: {
                        threshold: 1,
                        keys: [
                          {
                            key: this.publicKey,
                            weight: 1
                          }
                        ],
                        accounts: [],
                        waits: []
                      }
                    }
                  }
                ]
              },
              { keyProvider: this.creator.privateKey }
            )
            this.AddAccountToConfig()
            this.step++
          } catch (error) {
            userError(error.toString())
          }
        })
        .catch((err) => {
          userError(err.toString())
        })
    },
    async addAccountList () {
      for (let index = 0; index < this.accountNameList.length; index++) {
        this.spinnervisible = true
        await this.upgradeAccountName(true, this.accountNameList[index].value)
        this.status = 'Importing ' + this.accountNameList[index].value + ' account...'
        await sleep(3000)
      }
      this.status = 'Refreshing wallet...'
      initWallet('all')
      setTimeout(() => {
        this.spinnervisible = false
        this.step = 4
      }, 3000)
    },
    async upgradeAccountName (importing = false, accountName = null) {
      let origin = 'imported'

      if (accountName) {
        this.accountName = { label: '', value: accountName }
      }

      if (this.source === 'accounts') {
        this.currentAccount = this.tableData.find(w => w.key.toLowerCase() === this.currentToken.value.toLowerCase())
        origin = this.currentAccount.origin
      } else if (this.source === 'new') {
        origin = 'mnemonic'
      }

      if (!this.currentAccount) {
        this.currentAccount = {}
        this.currentAccount.privateKey = this.privatekey.key
      }

      let currentType = this.currentAccount.type
      this.currentAccount.key = this.publicKey
      this.currentAccount.privateKey = this.privateKey.key
      this.currentAccount.chain = 'eos'
      this.currentAccount.type = 'eos'
      this.currentAccount.name = importing ? this.accountName.value : this.accountNew
      this.currentAccount.to = `/verto/wallets/${this.currentAccount.chain}/${this.currentAccount.type}/${this.currentAccount.name}`
      this.currentAccount.icon = 'https://files.coinswitch.co/public/coins/eos.png'

      // this.currentAccount.origin
      // Hability to have more than 1 EOS account associated with the same key

      if (currentType === 'verto' && !accountName) {
        this.$store.state.currentwallet.config.keys.filter(c => c.key === this.currentAccount.key && c.type === currentType).map(w => {
          w.name = this.currentAccount.name
          w.type = 'eos'
        })

        // this.$configManager.updateCurrentWallet(this.currentAccount)
        await this.$configManager.updateConfig(this.vertoPassword, this.$store.state.currentwallet.config)
      } else {
        await this.$configManager.saveWalletAndKey(this.currentAccount.name, this.vertoPassword, this.privateKeyPassword, this.currentAccount.key, this.currentAccount.privateKey, 'eos', origin)
      }
      if (!accountName) {
      // reset form variables
        this.vertoPassword = null
        this.privateKeyPassword = null

        this.$router.push('/verto/dashboard/' + this.currentAccount.name)
      }
    },
    checkPassword () {
      if (this.password.length > 2) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    getTxData () {
      let transactionObject = {
        actions: [
          {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [
              {
                actor: this.wallet.name,
                permission: 'active'
              }
            ],
            data: {
              from: this.wallet.name,
              to: 'signupeoseos',
              memo: this.accountNew.toLowerCase() + '-' + this.publicKey.trim(),
              quantity: '0.3500 EOS'
            }
          }
        ],
        send: false
      }

      if (
        this.paymentOption.value !== 'eos' &&
        this.pairData &&
        !isNaN(this.pairData.eosQuivalent)
      ) {
        transactionObject.actions.unshift({
          account: this.pairData.contract,
          name: 'transfer',
          authorization: [
            {
              actor: this.wallet.name,
              permission: 'active'
            }
          ],
          data: {
            from: this.wallet.name,
            to: 'swap.defi',
            memo: 'swap,1,' + this.pairData.id,
            quantity:
              this.pairData.eosQuivalent +
              ' ' +
              this.paymentOption.value.toUpperCase()
          }
        })
      }

      return transactionObject
    },
    async checkName () {
      this.inError = false
      if (this.accountNew.length === 12) {
        if (
          /(^[a-z1-5]{1}([a-z1-5.]{0,10}[a-z1-5])?$)/g.test(this.accountNew)
        ) {
          this.showNextButtonToPassword = true
          try {
            await eos.getAccount(this.accountNew)
            this.inError = true
            this.errorMessage = 'Account Name Taken'
          } catch (error) {
            this.inError = false
            this.showNextButtonToPassword = true
          }
        } else {
          this.inError = true
          this.errorMessage = 'Invalid Account Name'
          this.showNextButtonToPassword = false
        }
      } else {
        this.inError = true
        this.errorMessage = 'You need exactly 12 characters'
        this.showNextButtonToPassword = false
      }
    },
    showMore () {},
    changeSlider () {
      if (this.slider >= 0) {
        this.sendAmount =
          Math.round(10000 * this.eosbalance * (this.slider / 100)) / 10000
      } else {
        this.sendAmount =
          Math.round(10000 * this.stakedAmount * (this.slider / 100)) / 10000
      }
      this.checkAmount()
    },
    checkAmount () {
      this.navigationButtons.amount = false

      if (+this.sendAmount > 0.0 && +this.sendAmount <= +this.eosbalance) {
        this.slider = Math.round(100 * (this.sendAmount / +this.eosbalance))
        this.navigationButtons.amount = true
        this.progColor = 'green'
      } else if (
        +this.sendAmount < 0.0 &&
        +this.sendAmount <= +this.stakedAmount
      ) {
        this.slider = Math.round(100 * (this.sendAmount / +this.stakedAmount))
        // console.log('this.slider', this.slider)
        this.navigationButtons.amount = true
        this.progColor = 'red'
      }
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(
        this.$store.state.currentwallet.wallet.privateKeyEncrypted
      )
      this.privateKey = this.$configManager.decryptPrivateKey(
        this.privateKeyPassword,
        privateKeyEncrypted
      )
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.optionTab {
  max-width: 500px;
}
/deep/ .q-menu.q-position-engine.scroll {
    height:220px
}
 .dark-theme /deep/ svg {
  color:white  !important
}
.chain-tools-wrapper {
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

          .--title {
            font-size: 25px;
            font-family: $Titillium;
            font-weight: $regular;
            color: #2a2a2a;
            margin: 0px;
            padding-left: 25px;
            padding-top: 20px;
            position: relative;
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
            width: fit-content;
            text-transform: initial !important;
            margin-left: 10px;
            margin-bottom: 10px;
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

            &.hr-vertical {
              max-width: 50px;

              .bar {
                height: 30px;
                width: 4px;
                background: #ffb200;
                margin-top: 5px;
                border-radius: 10px;
              }
            }
          }

          .--back-btn {
            position: absolute;
            right: 0px;
            top: 6px;
          }

          .--subtitle {
            font-size: 17px;
            color: #000;
            font-family: $Titillium;
            font-weight: $regular;
            line-height: 20px;
            margin-top: 10px;
            margin-bottom: 30px;

            ul {
              padding: 0px;
              margin: 0px;
              margin-left: 20px;

              li {
                font-size: 15px;
                font-weight: $bold;
                margin-bottom: 10px;
                line-height: 15px;
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
          }

          .--title,
          .--amount {
            font-size: 15px;
            font-family: $Titillium;
            font-weight: $bold;
            color: #b0b0b0;
            text-transform: initial !important;
            line-height: 20px;
          }

          .--alert {
            font-size: 17px;
            line-height: 21px;
            font-family: $Titillium;
          }

          .--amount {
            color: #2a2a2a !important;
          }
        }
      }
    }

    &.open {
      margin-bottom: -100px;

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
        padding-left: 8px;
        min-height: $height;
        padding-bottom: 0px;

        .q-item__section {
          padding-right: 0px;
          min-width: 36px;

          .q-item__label + .q-item__label {
            margin-top: 0px;
            text-overflow: ellipsis;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
}

/deep/ .option--avatar {
  // border: 1px solid;
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
}
.dark-theme {
  .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor {
    background-color: #04111f;
  }
  .chain-tools-wrapper--list
    .list-wrapper--chain__eos-to-vtx-convertor
    .--subtitle {
    color: #ccc;
  }
  .chain-tools-wrapper--list
    .list-wrapper
    .select-input
    .q-field__control
    .q-field__native
    .q-item
    .q-item__section
    .q-item__label
    + .q-item__label {
    color: #ccc !important;
  }
  .chain-tools-wrapper--list
    .list-wrapper--chain__eos-to-vtx-convertor
    .--amount {
    color: #fff !important;
  }
  .chain-tools-wrapper--list
    .list-wrapper--chain__eos-to-vtx-convertor
    .--subtitle
    ul
    li
    span {
    color: #ccc;
  }
}
/deep/ .q-stepper {
  &.q-dark {
    background: #04111f;
    .q-tab-panels {
      background: #04111f;
    }
    .q-stepper__title {
      color: #ccc !important;
    }
  }
}
</style>
