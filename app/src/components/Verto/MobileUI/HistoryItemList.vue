<template>
    <div class="q-pa-sm" style="overflow: auto;">
      <h4 class="new_title_style text-grey-8 q-pl-sm q-ml-xs">Transactions history</h4>
        <q-card flat v-for="(day,indexDay) in history" :key="indexDay" class="rounded-borders" :class="{'dark-bg': $store.state.settings.lightMode === 'true'}"  :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': ''">
            <div class="title-date q-pl-md q-pt-md q-pb-md" :class="$store.state.settings.lightMode === 'true' ? 'text-grey-8':'bg-grey-1 text-grey-7'">{{day.friendlyDay}} </div>
            <q-list :class="$store.state.settings.lightMode === 'true' ? 'rounded-borders text-white':'rounded-borders text-black' " v-for="(transaction, indexTx) in day.data" :key="indexTx" separator>
                <q-expansion-item class="outgoing_style" v-if="transaction.direction == 'outgoing'" >
                    <template v-slot:header>
                        <q-item-section style="margin-left: -10px;" avatar >
                          <img :src="getImage(transaction)" width="40"/>
                        </q-item-section>
                        <q-item-section style="margin-left: -10px;">
                            <q-item-label class="text-bold">{{getAction(transaction)}} {{transaction.symbol}}</q-item-label>
                            <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''"> To&nbsp; {{transaction.friendlyTo}}</q-item-label>
                        </q-item-section>
                        <!-- <q-item-section style="margin-left: 0px;" class="">
                            <q-item-label class="row justify-end full-width items-center">
                                 <div>&nbsp;&nbsp;-{{formatNumber(transaction.amountFriendly)}} <b>{{transaction.symbol}}</b></div>
                                 <q-avatar v-if="false" round size="25px" color="primary">
                                  <img onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.image" > -->
                        <q-item-section style="margin-left: 0px;" class="">
                            <q-item-label class="row justify-end full-width items-center">
                                <q-avatar v-if="false" round size="32px" color="primary">
                                    <img onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.image" >
                                </q-avatar>
                                <div>&nbsp;&nbsp;-{{formatNumber(transaction.amountFriendly)}} <b>{{transaction.symbol}}</b></div>
                            </q-item-label>
                            <!-- <q-item-label caption>
                                <div class="text-grey" v-if="transaction.usdAmount" >
                                    ${{transaction.usdAmount}}  <q-tooltip> Estimated USD equivalent on Day of Txn </q-tooltip>
                                </div>
                                <div class="text-grey" style="margin-left: 25px;" v-else>  N/A </div>
                            </q-item-label> -->
                            <q-item-label v-if="false" class="row justify-left" caption style="margin-left: 38px; margin-top: -9px;">
                                <!-- <q-avatar round size="32px">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=">
                                </q-avatar> -->

                                <div :class="{'text-grey': $store.state.settings.lightMode === 'true'}">To&nbsp; {{getKeyFormat(transaction.friendlyTo, 3)}} </div>
                            </q-item-label>
                        </q-item-section>
                    </template>
                    <q-card class="q-pb-lg" :bordered="$store.state.settings.lightMode === 'true'" :dark="$store.state.settings.lightMode === 'true'" :class="{'text-black bg-grey-2': $store.state.settings.lightMode === 'false', 'text-white mobile-card': $store.state.settings.lightMode === 'true'}">
                        <q-separator />
                        <q-item class="my_custom_item_history">
                          <q-item-section>
                            <q-item-label class="time_item_label">{{ transaction.time }}</q-item-label>
                          </q-item-section>
                            <q-item-section v-if="transaction.chain == 'eth'">
                                <q-item-label > Fee</q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''">
                                    <span :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'">
                                        <span >{{transaction.gasTotal.toFixed(6)}}</span>&nbsp;
                                        <span >ETH</span>
                                    </span> (${{transaction.usdFees}})
                                </q-item-label>
                            </q-item-section>
                            <q-item-section  v-if="transaction.chain == 'eos'">
                                <q-item-label > Memo</q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'">
                                    <div class="ellipsis_">{{transaction.memo}}</div>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section >
                                <q-item-label>
                                    Transaction hash
                                    <div class="float-right" v-if="transaction.chain !== 'eth' && transaction.chain !== 'eos'">
                                        <div class="flex items-center q-ml-md">
                                            <q-btn color="red" round size="sm" @click="copyToClipboard(transaction.hash, 'Transaction Hash')" outline :text-color="$store.state.settings.lightMode === 'true' ? 'black': 'black'" icon="content_copy" />
                                            <a :href="transaction.explorerLink" target="_blank">
                                                <q-btn color="black" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'black': 'black'" icon="open_in_new" class="q-ml-sm" />
                                            </a>
                                        </div>
                                    </div>
                                </q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''">
                                    <span  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                                       <!-- <div class="ellipsis"> {{transaction.friendlyHash}} </div> -->
                                        <div class="ellipsis"> {{getKeyFormat(transaction.hash, 20)}} </div>
                                        <div v-if="transaction.chain == 'eth' || transaction.chain == 'eos'" class="actions_btns flex justify-end items-center">
                                          <q-btn round size="sm" @click="copyToClipboard(transaction.hash, 'Transaction Hash')" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                                          <a :href="transaction.explorerLink" target="_blank">
                                            <q-btn color="black" round size="sm"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                                          </a>
                                        </div>
                                    </span>
                                </q-item-label>
                                <!-- <q-item-label ></q-item-label> -->
                            </q-item-section>
                        </q-item>
                    </q-card>
                </q-expansion-item>
                <q-expansion-item class="exchange_style" v-else-if="transaction.direction == 'exchange'"  @click="transaction.active = !transaction.active" :class="{'active': transaction.active}">
                    <template v-slot:header>
                        <q-item-section avatar >
                            <img  :src="getImage(transaction)"/>
                        </q-item-section>
                        <q-item-section style="margin-left: -20px;">
                            <q-item-label class="text-bold"> {{getAction(transaction)}}</q-item-label>
                            <!-- <div v-if="transaction.details" :class="{'text-grey': $store.state.settings.lightMode === 'true'}">+{{transaction.subTransactions[1].amountFriendly}} {{transaction.subTransactions[1].symbol}} </div> -->
                        </q-item-section>
                        <q-item-section style="margin-left: 0px;" class="">
                            <q-item-label class="row justify-end full-width items-center">
                                <q-avatar v-if="false" round size="32px" color="primary">
                                    <img onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.subTransactions[0].image" >
                                </q-avatar>
                                <div>&nbsp;&nbsp;-{{formatNumber(transaction.subTransactions[0].amountFriendly)}} <b>{{transaction.subTransactions[0].symbol}}</b> </div>
                            </q-item-label>
                            <q-item-label>
                              <div class="q-mt-xs flex justify-end" :class="{'text-grey': $store.state.settings.lightMode === 'true'}">+{{transaction.subTransactions[1].amountFriendly}} <b class="q-pl-xs">{{transaction.subTransactions[1].symbol}}</b> </div>
                            </q-item-label>
                            <!-- <q-item-label caption>
                                <div class="text-grey" v-if="transaction.subTransactions[0].usdAmount" >
                                   ${{transaction.subTransactions[0].usdAmount}}
                                </div>
                                <div class="text-grey" style="margin-left: 25px;" v-else>  N/A </div>
                            </q-item-label> -->
                            <!-- <div> <img width="125" :src="transaction.subTransactions[1].image" /> </div> -->
                            <!-- <q-item-label class="row justify-left" caption style="margin-left: 0px;"></q-item-label> -->
                            <!-- <div class="text-grey" v-if="transaction.subTransactions[1].usdAmount">
                                ${{transaction.subTransactions[1].usdAmount}}
                            </div>
                            <div class="text-grey" v-else> N/A </div> -->

                            <q-item-label class="row justify-left" style="align-items: center;" v-if="transaction.details" >
                                <div> <img width="32" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="'https://zapper.fi/images/'+transaction.details.icon" /> </div>
                                Application <span>{{transaction.details.protocol}}</span>
                            </q-item-label>
                        </q-item-section>
                    </template>
                    <q-card class="q-pb-lg" :bordered="$store.state.settings.lightMode === 'true'" :dark="$store.state.settings.lightMode === 'true'" :class="{'text-black bg-grey-2': $store.state.settings.lightMode === 'false', 'text-white mobile-card': $store.state.settings.lightMode === 'true'}">
                        <q-separator />
                        <q-item>
                            <q-item-section>
                              <q-item-label class="time_item_label">{{ transaction.time }}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label > Fee</q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''">
                                    <span :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'">
                                        <span class="">{{transaction.gasTotal.toFixed(6)}}</span>&nbsp;
                                        <span class="">ETH</span>
                                    </span> (${{transaction.usdFees}})
                                </q-item-label>
                            </q-item-section>
                            <q-item-section >
                                <q-item-label > Rate</q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''">
                                    <span :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'">
                                        <span class="">1</span>&nbsp;
                                        <span class="">{{transaction.subTransactions[0].symbol}}</span>
                                    </span> = <div class="ellipsis">{{transaction.subTransactions[1].amount /  transaction.subTransactions[0].amount}} {{transaction.subTransactions[1].symbol}}</div>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section >
                                <q-item-label > Transaction hash</q-item-label>
                                <q-item-label>
                                    <span  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                                       <!-- <div class="ellipsis"> {{transaction.friendlyHash}} </div> -->
                                       <div class="ellipsis"> {{getKeyFormat(transaction.hash, 20)}} </div>
                                       <div v-if="transaction.chain == 'eth' || transaction.chain == 'eos'" class="actions_btns flex justify-end items-center">
                                          <q-btn color="black" round size="sm"  @click="copyToClipboard(transaction.hash, 'Transaction Hash')"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                                          <a :href="transaction.explorerLink" target="_blank">
                                          <q-btn color="black" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                                          </a>
                                      </div>
                                    </span>
                                </q-item-label>
                                <!-- <q-item-label ></q-item-label> -->
                            </q-item-section>
                        </q-item>
                    </q-card>
                </q-expansion-item>
                <q-expansion-item class="incoming_style" v-else-if="transaction.direction == 'incoming'"  @click="transaction.active = !transaction.active" :class="{'active': transaction.active}">
                    <template v-slot:header>
                        <q-item-section style="margin-left: -10px;" avatar >
                          <img :src="getImage(transaction)" width="40"/>
                        </q-item-section>
                        <q-item-section style="margin-left: -10px;">
                            <q-item-label class="text-bold">{{getAction(transaction)}} {{transaction.symbol}}</q-item-label>
                            <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''"> From&nbsp; {{transaction.friendlyFrom}}</q-item-label>
                        </q-item-section>
                        <!-- <q-item-section style="margin-left: 0px;" class="">
                            <q-item-label class="row justify-end full-width items-center">
                                 <div>&nbsp;&nbsp;+{{formatNumber(transaction.amountFriendly)}} <b>{{transaction.symbol}}</b></div>
                                 <q-avatar v-if="false" round size="25px" color="primary">
                                  <img onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="transaction.image" > -->
                        <q-item-section style="margin-left: 0px;" class="">
                            <q-item-label class="row justify-end full-width items-center">
                              <div>&nbsp;&nbsp;+{{formatNumber(transaction.amountFriendly)}} <b>{{transaction.symbol}}</b></div>
                              <q-avatar v-if="false" round size="32px">
                                  <img onerror="this.src='https://etherscan.io/images/main/empty-token.png'" :src="transaction.image">
                              </q-avatar>
                            </q-item-label>
                            <!-- <q-item-label caption>
                                <div class="text-grey" v-if="transaction.usdAmount" >
                                    ${{transaction.usdAmount}}  <q-tooltip> Estimated USD equivalent on Day of Txn </q-tooltip>
                                </div>
                                <div class="text-grey" style="margin-left: 25px;" v-else>  N/A </div>
                            </q-item-label> -->
                            <q-item-label v-if="false" class="row justify-left" caption style="margin-left: 38px; margin-top: -9px;">
                                <!-- <q-avatar round size="32px">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=">
                                </q-avatar> -->
                                <div :class="{'text-grey': $store.state.settings.lightMode === 'true'}">To&nbsp; {{transaction.friendlyTo}} </div>
                            </q-item-label>
                        </q-item-section>
                    </template>
                    <q-card class="q-pb-lg" :bordered="$store.state.settings.lightMode === 'true'" :dark="$store.state.settings.lightMode === 'true'" :class="{'text-black bg-grey-2': $store.state.settings.lightMode === 'false', 'text-white mobile-card': $store.state.settings.lightMode === 'true'}">
                        <q-separator />
                        <q-item class="my_custom_item_history">
                            <q-item-section>
                              <q-item-label class="time_item_label">{{ transaction.time }}</q-item-label>
                            </q-item-section>
                            <q-item-section  v-if="transaction.chain == 'eth'">
                                <q-item-label > Fee</q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''">
                                    <span :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'">
                                        <span class="">{{transaction.gasTotal.toFixed(6)}}</span>&nbsp;
                                        <span class="">ETH</span>
                                    </span> (${{transaction.usdFees}})
                                </q-item-label>
                            </q-item-section>
                            <q-item-section  v-if="transaction.chain == 'eos'">
                                <q-item-label > Memo</q-item-label>
                                <q-item-label style="overflow-wrap: anywhere;" caption :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'">
                                    <span class="ellipsis_">{{transaction.memo}}</span>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section >
                                <q-item-label > Transaction hash
                                    <div class="float-right" v-if="transaction.chain !== 'eth' && transaction.chain !== 'eos'">
                                        <div class="flex items-center q-ml-md">
                                            <q-btn color="black" round size="sm" @click="copyToClipboard(transaction.hash, 'Transaction Hash')" outline :text-color="$store.state.settings.lightMode === 'true' ? 'black': 'black'" icon="content_copy" />
                                            <a :href="transaction.explorerLink" target="_blank">
                                            <q-btn color="black" round size="sm"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                                            </a>
                                        </div>
                                    </div>
                                </q-item-label>
                                <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-grey-7':''">
                                    <span  :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                                       <div class="ellipsis"> {{getKeyFormat(transaction.hash, 20)}} </div>
                                       <div v-if="transaction.chain == 'eth' || transaction.chain == 'eos'" class="actions_btns flex justify-end items-center">
                                          <q-btn round size="sm" @click="copyToClipboard(transaction.hash, 'Transaction Hash')" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                                          <a :href="transaction.explorerLink" target="_blank">
                                            <q-btn color="black" round size="sm"  outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                                          </a>
                                        </div>
                                    </span>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-card>
                </q-expansion-item>
                <q-separator />
            </q-list>
        </q-card>
    </div>
</template>

<script>
import Formatter from '@/mixins/Formatter'

export default {
  name: 'ExchangeItem',
  props: ['history', 'getImage', 'getAction', 'isPathInvalid'],
  mixins: [Formatter],
  data () {
    return {
      lightMode: true
    }
  },
  methods: {
  }

}
</script>
<style lang="scss" scoped>
/deep/ .q-expansion-item__container {
  // padding-top: 0px;
  // padding-bottom: 0px;
    // padding-top: 30px;
    // padding-bottom: 30px;
}
.mobile-card{
    background-color: #04111F !important;
}
.new_title_style{
  font-weight: 600;
  font-size: 18px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.time_item_label{
  position: absolute;
  top: 18px;
  font-size: 12px;
}
.outgoing_style,.incoming_style, .exchange_style{
  padding-top: 0px;
  padding-bottom: 0px;
  /deep/ .q-item.q-item-type.row{
    padding-top: 30px;
    padding-bottom: 20px;
  }
}
.title-date{
  border-radius: 0px !important;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
/deep/ .my_custom_item_history{
  flex-direction: column;
  .q-item__section{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 0px;
    margin-bottom: 10px;
  }
}
.actions_btns{
  position: absolute;
  right: 18px;
  // top: 0px;
  margin-top: 10px;
  a{
    text-decoration: none;
  }
}
</style>
