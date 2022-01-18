<template>
  <div class="main-area">
    <q-layout view="lHh lpR lFf" class="main-container">
      <q-drawer
        show-if-above
        :width="left_width"
        v-model="left"
        side="left"
        :breakpoint="992"
        content-class="left-drawer">
        <div class="main-container-left">
          <LeftDrawer/>

        </div>
      </q-drawer>
      <q-page-container class="main-container-right" style="padding-left:0px" :style="{'margin-left':left_width+'px'}">
        <q-page>
          <router-view/>
        </q-page>
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
import LeftDrawer from 'components/Heartdefi/LeftDrawer'

export default {
  mixins: [],
  components: {
    LeftDrawer
  },
  data () {
    return {
      left: true,
      left_width: 250
    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {
  },
  methods: {

  },
  destroyed () {

  }

}
</script>
<style>
  @import '~assets/Heartdefi/style.scss';
  @import '~assets/Heartdefi/css/responsive.css';
</style>
<style lang="scss">
  .main-area{
    .q-drawer{
      background: transparent;
      .left-drawer{
        background-color: #ffe5e4;
      }
    }
    p{
      margin: 0;
    }
    h2,h3,h4,h5{
      font-weight: bold !important;
      line-height: normal !important;
    }
    line-height: normal !important;
    .mainexch-eth-right{
      padding-left: 22px;
    }
    .mncright-right{
      padding-top: 0 !important;
    }
  }
</style>
