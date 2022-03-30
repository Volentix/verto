<template>
  <div id="app-content">
    <div class="app os-mac browser-chrome">
      <div><span></span></div>
      <div
        class="menu-droppo-container network-droppo"
        style="position: absolute; top: 58px; width: 309px; z-index: 55"
      ></div>
      <div class="main-container-wrapper">
        <div class="request-signature__container">
          <div class="request-signature__header">
            <div class="request-signature__header-background"></div>
            <div class="request-signature__header__text" >Signature Request</div>
            {{payloadId}}
            <div class="request-signature__header__tip-container">
              <div class="request-signature__header__tip"></div>
            </div>
          </div>
            <div
          class="q-pt-lg text-center q-mt-md"
          v-if="txData && txData.hash"
        >
          <div class="text-h6 full-width text-center">
            Transaction submitted
          </div>
          <br />
          <p class="text-body1 full-width text-center">
            Status:
            <span
              :class="
                txData.status == 'Success' ? 'text-green' : 'text-deep-purple-12'
              "
              >{{ txData.status }}</span
            >
          </p>
          <br />
          <div
            v-if="txData.hash"
            style="width: 300px; margin: 0 auto"
            class="cursor-pointer bg-grey-3 q-pa-sm q-mt-md flex flex-center"
          >
            <a target="_blank" :href="evm.explorer + txData.hash"
              ><div>{{ getKeyFormat(txData.hash, 30) }}</div></a
            >
          </div>

          <br />
          <div
            class="flex flex-center"
            v-if="txData.status == 'Submitted'"
          >
            <q-spinner
              color="primary"
              class="q-pt-md"
              size="4em"
              :thickness="2"
            />
          </div>

          <br />
          <div class="flex flex-center q-pb-md" v-if="txData.hash">

            <a
              target="_blank"
              :href="evm.explorer  + txData.hash"
              ><q-btn
                flat
                label="View Tx"
                :icon="'img:https://etherscan.io/images/favicon3.ico'" />
              </a>
          </div>
        </div>
          <div class="request-signature__body" v-else>
            <div  class="request-signature__account-info">
              <div class="request-signature__account">
                <div class="request-signature__account-text">From Account:</div>
                <div class="request-signature__account-item">
                  <div class="account-list-item undefined">
                    <div class="account-list-item__top-row">
                      <div class="">
                        <div
                          class="identicon account-list-item__identicon"
                          style="height: 18px; width: 18px; border-radius: 9px"
                        >
                          <div
                            style="
                              border-radius: 50px;
                              overflow: hidden;
                              padding: 0px;
                              margin: 0px;
                              width: 18px;
                              height: 18px;
                              display: inline-block;
                              background: rgb(35, 146, 225);
                            "
                          >
                            <svg x="0" y="0" width="18" height="18">
                              <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                transform="translate(3.6700733415415865 -2.8138989981765095) rotate(491.4 9 9)"
                                fill="#018E72"
                              ></rect>
                              <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                transform="translate(-7.282694824396921 -3.1083543940328644) rotate(314.8 9 9)"
                                fill="#FB1895"
                              ></rect>
                              <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                transform="translate(-9.753775815555455 -11.735441036697727) rotate(305.5 9 9)"
                                fill="#F58B00"
                              ></rect>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div class="account-list-item__account-name">
                        {{getKeyFormat(txData.from)}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="request-signature__balance">
                <div class="request-signature__balance-text">To :</div>
                <div class="request-signature__balance-value">{{getKeyFormat(txData.to)}}</div>
              </div>
            </div>
            <div  class="request-signature__account-info">
              <div class="request-signature__account">
                <div class="request-signature__account-text" v-if="evm">{{evm.nativeToken.toUpperCase()}} transferred:</div>
                <div class="request-signature__account-item">
                  <div class="account-list-item undefined">
                    <div class="account-list-item__top-row">
                      <div class="">
                        <div
                          class="identicon account-list-item__identicon"
                          style="height: 18px; width: 18px; border-radius: 9px"
                        >
                          <div
                            style="
                              border-radius: 50px;
                              overflow: hidden;
                              padding: 0px;
                              margin: 0px;
                              width: 18px;
                              height: 18px;
                              display: inline-block;
                              background: rgb(35, 146, 225);
                            "
                          >
                            <svg x="0" y="0" width="18" height="18">
                              <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                transform="translate(3.6700733415415865 -2.8138989981765095) rotate(491.4 9 9)"
                                fill="#018E72"
                              ></rect>
                              <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                transform="translate(-7.282694824396921 -3.1083543940328644) rotate(314.8 9 9)"
                                fill="#FB1895"
                              ></rect>
                              <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                transform="translate(-9.753775815555455 -11.735441036697727) rotate(305.5 9 9)"
                                fill="#F58B00"
                              ></rect>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div class="account-list-item__account-name text-left">
                       <span v-if="gasData"> {{formatNumber(txData.value / (10 ** 18) * gasData.ethPrice, 0)}} $ <br></span>
                      {{formatNumber(txData.value / (10 ** 18),3)}} {{evm.nativeToken.toUpperCase()}}

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="request-signature__balance">
                <div class="request-signature__balance-text">Gas fees:</div>
                <div class="request-signature__balance-value" v-if="gasData && evm">{{formatNumber(gasData.usdVal, 2)}} $ <br><span>{{gasData.ethVal}}  {{evm.nativeToken.toUpperCase()}}</span> </div>
              </div>
            </div>
            <div class="request-signature__origin-row" v-if="false">
              <div class="request-signature__origin-label">Origin:</div>
              <div class="icon-border" style="height: 24px; width: 24px">
                <img
                  src="http://localhost:8080/statics/app-logo-128x128.png"
                  alt=""
                  style="height: 18px; width: 18px"
                />
              </div>
              <div class="request-signature__origin">http://localhost:8080</div>
            </div>
            <div v-if="txData.data && txData.data.toString().length" class="request-signature__notice">Transaction data:</div>
            <div class="request-signature__rows" v-if="txData.data && txData.data.toString().length">
              <div class="request-signature__row">
                <div class="request-signature__row-value">
             {{txData.data}}
               </div>
              </div>
            </div>
            <span class="text-red">{{error}}</span>
          </div>
          <div   v-if="!(txData && txData.hash)" class="request-signature__footer">
            <button
              class="
                button
                btn-default btn--large
                request-signature__footer__cancel-button
              "
              @click="cancel"
              role="button"
              tabindex="0"
            >
              Cancel</button
            ><q-btn
              class="
                button
                btn-secondary btn--large
                request-signature__footer__sign-button
              "
              :disable="!gasData"
              @click="signTransaction()"
              data-testid="request-signature__sign"
              role="button"
              tabindex="0"
            >
              Sign
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import ParseDB from '@/util/ParseDb'
import Formatter from '@/mixins/Formatter'
import Lib from '@/util/walletlib'
import initWallet from '@/util/_Wallets2Tokens'

export default {
  props: ['txObject', 'tx', 'payloadId'],
  mixins: [Formatter],
  methods: {
    signTransaction () {
      let data = {
        gasData: this.gasData,
        txData: this.txData.data
      }
      console.log(data, 'data')
      let account = [...this.$store.state.currentwallet.config.keys].find(a => a.key.toLowerCase() === this.txData.from.toLowerCase())
      this.spinner = true
      Lib.send(
        this.chain,
        this.token,
        this.txData.from,
        this.txData.to,
        this.txData.value,
        data,
        account.privateKey,
        ''
      )
        .then(async (result) => {
          console.log(result, 'result')
          if (result.success) {
            this.processTransaction(result)
          } else {
            this.error = result.message
          }
        })
        .catch((error) => {
          this.error = error
          this.spinner = false
        })
    },
    cancel () {
      this.$q.bex.send('result.listener.' + this.payloadId, { approve: false })
    },
    test () {
      let t = {
        chainId: 56,
        data: '0x095ea7b300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        from: '0x915f86d27e4e4a58e93e59459119faaf610b5be1',
        gas: '0xbece',
        gasPrice: '0x12a05f200',
        to: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3'
      }
      Lib.gas('bsc', t).then(i => {
        console.log(i, 'i')
      })
    },
    async processTransaction (result) {
      this.txData.hash = result.transaction_id
      this.txData.status = 'Submitted'
      this.txData.explorer_link = result.message
      this.$q.bex.send('result.listener.' + this.payloadId, { result: result.transaction_id, approve: true })
      /* if (this.txObject) {
        let obj = {
          txId: this.$route.params.txId,
          hash: this.txData.hash,
          error: null
        }
      //  await ParseDB.createUseACLObject('TransactionEvents', obj)
      } */
      let status = await Lib.checkEvmTxStatus(
        this.txData.hash,
        this.chain
      )
      if (status) {
        this.txData.status = 'Success'
      } else {
        this.txData.status = 'Failed'
      }
      initWallet(this.txData.from)
    }
  },
  created () {
    let data = ['gas', 'gasPrice', 'to', 'data', 'from', 'value']

    if (this.txObject) {
      this.chain = this.txObject.get('chain')
      data.forEach(element => {
        this.txData[element] = this.txObject.get(element)
      })
    } else if (this.tx) {
      const Web3 = require('web3')
      this.evm = Lib.getEvmData(this.tx.chainId)
      // if(!evm) To be handled later
      if (!this.txData.value) {
        this.txData.value = 0
      }
      this.chain = this.evm.chain
      Lib.gas(this.evm.chain, this.tx)
        .then(o => {
          let g = o.length > 1 ? o[1] : o[0]
          this.gasData = {
            gas: Web3.utils.hexToNumber(this.tx.gas),
            gasPrice: g.gasPrice,
            ethPrice: g.isUsd,
            ethVal: Web3.utils.hexToNumber(this.tx.gas) * g.gasPrice / (10 ** 18),
            usdVal: Web3.utils.hexToNumber(this.tx.gas) * g.gasPrice / (10 ** 18) * g.isUsd
          }
        }).catch(e => {
          this.error = e.message ? e.message : e
        })
      for (let i in this.tx) {
        this.$set(this.txData, i, this.tx[i])
      }

      if (this.txData.data === '0x') {
        this.txData.data = ''
      }
    }
    /*
    this.processTransaction({
      transaction_id: '0xf15a9445fbfa94e6e4dd0d930dc2c3f9d8efc18c7b3e0be266972d9dbae6dbdc',
      message: 'https://etherscan.io/tx/'
    }) */
  },
  data () {
    return {
      chain: 'eth',
      token: null,
      evm: null,
      error: null,
      gasData: null,
      txData: {
        status: false,
        hash: false
      }
    }
  }
}
</script>
<style scoped>
@charset "UTF-8";

a {
  text-decoration: none;
}

/* stylelint-disable */
#app-content {
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
}
@media screen and (max-width: 575px) {
  #app-content {
    background-color: #fff;
  }
}

/* stylelint-enable */

/** Default Typography on base elements **/
* {
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
}

/** Please import your files in alphabetical order **/
.account-list-item__top-row {
  display: flex;
  margin-top: 10px;
  margin-left: 8px;
  position: relative;
}
.account-list-item__account-name {
  font-size: 1rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  margin-left: 8px;
}

.request-signature__container {
  width: 380px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  flex-flow: column nowrap;
  z-index: 25;
  align-items: center;
  position: relative;
  height: 100%;
}
@media screen and (max-width: 575px) {
  .request-signature__container {
    width: 100%;
    top: 0;
    box-shadow: none;
  }
}
@media screen and (min-width: 576px) {
  .request-signature__container {
   /*  height: 620px; */
  }
}
div#app-content {
    width: 100%;
}
.request-signature__header {
  height: 64px;
  width: 100%;
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
}
.request-signature__header-background {
  position: absolute;
  background-color: #e9edf0;
  z-index: 2;
  width: 100%;
  height: 100%;
}
.request-signature__header__text {
  font-size: 1.5rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  color: #5b5d67;
  z-index: 3;
}
.request-signature__header__tip-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.request-signature__header__tip {
  height: 25px;
  width: 25px;
  background: #e9edf0;
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
  position: absolute;
  bottom: -8px;
  z-index: 1;
}
.request-signature__account-info {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  margin-bottom: 20px;
}
.request-signature__account {
  color: #9b9b9b;
  margin-left: 17px;
}
.request-signature__account-text {
  font-size: 0.875rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
}
.request-signature__account-item {
  font-size: 0.75rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  height: 22px;
  background-color: #fff;
  width: 124px;
}
.request-signature__account-item .account-list-item {
  margin-top: 6px;
}
.request-signature__account-item .account-list-item__account-name {
  text-overflow: ellipsis;

  white-space: nowrap;
  width: 80px;
}
.request-signature__account-item .account-list-item__top-row {
  margin: 0;
}
.request-signature__balance {
  color: #9b9b9b;
  margin-right: 17px;
  width: 124px;
}
.request-signature__balance-text {
  font-size: 0.875rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  text-align: right;
}
.request-signature__balance-value {
  text-align: right;
  margin-top: 2.5px;
}
.request-signature__request-icon {
  margin-top: 25px;
}
.request-signature__body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
  height: 0;
}
.request-signature__origin-row {
  font-size: 1rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  display: flex;
  margin: 0 15px;
}
.request-signature__origin-label {
  flex-grow: 1;
  margin-right: 5px;
}
.request-signature__origin {
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.request-signature__notice {
  font-size: 0.875rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  text-align: center;
  margin-top: 41px;
  margin-bottom: 11px;
  width: 100%;
}
.request-signature__notice {
  color: #9b9b9b;
}
.request-signature__rows {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  border-top: 1px solid #d2d8dd;
  display: flex;
  flex-flow: column;
}
.request-signature__row {
  display: flex;
  flex-flow: column;
  flex: 1 0 auto;
}
.request-signature__row-title {
  font-size: 1rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  width: 80px;
  color: #9b9b9b;
  margin-top: 12px;
  margin-left: 18px;
  width: 100%;
}
.request-signature__row-value {
  font-size: 0.875rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  color: #5d5d5d;
  width: 100%;
  overflow-wrap: break-word;
  border-bottom: 1px solid #d2d8dd;
  padding: 6px 18px 15px;
  white-space: pre-line;
}
.request-signature__footer {
  font-size: 1.5rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 0 0 auto;
  border-top: 1px solid #d2d8dd;
  padding: 1.6rem;
}
.request-signature__footer button {
  width: 165px;
}
.request-signature__footer__cancel-button {
  margin-right: 1.2rem;
}

.button {
  font-size: 0.875rem;
  font-family: Euclid, Roboto, Helvetica, Arial, sans-serif;
  line-height: 140%;
  font-style: normal;
  font-weight: normal;
  font-weight: 500;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100%;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.btn-secondary {
  color: #037dd6;
  border: 1px solid #b0d7f2;
  background-color: #fff;
}
.btn-secondary:hover {
  border-color: #037dd6;
}
.btn-secondary:active {
  background: #eaf6ff;
  border-color: #037dd6;
}

.btn-default {
  color: #6a737d;
  border: 1px solid #b3b3b3;
}
.btn-default:hover {
  border-color: #6a737d;
}
.btn-default:active {
  background: #fbfbfc;
  border-color: #6a737d;
}

.btn--large {
  min-height: 54px;
}

/*
  Z-Indicies
*/
.chip--with-input .chip__input:focus-visible {
  outline: none;
}

.icon-border {
  border-radius: 50%;
  border: 1px solid #f2f3f4;
  background: #ececf0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.identicon {
  /*rtl:ignore*/
  direction: ltr;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.identicon__image-border {
  border: 1px solid #dedede;
  background: #fff;
}

/* lib */

.network-droppo {
  right: 2px;
}
@media screen and (min-width: 576px) {
  .network-droppo {
    right: calc(((100% - 85vw) / 2) + 2px);
  }
}
@media screen and (min-width: 769px) {
  .network-droppo {
    right: calc(((100% - 80vw) / 2) + 2px);
  }
}
@media screen and (min-width: 1281px) {
  .network-droppo {
    right: calc(((100% - 65vw) / 2) + 2px);
  }
}

/*
  NewUI Container Elements
 */
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  position: relative;
  align-items: center;
}

.app.os-mac.browser-chrome::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background-color: #f2f3f4;
  -webkit-animation: emptySpinningDiv 1s infinite linear;
          animation: emptySpinningDiv 1s infinite linear;
}

@-webkit-keyframes emptySpinningDiv {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
  }
}

@keyframes emptySpinningDiv {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
  }
}

.main-container-wrapper {
  display: flex;
  justify-content: center;
  flex: 1 0 auto;
  min-height: 0;
  width: 100%;
}
@media screen and (max-width: 575px) {

  .main-container-wrapper {
    flex: 1;
  }
}

/* Send Screen */

/*
  Third Party Library Styles
*/
</style>
