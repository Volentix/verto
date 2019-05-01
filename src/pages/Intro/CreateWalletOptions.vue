<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card style="max-width: 700px;"  flat>
      <q-card-main class="text-center">
        <!--
          1. Show main
        -->
        <div v-show="showMainScreen">
          <q-card-title class=" text-center uppercase">
            <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addWallet')">
              <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
            </q-icon>
            <big class="titillium q-pa-xl">{{ $t('CreateWalletOptions.header') }}</big>
            <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('vertomanager')"/>
          </q-card-title>
          <q-card-main class="q-pa-md text-center  uppercase q-title">
            <div style='border-style: solid;' class="q-pa-md">
              <div>{{ $t('CreateWalletOptions.create_account') }}</div>
              <div class="q-pa-md">
                <q-btn
                  color="white"
                  glossy
                  outline
                  @click="showMainScreen = false; showCreateLedgerOptions = true"
                >
                  {{ $t('CreateWalletOptions.ledger_account') }}
                </q-btn>
              </div>
            </div>
            <br>
            <div style='border-style: solid;' class="q-pa-md">
              <div>{{ $t('CreateWalletOptions.add_account') }}</div>
              <div class="q-pa-md">
                <q-btn color="white" glossy outline @click="$router.push('add-verto-wallet')">
                  {{ $t('CreateWalletOptions.ledger_account') }}
                </q-btn>
              </div>
              <div class="q-pa-md">
                <q-btn color="white" glossy outline @click="$router.push('eos-account')">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ $t('CreateWalletOptions.eos_account') }}&nbsp;&nbsp;&nbsp;
                </q-btn>
              </div>
            </div>
          </q-card-main>
        </div>
      </q-card-main>
      <!--
          2. Show Create Ledger Options
        -->
        <div v-show="showCreateLedgerOptions">
          <q-card-title class=" text-center ">
            <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/createLedger')">
               <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
             </q-icon>
            <big class="titillium text-weight-bold uppercase q-pa-xl">{{ $t('CreateWalletOptions.create_ledger') }}</big>
            <q-icon
              class="float-right round-borders"
              name="close"
              size="2.5rem"
              color="white"
              @click.native="showMainScreen = true; showCreateLedgerOptions = false"
            />
          </q-card-title>
          <q-card-main class="q-pa-md text-center  uppercase q-title">
            <div class="q-pa-lg"  style='border-style: solid;'>
              <div class="q-pa-md">
                <q-btn color="white" glossy outline @click="$router.push('save-to-file')">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ $t('CreateWalletOptions.save_to_file') }}&nbsp;&nbsp;&nbsp;
                </q-btn>
              </div>
              <div class="q-pa-md">
                <q-btn color="white" glossy outline @click="$router.push('write-it-down')">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ $t('CreateWalletOptions.write_it_down') }}&nbsp;&nbsp;&nbsp;
                </q-btn>
              </div>
            </div>
          </q-card-main>
        </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      showMainScreen: true,
      showCreateLedgerOptions: false
      // router.push('write-it-down')
    }
  },
  mounted () {},
  methods: {
  }
}
</script>

<style>
</style>
