<template>
  <q-page  class="flex flex-center text-white bg-black  text-white">
    <q-card flat>
      <q-card-title class="text-weight-bold text-center uppercase q-pa-md">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('settings/changePassword')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium q-pa-xl">{{ $t('ChangeVertoPassword.header') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('settings')"/>
      </q-card-title>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <!--
          1. Current Password
        -->
        <q-step default name="first" title="Current Password" class=" bg-black workflow-step">
          <q-card-main class="text-center text-white"  >
            <q-field>
              <q-input
                v-model="passwords.current"
                type="password"
                dark
                color="green"
                @input="checkCurrent"
                @keyup.enter="showNewPassword"
                :float-label="$t('ChangeVertoPassword.current')"
              />
            </q-field>
            <div v-show="errors.orgPasswordIncorrect" class="q-title uppercase text-red q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div class="q-pa-md" v-show="showSubmit.current" @click="showNewPassword" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
          </q-card-main>
        </q-step>
        <!--
          2. New Password
        -->
        <q-step default name="second" title="New Password" class=" bg-black workflow-step">
          <q-card-main class="text-center text-white"  >
            <div class="text-center text-white uppercase">
              <q-item>
                <q-item-side>
                  <span class="q-pa-sm" v-show="!contains_long">
                    <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
                  </span>
                  <span class="q-pa-sm" v-show="contains_long">
                    <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                  </span>
                </q-item-side>
                <q-item-main label="Minimum of 8 characters" />
              </q-item>
            </div>
            <div class="text-center text-white">
              <span class="q-pa-sm">
                <q-field > <!--:error="passHasError" :error-label=passwordError >-->
                  <q-input
                    type="password"
                    dark
                    v-model="passwords.new"
                    @input="passwordCheck"
                    color="green"
                    :float-label="$t('ChangeVertoPassword.new')"
                    @keyup.enter="gotoConfirmScreen"
                    ref="passwordInput"
                  />
                </q-field>
              </span>
              <span @click="gotoConfirmScreen" v-show="showSubmit.new">
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </span>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-main>
        </q-step>
        <!--
          3. Confirm Password
        -->
        <q-step default name="third" title="Confirm Password" class=" bg-black workflow-step">
          <q-card-main class="text-center text-white"  >
            <q-field>
              <q-input
                v-model="passwords.confirm"
                type="password"
                dark
                color="green"
                @input="checkConfirm"
                @keyup.enter="submit"
                :float-label="$t('ChangeVertoPassword.confirm')"
              />
            </q-field>
            <div class="q-pa-md" v-show="showSubmit.confirm" @click="submit" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-inner-loading :visible="progress" />
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-main>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      passwords: {
        current: '',
        new: '',
        confirm: ''
      },
      showSubmit: {
        current: false,
        new: false,
        confirm: false
      },
      errors: {
        orgPasswordIncorrect: false
      },
      progress: false,
      contractable: true,
      contains_long: false,
      userPassword: '',
      checkPassword: '',
      originalPassword: '',
      vertoPasswordWrong: false,
      newPasswordNull: false,
      newPasswordDontMatch: false
    }
  },
  methods: {
    checkCurrent () {
      this.errors.orgPasswordIncorrect = false
      this.errors.orgPasswordIncorrect = false
      if (this.passwords.current.length > 2) {
        this.showSubmit.current = true
      } else {
        this.showSubmit.current = false
      }
    },
    checkConfirm () {
      if (this.passwords.new === this.passwords.confirm) {
        this.showSubmit.confirm = true
      } else {
        this.showSubmit.confirm = false
      }
    },
    passwordCheck () {
      this.contains_long = false
      this.showSubmit.new = false
      if (this.passwords.new.length > 7) {
        this.contains_long = true
        this.showSubmit.new = true
      }
    },
    gotoConfirmScreen () {
      if (this.showSubmit.new) {
        this.$refs.stepper.next()
      }
    },
    async showNewPassword () {
      this.errors.orgPasswordIncorrect = false
      if (!this.showSubmit.current) {
        return
      }
      try {
        const result = await this.$configManager.getConfig(this.passwords.current)
        if (!result.success) {
          this.errors.orgPasswordIncorrect = true
          this.showSubmit.current = false
          return
        }
      } catch (err) {
        this.errors.orgPasswordIncorrect = true
        this.showSubmit.current = false
        return
      }
      this.$refs.stepper.next()
    },
    submit: async function () {
      this.errors.orgPasswordIncorrect = false
      if (!this.showSubmit.confirm) {
        return
      }
      try {
        this.progress = true
        const result = await this.$configManager.changeVertoPassword(this.passwords.current, this.passwords.new)
        if (!result.success) {
          this.errors.orgPasswordIncorrect = true
        } else {
          this.$router.push({path: 'settings'})
        }
        this.progress = false
      } catch (err) {
        this.progress = false
        this.errors.orgPasswordIncorrect = true
      }
    },
    cancel () {
      this.$router.push({path: 'settings'})
    }
  }
}
</script>

<style>
</style>
