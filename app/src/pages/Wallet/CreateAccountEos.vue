<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center flex justify-between">
        <q-icon name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase col">Create EOS Account</big>
        <q-icon name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">

        <q-step default :name="1" :done="step>1" title="Paid To" class=" bg-black workflow-step">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <q-item class="flex-center">
              <q-item-section class="col-auto">
                <q-chip v-show="!valid" dense color="red" class="shadow-1">&nbsp;</q-chip>
                <q-chip v-show="valid" dense color="green" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>Choose a 12 Letter & (1-5) Eos Account Name</q-item-label>
            </q-item>
            <div class="q-pa-md">

                  <q-input
                    ref="account"
                    v-model="account"
                    dark
                    color="green"
                    label="Account Name"
                    @input="checkName"
                    @keyup.enter="goToMemo()"
                  />

              </div>
              <div class="q-pa-sm" v-show="valid" @click="goToMemo()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
          </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      step: 1,
      account: null,
      valid: false
    }
  },
  created () {
  },
  async mounted () {
  },
  methods: {
    checkName () {

    }
  }
}
</script>
