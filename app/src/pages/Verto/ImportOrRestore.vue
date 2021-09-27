<template>
  <q-page class="column items-center justify-start setup-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="150" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Please choose recovery method
      </h2>
      <div class="vert-page-content--body full-width extra__px">
        <div class="flex column justify-center">
          <q-btn unelevated class="btn__blue block" @click="$router.push({name:'create-password'})"  size="md"  label="Import recovery phrase"/>
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
.setup-page{
  background: #F5F5FE
}
.vert-page-content{
  padding: 0 5% 10% 5%;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

&--title {
   font-size: 18px;
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
   padding: 0 60px;
 }
}

&--footer {
   padding: 0 20px;
   display: flex;
   flex-direction: column;
   justify-content: center;
 }

}
</style>
