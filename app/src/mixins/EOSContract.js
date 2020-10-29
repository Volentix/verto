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
      invalidImages: ['lwt', 'gsca', 'osds', 'fco', 'dgb', 'adl', 'eot', 'corona', 'qba', 'ufjiog', 'usdd', 'wax', 'candy', 'ccb', 'eccb', 'cr', 'ilink', 'dgc', 'ech', 'ec', 'nfx', 'cat', 'ccc', 'cfd', 'tip', 'jzb', 'tlbc', 'vac', 'epg', 'eros', 'zmp', 'finteh', 'fish', 'tadpole', 'egg', 'lord', 'tao', 'bless', 'gscb', 'shc', 'zb', 'hbb', 'snyt', 'jcb', 'post', 'orc', 'btcn', 'xo', 'lfee', 'ndead', 'boxaq', 'boxgl', 'boxl', 'boxra', 'boxtm', 'mortys', 'slt', 'nbl', 'banana', 'bmy', 'bte', 'cgc', 'dfz', 'dw', 'go', 'gsh', 'hns', 'otu', 'pkey', 'tiip', 'safe', 'sapex', 'eet', 'sars', 'free', 'gone', 'sugara', 'sugar', 'tankk', 'nnn', 'banking', 'yup', 'ct', 'moon', 'libra', 'cad', 'usd', 'wal', 'xyb', 'hoho', 'yao', 'ydao', 'yfiii', 'ljf', 'bk', 'znl'],
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
    getEOSTokenImageUrl (symbol, contract) {
      return this.invalidImages.find(o => o === symbol.toLowerCase()) ? 'https://dbds.340wan.com/static/img/eos.png' : 'https://ndi.340wan.com/eos/' + contract + '-' + symbol.toLowerCase() + '.png'
    },
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
