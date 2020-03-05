<template>
  <q-layout>
    <tabs-menu class="mobile-only" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import TabsMenu from '../components/verto/TabsMenu'
export default {
  name: 'Intro',
  components: { TabsMenu }
}
</script>

<style>
</style>
