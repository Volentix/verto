<template>
  <q-page class="column flex-center text-white bg-black  text-white">
    <q-card style="max-width: 500px; width: 100%;" flat>
      <q-card-section class="text-weight-bold text-center text-uppercase bg-black">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('setupWallet')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium">{{ $t('KeepYourKeysSafe.keepsafe') }}</big>
      </q-card-section>
    </q-card>
    <q-card style="max-width: 500px; width: 100%;" flat>
      <q-stepper v-model="step" ref="stepper" alternative-labels active-color="green" animated >
        <q-step style="min-height: 450px" default :name="1" title="Responsibility" class="bg-black workflow-step" :done="step > 1">
          <q-card-section class="text-white">
          <div class="q-py-sm text-uppercase">
            <q-item class="items-center">
              <q-item-section class="col-auto q-mr-md">
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>No password recovery system is available.</q-item-label>
            </q-item>
            <q-item class="items-center">
              <q-item-section class="col-auto q-mr-md">
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>Private Keys are not stored inside the wallets configuration by default</q-item-label>
            </q-item>
            <q-item class="items-center">
              <q-item-section class="col-auto q-mr-md">
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>Management of password and private keys is 100% your responsibiliy</q-item-label>
            </q-item>
          </div>
          <div class="q-pa-sm">
            <div class="text-center q-pa-sm">
              <q-btn color="white" glossy outline @click="$refs.stepper.next()">{{ $t('SaveYourKeys.agree') }}</q-btn>
            </div>
          </div>
          <q-separator color="white"/>
          <q-expansion-item color="green" label="Learn More" >
            <div class="q-py-sm">
              {{ $t('KeepYourKeysSafe.before') }}
            </div>
            <div class="q-py-sm">
              {{ $t('KeepYourKeysSafe.choices') }}
            </div>
            <div class="q-py-sm">
              {{ $t('KeepYourKeysSafe.first') }}
            </div>
            <div class="q-py-sm">
              {{ $t('KeepYourKeysSafe.second') }}
            </div>
            <div class="q-py-sm">
              {{ $t('SaveYourKeys.strategy') }}
            </div>
            <div class="q-py-sm">
              {{ $t('SaveYourKeys.physical') }}
            </div>
            <div class="q-py-sm">
              {{ $t('SaveYourKeys.legacy') }}
            </div>
          </q-expansion-item>
          </q-card-section>
        </q-step>
        <q-step style="min-height: 450px" :name="2" title="Storage" class=" bg-black workflow-step" :done="step > 2" icon="fas fa-save">
          <q-card-section class="text-white text-center">
            <div class="q-py-sm text-uppercase">
              <q-item class="items-center">
                <q-item-section class="col-auto q-mr-md">
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label>Choose a dry, safe, and secure location.</q-item-label>
              </q-item>
              <q-item class="items-center">
                <q-item-section class="col-auto q-mr-md">
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label>Put the private key information in a safety deposit box.</q-item-label>
              </q-item>
              <q-item class="items-center">
                <q-item-section class="col-auto q-mr-md">
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label>Store a copy locally in a safe.</q-item-label>
              </q-item>
              <q-item class="items-center">
                <q-item-section class="col-auto q-mr-md">
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label>Choose a trusted party in case of emergency.</q-item-label>
              </q-item>
            </div>
            <div class="q-py-sm">
                <div class="q-pa-sm">
                  <div class="text-center q-pa-sm">
                    <q-btn color="white" glossy outline @click="$router.push('create-password')">{{ $t('SaveYourKeys.agree_storage') }}</q-btn>
                  </div>
                </div>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
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
      iagreeScreeen: true,
      riskScreen: false,
      showRecommendationsScreen: false,
      contractable: true,
      step: 1
    }
  },
  mounted () {
    if (
      this.$store.state.currentwallet.config &&
      this.$store.state.currentwallet.config.keys &&
      this.$store.state.currentwallet.config.keys.length > 0
    ) {
      this.$router.push('create-wallet-options')
    }
  },
  methods: { }
}
</script>

<style>
</style>
