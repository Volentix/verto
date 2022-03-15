<template>
  <q-dialog @hide="$emit('hideDialog')" v-model="openDialog" v-if="error.msg">

     <q-card :dark="$store.state.settings.lightMode === 'true'" class="text-body1">
      <q-toolbar >
        <q-toolbar-title><span class="text-weight-bold q-pl-sm">Before you {{error.data.token.action.toLowerCase()}}</span></q-toolbar-title>

        <q-btn flat round dense icon="close" @click="$emit('hideDialog')" v-close-popup />
    </q-toolbar>
      <div class="q-pa-md">
         {{error.msg}}
      </div>
      <div class="q-pa-md">
     <q-btn outline @click="$router.push(getImportLink(error.data.token.chain))" class="q-mr-md" :label="'Import '+error.data.token.chain+' wallet'" />
     <q-btn  @click="exchangeToken(error.data.token)"  outline :label="'Buy '+error.data.token.type" />
     </div>
     </q-card>

    </q-dialog>
</template>
<script>
import Formatter from '../../../mixins/Formatter'
export default {
  mixins: [Formatter],
  props: ['error'],
  data () {
    return {
      openDialog: true
    }
  }
}
</script>
