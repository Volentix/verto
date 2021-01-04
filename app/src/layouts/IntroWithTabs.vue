<template>
  <q-layout>
    <div class="layout-main-app">
      <div class="desktop-version" v-if="screenSize > 1024">
        <TopMenu />
        <LeftMenu />
        <div class="menu-left-wrapper"></div>
      </div>
      <tabs-menu v-else class="mobile-version tabs-menu-component" />
      <!-- mobile-only  -->
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
export default {
  name: 'Intro',
  components: { TabsMenu, TopMenu, LeftMenu },
  data () {
    return {
      screenSize: 0,
      osName: ''
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  created () {
    this.osName = osName
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    // console.log('this.osName', this.osName)
  },
  methods: {
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
</style>
