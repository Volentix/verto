<template>
  <q-page class='text-black bg-white'>
    <div class='standard-content'>
      <h2 class='standard-content--title flex justify-center'>
        <q-btn flat unelevated class='btn-align-left' to='/verto/dashboard' text-color='black' icon='keyboard_backspace' />
        Public proposals
      </h2>

      <q-btn @click="refresh"> Refresh </q-btn>
      <br>
      <q-btn @click="complete"> Complete </q-btn>

      <h5> Active proposals: </h5>

      <div v-for="proposal in proposals" :key="proposal.proposal_name">
        <p> {{ proposal.title }} </p>
        <p> proposer: {{ proposal.proposer }} </p>
        <p> budget: {{ proposal.monthly_budget }} ( duration: {{ proposal.duration }} ) </p>
        <span>
          {{ proposal.created }}
        </span>
        <span>
          JSON: {{ proposal.proposal_json }}
        </span>

        <br>
        <q-btn outline @click="claim(proposal.proposal_name)"> Claim </q-btn>
        <span> | </span>
        <q-btn outline @click="vote(proposal.proposal_name, 'yes')"> Vote(Yes) </q-btn>
        <span> | </span>
        <q-btn outline @click="vote(proposal.proposal_name, 'no')"> Vote(No) </q-btn>

        <hr>
      </div>

      <h5> My draft proposals: </h5>

      <div v-for="proposal in drafts" :key="proposal.proposal_name">
        <br>
        <p> {{ proposal.title }} </p>
        <p> proposer: {{ proposal.proposer }} </p>
        <p> budget: {{ proposal.monthly_budget }} ( duration: {{ proposal.duration }} ) </p>

        <q-btn
          outline
          @click="activate(proposal.proposal_name)"
        >
          Activate
        </q-btn>

        <span> | </span>

        <q-btn
          outline
          @click="canceldraft(proposal.proposal_name)"
        >
          Cancel
        </q-btn>
      </div>

      <hr>

      <h5> Create draft proposal </h5>

      <q-input v-model="proposal_name" color="deep-purple-14" label="Proposal name (id)" />
      <q-input v-model="title" color="deep-purple-14" label="Proposal Titile" />
      <q-input v-model="monthly_budget" color="deep-purple-14" label="Budget" />
      <q-input v-model="duration" color="deep-purple-14" label="Duration" />
      <q-input v-model="proposal_json" color="deep-purple-14" label="Proposal json" value="asdfasdf"/>

      <br/>
      <q-btn @click="submitdraft" outline > Sumbit draft </q-btn>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */ // FIXME camelcase

import { version } from '../../../package.json'
import EosWrapper from '@/util/EosWrapper'
import { userError } from '@/util/errorHandler'

const eos = new EosWrapper()
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

// TODO Fix error handler, for actions: error is not appear
export default {
  components: {},
  computed: {
    wallet() {
      return this.$store.state.currentwallet.wallet
    },

    privateKey() {
      // FIXME Use app state key manager system insted
      return ''
    },
  },

  data () {
    return {
      proposals: [],
      drafts: [],

      proposal_name: 'mywps',
      title: 'My WPS Title',
      monthly_budget: '8.00000000 VTX',
      duration: '2',
      proposal_json: '[{"key":"somedata", "value":"text data here"}]'
    }
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
  },

  async created () {
    this.fetch()
  },

  methods: {
    async vote (proposal_name, vote) {
      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'vote',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: { voter: this.wallet.name, proposal_name, vote }
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error.message)
      }
    },

    async claim (proposal_name) {
      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'claim',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: { proposal_name }
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error.message)
      }
    },

    async complete () {
      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'complete',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: {}
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error)
      }
    },

    async refresh () {
      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'refresh',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: {}
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error)
      }
    },
    async submitdraft () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      const { proposal_name, title, monthly_budget, duration, proposal_json } = this

      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'submitdraft',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: {
              proposer: this.wallet.name,
              proposal_name,
              title,
              monthly_budget,
              duration: parseInt(duration),
              proposal_json: JSON.parse(proposal_json)
            }
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error.message)
      }
    },
    async canceldraft (proposalName) {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'canceldraft',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: {
              proposer: this.wallet.name,
              proposal_name: proposalName
            }
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error.message)
      }
    },

    async activate (proposalName) {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)

      try {
        await eos.transact({
          actions: [{
            account: 'volentixwork',
            name: 'activate',
            authorization: [{
              actor: this.wallet.name,
              permission: 'active'
            }],
            data: {
              proposer: this.wallet.name,
              proposal_name: proposalName,
              start_voting_period: null // Start voting period
            }
          }]
        }, { keyProvider: this.privateKey })
        this.fetch()
      } catch (error) {
        console.log('err', error)
        userError(error.message)
      }
    },

    fetch () {
      eos.getTable('volentixwork', 'volentixwork', 'proposals').then(r => {
        this.proposals = r
      })

      eos.getTable('volentixwork', this.wallet.name, 'drafts').then(r => {
        this.drafts = r
      })
    },

    async setupPlatformPath () {
      this.configPath = await platformTools.filePath()
    }
  }
}
</script>
<style lang='scss' scoped>
@import '~@/assets/styles/variables.scss';
.standard-content{
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-start;
  min-height: calc(100vh + 100px) !important;
  padding-bottom: 100px;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 0px;
    margin-bottom: 40px;
    .btn-align-left{
      position: absolute;
      left: -15px;
      top: 10px;
    }
  }
  &--desc{
    margin-top: -20px;
    margin-bottom: 40px;
    font-size: 18px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: $mainColor;
  }
  &--body{
    .progress-custom-volentix{
      max-width: 150px;
      margin: auto;
      margin-top: 20px;
      .title{
        font-size: 13px;
        color: #7272FA;
        font-weight: $light;
        font-family: $Titillium;
        margin-bottom: -10px;
        margin-top: 10px;
      }
      /deep/ .q-linear-progress__model{
        background: #7272FA;
      }
    }
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
      }
    }
    .rate-value{
      padding: 0px 20px;
      font-family: $Titillium;
      font-weight: $regular;
      color: #B0B0B0;
      font-size: 16px;
      margin-bottom: -20px;
      margin-top: -20px;
    }
    &__form{
      .pay-get-wrapper{
        border-bottom: 1px solid rgba(#707070, .4);
        padding: 0px 6%;
        padding-bottom: 10px;
        margin-bottom: 20px;
        .pay-wrapper{}
        .exchange-btn{
          height: fit-content;
          align-self: flex-end;
          padding-top: 15px;
          .left-icon{
            transform: scaleX(-1);
            margin-left: 0px;
            margin-right: -26px;
            margin-top: -24px;
            color: #7272FA;
          }
          .right-icon{
            color: #7272FA;
          }
        }
        .label{
          font-size: 17px;
          color: #2A2A2A;
          font-family: $Titillium;
          font-weight: $light;
        }
        .value{
          font-size: 33px;
          color: #B0B0B0;
          font-family: $Titillium;
          font-weight: $regular;
        }
        .get-wrapper{}
      }
      /deep/ .q-field__native{
        padding-left: 8px;
        font-size: 16px;
        font-weight: $regular;
      }
      /deep/ .q-field__label{
        font-family: $Titillium;
        font-weight: $regular;
        font-size: 18px;
        padding-left: 10px;
        margin-top: -2px;
      }
      .input-input{
        height: 50px;
        /deep/ .q-field__control{
          height: 50px;
          min-height: unset;
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
        border-radius: 100px !important;
        $height: 50px;
        height: $height;
        /deep/ .q-field__marginal{
          height: $height;
          min-height: unset;
        }
        /deep/ .q-field__control{
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
      .lab-input{
        font-family: $Titillium;
        font-weight: $regular;
        font-size: 16px;
        color: black;
        padding-left: 20px;
        padding-bottom: 5px;
      }
      /deep/ .option--avatar{
        border: 1px solid;
        width: 35px;
        height: 35px;
        max-width: 40px;
        padding: 0px;
        min-width: unset;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        overflow: hidden;
        margin-left: -10px;
        padding-right: 0px;
        &.vtx{
          background-color: #000;
          padding: 3px;
        }
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    .action-link{
      height: 54px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: fit-content;
      margin-left: 0px;
      padding-left: 35px;
      padding-right: 35px;
      background-color: #7272FA !important;
      .left-icon{
        transform: scaleX(-1);
        margin-left: 14px;
        margin-right: 14px;
        margin-top: -1px;
      }
      // &.next{
      //   background-color: #7900FF !important;
      // }
      // &.back{
      //   background-color: #B0B0B0 !important;
      // }
    }

  }
}
</style>
<style lang='scss'>
  .option--avatar{
    border: 1px solid rgba(black, .1);
    width: 35px;
    height: 35px;
    max-width: 40px;
    padding: 0px;
    min-width: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    overflow: hidden;
    &__custom{
      border: 1px solid;
      margin-left: -10px;
      padding-right: 0px;
    }
    &.vtx{
      background-color: #000;
      padding: 3px;
    }
  }
</style>
