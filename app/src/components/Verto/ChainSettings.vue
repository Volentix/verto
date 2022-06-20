<template>
  <div class="q-pa-md" style="max-width:400px">
   <q-header class="bg-white" v-if="$q.platform.is.mobile">
              <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                <q-toolbar-title> Network settings </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
              </q-toolbar>
            </q-header>
    <div  :class="{'text-white':$store.state.settings.lightMode === 'true'}">Switch chain to change settings</div>
   <div class="q-py-sm text-deep-purple-12" :class="{'text-white':$store.state.settings.lightMode === 'true'}" v-if="changed"> Remember to refresh your wallet to see new changes</div>
    <q-select
      @input="getSettings(); "
      :dark="$store.state.settings.lightMode === 'true'"
      :light="$store.state.settings.lightMode === 'false'"
      separator
      rounded
      outlined
      class="select-input q-pt-md"
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
            <q-item-label caption>{{ scope.opt.value }}</q-item-label>
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
            <q-item-label caption>{{ currentChain.value }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-else> </q-item>
      </template>
    </q-select>
    <q-input  :dark="$store.state.settings.lightMode === 'true'" v-if="currentChain && settings[currentChain.chain]" class="q-mt-md" filled v-model="settings[currentChain.chain].provider" @input="changed = true ; isValidUrl(settings[currentChain.chain].provider) ? updateLocalSettings() : ''" :rules="[val => isValidUrl(settings[currentChain.chain].provider) || 'Invalid url']" label="Provider" />
    <q-input :dark="$store.state.settings.lightMode === 'true'" v-if="currentChain && settings[currentChain.chain]" class="q-mt-md" filled v-model="settings[currentChain.chain].explorer" @input="isValidUrl(settings[currentChain.chain].explorer) ? updateLocalSettings() : ''"  :rules="[val => isValidUrl(settings[currentChain.chain].explorer) || 'Invalid url']" label="Chain explorer" />
    <q-input  :dark="$store.state.settings.lightMode === 'true'" readonly v-if="currentChain && settings[currentChain.chain] && settings[currentChain.chain].gas" class="q-mt-md" filled v-model="settings[currentChain.chain].gas" label="Gas station" />
    <q-btn  :dark="$store.state.settings.lightMode === 'true'" label="Reset" class="q-mt-md" outline @click="getSettings(true)" />
  </div>
</template>
<script>
import Lib from '@/util/walletlib'
import Formatter from '@/mixins/Formatter'
export default {
  mixins: [Formatter],
  data () {
    return {

      settings: {},
      changed: false,
      currentChain: null,
      chainsData: []
    }
  },
  watch: {
    settings: {
      deep: true,
      handler: (newVal) => {
        // localStorage.setItem('chainSettings', JSON.stringify(newVal))
      }
    }
  },
  mounted () {
    let data = localStorage.getItem('chainSettings')
    if (data) {
      this.settings = JSON.parse(data)
    } else {
    }
    this.chainsData = this.setChains()
    this.chainsData.forEach(element => {
      this.$set(this.settings, element.chain, {})
    })
    this.currentChain = this.chainsData.find(o => o.chain === 'eth')
    this.getSettings(this.currentChain)
  },
  methods: {
    closeDialog () {
      this.$router.push('/verto/profile')
    },
    updateLocalSettings () {
      localStorage.setItem('chainSettings', JSON.stringify(this.settings))
    },
    getSettings (reset = false) {
      if (reset) {
        this.$set(this.settings, this.currentChain.chain, {})
      }

      if (this.currentChain.isEvm && (!this.settings[this.currentChain.chain].provider)) {
        this.$set(this.settings, this.currentChain.chain, JSON.parse(JSON.stringify(Lib.evms.find(o => o.chain === this.currentChain.chain))))
      }
    }
  }
}
</script>
