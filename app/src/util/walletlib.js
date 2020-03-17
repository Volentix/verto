import EosWrapper from '@/util/EosWrapper'

class Lib {
  Wallet = async (walletType) => {
    const balance = {
      async eos (account, token) {
        const tokenContract = {
          eos: 'eosio.token',
          vtx: 'volentixgsys'
        }
        const EOS = new EosWrapper()
        const bal = (await EOS.getCurrencyBalanceP(account, tokenContract[token]))[0].split(' ')[0]

        return bal
      }
    }[walletType]

    return balance ? balance() : {}
  }
}
window.Lib = new Lib()
export default window.Lib
