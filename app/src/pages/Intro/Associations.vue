<template>
  <q-page class="flex flex-center text-white">
    <q-card class="q-pa-sm bg-black" flat>
      <q-card-section class="text-weight-bold text-white text-center">
        <div class="float-center q-pa-sm text-uppercase">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('associations/index')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium q-pa-xl">Wallet Associations</big>
          <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/vertomanager')"/>
        </div>
      </q-card-section>
      <q-card-section class="text-center text-white">
        <div>
          <div class="float-center q-pa-sm">
            <div class="q-pa-md" style='border-style: solid;'>
              <div class="text-h4" v-show="venueStatus.found && !venueStatus.toggle">
                <span class="float-left" v-show="venueStatus.associated">
                  <q-icon name="thumb_up" color="green"/>
                </span>
                <span class="float-left" v-show="!venueStatus.associated">
                  <q-icon name="thumb_down" color="red"/>
                </span>
                <span class="float-center text-h6">
                  Link with Venue for Bounties
                </span>
                <span class="float-right" v-show="!venueStatus.toggle && !venueStatus.associated" @click="venueStatus.toggle = !venueStatus.toggle">
                  <q-icon name="edit" color="green"/>
                </span>
              </div>
              <div v-show="venueStatus.toggle">
                <span class="float-center text-h6">
                  Link with Venue for Bounties
                </span>
                <span class="float-right" v-show="venueStatus.found" @click="venueStatus.toggle = !venueStatus.toggle">
                  <q-icon name="close" color="red"/>
                </span>
                 <div class="q-pa-lg">
                   <span class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" label="Yes" to="/associate-venue" />
                   </span>
                  <span  class="q-pa-md" v-show="!venueStatus.found">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" label="Not Now" @click="noThanksVenue()" />
                  </span>
                </div>
              </div>
            </div>
            <br>
            <div class="q-pa-md" style='border-style: solid;'>
              <div class="text-h4" v-show="blocktopusStatus.found && !blocktopusStatus.toggle">
                <span class="float-left" v-show="blocktopusStatus.associated">
                  <q-icon name="thumb_up" color="green"/>
                </span>
                <span class="float-left" v-show="!blocktopusStatus.associated">
                  <q-icon name="thumb_down" color="red"/>
                </span>
                <span class="float-center text-h6">
                  KYC to pay with Bitcoin on Blocktopus
                </span>
                <span class="float-right" v-show="!blocktopusStatus.toggle && !blocktopusStatus.associated" @click="blocktopusStatus.toggle = !blocktopusStatus.toggle">
                  <q-icon name="edit" color="green"/>
                </span>
              </div>
              <div v-show="blocktopusStatus.toggle">
                <span class="float-center text-h6">
                  KYC to pay with Bitcoin on Blocktopus
                </span>
                <span class="float-right" v-show="blocktopusStatus.found" @click="blocktopusStatus.toggle = !blocktopusStatus.toggle">
                  <q-icon name="close" color="red"/>
                </span>
                <div class="q-pa-lg">
                  <span class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" :label="$t('AssociateView.create')" to="/blocktopusCreate" />
                  </span>
                  <span class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" :label="$t('AssociateView.login')" to="/blocktopusAssociate" />
                  </span>
                  <span class="q-pa-md">
                    <span v-show="!blocktopusStatus.found">
                      <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" label="Not Now" @click="notNowBlocktopus()" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <br>
            <div class="q-pa-md" style='border-style: solid;'>
              <div class="text-h4" v-show="zixipayStatus.found && !zixipayStatus.toggle">
                <span class="float-left" v-show="zixipayStatus.associated">
                  <q-icon name="thumb_up" color="green"/>
                </span>
                <span class="float-left" v-show="!zixipayStatus.associated">
                  <q-icon name="thumb_down" color="red"/>
                </span>
                <span class="float-center text-h6">
                  KYC to pay with USD, EURO, GEL, USDT or ETH
                </span>
                <span class="float-right" v-show="!zixipayStatus.toggle && !zixipayStatus.associated" @click="zixipayStatus.toggle = !zixipayStatus.toggle">
                  <q-icon name="edit" color="green"/>
                </span>
              </div>
              <div v-show="zixipayStatus.toggle">
                <span class="float-center text-h6">
                  KYC to pay with USD, EURO, GEL, USDT or ETH
                </span>
                <span class="float-right" v-show="zixipayStatus.found" @click="zixipayStatus.toggle = !zixipayStatus.toggle">
                  <q-icon name="close" color="red"/>
                </span>
                 <div class="q-pa-lg">
                   <span  class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" label="Yes, I have an account with Zixipay" @click="nowZixipay()" />
                   </span>
                  <span  class="q-pa-md" v-show="!zixipayStatus.found">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-popup size="md" label="Not Now" @click="notNowZixipay()" />
                  </span>
                </div>
              </div>
            </div>
            <br>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="passwordModal" minimized ref="modalRef">
      <q-card class="bg-black text-white q-pa-lg" style="max-width: 500px; width: 100%;">
      <q-icon class="float-right" name="close" size="1.5rem" color="white" @click.native="passwordModal = !passwordModal"/>
      <div class="text-center">
        <div class="text-h4 q-mb-md">Verto Password</div>
        <div class="q-pa-sm">
          <!-- <q-field
              dark
              :error="vertoPasswordEmpty"
              v-bind:error-label="$t('Welcome.incorrect')"
            > -->
            <q-input
              dark
              type="password"
              @keyup.enter="addAssociation"
              v-model="vertopassword"
              color="green"
              :error="vertoPasswordEmpty"
              bottom-slots
              v-bind:label="$t('CreateVertoPassword.vertopassword')"
             >
              <template v-slot:error>
                {{$t('Welcome.incorrect')}}
              </template>
            </q-input>
            <!-- </q-field> -->
        </div>
        <div class="q-pa-sm">
          <div>
            <q-btn dark color='white' outline @click="addAssociation">OK</q-btn>
          </div>
        </div>
      </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      blocktopusStatus: {},
      venueStatus: {},
      zixipayStatus: {},
      passwordModal: false,
      vertoPasswordEmpty: false,
      vertopassword: '',
      associationNameForPassword: '',
      doneHere: false
    }
  },
  mounted () {
    this.checkAssociations()
  },
  methods: {
    doneHereNow () {
      this.$router.push('summary-vtx')
    },
    checkAssociations () {
      this.checkIfAssociatedWithVenue()
      this.checkIfAssociatedWithBlocktopus()
      this.checkIfAssociatedWithZixipay()
      this.doneHere = this.$store.state.currentwallet.wallet.setupcomplete
    },
    noThanksVenue () {
      this.associationNameForPassword = 'KnowVenue'
      this.passwordModal = !this.passwordModal
    },
    notNowBlocktopus () {
      this.associationNameForPassword = 'KnowBlocktopus'
      this.passwordModal = !this.passwordModal
    },
    notNowZixipay () {
      this.associationNameForPassword = 'KnowZixipay'
      this.passwordModal = !this.passwordModal
    },
    nowZixipay () {
      this.associationNameForPassword = 'Zixipay'
      this.passwordModal = !this.passwordModal
    },
    addAssociation () {
      const self = this
      this.$configManager.addAssociationToWallet(
        self.$store.state.currentwallet.wallet.key,
        this.vertopassword,
        this.associationNameForPassword,
        { foundAllAssociations: this.isSetupComplete() }
      ).then(function (result) {
        if (result.success) {
          self.checkAssociations()
          self.passwordModal = false
        } else {
          self.vertoPasswordEmpty = true
        }
      }).catch(function (err) {
        if (err) {
          // TODO: Exception handling
        }
        self.vertoPasswordEmpty = true
      })
    },
    isSetupComplete () {
      const associations = this.listAllAssociations()
      let name = this.associationNameForPassword
      if (name.startsWith('Know')) {
        name = name.substring(4)
      }
      associations[name.toLowerCase()] = {
        known: false,
        associated: false,
        found: true,
        toggle: false
      }
      return associations.foundAll()
    },
    listAllAssociations () {
      return {
        blocktopus: this.checkIfAssociated('Blocktopus'),
        zixipay: this.checkIfAssociated('Zixipay'),
        venue: this.checkIfAssociated('Venue'),
        foundAll: function () {
          return this.blocktopus.found && this.zixipay.found && this.venue.found
        }
      }
    },
    checkIfAssociated (associationName) {
      const rvalue = {
        known: false,
        associated: false,
        found: false,
        toggle: false,
        setToggle: function () {
          if (!this.known && !this.associated && !this.found) {
            this.toggle = true
          }
        }
      }
      if (this.$store.state.currentwallet.wallet.associations) {
        for (var i = 0; i < this.$store.state.currentwallet.wallet.associations.length; i++) {
          const name = this.$store.state.currentwallet.wallet.associations[i].name
          if (name === ('Know' + associationName)) {
            rvalue.known = true
            rvalue.found = true
          } else if (name === associationName) {
            rvalue.associated = true
            rvalue.found = true
          }
        }
      }
      rvalue.setToggle()
      return rvalue
    },
    checkIfAssociatedWithBlocktopus () {
      this.blocktopusStatus = this.checkIfAssociated('Blocktopus')
    },
    checkIfAssociatedWithZixipay () {
      this.zixipayStatus = this.checkIfAssociated('Zixipay')
    },
    checkIfAssociatedWithVenue () {
      this.venueStatus = this.checkIfAssociated('Venue')
    }
  }
}
</script>

<style>
</style>
