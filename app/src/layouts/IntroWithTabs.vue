<template>
  <q-layout class="qlayout-main-app" :class="{'dark' : $store.state.settings.lightMode === 'true'}">
    <div class="layout-main-app">
      <div class="desktop-version" v-if="screenSize > 1024">
        <TopMenu />
        <LeftMenu />

        <div class="menu-left-wrapper"></div>
        <q-page-sticky position="bottom-right"  :offset="fabPos">
        <q-fab
          v-model="fab"
          @click="showWizardAction()"
          label="Help Wizard"
          outline
          label-position="right"
          color="purple"
          icon="help_outline"
          class="help-wizard-btn"
          direction="up"
        />
       </q-page-sticky>
      </div>
      <tabs-menu v-else class="mobile-version tabs-menu-component" />
      <!-- mobile-only  -->
      <GuideWizard :key="reRender" v-if="showWizard" class="wizard"/>
      <div class="q-pr-xs layout-main-app-wrapper" style="background: #E7E8E8;" :class="{'dark-theme-main-layout': $store.state.settings.lightMode === 'true'}">
        <q-scroll-area :visible="true" style="height: 100vh">
          <q-page-container>
            <router-view :showWizard="showWizardAction" />
          </q-page-container>
        </q-scroll-area>
      </div>
    </div>
  </q-layout>
</template>

<script>
import TabsMenu from '../components/Verto/TabsMenu'
import TopMenu from '../components/Verto/TopMenu'
import LeftMenu from '../components/Verto/LeftMenu'
import { osName } from 'mobile-device-detect'
import GuideWizard from '../components/Verto/GuideWizard'
import { QScrollArea } from 'quasar'
export default {
  name: 'Intro',
  components: { TabsMenu, TopMenu, LeftMenu, GuideWizard, QScrollArea },
  data () {
    return {
      screenSize: 0,
      showWizard: false,
      osName: '',
      fab: true,
      fabPos: [ 18, 50 ],
      reRender: null
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  watch: {
    '$store.state.currentwallet.wallet': function (val) {
      if (!val) {
        this.$store.state.currentwallet.wallet = {
          empty: true
        }
      }
    }
  },
  created () {
    let closewizard = localStorage.getItem('closewizard')
    if (!closewizard) {
      this.showWizardAction()
    }
    this.osName = osName
    this.reRender = Math.random()
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
  },
  methods: {
    showWizardAction () {
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
  .help-wizard-btn{
    height: 35px;
    margin-bottom: -50px;
    /deep/ a{
      height: 40px;
      font-size: 14px;
      color: #7272FA !important;
      .q-btn__wrapper{
        padding: 0px 10px;
        min-height: 36px;
      }
    }
  }
  .layout-main-app{
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    // display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
<style>
  /* @media screen and (min-width: 1024px) {
    .tabs-menu-component{
      display: none !important;
    }
  } */
  .q-page-sticky {
    z-index: 1000;
    top: -10px;
    right: 0px;
    height: fit-content;
    margin: 0px !important;
    margin-right: 18px !important;
  }
  body{
    overflow: hidden;
    background: #E7E8E8;
  }
  .dark-theme-main-layout{
      background: #04111F !important;
  }
  .qlayout-main-app.dark{
    background: #04111F !important;
  }
  @media screen and (max-width: 1023px) {
    .layout-main-app-wrapper{
      padding-right: 0px !important;
      background: #FFFFFF !important;
    }
  }
</style>
