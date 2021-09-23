<template>
  <q-page class="column items-center justify-start setup-page">
    <div class="q-pa-lg">
      <img src="statics/icons/icon-256x256.png" class="q-mr-sm" width="200" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Verto
      </h2>
      <h2 class="vert-page-content--title__sub">
        <span class="">Multi-chain wallet manager</span>
      </h2>
      <div class="vert-page-content--body full-width extra__px">
        <q-btn unelevated class="btn__blue block" @click="$router.push({name:'create-password'})"  size="lg"  label="Create Vallet"/>
        <q-btn unelevated class="btn__blue block" size="lg" label="Import Vallet"/>
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
.setup-page{
  background: #F5F5FE
}
.vert-page-content{
  padding: 0 5% 10% 5%;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &--title {
    font-size: 24px;
    font-weight: 600;
    line-height: 24px;
    font-family: $Franklin;
    position: relative;
    margin-left: 0%;
    margin-top: 0px;
    text-align: center;
    &__sub {
      font-size: 18px;
      font-weight: 400;
      text-align: center;
      line-height: 30px;
      margin-top: 0px;
    }
  }
  &--body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 5%;
    margin-bottom: 5%;

    @media screen and (min-width: 768px) {
      margin-top: 5%;
      margin-bottom: 0%;
      max-width: 400px;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    &.extra__px{
      padding: 0 70px;
    }
  }

  &--footer {
    padding: 0 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

}
</style>
