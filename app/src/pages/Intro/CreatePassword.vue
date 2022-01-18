<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card style="max-width: 500px; width: 100%;" flat class="bg-black">
      <q-card-section class="text-weight-bold text-center">
        <q-icon
          class="float-left"
          name="help_outline"
          size="2.5rem"
          color="white"
          @click.native="$documentationManger.openDocumentation('setupWallet')"
        >
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase">{{ $t('CreateVertoPassword.lets_get_started') }}</big>
      </q-card-section>
    </q-card>
    <q-card style="max-width: 500px; width: 100%;" flat>
      <q-stepper done-color="green" active-color="green" color="green" ref="stepper" alternative-labels v-model="step">
        <q-step :name="1" title="Create Password" class="bg-black workflow-step" :done="step > 1">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-item class="flex-center">
                <q-item-section class="col-auto">
                  <span class="q-pa-sm" v-show="!passwordApproved">
                    <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
                  </span>
                  <span class="q-pa-sm" v-show="passwordApproved">
                    <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                  </span>
                </q-item-section>
                <q-item-label>Minimum of 8 characters</q-item-label>
              </q-item>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-center text-white">
              <span class="q-pa-sm">
                  <q-input
                    dark
                    v-model="password"
                    @input="passwordCheck"
                    class="full-width"
                    color="green"
                    label="Create Your Verto Password"
                    @keyup.enter="gotoSecondScreen"
                    ref="passwordInput"
                    :type="isPwd ? 'password' : 'text'">
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
              </span>
              <span @click="gotoSecondScreen" v-show="passwordApproved">
                <q-icon name="navigate_next" size="3.2rem" color="green">
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </span>
            </div>
            <div class="text-center text-gray">
              <q-btn
                color="primary"
                class="q-mt-sm text-grey"
                @click="startRestoreConfig"
                icon="cached"
              >&nbsp;{{ $t('SettingsView.restore_config') }}</q-btn>
            </div>
          </q-card-section>
        </q-step>

        <q-step :name="2" title="Confirm" class="workflow-step" :done="step > 2">
          <q-card-section>
            <div class="text-center text-white">
              <span class>
                  <q-input
                    dark
                    v-model="confirmPassword"
                    @input="confirmPasswordCheck"
                    color="green"
                    label="Confirm Verto Password"
                    @keyup.enter="submit"
                    :type="isPwd ? 'password' : 'text'">
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
              </span>
              <div @click="submit" v-show="passwordsMatch && iunderstand">
                <q-icon name="navigate_next" size="3.2rem" color="green">
                  <q-tooltip>{{ $t('WalletManager.submit') }}</q-tooltip>
                </q-icon>
              </div>
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back"/>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
      <!--
        Stepper
        stepper
        stepper
      -->
    </q-card>
    <!--
    5. Modal
    -->
    <q-dialog v-model="applicationRefreshing">
      <q-card class="q-pa-lg text-center">
        <big>Application Refreshing</big>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
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
  methods: {
    gotoSecondScreen () {
      if (this.passwordApproved) {
        this.$refs.stepper.next()
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
        this.$router.replace('/create-wallet-options')
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

<style lang="stylus" scoped>
input {
  color: white;
}

.q-card {
  min-width: 25vw;
}

.password_strength {
  display: block;
  margin: 5px auto;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
}

.password_strength p {
  width: 100px;
  height: auto;
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  border-radius: 2px;
  color: #232323;
  background: linear-gradient(to right, #00AD7C 50%, #eeeeee 50%);
  background-size: 201% 100%;
  background-position: right;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
}

.field_valid {
  background-position: left !important;
  color: #ffffff !important;
}

.workflow-step {
  background: black;
  border: 0.1rem solid white;
  color: white !important;
}
</style>
