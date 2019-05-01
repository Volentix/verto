<template>
<q-page class="flex flex-center text-white bg-black">
  <q-card style="max-width: 500px;" flat>
      <q-card-title class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('setupWallet')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium uppercase">{{ $t('CreateVertoPassword.lets_get_started') }}</big>
      </q-card-title>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <q-step default name="first" title="Create Password" class=" bg-black workflow-step">
          <q-card-main>
          <div class="text-center text-white uppercase">
              <q-item>
                <q-item-side>
                  <span class="q-pa-sm" v-show="!passwordApproved">
                    <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
                  </span>
                  <span class="q-pa-sm" v-show="passwordApproved">
                    <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                  </span>
                </q-item-side>
                <q-item-main label="Minimum of 8 characters" />
              </q-item>
            </div>

          <div class="text-center text-white">
            <span class="q-pa-sm">
              <q-field >
                <q-input
                  type="password"
                  dark
                  v-model="password"
                  @input="passwordCheck"
                  color="green"
                  float-label="Create Your Verto Password"
                  @keyup.enter="gotoSecondScreen"
                  ref="passwordInput"
                />
              </q-field>
            </span>
            <span @click="gotoSecondScreen" v-show="passwordApproved">
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('next') }}</q-tooltip>
              </q-icon>
            </span>
          </div>
          <div class="text-center text-gray">
            <q-btn color="primary" class="q-mt-sm text-grey"  @click="startRestoreConfig" icon="cached" >&nbsp;{{ $t('SettingsView.restore_config') }}</q-btn>
          </div>
        </q-card-main>
        </q-step>

        <q-step name="second" title="Confirm" class="workflow-step">
          <q-card-main>
            <div class="text-center text-white">
              <span class="">
                <q-field>
                  <q-input
                    type="password"
                    dark
                    v-model="confirmPassword"
                    @input="confirmPasswordCheck"
                    color="green"
                    float-label="Confirm Verto Password"
                    @keyup.enter="submit"
                  />
                </q-field>
                </span>
                <div @click="submit" v-show="passwordsMatch && iunderstand">
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('WalletManager.submit') }}</q-tooltip>
                  </q-icon>
                </div>
                <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </q-card-main>
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
  <q-modal v-model="applicationRefreshing">
    <q-card class="q-pa-lg text-center">
      <big>Application Refreshing</big>
    </q-card>
  </q-modal>
</q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import FileSelect from '@/components/FileSelect.vue'

export default {
  name: 'CreatePassword',
  components: {
    FileSelect
  },
  data () {
    return {
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
    printFile () {
      console.log(this.file)
    },
    async startRestoreConfig () {
      this.$router.push({name: 'restore-wallet', params: {returnto: 'create-password'}})
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
        console.log(e)
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
input
  color white
.q-card
  min-width 25vw

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
  -webkit-transition: background .3s;
  transition: background .3s;
}

.field_valid {
  background-position: left !important;
  color: #ffffff !important;
}

.workflow-step  {
  background: black;
  border: 0.1rem solid white;
  color: white !important;
}
</style>
