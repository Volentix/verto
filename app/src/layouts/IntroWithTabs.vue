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
    <q-drawer
        side="right"
        v-if="$store.state.settings.activityBar && false"
        v-model="drawerRight"
        show-if-above
        bordered
        :width="300"
        :breakpoint="500"
        class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
             <q-timeline color="secondary" class="q-pl-md">
       <div class="text-h6 q-pb-md">Recent activity</div>
      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 21, 1986"
        icon="delete"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit</div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
           </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit  </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
        color="orange"
        icon="done_all"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit    </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit  </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit,</div>
      </q-timeline-entry>
             </q-timeline>
          </div>
        </q-scroll-area>
      </q-drawer>
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
      drawerRight: false,
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
    if (this.$store.state.settings.isDemo) {
      this.$q.notify({
        type: 'my-notif',
        message: `Click here to start using Verto`,
        timeout: 1000000,
        actions: [
          { label: 'Get started',
            color: 'white',
            handler: () => {
              this.$router.push({
                name: 'create-password'
              })
            } }
        ]
      })
    }
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
<style lang="scss">
  /* @media screen and (min-width: 1024px) {
    .tabs-menu-component{
      display: none !important;
    }
  } */
  .q-field--error .q-field__bottom {
    color: #6200ea !important;
  }
  .q-dark{
    background: #04111F !important;
    .q-item.q-router-link--active, .q-item--active{
      color: #FFF;
    }
    .q-field--error .q-field__bottom {
      color: #fff !important;
      text-shadow: 2px 2px 2px #6200ea;
    }
  }
  .q-menu{
    box-shadow: 0px 10px 20px 0px rgba(0,0,0,.6);
  }
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
