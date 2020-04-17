<template>
  <q-layout>
    <tabs-menu class="tabs-menu-component" />
    <!-- mobile-only  -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import TabsMenu from '../components/Verto/TabsMenu'
export default {
  name: 'Intro',
  components: { TabsMenu }
}
</script>

<style>
@media screen and (min-width: 1024px) {
  .tabs-menu-component{
    display: none !important;
  }
}
</style>
