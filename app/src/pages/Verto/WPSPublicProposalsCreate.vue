<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <h2 class="standard-content--title flex flex-center"><q-btn flat unelevated class="btn-align-left" to="/verto/card-wps/public-proposals" text-color="black" icon="keyboard_backspace" />
      Create proposals </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <q-input v-model="proposal_name" class="input-input" outlined rounded color="purple" label="Proposal name (id)" />
          <q-input v-model="title" class="input-input" outlined rounded color="purple" label="Proposal Title" />
          <q-input v-model="monthly_budget" class="input-input" outlined rounded color="purple" label="Budget" />
          <q-input v-model="duration" class="input-input" outlined rounded color="purple" label="Duration" />
          <!-- <q-editor v-model="editor" min-height="5rem" /> -->
          <!-- <q-editor v-model="proposal_json" rounded outlined min-height="5rem" color="purple" /> -->
          <!-- <q-input v-model="proposal_json" rounded outlined class="" color="purple" type="textarea" label="Proposal json"/> -->
          <div class="">
            <span class="lab-input">Proposal description</span>
            <span class="lab-input" style="font-size: .9em;opacity: .5;margin-top: 0px; margin-bottom: 10px;">Drag the toolbar to the right to see more options</span>
            <q-editor
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
            />
          </div>
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
          <div class="error text-h6 text-red" v-if="transactError">{{ErrorMessage}}</div>
        </div>
        <br>
        <!-- <div class="total-fee flex justify-between">
          <span class="label">Total Fee</span>
          <span class="value">0.03254 {{ params.tokenID }}</span>
        </div> -->
      </div>

      <div class="standard-content--footer">
         <q-btn @click="submitdraft" flat class="action-link next" color="black" text-color="white" label="Submit Draft" />
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

export default {
  components: {
  },
  data () {
    return {
      proposals: [],
      drafts: [],
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
      monthly_budget: '8.00000000 VTX',
      duration: '2',
      editor: '<b>Proposal</b> description'
      // proposal_json: '[{"key":"description", "value":""}]'
      // [{"key":"description", "value":""}]
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
  },
  mounted () {
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
    async transact (actions) {
      try {
        await eos.transact({ actions }, { keyProvider: this.privateKey.key })
        this.$router.push({ path: '/verto/card-wps/public-proposals/draft' })
      } catch (error) {
        // FIXME with userError handler
        // userError(JSON.parse(e).message)
        console.log('error-----------------------------', error)
        if (error.includes('maximum billable CPU time')) {
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
    async submitdraft () {
      this.transactError = false
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
          proposal_json: JSON.parse(`[{"key":"description", "value":"${this.editor}"}]`)
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
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
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
      font-size: 35px;
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
          font-size: 18px;
          padding-left: 10px;
          margin-top: -2px;
        }
        .input-input{
          height: 50px;
          margin-bottom: 10px;
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
      }

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
</style>
