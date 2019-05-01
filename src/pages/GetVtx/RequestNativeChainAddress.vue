<template>
  <q-page class="flex flex-center text-white bg-black  text-white">
    <q-card style="max-width: 500px;" flat>
      <q-card-section class="text-weight-bold text-center text-uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('getvtx/requestAddress')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium q-pa-xl">{{ $t('RequestNativeChainAddress.header') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('summary-vtx')"/>
      </q-card-section>
      <q-stepper dark done-color="green" active-color="green" ref="stepper" alternative-labels :contractable="contractable">
        <q-step default name="first" title="Rules" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white text-uppercase"  >
            <q-item>
              <q-item-section>
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label :label="$t('RequestNativeChainAddress.second_p')" />
            </q-item>
            <q-item>
              <q-item-section>
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label :label="$t('RequestNativeChainAddress.second_p_point_1')" />
            </q-item>
            <q-item>
              <q-item-section>
                <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label :label="$t('RequestNativeChainAddress.third_p')" />
            </q-item>
            <div class="q-pa-md">
              <q-btn  outline glossy @click="$refs.stepper.next()">I understand</q-btn>
            </div>
          </q-card-section>
        </q-step>
        <q-step name="second" title="Native Chain" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white"  >
            <div class="q-pa-md">
                <div class="q-pa-sm">
                    <q-select dark separator v-model="currency" :options="options" />
                </div>
                <div v-show="errors.noAddress" class="text-h6 text-uppercase text-red q-pa-md">
                  {{ $t('RequestNativeChainAddress.err_noAddressAvailable') }}
                </div>
                <div v-show="errors.transactionsExist" class="text-h6 text-uppercase text-red q-pa-md">
                  {{ $t('RequestNativeChainAddress.err_pendingTransactionsExist') }}
                </div>
                <div v-show="errors.mustWait" class="text-h6 text-uppercase text-red q-pa-md">
                  {{ $t('RequestNativeChainAddress.time_remaining_info') }}
                <countdown :time="timeremaining" :transform="transform" >
                    <template slot-scope="props">
                      <div >
                        <span v-if="props.totalHours > 0" class="timestandard"
                          >{{ props.hours }}:</span>
                        <span v-if="props.totalMinutes > 0"
                          v-bind:class="{ timestandard:  props.totalMinutes > 0, minutesleft: props.totalHours <= 0 }"
                        >
                          {{ props.minutes }}:
                        </span>
                        <span
                          v-bind:class="{ timestandard:  props.totalMinutes > 0, secondsleft:  props.totalMinutes <= 0, minutesleft: props.totalHours <= 0 }"
                        >
                          {{ props.seconds }}
                        </span>
                      </div>
                    </template>
                  </countdown>
                </div>
                <div v-show="showSubmit" class="q-pa-md" @click="submit" >
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
// import getVtxHelper from '../../util/GetVtxHelper'
import axios from 'axios'
import countdown from '@chenfengyuan/vue-countdown'

export default {
  data () {
    return {
      contractable: true,
      currency: 'BTC',
      showModal: false,
      showInvsetorMustWait: false,
      timeremaining: 0,
      pendingTransactionsExist: false,
      investorMustWait: false,
      buttondisabled: true,
      agree: false,
      options: [
        {
          label: 'Bitcoin',
          value: 'BTC'
        },
        {
          label: 'Ethereum',
          value: 'ETH'
        }
      ],
      errorMessage: 'Default message',
      showSubmit: true,
      errors: {
        noAddress: false,
        transactionsExist: false,
        mustWait: false
      }
    }
  },
  components: {
    countdown
  },
  mounted () {
  },
  methods: {
    transform (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'totalSeconds' && value <= 1) {
          this.errors.mustWait = false
          this.showSubmit = true
        }
        let digits = value < 10 ? `0${value}` : value
        props[key] = `${digits}`
      })
      return props
    },
    async submit () {
      this.showModal = false
      this.errors.noAddress = false
      this.showInvsetorMustWait = false
      let hashResult = await axios.post(process.env[this.$store.state.settings.network].CROWDFUND_URL + '/public/api/initiate-transaction/', {
        verto_public_address: this.$store.state.currentwallet.wallet.key,
        currency: this.currency
      })
      const res = await hashResult
      if (res.data.success) {
        this.$router.push({ name: 'begin-get-vtx' })
      } else {
        if (res.data.error_code === 'no_address_available') {
          this.errors.noAddress = true
        } else if (res.data.error_code === 'pending_transactions_exist') {
          this.errors.transactionsExist = true
        } else if (res.data.error_code === 'investor_must_wait') {
          const waitUntil = res.data.data.next_available_time
          const serverTime = res.data.data.server_time
          this.timeremaining = Date.parse(waitUntil) - Date.parse(serverTime)
          this.errorMessage = this.$t('RequestNativeChainAddress.time_remaining_info')
          this.showInvsetorMustWait = true
          this.errors.mustWait = true
          this.showSubmit = false
        }
      }
    }
  }
}
</script>
<style scoped>
.vtxamount {
  font-size: 1.5em;
}
.timestandard {
  font-size: 1.5em;
}
.minutesleft {
  color: red;
  font-size: 2.5em;
}
.secondsleft {
  color: red;
  font-size: 5em;
}
.modal-content .q-icon {
  cursor: pointer
}
</style>
