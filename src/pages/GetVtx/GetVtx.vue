<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card class="q-pa-sm" style='' flat>
      <q-card-section class="text-weight-bold text-white text-center">
        <div class="float-center text-uppercase">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('getvtx/claimvtx')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium">{{ $t('GetVtx.getvtx') }} {{ nativeChainName }}</big>
          <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('summary-vtx')"/>
        </div>
      </q-card-section>
      <q-card-section class="text-left text-white text-black">
        <div class="full-width row gutter bg-white q-pa-lg" v-if="!doneCountdown">
          <div class="col-auto">
            <qrcode :value="nativeChainAddress" :options="{size: 140}" class="q-mt-sm"></qrcode>
          </div>
          <div class="col text-left q-pa-sm">
            <q-list no-border>
              <q-item>
                <q-item-label class="text-bold">
                  <span style="text-transform: capitalize;">{{ nativeChainName }}</span> {{ $t('GetVtx.native_chain_address') }}
                </q-item-label>
              </q-item>
              <q-item>
                <q-item-label v-bind:label="nativeChainAddress" />
              </q-item>
              <q-item>
                <q-item-label class="row justify-between">
                  <div class="col">
                    <countdown :time="timeremaining" :transform="transform" class="text-h5">
                      <template slot-scope="props">
                        <div v-bind:class="{ oneminuteleft: underOneMinuteLeftInTimer, overoneminuteleft: !underOneMinuteLeftInTimer }">
                          <span v-if="!underOneMinuteLeftInTimer">{{ props.minutes }}:</span>
                          {{ props.seconds }}
                        </div>
                      </template>
                    </countdown>
                  </div>
                  <div class="col text-right">
                    <q-btn icon-right="file_copy" color="primary" @click="copyAddress(nativeChainAddress)" label="Copy" />
                  </div>
                </q-item-label>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="row gutter round-borders bg-primary justify-stretch content-center q-pa-lg" v-if="doneCountdown">
          <div class="col-12 text-center text-white q-pa-sm text-h1">
            <q-icon name="av_timer" size="8rem" />
            Times Up
          </div>
          <div class="">
            <q-btn outline @click="$router.push({path: 'pending-transactions'})">Get VTX History</q-btn>
          </div>
        </div>
        <div class="full-width bg-black text-white q-pa-lg text-center" v-if="!doneCountdown">
          <div class="float-center">
            <q-btn outline glossy @click="$router.push({path: 'pending-transactions'})">View Get VTX History</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
</q-page>
</template>

<script>
import countdown from '@chenfengyuan/vue-countdown'
import qrcode from '@chenfengyuan/vue-qrcode'

export default {
  // name: 'Get VTX',
  data () {
    return {
      nativeChainAddress: null,
      validUntil: null,
      nativeChainName: null,
      timeremaining: 0,
      underOneMinuteLeftInTimer: false,
      doneCountdown: false,
      isCardModalActive: false
    }
  },
  components: {
    countdown,
    qrcode
  },
  created () {
    this.nativeChainAddress = this.$route.query.native_chain_address
    this.validUntil = this.$route.query.valid_until
    this.nativeChainName = this.$route.query.native_chain_name
    const serverTime = this.$route.query.server_time
    const potentialTimeRemaining = Date.parse(this.validUntil) - Date.parse(serverTime)
    if (potentialTimeRemaining > 0) {
      this.timeremaining = potentialTimeRemaining
    }
  },
  methods: {
    copyAddress (address) {
      this.$clipboardWrite(address)
      this.$q.notify({ color: 'positive', message: this.$t('DisplayKey.copied') })
    },
    getCryptoLogoUrl (chainName) {
      return require('../../assets/img/currencies/' + chainName + '.png')
    },
    transform (props) {
      Object.entries(props).forEach(([key, value]) => {
        let digits = value < 10 ? `0${value}` : value
        if (key === 'totalMinutes' && value <= 0) {
          this.underOneMinuteLeftInTimer = true
        } else if (key === 'totalSeconds' && value <= 0) {
          this.doneCountdown = true
        }
        props[key] = `${digits}`
      })

      return props
    }
  }
}
</script>

<style>
</style>
