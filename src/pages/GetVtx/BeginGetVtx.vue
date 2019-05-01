<template>
  <div class="layout-padding">
    <q-dialog v-model="showErrorModal" minimized>
      <div style="max-width: 400px;">
        <q-btn icon="close" class="modal-close-button" dense flat round @click="showErrorModal = false" style="top: 16px;" />
        <div class="q-pa-md">
          <div class="row q-mb-lg q-pr-lg">
            <div class="col text-h5">
              {{modalMessages}}
            </div>
          </div>
          <br>
          <div class="col ">
            {{ $t('BeginGetVtx.approval') }}
          </div>
          <br>
          <div class="col-auto text-center">
            <q-btn outline :label="$t('BeginGetVtx.go_to_wallet')" to="wallet" />
          </div>
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="blocktopusModal" ref="modalRef">
      <q-card class="q-pa-lg">
        <q-icon class="float-right" name="close" size="1.5rem" color="black" @click.native="blocktopusModal = !blocktopusModal"/>
        <q-card-section>
          <div class="text-h5 q-mb-md">{{ $t('BeginGetVtx.not_whitelisted') }}</div>
        </q-card-section>
        <q-separator />
        <br>
        <div class="col ">
          {{ $t('BeginGetVtx.register_message') }}
        </div>
        <br>
        <div class="q-mt-md q-mb-xl">
          <q-btn class="float-center q-mr-sm" color="grey-9" v-close-popup size="md" :label="$t('AssociateView.create')" to="/blocktopusCreate" />
          <q-btn class="float-right" outline color="primary" v-close-popup size="md" :label="$t('AssociateView.login')" to="/blocktopusAssociate" />
        </div>
      </q-card>
    </q-dialog>
    <q-page class="text-center text-white bg-black" v-show="b8sOrZixiModal">
      <div class="flex justify-center">
        <q-list class="no-border">
        <q-card-section class="text-weight-bold text-white text-center text-uppercase">
          Choose Curency
        </q-card-section>
        <q-card style="width: 23rem; border-style: solid;" class="justify-center q-pa-sm q-mb-sm" flat>
          <q-item class="full-width">
            <q-item-section style="padding-right: 20px;" avatar/>
            <q-avatar>
              <img src="statics/img/btc.png"/>
            </q-avatar>
            <div class="verticalLine full-width">
              <q-item-label class="full-width">
                <q-item-tile label>Pay with Bitcoin</q-item-tile>
                <q-item-tile sublabel>Blocktopus KYC</q-item-tile>
              </q-item-label>
            </div>
            <q-icon name="navigate_next" size="3.2rem" color="white" @click.native="$router.push({ name: 'request-native-chain-address' })">
              <q-tooltip>{{ $t('next') }}</q-tooltip>
            </q-icon>
          </q-item>
        </q-card>
        <q-card style="width: 23rem; border-style: solid;" class="justify-center q-pa-sm q-mb-sm" flat>
          <q-item class="full-width">
            <q-item-section style="padding-right: 20px;" avatar/>
            <q-avatar>
              <img src="statics/img/crypto-coins-2.png"/>
            </q-avatar>
            <div class="verticalLine full-width">
              <q-item-label class="full-width">
                <q-item-tile label>Pay with</q-item-tile>
                <q-item-tile sublabel>USD, EURO, GEL, USDT, ETH</q-item-tile>
              </q-item-label>
            </div>
            <q-icon name="navigate_next" size="3.2rem" color="white" @click.native="$router.push({ path: 'zixipay-get-vtx'})">
              <q-tooltip>{{ $t('next') }}</q-tooltip>
            </q-icon>
          </q-item>
        </q-card>
        </q-list>
      </div>
    </q-page>
  </div>
</template>

<script>
import getVtxHelper from '../../util/GetVtxHelper'
import configManager from '../../util/ConfigManager'

export default {
  data () {
    return {
      showErrorModal: false,
      walletNotWhitelisted: false,
      blocktopusModal: false,
      modalMessages: '',
      b8sOrZixiModal: false
    }
  },
  mounted () {
    const that = this
    const router = this.$router
    getVtxHelper.getWalletStatus(this.$store.state.currentwallet.wallet.key, function (response) {
      if (response.success) {
        if (response.message === 'wallet_not_allocated') {
          const associations = {
            blocktopus: configManager.checkIfAssociatedWithBlocktopus(),
            zixipay: configManager.checkIfAssociatedWithZixipay()
          }
          console.log('Associations: b8s: ' + associations.blocktopus + ' zixi: ' + associations.zixipay)
          if (associations.blocktopus && !associations.zixipay) {
            that.$router.push({ path: 'request-native-chain-address' })
          } else if (!associations.blocktopus && associations.zixipay) {
            that.$router.push({ path: 'zixipay-get-vtx' })
          } else {
            that.b8sOrZixiModal = true
          }
          // router.push({ name: 'request-native-chain-address' })
        } else if (response.message === 'wallet_allocated') {
          router.push(
            '/get-vtx?native_chain_address=' + response.data.data.native_chain_address +
            '&valid_until=' + response.data.data.valid_until +
            '&native_chain_name=' + response.data.data.native_chain_name +
            '&server_time=' + response.data.data.server_time
          )
        } else {
          let message = `BeginGetVtx.${response.message}`
          if (that.$t(message) === message) message = 'BeginGetVtx.unexpected_error'

          that.modalMessages = that.$t(message)
          if (response.message === 'wallet_not_whitelisted') {
            that.blocktopusModal = true
          } else {
            that.showErrorModal = true
          }
        }
      } else {
        that.modalMessages = that.$t('BeginGetVtx.unexpected_error')
        that.showErrorModal = true
      }
    })
  },
  methods: {}
}
</script>

<style>
.verticalLine {
  border-left: thin solid #ffffff;
  padding-left: 20px;
}
</style>
