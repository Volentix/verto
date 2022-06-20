<template>
     <q-card :dark="$store.state.settings.lightMode === 'true'">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Action Required</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="text-body1">
          {{ dialog.msg }}

          <div>
          <div class="text-body1 q-pt-sm">
         <div class="text-bold q-pb-sm"> Click here to {{chain  == 'eos' ? 'import or create' : 'import'}} an account</div>
          <q-btn :label="'Import '+chain.toUpperCase()+' account'" :to="dialog.to" rounded outline/>
          </div>
          <div class="text-body1 q-pt-md" v-if="dialog.key">
            <div class="text-bold">or deposit funds in your Verto wallet</div>
        <q-input

            v-model="dialog.key"
            :dark="$store.state.settings.lightMode === 'true'"
            :light="$store.state.settings.lightMode === 'false'"
            color="green"
            label="Key"
             style="max-width:300px"
            readonly
          >
            <template v-slot:prepend>
              <q-btn icon="file_copy" label="Copy" outline rounded @click="copyToClipboard(dialog.key, 'Key')" />
            </template>
          </q-input>
          </div>
          </div>
        </q-card-section>
      </q-card>
</template>
<script>
import Formatter from '@/mixins/Formatter'
export default {
  props: ['chain'],
  mixins: [Formatter],
  data () {
    return {
      dialog: {

      }
    }
  },
  created () {
    let isDefault = this.setDefaultWallet(this.chain)
    this.dialog.msg = 'Cannot use this token'
    this.dialog.to = this.getImportLink(this.chain)
    this.dialog.key = isDefault
      ? isDefault.chain === 'eos'
        ? isDefault.name
        : isDefault.key
      : false
  }
}
</script>
