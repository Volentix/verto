<template>
  <div class="row flex">
         <MetamaskConnect  v-show="$refs.metamask && $refs.metamask.user && $refs.metamask.user.address" ref="metamask" class="justify-end col" />
    <div class="col-md-6 offset-md-3">
      <div class="text-h5">Connect to HeartDefi</div>
      <q-card flat>
        <q-card-section
          class="q-pt-none row text-center"
          style="max-width: 500px"
        >
          <div class="text-h6 q-py-md" v-if="!user.address">
            Select a wallet to connect
          </div>
          <div class="text-h6 text-center text-green" v-else>
            You are connected
          </div>

          <div
            class="col-md-12 q-mb-md col-12"
            v-if="!user.address || user.wallet == 'walletconnect'"
          >
            <q-btn
              size="lg"
              :disable="user.address !== null"
              :loading="connectLoading && user.wallet == 'walletconnect'"
              @click="connect('walletconnect')"
              :color="!user.address ? 'indigo' : 'green'"
              outline
              icon="img:https://pbs.twimg.com/profile_images/998895674522353665/mQFAbUOX.jpg"
              class="full-width text-bold"
              :label="!user.address ? 'Walletconnect' : 'Connected'"
            />
          </div>
          <div v-if="$q.screen.gt.sm" class="col-md-12 col-12">
            <q-btn
              size="lg"
              :disable="user.address !== null"
              :loading="connectLoading && user.wallet == 'metamask'"
              color="brown-6"
              v-if="!user.address || user.wallet == 'metamask'"
              outline
              icon="img:https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-svg-vector.svg"
              class="full-width text-bold"
              :label="!user.address ? 'Metamask' : 'Connected'"
              @click="connect('metamask')"
            />
          </div>
          <div class="col-md-12 col-12">
            <q-btn
              label="continue"
              v-close-popup
              v-if="user.address"
              class="full-width"
              flat
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 q-pb-sm" v-if="!user.address">
            Or enter an Ethereum address
          </div>
          <q-input
            class="full-width"
            size="lg"
            label="0xxxxxxxxxxxxxxxxxxxxx"
            v-model="address"
          >
            <template v-slot:after>
              <q-btn
              @click="connect('address', {address:address})"
                rounded
                color="black"
                outline
                class="q-pa-sm"
                icon-right="send"
                label="Go"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>

import Formatter from '../../mixins/Formatter'
import Connect from '../../mixins/Connect'
import MetamaskConnect from '../../components/Moralis/MetamaskConnect'
export default {
  mixins: [Formatter, Connect],
  components: {
    MetamaskConnect
  },
  data () {
    return {
      address: null
    }
  },

  created () {

  }
}
</script>
<style scoped>
.text-h5 {
  font-family: "Poppins-Medium";
}
</style>
