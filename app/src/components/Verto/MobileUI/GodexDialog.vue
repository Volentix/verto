<template>
  <div
    :class="[experience.type]"
    class="lighTheme mobile-card"
    :style="
      $store.state.settings.lightMode === 'true'
        ? 'background-color: white !important;'
        : ''
    "
  >
    <q-header
      :class="
        $store.state.settings.lightMode === 'true' ? 'mobile-card' : 'bg-white'
      "
      v-show="showHeader"
    >
      <q-toolbar
        :class="
          $store.state.settings.lightMode === 'true'
            ? 'text-white mobile-card'
            : 'bg-white text-black'
        "
        v-if="$q.platform.is.mobile"
        style="margin-left: 10px;"
      >
        <q-btn
          flat
          round
          dense
          icon="arrow_back_ios"
          class="q-mr-sm"
          @click="goBack()"
        />
        <q-toolbar-title> Exchange </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="block-contents">
      <div class="mainBlk " :class="{ active: showHeader }">
        <div class="middle-block">
          <div class="blk-header">
            <ul v-if="false">
              <li v-if="false"><b class="q-mr-md">Swap:</b> Onchain</li>
              <li class="limitBtn" v-if="false">Limit</li>
            </ul>

            <div class="row exchange-header" >
              <q-tabs
                class="col-md-5"
                v-if="$store.state.investment.defaultAccount"
                v-model="networksDir"
                inline-label
                dense
              >
                <q-tab
                  name="same"
                  :icon="'img:' + tabData.icon"
                  :label="tabData.label"
                />
                <q-tab
                  v-if="experience.isCrosschain"
                  name="crosschain"
                  icon="img:https://www.androidfreeware.net/img2/com-github-ontio-onto.jpg"
                  label="Crosschain"
                />
              </q-tabs>
              <AccountSelector

                v-if="currentPath.fromChain"
                :key="currentPath.fromChain.chain"
                class="q-pt-lg flex flex-center col-md-5 offset-md-2"
              />
            </div>
          </div>
          <p v-if="experience.title && !reviewStep" class="text-h6 q-pt-md">{{ experience.title }}</p>
          <div
            class="text-body1 text-red"
            v-if="
              !['terra', 'eth'].includes(
                $store.state.investment.defaultAccount.chain
              )
            "
          >
            The exchange is only available for the Ethereum and Terra chains.
            More chains coming soon...
          </div>

          <span v-if="reviewStep">
            <span
              class="text-h6 cursor-pointer"
              @click="
                isApproval && txHash ? inputChanged() : null;
                reviewStep = false;
                txHash = false;
                loadingState = false;
              "
              ><q-icon name="chevron_left" /> Back |</span
            >
            <span class="text-h6 text-bold " v-if="!txHash">
              Please review your transaction</span
            >
            <span class="text-h6 text-bold " v-else> Transaction submited</span>
          </span>
          <div
            v-if="!txHash"
            class="flex row q-mt-md"
            :class="{
              removeSelector: reviewStep || experience.disableFromTokenSelector,
              approval: isApproval && reviewStep
            }"
          >
            <div class=" col-md-5" v-if="depositCoin">
             <div class="fromBlk">
              <span v-if="reviewStep" class="text-h6">
                <span v-if="isApproval"
                  >Approve {{ currentPathData.approval.entity }}</span
                >
                <span v-else-if="experience.type == 'exchange'">You send</span>
                <span v-else-if="experience.type == 'deposit_ust'">You will {{action}}</span>
              </span>
              <p style="color:#6c86ad;">
                <span class="drpn"
                  ><span
                    v-show="networksDir == 'crosschain'"
                    class="cursor-pointer"
                    @click="
                      fromSelected = true;
                      toSelect = 'chains';
                      showHeader = false;
                    "
                    >From - {{ currentPath.fromChain.label }}
                    <q-icon name="keyboard_arrow_down" size="xs"/></span></span
                ><span v-if="!reviewStep"
                  >Balance: {{ formatNumber(depositCoin.amount, 5) }}
                  {{ depositCoin.value.toUpperCase()
                  }}<span
                    class="max"
                    @click="
                      swapData.fromAmount = depositCoin.amount;
                      inputChanged();
                    "
                    v-if="depositCoin.amount"
                    >Max</span
                  ></span
                >
              </p>
              <h5 class="drpn">
                <span
                  @click="
                    toSelect = 'deposit';
                    showHeader = false;
                  "
                  ><img
                    :key="depositCoin.value"
                    :src="depositCoin.image"
                    alt=""
                  />
                  {{ depositCoin.value }}
                </span>
                <input
                  type="text"
                  :class="{ 'bg-input': !reviewStep }"
                  v-model="swapData.fromAmount"
                  @input="inputChanged()"
                />
              </h5>
              <p v-if="!reviewStep">
                <span>{{ depositCoin.label }}</span>
                <span v-if="currentPathData && currentPathData.toUsdTotal"
                  >${{ formatNumber(currentPathData.fromUsdTotal, 2) }}</span
                >
              </p>
              <ul
                class="rates q-mt-md q-py-sm"
                :class="
                  $store.state.settings.lightMode === 'true'
                    ? 'mobile-card'
                    : ''
                "
              >
                <li v-if="currentPathData && !reviewStep && experience.type == 'exchange'">
                  <span
                    >1 {{ currentPathData.fromToken.toUpperCase() }} =
                    {{
                      formatNumber(
                        currentPathData.toAmount / currentPathData.fromAmount,
                        4
                      )
                    }}
                    {{ currentPathData.toToken.toUpperCase() }}
                    {{
                      currentPathData.fromUsd
                        ? " = $" + formatNumber(currentPathData.fromUsd, 2)
                        : ""
                    }}
                  </span>
                </li>
                <li v-if="currentPathData && !reviewStep && experience.type == 'exchange'">
                  <span
                    >1 {{ currentPathData.toToken.toUpperCase() }} =
                    {{
                      formatNumber(
                        currentPathData.fromAmount / currentPathData.toAmount,
                        4
                      )
                    }}
                    {{ currentPathData.fromToken.toUpperCase() }}
                    {{
                      currentPathData.toUsd
                        ? " = $" + formatNumber(currentPathData.toUsd, 2)
                        : ""
                    }}
                  </span>
                </li>
                <li
                  v-if="
                    (currentPathData && currentPathData.fromChain === 'terra') || experience.type == 'deposit_ust'
                  "
                >
                  <span>Fee = 0.3 UST </span>
                </li>
                <li
                  v-else-if="
                    currentPathData &&
                      currentPathData.fee &&
                      currentPathData.fee.usd
                  "
                >
                  <span
                    >Fee = ${{ formatNumber(currentPathData.fee.usd, 2) }}
                  </span>
                </li>
              </ul>
            </div>
             <div   v-if="!txHash" class="q-pt-md">

          <div v-if="experience.type == 'deposit_ust' && !reviewStep">
          <br/>
          <q-btn  :disabled="(paths.length < 1 && experience.type == 'exchange') || !parseFloat(swapData.fromAmount)"  @click="action = 'deposit' ; reviewStep ? pushTransaction() : (reviewStep = true)" class="q-mr-md" size="lg" outline rounded label="Deposit" />
          <q-btn v-if="experienceData && experienceData.amount"  :disabled="(paths.length < 1 && experience.type == 'exchange') || !parseFloat(swapData.fromAmount)"   @click="action = 'withdraw' ; reviewStep ? pushTransaction() : (reviewStep = true)" size="lg" outline rounded label="Withdraw" />
          </div>
          <button
           v-else-if="experience.type == 'exchange' || reviewStep"
            type="button"
            class="theme-btn"
            @click="reviewStep ? pushTransaction() : (reviewStep = true)"
            :disabled="(paths.length < 1 && experience.type == 'exchange') || !parseFloat(swapData.fromAmount)"
          >
            {{
              !reviewStep
                ? isApproval
                  ? "Approve " + currentPathData.approval.entity
                  : "Review"
                : "Submit transaction"
            }}
            <q-spinner-dots v-if="loadingState" color="white" size="2em" />
          </button>
            </div>
            </div>
            <div
              v-if="experience.type == 'exchange'"
              class="col-md-2 flex flex-center switcher"
            >
              <q-img
                class="cursor-pointer"
                @click="switchAmounts()"
                src="https://cdn-icons-png.flaticon.com/512/2026/2026657.png"
                style="width:50px"
              />
            </div>
            <div class="toBlk col-md-5" v-if="destinationCoin && experience.type == 'exchange'">
              <span v-if="reviewStep" class="text-h6">You receive</span>
              <p>
                <span class="drpn"
                  ><span
                    v-show="networksDir == 'crosschain'"
                    class="cursor-pointer"
                    @click="
                      fromSelected = false;
                      toSelect = 'chains';
                      showHeader = false;
                    "
                    >To - {{ currentPath.toChain.label }}
                    <q-icon name="keyboard_arrow_down" size="xs"/></span
                ></span>
                <span v-if="!reviewStep"
                  >Balance: {{ formatNumber(destinationCoin.amount, 2) }}
                  {{ destinationCoin.value.toUpperCase() }}<br /><span
                    v-if="currentAccount.to !== currentAccount.from"
                    >{{ getAccountLabel(currentAccount.to) }}</span
                  ></span
                >
              </p>
              <h5 class="drpn">
                <span
                  @click="
                    toSelect = 'destination';
                    showHeader = false;
                  "
                  ><img
                    :key="depositCoin.value"
                    :src="destinationCoin.image"
                    alt=""
                  />
                  {{ destinationCoin.value }}
                </span>
                <input
                  v-if="currentPathData"
                  type="text"
                  readonly
                  :value="formatNumber(currentPathData.toAmount, 4)"
                />
                <q-spinner-dots v-else size="2em" />
              </h5>
              <!-- <div class="cash-blk primari active">
                      <h5><b>{{swapData.dex}} <span>{{swapData.chain}}</span></b> <b>{{swapData.toAmount}} <span></span></b></h5>
                  </div> -->
              <!-- <div class="cash-blk">
                      <h5><b class="dn_arr"> <div class="withArr">Unifi <span class="arrow"></span></div> <span>Tx cost 0.0336E (~$123.74)</span></b> <b>0.00031 <span>~$1.18</span></b></h5>
                  </div> -->
              <div
                class="cash-blk last_ops hide"
                v-if="
                  !reviewStep && currentPathData && currentPathData.toAmount
                "
              >
                <h5>
                  <b class="dn_arr"
                    ><img width="50px" :src="currentPathData.dexLogo" /><span
                      v-if="false"
                      >Fees: $12</span
                    >
                  </b>
                  <b style="text-align: end;"
                    >{{ formatNumber(currentPathData.toAmount, 5) }}
                    {{ destinationCoin.value.toUpperCase() }}
                    <span>{{
                      currentPathData.toUsdTotal
                        ? "$" + formatNumber(currentPathData.toUsdTotal, 2)
                        : ""
                    }}</span></b
                  >
                </h5>
              </div>
            </div>
            <div  :class="{'move_top' : experience.type == 'deposit_ust'}" class="toBlk col-md-5 offset-md-2" v-if="destinationCoin && experience.type == 'deposit_ust'">
               <div class="text-center q-pt-md">
                  <span class="text-h6">  Total Deposit</span><br/><br/>
                   <span class="text-h4 text-bold" v-if="experienceData"> {{experienceData.balance}}</span>
                   <span class="text-h4 text-bold" v-else>       <q-spinner-dots  color="white" size="2em" /></span>
                   <div class="text-h6 flex flex-center q-mt-md"  v-if="experienceData">1 <small class="q-px-">&nbsp;aUST&nbsp;</small> <img width="30" src="https://app.anchorprotocol.com/assets/aust.dcee0811.svg"> <small class="q-px-md"> ≈ </small> {{experienceData.price}}&nbsp; <small>UST&nbsp;</small> <img width="30"  src="https://app.anchorprotocol.com/assets/ust.7fef9ca5.svg"></div>
                  <q-separator inset dark class="q-my-md " /><br/>
                  <span class="text-h6"> Interest</span><br/>
                   <span class="text-h4 text-bold text-green" > 19.41%</span>
                   <br/><br/>
                   <q-btn-toggle
        v-model="apySelector"
        outline
         toggle-color="green"
        :options="[
          {label: 'Year', value: '1'},
          {label: 'Month', value: '12'},
          {label: 'Week', value: '52'},
           {label: 'Day', value: '365'},
        ]"
      /><br/><br/>
      Expected interest  <br/>
        <span class="text-h6 text-bold" v-if="experienceData">
        {{formatNumber(experienceData.ustValue * 0.1941 /apySelector, 3)}} <span class="text-body1">UST</span>
        </span>
               </div>
            </div>
          </div>
          <div v-if="txHash" class=" q-py-md q-pt-lg text-body1">
            <br />
            Click to view on explorer<br />
            <div class="hash-status">
              <a
                :href="txExplorerLink"
                target="_blank"
                class="text-green q-mt-md"
                >{{ getKeyFormat(txHash, 20) }}</a
              >
              <q-btn
                @click="copyToClipboard(txHash, 'Tx Hash')"
                flat
                icon="content_copy"
              />
            </div>
            <button
            v-if="$route.params.after_experience"
            type="button"
            class="theme-btn"
            @click="loadAfterExperience()"
          >
          {{$route.params.after_experience.label}}
          </button>
          </div>
          <p v-if="txError" class="text-red text-body1 q-mt-sm">
            <br />{{ txError }}
          </p>

        </div>
      </div>
      <!-- SEARCH PANEL  openWallet() -->
      <div
        class="searchBlk"
        :class="{ active: !showHeader }"
        style="position: fixed; width:400px"
      >
        <h5 class="heading">
          <q-icon
            name="arrow_back_ios"
            class="backfromtoken"
            style="padding-right: 25px; height: 1px;  top: 50%; left: 13px; background-clor: #000; font-size: 1em;"
            @click="back()"
          />
          <!-- <q-icon name="arrow_back_ios"  class="backfromtoken" style="height: 1px; position: absolute; top: 50%; left: 30px; color: black; font-size: 1em;" @click="back()"/> -->
          <!-- <button type="button" class="backfromtoken text-black" @click="back()"><span class="arrow"></span></button> -->
          {{ listOptions[toSelect].title }}
        </h5>
        <form>
          <svg
            v-if="!['chains', 'accounts'].includes(toSelect)"
            xmlns="http://www.w3.org/2000/svg"
            id="search"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M11 19C12.775 18.9996 14.4988 18.4054 15.897 17.312L19.586 21.001C19.9765 21.3915 20.6095 21.3915 21 21.001C21.3905 20.6105 21.3905 19.9775 21 19.587L17.311 15.898C18.405 14.4997 18.9996 12.7754 19 11C19 6.589 15.411 3 11 3C6.589 3 3 6.589 3 11C3 15.411 6.589 19 11 19ZM11 5C14.309 5 17 7.691 17 11C17 14.309 14.309 17 11 17C7.691 17 5 14.309 5 11C5 7.691 7.691 5 11 5Z"
              fill="currentColor"
            ></path>
          </svg>
          <input
            v-model="search"
            type="text"
            :placeholder="
              'Search by symbol (' + depositCoinOptions.length + ')'
            "
            v-if="toSelect == 'deposit' && depositCoinOptions "
          />
          <input
            v-model="search"
            type="text"
            :placeholder="
              'Search by symbol (' + destinationCoinOptions.length + ')'
            "
            v-if="toSelect == 'destination'"
          />
          <!-- <q-input rounded outlined v-model="text" label="Rounded outlined" /> -->
        </form>
        <ul
          class="cryptoSuggestions"
          v-if="
            toSelect == 'deposit' &&
              depositCoinOptions &&
              depositCoinOptions.length > 4
          "
        >
          <li
            v-for="item in [...depositCoinOptions]
              .sort((a, b) => b - a)
              .slice(0, 3)"
            :key="`${Math.floor(Math.random() * 1000)} ${item.address}`"
            @click="selectionProcess(item)"
          >
            <img
              :src="item.image"
              alt=""
              onerror="this.src='https://etherscan.io/images/main/empty-token.png';"
            />
            {{ item.label }}
          </li>
        </ul>
        <ul class="cryptoSuggestions" v-else-if="toSelect == 'destination'">
          <li
            v-for="item in [...destinationCoinOptions]
              .sort((a, b) => b - a)
              .slice(0, 3)"
            :key="`${Math.floor(Math.random() * 1000)} ${item.address}`"
            @click="selectionProcess(item)"
          >
            <img
              :src="item.image"
              onerror="this.src='https://etherscan.io/images/main/empty-token.png';"
              alt=""
            />
            {{ item.label }}
          </li>
        </ul>
        <div class="cryptoList">
          <ul v-if="toSelect == 'deposit'">
            <li
              v-for="item in (depositCoinOptions || []).filter(
                a =>
                  !search ||
                  search.length == 0 ||
                  a.label.toLowerCase().includes(search.toLowerCase())
              )"
              :key="
                `${Math.floor(Math.random() * 1000)} ${item.address}${
                  item.label
                }`
              "
              @click="selectionProcess(item)"
            >
              <div class="leftBlk">
                <img
                  :src="item.image"
                  onerror="this.src='https://etherscan.io/images/main/empty-token.png';"
                  alt=""
                />
                <p>{{ item.value.toUpperCase() }}</p>
              </div>
              <span> {{ formatNumber(item.amount, 4) }}</span>
            </li>
          </ul>
          <ul v-else-if="toSelect == 'chains'">
            <li
              v-for="item in chains"
              :key="`${Math.floor(Math.random() * 1000) + item.label}`"
              @click="selectionProcess(item)"
            >
              <q-item>
                <q-item-section top avatar>
                  <q-avatar>
                    <img
                      :src="item.icon"
                      onerror="this.src='https://etherscan.io/images/main/empty-token.png';"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption
                    >${{ formatNumber(item.chainTotal) }}
                    {{
                      item.accounts.length > 1
                        ? " - " + item.accounts.length + " accounts"
                        : ""
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </li>
          </ul>
          <ul v-else-if="toSelect == 'accounts'">
            <li
              v-for="item in currentPath[fromSelected ? 'fromChain' : 'toChain']
                .accounts"
              :key="`${Math.floor(Math.random() * 1000) + item.label}`"
              @click="selectionProcess(item)"
            >
              <q-item>
                <q-item-section top avatar>
                  <q-avatar>
                    <img :src="item.icon" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption
                    >${{ formatNumber(item.total) }} -
                    {{ getKeyFormat(item.key) }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </li>
          </ul>
          <ul v-else-if="toSelect == 'destination'">
            <li
              v-for="item in destinationCoinOptions.filter(
                a =>
                  !search ||
                  search.length == 0 ||
                  a.label.toLowerCase().includes(search.toLowerCase())
              )"
              :key="
                `${Math.floor(Math.random() * 1000)} ${item.address}${
                  item.label
                }`
              "
              @click="selectionProcess(item)"
            >
              <div class="leftBlk">
                <img :src="item.image" alt="" />
                <p>{{ item.value.toUpperCase() }}</p>
              </div>
              <!-- span>{{item.label}} </span><b>{{item.amount}}</b> -->
            </li>
          </ul>
        </div>
      </div>
      <!-- SEARCH BLOCK END  -->

      <div class="settings">
        <h5 class="heading">
          <!-- <button type="button" class="backfromsetting text-black"><span class="arrow"></span></button>  -->
          <q-icon
            name="arrow_back_ios"
            class="backfromsetting"
            style="padding-right: 25px; height: 1px;  top: 50%; left: 13px; background-clor: #000; font-size: 1em;"
            @click="back()"
          />
          Select a token
          <span class="rest">Reset</span>
        </h5>
        <!-- SETTIN CONTENT HIDE  -->
        <div class="alert">
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              id="attention-circle"
              width="16"
              height="16"
              fill="none"
            >
              <path
                d="M7.50065 0.333008C3.82065 0.333008 0.833984 3.31967 0.833984 6.99967C0.833984 10.6797 3.82065 13.6663 7.50065 13.6663C11.1807 13.6663 14.1673 10.6797 14.1673 6.99967C14.1673 3.31967 11.1807 0.333008 7.50065 0.333008ZM8.16732 9.66634C8.16732 10.0345 7.86884 10.333 7.50065 10.333C7.13246 10.333 6.83398 10.0345 6.83398 9.66634C6.83398 9.29815 7.13246 8.99967 7.50065 8.99967C7.86884 8.99967 8.16732 9.29815 8.16732 9.66634ZM8.16732 6.99967C8.16732 7.36786 7.86884 7.66634 7.50065 7.66634C7.13246 7.66634 6.83398 7.36786 6.83398 6.99967V4.33301C6.83398 3.96482 7.13246 3.66634 7.50065 3.66634C7.86884 3.66634 8.16732 3.96482 8.16732 4.33301V6.99967Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          <div class="content">
            <h5>Please, note! <span>×</span></h5>
            <p>
              Only transactions with slippage tolerance that higher or equal to
              1% are eligible for gas refunds.
            </p>
            <a href="#"
              >More about Gas refund
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="arrow-link"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.48301 4.11585C3.48301 3.76607 3.76656 3.48252 4.11634 3.48252H4.4998C4.8864 3.48252 5.1998 3.16912 5.1998 2.78252C5.1998 2.39592 4.8864 2.08252 4.4998 2.08252H4.11634C2.99336 2.08252 2.08301 2.99287 2.08301 4.11585V11.884C2.08301 13.0069 2.99336 13.9173 4.11634 13.9173H11.8845C13.0074 13.9173 13.9178 13.0069 13.9178 11.884V11.5C13.9178 11.1134 13.6044 10.8 13.2178 10.8C12.8312 10.8 12.5178 11.1134 12.5178 11.5V11.884C12.5178 12.2337 12.2342 12.5173 11.8845 12.5173H4.11634C3.76656 12.5173 3.48301 12.2337 3.48301 11.884V4.11585ZM7.30022 2.78252C7.30022 2.39592 7.61362 2.08252 8.00022 2.08252H13.2176C13.6042 2.08252 13.9176 2.39592 13.9176 2.78252V7.99991C13.9176 8.38651 13.6042 8.69991 13.2176 8.69991C12.831 8.69991 12.5176 8.38651 12.5176 7.99991V4.47233L7.00433 9.98561C6.73096 10.259 6.28774 10.259 6.01438 9.98561C5.74101 9.71225 5.74101 9.26903 6.01438 8.99566L11.5275 3.48252H8.00022C7.61362 3.48252 7.30022 3.16912 7.30022 2.78252Z"
                  fill="currentColor"
                ></path></svg
            ></a>
          </div>
        </div>
        <div class="settingList">
          <div class="settingTitle">
            <img
              src="https://app.1inch.io/assets/images/icons/activate-eip-1559.svg"
              alt=""
            />
            Activate EIP-1559 gas price
            <div class="moreInfo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="info"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                  fill="currentColor"
                ></path>
              </svg>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div class="settingRightOps-">
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div class="settingList gasPrice">
          <div class="settingTitle">
            <img
              src="https://app.1inch.io/assets/images/icons/activate-eip-1559.svg"
              alt=""
            />
            Gas Price
            <div class="moreInfo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="info"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                  fill="currentColor"
                ></path>
              </svg>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div class="settingRightOps">
            <span class="rightDf"
              >Medium (151.85 GWEI) <span class="arrow"></span
            ></span>
          </div>
        </div>
        <div class="hidedOpt gasPriceContent">
          <ul class="mn">
            <li class="basick active">Basic</li>
            <li class="advanced">Advanced</li>
          </ul>
          <div class="allContents active" data-class="basick">
            <form action="#">
              <label for="ckb4" class="ckb">
                <div class="lft">
                  High
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="recommended"
                    viewBox="0 0 9 8"
                    fill="none"
                  >
                    <path
                      d="M1.91825 7.94007C2.06025 8.04361 2.23183 8.01107 2.44187 7.85724L4.50084 6.34851L6.55982 7.85724C6.76986 8.01107 6.9444 8.04361 7.08344 7.94007C7.21952 7.83653 7.25206 7.66495 7.16923 7.41645L6.36161 4.99657L8.43538 3.50558C8.64542 3.35471 8.72825 3.19792 8.67204 3.03226C8.61879 2.87251 8.46496 2.78672 8.19872 2.78968L5.65458 2.80447L4.87655 0.375704C4.79667 0.124249 4.67242 0 4.50084 0C4.32926 0 4.20501 0.124249 4.12514 0.375704L3.34711 2.80447L0.802969 2.78968C0.53968 2.78672 0.38289 2.87251 0.329641 3.03226C0.273433 3.19792 0.356265 3.35471 0.566305 3.50558L2.64007 4.99657L1.83541 7.41645C1.74962 7.66495 1.78217 7.83653 1.91825 7.94007Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <b>~12 sec</b>
                </div>

                <span> 119.63 Gwei</span>
                <input type="radio" name="types" id="ckb4" checked="checked" />
                <span class="checkmark"></span>
              </label>
              <label for="ckb5" class="ckb">
                <div class="lft">
                  Medium
                  <b>~12 sec</b>
                </div>

                <span> 119.63 Gwei</span>
                <input type="radio" name="types" id="ckb5" />
                <span class="checkmark"></span>
              </label>
              <label for="ckb6" class="ckb">
                <div class="lft">
                  Low
                  <b>~12 sec</b>
                </div>

                <span> 119.63 Gwei</span>
                <input type="radio" name="types" id="ckb6" />
                <span class="checkmark"></span>
              </label>
            </form>
          </div>
          <div class="advancedSets" data-class="advanced">
            <form action="">
              <label for="">
                <div class="lbl-txt">
                  <span
                    >Max tip
                    <div class="moreInfo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="info"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      </p>
                    </div>
                  </span>
                  <span>Estimated 3 Gwei</span>
                </div>
                <div class="inp">
                  <input type="text" />
                  <span>Gwei</span>
                </div>
              </label>
              <label for="">
                <div class="lbl-txt">
                  <span
                    >Max price
                    <div class="moreInfo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="info"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      </p>
                    </div>
                  </span>
                  <span>Estimated 115 Gwei </span>
                </div>
                <div class="inp">
                  <input type="text" />
                  <span>Gwei</span>
                </div>
              </label>
            </form>
            <ul class="tbld">
              <li><span>Fee range</span> <span>-- / --</span></li>
              <li><span>Wait time</span> <span>-- / --</span></li>
              <li><span>Base fee</span> <span>83.00 Gwei</span></li>
            </ul>
          </div>
        </div>

        <div class="settingList slippages">
          <div class="settingTitle">
            <img
              src="https://app.1inch.io/assets/images/icons/activate-eip-1559.svg"
              alt=""
            />
            Slippage tolerance
            <div class="moreInfo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="info"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                  fill="currentColor"
                ></path>
              </svg>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div class="settingRightOps">
            <span class="rightDf">1% <span class="arrow"></span></span>
          </div>
        </div>
        <div class="hiddenCnt">
          <ul>
            <li class="active"><span>0.1%</span></li>
            <li><span>0.5%</span></li>
            <li><span>1%</span></li>
            <li><span>3%</span></li>
            <li><input type="text" placeholder="Custom" /></li>
          </ul>
        </div>

        <div class="settingList">
          <div class="settingTitle">
            <img
              src="https://app.1inch.io/assets/images/icons/activate-eip-1559.svg"
              alt=""
            />
            Activate EIP-1559 gas price
            <div class="moreInfo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="info"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                  fill="currentColor"
                ></path>
              </svg>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div class="settingRightOps">
            <div>
              65 <span class="rightDf"><span class="arrow"></span></span>
            </div>
          </div>
        </div>
        <div class="settingList">
          <div class="settingTitle">
            <img
              src="https://app.1inch.io/assets/images/icons/activate-eip-1559.svg"
              alt=""
            />
            Activate EIP-1559 gas price
            <div class="moreInfo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="info"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.66699 5.33317C8.66699 5.70136 8.36852 5.99984 8.00033 5.99984C7.63214 5.99984 7.33366 5.70136 7.33366 5.33317C7.33366 4.96498 7.63214 4.6665 8.00033 4.6665C8.36852 4.6665 8.66699 4.96498 8.66699 5.33317ZM8.66699 10.6665C8.66699 11.0347 8.36852 11.3332 8.00033 11.3332C7.63214 11.3332 7.33366 11.0347 7.33366 10.6665L7.33366 7.99984C7.33366 7.63165 7.63214 7.33317 8.00033 7.33317C8.36852 7.33317 8.66699 7.63165 8.66699 7.99984L8.66699 10.6665ZM8.00699 14.6665C11.687 14.6665 14.667 11.6798 14.667 7.99984C14.667 4.31984 11.687 1.33317 8.00699 1.33317C4.32033 1.33317 1.33366 4.31984 1.33366 7.99984C1.33366 11.6798 4.32033 14.6665 8.00699 14.6665ZM8.00033 2.6665C10.947 2.6665 13.3337 5.05317 13.3337 7.99984C13.3337 10.9465 10.947 13.3332 8.00033 13.3332C5.05366 13.3332 2.66699 10.9465 2.66699 7.99984C2.66699 5.05317 5.05366 2.6665 8.00033 2.6665Z"
                  fill="currentColor"
                ></path>
              </svg>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div class="settingRightOps">
            <div>
              0 <span class="rightDf"><span class="arrow"></span></span>
            </div>
          </div>
        </div>
      </div>
      <!-- SETTING  end ------ -->
    </div>

    <!-- ETH popup -->
    <div class="popup limit">
      <div class="popup-content">
        <h5>Switch to Сlassic mode <span class="limitBtn">✕</span></h5>

        <svg
          width="96"
          height="80"
          viewBox="0 0 96 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.4125 33.9585C18.2756 18.7731 31.7399 7.26562 47.9303 7.26562C61.1304 7.26562 72.5214 14.9155 77.8291 25.9753C78.068 26.4732 78.6654 26.6832 79.1633 26.4442C79.6612 26.2053 79.8711 25.6079 79.6322 25.11C74.0006 13.3753 61.9201 5.26562 47.9303 5.26562C30.9394 5.26562 16.7605 17.2288 13.5373 33.127L6.86619 21.5723C6.59005 21.094 5.97846 20.9301 5.50017 21.2062C5.02187 21.4824 4.858 22.094 5.13414 22.5723L13.1341 36.4287L13.6341 37.2947L14.5002 36.7947L28.3566 28.7947C28.8349 28.5186 28.9987 27.907 28.7226 27.4287C28.4465 26.9504 27.8349 26.7865 27.3566 27.0626L15.4125 33.9585ZM80.6375 44.9316L68.5015 51.9383C68.0232 52.2145 67.4116 52.0506 67.1355 51.5723C66.8593 51.094 67.0232 50.4824 67.5015 50.2063L81.3579 42.2063L82.2239 41.7063L82.7239 42.5723L90.7239 56.4287C91.0001 56.907 90.8362 57.5186 90.3579 57.7947C89.8796 58.0709 89.268 57.907 88.9919 57.4287L82.4663 46.1261C79.5424 62.3954 65.1866 74.7352 47.9303 74.7352C33.9405 74.7352 21.86 66.6256 16.2285 54.8909C15.9895 54.3929 16.1994 53.7956 16.6973 53.5566C17.1953 53.3177 17.7926 53.5276 18.0316 54.0255C23.3393 65.0854 34.7302 72.7352 47.9303 72.7352C64.5132 72.7352 78.2362 60.6631 80.6375 44.9316Z"
            fill="#2F8AF5"
          />
        </svg>

        <p>
          By clicking this button you are switching to limit orders in the
          Classic mode. You can switch back at any time.
        </p>
        <label for="ckb" class="ckb">
          Don’t show again
          <input type="checkbox" id="ckb" checked="checked" />
          <span class="checkmark"></span>
        </label>

        <button type="button" class="theme-btn">Switch to Сlassic mode</button>
      </div>
    </div>
    <!-- ETH popup -->
    <div class="popup ethPupop">
      <div class="popup-content" style="width:-webkit-fill-available">
        <h5>Routing <span class="getpoup">✕</span></h5>
        <ul>
          <li>
            <img
              src="https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
              alt=""
            />
          </li>
          <li>
            <span class="arrow"></span>
            <div class="rtBlk">
              <h5>
                <img
                  src="https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
                  alt=""
                />
                USDT
              </h5>
              <p style="width: fit-content">
                <a href="#">Sushiswap</a><span>100%</span>
              </p>
            </div>
            <span class="arrow"></span>
          </li>
          <li>
            <img
              src="https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
              alt=""
            />
          </li>
        </ul>
      </div>
    </div>
    <q-dialog
      v-model="dialog"
      persistent
      style="width:400px"
      class="q-pa-md"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        class="mobile-card text-black"
        :style="
          $store.state.settings.lightMode !== 'true'
            ? 'background: white !important'
            : ''
        "
      >
        <q-toolbar
          class="q-pa-md"
          :class="
            $store.state.settings.lightMode === 'true'
              ? 'text-white mobile-card'
              : 'bg-white text-black'
          "
        >
          <q-btn
            v-if="$q.platform.is.mobile"
            flat
            round
            dense
            icon="arrow_back_ios"
            class="q-mr-sm"
            @click="dialog = false"
          />
          <q-toolbar-title> Exchange any to any. </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            @click="dialog = false"
          />
        </q-toolbar>
        <q-card-section class="q-px-md">
          <q-splitter
            v-model="splitterModel"
            class="full-width "
            :class="[swapData.dex + '-dex', 'full-width']"
            v-if="step == 1"
            :style="
              $store.state.settings.lightMode === 'true'
                ? 'height: 70vh;'
                : 'background-color: white !important; height: 70vh;'
            "
          >
            <template v-slot:before>
              <q-tabs
                dark
                v-model="tabLocal"
                @input="setLocalTab()"
                align="left"
                vertical
                class="q-tab-wrapper text-teal"
                v-if="swapData.dex !== 'renbridge'"
              >
                <q-tab
                  name="deposit"
                  label="Deposit"
                  class="flex_start"
                  no-caps
                  align="left"
                  v-if="swapData.fromChains.length != 1"
                />
                <q-tab
                  no-caps
                  class="flex_start"
                  name="destination"
                  label="Destination"
                />
                <q-tab
                  no-caps
                  class="flex_start"
                  name="tosend"
                  label="Sending"
                />

                <q-tab
                  no-caps
                  name="waiting"
                  class="waiting_tab flex_start"
                  :icon="
                    tabLocal == 'waiting'
                      ? 'img:https://i.stack.imgur.com/qq8AE.gif'
                      : ''
                  "
                  label="Waiting"
                />
                <q-tab
                  no-caps
                  :class="{
                    'text-black': $store.state.settings.lightMode === 'false'
                  }"
                  name="reset"
                  class="flex_start"
                  dark
                  @click="
                    $emit('update:step', 0);
                    dialog = false;
                  "
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
                v-model="tabLocal"
                animated
                swipeable
                vertical
                :dark="$store.state.settings.lightMode === 'true'"
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel
                  name="deposit"
                  style="padding: 10px;"
                  :class="
                    $store.state.settings.lightMode === 'true'
                      ? 'mobile-card'
                      : ''
                  "
                >
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
                      <div v-if="false">
                        Select {{ swapData.fromChosenChain.toUpperCase() }}
                        {{
                          swapData.fromChosenChain == "eos"
                            ? "account"
                            : "address"
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
                          v-model="
                            fromAccountSelected[swapData.fromChosenChain]
                          "
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
                                :dark="
                                  $store.state.settings.lightMode === 'true'
                                "
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
                                fromAccountSelected[swapData.fromChosenChain]
                                  .icon
                            "
                            v-slot:selected
                          >
                            <q-item>
                              <q-item-section avatar>
                                <q-icon
                                  class="option--avatar"
                                  :name="
                                    `img:${
                                      fromAccountSelected[
                                        swapData.fromChosenChain
                                      ].icon
                                    }`
                                  "
                                />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label
                                  v-html="
                                    fromAccountSelected[
                                      swapData.fromChosenChain
                                    ].name
                                  "
                                />
                                <q-item-label
                                  caption
                                  class="ellipsis mw200"
                                  :class="{
                                    'text-white':
                                      $store.state.settings.lightMode === 'true'
                                  }"
                                  >{{
                                    getKeyFormat(
                                      fromAccountSelected[
                                        swapData.fromChosenChain
                                      ].key
                                    )
                                  }}</q-item-label
                                >
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
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
                        >Minting successful. You have received renBTC. Now you
                        can process the swap<br
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
                                o => o.chain === swapData.fromChosenChain
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
                          method: 'txObject'
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
                          method: 'txObject'
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
                            swapData.transferObject &&
                              swapData.transferObject.hash
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
                        found. Import this wallet and start using it inside
                        Verto. If you decide to continue with this exchange
                        without having your wallet in Verto, you will need an
                        external wallet to make the deposit
                      </p>

                      <div
                        v-else-if="
                          chainData &&
                            !$store.state.settings.chainsSendEnabled.includes(
                              swapData.fromChosenChain.toLowerCase()
                            )
                        "
                      >
                        Verto will support asset transfer for this chain Very
                        soon. You will need an external wallet to make the
                        deposit to finalize this exchange
                      </div>
                    </div>
                    <div v-else-if="swapData.fromChosenChain">
                      Verto will support this chain very soon. You will need an
                      external wallet to make the deposit to finalize this
                      exchange
                    </div>
                    <p v-if="swapData.error" class="text-red">
                      {{ swapData.error }}
                    </p>
                    <q-btn
                      outline
                      :loading="spinner.tx"
                      rounded
                      @click="processApproval()"
                      class="theme-btn"
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
                      class="theme-btn"
                      @click="swapTokens()"
                      v-else-if="
                        swapData.approvalCheck &&
                          swapData.approval &&
                          (swapData.approval.status == 'Success' ||
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
                        active-class="text-orange text-center"
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
                                  swapData.approval.status == 'Success'
                              }"
                              >{{
                                swapData.approval.status
                                  ? swapData.approval.status
                                  : "To be sent"
                              }}</span
                            ></q-item-label
                          >
                          <q-item-label
                            v-if="swapData.approval && swapData.approval.hash"
                            >{{
                              getKeyFormat(swapData.approval.hash)
                            }}</q-item-label
                          >
                        </q-item-section>
                        <q-item-section side></q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-ripple
                        v-if="swapData.transferObject"
                        active-class="bg-teal-1 text-grey-8"
                      >
                        <q-item-section
                          class="text-center flex flex-center"
                          avatar
                        >
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
                                  swapData.transferObject.status == 'Success'
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
                          <q-item-label
                            v-if="
                              swapData.transferObject &&
                                swapData.transferObject.hash
                            "
                            >{{
                              getKeyFormat(swapData.transferObject.hash)
                            }}</q-item-label
                          >
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
                      @click="$emit('update:tab', 'destination')"
                      rounded
                      class="q-mt-sm"
                    />
                  </q-list>
                </q-tab-panel>
                <q-tab-panel
                  name="destination"
                  class="q-pa-md"
                  :class="
                    $store.state.settings.lightMode === 'true'
                      ? 'mobile-card'
                      : ''
                  "
                >
                  <q-item-label v-if="swapData.toChains.length > 1" header
                    >Choose a network to receive your coins</q-item-label
                  >
                  <q-list separator>
                    <q-item
                      v-for="chain in swapData.toChains"
                      :key="chain"
                      :dark="$store.state.settings.lightMode === 'true'"
                    >
                      <q-item-section
                        v-if="swapData.toChains.length != 1"
                        side
                        top
                      >
                        <q-radio
                          v-model="swapData.toChosenChain"
                          :val="chain"
                          label=""
                        />
                      </q-item-section>

                      <q-item-section style="padding: 10px;">
                        <q-item-label
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
                              chains.find(o => o.chain == chain) &&
                                chains.find(o => o.chain == chain).accounts
                                  .length
                            "
                          >
                            Select {{ chain.toUpperCase() }}
                            {{ chain == "eos" ? "account" : "address" }} to
                            receive
                            {{ swapData.toAmount }}
                            {{ destinationCoin.value.toUpperCase() }}

                            <q-select
                              :dark="$store.state.settings.lightMode === 'true'"
                              :light="
                                $store.state.settings.lightMode === 'false'
                              "
                              separator
                              rounded
                              outlined
                              style="max-width: 300px; margin-bottom:10px;"
                              class="select-input accountDropdown q-my-md"
                              @input="
                                swapData.toDestinationAddresses[
                                  chain
                                ] = toAccountSelected[chain]
                                  ? chain == 'eos'
                                    ? toAccountSelected[chain].name
                                    : toAccountSelected[chain].key
                                  : {}
                              "
                              v-model="toAccountSelected[chain]"
                              :options="
                                chains.find(o => o.chain == chain).accounts
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
                                    <q-item-label
                                      caption
                                      class="ellipsis mw200"
                                      >{{
                                        scope.opt[
                                          chain == "eos" ? "key" : "value"
                                        ].substring(0, 10) + "..."
                                      }}</q-item-label
                                    >
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
                                      :name="
                                        `img:${toAccountSelected[chain].icon}`
                                      "
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
                                          'true'
                                      }"
                                      >{{
                                        getKeyFormat(
                                          toAccountSelected[chain].key
                                        )
                                      }}</q-item-label
                                    >
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>

                            <GasSelector
                              v-if="
                                swapData.dex == 'renbridge' &&
                                  !swapData.order_id
                              "
                              @setGas="setSelectedGas"
                              :currentAccount="
                                $store.state.wallets.tokens.find(
                                  o => o.chain === swapData.toChosenChain
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
                                  ' network'
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
                              Each transaction to this deposit address takes
                              about about 60 minutes to complete. For security
                              reasons, you will need to wait for 6 block
                              confirmations
                            </p>
                            <div
                              v-if="
                                swapData.dex == 'renbridge' && swapData.status
                              "
                            >
                              <span
                                class="text-grey cursor-pointer"
                                v-if="swapData.hash"
                                >Tx Hash:
                                {{ getKeyFormat(swapData.hash) }}</span
                              ><br />

                              <p
                                v-if="
                                  exchangeDetails[swapData.order_id] &&
                                    exchangeDetails[swapData.order_id]
                                      .bridgeStatus
                                "
                              >
                                {{
                                  exchangeDetails[swapData.order_id]
                                    .bridgeStatus.msg
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
                                swapData.dex == 'renbridge' &&
                                  swapData.mint.status
                              "
                            >
                              <span
                                class="text-deep-purple-12"
                                v-if="
                                  swapData.mint &&
                                    swapData.mint.status == 'Submitted'
                                "
                              >
                                <q-spinner-dots
                                  v-if="spinner.amount"
                                  size="2em"
                                />
                                Minting process started. Please wait... </span
                              ><br />
                              <span
                                class="text-green"
                                v-if="
                                  swapData.mint &&
                                    swapData.mint.status == 'Submitted'
                                "
                                >Approval successful. Click confirm to
                                swap</span
                              ><br />
                              <span
                                class="text-green"
                                v-if="
                                  swapData.mint &&
                                    swapData.mint.status == 'Success'
                                "
                                >Minting successful. You have received renBTC.
                                Now you can process the swap</span
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
                              {{ destinationCoin.value.toUpperCase() }}). You
                              might need to convert manually the received
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
                              !(
                                swapData.dex == 'renbridge' && swapData.order_id
                              )
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
                            period/session/time frame, you risk losing the
                            deposits
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>
                <q-tab-panel
                  name="tosend"
                  style="max-width: 500px; padding: 10px;"
                  v-if="exchangeDetails[swapData.order_id]"
                  :class="
                    $store.state.settings.lightMode === 'true'
                      ? 'mobile-card'
                      : ''
                  "
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
                          )
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
                  style="max-width: 500px; padding: 10px;"
                  v-if="exchangeDetails[swapData.order_id]"
                  class="q-pa-md"
                  :class="
                    $store.state.settings.lightMode === 'true'
                      ? 'mobile-card'
                      : ''
                  "
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
                          )
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
                    The exchange will start automatically when the deposit
                    arrives to the address specified below
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
function CashSelect () {
  try {
    let cashBlk = document.querySelectorAll('.cash-blk')
    cashBlk.forEach(blk => {
      blk.addEventListener('click', e => {
        cashBlk.forEach(rmblk => {
          rmblk.classList.remove('active')
        })
        e.target.classList.add('active')
      })
    })
  } catch (e) {}
}

// coin popups
function CoinPopups () {
  try {
    let btns = document.querySelectorAll('.drpn span')
    let slBtn = document.querySelectorAll('.backfromtoken')
    let popup = document.querySelector('.searchBlk')
    let mdiv = document.querySelector('.mainBlk')

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        popup.classList.add('active')
        mdiv.classList.remove('active')
      })
    })
    slBtn.forEach(slB => {
      slB.addEventListener('click', () => {
        popup.classList.remove('active')
        mdiv.classList.add('active')
      })
    })
  } catch (e) {}
}

// Setting custom accordion
function Accourdions () {
  try {
    let gsBd = document.querySelector('.gasPrice')
    let gsBlk = document.querySelector('.gasPriceContent')

    let slipage = document.querySelector('.settingList.slippages')
    let slpCnt = document.querySelector('.hiddenCnt')

    gsBd.addEventListener('click', () => {
      gsBd.classList.toggle('active')
      gsBlk.classList.toggle('active')
    })

    slipage.addEventListener('click', () => {
      slipage.classList.toggle('active')
      slpCnt.classList.toggle('active')
    })
  } catch (e) {}
}

// Setting customTab
function settingCustomTab () {
  try {
    let tabBasic = document.querySelector('.gasPriceContent .mn li.basick')
    let tabAdvanced = document.querySelector(
      '.gasPriceContent .mn li.advanced'
    )
    let contentBasic = document.querySelector('.allContents')
    let contentAdvanced = document.querySelector('.advancedSets')

    tabBasic.addEventListener('click', () => {
      tabAdvanced.classList.remove('active')
      contentAdvanced.classList.remove('active')

      tabBasic.classList.add('active')
      contentBasic.classList.add('active')
    })

    tabAdvanced.addEventListener('click', () => {
      tabBasic.classList.remove('active')
      contentBasic.classList.remove('active')

      tabAdvanced.classList.add('active')
      contentAdvanced.classList.add('active')
    })
  } catch (e) {}
}

// GotoSetting
function GoToSettingPage () {
  try {
    let mainBLk = document.querySelector('.mainBlk')
    let settingBtn = document.querySelector('.settingBtn')
    let BackfromSetting = document.querySelector('.backfromsetting')
    let settingBlk = document.querySelector('.settings')

    settingBtn.addEventListener('click', () => {
      mainBLk.classList.remove('active')
      settingBlk.classList.add('active')
    })

    BackfromSetting.addEventListener('click', () => {
      settingBlk.classList.remove('active')
      mainBLk.classList.add('active')
    })
  } catch (e) {}
}

//  PopUp
function PopUp () {
  try {
    let popup = document.body || document.documentElement
    // Limit popup
    let limitBtn = document.querySelectorAll('.limitBtn')
    limitBtn.forEach(pbt => {
      pbt.addEventListener('click', () => {
        popup.classList.toggle('active_limit_popup')
      })
    })
    // Eth popup
    let button = document.querySelectorAll('.getpoup')
    button.forEach(pbt => {
      pbt.addEventListener('click', () => {
        popup.classList.toggle('active_eth_popup')
      })
    })
  } catch (e) {}
}

// Change theme
function ChangeTheme () {
  try {
    let switchs = document.querySelector('.switch input')
    switchs.addEventListener('change', e => {
      if (window.localStorage.getItem('skin') === 'true') {
        localStorage.setItem('theme', 'dark')
        fnccc()
      } else {
        localStorage.setItem('theme', 'light')
        fnccc()
      }
    })
  } catch (e) {}
}
function UpdateTheme (status) {
  if (status) {
    localStorage.setItem('theme', 'light')
    fnccc()
  } else {
    localStorage.setItem('theme', 'dark')
    fnccc()
  }
}

function fnccc () {
  var rootCss = document.querySelector(':root')
  if (localStorage.getItem('theme')) {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      rootCss.style.setProperty('--bodyBackground', '#06070a')
      rootCss.style.setProperty('--bodyColor', '#6c86ad')
      rootCss.style.setProperty('--bodyColorUp', '#6c86ad26')
      rootCss.style.setProperty('--whiteColor', '#fff')
      rootCss.style.setProperty('--blackColor', '#06070a')
      rootCss.style.setProperty('--blueColor', '#2f8af5')
      rootCss.style.setProperty('--greenColor', '#00897B')
      rootCss.style.setProperty('--backgroundColor', '#04111f') // #131823
      rootCss.style.setProperty('--borderColor', '#202835')

      document.body.classList.remove('lighTheme')
    } else if (theme === 'light') {
      document.body.classList.add('lighTheme')
      rootCss.style.setProperty('--bodyBackground', '#f3f5fa')
      rootCss.style.setProperty('--bodyColorUp', '#6c86ad26')
      rootCss.style.setProperty('--whiteColor', '#fff')
      rootCss.style.setProperty('--blackColor', '#06070a')
      rootCss.style.setProperty('--blueColor', '#2f8af5')
      rootCss.style.setProperty('--greenColor', '#00897B')
      rootCss.style.setProperty('--backgroundColor', '#fff')
      rootCss.style.setProperty('--borderColor', '#cadaf480')
    }
  }
}

import SendComponent from '@/pages/Verto/Send'
import GasSelector from '../../Verto/ETH/GasSelector.vue'
import CrosschainDex from '@/util/CrosschainDex'
import Farms from '@/util/Farms'
import Lib from '@/util/walletlib'
import AccountSelector from '../../Verto/Exchange/AccountSelector.vue'
import Formatter from '@/mixins/Formatter'

export default {
  mixins: [Formatter],
  name: 'GodexDialogMobile',
  props: [
    'step',
    'setMinimum',
    'isPathInvalid',
    'getSwapInfo',
    'hideDeposit',
    'filterDepositCoin',
    'swapData',
    'spinner',
    'setPathTransaction',
    'paths',
    'getDepositTxData',
    'sendTo',
    'memo',
    'isTxValid',
    'triggerAction',
    'goToExchange',
    'spinnerVisible',
    'filterDestinationCoin',
    'setSuccessData',
    'currentDex',
    'hideDestination',
    'createTransaction',
    'error',
    'path',
    'splitterModel',
    'tab',
    'setPathData',
    'innerStep',
    'chainData',
    'approvalCheckRun',
    'fromAccountSelected',
    'setSelectedGas',
    'processApproval',
    'swapTokens',
    'toAccountSelected',
    'setTransactionStatus',
    'setTab',
    'exchangeDetails',
    'showSendComponent',
    'validStatus'
  ],
  components: { GasSelector, SendComponent, AccountSelector },
  data () {
    return {
      txHash: null,
      txExplorerLink: null,
      txError: null,
      loadingState: false,
      depositCoinOptions: [],
      reviewStep: false,
      depositCoin: null,
      networksDir: 'same',
      currentAccount: {
        from: {
          chain: 'eth',
          key: '',
          name: ''
        },
        to: {
          chain: 'eth',
          key: '',
          name: ''
        }
      },
      listOptions: {
        deposit: {
          title: 'Select deposit token'
        },
        destination: {
          title: 'Select destination token'
        },
        chains: {
          title: 'Select network'
        },
        accounts: {
          title: 'Select an account'
        }
      },
      chains: [],
      currentPath: {
        fromChain: null,
        toChain: null
      },
      apySelector: '365',
      fromSelected: null,
      currentPathData: null,
      destinationCoin: null,
      destinationCoinOptions: [],
      depositCoinUnfilter: [],
      destinationCoinUnfilter: [],
      maximizedToggle: false,
      open: false,
      tabIndex: 'assets',
      action: 'deposit',
      previousTab: '',
      dialog: false,
      text: '',
      ph: '',
      dense: false,
      depositCoinLocal: {},
      swapDataFromAmountLocal: 1,
      search: '',
      showSetting: false,
      toSelect: 'deposit',
      tabLocal: 'deposit',
      showHeader: true,
      experienceData: null
    }
  },
  created () {
    this.chains = this.setChains()
    this.currentPath.fromChain = this.chains.find(
      o =>
        o.chain ===
        (this.$route.params.asset ? this.$route.params.asset.chain : 'eth')
    )

    this.setTokens(this.currentPath.fromChain.chain)
    this.currentPath.toChain = this.currentPath.fromChain
    this.currentAccount.from = this.$store.state.investment.defaultAccount
    this.currentAccount.to = this.$store.state.investment.defaultAccount
  },
  async mounted () {
    this.depositCoinLocal = this.depositCoin

    CashSelect()
    PopUp()
    CoinPopups()
    Accourdions()
    settingCustomTab()
    GoToSettingPage()
    ChangeTheme()
    UpdateTheme(this.$store.state.settings.lightMode !== 'true')

    setTimeout(() => {
      UpdateTheme(this.$store.state.settings.lightMode !== 'true')
    }, 400)
    this.getExperienceData()
    this.tabLocal = this.tab
  },
  watch: {
    '$store.state.settings.lightMode': function (val) {
      if (val === 'true') {
        UpdateTheme()
      } else {
        UpdateTheme(true)
      }
    },
    async paths () {
      this.txError = false
      if (this.paths.length) {
        this.$set(this, 'currentPathData', this.paths[0])

        if (!this.currentPathData.toUsd) {
          let usd = await Lib.getCoinGeckoPrice({
            address: this.destinationCoin.address,
            chain: this.currentPath.toChain,
            type: this.destinationCoin.value.toLowerCase()
          })

          if (usd) {
            this.$set(this.currentPathData, 'toUsd', usd)
            this.$set(
              this.currentPathData,
              'toUsdTotal',
              usd * this.currentPathData.toAmount
            )
          }
        }

        if (!this.currentPathData.fromUsd) {
          let usd = await Lib.getCoinGeckoPrice({
            address: this.depositCoin.address,
            chain: this.currentPath.toChain,
            type: this.depositCoin.value.toLowerCase()
          })

          if (usd) {
            this.$set(this.currentPathData, 'fromUsd', usd)
            this.$set(
              this.currentPathData,
              'fromUsdTotal',
              usd * this.currentPathData.fromAmount
            )
          }
        }
      } else {
        this.currentPathData = null
      }
    },
    '$store.state.investment.defaultAccount': function (val) {
      if (val) {
        if (this.networksDir === 'same') {
          this.setTokens(val.chain, val.chain)
        } else {
          this.setTokens(val.chain)
        }
      }
    },
    tab: function () {
      this.tabLocal = this.tab
    },
    depositCoin (val) {
      if (!val) return
      this.currentPathData = null
      let token = this.$store.state.wallets.tokens.find(
        o =>
          o.chain === this.currentAccount.from.chain &&
          o[this.currentAccount.from.chain === 'eos' ? 'name' : 'key'].toLowerCase() ===
            this.currentAccount.from[this.currentAccount.from.chain === 'eos' ? 'name' : 'key'].toLowerCase() &&
          o.type === this.depositCoin.value.toLowerCase()
      )
      if (token) {
        this.depositCoin.usd = token.usd
        this.depositCoin.amount = token.amount
        this.depositCoin.tokenPrice = token.tokenPrice
      }
    },
    destinationCoin (val) {
      if (!val) return
      this.currentPathData = null
      let token = this.$store.state.wallets.tokens.find(
        o =>
          o.chain === this.currentAccount.to.chain &&
          o[this.currentAccount.to.chain === 'eos' ? 'name' : 'key'].toLowerCase() ===
            this.currentAccount.to[this.currentAccount.to.chain === 'eos' ? 'name' : 'key'].toLowerCase() &&
          o.type === this.destinationCoin.value.toLowerCase()
      )
      if (token) {
        this.destinationCoin.usd = token.usd
        this.destinationCoin.amount = token.amount
        this.destinationCoin.tokenPrice = token.tokenPrice
      }
    }
  },
  computed: {
    experience () {
      let titles = {
        deposit_ust: 'Depoit UST in Anchor Protocol'
      }
      let type = !this.$route.params.experience
        ? 'exchange'
        : this.$route.params.experience

      let data = {
        type: type,
        isCrosschain: type === 'exchange',
        disableFromTokenSelector: type !== 'exchange',
        title: titles[type]
      }
      return data
    },
    tabData () {
      let data = {}
      if (
        this.experience.type === 'exchange'
      ) {
        data.icon = this.$store.state.investment.defaultAccount.icon
        data.label = this.getChainLabel(
          this.$store.state.investment.defaultAccount.chain
        )
      } else if (this.experience.type === 'deposit_ust') {
        data.icon = 'https://www.anchorprotocol.com/logo.png'
        data.label = 'Anchor protocol'
      }
      return data
    },
    isApproval () {
      return (
        this.currentPathData &&
        this.currentPathData.approval &&
        this.currentPathData.approval.required
      )
    }
  },
  methods: {
    loadAfterExperience () {
      if (!this.$route.params.after_experience || this.$route.params.after_experience.type === 'deposit_ust') {
        this.$route.params.experience = 'deposit_ust' // this.$route.params.after_experience.type
        this.$route.params.action = 'sell'
        this.$route.params.asset = {
          type: 'ust',
          chain: 'terra'
        }
        this.setTokens('terra')
        this.getExperienceData()
      }
    },
    async getExperienceData () {
      if (this.experience.type === 'deposit_ust') {
        let data = {
          balance: '0 UST',
          price: 0,
          amount: 0
        }

        let balances = await Lib.getCw20TokensBalance(['terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu'], this.$store.state.investment.defaultAccount.key)
        if (balances) {
          let price = await Lib.getUstState() || 0
          data.price = this.formatNumber(price, 3)
          data.amount = balances['terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu']
          data.ustValue = data.amount * price
          data.balance = this.nFormatter2(data.amount * price, 3) + ' UST'
          console.log(data, 'data', balances)
        }

        this.experienceData = data
      }
    },
    getTransactionData () {
      let data = this.currentPathData || {}
      if (this.experience.type === 'deposit_ust') {
        data.fromChain = 'terra'
        data.fromToken = 'ust'
        let value = this.action === 'withdraw' ? this.swapData.fromAmount / this.experienceData.price : this.swapData.fromAmount
        data.txParams = Farms.getUstTerraDepositData(value, this.action)
      }
      return data
    },
    pushTransaction () {
      let txData = this.getTransactionData(this.currentPathData)
      if (txData) {
        console.log(txData, 'txData')
        // return
      }
      this.loadingState = true
      Lib.send(
        txData.fromChain,
        txData.fromToken,
        this.$store.state.investment.defaultAccount.chain !== 'eos'
          ? this.$store.state.investment.defaultAccount.key
          : this.$store.state.investment.defaultAccount.name,
        txData.txParams && txData.txParams.to
          ? txData.txParams.to
          : null,
        0,
        {
          gasData: txData.txParams,
          txData: txData.txParams
        }
      )
        .then(result => {
          if (result.success) {
            this.txHash = result.transaction_id
            this.txExplorerLink = result.message
            setTimeout(() => {
              this.getExperienceData()
            }, 500)
          } else if (result.message) {
            this.txError = result.message
          } else {
            this.txError = 'Transaction failed'
          }
          this.loadingState = false
        })
        .catch(error => {
          console.log(error)
          if (typeof error === 'object' && error.message) {
            this.txError = error.message
          } else {
            this.txError = 'Transaction failed'
          }

          setTimeout(() => {
            this.reviewStep = false
          }, 3000)
          this.loadingState = false
        })
    },
    async setTokens (fromChain = 'eth', toChain = null) {
      if (fromChain) {
        console.log(fromChain, 'fromChain')
        if (!toChain) toChain = fromChain
        this.depositCoinOptions = await CrosschainDex.getCoinByChain(fromChain)
        this.depositCoinUnfilter = this.depositCoinOptions = (this.depositCoinOptions || [])
          .map(o => {
            let token = this.$store.state.investment.accountTokens.find(
              t => t.type.toLowerCase() === o.value.toLowerCase()
            )
            if (token) {
              o.usd = token.usd
              o.amount = token.amount
              o.tokenPrice = token.tokenPrice
            } else {
              o.usd = 0
            }
            return o
          })
          .sort((a, b) => b.usd - a.usd)
        this.depositCoin =
          this.$route.params.action === 'sell' &&
          this.$route.params.asset.chain === fromChain
            ? this.depositCoinOptions.find(
              o =>
                o.value.toLowerCase() ===
                  this.$route.params.asset.type.toLowerCase()
            )
            : this.$route.params.action === 'buy'
              ? this.depositCoinOptions.find(
                o =>
                  o.value.toLowerCase() !==
                  this.$route.params.asset.type.toLowerCase()
              )
              : this.depositCoinOptions[0]
        this.$emit('update:depositCoin', this.depositCoin)
      }
      if (toChain === fromChain) {
        this.destinationCoinOptions = this.depositCoinOptions
        this.destinationCoinUnfilter = this.depositCoinOptions
      } else if (toChain) {
        this.destinationCoinOptions = this.destinationCoinUnfilter = (
          await CrosschainDex.getCoinByChain(toChain)
        )
          .map(o => {
            let token = this.$store.state.investment.accountTokens.find(
              t => t.type.toLowerCase() === o.value.toLowerCase()
            )
            if (token) {
              o.usd = token.usd
              o.amount = token.amount
              o.tokenPrice = token.tokenPrice
            } else {
              o.usd = 0
            }
            return o
          })
          .sort((a, b) => b.usd - a.usd)
      }

      if (toChain) {
        this.destinationCoin =
          this.$route.params.action === 'buy' &&
          this.$route.params.asset.chain === toChain
            ? this.destinationCoinOptions.find(
              o =>
                o.value.toLowerCase() ===
                  this.$route.params.asset.type.toLowerCase()
            )
            : toChain === fromChain
              ? this.destinationCoinOptions.find(
                o => o.value !== this.depositCoin.value
              )
              : this.destinationCoinOptions[0]
        this.$emit('update:destinationCoin', this.destinationCoin)
      }
      this.inputChanged()
    },
    inputChanged () {
      if (this.experience.type === 'exchange') {
        this.getSwapInfo()
      }
    },
    changeDepositCoin () {
      this.$emit('update:depositCoin', this.depositCoinLocal)
    },
    switchAmounts () {
      let depositCoinVar = this.depositCoin
      this.depositCoin = this.destinationCoin
      this.destinationCoin = depositCoinVar
      this.$emit('update:depositCoin', this.depositCoin)
      this.$emit('update:destinationCoin', this.destinationCoin)
      this.getSwapInfo()
    },
    closeDialog () {
      this.dialog = false
      //   this.$emit('update:dialog', false)
      this.$router.push({ name: 'dashboard', params: { tab: 'assets' } })
    },
    filterDepositCoinLocal () {
      const needle = this.search.toLowerCase()
      let options = this.depositCoinUnfilter.filter(
        v =>
          v.value.toLowerCase().indexOf(needle) > -1 ||
          v.label.toLowerCase().indexOf(needle) > -1
      )
      this.$emit('update:depositCoinOptions', options)
    },
    filterDestinationCoinLocal () {
      const needle = this.search.toLowerCase()
      let options = this.destinationCoinUnfilter.filter(
        v =>
          v.value.toLowerCase().indexOf(needle) > -1 ||
          v.label.toLowerCase().indexOf(needle) > -1
      )
      this.$emit('update:destinationCoinOptions', options)
    },
    async selectionProcess (item) {
      if (this.toSelect === 'deposit') {
        this.depositCoin = item
        this.$emit('update:hideDeposit', false)
        this.$emit('update:depositCoin', item)
        this.getSwapInfo()
        this.back()
        this.setMinimum()
      } else if (this.toSelect === 'destination') {
        this.destinationCoin = item
        this.$emit('update:hideDestination', false)
        this.$emit('update:destinationCoin', item)
        this.getSwapInfo()
        this.back()
      } else if (this.toSelect === 'chains') {
        if (item.accounts.length > 1) {
          this.currentPath[this.fromSelected ? 'fromChain' : 'toChain'] = item
          if (
            this.fromSelected ||
            this.currentPath.fromChain.chain !== this.currentPath.toChain.chain
          ) {
            this.toSelect = 'accounts'
          }
        } else {
          this.currentPath[this.fromSelected ? 'fromChain' : 'toChain'] = item
          this.currentAccount[this.fromSelected ? 'from' : 'to'] =
            item.accounts[0]
          await this.fetchTokens(item.chain)
          this.back()
        }
      } else if (this.toSelect === 'accounts') {
        this.currentAccount[this.fromSelected ? 'from' : 'to'] = item
        this.fetchTokens(item.chain)
        this.back()
      }
    },
    async fetchTokens (chain) {
      if (this.fromSelected) {
        await this.setTokens(chain, null)
      } else {
        await this.setTokens(null, chain)
      }
    },
    back () {
      this.showHeader = true
      let popup = document.querySelector('.searchBlk')
      let mdiv = document.querySelector('.mainBlk')
      popup.classList.remove('active')
      mdiv.classList.add('active')
    },
    openWallet (path = false) {
      this.dialog = true
      if (path) {
        this.setPathTransaction(path)
      } else {
        this.setPathTransaction(
          this.paths.find(
            o => o.fromToken === this.depositCoin.value.toLowerCase()
          )
        )
      }
    },
    setLocalTab () {
      this.$emit('update:tab', this.tabLocal)
    },
    goBack () {
      this.$router.push('/verto/dashboard')
      // this.$router.push({ path: '/verto/dashboard' })
    }
  }
}
</script>

<style scoped>
.dark-theme .switcher {
  filter: invert(1);
}
a {
  text-decoration: none;
  padding-top: 10px !important;
  text-transform: lowercase;
}
.exchange-header {
  margin-bottom: 50px !important;
}
.q-mt-md,
.q-my-md {
  margin-top: 16px !important;
}
span.max {
  color: #7b4dff;
  margin-left: 5px;
  cursor: pointer;
}
:root {
  --bodyColor: #6c86ad;
  --bodyColorUp: #6c86ad26;
  --whiteColor: #fff;
  --blackColor: #06070a;
  --blueColor: #2f8af5;
  --greenColor: #00897b;
  --backgroundColor: #fff;
  --borderColor: #cadaf480;
  --bodyBackground: #f3f5fa;
}
</style>

<style scoped>
.q-tab-wrapper {
  padding-top: 0px;
}
.q-tab-wrapper /deep/ .q-tabs__content {
  padding-top: 20px;
  border-radius: 10px 25px 25px 10px;
}
.q-splitter--vertical > .q-splitter__panel {
  height: 100%;
  width: 22% !important;
}

@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* :root{
    --bodyColor: #6c86ad;
    --bodyColorUp: #6c86ad26;
    --whiteColor: #fff;
    --blackColor: #06070a;
    --blueColor: #2f8af5;
    --greenColor: #00897B;
    --backgroundColor: #131823;
    --borderColor: #202835;
    --bodyBackground: #06070a;
} */
body {
  display: flex;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  background: var(--bodyBackground);
  color: var(--whiteColor);
  font-size: 16px;
}
li {
  list-style: none;
}
a {
  text-decoration: underline;
  color: inherit;
}
button,
input {
  outline: none;
}
button {
  border: none;
}

h5,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}

.ckb {
  display: block;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.ckb input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 1px;
  left: 0;
  height: 16px;
  border: 2px solid #ffffffb3;
  width: 16px;
  border-radius: 3px;
}
.ckb input:checked ~ .checkmark {
  background-color: #2196f3;
  border-color: #2196f3;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.ckb input:checked ~ .checkmark:after {
  display: block;
}
.ckb .checkmark:after {
  left: 4px;
  top: 1px;
  width: 4px;
  height: 7px;
  border: solid #131823;
  border-width: 0 1px 1px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

body.lighTheme input {
  color: #000 !important;
}

.switch {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #6c86ad;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.switch .slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.switch input:checked + .slider {
  background-color: #2196f3;
}

.switch input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

.switch input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

/* Rounded sliders */
.switch .slider.round {
  border-radius: 34px;
}

.switch .slider.round:before {
  border-radius: 50%;
}

/*

Default css end

*/

.block-contents {
  width: 100%;
}
.mainBlk {
  width: 100%;
}
.middle-block {
  width: 100%;
  padding: 16px;
  background: var(--backgroundColor);
  /* border-radius: 24px; */
  box-sizing: border-box;
}

.blk-header {
  width: 100%;
  justify-content: space-between;
}
.blk-header ul {
  align-items: center;
}

.blk-header ul li {
  display: block;
  font-weight: 500;
  transition: 0.3s;
  cursor: pointer;
}

.blk-header ul:first-child li:first-child {
  margin-right: 15px;
  color: var(--whiteColor);
}

.blk-header ul:first-child li {
  color: var(--bodyColor);
}
.blk-header ul:first-child li:hover {
  color: var(--whiteColor);
}

.blk-header ul:last-child li {
  margin-left: 20px;
  display: flex;
  align-items: center;
  background: #ffffff00;
  height: 36px;
  /* width: 36px; */
  justify-content: center;
  border-radius: 12px;
  transition: 0.3s;
}

.blk-header ul:last-child li:hover {
  background: var(--bodyColorUp);
}
.fromBlk {
  background: var(--blackColor);
  margin-top: 10px;
  padding: 16px;
  border-radius: 16px;
}
.fromBlk p {
  color: var(--bodyColor);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h5.drpn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  margin: 15px 0px;
  position: relative;
}

h5.drpn span {
  display: flex;
  align-items: center;
  position: relative;
}

h5.drpn span img {
  width: 28px;
  margin-right: 10px;
}
h5.drpn input[type="text"] {
  text-align: right;
  font-size: 24px;
  width: 100%;
  color: var(--whiteColor);
  background: no-repeat;
  border: none;
  outline: none;
}
.toBlk {
  border: 1px solid var(--borderColor);
  border-radius: 16px;
  padding: 16px;
  margin-top: 15px;
  position: relative;
  padding-bottom: 5px;
  margin-bottom: 15px;
}
.toBlk p {
  display: flex;
  align-items: center;
  color: var(--bodyColor);
  justify-content: space-between;
  font-size: 13px;
  transition: 0.3s;
}
.toBlk p span {
  transition: 0.3s;
}
.toBlk p span:first-child:hover {
  color: var(--whiteColor);
}
.top_arrow_icon {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateY(-50%);
  background: #303d5a;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  z-index: 2;
}

.top_arrow_icon:hover {
  transform: translateY(-50%) rotate(180deg);
}
h5.drpn span:first-child {
  padding: 5px 10px;
  border-radius: 100px;
  padding-right: 35px;
  cursor: pointer;
  transition: 0.3s;
}
h5.drpn span:first-child:after {
  content: "";
  position: absolute;
  top: 45%;
  right: 14px;
  width: 7px;
  height: 7px;
  border: 2px solid #002d69;
  transform: translateY(-50%) rotate(45deg);
  border-top: none;
  border-left: none;
}
h5.drpn span:first-child:hover {
  background: #131823;
}
.toBlk h5.drpn span:first-child:hover {
  background: #090b10;
}
.cash-blk {
  padding: 15px 16px 16px;
  position: relative;
  font-size: 13px;
  border-radius: 8px 12px 12px;
  border: 1px solid var(--borderColor);
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.cash-blk.primari {
  margin-top: 25px;
}
.cash-blk h5 {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
  color: var(--bodyColor);
}
.cash-blk.active h5 {
  color: var(--whiteColor);
}
.cash-blk h5 b {
  font-weight: 400;
}

.cash-blk h5 b span {
  font-size: 13px;
  display: block;
  margin-top: 5px;
  color: var(--bodyColor);
}

.cash-blk.active {
  border-color: var(--blueColor);
}
.withArr {
  display: flex;
}
.withArr span.arrow {
  transform: rotate(130deg) scale(1.3);
  margin-top: 6px;
  margin-left: 10px;
}
.cash-blk.active .withArr span.arrow {
  border-color: #fff;
}
.move_top {
    margin-top:-50px;
}
.cash-blk.primari:after {
  content: "primary";
  position: absolute;
  left: -1px;
  top: -10px;
  text-transform: capitalize;
  font-size: 11px;
  background: #00897b;
  color: #fff;
  padding: 4px 10px;
  border-radius: 10px 10px 10px 0;
}
.theme-btn {
  display: block;
  width: 320px;
  font-size: 16px;
  border-radius: 12px;
  margin-top: 28px;
  padding: 16px 0;
  background: linear-gradient(45deg, #0fbce4, #0563d0, #2d88f3) !important;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.theme-btn:hover {
  background: linear-gradient(45deg, #0fbce4b8, #0563d0c7, #2d88f3c2);
}
ul.rates {
  padding: 0 0px;
  width: 100%;
  box-sizing: border-box;
}

ul.rates li {
  color: var(--bodyColor);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  line-height: 22px;
}
span.arrow {
  display: inline-block;
  width: 5px;
  height: 5px;
  border: 2px solid var(--bodyColor);
  transform: rotate(45deg);
  border-left: none;
  border-bottom: none;
  margin-right: 8px;
  margin-left: 5px;
}
ul.rates li span svg {
  display: inline-block;
  width: 18px;
  margin-left: 10px;
}
ul.rates li span .toltip svg {
  cursor: pointer;
}
ul.rates li span {
  display: flex;
  align-items: center;
}
ul.rates li:last-child span:last-child:hover {
  color: #fff;
  cursor: pointer;
}
ul.rates li:last-child span:last-child:hover span.arrow {
  border-color: #fff;
}
ul.rates li span .toltip {
  position: relative;
}
ul.rates li span .toltip:hover ul {
  opacity: 1;
  visibility: visible;
}
ul.rates li span .toltip ul {
  position: absolute;
  top: -40px;
  right: 20px;
  background: #324054;
  padding: 16px;
  border-radius: 16px;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 3;
}
ul.rates li span .toltip ul li {
  width: 210px;
  line-height: 22px;
  color: #fff;
  font-weight: 400;
}
ul.rates li span .toltip ul li span b {
  font-weight: 400;
  color: var(--bodyColor);
  margin-right: 5px;
}

.mainBlk,
.searchBlk {
  display: none;
}

.mainBlk.active,
.searchBlk.active {
  display: block;
}

.searchBlk {
  background: var(--backgroundColor);
  /* border-radius: 16px; */
}
h5.heading {
  display: block;
  text-align: left;
  padding: 8px 15px;
  border-bottom: 1px solid var(--borderColor);
  position: relative;
  width: 100%;
  font-size: 22px;
  box-sizing: border-box;
  font-weight: 500;
  /* margin-left: -14px; */
}
h5.heading button {
  position: absolute;
  top: 50%;
  left: 30px;
  background: transparent;
  width: 36px;
  padding-left: 5px;
  padding-top: 4px;
  height: 36px;
  transform: translateY(-50%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}
h5.heading button:hover {
  background: #202838;
}
h5.heading span.arrow {
  transform: translateY(-50%) scale(1.5) rotate(-140deg);
  border-color: #fff;
  border-width: 1px;
}
.searchBlk form {
  position: relative;
  margin: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.searchBlk form input {
  width: 100%;
  height: 45px;
  outline: none;
  background: var(--blackColor);
  color: #fff;
  padding-left: 45px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: 0.3s;
}

.searchBlk form svg#search {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--bodyColor);
}

.searchBlk form input:focus {
  border: 1px solid var(--blueColor);
}

.searchBlk form ::placeholder {
  color: var(--bodyColor);
}
ul.cryptoSuggestions {
  display: flex;
  flex-wrap: wrap;
  margin: 0 15px;
  border-bottom: 1px solid var(--borderColor);
  padding-bottom: 15px;
}
ul.cryptoSuggestions li {
  display: flex;
  align-items: center;
  border: 1px solid var(--borderColor);
  margin-right: 8px;
  padding: 7px 10px;
  margin-bottom: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 14px;
}

ul.cryptoSuggestions li img {
  width: 24px;
  margin-right: 7px;
}

ul.cryptoSuggestions li:hover {
  background: #06070a;
}
.cryptoList {
  /* max-height: 350px; */
  max-height: 70vh;
  overflow: auto;
  padding-top: 15px;
  position: relative;
}
.cryptoList li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  transition: 0.3s;
}
.cryptoList li:hover {
  background: var(--blackColor);
}
.cryptoList li .leftBlk {
  display: flex;
  align-items: center;
}

.cryptoList li .leftBlk img {
  height: 45px;
  margin-right: 10px;
}

.cryptoList li .leftBlk p span {
  color: var(--bodyColor);
  display: block;
  font-size: 13px;
  margin-top: 3px;
}
.cryptoList::-webkit-scrollbar {
  width: 3px;
}
.q-pa-md {
  padding: 30px !important;
}
.q-px-md {
  padding-right: 30px !important;
  padding-left: 30px !important;
}
.q-px-sm {
  padding-right: 15px !important;
  padding-left: 15px !important;
}
.cryptoList::-webkit-scrollbar-thumb {
  background: #37445a;
  border-radius: 30px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #0000006e;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
}

.popup-content {
  padding: 32px;
  border-radius: 16px;
  background: #131823;
  transition: 0.3s;
  transform: scale(0.4);
}

body.active_eth_popup .ethPupop,
body.active_limit_popup .limit {
  opacity: 1;
  visibility: visible;
}
body.active_eth_popup .popup-content,
body.active_limit_popup .popup-content {
  transform: scale(1);
}
body.active_eth_popup .block-contents,
body.active_limit_popup .block-contents {
  filter: blur(2px);
}

.popup-content h5 {
  display: flex;
  align-items: center;
  font-size: 24px;
  justify-content: space-between;
  margin-bottom: 20px;
}
.popup-content h5 span {
  font-size: 16px;
  color: var(--bodyColor);
  cursor: pointer;
}
.approval .toBlk,
.approval .col-md-2.flex.flex-center,
.approval.toBlk {
  display: none;
}
.popup-content ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rtBlk {
  margin: 0 10px;
  border: 1px solid var(--borderColor);
  padding: 10px;
  border-radius: 10px;
  width: 390px;
}

.rtBlk h5 {
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 18px;
  margin-bottom: 0;
}

.rtBlk h5 img {
  margin-right: 5px;
  width: 24px !important;
}

.rtBlk p {
  font-size: 13px;
  margin-top: 8px;
  padding: 3px;
  background: #18202c;
  border-radius: 3px;
  color: var(--bodyColor);
  transition: 0.3s;
}

.rtBlk p a {
  display: inline-block;
  text-decoration: none;
  margin-right: 10px;
  transition: 0.3s;
}

.rtBlk p a:hover,
.rtBlk p span:hover {
  text-decoration: underline;
}

.popup-content ul li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  position: relative;
}
.popup-content ul li img {
  width: 42px;
}

.popup-content ul li:nth-child(2) {
  padding: 0px 30px;
  margin: 0 20px;
}
.popup-content ul li img {
  width: 32px;
}
.popup-content ul li span.arrow {
  border-width: 1px;
  transform: scale(1.5) rotate(45deg);
}
.popup-content ul li:nth-child(2):after,
.popup-content ul li:nth-child(2):before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px;
  background: linear-gradient(45deg, #13182300, #627eea87, #ffffff00);
  left: 0;
  top: 0;
  height: 100%;
}

.popup-content ul li:nth-child(2):after {
  left: auto;
  right: 0;
}
.popup.limit .popup-content {
  max-width: 420px;
  text-align: center;
}

.popup.limit .popup-content h5 {
  position: relative;
  justify-content: center;
  margin-bottom: 45px;
  font-size: 20px;
}

.popup.limit .popup-content h5 span.limitBtn {
  position: absolute;
  right: 0;
  font-size: 18px;
}

.popup.limit .popup-content svg {
  margin-bottom: 30px;
}

.popup.limit .popup-content p {
  color: var(--bodyColor);
  margin-bottom: 15px;
  line-height: 26px;
}

.popup.limit .popup-content label.ckb {
  width: max-content;
  margin: auto;
  margin-bottom: 50px;
  padding-left: 24px;
}

.popup.limit .popup-content button.theme-btn {
  background: #2f8af5;
}
.popup.limit .popup-content button.theme-btn:hover {
  background: #2f8af5cf;
}
.settingList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0 16px;
}
.settingTitle {
  display: flex;
  align-items: center;
}
.settingTitle img {
  max-width: 22px;
  margin-right: 10px;
}
.moreInfo {
  position: relative;
}

.moreInfo svg {
  width: 16px;
  color: var(--bodyColor);
  transition: 0.3s;
}

.moreInfo p {
  transition: 0.3s;
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%) scale(0.5);
  background: #324054;
  width: 210px;
  padding: 10px;
  border-radius: 5px;
  font-size: 13px;
  text-align: center;
  transform-origin: top;
  opacity: 0;
  visibility: hidden;
  z-index: 2;
  pointer-events: none;
}
.moreInfo:hover svg {
  color: var(--whiteColor);
}
.moreInfo:hover p {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.settingTitle .moreInfo {
  margin-left: 10px;
  margin-top: 5px;
}
.settings {
  background: var(--backgroundColor);
  padding-bottom: 1px;
  /* border-radius: 0 0 16px 16px; */
  display: none;
}
.settings.active {
  display: block;
}
.settings h5.heading span.rest {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
  transition: 0.3s;
}

.settings h5.heading span.rest:hover {
  color: #ffffffd9;
}
span.rightDf {
  display: inline-block;
  position: relative;
  color: var(--bodyColor);
  font-size: 14px;
  transition: 0.3s;
}

span.rightDf:hover {
  cursor: pointer;
  color: var(--whiteColor);
}

span.rightDf span.arrow {
  transform: rotate(135deg);
  position: relative;
  top: -3px;
  width: 8px;
  height: 8px;
}

span.rightDf:hover span.arrow {
  border-color: var(--whiteColor);
}

.alert {
  display: flex;
  background: #7b3dff33;
  padding: 16px;
  margin: 16px;
  margin-bottom: 30px;
  border-radius: 15px;
}
.alert span svg#attention-circle {
  display: block;
  width: 20px;
  margin-right: 10px;
  color: #ac86ff;
}
.alert .content a svg#arrow-link {
  width: 18px;
  margin-left: 6px;
}
.alert .content h5 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ac86ff;
}

.alert .content h5 span {
  font-weight: 300;
  cursor: pointer;
}

.alert .content p {
  line-height: 24px;
  margin-bottom: 18px;
  padding-right: 25px;
}

.alert .content a {
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.settingRightOps a {
  text-decoration: none;
  color: var(--bodyColor);
}

.settingRightOps a span.rightDf {
  transform: rotate(-90deg);
  top: -3px;
}

.settingRightOps a:hover {
  color: var(--whiteColor);
}

.settingRightOps a:hover span.rightDf span {
  border-color: var(--whiteColor);
}
.hiddenCnt ul {
  display: flex;
  justify-content: space-between;
  background: #06070a;
  padding: 5px;
  margin: 0 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  margin-top: -10px;
}

.hiddenCnt ul li {
  width: 20%;
  overflow: hidden;
}

.hiddenCnt ul li span {
  display: block;
  padding: 12px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

.hiddenCnt ul li:hover span,
.hiddenCnt ul li.active span {
  background: #324054;
}

.hiddenCnt ul li input {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 16px;
  background: no-repeat;
  color: var(--whiteColor);
  padding: 5px;
  transition: 0.3s;
  border-radius: 6px;
}

.hiddenCnt ul li input:focus {
  border: 1px solid var(--blueColor);
}

.hiddenCnt ul li ::placeholder {
  color: var(--bodyColor);
}
svg#recommended {
  width: 10px;
  color: #0059e4;
}

.allContents label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 20px;
  border-bottom: 1px solid var(--borderColor);
  padding-left: 45px;
}
.allContents label span.checkmark {
  top: 50%;
  transform: translateY(-50%);
}
.lft b {
  font-weight: 300;
  font-size: 13px;
  color: var(--bodyColor);
  margin-left: 5px;
}
.allContents {
  margin: 0 16px;
  background: var(--blackColor);
  border-radius: 16px;
  overflow: hidden;
}
.allContents label span.checkmark {
  border-color: var(--bodyColor);
  left: 18px;
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
}
ul.mn {
  display: flex;
  margin: 0 16px;
  background: var(--blackColor);
  margin-bottom: 20px;
  padding: 5px;
  border-radius: 5px;
}
.q-mr-md {
margin-right: 15px !important;
}
ul.mn li {
  width: 50%;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;
}
ul.mn li.active {
  background: #324054;
  cursor: pointer;
}
.advancedSets label {
  margin-top: 20px;
  display: block;
}
.oneinch-dex > /deep/ .q-splitter__before {
  display: none;
}
.advancedSets label .lbl-txt {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.advancedSets label .lbl-txt span {
  color: var(--bodyColor);
  display: flex;
  align-items: center;
}

.advancedSets label .lbl-txt span .moreInfo {
  margin-left: 5px;
  margin-bottom: -5px;
}

.advancedSets label .lbl-txt span .moreInfo p {
  color: var(--whiteColor);
}

.advancedSets label .inp {
  position: relative;
}

.advancedSets label .inp input {
  width: 100%;
  border: none;
  color: var(--whiteColor);
  background: var(--blackColor);
  padding: 15px;
  border-radius: 6px;
  margin-top: 10px;
}

.advancedSets form {
  margin: 0 16px;
}

.advancedSets label .inp span {
  position: absolute;
  bottom: 15px;
  right: 15px;
  color: var(--bodyColor);
}

ul.tbld {
  border: 1px solid var(--borderColor);
  padding: 16px;
  border-radius: 10px;
  margin: 0 16px;
  margin-top: 15px;
  margin-bottom: 30px;
  padding-top: 5px;
}

ul.tbld li {
  display: flex;
  align-items: center;
  margin-top: 12px;
  justify-content: space-between;
}
.settingList.gasPrice {
  cursor: pointer;
}
.settingList.gasPrice.active .settingRightOps span.rightDf span.arrow {
  transform: rotate(315deg);
  top: 0;
}
.hidedOpt.gasPriceContent {
  display: none;
}
.hidedOpt.gasPriceContent.active {
  display: block;
}
.allContents,
.advancedSets {
  display: none;
}

.allContents.active,
.advancedSets.active {
  display: block;
}
.allContents {
  margin-bottom: 30px;
}
.settingList.slippages {
  cursor: pointer;
}
.hiddenCnt.active {
  display: block;
}
.hiddenCnt {
  display: none;
}
.slippages.active .settingRightOps span.rightDf span.arrow {
  transform: rotate(315deg);
  top: 0;
}

body.lighTheme .cash-blk.active h5 {
  color: #000;
}

body.lighTheme .blk-header ul:first-child li:first-child {
  color: #000;
}

body.lighTheme ul.rates li:last-child span:last-child:hover,
body.lighTheme ul.rates li:last-child span:last-child:hover span {
  color: #000;
  border-color: #000;
}

body.lighTheme .cash-blk.active h5 b.dn_arr .withArr span.arrow {
  border-color: #000;
}
body.lighTheme ul.rates li span .toltip ul {
  background: #fff;
}

body.lighTheme ul.rates li span .toltip ul li {
  color: #000;
}
body.lighTheme .popup-content h5 {
  color: #000;
}
body.lighTheme .popup-content {
  color: #000;
  background: #fff;
  box-shadow: 0 11px 15px -7px #0003, 0 24px 38px 3px #00000024,
    0 9px 46px 8px #0000001f;
}
body.lighTheme .popup {
  background: #6c86ad99;
}
body.lighTheme .popup-content ul .rtBlk p {
  background: #2a79e31a;
}
body.lighTheme .fromBlk {
  background: #f3f5fa;
}

body.lighTheme h5.drpn {
  color: #000;
}
body.lighTheme .toBlk h5.drpn span:first-child:hover {
  background: #f3f5fa;
}
body.lighTheme h5.drpn span:first-child:hover {
  background: #ffffff;
}
body.lighTheme li.settingBtn svg#swap-settings,
body.lighTheme .blk-header ul li {
  color: #000;
}
body.lighTheme .blk-header ul li.limitBtn {
  color: #6c86ad;
}
body.lighTheme label.ckb span.checkmark::after {
  border-color: white;
  left: 3px;
  top: 0.5px;
}
body.lighTheme .top_arrow_icon {
  color: #000;
  background: #fff;
  box-shadow: 0 0 4px #47494f1a, 0 1px 2px #47494f40;
}
body.lighTheme .toBlk p span:first-child:hover {
  color: #000;
}
body.lighTheme .top_arrow_icon {
  color: #000;
  background: #fff;
  box-shadow: 0 0 4px #47494f1a, 0 1px 2px #47494f40;
}
body.lighTheme .searchBlk form input {
  background: #f3f5fa;
}

body.lighTheme ul.cryptoSuggestions li {
  color: #000;
}

body.lighTheme ul.cryptoSuggestions li:hover {
  background: #f3f5fa;
}

body.lighTheme .cryptoList ul li {
  color: #000;
}

body.lighTheme .cryptoList li:hover {
  background: #f3f5fa;
}

body.lighTheme .cryptoList::-webkit-scrollbar {
  width: 5px;
}
body.lighTheme .cryptoList::-webkit-scrollbar-thumb {
  background: #f3f5fa;
}
body.lighTheme h5.heading {
  color: #000;
}

body.lighTheme h5.heading button.backfromtoken span {
  border-color: #000;
}

body.lighTheme h5.heading button:hover {
  background: #f3f5fa;
}
body.lighTheme h5.heading button span.arrow {
  border-color: #000;
}
body.lighTheme .alert .content p,
body.lighTheme .alert .content a {
  color: #000;
}

body.lighTheme .settingList .settingTitle {
  color: #000;
}
body.lighTheme .settingRightOps span.rightDf:hover,
body.lighTheme .settingRightOps a:hover,
.moreInfo:hover svg,
body.lighTheme ul.mn li {
  color: #000;
}
body.lighTheme .settingRightOps span.rightDf:hover span.arrow,
body.lighTheme .settingRightOps a:hover span.arrow {
  border-color: #000;
}

body.lighTheme .moreInfo p {
  background: #8ca4c7;
  color: #ffff;
}
body.lighTheme ul.mn {
  background: #ecf0f9;
}
body.lighTheme ul.mn li.active {
  background: #ffffff;
}
body.lighTheme .allContents label {
  background: #ecf0f9;
  color: #000;
}
body.lighTheme .allContents.active label.ckb span.checkmark::after {
  top: 1px;
  left: 4px;
}
body.lighTheme .advancedSets label .inp input {
  background: #ecf0f9;
  color: #000;
}
body.lighTheme ul.tbld li,
.hiddenCnt ul li {
  color: #000;
}
body.lighTheme .hiddenCnt ul {
  background: #ecf0f9;
}
body.lighTheme .hiddenCnt ul li:hover span,
.hiddenCnt ul li.active span {
  background: #ffffff;
  color: #000;
}
.mobile-card {
  background-color: #04111f !important;
}
.bg-input {
  background: #dee3ec !important;
}

.dark-theme .bg-input {
  background: #121d2a !important;
}
.fromBlk h5.drpn input {
  border-radius: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.removeSelector h5.drpn span:first-child:after {
  display: none;
}
.hash-status a {
  text-decoration: none !important;
}
.hash-status {

  padding: 10px;

  width: max-content;
  margin-top: 20px;
}
</style>
