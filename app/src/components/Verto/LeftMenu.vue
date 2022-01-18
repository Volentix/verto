<template>
  <div class="menu-left-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <q-tabs
        v-model="tab"
        indicator-color="transparent"
        vertical
        active-color="indigo-12"
        class="tabs-menu--wrapper-tabs text-grey-6"
      >
        <!-- <q-tab name="mails" icon="mail" label="Mails" /> -->
        <q-route-tab class="tabs-menu--wrapper-tab" @click="goToDashboard()" to="" name="dashboard">
          <div class="svg-icon-wrapper flex flex-center items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M19.2,13c-3.4,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2s6.2-2.8,6.2-6.2S22.6,13,19.2,13z M19.2,23.4 c-2.3,0-4.2-1.9-4.2-4.2c0-2.3,1.9-4.2,4.2-4.2c2.3,0,4.2,1.9,4.2,4.2C23.4,21.5,21.5,23.4,19.2,23.4z"/> <path class="st0" d="M19.2,27.8c-3.4,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2s6.2-2.8,6.2-6.2S22.6,27.8,19.2,27.8z M19.2,38.2 c-2.3,0-4.2-1.9-4.2-4.2s1.9-4.2,4.2-4.2c2.3,0,4.2,1.9,4.2,4.2S21.5,38.2,19.2,38.2z"/> <path class="st0" d="M19.2,42.6c-3.4,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2s6.2-2.8,6.2-6.2S22.6,42.6,19.2,42.6z M19.2,53 c-2.3,0-4.2-1.9-4.2-4.2s1.9-4.2,4.2-4.2c2.3,0,4.2,1.9,4.2,4.2S21.5,53,19.2,53z"/> <path class="st0" d="M30.5,20.2H54c0.6,0,1-0.4,1-1s-0.4-1-1-1H30.5c-0.6,0-1,0.4-1,1S30,20.2,30.5,20.2z"/> <path class="st0" d="M54,33H30.5c-0.6,0-1,0.4-1,1s0.4,1,1,1H54c0.6,0,1-0.4,1-1S54.6,33,54,33z"/> <path class="st0" d="M54,47.8H30.5c-0.6,0-1,0.4-1,1s0.4,1,1,1H54c0.6,0,1-0.4,1-1S54.6,47.8,54,47.8z"/> </g> </svg>
            <div class="text-tab-name">Dashboard</div>
          </div>
        </q-route-tab>
        <q-route-tab class="tabs-menu--wrapper-tab" to="/verto/history" name="history">
          <div class="svg-icon-wrapper flex flex-center items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 27 27.2" style="enable-background:new 0 0 27 27.2;" xml:space="preserve"> <path id="circular-graph" class="st0" d="M23.4,12.8H26c-0.1-1.3-0.4-2.6-0.9-3.9l-2.3,1.3C23.1,11,23.3,11.9,23.4,12.8z M18.9,2.3 c-1.3-0.6-2.6-1-4-1.1v2.6c0.9,0.1,1.8,0.4,2.7,0.8L18.9,2.3L18.9,2.3z M21.6,7.9l2.3-1.3c-0.8-1.2-1.7-2.2-2.8-3l-1.3,2.3 C20.5,6.4,21.1,7.1,21.6,7.9L21.6,7.9z M13.5,23.4c-5.5,0-9.9-4.4-9.9-9.8c0-5,3.7-9.2,8.6-9.8V1.1C5.4,1.9,0.4,8,1.1,14.8 S7.9,26.7,14.8,26c5.7-0.6,10.2-5,11.1-10.6h-2.6C22.4,20,18.3,23.4,13.5,23.4z"/> </svg>
            <div class="text-tab-name">History</div>
          </div>
        </q-route-tab>
        <q-route-tab class="tabs-menu--wrapper-tab" to="/verto/defi" name="defi">
          <div class="svg-icon-wrapper flex flex-center items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M32,20.7l4.9,4.2C37,25,37.2,25,37.3,25c0.1,0,0.2,0,0.3-0.1l4.8-4.3c0,0,0,0,0,0c0.1-0.1,0.1-0.2,0.1-0.3v0 c0,0,0,0,0,0v-8.6c0,0,0-0.1,0-0.1c0-0.1,0-0.1-0.1-0.2c0-0.1-0.1-0.1-0.2-0.1c0,0-0.1,0-0.2-0.1c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.1,0-0.2,0.1c-0.1,0-0.1,0.1-0.1,0.2c0,0,0,0.1,0,0.1l-3.1,8.3H36l-3.2-8.3c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.1-0.2 c-0.1,0-0.1-0.1-0.2-0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0.1c-0.1,0-0.1,0.1-0.2,0.1c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0.1,0,0.1 V20c0,0.1,0,0.1,0,0.2C31.7,20.4,31.9,20.6,32,20.7z M41.6,14.4v5.4h-2L41.6,14.4z M39.2,20.7h1.6l-2.3,2.1L39.2,20.7z M38.1,20.7 l-0.9,2.4l-0.9-2.4H38.1z M36.1,22.8l-2.5-2.1h1.6L36.1,22.8z M32.8,14.3l2.1,5.4h-2.1V14.3z"/> <path class="st0" d="M37.2,30.1c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12S30.5,30.1,37.2,30.1z M37.2,8c5.5,0,10,4.5,10,10 s-4.5,10-10,10s-10-4.5-10-10S31.6,8,37.2,8z"/> <path class="st0" d="M47.4,44.4c-0.6,0-1,0.4-1,1v6.7c0,0.7-0.5,1.2-1.2,1.2H15.6c0,0,0,0,0,0c-0.7,0-1.2-0.5-1.2-1.2V22.5 c0-0.7,0.5-1.2,1.2-1.2h6.7c0.6,0,1-0.4,1-1s-0.4-1-1-1h-6.7c-1.8,0-3.2,1.4-3.2,3.2v29.6c0,1.8,1.4,3.2,3.2,3.2c0,0,0,0,0,0h29.6 c1.8,0,3.2-1.5,3.2-3.2v-6.7C48.4,44.9,48,44.4,47.4,44.4z"/> <path class="st0" d="M50.6,26.9c-4.6,0-8.4,3.8-8.4,8.4s3.8,8.4,8.4,8.4S59,40,59,35.3S55.2,26.9,50.6,26.9z M50.6,41.8 c-3.5,0-6.4-2.9-6.4-6.4s2.9-6.4,6.4-6.4s6.4,2.9,6.4,6.4S54.1,41.8,50.6,41.8z"/> <path class="st0" d="M27,38.5c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9c0-3.8-3.1-6.9-6.9-6.9S27,34.7,27,38.5z M38.8,38.5 c0,2.7-2.2,4.9-4.9,4.9S29,41.2,29,38.5c0-2.7,2.2-4.9,4.9-4.9S38.8,35.8,38.8,38.5z"/> </g> </svg>
            <div class="text-tab-name">DeFi</div>
          </div>
        </q-route-tab>
       <!-- <q-route-tab v-if="$store.state.settings.network == 'mainnet'"  class="tabs-menu--wrapper-tab" to="/verto/exchange" name="exchange">
          <div class="svg-icon-wrapper flex flex-center items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M14.3,26.5c0.4,0.1,0.9-0.1,1.1-0.5c3.9-10.3,15.5-15.5,25.8-11.6c6.6,2.5,11.4,8.4,12.6,15.3v0 c0.1,0.5,0.5,0.8,0.9,0.8h0.1l0,0c0.5-0.1,0.9-0.6,0.8-1.1c-1.3-7.6-6.6-14-13.8-16.8c-5.5-2.1-11.4-1.9-16.7,0.5 c-5.3,2.4-9.4,6.7-11.5,12.2l0,0.1c-0.1,0.2,0,0.5,0.1,0.7S14,26.4,14.3,26.5z"/> <path class="st0" d="M60.8,29.8c-0.4-0.3-0.9-0.3-1.3,0l-4.7,4.9L49.9,30c-0.4-0.4-1-0.4-1.3,0c-0.4,0.4-0.4,1,0,1.4l4.9,4.7 c0.4,0.3,0.8,0.5,1.3,0.5c0,0,0,0,0.1,0c0.5,0,1-0.2,1.3-0.6l4.7-4.9C61.2,30.7,61.2,30.1,60.8,29.8z"/> <path class="st0" d="M54.2,38.9c-0.5-0.2-1,0.1-1.2,0.6c-1.9,5-5.6,9-10.4,11.2s-10.3,2.4-15.3,0.5c-6.6-2.5-11.4-8.4-12.6-15.3 c-0.1-0.5-0.6-0.8-1.1-0.7c-0.2,0-0.5,0.2-0.6,0.4c-0.1,0.2-0.2,0.5-0.2,0.7c1,5.8,4.2,10.8,8.9,14.1c3.7,2.6,8.1,4,12.6,4 c1.2,0,2.5-0.1,3.7-0.3c1.8-0.3,3.7-0.9,5.4-1.6c5.3-2.4,9.4-6.9,11.4-12.3C54.9,39.7,54.7,39.1,54.2,38.9z"/> <path class="st0" d="M18.5,36c0.2,0.2,0.4,0.3,0.7,0.3c0.2,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7c0-0.3-0.1-0.5-0.3-0.7 l-4.8-4.8c-0.4-0.4-0.8-0.6-1.3-0.6c-0.5,0-1,0.2-1.4,0.6l-4.8,4.8c-0.4,0.4-0.3,1,0.1,1.4c0.4,0.3,0.9,0.3,1.3,0l4.8-4.8L18.5,36z "/> <path class="st0" d="M43.9,20.9c-0.1,0-0.2-0.1-0.2-0.1c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0.1-0.3,0.1c-0.1,0.1-0.2,0.1-0.2,0.2 c0,0,0,0.1-0.1,0.1l-5.9,15.8h-5.2l-6.2-15.8c0,0,0-0.1-0.1-0.1c-0.1-0.1-0.1-0.2-0.2-0.2c-0.1-0.1-0.2-0.1-0.3-0.1 c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.2,0.1c-0.1,0.1-0.2,0.1-0.2,0.2c-0.1,0.1-0.1,0.2-0.1,0.3c0,0,0,0.1,0,0.1v16.3c0,0,0,0,0,0 s0,0,0,0c0,0.2,0.1,0.4,0.2,0.5c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0l9.5,8.1c0,0,0,0,0,0h0 c0.1,0.1,0.2,0.1,0.4,0.1c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0.1,0,0.3-0.1,0.4-0.2c0,0,0,0,0,0l9.2-8.1 c0.2-0.1,0.3-0.3,0.3-0.6V21.6c0,0,0-0.1,0-0.1c0-0.1-0.1-0.2-0.1-0.3C44.1,21.1,44,21,43.9,20.9z M25.6,25.6l4.5,11.6h-4.5V25.6z M26.9,38.6h3.8l1.9,4.9L26.9,38.6z M34.4,43.9l-2.1-5.3h4L34.4,43.9z M36.1,43.5l1.8-4.8h3.7L36.1,43.5z M42.8,37.1h-4.3l4.3-11.4 V37.1z"/> </g> </svg>
            <div class="text-tab-name">Exchange</div>
          </div>
        </q-route-tab> -->
        <q-route-tab v-if="this.$store.state.settings.network == 'testnet' && $store.state.wallets.tokens.length" class="tabs-menu--wrapper-tab" to="/verto/vdexnode" name="nodes_interne">
          <div class="svg-icon-wrapper flex flex-center items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <path class="st0" d="M44,36.9c-2.6,0-4.9,1.5-6.1,3.6L28,35.6c0.2-0.7,0.4-1.4,0.4-2.2c0-0.8-0.2-1.6-0.4-2.4l10.4-5.6 c1.3,1.7,3.3,2.9,5.7,2.9c3.9,0,7-3.2,7-7s-3.2-7-7-7s-7,3.2-7,7c0,0.8,0.2,1.6,0.4,2.4L27,29.2c-1.3-1.7-3.3-2.9-5.7-2.9 c-3.9,0-7,3.2-7,7s3.2,7,7,7c2.4,0,4.5-1.2,5.8-3l10,5c-0.1,0.5-0.2,1-0.2,1.6c0,3.9,3.2,7,7,7s7-3.2,7-7S47.8,36.9,44,36.9z M44,16.3c2.8,0,5,2.3,5,5s-2.3,5-5,5s-5-2.3-5-5S41.2,16.3,44,16.3z M21.3,38.4c-2.8,0-5-2.3-5-5s2.3-5,5-5s5,2.3,5,5 S24.1,38.4,21.3,38.4z M44,49c-2.8,0-5-2.3-5-5s2.3-5,5-5s5,2.3,5,5S46.7,49,44,49z"/> </svg>
            <div class="text-tab-name">Nodes</div>
          </div>
        </q-route-tab>
        <q-route-tab class="tabs-menu--wrapper-tab" to="/verto/profile" name="profile">
          <div class="svg-icon-wrapper flex justify-start items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M34,9C20.8,9,10,19.8,10,33s10.8,24,24,24s24-10.8,24-24S47.2,9,34,9z M34,55c-12.1,0-22-9.9-22-22 s9.9-22,22-22s22,9.9,22,22S46.1,55,34,55z"/> <path class="st0" d="M41.3,35.1C41.2,35.1,41.2,35.1,41.3,35.1c-0.7-0.2-1.3-0.4-1.9-0.5c0.7-0.5,1.3-1.2,1.7-1.9 c0.6-1,1-2.2,1-3.3v-6.8l0-0.2c-0.1-3.7-3.2-6.6-6.8-6.5l-2.3,0l-0.2,0c0,0,0,0,0,0C29,16,26,19,26,22.6v6.8c0,1.2,0.3,2.3,1,3.3 c0.4,0.7,1,1.4,1.7,1.9c-0.7,0.1-1.3,0.3-1.9,0.5c0,0,0,0,0,0C23,36.2,20,38.2,20,41v4c0,0.6,0.4,1,1,1s1-0.4,1-1v-4 c0-1.5,2-2.9,4.9-3.9l6.4,5.6c0.2,0.2,0.4,0.2,0.7,0.2s0.5-0.1,0.7-0.2l6.4-5.6c2.8,1,4.8,2.4,5,3.9V45c0,0.6,0.4,1,1,1s1-0.4,1-1 v-4c0,0,0-0.1,0-0.1C47.7,38.4,44.9,36.3,41.3,35.1z M32.7,18C32.7,18,32.7,18,32.7,18l0.2,0l2.4,0c0,0,0.1,0,0.1,0 c2.5,0,4.6,2,4.7,4.5l0,0.6c-1.4,0.2-4.5,0.3-6.5-1c-1.6-1-3.6-1.3-5.3-0.8C28.8,19.4,30.5,18,32.7,18z M32.8,34 c-1.7,0-3.3-0.9-4.2-2.3C28.2,31,28,30.2,28,29.4v-5.8c1.4-0.7,3.1-0.6,4.4,0.2c1.7,1.1,3.9,1.4,5.7,1.4c0.7,0,1.3,0,1.9-0.1l0,4.2 c0,0.8-0.2,1.6-0.7,2.3c-0.9,1.4-2.4,2.3-4.1,2.3c0,0,0,0-0.1,0H32.8z M34,40.7l-4.8-4.2c1.5-0.3,3.1-0.5,4.8-0.5 c1.6,0,3.2,0.2,4.7,0.5L34,40.7z"/> </g> </svg>
            <div class="text-tab-name">Profile</div>
          </div>
        </q-route-tab>
        <q-route-tab class="tabs-menu--wrapper-tab" to="" @click="goToLink" name="nodes">
          <div class="svg-icon-wrapper flex flex-center items-center">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <path class="st0" d="M44,36.9c-2.6,0-4.9,1.5-6.1,3.6L28,35.6c0.2-0.7,0.4-1.4,0.4-2.2c0-0.8-0.2-1.6-0.4-2.4l10.4-5.6 c1.3,1.7,3.3,2.9,5.7,2.9c3.9,0,7-3.2,7-7s-3.2-7-7-7s-7,3.2-7,7c0,0.8,0.2,1.6,0.4,2.4L27,29.2c-1.3-1.7-3.3-2.9-5.7-2.9 c-3.9,0-7,3.2-7,7s3.2,7,7,7c2.4,0,4.5-1.2,5.8-3l10,5c-0.1,0.5-0.2,1-0.2,1.6c0,3.9,3.2,7,7,7s7-3.2,7-7S47.8,36.9,44,36.9z M44,16.3c2.8,0,5,2.3,5,5s-2.3,5-5,5s-5-2.3-5-5S41.2,16.3,44,16.3z M21.3,38.4c-2.8,0-5-2.3-5-5s2.3-5,5-5s5,2.3,5,5 S24.1,38.4,21.3,38.4z M44,49c-2.8,0-5-2.3-5-5s2.3-5,5-5s5,2.3,5,5S46.7,49,44,49z"/> </svg>
            <div class="text-tab-name">Nodes</div>
          </div>
        </q-route-tab>

      </q-tabs>
      <span class="version full-width text-center column">
        <span class="q-mb-md">{{version}}</span>
        <span class="q-pa-sm text-grey">
          This app is in beta, please send us bug reports if you find any. <b><a target="_blank" class="text-deep-purple-12c" href="https://t.me/vertosupport">t.me/vertosupport</a></b>
        </span>

      </span>
      <!-- <span class="version full-width text-center">{{version}}</span> -->
  </div>
</template>

<script>
import { version } from '../../../package.json'
import { openURL } from 'quasar'
export default {
  name: 'LeftMenu',
  data () {
    return {
      tab: 'dashboard',
      version: {}
    }
  },
  methods: {
    goToLink () {
      openURL('https://volentix.io/node/')
    },
    goToDashboard () {
      this.$store.state.currentwallet.wallet = {
        empty: true
      }
      this.$bus.$emit('showDefaultDashboard')
      this.$router.push('/verto/dashboard')
    }
  },
  mounted () {
    this.version = version
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .menu-left-wrapper{
    position: fixed;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 18vh;
    background-color: #7900FF;
    background: transparent linear-gradient(180deg, #7900FF 0%, #00D0DF 100%) 0% 0% no-repeat padding-box;
    background-color: #E7E8E8;
    background: #E7E8E8;
    z-index: 7;
    padding-top: 70px;
    .version{
      position: absolute;
      left: 0px;
      bottom: 0px;
      padding: 5px 0px;
      text-align: center;
      color: #333;
      font-size: 10px;
      font-weight: $bold;
      font-family: $Titillium;
      width: 100%;
    }
    // @extend .shad;
     .tabs-menu{
        &--wrapper{
          /deep/ .q-tabs__content{
            justify-content: space-evenly;
            box-shadow: 0px -11px 31px 0px rgba(0, 0, 0, 0.15);
            // box-shadow: none;
          }
          /deep/ .q-tab--inactive {
            // opacity: 0.95;
          }
          &-tab{
            padding: 0px 10px;
            flex-basis: 20%;
            /deep/ .q-tab{
                &__content{}
                &__label{
                    font-size: 12px;
                    text-transform: initial;
                }
            }
          }
          &-tabs{
            margin-top: 25px;
            .tabs-menu--wrapper-tab{
              margin-left: -1vh;
              justify-content: flex-start;
              padding-left: 3vh;
              .svg-icon-wrapper{
                // overflow: hidden;
                // width: 60px;
                // height: 50px;
              }
              .svg-icon{
                fill: rgba(#333, .6);
                width: 35px;
                height: 25px;
                max-width: unset;
                transform: scale(1);
                display: none;
              }
              .text-tab-name{
                font-size: 18px;
                font-family: $Titillium;
                text-transform: initial;
                color: rgba(#000, .6);
                margin-top: 0px;
                margin-bottom: 0px;
                font-weight: 600;
              }
              &.q-router-link--active{
                &.q-tab--active{
                  .svg-icon{
                    fill: #7272FA;
                  }
                  .text-tab-name{
                    color: #7272FA;
                    font-weight: 600;
                  }
                }
              }
            }
          }
        }
      }
    .row{
      .col{
        cursor: pointer;
        position: relative;
      }
    }
    &.dark-theme{
      .version{
        color: #CCC;
      }
      background-color: #04111F;
      background: #04111F;
      .tabs-menu--wrapper-tabs .tabs-menu--wrapper-tab.q-router-link--active.q-tab--active .svg-icon{
        fill: #7272FA;
      }
      .tabs-menu--wrapper-tabs .tabs-menu--wrapper-tab .svg-icon{
        fill: rgba(white, .8);
      }
      .tabs-menu--wrapper-tabs .tabs-menu--wrapper-tab.q-router-link--active.q-tab--active .text-tab-name{
        // color: #ddddf7;
        // text-shadow: 0px 0px 3px #7272FA;
        // background: linear-gradient(135deg, #7272FA 38%, #f969cd 100%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        color:white;
        text-shadow: 0 0 10px rgba(255,255,255,.5),
                 0 0 20px rgba(255,255,255,.5),
                 0 0 22px  rgba(255,255,255,.5),
                 0 0 40px  rgba(94, 66, 220, 0.5),
                 0 0 60px  rgba(94, 66, 220, 0.5),
                 0 0 80px  rgba(120, 66, 220, 0.5),
                 0 0 100px rgba(94, 66, 220, 0.5),
                 0 0 140px rgba(94, 66, 220, 0.5),
                 0 0 200px rgba(94, 66, 220, 0.5);
      }
      .tabs-menu--wrapper-tabs{
        margin-top: -15px;
        /deep/ .q-tabs__content.row{
          padding-top: 40px;
        }
      }
      .tabs-menu--wrapper-tabs .tabs-menu--wrapper-tab .text-tab-name{
        color: rgba(white, .8);
      }
    }
  }
  .text-deep-purple-12c{
    color: #7272FA !important;
  }
</style>
