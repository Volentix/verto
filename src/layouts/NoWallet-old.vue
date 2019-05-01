<template>
  <q-layout class="full-height"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat label="Verto" no-caps to="wallet" />
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="rightDrawer = !rightDrawer"
        />
      </q-toolbar>
    </q-layout-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-layout-drawer
      side="right"
      v-model="rightDrawer"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <q-tabs>
          <q-route-tab
            slot="title"
            icon="map"
            to="/your/route"
            replace
            label="English"
          />
        </q-tabs>
        <q-tabs>
            <q-route-tab
              slot="title"
              icon="assignment"
              to="/some/other/route"
              replace
              label="Français "
            />
          </q-tabs>

      </q-scroll-area>
    </q-layout-drawer>

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
