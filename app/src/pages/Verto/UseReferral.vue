<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <div class="standard-content--body">
        <h2 class="standard-content--title">Use the referral</h2>
        <div class="standard-content--body__img flex flex-center">
          <img src="statics/use_referral_bg.png" alt="">
        </div>
        <div class="standard-content--body__form">
          <div class="text-step flex justify-center items-center" :class="{'active': lab1}"><b>1</b> Paste your referral link</div>
          <q-input rounded outlined color="purple" @focus="lab1 = true" @blur="lab1 = false" />
          <div class="flex justify-end referrer">Referrer ID: EOS123uieuihkdhkshfks</div>
          <br><br>
          <p class="desc text-center">Before entering your twitter handle make sure you have followed <span class="blue">Volentix twitter</span></p>
          <div class="text-step flex justify-center items-center" :class="{'active': lab2}"><b>2</b> Enter your twitter handle</div>
          <q-input rounded outlined color="purple" @focus="lab2 = true" @blur="lab2 = false" />
        </div>
        <div class="standard-content--footer">
         <q-btn flat class="action-link next" color="black" text-color="white" label="Create my free account" />
        </div>
      </div>

    </div>
    <br><br><br><br>
  </q-page>
</template>

<script>
// app/src/pages/Intro/CreatePassword.vue
import configManager from '@/util/ConfigManager'
// import FileSelect from '@/components/FileSelect.vue'

export default {
  name: 'UseReferral',
  components: {
    // FileSelect
  },
  data () {
    return {
      isPwd: true,
      step: 1,
      lab1: false,
      lab2: false,
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
        this.$store.commit('settings/temporary', this.password)
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
  min-height: 100vh !important;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 40px;
    margin-bottom: 0px;
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
      overflow: hidden;
      width: 100%;
      align-items: center;
      margin-bottom: 20px;
      img{
        max-width: 125%;
        width: 125%;
        transform: scale3d(1,1,1);
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
      .referrer{
        color: #7900FF;
        margin-top: 5px;
        font-size: 14px;
        font-weight: $light;
      }
      .desc{
        font-size: 19px;
        font-weight: $light;
        color: #2A2A2A;
        .blue{
          color: #7272FA;
        }
      }
      .text-step{
        margin-bottom: 15px;
        font-size: 20px;
        b{
          background: #B0B0B0;
          font-family: $Titillium;
          font-weight: $bold;
          font-size: 20px;
          color: #FFF;
          width: 30px;
          height: 30px;
          border-radius: 30px;
          margin-right: 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        &.active{
          b{
            background: #7272FA;
          }
        }
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    min-height: 80px;
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
      &.next{
        background-color: #7272FA !important;
      }
      &.back{
        background-color: #B0B0B0 !important;
      }
    }

  }
}
</style>
