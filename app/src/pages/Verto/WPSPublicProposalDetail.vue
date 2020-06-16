<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px;background: #f3f3f3 !important">
        <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/card-wps/public-proposals" text-color="black" icon="keyboard_backspace" />
                     Active proposal
                </h2>
                <!-- <div class="privatekey_bg flex flex-center"><img src="statics/proposals_bg.png" alt=""></div> -->
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
                      <div class="title flex justify-between row items-center">
                        <span class="col-10">{{currentProposal.title}}</span>
                        <div class="col-2 flex justify-end">
                           <q-btn color="black" text-color="black" flat icon="share" @click="showShareWrapper = true" style="font-size: 12px" />
                        </div>
                      </div>
                      <div class="parag">
                        Lorem ipsum dolor sit amet.
                        <div><strong> Amount : {{ currentProposal.monthly_budget }}</strong></div>
                      </div>
                      <div class="text-h6 strong vote full-width flex justify-between items-center q-pa-sm q-mt-sm q-mb-md vote-wrapper">
                        Vote &nbsp;
                        <span>
                          <!-- :icon-right="`img:statics/success_icon2.svg`"  -->
                          <q-btn @click="vote(currentProposal.proposal_name, 'yes')" color="black" label="Yes" text-color="green" class="strong q-mr-sm vote-btn" rounded outline />
                          <q-btn @click="vote(currentProposal.proposal_name, 'no')" color="orange" label="No" text-color="orange" class="strong vote-btn" rounded outline />
                        </span>
                      </div>
                      <div class="list-proposals--wrapper">
                        <div class="item">
                          <div class="row ">
                            <div class="col col-6 parag">created</div>
                            <div class="col col-6 parag">{{currentProposal.created}}</div>
                            <div class="col col-6 parag bg">duration</div>
                            <div class="col col-6 parag bg">{{currentProposal.duration}}</div>
                            <div class="col col-6 parag">eligible</div>
                            <div class="col col-6 parag">{{currentProposal.eligible}}</div>
                            <div class="col col-6 parag bg">claimed</div>
                            <div class="col col-6 parag bg">{{currentProposal.claimed}}</div>
                            <div class="col col-6 parag bg">proposal_name</div>
                            <div class="col col-6 parag bg">{{currentProposal.proposal_name}}</div>
                            <div class="col col-6 parag">proposer</div>
                            <div class="col col-6 parag">{{currentProposal.proposer}}</div>
                            <div class="col col-6 parag bg">remaining_voting_periods</div>
                            <div class="col col-6 parag bg">{{currentProposal.remaining_voting_periods}}</div>
                            <div class="col col-6 parag">start_voting_period</div>
                            <div class="col col-6 parag">{{currentProposal.start_voting_period}}</div>
                            <div class="col col-6 parag bg">status</div>
                            <div class="col col-6 parag bg">{{currentProposal.status}}</div>
                            <div class="col col-6 parag">total_budget</div>
                            <div class="col col-6 parag">{{currentProposal.total_budget}}</div>
                            <div class="col col-6 parag bg">total_net_votes</div>
                            <div class="col col-6 parag bg">{{currentProposal.total_net_votes}}</div>
                            <div class="col col-6 parag">monthly_budget</div>
                            <div class="col col-6 parag">{{currentProposal.monthly_budget}}</div>
                            <div class="parag col col-12">
                              <hr class="q-mt-md">
                              <div class="title flex justify-between">Proposal</div>
                              <div v-html="currentProposal.proposal_json[0].value" />
                              <br>
                            </div>
                            <!-- claimed: "0.00000000 VTX"
                            created: "2020-06-01T11:56:19"
                            duration: 2
                            eligible: 0
                            monthly_budget: "100.00000000 VTX"
                            payouts: "0.00000000 VTX"
                            proposal_json: Array(1)
                            proposal_name: "propdraftu"
                            proposer: "volentixqkxd"
                            remaining_voting_periods: 2
                            start_voting_period: "2020-05-25T20:11:12"
                            status: "active"
                            title: "Proposal Draft Today Test"
                            total_budget: "200.00000000 VTX"
                            total_net_votes: 0 -->
                          </div>
                        </div>
                      </div>
                    </div>
                    <br><br><br>
                </div>
            </div>
            <q-dialog v-model="showShareWrapper">
              <q-card class="q-pa-lg">
                <q-toolbar>
                  <q-avatar><img src="statics/icon.png"></q-avatar>
                  <q-toolbar-title><span class="text-weight-bold">Share</span> Proposal</q-toolbar-title>
                  <q-btn flat round dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class=" text-h6">
                  <!-- <span style="font-size: 1em">Select your prefered method</span> -->
                  <div class="social-media-wrapper">
                    <span class="submenu-wrapper">
                        <social-sharing
                          class="share_wrapper text-black flex column justify-even content-start item-start"
                          :url="proposalLink"
                          title="Verto | Multi-currency wallet"
                          description="DOWNLOAD VERTO WALLET THE SECURE USER FRIENDLY WALLET"
                          quote=""
                          media="http://localhost:8080/statics/screens/screen_iphone.png"
                          hashtags=""
                          twitter-user=""
                          inline-template>
                          <div class="social_share">
                            <network network="email" class="span-wrapper">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                  <div class="q-btn__wrapper col row q-anchor--skip">
                                    <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                      <!-- <i aria-hidden="true" class="fas fa-at q-icon"></i> -->
                                      <img src="/statics/social/mail.svg" alt="">
                                    </div>
                                  </div>
                                </button>
                              </template>
                            </network>
                            <network network="skype">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="border q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                    <div class="q-btn__wrapper col row q-anchor--skip">
                                      <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                        <!-- <i aria-hidden="true" class="fab fa-skype q-icon"></i> -->
                                        <img src="/statics/social/skype.svg" alt="">
                                      </div>
                                    </div>
                                </button>
                              </template>
                            </network>
                            <network network="sms">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                    <div class="q-btn__wrapper col row q-anchor--skip">
                                      <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                        <!-- <i aria-hidden="true" class="fas fa-sms q-icon"></i> -->
                                        <img src="/statics/social/sms.svg" alt="">
                                      </div>
                                    </div>
                                </button>
                              </template>
                            </network>
                            <network network="telegram">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                    <div class="q-btn__wrapper col row q-anchor--skip">
                                      <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                        <!-- <i aria-hidden="true" class="fab fa-telegram q-icon"></i> -->
                                        <img src="/statics/social/telegram.svg" alt="">
                                      </div>
                                    </div>
                                </button>
                              </template>
                            </network>
                            <network network="reddit">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="border q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                    <div class="q-btn__wrapper col row q-anchor--skip">
                                      <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                        <!-- <i aria-hidden="true" class="fab fa-reddit-alien q-icon"></i> -->
                                        <img src="/statics/social/reddit.svg" alt="">
                                      </div>
                                    </div>
                                </button>
                              </template>
                            </network>
                            <network network="twitter">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                    <div class="q-btn__wrapper col row q-anchor--skip">
                                      <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                        <!-- <i aria-hidden="true" class="fab fa-twitter q-icon"></i> -->
                                        <img src="/statics/social/twitter.svg" alt="">
                                      </div>
                                    </div>
                                </button>
                              </template>
                            </network>
                            <network network="whatsapp">
                              <template>
                                <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                                  <div tabindex="-1" class="q-focus-helper"></div>
                                    <div class="q-btn__wrapper col row q-anchor--skip">
                                      <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                        <!-- <i aria-hidden="true" class="fab fa-whatsapp q-icon"></i> -->
                                        <img src="/statics/social/whatsapp.svg" alt="">
                                      </div>
                                    </div>
                                </button>
                              </template>
                            </network>
                          </div>
                        </social-sharing>
                      </span>
                      <div id="copy-btn">
                        <q-btn color="white" text-color="black" @click="copyToClipboard(proposalLink , 'Link')" class="copy-link-button" flat label="Copy link">
                          <img src="/statics/social/copy.svg" alt="">
                        </q-btn>
                      </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'

const eos = new EosWrapper()
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

import Vue from 'vue'
var SocialSharing = require('vue-social-sharing')
Vue.use(SocialSharing)

export default {
  components: {},
  data () {
    return {
      showShareWrapper: false,
      proposalLink: 'https://volentix.io?verto-app',
      proposals: [],
      settings: [],
      votes: [],
      currentProposal: null,
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
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Key Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'warning',
        position: 'top'
      })
    },
    goToDetail (item) {
      console.log('--item--', item.proposal_name)
      this.$router.push({
        path: `/verto/card-wps/public-proposals/${item.proposal_name}`
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
        this.currentProposal = this.proposals.find(p => p.proposal_name === this.$route.params.proposalName ? p : null)
        console.log('currentProposal ---', this.currentProposal)
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
              line-height: 20px;
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
                font-family: $Titillium;
                font-weight: $regular;
                font-size: 12px;
                color: #040404;
                .row{
                  .col{
                    &.bg{
                      background-color: rgba(#707070, .09);
                    }
                  }
                }
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
  .vote-btn{
    // margin-right: 0px;
    // /deep/ img{
    //   max-width: 40px;
    //   min-width: 44px;
    // }
  }
  .strong{
    font-weight: $bold;
  }
  .vote-wrapper{
    background-color: #F3F3F3;
    background: transparent linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%) 0% 0% no-repeat padding-box;
    border-radius: 8px;
    padding: 5px 10px;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.1);
  }
  .social-media-wrapper{
    margin-top: 0px;
    .share_wrapper{
      display: flex;
      flex-direction: row !important;
      justify-content: flex-start;
      // background-color: #fff;
      // box-shadow: 0px 1px 1px 0px rgba(black, .04);
      padding: 10px 0px;
      margin-left: 0px;
      margin-right: 0px;
      margin-bottom: 20px;
      border-bottom: 1px solid #efefef;
      border-radius: 0px;
      // width: 33%;
      /deep/  & > span{
        flex-basis: 20%;
        width: 100px;
        max-width: 68px;
        min-width: unset;
        padding: 0px 2px;
      }
      /deep/ .q-btn.q-btn-item{
        color: #433afb !important;
        background: rgba(239, 239, 239, 0.13) !important;
        // transform: scale3d(.7,.7,.7);
        box-shadow: none !important;
        width: 100%;
        border-radius: 0px !important;
        .q-btn__wrapper{
          width: 55px;
          height: 55px;
          margin-left: -11px;
        }
        img{
          width: 55px;
          height: 55px;
          min-width: 55px;
          max-width: 55px;
          margin-right: -19px;
        }
        // &.border{
        //   border-right: 1px solid rgb(226, 226, 226);
        //   border-left: 1px solid rgb(226, 226, 226);
        // }
        margin-bottom: 10px;
        /deep/ .q-btn__wrapper:before{
          box-shadow: none !important;
        }
      }
    }
  }
  /deep/ .copy-link-button{
    border: 1px solid #f7f7f7;
    background: #fdfdfd;
    border-radius: 0px;
    .q-btn__content{
      flex-direction: row-reverse !important;
      font-size: 18px;
      text-transform: initial;
      img{
        width: 55px;
        height: 46px;
        margin-left: -20px;
        margin-top: 2px;
      }
    }
  }
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
</style>
