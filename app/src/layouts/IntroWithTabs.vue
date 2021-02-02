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
          @click="showWizardAction()"
          label="Help Wizard"
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
      <div class="q-pr-xs" style="background: #E7E8E8;">
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
  created () {
    let closewizard = localStorage.getItem('closewizard')
    if (!closewizard) {
      this.showWizardAction()
    }
    this.osName = osName
    this.reRender = Math.random()
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    // console.log('this.osName', this.osName)
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
      .q-btn__wrapper{
        padding: 0px 10px;
        min-height: 36px;
      }
    }
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
  }
  body{
    overflow: hidden;
  }
</style>
