<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat class="bg-black">
      <q-card flat class="bg-black" style="width: 100%">
        <img
          src="statics/img/Artboard_3back3.png"
          style="width: 100%"
        />
        <div class="q-pa-md q-gutter-sm text-center">
          <q-btn outline rounded color="white" label="Become a VDEX Node" @click.native="openURL('https://github.com/Volentix/vDexNode-GUI/releases')"/>
          <q-btn outline rounded color="white" label="Vote" disabled />
          <q-btn outline rounded color="white" label="Stake VTX" disabled />
        </div>
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'Nodes',
  methods: {
    openURL (url) {
      if (this.$q.platform.is.cordova) {
        window.open(url, '_system')
      } else {
        openURL(url)
      }
    }
  }
}
</script>

<style>
</style>
