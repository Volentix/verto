<template>
    <q-card class="q-pa-lg modal-dialog-wrapper" style="width: 800px; max-width: 90vw;">
        <q-toolbar>
            <q-toolbar-title><span class="text-weight-bold q-pl-sm">Add Liquidity</span></q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6" v-if="!transactionSent">
            <div v-if="currentToken.label" class="text-h6 q-mb-md q-pl-sm flex items-center">
              <h4 class="lab-title q-pr-md">Available {{currentToken.label}}:</h4> {{ currentToken.amount}}
              <span class="link-to-exchange" @click="goToExchange" v-if="!tokenInWallet && false">Get {{currentToken.label}}</span>
            </div>
            <div class="row">
            <div class="col col-3">
                <!-- <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" /> -->
                <q-input @input="validateInput() ; error = null"  v-model="sendAmount" filled rounded outlined class="input-input" color="purple" type="number">
                  <template v-slot:append>
                    <div class="flex justify-end items-center q-pb-xs">
                      <q-btn color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
                    </div>
                  </template>
                </q-input>
            </div>
            <div class="col col-3 q-ml-md">
                <q-select class="select-input"  @input="getMaxBalance() ; error = null" filled rounded outlined  color="purple" v-model="currentToken" :options="tokenOptions" />
           <div class="text-body2 col-12 q-pt-sm text-red" v-if="!tokenInWallet && false">
              Token not in wallet
            </div>
           </div>

            </div>
            <hr style="opacity: .1" class="q-mt-lg">
            <h4 class="lab-title">Choose your Allocation</h4>
            <div class="row">
            <div class="col col-4 q-pr-md">
                <strong class="lab-sub q-pl-md">Platform</strong>
                <q-select class="select-input full-width" filled v-model="platform" color="purple" @input="filterPoolsByPlatform() ; error = null"   :options="['Any','Uniswap V2','Balancer-labs','yEarn','Curve']" />
            </div>
            <div class="col col-4 q-pr-md">
                <strong class="lab-sub q-pl-md">Pool</strong>
                <q-select class="select-input full-width"  @filter="filterPoolsByUserInput"   input-debounce="0" use-input filled @input="$store.commit('investment/setSelectedPool', pool);error = null " v-model="pool" color="purple"  :options="poolOptions" >
                   <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

            </div>
            <!-- <div class="col col-3 q-pr-md text-center">
                <strong class="lab-sub q-pl-md text-center">Allocation</strong>
                <div class="lab-value flex flex-center text-center q-pl-lg q-pr-sm">90 % RPL 10% WETH</div>
            </div> -->
            <div v-if="pool === 'DAI/ETH'" class="col col-4 q-pl-md">
                <strong class="lab-sub q-pl-lg">Approx. Pool Output</strong>
                <div class="lab-value output column q-pl-lg q-pr-sm">
                  <span class="flex flex-start q-mb-sm"><img src="https://zapper.fi/images/ETH-icon.png" class="q-mr-sm" alt=""> 1.4922 ETH</span>
                  <span class="flex flex-start"><img src="https://zapper.fi/images/DAI-icon.png" class="q-mr-sm" alt=""> 703.0724 DAI</span>
                </div>
            </div>
             <div class="col-md-6 q-pt-md" v-if="gasOptions">
                 <strong class="lab-sub q-pl-md">Gas Price</strong>
                 <q-select class="select-input full-width"  filled v-model="gasSelected" color="purple"  :options="gasOptions" >
                   <template v-slot:option="scope">
                    <q-item
                      v-bind="scope.itemProps"
                      v-on="scope.itemEvents"
                    >
                     <q-item-section>
                        <q-item-label v-html="scope.opt.label" />
                        <q-item-label caption>{{ scope.opt.value }} USD</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                   <template v-if="gasOptions" v-slot:selected>
                  <q-item >
                    <q-item-section>
                      <q-item-label class="full-width no-margin" v-html="gasSelected.label+' - '+gasSelected.value+' USD'" />
                    </q-item-section>
                  </q-item>
                  <q-item >
                  </q-item>
                </template>
                </q-select>
              
              </div>
              <div class="col-md-12 q-mt-sm">
               <q-checkbox v-model="processWithMetamask"  label="Use Metamask" />
              </div>
               
              <div class="text-red q-mt-md" v-if="error">{{error}}</div>
            </div>
            <!-- <hr style="opacity: .1" class="q-mt-lg">
            <h4 class="lab-title q-pb-md">Select Gas Setting</h4>
            <div class="row">
              <div class="col col-4">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
              <div class="col col-4 q-pl-md q-pr-md">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
              <div class="col col-4">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
            </div> -->
        </q-card-section>
         <q-card-section class="text-h6" v-else>
            <div class="row">
            <div class="col-12 col-md-12 text-left text-h7">
               Transaction sent
            </div>
            <div class="col-12 col-md-12 text-center text-h6">
               <q-input filled v-model="transactionSent" hint="Readonly"  label="Your transaction hash" readonly />
            </div>
             <div class="col-12 col-md-12 text-left text-h7 etherscan">
              <a :href="'https://etherscan.io/tx/'+transactionSent" target="_black">View in Etherscan <q-icon name="visibility"></q-icon></a>
            </div>
             </div>
        
         </q-card-section>
        <q-card-actions align="right" class="q-pr-sm q-mb-sm q-mt-xl" v-if="!transactionSent">
            <q-btn label="Cancel" flat class="qbtn-start q-mr-sm cancel" color="black" v-close-popup/>
            <q-btn unelevated  class="qbtn-start" :disable="sendAmount == 0" color="black" text-color="white" label="Confirm" @click="doTransaction()" />
        </q-card-actions>
    </q-card>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  name: 'AddLiquidityDialog',
  data () {
    return {
      platform: '',
      gasOptions: null,
      transactionSent:null,
      gasSelected: null,
      pool: '',
      error: null,
      sendAmount: 0,
      poolOptions: [],
      tokenOptions: [],
      currentToken: '',
      platform: 'Any',
      ethTokens: [],
      ethAccount: null,
      availableAmount: 0,
      tokenInWallet: false,
      processWithMetamask:false,
      web3: null,
      contractAddress: {
        uniswapv2: '0x80c5e6908368cb9db503ba968d7ec5a565bfb389',
        uniswapv1: '0x5e6531d99e9099cb3936c048daf6ba0b3f79b9e2',
        balancerlabs: '0xA3128cC400E2878571368ae0a83F588Eb838552b',
        curve: '0x5A4972b19De19F6117E02aeB54e37E9e6cEe3187',
        yearn: '0x9c57618bfCDfaE4cE8e49226Ca22A7837DE64A2d'

      }
    }
  },
  props: ['notWidget'],
  updated () {},
  async created () {
    let tableData = await this.$store.state.wallets.tokens
    this.ethAccount = tableData.filter(w => w.chain === 'eth')
      .filter(w => this.$store.state.investment.zapperTokens.find(o => o.symbol.toLowerCase() == w.type.toLowerCase()))

    if (!this.notWidget) {
      await this.$store.dispatch('investment/getZapperTokens')
    } else {
      this.setDialogData()
    }
    const options = {
      transactionConfirmationBlocks: 1
    };
    const Web3 = require('web3')
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63'))
    
    let t = this.web3.eth.getTransaction('0x51c32feefe4bcfac06b19364e07b7f261138e1760da96a827d6c0954dcb47059')
    console.log(t,'t ')
    this.$store.dispatch('investment/getGasPrice')
  },
  computed: {
    ...mapState('investment', ['zapperTokens', 'selectedPool', 'gasPrice'])
  },
  watch: {
    zapperTokens (newVal, old) {
      if (!newVal.length) return

      this.$store.dispatch('investment/getBalancerPools')
      this.$store.dispatch('investment/getUniswapPools')
      this.$store.dispatch('investment/getYvaultsPools')
      this.$store.dispatch('investment/getCurvesPools')
      this.$store.commit('investment/setSelectedPool', this.$store.state.investment.pools[0])
      this.setDialogData()
    },
    gasPrice (newVal, old) {
      if (newVal) {
        this.getGas()
      }
    }

  },
  methods: {
    setDialogData () {
      if (this.$store.state.investment.selectedPool) {
        this.tokenOptions = this.ethAccount.map(o => {
          o.label = o.type.toUpperCase()
          o.value = o.contract
          return o
        })
        console.log(this.ethAccount)
        this.currentToken = this.tokenOptions[0]
        this.getTokenAvailableAmount()
        this.poolOptions = this.$store.state.investment.pools.map(o => {
          return {
            label: o.poolName,
            value: o.id,
            tokens: o.tokens
          }
        })
        this.pool = this.$store.state.investment.selectedPool
        this.isTokenInWallet()
      }
    },
    async doERC20ToCurveTransaction () {
      const web3 = new Web3(provider.wallet.provider)
      const address = provider.address
      const curveCurvePipeAddress = '0x66895417881B1d77Ca71bd9e5Ba1E729f3Aa44D3'
      const curveCurvePipeContract = new web3.eth.Contract(curveCurvePipeABI, curveCurvePipeAddress)
      const crvTokenContract = new web3.eth.Contract(ERC20ABI, fromCurveTokenAddress)
      const valueToSend = (5 * 10 ** 18).toFixed(0)
      const tx = await curveCurvePipeContract.methods.Curve2Curve(
        address,
        'a5407eae9ba41422680e2e00537571bcc53efbfd', // sUSD curve pool
        valueToSend,
        'bbc81d23ea2c3ec7e56d39296f0cbb648873a5d3' // y Curve pool
      )
      const allowance = await getAllowance(web3, fromCurveTokenAddress, address, curveCurvePipeAddress)
      if (allowance < value) {
        const approvalAmount = '100000000000000000000'
        let approveTx = await crvTokenContract.methods.approve(
          curveCurvePipeAddress,
          web3.utils.toWei(approvalAmount, 'ether')
        )
        approveTx
          .send({
            from: address,
            gasPrice
          })
          .on('transactionHash', async (txHash) => {
            await sendTransaction(address, 0, tx, gasPrice, 2000000) // Rely on nonce for tx ordering to avoid waiting for approval to confirm
          })
      } else await sendTransaction(address, 0, tx, gasPrice) // Contract already has approval, gas estimates will not fail
    },
    async doErc20Transaction (transactionObject) {
      let tableData = await this.$store.state.wallets.tokens
      let account = tableData.find(w => w.chain === 'eth' && w.defaultKey == true)
      if (!account) return console.log('NO ETH ACCOUNT')
      let tokenAddress = this.currentToken.contract
      transactionObject.from = account.key
      console.log(transactionObject, this.currentToken)
      let decimals = this.web3.utils.toBN(18)
      let value = (this.sendAmount * 10 ** 18).toFixed(0)
      let minABI = [{
        'constant': false,
        'inputs': [{
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_value',
          'type': 'uint256'
        }
        ],
        'name': 'transfer',
        'outputs': [{
          'name': '',
          'type': 'bool'
        }],
        'type': 'function'
      }]

      let tokenABI = [{
        'inputs': [{
          'internalType': 'address[]',
          'name': '_components',
          'type': 'address[]'
        }, {
          'internalType': 'int256[]',
          'name': '_units',
          'type': 'int256[]'
        }, {
          'internalType': 'address[]',
          'name': '_modules',
          'type': 'address[]'
        }, {
          'internalType': 'contract IController',
          'name': '_controller',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_manager',
          'type': 'address'
        }, {
          'internalType': 'string',
          'name': '_name',
          'type': 'string'
        }, {
          'internalType': 'string',
          'name': '_symbol',
          'type': 'string'
        }],
        'stateMutability': 'nonpayable',
        'type': 'constructor'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': 'owner',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'value',
          'type': 'uint256'
        }],
        'name': 'Approval',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'ComponentAdded',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'ComponentRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'DefaultPositionUnitEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }],
        'name': 'ExternalPositionDataEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'ExternalPositionUnitEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_target',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'uint256',
          'name': '_value',
          'type': 'uint256'
        }, {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }, {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_returnValue',
          'type': 'bytes'
        }],
        'name': 'Invoked',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': false,
          'internalType': 'address',
          'name': '_newManager',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'address',
          'name': '_oldManager',
          'type': 'address'
        }],
        'name': 'ManagerEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'ModuleAdded',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'ModuleInitialized',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'ModuleRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'PendingModuleRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'PositionModuleAdded',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'PositionModuleRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': false,
          'internalType': 'int256',
          'name': '_newMultiplier',
          'type': 'int256'
        }],
        'name': 'PositionMultiplierEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': 'from',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': 'to',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'value',
          'type': 'uint256'
        }],
        'name': 'Transfer',
        'type': 'event'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'addComponent',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'addExternalPositionModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'addModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'owner',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }],
        'name': 'allowance',
        'outputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }],
        'name': 'approve',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }],
        'name': 'balanceOf',
        'outputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_account',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': '_quantity',
          'type': 'uint256'
        }],
        'name': 'burn',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'name': 'components',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'controller',
        'outputs': [{
          'internalType': 'contract IController',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'decimals',
        'outputs': [{
          'internalType': 'uint8',
          'name': '',
          'type': 'uint8'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'subtractedValue',
          'type': 'uint256'
        }],
        'name': 'decreaseAllowance',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'editDefaultPositionUnit',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }],
        'name': 'editExternalPositionData',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'editExternalPositionUnit',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'int256',
          'name': '_newMultiplier',
          'type': 'int256'
        }],
        'name': 'editPositionMultiplier',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'getComponents',
        'outputs': [{
          'internalType': 'address[]',
          'name': '',
          'type': 'address[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'getDefaultPositionRealUnit',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'getExternalPositionData',
        'outputs': [{
          'internalType': 'bytes',
          'name': '',
          'type': 'bytes'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'getExternalPositionModules',
        'outputs': [{
          'internalType': 'address[]',
          'name': '',
          'type': 'address[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'getExternalPositionRealUnit',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'getModules',
        'outputs': [{
          'internalType': 'address[]',
          'name': '',
          'type': 'address[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'getPositions',
        'outputs': [{
          'components': [{
            'internalType': 'address',
            'name': 'component',
            'type': 'address'
          }, {
            'internalType': 'address',
            'name': 'module',
            'type': 'address'
          }, {
            'internalType': 'int256',
            'name': 'unit',
            'type': 'int256'
          }, {
            'internalType': 'uint8',
            'name': 'positionState',
            'type': 'uint8'
          }, {
            'internalType': 'bytes',
            'name': 'data',
            'type': 'bytes'
          }],
          'internalType': 'struct ISetToken.Position[]',
          'name': '',
          'type': 'tuple[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'getTotalComponentRealUnits',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'addedValue',
          'type': 'uint256'
        }],
        'name': 'increaseAllowance',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'initializeModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_target',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': '_value',
          'type': 'uint256'
        }, {
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }],
        'name': 'invoke',
        'outputs': [{
          'internalType': 'bytes',
          'name': '_returnValue',
          'type': 'bytes'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'isComponent',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'isExternalPositionModule',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'isInitializedModule',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'isLocked',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'isPendingModule',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'lock',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'locker',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'manager',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_account',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': '_quantity',
          'type': 'uint256'
        }],
        'name': 'mint',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'name': 'moduleStates',
        'outputs': [{
          'internalType': 'enum ISetToken.ModuleState',
          'name': '',
          'type': 'uint8'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'name': 'modules',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'name',
        'outputs': [{
          'internalType': 'string',
          'name': '',
          'type': 'string'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'positionMultiplier',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'removeComponent',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'removeExternalPositionModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'removeModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'removePendingModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_manager',
          'type': 'address'
        }],
        'name': 'setManager',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'symbol',
        'outputs': [{
          'internalType': 'string',
          'name': '',
          'type': 'string'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'recipient',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }],
        'name': 'transfer',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'sender',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': 'recipient',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }],
        'name': 'transferFrom',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'unlock',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'stateMutability': 'payable',
        'type': 'receive'
      }]

      // this.getGas(transactionObject.to, this.sendAmount )
      // Get ERC20 Token contract instance
      /*

       if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed

         let contract = new window.web3.eth.Contract(tokenABI, tokenAddress);
          const self = this
          contract.methods.transfer(transactionObject.to, value).send({
          from: transactionObject.from,
          value:value
        })
        .on('transactionHash', function(hash) {
          console.log(hash, transactionObject);

        }).on('error', function(error, a) {

         self.error = error
        })
      /*
        await web3.eth.sendTransaction(transactionObject).then(function(receipt) {
          console.log(receipt)
        }).catch((error) => {
          this.error = error

        });

      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
         let contract = new window.web3.eth.Contract(tokenABI, tokenAddress);
          const self = this
          contract.methods.transfer(transactionObject.to, value).send({
          from: transactionObject.from,
          value:value
        })
        .on('transactionHash', function(hash) {
          console.log(hash, transactionObject);

        }).on('error', function(error, a) {

         self.error = error
        })
        /*
        await web3.eth.sendTransaction(transactionObject).then(function(receipt) {
          console.log(receipt)
        }).catch((error) => {
          this.error = error

        });

      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

    return
    */
      let contract = new this.web3.eth.Contract(tokenABI, tokenAddress)
      let poolContract = new this.web3.eth.Contract(minABI, transactionObject.to)
      console.log(contract.methods, 'contract.methods')
      const self = this
      contract.methods.transfer(transactionObject.to, value).send({
        from: transactionObject.from,
        value: value
      })
        .on('transactionHash', function (hash) {
          console.log(hash, transactionObject)
        }).on('error', function (error, a) {
          self.error = error
        })
    },
    getGas () {
      let tokenABI = [{
        'inputs': [{
          'internalType': 'address[]',
          'name': '_components',
          'type': 'address[]'
        }, {
          'internalType': 'int256[]',
          'name': '_units',
          'type': 'int256[]'
        }, {
          'internalType': 'address[]',
          'name': '_modules',
          'type': 'address[]'
        }, {
          'internalType': 'contract IController',
          'name': '_controller',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_manager',
          'type': 'address'
        }, {
          'internalType': 'string',
          'name': '_name',
          'type': 'string'
        }, {
          'internalType': 'string',
          'name': '_symbol',
          'type': 'string'
        }],
        'stateMutability': 'nonpayable',
        'type': 'constructor'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': 'owner',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'value',
          'type': 'uint256'
        }],
        'name': 'Approval',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'ComponentAdded',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'ComponentRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'DefaultPositionUnitEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }],
        'name': 'ExternalPositionDataEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'ExternalPositionUnitEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_target',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'uint256',
          'name': '_value',
          'type': 'uint256'
        }, {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }, {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_returnValue',
          'type': 'bytes'
        }],
        'name': 'Invoked',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': false,
          'internalType': 'address',
          'name': '_newManager',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'address',
          'name': '_oldManager',
          'type': 'address'
        }],
        'name': 'ManagerEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'ModuleAdded',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'ModuleInitialized',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'ModuleRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'PendingModuleRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'PositionModuleAdded',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'PositionModuleRemoved',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': false,
          'internalType': 'int256',
          'name': '_newMultiplier',
          'type': 'int256'
        }],
        'name': 'PositionMultiplierEdited',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': true,
          'internalType': 'address',
          'name': 'from',
          'type': 'address'
        }, {
          'indexed': true,
          'internalType': 'address',
          'name': 'to',
          'type': 'address'
        }, {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'value',
          'type': 'uint256'
        }],
        'name': 'Transfer',
        'type': 'event'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'addComponent',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'addExternalPositionModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'addModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'owner',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }],
        'name': 'allowance',
        'outputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }],
        'name': 'approve',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }],
        'name': 'balanceOf',
        'outputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_account',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': '_quantity',
          'type': 'uint256'
        }],
        'name': 'burn',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'name': 'components',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'controller',
        'outputs': [{
          'internalType': 'contract IController',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'decimals',
        'outputs': [{
          'internalType': 'uint8',
          'name': '',
          'type': 'uint8'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'subtractedValue',
          'type': 'uint256'
        }],
        'name': 'decreaseAllowance',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'editDefaultPositionUnit',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }],
        'name': 'editExternalPositionData',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }, {
          'internalType': 'int256',
          'name': '_realUnit',
          'type': 'int256'
        }],
        'name': 'editExternalPositionUnit',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'int256',
          'name': '_newMultiplier',
          'type': 'int256'
        }],
        'name': 'editPositionMultiplier',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'getComponents',
        'outputs': [{
          'internalType': 'address[]',
          'name': '',
          'type': 'address[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'getDefaultPositionRealUnit',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'getExternalPositionData',
        'outputs': [{
          'internalType': 'bytes',
          'name': '',
          'type': 'bytes'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'getExternalPositionModules',
        'outputs': [{
          'internalType': 'address[]',
          'name': '',
          'type': 'address[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'getExternalPositionRealUnit',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'getModules',
        'outputs': [{
          'internalType': 'address[]',
          'name': '',
          'type': 'address[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'getPositions',
        'outputs': [{
          'components': [{
            'internalType': 'address',
            'name': 'component',
            'type': 'address'
          }, {
            'internalType': 'address',
            'name': 'module',
            'type': 'address'
          }, {
            'internalType': 'int256',
            'name': 'unit',
            'type': 'int256'
          }, {
            'internalType': 'uint8',
            'name': 'positionState',
            'type': 'uint8'
          }, {
            'internalType': 'bytes',
            'name': 'data',
            'type': 'bytes'
          }],
          'internalType': 'struct ISetToken.Position[]',
          'name': '',
          'type': 'tuple[]'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'getTotalComponentRealUnits',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'spender',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'addedValue',
          'type': 'uint256'
        }],
        'name': 'increaseAllowance',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'initializeModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_target',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': '_value',
          'type': 'uint256'
        }, {
          'internalType': 'bytes',
          'name': '_data',
          'type': 'bytes'
        }],
        'name': 'invoke',
        'outputs': [{
          'internalType': 'bytes',
          'name': '_returnValue',
          'type': 'bytes'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'isComponent',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'isExternalPositionModule',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'isInitializedModule',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'isLocked',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'isPendingModule',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'lock',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'locker',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'manager',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_account',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': '_quantity',
          'type': 'uint256'
        }],
        'name': 'mint',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'name': 'moduleStates',
        'outputs': [{
          'internalType': 'enum ISetToken.ModuleState',
          'name': '',
          'type': 'uint8'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'name': 'modules',
        'outputs': [{
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'name',
        'outputs': [{
          'internalType': 'string',
          'name': '',
          'type': 'string'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'positionMultiplier',
        'outputs': [{
          'internalType': 'int256',
          'name': '',
          'type': 'int256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }],
        'name': 'removeComponent',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_component',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': '_positionModule',
          'type': 'address'
        }],
        'name': 'removeExternalPositionModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'removeModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_module',
          'type': 'address'
        }],
        'name': 'removePendingModule',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': '_manager',
          'type': 'address'
        }],
        'name': 'setManager',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'symbol',
        'outputs': [{
          'internalType': 'string',
          'name': '',
          'type': 'string'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [{
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }],
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'recipient',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }],
        'name': 'transfer',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [{
          'internalType': 'address',
          'name': 'sender',
          'type': 'address'
        }, {
          'internalType': 'address',
          'name': 'recipient',
          'type': 'address'
        }, {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }],
        'name': 'transferFrom',
        'outputs': [{
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'inputs': [],
        'name': 'unlock',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'stateMutability': 'payable',
        'type': 'receive'
      }]
      self = this
      let contract = new this.web3.eth.Contract(tokenABI, '0x033b186321fa88603e3ecc98821fb0932b2c0760')
      contract.methods.transfer('0x80c5e6908368cb9db503ba968d7ec5a565bfb389', (this.sendAmount * 10 ** 18).toFixed(0)).estimateGas(function (error, gasAmount) {
        self.gasOptions = [{
          label: 'Slow',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.slow, gasAmount),
          gasPrice:  self.$store.state.investment.gasPrice.slow *  1000000000,
          gas:gasAmount
        },
        {
          label: 'Fast',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.fast, gasAmount),
         gasPrice:   self.$store.state.investment.gasPrice.fast *  1000000000,
          gas:gasAmount
        },
        {
          label: 'Instant',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.instant, gasAmount),
          gasPrice:  self.$store.state.investment.gasPrice.instant *  1000000000,
          gas:gasAmount
        }
        ]
        self.gasSelected = {
          label: 'Standard',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.standard, gasAmount),
          gasPrice:   self.$store.state.investment.gasPrice.standard *  1000000000,
          gas:gasAmount
        }
        console.log(self.gasOptions, 'gasOptions', self.gasSelected, 'gasSelected')
      })
    },
    getUSDGasPrice (gweiPrice, gasNumber) {
       let ethToUsd = this.$store.state.investment.marketData.find(o => o.symbol.toLowerCase() == 'eth').current_price

      return this.web3.utils.fromWei(Math.round((gweiPrice * gasNumber * 1000000000)).toString(), 'ether') * ethToUsd
    },
    async doTransaction () {
      const EthereumTx = require('ethereumjs-tx').Transaction
      console.log(this.pool)
     
      let poolData = this.$store.state.investment.pools.find(v => v.contractAddress == this.pool.value)
         console.log(this.pool, poolData)
      let toAddress = this.contractAddress[poolData.platform.replace(/[^0-9a-z]/gi, '').toLowerCase()]
      if (!toAddress) console.log('toAddress not found')
      let nonce = await this.web3.eth.getTransactionCount(this.currentToken.key) + 1
   
      let transactionObject = {
        from:this.currentToken.key,
        to: toAddress,
        gas:this.gasSelected.gas,
        value: this.sendAmount * 1000000000000000000 ,
        gasPrice: this.gasSelected.gasPrice,
        nonce:nonce,
        chain:1

      }
      if (this.currentToken.type.toLowerCase() != 'eth') return this.doErc20Transaction(transactionObject)

      if(this.processWithMetamask){
        
        transactionObject.from = null
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)

        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        await web3.eth.sendTransaction(transactionObject).then(function (receipt) {
          console.log(receipt)
        }).catch((error) => {
          this.error = error
        })
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        await web3.eth.sendTransaction(transactionObject).then(function (receipt) {
          console.log(receipt)
        }).catch((error) => {
          this.error = error
        })
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
      return
      }
      if (this.currentToken.type.toLowerCase() != 'eth') return this.doErc20Transaction(transactionObject)
    
    
     
      console.log(transactionObject,this.gasSelected)
     
      const transaction = new EthereumTx(transactionObject)
     
       transaction.sign(Buffer.from(this.currentToken.privateKey.substring(2), 'hex'))
       const serializedTransaction = transaction.serialize()
 /*
         let p =  new Promise(async (resolve, reject) => {
            this.web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
              if (err) {
                // console.log(err)
                return reject()
              }
              resolve({
                message: `https://etherscan.io/tx/${id}`,
                success: true
              })
            })
          })

    console.log(p)
 */
   
            this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'),(err, hash) => {
                    if (!err) {
                           this.transactionSent = hash; 
                           console.log(hash)
                     } else {
                            this.error = err
                      }
            });
    

    },
    async isTokenInWallet () {
      let tableData = await this.$store.state.wallets.tokens
      this.ethTokens = tableData.filter(w => w.chain === 'eth')
      // this.tokenInWallet =  this.ethTokens.find(w =>  this.tokenOptions.find(o => o.toLowerCase() == w.type.toLowerCase()))
      // this.currentToken = this.tokenInWallet ? this.tokenInWallet.name : this.tokenOptions[0] ;
      // this.sendAmount = this.tokenInWallet ? this.tokenInWallet.amount : 0
    },
     async  getCurrentGasPrices () {
          let response = await this.$axios.get('https://ethgasstation.info/json/ethgasAPI.json')
          let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
          }
          return prices
        },
    getMaxBalance () {
      this.sendAmount = this.currentToken.amount
    },
    validateInput () {
      if (this.sendAmount <= 0) {
        this.sendAmount = 0
      } else {
        this.sendAmount = this.tokenInWallet && this.sendAmount > this.tokenInWallet.amount ? this.tokenInWallet.amount : this.sendAmount
      }
    },
    filterPoolsByUserInput (val, update) {
      if (val === '') {
        update(() => {
          self.poolOptions = this.$store.state.investment.pools.map(o => {
            return {
              label: o.poolName,
              value: o.contractAddress,
              tokens: o.tokens
            }
          })
        })
        return
      }
      this.pool = ''
      update(() => {
        const needle = val.toLowerCase()
        this.poolOptions = this.$store.state.investment.pools.filter(v => v.poolName.toLowerCase().indexOf(needle) > -1).map(o => {
          return {
            label: o.poolName,
            value: o.contractAddress,
            tokens: o.tokens
          }
        })
      })
    },
    filterPoolsByPlatform () {
      this.poolOptions = this.$store.state.investment.pools.filter(o => this.platform == 'Any' || o.platform.toLowerCase() == this.platform.toLowerCase()).map(o => {
        return {
          label: o.poolName,
          value: o.contractAddress,
          tokens: o.tokens
        }
      })
      this.pool = this.poolOptions[0]
      //  this.tokenOptions = this.pool.tokens ;
      this.isTokenInWallet()
    },
    getTokenAvailableAmount () {
      let found = this.ethTokens.find(o => o.type.toLowerCase() == this.currentToken.toLowerCase())
      this.availableAmount = found ? found.amount : 0
    },
    goToExchange () {
      // console.log('this.depositCoin', this.depositCoin)
      let depositCoin = {
        image: 'https://files.coinswitch.co/public/coins/btc.png',
        label: 'Bitcoin',
        value: 'btc'
      }
      let destinationCoin = {
        image: 'https://files.coinswitch.co/public/coins/eth.png',
        label: 'Ethereum',
        value: 'eth'
      }
      this.$router.push({
        path: '/verto/exchange/:coinToSend/:coinToReceive',
        name: 'exchange-v3',
        params: {
          depositCoin: depositCoin,
          destinationCoin: destinationCoin
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .etherscan a {
    color: black;
    text-decoration: none;
  }
  @import "~@/assets/styles/variables.scss";
  .link-to-exchange{
    text-decoration: underline;
    color: blue;
    padding-left: 15px;
    font-size: 14px;
    cursor: pointer;
    font-weight: $bold;
  }
  .modal-dialog-wrapper{
    .qbtn-start{
      border-radius: 30px;
      height: 44px;
      background: #00D0CA !important;
      width: 120px;
      margin-left: 0px;
      padding: 5px 10px;
      &.cancel{
        background: #CCC !important;
        width: 100px;
      }
      /deep/ .q-btn__wrapper{
        min-height: unset;
        padding: 0px 10px;
        .q-btn__content{
          text-transform: initial;
          font-size: 14px;
        }
      }
    }
    .lab-title{
      font-weight: $bold;
      font-size: 18px;
      font-family: $Titillium;
      color: #7272FA;
      margin: 0px;
    }
    /deep/ .btn-gas{
      border: 2px solid #CCC;
      &.active{
        border-color: #00D0CA;
      }
      .q-btn__content{
        @extend .lab-title;
        font-size: 14px;
        text-transform: initial;
      }
    }
    .lab-sub{
      font-size: 14px;
    }
    .lab-value{
      @extend .lab-title;
      font-size: 16px;
      color: #627797;
      line-height: 24px;
      &.output{
        font-size: 12px;
      }
      img{
        max-width: 25px;
      }
    }
    .input-input{
      height: 50px;
      /deep/ .q-field__control{
        height: 50px;
        min-height: unset;
        border-radius: 50px;
      }
      .btn-copy{
        height: 30px;
        position: relative;
        top: -3px;
        margin-right: 0px;
        padding: 6px 13px;
      }
      .qr-btn{
        width: 30px;
        height: 30px;
        padding-right: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          width: 25px;
          height: 25px;
          position: relative;
          right: -5px;
          transform: scale3d(1, 1, 1);
        }
      }
    }
    .select-input{
      // border-radius: 100px !important;
      $height: 50px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        // border-radius: 50px;
        height: $height;
        min-height: unset;
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          .q-item{
            padding: 0px;
            padding-left: 18px;
            min-height: $height;
            padding-bottom: 0px;
            .q-item__section{
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
  }
  .select-input{
      border-radius: 100px !important;
      $height: 35px;
      width: 140px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        height: $height;
        min-height: unset;
        border-radius: 50px;
        .option--avatar__custom{
          font-size: 19px;
          max-width: 20px;
          max-height: 20px;
          border: none;
          margin-left: 0px;
        }
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          .q-field__input{
            max-width: 50px !important;
            min-width: unset !important;
            position: absolute;
            left: 60px;
            font-size: 10px;
          }
          .q-item__label{

            font-weight: 600;
            margin-bottom: -2px;
            margin-left: -10px;
          }
          .q-item{
            padding: 0px;
            padding-left: 0px;
            min-height: $height;
            padding-bottom: 0px;
            .q-item__section{
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
</style>
