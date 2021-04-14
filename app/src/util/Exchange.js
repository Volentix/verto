import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
import { JsonRpc } from 'eosjs'
import store from '@/store'

let rpc = new JsonRpc(
    process.env[store.state.settings.network].CACHE +
      'https://eos.greymass.com:443'
  )

class Exchange {

    constructor (chain) {

     this.pairs = []
     this.chain = chain
       
    }
     getMarket(){

    let market = {
        eos(){
            this.pairs = (
                await rpc.get_table_rows({
                  json: true,
                  code: 'swap.defi',
                  scope: 'swap.defi',
                  table: 'pairs',
                  limit: -1
                })
              ).rows
        }
    }
    return market[this.chain]
}

}