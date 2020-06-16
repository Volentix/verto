<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px;background: #f3f3f3 !important">
        <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="black" icon="keyboard_backspace" />
                     Public proposals
                </h2>
                <div class="privatekey_bg flex flex-center"><img src="statics/proposals_bg.png" alt=""></div>
            </div>
            <div class="chain-tools-wrapper--list open">
                <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                      <div class="q-mt-md" v-if="isPrivateKeyEncrypted">
                        <q-input
                          v-model="privateKeyPassword"
                          light
                          rounded
                          outlined
                          class="full-width"
                          color="green"
                          label="Private Key Password"
                          @input="checkPrivateKeyPassword"
                          debounce="500"
                          :type="isPwd ? 'password' : 'text'"
                          :error="invalidPrivateKeyPassword"
                          error-message="The private key password is invalid"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="isPwd ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="isPwd = !isPwd"
                            />
                          </template>
                        </q-input>
                      </div>
                      <div class="error text-h6 text-red" v-if="transactError">{{ErrorMessage}}</div>
                      <div class="title">{{proposals.length}} Active Proposals</div>
                      <div class="parag">Next budget payments will occur in 28 days and it will provide 20000 VTX of 56000 VTX of total available budget.</div>
                      <div class="flex justify-end q-mt-md q-mb-md">
                        <q-btn unelevated color="deep-purple-14" class="q-mr-sm --next-btn" rounded label="Create Proposals" to="/verto/card-wps/public-proposals/create" />
                        <q-btn unelevated color="deep-purple-14" class="--next-btn" rounded label="Draft Proposals" to="/verto/card-wps/public-proposals/draft" />
                      </div>
                      <div class="list-proposals--wrapper">
                        <div class="item" v-for="(item, index) in proposals" :key="index">
                          <div class="row q-pb-sm flex justify-between" @click="goToDetail(item)">
                            <div class="col-10">
                              <strong>{{item.title}}</strong> by <strong>{{item.proposer}}</strong>
                              <br> Lorem ipsum dolor sit amet.
                            </div>
                            <div class="col-2 flex justify-end items-center" style="margin-top: -15px">
                              <q-btn color="black" text-color="black" flat icon="share" @click="showShareWrapper = true" style="font-size: 10px;margin-right: -15px" />
                            </div>
                            <div class="col-12">Duration: <strong>{{item.duration}} Month(s)</strong></div>
                          </div>
                          <div class="row q-pb-sm full-width items-center">
                            <div class="progress col col-6">
                              <q-linear-progress :value="item.total_net_votes/100" rounded color="blue" size="md" class="" />
                              <span>{{item.total_net_votes/100}}/100 votes</span>
                            </div>
                            <div class="vote col col-6 flex justify-end items-center" style="margin-top: -15px">
                              <span class="q-mr-sm">Vote</span>
                              <q-btn @click="vote(currentProposal.proposal_name, 'yes')" color="black" label="Yes" text-color="green" class="strong q-mr-sm vote-btn" rounded outline />
                              <q-btn @click="vote(currentProposal.proposal_name, 'no')" color="orange" label="No" text-color="orange" class="strong vote-btn" rounded outline />
                              <!-- <q-btn @click="vote(item.proposal_name, 'yes')" color="white" text-color="black" class="vote-btn mw40" rounded flat ><img class="full-width" src="statics/success_icon2.svg" alt=""></q-btn>
                              <q-btn @click="vote(item.proposal_name, 'no')" color="white" text-color="black" class="vote-btn mw40" rounded flat ><img class="full-width" src="statics/fail_icon2.svg" alt=""></q-btn> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br><br><br>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'

const eos = new EosWrapper()
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {},
  data () {
    return {
      proposals: [],
      settings: [],
      votes: [],
      drafts: [],
      privateKeyPassword: null,
      isPwd: true,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      transactError: false,
      ErrorMessage: '',
      isPrivateKeyEncrypted: false,
      proposal_name: 'mywps',
      title: 'My WPS Title',
      monthly_budget: '8.00000000 VTX',
      duration: '2',
      proposal_json: '[{"key":"somedata", "value":"text data here"}]'
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },
  async created () {
    console.log('wall', this.wallet)
    if (this.wallet.privateKey) {
      this.privateKey.key = this.wallet.privateKey
      this.isPrivateKeyEncrypted = false
      console.log('this.isPrivateKeyEncrypted 1', this.isPrivateKeyEncrypted)
    } else {
      this.isPrivateKeyEncrypted = true
      console.log('this.isPrivateKeyEncrypted 2', this.isPrivateKeyEncrypted)
    }

    if (this.wallet.name) {
      this.fetch()
    }
  },
  methods: {
    goToDetail (item) {
      console.log('--item--', item.proposal_name)
      this.$router.push({
        path: `/verto/card-wps/public-proposals/proposal/${item.proposal_name}`
      })
    },
    async transact (actions) {
      try {
        await eos.transact({ actions }, { keyProvider: this.privateKey.key })
        this.$router.push({ path: '/verto/card-wps/public-proposals' })
      } catch (error) {
        console.log('error-------', error)
        // FIXME with userError handler
        // userError(JSON.parse(e).message)
        if (error.toString().includes('Required uint8')) {
          this.transactError = true
          this.ErrorMessage = error.toString()
        } else if (error.includes('[proposal_name] must be active')) {
          this.transactError = true
          this.ErrorMessage = error
        } else if (error.includes('deposit balance does not meet minimum required amount')) {
          this.transactError = true
          this.ErrorMessage = error
        } else if (error.includes('maximum billable CPU time')) {
          this.transactError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.includes('must be a minimum of 100.00000000 VTX')) {
          this.transactError = true
          this.ErrorMessage = 'You need a minimum of 100 VTX to create a draft'
        } else if (error.includes('user must stake before they can vote')) {
          this.transactError = true
          this.ErrorMessage = 'You must stake before you can vote!'
        }

        // Notify.create({ message: e.message ? e.message : e })

        throw error
      }
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.wallet.privateKeyEncrypted)
      console.log('privateKeyEncrypted', privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (privateKey.success) {
        this.invalidPrivateKeyPassword = false
        this.privateKey = privateKey
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    async vote (proposal_name, vote) {
      await this.transact([{
        account: 'volentixwork',
        name: 'vote',
        authorization: [{
          actor: this.wallet.name,
          permission: 'active'
        }],
        data: { voter: this.wallet.name, proposal_name, vote }
      }])
    },
    fetch () {
      eos.getTable('volentixwork', 'volentixwork', 'proposals').then(r => {
        this.proposals = r
        console.log('proposals ---', this.proposals)
      })
      eos.getTable('volentixwork', 'volentixwork', 'settings').then(r => {
        this.settings = r
        console.log('settings ---', this.settings)
      })
      eos.getTable('volentixwork', 'volentixwork', 'votes').then(r => {
        this.votes = r
        console.log('votes ---', this.votes)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .chain-tools-wrapper{
    // padding: 0px 6%;
    &--list{
      &__hide-chain-tools{
        text-transform: initial !important;
        margin-top: 0px;
        margin-bottom: 10px;
        color: #7272FA !important;
      }
      .list-wrapper{
        overflow: hidden;
        visibility: hidden;
        height: 0px;
        opacity: 0;
        transform: translateY(-20px) scaleY(.5);
        transform-origin: top;
        transition: ease transform .3s, ease opacity .4s;
        &--chain{
          &__eos-to-vtx-convertor{
            background-color: #fff;
            margin-bottom: 10px;
            border-radius: 10px;
            padding: 4% 5%;
            box-shadow: 0px 4px 16px 0px rgba(black, .09);
            &--title{
              font-size: 22px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #2A2A2A;
              margin: 0px;
              padding-left: 22px;
              margin-top: 3px;
              position: relative;
            }
            .title{
              font-size: 20px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #2A2A2A;
              margin-bottom: 10px;
            }
            .list-proposals--wrapper{
              .item{
                border: 1px solid rgba(#707070, .09);
                border-radius: 15px;
                padding: 10px;
                padding-bottom: 0px;
                margin-bottom: 10px;
                font-size: 10px;
                font-family: $Titillium;
                font-weight: $regular;
                color: #B0B0B0;
                strong{
                  color: #333;
                  font-size: 11px;
                  font-weight: $bold;
                }
              }
            }
            .--input{
              margin-top: 20px;
              /deep/ .q-field{
                height: 40px;
              }
              /deep/ .q-field__native,
              /deep/ .q-field__prefix,
              /deep/ .q-field__suffix{
                padding-top: 10px;
                padding-bottom: 0px;
              }
              /deep/ .q-field__label{
                top: 10px;
                font-size: 12px;
                font-weight: $bold;
                font-family: $Titillium;
              }
              /deep/ .q-field__marginal{
                height: 40px;
              }
              /deep/ .q-field__control{
                height: 40px;
              }
            }
            .--slider{
              /deep/ &.q-slider--dark {
                .q-slider__track-container{
                  background: rgba(0, 0, 0, 0.3);
                }
                .q-slider__pin-value-marker-text{
                  font-weight: $bold;
                  font-size: 11px;
                }
                .q-slider__pin-value-marker-bg{
                  background: #FFB200 !important;
                }
                .text-green{
                  background: #FFB200 !important;
                }
              }
            }
            .--next-btn{
              width: fit-content;
              text-transform: initial !important;
            }
            .--progress{
              height: 20px;
              /deep/ .q-linear-progress{
                margin-top: 8px;
                height: 5px !important;
                max-width: 90%;
                margin-left: auto;
                margin-right: auto;
                .q-linear-progress__track{
                  background: #FFB200;
                }
                .q-linear-progress__model--indeterminate:before,
                .q-linear-progress__model--indeterminate:after{
                  background: #FFB200;
                }
              }
            }
            .--back-btn{
              position: absolute;
              right: 0px;
              top: 6px;
            }
            .--subtitle{
              font-size: 17px;
              color: #000;
              font-family: $Titillium;
              font-weight: $regular;
              line-height: 20px;
              margin-top: 10px;
              margin-bottom: 30px;
              ul{
                padding: 0px;
                margin: 0px;
                margin-left: 20px;
                li{
                  font-size: 15px;
                  font-weight: $bold;
                  margin-bottom: 10px;
                  line-height: 15px;
                  color: #FFB200;
                  span{
                    color: #2A2A2A;
                  }
                }
              }
              &__success{
                color: #00D0CA;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__faild{
                color: #FFB200;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__transLink{
                color: #2A2A2A;
                border-bottom: 1px solid;
                width: fit-content;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__summary{
                margin-bottom: 20px;
                font-weight: $bold;
              }
              &__summary--list{
                list-style: disc;
                padding-left: 24px;
                margin-top: -10px;
                li{
                  color: #B0B0B0;
                }
              }
              &__success{
                color: #00D0CA;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__faild{
                color: #FFB200;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__transLink{
                color: #2A2A2A;
                border-bottom: 1px solid;
                width: fit-content;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__summary{
                margin-bottom: 20px;
                font-weight: $bold;
              }
              &__summary--list{
                list-style: disc;
                padding-left: 24px;
                margin-top: -10px;
                li{
                  color: #B0B0B0;
                }
              }
            }
            .--title,.--amount{
              font-size: 13px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #B0B0B0;
              text-transform: initial !important;
              line-height: 20px;
            }
            .--amount{
              color: #2A2A2A !important;
            }
          }
        }
      }
      &.open{
        margin-bottom: 0px;
        padding-left: 4%;
        padding-right: 4%;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 10px;
        }
      }
    }
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // padding-bottom: 100px;
    .privatekey_bg{
      margin-top: 0px;
      img{
        width: 100%;
        max-width: 330px;
      }
    }
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 0px;
      position: relative;
      z-index: 2;
      .btn-align-left{
        position: absolute;
        left: -35px;
        top: 10px;
      }
    }
  }
  .file-select-wrapper{
    border: 1px solid #CCC;
    border-radius: 100px;
    padding: 0px;
    overflow: hidden;
    position: relative;
    .icon-upload{
      font-size: 25px;
      position: absolute;
      right: 15px;
      opacity: .3;
    }
    label{
      width: 100%;
    }
    /deep/ .file-select > .select-button {
      padding: .12rem;
      color: transparent;
      background-color: #fbfbfb !important;
      padding: 10px 0px;
      border: none;
      flex-direction: row;
      justify-content: flex-start;
      display: flex;
      span{
        color: #000;
        padding: 0px 15px;
      }
    }
  }
  .mw40{
    max-width: 40px;
    padding: 0px;
  }
  /deep/ .vote-btn{
    height: 30px;
    .q-btn__wrapper{
      padding: 0px 5px;
      min-height: unset;
      width: 40px;
    }
    .q-btn__content{
      font-size: 12px;
      text-transform: initial;
    }
    img{
      min-width: 34px;
    }
  }
</style>
