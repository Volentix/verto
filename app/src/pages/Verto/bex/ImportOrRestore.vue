<template>
  <q-page v-if="false" class="column items-center justify-start setup-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="80" alt="logo"/>
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
  <q-page v-else class="column items-center justify-start login-page restore-page-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="full-width full-height">
      <img :src="'statics/login_ui_' + ($store.state.settings.lightMode === 'true' ? 'dark':'light') +'.png'" alt="head-login" class="head-login" />
      <div class="form_wrapper full-height column q-pa-lg">
        <span class="text-h2 q-pl-md">VERTO</span>
        <span class="text-h3 q-pl-md q-pr-md q-mt-md">Import/Restore</span>
        <p class="q-pl-md q-pr-md q-mt-md">Please, choose a recovery method !</p>
        <div class="import_restore_wrapper q-pl-md q-pr-md">
          <div class="import_restore column justify-between q-mt-sm">
            <span>
              <q-btn unelevated class="btn__blue unlock_btn" color="grey-4" outline size="md" no-caps @click="$router.push({name:'create--password-recover',params: { recover: 'recover' }})" label="Import recovery phrase"/>
              <q-btn unelevated class="btn__blue unlock_btn q-mt-md q-mb-md" color="grey-4" outline size="md" no-caps @click="restoreConfig" label="Restore config"/>
            </span>
            <q-btn flat size="md" no-caps class="restore_btn" color="grey-8" label="Cancel" @click="$router.back()"/>
          </div>
        </div>
      </div>
    </div>
    <notify-message/>
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
.restore-page-wrapper{
  background: #F9F9F9;
  .head-login{
    max-width: 100%;
    position: relative;
    transform: scale3d(1,1,1);
  }
  .form_wrapper{
    border-radius: 50px 50px 0px 0px;
    margin-top: -80px;
    background: #F9F9F9;
    position: relative;
    z-index: 2;
    box-shadow: 0px -30px 50px 0px rgba(black, .1);
    .text-h2{
      font-family: $Franklin;
      font-weight: $black;
      font-size: 20px;
      line-height: 30px;
      color: #04111F;
    }
    .text-h3{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 30px;
      line-height: 35px;
      color: #04111F;
    }
    p{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 14px;
      line-height: 22px;
      color: #04111F;
    }
    .import_restore{
      min-height: 220px;
      .unlock_btn{
        width: 100%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
        /deep/ .q-btn__wrapper:before{
          border: 2px solid #CCC !important;
        }
      }
      .restore_btn{
        width: 100%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
      }
    }
  }
  &.dark-theme{
    background: #04111F;
    .form_wrapper{
      background: #04111F;
      .text-h2{
        color: #FFF;
      }
      .text-h3{
        color: #FFF;
      }
      p{
        color: #FFF;
      }
      .restore_btn{
        // color: #FFF !important;
      }
    }
  }
}
</style>
