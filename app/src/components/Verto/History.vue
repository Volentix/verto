<template>
<div style="height: 100%;">
  <div class="transaction-wrapper" style="height: 100%;">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="transaction-wrapper--list open" v-if="isMobile">
      <q-list bordered separator class="list-wrapper">
        <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="item.to">
          <q-item-section class="item-date">
            <span class="item-date--value" v-html="item.date" />
          </q-item-section>
          <q-item-section class="item-trans">
            <span class="item-trans--transID">{{item.transID}}</span>
            <span class="item-trans--desc">{{item.desc}}</span>
          </q-item-section>
          <q-item-section class="item-amount">
            <span class="item-amount--value">{{item.amount}}</span>
          </q-item-section>
        </q-item>
      </q-list>
       <q-btn @click="showMore()" unelevated flat class="full-width transaction-wrapper--list__hide-transaction" color="white" :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" label="See More..." />
    </div>
    <div class="transaction-wrapper--list open" v-else style="height: 100%;">
      <q-scroll-area :visible="true" class="q-pr-md" style="height: 85%;">
        <div class="title-date q-pl-sm q-mt-lg q-mb-md text-grey-7">February 4, 2021</div>
        <q-list bordered dark separator class="list-wrapper">
          <q-item clickable class="column history-item-wrapper send-component" @click="sendComponent = !sendComponent" :class="{'active': sendComponent}">
            <q-item-section class="history-item flex justify-between">
              <div class="row items-center">
                <div class="col col-4">
                  <div class="flex items-center">
                    <div class="q-mr-md flex flex-center">
                      <img width="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg==" />
                    </div>
                    <div class="">
                      <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">Send</div>
                      <div class="text-grey">03:04 PM</div>
                    </div>
                  </div>
                </div>
                <div class="col col-8">
                  <div class="row items-center">
                    <div class="col col-6">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" src="https://token-icons.s3.amazonaws.com/0xcc4304a31d09258b0029ea7fe63d032f52e44efe.png" class="" />
                        </div>
                        <div class="column">
                          <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">-1,877.736</span> SWAP </div>
                          <div class="text-grey">$1,612.62</div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-6 flex justify-end">
                      <div class="column">
                        <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                          <div class="flex items-center" style="cursor: pointer;">
                            <img width="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=" class="radius" />
                            <div class="q-pl-sm column">
                              <div class="">To</div>
                              <span>0x4a02...c862</span>
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
                <div class="col col-4 q-pl-xl">
                  <div class="text-bold text-grey">Fee</div>
                  <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                    <span>
                      <span class="">0.0092</span>&nbsp;
                      <span class="">ETH</span>
                    </span> ($15.14)
                  </div>
                </div>
                <div class="col col-4 q-pl-xl flex items-center">
                  <div class="column">
                    <span class="text-bold text-grey">Transaction hash</span>
                    <span :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">0xc8c2...43a6</span>
                  </div>
                  <div class="flex items-center q-ml-md">
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable class="column history-item-wrapper trade-component" @click="tradeComponent = !tradeComponent" :class="{'active': tradeComponent}">
            <q-item-section class="history-item flex justify-between">
              <div class="row items-center">
                <div class="col col-4">
                  <div class="flex items-center">
                    <div class="q-mr-md flex flex-center">
                      <img width="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik03LjY0MTc1IDExQzE2LjIxMDIgMTEgMTQuODEgMTAuOTk5OSAxNi44MTIzIDEwLjk5OThDMTcuMDYyNiAxMC43NDc5IDE3LjA2MjYgMTAuMTUzOSAxNi44MTIzIDkuOTAxOTlMMTQuMjQ3MyA3LjE4ODkyQzEzLjk5NyA2LjkzNzAzIDEzLjU5MjcgNi45MzcwMyAxMy4zNDI0IDcuMTg4OTJDMTMuMjIyMyA3LjMwOTYgMTMuMTU0NyA3LjQ3MzQzIDEzLjE1NDcgNy42NDQyN0MxMy4xNTQ3IDcuODE1MTIgMTMuMjIyMyA3Ljk3ODk1IDEzLjM0MjQgOC4wOTk2M0wxNC44MSA5LjcwODIyTDcuNjQxNzUgOS43MDgyMkM3LjI4ODc5IDkuNzA4MjIgNyA5Ljk5ODg3IDcgMTAuMzU0MUM3IDEwLjcwOTMgNy4yODg3OSAxMSA3LjY0MTc1IDExWiIgZmlsbD0iIzE1MTUxRiIvPgo8cGF0aCBkPSJNMTYuMzU4MyAxM0M3Ljc4OTgzIDEzIDkuMTg5OTYgMTMuMDAwMSA3LjE4NzcxIDEzLjAwMDJDNi45Mzc0MyAxMy4yNTIxIDYuOTM3NDMgMTMuODQ2MSA3LjE4NzcxIDE0LjA5OEw5Ljc1MjcgMTYuODExMUMxMC4wMDMgMTcuMDYzIDEwLjQwNzMgMTcuMDYzIDEwLjY1NzYgMTYuODExMUMxMC43Nzc3IDE2LjY5MDQgMTAuODQ1MyAxNi41MjY2IDEwLjg0NTMgMTYuMzU1N0MxMC44NDUzIDE2LjE4NDkgMTAuNzc3NyAxNi4wMjEgMTAuNjU3NiAxNS45MDA0TDkuMTg5OTYgMTQuMjkxOEwxNi4zNTgzIDE0LjI5MThDMTYuNzExMiAxNC4yOTE4IDE3IDE0LjAwMTEgMTcgMTMuNjQ1OUMxNyAxMy4yOTA3IDE2LjcxMTIgMTMgMTYuMzU4MyAxM1oiIGZpbGw9IiMxNTE1MUYiLz4KPC9nPgo8L3N2Zz4K" />
                    </div>
                    <div class="">
                      <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">Trade</div>
                      <div class="text-grey">02:58 PM</div>
                    </div>
                  </div>
                </div>
                <div class="col col-8">
                  <div class="row items-center">
                    <div class="col col-6 flex items-center">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" src="https://s3.amazonaws.com/token-icons/eth.png" class="" />
                        </div>
                        <div class="column">
                          <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">-0.964</span> ETH </div>
                          <div class="text-grey">$1,571.02</div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-1">
                      <q-icon name="navigate_next" size="md" />
                    </div>
                    <div class="col col-5 flex justify-end">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" src="https://token-icons.s3.amazonaws.com/0xcc4304a31d09258b0029ea7fe63d032f52e44efe.png" class="" />
                        </div>
                        <div class="column">
                          <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">+1,887.736</span> SWAP </div>
                          <div class="text-grey">$1,615.77</div>
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
                        <span class="">0.025</span>&nbsp;
                        <span class="">ETH</span>
                      </span> ($41.08)
                    </div>
                  </div>
                  <div class="q-pl-xl">
                    <div class="text-bold text-grey">Rate</div>
                    <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                      <span>
                        <span class="">1</span>&nbsp;
                        <span class="">ETH</span>
                      </span> = 1,904.0003 SWAP
                    </div>
                  </div>

                </div>
                <div class="col col-4 q-pl-xl flex items-center">
                  <div class="column">
                    <span class="text-bold text-grey">Transaction hash</span>
                    <span :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">0xc8c2...43a6</span>
                  </div>
                  <div class="flex items-center q-ml-md">
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable class="column history-item-wrapper receive-component" @click="receiveComponent = !receiveComponent" :class="{'active': receiveComponent}">
            <q-item-section class="history-item flex justify-between">
              <div class="row items-center">
                <div class="col col-4">
                  <div class="flex items-center">
                    <div class="q-mr-md flex flex-center">
                      <img width="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K" />
                    </div>
                    <div class="">
                      <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">Receive</div>
                      <div class="text-grey">03:04 PM</div>
                    </div>
                  </div>
                </div>
                <div class="col col-8">
                  <div class="row items-center">
                    <div class="col col-6">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" src="https://s3.amazonaws.com/token-icons/eth.png" class="" />
                        </div>
                        <div class="column">
                          <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}"><span class="">+1</span> ETH </div>
                          <div class="text-grey">$1,627.68</div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-6 flex justify-end">
                      <div class="column">
                        <div class="">
                          <div class="flex items-center" style="cursor: pointer;">
                            <img width="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=" class="radius" />
                            <div class="q-pl-sm column">
                              <div class="">To</div>
                              <span :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">0x4a02...c862</span>
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
                <div class="col col-4 q-pl-xl">
                  <div class="text-bold text-grey">Fee</div>
                  <div :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">
                    <span>
                      <span class="">N/A</span>&nbsp;
                    </span>
                  </div>
                </div>
                <div class="col col-4 q-pl-xl flex items-center">
                  <div class="column">
                    <span class="text-bold text-grey">Transaction hash</span>
                    <span :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}">0xc8c2...43a6</span>
                  </div>
                  <div class="flex items-center q-ml-md">
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="title-date q-pl-sm q-mt-xl text-grey-7 q-mb-md text-grey-7">February 3, 2021</div>
        <q-list bordered separator class="list-wrapper">
          <q-item clickable class="column history-item-wrapper send-component" @click="sendComponent2 = !sendComponent2" :class="{'active': sendComponent}">
            <q-item-section class="history-item flex justify-between">
              <div class="row items-center">
                <div class="col col-4">
                  <div class="flex items-center">
                    <div class="q-mr-md flex flex-center">
                      <img width="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg==" />
                    </div>
                    <div class="">
                      <div class="">Send</div>
                      <div class="text-grey">03:43 PM</div>
                    </div>
                  </div>
                </div>
                <div class="col col-8">
                  <div class="row items-center">
                    <div class="col col-6">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" src="https://s3.amazonaws.com/token-icons/eth.png" class="" />
                        </div>
                        <div class="column">
                          <div class=""><span class="">-0.002</span> ETH </div>
                          <div class="text-grey">$3.08</div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-6 flex justify-end">
                      <div class="column">
                        <div class="">
                          <div class="flex items-center" style="cursor: pointer;">
                            <img width="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=" class="radius" />
                            <div class="q-pl-sm column">
                              <div class="">To</div>
                              <span>0x4a02...c862</span>
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
                <div class="col col-4 q-pl-xl">
                  <div class="text-bold text-grey">Fee</div>
                  <div class="">
                    <span>
                      <span class="">0.011</span>&nbsp;
                      <span class="">ETH</span>
                    </span> ($17.30)
                  </div>
                </div>
                <div class="col col-4 q-pl-xl flex items-center">
                  <div class="column">
                    <span class="text-bold text-grey">Transaction hash</span>
                    <span>0xc8c2...43a6</span>
                  </div>
                  <div class="flex items-center q-ml-md">
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable class="column history-item-wrapper receive-component" @click="receiveComponent2 = !receiveComponent2" :class="{'active': receiveComponent}">
            <q-item-section class="history-item flex justify-between">
              <div class="row items-center">
                <div class="col col-4">
                  <div class="flex items-center">
                    <div class="q-mr-md flex flex-center">
                      <img width="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K" />
                    </div>
                    <div class="">
                      <div class="">Receive</div>
                      <div class="text-grey">03:09 PM</div>
                    </div>
                  </div>
                </div>
                <div class="col col-8">
                  <div class="row items-center">
                    <div class="col col-6">
                      <div class="flex items-center">
                        <div class="q-mr-md flex flex-center">
                          <img width="32" src="https://s3.amazonaws.com/token-icons/eth.png" class="" />
                        </div>
                        <div class="column">
                          <div class=""><span class="">+0.119</span> ETH </div>
                          <div class="text-grey">$186.29</div>
                        </div>
                      </div>
                    </div>
                    <div class="col col-6 flex justify-end">
                      <div class="column">
                        <div class="">
                          <div class="flex items-center" style="cursor: pointer;">
                            <img width="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADdElEQVR4Xu3doW4VURhF4bmSpAqFIiG4vkIFr4RrSJDga3gVPILHaJpU4TD18BCryc7NfPjNnK6zus8/l7nD5f72zb8j/Pn052tIH8evd99S/trDa34XAmwVIoAGSAbWBtUACX8PawANkCzSAAnfPqwBNECyUAMkfPuwBtAAyUINkPDtwxpAAyQLNUDCtw9rAA2QLNQACd8+rAE0QLJQAyR8+/C8AX6+/Z6eB6gGVgBPjy/TXfzw8SZdf83vQoC0fwcB4hmuAdoTUZWfBmgFoAHWZ5gZoD2TqQE0gLuA4oAh0BBY/MmPxRsCfQ6QBDQDJHyHuwB3AT4JTL9D9QxzG+g2MAlYw+4C3AUkh9ZHqCEwbZ8hcH4fawYYzwDxF2gu0NnXn4+AswNcn+GVPwEiQQKcHCABCJAI1A/C0sWP43AERIIa4OQACUCARMARMP4oOe3e0d9zSAACVAdT3hCY8GmAiO/6ARoCowLXDvDa1+8IOLnABCBA+2JI5Oefg+Pr9iv/y4+/X9L7AZ7vHuoa5AOB978/h/RxECDh24cJsN+D6QoIMMW/vzgB9nswXQEBpvj3FyfAfg+mKyDAFP/+4gTY78F0BQSY4t9fnAD7PZiugABT/PuLE2C/B9MVEGCKf39xAuz3YLoCAkzx7y+eBaivi68Irv2Zumtfv0fCosEEODlAAhAgEfDVMF8NSwLVsBkgEnQEnBwgAQiQCJgBzABJoBo2A0SCjoCTAyQAARIBM4AZIAlUw2aASNARcHKABCBAIjCfAe5v36T3A6Sf/hXCa4C1AV4BQforLgRI/PIbTtrVe5oAkaEGiABr3BHQCGqAxs8REPnluAZoCDVA46cBIr8c1wANoQZo/DRA5JfjGqAh1ACNnwaI/HJcAzSEGqDx0wCRX45rgIZQAzR+GiDyy3EN0BDOHwl7enxJP8GHjzcpX8PXvn4CRAMIcHKABCBAIrA+whwBafuOQwOcHCABCJAIOALcBiaBatgMEAk6Ak4OkAAESATMAGaAJFANmwEiQUfAyQESgACJgBnADJAEquE8A9QKfL57qD/DVefrf/hQG4QAY30IoAGSghog4duHNYAGSBZqgIRvH9YAGiBZqAESvn1YA2iAZKEGSPj2YQ2gAZKFGiDh24c1gAZIFmqAhG8f1gAaIFmoARK+fXjdAP8BXbztTvEVM2oAAAAASUVORK5CYII=" class="radius" />
                            <div class="q-pl-sm column">
                              <div class="">To</div>
                              <span>0x4a02...c862</span>
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
                <div class="col col-4 q-pl-xl">
                  <div class="text-bold text-grey">Fee</div>
                  <div class="">
                    <span>
                      <span class="">N/A</span>&nbsp;
                    </span>
                  </div>
                </div>
                <div class="col col-4 q-pl-xl flex items-center">
                  <div class="column">
                    <span class="text-bold text-grey">Transaction hash</span>
                    <span>0xc8c2...43a6</span>
                  </div>
                  <div class="flex items-center q-ml-md">
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="content_copy" />
                      <q-btn color="white" round size="sm" outline :text-color="$store.state.settings.lightMode === 'true' ? 'white': 'black'" icon="open_in_new" class="q-ml-sm" />
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</div>
</template>

<script>
import { QScrollArea } from 'quasar'

export default {
  name: 'History',
  components: {
    QScrollArea
  },
  props: {
    isMobile: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      sendComponent: false,
      receiveComponent: false,
      sendComponent2: false,
      receiveComponent2: false,
      tradeComponent: false,
      active: true,
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
  created () {
    // this.loadTableDataWallets()
  },
  methods: {
    showMore () {

    }
    // async loadDataTableHistory () {
    //   if (this.$store.state.currentwallet.wallet.type === 'eos') {
    //     // get them from the eos token side of things
    //     let eosresult = await this.$axios.get(
    //       process.env[this.$store.state.settings.network].DEMUX_API +
    //         '/eos/' +
    //         this.walletName +
    //         '?skip=0&limit=100'
    //     )

    //     // the two APIs don't have the same output so let's map it out.
    //     var self = this
    //     let ledgerformatedresult = eosresult.data.data.map(function (eos) {
    //       if (eos.from === self.walletName) {
    //         eos.quantity = -eos.quantity
    //       }
    //       let row = {
    //         amount: eos.quantity,
    //         currency: eos.currency,
    //         comment: eos.memo,
    //         toaccount: eos.to,
    //         fromaccount: eos.from,
    //         timestamp: eos.timestamp,
    //         blockNumber: eos.blockNumber,
    //         trx_id: eos.trx_id,
    //         tokey: eos.to
    //       }
    //       return row
    //     })

    //     result.data.data = result.data.data.concat(ledgerformatedresult)
    //   }
    // sort the transactions from the newest to the oldest
    //   this.tableData = result.data.data
    //     .sort((a, b) => a.blockNumber - b.blockNumber)
    //     .reverse()
    //   return true
    // }
    // async loadTableDataWallets () {
    //   this.tableDataWallets = this.$store.state.currentwallet.config.keys
    // let tableDataWalletsCustom = []
    // console.log('tableDataWalletsCustom', tableDataWalletsCustom)
    // this.tableDataWallets = tableDataWalletsCustom
    // },

    // async getBalanceByWalletKey (walletKey) {
    //   let result = await this.$axios.post('https://eos.greymass.com/v1/chain/get_currency_balances', { 'account': walletKey }).then(balances => {
    //     // console.log('getBalanceByWalletKey () {} eos balances', balances)
    //     // let balances = balancesArray.data.length === 0 ?
    //     // if (balances.data.length === 0) {
    //     //   balances.data = [
    //     //     { amount: '0.0000', code: 'eosio.token', symbol: 'EOS' }
    //     //   ]
    //     // }
    //   })
    //   return result
    // }
  }
}
</script>

<style scoped lang="scss">
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
  }

</style>
