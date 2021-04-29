<template>
  <q-layout>
    <q-page-container>
      <router-view />
      <q-toggle
      v-if="false"
        v-model="lightMode"
        checked-icon="wb_sunny"
        @input="toggleLightDarkMode"
        color="grey"
        size="lg"
        class="darkmode-btn"
        unchecked-icon="brightness_3">
        <q-tooltip v-if="$store.state.settings.lightMode === 'false'" content-class="black" :offset="[10, 10]">
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
      lightMode: false
    }
  },
  created () {
    window.localStorage.setItem('skin', window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : this.$store.state.settings.lightMode)
    this.$store.state.settings.lightMode = window.localStorage.getItem('skin')
    this.lightMode = window.localStorage.getItem('skin') !== 'false'
  },
  methods: {
    toggleLightDarkMode (val) {
      window.localStorage.setItem('skin', val)
      this.$store.state.settings.lightMode = window.localStorage.getItem('skin')
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
<style>
  body .text-negative{
    color: #7900FF !important;
  }
</style>
