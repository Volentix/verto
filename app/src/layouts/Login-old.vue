<template>
  <q-layout class="bg-login"> <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container >
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Default',
  data () {
    return {
      leftDrawer: true,
      rightDrawer: false
    }
  }
}
</script>

<style>

</style>
