<template>
  <div :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }">
    <div class="chain-tools-wrapper">
      <!-- <q-toggle v-model="active" label="Active" /> -->
      <div class="chain-tools-wrapper--list open">
        <div class="list-wrapper">
          <div class="list-wrapper--chain__eth-to-hex-convertor">
            <q-tabs
              v-model="tab"
              dense
              :dark="$store.state.settings.lightMode === 'true'"
              :light="$store.state.settings.lightMode === 'false'"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="stake" label="Stake Now" class="full-width" />
              <q-tab
                @click="initData()"
                name="staked"
                label="Staked Amounts"
                :disable="stakes.length === 0"
                class="full-width"
              />
            </q-tabs>

            <q-separator v-if="!$q.platform.is.mobile" />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="stake">
                <div v-if="step >= 0" class="">
                  <q-stepper
                    v-model="step"
                    vertical
                    color="primary"
                    animated
                    flat
                    :dark="$store.state.settings.lightMode === 'true'"
                    :light="$store.state.settings.lightMode === 'false'"
                  >
                    <q-step
                      title="Choose an account"
                      :name="0"
                      prefix="0"
                      v-if="false"
                      :done="step > 0"
                    >
                      <q-stepper-navigation
                        v-if="currentAccount"
                        class="flex justify-end"
                      >
                        <q-btn
                          @click="step = 1"
                          unelevated
                          color="deep-purple-14"
                          class="--next-btn"
                          rounded
                          label="Stake hex"
                        />
                      </q-stepper-navigation>
                    </q-step>
                    <q-step
                      :title="`Set staking options`"
                      :name="1"
                      prefix="1"
                      :done="step > 1"
                    ><div class="row">
                      <div class="row col-md-5" >
                        <div class="col-md-12">
                          <span class="text-body2">Switch account here</span>
                          <q-select
                            :dark="$store.state.settings.lightMode === 'true'"
                            :light="$store.state.settings.lightMode === 'false'"
                            separator

                            outlined
                            @input="
                              $store.state.currentwallet.wallet =
                                currentAccount;
                              initAccount();
                              initData();
                            "
                            class="select-input q-py-md q-mb-md"
                            v-model="currentAccount"
                            use-input
                            :options="tableData"
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
                                <q-item-section dark>
                                  <q-item-label v-html="scope.opt.name" />
                                  <q-item-label caption>{{
                                    getKeyFormat(scope.opt.key)
                                  }}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </template>
                            <template v-slot:selected>
                              <q-item v-if="currentAccount">
                                <q-item-section avatar>
                                  <q-icon
                                    class="option--avatar"
                                    :name="`img:${currentAccount.icon}`"
                                  />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label v-html="currentAccount.name" />
                                  <q-item-label caption class="">{{
                                    getKeyFormat(currentAccount.key)
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
                                @click="
                                  copyToClipboard(
                                    currentAccount.type !== 'eth' &&
                                      currentAccount.type !== 'verto'
                                      ? currentAccount.name
                                      : currentAccount.key,
                                    'Account name'
                                  );

                                "
                                @click.stop
                                icon="o_file_copy"
                              />
                            </template>
                          </q-select>
                          <br/>
                          <div class="row current-stake-balanca q-mt-md">
                            <div class="">
                              <span class="--title row text-h6">
                                Liquid Balance
                              </span>
                              <span class="--amount row text-h4">
                                {{ formatNumber(currentAccount.amount, 0) }}
                                {{ params.tokenID.toUpperCase() }}
                              </span>
                            </div>
                            <div
                              class="
                                col
                                --progress
                                hr-vertical
                                flex flex-center
                              "
                            >
                              <span class="bar"></span>
                            </div>
                            <div class="col">
                              <span class="--title row text-h6">
                                Staked + Interest

                              </span>
                              <span
                                v-if="currentAccount.staked != 'pending'"
                                class="--amount row text-h4"
                              >
                                {{ formatNumber(currentAccount.staked, 0) }}
                                {{ params.tokenID.toUpperCase() }}</span
                              >
                              <span v-else>
                                <q-linear-progress
                                  indeterminate
                                  color="grey"
                                  class="q-mt-sm"
                              /></span>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12 ">
                          <StakesTable @getEndStakeEndingData="getEndStakeEndingData" :key="currentAccount.key" :address="currentAccount.key"

                          />
                        </div>
                      </div>

                      <div class="text-black col-md-6">
                        <!-- <p class="text-h6 text-grey">Condition 1</p> -->
                        <div v-if="condition === 1" class="condition_1">
                          <p class="--alert text-indigo-6 text-h6">
                            You do not have enough
                            {{ params.tokenID.toUpperCase() }} available for
                            staking.
                          </p>
                          <div class="row">
                            <div class="">
                              <span class="--title row text-h6">
                                {{ params.tokenID.toUpperCase() }} (Liquid)
                              </span>
                              <span class="--amount row text-h4">
                                {{ currentAccount.amount }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="condition === 2" class="condition_2">
                          <p class="--alert text-indigo-6 text-h6">
                            Verto does not detect an
                            {{ params.tokenID.toUpperCase() }} account
                          </p>
                        </div>
                        <div v-if="condition === 3" class="condition_3">
                          <div class="text-black">
                            <div class="row">
                              <div class="col-md-12 q-pa-md">
                                <div
                                  class="
                                    summary-wrapper
                                    row
                                    full-width
                                    q-mx-lg q-px-lg
                                    rounded-borders
                                  "
                                >
                                  <div class="full-width">
                                     <div  v-if="action == 'Unstake'" class="q-mb-lg">
                                       <q-btn flat icon="arrow_back" @click="action = 'Stake'; getStakingObject()" label="Back" />
                                       <span class="q-pt-sm text-deep-purple-12">Your are about to unstake...</span>
                                     </div>
                                    <span v-if="action == 'Stake'">Enter amount</span>
                                    <q-input
                                    v-if="action == 'Stake'"
                                      :dark="
                                        $store.state.settings.lightMode ===
                                        'true'
                                      "
                                      style="max-width: 300px"
                                      :light="
                                        $store.state.settings.lightMode ===
                                        'false'
                                      "
                                      v-model="sendAmount"
                                      type="number"
                                      :suffix="params.tokenID.toUpperCase()"
                                      rounded
                                      outlined
                                      class="--input"
                                      @input="
                                        getStakingData();
                                        getStakingObject();
                                      "
                                      :rules="[
                                        (val) => val >= 1 || '1 HEX Minimum',
                                      ]"
                                    />

                                    <q-input
                                    v-if="action == 'Stake'"
                                      style="max-width: 300px"
                                      :dark="
                                        $store.state.settings.lightMode ===
                                        'true'
                                      "
                                      :light="
                                        $store.state.settings.lightMode ===
                                        'false'
                                      "
                                      v-model="daysNumber"
                                      type="number"
                                      suffix="days"
                                      rounded
                                      max="5555"
                                      outlined
                                      class="--input"
                                      @input="
                                        getStakingData();
                                        getStakingObject();
                                      "
                                      :rules="[
                                        (val) =>
                                          (val >= 0 && val <= 5555) ||
                                          'Day should be between 1 and 5555',
                                      ]"
                                    />
                                    <GasSelector
                                      ref="gas_global"
                                      :key="daysNumber + sendAmount + uniqueKey"
                                      v-if="
                                        currentAccount && txObj && txObj.data
                                      "
                                      @setGas="setSelectedGas"
                                      :txObject="txObj"
                                      :currentAccount="currentAccount"
                                      :txData="{ method: 'txObject' }"
                                      :type="'hex'"
                                    />

                                    <q-btn
                                      :disable="!txObj || !txObj.gas"
                                      @click="step = 2"
                                      unelevated
                                      color="deep-purple-14"
                                      class="--next-btn"
                                      rounded
                                      :key="uniqueKey"
                                      :label="action == 'Stake' ? 'Stake Hex' : 'Unstake'"
                                    />
                                    <div v-if="false">
                                      <span class="--title row text-h6">
                                        Amount to stake
                                      </span>
                                      <span class="--amount row text-h4">
                                        {{ formatNumber(sendAmount, 2) }}
                                        {{ params.tokenID.toUpperCase() }}</span
                                      >
                                      <span
                                        class="
                                          --title
                                          row
                                          text-h6 text-indigo-6
                                        "
                                        :class="{ 'q-pt-md': sendAmount < 1 }"
                                      >
                                        Estimated stake reward
                                      </span>
                                      <span class="--amount row text-h4">
                                        {{ formatNumber(estimatedReward, 2) }}
                                        {{ params.tokenID.toUpperCase() }}
                                      </span>
                                      <span
                                        class="
                                          --title
                                          row
                                          text-h6 text-indigo-6
                                          q-pt-lg
                                        "
                                      >
                                        Staking period
                                      </span>
                                      <span class="--amount row text-h4">{{
                                        `${stakePeriod * period_duration}` +
                                        " days"
                                      }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
</div>
                      <div class="staked-wrapper">
                        <div
                          v-for="(stake, i) in stakes"
                          :key="i"
                          class="item-wrapper row flex"
                        >
                          <div class="col col-9 q-pr-sm">
                            <div class="border column justify-between">
                              <span
                                ><span class="text-bold">Staked date:</span>
                                {{ stake.stake_date.toDateString() }}</span
                              >
                              <div
                                class="
                                  row
                                  flex
                                  item-wrapper--row
                                  justify-between
                                  items-end
                                "
                              >
                                <div class="col">
                                  Amount: <br />
                                  <strong
                                    >{{ stake.stake_amount }} HEX
                                    <q-icon
                                      class="q-mb-xs"
                                      :name="'img:' + currentAccount.icon"
                                    />
                                  </strong>
                                </div>
                                <div class="col">
                                  Period: <br />
                                  <strong>{{ stake.stake_period }} Days</strong>
                                </div>
                                <div class="col mobile-only">
                                  {{
                                    stake.time_left > 0
                                      ? "Time left"
                                      : "Stake period ended"
                                  }}: <br />
                                  <strong
                                    >{{ stake.time_left }}
                                    {{
                                      (stake.stake_period * 24 * 60 -
                                        stake.time_left) /
                                      (stake.stake_period * 24 * 60)
                                    }}</strong
                                  >
                                </div>
                                <div
                                  v-if="stake.time_left > 0"
                                  class="col desktop-only"
                                >
                                  {{
                                    stake.time_left > 0
                                      ? "Time left"
                                      : "Stake period ended"
                                  }}: <br />
                                  <q-linear-progress
                                    dark
                                    rounded
                                    stripe
                                    size="25px"
                                    :value="
                                      parseFloat(stake.time_left_percentage) /
                                      100
                                    "
                                    color="deep-purple-14"
                                  >
                                    <div class="absolute-full flex flex-center">
                                      <q-badge
                                        color="white"
                                        text-color="black"
                                        :label="
                                          stake.time_left_percentage + ' %'
                                        "
                                      />
                                    </div>
                                    <q-tooltip
                                      content-class="text-body1"
                                      v-if="stake && stake.timer"
                                    >
                                      {{ stake.timer.text }}
                                    </q-tooltip>
                                  </q-linear-progress>
                                </div>
                                <div v-else class="col desktop-only">
                                  <q-btn
                                    @click="unStakeHEX()"
                                    outline
                                    label="Unstake"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col col-3 column justify-end">
                            <div class="border total column justify-end">
                              Total Earning: <br />
                              <strong>{{ stake.subsidy }} HEX</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-step>
                    <q-step
                      title="Confirm & Submit"
                      :name="2"
                      prefix="2"
                      :done="step > 2"
                    >
                      <q-btn
                        flat
                        @click="step = 1"
                        unelevated
                        icon="keyboard_arrow_up"
                        :dark="$store.state.settings.lightMode === 'true'"
                        class="--back-btn"
                      />
                      <div
                        class="
                          summary
                          text-body1
                          q-pa-sm
                          rounded-borders
                          q-mt-sm
                        "
                      >
                        You are about to {{action}} <span v-if="action == 'Stake'">
                        <span class="text-deep-purple-12"
                          >{{ formatNumber(sendAmount, 0) }}
                          {{ params.tokenID.toUpperCase() }}</span
                        >
                        for a period of
                        <span class="text-deep-purple-12"
                          >{{ daysNumber }} days</span
                        >. </span>
                         <span v-else><br/>
                         <b>Principal:</b> {{contextData.principal}} HEX<br/>
                         <b>Stake ID: </b> {{contextData.stakeId}}<br/>
                          </span>
                          <span v-if="ErrorMessage" class="text-red q-pt-md">{{ErrorMessage}}</span>

                      </div>
                      <div class="text-black">
                        <div class="text-h4 --subtitle">Are you sure?</div>
                      </div>

                      <q-stepper-navigation class="flex justify-end">
                        <q-btn
                          @click="
                            spinnerVisible = true;
                            stakeHex();
                          "
                          color="deep-purple-14"
                          class="--next-btn"
                          :loading="spinnerVisible"
                          rounded
                          label="Submit"
                        />
                      </q-stepper-navigation>
                       <div
                       v-if="action == 'Stake'"
                                v-html="summary"
                                class="col-md-12 summary-data"
                                :style="
                                  $q.platform.is.mobile
                                    ? 'margin-top: auto'
                                    : ''
                                "
                              ></div>
                    </q-step>
                    <q-step title="Result" :name="4" prefix="3">
                      <q-btn
                        flat
                        @click="step = 2"
                        unelevated
                        icon="keyboard_arrow_up"
                        :dark="$store.state.settings.lightMode === 'true'"
                        class="--back-btn"
                      />

                      <div
                        v-if="!ErrorMessage && !transactionId"
                        class="text-black"
                      >
                        <q-spinner />
                      </div>
                      <div
                        v-if="!transactionError && transactionId"
                        class="content__success"
                      >
                        <q-linear-progress
                          indeterminate
                          v-if="status == 'pending'"
                        />
                        <img
                          v-else-if="status == 'success'"
                          src="statics/success_icon.svg"
                          class="success_icon"
                          alt=""
                        />
                        <div
                          v-if="status == 'success'"
                          class="
                            text-h4
                            --subtitle
                            text-center
                            --subtitle__success
                          "
                        >
                          Successful completion
                        </div>
                        <div
                          class="
                            text-h4
                            --subtitle
                            text-center
                            --subtitle__transLink
                          "
                          v-html="showMessage"
                        >
                          {{ showMessage }}
                        </div>
                      </div>
                      <div
                        v-else-if="ErrorMessage"
                        class="content__failed text-red q-pa-md"
                      >
                        <img
                          src="statics/fail_icon.svg"
                          class="failed_icon"
                          alt=""
                        />
                        <div
                          class="
                            text-h4
                            --subtitle
                            text-center
                            --subtitle__faild
                          "
                        >
                          Something's wrong!
                        </div>
                        <div
                          class="
                            text-h4
                            --subtitle
                            text-center
                            full-width
                            --subtitle__transLink
                          "
                        >
                          {{ ErrorMessage }}
                        </div>
                      </div>
                    </q-step>
                  </q-stepper>
                  <div
                    class="staked-wrapper full-width"
                    v-if="step == 4 && false"
                  >
                    <div
                      v-for="(stake, i) in stakes"
                      :key="i"
                      class="item-wrapper row flex"
                    >
                      <div class="col col-9 q-pr-sm">
                        <div class="border column justify-between">
                          <span
                            ><span class="text-bold">Staked date:</span>
                            {{ stake.stake_date.toDateString() }}</span
                          >
                          <div
                            class="
                              row
                              flex
                              item-wrapper--row
                              justify-between
                              items-end
                            "
                          >
                            <div class="col">
                              Amount: <br />
                              <strong
                                >{{ stake.stake_amount }} HEX
                                <q-icon
                                  class="q-mb-xs"
                                  :name="'img:' + currentAccount.icon"
                                />
                              </strong>
                            </div>
                            <div class="col">
                              Period: <br />
                              <strong>{{ stake.stake_period }} Days</strong>
                            </div>
                            <div class="col mobile-only">
                              {{
                                stake.time_left > 0
                                  ? "Time left"
                                  : "Stake period ended"
                              }}: <br />
                              <strong
                                >{{ stake.time_left }}
                                {{
                                  (stake.stake_period * 24 * 60 -
                                    stake.time_left) /
                                  (stake.stake_period * 24 * 60)
                                }}</strong
                              >
                            </div>
                            <div
                              v-if="stake.time_left > 0"
                              class="col desktop-only"
                            >
                              {{
                                stake.time_left > 0
                                  ? "Time left"
                                  : "Stake period ended"
                              }}: <br />
                              <q-linear-progress
                                dark
                                rounded
                                stripe
                                size="25px"
                                :value="
                                  parseFloat(stake.time_left_percentage) / 100
                                "
                                color="deep-purple-14"
                              >
                                <div class="absolute-full flex flex-center">
                                  <q-badge
                                    color="white"
                                    text-color="black"
                                    :label="stake.time_left_percentage + ' %'"
                                  />
                                </div>
                                <q-tooltip
                                  content-class="text-body1"
                                  v-if="stake && stake.timer"
                                >
                                  {{ stake.timer.text }}
                                </q-tooltip>
                              </q-linear-progress>
                            </div>
                            <div v-else class="col desktop-only">
                              <q-btn
                                @click="unStakeHEX()"
                                outline
                                label="Unstake"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col col-3 column justify-end">
                        <div class="border total column justify-end">
                          Total Earning: <br />
                          <strong>{{ stake.subsidy }} HEX</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="staked"> </q-tab-panel>
            </q-tab-panels>
          </div>
          <br /><br /><br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
import Formatter from '@/mixins/Formatter'
import StakesTable from './HexStakesTable.vue'
import initWallet from '@/util/_Wallets2Tokens'
import GasSelector from '..//ETH/GasSelector.vue'
import Lib from '@/util/walletlib'
let hexContractAddress = '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39'
let abi =
  '[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"data1","type":"uint256"},{"indexed":true,"internalType":"bytes20","name":"btcAddr","type":"bytes20"},{"indexed":true,"internalType":"address","name":"claimToAddr","type":"address"},{"indexed":true,"internalType":"address","name":"referrerAddr","type":"address"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"data1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"data2","type":"uint256"},{"indexed":true,"internalType":"address","name":"senderAddr","type":"address"}],"name":"ClaimAssist","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":true,"internalType":"address","name":"updaterAddr","type":"address"}],"name":"DailyDataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":true,"internalType":"uint40","name":"stakeId","type":"uint40"}],"name":"ShareRateChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"data1","type":"uint256"},{"indexed":true,"internalType":"address","name":"stakerAddr","type":"address"},{"indexed":true,"internalType":"uint40","name":"stakeId","type":"uint40"}],"name":"StakeEnd","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"data1","type":"uint256"},{"indexed":true,"internalType":"address","name":"stakerAddr","type":"address"},{"indexed":true,"internalType":"uint40","name":"stakeId","type":"uint40"},{"indexed":true,"internalType":"address","name":"senderAddr","type":"address"}],"name":"StakeGoodAccounting","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":true,"internalType":"address","name":"stakerAddr","type":"address"},{"indexed":true,"internalType":"uint40","name":"stakeId","type":"uint40"}],"name":"StakeStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":true,"internalType":"address","name":"memberAddr","type":"address"},{"indexed":true,"internalType":"uint256","name":"entryId","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrerAddr","type":"address"}],"name":"XfLobbyEnter","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"data0","type":"uint256"},{"indexed":true,"internalType":"address","name":"memberAddr","type":"address"},{"indexed":true,"internalType":"uint256","name":"entryId","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrerAddr","type":"address"}],"name":"XfLobbyExit","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"allocatedSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"rawSatoshis","type":"uint256"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"address","name":"claimToAddr","type":"address"},{"internalType":"bytes32","name":"pubKeyX","type":"bytes32"},{"internalType":"bytes32","name":"pubKeyY","type":"bytes32"},{"internalType":"uint8","name":"claimFlags","type":"uint8"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint256","name":"autoStakeDays","type":"uint256"},{"internalType":"address","name":"referrerAddr","type":"address"}],"name":"btcAddressClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes20","name":"","type":"bytes20"}],"name":"btcAddressClaims","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes20","name":"btcAddr","type":"bytes20"},{"internalType":"uint256","name":"rawSatoshis","type":"uint256"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"btcAddressIsClaimable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes20","name":"btcAddr","type":"bytes20"},{"internalType":"uint256","name":"rawSatoshis","type":"uint256"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"btcAddressIsValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"claimToAddr","type":"address"},{"internalType":"bytes32","name":"claimParamHash","type":"bytes32"},{"internalType":"bytes32","name":"pubKeyX","type":"bytes32"},{"internalType":"bytes32","name":"pubKeyY","type":"bytes32"},{"internalType":"uint8","name":"claimFlags","type":"uint8"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"claimMessageMatchesSignature","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"currentDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dailyData","outputs":[{"internalType":"uint72","name":"dayPayoutTotal","type":"uint72"},{"internalType":"uint72","name":"dayStakeSharesTotal","type":"uint72"},{"internalType":"uint56","name":"dayUnclaimedSatoshisTotal","type":"uint56"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"beginDay","type":"uint256"},{"internalType":"uint256","name":"endDay","type":"uint256"}],"name":"dailyDataRange","outputs":[{"internalType":"uint256[]","name":"list","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"beforeDay","type":"uint256"}],"name":"dailyDataUpdate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"globalInfo","outputs":[{"internalType":"uint256[13]","name":"","type":"uint256[13]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"globals","outputs":[{"internalType":"uint72","name":"lockedHeartsTotal","type":"uint72"},{"internalType":"uint72","name":"nextStakeSharesTotal","type":"uint72"},{"internalType":"uint40","name":"shareRate","type":"uint40"},{"internalType":"uint72","name":"stakePenaltyTotal","type":"uint72"},{"internalType":"uint16","name":"dailyDataCount","type":"uint16"},{"internalType":"uint72","name":"stakeSharesTotal","type":"uint72"},{"internalType":"uint40","name":"latestStakeId","type":"uint40"},{"internalType":"uint128","name":"claimStats","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"merkleLeaf","type":"bytes32"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"merkleProofIsValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"pubKeyX","type":"bytes32"},{"internalType":"bytes32","name":"pubKeyY","type":"bytes32"},{"internalType":"uint8","name":"claimFlags","type":"uint8"}],"name":"pubKeyToBtcAddress","outputs":[{"internalType":"bytes20","name":"","type":"bytes20"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"pubKeyX","type":"bytes32"},{"internalType":"bytes32","name":"pubKeyY","type":"bytes32"}],"name":"pubKeyToEthAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"stakerAddr","type":"address"}],"name":"stakeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"stakeIndex","type":"uint256"},{"internalType":"uint40","name":"stakeIdParam","type":"uint40"}],"name":"stakeEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"stakerAddr","type":"address"},{"internalType":"uint256","name":"stakeIndex","type":"uint256"},{"internalType":"uint40","name":"stakeIdParam","type":"uint40"}],"name":"stakeGoodAccounting","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakeLists","outputs":[{"internalType":"uint40","name":"stakeId","type":"uint40"},{"internalType":"uint72","name":"stakedHearts","type":"uint72"},{"internalType":"uint72","name":"stakeShares","type":"uint72"},{"internalType":"uint16","name":"lockedDay","type":"uint16"},{"internalType":"uint16","name":"stakedDays","type":"uint16"},{"internalType":"uint16","name":"unlockedDay","type":"uint16"},{"internalType":"bool","name":"isAutoStake","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"newStakedHearts","type":"uint256"},{"internalType":"uint256","name":"newStakedDays","type":"uint256"}],"name":"stakeStart","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"xfLobby","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"referrerAddr","type":"address"}],"name":"xfLobbyEnter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"memberAddr","type":"address"},{"internalType":"uint256","name":"entryId","type":"uint256"}],"name":"xfLobbyEntry","outputs":[{"internalType":"uint256","name":"rawAmount","type":"uint256"},{"internalType":"address","name":"referrerAddr","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"enterDay","type":"uint256"},{"internalType":"uint256","name":"count","type":"uint256"}],"name":"xfLobbyExit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"xfLobbyFlush","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"xfLobbyMembers","outputs":[{"internalType":"uint40","name":"headIndex","type":"uint40"},{"internalType":"uint40","name":"tailIndex","type":"uint40"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"memberAddr","type":"address"}],"name":"xfLobbyPendingDays","outputs":[{"internalType":"uint256[2]","name":"words","type":"uint256[2]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"beginDay","type":"uint256"},{"internalType":"uint256","name":"endDay","type":"uint256"}],"name":"xfLobbyRange","outputs":[{"internalType":"uint256[]","name":"list","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}]'
export default {
  name: 'HEXConverter',
  components: {
    GasSelector,
    StakesTable
  },
  data () {
    return {
      tab: 'stake',
      step: 1,
      period_duration: 1,
      stakeData: [],
      daysNumber: 100,
      txObj: null,
      timers: [],
      condition: 3,
      summary: null,
      currentAccount: null,
      stakePeriod: 10,
      estimatedReward: 0,
      options: [],
      tableData: [],
      active: true,
      showWallet: false,
      showText: false,
      slider: 0,
      progColor: 'red',
      hexbalance: 0,
      stakes: [],
      status: 'pending',
      allocatable: 0,
      stakedAmount: 0,
      hexprice: 0,
      sendAmount: 0,
      formatedAmount: null,
      currentProxy: null,
      ErrorMessage: null,
      showMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      uniqueKey: 0,
      transactionId: null,
      action: 'Stake',
      contextData: null,
      transactionError: '',
      spinnerVisible: false,
      isPwd: true,
      isPrivateKeyEncrypted: false,
      account: null,
      privateKeyPassword: null,
      showSendModal: false
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },
  destroyed () {
    this.timers.forEach((timerObject) => {
      clearInterval(timerObject)
    })
  },
  async created () {
    this.initAccount()
    this.initData()
  },
  async mounted () {
    this.sendAmount = parseInt(this.currentAccount.amount)
    this.getStakingObject()

    /* this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://go.hex.com/data/event-batch-7-3.hxb')
      .then(res => {
        console.log(res, ' res')
      })
      */
    this.getStakingData()
  },
  methods: {
    getStakingObject () {
      this.txObj = {
        from: this.currentAccount.key,
        to: hexContractAddress,
        chainId: 1,
        gas: 0
      }

      const web3 = Lib.getWeb3Instance('eth')
      var hearts = Math.round(this.sendAmount * 10 ** 8)
      let hexrefContract = new web3.eth.Contract(
        JSON.parse(abi),
        hexContractAddress
      )
      this.txObj.data = hexrefContract.methods
        .stakeStart(web3.utils.toHex(hearts.toString()), this.daysNumber)
        .encodeABI()
      this.$set(this, 'txObj', this.txObj)

      this.uniqueKey++
      this.action = 'Stake'
    },
    getEndStakeEndingData (data) {
      const web3 = Lib.getWeb3Instance('eth')
      this.contextData = data
      let hexrefContract = new web3.eth.Contract(
        JSON.parse(abi),
        hexContractAddress
      )

      this.txObj.gas = 0
      let d = hexrefContract.methods
        .stakeEnd(data.index, data.stakeId)
        .encodeABI()
      this.$set(this.txObj, 'data', d)
      this.action = 'Unstake'
      this.uniqueKey++
    },
    setSelectedGas (data) {
      if (data.value && data.value.gas && data.value.gasPrice) {
        this.txObj.gas = data.value.gas
        this.txObj.gasPrice = data.value.gasPrice
        this.$set(this, 'txObj', this.txObj)
      }
    },
    async getStakingData () {
      let data = {
        stake: this.sendAmount,
        days: this.daysNumber,
        chosencurrency: 'USD',
        hex_price_prediction: (
          await this.$axios.get(
            process.env[this.$store.state.settings.network].CACHE +
              'https://api.coingecko.com/api/v3/simple/price?ids=hex&vs_currencies=usd'
          )
        ).data.hex.usd
      }
      this.spinnerVisible = true
      this.$axios
        .post(
          process.env[this.$store.state.settings.network].CACHE +
            'https://hexcalc.net/index.php',
          this.toFormData(data)
        )
        .then((response) => {
          var html = new DOMParser().parseFromString(
            response.data,
            'text/html'
          )

          let value = html.querySelector('#summary')
          this.summary = value.innerHTML
          this.spinnerVisible = false
        })
    },
    initAccount () {
      this.tableData = JSON.parse(
        JSON.stringify(
          this.$store.state.wallets.tokens.filter(
            (o) => o.chain === 'eth' && o.type === 'eth'
          )
        )
      ).map((o) => {
        o.label = o.name
        o.value = o.key
        o.icon = 'https://ethplorer.io/images/HEX2b591e99.png'
        let token = this.$store.state.wallets.tokens.find(
          (a) =>
            a.chain === 'eth' &&
            a.type === 'hex' &&
            a.key.toLowerCase() === o.key.toLowerCase()
        )
        o.amount = token ? token.amount : 0
        return o
      })

      if (this.tableData && this.tableData.length) {
        if (!this.currentAccount) {
          this.currentAccount = this.tableData[0]
          this.currentAccount.label = this.currentAccount.name
          this.currentAccount.value = this.currentAccount.name
        }
        this.params = {
          chainID: this.currentAccount.chain,
          tokenID: 'hex',
          key: this.currentAccount.key
        }
      } else {
        this.params = this.$store.state.currentwallet.params
        this.currentAccount = this.currentAccount
          ? this.currentAccount
          : this.tableData.find(
            (w) =>
              w.chain === this.params.chainID &&
                w.type === 'hex' &&
                w.key === this.wallet.key
          )
      }
    },
    async initData () {
      this.currentAccount.amount = this.currentAccount.amount
        ? this.currentAccount.amount
        : 0

      this.sendAmount = 100
      this.getStakingObject()
      this.action = 'Stake'
      // this.changeAmount()
      /*
      if (this.stakes.length === 0) {
        this.tab = 'stake'
      }
      let stepParam = this.$route.params.step
      if (stepParam !== undefined) {
      // console.log('step staking = ', stepParam)
        let highestHEXAccount = this.$store.state.highestHEXAccount.wallet
        this.$store.state.currentwallet.wallet = highestHEXAccount
        this.currentAccount = highestHEXAccount
        this.params = this.$store.state.highestHEXAccount.params
        this.slider = 100
        this.changeSlider()
        this.stakePeriod = 10
        this.changeSlider()
        this.step = parseInt(stepParam)
        this.tab = 'stake'
      }
      if (eth.isPrivKeyValid(this.currentAccount.privateKey)) {
        this.privateKey.key = this.currentAccount.privateKey
        this.isPrivateKeyEncrypted = false
      } else {
        this.isPrivateKeyEncrypted = true
      }
      if (this.params.tokenID === 'hex' && this.currentAccount < 1) {
        this.condition = 1
      } else if (this.params.tokenID === 'eth' && this.currentAccount <= 0) {
        this.condition = 1
      }
      let stakedAmounts = 0
      if (this.params.tokenID === 'hex') {
        let totalBalance = (await eth.getCurrencyBalanceP(stakingContract, volentixContract)).toString().split(' ')[0]
        let globalAmnts = (await eth.getTable(stakingContract, stakingContract, 'globalamount'))[0]
        let totalStake = globalAmnts.currently_staked.split(' ')[0]
        let totalSubsidy = globalAmnts.cumulative_subsidy.split(' ')[0]
        this.allocatable = +totalBalance - (+totalStake + +totalSubsidy)
        // console.log('allocatable', this.allocatable)
        this.stakes = []
        this.stakes = await eth.getTable(stakingContract, this.params.accountName, 'accountstake')
        this.stakes.map(s => {
          s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 1) / 1
          s.stake_amount = Math.round(+s.amount.split(' ')[0] * 1) / 1

          s.stake_done = new Date(s.unlock_timestamp * 1000)
          s.time_left = date.getDateDiff(s.stake_done, Date.now(), 'days')

          let counter = 1
          /*
          Any better solution
          this.estimatedReward  /  this.sendAmount * 100 =  (1 + this.stakePeriod / 10.0) x this.stakePeriod
          x = this.stakePeriod
          Solution: d/dx((0.1 x + 1) x) = 0.2 x + 1
          this.estimatedReward  /  this.sendAmount * 100  = 0.1 (x^2 + 10 x)
          */
      /*
          while (counter <= 10) {
            let period = this.getPeriod(s.subsidy, s.stake_amount, counter)
            if (period) {
              s.stake_period = period * this.period_duration
              break
            }
            counter++
          }
          s.stake_date = new Date((s.unlock_timestamp - s.stake_period * 24 * 60 * 60) * 1000)
          s.time_left_percentage = ((date.getDateDiff(s.stake_done, Date.now(), 'days') / s.stake_period) * 100).toFixed(2)
          stakedAmounts += +s.stake_amount
        })

        this.setTimers()
        this.currentAccount.staked = stakedAmounts
        */
      this.$set(this.currentAccount, 'staked', 'pending')
      this.currentAccount.staked = await Lib.getHexStake(
        this.currentAccount.key
      )
    },

    setTimers () {
      this.timers.forEach((timerObject) => {
        clearInterval(timerObject)
      })
      const self = this
      this.timers = []
      this.stakes.map((stake, i) => {
        let totalSeconds = date.getDateDiff(
          stake.stake_done,
          Date.now(),
          'seconds'
        )
        const setTimer = () => {
          let days = --totalSeconds / 86400
          let hours = (days - parseInt(days)) * 24
          let minutes = (hours - parseInt(hours)) * 60
          let seconds = Math.round((minutes - parseInt(minutes)) * 60)
          self.stakes[i].timer = {
            text:
              parseInt(days) +
              'd ' +
              parseInt(hours) +
              'h ' +
              parseInt(minutes) +
              'm ' +
              seconds +
              's'
          }

          self.$set(self.stakes, i, self.stakes[i])
        }
        setTimer()
        this.timers.push(setInterval(setTimer, 1000))
        return stake
      })
    },
    sliderToPercent (percent) {
      this.slider = percent
      // this.changeSlider()
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
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(
        this.currentAccount.privateKeyEncrypted
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
    },
    stakeHex () {
      this.ErrorMessage = false
      this.spinnerVisible = true
      let data = {
        gasData: this.txObj,
        txData: this.txObj.data
      }

      Lib.send(
        'eth',
        'hex',
        this.txObj.from,
        this.txObj.to,
        0,
        data,
        this.currentAccount.privateKey,
        ''
      )
        .then(async (result) => {
          if (result.success) {
            this.transactionError = false
            this.transactionId = result.transaction_id
            this.showMessage =
              'Transaction submitted. Current status: Pending. <a href="https://etherscan.io/tx/' +
              this.transactionId +
              '" target="_blank">Block explorer</a>'
            this.step = 4
            this.status = 'pending'
            let status = await Lib.checkEvmTxStatus(this.transactionId, 'eth')
            if (status) {
              this.showMessage =
                'Transaction submitted. Current status: Sucessful. <a href="https://etherscan.io/tx/' +
                this.transactionId +
                '" target="_blank">Block explorer</a>'
              this.status = 'success'
              this.$store.state.currentwallet.userData.hexStakes = {}
            } else {
              this.showMessage =
                'Transaction submitted. Current status: Failed. <a href="https://etherscan.io/tx/' +
                this.transactionId +
                '" target="_blank">Block explorer</a>'
              this.status = 'failed'
            }

            this.initData()
            this.spinnerVisible = false
            initWallet()
          } else {
            this.transactionError = true
            this.ErrorMessage = 'An error occured'
          }
        })
        .catch((error) => {
          this.spinnerVisible = false
          this.transactionError = true
          this.ErrorMessage = error.message
        })
    },
    async sendTransaction () {
      try {
        const transaction = {}
        this.transactionError = false
        this.transactionId = transaction.transaction_id
        this.showMessage =
          'Congratulations, your transactions have been recorded on the blockchain. You can check it on this <a href="https://bloks.io/transaction/' +
          this.transactionId +
          '" target="_blank">block explorer</a>'
        this.step = 4
        this.initData()
        this.spinnerVisible = true
        initWallet()
      } catch (error) {}
      this.spinnerVisible = false
    },
    displayError (error, freeCpu = false, actions, message = null) {
      if (error.message.includes('stake amount is too low')) {
        this.transactionError = false
        this.ErrorMessage =
          'Your HEX stake amount is too low, you need at least 1000 HEX to stake.'
      } else if (error.message.includes('maximum billable CPU time')) {
        if (freeCpu) {
          this.payForUserCPU(actions, message)
        } else {
          this.ErrorMessage =
            'Your EOS account does not have enough CPU staked to process the transaction.'
          this.transactionError = true
        }
      } else if (error.message.includes('has insufficient ram')) {
        this.transactionError = true
        this.ErrorMessage =
          'Your EOS account does not have enough RAM staked to process the transaction.'
      } else {
        this.transactionError = true
        this.ErrorMessage = 'Unknown Error: ' + error
      }
    },
    async unStakeHEX () {
      // let message = 'Successfully unstaked'
      try {
        this.initData()

        initWallet(this.currentAccount.name)
      } catch (error) {
        //  this.displayError(error, true, actions, message)
      }
    },
    formatAmountString () {
      let numberOfDecimals = 0
      let stringAmount = (
        Math.round(
          +this.sendAmount * Math.pow(10, this.currentAccount.precision)
        ) / Math.pow(10, this.currentAccount.precision)
      ).toString()
      const amountParsed = stringAmount.split('.')
      if (amountParsed && amountParsed.length > 1) {
        numberOfDecimals = amountParsed[1].length
      } else {
        stringAmount += '.'
      }
      for (
        ;
        numberOfDecimals < this.currentAccount.precision;
        numberOfDecimals++
      ) {
        stringAmount += '0'
      }
      return stringAmount + ' ' + this.params.tokenID.toUpperCase()
    }
  },
  mixins: [Formatter]
}
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.q-tabs {
  display: none;
}
.summary-data /deep/ h1,
.summary-data /deep/ h3,
.summary-data /deep/ h2 {
  font-size: 20px;
  line-height: 1rem;
}
.summary-data /deep/ picture{
display: none;
  /* margin-top: -200px; */
}
.summary-data /deep/ h1 {
  font-weight: 700;
}
.dark-theme .summary-data {
  color: white;
}
.dark-theme .summary-wrapper {
  color: white;
}
.summary-data /deep/ table,
.summary-data /deep/ .table {
  width: 100% !important ;
}
.summary-data /deep/ .lead {
  margin-top: 40px;
}
.summary-data /deep/ p,
.summary-data /deep/ table,
.summary-data /deep/ .table,
.summary-data /deep/ tbody {
  font-size: 16px !important;
  line-height: 1.7;
}

.summary {
  border: 1px solid #c1c0c0;
  width: fit-content;
}
.q-stepper__step:nth-child(n + 2) {
  max-width: 600px;
}
.chain-tools-wrapper {
  padding: 0px 0%;
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
                padding-right: 21px;
                min-width: 36px;
                margin-left: -15px;
                .q-item__label + .q-item__label {
                  margin-top: 0px;
                }
              }
            }
          }
        }
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
        &__eth-to-hex-convertor {
          background-color: #fff;
          margin-bottom: 10px;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          padding: 0%;
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
          .staked-wrapper {
            padding: 20px;
            @media screen and (min-width: 1024px) {
              padding: 30px 0px;
            }
            .item-wrapper {
              margin-bottom: 10px;
            }
            .date {
              font-size: 10px;
              @media screen and (min-width: 1024px) {
                font-size: 20px;
              }
            }
            .total {
              $purple: #6c0dcb;
              font-size: 10px;
              color: $purple !important;
              @media screen and (min-width: 1024px) {
                font-size: 24px;
                font-weight: $bold;
              }
              strong {
                color: $purple !important;
              }
            }
            .item-wrapper--row {
              height: 35px;
              @media screen and (min-width: 1024px) {
                height: 50px;
              }
            }
            .col {
              color: #b0b0b0;
              font-size: 10px;
              @media screen and (min-width: 1024px) {
                font-size: 16px;
              }
              font-family: $Titillium;
              font-weight: $regular;
              strong {
                font-weight: $bold;
              }
            }
            .border {
              border: 1px solid rgba(#707070, 0.09);
              border-radius: 10px;
              height: 100%;
              padding: 10px;
            }
          }
          .q-tabs {
            box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
          }
          /deep/ .q-tab__content {
            width: 100%;
            height: 50px;
            .q-tab__label {
              color: #b0b0b0;
              font-size: 16px !important;
              text-transform: capitalize;
              // margin-top: -5px;
              font-family: $Titillium;
              font-weight: $regular;
            }
            .q-tab__indicator {
              height: 4px;
            }
          }
          /deep/ .q-tab--active {
            .q-tab__indicator {
              color: #7272fa !important;
            }
            .q-tab__label {
              color: #7272fa;
              font-weight: $bold;
            }
          }
          /deep/ .q-tab-panel {
            padding: 0px;
          }
          /deep/ .q-tabs--dense .q-tab {
            padding: 0px;
          }
          /deep/ .q-stepper__step {
            position: relative;
            .q-stepper__tab {
              padding: 12px 14px;
            }
            .q-stepper__step-inner {
              padding: 0 14px 12px 50px;
            }
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
              padding-top: 0px;
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
                // background: #FFB200 !important;
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
          .content__success {
            border: 2px solid #00d0ca;
            padding: 10px 15px;
            border-radius: 20px;
            background-color: #fff;
            box-shadow: 0px 5px 10px 0px rgba(black, 0.1);
            position: relative;
            a {
              display: block;
              margin-top: 10px;
            }
            .success_icon {
              display: block;
              margin: auto;
              margin-top: -50px;
              margin-bottom: -10px;
              width: 80px;
            }
          }
          .content__failed {
            border: 2px solid #ffb200;
            padding: 10px 15px;
            border-radius: 20px;
            background-color: #fff;
            box-shadow: 0px 5px 10px 0px rgba(black, 0.1);
            position: relative;
            a {
              display: block;
              margin-top: 10px;
            }
            .failed_icon {
              display: block;
              margin: auto;
              margin-top: -50px;
              margin-bottom: -10px;
              width: 80px;
            }
          }
          .--subtitle {
            font-size: 17px;

            font-family: $Titillium;
            font-weight: $regular;
            line-height: 20px;
            margin-top: 10px;
            margin-bottom: 10px;
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
              // border-bottom: 1px solid;
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
/deep/ .ellipsis_important {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  max-width: 145px;
}
.current-stake-balanca {
  padding: 10px;
  border-radius: 10px;
  max-width: 337px;
  margin-top: 5px;
  margin-left: 2px;
  transform: scale(0.9);
  @media screen and (min-height: 700px) {
    margin-left: 25px;
  }
  @media screen and (min-height: 760px) {
    margin-left: 37px;
  }
}
.summary-wrapper {
  margin-top: -5px;
  border-radius: 8px;
}
.dark-theme {
  .chain-tools-wrapper--list .list-wrapper--chain__eth-to-hex-convertor {
    /deep/ .q-tab-panel {
      background-color: #04111f;
    }
  }
  .chain-tools-wrapper--list .list-wrapper .select-input {
    /deep/
      .q-field__control
      .q-field__native
      .q-item
      .q-item__section
      .q-item__label
      + .q-item__label {
      color: #fff !important;
    }
  }
  .current-stake-balanca {
    border: 1px solid #627797;
    padding: 10px;
    border-radius: 10px;
    max-width: 337px;
    margin-top: 5px;
    margin-left: 2px;
    transform: scale(0.9);
    @media screen and (min-height: 700px) {
      margin-left: 25px;
    }
    @media screen and (min-height: 760px) {
      margin-left: 37px;
    }
  }
  .summary-wrapper {
    border: 1px solid #627797;
    margin-top: -5px;
    border-radius: 8px;
  }
  .chain-tools-wrapper--list
    .list-wrapper--chain__eth-to-hex-convertor
    .--amount {
    color: #fff !important;
  }
  .slider-holder.stake-period {
    color: #fff !important;
  }
  .hex-converter-wrapper--list .list-wrapper--chain__eth-to-hex-convertor {
    background-color: #04111f;
  }
  .hex-converter-wrapper--list
    .list-wrapper--chain__eth-to-hex-convertor--title {
    color: #fff;
  }
  .hex-converter-wrapper--list
    .list-wrapper--chain__eth-to-hex-convertor
    .--subtitle {
    color: #ccc;
  }
  .hex-converter-wrapper--list
    .list-wrapper--chain__eth-to-hex-convertor
    .--amount {
    color: #fff !important;
  }
}
/deep/ .q-stepper {
  &.q-dark {
    background: #04111f;
    .q-stepper__title {
      color: #ccc !important;
    }
  }
}
</style>
