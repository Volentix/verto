<template>
  <div class="services-wrapper" :class="{'loggedin': $store.state.currentwallet.loggedIn }">
   <q-table
            flat
            :dark="$store.state.settings.lightMode === 'true'"
            table-style="box-shadow: none;"
            title="Assets in portfolio"
            :data="datasCoins"
            :columns="columns"
            :loading="datasCoins.length === 0"
            :pagination="initialPagination"
            row-key="asset"
            :sort-method="customSort"
          >
            <template v-slot:body-cell-asset="props">
              <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                  <span class="imgs q-mr-sm">
                    <img :src="'https://token.enzyme.finance/'+props.row.icon" alt="">
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
                    <span class="pair text-bold" :class="{'text-pink-12': parseFloat(props.row.dailyChange) < 0, 'text-green-6 plus-sign': parseFloat(props.row.dailyChange) > 0}">{{formatNumber(props.row.dailyChange, 2) + "%"}}</span>
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
            <template v-slot:body-cell-allocation="props">
              <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                  <span class="column pairs">
                    <span class="pair text-bold">{{formatNumber(props.row.allocation, 2)}}%</span>
                  </span>
                </div>
              </q-td>
            </template>
          </q-table>

    <div class="row" v-if="staiderData && false">
      <div class="col-12 q-p-on-xs">
        <div class="services-wrapper--header flex  q-pl-md q-pr-md">
          <div class="sif-logo flex items-center">
            <img :src="require('../../../assets/img/sif.png')" alt="">
            <q-select
              borderless
              v-model="selectedFund"
              :options="fundAdressOptions"
              option-disable="inactive"
              class="qselect_style"
              :dark="$store.state.settings.lightMode === 'true'"
              options-selected-class="text-deep-orange"
            >
              <template v-slot:option="scope">
                <q-item @click="goToFund(scope.opt.value)" v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <img :src="require('../../../assets/img/sif.png')" width="40" alt="">
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected>
                <q-item v-if="selectedFund">
                  <q-item-section>
                    <q-item-label v-html="selectedFund.label" />
                    <q-item-label caption>{{ selectedFund.description }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-else> </q-item>
              </template>
            </q-select>
          </div>

          <div class="asset-managment flex flex-center items-center">
            <div class="asset column items-start">
              <span class="title">Assets under management</span>
              <span class="value" v-if="Object.keys(staiderData.calculations).length > 0">{{formatNumber(staiderData.calculations[currentCurrency].gav, 2)}} {{currency.toUpperCase()}}</span>
              <span class="value" v-else>{{'N/A'}}</span>
            </div>
            <div class="shared-price column q-pl-xl q-pr-xl">
              <span class="title">Share price</span>
              <span class="value" v-if="Object.keys(staiderData.calculations).length > 0">{{formatNumber(staiderData.calculations[currentCurrency].price, 2)}} {{currency.toUpperCase()}}</span>
              <span class="value" v-else>{{'N/A'}}</span>
            </div>
            <div class="daily-change column">
              <span class="title">Daily change</span>
              <span class="value text-bold" v-if="Object.keys(staiderData.calculations).length > 0" :class="{'text-green-7': change24h > 0,'text-pink-12': change24h < 0}">{{change24h>0 ? '+' + change24h : change24h}} %</span>
              <span class="value" v-else>{{'N/A'}}</span>
            </div>
          </div>
          <div v-if="false" class="diposit_withdraw_wrapper q-pt-md">
            <q-btn color="black" unelevated no-caps label="Deposit" class="rounded-borders deposit" @click="openPopup('depositBtn')"/>
            <q-btn label="Withdraw" unelevated no-caps @click="openPopup('withdrawBtn')" class="withdraw q-ml-sm"/>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-9 q-pr-md q-p-on-xs q-mt-md">
        <div class="services-wrapper--portfolio overflow-hidden">
          <div class="q-p-on-xs full-width">
            <div class="section-title">Share Price({{currency}})</div>
            <ChartFund height="300" chartColor="#2ec183" :fundID="fundID" />
          </div>

          <br>

        </div>
      </div>
      <div class="col-12 col-md-3 q-p-on-xs q-mt-md">
        <div class="services-wrapper--share-price column q-pa-md q-pt-lg q-pb-lg">
          <div class="title text-bold q-mb-lg">Share Price Metrics ({{currency.toUpperCase()}})</div>
          <div v-if="sharePriceMetrics" class="row test">
            <div class="col-3 text-left text-bold">MTD</div>
            <div class="col-9 text-right" v-if="Object.keys(sharePriceMetrics).length > 0">{{formatNumber((sharePriceMetrics.monthToDate[currentCurrency].price*100), 2)}} %</div>
            <div class="col-9 text-right" v-else>N/A</div>
            <div class="col-3 text-left text-bold">QTD</div>
            <div class="col-9 text-right" v-if="Object.keys(sharePriceMetrics).length > 0">{{formatNumber((sharePriceMetrics.quarterToDate[currentCurrency].price*100), 2)}} %</div>
            <div class="col-9 text-right" v-else>N/A</div>
            <div class="col-3 text-left text-bold">YTD</div>
            <div class="col-9 text-right" v-if="Object.keys(sharePriceMetrics).length > 0">{{formatNumber((sharePriceMetrics.yearToDate[currentCurrency].price*100), 2)}} %</div>
            <div class="col-9 text-right" v-else>N/A</div>
            <div class="col-12"><hr style="opacity: 0; height: 40px"></div>
            <div class="col-6 text-left text-bold">Best Month</div>
            <div class="col-6 text-right" v-if="Object.keys(sharePriceMetrics).length > 0">{{formatNumber((sharePriceMetrics.bestMonth[currentCurrency].price*100), 2)}} %</div>
            <div class="col-6 text-right" v-else>N/A</div>
            <div class="col-6 text-left text-bold">Average Month</div>
            <div class="col-6 text-right" v-if="Object.keys(sharePriceMetrics).length > 0">{{formatNumber((sharePriceMetrics.worstMonth[currentCurrency].price*100), 2)}} %</div>
            <div class="col-6 text-right" v-else>N/A</div>
            <div class="col-6 text-left text-bold">Worst Month</div>
            <div class="col-6 text-right" v-if="Object.keys(sharePriceMetrics).length > 0">{{formatNumber((sharePriceMetrics.averageMonth[currentCurrency].price*100), 2)}} %</div>
            <div class="col-6 text-right" v-else>N/A</div>
            <div v-if="false" class="col-6 text-left text-bold">Positive Months</div>
            <div v-if="false" class="col-6 text-right">4 of 6</div>
            <div v-if="false" class="col-6 text-left text-bold">Track Record</div>
            <div v-if="false" class="col-6 text-right">6 months</div>
            <div class="col-12"><hr style="opacity: 0; height: 20px"></div>
            <div v-if="false" class="col-6 text-left text-bold">Volatility</div>
            <div v-if="false" class="col-6 text-right">105.43 %</div>
          </div>
        </div>
      </div>
      <div class="q-p-on-xs full-width q-mb-xl q-pb-lg">
        <div class="col-12 q-mt-xl bordered-class">
          <q-table
            flat
            :dark="$store.state.settings.lightMode === 'true'"
            table-style="box-shadow: none;"
            :title="'Monthly Returns ('+currency.toUpperCase()+')'"
            :data="MonthlyReturnsData"
            :columns="MonthlyReturnscolumns"
            row-key="year"
          />
        </div>
      </div>
      <div class="q-p-on-xs full-width" v-if="false">
        <div class="col-12 q-mt-xl bordered-class q-pa-md q-mb-xl">
          <div class="section-title">Fund Diligence</div>
          <div class="fund-wraper fact-sheet--btn q-mb-md">
            <q-btn unelevated :flat="!factSheetToggle" text-color="black" class="full-width togglebtn" :color="factSheetToggle ? 'grey-4':''" @click="factSheetToggle = !factSheetToggle">
                <div class="flex justify-between items-center full-width">
                    Fact Sheet
                    <q-icon :name="factSheetToggle ? 'keyboard_arrow_up':'keyboard_arrow_right'" />
                </div>
            </q-btn>
            <div class="fact-sheet--table bordered-class q-pa-md q-mt-md" v-if="factSheetToggle">
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Fund name</div>
                  <div class="col col-12 col-md-6">SIF Staider Index Fund</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Inception</div>
                  <div class="col col-12 col-md-6">2020/04/29 20:46 GMT+0</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Status</div>
                  <div class="col col-12 col-md-6">Active</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Protocol version</div>
                  <div class="col col-12 col-md-6">1.1.0</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Authorized exchanges</div>
                  <div class="col col-12 col-md-6">
                      <a href="https://etherscan.io/address/0x759aD2faF96Ea898D00C924beF110beC22032c05" target="_blank">Melon Engine (v2)</a>,
                      <a href="https://etherscan.io/address/0x33D9a2a17A237c4815586B099F49bCE0005a927f" target="_blank">Kyber Network</a>, <a href="https://etherscan.io/address/0xFbAD8B6C66153a59f829c6a0903E4Be2C6e7370C" target="_blank">Uniswap</a>,
                      <a href="https://etherscan.io/address/0xaEc9b76C4e01976C3711125A5A1a2911c0165399" target="_blank">OasisDEX</a>, <a href="https://etherscan.io/address/0x050bf7533993706847a3a34673236e312315bb86" target="_blank">0x (v2.1)</a>,
                      <a href="https://etherscan.io/address/0xA8344Fa62020732Ba280247de5797023C44DdaBA" target="_blank">0x (v3)</a>
                  </div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Investable assets</div>
                  <div class="col col-12 col-md-6">WETH</div>
              </div>
          </div>
          </div>
          <div class="fund-wraper financials--btn q-mb-md">
            <q-btn unelevated :flat="!financialsToggle" text-color="black" class="full-width togglebtn" :color="financialsToggle ? 'grey-4':''" @click="financialsToggle = !financialsToggle">
                <div class="flex justify-between items-center full-width">
                    Financials
                    <q-icon :name="financialsToggle ? 'keyboard_arrow_up':'keyboard_arrow_right'" />
                </div>
            </q-btn>
            <div class="financials--table bordered-class q-pa-md q-mt-md" v-if="financialsToggle">
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Gross asset value (GAV)</div>
                    <div class="col col-12 col-md-6">
                        <span></span><span class=""><span>1,895.6657 WETH</span></span>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Net asset value (NAV)</div>
                    <div class="col col-12 col-md-6">
                        <span></span><span class=""><span>1,894.4175 WETH</span></span>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Total number of shares</div>
                    <div class="col col-12 col-md-6">
                        <span></span><span class=""><span>2,972.4545 </span></span>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Share price</div>
                    <div class="col col-12 col-md-6">
                        <span>&nbsp;&nbsp;&nbsp;</span><span class=""><span>0.6373 WETH</span></span>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Annualized return</div>
                    <div class="col col-12 col-md-6">Too early to tell</div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Annual volatility</div>
                    <div class="col col-12 col-md-6">Too early to tell</div>
                </div>
                <div class="Dictionary__DictionaryDivider-iaFjWf dsHXpj"></div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Management fee</div>
                    <div class="col col-12 col-md-6">2%</div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Performance fee</div>
                    <div class="col col-12 col-md-6">20%</div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Performance fee period</div>
                    <div class="col col-12 col-md-6">90 days</div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Unpaid fees (% of NAV)</div>
                    <div class="col col-12 col-md-6"><span class="">0.0659%</span></div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Start of next performance fee period</div>
                    <div class="col col-12 col-md-6">2021/01/24 21:53 GMT+1</div>
                </div>
            </div>
          </div>
          <div class="fund-wraper contracts--btn q-mb-md">
            <q-btn unelevated :flat="!contractsToggle" text-color="black" class="full-width togglebtn" :color="contractsToggle ? 'grey-4':''" @click="contractsToggle = !contractsToggle">
                <div class="flex justify-between items-center full-width">
                    Contracts
                    <q-icon :name="contractsToggle ? 'keyboard_arrow_up':'keyboard_arrow_right'" />
                </div>
            </q-btn>
            <div class="contracts--table bordered-class q-pa-md q-mt-md" v-if="contractsToggle">
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Manager Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0x978cc856357946F980Fba68Db3B7f0D72E570DA8" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0x978cc856357946F980Fba68Db3B7f0D72E570DA8</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Fund Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0xa9C61f739865E639ac1Fd970564b30C3BD9e5A11" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0xa9C61f739865E639ac1Fd970564b30C3BD9e5A11</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Accounting Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0x81d5409f3283b37976a6b9eC5BaB73f8B5eaE3bE" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0x81d5409f3283b37976a6b9eC5BaB73f8B5eaE3bE</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Fee Manager Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0x94cfdD7EF1B8553ee1fDA4363cEe8184159aa471" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0x94cfdD7EF1B8553ee1fDA4363cEe8184159aa471</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Participation Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0xaC67bD0782155Bcf1734F53fff0e32D30346b489" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0xaC67bD0782155Bcf1734F53fff0e32D30346b489</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Policy Manager Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0xf5fE39C151553F499025dd8eE2Be99C6A5bd2706" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0xf5fE39C151553F499025dd8eE2Be99C6A5bd2706</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Shares Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0xfC14b7257e1d1ef0d2198774c234CFD553877dBc" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0xfC14b7257e1d1ef0d2198774c234CFD553877dBc</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Trading Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0x01c3712F6079765fd4867bc8C50C9116E6D6389f" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0x01c3712F6079765fd4867bc8C50C9116E6D6389f</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Vault Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0xFa237DDB98d3250179411DF9D5b08bB09B6d8F0b" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0xFa237DDB98d3250179411DF9D5b08bB09B6d8F0b</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Registry Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0xb9Cb55C9366a224647B7ff66252b3613185DA0B9" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0xb9Cb55C9366a224647B7ff66252b3613185DA0B9</a>
                    </div>
                </div>
                <div class="row q-mb-sm flex justify-between items-center">
                    <div class="col col-12 col-md-6 text-grey-7">Version Address</div>
                    <div class="col col-12 col-md-6">
                        <a href="https://etherscan.io/address/0x5f9AE054C7F0489888B1ea46824b4B9618f8A711" target="_blank" class="EtherscanLink__OverflowEllipsis-dipLDy dIEbry">0x5f9AE054C7F0489888B1ea46824b4B9618f8A711</a>
                    </div>
                </div>
          </div>
          </div>
          <div class="fund-wraper ruleset--btn q-mb-md">
            <q-btn unelevated :flat="!rulesetToggle" text-color="black" class="full-width togglebtn" :color="rulesetToggle ? 'grey-4':''" @click="rulesetToggle = !rulesetToggle">
                <div class="flex justify-between items-center full-width">
                    Ruleset
                    <q-icon :name="rulesetToggle ? 'keyboard_arrow_up':'keyboard_arrow_right'" />
                </div>
            </q-btn>
            <div class="ruleset--table bordered-class q-pa-md q-mt-md" v-if="rulesetToggle">
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Policy Name</div>
                  <div class="col col-12 col-md-6">Parameter(s)</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">UserWhitelist</div>
                  <div class="col col-12 col-md-6">N/A</div>
              </div>
          </div>
          </div>
          <div class="fund-wraper trade-history--btn q-mb-md">
            <q-btn unelevated :flat="!tradeHistoryToggle" text-color="black" class="full-width togglebtn" :color="tradeHistoryToggle ? 'grey-4':''" @click="tradeHistoryToggle = !tradeHistoryToggle">
                <div class="flex justify-between items-center full-width">
                    Trade History
                    <q-icon :name="tradeHistoryToggle ? 'keyboard_arrow_up':'keyboard_arrow_right'" />
                </div>
            </q-btn>
            <div class="trade-history--table bordered-class q-pa-md q-mt-md" v-if="tradeHistoryToggle">
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Fund name</div>
                  <div class="col col-12 col-md-6">SIF Staider Index Fund</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Inception</div>
                  <div class="col col-12 col-md-6">2020/04/29 20:46 GMT+0</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Status</div>
                  <div class="col col-12 col-md-6">Active</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Protocol version</div>
                  <div class="col col-12 col-md-6">1.1.0</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Authorized exchanges</div>
                  <div class="col col-12 col-md-6">
                      <a href="https://etherscan.io/address/0x759aD2faF96Ea898D00C924beF110beC22032c05" target="_blank">Melon Engine (v2)</a>,
                      <a href="https://etherscan.io/address/0x33D9a2a17A237c4815586B099F49bCE0005a927f" target="_blank">Kyber Network</a>, <a href="https://etherscan.io/address/0xFbAD8B6C66153a59f829c6a0903E4Be2C6e7370C" target="_blank">Uniswap</a>,
                      <a href="https://etherscan.io/address/0xaEc9b76C4e01976C3711125A5A1a2911c0165399" target="_blank">OasisDEX</a>, <a href="https://etherscan.io/address/0x050bf7533993706847a3a34673236e312315bb86" target="_blank">0x (v2.1)</a>,
                      <a href="https://etherscan.io/address/0xA8344Fa62020732Ba280247de5797023C44DdaBA" target="_blank">0x (v3)</a>
                  </div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Investable assets</div>
                  <div class="col col-12 col-md-6">WETH</div>
              </div>
          </div>
          </div>
          <div class="fund-wraper investment-history--btn q-mb-md">
            <q-btn unelevated :flat="!investmentHistoryToggle" text-color="black" class="full-width togglebtn" :color="investmentHistoryToggle ? 'grey-4':''" @click="investmentHistoryToggle = !investmentHistoryToggle">
                <div class="flex justify-between items-center full-width">
                    Investment History
                    <q-icon :name="investmentHistoryToggle ? 'keyboard_arrow_up':'keyboard_arrow_right'" />
                </div>
            </q-btn>
            <div class="investment-history--table bordered-class q-pa-md q-mt-md" v-if="investmentHistoryToggle">
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Fund name</div>
                  <div class="col col-12 col-md-6">SIF Staider Index Fund</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Inception</div>
                  <div class="col col-12 col-md-6">2020/04/29 20:46 GMT+0</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Status</div>
                  <div class="col col-12 col-md-6">Active</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Protocol version</div>
                  <div class="col col-12 col-md-6">1.1.0</div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Authorized exchanges</div>
                  <div class="col col-12 col-md-6">
                      <a href="https://etherscan.io/address/0x759aD2faF96Ea898D00C924beF110beC22032c05" target="_blank">Melon Engine (v2)</a>,
                      <a href="https://etherscan.io/address/0x33D9a2a17A237c4815586B099F49bCE0005a927f" target="_blank">Kyber Network</a>, <a href="https://etherscan.io/address/0xFbAD8B6C66153a59f829c6a0903E4Be2C6e7370C" target="_blank">Uniswap</a>,
                      <a href="https://etherscan.io/address/0xaEc9b76C4e01976C3711125A5A1a2911c0165399" target="_blank">OasisDEX</a>, <a href="https://etherscan.io/address/0x050bf7533993706847a3a34673236e312315bb86" target="_blank">0x (v2.1)</a>,
                      <a href="https://etherscan.io/address/0xA8344Fa62020732Ba280247de5797023C44DdaBA" target="_blank">0x (v3)</a>
                  </div>
              </div>
              <div class="row q-mb-sm flex justify-between items-center">
                  <div class="col col-12 col-md-6 text-grey-7">Investable assets</div>
                  <div class="col col-12 col-md-6">WETH</div>
              </div>
          </div>
          </div>
          <div class="flex justify-center items-center footer-section-services">
            <div class="q-pa-md"><a href="https://dev.staider.finance/#/" target="_blank">About</a></div>
            <div class="q-pa-md"><a href="https://dev.staider.finance/#/" target="_blank">Documentation</a></div>
            <div class="q-pa-md"><a href="https://github.com/avantgardefinance/interface/issues" target="_blank">Report an Issue</a></div>
            <div class="q-pa-md"><span>Last pricefeed update at 2021/01/17 09:00 GMT+1</span></div>
            <div class="q-pa-md">MAINNET</div>
            <div class="q-pa-md">Protocol 1.1.0</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const ccurrency = window.localStorage.getItem('currency') !== '' ? window.localStorage.getItem('currency') : 'USD'
// import ChartVTX from 'components/Chart'
import ChartFund from './ChartFund'
import { date } from 'quasar'

// import ref from 'vue'
export default {
  name: 'PageIndex',
  components: {
    ChartFund
  },
  data () {
    return {
      change24h: 0,
      selectedFund: {
        label: 'Staider Index Fund',
        value: '0x1da7ea480ed3f6a681f3e6069c07adb3eed9d6dd',
        description: 'Denomination coin (DAI)',
        icon: 'mail'
      },
      fundAdressOptions: [
        {
          label: 'Staider Index Fund',
          value: '0x1da7ea480ed3f6a681f3e6069c07adb3eed9d6dd',
          description: 'Denomination coin (DAI)',
          icon: 'mail',
          selected: false
        },
        {
          label: 'SIF STAIDER INDEX FUND',
          value: '0x9b8b0b8730adb767b79d80839215b733c4357e9f',
          // value: '0x52d72486ff3cd1c7406f13d60dbb609ce136df3b',
          description: 'Denomination coin (WETH)',
          icon: 'mail',
          selected: false,
          inactive: false
        },
        {
          label: 'SIF USDC',
          value: '0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a',
          // value: '0x84305d022fbef73f09b382fb59e9e97843ef0951',
          description: 'Denomination coin (USDC)',
          icon: 'mail',
          selected: false,
          inactive: false
        }
      ],
      sharePriceMetrics: null,
      staiderData: null,
      allAssetsData: null,
      factSheetToggle: false,
      financialsToggle: false,
      contractsToggle: false,
      rulesetToggle: false,
      tradeHistoryToggle: false,
      investmentHistoryToggle: false,
      totalAsset: 0,
      currency: window.localStorage.getItem('currency') !== null ? window.localStorage.getItem('currency') : 'usd',
      initialPagination: {
        sortBy: 'value',
        descending: true,
        rowsPerPage: 30
      },
      columns: [
        { name: 'asset', align: 'left', label: 'Asset', field: row => row.name, sortable: true, format: val => `${val}` },
        { name: 'price', align: 'left', label: `Price`, field: row => row.name, sortable: true, format: val => `${val}` },
        { name: 'balance', align: 'left', label: 'Balance', field: row => row.name, sortable: true, format: val => `${val}` },
        { name: 'value', align: 'left', label: `Value`, field: row => row.name, sortable: true, format: val => `${val}` },
        { name: 'dailyChange', align: 'left', label: 'Daily Change', field: row => row.name, sortable: true, format: val => `${val}` }
      ],
      datasCoins: [],
      MonthlyReturnscolumns: [
        { name: 'year', align: 'left', label: '', field: 'year', sortable: false },
        { name: 'jan', align: 'left', label: 'Jan', field: 'jan', sortable: false },
        { name: 'feb', align: 'left', label: 'Feb', field: 'feb', sortable: false },
        { name: 'mar', align: 'left', label: 'Mar', field: 'mar', sortable: false },
        { name: 'apr', align: 'left', label: 'Apr', field: 'apr', sortable: false },
        { name: 'may', align: 'left', label: 'May', field: 'may', sortable: false },
        { name: 'jun', align: 'left', label: 'Jun', field: 'jun', sortable: false },
        { name: 'jul', align: 'left', label: 'Jul', field: 'jul', sortable: false },
        { name: 'aug', align: 'left', label: 'Aug', field: 'aug', sortable: false },
        { name: 'sep', align: 'left', label: 'Sep', field: 'sep', sortable: false },
        { name: 'oct', align: 'left', label: 'Oct', field: 'oct', sortable: false },
        { name: 'nov', align: 'left', label: 'Nov', field: 'nov', sortable: false },
        { name: 'dec', align: 'left', label: 'Dec', field: 'dec', sortable: false }
      ],
      MonthlyReturnsData: [
        { year: '2021', jan: '-', feb: '-', mar: '-', apr: '-', may: '-', jun: '-', jul: '-', aug: '-', sep: '-', oct: '-', nov: '-', dec: '-' }
      ],
      fundID: ''
    }
  },
  async created () {
    await this.requestDataFunc(this.$route.params.fundID)
    this.getSharePrice(this.$route.params.fundID)
  },
  computed: {
    currentCurrency () {
      let c = window.localStorage.getItem('currency')
      return (c || 'usd').toUpperCase()
    }
  },
  methods: {
    /*
    goToFund (fundAdress) {
      this.selectedFund = this.fundAdressOptions.filter(fund => fund.value === fundAdress)[0]
      console.log('this.selectedFund', this.selectedFund, this.fundID, fundAdress)
      if (this.fundID !== fundAdress) {
        this.$router.push({
          path: '/app/staider-index-funds/' + fundAdress
        })
      }
      window.location.reload()
      // this.requestDataFunc(fundAdress)
    }, */
    async requestDataFunc (fundID) {
      // this.selectedFund = this.fundAdressOptions.filter(fund => fund.value === fundID)[0]
      new Promise((resolve, reject) => {
        const enzymeEndPoint = 'https://data.enzyme.finance/api/fund/metrics/current?address=' + fundID
        const enzymeAssetEndPoint = 'https://services.enzyme.finance/api/enzyme/asset/list'
        this.$axios.get(enzymeAssetEndPoint).then(assets => {
          this.allAssetsData = assets.data.data
          this.$axios.get(enzymeEndPoint).then(enzyme => {
            this.staiderData = enzyme.data.data
            resolve('done')
          })
        })
      }).then(status => {
        let assetsBalances = Object.entries(this.staiderData.holdings)
        let assetsPrices = Object.entries(this.staiderData.assetValues[this.currentCurrency])
        this.datasCoins = []
        let totalAsset = 0
        assetsPrices.map(p => {
          totalAsset += p[1]
        })
        let assetsNamesArray = []
        assetsBalances.map(holding => {
          let assetData = this.allAssetsData.find(asset => asset.id === holding[0])
          assetsNamesArray.push({
            address: holding[0],
            type: assetData.symbol.toLowerCase(),
            chain: 'eth',
            balance: holding[1]
          })
        })
        this.$store.dispatch('tokens/getTokensMarketsDataBySymbols', assetsNamesArray).then((marketsData) => {
          marketsData.map(marketData => {
            let holding = assetsNamesArray.find(a => a.type === marketData.symbol)
            let contractAdress = holding.address
            let balance = holding.balance
            let price = marketData.current_price
            let balanceValue = price * balance
            let change24h = marketData.price_change_percentage_24h
            let allocation = ((price * balance / totalAsset) * 100).toFixed(5)
            this.datasCoins.push(
              { asset: marketData.symbol, assetThicker: marketData.symbol, assetName: marketData.name, balance: balance, price: price, dailyChange: change24h, value: balanceValue, allocation: isNaN(allocation) ? 0 : allocation, currency: window.localStorage.getItem('currency').toUpperCase(), icon: contractAdress }
            )
            this.updateFundData()
          })
        })
      })

      const enzymeMetricsEndPoint = 'https://data.enzyme.finance/api/fund/metrics/monthly?address=' + fundID
      this.$axios.get(enzymeMetricsEndPoint).then(metrics => {
        this.sharePriceMetrics = metrics.data.data
        // console.log('this.sharePriceMetrics', this.sharePriceMetrics.monthly)
        // let testObject = { name: 'ucef' }

        if (undefined !== this.sharePriceMetrics.monthly) {
          this.sharePriceMetrics.monthly.map(m => {
            const unixTime = m.timestamp
            const timeStamp = new Date(unixTime * 1000)
            const correctMonth = date.subtractFromDate(timeStamp, { days: 28 })
            // const correctMonth = timeStamp
            const monthDate = date.formatDate(correctMonth, 'MMM')
            if (m.hasOwnProperty('performance')) {
              // const monthYearDate = date.formatDate(correctMonth, 'MMM YYYY')
              const monthReturn = this.formatNumber((m.performance[this.currentCurrency].price * 100).toFixed(2), 2) + '%'
              // console.log(m.timestamp, monthDate, monthYearDate, monthReturn)
              // testObject.username = 'bitardev'
              this.MonthlyReturnsData[0][monthDate.toLowerCase()] = monthReturn
            } else {
              this.MonthlyReturnsData[0][monthDate.toLowerCase()] = '-'
            }
            this.updateFundData()
          })
        }
      })
    },
    updateFundData () {
      if (this.$store.state.investment.fundData) {
        let data = this.$data
        data.currentCurrency = 'USD'
        this.$store.state.investment.fundData[this.$route.params.fundID] = data
      } else {
        this.$store.state.investment.fundData = {

        }
        let data = this.$data
        data.currentCurrency = 'USD'
        this.$store.state.investment.fundData[this.$route.params.fundID] = data
      }
    },
    customSort (rows, sortBy, descending) {
      const data = [ ...rows ]
      // console.log('sortBy', sortBy)
      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b
          if (sortBy === 'balance') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else if (sortBy === 'price') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else if (sortBy === 'value') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }

      return data
    },
    openPopup (id) {
      document.getElementById(id).click()
    },
    getSharePrice (fundID) {
      let endPoint = 'https://services.enzyme.finance/api/enzyme/fund/metrics/range?address=' + fundID + '&range=1d'
      this.$axios.get(endPoint)
        .then(response => {
          let sharePrice = response.data.data
          if (Object.keys(sharePrice[0].calculations).length > 0) {
            let yesterdayPrice = sharePrice[0].calculations[this.currentCurrency].price
            let todayPrice = sharePrice[sharePrice.length - 1].calculations[this.currentCurrency].price
            this.change24h = (((todayPrice - yesterdayPrice) / yesterdayPrice) * 100).toFixed(2)
            this.updateFundData()
          }
        })
    },
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/colors.scss";
  @import "assets/styles/fonts.scss";
  .services-wrapper{

    max-width: 1260px;
    margin-left: auto;
    margin-right: auto;
    &--header{
      border-bottom: 1px solid #CCC;
      border-radius: 0px;
      min-height: 60px;
      margin-bottom: 10px;
      padding-top: 10px;
      padding-bottom: 15px;
      @media screen and (max-width: 768px) {
        .asset-managment{
          justify-content: flex-start;
          margin-top: 20px;
          .value{
            text-align: left;
          }
          .asset{
            padding-right: 30px !important;
            margin-bottom: 20px;
          }
          .shared-price{
            padding-left: 0px !important;
            padding-right: 20px !important;
            padding-bottom: 20px !important;
          }
        }
      }
      .sif-logo{
        font-family: $Comfortaa;
        font-weight: $bold;
        font-size: 15px;
        color: $textColor1;
        img{
          max-width: 40px;
          margin-right: 10px;
          transform: scale3d(1,1,1);
        }
      }
      .asset{}
      .title{
        font-family: $Comfortaa;
        font-weight: $bold;
        font-size: 15px;
        color: $textColor1;
        padding-bottom: 5px;
      }
      .value{
        text-align: right;
        font-family: $Comfortaa;
        font-size: 14px;
        font-weight: $regular;
        color: $textColor1;
      }
      .shared-price{}
      .daily-change{
        @media screen and (max-width: 768px) {
          padding-bottom: 20px !important;
        }
        .title{}
        .value{
          font-weight: $bold;
        }
      }
    }
    &--portfolio{
      border: 1px solid #CCC;
      border-radius: 10px;
      min-height: 440px;
      margin-bottom: 0px;
    }
    &--share-price{
      border: 1px solid #CCC;
      border-radius: 10px;
      min-height: 440px;
      margin-bottom: 0px;
      .title{
        font-family: $Comfortaa;
        font-size: 18px;
        font-weight: $bold;
        color: $textColor1;
      }
      .row{
        .text-left{
          font-family: $Comfortaa;
          font-size: 16px;
          font-weight: $bold;
          color: $textColor1;
        }
        .text-right{
          font-family: $Comfortaa;
          font-size: 14px;
          font-weight: $regular;
          color: $textColor1;
        }
      }
    }
    .body-table-col .imgs {
      margin-top: 5px;
      min-width: 30px;
    }
    .body-table-col .imgs img {
      border-radius: 40px;
      height: 25px;
    }
  }
  .overflow-hidden{
    overflow: hidden;
    position: relative;
  }
  .section-title{
    margin-bottom: 0px;
    margin-top: 30px;
    padding-left: 15px;
  }
  .bordered-class{
    border: 1px solid #CCC;
    border-radius: 10px;
    overflow: hidden;
  }
  .togglebtn{
    text-transform: initial !important;
  }
  .footer-section-services{
    border-top: 1px dashed #CCC;
    padding-top: 10px;
    margin-top: 40px;
    a{
      color: #000;
      text-transform: uppercase;
      font-family: $Comfortaa;
      font-size: 12px;
    }
    @media screen and (max-width: 768px) {
      div{
        padding: 5px 10px;
      }
      a{
        padding: 5px 0px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .q-p-on-xs{
      padding: 0px 20px;
      // margin-bottom: 20px;
    }
  }
</style>
<style>
  .q-table__title, .section-title{
    font-family: 'Libre Franklin', sans-serif;
    font-weight: bold;
    color: #001644;
    font-size: 20px;
    margin-top: 10px;
  }
  .dark_theme .q-table__title, .section-title{
    color: #FFF;
  }
  .plus-sign:before{
    content: '+';
  }
</style>

<style lang="scss" scoped>
  @import "assets/styles/colors.scss";
  .diposit_withdraw_wrapper{
    position: absolute;
    right: 0px;
    top: 0px;
    button{
      background: #0054ee !important;
      background: linear-gradient(to right, #002044 0%, #0054ee 100%) !important;
      font-family: 'Comfortaa', cursive !important;
      padding: 5px 10px !important;
      &.deposit{
        color: #FFF !important;
      }
      &.withdraw{
        color: #002044 !important;
        border: 1px solid rgba(#002044, .1) !important;
        background: transparent !important;
      }
    }
  }
  .dark_theme{
    .diposit_withdraw_wrapper{
      /deep/ button{
        &.withdraw{
          border: 1px solid rgba(white, .2) !important;
          color: #FFF !important;
          background: transparent !important;
        }
      }
    }
    .title,
    .value{
      color: #FFF;
    }
    .title{
      opacity: .7;
    }
    .q-select /deep/ .q-item__label--caption {
      color: inherit;
      opacity: .5;
    }
    .q-table__card /deep/ .q-table__title,
    .section-title{
      color: #FFF;
      opacity: .7;
    }
    .row{
      .text-left,
      .text-right{
        color: #FFF;
      }
    }
    .services-wrapper--header,
    .services-wrapper--portfolio,
    .services-wrapper--share-price,
    .bordered-class{
      border-color: $darkblueborder;
    }
    /deep/ .q-table__title,
    /deep/ .section-title{
        color: #FFF !important;
    }
  }
  .services-wrapper--header{
      @media screen and (max-width: 768px) {
        padding-left: 0px;
        padding-right: 0px;
      }
  }

  .metamask_connected{
    .sif-logo{
      @media screen and (max-width: 768px) {
        .qselect_style{
          width: 82%;
        }
        margin-top: 55px;
        margin-left: -6px;
        margin-right: -20px;
        border-radius: 10px;
        padding-left: 10px;
        width: calc(100% + 2px);
        background: rgba(white, .05);
      }
    }
    .asset-managment{
      padding-right: 250px;
      @media screen and (max-width: 768px) {
        padding-right: 0px;
        padding-top: 0px;
      }
    }
  }
</style>
<style>
@media only screen and (max-width: 500px) {

.loggedin .sif-logo.flex.items-center {
    margin-top: 140px;
}
.loggedin  .currency-select {
    display:none !important
}
.loggedin  .diposit_withdraw_wrapper {
    width: 100%;
    margin-top: 61px;
    text-align: center;
}
}
.dark_theme .diposit_withdraw_wrapper button.withdraw{
  border: 1px solid rgba(#002044, .5) !important;
  color: #FFF !important;
  background: transparent !important;
}
</style>
