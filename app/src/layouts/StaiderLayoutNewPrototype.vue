<template>
  <q-layout view="hHh Lpr fFf" class="main-q-layout"> <!-- Be sure to play with the Layout demo on docs -->

    <q-header class="absolute-p">
      <HeaderSection2 class="backdrop-mobile" :class="{'activate-backdrop-mobile': backdrop}" />
    </q-header>

    <q-drawer
      v-model="leftDrawer"
      side="left"
      bordered
      content-class="bg-grey-2"
    >
      <q-scroll-area class="fit q-pa-sm">
      </q-scroll-area>
    </q-drawer>

    <q-scroll-area style="height: calc(100vh - 180px)" class="scroll_area_wrapper" :class="{'height-auto': $q.screen.width < 768}" dark>
      <q-scroll-observer @scroll="onScroll" />
      <q-page-container>
        <!-- This is where pages get injected -->
        <router-view />
      </q-page-container>
      <FooterSection2 />
    </q-scroll-area>

  </q-layout>
</template>
<script>
// import Faqs from 'pages/Staider/Faqs.vue'
import HeaderSection2 from 'components/StaiderPrototype/HeaderSection2'
import FooterSection2 from 'components/StaiderPrototype/FooterSection2'
import { QScrollArea, QScrollObserver } from 'quasar'
export default {
  components: {
    // Faqs
    HeaderSection2,
    FooterSection2,
    QScrollArea,
    QScrollObserver
  },
  watch: {
  },
  data () {
    return {
      leftDrawer: false,
      currentPage: '',
      backdrop: false,
      funds: [
        {
          symbol: 'USDC',
          icon: 'https://token.enzyme.finance/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          apy: 'N/A',
          btnLabel: 'Deposit',
          network: 'Ethereum',
          to: '/staider/fund/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    onScroll (info) {
      if (info.position >= 230) {
        this.backdrop = true
      } else {
        this.backdrop = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
<style>
  body {overflow: hidden !important;}
  .q-menu{z-index: 99999 !important;}
</style>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  /deep/ .fixed-top.absolute-p{
    position: absolute !important;
    z-index: 9999;
    background: transparent;
    max-width: calc(100% - 10px);
  }
  .scroll_area_wrapper{
    box-shadow: 0px 34px 54px 0px #000;
    border-radius: 20px;
    overflow: hidden;
    max-width: calc(100% - 180px);
    margin-left: auto;
    margin-right: auto;
    margin-top: 120px;
    border-radius: 20px;
    background: rgba(#1D1D21, .8);
    padding: 0px;
    padding-bottom: 20px;
    &.height-auto{
      margin-top: 100px;
      border-radius: 0px;
      max-width: 100%;
      height: calc(100vh - 101px) !important;
    }
    &.blur-effect{
      filter: blur(5px);
    }
  }
  .main-q-layout{
    overflow: hidden !important;
    background: $solidBackground;
  }
  /deep/ .q-scrollarea--dark .q-scrollarea__thumb {
    background: #fff;
    right: 7px;
    border-radius: 20px;
    width: 10px;
    transform: scale(0.8);
    z-index: 9999;
  }
  /deep/ .q-page-container{
    padding-top: 0px !important;
  }
  .activate-backdrop-mobile{
    @media screen and (max-width: 768px) {
       -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
    }
  }
  body .main-q-layout /deep/ .faq--wrapper{
    .faq_wrapper .body_content {
      max-width: 1270px;
    }
  }
  body .main-q-layout /deep/ .faq--wrapper,
  /deep/ .page-wrapper{
    &.dark-theme{
      background: transparent !important;
      background-color: transparent !important;
      .faq_wrapper{
        padding-top: 130px !important;
      }
      .faq_wrapper,
      .section-sub-wrapper__inner-content {
        background: transparent !important;
        background-color: transparent !important;
        .bg_animated_line{
          background-color: transparent !important;
          margin-top: 16px;
        }
      }
    }
  }
</style>
<style>
.q-table__card--dark, .q-table--dark {
  border: 2px solid #2d2d30 !important;
}
.q-table--dark .q-table__bottom, .q-table--dark thead, .q-table--dark tr, .q-table--dark th, .q-table--dark td {
    border-color: #2d2d30 !important;
}
</style>
