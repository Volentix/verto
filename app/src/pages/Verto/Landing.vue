<template>
  <q-page class="column flex-center text-black bg-white">
    <div class="landing" style="background: url('statics/landing_bg.png');">
      <h2 class="landing--title"><strong>VERTO</strong> Wallet</h2>
      <h3 class="landing--title__sub">The easiest and most secure<br>crypto wallet</h3>
      <div class="standard-content--body">
        <div class="standard-content--body__img column flex-center">
          <img src="statics/img/decahedron.png" alt="">
        </div>
        <div class="standard-content--body__form">
          <q-input
            ref="psswrd"
            v-model="password"
            @keyup.enter="login"
            @input="checkPassword"
            :error="passHasError"
            rounded outlined color="purple"
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
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="grey" text-color="white" label="Restore" :disable="!passHasError" @click="startRestoreConfig" />
         <q-btn flat class="action-link next" color="black" text-color="white" label="Connect" @click="login"/>
      </div>
      <div class="landing--volentix-logo">
          <img src="statics/vtx_black.svg" class="svg" />
      </div>
      <div class="text-h6 q-pa-lg">
        {{ version }}
      </div>
      <span class="landing--bottom-bar"></span>
    </div>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
// import { userError } from '@/util/errorHandler'
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
        name: 'restore-wallet',
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
        this.$router.push({ path: 'wallet' })
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
    &--title{
      font-size: 30px;
      font-weight: 100;
      position: relative;
      padding-left: 20px;
      line-height: 40px;
      font-family: $Titillium;
      &__sub{
        font-size: 18px;
        text-align: center;
        line-height: 30px;
        margin-top: 0px;
      }
      strong{
        font-weight: bold;
      }
      :before {
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
      bottom: 50px;
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
  height: 100vh !important;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  &--desc{
    margin-top: -20px;
    margin-bottom: 40px;
    font-size: 18px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: $mainColor;
  }
  &--body{
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
      }
    }
    &__form{
      /deep/ .q-field__native{
        padding-left: 8px;
        font-size: 16px;
        font-weight: $regular;
      }
      /deep/ .q-field__label{
        font-family: $Titillium;
        font-weight: $bold;
        font-size: 18px;
        padding-left: 10px;
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    min-height: 100px;
    .action-link{
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: 110px;
      margin-left: 10px;
      &.next{
        background-color: #7900FF !important;
      }
      &.back{
        background-color: #B0B0B0 !important;
      }
    }

  }
}
</style>
