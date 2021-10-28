<template>
  <q-page class="column items-center justify-start setup-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png"  width="150" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Verto
      </h2>
      <h2 class="vert-page-content--title__sub">
        <span class="">Multi-chain wallet manager</span>
      </h2>
      <div class="vert-page-content--body full-width extra__px">
        <div class="flex column justify-center">
          <q-btn unelevated class="btn__blue block" @click="$router.push({name:'create-password'})"  size="md"  label="Create Wallet"/>
          <span class="q-pa-xs"/>
          <q-btn to="/import-restore" unelevated class="btn__blue block" size="md" label="Import Wallet"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Setup'
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/auth_page.scss";
.setup-page{
  background: #F5F5FE
}
</style>
