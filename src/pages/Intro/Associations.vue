<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card class="q-pa-sm" flat>
      <q-card-title class="text-weight-bold text-white text-center">
        <div class="float-center q-pa-sm uppercase">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('associations/index')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium q-pa-xl">Wallet Associations</big>
          <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/vertomanager')"/>
        </div>
      </q-card-title>
      <q-card-main class="text-center text-white">
        <div>
          <div class="float-center q-pa-sm">
            <div class="q-pa-md" style='border-style: solid;'>
              <div class="q-display-1" v-show="venueStatus.found && !venueStatus.toggle">
                <span class="float-left" v-show="venueStatus.associated">
                  <q-item-side icon="thumb_up" color="green"/>
                </span>
                <span class="float-left" v-show="!venueStatus.associated">
                  <q-item-side icon="thumb_down" color="red"/>
                </span>
                <span class="float-center q-title">
                  Link with Venue for Bounties
                </span>
                <span class="float-right" v-show="!venueStatus.toggle && !venueStatus.associated" @click="venueStatus.toggle = !venueStatus.toggle">
                  <q-item-side icon="edit" color="green"/>
                </span>
              </div>
              <div v-show="venueStatus.toggle">
                <span class="float-center q-title">
                  Link with Venue for Bounties
                </span>
                <span class="float-right" v-show="venueStatus.found" @click="venueStatus.toggle = !venueStatus.toggle">
                  <q-item-side icon="close" color="red"/>
                </span>
                 <div class="q-pa-lg">
                   <span class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" label="Yes" to="/associate-venue" />
                   </span>
                  <span  class="q-pa-md" v-show="!venueStatus.found">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" label="Not Now" @click="noThanksVenue()" />
                  </span>
                </div>
              </div>
            </div>
            <br>
            <div class="q-pa-md" style='border-style: solid;'>
              <div class="q-display-1" v-show="blocktopusStatus.found && !blocktopusStatus.toggle">
                <span class="float-left" v-show="blocktopusStatus.associated">
                  <q-item-side icon="thumb_up" color="green"/>
                </span>
                <span class="float-left" v-show="!blocktopusStatus.associated">
                  <q-item-side icon="thumb_down" color="red"/>
                </span>
                <span class="float-center q-title">
                  KYC to pay with Bitcoin on Blocktopus
                </span>
                <span class="float-right" v-show="!blocktopusStatus.toggle && !blocktopusStatus.associated" @click="blocktopusStatus.toggle = !blocktopusStatus.toggle">
                  <q-item-side icon="edit" color="green"/>
                </span>
              </div>
              <div v-show="blocktopusStatus.toggle">
                <span class="float-center q-title">
                  KYC to pay with Bitcoin on Blocktopus
                </span>
                <span class="float-right" v-show="blocktopusStatus.found" @click="blocktopusStatus.toggle = !blocktopusStatus.toggle">
                  <q-item-side icon="close" color="red"/>
                </span>
                <div class="q-pa-lg">
                  <span class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" :label="$t('AssociateView.create')" to="/blocktopusCreate" />
                  </span>
                  <span class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" :label="$t('AssociateView.login')" to="/blocktopusAssociate" />
                  </span>
                  <span class="q-pa-md">
                    <span v-show="!blocktopusStatus.found">
                      <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" label="Not Now" @click="notNowBlocktopus()" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <br>
            <div class="q-pa-md" style='border-style: solid;'>
              <div class="q-display-1" v-show="zixipayStatus.found && !zixipayStatus.toggle">
                <span class="float-left" v-show="zixipayStatus.associated">
                  <q-item-side icon="thumb_up" color="green"/>
                </span>
                <span class="float-left" v-show="!zixipayStatus.associated">
                  <q-item-side icon="thumb_down" color="red"/>
                </span>
                <span class="float-center q-title">
                  KYC to pay with USD, EURO, GEL, USDT or ETH
                </span>
                <span class="float-right" v-show="!zixipayStatus.toggle && !zixipayStatus.associated" @click="zixipayStatus.toggle = !zixipayStatus.toggle">
                  <q-item-side icon="edit" color="green"/>
                </span>
              </div>
              <div v-show="zixipayStatus.toggle">
                <span class="float-center q-title">
                  KYC to pay with USD, EURO, GEL, USDT or ETH
                </span>
                <span class="float-right" v-show="zixipayStatus.found" @click="zixipayStatus.toggle = !zixipayStatus.toggle">
                  <q-item-side icon="close" color="red"/>
                </span>
                 <div class="q-pa-lg">
                   <span  class="q-pa-md">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" label="Yes, I have an account with Zixipay" @click="nowZixipay()" />
                   </span>
                  <span  class="q-pa-md" v-show="!zixipayStatus.found">
                    <q-btn class="q-mb-sm q-mr-sm" outline color="white" v-close-overlay size="md" label="Not Now" @click="notNowZixipay()" />
                  </span>
                </div>
              </div>
            </div>
            <br>
          </div>
        </div>
      </q-card-main>
    </q-card>
    <q-modal v-model="passwordModal" minimized ref="modalRef">
      <q-icon class="float-right" name="close" size="1.5rem" color="white" @click.native="passwordModal = !passwordModal"/>
      <div class="text-center">
        <div class="q-display-1 q-mb-md">Verto Password</div>
        <div class="q-pa-sm">
          <q-field
              dark
              :error="vertoPasswordEmpty"
              v-bind:error-label="$t('Welcome.incorrect')"
            >
            <q-input
              dark
              type="password"
              @keyup.enter="addAssociation"
              v-model="vertopassword"
              color="green"
              v-bind:float-label="$t('CreateVertoPassword.vertopassword')"
            />
            </q-field>
        </div>
        <div class="q-pa-sm">
          <div>
            <q-btn dark color='white' outline @click="addAssociation">OK</q-btn>
          </div>
        </div>
      </div>
    </q-modal>
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
        {foundAllAssociations: this.isSetupComplete()}
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
