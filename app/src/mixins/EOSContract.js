import {
  Api,
  JsonRpc
} from 'eosjs'
import {
  JsSignatureProvider
} from 'eosjs/dist/eosjs-jssig'
let rpc, api, signatureProvider
export default {
  components: {},
  data () {
    return {
      transactionStatus: 'Success',
      spinnervisible: false,
      transactionHash: null,
      error: null
    }
  },
  async created () {
    rpc = new JsonRpc(process.env[this.$store.state.settings.network].CACHE + 'https://eos.greymass.com:443')
  },
  methods: {
    async sendTransaction (transactionObject, externalRpc = null, header = null) {
      let transactionHeader = header || {
        blocksBehind: 3,
        expireSeconds: 30
      }
      this.spinnervisible = true
      this.transactionStatus = 'Pending'
      signatureProvider = new JsSignatureProvider([this.eosAccount.privateKey])
      rpc = externalRpc || rpc
      api = new Api({
        rpc,
        signatureProvider
      })
      api.transact(transactionObject, transactionHeader).then((result) => {
        this.transactionStatus = 'Success'
        this.spinnervisible = false
        this.transactionHash = result.transaction_id
      }).catch((error) => {
        this.error = error
        this.transactionStatus = null
        this.spinnervisible = false
      })
    }
  }

}
