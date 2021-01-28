<template>
  <q-layout>
    <div class="layout-main-app">
      <div class="desktop-version" v-if="screenSize > 1024">
        <TopMenu />

        <LeftMenu />
        <div class="menu-left-wrapper"></div>
        <q-page-sticky position="bottom-right"  :offset="fabPos">
        <q-fab
        v-model="fab"
        @click="onClick()"
        label="Help Wizard"
        label-position="right"
        color="purple"
        icon="help_outline"
        direction="up"
      >

      </q-fab>
       </q-page-sticky>
      </div>
      <tabs-menu v-else class="mobile-version tabs-menu-component" />
      <!-- mobile-only  -->
   <GuideWizard :key="reRender" v-if="showWizard" class="wizard"/>
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script>
import TabsMenu from '../components/Verto/TabsMenu'
import TopMenu from '../components/Verto/TopMenu'
import LeftMenu from '../components/Verto/LeftMenu'
import { osName } from 'mobile-device-detect'
import GuideWizard from '../components/Verto/GuideWizard'
export default {
  name: 'Intro',
  components: { TabsMenu, TopMenu, LeftMenu, GuideWizard },
  data () {
    return {
      screenSize: 0,
      showWizard: true,
      osName: '',
      fab: true,
      fabPos: [ 18, 50 ],
      reRender: null
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  created () {
    this.osName = osName
    this.reRender = Math.random()
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    // console.log('this.osName', this.osName)
  },
  methods: {
    onClick () {
      this.reRender = Math.random()
      this.showWizard = true
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    }
  }
}
</script>
<style lang="scss" scoped>
  // .layout-main-app{
  //   max-width: 1400px;
  //   margin-left: auto;
  //   margin-right: auto;
  // }
</style>
<style>
  /* @media screen and (min-width: 1024px) {
    .tabs-menu-component{
      display: none !important;
    }
  } */
  .q-page-sticky {
    z-index: 1000;
}
</style>
