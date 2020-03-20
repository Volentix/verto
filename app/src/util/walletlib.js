import EosWrapper from '@/util/EosWrapper'

class Lib {
  Wallet = async (walletType, key, token) => {
    const balance = {
      async eos (key, token) {
        let float = 0
        const tokenContract = {
          eos: 'eosio.token',
          vtx: 'volentixgsys'
        }
        const EOS = new EosWrapper()
        const bal = await EOS.getCurrencyBalanceP(key, tokenContract[token])
        console.log('walletlib', key, tokenContract[token], bal)
        if (bal) {
          float = bal[0].split(' ')[0]
        }

        return { balance: float }
      }
    }[walletType]

    return balance ? balance(key, token) : {}
  }
}
window.Lib = new Lib()
export default window.Lib
