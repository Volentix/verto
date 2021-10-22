<template>
  <q-page class="column " :class="{'text-black bg-grey-12':$store.state.settings.lightMode === 'false','':$store.state.settings.lightMode === 'true','dark-theme': $store.state.settings.lightMode === 'true'}" :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': ''">
    <profile-header version="type1" class="marg" :showWallets="true" :isWalletsPage="false" :isWalletDetail="true" v-if="false"/>
    <q-header>
      <q-toolbar  :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'text-black'" id="scrollToID">
          <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" to="/verto/dashboard"/>
          <q-toolbar-title> Wallets  </q-toolbar-title>
          <!-- <q-btn flat round dense icon="close" v-close-popup to="/verto/dashboard"/> -->
      </q-toolbar>
    </q-header>
    <wallets :showWallets="true" :isWalletsPage="false" :isWalletDetail="true"  class="q-pa-md"/>
  </q-page>
</template>

<script>
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'

export default {
  components: {
    ProfileHeader,
    Wallets
  },
  data () {
    return {
    }
  },
  mounted () {
    document.getElementById('scrollToID').scrollIntoView()
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .mobile-pad {
    padding-bottom: 50px;
    background: #FFF !important;
  }
  .marg{
    /deep/ .profile-wrapper{
      &--header{
        margin-bottom: 0px;
      }
    }
  }
  .dark-theme{
    background-color: #04111F;
  }
  .mobile-card{
    background-color: #04111F !important;
  }
</style>
