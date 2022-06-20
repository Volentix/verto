<template>
  <q-item class="metamask-btn row flex items-center" v-show="false" >
    <q-item-section class="text-body1">
      <q-btn id="connectBtn" :loading="connectLoading" no-caps no-wrap class="address q-pr-sm" :class="user.address ? 'bg-green-1' : 'bg-red-1'"  @click="connectOptions = true" flat icon="fiber_manual_record" :color="!user.address ? 'red' : 'green'" :label="!user.address ? 'Connect' : user.addressFriendly"></q-btn>
    </q-item-section>

    <q-item-section class="logout" v-if="user.address" >
      <q-btn size="md" id="logoutBtn" outline flat no-caps no-wrap icon="logout" color="green-3" label="Disconnect" @click="logout()" />
    </q-item-section>
    <q-item-section v-show="false" v-if="user.address" class="deposit_button_wrapper">
      <q-btn id="depositBtn" color="black" @click="triggerDeposit()" class="q-pa-sm q-pr-md deposit_button" icon="vertical_align_bottom" no-wrap no-caps label="Deposit"/>

      <q-btn id="whitelistBtn" color="black" @click="triggerDeposit('whitelistRequired')" class="q-pa-sm q-pr-md deposit_button" icon="vertical_align_bottom" no-wrap no-caps label="Deposit"/>

      <q-btn id="withdrawBtn" color="black" @click="action = 'withdraw' ; showDialog = true ; trigger++" class="q-pa-sm q-pr-md deposit_button" icon="vertical_align_bottom" no-wrap no-caps label="Deposit"/>
    </q-item-section>

      <DepositPopup @setDialog="setDialog" :provider="provider" :actionType="action" :EnzymeData="EnzymeData" :key="trigger" v-if="user.address && $route.params.fundID && EnzymeData && showDialog"  :user="user" :fundAddress="$route.params.fundID" />

     <q-dialog  @hide="connectLoading = false" v-model="connectOptions">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center" v-if="!user.address">Select a wallet to connect</div>
           <div class="text-h6 text-center text-green" v-else>You are connected</div>
        </q-card-section>

        <q-card-section class="q-pt-none row text-center" style="max-width:300px">

        <div class="col-md-12 q-mb-md col-12" v-if="!user.address || user.wallet == 'walletconnect'">
         <q-btn id="walletconnectBtn" :disable="user.address !== null" :loading="connectLoading && user.wallet == 'walletconnect'" @click="connect('walletconnect')" :color="!user.address ? 'indigo' : 'green'" outline icon="img:https://pbs.twimg.com/profile_images/998895674522353665/mQFAbUOX.jpg" class="full-width text-bold" :label="!user.address ? 'Walletconnect' : 'Connected'" />
        </div>
        <div v-if="$q.screen.gt.sm" class="col-md-12 col-12">
           <q-btn id="metamaskBtn"  :disable="user.address !== null" :loading="connectLoading && user.wallet == 'metamask'" color="brown-6"  v-if="!user.address || user.wallet == 'metamask'"  outline icon="img:https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-svg-vector.svg" class="full-width text-bold"  :label="!user.address ? 'Metamask' : 'Connected'" @click="connect('metamask')" />
        </div>
        <div class="col-md-12 col-12">
           <q-btn label="continue" v-close-popup  v-if="user.address" class="full-width" flat />
        </div>

        </q-card-section>

      </q-card>
    </q-dialog>
  </q-item>
</template>
<script>

import Formatter from '../../mixins/Formatter'

import Connect from '../../mixins/Connect'
// import parseDb from 'boot/parseDb'
import DepositPopup from '../Staider/Fund/DepositPopup.vue'

export default {
  mixins: [Formatter, Connect],
  components: {
    DepositPopup
  },
  props: ['type'],

  watch: {
    '$route.params.fundID': function (val) {
      if (val) {
        this.setEnzyme()
      }
    }
  },
  async created () {
    this.initConnect()
    this.setEnzyme()
  },
  data () {
    return {
      connectLoading: false,
      showDialog: false,
      action: 'deposit',
      connectOptions: false,
      provider: null,
      EnzymeData: null,
      trigger: 1,
      user: {
        wallet: null,
        avatar: null,
        address: null,
        addressFriendly: null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.metamask-btn {
  display: none  !important;
}
.logout button {
  margin-right: -20px;
    color: #4caf4f !important;
}
  .logout button {
    // color: #4caf4f !important;
    font-family: 'Comfortaa', cursive !important;
  }
  .address{
    font-family: 'Comfortaa', cursive !important;
  }
  .deposit_button_wrapper{
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .deposit_button{
    background: #0054ee !important;
    color: #FFF !important;
    background: linear-gradient(to right, #002044 0%, #0054ee 100%) !important;
    position: absolute;
    right: -165px;
    top: 85px;
    font-family: 'Comfortaa', cursive !important;
  }

</style>
