<template>
    <div class="q-pa-md">
        <div class="q-pb-md">
                <div class="text-h4 text-bold">US$0.00</div>
                <div class="text-grey"> ~0.00% last 24hrs</div>
            </div>
            <div class="q-pb-lg">
                <q-toolbar class="bg-white shadow-2 rounded-borders row justify-between">
                    <div>
                        <q-btn flat round dense color="green" icon="send"  style="margin-right:-10px;"/>
                        <q-btn flat color="primary" class="text-bold" @click="callChainTools"> Send </q-btn>
                    </div>
                    <q-separator vertical inset color="grey"/>
                    <div>
                        <q-btn flat round dense color="green" icon="call_received" class="q-pl-md" style="margin-right:-10px;"/>
                        <q-btn flat color="primary" class="text-bold"> Receive</q-btn>
                    </div>
                </q-toolbar>
            </div>
            <div class="q-pb-sm row justify-between">
                <div class="text-h6 text-bold">My Wallets</div>
                <div>
                    <q-btn flat round dense color="green" icon="add" style="margin-right:-20px;"/>
                    <q-btn flat color="primary" class="text-bold">Add/Import</q-btn>
                </div>
            </div>
            <div class="q-pb-lg">
                <q-list   class="rounded-borders bg-white" style="">
                    <q-item clickable v-ripple>
                        <q-item-section avatar top>
                            <q-avatar icon="attach_money" color="green" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label lines="1" class="text-bold">My BCH Wallet</q-item-label>
                            <q-item-label caption >0 BCH</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <div class="text-grey text-h6"> US$0.00 </div>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
    </div>
</template>

<script>
export default {
  name: 'AccountPanel',
  props: ['chainTools'],
  data () {
    return {
    }
  },
  methods: {
    callChainTools () {
      // keys.send++ ; chainTools.send = true
      console.log('chainCalling ', this.chainTools)
      this.$emit('update:chainTools', { show: this.chainTools.show, send: true })
      console.log('chainCalling ,,,,,', this.chainTools)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
