<template>
  <div class="desktop-card-style apps-section q-mb-sm flex flex-center" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div v-if="banner === 1" class="banner-wrapper" @click="goToLink">
      <img v-if="$store.state.settings.lightMode === 'false'" src="statics/node-banners/ban1.png" class="full-width scale3d" alt="">
      <img v-else src="statics/node-banners/ban1--dark.png" class="full-width scale3d" alt="">
    </div>
    <div v-else-if="banner === 2" class="banner-wrapper" @click="goToLink">
      <img v-if="$store.state.settings.lightMode === 'false'" src="statics/node-banners/ban2.png" class="full-width scale3d" alt="">
      <img v-else src="statics/node-banners/ban2.png" class="full-width scale3d" alt="">
    </div>
    <div v-else-if="banner === 3" class="banner-wrapper" @click="goToLink">
      <img v-if="$store.state.settings.lightMode === 'false'" src="statics/node-banners/ban3.png" class="full-width scale3d" alt="">
      <img v-else src="statics/node-banners/ban3.png" class="full-width scale3d" alt="">
    </div>
    <div v-else-if="banner === 5" class="banner-wrapper" @click="goToLink">
      <img v-if="$store.state.settings.lightMode === 'false'" src="statics/node-banners/ban5light.png" class="full-width scale3d" alt="">
      <img v-else src="statics/node-banners/ban5dark.png" class="full-width scale3d" alt="">
    </div>
    <div v-else-if="banner === 6" class="banner-wrapper" @click="goToLink">
      <img v-if="$store.state.settings.lightMode === 'false'" src="statics/node-banners/ban6light.png" class="full-width scale3d" alt="">
      <img v-else src="statics/node-banners/ban6dark.png" class="full-width scale3d" alt="">
      <div class="qbtn-launch-wrapper flex justify-between items-center q-pr-lg full-width">
        <span class="tagline flex justify-between items-center">Earn <img src="statics/icons/favicon-32x32.png" class="q-ml-sm q-mr-sm q-mb-xs" width="25" alt=""> VTX</span>
        <q-btn unelevated class="qbtn-download" color="white" text-color="black" label="Launch Node" />
      </div>
    </div>
    <div v-else class="row flex justify-between q-pt-sm q-pb-sm">
      <div class="col col-6 flex items-center node-icon"><q-icon name="apps" />VDEX node</div>
      <div class="col col-6 flex items-center justify-end start_node q-pr-sm">
        <strong>Start Your Node</strong>
        <q-btn unelevated class="qbtn-start" color="black" text-color="white" label="Get started" />
      </div>
    </div>
  </div>
</template>

<script>
import { openURL } from 'quasar'
export default {
  props: ['banner'],
  name: 'StartNodeSection',
  data () {
    return {
    }
  },
  methods: {
    goToLink () {
      openURL('https://www.volentix.io/node/')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .desktop-card-style{
    padding: 0px !important;
  }
  .qbtn-launch-wrapper{
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
    .tagline{
      font-family: $Franklin;
      font-size: 20px;
      font-weight: $light;
      margin-left: 150px;
      margin-bottom: 1px;
    }
  }
  .qbtn-download{
    border-radius: 30px;
    height: 33px;
    color: #7272FA !important;
    background: transparent !important;
    border: 1px solid #7272FA !important;
    margin-top: -2px;
    /deep/ .q-btn__wrapper{
      min-height: unset;
      .q-btn__content{
        text-transform: initial;
        font-size: 12px;
      }
    }
  }
  .apps-section{
    max-height: 76px;
    min-height: 76px;
    position: relative;
    .row{
      .col{
        .qbtn-start{
          border-radius: 30px;
          height: 30px;
          background: #7272FA !important;
          /deep/ .q-btn__wrapper{
            min-height: unset;
            .q-btn__content{
              text-transform: initial;
              font-size: 12px;
            }
          }
        }
        &.node-icon{
          font-size: 14px;
          font-weight: $bold;
          font-family: $Titillium;
          padding-right: 20px;
          padding-left: 10px;
          // flex-basis: 130px;
          position: relative;
          color: #494949;
          i{
            font-size: 1.4em;
            margin-right: 5px;
          }
        }
        &.start_node{
          font-family: $Titillium;
          strong{
            font-weight: $bold;
            font-size: 14px;
            color: #494949;
            margin-top: -6px;
            margin-bottom: -4px;
            margin-right: 12px;
          }
        }
      }
    }
  }
  .scale3d{
    transform: scale3d(1.1,1.1,1.1);
  }
  .banner-wrapper{
    margin-left: -8px;
    margin-right: -8px;
    margin-top: -8px;
    margin-bottom: -11px;
    position: absolute;
    cursor: pointer;
  }
</style>
