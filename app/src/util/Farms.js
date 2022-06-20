import { Coins, MsgExecuteContract } from '@terra-money/terra.js'
import store from '@/store'
class Farms {
  getUstTerraDepositData (amount, type = 'deposit') {
    let data = null
    if (type === 'deposit') {
      let params = { uusd: amount * 10 ** 6 }
      const execute_msg = { deposit_stable: { } }
      data = new MsgExecuteContract(
        store.state.investment.defaultAccount.key,
        'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s',
        execute_msg,
        new Coins(params)
      )
    } else if (type === 'withdraw') {
      data = {
        send: {
          msg: '',
          amount: parseInt((amount * (10 ** 6))).toString(),
          contract: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s'
        }
      }
      data.send.msg = Buffer.from(JSON.stringify({ redeem_stable: {} }),
        'utf8'
      ).toString('base64')

      data = new MsgExecuteContract(
        store.state.investment.defaultAccount.key,
        'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu',
        data
      )
    }
    return data
  }
}
window.Farms = new Farms()
export default window.Farms
