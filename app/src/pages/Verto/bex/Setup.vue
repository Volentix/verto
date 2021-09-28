<template>
  <q-page class="column items-center justify-start setup-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="150" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <div class="vert-page-content--body full-width extra__px">
        <h2 class="vert-page-content--title">
          Verto
        </h2>
        <h2 class="vert-page-content--title__sub">
          <span class="">Multi-chain wallet manager</span>
        </h2>
        <q-btn unelevated class="btn__blue block" @click="$router.push({name:'create-password'})" size="lg"
               label="Create Vallet"/>
        <q-btn to="/import-restore" unelevated class="btn__blue block" size="lg" label="Import Vallet"/>
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

.setup-page {
  background: #F5F5FE
}

.vert-page-content--title {
  font-size: 30px;
  line-height: 30px;
}

.vert-page-content--title__sub {
  font-size: 18px;
  line-height: 20px;
}

.extra__px {
  padding: 0 30px !important;
}
</style>
