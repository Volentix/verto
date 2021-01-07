<template>
  <q-layout>
    <q-page-container>
      <router-view />
      <q-toggle
        v-model="lightMode"
        checked-icon="wb_sunny"
        @input="toggleLightDarkMode"
        color="grey"
        size="lg"
        class="darkmode-btn"
        unchecked-icon="brightness_3">
        <q-tooltip v-if="$store.state.lightMode.lightMode === 'false'" content-class="black" :offset="[10, 10]">
          Dark mode
        </q-tooltip>
        <q-tooltip v-else content-class="black" :offset="[10, 10]">
          Light mode
        </q-tooltip>
      </q-toggle>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Intro',
  data () {
    return {
      lightMode: true
    }
  },
  created () {
    window.localStorage.setItem('skin', window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : true)
    this.$store.state.lightMode.lightMode = window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : true
    this.lightMode = window.localStorage.getItem('skin') !== 'false'
  },
  methods: {
    toggleLightDarkMode (val) {
      console.log('toggleLightDarkMode (val)', val)
      window.localStorage.setItem('skin', val)
      this.$store.state.lightMode.lightMode = window.localStorage.getItem('skin')
      console.log('this.$store.state.lightMode.lightMode', this.$store.state.lightMode.lightMode)
    }
  }
}
</script>

<style lang="scss" scoped>
  .darkmode-btn{
    position: absolute;
    right: 0px;
    top: 0px;
  }
</style>
