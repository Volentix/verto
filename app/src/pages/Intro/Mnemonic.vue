<template>
  <q-page padding>
    <q-input dark filled v-model="mnemonic" label="Mnemonic"/>
    <q-input dark filled v-model="myBTCAddress" label="BTC"/>
    <q-input dark filled v-model="myETHAddress" label="ETH"/>
    <q-input dark filled v-model="myEOSAddress" label="EOS"/>
  </q-page>
</template>

<script>
const bip39 = require('bip39')
const hdkey = require('hdkey')
// const wif = require('wif')
// const ecc = require('eosjs-ecc')

export default {
  data () {
    return {
      mnemonic: this.$store.state.settings.mnemonic,
      master: null,
      myWallet: null,
      myBTCAddress: null,
      myETHAddress: null,
      myEOSAddress: null
    }
  },
  async created () {
  },
  async mounted () {
    if (!this.mnemonic) {
      this.mnemonic = bip39.generateMnemonic(256)
      this.$store.dispatch('settings/mnemonic', this.mnemonic)
      this.$q.notify({ message: `New Mnemonic Seed Created`, color: 'positive' })
    }

    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(this.mnemonic))

    const btcPath = "m/44'/0'/0'/0/0"
    const btcWallet = hdwallet.derive(btcPath).getWallet()
    this.myBTCAddress = btcWallet.getAddress().toString('hex')

    const ethPath = "m/44'/60'/0'/0/0"
    const ethWallet = hdwallet.derive(ethPath).getWallet()
    this.myETHAddress = `0x${ethWallet.getAddress().toString('hex')}`

    const eosPath = "m/44'/194'/0'/0/0"
    const eosWallet = hdwallet.derive(eosPath).getWallet()
    this.myEOSAddress = eosWallet.getAddress().toString('hex')

    // console.log('seed, master, btc, eos', seed, master, btc, eos)
    // this.myBTCAddress = ecc.PublicKey(btc._publicKey).toString()
    // this.myEOSAddress = ecc.PublicKey(eos._publicKey).toString()

    // console.log('publicKey: ' + ecc.PublicKey(btc._publicKey).toString())
    // console.log('privateKey: ' + wif.encode(128, btc._privateKey, false))
  },
  computed: {
  },
  methods: {
    async getAssets () {
    }
  }
}
</script>
