<template>
  <q-dialog  :dark="$store.state.settings.lightMode === 'true'" v-model="alert">
    <q-card :class="{'min-size': !$q.platform.is.mobile}" :dark="$store.state.settings.lightMode === 'true'" style="width: 100%;max-width: 96%">
      <q-card-section>
        <!-- Public keys removed -->
        <div v-if="currentChain" class="text-body1 text-bold">
          <q-icon :name="'img:'+currentChain.icon" class="q-pr-sm" />
         Importing {{currentChain.label}} token
        </div>
             <q-btn v-close-popup class="close_qr_code_popup absolute-top-right q-pa-md" dense flat icon="close" />
      </q-card-section>

        <div class="q-px-md row q-col-gutter-md q-mb-md" >
         <q-select
       @input="getTokenData()"
      :dark="$store.state.settings.lightMode === 'true'"
      :light="$store.state.settings.lightMode === 'false'"
      separator
      filled
      label="Selected chain"
      dense
      class="select-input q-pt-md col-md-12"
      v-model="currentChain"
      :options="chainsData"
    >
      <template v-slot:option="scope">
        <q-item
          class="custom-menu"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-icon class="option--avatar" :name="`img:${scope.opt.icon}`" />
          </q-item-section>
          <q-item-section dark>
            <q-item-label class="ellipsis" v-html="scope.opt.label" />

          </q-item-section>
        </q-item>
      </template>

      <template v-slot:selected>
        <q-item v-if="currentChain">
          <q-item-section avatar>
            <q-icon
              class="option--avatar"
              :name="`img:${currentChain.icon}`"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis" v-html="currentChain.label" />
          </q-item-section>
        </q-item>
        <q-item v-else> </q-item>
      </template>
    </q-select>
         <q-input      :dark="$store.state.settings.lightMode === 'true'" @input="getTokenData" class="col-md-12" filled v-model="address" label="Enter token address" />
          <q-input     :dark="$store.state.settings.lightMode === 'true'" :disable="readOnly.symbol"  v-if="fetchToken" class="col-md-6" filled v-model="symbol" label="Enter token symbol"   />
           <q-input      :dark="$store.state.settings.lightMode === 'true'" :disable="readOnly.decimals" v-if="fetchToken" class="col-md-6"  filled v-model="decimals" type="number" label="Decimals"  />
        </div>
        <p v-if="error" class="text-red q-pl-md">{{error}}</p>
        <p v-else-if="success"  class="text-green q-pl-md">{{success}}</p>
        <q-card-actions align="right" class="text-primary q-pr-md q-pb-md">
          <q-btn     :dark="$store.state.settings.lightMode === 'true'" flat label="Cancel" v-close-popup />
          <q-btn     :dark="$store.state.settings.lightMode === 'true'"  @click="updateLocalSettings" :disable="!fetchToken" rounded color="black" label="Add Token"  />
        </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import Formatter from '@/mixins/Formatter'
import Lib from '@/util/walletlib'
import HD from '@/util/hdwallet'
import initWallet from '@/util/_Wallets2Tokens'
export default {
  props: ['chain', 'currentChainSymbol'],
  mixins: [Formatter],
  data () {
    return {
      alert: true,
      fetchToken: false,
      error: false,
      success: false,
      address: null,
      symbol: null,
      readOnly: {
        decimals: false,
        symbol: false
      },
      decimals: null,
      chainsData: [],
      currentChain: null
    }
  },
  methods: {
    updateLocalSettings () {
      let data = localStorage.getItem('customTokens')
      let settings = (data ? JSON.parse(data) : [])
      let index = settings.findIndex(o => o.address.toLowerCase() === this.address.toLowerCase() && o.chain.toLowerCase() === this.currentChain.chain.toLowerCase() && o.type.toLowerCase() === this.symbol.toLowerCase() && parseInt(o.decimals) === parseInt(this.decimals))

      if (index > -1) {
        settings.splice(index, 1)
      }
      settings.push({
        address: this.address.toLowerCase(),
        type: this.symbol.toLowerCase(),
        chain: this.currentChain.chain,
        decimals: this.decimals
      })
      localStorage.setItem('customTokens', JSON.stringify(settings))
      initWallet('init')
      this.success = 'Token successfully imported'
    },
    async  getTokenData () {
      this.success = false
      this.fetchToken = false
      this.error = false
      if (!this.address) return
      let valid = Lib.isEthValidAddress(this.address)
      if (!valid) return
      let token = await Lib.getEvmToken(this.address, this.currentChain.chain)

      if (token.symbol) {
        this.readOnly.symbol = true
        this.readOnly.decimals = true
        this.decimals = token.decimals
        this.symbol = token.symbol
        this.fetchToken = true
      } else {
        this.error = 'Invalid token address'
      }
    }
  },
  mounted () {
    this.chainsData = HD.getVertoChains().filter(o => o.isEvm)
    this.currentChain = this.chainsData.find(o => o.value.toLowerCase() === this.currentChainSymbol.toLowerCase())
  }
}
</script>

<style lang="scss" scoped>
.copy-key {
    background: #f2f2f2;
    padding: 10px;
    border-radius: 5px;
    font-size: 13px;
  }
  .q-icon{
    width: 30px;
    height: 30px;
  }
  .identicon{
    overflow: hidden;
    background: #FFF;
    width: 30px;
    border-radius: 10px;
    height: 30px;
    outline: 1px solid #64b5f6;
    svg{
    }
  }
  .qr_code_wrapper{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    max-width: 80vw;
    height: 100vh;
    max-height: calc(50vh);
    z-index: 9;
    background-color: #fff;
    visibility: hidden;
    .close_qr_code_popup{
      position: absolute;
      right: 10px;
      top: 0px;
    }
    canvas{
      transform: scale3d(1.5,1.5,1.5);
    }
    &.show{
      visibility: visible;
    }
    .account_name_text{
      position: absolute;
      top: 10px;
    }
    .scan_text{
      position: absolute;
      bottom: 10px;
    }
  }
  .q-dialog .q-card.q-card--dark.q-dark{
    .copy-key {
      background: #0e1829;
    }
    .identicon{
      background: #0e1829;
    }
    .qr_code_wrapper{
      background-color: #050a10;
    }
  }
  .min-size {
     width:400px  !important
  }
</style>
