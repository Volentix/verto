<template>
  <q-page :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-grey-12': $store.state.settings.lightMode === 'false', 'desktop-marg': screenSize > 1024,  'mobile-pad': screenSize < 1024}">
    <div class="text-h5">
      {{xlmkeys}}
    </div>
  </q-page>
</template>

<script>
import HD from '@/util/hdwallet'

export default {
  components: {
  },
  data () {
    return {
      xlmkeys: []
    }
  },
  created () {
    this.xlmkeys = HD.Wallet('xlm')

    console.log(this.xlmkeys)
  }
}

</script>
