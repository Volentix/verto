<template>
  <q-page class="flex flex-center text-white bg-black">
    <div v-show='showzixipay'>
      <q-card class="bg-black" style="max-width: 500px;" flat>
        <q-card-section class="bg-black text-weight-bold text-white text-center text-uppercase">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('getvtx/zixipay')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          powered by
          <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('summary-vtx')"/>
          <p>
            <img
              src="statics/img/zixipay.png"
              style="width:50vw;max-width: 250px;"
            >
          </p>
        </q-card-section>
        <q-stepper v-model="step" done-color="green" active-color="green" color="green bg-white" ref="stepper" alternative-labels animated>
          <q-step default :order="1" :name="1" :done="step>1" title="Select Currency" class=" bg-black workflow-step">
            <q-card-section class="text-center text-white text-uppercase">
              <div class="q-pa-md">
                  <div class="q-pa-sm">
                      <q-select dark separator v-model="form.currency" :options="options" />
                  </div>
                  <div class="q-pa-md" @click="$refs.stepper.next()">
                    <q-icon name="navigate_next" size="3.2rem" color="green">
                      <q-tooltip>{{ $t('next') }}</q-tooltip>
                    </q-icon>
                  </div>
              </div>
            </q-card-section>
          </q-step>
          <q-step :name="2" :done="step>2"  :order="2" title="Amount" class="bg-black workflow-step">
            <q-card-section class=" text-white">
              <div class="float-center text-center">
                <div class="">
                  <span class="q-pa-sm">
                    <q-input
                      class="q-pa-sm"
                      type="number"
                      dark
                      v-model="form.amount"
                      color="yellow"
                      label="Amount"
                      @blur="$v.form.amount.$touch"
                      :error="$v.form.amount.$error"
                    />
                  </span>
                  <div class="q-pa-sm" v-show="form.amount > 0" @click="$refs.stepper.next()" >
                    <q-icon name="navigate_next" size="3.2rem" color="green"   >
                      <q-tooltip>{{ $t('next') }}</q-tooltip>
                    </q-icon>
                  </div>
                </div>
                <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
              </div>
            </q-card-section>
          </q-step>
          <q-step :name="3" :done="step>3" :order="3" title="Description" class="bg-black workflow-step">
            <q-card-section class="text-white">
              <div class="float-center text-center">
                <div class="">
                  <span class="q-pa-sm">
                    <q-input
                      class="q-pa-sm"
                      type="text"
                      dark
                      v-model="form.description"
                      color="yellow"
                      label="Description"
                    />
                  </span>
                  <div class="q-pa-sm" v-show="form.description" @click="submit" >
                    <q-icon name="navigate_next" size="3.2rem" color="green"   >
                      <q-tooltip>{{ $t('Main.getvtx') }}</q-tooltip>
                    </q-icon>
                  </div>
                </div>
                <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
                <q-inner-loading :visible="spinnervisible">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
              </div>
            </q-card-section>
          </q-step>
        </q-stepper>
      <form action="https://zixipay.com/sci/form"  method="POST" id='zixiform' ref='zixiform' target="zixipayiframe" style="display: none;">
        <input type="hidden" name="merchant" :value="zixipayForm.merchantid" />
        <input type="hidden" name="description" :value="zixipayForm.description" />
        <input type="hidden" name="amount" :value="zixipayForm.amount" />
        <input type="hidden" name="currency" :value="zixipayForm.currency" />
        <input type="hidden" name="custom" :value="zixipayForm.custom" />
        <input type="hidden" name="hash" :value="zixipayForm.hash" />
      </form>
      </q-card>
    </div>
    <div v-show='showiframe' class="full-width window-height" id="zixipayiframediv">
      <iframe   name="zixipayiframe" src="https://zixipay.com/sci/form" id="zixipayiframe">
      </iframe>
    </div>
    <div class="text-center text-white" v-show="showsuccess">
      <div class="text-h2 text-uppercase text-green q-pa-lg">
        Success
      </div>
      <div class="q-pa-md">
        <q-btn color="white" outline glossy flat @click="getmorevtx()">
          <div class="text-h5 text-uppercase">
            Get more VTX
          </div>
        </q-btn>
      </div>
      <div class="q-pa-md">
        <q-btn color="white" outline glossy flat @click="$router.push('/wallet')">
          <div class="text-h5 text-uppercase">
            Done
          </div>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { userError } from '@/util/errorHandler'
import EventBus from '../../bus'
import { nextTick } from 'q'

const now = new Date()

export default {
  // name: 'PageName',
  data () {
    return {
      zixipayForm: {},
      spinnervisible: false,
      step: 1,
      showzixipay: true,
      showiframe: false,
      showsuccess: false,
      form: {
        description: 'Getting VTX',
        amount: 0,
        currency: 'USD',
        merchantid: process.env[this.$store.state.settings.network].ZIXIPAY_MERCHANT_ID
      },
      lazy: [],
      zixiusername: '',
      zixipassword: '',
      options: [
        {
          label: 'US DOLLARS',
          value: 'USD'
        },
        {
          label: 'EURO',
          value: 'EUR'
        },
        {
          label: 'BITCOIN',
          value: 'BTC'
        },
        {
          label: 'ETHEREUM',
          value: 'ETH'
        }
      ]
    }
  },
  validations: {
    form: {
      amount: { required }
    }
  },
  beforeMount () {
    EventBus.addListener(this.callback)
  },
  destroyed () {
    EventBus.removeListener(this.callback)
  },
  methods: {
    submit () {
      const custom = 'crowdfund:' + this.$store.state.currentwallet.wallet.key + ':' + now.getTime() // + ':1554818157020' //
      const self = this
      const url = process.env[this.$store.state.settings.network].CROWDFUND_URL + 'public/api/zixipay-create-hash/'

      this.$axios.post(
        url,
        {
          merchant: this.form.merchantid,
          custom: custom,
          amount: this.form.amount,
          currency: this.form.currency
        }
      ).then(function (result) {

        self.zixipayForm = {
          merchantid: self.form.merchantid,
          description: self.form.description,
          amount: self.form.amount,
          currency: self.form.currency,
          hash: result.data.hash,
          custom
        }

        const zixiform = self.$refs['zixiform']

        nextTick(function () {
          zixiform.submit()
        })

        self.spinnervisible = true
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        sleep(2000).then(() => {
          self.showiframe = true
          self.showzixipay = false
          self.spinnervisible = false
        })
      }).catch((err) => {
        console.log(err)
        userError('There was a problem reaching the server')
      })
    },
    getmorevtx: function () {
      this.$refs.stepper.goTo(1)
      this.showsuccess = false
      this.showzixipay = true
    },
    callback: function (e) {
      if (e.data && (typeof e.data === 'string' || e.data instanceof String)) {
        if (e.data.startsWith('success')) {
          this.showsuccess = true
          this.showiframe = false
        } else if (e.data.startsWith('cancel')) {
          this.$router.push({ path: 'wallet' })
        } else if (e.data.startsWith('fail')) {
          this.spinnervisible = false
          this.$router.push('summary-vtx')
          userError('The transaction was not approved, contact zixipay')
        }
      }
    }
  }
}
</script>

<style>
#zixipayiframe
{
    height:   100%;
    width:    100%;
}
#zixipayiframediv
{
    height:   100%;
    width:    100%;
}
</style>
