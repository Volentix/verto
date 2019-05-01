<template>
  <q-page class="flex flex-center text-white bg-black  text-white">
    <q-card style="max-width: 500px;" flat>
      <q-card-title class="text-weight-bold text-center uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('setupWallet')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium">{{ $t('KeepYourKeysSafe.keepsafe') }}</big>
      </q-card-title>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <q-step default name="first" title="Responsibility" class=" bg-black workflow-step">
          <q-card-main class=" text-white"  >
          <div class="q-py-sm uppercase">
            <q-item>
              <q-item-side>
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-side>
              <q-item-main label="No password recovery system is available." />
            </q-item>
            <q-item>
              <q-item-side>
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-side>
              <q-item-main label="Private Key are not stored inside the wallets configuration by default" />
            </q-item>
            <q-item>
              <q-item-side>
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-side>
              <q-item-main label="Management of password and private keys is 100% your responsibiliy" />
            </q-item>
          </div>
          <div class="q-pa-sm">
            <div class="text-center q-pa-sm">
              <q-btn color="white" glossy outline @click="$refs.stepper.next()">{{ $t('SaveYourKeys.agree') }}</q-btn>
            </div>
          </div>
          <q-card-separator color="white"/>
          <q-collapsible color="green" label="Learn More">
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
          </q-collapsible>
          </q-card-main>
        </q-step>
        <q-step name="second" title="Storage" class=" bg-black workflow-step">
          <q-card-main class="text-white text-center">
            <div class="q-py-sm uppercase">
              <q-item>
                <q-item-side>
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-side>
                <q-item-main label="Choose a dry, safe, and secure location." />
              </q-item>
              <q-item>
                <q-item-side>
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-side>
                <q-item-main label="Put the private key information in a safety deposit box." />
              </q-item>
              <q-item>
                <q-item-side>
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-side>
                <q-item-main label="Store a copy locally in a safe." />
              </q-item>
              <q-item>
                <q-item-side>
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-side>
                <q-item-main label="Choose a trusted party in case of emergency." />
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
      iagreeScreeen: true,
      riskScreen: false,
      showRecommendationsScreen: false,
      contractable: true
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
