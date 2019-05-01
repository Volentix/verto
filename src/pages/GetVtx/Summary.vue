<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-white text-center text-uppercase">
        <div class="q-pa-sm items-center flex no-wrap justify-between">
          <q-icon class="" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('getvtx/index')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium q-pa-md">VTX TOKEN DISTRIBUTION</big>
          <q-icon class="" name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
        </div>
        <div class="row">
          <span class="col text-center text-uppercase">
            ROUND
            <span class="text-h3">
              &nbsp;{{ data.current_round.number }}
            </span>
            ends in
          </span>
        </div>
        <div class="row q-pa-md">
          <span class="col text-center">
            <div class="text-h4">
              <div class="col-6  text-h3">
                <div class="text-h3">
                  <countdown :time="timeremaining" :transform="transform">
                    <template slot-scope="props">
                      <div>
                        {{ props.days }}:
                        {{ props.hours }}:
                        {{ props.minutes }}:
                        {{ props.seconds }}
                      </div>
                    </template>
                  </countdown>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div class="float-center q-pa-sm" v-show='!venueIsAssociated'>
           <div class="q-pa-md" style='border-style: solid;'>
            <div class="text-h4">
              Venue
            </div>
            <div  class="q-pa-sm">
              Associate this wallet with Venue!
            </div>
            <div class="q-pa-sm">
              <q-btn class=" q-mr-sm" outline color="white" v-close-popup size="md" label="Yes" to="/associations" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="data.current_round" class="text-center text-white">
        <div>
          <div v-if="walletStatus === 'crowdfund_over'" class="text-h2 animate-blink text-red q-pa-sm" style='border-style: solid;'>
            {{ $t('BeginGetVtx.paused') }}
          </div>
          <div v-show="walletStatus != 'crowdfund_over'">
            <div v-show="showGetVTX" class="q-pa-md" style='border-style: solid;'>
              <div class="text-h4">
                Get VTX
              </div>
              <div v-show="walletStatus === 'wallet_not_allocated'">
                <div  class="q-pa-sm">
                  Allocate an address for 15 mins. One address allocation per hour.
                </div>
                <div class="q-pa-sm">
                  <q-btn color="yellow" outline rounded dense style="min-width: 150px;" @click="$router.push({path: 'begin-get-vtx'})">Contribute</q-btn>
                </div>
              </div>
              <div v-show="walletStatus === 'wallet_allocated'">
                <div  class="q-pa-sm">
                  Your temporary address is still available.
                </div>
                <div class="q-pa-sm">
                  <q-btn color="yellow" outline rounded dense style="min-width: 150px;" @click="$router.push({path: 'begin-get-vtx'})">Contribute</q-btn>
                </div>
              </div>
              <div v-show="walletStatus === 'wallet_not_whitelisted'">
                <div  class="q-pa-md text-h6 text-uppercase">
                  {{ $t('BeginGetVtx.not_whitelisted') }}
                </div>
                <div class="col">
                  {{ $t('BeginGetVtx.register_message') }}
                </div>
                <div class="q-mt-md q-mb-md">
                  <q-btn class=" q-mr-sm" outline color="white" v-close-popup size="md" :label="$t('WalletManager.associations')" to="/associations" />
                </div>
              </div>
              <div v-show="walletStatus === 'waiting_for_kyc'">
                <div  class="q-pa-md text-h6 text-uppercase">
                  Awaiting KYC Approval
                </div>
                You will be notified by Blocktopus upon successful completion of the process.
              </div>
              <div v-show="walletStatus === 'purchase_not_allowed'">
                <div  class="q-pa-md text-h6 text-uppercase">
                  Awaiting Investor Approval
                </div>
                You will be notified by Blocktopus upon successful completion of the process.
              </div>
              <!--
              <div v-show="zixipayenabled" class=" q-pa-md">
                <q-btn :disabled="true" color="green" outline rounded dense style="min-width: 150px;" @click="$router.push({path: 'zixipay'})">Zixipay</q-btn>
              </div>
              -->
            </div>
            <div v-if="walletStatus === 'current_phase_not_active'" style='border-style: solid;'>
              <div  class="text-h4">
                Awaiting Phase Activation
              </div>
              <div>
                Please try again soon.
              </div>
            </div>
          </div>
          <div class="row q-pa-lg">
            <span class="col text-center">
              <span class="text-h4 text-yellow">
                {{ data.current_price / 100000000 }}
              </span>
              BTC / VTX
            </span>
          </div>
          <div class="row">
            <div class="col">
            <div>
              <q-linear-progress :value="progress/100" stripe animate dark style="height: 15px" track-color="positive" color="positive"/>
            </div>
            <div class="text-left">
              <span class="float-right">
                {{ data.crowdsale.maximum_allocation }} VTX
              </span>
            </div>
            </div>
          </div>
          <div class="row q-pa-md">
            <div class="col">
              <div>
                <span class="text-h4">
                  {{ data.crowdsale.total_claimed | numFormat }}
                </span>
                CLAIMED
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div>
                <span class="text-h4">
                  {{ data.crowdsale.maximum_allocation - data.crowdsale.total_claimed | numFormat}}
                </span>
                REMAINING
              </div>
            </div>
          </div>
        </div>
        <br>
      </q-card-section>
    </q-card>
    <q-dialog v-model="passwordModal" minimized ref="modalRef">
      <div style="padding: 50px" class="text-center bg-black text-white">
        <div class="text-h4 q-mb-md">Verto Password</div>
        <div class="q-pa-sm">
          <q-field
              dark
              :error="vertoPasswordEmpty"
              v-bind:error-label="$t('Welcome.incorrect')"
              :count="100"
            >
            <q-input dark type="password" v-model="vertopassword" :error="vertoPasswordEmpty" color="blue" v-bind:label="$t('CreateVertoPassword.vertopassword')"  />
            </q-field>
        </div>
        <div class="q-pa-sm">
          <div>
            <q-btn dark color='white' outline @click="removeVenueOption">OK</q-btn>
          </div>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import countdown from '@chenfengyuan/vue-countdown'
import { userError } from '@/util/errorHandler'
import getVtxHelper from '../../util/GetVtxHelper'
import Vue from 'vue'
import numFormat from 'vue-filter-number-format'
import configManager from '../../util/ConfigManager'

Vue.filter('numFormat', numFormat)

export default {
  // name: 'PageName',
  data () {
    return {
      spinnervisible: false,
      progress: 0,
      progressBuffer: 41,
      vertoPasswordEmpty: false,
      passwordModal: false,
      zixipayenabled: false,
      vertopassword: '',
      buffer: 17,
      data: {
        crowdsale: {},
        current_round: {}
      },
      timeremaining: 0,
      walletStatus: '',
      venueIsAssociated: false,
      walletName: '',
      round: 0,
      showGetVTX: false
    }
  },
  components: {
    countdown: countdown
  },
  mounted () {
    if (!this.$store.state.currentwallet.wallet.associations) {
      this.$router.push({ path: 'associations' })
    } else {
      const self = this
      this.walletName = this.$store.state.currentwallet.wallet.name
      this.setUpWalletStatus()
      this.venueIsAssociated = configManager.checkIfAssociatedWithVenue()
      this.$axios.get(process.env[this.$store.state.settings.network].CROWDFUND_URL + '/public/api/summary/').then(function (result) {
        self.data = result.data
        self.calculateValues()
      }).catch(() => {
        userError('There was a problem reaching the server')
      })
    }
  },
  methods: {
    removeVenueOption () {
      const self = this
      this.$configManager.addAssociationToWallet(self.$store.state.currentwallet.wallet.key, this.vertopassword, 'Venue', {})
        .then(function (result) {
          if (result.success) {
            self.venueIsAssociated = configManager.checkIfAssociatedWithVenue()
            self.passwordModal = false
          } else {
            self.vertoPasswordEmpty = true
          }
        }).catch(function (err) {
          if (err) {
            // TODO: Exception handling
          }
          self.vertoPasswordEmpty = true
        })
    },
    async calculateValues () {
      // smaller number by the larger number
      if (this.data.crowdsale.total_claimed <= 0) {
        this.progress = 0
      } else if (this.data.crowdsale.total_claimed >= this.data.crowdsale.maximum_allocation) {
        this.progress = 0
      } else {
        this.progress = ((this.data.crowdsale.total_claimed / this.data.crowdsale.maximum_allocation) * 100)
      }
      this.timeremaining = Date.parse(this.data.current_round.end_date) - Date.now()
    },
    transform (props) {
      Object.entries(props).forEach(([key, value]) => {
        let digits = value < 10 ? `0${value}` : value
        if (key === 'totalSeconds' && value <= 0) {
          this.doneCountdown = true
        }
        props[key] = `${digits}`
      })
      return props
    },
    setUpWalletStatus () {
      const self = this
      getVtxHelper.getWalletStatus(this.$store.state.currentwallet.wallet.key, function (response) {
        let status = response.message
        if (status === 'wallet_not_whitelisted') {
          if (configManager.checkIfAssociatedWithBlocktopus()) {
            status = 'waiting_for_kyc'
          }
        }
        if (configManager.checkIfAssociatedWithZixipay()) {
          self.zixipayenabled = true
        }
        self.walletStatus = status
        self.showGetVTX = false
        if (
          self.zixipayenabled ||
          self.walletStatus === 'wallet_not_allocated' ||
          self.walletStatus === 'wallet_allocated' ||
          self.walletStatus === 'waiting_for_kyc' ||
          self.walletStatus === 'wallet_not_whitelisted' ||
          self.walletStatus === 'purchase_not_allowed'
        ) {
          self.showGetVTX = true
        }
      })
    }
  }
}
</script>
<style scoped>
.infoheader {
  font-size: 10.5em;
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
</style>
