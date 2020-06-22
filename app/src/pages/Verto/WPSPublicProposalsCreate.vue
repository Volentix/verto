<template>
  <q-page class="text-black bg-white">
    <q-dialog v-model="privateKeyDialog">
      <q-card class="q-pa-md">
        <q-toolbar>
          <q-avatar><q-icon name="error_outline" size="md" color="red" /></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Private key password</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">
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
              @keyup.enter="submitdraft"
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
        </q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn @click="submitdraft" flat class="action-link next auto-width" color="black" text-color="white" label="Confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transErrorDialog">
      <q-card class="q-pa-md">
        <q-toolbar>
          <q-avatar><q-icon name="error_outline" size="md" color="red" /></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Error</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">{{ErrorMessage}}</q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn label="Close" flat class="yes-btn" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="standard-content">
      <h2 class="standard-content--title flex flex-center"><q-btn flat unelevated class="btn-align-left" to="/verto/card-wps/public-proposals" text-color="black" icon="keyboard_backspace" />
      Create proposal draft </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <q-input v-model="proposal_name" class="input-input" outlined rounded color="purple" label="Proposal name (id)" />
          <q-input v-model="title" class="input-input" outlined rounded color="purple" label="Proposal Title" />
          <hr style="height:0px;opacity:0" />
          <q-input
            ref="inputDesc"
            outlined rounded color="purple" label="Description"
            v-model="description"
            class="input-input"
            bottom-slots
            maxlength="31"
            :error="!isValid"
            hint="Max 30 characters"
          >
            <template v-slot:error>
              Please use maximum 50 characters.
            </template>
          </q-input>
          <q-input v-model="monthly_budget" class="input-input" outlined rounded color="purple" label="Budget">
            <div class="flex justify-end q-pr-sm">
              <span style="line-height: 50px">VTX</span>
            </div>
          </q-input>
          <q-input v-model="duration" class="input-input" outlined rounded color="purple" label="Duration">
            <div class="flex justify-end q-pr-sm">
              <span style="line-height: 50px">Month</span>
            </div>
          </q-input>
          <q-select
            light
            separator
            rounded
            outlined
            class="select-input"
            v-model="typeProposal"
            :options="[
              {label: 'Marketing', value:'Marketing'},
              {label: 'Security', value:'Security'},
              {label: 'Legal', value:'Legal'},
              {label: 'Development & maintenance', value:'Development & maintenance'}
            ]"
            label="Type"
          />
          <div class="q-mt-lg q-pa-sm">
            <q-slider
              v-model="securityProposal"
              markers
              snap
              :min="1"
              :max="4"
              label
              :label-value="'Security level ' + securityProposal"
              label-always
              color="purple"
            />
          </div>
          <div class="q-mt-sm q-pa-sm">
            <q-slider
              v-model="financialProposal"
              markers
              snap
              :min="1"
              :max="10"
              label
              :label-value="'Financial level ' + financialProposal"
              label-always
              color="green"
            />
          </div>
          <div class="q-mt-sm q-pa-sm">
            <q-slider
              v-model="decentralizationProposal"
              markers
              snap
              :min="1"
              :max="10"
              label
              :label-value="'Decentralization level ' + decentralizationProposal"
              label-always
              color="orange"
            />
          </div>
          <div class="q-mt-sm q-pa-sm">
            <q-slider
              v-model="anonymityProposal"
              markers
              snap
              :min="1"
              :max="10"
              label
              :label-value="'Anonymity level ' + anonymityProposal"
              label-always
              color="blue"
            />
          </div>
          <div class="">
            <span class="lab-input">Proposal</span>
            <span class="lab-input" style="font-size: .9em;opacity: .5;margin-top: 0px; margin-bottom: 10px;">Drag the toolbar to the right to see more options</span>
            <!-- <q-editor
              v-model="editor"
              :dense="$q.screen.lt.md"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  },
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: [
                      'p',
                      'h1',
                      'h2',
                      'h3',
                      'h4',
                      'h5',
                      'h6',
                      'code'
                    ]
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7'
                    ]
                  },
                  {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana'
                    ]
                  },
                  'removeFormat'
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource']
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana'
              }"
            /> -->
            <div class="container editor-wrapper">
              <!-- <markdown-editor v-model="editor"></markdown-editor> -->
              <!-- <markdown-editor toolbar="bold italic upload" @command:upload="upload" :extend="custom"> </markdown-editor> -->
              <markdown-editor v-model="editor" toolbar="bold italic heading | image link | numlist bullist code quote | preview fullscreen"></markdown-editor>
            </div>
          </div>
        </div>
        <br>
      </div>

      <div class="standard-content--footer">
         <q-btn @click="isPrivateKeyEncrypted ? privateKeyDialog = true : submitdraft()" flat class="action-link next" color="black" text-color="white" label="Submit Draft" />
      </div>
      <img src="statics/draft_bg.png" class="draft_bg" alt="">
    </div>
  </q-page>
</template>

<script>
// import { Notify } from 'quasar'

import EosWrapper from '@/util/EosWrapper'

const eos = new EosWrapper()
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears
} from 'quasar'
import 'v-markdown-editor/dist/v-markdown-editor.css'

import Vue from 'vue'
import Editor from 'v-markdown-editor'

// global register
Vue.use(Editor)

export default {
  components: {},
  data () {
    return {
      custom: {
        'upload': {
          cmd: 'upload',
          ico: 'fas fa-upload',
          title: 'Upload File'
        }
      },
      proposals: [],
      drafts: [],
      transErrorDialog: false,
      privateKeyDialog: false,
      typeProposal: '',
      securityProposal: 1,
      financialProposal: 1,
      decentralizationProposal: 1,
      anonymityProposal: 1,
      // timer: null,
      transactError: false,
      ErrorMessage: '',
      privateKey: {
        success: null
      },
      isPwd: true,
      isPrivateKeyEncrypted: false,
      invalidPrivateKeyPassword: false,
      privateKeyPassword: null,
      vertoPasswordTemp: null,
      proposal_name: 'mywps',
      title: 'My WPS Title',
      monthly_budget: '100.00000000 VTX',
      duration: '1',
      editor: '**Proposal text goes here** ' + '* Item 1 ' + '* Item 2 ',
      // editor: '<b>Proposal</b> text goes here <ol><li>Item 1</li><li>Item 2</li></ol>',
      description: 'short brief goes here'
      // proposal_json: '[{"key":"description", "value":""}]'
      // [{"key":"description", "value":""}]
    }
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    },
    isValid () {
      return this.description.length <= 30
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
  },
  mounted () {
  },
  methods: {
    upload (md) {
      md.drawImage({ url: 'https://i.imgur.com/CbCXhBe.png', title: 'this image title' })
    },
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
    async transact (actions) {
      try {
        if (this.checkPrivateKeyPassword()) {
          this.showLoading()
          await eos.transact({ actions }, { keyProvider: this.privateKey.key })
        } else if (!this.isPrivateKeyEncrypted) {
          this.showLoading()
          await eos.transact({ actions }, { keyProvider: this.privateKey.key })
        }
      } catch (error) {
        // FIXME with userError handler
        // userError(JSON.parse(e).message)
        console.log('error-----------------------------', error)
        if (error.message.includes('maximum billable CPU time')) {
          this.transactError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.message.includes('draft already exists')) {
          this.transactError = true
          this.ErrorMessage = 'The proposal Name is already exist.'
        } else if (error.message.includes('has insufficient ram')) {
          this.transactError = true
          this.ErrorMessage = 'Account has insufficient RAM to process the transaction.'
        } else if (error.message.includes('must be a minimum of 100.00000000 VTX')) {
          this.transactError = true
          this.ErrorMessage = 'You need a minimum of 100 VTX to create a draft'
        } else if (error.message.includes('user must stake before they can vote')) {
          this.transactError = true
          this.ErrorMessage = 'You must stake before you can vote!'
        }

        clearTimeout(this.timer)
        Loading.hide()
        this.privateKeyDialog = false
        this.transErrorDialog = true

        // Notify.create({ message: e.message ? e.message : e })

        // throw error
      }
    },
    async submitdraft () {
      this.transactError = false
      console.log('this.editor-- ', this.editor)
      const { proposal_name, title, monthly_budget, duration } = this
      await this.transact([{
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
          proposal_json: JSON.parse(`[{"key":"description", "value":"${this.description}"},{"key":"proposal", "value":"${this.editor}"},{"key":"type", "value":"${this.typeProposal.value}"},{"key":"security", "value":"${this.securityProposal}"},{"key":"financial", "value":"${this.financialProposal}"},{"key":"decentralization", "value":"${this.decentralizationProposal}"},{"key":"anonymity", "value":"${this.anonymityProposal}"}]`)
        }
      }])
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.wallet.privateKeyEncrypted)
      console.log('privateKeyEncrypted', privateKeyEncrypted)
      const privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (privateKey.success) {
        this.invalidPrivateKeyPassword = false
        this.privateKey = privateKey
        return true
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    showLoading () {
      Loading.show({
        spinner: QSpinnerGears
      })
      this.timer = setTimeout(() => {
        Loading.hide()
        this.timer = void 0
        if (this.checkPrivateKeyPassword()) {
          this.$router.push({ path: '/verto/card-wps/public-proposals/draft' })
        } else if (!this.isPrivateKeyEncrypted) {
          this.$router.push({ path: '/verto/card-wps/public-proposals/draft' })
        }
      }, 10000)
    }
  },
  beforeDestroy () {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      Loading.hide()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh !important;
    padding-bottom: 100px;
    .draft_bg{
      max-width: 200px;
      margin-left: -42px;
      margin-top: -40px;
    }
    &--title{
      font-size: 30px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 30px;
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
      &__img{
        min-height: 250px;
        img{
          max-width: 90%;
        }
      }
      .total-fee{
        padding: 0px 20px;
        font-family: $Titillium;
        font-weight: $regular;
        color: #B0B0B0;
        font-size: 16px;
      }
      &__form{
        .tokenID{
          text-transform: uppercase;
          font-size: 20px;
          font-weight: 900;
          color: #7271fa;
          padding-top: 0px;
          margin-top: -2px;
        }
        /deep/ .q-field__native{
          padding-left: 8px;
          font-size: 16px;
          font-weight: $regular;
        }
        /deep/ .q-field__label{
          font-family: $Titillium;
          font-weight: $regular;
          font-size: 16px;
          padding-left: 10px;
          margin-top: -2px;

        }
        .input-input{
          height: 50px;
          margin-bottom: 10px;
          /deep/ .q-field__bottom{
            transform: translateY(24px);
          }
          &.q-textarea{
            height: 150px;
          }
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
              padding-left: 7px;
              padding-top: 0px;
              padding-bottom: 0px;
              height: 18px;
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
          padding-left: 0px;
          padding-bottom: 0px;
          margin-top: 20px;
          display: block;
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
        }
      }
    }
    &--footer{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      min-height: fit-content;
    }
  }
  .send-modal{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(black, .5);
    left: 0px;
    top: 0px;
    z-index: 999999;
    visibility: hidden;
    opacity: 0;
    transition: opacity ease .4s;
    &.open{
      visibility: visible;
      opacity: 1;
      .send-modal__content{
        transform: scale(1);
      }
    }
    &__content{
      background-color: #fff;
      border-radius: 20px;
      max-width: 85%;
      padding: 20px;
      width: 100%;
      box-shadow: 0px -2px 9px 0px rgba(black, .29);
      position: relative;
      transform: scale(0);
      transition: ease transform .3s, opacity ease .2s;
      &--head{
        margin-bottom: 20px;
        .close-btn{
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 40px;
          font-weight: $light;
          font-family: $Titillium;
          height: 40px;
          width: 40px;
          min-height: unset;
          opacity: .3;
          /deep/ .q-btn__content{
            transform: rotate(45deg);
            min-height: unset;
            line-height: 30px;
            margin-left: 5px;
            margin-top: -4px;
          }
        }
        .--amount{
          font-size: 25px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
          position: relative;
          top: -9px;
        }
      }
      &--body{
        position: relative;
        .svg_logo{
          fill: #00D0CA;
          position: absolute;
          margin-top: 5px;
          width: 50px;
        }
        .--label{
          font-size: 14px;
          font-weight: $regular;
          font-family: $Titillium;
          position: absolute;
          bottom: -15px;
        }
      }
      &--footer{
        .--email{
          font-size: 16px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
        }
        .--error{
          color: red;
          font-size: 14px;
          margin-top: 20px;
          font-weight: $bold;
          font-family: $Titillium;
          line-height: 16px;
        }
      }
    }
  }
  .max200{
    max-width: 200px;
  }
  .mt-5{
    margin-top: -5px;
  }
  .mr10{
    margin-right: 10px;
  }
  .action-link{
    height: 50px;
    text-transform: initial !important;
    font-size: 16px;
    letter-spacing: .5px;
    border-radius: 40px;
    width: 150px;
    margin-left: 10px;
    background-color: #7272FA !important;
    // &.next{
    //   background-color: #7900FF !important;
    // }
    // &.back{
    //   background-color: #B0B0B0 !important;
    // }
    &.auto-width{
      width: auto;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .editor-wrapper{
    /deep/ .v-md-toolbar{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .btn-group{
        .btn{
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
