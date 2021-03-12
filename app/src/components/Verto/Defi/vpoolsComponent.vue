<template>
  <div  class="full-width">

    <q-card flat>

      <q-tabs v-model="tab" dense class="bg-grey-3" align="justify" narrow-indicator>
        <q-tab name="channels" label="Balances" />
         <q-tab name="balances" v-show="false" label="Balances" />
        <q-tab name="tokens" label="Pools & Investments" />
        <q-tab name="movies" label="Opportunities" />
      </q-tabs>
        <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="channels">
          <div class="text-h6 q-pb-md">Current liquidity</div>
          <q-list separator>
            <q-item v-for="token in openChannels" :key="token.id" class="q-mb-sm" >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="coins.find((w) => w.value.toLowerCase() === token.balance.quantity.split(' ')[1].toLowerCase()).image" />
                </q-avatar>
              </q-item-section>

              <q-item-section top>
                <q-item-label >{{token.balance.quantity.split(' ')[1]}} balance</q-item-label>
                  <q-item-label caption>{{balances[token.balance.quantity.split(' ')[1]+'_'+token.balance.contract] ? balances[token.balance.quantity.split(' ')[1]+'_'+token.balance.contract] : balanceStatus}}</q-item-label>
               <q-item-label caption>{{ token.balance.contract }}</q-item-label>

           </q-item-section>
         <q-item-section v-if="false" top class="col-2 gt-sm">
         <q-btn class="gt-xs" size="12px" flat dense round icon="add" label="Add"/>
        </q-item-section>
        <q-item-section  v-if="false" top class="col-2 gt-sm">
         <q-btn class="gt-xs" size="12px" flat dense round icon="remove" label="Remove"/>
        </q-item-section>

              <q-item-section   v-if="false" side>
                <q-btn icon="clear" color="grey"  label="Close"   dense flat  />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="tokens">
          <div class="text-h6 q-pb-md">Tokens Balance</div>
          <q-list separator>
            <q-item v-for="token in tokensBalance" :key="token.id" class="q-mb-sm" clickable v-ripple>
             <q-item-section class="flex" avatar>
                <q-avatar v-if="token.images" class>
                   <img :src="token.images[0]" />
              </q-avatar>

              </q-item-section>
              <q-item-section class="flex" avatar>
               <q-avatar v-if="token.images">
                   <img :src="token.images[1]" />
              </q-avatar>
              </q-item-section>
              <q-item-section class="col-2">
                <q-item-label
                  ><span class="text-bold">{{ token.balance.split(" ")[0] }}</span> {{ token.balance.split(" ")[1] }}
                </q-item-label>
              </q-item-section>

              <q-item-section  v-if="token.data" class="col">
                <q-item-label> <span class="text-bold">Fees: </span> {{token.data.fee}}</q-item-label>
                <q-item-label caption>  {{ token.data.fee_contract }}</q-item-label>
              </q-item-section>

         <q-item-section v-if="token.data" top class="col-2 gt-sm">
          <q-item-label class="text-bold">Supply </q-item-label>
        <q-item-label >{{token.data.supply}} </q-item-label>
        </q-item-section>
         <q-item-section v-if="token.data" top class="col-2 gt-sm">
          <q-item-label class="text-bold" >Max Supply </q-item-label>
        <q-item-label >{{parseInt(token.data.max_supply).toLocaleString()}} </q-item-label>
        </q-item-section>
 <q-item-section v-if="token.data" top class="col gt-sm">
          <q-item-label caption >{{ token.data.pool1.quantity }} </q-item-label>
       <q-item-label caption >{{ token.data.pool2.quantity }} </q-item-label>
        </q-item-section>

            </q-item>
          </q-list>
        </q-tab-panel>

      </q-tab-panels>

    </q-card>
  </div>
</template>
<script>
import {
  EosRPC //, EosAPI
} from '@/util/EosInterac'
// const api = new EosAPI('5JDCvBSasZRiyHXCkGNQC7EXdTNjima4MXKoYCbs9asRiNvDukc', 'http://140.82.56.143:8888')
const testnetRpc = new EosRPC('http://140.82.56.143:8888')
import DexInteraction from '../../../mixins/DexInteraction'
export default {
  data () {
    return {
      eosAccount: 'berthonytha2',
      tokensBalance: [],
      openChannels: [],
      tab: 'tokens',
      balanceStatus: 'Fetching...',
      balances: {

      },
      tokenInfos: {

      }
    }
  },
  methods: {
    async  getBalance (currency, contract) {
      let balance = (await testnetRpc.rpc.get_currency_balance(contract, this.eosAccount, currency))[0]
      this.$set(this.balances, currency + '_' + contract, balance)
    }
  },
  async mounted () {
    this.tokensBalance = await testnetRpc.getTable('vpools2', this.eosAccount, 'accounts')
    this.openChannels = await testnetRpc.getTable('vpools2', this.eosAccount, 'vpoolsacnts')

    this.openChannels.forEach((token) => {
      this.getBalance(token.balance.quantity.split(' ')[1], token.balance.contract)
    })
    this.tokensBalance.forEach(async (token, index) => {
      let data = (await testnetRpc.getTable('vpools2', token.balance.split(' ')[1], 'stat'))[0]
      this.tokensBalance[index].images = []
      this.tokensBalance[index].images.push(this.coins.find((w) => w.value.toLowerCase() === data.pool1.quantity.split(' ')[1].toLowerCase()).image)
      this.tokensBalance[index].images.push(this.coins.find((w) => w.value.toLowerCase() === data.pool2.quantity.split(' ')[1].toLowerCase()).image)
      this.tokensBalance[index].data = data
    })

    this.coins = this.getAllCoins()
    this.balanceStatus = '-'
  },
  mixins: [DexInteraction]
}
</script>
>
