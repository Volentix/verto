<template>
<div>

     <q-list :class="{'q-pt-md': miniMode}" v-if="gasOptions.length && (currentAccount.isEvm || currentAccount.chain == 'btc' )" class="gasfield q-mb-sm"  separator>
              <span>{{gasOptions.length ==1 ? 'Gas fee' : 'Select gas'}} <span v-if="txData.title">({{txData.title}})</span></span>
                    <div dense class="gasSelector row q-pt-sm" >
                        <div class="col-md-4" :class="{'col-md-12 q-mb-sm': miniMode}" v-for="(gas, index) in gasOptions" :key="index">
                            <q-item :class="[gasSelected.label == gas.label && !customGas ? 'selected bg-black text-white' : '' , gas.label]" @click="gasSelected = gas ; $emit('setGas', {chain: currentAccount.chain, value:gas})" clickable separator v-ripple>
                                <q-item-section>
                                    <q-item-label :class="[gasSelected.label == gas.label ? 'text-black' : 'text-body1 ']">{{gas.isUsd ? '$'+formatNumber(gas.value) : gas.nativeToken.toUpperCase()+ ' '+gas.value  }}</q-item-label>
                                    <q-item-label class="text-body1 text-grey text-capitalize" caption> {{gas.label }}</q-item-label>
                                </q-item-section>
                                <q-item-section  v-if="!miniMode" avatar>
                                    <q-icon color="primary" name="local_gas_station" />
                                </q-item-section>
                            </q-item>
                        </div>

                        <div class="col-md-4" :class="{'col-md-12': miniMode}" v-if="customGas">
                            <q-item class="selected bg-black text-white" clickable separator v-ripple>
                                <q-item-section>
                                    <q-item-label class="text-black">${{customGas.value}}</q-item-label>
                                    <q-item-label class="text-body1 text-grey"> Custom </q-item-label>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon color="primary" name="local_gas_station" />
                                </q-item-section>
                            </q-item>
                        </div>
                    </div>
                    <q-item v-if="txData.info" ctive-class="text-green">
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section>{{txData.info}}</q-item-section>
      </q-item>

                </q-list>
                  <p class="text-red" v-if="error">{{parseError(error)}}</p>
                    <span v-else-if="!error && !gasOptions.length">
                        <q-linear-progress class="q-my-md" indeterminate color="grey" />

</span>
                   <p class="text-caption"  v-else-if="gasSelected && gasSelected.requiredNativeAmount">{{parseFloat(gasSelected.requiredNativeAmount).toFixed(5)}} {{gasSelected.nativeToken.toUpperCase()}} required</p>
                </div>
</template>
<script>
let demoTo = {
  eth: '0x0000000000000000000000000000000000000000',
  btc: ''
}
import Lib from '@/util/walletlib'
import Formatter from '@/mixins/Formatter'
export default {
  props: ['currentAccount', 'type', 'txData', 'txObject'],
  data () {
    return {
      gasOptions: [],
      customGas: false,
      gasSelected: null,
      miniMode: false,
      evmData: null,
      error: null
    }
  },
  created () {
    let tokenType = this.type
    if (!this.type && this.currentAccount.isEvm) {
      let evmData = Lib.evms.find(o => o.chain === this.currentAccount.chain)
      tokenType = evmData.nativeToken
    }
    this.evmData = Lib.evms.find(o => o.chain === this.currentAccount.chain)
    this.currentToken = this.$store.state.wallets.tokens.find(o => o.chain === this.currentAccount.chain && ((this.currentAccount.isEvm && o.type === this.evmData.nativeToken) || o.type === tokenType) && (this.currentAccount.chain !== 'eos' || o.name.toLowerCase() === this.currentAccount.name.toLowerCase()))

    if (this.txData.method === 'mint') {
      this.getDemoGasMintForRen()
    } else if (this.txData.method === 'txObject') {
      this.checkGasForTxObject(this.txObject)
    } else {
      this.checkGasForTransfer()
    }
  },
  methods: {
    parseError (error) {
      if (error.toString().includes('newStakedHearts must be at least minimum') || error.toString().includes('Returned error: execution reverted: ERC20: burn amoun')) {
        error = 'Insuficient HEX balance'
      }
      return error
    },
    /* Getting the cost for a mint transaction on the renbrige contract without passing the user params - being used in function where you don't know some of these params yet */
    async getDemoGasMintForRen () {
      this.error = null
      const Web3 = require('web3')
      let localWeb3 = new Web3(new Web3.providers.HttpProvider(this.evmData.provider))
      let nonce = await localWeb3.eth.getTransactionCount(this.currentAccount.key)

      let rawTx = {
        from: this.currentAccount.key,
        to: '0x32666B64e9fD0F44916E1378Efb2CFa3B3B96e80',
        nonce,
        value: '0x',
        data: '0x77f6140300000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000915f86d27e4e4a58e93e59459119faaf610b5be10000000000000000000000000000000000000000000000000000000000018ad0f2d8dcf9405ec0c8b9794516cc6cc0457500fbf80f762e529e66018c3a67cf3d00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000003425443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000411d22ea991d25541593624fdc3c12c4c80796ff40bfeb5762b1cca28e85ec071f041fb2b8b726cbf213d5747a72cd964deccf2f548ccb6f4282dcee94a95ce9a61b00000000000000000000000000000000000000000000000000000000000000',
        chainId: this.evmData.network_id
      }

      Lib.gas(
        this.currentAccount.chain,
        rawTx,
        this.evmData.nativeToken,
        this.currentToken.tokenPrice,
        this.currentAccount.chain === 'eth' ? 200000 : null
      ).then((res) => {
        this.gasOptions = res
        if (!this.gasSelected) {
          this.gasSelected = res.length > 1 ? res[1] : res[0]
          this.$emit('setGas', { chain: this.currentAccount.chain, value: this.gasSelected, method: this.txData.method })
        }
      }).catch(e => {
        this.error = e
      })
    }, /*
    checkForTokenTransfer () {
      let rawTx = {
        from: this.currentAccount.key,
        to: '0x32666B64e9fD0F44916E1378Efb2CFa3B3B96e80',
        nonce,
        value: '0x',
        data: '0x095ea7b3000000000000000000000000e592427a0aece92de3edee1f18e0157c05861564ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        chainId: this.evmData.network_id
      }
    }, */
    checkGasForTxObject (txObject) {
      /* if (txObject.gasPrice) {

          this.gasSelected = {
            label: 'Gas fees',
            value: web3.utils.fromWei(parseInt(gasObj.gasPrice).toString(), 'ether') * gasObj.gas * (gasObj.isUsd ? tokenPrice : 1)
          }
        this.gasOptions = [this.gasSelected]
      } */
      console.log(txObject, 'txObject')
      delete txObject.gasPrice
      Lib.gas(
        this.currentAccount.chain,
        txObject,
        this.evmData.nativeToken,
        this.currentToken ? this.currentToken.tokenPrice : false
      ).then((res) => {
        this.gasOptions = res

        if (!this.gasSelected) {
          this.gasSelected = res.length > 1 ? res[1] : res[0]
          this.$emit('setGas', { chain: this.currentAccount.chain, value: this.gasSelected })
        }
      }).catch(e => {
        console.log(e)
        this.error = e
      })
    },
    checkGasForTransfer () {
      this.error = null
      try {
        if (this.currentAccount.isEvm) {
          Lib.getRawETHTransaction(
            this.currentToken.type,
            this.currentAccount.key,
            demoTo[this.currentAccount.chain],
            this.data.amount,
            '',
            this.currentToken.contract,
            '',
            this.currentAccount.chain
          ).then((tx) => {
            Lib.gas(
              this.currentAccount.chain,
              {},
              this.currentToken.type,
              this.currentToken.tokenPrice
            ).then((res) => {
              this.gasOptions = res
              if (!this.gasSelected) {
                this.gasSelected = res.length > 1 ? res[1] : res[0]
                this.$emit('setGas', { chain: this.currentAccount.chain, value: this.gasSelected })
              }
            }).catch(e => {
              this.error = e
            })
          }).catch(e => {
            this.error = e
          })
        } else if (this.currentAccount.chain === 'btc') {
          Lib.gas(
            this.currentAccount.chain,
            {},
            this.currentToken.type,
            this.$store.state.currentwallet.wallet.tokenPrice
          ).then((res) => {
            this.gasOptions = res
            if (!this.gasSelected) {
              this.gasSelected = res.length > 1 ? res[1] : res[0]
              this.$emit('setGas', { chain: this.currentAccount.chain, value: this.gasSelected })
            }
          })
        }
      } catch (error) {
        this.ErrorMessage = error.message
      }
    }
  },
  mixins: [Formatter]
}
</script>
<style scoped>

.gasfield {
    /deep/ .q-item.gasSelector {
        padding-left: 0px;
        padding-right: 0px;

        .q-item__section {
            .q-item--clickable {
                border-radius: 40px;
                margin-right: 20px;
                padding: 15px 30px;
            }
        }
    }
}

  .gasSelector .q-item {
    border: 1px solid #f1e7e7
}

.Slow i {
    color: #a0afae !important;
}

.Fast i {
    color: #00d0ca !important;
}

.Instant i {
    color: #7272fa !important;
}

.gasfield .selected {
    background: #dfdff1 !important;
}
</style>
