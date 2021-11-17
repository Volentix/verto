<template>
<div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" class="history-component" style="height: 100%;">

  <div class="transaction-wrapper" style="height: 100%;">
    <div :class="!($q.platform.is.mobile||$isbex)  ? 'transaction-wrapper--list open' : ''"  :style="!$q.platform.is.mobile ? 'height: 100%;' : 'height: 100%;'">
      <q-banner inline-actions class="text-grey bg-grey-12 q-my-lg " v-if="$store.state.investment.defaultAccount && ! (['eos','btc','sol'].includes($store.state.investment.defaultAccount.chain) || $store.state.investment.defaultAccount.isEvm)">
        History for the {{$store.state.investment.defaultAccount.chain.toUpperCase()}} chain is not currently supported. Coming soon...
      </q-banner>

      <div class="q-pa-md loading-table" v-else-if="loading">
        <span :class="$store.state.settings.lightMode === 'true' ? 'text-body1 text-white': 'text-body1'">We are loading your transaction history. This may take a moment</span>
        <q-markup-table flat v-if="!$q.platform.is.mobile">
          <thead>
            <tr>
              <th class="text-left" style="width: 150px">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="n in 10" :key="n">
              <td class="text-left">
                <q-skeleton animation="blink" type="text" width="85px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="50px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="35px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="65px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="25px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="85px" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <!-- <q-linear-progress query color="warning" class="q-mt-md" v-if="$q.platform.is.mobile"/> -->
        <q-linear-progress query color="blue-4" class="q-mt-md" v-if="$q.platform.is.mobile"/>

      </div>

      <div :class="$store.state.settings.lightMode === 'true' ? 'text-white q-pa-md': 'text-black q-pa-md'" v-else-if="!history.length && !loading">
        No transactions recorded yet with this account
      </div>
      <q-scroll-area v-else :visible="true" :class="$store.state.settings.lightMode === 'true' ? 'q-pr-md':'bg-white'" :style="$q.platform.is.mobile ? 'height: 100%; padding-bottom: 0px;' : 'height: 85%;'">
        <div v-if="!($q.platform.is.mobile||$isbex)">

          <div v-for="(day,indexDay) in history" :key="indexDay">

            <div class="title-date q-pl-sm q-mt-lg q-mb-md text-grey-7">{{day.friendlyDay}} </div>
            <q-list bordered dark separator class="list-wrapper"  v-for="(transaction, indexTx) in day.data" :key="indexTx" >

              <q-item v-if="transaction.direction == 'outgoing'" clickable class="column history-item-wrapper send-component" :class="{'dark-bg': $store.state.settings.lightMode === 'true'}">
                <q-item-section class="history-item flex justify-between">
                  <div class="row" :class="[isMobile ? 'items-start':'items-center']">
                    <div class="col col-4">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="getImage(transaction)" />
                        </div>
                        <div class="txLabel">
                          <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{getAction(transaction)}}</div>
                          <div class="text-grey">{{transaction.time }}</div>

                        </div>
                      </div>
                    </div>
                    <div class="col col-8">
                      <div class="row items-center">
                        <div class="col col-6">
                          <div class="flex items-center">
                            <div class="q-mr-md flex flex-center">
                              <img width="32" :src="transaction.image" class="" />
                            </div>
                            <div class="column">

                              <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">-{{transaction.amountFriendly}}</span> {{transaction.symbol}} </div>
                              <div class="text-grey" v-if="transaction.usdAmount">
                              ${{transaction.usdAmount}}
                                <q-tooltip>
                                Estimated USD equivalent on Day of Txn
                              </q-tooltip>
                            </div>
                            <div class="text-grey" v-else>
                              N/A
                            </div>

                            </div>
                          </div>
                        </div>
                        <div class="col col-6 flex justify-end">
                          <div class="column">
                            <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                              <div class="flex items-center" style="cursor: pointer;">
                                <img width="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=" class="radius" />
                                <div class="q-pl-sm actors column">
                                  <div class="">To</div>
                                  <span>{{transaction.friendlyTo}}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-item-section>
                <q-item-section class="history-item__detail">
                  <div class="row items-center border-top">
                    <div class="col" :class="[isMobile ? 'col-6':' q-pl-xl']" v-if="transaction.chain == 'eth'">
                      <div class="text-bold text-grey">Fee</div>
                      <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                        <span>
                          <span class="">{{transaction.gasTotal.toFixed(6)}}</span>&nbsp;
                          <span class="">ETH</span>
                        </span> (${{transaction.usdFees}})
                      </div>
                    </div>
                    <div class="col" :class="[isMobile ? 'col-6':'q-pl-xl']" v-else-if="transaction.chain == 'eos'">
                      <div class="text-bold text-grey">Memo</div>
                      <div :class="{'text-black ': $store.state.settings.lightMode === 'false', 'text-white ellipsis': $store.state.settings.lightMode === 'true'}">
                        <span>
                          <span class="">{{transaction.memo}}</span>
                        </span>
                      </div>
                    </div>
                    <div class="col" :class="[isMobile ? 'col-6':'col-4 q-pl-xl flex items-center']">
                      <div class="column">
                        <span class="text-bold text-grey">Transaction hash</span>  <span  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{transaction.friendlyHash}}
                          <q-tooltip>
                          {{transaction.hash}}
                        </q-tooltip>
                        </span>

                      </div>
                      <div class="flex items-center q-ml-md">
                          <q-btn color="white" round size="sm" @click="$clipboardWrite(transaction.hash)" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                          <a :href="transaction.explorerLink" target="_blank">
                          <q-btn color="white" round size="sm"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                            </a>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-else-if="transaction.direction == 'exchange'" clickable class="column history-item-wrapper trade-component" @click="transaction.active = !transaction.active" :class="{'active': transaction.active}">
                <q-item-section class="history-item flex justify-between">
                  <div class="row items-center">
                    <div class="col col-4">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" :src="getImage(transaction)" />
                        </div>
                        <div class="txLabel">
                          <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{getAction(transaction)}}</div>
                          <div class="text-grey">{{transaction.time}}</div>

                        </div>
                      </div>
                    </div>
                    <div class="col col-5" :class="{'col-7' : !transaction.details}">
                      <div class="row items-center">
                        <div class="col col-6 flex items-center">
                          <div class="flex items-center">
                            <div class="q-mr-md flex flex-center">
                              <img width="32" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.subTransactions[0].image" class="" />
                            </div>
                            <div class="column">

                              <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">-{{transaction.subTransactions[0].amountFriendly}}</span> {{transaction.subTransactions[0].symbol}} </div>
                              <div class="text-grey" v-if="transaction.subTransactions[0].usdAmount">
                              ${{transaction.subTransactions[0].usdAmount}}
                                <q-tooltip>
                                Estimated USD equivalent on Day of Txn
                              </q-tooltip>
                            </div>
                            <div class="text-grey" v-else>
                              N/A
                            </div>
                            </div>
                          </div>
                        </div>
                        <div class="col col-1">
                          <q-icon name="navigate_next" size="md" />
                        </div>
                        <div class="col col-5 flex justify-end">
                          <div class="flex items-center">
                            <div class="q-mr-md flex flex-center">
                              <img width="32" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.subTransactions[1].image" class="" />
                            </div>
                            <div class="column">
                              <div  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">+{{transaction.subTransactions[1].amountFriendly}}</span> {{transaction.subTransactions[1].symbol}} </div>
                              <div class="text-grey" v-if="transaction.subTransactions[1].usdAmount">
                              ${{transaction.subTransactions[1].usdAmount}}
                                <q-tooltip>
                                Estimated USD equivalent on Day of Txn
                              </q-tooltip>
                            </div>
                            <div class="text-grey" v-else>
                              N/A
                            </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-3 flex justify-end" v-if="transaction.details">
                          <div class="column">
                            <div class="">
                              <div class="flex items-center" v-if="transaction.details" style="cursor: pointer;">
                                <img width="32" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="'https://zapper.fi/images/'+transaction.details.icon" class="radius" />
                                <div class="q-pl-sm column" >
                                  <div class="">Application</div>
                                  <span>{{transaction.details.protocol}}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>
                </q-item-section>
                <q-item-section class="history-item__detail">
                  <div class="row items-center border-top">
                    <div class="col col-8 q-pl-xl flex items-center">
                      <div class="">
                        <div class="text-bold text-grey">Fee</div>
                        <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                          <span>
                            <span class="">{{transaction.gasTotal.toFixed(6)}}</span>&nbsp;
                            <span class="">ETH</span>
                          </span> (${{transaction.usdFees}})
                        </div>
                      </div>
                      <div class="q-pl-xl">
                        <div class="text-bold text-grey">Rate</div>
                        <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                          <span>
                            <span class="">1</span>&nbsp;
                            <span class="">{{transaction.subTransactions[0].symbol}}</span>
                          </span> = {{transaction.subTransactions[1].amount /  transaction.subTransactions[0].amount}} {{transaction.subTransactions[1].symbol}}
                        </div>
                      </div>

                    </div>
                    <div class="col q-pl-xl flex items-center">
                      <div class="column">
                        <span class="text-bold text-grey">Transaction hash</span>
                        <span :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{transaction.friendlyHash}}
                          <q-tooltip>
                          {{transaction.hash}}
                        </q-tooltip></span>
                      </div>
                      <div class="flex items-center q-ml-md">
                          <q-btn color="white" round size="sm"  @click="$clipboardWrite(transaction.hash)"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                          <a :href="transaction.explorerLink" target="_blank">
                          <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                          </a>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-else-if="transaction.direction == 'incoming'" clickable class="column history-item-wrapper receive-component" @click="transaction.active = !transaction.active" :class="{'active': transaction.active}">
                <q-item-section class="history-item flex justify-between">
                  <div class="row" :class="[isMobile ? 'items-start':'items-center']">
                    <div class="col col-4">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" :src="getImage(transaction)" />
                        </div>
                        <div class="txLabel">
                          <div  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{getAction(transaction)}}</div>
                          <div class="text-grey">{{transaction.time}}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-8">
                      <div class="row items-center">
                        <div class="col col-9">
                          <div class="flex items-center">
                            <div class="q-mr-md flex flex-center">
                              <img width="32" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.image" class="" />
                            </div>
                            <div class="column">
                              <div  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">+{{transaction.amountFriendly}}</span> {{transaction.symbol}}
                              <q-tooltip>
                                The amount of {{transaction.symbol}} to be transferred to the recipient with the transaction
                              </q-tooltip>
                              </div>
                              <div  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}" v-if="transaction.usdAmount">
                              ${{transaction.usdAmount}}
                                <q-tooltip>
                                Estimated USD equivalent on Day of Txn
                              </q-tooltip>
                            </div>
                            <div class="text-grey" v-else>
                              N/A
                            </div>
                            </div>
                          </div>
                        </div>
                        <div class="col col-3 flex justify-end">
                          <div class="column">
                            <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                              <div class="flex items-center" style="cursor: pointer;">
                                <img width="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=" class="radius" />
                                <div class="q-pl-sm actors column">
                                  <div  >From</div>
                                  <span>{{transaction.friendlyFrom}}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-item-section>
                <q-item-section class="history-item__detail">
                  <div class="row items-center border-top">
                    <div class="col" :class="[isMobile ? 'col-6':' q-pl-xl']" v-if="transaction.chain == 'eth'">
                      <div class="text-bold text-grey">Fee</div>
                      <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                        <span>
                          <span class="">{{transaction.gasTotal.toFixed(6)}}</span>&nbsp;
                          <span class="">ETH</span>
                        </span> (${{transaction.usdFees}})
                      </div>
                    </div>
                    <div class="col" :class="[isMobile ? '':'q-mr-xl q-pl-xl']" v-else-if="transaction.chain == 'eos'">
                      <div class="text-bold text-grey">Memo</div>
                      <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                        <span>
                          <span class="">{{transaction.memo}}</span>
                        </span>
                      </div>
                    </div>
                    <div class="col" :class="[isMobile ? 'col-6':'col-4 q-pl-xl flex items-center']">
                      <div class="column">
                        <span class="text-bold text-grey">Transaction hash</span>
                        <span  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">{{transaction.friendlyHash}}
                          <q-tooltip>
                          {{transaction.hash}}
                        </q-tooltip>
                        </span>
                      </div>
                      <div class="flex items-center q-ml-md">
                          <q-btn color="white" round size="sm" @click="$clipboardWrite(transaction.hash)" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                          <a :href="transaction.explorerLink" target="_blank">
                          <q-btn color="white" round size="sm"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                            </a>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

          </div>
        </div>
          <!-- MOBILE VIEW ONLY  -->
          <HistoryItemList :history="history" :getImage="getImage" :getAction="getAction" v-if="$q.platform.is.mobile||$isbex"/>

          <p v-if="history.length && $store.state.investment.defaultAccount.chain == 'eth'" class="text-center text-body1 cursor-pointer q-pb-xl" ><q-btn flat @click="loadMore()" :loading="loadMoreLoading" icon="add" label="Load more" class="q-mb-xl"/></p>
      </q-scroll-area>
    </div>
  </div>

</div>
</template>

<script>
import { QScrollArea } from 'quasar'
import Lib from '@/util/walletlib'
import DexInteraction from '@/mixins/DexInteraction'
// const Web3 = require('web3')
// let web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'))
import HistoryItemList from './MobileUI/HistoryItemList.vue'

export default {
  name: 'History',
  components: {
    QScrollArea,
    HistoryItemList
  },
  props: {
    isMobile: {
      type: Boolean,
      required: false,
      default: true
    },
    refresh: {
      required: false
    }
  },
  data () {
    return {
      sendComponent: false,
      showInfos: [],
      historyRetrieval: {
      },
      loading: true,
      loadMoreLoading: false,
      legacyHistory: [],
      receiveComponent: false,
      sendComponent2: false,
      receiveComponent2: false,
      tradeComponent: false,
      active: true,
      offset: 0,
      history: [],
      pagination: {
        position: -1,
        offset: -100
      },
      tableDataWallets: [],
      showWallet: false,
      showText: false,
      menu: [
        { date: '<b>27</b> Today  ', transID: 'Transaction ID', to: '/transaction', typeTran: 'sent', desc: ' to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>26</b> 5:15 AM', transID: 'Transaction ID', to: '/transaction', typeTran: 'received', desc: ' to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>24</b> 6:15 PM', transID: 'Transaction ID', to: '/transaction', typeTran: 'sent', desc: ' to kkkljo...', amount: '-2.0084 VTX' }
      ]
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },
  watch: {
    '$store.state.investment.defaultAccount': function (val, old) {
      // if (!this.$store.state.currentwallet.wallet || !this.$store.state.currentwallet.wallet.chain) { this.$store.state.currentwallet.wallet = val }
      this.loading = true

      setTimeout(async () => {
        this.getHistory()
      }, 500)
    }
  },
  async mounted () {
    this.$store.state.settings.defaultChainData = false
    /*
    this.$bus.$on('refreshHistory', (e) => {
      if (!this.isrefresh) {
        this.refreshHistory()
        this.refresh = true

        setTimeout(() => {
          this.refresh = false
        }, 10000)
      }
    })
    */
    if (this.refresh) {
      this.refreshHistory()
    }
  },
  methods: {
    async getHistory () {
      let account = this.$store.state.investment.defaultAccount
      let key = account.key + account.chain + (account.chain === 'eos' ? account.name : '')

      if (!this.historyRetrieval[key]) {
        this.$set(this.historyRetrieval, key, true)
      } else {
        return
      }
      this.history = []
      console.log(account, 'account')
      if (account.origin === 'metamask') {
        account = this.$store.state.wallets.tokens.find(o => o.type === 'eth' && o.origin !== 'metamask')
      }
      if (account.chain === 'eth') {
        // Clear local data because of updated logic
        let item = localStorage.getItem('tx_list_' + account.key)

        if (!item) {
          localStorage.removeItem('history_' + account.key)
        }

        this.getEthWalletHistory(account)
      } else if (account.chain === 'eos') {
        this.$axios.post('https://cpu.volentix.io/api/global/history', { name: account.name }).then(res => {
          res.data.forEach((d, i) => {
            res.data[i].data.map(h => {
              h.image = Lib.getTokenImage(h.symbol)
            })
          })
          this.history = res.data
          this.loading = false
        })
      } else {
        if (!account.chain) {
          account = this.$store.state.wallets.tokens.find(w => w.chain === 'eos' && w.type === 'eos')
        }

        Lib.history(account.chain, account.chain === 'eos' ? account.name : account.key, account.type, this.pagination).then(data => {
          data = data.history

          if (data && data[0] && data[0].transID) {
            this.legacyHistory = data
            this.loading = false
            return
          }

          if (data && Array.isArray(data)) {
            this.groupByDay(data)
          }
        })
      }
    },
    async getEthWalletHistory (account) {
      let element = this.$store.state.wallets.tokens.find(o => o.type === 'eth' && o.key === account.key)

      let cacheData = localStorage.getItem('history_' + element.key)

      /* let item = this.$store.state.wallets.history.find(o => o.key === element.key)

      if (item) {

        this.history = item.history
        this.loading = false

      } else */

      if (cacheData) {
        this.history = JSON.parse(cacheData)
        this.loading = false
      } else {
        let data = await this.$store.dispatch('investment/getETHTransactions', element.key)
        localStorage.setItem('tx_list_' + element.key, JSON.stringify(data))
        data = data.slice(this.offset, 10).map((o) => this.normalize(o, 'eth'))

        if (data && Array.isArray(data)) {
          this.history = []
          this.groupByDay(data)
        }
      }
    },
    getImage (transaction) {
      return transaction.direction === 'outgoing'
        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg=='
        : transaction.direction === 'incoming'
          ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K'
          : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik03LjY0MTc1IDExQzE2LjIxMDIgMTEgMTQuODEgMTAuOTk5OSAxNi44MTIzIDEwLjk5OThDMTcuMDYyNiAxMC43NDc5IDE3LjA2MjYgMTAuMTUzOSAxNi44MTIzIDkuOTAxOTlMMTQuMjQ3MyA3LjE4ODkyQzEzLjk5NyA2LjkzNzAzIDEzLjU5MjcgNi45MzcwMyAxMy4zNDI0IDcuMTg4OTJDMTMuMjIyMyA3LjMwOTYgMTMuMTU0NyA3LjQ3MzQzIDEzLjE1NDcgNy42NDQyN0MxMy4xNTQ3IDcuODE1MTIgMTMuMjIyMyA3Ljk3ODk1IDEzLjM0MjQgOC4wOTk2M0wxNC44MSA5LjcwODIyTDcuNjQxNzUgOS43MDgyMkM3LjI4ODc5IDkuNzA4MjIgNyA5Ljk5ODg3IDcgMTAuMzU0MUM3IDEwLjcwOTMgNy4yODg3OSAxMSA3LjY0MTc1IDExWiIgZmlsbD0iIzE1MTUxRiIvPgo8cGF0aCBkPSJNMTYuMzU4MyAxM0M3Ljc4OTgzIDEzIDkuMTg5OTYgMTMuMDAwMSA3LjE4NzcxIDEzLjAwMDJDNi45Mzc0MyAxMy4yNTIxIDYuOTM3NDMgMTMuODQ2MSA3LjE4NzcxIDE0LjA5OEw5Ljc1MjcgMTYuODExMUMxMC4wMDMgMTcuMDYzIDEwLjQwNzMgMTcuMDYzIDEwLjY1NzYgMTYuODExMUMxMC43Nzc3IDE2LjY5MDQgMTAuODQ1MyAxNi41MjY2IDEwLjg0NTMgMTYuMzU1N0MxMC44NDUzIDE2LjE4NDkgMTAuNzc3NyAxNi4wMjEgMTAuNjU3NiAxNS45MDA0TDkuMTg5OTYgMTQuMjkxOEwxNi4zNTgzIDE0LjI5MThDMTYuNzExMiAxNC4yOTE4IDE3IDE0LjAwMTEgMTcgMTMuNjQ1OUMxNyAxMy4yOTA3IDE2LjcxMTIgMTMgMTYuMzU4MyAxM1oiIGZpbGw9IiMxNTE1MUYiLz4KPC9nPgo8L3N2Zz4K'
    },
    getAction (transaction) {
      return transaction.direction === 'outgoing' ? 'Send'
        : transaction.direction === 'incoming' ? 'Receive' : 'Trade'
    },
    loadMore () {
      this.loadMoreLoading = true

      setTimeout(async () => {
        let account = this.$store.state.investment.defaultAccount

        if (account.chain === 'eth') {
          let cacheData = localStorage.getItem('history_' + account.key)

          cacheData = JSON.parse(cacheData)

          let txList = localStorage.getItem('tx_list_' + account.key)

          txList = JSON.parse(txList)

          this.offset = 0

          cacheData.forEach((e) => {
            this.offset += e.data.length
          })

          let data = txList.slice(this.offset, this.offset + 10).map(o => this.normalize(o, 'eth'))

          if (data && Array.isArray(data)) {
            this.groupByDay(data, cacheData)
            this.loadMoreLoading = false
          }
        }
      }, 200)
      console.log('loadMore calling ')
    },
    getTokenImage (type) {
      let token = this.getAllCoins().find((o) => o.value.toLowerCase() === type.toLowerCase())
      return token ? (type.toLowerCase() === 'eth' ? 'https://s3.amazonaws.com/token-icons/eth.png' : token.image) : 'https://etherscan.io/images/main/empty-token.png'
    },
    normalize (transaction, chain) {
      const self = this
      let normalizer = {

        eth (transaction) {
          let tx = JSON.parse(JSON.stringify(transaction))
          tx.chain = 'eth'
          let date = (new Date(parseInt(transaction.timeStamp) * 1000))
          tx.explorerLink = 'https://etherscan.io/tx/' + transaction.hash
          tx.friendlyHash = transaction.hash.substring(0, 6) + '...' + transaction.hash.substr(transaction.hash.length - 5)
          tx.friendlyTo = transaction.destination.length ? transaction.destination.substring(0, 6) + '...' + transaction.destination.substr(transaction.destination.length - 5) : ''
          tx.friendlyFrom = transaction.from.substring(0, 6) + '...' + transaction.from.substr(transaction.from.length - 5)
          tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
          tx.image = self.getTokenImage(transaction.symbol)
          tx.active = false

          tx.gasTotal = tx.gas
          tx.dateFormatted = date.toISOString().split('T')[0]
          // self.getHistoricalData(transaction)
          tx.amountFriendly = parseFloat(tx.amount).toFixed(6)

          tx.subTransactions.map(o => {
            o.image = self.getTokenImage(o.symbol)
            o.amountFriendly = parseFloat(o.amount).toFixed(6)
          })

          if (tx.subTransactions.length === 2) {
            tx.subTransactions = [tx.subTransactions.find(o => o.type === 'outgoing'), tx.subTransactions.find(o => o.type === 'incoming')]
          }

          return tx
        },
        eos (transaction) {
          let tx = JSON.parse(JSON.stringify(transaction))

          let date = new Date(transaction.date)
          tx.timeStamp = date.getTime() / 1000

          tx.friendlyHash = transaction.transID.substring(0, 6) + '...' + transaction.transID.substr(transaction.transID.length - 5)
          tx.friendlyTo = transaction.to
          tx.hash = transaction.transID
          tx.explorerLink = 'https://bloks.io/transaction/' + transaction.transID
          tx.friendlyFrom = transaction.from
          tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
          tx.image = self.getTokenImage(transaction.amount.split(' ')[1])
          tx.amount = transaction.amount.split(' ')[0]
          tx.memo = transaction.memo
          tx.symbol = transaction.amount.split(' ')[1]
          tx.active = false
          tx.gasTotal = false
          tx.direction = self.getTransactionDirection(transaction.from)
          tx.dateFormatted = date.toISOString().split('T')[0]
          tx.amountFriendly = parseFloat(Math.abs(tx.amount)).toFixed(6)

          return tx
        }
      }
      return normalizer[chain](transaction)
    },
    refreshHistory () {
      let account = this.$store.state.investment.defaultAccount
      console.log(account, 'account')
      Lib.deleteWalletHistoryData(account.chain === 'eos' ? account.name : account.key, account.chain)
      this.loading = true

      setTimeout(() => {
        this.getHistory(6)
      }, 500)
    },
    getTransactionDirection (from) {
      let names = []
      let direction = 'incoming'

      if (this.$store.state.investment.defaultAccount && this.$store.state.investment.defaultAccount.chain === 'eos') {
        names = [this.$store.state.investment.defaultAccount.name]
      } else if (this.$store.state.currentwallet.wallet.chain && this.$store.state.currentwallet.wallet.chain === 'eos') {
        names = [this.$store.state.currentwallet.wallet.name]
      }
      if (names.includes(from)) {
        direction = 'outgoing'
      }

      return direction
    },
    async groupByDay (allHistoryData) {
      console.log(allHistoryData, 'allHistoryData')
      allHistoryData.forEach((element) => {
        let dateObj = new Date(parseInt(element.timeStamp) * 1000)
        let month = dateObj.getUTCMonth() + 1
        let day = dateObj.getUTCDate()
        let year = dateObj.getUTCFullYear()
        let index = this.history.findIndex(o => o.month === month && o.day === day && o.year === year)

        if (index > -1) {
          this.history[index].data.push(element)
        } else {
          let item = {
            month: month,
            day: day,
            year: year,
            friendlyDay: dateObj.toLocaleString('default', { month: 'long' }) + ' ' + day + ', ' + year,
            data: [element]
          }
          this.history.push(item)

          // this.$store.commit('wallets/updateHistory', item)
        }
      })
      if (this.$store.state.investment.defaultAccount.chain === 'eth') {
        localStorage.setItem('history_' + this.$store.state.investment.defaultAccount.key, JSON.stringify(this.history))
        // this.$store.commit('wallets/setHistory', {key:this.$store.state.investment.defaultAccount.key, historythis.history)
      }
      this.loading = false
    },
    async getUsdPrice (transaction, synchronus = true) {
      return true

      /*
      let value = false

      let datePrice = localStorage.getItem(transaction.symbol + '-' + transaction.dateFormatted)

      if (!datePrice) {
        let response = await this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://api.tiingo.com/tiingo/crypto/prices?tickers=' + transaction.symbol.toLowerCase() + 'usd&startDate=' + transaction.dateFormatted + '&endDate=' + transaction.dateFormatted + '&resampleFreq=5min&token=3d454099d564dc5ce4683da918d0b2e416a56dcc')
          .catch(o => console.log(o))

        if (response && response.data[0] && response.data[0].priceData[0]) {
          let price = ((response.data[0].priceData[0].high + response.data[0].priceData[0].low) / 2)
          localStorage.setItem(transaction.symbol + '-' + transaction.dateFormatted, price)
          value = price
        }
      } else {
        value = parseFloat(datePrice)
      }
      return value
      */
    },
    async getHistoricalData (transaction) {
      let datePrice = localStorage.getItem(transaction.symbol + '-' + transaction.dateFormatted)

      if (datePrice) {
        datePrice = parseFloat(datePrice) * parseFloat(transaction.amount)
        transaction.usdAmount = isNaN(datePrice) ? '-' : datePrice.toFixed(2)

        transaction.subTransactions.map(async o => {
          o.dateFormatted = transaction.dateFormatted
          let value = await this.getUsdPrice(o, true)
          o.usdAmount = value ? (value * o.amount).toFixed(2) : false
        })
        let param = {
          dateFormatted: transaction.dateFormatted,
          symbol: 'ETH'
        }
        let EthPrice = await this.getUsdPrice(param, true)
        let gas = transaction.gas
        // console.log(transaction.gas, 'gas', EthPrice, transaction.symbol + '-' + transaction.dateFormatted)
        transaction.usdFees = gas * EthPrice
        transaction.usdFees = isNaN(transaction.usdFees) ? false : transaction.usdFees.toFixed(2)
      } else {
        let value = await this.getUsdPrice(transaction)
        transaction.usdAmount = value ? (parseFloat(value) * parseFloat(transaction.amount)).toFixed(2) : false
        // console.log(transaction.gas, 'gas', value, transaction.symbol + '-' + transaction.dateFormatted)
      }
    }
  },
  mixins: [DexInteraction]
}
</script>

<style scoped lang="scss">

.actors.q-pl-sm.column {
    width: 110px;
}
 .dark-bg:hover  /deep/ *:after ,  .dark-bg:hover  /deep/  *:before{
      background: #04111F !important ;
      opacity: 1 !important;
}
.dark-theme /deep/ .q-hoverable:hover > .q-focus-helper:before {
    opacity: 1 !important
}
.dark-theme /deep/ .q-hoverable:hover > .q-focus-helper:after {
    opacity: 0 !important
}
.dark-theme .history-item-wrapper:hover {

    background: initial !important

}
.transaction-wrapper[data-v-7629df43] {
    padding: 0px 0%  !important
}
  .title-date {
    text-transform: capitalize;
}
  @import "~@/assets/styles/variables.scss";
  .transaction-wrapper{
    padding: 0px 6%;
    margin-top: -20px;
    @media screen and (min-width: 768px) {
      padding: 0px;
    }
    &--list{
      background-color: #fff;
      padding: 4% 5%;
      border-radius: 0px 0px 30px 30px;
      box-shadow: 0px 4px 16px 0px rgba(black, .09);
      @media screen and (min-width: 768px) {
        box-shadow: none;
        padding: 0% 1%;
        margin-top: 30px;
      }
      &__hide-transaction{
        text-transform: initial !important;
        margin-top: 0px;
        margin-bottom: 10px;
        color: #7272FA !important;
      }
      .list-wrapper{
        overflow: hidden;
        visibility: hidden;
        height: 0px;
        opacity: 0;
        transform: translateY(-20px) scaleY(.5);
        transform-origin: top;
        transition: ease transform .3s, ease opacity .4s;
        .history-item-wrapper{
          height: 70px;
          overflow: hidden;
          .history-item{
            height: 60px;
            margin-top: -10px;
            &__detail{
              margin-left: 0px;
              visibility: hidden;
              opacity: 0;
              transform: translateY(0px);
              transition: opacity cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s;
            }
          }
          &:hover{
            height: auto;
            border: 1px solid #CCC !important;
            background: rgba(#57adf8, .05);
            border-radius: 10px;
            margin-bottom: 10px;
            .history-item{
              &__detail{
                margin-left: 0px;
                visibility: visible;
                opacity: 1;
                transform: translateY(0px);
                transition: opacity cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s;
              }
            }
          }
          &.active{
            height: auto;
            border: 1px solid #CCC !important;
            background: rgba(#57adf8, .05);
            border-radius: 10px;
            margin-bottom: 10px;
            .history-item{
              &__detail{
                margin-left: 0px;
                visibility: visible;
                opacity: 1;
                transform: translateY(0px);
                transition: opacity cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s;
              }
            }
          }
        }
        .history-item{
          &__detail{
            margin-left: 0px;
          }
        }
        .item{
          &-date{
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
            max-width: 60px;
            @media screen and (min-width: 768px) {
              max-width: 80px;
            }
            &--value{
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: $Titillium;
              font-weight: $light;
              font-size: 10px;
              color: #7272FA;
              width: 50px;
              @media screen and (min-width: 768px) {
                width: 80px;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
              }
              /deep/ b{
                font-weight: $bold;
                color: #6C0DCB;
                font-size: 26px;
                margin-bottom: -3px;
                margin-top: -7px;
                @media screen and (min-width: 768px) {
                  margin-right: 10px;
                }
              }
            }
          }
          &-trans{
            font-family: $Titillium;
            font-weight: $light;
            font-size: 14px;
            @media screen and (min-width: 768px) {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              margin-top: -2px;
              font-size: 12px;
            }
            &--transID{
              font-weight: $bold;
              color: #0E163B;
              margin-top: 1px;
              @media screen and (min-width: 768px) {
                margin-top: 0px;
                margin-right: 10px;
              }
            }
            &--desc{
              color: #B0B0B0;
              .type{
                text-transform: capitalize;
                &.sent{
                  color: #FFB200;
                }
                &.received{
                  color: #00D0CA;
                }
              }
            }
          }
          &-amount{
            max-width: 90px;
            text-align: right;
            font-family: $Titillium;
            font-weight: $bold;
            font-size: 15px;
            color: #2A2A2A;
            justify-content: flex-start;
            margin-top: 2px;
            &--value{}
          }
        }
      }
      &.open{
        margin-bottom: -100px;
        @media screen and (min-width: 768px) {
          margin-bottom: 0px;
          margin-top: 10px;
        }
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 10px;
        }
      }
      /deep/ .q-list--bordered {
          border: none;
          .q-item{
            &:not(:first-child){
              .q-link {
                border-top: 1px solid rgba(0,0,0,0.02);
              }
            }
          }
          .q-link {
            border-top: 1px solid rgba(0,0,0,0.06);
          }
          .q-item{
            &:first-child{
              border-top: 1px solid rgba(0,0,0,0);
            }
            &:last-child{
              border-bottom: 1px solid rgba(0,0,0,.1);
            }
          }
          .q-item__section{
            &.hide{
              display: none !important;
            }
          }
      }
      &__item-info{
        border: 2px solid;
        border-radius: 9px;
        text-align: center;
      }
      .coin-icon{
        margin-left: 10px;
        // opacity: .4;
      }
      .icons{
        // opacity: .4;
        &.reverse{
          transform: scaleX(-1);
        }
      }
      .item-name{
        color: #000;
        font-weight: 700;
        &--name{
          font-size: 14px;
        }
        &--purcent{
          font-size: 12px;
        }
      }
      .item-info{
        color: #000;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        &--amount{
          font-size: 14px;
        }
        &--amountUSD{
          font-size: 12px;
          color: #B0B0B0;
        }
      }
    }
  }
  .title-date{
    font-size: 14px;
    color: #333;
    font-weight: 700;
  }
  .radius{
    border-radius: 50px;
  }
  .border-top{
    border-top: 1px solid #CCC;
    height: 70px;
  }
  .dark-theme{
    .q-table__card{
      background-color: #04111F;
      margin-left: -10px;
      margin-top: 10px;
    }
    .loading-table{
      .q-table thead, .q-table tr, .q-table th, .q-table td {
        // border-color: none !important;
        background-color: #06182c !important;
      }
    }
    .transaction-wrapper{
      &--list{
        background-color: #04111F;
      }
    }
  }
</style>
