<template>
  <q-page  class="flex flex-center text-white bg-black  text-white">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center text-uppercase q-pa-md">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('settings/changePassword')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium q-pa-xl">{{ $t('ChangeVertoPassword.header') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('settings')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center text-uppercase q-pa-md">
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels v-model="step">
        <!--
          1. Current Password
        -->
        <q-step :name="1" :done="step>1" title="Current Password" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white"  >
              <q-input
                v-model="passwords.current"
                type="password"
                dark
                color="green"
                @input="checkCurrent"
                @keyup.enter="showNewPassword"
                :label="$t('ChangeVertoPassword.current')"
              />
            <div v-show="errors.orgPasswordIncorrect" class="text-h6 text-uppercase text-red q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div class="q-pa-md" v-show="showSubmit.current" @click="showNewPassword" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
          </q-card-section>
        </q-step>
        <!--
          2. New Password
        -->
        <q-step :name="2" :done="step>2" title="New Password" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white"  >
            <div class="text-center text-white text-uppercase">
              <q-item class="flex-center">
                <q-item-section class="col-auto">
                  <span class="q-pa-sm" v-show="!contains_long">
                    <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
                  </span>
                  <span class="q-pa-sm" v-show="contains_long">
                    <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                  </span>
                </q-item-section>
                <q-item-label> Minimum of 8 characters </q-item-label>
              </q-item>
            </div>
            <div class="text-center text-white">
              <span class="q-pa-sm">
                  <q-input
                    type="password"
                    dark
                    v-model="passwords.new"
                    @input="passwordCheck"
                    color="green"
                    :label="$t('ChangeVertoPassword.new')"
                    @keyup.enter="gotoConfirmScreen"
                    ref="passwordInput"
                  />
              </span>
              <span @click="gotoConfirmScreen" v-show="showSubmit.new">
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </span>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-section>
        </q-step>
        <!--
          3. Confirm Password
        -->
        <q-step :name="3" :done="step>3" title="Confirm Password" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white"  >
              <q-input
                v-model="passwords.confirm"
                type="password"
                dark
                color="green"
                @input="checkConfirm"
                @keyup.enter="submit"
                :label="$t('ChangeVertoPassword.confirm')"
              />
            <div class="q-pa-md" v-show="showSubmit.confirm" @click="submit" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-inner-loading :visible="progress" />
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-section>
        </q-step>
      </q-stepper>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      step: 1,
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
          this.$router.push({ path: 'settings' })
        }
        this.progress = false
      } catch (err) {
        this.progress = false
        this.errors.orgPasswordIncorrect = true
      }
    },
    cancel () {
      this.$router.push({ path: 'settings' })
    }
  }
}
</script>

<style>
</style>
