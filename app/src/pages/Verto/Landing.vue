<template>
  <q-page class="column flex-center text-black bg-white">
    <div class="landing" style="background: url('statics/landing_bg.png');">
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <h2 class="landing--title">
          <strong>VERTO</strong> Wallet
          <span>Multi-Currency wallet</span>
          <b class="version">{{ version }}</b>
          <img src="statics/picto_verto.svg" alt="">
        </h2>
      </transition>
      <div class="standard-content--body full-width">
        <div class="standard-content--body__form">
          <q-input
            ref="psswrd"
            v-model="password"
            @keyup.enter="login"
            @input="checkPassword"
            :error="passHasError"
            rounded outlined color="deep-purple-14"
            :type="isPwd ? 'password' : 'text'"
            label="Verto Password"
            hint="*Minimum of 8 characters"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
      </div>
      <div class="standard-content--footer full-width">
        <!-- :disable="!passHasError" -->
         <q-btn flat class="action-link back" color="grey" text-color="white" label="Restore" @click="startRestoreConfig" />
         <q-btn class="action-link next" color="deep-purple-14" text-color="white" label="Connect" @click="login"/>
      </div>
      <div class="landing--volentix-logo">
          <img src="statics/vtx_black.svg" class="svg" />
      </div>
      <span class="landing--bottom-bar"></span>
    </div>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'

export default {
  name: 'Login',
  data () {
    return {
      hasConfig: false,
      passHasError: false,
      password: '',
      isPwd: true,
      deleteConfigFail: false,
      deleteConfig: false,
      version: {},
      showSubmit: false
    }
  },
  async mounted () {
    this.version = version
    this.hasConfig = !!await configManager.hasVertoConfig()
    if (!this.hasConfig) {
      this.$router.push({ name: 'create-password' })
    }
    this.$refs.psswrd.focus()
  },
  methods: {
    checkPassword () {
      if (this.password.length > 1) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    async startRestoreConfig () {
      this.$router.push({
        name: 'restoreWallet',
        params: { returnto: 'settings' }
      })
    },
    async login () {
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        return
      }
      const results = await configManager.login(this.password)
      if (results.success) {
        this.$store.commit('settings/temporary', this.password)
        this.$router.push({ path: '/verto/dashboard' })
        // this.$router.push({ path: 'vertomanager' })
      } else {
        if (results.message === 'no_default_key') {
          this.$router.push({ path: 'vertomanager' })
        } else {
          // this.startRestoreConfig()
          this.passHasError = true
        }
      }
    },
    async destroyData () {
      try {
        await configManager.destroyConfig()
        this.hasConfig = false
        this.deleteConfig = false
        this.$q.notify({ color: 'positive', message: 'Config successfully deleted' })
        this.$router.push({ name: 'create-password' })
      } catch (e) {
        this.deleteConfigFail = true
        this.deleteConfig = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .landing{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    &--title{
      font-size: 30px;
      font-weight: 100;
      position: relative;
      padding-left: 20px;
      line-height: 24px;
      font-family: $Titillium;
      position: relative;
      margin-left: 32%;
      img{
        position: absolute;
        max-width: 170px;
        right: 100%;
        top: -60px;
        width: 200px;
        opacity: .6;
      }
      b.version{
        position: absolute;
        right: 0px;
        bottom: -26px;
        font-weight: $regular;
        font-size: 15px;
      }
      span{
        font-size: 20px;
        margin-top: 8px;
        display: block;
        color: #000000;
        font-weight: $regular;
      }
      &__sub{
        font-size: 18px;
        text-align: center;
        line-height: 30px;
        margin-top: 0px;
      }
      strong{
        font-weight: bold;
      }
      &:before {
        content: "";
        width: 14px;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        background: #7900FF;
        background: transparent linear-gradient(180deg, #7900FF 0%, #00D0DF 100%) 0% 0% no-repeat padding-box;
      }
    }
    &--volentix-logo{
      margin-top: 9px; text-decoration: none; color: #000 !important; font-size: 29px; position: relative; text-transform: uppercase;
      margin-top: 0px;color: #000 !important;
      position: absolute;
      bottom: 20px;
      transform: scale(.55);
      img{top: 7px;position: relative; width: 40px;}
      &:after { content: "Volentix"; font-family: $Titillium; font-weight: $light; position: relative; left: 0px; top: 0px;margin-left: 10px; }
      &:after {top: -8px;}
    }
    &--bottom-bar{
      position: absolute;
      bottom: 10px;
      width: 130px;
      height: 4px;
      background-color: #555869;
      opacity: .2;
    }
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &--body{
      margin-top: 35%;
      margin-bottom: -9%;
    }
    &--footer{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      min-height: 100px;
      .action-link{
        height: 50px;
        text-transform: initial !important;
        font-size: 16px;
        letter-spacing: .5px;
        border-radius: 40px;
        width: 48%;
        margin-left: 0px;
        &.back{
          background-color: #B0B0B0 !important;
        }
      }

    }
}
</style>
