<template>
  <q-page
    class="column import-private-key"
    :class="{
      'dark-theme': $store.state.settings.lightMode === 'true',
      'text-black bg-grey-12': $store.state.settings.lightMode === 'false',
      'desktop-marg': screenSize > 1024,
      'mobile-pad': screenSize < 1024,
    }"
  >
    <q-header v-if="$q.platform.is.mobile">
      <q-toolbar
        :class="
          $store.state.settings.lightMode === 'true'
            ? 'text-white mobile-card'
            : 'bg-white text-black'
        "
      >
        <q-btn
          flat
          round
          dense
          icon="arrow_back_ios"
          class="q-mr-sm"
          @click="
            $router.push({
              name: 'accounts',
              params: { accounts: 'receive', tab: 'import' },
            })
          "
        />
        <q-toolbar-title v-show="showMainSteps">
           {{(!watch ? 'Import ' : 'Watch ' )+ getChainLabel(currentChain) }} wallet
        </q-toolbar-title>
        <q-toolbar-title v-show="!showMainSteps">
          Save Private Key
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
          @click="
            $router.push({
              name: 'accounts',
              params: { accounts: 'receive', tab: 'import' },
            })
          "
        />
      </q-toolbar>
    </q-header>

    <div
      :class="{
        'dark-theme': $store.state.settings.lightMode === 'true',
        'space-top': $q.platform.is.mobile,
      }"
      style="height: 100vh"
    >
      <div class="desktop-version full-height">
        <div class="row full-height">
          <div class="col col-md-3" v-if="false">
            <div class="wallets-container" style="height: 100%">
              <profile-header
                :isMobile="false"
                class="marg"
                version="type2222"
              />
              <wallets
                :isMobile="false"
                class="full-height max-height"
                :showWallets="false"
                :isWalletsPage="false"
                :isWalletDetail="false"
              />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-12">
            <div
              class="desktop-card-style apps-section q-mb-sm"
              :class="{
                'dark-theme': $store.state.settings.lightMode === 'true',
              }"
            >
              <div class="chain-tools-wrapper">
                <div class="standard-content" v-if="!$q.platform.is.mobile">
                  <h2
                    v-show="showMainSteps"
                    class="standard-content--title flex"
                  >
                    {{(!watch ? 'Import ' : 'Watch ' )+ getChainLabel(currentChain) }} wallet
                  </h2>
                  <h2
                    v-show="!showMainSteps"
                    class="standard-content--title flex"
                  >
                    Save Private Key
                  </h2>
                </div>

                <div class="q-ml-lg">
                  <div class="text-body1 q-pb-md">
                    Click on a button to switch mode<br />
                    - Watch mode requires only your {{currentChain == 'EOS' ? 'account name' : 'public key'}}<br />
                    - You can send and sign transactions only with an imported
                    account<br />
                  </div>
                  <q-btn
                    @click="currentChain == 'ETH' ? $router.push('/verto/import-private-key/eth') : watch = false"

                    class="q-ml-md q-mr-md"
                    rounded
                    :color="watch ? 'white' : 'black'"
                    :text-color="watch ? 'black' : 'white'"
                    label="Import"
                  />
                  <q-btn
                    @click="watch = true"
                    :color="watch ? 'black' : 'white'"
                    :text-color="watch ? 'white' : 'black'"
                    rounded
                    label="Watch"
                  />
                </div>
                <div class="chain-tools-wrapper--list open q-mt-sm">
                  <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                      <div v-show="showMainSteps">
                        <q-stepper
                          :dark="$store.state.settings.lightMode === 'true'"
                          :light="$store.state.settings.lightMode === 'false'"
                          v-model="step"
                          done-color="green"
                          ref="stepper"
                          alternative-labels
                          vertical
                          color="primary"
                          animated
                          flat
                        >
                          <!--
                                                    1.Private key
                                                    -->
                          <q-step
                            :title="watch ? (currentChain == 'EOS' ? 'Account name' : 'Public key') : 'Private Key'"
                            :name="1"
                            prefix="1"
                            order="10"
                            :done="step > 1"
                          >
                            <div class="text-black">
                              <div class="text-h4 --subtitle">
                                <ul>
                                  <li>
                                    <span>
                                      <span
                                        v-if="!chainKeyNext || chainKeyInvalid"
                                      >
                                        <q-chip
                                          dense
                                          color="red"
                                          class="sm-circle shadow-1"
                                          >&nbsp;</q-chip
                                        >
                                      </span>
                                      <span v-else>
                                        <q-chip
                                          dense
                                          color="green"
                                          class="sm-circle shadow-1"
                                          >&nbsp;</q-chip
                                        >
                                      </span>
                                      A valid {{ getChainLabel(currentChain) }}
                                      {{ watch ? (currentChain == 'EOS' ? 'Account name' : 'Public key') : "private Key" }}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <span>
                                <q-input
                                  v-if="!watch"
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.addressPriv"
                                  :error="addWallet.addressError"
                                  @input="getPubKeyFromPrivate()"
                                  @keyup.enter="nextFromPriv"
                                  :label="$t('EosAccount.enter_private_key')"
                                />
                                <q-input
                                  v-else
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.address"
                                  :error="addWallet.addressError"
                                  @keyup.enter="nextFromPriv"
                                  @input="
                                    watchStatus = null;
                                    addWallet.walletName =
                                      currentChain == 'EOS' ?  addWallet.address :
                                      getChainLabel(currentChain) +
                                      '...' +
                                      addWallet.address.slice(-5);
                                  "
                                  :label="'Enter '+(currentChain == 'EOS' ? 'Account name' : 'Public key')"
                                />
                                <q-input
                                  style="max-width: 300px"
                                  class="q-mt-md"
                                  v-if="
                                    watch &&
                                    addWallet.address &&
                                    addWallet.address.length && currentChain !== 'EOS'
                                  "
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.walletName"
                                  :error="addWallet.addressError"
                                  label="Wallet name"
                                />
                              </span>
                              <div
                                v-show="chainKeyInvalid && !watch"
                                class="text-h6 text-red"
                              >
                                Key invalid
                              </div>
                              <div
                                class="text-green"
                                v-if="watchStatus == 'added'"
                              >
                                Account succesfully added
                              </div>
                              <q-stepper-navigation
                                v-else
                                v-show="
                                  (chainKeyNext && !chainKeyInvalid) ||
                                  (watch &&
                                    addWallet.address &&
                                    addWallet.address.length)
                                "
                                class="flex"
                              >
                                <q-btn
                                  :disable="
                                    !addWallet.walletName.trim().length && watch
                                  "
                                  @click="nextFromPriv()"
                                  color="deep-purple-14"
                                  rounded
                                  :label="watch ? 'Add account' : $t('next')"
                                />
                              </q-stepper-navigation>
                            </div>
                          </q-step>

                          <!--
                                                    2. Wallet name
                                                    -->
                          <q-step
                            v-if="!watch"
                            title="Current Wallet Name"
                            :name="2"
                            prefix="2"
                            order="30"
                            :done="step > 2"
                          >
                            <q-btn
                              flat
                              @click="$refs.stepper.previous()"
                              unelevated
                              icon="keyboard_arrow_up"
                              color="primary"
                              class="--back-btn"
                            />
                            <div class="text-black">
                              <div class="text-h4 --subtitle">
                                <q-input
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.walletName"
                                  :error="addWallet.addressError"
                                  label="Enter wallet name"
                                />
                                <span class="text-body2"
                                  >At least 4 characters</span
                                >
                              </div>
                              <q-stepper-navigation class="flex justify-end">
                                <q-btn
                                  :disable="addWallet.walletName.length < 4"
                                  @click="$refs.stepper.next()"
                                  color="deep-purple-14"
                                  class="--next-btn"
                                  rounded
                                  :label="$t('next')"
                                />
                              </q-stepper-navigation>
                            </div>
                          </q-step>
                          <!--
                                                    4. Verto Password
                                                    -->
                          <q-step
                            v-if="!watch"
                            title="Verto Password"
                            :name="3"
                            prefix="3"
                            order="40"
                            :done="step > 3"
                          >
                            <q-btn
                              flat
                              @click="$refs.stepper.previous()"
                              unelevated
                              icon="keyboard_arrow_up"
                              color="primary"
                              class="--back-btn"
                            />
                            <div class="text-black">
                              <div>
                                <q-input
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.vertoPassword"
                                  @input="showSubmitKey"
                                  @keyup.enter="addEosAddress"
                                  v-bind:label="
                                    $t('CreateVertoPassword.vertopassword')
                                  "
                                  :type="isPwd ? 'password' : 'text'"
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
                              </div>
                              <div
                                v-show="incorrectPassword"
                                class="text-h6 text-uppercase text-red q-pa-lg"
                              >
                                {{ $t("Welcome.incorrect") }}
                              </div>
                              <div
                                v-show="walletAddressUsed"
                                class="text-h6 text-uppercase text-red q-pa-lg"
                              >
                                {{ $t("DisplayKey.address_is_used") }}
                              </div>
                              <div
                                v-show="unknownError"
                                class="text-h6 text-uppercase text-red q-pa-lg"
                              >
                                Unknown Error
                              </div>
                              <q-stepper-navigation
                                v-show="submitKey"
                                class="flex justify-end"
                              >
                                <q-btn
                                  @click="addChainAddress()"
                                  color="deep-purple-14"
                                  class="--next-btn"
                                  rounded
                                  :label="$t('next')"
                                />
                              </q-stepper-navigation>
                            </div>
                          </q-step>
                        </q-stepper>
                      </div>
                      <div v-show="!showMainSteps">
                        <q-stepper
                          v-model="step2"
                          done-color="green"
                          ref="stepperFilePassword"
                          alternative-labels
                          vertical
                          color="primary"
                          animated
                          flat
                        >
                          <!--
                                                1.Private key
                                                -->
                          <q-step
                            title="File Password"
                            :name="1"
                            prefix="1"
                            :done="step2 > 1"
                          >
                            <q-btn
                              flat
                              @click="showMainSteps = true"
                              unelevated
                              icon="keyboard_arrow_up"
                              color="primary"
                              class="--back-btn"
                            />
                            <div class="text-black">
                              <div class="text-h4 --subtitle">
                                <ul>
                                  <li>
                                    <span
                                      >Recommended to be different than your
                                      wallet password</span
                                    >
                                  </li>
                                  <li>
                                    <span v-show="!filePasswordApproved">
                                      <q-chip
                                        dense
                                        color="red"
                                        class="sm-circle shadow-1"
                                        >&nbsp;</q-chip
                                      >
                                    </span>
                                    <span v-show="filePasswordApproved">
                                      <q-chip
                                        dense
                                        color="green"
                                        class="sm-circle shadow-1"
                                        >&nbsp;</q-chip
                                      >
                                    </span>
                                    Minimum 8 Digits
                                  </li>
                                </ul>
                              </div>
                              <span class="q-pa-sm">
                                <q-input
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.filePassword"
                                  @input="filePasswordCheck"
                                  label="Password For The File"
                                  @keyup.enter="gotoFileConfirmPassword()"
                                  :type="isPwd ? 'password' : 'text'"
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
                              </span>
                              <q-stepper-navigation
                                v-show="filePasswordApproved"
                                class="flex justify-end"
                              >
                                <q-btn
                                  @click="gotoFileConfirmPassword()"
                                  color="deep-purple-14"
                                  class="--next-btn"
                                  rounded
                                  :label="$t('SaveYourKeys.create')"
                                />
                              </q-stepper-navigation>
                            </div>
                          </q-step>
                          <!--
                                                2. Confirm
                                                -->
                          <q-step
                            title="Confirm Password"
                            :name="2"
                            prefix="2"
                            :done="step2 > 2"
                          >
                            <q-btn
                              flat
                              @click="$refs.stepperFilePassword.previous()"
                              unelevated
                              icon="keyboard_arrow_up"
                              color="primary"
                              class="--back-btn"
                            />
                            <div class="text-black">
                              <span class="q-pa-sm">
                                <q-input
                                  :dark="
                                    $store.state.settings.lightMode === 'true'
                                  "
                                  :light="
                                    $store.state.settings.lightMode === 'false'
                                  "
                                  debounce="500"
                                  rounded
                                  outlined
                                  color="purple"
                                  v-model="addWallet.filePasswordConfirm"
                                  @input="filePasswordConfirmCheck"
                                  label="Confirm Password For The File"
                                  @keyup.enter="gotToSaveFileInWallet()"
                                  :type="isPwd ? 'password' : 'text'"
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
                              </span>
                              <div
                                class="q-pa-sm"
                                v-show="filePasswordConfirmApproved"
                                @click="gotToSaveFileInWallet()"
                              >
                                <q-icon
                                  name="navigate_next"
                                  size="3.2rem"
                                  color="green"
                                >
                                  <q-tooltip>{{
                                    $t("SaveYourKeys.create")
                                  }}</q-tooltip>
                                </q-icon>
                              </div>
                              <q-stepper-navigation
                                v-show="filePasswordConfirmApproved"
                                class="flex justify-end"
                              >
                                <q-btn
                                  @click="gotToSaveFileInWallet()"
                                  color="deep-purple-14"
                                  class="--next-btn"
                                  rounded
                                  :label="$t('SaveYourKeys.create')"
                                />
                              </q-stepper-navigation>
                            </div>
                          </q-step>
                          <!--
                                                3. Save File In Wallet
                                                -->
                          <q-step
                            title="Save In Wallet"
                            :name="3"
                            prefix="3"
                            :done="step2 > 3"
                          >
                            <q-btn
                              flat
                              @click="$refs.stepperFilePassword.previous()"
                              unelevated
                              icon="keyboard_arrow_up"
                              color="primary"
                              class="--back-btn"
                            />
                            <div class="text-black">
                              <div class="text-h4 --subtitle">
                                <ul>
                                  <li>
                                    <span
                                      >Encrypt the private key in the
                                      wallet?</span
                                    >
                                  </li>
                                </ul>
                              </div>
                              <q-stepper-navigation class="flex justify-end">
                                <q-btn
                                  @click="gotToVertoPassword(true)"
                                  outline
                                  color="deep-purple-14 q-mr-md"
                                  class="--next-btn"
                                  rounded
                                  label="Yes"
                                />
                                <q-btn
                                  @click="gotToVertoPassword(false)"
                                  color="deep-purple-14"
                                  class="--next-btn"
                                  rounded
                                  label="No"
                                />
                              </q-stepper-navigation>
                            </div>
                          </q-step>
                        </q-stepper>
                      </div>
                    </div>
                    <br /><br /><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-dialog
        v-if="false"
        v-model="accDialog"
        persistent
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card
          class="mobile-version"
          :class="
            $store.state.settings.lightMode === 'true'
              ? 'text-white mobile-card'
              : 'bg-white text-black'
          "
        >
          <q-header>
            <q-toolbar
              :class="
                $store.state.settings.lightMode === 'true'
                  ? 'text-white mobile-card'
                  : 'bg-white text-black'
              "
            >
              <q-btn
                flat
                round
                dense
                icon="arrow_back_ios"
                class="q-mr-sm"
                to="/verto/manage/receive"
              />
              <q-toolbar-title v-show="showMainSteps">
                Import {{ getChainLabel(currentChain) }} wallet
              </q-toolbar-title>
              <q-toolbar-title v-show="!showMainSteps">
                Save Private Key
              </q-toolbar-title>
              <q-btn
                flat
                round
                dense
                icon="close"
                v-close-popup
                to="/verto/manage/receive"
              />
            </q-toolbar>
          </q-header>

          <div class="chain-tools-wrapper--">
            <div class="standard-content">
              <!-- <h2 v-show="showMainSteps" class="standard-content--title flex justify-center">
                        <q-btn flat unelevated class="btn-align-left" to="/verto/profile" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" icon="keyboard_backspace" />
                        Import Current Account
                    </h2>
                    <h2 v-show="!showMainSteps" class="standard-content--title flex justify-center">
                        <q-btn flat unelevated class="btn-align-left" to="/verto/profile" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" icon="keyboard_backspace" />
                        Save Private Key
                    </h2> -->
              <div class="privatekey_bg flex flex-center">
                <img height="200" src="statics/privatekey_bg.svg" alt="" />
              </div>
            </div>
            <div class="chain-tools-wrapper--list_ open">
              <div class="list-wrapper">
                <div class="list-wrapper--chain__eos-to-vtx-convertor">
                  <div v-show="showMainSteps">
                    <q-stepper
                      :dark="$store.state.settings.lightMode === 'true'"
                      :light="$store.state.settings.lightMode === 'false'"
                      v-model="step"
                      done-color="green"
                      ref="stepper"
                      alternative-labels
                      vertical
                      color="primary"
                      animated
                      flat
                    >
                      <!--
                                            1.Private key
                                            -->
                      <q-step
                        title="Private Key"
                        :name="1"
                        prefix="1"
                        order="10"
                        :done="step > 1"
                      >
                        <div
                          :class="
                            $store.state.settings.lightMode === 'true'
                              ? 'text-white mobile-card'
                              : 'bg-white text-black'
                          "
                        >
                          <div class="text-h4_ --subtitle">
                            <ul>
                              <li>
                                <span>
                                  <span v-if="!chainKeyNext || chainKeyInvalid">
                                    <q-chip
                                      dense
                                      color="red"
                                      class="sm-circle shadow-1"
                                      >&nbsp;</q-chip
                                    >
                                  </span>
                                  <span v-else>
                                    <q-chip
                                      dense
                                      color="green"
                                      class="sm-circle shadow-1"
                                      >&nbsp;</q-chip
                                    >
                                  </span>
                                  A valid Current private key
                                </span>
                              </li>
                            </ul>
                          </div>
                          <span>
                            <q-input
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              debounce="500"
                              rounded
                              outlined
                              color="purple"
                              v-model="addWallet.addressPriv"
                              :error="addWallet.addressError"
                              @input="getPubKeyFromPrivate"
                              @keyup.enter="nextFromPriv"
                              :label="$t('EosAccount.enter_private_key')"
                            />
                          </span>
                          <div
                            v-show="chainKeyInvalid"
                            class="text-h6 text-red"
                          >
                            Key invalid
                          </div>
                          <q-stepper-navigation
                            v-show="chainKeyNext && !chainKeyInvalid"
                            class="flex justify-end"
                          >
                            <q-btn
                              @click="nextFromPriv()"
                              color="deep-purple-14"
                              class="--next-btn"
                              rounded
                              :label="$t('next')"
                            />
                          </q-stepper-navigation>
                        </div>
                      </q-step>

                      <!--
                                            2. Wallet name
                                            -->
                      <q-step
                        title="Current Wallet Name"
                        :name="2"
                        prefix="2"
                        order="30"
                        :done="step > 2"
                      >
                        <q-btn
                          flat
                          @click="$refs.stepper.previous()"
                          unelevated
                          icon="keyboard_arrow_up"
                          color="primary"
                          class="--back-btn"
                        />
                        <div
                          :class="
                            $store.state.settings.lightMode === 'true'
                              ? 'text-white mobile-card'
                              : 'bg-white text-black'
                          "
                        >
                          <div class="text-h4 --subtitle">
                            <q-input
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              debounce="500"
                              rounded
                              outlined
                              color="purple"
                              v-model="addWallet.walletName"
                              :error="addWallet.addressError"
                              label="Enter wallet name"
                            />
                            <span class="text-body2"
                              >At least 4 characters</span
                            >
                          </div>
                          <q-stepper-navigation class="flex justify-end">
                            <q-btn
                              :disable="addWallet.walletName.length < 4"
                              @click="$refs.stepper.next()"
                              color="deep-purple-14"
                              class="--next-btn"
                              rounded
                              :label="$t('next')"
                            />
                          </q-stepper-navigation>
                        </div>
                      </q-step>
                      <!--
                                            4. Verto Password
                                            -->
                      <q-step
                        title="Verto Password"
                        :name="3"
                        prefix="3"
                        order="40"
                        :done="step > 3"
                      >
                        <q-btn
                          flat
                          @click="$refs.stepper.previous()"
                          unelevated
                          icon="keyboard_arrow_up"
                          color="primary"
                          class="--back-btn"
                        />
                        <div
                          :class="
                            $store.state.settings.lightMode === 'true'
                              ? 'text-white mobile-card'
                              : 'bg-white text-black'
                          "
                        >
                          <div>
                            <q-input
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              debounce="500"
                              rounded
                              outlined
                              color="purple"
                              v-model="addWallet.vertoPassword"
                              @input="showSubmitKey"
                              @keyup.enter="addEosAddress"
                              v-bind:label="
                                $t('CreateVertoPassword.vertopassword')
                              "
                              :type="isPwd ? 'password' : 'text'"
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
                          </div>
                          <div
                            v-show="incorrectPassword"
                            class="text-h6 text-uppercase text-red q-pa-lg"
                          >
                            {{ $t("Welcome.incorrect") }}
                          </div>
                          <div
                            v-show="walletAddressUsed"
                            class="text-h6 text-uppercase text-red q-pa-lg"
                          >
                            {{ $t("DisplayKey.address_is_used") }}
                          </div>
                          <div
                            v-show="unknownError"
                            class="text-h6 text-uppercase text-red q-pa-lg"
                          >
                            Unknown Error
                          </div>
                          <q-stepper-navigation
                            v-show="submitKey"
                            class="flex justify-end"
                          >
                            <q-btn
                              @click="addChainAddress()"
                              color="deep-purple-14"
                              class="--next-btn"
                              rounded
                              :label="$t('next')"
                            />
                          </q-stepper-navigation>
                        </div>
                      </q-step>
                    </q-stepper>
                  </div>
                  <div v-show="!showMainSteps">
                    <q-stepper
                      v-model="step2"
                      done-color="green"
                      ref="stepperFilePassword"
                      alternative-labels
                      vertical
                      color="primary"
                      animated
                      flat
                    >
                      <!--
                                        1.Private key
                                        -->
                      <q-step
                        title="File Password"
                        :name="1"
                        prefix="1"
                        :done="step2 > 1"
                      >
                        <q-btn
                          flat
                          @click="showMainSteps = true"
                          unelevated
                          icon="keyboard_arrow_up"
                          color="primary"
                          class="--back-btn"
                        />
                        <div
                          :class="
                            $store.state.settings.lightMode === 'true'
                              ? 'text-white mobile-card'
                              : 'bg-white text-black'
                          "
                        >
                          <div class="text-h4 --subtitle">
                            <ul>
                              <li>
                                <span
                                  >Recommended to be different than your wallet
                                  password</span
                                >
                              </li>
                              <li>
                                <span v-show="!filePasswordApproved">
                                  <q-chip
                                    dense
                                    color="red"
                                    class="sm-circle shadow-1"
                                    >&nbsp;</q-chip
                                  >
                                </span>
                                <span v-show="filePasswordApproved">
                                  <q-chip
                                    dense
                                    color="green"
                                    class="sm-circle shadow-1"
                                    >&nbsp;</q-chip
                                  >
                                </span>
                                Minimum 8 Digits
                              </li>
                            </ul>
                          </div>
                          <span class="q-pa-sm">
                            <q-input
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              debounce="500"
                              rounded
                              outlined
                              color="purple"
                              v-model="addWallet.filePassword"
                              @input="filePasswordCheck"
                              label="Password For The File"
                              @keyup.enter="gotoFileConfirmPassword()"
                              :type="isPwd ? 'password' : 'text'"
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
                          </span>
                          <q-stepper-navigation
                            v-show="filePasswordApproved"
                            class="flex justify-end"
                          >
                            <q-btn
                              @click="gotoFileConfirmPassword()"
                              color="deep-purple-14"
                              class="--next-btn"
                              rounded
                              :label="$t('SaveYourKeys.create')"
                            />
                          </q-stepper-navigation>
                        </div>
                      </q-step>
                      <!--
                                        2. Confirm
                                        -->
                      <q-step
                        title="Confirm Password"
                        :name="2"
                        prefix="2"
                        :done="step2 > 2"
                      >
                        <q-btn
                          flat
                          @click="$refs.stepperFilePassword.previous()"
                          unelevated
                          icon="keyboard_arrow_up"
                          color="primary"
                          class="--back-btn"
                        />
                        <div
                          :class="
                            $store.state.settings.lightMode === 'true'
                              ? 'text-white mobile-card'
                              : 'bg-white text-black'
                          "
                        >
                          <span class="q-pa-sm">
                            <q-input
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              debounce="500"
                              rounded
                              outlined
                              color="purple"
                              v-model="addWallet.filePasswordConfirm"
                              @input="filePasswordConfirmCheck"
                              label="Confirm Password For The File"
                              @keyup.enter="gotToSaveFileInWallet()"
                              :type="isPwd ? 'password' : 'text'"
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
                          </span>
                          <div
                            class="q-pa-sm"
                            v-show="filePasswordConfirmApproved"
                            @click="gotToSaveFileInWallet()"
                          >
                            <q-icon
                              name="navigate_next"
                              size="3.2rem"
                              color="green"
                            >
                              <q-tooltip>{{
                                $t("SaveYourKeys.create")
                              }}</q-tooltip>
                            </q-icon>
                          </div>
                          <q-stepper-navigation
                            v-show="filePasswordConfirmApproved"
                            class="flex justify-end"
                          >
                            <q-btn
                              @click="gotToSaveFileInWallet()"
                              color="deep-purple-14"
                              class="--next-btn"
                              rounded
                              :label="$t('SaveYourKeys.create')"
                            />
                          </q-stepper-navigation>
                        </div>
                      </q-step>
                      <!--
                                        3. Save File In Wallet
                                        -->
                      <q-step
                        title="Save In Wallet"
                        :name="3"
                        prefix="3"
                        :done="step2 > 3"
                      >
                        <q-btn
                          flat
                          @click="$refs.stepperFilePassword.previous()"
                          unelevated
                          icon="keyboard_arrow_up"
                          color="primary"
                          class="--back-btn"
                        />
                        <div
                          :class="
                            $store.state.settings.lightMode === 'true'
                              ? 'text-white mobile-card'
                              : 'bg-white text-black'
                          "
                        >
                          <div class="text-h4 --subtitle">
                            <ul>
                              <li>
                                <span
                                  >Encrypt the private key in the wallet?</span
                                >
                              </li>
                            </ul>
                          </div>
                          <q-stepper-navigation class="flex justify-end">
                            <q-btn
                              @click="gotToVertoPassword(true)"
                              outline
                              color="deep-purple-14 q-mr-md"
                              class="--next-btn"
                              rounded
                              label="Yes"
                            />
                            <q-btn
                              @click="gotToVertoPassword(false)"
                              color="deep-purple-14"
                              class="--next-btn"
                              rounded
                              label="No"
                            />
                          </q-stepper-navigation>
                        </div>
                      </q-step>
                    </q-stepper>
                  </div>
                </div>
                <br /><br /><br />
              </div>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import Formatter from '@/mixins/Formatter'
import initWallet from '@/util/Wallets2Tokens'
const Web3 = require('web3')
let web3 = new Web3(
  'https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63'
)
export default {
  mixins: [Formatter],
  components: {
    // desktop components
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      screenSize: 0,
      step: 1,
      watchStatus: null,
      watch: false,
      step2: 1,
      currentChain: null,
      isPwd: true,
      contractable: true,
      showMainSteps: true,
      filePasswordApproved: false,
      filePasswordConfirmApproved: false,
      chainKeyNext: false,
      submitKey: false,
      chainKeyInvalid: false,
      incorrectPassword: false,
      unknownError: false,
      walletAddressUsed: false,
      enableImport: true,
      confirmPassword: false,
      accountNames: [],
      wrongPrivateKey: false,
      accountIsNotValid: true,
      enteredPrivateKey: '',
      showSaveKey: false,
      addWallet: {
        walletName: '',
        address: '',
        addressPriv: '',
        vertoPassword: '',
        vertoPasswordError: '',
        filePassword: '',
        filePasswordConfirm: '',
        storeInWallet: false
      },
      accDialog: this.$q.platform.is.mobile || this.$isbex
    }
  },
  created () {
    this.getWindowWidth()
    this.watch = this.$route.params.watch
    window.addEventListener('resize', this.getWindowWidth)
    this.currentChain = this.$route.params.chain.toUpperCase()
    this.currentChain = this.$route.params.chain.toUpperCase()
    if (this.currentChain === 'ETH') this.watch = true
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    createKeys () {
      this.$router.push('create-keys')
    },
    filePasswordCheck: function () {
      this.filePasswordApproved = false
      if (this.addWallet.filePassword.length > 7) {
        this.filePasswordApproved = true
      }
    },
    filePasswordConfirmCheck () {
      this.filePasswordConfirmApproved = false
      if (this.addWallet.filePassword === this.addWallet.filePasswordConfirm) {
        this.filePasswordConfirmApproved = true
      }
    },
    gotoFileConfirmPassword () {
      if (this.filePasswordApproved) {
        this.$refs.stepperFilePassword.next()
      }
    },
    gotToSaveFileInWallet () {
      if (this.filePasswordConfirmApproved) {
        this.$refs.stepperFilePassword.next()
      }
    },
    gotToVertoPassword (saveFile) {
      this.addWallet.storeInWallet = saveFile
      this.showMainSteps = true
      this.$refs.stepperFilePassword.goTo(1)
      this.$refs.stepper.next()
    },
    createAccount () {
      this.$router.push('create-eos-account')
    },
    nextFromName () {
      this.addWallet.walletNameEmpty = false
      this.confirmPassword = true
    },
    addWatchAccount () {
      let watchAccounts = localStorage.getItem('watchAccounts')
      let account = {
        type: this.currentChain.toLowerCase(),
        key: this.addWallet.address,
        name: this.addWallet.walletName,
        watch: true
      }
      this.watchStatus = null
      if (watchAccounts) {
        watchAccounts = JSON.parse(watchAccounts)
        let exist = watchAccounts.find(
          (o) => o.key.toLowerCase() === this.addWallet.address.toLowerCase()
        )
        if (!exist) {
          watchAccounts.push(account)
          this.watchStatus = 'added'
          setTimeout(() => {
            initWallet('init')
          }, 100)
        } else {
          this.$q.notify({
            message: 'Key already exist',
            timeout: 2000,
            icon: 'check',
            textColor: 'white',
            type: 'negtive',
            position: 'center'
          })
        }
      } else {
        watchAccounts = [account]
        this.watchStatus = 'added'
        setTimeout(() => {
          initWallet('init')
        }, 100)
      }
      localStorage.setItem('watchAccounts', JSON.stringify(watchAccounts))
    },
    async nextFromPriv () {
      if (this.watch) {
        return this.addWatchAccount()
      }

      if (!this.chainKeyNext) {
        return
      }

      this.addWallet.address = await this.getPubKeyFromPrivate()
      if (this.addWallet.address) {
        this.$refs.stepper.next()
      }
    },
    async getPubKeyFromPrivate () {
      this.chainKeyNext = false
      this.chainKeyInvalid = false
      let publicKey = false
      const self = this
      let pubKeyFromPrivate = {
        async btc () {
          try {
            const bitcoin = require('bitcoinjs-lib')
            const keyPair = bitcoin.ECPair.fromWIF(self.addWallet.addressPriv)
            publicKey = keyPair.publicKey.toString('hex')

            const CryptoAccount = require('send-crypto').default

            const account = new CryptoAccount(keyPair.privateKey)
            publicKey = await account.address('BTC')

            if (publicKey && publicKey.toString().length) {
              return publicKey
            }
          } catch (e) {
            return publicKey
          }
        },
        async bsc () {
          let value = await allChains.eth()
          return value
        },
        async ftm () {
          let value = await allChains.eth()
          return value
        },
        async matic () {
          let value = await allChains.eth()
          return value
        },
        async avaxc () {
          let value = await allChains.eth()
          return value
        },
        async eth () {
          try {
            let account = await web3.eth.accounts.privateKeyToAccount(
              self.addWallet.addressPriv
            )
            if (account && account.address) {
              publicKey = account.address
            }
            return publicKey
          } catch (e) {
            console.log(e, 'e')
            return publicKey
          }
        }
      }

      let allChains = pubKeyFromPrivate
      let pubKey = await pubKeyFromPrivate[this.currentChain.toLowerCase()]()

      if (pubKey) {
        this.chainKeyNext = true
      } else {
        this.chainKeyInvalid = true
      }

      return pubKey
    },
    showSubmitKey () {
      this.resetErrors()
      if (this.addWallet.vertoPassword.length > 2) {
        this.submitKey = true
      } else {
        this.submitKey = false
      }
    },
    resetErrors () {
      this.incorrectPassword = false
      this.walletAddressUsed = false
      this.unknownError = false
    },
    addChainAddress: async function () {
      if (this.submitKey) {
        this.resetErrors()
        const result = await this.$configManager.saveWalletAndKey(
          this.addWallet.walletName,
          this.addWallet.vertoPassword,
          null,
          this.addWallet.address,
          this.addWallet.addressPriv,
          this.currentChain.toLowerCase(),
          'import'
        )

        if (result.success) {
          this.$router.push('/verto/dashboard/' + this.addWallet.walletName)
        } else {
          this.submitKey = false
          if (result.message === 'bad_password') {
            this.incorrectPassword = true
          } else if (result.message === 'address_already_used') {
            this.walletAddressUsed = true
          } else {
            this.unknownError = true
          }
        }
      }
    },
    cancelAddVertoAddress: function () {
      this.addWallet.walletNameEmpty = false
      this.addWallet.addressEmpty = false
      this.addWallet.vertoPasswordEmpty = false
      this.addWallet.walletName = ''
      this.addWallet.address = ''
      this.addWallet.addressPriv = ''
      this.addWallet.vertoPassword = ''
      this.addingWallet = false
    },
    cancel () {
      this.$router.push('/verto/dashboard')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.space-top {
  margin-top: 30px;
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
  padding-bottom: 50px;
}
.desktop-version {
  background: #e7e8e8;
  padding-top: 13vh;
  padding-left: 18vh;
  padding-bottom: 0px;
  padding-right: 18px;
  position: relative;
  overflow: hidden;
  @media screen and (min-width: 768px) {
    padding-top: 11vh;
    padding-bottom: 0px;
  }
}
.desktop-card-style {
  height: 101.5%;
  max-height: 101.5%;
  @media screen and (min-height: 700px) {
    // height: 54.5vh;
    max-height: 98.6%;
  }
  @media screen and (min-height: 760px) {
    // height: 54vh;
    max-height: 97%;
  }
  @media screen and (min-height: 800px) {
    // height: 55vh;
    max-height: 96.4%;
  }
  @media screen and (min-height: 870px) {
    // height: 56vh;
    max-height: 94.6%;
  }
}
.desktop-version {
  .standard-content {
    padding: 0% 2%;
  }
  .chain-tools-wrapper--list.open {
    padding: 0%;
  }
  /deep/ .profile-wrapper--header.desktop-ui {
    margin-bottom: 0px;
  }
  .standard-content--title {
    font-size: 25px;
  }
}
.dark-theme {
  .mobile-version {
    background: #04111f;
    .standard-content--title {
      color: #fff;
    }
    .standard-content--body__form .lab-input {
      color: #fff;
    }
    .standard-content--body__form .input-input {
      /deep/ button {
        color: #fff !important;
      }
    }
  }
  .desktop-version {
    background: #04111f;
    padding-bottom: 8px;
    min-height: 102vh;
    overflow: hidden;
    position: relative;
    scrollbar-width: 0px;
    .col-title h4 {
      color: #fff;
    }
    .standard-content--body__form .lab-input {
      color: #fff;
    }
  }
  .standard-content--body__form
    .select-input
    .q-field__control
    .q-field__native
    .q-item
    .q-item__section
    .q-item__label
    + .q-item__label {
    color: #ccc;
  }
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
      padding-left: 6%;
      padding-right: 6%;

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

.standard-content {
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // padding-bottom: 100px;
  .privatekey_bg {
    margin-top: -30px;

    img {
      width: 100%;
      max-width: 330px;
    }
  }

  &--title {
    font-size: 30px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 0px;
    margin-bottom: 0px;
    position: relative;
    z-index: 2;

    .btn-align-left {
      position: absolute;
      left: -35px;
      top: 10px;
    }
  }
}

.file-select-wrapper {
  border: 1px solid #ccc;
  border-radius: 100px;
  padding: 0px;
  overflow: hidden;
  position: relative;

  .icon-upload {
    font-size: 25px;
    position: absolute;
    right: 15px;
    opacity: 0.3;
  }

  label {
    width: 100%;
  }

  /deep/ .file-select > .select-button {
    padding: 0.12rem;
    color: transparent;
    background-color: #fbfbfb !important;
    padding: 10px 0px;
    border: none;
    flex-direction: row;
    justify-content: flex-start;
    display: flex;

    span {
      color: #000;
      padding: 0px 15px;
    }
  }
}

.sm-circle {
  height: 10px;
  width: 10px;
  margin-top: 0px;
  box-shadow: none;
  padding: 0px;
  margin-left: -20px;
}
.import-private-key {
  padding-bottom: 50px;
  @media screen and (min-width: 768px) {
    padding-bottom: 0px;
  }
  background: #f3f3f3 !important;
  &.dark-theme {
    .chain-tools-wrapper {
      background: #04111f;
      .standard-content--title {
        color: #fff !important;
      }
    }
  }
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
.chain-tools-wrapper--list /deep/ .list-wrapper--chain__eos-to-vtx-convertor {
  box-shadow: none !important;
}
</style>
