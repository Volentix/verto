<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 0px">
    <profile-header class="marg" version="type3" :fetchCurrentWalletFromState="true" />
    <chain-tools />
  </q-page>
</template>

<script>
import ChainTools from '../../components/Verto/ChainTools'
import ProfileHeader from '../../components/Verto/ProfileHeader'

export default {
  components: {
    ChainTools,
    ProfileHeader
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
  /deep/ .profile-wrapper--header{
    margin-bottom: 0px;
  }
</style>
