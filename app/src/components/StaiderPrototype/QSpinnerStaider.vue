<template>
  <div class="staider-loader flex flex-center">
    <img src="statics/staider/svg_logo_loader.svg" width="100px" alt="">
  </div>
</template>

<script>
export default {
  name: 'QSpinnerStaider',
  data () {
    return {
    }
  },
  mounted () {
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.staider-loader{
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    background: #16161A !important;
    z-index: 999999999999999;
  }
</style>
