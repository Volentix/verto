<template>
  <div class="vault-section">
    <div class="fluid-container">
      <div class="row justify-between items-center sticky-header">
        <div class="col-4 flex vault-dropdown-col text-white">
          <q-btn-dropdown
            class="vault-dropdown-wrapper-btn" :class="{'active': toggleActive}"
            flat
            no-caps
            @click="toggleActive = !toggleActive"
            @hide="toggleActive = false"
            dark
            content-class="vault-dropdown-wrapper"
          >
            <template v-slot:label>
              <div class="flex text-white justify-start">
                <span class="imgs flex flex-center" :class="{'q-mr-md': $q.screen.width >= 768}">
                  <img :height="$q.screen.width >= 768 ? 45:26" :src="currentVault.vaultIcon" alt="">
                </span>
                <span class="column pairs vault-name justify-center items-start">
                  <span class="pair flex justify-start">Vault</span>
                  <span class="value flex justify-start text-capitalize">{{currentVault.vault}}</span>
                </span>
                <span v-if="$q.screen.width < 768" class="daily-change">Daily change: <b :class="currentVault.dailyChangeStyle">{{currentVault.dailyChange}}</b></span>
              </div>
            </template>
            <div class="column no-wrap dropdown-content">
              <div class="column nav q-pa-md text-white">
                <router-link to="/funds/sif-usdc-vault" class="text-white">SIF USDC Vault</router-link>
                <router-link to="/funds/pulsechain-vault" class="text-white">PulseChain Vault</router-link>
              </div>
            </div>
          </q-btn-dropdown>
          <div v-if="!canDeposit" class="q-ml-lg flex flex-center action-btn-wrapper">
            <q-btn color="white" class="q-mt-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Whitelist to deposit" />
          </div>
          <div v-else class="q-ml-lg flex flex-center action-btn-wrapper">
            <q-btn @click="depositPopup = true" color="white" class="q-mt-sm q-ml-sm q-mr-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Deposit" />
            <q-btn @click="withdrawPopup = true" color="white" class="q-mt-sm q-ml-sm q-mr-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Withdraw" />
          </div>
        </div>
        <div class="col-4 column items-center share-price-wrapper text-white">
          <span class="label">Share Price</span>
          <span class="value">{{currentVault.sharePrice}} <small>$US</small></span>
          <span v-if="$q.screen.width >= 768" class="daily-change">Daily change: <b :class="currentVault.dailyChangeStyle">{{currentVault.dailyChange}}</b></span>
        </div>
        <div class="col-4 network-wrapper text-white">
          <span class="column pairs items-end">
            <span class="pair flex items-center net-label">
              <img width="11" :src="'statics/staider/networks/'+currentVault.network+'.svg'" class="q-mr-sm" alt=""> Network
            </span>
            <span class="value text-bold net-value">{{currentVault.network}}</span>
          </span>
        </div>
      </div>
      <div class="row chart-row">
        <div class="col-12">
            <ChartFund :height="$q.screen.width > 768 ? '300':'250'" chartColor="#2EC083" fundID="0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" />
        </div>
      </div>
      <div class="row q-pl-lg q-pr-lg" :class="{'q-mt-lg q-pt-md': $q.screen.width > 768}">
        <div :class="{'col q-pr-md': $q.screen.width > 768,'col-6 q-pr-sm': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md apy flex items-center text-white">
            <img src="statics/staider/icon_apy.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">APY</span>
              <span class="value red">-3.89%</span>
            </div>
          </div>
        </div>
        <div :class="{'col q-pr-md': $q.screen.width > 768,'col-6 q-pl-sm': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md denomination flex items-center text-white">
            <img src="statics/staider/coins/usdc.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">Denomination <br>Asset</span>
            </div>
          </div>
        </div>
        <div :class="{'col-4': $q.screen.width > 768,'col-12': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md assets-under-management flex items-center text-white" :class="{'hovered': $q.screen.width < 768}">
            <img src="statics/staider/icon_assets.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">Assets Under Management</span>
              <span class="value">23,505.28 <small>$US</small></span>
            </div>
          </div>
        </div>
        <div :class="{'col q-pl-md': $q.screen.width > 768,'col-12': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md investors flex items-center text-white">
            <img src="statics/staider/icon_invest.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">investors</span>
              <span class="value">256</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-pl-lg q-pr-lg">
        <div class="col-12">
          <q-tabs
              v-model="tab"
              dense
              dark
              no-caps
              :inline-label="$q.screen.width > 768"
              indicator-color="transparent"
              :align="$q.screen.width > 768 ? 'left':'center'"
              active-color="white"
              class="text-grey-6 q-mt-lg q-pa-md vaults-tabs-wrapper" :class="{'full-width': $q.screen.width < 768}"
            >
            <q-tab dark name="vault-holdings" icon="img:statics/staider/icon_my_vaults.svg" label="Vault Holdings" />
            <q-tab dark name="activity" icon="img:statics/staider/icon_trades.svg" label="Activity" />
            <q-tab dark name="deposits" icon="img:statics/staider/icon_my_deposits.svg" label="Deposits" />
            <q-tab dark name="monthly-returns" icon="img:statics/staider/icon_returns.svg" label="Monthly Returns" />
          </q-tabs>
        </div>
        <div class="col-12">
          <q-tab-panels class="bg-transparent vaults-tabs-centent" dark v-model="tab" animated>
            <q-tab-panel dark name="vault-holdings" class="flex full-width">
              <q-table
                flat
                dark
                table-style="box-shadow: none;"
                title=""
                :data="datasCoins"
                :columns="columns"
                :loading="datasCoins.length === 0"
                row-key="asset"
                bordered
                v-if="$q.screen.width >= 768"
                class="q-mt-lg bg-transparent vaults-table full-width"
              >
                <template v-slot:body-cell-asset="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="imgs q-mr-sm">
                        <img :src="props.row.icon" alt="">
                      </span>
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.assetThicker.toUpperCase()}}</span>
                        <span :class="{
                          'text-grey-5': $store.state.settings.lightMode === 'true',
                          'text-light-blue-9': $store.state.settings.lightMode === 'true'
                          }" class="value text-capitalize">{{props.row.assetName}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-balance="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span  class="pair q-pr-xs allocation text-grey-3">{{formatNumber(props.row.allocation, 2)}}% </span>
                        <span class="pair text-bold">{{props.row.balance > 0 ? formatNumber(props.row.balance, 3) : 0}} {{props.row.assetThicker.toUpperCase()}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-price="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{formatNumber(props.row.price, 2)}} {{props.row.currency.toUpperCase()}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-dailyChange="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold" :class="{'text-pink-12': parseFloat(props.row.dailyChange) < 0, 'green plus-sign': parseFloat(props.row.dailyChange) > 0}">{{formatNumber(props.row.dailyChange, 2) + "%"}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-value="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{formatNumber(props.row.value, 2)}} {{props.row.currency.toUpperCase()}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
              </q-table>
              <div v-else class="mobile-table full-width">
                <div class="row q-pa-md" v-for="(coin, index) in datasCoins" :key="'coin'+index">
                  <div class="col-12 q-pt-md q-pb-md flex items-center">
                    <span class="imgs q-mr-sm">
                      <img height="40px" :src="coin.icon" alt="">
                    </span>
                    <span class="column pairs">
                      <span class="pair text-bold">{{coin.assetThicker.toUpperCase()}}</span>
                      <span :class="{
                        'text-grey-5': $store.state.settings.lightMode === 'true',
                        'text-light-blue-9': $store.state.settings.lightMode === 'true'
                        }" class="value text-capitalize">{{coin.assetName}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm">
                    <span class="column pairs standard-label">
                      <span class="pair text-grey-5"><small>Allocation</small></span>
                      <span class="pair text-bold standard-label text-grey-5">Balance</span>
                    </span>
                  </div>
                  <div class="col-6">
                    <span class="column pairs items-end standard-value">
                      <span class="pair q-pb-xs allocation text-grey-3">{{formatNumber(coin.allocation, 2)}}% </span>
                      <span class="pair text-bold">{{coin.balance > 0 ? formatNumber(coin.balance, 3) : 0}} {{coin.assetThicker.toUpperCase()}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Price</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{formatNumber(coin.price, 2)}} {{coin.currency.toUpperCase()}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Daily Change</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair text-bold" :class="{'text-pink-12': parseFloat(coin.dailyChange) < 0, 'green plus-sign': parseFloat(coin.dailyChange) > 0}">{{formatNumber(coin.dailyChange, 2) + "%"}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Value</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{formatNumber(coin.value, 2)}} {{coin.currency.toUpperCase()}}</span></span></div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel dark name="activity">
              <div class="q-mt-md">
                <q-btn-dropdown
                  class="activity-filter-dropdown-wrapper-btn q-pa-none"
                  flat
                  no-caps
                  dark
                  align="left"
                  content-class="vault-dropdown-wrapper"
                >
                  <template v-slot:label>
                    <span class="text-bold filter-title">Filter by</span>
                  </template>
                  <div class="column no-wrap dropdown-content q-pt-sm q-pb-sm coin-dropdown">
                    <div class="flex text-white q-pl-md q-pr-md q-pb-xs q-pt-xs coin-item justify-start">
                      <span class="text-bold filter-title">Trades</span>
                    </div>
                    <div class="flex text-white q-pl-md q-pr-md q-pb-xs q-pt-xs coin-item justify-start">
                      <span class="text-bold filter-title">Deposits</span>
                    </div>
                  </div>
                </q-btn-dropdown>
              </div>
              <activity-item :data="activity" v-for="(activity, index) in depositActivityData" :key="'activy_'+index" />
            </q-tab-panel>
            <q-tab-panel dark name="deposits">
              <div class="text-h6 q-mt-md">Deposits</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
            <q-tab-panel dark name="monthly-returns">
              <div class="text-h6 q-mt-md">Monthly Returns</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
    <q-dialog dark v-model="depositPopup">
      <q-card dark class="deposit-withdraw-popup-wrapper">
        <q-card-section class="row items-center q-pb-none">
          <div class="popup-title q-pl-sm">Deposit</div>
          <q-space />
          <q-btn icon="close" @click="depositPopup = false" size="sm" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section align="left">
          <div class="row">
            <div class="column q-pa-sm" :class="{'col-8':$q.screen.width > 643, 'col-12':$q.screen.width < 643}">
              <span class="instruction">Choose Amount and Token to deposit</span>
              <div class="deposit-amount-component column q-mt-md">
                <span class="label flex justify-between text-grey-6 q-mb-sm">
                  <span>Amount</span>
                  <span>2,500 USDC</span>
                </span>
                <div class="input-wrapper">
                  <q-input dark outlined v-model="amount" class="amount-input" />
                  <span class="hint text-grey-6 q-mt-sm flex">0.00 $US</span>
                  <div class="max-wrapper flex items-center">
                    <q-btn-dropdown
                      class="coin-dropdown-wrapper-btn"
                      flat
                      no-caps
                      dark
                      align="left"
                      content-class="vault-dropdown-wrapper coin-drop"
                    >
                      <template v-slot:label>
                        <div class="flex text-white coin-item justify-start">
                          <span class="imgs flex flex-center q-mr-md">
                            <img height="22" src="statics/staider/coins/usdc.svg" alt="">
                          </span>
                          <span class="column pairs vault-name coin justify-center items-start">
                            <span class="value flex justify-start text-capitalize text-bold">ETH</span>
                          </span>
                        </div>
                      </template>
                      <div class="column no-wrap dropdown-content q-pt-sm q-pb-sm coin-dropdown">
                        <div class="flex text-white q-pl-md q-pr-md q-pb-xs q-pt-xs coin-item justify-start">
                          <span class="imgs flex flex-center q-mr-md">
                            <img height="22" src="statics/staider/coins/eth.svg" alt="">
                          </span>
                          <span class="column pairs vault-name coin justify-center items-start">
                            <span class="value flex justify-start text-capitalize text-bold">ETH</span>
                          </span>
                        </div>
                        <div class="flex text-white q-pl-md q-pr-md q-pb-xs q-pt-xs coin-item justify-start">
                          <span class="imgs flex flex-center q-mr-md">
                            <img :height="22" src="statics/staider/coins/usdc.svg" alt="">
                          </span>
                          <span class="column pairs vault-name coin justify-center items-start">
                            <span class="value flex justify-start text-capitalize text-bold">USDC</span>
                          </span>
                        </div>
                      </div>
                    </q-btn-dropdown>
                    <q-btn color="transparent" unelevated text-color="white" class="max-btn" label="Max" />
                  </div>
                </div>
              </div>
              <div class="share-lockup-time q-mt-md">
                <span class="label">Shares Lockup Time</span> <span class="info" @mouseenter="showInfo = true" @mouseleave="showInfo = false">?</span>
                <span class="infobull-wrapper" :class="{'show': showInfo}">Amount of time an account has to wait between deposit and withdrawal</span>
              </div>
              <span class="share-lockup-amount text-grey-6">1 day</span>
              <q-btn color="white" flat class="advanced-settings-btn q-mt-sm q-pa-none" @click="advancedSettings = !advancedSettings" text-color="white" label="Advanced settings" no-caps :icon-right="advancedSettings ? 'expand_less':'expand_more'" />
              <div v-if="advancedSettings" class="column full-width">
                <div class="share-lockup-time q-mt-md q-mb-md">
                  <span class="label">Maximum Slippage</span> <span class="info" @mouseenter="showInfoSlippage = true" @mouseleave="showInfoSlippage = false">?</span>
                  <span class="infobull-wrapper" :class="{'show': showInfoSlippage}">Amount of time an account has to wait between deposit and withdrawal</span>
                </div>
                <q-input dark outlined v-model="slippage" class="amount-input q-mb-md" />
              </div>
              <div class="flex items-center">
                <q-checkbox dark v-model="termsConditions" class="termsConditions"><span>I agree to the</span></q-checkbox>
                <q-btn color="yellow" flat no-caps text-color="yellow" @click="termsConditionPopup = true" label="Terms & Conditions." />
              </div>
            </div>
            <div class="col-4"></div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="action-label q-mr-md q-mb-md">
          <q-btn color="white" class="q-pl-lg q-pr-lg" no-caps text-color="white" @click="depositPopup = false" v-close-popup outline rounded label="Deposit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog dark v-model="withdrawPopup">
      <q-card dark class="deposit-withdraw-popup-wrapper">
        <q-card-section class="row items-center q-pb-none">
          <div class="popup-title q-pl-sm">Withdraw</div>
          <q-space />
          <q-btn icon="close" @click="withdrawPopup = false" size="sm" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section align="left">
          <div class="row">
            <div class="col-10 column q-pa-sm">
              <span class="instruction">Your current Balance</span>
              <div class="deposit-amount-component column">
                <span class="label flex justify-between text-grey-7 q-mb-sm">
                  <span>206.422185828859854 shares</span>
                </span>
                <span class="hint text-grey-6 q-mt-md flex text-bold">Quantity of shares</span>
                <div class="input-wrapper q-mt-xs">
                  <q-input dark outlined v-model="amountWithdraw" class="amount-input" />
                  <span class="hint text-grey-6 q-mt-sm flex">The number of the shares you would like to withdraw.</span>
                  <div class="max-wrapper withdraw flex items-center">
                    <q-btn color="yellow" unelevated text-color="black" class="max-btn yellow" label="Max" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="action-label q-mr-md q-mb-md q-mt-lg">
          <q-btn color="white" class="q-pl-lg q-pr-lg cancel" no-caps text-color="grey-6" @click="withdrawPopup = false" v-close-popup unelevated rounded label="Cancel" />
          <q-btn color="white" class="q-pl-lg q-pr-lg" no-caps text-color="white" @click="withdrawPopup = false" v-close-popup outline rounded label="Continue" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog dark v-model="termsConditionPopup">
      <q-card dark class="deposit-withdraw-popup-wrapper">
        <q-card-section class="row items-center q-pb-none">
          <div class="popup-title q-pl-sm">Terms and conditions</div>
          <q-space />
          <q-btn icon="close" @click="termsConditionPopup = false" size="sm" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section align="left">
          <q-scroll-area class="terms_scroll q-pa-md full-width height-auto" :visible="true" dark>
            <h4>Terms Of Service</h4>
            <p>PLEASE READ THIS TERMS OF USE AGREEMENT (THE “TERMS”) CAREFULLY AS THEY FORM A BINDING LEGAL AGREEMENT BETWEEN YOU AND VOLENTIX LABS INC (“VLABS” OR “WE: AND ITS DERIVATIVES). THIS SITE AND ANY OTHER SITES OF VOLENTIX LABS INC (COLLECTIVELY, THE “SITE”) AND THE INFORMATION ON IT ARE CONTROLLED BY VLABS, INC. ON BEHALF OF STAIDER LLC. THESE TERMS GOVERN THE USE OF THE SITE AND APPLY TO ALL VISITORS TO THE SITE AND THOSE WHO USE THE BLOCKCHAIN CURRENCY MANAGEMENT SOFTWARE THAT IS FREELY DOWNLOADABLE OR USABLE FROM THE SITE (THE “SOFTWARE”), AS WELL AS OTHER SERVICES AND RESOURCES AVAILABLE OR ENABLED VIA THE SITE, (EACH A “SERVICE” AND COLLECTIVELY, THE “SERVICES”, WHICH TERM INCLUDES THE SOFTWARE AND THE SITE UNLESS EXPLICITLY SET FORTH BELOW). BY CLICKING ON THE “I ACCEPT” BUTTON, DOWNLOADING THE SOFTWARE, COMPLETING THE REGISTRATION PROCESS AND/OR BROWSING THE SITE, YOU REPRESENT THAT (1) YOU HAVE READ, UNDERSTAND, AND AGREE TO BE BOUND BY THE TERMS, (2) YOU ARE OF LEGAL AGE TO FORM A BINDING CONTRACT WITH VLABS, INC, AND (3) YOU HAVE THE AUTHORITY TO ENTER INTO THE TERMS PERSONALLY OR ON BEHALF OF THE LEGAL ENTITY ON FOR WHOM YOU ARE USING THE SERVICES. THE TERM “YOU” REFERS TO YOU INDIVIDUALLY OR THE LEGAL ENTITY ON WHOSE BEHALF THE SERVICES ARE USED, AS APPLICABLE. IF YOU DO NOT AGREE TO BE BOUND BY THE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICES.</p>
            <h4>LIMITATION OF LIABILITY.</h4>
            <p>DISCLAIMER. IN NO EVENT WILL VLABS, INC BE LIABLE FOR ANY LOST PROFITS, REVENUE OR DATA, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR DAMAGES OR COSTS DUE TO LOSS OF PRODUCTION OR USE, BUSINESS INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES ARISING OUT OF OR IN CONNECTION WITH THE SERVICES, WHETHER OR NOT VOLENTIX LABS INC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND REGARDLESS OF THE THEORY OF LIABILITY ASSERTED. VOLENTIX LABS INC may modify these Terms at any time and in our sole discretion. If we do so, we will change the “Last Updated” date at the beginning of these Terms and, as available, inform you through or within the Services. By Continuing to use the Site or Services following the release of updated Terms you consent to such updated Terms. We invite you to check this page regularly for updates to the Terms.</p>
            <h4>Use of the Services.</h4>
            <p>The Software, the Site, the Services, and the information and content available therein (“VOLENTIX LABS INC Content”) are protected worldwide by copyright laws. Subject to the Terms, VOLENTIX LABS INC grants you a limited license to reproduce portions of VERTO Content solely as required to use the Services for your personal purposes. Unless otherwise specified by VOLENTIX LABS INC in a separate license, your right to use any VERTO code is subject to these Terms.</p>
            <p>VOLENTIX LABS INC is not a bank or financial institution and does not provide investment or financial advice or consulting services to users of the Services. We are solely the provider of the Software.</p>
            <h4>1.1 – VOLENTIX LABS INC Software.</h4>
            <p>Use of the Software (VERTO Wallet or other) is governed by these Terms. VOLENTIX LABS INC delivers the Software via open source licence to download or use through any front end  and VOLENTIX LABS INC will not provide you with any tangible copy of the Software. Subject to your compliance with the Terms, VOLENTIX LABS INC grants you a non-assignable, non-transferable, non-sub-licensable, revocable, and non-exclusive license to use the Software on computers you own or control solely for your go personal purposes. Because the Software is locally installed, or managed by your browser, you are responsible for the security of the device on which it is installed, including ensuring that you keep anti-virus software current, all patches and fixes offered by vendors, and otherwise protect the device on which the Software is installed against malware by all means. VOLENTIX LABS INC is not responsible for any loss or damages – including loss of funds or lockout from accounts accessed via the Software – resulting from your failure to keep the device on which the Software is installed safe and free of any malware. VOLENTIX LABS INC cannot recover passwords or unlock account information stored on the Software in any circumstances, including if the Software is compromised by malware on your computer, and it is your sole responsibility to take all reasonable precautions to secure and backup your copy of the Software and the information stored on it.</p>
            <h4>1.2 – Updates.</h4>
            <p>The Software and Services are evolving and you may be required to accept or install updates to the Software or Services, or update third party software (i.e., browsers or OS) in order to keep using the Software or Services or access their latest features, including security updates. We may update the Software and Services at any time, without providing notice. However VERTO is only a front end and your assets are always unaffected by any updates as they remain on the respective blockchain networks and can be accessed without VERTO provided you have tour seeds and private keys stored safely offline.</p>
            <h4>1.3 – Third-Party Services. </h4>
            <p>The Services may incorporate, or may provide access to, applications or materials that are hosted by another party, including the EOS network and Block Producer Candidates information sources, (collectively, “Third-Party Services”) or any other Blockchains in a similar manner. You agree that it is impossible for VOLENTIX LABS INC to monitor Third Party Services and that you access them at your own risk. Do not share any credential, private key, or other sensitive information with any third party without validating their legitimacy. To the extent Third Party Services incorporated into or linked to from the Services (i.e., communications functionality) have terms that differ from these Terms, you may be required to agree to those terms in order to access the Third-Party Service. We do not control the terms, policies, or performance of any third party, and are not responsible for any performance, or failure to perform, of any Third-Party Services, including with respect to exchange rates, processing of transactions, and similar activities.</p>
            <h4>1.4 – User Content.</h4>
            <p>You are responsible for all data and information provided or uploaded by you to the Services (“User Content”), whether publicly posted (i.e., in a user forum, if applicable) or privately transmitted (i.e., to us in connection with a support request). You are solely responsible for the accuracy and completeness of User Content you submit, and represent and warrant that you have all rights required in order to post such User Content. We may, in our sole discretion, delete any User Content that we determine violates these Terms. To the extent that you provide us with or we may have access to any information that allows us to identify you or any other individual (“Personal Information”) in connection with your use of the Services, we will preserve, safeguard, and use such information as set forth in our Privacy Policy.</p>
            <h4>1.5 – Necessary Equipment and Software.</h4>
            <p>You must provide all equipment and software necessary to connect to use the Services. You are solely responsible for any fees, including Internet connection or mobile fees, that you incur when accessing or using the Services.</p>
            <h4>2. Ownership.</h4>
            <h4>2.1 – Generally.</h4>
            <p>VOLENTIX LABS INC and its suppliers own all right, title and interest in and to the Site, Services, Software, and VOLENTIX LABS INC Content. You will not remove, alter or obscure any copyright, trademark, service mark or other proprietary rights notices incorporated in or accompanying the Site, the Services, or VOLENTIX LABS INC Content.</p>
            <h4>2.2 – Trademarks.</h4>
            <p>VOLENTIX LABS INC and other related graphics, logos, service marks and trade names used on or in connection with the Services are the trademarks of VOLENTIX LABS INC and may not be used without permission in connection with any third-party products or services. Other trademarks, service marks and trade names that may appear on or in the Site or Services are the property of their respective owners.</p>
            <h4>2.4 – User Content.</h4>
            <p>You own your User Content. By posting, displaying, sharing or distributing User Content on or through the Services, you grant us, and any Third Party Services used in connection with the Services, a nonexclusive license to use the User Content solely for the purpose of operating the Services. Except as prohibited by applicable law, we may disclose any information in our possession (including User Content) in connection with your use of the Services, to (a) comply with legal process; (b) enforce these Terms, (c) respond to your requests for customer service, or (d) protect the rights, property or personal safety of VOLENTIX LABS INC, our employees, directors or officers, partners and agents, or members of the public.</p>
            <h4>2.4 – Feedback.</h4>
            <p>You may provide ideas, suggestions, documents, and/or proposals about the Services to VOLENTIX LABS INC through any means (“Feedback”), and you grant VOLENTIX LABS INC a fully paid, royalty-free, perpetual, irrevocable, worldwide, non-exclusive, and sublicensable right and license to use Feedback for any legitimate purpose.</p>
            <h4>3. User Conduct.</h4>
            <p>You may not use the Services for any purpose that is prohibited by the Terms or applicable law. You will not (and will not permit any third party to) take any action or make available any content on or through the Services that: (a) infringes any intellectual property rights of any person or entity; (b) is unlawful, threatening, harassing, defamatory, libelous, deceptive, fraudulent, invasive of another’s privacy, tortious, obscene, or offensive; (c) is unauthorized or unsolicited advertising, junk or bulk e-mail; (d) involves commercial activities and/or sales, such as contests, sweepstakes, barter, advertising, or pyramid schemes; (e) impersonates any person or entity, including any employee or representative of VOLENTIX LABS INC; (f) interferes with the proper functioning of the Services; (g) engages in any potentially harmful acts directed against the Services, including violating any security features of the Services, introducing viruses, worms, or similar harmful code into the Services; or (h) attempts to do any of the foregoing.</p>
            <h4>4.Third-Party Properties.</h4>
            <p>The Services may contain links to third-party websites and applications (collectively, “Third-Party Properties”). When you click on a link to a Third-Party Property, we will not warn you that you have left the Services and are subject to the terms and conditions (including privacy policies) of another website or application. VOLENTIX LABS INC provides these Third-Party Properties only as a convenience and does not make any representations with respect to Third-Party Properties, or their products or services. You use Third-Party Properties at your own risk. You should review applicable terms and policies, including privacy and data gathering practices, of any Third-Party Properties, and should make whatever investigation you feel necessary or appropriate before proceeding with any transaction with any third party.</p>
            <h4>5. Indemnification.</h4>
            <p>You agree to indemnify and hold VOLENTIX LABS INC, its parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors (collectively, the “VOLENTIX LABS INC Parties”) harmless from any losses, costs, liabilities and expenses (including reasonable attorneys’ fees) relating to or arising out of: (a) your use of, or inability to use, the Services; (b) your violation of the Terms; (c) your violation of any rights of another party, including any other users of the Services; or (d) your violation of any applicable laws, rules or regulations. VOLENTIX LABS INC may, at its own cost, assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with VOLENTIX LABS INC in asserting any available defenses. This provision does not require you to indemnify any VOLENTIX LABS INC Party for any fraud, gross negligence, or willful misconduct in connection with the Services.</p>
            <h4>6. Term and Termination.</h4>
            <h4>6.1 – Term.</h4>
            <p>The Terms commence on the date when you accept them (as described in the preamble above) and remain in full force and effect for so long as you access or use the Site, Services, or Software, unless terminated earlier in accordance with this Section.</p>
            <h4>6.2 – Termination by VOLENTIX LABS INC. </h4>
            <p>VOLENTIX LABS INC cannot at any time and for any reason, cease providing any or all of the Services, and/or terminate the service as it is not reliant on the webapp that is provided as VERTO, VERTO is only a convenient front end to access blockchain services that can be accessed in may other ways regardless of VERTO’s status. </p>
            <p>VOLENTIX LABS INC is required to do so by law (e.g., where the provision of the Services is, or becomes, unlawful).</p>
            <h4>6.3 – Termination by You. </h4>
            <p>Except as set forth in Section 6.4, these Terms will be of no further force and effect with respect to you if you cease all use of the Services and Software and no longer visit the Site.</p>
            <h4>6.4 – Effect of Termination. </h4>
            <p>Upon termination of any Service, your right to use such Service will automatically terminate immediately from any front end provided by VOLENTIX LABS INC. VOLENTIX LABS INC will not have any liability whatsoever to you for any suspension or termination. All provisions of the Terms which by their nature should survive termination of Services will do so, including Sections 2, 5, 6.4, 7 and 8.</p>
            <h4>7. Disclaimer of Warranties.</h4>
            <h4>7.1 – As Is. </h4>
            <p>THE SITE, SERVICES AND SOFTWARE ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITH ALL FAULTS, AND VOLENTIX LABS INC EXPRESSLY DISCLAIMS ALL WARRANTIES, REPRESENTATIONS, AND CONDITIONS OF ANY KIND ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE SITE, SERVICES, AND SOFTWARE, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. YOU ACKNOWLEDGE THAT, TO THE EXTENT ALLOWED BY APPLICABLE LAW, ALL RISK OF USE OF THE SITE, SERVICES, AND SOFTWARE RESTS ENTIRELY WITH YOU.</p>
            <h4>7.2 – Beta Releases. </h4>
            <p>FROM TIME TO TIME, VOLENTIX LABS INC MAY OFFER NEW “BETA” FEATURES OR TOOLS WITH WHICH ITS USERS MAY EXPERIMENT. SUCH FEATURES OR TOOLS ARE OFFERED SOLELY FOR EXPERIMENTAL PURPOSES, WITHOUT ANY WARRANTY OF ANY KIND, AND MAY BE MODIFIED OR DISCONTINUED AT VOLENTIX LABS INC’ SOLE DISCRETION.</p>
            <h4>7.3 – Third Party Conduct. </h4>
            <p>VOLENTIX LABS INC IS NOT LIABLE, AND YOU AGREE NOT TO SEEK TO HOLD VOLENTIX LABS INC LIABLE, FOR THE CONDUCT OF THIRD PARTIES ON OR ACCESSED VIA THE SERVICES, INCLUDING OPERATORS OF THIRD PARTY SERVICES AND THIRD-PARTY PROPERTIES AND OTHER USERS OF THE SERVICES, AND THAT THE RISK OF INJURY FROM SUCH THIRD PARTIES RESTS ENTIRELY WITH YOU.</p>
            <h4>7.4 – Cap on Liability. </h4>
            <p>UNDER NO CIRCUMSTANCES WILL VOLENTIX LABS INC BE LIABLE TO YOU FOR DAMAGES ARISING OUT OF THE SERVICES.</p>
            <h4>8. General Provisions.</h4>
            <h4>8.1 – Assignment. </h4>
            <p>The Terms, and your rights and obligations hereunder, may not be assigned, subcontracted, delegated or otherwise transferred by you without VOLENTIX LABS INC’ prior written consent.</p>
            <h4>8.2 – Force Majeure. </h4>
            <p>VOLENTIX LABS INC will not be liable for any delay or failure to perform resulting from causes outside its reasonable control, including, but not limited to, acts of God, war, terrorism, riots, embargos, acts of civil or military authorities, fire, floods, accidents, strikes or shortages of transportation facilities, fuel, energy, labor or materials.</p>
            <h4>8.3 – Electronic Communications. </h4>
            <p>Communications between you and VOLENTIX LABS INC use electronic means, whether made via the Site or Services or sent via e-mail, or whether VOLENTIX LABS INC posts notices on the Site or Services. For contractual purposes, you (1) consent to receive communications from VOLENTIX LABS INC in an electronic form; and (2) agree that all terms and conditions, agreements, notices, disclosures, and other communications that VOLENTIX LABS INC provides to you electronically satisfy any legal requirement that such communications would satisfy if it were to be in writing. The foregoing does not affect your statutory rights.</p>
            <h4>8.4 – Questions, Complaints, Claims. </h4>
            <p>If you have any questions, complaints or claims with respect to the Site, Services or Software, please contact us at: support@volentixlabs.com </p>
            <h4>8.5 – Waiver. </h4>
            <p>Any waiver or failure to enforce any provision of the Terms on one occasion will not be deemed a waiver of any other provision or of such provision on any other occasion.</p>
            <h4>8.6 – Severability. </h4>
            <p>If any portion of these Terms is held invalid or unenforceable, that portion will be construed in a manner to reflect, as nearly as possible, the original intention of the parties, and the remaining portions will remain in full force and effect.</p>
            <h4>8.7 – Notice. </h4>
            <p>Where and If VOLENTIX LABS INC requires that you provide an e-mail address, you are responsible for providing VOLENTIX LABS INC with your most current e-mail address. In the event that the last e-mail address you provided to VOLENTIX LABS INC is not valid, or for any reason is not capable of delivering to you any notices required/ permitted by the Terms, VOLENTIX LABS INC’s dispatch of the e-mail containing such notice will nonetheless constitute effective notice.</p>
            <h4>8.8 – Export Control. </h4>
            <p>You may not use, export, import, or transfer the Services except as authorized by Canadian law, the laws of the jurisdiction in which you obtained the Services, and any other applicable laws. In particular, but without limitation, the Services may not be exported or re-exported (a) into any United States embargoed countries, or (b) to anyone on the U.S. Treasury Department’s list of Specially Designated Nationals or the U.S. Department of Commerce’s Denied Person’s List or Entity List. By using the Services, you represent and warrant that (i) you are not located in the United States of America or a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a “terrorist supporting” country and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties. You also will not use the Services for any purpose prohibited by U.S. law, including the development, design, manufacture or production of missiles, nuclear, chemical or biological weapons. You acknowledge and agree that products, services or technology provided by VOLENTIX LABS INC are subject to the export control laws and regulations of the United States. You will comply with these laws and regulations and will not, without prior U.S. government authorization, export, re-export, or transfer VOLENTIX LABS INC products, services or technology, either directly or indirectly, to any country in violation of such laws and regulations.</p>
            <h4>8.9 – Entire Agreement. </h4>
            <p>These Terms are the final, complete and exclusive agreement of the parties with respect to the subject matter hereof and supersedes and merges all prior discussions between the parties with respect to such subject matter.</p>
            <h4>8.10 – Governing Law and jurisdiction. </h4>
            <p>THE TERMS AND ANY ACTION RELATED THERETO WILL BE GOVERNED AND INTERPRETED BY AND UNDER THE LAWS OF CANADA, WITHOUT GIVING EFFECT TO ANY PRINCIPLES THAT PROVIDE FOR THE APPLICATION OF THE LAW OF ANOTHER JURISDICTION. THE UNITED NATIONS CONVENTION ON CONTRACTS FOR THE INTERNATIONAL SALE OF GOODS DOES NOT APPLY TO THESE TERMS. To the extent the parties are permitted under these Terms to initiate litigation in a court, both you and VOLENTIX LABS INC agree that all claims and disputes arising out of or relating to the Terms will be litigated exclusively in the courts located in the city of Montreal, Quebec, Canada.</p>
            <p><small>Version 1.3 updated on August 25, 2021.</small></p>
            <p><small>END OF AGREEMENT</small></p>

          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="center" class="action-label q-mb-md">
          <q-btn color="white" class="q-pl-md q-pr-md text-bold" no-caps text-color="white" @click="termsConditions = true" v-close-popup outline rounded label="Accept" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ChartFund from 'components/StaiderPrototype/ChartFund'
import ActivityItem from 'components/StaiderPrototype/ActivityItem'
import Vue from 'vue'
Vue.component('activity-item', ActivityItem)
export default {
  name: 'VaultPage',
  components: {
    ChartFund
  },
  data () {
    return {
      depositActivityData: [
        {
          type: 'deposit',
          title: 'Deposit',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          amountBalance: '4,500 USDC',
          amountCoin: 'statics/staider/coins/usdc.svg',
          amountEquivalent: '4,480.56 $US',
          sharesReceived: '9,262.2413',
          depositor: '0xcedb...b71f'
        },
        {
          type: 'entrance-fee',
          title: 'Entrance Fee',
          date: '24 Feb 2022 14:00',
          shares: '27.8703',
          transactionHash: '#'
        },
        {
          type: 'protocol-fee-collected',
          title: 'Protocol Fee Collected',
          date: '24 Feb 2022 14:00',
          shares: '0.63935602',
          transactionHash: '#'
        },
        {
          type: 'management-fee-paid-out',
          title: 'Management Fee Paid Out',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          fee: '2.00%',
          shares: '2.58499555',
          recipient: '0xcedb...b71f'
        },
        {
          type: 'swap',
          title: 'Swap',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          protocol: {
            name: 'ParaSwap v5',
            logo: 'statics/staider/coins/usdc.svg'
          },
          outgoingAsset: {
            balance: '9,262.2413',
            equivalent: '4,480.56 $US',
            coin: 'statics/staider/coins/usdc.svg'
          },
          incommingAsset: {
            balance: '0.1232 YFI',
            equivalent: '2,540.80 $US',
            coin: 'statics/staider/coins/usdc.svg'
          }
        },
        {
          type: 'vault-migration-executed',
          title: 'Vault Migration Executed',
          date: '24 Feb 2022 14:00',
          transactionHash: '#'
        },
        {
          type: 'vault-migration-signalled',
          title: 'Vault Migration Signalled',
          date: '24 Feb 2022 14:00',
          transactionHash: '#'
        },
        {
          type: 'redemption',
          title: 'Redemption',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          amountBalance: '0.0201 USDC',
          amountCoin: 'statics/staider/coins/usdc.svg',
          amountEquivalent: '0.02 $US',
          sharesReceived: '0.02',
          depositor: '0xcedb...b71f'
        },
        {
          type: 'vault-created',
          title: 'Vault Created',
          date: '24 Feb 2022 14:00',
          transactionHash: '#'
        }
      ],
      slippage: '3%',
      advancedSettings: false,
      termsConditionPopup: false,
      showInfo: false,
      showInfoSlippage: false,
      termsConditions: false,
      amount: '0 USDC',
      amountWithdraw: '206.4221858288598535031',
      depositPopup: false,
      withdrawPopup: false,
      canDeposit: true,
      fundID: '0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a',
      tab: 'activity',
      toggleActive: false,
      currentVault: {
        vaultIcon: 'statics/staider/sif_logo_white.svg',
        icon: 'statics/staider/coins/usdc.svg',
        vault: 'SIF USDC',
        denominationCoin: 'USDC',
        investors: '256',
        assetsUnderManagment: '23,505.28',
        sharePrice: '0.82',
        apy: '-3.89%',
        apyStyle: 'red',
        dailyChange: '-3.80%',
        dailyChangeStyle: 'red',
        network: 'Ethereum'
      },
      columns: [
        { headerClasses: 'th-header-style', name: 'asset', align: 'left', label: 'Asset', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'balance', align: 'left', label: 'Balance', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'price', align: 'left', label: `Price(USD)`, field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'value', align: 'left', label: `Value(USD)`, field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'dailyChange', align: 'left', label: 'Daily Change', field: row => row.name, sortable: true, format: val => `${val}` }
        // { headerClasses: 'th-header-style', name: 'allocation', align: 'left', label: 'Allocation', field: row => row.name, sortable: true, format: val => `${val}` }
      ],
      datasCoins: [
        { asset: 'AAVE', assetThicker: 'AAVE', assetName: 'Aave Token', balance: '400', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' },
        { asset: 'aREN', assetThicker: 'aREN', assetName: 'Aave interest bearing REN', balance: '90909091', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xcc12abe4ff81c9378d670de1b57f8e0dd228d77a' },
        { asset: 'LRC', assetThicker: 'LRC', assetName: 'LoopringCoin V2', balance: '5556', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xbbbbca6a901c926f240b89eacb641d8aec7aeafd' },
        { asset: 'Link', assetThicker: 'Link', assetName: 'ChainLink Token', balance: '100000', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0x514910771af9ca656af840dff83e8264ecf986ca' },
        { asset: 'USDC', assetThicker: 'USDC', assetName: 'USD Coin', balance: '100000', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }
      ],
      seriesGeneral: [59, 41],
      chartOptionsGeneral: {
        chart: {
          type: 'pie'
        },
        tooltip: {
          enabled: true
        },
        theme: {
          palette: 'palette10'
        },
        colors: ['#2775CA', '#E418E4'],
        labels: ['SIF USDC Vault', 'SPF PulseChain Vault'],
        dataLabels: {
          // enabled: false,
          enabled: true,
          enabledOnSeries: undefined,
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            colors: ['#FFFFFF', '#FFFFFF']
          }
        },
        legend: {
          position: 'right',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400
        },
        responsive: [{
          breakpoint: 520,
          options: {
            chart: {
              width: '100%'
            },
            legend: false
          }
        }]
      }
    }
  },
  watch: {
    depositPopup: function (val) {
      if (val) {
        document.querySelector('.scroll_area_wrapper').classList.add('blur-effect')
      } else {
        document.querySelector('.scroll_area_wrapper').classList.remove('blur-effect')
      }
    },
    withdrawPopup: function (val) {
      if (val) {
        document.querySelector('.scroll_area_wrapper').classList.add('blur-effect')
      } else {
        document.querySelector('.scroll_area_wrapper').classList.remove('blur-effect')
      }
    }
  },
  mounted () {
  },
  async created () {

  },
  methods: {
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .vault-section{
    min-height: 600px;
    .vaults-tabs-centent{
      /deep/ .q-tab-panel{
        padding: 0px !important;
        @media screen and (max-width: 768px) {
          margin-top: 20px;
        }
      }
      .body-table-col .imgs {
        margin-top: 5px;
        min-width: 30px;
      }
      .body-table-col .imgs img {
        border-radius: 40px;
        height: 30px;
      }
    }
    .vaults-tabs-wrapper{
      width: fit-content;
      border: 2px solid #2D2D30;
      border-radius: 6px;
      /deep/ .q-tab{
        margin-right: 20px;
        border-radius: 6px !important;
        @media screen and (max-width: 768px) {
          margin-right: 0px;
          .q-tab__label {
            font-size: 12px !important;
            line-height: 1.715em;
            font-weight: 500;
          }
        }
      }
      /deep/ .q-tab--active{
        img{
          opacity: 1;
        }
      }
      /deep/ .q-tab--inactive{
        img{
          opacity: .5;
        }
      }
    }
    .vaults-table{
      width: 96%;
      /deep/ .th-header-style{
        color: rgba(white, .4);
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 400;
      }
      /deep/ .q-table__control{
        opacity: .5;
      }
    }
    .mobile-table{
      border: 1px solid #2D2D30;
      border-radius: 10px;
      font-family: $MainFont;
      font-weight: 400;
      font-size: 12px;
      .row{
        border-bottom: 1px solid #2D2D30;
      }
      .net-label{
        font-size: 12px;
      }
      .net-value{
        font-size: 14px;
        font-weight: 600;
      }
      .vault-name{
        font-size: 16px;
        line-height: 20px;
      }
      .standard-label{
        font-size: 16px;
        font-weight: 600;
      }
      .standard-value{
        font-size: 14px;
        font-weight: 400;
      }
    }
    .stats-wrapper{
      border: 2px solid #2D2D30;
      border-radius: 6px;
      min-height: 80px;
      margin-top: 15px;
      cursor: default;
      transition: border ease .3s;
      .label{
        font-family: $MainFont;
        font-size: 15px;
        font-weight: 400;
      }
      .value{
        font-family: $MainFont;
        font-size: 18px;
        font-weight: 700;
      }
      &.hovered,
      &:hover{
        border: 2px solid $MainYellow;
      }
    }
    .sticky-header{
      position: sticky;
      top: 0px;
      border-radius: 20px 20px 0px 0px;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      z-index: 999;
      background: rgba(#1D1D21, .6);
      padding-top: 10px;
      padding-bottom: 10px;
      @media screen and (max-width: 768px) {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
    .vault-dropdown-col{
      position: relative;
      margin-top: 0px;
      .action-btn-wrapper{
        // position: absolute;
        // top: 0px;
        // left: 0px;
        // top: calc(100% + 15px);
        transform: scale(.85);
        position: absolute;
        left: 180px;
        /deep/ button{
          background: #1D1D21 !important;
        }
      }
      @media screen and (max-width: 768px) {
        margin-top: -20px;
      }
      .daily-change{
        position: absolute;
        top: 80%;
        left: 21px;
        font-size: 11px;
        font-family: $MainFont;
      }
      .imgs{
        margin-top: -10px;
        @media screen and (max-width: 768px) {
          margin-top: -10px;
        }
      }
      .coin-name{
        font-family: $MainFont;
      }
      .vault-name{
        font-family: $MainFont;
        .pair{
          font-size: 14px;
          font-weight: 200;
          @media screen and (max-width: 768px) {
            display: none;
          }
        }
        .value{
          font-size: 16px;
          font-weight: 600;
          margin-top: -5px;
          @media screen and (max-width: 768px) {
            font-size: 12px;
            margin-top: 0px;
          }
        }
      }
    }
    .share-price-wrapper{
      position: relative;
      z-index: 10;
      transform: scale(.85);
      @media screen and (max-width: 768px) {
        margin-top: 5px;
      }
      .label{
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 200;
        margin-bottom: -5px;
      }
      .value{
        font-family: $MainFont;
        font-size: 32px;
        font-weight: 700;
        small{
          font-size: 16px;
          font-weight: 600;
        }
      }
      .daily-change{
        font-size: 12px;
        font-family: $MainFont;
        font-weight: 400;
        margin-top: -5px;
      }
    }
    .network-wrapper{
      padding-right: 0px;
      transform: translateX(-25px);
      margin-top: 0px;
      @media screen and (max-width: 768px) {
        margin-top: 5px;
      }
      .pair{
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 200;
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
      }
      .value{
        font-size: 17px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        font-family: $MainFont;
        font-weight: 600;
      }
    }
    .chart-row{
      margin-top: 0px;
    }
  }
  .deposit-withdraw-popup-wrapper{
    background: #1D1D21;
    width: 100%;
    min-height: 274px;
    max-width: 600px;
    border-radius: 20px;
    box-shadow: 0px 36px 36px 0px #000 !important;
    .popup-title{
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 600;
    }
    .action-label{
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 400;
      opacity: 1;
      .cancel{
        background: #2D2D30 !important;
        opacity: .8;
      }
    }
    .input-wrapper{
      position: relative;
      .max-wrapper{
        position: absolute;
        top: 0px;
        left: 100%;
        width: 52%;
        height: 44px;
        &.withdraw{
          width: auto;
        }
        @media screen and (max-width: 643px) {
          &:not(.withdraw){
            position: relative;
            top: 0px;
            left: 0%;
            width: 100%;
            height: 44px;
            margin-top: 10px;
          }
        }
        .max-btn{
          background: rgba(#2D2D30, .8) !important;
          font-family: $MainFont !important;
          font-weight: 400 !important;
          font-size: 12px !important;
          border-radius: 7px !important;
          margin-left: 5px;
          height: 44px;
          &.yellow{
            background: $MainYellow !important;
          }
          /deep/ .q-btn__wrapper{
            padding: 0px 10px !important;
          }
        }
        .coin-dropdown-wrapper-btn{
          background: rgba(#2D2D30, .8) !important;
          font-family: $MainFont !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border-radius: 7px !important;
          margin-left: 5px;
          height: 44px;
          @media screen and (max-width: 643px) {
            margin-left: 0px;
          }
        }
      }
    }
    .instruction{
      font-size: 16px;
      font-family: $MainFont;
      font-weight: 400;
    }
    .connecting-wrapper{
      min-height: 140px;
      .name{
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 600;
      }
    }
    /deep/ .advanced-settings-btn{
      color: $MainYellow !important;
      font-family: $MainFont !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      opacity: .6;
      width: fit-content;
      margin-left: -15px;
      &:hover{
        opacity: 1;
      }
      .q-focus-helper{
        display: none;
      }
    }
    .share-lockup-time{
      position: relative;
      width: fit-content;
      .infobull-wrapper{
        position: absolute;
        left: calc(100% + 10px);
        top: 50%;
        color: #FFF;
        font-family: $MainFont;
        font-size: 12px;
        font-weight: 200;
        background: #1D1D21 !important;
        box-shadow: 0px 14px 14px 0px rgba(#000, .5) !important;
        padding: 10px 15px;
        border-radius: 8px;
        transition: transform ease .3s, opacity ease .3s;
        opacity: 0;
        transform: translate(10px,-50%);
        visibility: hidden;
        width: 244px;
        &.show{
          opacity: 1;
          transform: translate(0px,-50%);
          visibility: visible;
        }
      }
      .info{
        background: #FFF;
        display: inline-flex;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        justify-content: center;
        color: #333;
        font-family: $MainFont;
        font-size: 13px;
        align-items: center;
        font-weight: 700;
        margin-left: 10px;
        cursor: pointer;
        &:hover{
          background: $MainYellow;
        }
      }
    }
    /deep/ .termsConditions{
      margin-left: -9px;
      opacity: .8;
      .q-checkbox__inner--truthy .q-checkbox__bg,
      .q-checkbox__inner--indet .q-checkbox__bg {
          background: rgba($MainYellow, .4);
          border-color: $MainYellow;
      }
      .q-checkbox__bg{
        border-color: #333;;
      }
      a{
        color: $MainYellow;
        text-decoration: none;
      }
    }
    /deep/ .amount-input{
      background: #16161A !important;
      font-family: $MainFont !important;
      font-size: 16px !important;
      border-radius: 8px !important;
      margin-left: -2px;
      height: 44px;
      /deep/ .q-input__wrapper:before {
        border: 2px solid #2D2D2D !important;
      }
      &.q-field--dark .q-field__control{
        height: 44px;
        .q-field__native{
          font-weight: 700 !important;
        }
        &:before{
          border: 2px solid #2D2D2D !important;
        }
        &:hover:before{
          border: 2px solid #353535 !important;
        }
      }
    }
  }
  .terms_scroll{
    border-radius: 20px;
    overflow: hidden;
    // max-width: calc(100% - 180px);
    max-height: 50vh;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0px;
    border-radius: 20px;
    // padding: 0px;
    padding-bottom: 20px;
    margin-left: -8px !important;
    margin-right: -8px !important;
    &.height-auto{
      margin-top: 0px;
      border-radius: 0px;
      max-width: 100%;
      height: calc(100vh - 101px) !important;
    }
    p{
      font-family: $MainFont;
      font-size: 12px;
      font-weight: 400;
      opacity: .8;
      line-height: 20px;
      text-align: justify;
    }
    h4{
      font-family: $MainFont;
      font-size: 16px;
      font-weight: 600;
      margin: 0px;
      padding: 0px;
      opacity: .8;
    }
    &.blur-effect{
      filter: blur(5px);
    }
  }
  /deep/ .q-scrollarea--dark .q-scrollarea__thumb {
    background: #fff;
    right: 0px;
    border-radius: 20px;
    width: 10px;
    transform: scale(0.8);
    z-index: 9999;
  }
  /deep/ .q-page-container{
    padding-top: 0px !important;
  }
</style>
<style>
.vault-dropdown-wrapper{
  background: #1D1D21 !important;
  box-shadow: 0px 36px 36px 0px !important;
}
.vault-dropdown-wrapper.coin-drop{
  width: 180px !important;
  max-width: 180px !important;
  margin-top: 10px !important;
  transform: translateX(48px);
}
.vault-dropdown-wrapper .dropdown-content{
  background: #1D1D21 !important;
}
.vault-dropdown-wrapper .dropdown-content.coin-dropdown{
  border: 2px solid #F6F973;
  border-radius: 10px;
}
.vault-dropdown-wrapper .dropdown-content hr{
  opacity: .2 !important;
}
.vault-dropdown-wrapper-btn .q-btn-dropdown__arrow-container{
  /* display: none !important; */
}
.vault-dropdown-wrapper-btn {
  margin-left: 0px;
  opacity: .9;
  transform: scale(1);
}
.vault-dropdown-wrapper-btn:hover {
  opacity: 1;
}
.vault-dropdown-wrapper-btn .q-focus-helper{
  display: none;
}
.vault-dropdown-wrapper-btn.active{
  /* border: 3px solid #F6F973; */
}
.vault-dropdown-wrapper .vault-name.coin .value{
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}
.vault-dropdown-wrapper .coin-item{
  cursor: pointer;
  opacity: .7;
}
.vault-dropdown-wrapper .coin-item:hover{
  opacity: 1;
}
.vault-dropdown-wrapper .dropdown-content a{
  text-decoration: none;
  padding: 5px 15px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: .2px;
  font-weight: 400;
  opacity: .7;
}
.vault-dropdown-wrapper .dropdown-content a:hover{
  opacity: 1;
}
</style>
