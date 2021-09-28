<template>
  <q-page class="column items-center justify-start setup-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="100" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Please choose recovery method
      </h2>
      <div class="vert-page-content--body full-width p-0">
        <div class="flex column justify-center">
          <q-btn unelevated class="btn__blue block" @click="$router.push({name:'create--password-recover',params: { recover: 'recover' }})"  size="lg"  label="Import recovery phrase"/>
          <span class="q-pa-md"/>
          <q-btn unelevated class="btn__blue block" size="lg" @click="restoreConfig" label="Restore config"/>
          <span class="q-pa-md"/>
          <q-btn outline unelevated size="lg" class="btn--outline__blue"  label="Back" @click="$router.back()"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ImportOrRestore',
  methods: {
    restoreConfig () {
      this.$router.push({
        name: 'restoreWallet',
        params: {
          returnto: 'settings'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/auth_page.scss";

.setup-page{
  background: #F5F5FE;
  & .vert-page-content{
    padding: 0 6% 5% 6%;
  }
}
.p-0{
  padding: 0 0px !important;
}
</style>
