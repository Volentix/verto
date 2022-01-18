<template>
  <div class="main-area">
    <q-layout view="lHh lpR lFf" class="main-container">
      <q-drawer
        show-if-above
        :width="left_width"
        v-model="left"
        side="left"
        content-class="left-drawer">
        <div class="main-container-left">
          <LeftDrawer/>
          <NewsArea/>
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
import LeftDrawer from 'components/heartdefi/LeftDrawer'
import NewsArea from 'components/heartdefi/NewsArea'
export default {
  mixins: [],
  components: {
    LeftDrawer,
    NewsArea
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
  @import '~assets/heartdefi/style.scss';
  @import '~assets/heartdefi/css/responsive.css';
</style>
<style lang="scss">
  .main-area{
    .q-drawer{
      background: transparent;
      .left-drawer{
        background-color: #f0f7ff;
      }
    }
  }
</style>
