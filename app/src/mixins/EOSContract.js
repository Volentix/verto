import {
  Api,
  JsonRpc
} from 'eosjs'
import {
  JsSignatureProvider
} from 'eosjs/dist/eosjs-jssig'
let rpc, api, signatureProvider
import initWallet from '@/util/_Wallets2Tokens'
export default {
  components: {},
  data () {
    return {
      invalidImages: ['lwt', 'gsca', 'osds', 'fco', 'dgb', 'adl', 'eot', 'corona', 'qba', 'ufjiog', 'usdd', 'wax', 'candy', 'ccb', 'eccb', 'cr', 'ilink', 'dgc', 'ech', 'ec', 'nfx', 'cat', 'ccc', 'cfd', 'tip', 'jzb', 'tlbc', 'vac', 'epg', 'eros', 'zmp', 'finteh', 'fish', 'tadpole', 'egg', 'lord', 'tao', 'bless', 'gscb', 'shc', 'zb', 'hbb', 'snyt', 'jcb', 'post', 'orc', 'btcn', 'xo', 'lfee', 'ndead', 'boxaq', 'boxgl', 'boxl', 'boxra', 'boxtm', 'mortys', 'slt', 'nbl', 'banana', 'bmy', 'bte', 'cgc', 'dfz', 'dw', 'go', 'gsh', 'hns', 'otu', 'pkey', 'tiip', 'safe', 'sapex', 'eet', 'sars', 'free', 'gone', 'sugara', 'sugar', 'tankk', 'nnn', 'banking', 'yup', 'ct', 'moon', 'libra', 'cad', 'usd', 'wal', 'xyb', 'hoho', 'yao', 'ydao', 'yfiii', 'ljf', 'bk', 'znl']

    }
  },
  async created () {
    rpc = new JsonRpc(process.env[this.$store.state.settings.network].CACHE + 'https://eos.greymass.com:443')
  },
  methods: {

    getEOSTokenImageUrl (symbol, contract) {
      return this.invalidImages.find(o => o === symbol.toLowerCase()) ? 'https://dbds.340wan.com/static/img/eos.png' : 'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/' + contract + '-' + symbol.toLowerCase() + '.png'
    },
    async sendTransaction (transactionObject, externalRpc = null, header = null, step = null) {
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
      let value = await api.transact(transactionObject, transactionHeader).then((result) => {
        this.transactionStatus = 'Success'
        this.spinnervisible = false
        this.transactionHash = result.transaction_id
        if (step) this.step = step
      }).catch((error) => {
        if (error.toString().includes('is greater than the maximum billable CPU time for the transaction') || error.toString().includes('the current CPU usage limit imposed on the transaction')) {
          this.sendFreeCPUTransaction(transactionObject.actions, this.eosAccount).then((result) => {
            this.transactionStatus = 'Success'
            this.spinnervisible = false
            this.transactionHash = result.hash
            if (step) this.step = step
          }).catch((error) => {
            this.error = error
            this.transactionStatus = null
            this.spinnervisible = false
          })
        } else {
          this.error = error
          this.transactionStatus = null
          this.spinnervisible = false
        }
      })

      return value
    },
    async sendFreeCPUTransaction (actions, account = false, step = 2) {
      let rpc = new JsonRpc(process.env[this.$store.state.settings.network].CACHE + 'https://eos.greymass.com:443')

      let signatureProvider = new JsSignatureProvider([account ? account.privateKey : this.eosAccount.privateKey])
      let eosApi = new Api({
        rpc,
        signatureProvider
      })

      const transactionHeader = {
        blocksBehind: 3,
        expireSeconds: 60
      }
      const tx = {
        actions
      }

      let pushTransactionArgs, serverTransactionPushArgs
      try {
        serverTransactionPushArgs = await this.serverSign(tx, account ? account.name : this.eosAccount.name, transactionHeader)
      } catch (error) {
        console.error(`Error when requesting server signature: `, error.message)
      }

      if (serverTransactionPushArgs) {
        await eosApi.transact(tx, {
          ...transactionHeader,
          sign: false,
          broadcast: false
        })

        // fake requiredKeys to only be user's keys
        const requiredKeys = await eosApi.signatureProvider.getAvailableKeys()

        // must use server tx here because blocksBehind header might lead to different TAPOS tx header
        const serializedTx = serverTransactionPushArgs.serializedTransaction

        const signArgs = {
          chainId: eosApi.chainId,
          requiredKeys,
          serializedTransaction: serializedTx,
          abis: []
        }

        pushTransactionArgs = await eosApi.signatureProvider.sign(signArgs)

        // add server signature
        pushTransactionArgs.signatures.unshift(
          serverTransactionPushArgs.signatures[0]
        )
      } else {
      // no server response => sign original tx
        pushTransactionArgs = await eosApi.transact(tx, {
          ...transactionHeader,
          sign: true,
          broadcast: false
        })
      }
      return new Promise(async (resolve, reject) => {
        eosApi.pushSignedTransaction(pushTransactionArgs).then((result) => {
          this.transactionStatus = 'Success'
          if (step) { this.step = step }
          this.spinnervisible = false
          this.transactionHash = result.transaction_id
          resolve({
            message: process.env[this.$store.state.settings.network].EOS_TRANSACTION_EXPLORER + result.transaction_id,
            success: true,
            status: 'complete',
            hash: result.transaction_id
          })
          initWallet()
        }).catch((error) => {
          if (step) { this.step = 1 }
          this.error = error
          this.transactionStatus = null
          this.spinnervisible = false
          reject({
            message: error,
            success: false
          })
        })
      })
    },
    async serverSign (transaction, user, txHeaders) {
      let serverEndpoint = 'https://cpu.volentix.io/api/eos/sign'
      let config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
      try {
        const rawResponse = await this.$axios.post(serverEndpoint, JSON.stringify({
          tx: transaction,
          user,
          txHeaders
        }), config)

        const content = rawResponse.data
        if (content.error) {
        // show error to User
        }

        const pushTransactionArgs = {
          ...content,
          serializedTransaction: Buffer.from(content.serializedTransaction, `hex`)
        }

        return pushTransactionArgs
      } catch (error) {
        console.log(error, 'Cannot get CoSignature')
      }
    } }

}
