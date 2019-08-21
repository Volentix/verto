<template>
<q-page class="flex flex-center column text-white bg-black">
  <q-card class="bg-black q-pa-lg">
    <q-card-section>
       <div class="text-center">
        <div class="logo-welcome">
          <img
            src="@/assets/img/vtx_icon.png"
            style="width:30vw;max-width:150px;"
          >
        </div>
         <div class="">
          <div class="">
            <q-input
              :type="isPwd ? 'password' : 'text'"
              dark
              v-model="password"
              color="green"
              @keyup.enter="login"
              :label="$t('Welcome.password')"
              @input="checkPassword"
              ref="psswrd"
              :error="passHasError"
              bottom-slots
             >
              <template v-slot:error>
                {{$t('Welcome.incorrect')}}
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
           <div v-show="showSubmit" @click="login">
            <q-icon name="navigate_next" size="3.2rem" color="green"   >
              <q-tooltip>{{ $t('next') }}</q-tooltip>
            </q-icon>
          </div>
         </div>
          <div class="text-h6 q-pa-lg">
            {{ version }}
          </div>
      </div>
    </q-card-section>
  </q-card>
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
      this.$router.push({ name: 'keep-your-key-safe' })
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

<style lang="stylus" scoped>
.logo-welcome
  width 100%
  max-width 250px
  margin 0 auto
  img
    width 100%
.bg-login
  background-image url("~@/assets/img/bg.jpg")
  background-position center
  background-repeat no-repeat
  background-size cover
.q-card
  max-width: 80vw
.q-icon
  cursor pointer
</style>
