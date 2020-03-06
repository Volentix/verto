<template>
  <q-page class="text-black bg-white">
    <div v-if="step===1" class="standard-content">
      <h2 class="standard-content--title">Create your Verto Password</h2>
      <h2 class="standard-content--desc">The seed phrase will now be added to your config after confirming the password.</h2>
      <div class="standard-content--body">
        <div class="standard-content--body__img column flex-center">
          <img src="statics/password_bg.png" alt="">
        </div>
        <div class="standard-content--body__form">
          <q-input
            ref="psswrd"
            v-model="password"
            @input="passwordCheck"
            @keyup.enter="gotoSecondScreen"
            rounded outlined color="purple"
            :type="isPwd ? 'password' : 'text'"
            label="Create Verto Password"
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
         <q-btn flat class="action-link back" color="grey" text-color="white" label="Restore Config" @click="startRestoreConfig" />
         <q-btn flat class="action-link next" color="black" text-color="white" label="Next" @click="gotoSecondScreen" :disable="!passwordApproved" />
      </div>
    </div>
    <div v-if="step===2" class="standard-content">
      <h2 class="standard-content--title">Confirm your password to setup your HD wallet</h2>
      <h2 class="standard-content--desc"></h2>
      <div class="standard-content--body">
        <div class="standard-content--body__img column flex-center">
          <img src="statics/password_bg.png" alt="">
        </div>
        <div class="standard-content--body__form">
          <q-input
            ref="psswrdConfirm"
            v-model="confirmPassword"
            @input="confirmPasswordCheck"
            @keyup.enter="submit"
            rounded outlined color="purple"
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
         <q-btn flat class="action-link next" color="black" text-color="white" label="Next" @click="submit" :disable="!passwordsMatch" />
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
    async startRestoreConfig () {
      this.$router.push({
        name: 'restore-wallet',
        params: { returnto: 'create-password' }
      })
    },
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
    submit: async function () {
      if (!this.passwordsMatch) {
        return
      }
      try {
        await configManager.createWallet(this.password)
        this.$router.replace('/recovery-seed')
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
      line-height: 15px;
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
