<template>
  <q-layout view="hHh LpR lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="optionsDrawer = !optionsDrawer" v-if="hasCurrentWallet()" />
        <q-toolbar-title class="flex flex-center text-uppercase text-h4" v-show="$store.state.currentwallet.wallet">
            {{ $store.state.currentwallet.wallet.name }}
        </q-toolbar-title>
        <a @click="langDrawer = !langDrawer">
          <img :src="getLangUrl()" width=42>
        </a>
      </q-toolbar>
    </q-header>

      <q-drawer  side="left" v-model="optionsDrawer" content-class="row" v-if="hasCurrentWallet()" :width="170" >
        <div class="col-12 column bg-primary">
          <options-drawer/>
        </div>
      </q-drawer>
      <q-drawer side="right" v-model="langDrawer" content-class="row" :width="170">
        <div class="col-12 column bg-primary">
          <lang-drawer @click.native="langDrawer = false"/>
        </div>
      </q-drawer>
      <q-drawer overlay side="right" v-model="langDrawer" content-class="row" :width="170">
        <div class="col-12 column bg-primary">
          <lang-drawer @click.native="langDrawer = false"/>
        </div>
      </q-drawer>
      <q-page-container class=" bg-black">
        <!-- This is where pages get injected -->
        <router-view />
      </q-page-container>
  </q-layout>
</template>

<script>
import configManager from '../util/ConfigManager'
import LangDrawer from '../components/layout/LangDrawer'
import OptionsDrawer from '../components/layout/OptionsDrawer'
const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function () {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

export default {
  name: 'DefaultLayout',
  components: { LangDrawer, OptionsDrawer },
  data () {
    return {
      optionsDrawer: false,
      langDrawer: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.optionsDrawer = this.$q.platform.is.desktop
      })
    })
  },
  methods: {
    onResize: throttle(function (size) {
      this.optionsDrawer = size.width > 990
    }, 200),
    getLangUrl: function () {
      return 'statics/flags/' + this.$i18n.locale + '.png'
    },
    hasWallets: function () {
      return configManager.hasWallets()
    },
    hasCurrentWallet: function () {
      return configManager.hasCurrentWallet()
    }
  },
  watch: {
    '$q.screen.width' () {
      this.onResize(this.$q.screen.width)
    }
  }
}
</script>

<style scoped>
.bg-blue-grey-1 {
  min-height: 90vh;
}
a {
  cursor: pointer;
}
</style>
