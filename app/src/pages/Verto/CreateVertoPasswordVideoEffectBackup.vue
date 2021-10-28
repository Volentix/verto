<template>
  <q-page :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false'}">
    <div class="row app-logo-row">
      <div class="col col-md-12 app-logo flex q-pl-lg q-ml-sm q-mt-lg items-center justify-start">
        <img src="statics/icons/vtx-logo-1024x1024.png" class="q-mr-sm" width="40" alt="logo"/>
        <router-link to="/verto/dashboard">VERTO</router-link>
      </div>
    </div>
    <video-bg :sources="[require('statics/mp4/create-password.mp4')]" img="">
      <div class="video-page-wrapper q-pt-md q-pb-md">
        <!-- <h1>Discover<br>the crypto space</h1> -->
        <div v-if="step===1" class="standard-content">
          <h2 class="standard-content--title">Create your Verto Password</h2>
          <h2 class="standard-content--desc q-pb-md" :class="{'gt-xs' : passwordsMatch}" >
            Please write down your password and store it somewhere safe.
            Only you know your password.
            There is no way to recover a Verto password.
          </h2>
          <!-- The seed phrase will now be added to your config after confirming the password. -->
          <div class="standard-content--body">
            <!-- <div class="standard-content--body__img column flex-center gt-xs" v-if="!passwordsMatch"> -->
              <!-- <img src="statics/password_bg.svg" alt=""> -->
            <!-- </div> -->
            <div class="standard-content--body__form">
              <q-input
                :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                ref="psswrd"
                v-show="!passwordsMatch"
                v-model="password"
                @input="passwordCheck"
                @keyup.enter="gotoSecondScreen"
                rounded outlined :color="passwordsMatch ? 'green' : 'deep-purple-14'"
                :type="isPwd ? 'password' : 'text'"
                :label="passwordsMatch ? 'Password confirmed' : 'Create Verto Password'"
                hint="*Minimum of 8 characters">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-if="passwordApproved"
                v-show="!passwordsMatch"
                :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                ref="psswrdConfirm"
                v-model="confirmPassword"
                @input="confirmPasswordCheck"
                @keyup.enter="submit"
                rounded outlined :color="passwordsMatch ? 'green' : 'deep-purple-14'"
                :type="isPwd ? 'password' : 'text'"
                :label="passwordsMatch ? 'Password confirmed' : 'Confirm password'"
                :hint="confirmPassword.trim().length ? (passwordsMatch ? 'Matched ' : 'Do not match') : ''"
                class="q-mt-sm">
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
          <p class="text-red q-pt-sm" v-if="passwordsMatch">Reminder: If you lose your password you will be locked out of Verto. No one will be able to help you recover a lost Verto password.</p>

          <div class="next-step q-pa-md" v-if="passwordsMatch">
            <div class="text-h6 q-pt-md text-bold">Password set ! Next ?</div>
            <p class="text-body1">Do you want to create or restore your 24 word mnemonic secret seed phrase?</p>
              <div class="standard-content--footer q-pb-md" v-if="passwordsMatch">
                <q-btn class="action-link back" color="grey" text-color="white" label="Restore" @click="submit(4)" />
                <q-btn class="action-link next" rounded color="deep-purple-14" text-color="white" label="Create" @click="submit(2)" :disable="!passwordsMatch"/>
              </div>
            </div>
        </div>
        <div v-if="false" class="standard-content">
          <h2 class="standard-content--title">Confirm your password to setup your HD wallet</h2>
          <h2 class="standard-content--desc"></h2>
          <div class="standard-content--body">
            <div class="standard-content--body__img column flex-center">
              <img src="statics/password_bg.svg" alt="">
            </div>
            <br>
            <div class="standard-content--body__form">
              <q-input
                :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                ref="psswrdConfirm"

                v-model="confirmPassword"
                @input="confirmPasswordCheck"
                @keyup.enter="submit"
                rounded outlined color="deep-purple-14"
                :type="isPwd ? 'password' : 'text'"
                label="Confirm"
                hint="*Minimum of 8 characters">
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
            <q-btn class="action-link next" color="deep-purple-14" text-color="white" label="Next" @click="submit" :disable="!passwordsMatch" />
          </div>
        </div>
      </div>
    </video-bg>
  </q-page>
</template>

<script>
// app/src/pages/Intro/CreatePassword.vue
import configManager from '@/util/ConfigManager'
// import FileSelect from '@/components/FileSelect.vue'
import Vue from 'vue'
import VideoBg from 'vue-videobg'

Vue.component('video-bg', VideoBg)

export default {
  name: 'CreatePassword',
  components: {
    // FileSelect
  },
  data () {
    return {
      isPwd: true,
      step: 1,
      password: '',
      passwordError: '',
      confirmPassword: '',
      wrongPasswordError: 'Password Incorrect',
      confirmPasswordError: '',
      doesNotMatch: false,
      iunderstand: true,
      passwordApproved: false,
      applicationRefreshing: false,
      confirmColor: 'white',
      passwordsMatch: false,
      file: null,
      contractable: true
    }
  },
  created () {

  },
  async mounted () {
    this.$refs.psswrd.focus()
  },
  methods: {
    gotoSecondScreen () {
      if (this.passwordApproved) {
        this.step = 2
        this.$nextTick(() => {
          this.$refs.psswrdConfirm.focus()
        })
      }
    },
    /*
    async startRestoreConfig (step) {
      this.$router.push({
        name: 'restoreWallet',
        params: { returnto: 'create-password', step: step }
      })
    }, */
    confirmPasswordCheck () {
      if (this.password === this.confirmPassword) {
        this.passwordsMatch = true
      } else {
        this.passwordsMatch = false
      }
    },
    passwordCheck: function () {
      this.passwordApproved = false
      if (this.password.length > 7) {
        this.contains_long = true
        this.passwordApproved = true
      } else {
        this.contains_long = false
        this.passHasError = true
        this.passwordError = 'Password should be more than 8 symbols'
      }
    },
    submit: async function (step) {
      if (!this.passwordsMatch) {
        return
      }
      try {
        this.$store.commit('settings/temporary', this.password)
        await configManager.createWallet(this.password)
        this.$router.push({
          name: 'recovery-seed',
          params: { step: step }
        })
      } catch (e) {
      }
    },
    checked () {
      if (this.iunderstand) {
        this.buttonsAreDisabled = false
      } else {
        this.buttonsAreDisabled = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.app-logo-row{
  position: relative;
  width: 60%;
  .app-logo{
    position: absolute !important;
    left: 0px;
    z-index: 9;
  }
}
/deep/ .video-page-wrapper{
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  background-color: rgba(black, .5);
  border-radius: 20px;
}
/deep/ .VideoBg__content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{}
  h1{
    font-family: $Franklin;
    color: #FFF;
    font-weight: 100;
    font-size: 45px;
    text-align: center;
    line-height: 55px;
  }
}
.next-step {
    background: #f7f7f7;
    border-radius: 12px;
}
.row {
    .col {
      &.menu {
        a {
          font-weight: $regular;
          font-family: $Titillium;
          font-size: 16px;
          color: #333;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 5px;

          &:hover {
            background-color: rgba(black, 0.02);
          }
        }
      }

      &.app-logo {
        a {
          font-weight: $lighter;
          text-transform: uppercase;
          font-family: $Titillium;
          font-size: 25px;
          color: #FFF;
          text-decoration: none;
        }
      }

      cursor: pointer;
      position: relative;
    }
  }
.standard-content{
  padding: 5%;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
  @media screen and (min-width: 768px) {
    padding-top: 20px;
  }
  // justify-content: space-between;
  // height: 100vh !important;
  &--title{
    font-size: 20px;
    font-weight: $regular;
    position: relative;
    line-height: 40px;
    font-family: $Titillium;
    letter-spacing: 1px;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  &--desc{
    margin-top: -20px;
    margin-bottom: 0px;
    font-size: 16px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: rgba(white, .5);
  }
  &--body{
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
        width: 100%;
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
    min-height: 0px;
    margin-bottom: 0px;
    margin-top: auto;
    .action-link{
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      line-height: 15px;
      letter-spacing: .5px;
      border-radius: 40px;
      min-width: 100px;
      padding-left: 20px;
      padding-right: 20px;
      margin-left: 10px;
      &.back{
        background-color: #B0B0B0 !important;
      }
    }

  }
}
.dark-theme{
  background: #04111F !important;
  .standard-content--title{
    color: #FFF;
  }
}
</style>
