<template>
  <q-page class="column text-black bg-grey-12">
    <profile-header version="type1" class="marg" :showWallets="true" :isWalletsPage="false" :isWalletDetail="true" />
    <wallets :showWallets="true" :isWalletsPage="false" :isWalletDetail="true" />
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
</style>
