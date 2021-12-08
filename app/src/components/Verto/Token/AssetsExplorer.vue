<template>
<div
  :class="{
      'q-pt-lg': !allAssets,
      'dark-theme': $store.state.settings.lightMode === 'true',
      'receive_wrapper_class': tab == 'receive',
      'import_wrapper_class': tab == 'import',
      'min-size': !$q.platform.is.mobile
    }"
    class="wrapper q-px-lg full-width assets_explorer_container"
    :style=" ($q.platform.is.mobile||$isbex) && $store.state.settings.lightMode !== 'true' ? 'background: #f2f2f2 !important' : '' "
>
  <q-dialog v-model="alertSecurity">
    <q-card
      style="width: 100%; max-width: 400px"
      :dark="$store.state.settings.lightMode === 'true'"
      :class="{ 'mobile-card text-white' : $store.state.settings.lightMode === 'true' }"
    >
      <q-card-section>
        <q-icon
          name="close"
          class="absolute-top-right q-pa-md"
          size="sm"
          v-close-popup
        />
        <div class="icon-alert flex flex-center text-bold text-h6">
          <q-icon name="warning" size="md" /> Security alert
        </div>
      </q-card-section>

      <q-card-section class="text-body1">
        The private key is confidential. Please make sure you do not
        share it with anyone. Your private keys control your funds.
        <br />
        <br />
        <span class="text-caption"
          >Enter your Verto password to access this section</span
        >
        <q-input
          @keyup.enter="verifyPassword"
          :dark="$store.state.settings.lightMode == 'true'"
          error-message="Invalid password"
          :error="passHasError"
          v-model="password"
          label="Enter Verto password"
          class="q-pt-md"
          filled
          type="password"
          :label-color="$store.state.settings.lightMode === 'true' ? 'white' : ''"
          :bg-color="$store.state.settings.lightMode === 'true' ? 'grey' : ''"

        >
          <template v-slot:append>
            <span
              @click="verifyPassword()"
              class="text-body1 cursor-pointer "
              :class="{'text-white': $store.state.settings.lightMode === 'true'}"
              >Verify</span
            >
            <q-btn
              :loaling="spinnerVisible"
              @click="verifyPassword()"
              round

              dense
              flat
              icon="send"
              :class="{'text-white': $store.state.settings.lightMode === 'true'}"
            />
          </template>
        </q-input>
        <span class="text-red text-caption">
          Your private keys will be partially exposed
        </span>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="createPopup.show">
    <NewAccounts :chain="createPopup.chain" />
  </q-dialog>

  <div
     v-if="!($q.platform.is.mobile||$isbex)"
  >
    <div
      class="wrap"
      :class="{
        'account-tabs': $route.params.accounts,
        'assets-tabs': !$route.params.accounts,
      }"
    >
      <div class="row">
        <div :class="{ 'col-md-6' : !$route.params.accounts , 'col-md-8': $route.params.accounts}">

          <!-- RELOCATED ALERT & ACCOUNT DIALOG TO TOP FROM HERE FOR COMMON USE-->

          <ul class="tabs group">
            <li
              :class="{
                'manage': $store.state.wallets.portfolioTotal,
                'read':
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }"
            >
              <a
                @click="
                  tab = 'receive';
                  getChains();
                  showQr = {};
                "
                :class="{ 'active': tab == 'receive' }"
                href="javascript:void(0)"
                ><q-icon name="file_download" /> Receive</a
              >
            </li>
            <li
              :class="{
                'manage': $store.state.wallets.portfolioTotal,
                'read':
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }"
            >
              <a
                @click="
                  tab = 'import';
                  getChains();
                  showQr = {};
                "
                :class="{ active: tab == 'import' }"
                href="javascript:void(0)"
                ><q-icon name="arrow_downward" /> Import</a
              >
            </li>
            <li
             v-if="$route.params.accounts"
             :class="{
                'manage': $store.state.wallets.portfolioTotal,
                'read':
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }">
              <a
                @click="tab = 'create'"
                :class="{ active: tab == 'create' }"
                href="javascript:void(0)"
                ><q-icon name="link"  /> New account</a
              >
            </li>
            <li class="read" v-if="$store.state.wallets.portfolioTotal">
              <a
                @click="
                  tab = 'chains';
                  selectedChain = null;
                  $store.state.settings.defaultChainData = null;
                  $store.state.wallets.customTotal.show = false;
                  initTable();
                "
                :class="{ active: tab == 'chains' }"
                href="javascript:void(0)"
                ><q-icon name="link" /> Chains</a
              >
            </li>
            <li class="read">
              <a
                @click="
                  tab = 'assets';
                  $store.state.wallets.customTotal.show = false;
                  initTable();
                "
                :class="{ active: tab == 'assets' }"
                href="javascript:void(0)"
                ><q-icon
                  :name="
                    this.selectedChain
                      ? 'img:' + this.selectedChain.icon
                      : 'lens'
                  "
                  class="q-pr-sm"
                />{{
                  this.selectedChain ? this.selectedChain.label : ""
                }}
                Assets</a
              >
            </li>
            <li class="manage">
              <a
                @click="
                  showPrivateKeys
                    ? (tab = 'privateKeys')
                    : (alertSecurity = true);
                  showQr = {};
                  getChains();
                  $store.state.wallets.customTotal.show = false;
                "
                :class="{ active: tab == 'privateKeys' }"
                href="javascript:void(0)"
                ><q-icon name="lock" /> Private Keys</a
              >
            </li>

            <li class="read" v-if="$store.state.wallets.portfolioTotal">
              <a
                @click="
                  tab = 'investments';
                  $store.state.wallets.customTotal.show = false;
                "
                :class="{ active: tab == 'investments' }"
                href="javascript:void(0)"
                ><q-icon name="trending_up" /> Investments</a
              >
            </li>
            <li v-if="false">
              <a
                @click="tab = 'nfts'"
                :class="{ active: tab == 'nfts' }"
                href="javascript:void(0)"
                ><q-icon name="trending_up" /> Nfts</a
              >
            </li>
          </ul>
        </div>
        <div class="col-md-6 row justify-end q-pr-lg" v-if="!$route.params.accounts">
           <TokenByAccount @filterTokensByAccount="filterTokensByAccount" v-if="tab == 'assets' && selectedChain" :mode="'select'"     :chain="selectedChain.chain" class="justify-end q-mr-md" />
           <q-input
            @input="tab = 'assets'"
            :dark="$store.state.settings.lightMode === 'true'"
            :class="{'bg-white': $store.state.settings.lightMode === 'false'}"
            dense filled v-model="tokenSearchVal"
            style="width:200px"
            class="float-left q-mr-md"
            rounded
            icon-right="search"
            label="Search token by symbol"
          >
            <template v-slot:append>
              <q-icon
                v-if="tokenSearchVal !== ''"
                name="close"
                @click="tokenSearchVal = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-tabs
      v-if="!$route.params.accounts && false"
      v-model="tab"
      align="left"
      inline-label
      @click="$store.state.settings.show.tab = tab"
      :dark="$store.state.settings.lightMode === 'true'"
      :light="$store.state.settings.lightMode === 'false'"
      :class="{
        'text-white': $store.state.settings.lightMode === 'true',
      }"
      class="text-grey-8 flex"
    >
      <q-tab name="chains" icon="link" label="Chains" />
      <q-tab label="Assets" name="assets" icon="lens" />

      <q-tab label="Investments" name="investments" icon="trending_up" />
      <q-tab label="NFTs" name="nfts" icon="auto_fix_high" />
    </q-tabs>

    <div class="text-h6 q-pb-sm" v-if="tab == 'import'">
      Select chain to import
    </div>
    <div class="text-h6 q-pb-sm" v-else-if="tab == 'receive'">
      Select chain to copy or view your receiving account
    </div>
    <div class="text-h6 q-pb-sm" v-else-if="tab == 'privateKeys'">
      Select chain to copy private keys
    </div>
    <div v-show="!allAssets && false">
      <div class="sub-top row gt-sm">
        <div class="subt-text col-md-7 col-12">
          <p
            class="q-ma-none text-bold text-body1"
            v-show="!$store.state.currentwallet.wallet.chain"
          >
            <q-icon
              name="img:statics/icons/favicon-96x96.png"
              style="font-size: 24px"
              class="q-mr-sm"
            />Trade & Earn VTX
          </p>
        </div>
        <div class="see-text col col-12"></div>
      </div>
      <div
        class="row q-col-gutter-md q-pr-lg q-mb-lg"
        v-show="
          !tokenSearchVal.length && !$store.state.currentwallet.wallet.chain
        "
      >
        <div class="col-md-6 col-12">
          <ExchangeSection
            data-title="Any to any"
            data-intro="Crosschain transactions: Exchange Any to Any is easier than ever"
          />
        </div>
        <div class="col-md-6 col-12">
          <makeVTXSection
            data-title="Earn with VTX"
            data-intro="Start staking VTX now and enjoy the benefits"
          />
        </div>
        <PriceChart
          :dataType="'price'"
          class="col-md-12"
          v-if="chartData && false"
          :data="chartData"
        />
      </div>
    </div>

    <div
      :class="{ 'chains q-pt-md': !$route.params.accounts }"
      v-if="
        (($route.params.accounts || !$store.state.wallets.portfolioTotal) &&
          !['assets', 'investments'].includes(tab)) ||
        tab == 'chains'
      "
    >
    <!-- CHAIN LOOP START  -->
      <q-scroll-area :visible="true" :dark="$store.state.settings.lightMode === 'true'" :class="{'receive_wrapper_class_scroll': tab == 'receive', 'import_wrapper_class_scroll': tab == 'import'}" style="margin-left: -15px; height: 77vh;">
        <div class="sub-top sub-top-chart">
          <div class="subt-text" v-if="!allChains && false">
            <p class="q-ma-none text-bold text-body1">
              Chain overview
              <span class="text-body2 gt-sm">| Summary by chain</span>
            </p>
          </div>
          <div class="subt-text" v-else-if="false">
            <p>
              <q-breadcrumbs class="col-12 breadcrumbs" v-if="allChains">
                <q-breadcrumbs-el
                  class="cursor-pointer"
                  :class="{
                    'text-white': $store.state.settings.lightMode === 'true',
                  }"
                  @click="allChains = null"
                  label="Back"
                  icon="keyboard_backspace"
                />
                <q-breadcrumbs-el
                  class="cursor-pointer"
                  :label="'Showing ' + allChains.length + ' chains'"
                />
              </q-breadcrumbs>
            </p>
          </div>
          <div
            v-if="!allChains && false"
            class="see-text q-mr-lg cursor-pointer"
            @click="allChains = item"
          >
            See all (<span class="text-deep-purple-12">{{
              allChains.length
            }}</span
            >) <q-icon name="arrow_forward_ios" />
          </div>
          <div class="see-text col flex justify-end" v-else-if="false">
            <span class="flex flex-center">
              <span class="text-body2 q-pr-sm">List view</span>
              <q-icon
                name="table_rows"
                @click="listViewMode = 'list'"
                size="1.2rem"
                :color="listViewMode == 'list' ? 'deep-purple-3' : 'grey'"
                class="q-pr-xs"
              />
              <q-icon
                name="dashboard_customize"
                @click="listViewMode = 'card'"
                size="1.2rem"
                :color="listViewMode == 'card' ? 'deep-purple-3' : 'grey'"
                class="q-pr-sm"
              />
            </span>
            <q-input
              :dark="$store.state.settings.lightMode === 'true'"
              dense
              filled
              v-model="tokenSearchVal"
              style="width: 280px"
              class="float-right q-mr-md"
              icon-right="search"
              label="Search token by symbol"
            >
              <template v-slot:append>
                <q-icon
                  v-if="tokenSearchVal !== ''"
                  name="close"
                  @click="tokenSearchVal = ''"
                  class="cursor-pointer"
                />
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
        <div
          class="row q-col-gutter-md"
          :class="{ 'q-pr-lg': $q.screen.width > 500 }"
        >
          <div
            :class="[
              tab == 'receive' || tab == 'import' || tab == 'create' || tab == 'privateKeys'
                ? ' col-md-2 '
                : 'col-md-3',
            ]"
            v-show="!allChains"
             @click="
            tab !== 'receive' && tab !== 'privateKeys' ? chainAction(chain) : ''
          "
          v-for="(chain, i) in chains.filter(a => tab !== 'privateKeys' || (a.accounts && a.accounts.length))"

            :key="i"
          >
            <div class="main cursor-pointer">
              <div
                @click="chainAction(chain)"
                class="q-pb-md text-capitalize ellipsis text-h6"
              >
                {{ chain.label }}
              </div>
              <div class="main-top">
                <div
                  class="mt-img"
                  :class="{ 'q-pb-md': tab == 'receive' }"
                  v-if="!showQr[chain.chain]"
                >
                  <img :src="chain.icon" />
                </div>
                <div
                  v-if="
                    !$route.params.accounts ||
                    tab == 'receive' ||
                    tab == 'privateKeys'
                  "
                >
                  <h6 v-if="!(tab == 'receive' || tab == 'privateKeys')">
                    ${{
                      nFormatter2(chain.chainTotal, chain.chainTotal > 10 ? 0 : 2)
                    }}
                    <br />
                  </h6>
                  <q-btn
                    v-if="
                      (tab == 'receive' || tab == 'privateKeys') &&
                      !showQr[chain.chain] &&
                      chain.accounts.length == 1 &&
                      chain[tab == 'privateKeys' ? 'privateKey' : 'key']
                    "
                    @click="$set(showQr, chain.chain, true)"
                    flat
                    size="sm"
                    class="full-width"
                    label="Show"
                    icon-right="img:https://image.flaticon.com/icons/png/512/107/107072.png"
                  />
                </div>
                <div v-if="showQr[chain.chain]" class="qr-code" style="width:134px:height:134px;">
                  <qrcode
                    :key="tab"
                    dark
                    :value="chain[tab == 'privateKeys' ? 'privateKey' : 'key']"
                    :options="{ size: 100 }"
                  ></qrcode>
                </div>
              </div>
              <span class="q-my-none text-body1">
                <svg
                  v-if="false"
                  class="q-ml-md"
                  viewBox="0 0 32 32"
                  fill="none"
                  style="
                    width: 20px;
                    height: 20px;
                    vertical-align: middle;
                    margin-left: 0px;
                  "
                >
                  <path
                    d="M15.705 4.215a.5.5 0 01.59 0l2.725 1.988a.5.5 0 00.296.096l3.373-.007a.5.5 0 01.477.347l1.036 3.21a.5.5 0 00.182.251l2.733 1.978a.5.5 0 01.182.56l-1.048 3.207a.5.5 0 000 .31l1.048 3.206a.5.5 0 01-.182.561L24.384 21.9a.5.5 0 00-.182.251l-1.037 3.21a.5.5 0 01-.476.346l-3.373-.006a.5.5 0 00-.296.096l-2.725 1.988a.5.5 0 01-.59 0l-2.725-1.988a.5.5 0 00-.296-.096l-3.373.006a.5.5 0 01-.476-.346l-1.037-3.21a.5.5 0 00-.182-.251l-2.733-1.978a.5.5 0 01-.182-.56l1.048-3.207a.5.5 0 000-.31l-1.048-3.207a.5.5 0 01.182-.56L7.616 10.1a.5.5 0 00.182-.251l1.037-3.21a.5.5 0 01.476-.347l3.373.007a.5.5 0 00.296-.096l2.725-1.988z"
                    fill="url(#verified_svg__paint0_linear)"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M16 4.619l2.725 1.988a1 1 0 00.591.192l3.374-.007 1.036 3.21a1 1 0 00.365.503l2.733 1.978-1.048 3.206a.999.999 0 000 .622l1.048 3.206-2.733 1.977a1 1 0 00-.365.503l-1.036 3.21-3.374-.006a1 1 0 00-.59.192L16 27.381l-2.725-1.988a1 1 0 00-.591-.192l-3.374.006-1.036-3.21a1 1 0 00-.365-.503l-2.733-1.977 1.048-3.206a1 1 0 000-.622l-1.048-3.206 2.733-1.978-.293-.405.293.405a1 1 0 00.365-.502l1.036-3.21 3.374.006a1 1 0 00.59-.192L16 4.619z"
                    stroke="url(#verified_svg__paint1_linear)"
                  ></path>
                  <g filter="url(#verified_svg__filter0_d)">
                    <path
                      d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z"
                      fill="#fff"
                    ></path>
                    <path
                      d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z"
                      stroke="#fff"
                      stroke-width="0.5"
                    ></path>
                  </g>
                  <defs>
                    <linearGradient
                      id="verified_svg__paint0_linear"
                      x1="6.4"
                      y1="5.2"
                      x2="25.6"
                      y2="26.2"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#376DF3"></stop>
                      <stop offset="1" stop-color="#1E56E0"></stop>
                    </linearGradient>
                    <linearGradient
                      id="verified_svg__paint1_linear"
                      x1="7"
                      y1="4"
                      x2="24.4"
                      y2="26.8"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#2D61E1"></stop>
                      <stop offset="1" stop-color="#1549CA"></stop>
                    </linearGradient>
                    <filter
                      id="verified_svg__filter0_d"
                      x="8.037"
                      y="10.021"
                      width="15.922"
                      height="13.33"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood
                        flood-opacity="0"
                        result="BackgroundImageFix"
                      ></feFlood>
                      <feColorMatrix
                        in="SourceAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      ></feColorMatrix>
                      <feOffset dy="1"></feOffset>
                      <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                      <feColorMatrix
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                      ></feColorMatrix>
                      <feBlend
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      ></feBlend>
                      <feBlend
                        in="SourceGraphic"
                        in2="effect1_dropShadow"
                        result="shape"
                      ></feBlend>
                    </filter>
                  </defs>
                </svg>
                <!-- <span v-if="parseInt(chain.usd).toString().length <= 5" class="g-txt">.{{formatNumber(chain.usd,2).split('.')[1]}}</span> -->
                <span v-if="false" class="sr-txt absolute-top-right"
                  >+ 4 assets</span
                >
              </span>
              <div
                class="row q-pt-md"
                v-if="!$route.params.accounts && tab == 'chains'"
              >
                <q-btn
                  align="left"
                  size="sm"
                  class="col-12 q-mb-sm text-left"
                  v-for="(item, index) in assetsOptions[0].data
                    .filter((o) => o.chain === chain.chain)
                    .slice(0, 1)"
                  :key="index"
                  :icon="'img:' + item.icon"
                  :label="item.type.toUpperCase()"
                  flat
                  dense
                >
                  <span class="q-pl-sm text-grey"
                    >${{ formatNumber(item.usd, 0) }}</span
                  >
                </q-btn>
                <span class="text-caption" v-if="false">3 accounts</span><br />
                <span class="text-caption" v-if="false">2 tokens</span>
              </div>
              <div
                :class="{
                  'text-body1 q-pt-md copy-key': !showQr[chain.chain],
                  'text-body2': showQr[chain.chain],
                }"
                v-if="
                  tab == 'receive' && chain.accounts && chain.accounts.length == 1
                "
              >
                <span @click="chainAction(chain)" v-if="!showQr[chain.chain]">
                  {{
                    chain.chain == "eos" ? chain.name : getKeyFormat(chain.key)
                  }}
                  <q-icon name="o_file_copy" />
                </span>
                <span
                  class="cursor-pointer"
                  @click="showQr[chain.chain] = false"
                  v-else
                  ><q-icon name="visibility_off" /> Hide QR Code
                </span>
              </div>
              <div
                :class="{
                  'text-body1 q-pt-md copy-key': !showQr[chain.chain],
                  'text-body2': showQr[chain.chain],
                }"
                v-else-if="tab == 'privateKeys'"
              >
                <div
                  @click="chainAction(chain)"
                  v-if="
                    chain.accounts &&
                    chain.accounts.length == 1 &&
                    chain.accounts[0].privateKey &&
                    !showQr[chain.chain]
                  "
                >
                  {{ getKeyFormat(chain.privateKey) }}
                  <q-icon name="o_file_copy" />
                </div>
                <div
                  @click="chainAction(chain)"
                   v-else-if="
                  tab == 'privateKeys' &&
                  chain.accounts &&
                  (chain.accounts.length > 1 || (chain.accounts.length && !chain.accounts[0].privateKey))
                  "
                >
                  {{ chain.accounts.length }} private keys
                  <q-icon name="arrow_forward_ios" />
                </div>
                <span
                  class="cursor-pointer"
                  @click="showQr[chain.chain] = false"
                  v-else-if="
                    tab == 'privateKeys' &&
                    chain.accounts &&
                    chain.accounts.length == 1 &&
                    showQr[chain.chain]
                  "
                  ><q-icon name="visibility_off" /> Hide QR Code
                </span>
              </div>
              <div
                @click="chainAction(chain)"
                class="text-body1 q-pt-md copy-key"
                v-else-if="
                  tab == 'receive' && chain.accounts && chain.accounts.length > 1
                "
              >
                {{ chain.accounts.length }} accounts
                <q-icon name="arrow_forward_ios" />
              </div>
              <div class="text-caption q-pt-md" v-else-if="tab == 'import' || tab == 'create'">
               <span class="text-capitalize">
               {{tab}}
               </span>  <q-icon name="arrow_right_alt" />
              </div>
              <span
                v-else-if="
                  tab == 'chains' && chain.chain == 'eos' && chain.type == 'verto'
                "
              >
                <q-btn label="Get EOS account" outline rounded />
              </span>
               <div
            @click="$router.push(getImportLink('eos'))"
              class="text-caption q-pt-md"
              v-else-if="chain.type == 'verto'"
            >
              Setup account <q-icon name="arrow_right_alt" />
            </div>

              <div
                class="text-caption q-pt-md"
                v-else-if="!$route.params.accounts"
              >
                Select <q-icon name="arrow_right_alt" />
              </div>
              <div v-if="false">
                <q-item-label
                  :class="{
                    'text-white': $store.state.settings.lightMode === 'true',
                  }"
                  class="q-pt-sm"
                  caption
                  >Amount:
                  <span class="text-grey q-pl-xs">{{
                    formatNumber(chain.amount, 6)
                  }}</span></q-item-label
                >
                <div class="q-pt-sm">
                  Price:
                  <span class="text-grey q-pl-xs"
                    >${{ formatNumber(chain.rateUsd, 4) }}</span
                  >
                </div>
                <div class="q-py-sm" v-if="chain.protocol">
                  <q-icon
                    class="q-pr-sm"
                    size="1.2rem"
                    :name="'img:' + chain.protocolIcon"
                  />{{ chain.protocol }}:
                </div>
                <span class="text-grey" v-if="chain.poolsCount == 1"
                  >{{ chain.poolName }} pool</span
                >
                <span class="text-grey" v-else-if="chain.poolsCount"
                  >{{ chain.poolsCount }} pools</span
                >
                <q-item-label
                  class="text-caption chain-label q-py-sm"
                  v-if="chain.chainLabel"
                  :class="{
                    'text-white': $store.state.settings.lightMode === 'true',
                  }"
                  >Chain:
                  <span class="text-grey">{{
                    chain.chainLabel.replace("Chain", "")
                  }}</span></q-item-label
                >
              </div>
            </div>
          </div>
          <div class="col-md-12 flex flex-center text-body1 cursor-pointer" v-if="!showAllChains && tab == 'chains' " @click="showAllChains = true ; getChains()">
          <span>Show all chains</span>
          </div>
        </div>
      </q-scroll-area>
    </div>

     <!-- ASSET LOOP SECTION  -->
    <div
      class="q-pt-md chains"
      v-show="tab == item.id"
      v-for="(item, index) in assetsOptions.filter(
        (o) => !allAssets || o.title == allAssets.title
      )"
      :key="index + uniqueKey"
    >
      <q-scroll-area :visible="true" :dark="$store.state.settings.lightMode === 'true'"  :class="{'receive_wrapper_class_scroll':tab == 'import'}" style="margin-left: -15px; height: 77vh;">
        <div class="sub-top sub-top-chart">
          <!-- <div class="subt-text " v-if="!allAssets" >
              <p>
                <q-breadcrumbs class="col-12  breadcrumbs"  v-if="allAssets">
                  <q-breadcrumbs-el  class="cursor-pointer" :class="{'text-white':$store.state.settings.lightMode === 'true'}" @click="allAssets = null" label="Back"  icon="keyboard_backspace" />
                  <q-breadcrumbs-el  class="cursor-pointer"  :label="'Showing '+filterTokens.length+ ' ' + item.title"  />
                </q-breadcrumbs>
              </p>
              <p class="q-ma-none text-bold text-body1">{{getSectionTitle(item)}} <span class="text-body2 gt-sm">| {{item.subtitle}}</span></p>
            </div>-->
          <div class="subt-text" v-if="false">
            <p>
              <q-breadcrumbs class="col-12 breadcrumbs" v-if="allAssets">
                <q-breadcrumbs-el
                  class="cursor-pointer"
                  :class="{
                    'text-white': $store.state.settings.lightMode === 'true',
                  }"
                  @click="allAssets = null"
                  label="Back"
                  icon="keyboard_backspace"
                />
                <q-breadcrumbs-el
                  class="cursor-pointer"
                  :label="'Showing ' + filterTokens.length + ' ' + item.title"
                />
              </q-breadcrumbs>
            </p>
          </div>

          <div
            v-if="!allAssets && false"
            class="see-text q-mr-lg cursor-pointer"
            @click="allAssets = item"
          >
            See all (<span class="text-deep-purple-12">{{
              filterTokens.length
            }}</span
            >) <q-icon name="arrow_forward_ios" />
          </div>

          <div class="see-text col flex justify-end" v-else>
            <span v-if="item.id == 'assets' && false" class="flex flex-center">
              <span class="text-body2 q-pr-sm">List view</span>
              <q-icon
                name="table_rows"
                @click="listViewMode = 'list'"
                size="1.2rem"
                :color="listViewMode == 'list' ? 'deep-purple-3' : 'grey'"
                class="q-pr-xs"
              />
              <q-icon
                name="dashboard_customize"
                @click="listViewMode = 'card'"
                size="1.2rem"
                :color="listViewMode == 'card' ? 'deep-purple-3' : 'grey'"
                class="q-pr-sm"
              />
            </span>
          </div>
        </div>
        <div
          class="row q-col-gutter-md"
          :class="{ 'q-pr-lg': $q.screen.width > 500 }"
        >
          <div
            class="col-md-3"
            v-show="
              !allAssets || item.id == 'investments' || listViewMode == 'card'
            "
            @click="showTokenPage(asset)"
            v-for="(asset, i) in filterTokens"
            :key="i"
          >
            <div class="main cursor-pointer">
              <div class="main-top">
                <div class="mt-img">
                  <img :src="asset.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';"/>
                </div>
                <div>
                  <h6>
                    {{ asset.type.toUpperCase()
                    }} {{ asset.isStaked ? 'Staked' : ''}}
                    <svg
                      v-if="false"
                      class="q-ml-md"
                      viewBox="0 0 32 32"
                      fill="none"
                      style="
                        width: 20px;
                        height: 20px;
                        vertical-align: middle;
                        margin-left: 0px;
                      "
                    >
                      <path
                        d="M15.705 4.215a.5.5 0 01.59 0l2.725 1.988a.5.5 0 00.296.096l3.373-.007a.5.5 0 01.477.347l1.036 3.21a.5.5 0 00.182.251l2.733 1.978a.5.5 0 01.182.56l-1.048 3.207a.5.5 0 000 .31l1.048 3.206a.5.5 0 01-.182.561L24.384 21.9a.5.5 0 00-.182.251l-1.037 3.21a.5.5 0 01-.476.346l-3.373-.006a.5.5 0 00-.296.096l-2.725 1.988a.5.5 0 01-.59 0l-2.725-1.988a.5.5 0 00-.296-.096l-3.373.006a.5.5 0 01-.476-.346l-1.037-3.21a.5.5 0 00-.182-.251l-2.733-1.978a.5.5 0 01-.182-.56l1.048-3.207a.5.5 0 000-.31l-1.048-3.207a.5.5 0 01.182-.56L7.616 10.1a.5.5 0 00.182-.251l1.037-3.21a.5.5 0 01.476-.347l3.373.007a.5.5 0 00.296-.096l2.725-1.988z"
                        fill="url(#verified_svg__paint0_linear)"
                      ></path>
                      <path
                        opacity="0.5"
                        d="M16 4.619l2.725 1.988a1 1 0 00.591.192l3.374-.007 1.036 3.21a1 1 0 00.365.503l2.733 1.978-1.048 3.206a.999.999 0 000 .622l1.048 3.206-2.733 1.977a1 1 0 00-.365.503l-1.036 3.21-3.374-.006a1 1 0 00-.59.192L16 27.381l-2.725-1.988a1 1 0 00-.591-.192l-3.374.006-1.036-3.21a1 1 0 00-.365-.503l-2.733-1.977 1.048-3.206a1 1 0 000-.622l-1.048-3.206 2.733-1.978-.293-.405.293.405a1 1 0 00.365-.502l1.036-3.21 3.374.006a1 1 0 00.59-.192L16 4.619z"
                        stroke="url(#verified_svg__paint1_linear)"
                      ></path>
                      <g filter="url(#verified_svg__filter0_d)">
                        <path
                          d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z"
                          fill="#fff"
                        ></path>
                        <path
                          d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z"
                          stroke="#fff"
                          stroke-width="0.5"
                        ></path>
                      </g>
                      <defs>
                        <linearGradient
                          id="verified_svg__paint0_linear"
                          x1="6.4"
                          y1="5.2"
                          x2="25.6"
                          y2="26.2"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#376DF3"></stop>
                          <stop offset="1" stop-color="#1E56E0"></stop>
                        </linearGradient>
                        <linearGradient
                          id="verified_svg__paint1_linear"
                          x1="7"
                          y1="4"
                          x2="24.4"
                          y2="26.8"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#2D61E1"></stop>
                          <stop offset="1" stop-color="#1549CA"></stop>
                        </linearGradient>
                        <filter
                          id="verified_svg__filter0_d"
                          x="8.037"
                          y="10.021"
                          width="15.922"
                          height="13.33"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          ></feFlood>
                          <feColorMatrix
                            in="SourceAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          ></feColorMatrix>
                          <feOffset dy="1"></feOffset>
                          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                          <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                          ></feColorMatrix>
                          <feBlend
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                          ></feBlend>
                          <feBlend
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                          ></feBlend>
                        </filter>
                      </defs>
                    </svg>
                  </h6>
                </div>
              </div>
              <h2 class="q-my-none ellipsis">
                ${{ formatNumber(asset.usd, 2) }}
                <!-- <span v-if="parseInt(asset.usd).toString().length <= 5" class="g-txt">.{{formatNumber(asset.usd,2).split('.')[1]}}</span> -->
                  <span
                  v-if="asset.notValuable"
                    class="no-value"
                  >No Value</span>
                  <span
                  v-if="asset.change24hPercentage"
                  :class="'sr-txt absolute-top-right ' + asset.color"
                  >{{ asset.color === "text-green-6" ? "↑" : "↓" }}
                  {{ asset.change24hPercentage.substring(1) }}</span
                >
                <a href="javascript:void(0)">Trade</a>
              </h2>

              <q-item-label
                :class="{
                  'text-white': $store.state.settings.lightMode === 'true',
                }"
                class="q-pt-sm"
                caption
                >Amount:
                <span class="text-grey q-pl-xs">{{
                  formatNumber(asset.amount, 6)
                }}</span></q-item-label
              >
              <div class="q-pt-sm">
                Price:
                <span class="text-grey q-pl-xs"
                  >${{ formatNumber(asset.rateUsd, 4) }}</span
                >
              </div>
              <div class="q-py-sm" v-if="asset.protocol">
                <q-icon
                  class="q-pr-sm"
                  size="1.2rem"
                  :name="'img:' + asset.protocolIcon"
                />{{ asset.protocol }}:
              </div>
              <span class="text-grey" v-if="asset.poolsCount == 1"
                >{{ asset.poolName }} pool</span
              >
              <span class="text-grey" v-else-if="asset.poolsCount"
                >{{ asset.poolsCount }} pools</span
              >
              <q-item-label
                class="text-caption chain-label q-py-sm"
                v-if="asset.chainLabel"
                :class="{
                  'text-white': $store.state.settings.lightMode === 'true',
                }"
                >Chain:
                <span class="text-grey">{{
                  asset.chainLabel.replace("Chain", "")
                }}</span></q-item-label
              >
            </div>
          </div>
          <p v-if="!filterTokens.length">
            No assets found
          </p>
          <AssetBalancesTable
            @setAsset="showTokenPage"
            data-title="Asset balances"
            data-intro="Here you can see the asset balances"
            :rowsPerPage="8"
            v-if="allAssets && listViewMode == 'list'"
            class="full-width"
            :tableData="filterTokens(allAssets)"
          />
        </div>
      </q-scroll-area>
    </div>

    <!-- RELOCATED ShowKeys COMPONENT FROM HERE TO BOTTOM FOR COMMON USE  -->
    <!-- <ShowKeys
      :key="keys.keying"
      v-if="keys.chain"
      :chain="keys.chain"
      :field="keys.field"
    /> -->
    <liquidityPoolsTable
      v-if="$store.state.settings.show.tab == 'history'"
      :key="4 + uniqueKey"
      data-title="Liquidity pools"
      class="q-pt-md"
      data-intro="Here you can click the ADD button to add liquidity to any pools"
      :chain="currentChain"
      :rowsPerPage="10"
    />

    <div class="small-grid" v-if="false">
      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/1.png" alt="img" />
          </div>

          <div>
            <h6>
              Cryptocurrency Top 10 Tokens piee Index<img
                src="img/check.png"
                alt="image"
              />
            </h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/10.png" alt="img" />
          </div>

          <div>
            <h6>Top 10 Index<img src="img/check.png" alt="image" /></h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/9.png" alt="img" />
          </div>

          <div>
            <h6>Cryptocurrency Index<img src="img/check.png" alt="image" /></h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $99 <span class="g-txt">.93</span> <span class="sg-txt">↑ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>
    </div>
  </div>

  <ShowKeys

    :key="keys.keying"
    v-if="keys.chain"
    :chain="keys.chain"
    :field="keys.field"
  />
  <div> </div>
  <!-- MOBILE SECTION STARTED -->
  <div   v-if="$q.platform.is.mobile||$isbex">
    <TabAssetsExplorer :key="uniqueKey" ref="tabAssetExp" :chains="chains" :tab.sync="tab" :chainAction='chainAction' :formatNumber='formatNumber' :showQr.sync='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens' :getChains='getChains' :allChains='allChains' :showAllChains.sync='showAllChains' :showTokenPage='showTokenPage' :initTable="initTable" :selectedChain.sync="selectedChain" :keys="keys" :showPrivateKeys="showPrivateKeys" :alertSecurity.sync="alertSecurity" :tokenSearchVal="tokenSearchVal" :getImportLink="getImportLink"/>
  </div>
  <!-- MOBILE SECTION END -->

</div>
</template>

<script>
import ShowKeys from '@/components/Verto/ShowKeys'
import Formatter from '@/mixins/Formatter'
import HD from '@/util/hdwallet'
import TokenByAccount from './TokenByAccount.vue'
import Vue from 'vue'
import MakeVTXSection from '@/components/Verto/MakeVTXSection2'
import ExchangeSection from '@/components/Verto/ExchangeSection3'
import NewAccounts from '@/components/Verto/Accounts/NewAccounts'
import liquidityPoolsTable from '@/components/Verto/Defi/LiquidityPoolsTable'
import PriceChart from '@/components/Verto/Token/PriceChart'
import AssetBalancesTable from '@/components/Verto/AssetBalancesTable'
import configManager from '@/util/ConfigManager'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import EosWrapper from '@/util/EosWrapper'
// MOOBILE TAB UI
import TabAssetsExplorer from '../MobileUI/TabAssetsExplorer.vue'

import { QScrollArea } from 'quasar'
const eos = new EosWrapper()
Vue.component(VueQrcode.name, VueQrcode)
export default {
  components: {
    ExchangeSection,
    AssetBalancesTable,
    TokenByAccount,
    MakeVTXSection,
    liquidityPoolsTable,
    PriceChart,
    ShowKeys,
    TabAssetsExplorer,
    NewAccounts,
    QScrollArea
  },
  props: ['rowsPerPage'],
  data () {
    return {
      createPopup: {
        chain: null,
        show: false
      },
      chartData: false,
      showPrivateKeys: false,
      showQr: {},
      listViewMode: 'card',
      chainSelected: false,
      tab: 'chains',
      uniqueKey: 1235878,
      alertSecurity: false,
      showAllChains: false,
      keys: {
        chain: null,
        field: '',
        keying: 1
      },
      allAssets: null,
      currentChain: false,
      platformOptions: [
        {
          label: 'Uniswap V2',
          value: 'Uniswap V2',
          icon: 'UNI-icon.svg'
        },
        {
          label: 'Balancer',
          value: 'Balancer-labs',
          icon: 'BAL-icon.svg'
        },
        {
          label: 'yEarn',
          value: 'yEarn',
          icon: 'YFI-icon.svg'
        },
        {
          label: 'Curve',
          value: 'Curve',
          icon: 'Curve-icon.svg'
        }
      ],
      assetsOptions: [
        {
          title: 'Active assets',
          id: 'assets',
          subtitle: 'Send, Swap & Invest',
          data: []
        },
        {
          title: 'Invested assets',
          id: 'investments',
          subtitle: 'Tokens invested in liquidity pools',
          data: {
            eth: [],
            eos: []
          }
        },
        {
          title: 'Ntfs',
          subtitle: 'Non-fungible tokens you own',
          data: []
        },
        {
          title: 'Opportunities',
          subtitle: 'Investment opportunities',
          data: []
        }
      ],
      initialPagination: {
        rowsPerPage: this.rowsPerPage
      },
      loaded: true,
      assets: [],
      tokenSearchVal: '',
      spinnerVisible: false,
      password: '',
      passHasError: false,
      poolsData: [],
      screenSize: 0,
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Asset',
          align: 'left',
          field: (row) => row,
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'currentPrice',
          align: 'left',
          label: 'Price',
          field: 'currentPrice',
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'dailyChange',
          align: 'left',
          label: 'Daily Change',
          field: 'dailyChange',
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'amount',
          align: 'left',
          label: 'Balance',
          field: 'amount',
          sortable: true,
          format: (val) => `${this.formatNumber(val, 2)}`
        },
        {
          name: 'usd',
          align: 'left',
          label: 'USD Equivalent',
          field: 'usd',
          format: (val) => `${this.formatNumber(val, 2)}`,
          sortable: true
        },
        {
          name: 'average_cost',
          align: 'left',
          label: 'Average Cost',
          field: 'average_cost',
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'action',
          label: '',
          sortable: false
        }
      ],
      openDialog: false,
      chains: [],
      selectedChain: null,
      allChains: false
    }
  },
  created () {
    this.$store.state.settings.defaultChainData = false
    this.getWindowWidth()

    if (this.$route.params.accounts) {
      this.tab = 'receive'
    }
    if (this.$route.params.tab) {
      this.tab = this.$route.params.tab
    }
    if (this.$route.params.selectChain) {
      let allChains = this.getChains()
      let chain = allChains.find(
        (o) => o.chain === this.$route.params.selectChain
      )
      this.tab = 'chains'
      if (chain.isEvm || chain.chain === 'eos') { this.chainAction(chain) }
    }
    this.initTable()
    this.$store.state.wallets.tokens
      .filter((o) => o.chain === 'eth' && o.type === 'eth')
      .forEach((w) => {
        this.getInvestments(w)
      })
    let eosWallets = this.$store.state.wallets.tokens
      .filter((o) => o.chain === 'eos' && o.type === 'eos')
      .map((o) => o.name)
    this.$store.state.investment.allEosWalletsInvestments = []
    this.$store.dispatch('investment/getAllEOSInvestments', eosWallets)
    /*
    this.$bus.$on('selectedChain', () => {
      let chain = localStorage.getItem('selectedChain')
      if (chain !== 'vtx') {
        this.currentChain = chain
        this.uniqueKey++
        this.initTable(chain)
      } else {
        this.setVtxData()
      }
    }) */
    this.getVTXHistoriclPrice()
  },
  watch: {
    '$store.state.settings.accountTab': function (val, old) {
      if (val === 'privateKeys' && old !== 'privateKeys') {
        this.alertSecurity = true
      } else if (val) { this.tab = val }
    },
    '$store.state.wallets.tokens': {
      deep: true,
      handler () {
        this.initTable()
        if (!this.$store.state.wallets.portfolioTotal) {
          this.tab = 'receive'
        } else if (
          !this.$route.params.accounts &&
          !['assets', 'chains', 'investments'].includes(this.tab)
        ) {
          if (!this.$store.state.investment.defaultAccount) { this.tab = 'chains' }
        }
      }
    },
    tab () {
      if (this.tab === 'chains' && this.$store.state.investment.defaultAccount && this.$q.platform.is.mobile) {
        this.tab = 'assets'
      } else if (this.tab === 'investments') {
        this.getVTXStakingInvestment()
      }
    },
    '$store.state.investment.defaultAccount': function (newVal) {
      if (newVal) {
        this.initTable()
      }
    },
    '$store.state.investment.investments': function (investments) {
      this.getInvestedTokens(investments)
    },
    '$store.state.investment.allEosWalletsInvestments': function (investments) {
      this.getInvestedEosTokens(investments)
    },
    '$store.state.tokens.walletTokensData': function (val) {
      this.initTable()
      this.getInvestedEosTokens(
        this.$store.state.investment.allEosWalletsInvestments
      )
      this.uniqueKey++
    }
  },
  computed: {
    allInvestments () {
      return Object.keys(this.assetsOptions[1].data).reduce(
        (all, chain) =>
          this.assetsOptions[1].data[chain].length
            ? all.concat(
              this.assetsOptions[1].data[chain].filter((o) =>
                this.$store.state.investment.defaultAccount &&
                 this.$q.platform.is.mobile ? (chain === 'eos' &&
                        o.owner.toLowerCase() ===
                          this.$store.state.investment.defaultAccount.name.toLowerCase()) ||
                      (chain === 'eth' &&
                        o.owner.toLowerCase() === this.$store.state.investment.defaultAccount.key.toLowerCase())
                  : true
              )
            )
            : [],
        []
      )
    },
    filterTokens () {
      let tokens =
        this.tab === 'investments'
          ? this.allInvestments.filter(
            (o) => !this.selectedChain || o.chain === this.selectedChain.chain
          )
          : this.assets
      if (this.tokenSearchVal.trim().length) {
        tokens = tokens.filter((o) =>
          o.type.toLowerCase().includes(this.tokenSearchVal.toLowerCase())
        )
      }
      return tokens
    }
  },
  destroyed () {
    this.$store.state.wallets.customTotal.show = false
  },
  mounted () {
    if (!this.$store.state.wallets.portfolioTotal) {
      this.tab = 'receive'
    }
    setTimeout(() => {
      this.initTable()
      // this.getVTXStakingInvestment()
    }, 1000)
  },
  methods: {
    getVTXStakingInvestment () {
      let stakedAmounts = 0

      let eosChain = this.setChains().find(a => a.chain === 'eos')

      if (!eosChain || !eosChain.accounts) return
      eosChain.accounts.forEach(async (f) => {
        if (f.chain === 'eos') {
          let stakes = await eos.getTable('vertostaking', f.name, 'accountstake')
          if (stakes.length) {
            stakes.forEach(s => {
              s.stake_amount = Math.round(+s.amount.split(' ')[0] * 10000) / 10000
              // s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 10000) / 10000
              stakedAmounts += +s.stake_amount
            })
          }
        }

        if (stakedAmounts) {
          let vtxPrice = (await this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=volentix-vtx&vs_currencies=usd')).data['volentix-vtx'].usd
          let a = {
            usd: vtxPrice * stakedAmounts,
            rateUsd: vtxPrice,
            type: 'vtx',
            chain: 'eos',
            poolsCount: false,
            owner: f.name,
            poolName: 'Staked',
            isStaked: true,
            amount: stakedAmounts,
            icon: 'https://www.api.bloks.io/image-proxy/display?w=100&h=100&url=https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png&op=resize'
          }
          let index = this.assetsOptions[1].data.eos.findIndex(o => o.isStaked && o.type === 'vtx')

          if (index >= 0) {
            this.assetsOptions[1].data.eos[index] = a
          } else {
            this.assetsOptions[1].data.eos.push(a)
          }
        }
      })
      this.uniqueKey++
    },
    async verifyPassword () {
      console.log('verifyPassword')
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        return
      }
      this.spinnerVisible = true
      const results = await configManager.login(this.password)
      if (results.success) {
        this.showPrivateKeys = true
        this.password = ''
        this.tab = 'privateKeys'
        this.alertSecurity = false
        this.getChains()
        // if (this.$q.platform.is.mobile) { this.$refs.tabAssetExp.updateTab('privateKeys') }
      } else {
        this.passHasError = true
      }
      this.spinnerVisible = false
    },
    chainAction (chain) {
      const self = this

      let actions = {
        import () {
          self.$router.push(self.getImportLink(chain.chain))
        },
        create () {
          if (chain.chain === 'eos') {
            self.$router.push(self.getImportLink(chain.chain))
          } else {
            self.createPopup.show = true
            self.createPopup.chain = chain
          }
        },
        receive () {
          if (chain.accounts.length === 1) {
            self.copyToClipboard(
              chain.key,
              chain.chain.toUpperCase() + ' account'
            )
          } else {
            self.keys.keying++
            self.keys.field = 'key'
            self.keys.chain = chain
          }
        },
        privateKeys () {
          if (chain.accounts.length === 1 && chain.accounts[0].privateKey) {
            self.copyToClipboard(
              chain.privateKey,
              chain.chain.toUpperCase() + ' private key'
            )
          } else {
            self.keys.keying++
            self.keys.field = 'privateKey'
            self.keys.chain = chain
          }
        },
        chains () {
          if (!self.$q.platform.is.mobile) { self.setChainWalletData(chain) }

          if (chain.type === 'verto') {
            self.$router.push(self.getImportLink('eos'))
          } else if (chain.isEvm || chain.chain === 'eos') {
            self.selectedChain = chain
            self.initTable(chain.chain)
            self.tab = 'assets'
            console.log('seting tab ass')
          } else {
            self.showTokenPage(chain, self.assetsOptions[0].data)
          }
        }
      }

      if (actions[self.tab]) {
        actions[self.tab]()
      }
    },
    setChainWalletData (chain) {
      if (chain) {
        const self = this
        self.$store.state.settings.defaultChainData = chain
        self.$store.state.wallets.customTotal.usd = chain.chainTotal
        self.$store.state.wallets.customTotal.show = true
        self.$store.state.wallets.customTotal.label = chain.label + ' balance'
        if (chain.accounts.length) {
          self.$store.state.currentwallet.wallet = chain.accounts[0]
          self.$store.state.investment.defaultAccount = self.formatAccoountOption(
            chain.accounts[0]
          )
        }
      }
    },
    showTokenPage (asset) {
      if (this.tab === 'investments' && asset.type === 'vtx' && asset.isStaked) {
        this.$router.push({
          path: '/verto/stake/eos/vtx'
        })
      } else {
        this.$router.push({
          name: this.getPageName('token'),
          path: '/verto/token/' + asset.chain + '/' + asset.type,
          params: {
            asset: asset,
            assets: this.assetsOptions[0].data
          }
        })
      }
      // this.$emit('setAsset', asset)
    },
    setVtxData () {
      let chain = localStorage.getItem('selectedChain')
      if (chain && chain === 'vtx') {
        let asset = this.assets.find((o) => o.type === 'vtx')
        if (!asset) {
          asset = {
            type: 'vtx',
            chain: 'eos',
            icon: 'statics/icons/favicon-32x32.png'
          }
        }
        this.tabPoolAndAssetBalances = 'explore'
        this.$emit('setAsset', asset)
      }
    },
    getInvestedEosTokens (investments) {
      let assets = []
      const setValue = (t, index) => {
        let tkData = this.$store.state.tokens.walletTokensData.find(
          (a) => a.symbol.toLowerCase() === t['symbol' + index].toLowerCase()
        )
        return {
          usd: tkData ? tkData.current_price * t['count' + index] : '',
          rateUsd: tkData ? tkData.current_price : '',
          type: t['symbol' + index].toLowerCase(),
          chain: 'eos',
          poolsCount: 1,
          owner: t.owner,
          poolName: t.symbol0 + ' / ' + t.symbol1,
          amount: t['count' + index],
          icon:
            'https://defibox.oss-accelerate.aliyuncs.com/eos/' +
            t['contract' + index] +
            '-' +
            t['symbol' + index].toLowerCase() +
            '.png',
          protocol: 'Defibox',
          protocolIcon: 'https://defibox.oss-accelerate.aliyuncs.com/eos/token.defi-box.png'
        }
      }
      investments.forEach((item) => {
        let indexes = [0, 1]
        indexes.forEach((i) => {
          let index = assets.findIndex(
            (t) => t.type === item['symbol' + i].toLowerCase()
          )
          if (index > -1) {
            assets[index].poolsCount += 1
            assets[index].amount += item['count' + i]
            return
          }
          assets.push(setValue(item, i))
        })
      })
      this.$store.dispatch('tokens/getTokensMarketsData', assets)
      this.assetsOptions[1].data.eos = this.assetsOptions[1].data.eos.filter(o => o.isStaked && o.type === 'vtx').concat(assets)
    },
    async getVTXHistoriclPrice (days = 30) {
      let response = await this.$axios.get(
        process.env[this.$store.state.settings.network].CACHE +
          'https://api.coingecko.com/api/v3/coins/volentix-vtx/market_chart?vs_currency=usd&days=' +
          days
      )
      this.chartData = response.data
    },
    getInvestedTokens (investments) {
      let assets = []
      investments.forEach((t) => {
        if (!t || !t.tokens) return

        t.tokens.forEach((a) => {
          let protocolData = this.platformOptions.find(
            (o) => t.protocolDisplay && o.label.toLowerCase() === t.protocolDisplay.toLowerCase()
          )
          let index = assets.findIndex(
            (t) => t.type === a.symbol.toLowerCase()
          )
          if (index > -1) {
            assets[index].poolsCount += 1
            assets[index].usd += a.balanceUSD
            assets[index].amount += a.balance
            return
          }
          let data = {
            usd: a.balanceUSD,
            rateUsd: a.price,
            type: a.symbol.toLowerCase(),
            chain: 'eth',
            poolName: t.label,
            owner: t.address,
            poolsCount: 1,
            amount: a.balance,
            icon: 'https://zapper.fi/images/' + a.symbol + '-icon.png',
            protocol: protocolData ? protocolData.label : null,
            protocolIcon: protocolData
              ? 'https://zapper.fi/images/' + protocolData.icon
              : null
          }
          assets.push(data)
        })
      })
      this.assetsOptions[1].data.eth = assets
    },
    getInvestments (wallet) {
      const self = this
      let investment = {
        eos () {},
        eth () {
          self.$store.state.investment.investments = []
          let account = {
            value: wallet.key
          }
          account.platform = 'uniswap-v2'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'uniswap'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'balancer'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'curve'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'yearn'
          self.$store.dispatch('investment/getInvestments', account)
        }
      }
      investment[wallet.chain]()
    },
    onRowClick (evt, row) {
      this.$emit('setAsset', row)
    },
    getIncomingTransaction (ethAddress) {
      let request = {
        jsonrpc: '2.0',
        id: 0,
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0xff',
            toBlock: 'latest',
            fromAddress: '',
            toAddress: ethAddress,
            excludeZeroValue: true
          }
        ]
      }
      this.$axios
        .post(
          'https://eth-mainnet.alchemyapi.io/v2/Le_8-Zg9gV0p_gRbw3kpCJj94eH6Fjg_',
          request
        )
        .then((res) => {
          // console.log(res)
        })
    },
    getSectionTitle (item) {
      return this.chainSelected && item.id === 'assets'
        ? item.title.replace(' ', ' ' + this.chainSelected + ' ')
        : item.title
    },
    getChains () {
      let all = null
      if (!['new', 'import'].includes(this.tab)) {
        all = this.setChains()
        this.chains = all.filter(
          (o) =>
            o.type === 'verto' || (o.accounts &&
                o.accounts.length &&
                (this.showAllChains || this.$route.params.accounts ||
                  o.accounts.find(
                    (a) =>
                      (parseFloat(o.chainTotal) && !isNaN(o.chainTotal)) ||
                      this.tab === 'receive' ||
                      (parseFloat(o.usd) && !isNaN(o.usd)) ||
                      ['eos', 'btc', 'eth', 'bsc'].includes(o.chain)
                  ))
            ))
          .filter(
            (o) => !this.$store.state.settings.disableChains.includes(o.chain)
          )
      } else {
        all = HD.getVertoChains()
        this.chains = all
      }
      return all
    },
    filterTokensByAccount (account) {
      this.initTable(null, account)
    },
    initTable (chain = null, account = null) {
    //  let account = null
      // this.chains = (this.$route.params.accounts) ? HD.getVertoChains() :
      this.getChains()
      // console.log(this.chains, 'this.chains = ')
      if (
        this.$store.state.investment.defaultAccount &&
        this.$q.platform.is.mobile
      ) {
        account = this.$store.state.investment.defaultAccount
        // this.getChainLabel(account.chain)
      }
      chain = chain || this.selectedChain ? this.selectedChain.chain : chain
      this.assets = []
      let not_valuable = localStorage.getItem('not_valuable')
      not_valuable = not_valuable ? JSON.parse(not_valuable) : []
      this.$store.state.wallets.tokens
        .filter(
          (o) =>
            (!account && !chain) ||
            (chain && o.chain === chain && !account) ||
            (account &&
              o.chain === account.chain &&
              ((account.isEvm && o.key.toLowerCase() === account.key.toLowerCase()) ||
                (!account.isEvm && o.name.toLowerCase() === account.name.toLowerCase())))
        )
        .forEach((asset, i) => {
          let token = Object.assign({}, asset)
          token.amount = parseFloat(token.amount)
          token.usd = parseFloat(token.usd)

          if (not_valuable.length && not_valuable.find(z => z.chain === token.chain && z.type === token.type)) {
            token.tokenPrice = 0
            token.usd = 0
            token.notValuable = true
          }
          if (
            (!isNaN(token.amount) && token.amount !== 0) ||
            token.isEvm ||
            !this.$store.state.wallets.portfolioTotal
          ) {
            let index = this.assets.findIndex(
              (o) =>
                o.type === token.type &&
                o.chain === token.chain &&
                (token.chain !== 'eos' || o.contract === token.contract)
            )
            if (index !== -1) {
              this.assets[index].notValuable = token.notValuable
              this.assets[index].amount += token.amount
              this.assets[index].usd += isNaN(token.usd) ? 0 : token.usd
              this.assets[index].rateUsd = isNaN(token.tokenPrice)
                ? 0
                : token.tokenPrice
              this.assets[index].percentage =
                (this.assets[index].usd /
                  parseFloat(this.$store.state.wallets.portfolioTotal)) *
                100
              this.assets[index] = this.getHistoricalValue(this.assets[index])
            } else {
              token.percentage =
                (token.usd /
                  parseFloat(this.$store.state.wallets.portfolioTotal)) *
                100
              token.index = this.assets.length
              token.rateUsd = isNaN(token.tokenPrice) ? 0 : token.tokenPrice
              token.friendlyType =
                token.type.length > 6
                  ? token.type.substring(0, 6) + '...'
                  : token.type
              token.chainLabel = this.getChainLabel(token.chain)
              token = this.getHistoricalValue(token)
              this.assets.push(token)
            }
            this.assets.sort(
              (a, b) =>
                (isNaN(parseFloat(b.usd)) ? 0 : parseFloat(b.usd)) -
                (isNaN(parseFloat(a.usd)) ? 0 : parseFloat(a.usd))
            )
          }
          this.loaded = false
        })
      this.assetsOptions[0].data = this.assets
    },
    getHistoricalValue (token) {
      let tokenData = this.$store.state.tokens.walletTokensData.find(
        (a) => a.symbol === token.type
      )
      if (tokenData) {
        let change = tokenData.price_change_24h * token.amount
        token.change24h =
          (change > 0 ? '+' : '-') +
          '$' +
          this.formatNumber(Math.abs(change), 2)
        token.change24hValue =
          (change > 0 ? '' : '-') + this.formatNumber(Math.abs(change), 2)
        token.change24hPercentage =
          (change > 0 ? '+' : '-') +
          this.formatNumber(
            Math.abs(tokenData.price_change_percentage_24h),
            2
          ) +
          '%'
        token.color = change > 0 ? 'text-green-6' : 'text-pink-12'
      }
      return token
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
      // console.log('this.screenSize', this.screenSize)
    },
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter((row) =>
        row.poolName.toLowerCase().includes(lowerTerms)
      )
    }
  },
  mixins: [Formatter]
}
</script>

<style lang="scss" scoped>
.qr-code canvas {
    width: 134px !important;
    height: 134px !important;
}
/deep/ ul.tabs.group {
  height: 60px !important ;
  border-radius: 50px;
  background-color: #fff;
  margin-top: 1px;
  padding: 10px;
  width: fit-content;
  box-shadow: 8px 12px 35px 1px rgba(0, 0, 0, 0.07);
}
.chains h6 {
  margin-block-end: 0;
}
/deep/ .q-field--filled .q-field__control {
  padding: 0 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 9px 9px 9px 9px;
}
.desktop-size {
  height: 100%;
}
.mobile-size {
  height: 818px;
}

.desktop-card-style {
  box-shadow: none !important;
  cursor: default;
  &:after {
    display: none !important;
  }
}
.desktop-card-style.current-investments .body-table-col .pairs {
  margin-bottom: -2px;
}
.desktop-card-style.current-investments .body-table-col {
  &._coin_type {
    width: 110px;
    position: relative;
    .thicker {
      position: absolute;
      left: 50px;
    }
  }
  &._rate_usd {
    width: 150px;
  }
  &._daily_change {
    width: 80px;
  }
}
.desktop-card-style.current-investments .body-table-col .pairs .pair {
  font-weight: 700;
  color: inherit;
  font-size: 14px;
}
.current_price {
  font-size: 12px;
  &.qmtxs {
    margin-top: 1px;
  }
}
.allocation {
  font-size: 12px;
}
.balance {
  font-size: 14px;
}
.desktop-card-style.current-investments .body-table-col .pairs .value {
  color: #627797;
}

.desktop-card-style.current-investments .body-table-col .imgs {
  margin-top: 5px;
  min-width: 20px;
  margin-right: -25px;
}

.desktop-card-style.current-investments .body-table-col .imgs img {
  border-radius: 40px;
  height: 25px;
}

.desktop-card-style.current-investments .body-table-col .imgs:first-child img {
  margin-right: -10px;
}

.desktop-card-style.current-investments .qbtn-custom {
  border-radius: 30px;
  height: 34px;
  text-transform: initial !important;
  background: transparent !important;
  color: #04111f !important;
  border: 1px solid #04111f;
}
.desktop-card-style.current-investments {
  /deep/ .q-table {
    th {
      font-size: 15px;
    }
  }
}
.desktop-card-style.current-investments .qbtn-custom .q-btn__wrapper {
  min-height: unset;
  padding: 0px 5px;
}

.desktop-card-style.current-investments
  .qbtn-custom
  .q-btn__wrapper
  .q-btn__content {
  text-transform: none;
  font-size: 10px;
}
.explore-opportunities {
  .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    width: auto;
    font-size: 12px !important;
    text-transform: initial !important;
    &.qbtn-custom2 {
      width: auto;
      height: 30px;
      margin-bottom: 5px;
      margin-right: 0px;
      margin-top: 5px;
      /deep/ .q-btn__wrapper {
        min-height: unset;
      }
    }
  }
  &.q-table--dark {
    .qbtn-custom {
      border-radius: 30px;
      height: 34px;
      width: auto;
      font-size: 12px !important;
      color: #fff !important;
      border: 1px solid #fff !important;
      background: transparent !important;
      text-transform: initial !important;
      font-weight: normal;
      &.qbtn-custom2 {
        width: auto;
        height: 30px;
        margin-bottom: 5px;
        margin-right: 0px;
      }
    }
  }
}

.wrapper {
  background: #fff;
  // height: 86vh;
  border-radius: 12px;
  padding-right: 10px;
  margin-top: 20px;
}
.wrapper {
  height: 89.5vh;
  padding-bottom: 10px;
  // overflow: auto;
  @media screen and (min-height: 700px) {
    height: 91.5vh;
  }
  @media screen and (min-height: 760px) {
    height: 91.5vh;
  }
  @media screen and (min-height: 800px) {
    height: 91.5vh;
  }
  @media screen and (min-height: 870px) {
    height: 91.5vh;
  }
}
.wrapper /deep/ .q-scrollarea.desktop-size {
  // height: 81.5vh !important;
  // padding-right: 10px;
  // @media screen and (min-height: 700px) {
  //   height: 70.5vh !important;
  // }
  // @media screen and (min-height: 760px) {
  //   height: 70.5vh !important;
  // }
  // @media screen and (min-height: 800px) {
  //   height: 69.2vh !important;
  // }
  // @media screen and (min-height: 870px) {
  //   height: 69vh !important;
  // }
}

.top-4part {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  grid-gap: 20px;
}
.wrapper .top-part-all {
  width: 100%;
  background: #fff;
}

.top-part-all h2 {
  display: block;
  font-family: "Rubik", sans-serif;
  font-size: 40px;
  line-height: 48px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #000;
  margin-top: 24px;
}

.wrapper .top-4part a {
  color: #fff;
}

.wrapper .top-part {
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  background-repeat: no-repeat;
  background-size: 80px 60px;
  background-position: bottom right;
}

.sub-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);

  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  grid-gap: 4px;
  margin-bottom: 14px;
}

.sub-top h3 {
  font-size: 24px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #000;
}

.sub-top p {
  line-height: 16px;
  letter-spacing: -0.2px;
  color: #a1a1a5;
  word-break: break-word;
  margin-top: 6px;
}

.see-text {
  text-align: right;
  position: relative;
}

.see-text a {
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
}

.see-text a:hover {
  text-decoration: underline;
}

.main-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: 4px;
}

.mt-img img {
  width: 40px;
}

.main-top h6 img {
  width: 24px;
  vertical-align: middle;
}

.small-grid {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 30px;
  grid-auto-columns: 22.6%;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: initial;
  justify-content: initial;
  margin-bottom: 24px;
}

.main {
  padding: 15px;
  border: 1px solid #e8e8e9;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
  margin-left: 0px;
  margin-right: 0px;

}
.row > .col-md-3{
  padding-bottom: 10px;
  padding-top: 10px;
}

.main:hover {
  box-shadow: 0px 4px 8px rgba(46, 63, 116, 0.1);
}

.main h6 {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  color: #000;
  word-break: break-word;
  margin-top: 10px;
  margin-left: 7px;
}

.main p {
  display: block;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: #a1a1a5;
}

.main h2 {
  font-size: 20px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.4px;
  color: #000;
  word-break: break-word;
  position: relative;
}

.main .g-txt {
  color: #363636;
  margin-left: -5px;
}

.main .sr-txt {
  color: #eb5757;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  font-family: "Roboto";
  margin-top: -40px;
}

.main .sg-txt {
  color: #1cc760;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  font-family: "Roboto", sans-serif;
}

.main h2 a {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  padding: 0px 10px;
  border-radius: 99999px;
  border: none;
  outline: none;
  position: absolute;
  right: 0px;
  margin-top: -3px;
  z-index: 1;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  text-transform: initial !important;
  background: #fff !important;
  border: 1px solid rgba(204, 204, 204, 0.7);
  color: #071e36 !important;
  font-size: 12px !important;
  border-radius: 40px;
  font-weight: 700;
  height: 30px;
  min-width: fit-content;
}

.main h2 a::before {
  content: "";
  display: block;
  width: 20px;
  height: 40px;
  position: absolute;
  left: unset;
  right: 55px;
  z-index: -2222;
  background-image: linear-gradient(
    270deg,
    rgb(255, 255, 255) 54.69%,
    rgba(255, 255, 255, 0) 100%
  );
}

.main h2 a:hover {
  opacity: 1;
}

.tags-wrap a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 3px 11px 3px 7px;
  border: 1px solid #e8e8e9;
  margin-right: 12px;
  margin-bottom: 16px;
  display: inline-block;
}

.tags-wrap a span {
  font-size: 18px;
  font-weight: 700;
  color: #2962ef;
  margin-right: 5px;
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  .wrapper {
    width: 93.15%;
    background: #fff;
    margin: 0 15px;
  }
}

@media screen and (max-width: 767px) {
  .wrapper {
    width: 100%;
    background: #fff;
    margin: 0 0%;
    padding: 0 15px;
  }

  .sub-top {
    display: grid;
    grid-auto-flow: revert;
    grid-gap: 21px;
    margin-bottom: 24px;
  }

  .small-grid {
    display: block;
    margin-bottom: 50px;
  }

  .main {
    margin-bottom: 20px;
  }

  .tags-wrap a {
    margin-right: 4px;
  }
}
.dark-theme {
  ul.tabs.group {
    background-color: #030c16;
    box-shadow: 8px 12px 35px 1px rgba(0, 0, 0, 0.07);
    li a {
      background-color: #02070e;
      &.active{
        background-color: #092649;
      }
    }
  }
  .main .g-txt {
    color: rgb(240, 240, 240);
  }
  .wrapper {
    background-color: #ffffff;
    // border: 1px solid #627797;
    /deep/ .q-dark {
      background-color: #04111f !important;
    }
    color: #fff;
    .main h6,
    .main h2 {
      color: #fff;
    }
    .main h2 a {
      background: #071e36 !important;
      border: 1px solid rgba(204, 204, 204, 0.7);
      color: #fff !important;
      margin-top: 1px;
      &:before {
        width: 30px;
        right: 55px;
        left: unset;
        top: 0px;
        background-image: linear-gradient(
          270deg,
          #04111f 54.69%,
          rgba(4, 17, 31, 0) 100%
        );
        opacity: 0.5;
      }
    }
  }
}
.chains {
  /* border: 1px #dddada solid; */
  padding: 20px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-top: -29px;
}
.q-tab--active {
  background: #f2f2f2;
}

.wrap {
  margin: 0 auto;
}
ul.tabs {
  height: 80px;
  margin-top: -40px;
  list-style: none;
  overflow: hidden;
  padding: 0;
}
ul.tabs li {
  float: left;
  width: fit-content;
  height: auto;
  margin-right: 10px;
  &:last-child{
    margin-right: 0px;
  }
}

ul.tabs li a {
  padding: 5px 20px;
  padding-right: 30px;
  position: relative;
  display: block;
  height: 40px;
  border-radius: 50px !important;
  margin-top: 0px;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  text-decoration: none;
  color: #919191;
  background: #f8f8f8;
  // -webkit-box-shadow: 8px 12px 25px 2px rgba(0, 0, 0, 0.02);
  // -moz-box-shadow: 8px 12px 25px 2px rgba(0, 0, 0, 0.02);
  // box-shadow: 8px 12px 25px 2px rgba(0, 0, 0, 0.02);
  box-shadow: none !important;
  // border: 0px solid #000000;
  -webkit-transition: padding 0.2s ease, margin 0.2s ease;
  -moz-transition: padding 0.2s ease, margin 0.2s ease;
  -o-transition: padding 0.2s ease, margin 0.2s ease;
  -ms-transition: padding 0.2s ease, margin 0.2s ease;
  transition: padding 0.2s ease, margin 0.2s ease;
  i{
    margin-top: -4px;
    margin-right: 5px;
  }
}
.tabs li:first-child a {
  z-index: 3;
  -webkit-border-top-left-radius: 8px;
  -moz-border-radius-topleft: 8px;
  border-top-left-radius: 8px;
}
.tabs li:nth-child(2) a {
  z-index: 2;
}
.tabs li:last-child a {
  z-index: 1;
  -webkit-box-shadow: 2px 8px 25px -2px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 2px 8px 25px -2px rgba(0, 0, 0, 0.3);
  box-shadow: 2px 8px 25px -2px rgba(0, 0, 0, 0.3);
  -webkit-border-top-right-radius: 8px;
  -moz-border-radius-topright: 8px;
  border-top-right-radius: 8px;
}
ul.tabs li a:hover {
  // margin: 35px 0 0 0;
}
ul.tabs li a.active {
  // margin: 0px 0 0 0;

  background: #919191;
  color: #f8f8f8;
  // padding-top: 10px;
  z-index: 4;
  outline: none;
  i{
    // color: #0071ff;
  }
}
.group:before,
.group:after {
  content: " "; /* 1 */
  display: table; /* 2 */
}
.group:after {
  clear: both;
}
.account-tabs .read {
  display: none;
}
.assets-tabs .manage {
  display: none;
}
.copy-key {
  background: #f2f2f2;
  padding: 10px;
  border-radius: 5px;
  font-size: 13px;
}
.assets_explorer_container {
  @media screen and (max-width: 768px){
    padding-left: 0px;
    padding-right: 0px;
  }
  &.dark-theme {
    background: #04111f;
    .copy-key {
      background: #0e1829;
    }
  }
}
.receive_wrapper_class,
.import_wrapper_class{
  margin-top: 0px !important;
  height: 82vh;
}
.receive_wrapper_class_scroll,
.import_wrapper_class_scroll{
  height: 60vh !important;
  margin-left: 0px !important;
}
.desktop /deep/ .q-dialog {
  max-width:400px !important
}
.no-value {
    font-size: 14px;
    color: red !important
 }
</style>
