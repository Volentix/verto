<template>
  <q-page :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false'}">
    <div class="row">
      <div class="col col-md-4 app-logo flex q-pa-md items-center">
        <!-- <img src="statics/vtx_black.svg" alt="" class="q-mr-sm" style="width: 30px; height: 30px;"> -->
        <svg
          class="svg_logo q-mr-sm"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 20.58"
        >
          <path
            d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
            transform="translate(-183 -18.21)"
          ></path>
        </svg>
        <router-link to="/verto/dashboard">VERTO</router-link>
      </div>
    </div>
    <div v-if="step===1" class="standard-content">
      <h2 class="standard-content--title">Create your Verto Password</h2>
      <h2 class="standard-content--desc q-pb-md" :class="{'gt-xs' : passwordsMatch}" >
        Please write down your password and store it somewhere safe.
        Only you know your password.
        There is no way to recover a Verto password.
      </h2>
      <!-- The seed phrase will now be added to your config after confirming the password. -->
      <div class="standard-content--body">
        <div class="standard-content--body__img column flex-center gt-xs" v-if="!passwordsMatch">
          <img src="statics/password_bg.svg" alt="">
        </div>
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
  </q-page>
</template>

<script>
// app/src/pages/Intro/CreatePassword.vue
import configManager from '@/util/ConfigManager'
// import FileSelect from '@/components/FileSelect.vue'

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
        svg {
          fill: #000;
        }
        a {
          font-weight: $bold;
          text-transform: uppercase;
          font-family: $Titillium;
          font-size: 20px;
          color: #333;
          text-decoration: none;
        }
      }

      cursor: pointer;
      position: relative;
    }
  }
.standard-content{
  padding: 5% 10%;
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
    font-size: 27px;
    font-weight: $bold;
    position: relative;
    line-height: 40px;
    font-family: $Titillium;
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
    color: $mainColor;
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
