<template>
  <q-page class="column items-center justify-start setup-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="150" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Please choose recovery method
      </h2>
      <div class="vert-page-content--body full-width px-50">
        <div class="flex column justify-center">
          <q-btn unelevated class="btn__blue block" @click="$router.push({name:'create--password-recover',params: { recover: 'recover' }})"  size="md"  label="Import recovery phrase"/>
          <span class="q-pa-xs"/>
          <q-btn unelevated class="btn__blue block" size="md" @click="restoreConfig" label="Restore config"/>
          <span class="q-pa-xs"/>
          <q-btn outline unelevated size="md" class="btn--outline__blue"  label="Back" @click="$router.back()"/>
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
  background: #F5F5FE
}
.px-50{
  padding: 0 50px;
}
</style>
