<template>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-body1 text-bold"><q-icon :name="'img:'+chain.icon" class="q-pr-sm" />{{chain.label}} accounts: {{(field == 'key' ? 'Public keys' : (field == 'privateKey' ? 'Private keys' : '' )) }}</div>
        </q-card-section>
        <q-card-section @click="copyToClipboard(account[field],'Copied')" class="q-pt-none" v-for="(account , index) in chain.accounts" :key="index">
         {{account.name}}
         <div class="text-body1 q-pt-md copy-key" >
               {{account.chain == 'eos' && field == 'key' ? account.name : getKeyFormat(account[field], 20)}} <q-icon name="o_file_copy"  />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
import Formatter from '@/mixins/Formatter'
export default {
  props: ['chain', 'field'],
  mixins: [Formatter],
  data () {
    return {
      alert: true
    }
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
</style>
