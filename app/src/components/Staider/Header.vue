<template>
  <div class="main-header" :class="{'backdrop': $q.screen.width >= 768}">
    <div class="container">
      <div v-if="$q.screen.width >= 768" class="row justify-between disktop-version-wrapper">
        <div class="col-3 main-logo">
          <router-link to="/">
            <img src="statics/staider/staider_logo_white.svg" alt="">
          </router-link>
        </div>
        <div v-if="appSiteMode === 'site'" class="col-6 main-menu flex justify-center items-center">
          <nav class="full-width flex justify-center items-center">
            <!-- <router-link to="/about">About Staider</router-link>
            <router-link to="/faq">FAQ</router-link>
            <router-link to="/documentation">Documentation</router-link>
            <router-link to="/blog">Blog</router-link> -->
            <a href="javascript:void(0)" @click="scrollToSection('home')">About</a>
            <a href="javascript:void(0)" @click="scrollToSection('vaults')">Vaults</a>
            <a href="javascript:void(0)" @click="scrollToSection('faqs')">FAQs</a>
          </nav>
        </div>
        <div v-if="!connected" class="col-3 download-btn flex justify-end items-center">
          <q-btn color="white" class="shadow1" no-caps text-color="white" @click="connectPopup = true" outline rounded label="Connect Wallet" />
        </div>
        <div v-if="connected" class="col flex justify-end items-center">
          <q-btn color="white" outline unelevated class="account-bar q-pl-none" no-caps rounded text-color="white">
            <div class="row items-center account-bar_row">
              <div class="col bg-black q-mr-md account-balance flex flex-center">
                <span class="q-pl-sm">{{formatNumber($store.state.currentwallet.user.balance, 3)}} ETH</span>
              </div>
              <div class="col flex account-address items-center justify-between q-mr-lg">
                <span class="short-address q-mr-md">{{accountAddress}}</span>
                <span class="identicon" v-html="avatar(accountAddress)" />
              </div>
            </div>
          </q-btn>
          <q-btn to="/summary" color="white" class="connect-wallet q-ml-md q-mr-md" no-caps text-color="white" outline rounded label="My holdings" />
          <q-btn v-if="false" round color="grey-6" flat icon="more_vert" />
          <q-btn-dropdown
            class="dropdown-wrapper-btn" :class="{'active': toggleActive}"
            rounded
            color="grey-6"
            flat
            @click="toggleActive = !toggleActive"
            @hide="toggleActive = false"
            dark
            icon="more_vert"
            content-class="dropdown-wrapper"
          >
            <div class="column no-wrap dropdown-content">
              <div class="column nav q-pa-md text-white">
                <router-link to="/funds" class="text-white">Explore funds</router-link>
                <router-link to="/faq" class="text-white">FAQs</router-link>
              </div>
              <q-separator dark horizontal inset class="q-mx-none" />
              <div class="column items-center q-pa-md">
                <q-btn
                  color="white"
                  label="Disconnect"
                  rounded
                  @click="connected = false;connectingMetamask = false;connectingWalletConnect = false;toggleActive = false"
                  no-caps
                  flat
                  icon="img:statics/staider/icon_disconnect.svg"
                  class="full-width disconnect-btn"
                  v-close-popup
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </div>
      <div v-else class="row mobile-version-wrapper">
        <div class="main-logo" :class="{'col-3': connected, 'col-3': !connected}">
          <router-link to="/">
            <img src="statics/staider/sif_logo_white.svg" alt="">
          </router-link>
        </div>
        <div v-if="!connected" class="col-9 main-menu flex justify-end items-center">
          <q-btn color="white" class="shadow1 q-mr-sm" no-caps text-color="white" @click="connectPopup = true" outline rounded label="Connect Wallet" />
          <q-btn color="white" @click="menuStatOpen = !menuStatOpen" flat class="q-pa-sm" text-color="black" dense>
            <svg v-if="!menuStatOpen" version="1.1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
              x="0px" class="menu-icon" fill="#FFFFFF" y="0px" width="24px" height="18px" viewBox="0 0 24 18" style="enable-background:new 0 0 24 18;" xml:space="preserve">
              <g id="XMLID_15_">
                <path id="XMLID_18_" class="st0" d="M4,2h19c0.6,0,1-0.4,1-1s-0.4-1-1-1H4C3.4,0,3,0.4,3,1S3.4,2,4,2z"/>
                <path id="XMLID_17_" class="st0" d="M23,8H1C0.4,8,0,8.4,0,9s0.4,1,1,1h22c0.6,0,1-0.4,1-1S23.6,8,23,8z"/>
                <path id="XMLID_16_" class="st0" d="M23,16H4c-0.6,0-1,0.4-1,1s0.4,1,1,1h19c0.6,0,1-0.4,1-1S23.6,16,23,16z"/>
              </g>
            </svg>
            <svg v-else version="1.1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
              x="0px" class="menu-icon" fill="#FFFFFF" y="0px" width="18.1px" height="18.1px" viewBox="0 0 18.1 18.1" style="enable-background:new 0 0 18.1 18.1;"
              xml:space="preserve">
              <g id="XMLID_15_">
                <path id="XMLID_17_" class="st0" d="M16.4,0.3L0.3,16.4c-0.4,0.4-0.4,1.1,0,1.5c0.4,0.4,1.1,0.4,1.5,0L17.8,1.8
                  c0.4-0.4,0.4-1.1,0-1.5C17.4-0.1,16.8-0.1,16.4,0.3z"/>
                <path id="XMLID_16_" class="st0" d="M0.3,1.8l16.1,16.1c0.4,0.4,1.1,0.4,1.5,0c0.4-0.4,0.4-1.1,0-1.5L1.8,0.3
                  c-0.4-0.4-1.1-0.4-1.5,0S-0.1,1.4,0.3,1.8z"/>
              </g>
            </svg>
          </q-btn>
        </div>
        <div v-if="connected" class="col-9 flex justify-end items-center">
          <q-btn color="white" outline unelevated class="account-bar q-pl-none" no-caps rounded text-color="white">
            <div class="row items-center account-bar_row">
              <div class="col bg-black q-mr-md account-balance flex flex-center">
                <span class="q-pl-sm">{{formatNumber($store.state.currentwallet.user.balance, 3)}} ETH</span>
              </div>
              <div class="col flex account-address items-center justify-between q-mr-lg">
                <span class="short-address q-mr-md">{{accountAddress}}</span>
                <span class="identicon" v-html="avatar(accountAddress)" />
              </div>
            </div>
          </q-btn>
          <q-btn to="/summary" color="white" v-if="$q.screen.width >= 768" class="connect-wallet q-ml-md q-mr-md" no-caps text-color="white" outline rounded label="My holdings" />
          <q-btn-dropdown
            class="dropdown-wrapper-btn" :class="{'active': toggleActive}"
            rounded
            color="grey-6"
            flat
            @click="toggleActive = !toggleActive"
            @hide="toggleActive = false"
            dark
            icon="more_vert"
            content-class="dropdown-wrapper"
          >
            <div class="column no-wrap dropdown-content">
              <div class="column nav q-pa-md text-white">
                <router-link v-if="$q.screen.width < 768" to="/summary" class="text-white">My holdings</router-link>
                <router-link to="/funds" class="text-white">Explore funds</router-link>
                <router-link to="/faq" class="text-white">FAQs</router-link>
              </div>
              <q-separator dark horizontal inset class="q-mx-none" />
              <div class="column items-center q-pa-md">
                <q-btn
                  color="white"
                  label="Disconnect"
                  rounded
                  @click="logout()"
                  no-caps
                  flat
                  icon="img:statics/staider/icon_disconnect.svg"
                  class="full-width disconnect-btn"
                  v-close-popup
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <div class="col-12 main-menu-fixed-mobile column justify-center items-center" :class="{'open':menuStatOpen}">
          <nav class="full-width column justify-start q-pa-md">
            <!-- <router-link to="/vaults">Explore vaults</router-link>
            <router-link to="/faq">FAQ</router-link>
            <router-link to="/documentation">Documentation</router-link>
            <router-link to="/blog">Blog</router-link> -->
            <a href="javascript:void(0)" @click="scrollToSection('home');menuStatOpen = false">About</a>
            <router-link to="/vaults" @click.native="menuStatOpen = false">Explore vaults</router-link>
            <a href="javascript:void(0)" @click="scrollToSection('faqs');menuStatOpen = false">FAQs</a>
          </nav>
          <div class="full-width socialmedia flex justify-start items-center q-pa-md q-mt-xl">
            <q-btn type="a" href="https://github.com/Volentix" target="_blank" color="white" class="q-mr-sm" text-color="white" dense rounded flat icon="img:statics/staider/github_icon.svg" />
             <!-- <q-btn type="a" href="https://www.youtube.com/channel/UCGjUbCE-kht1gK6y5neD1cQ" target="_blank" color="white" class="q-mr-sm" text-color="white" dense rounded flat icon="img:statics/theme2/youtube_icon.svg" /> -->
             <q-btn type="a" href="https://twitter.com/volentix" target="_blank" color="white" class="q-mr-sm" text-color="white" dense rounded flat icon="img:statics/staider/twitter_icon.svg" />
             <!-- <q-btn type="a" href="http://t.me/Volentix" target="_blank" color="white" class="" text-color="white" dense rounded flat icon="img:statics/theme2/telegram_icon.svg" /> -->
          </div>
          <div class="flex justify-center copyrights q-pa-md">
            <p>This project is created by <a href="http://volentixlabs.com" target="_blank">Volentix labs INC</a>. <br v-if="$q.screen.width < 768">Copyright © 2018 - All rights reserved</p>
          </div>
          <img src="statics/theme2/vulps_effect1.svg" class="vulps_effect4" alt="">
        </div>
      </div>
    </div>
    <q-dialog dark v-model="connectPopup">
      <q-card dark class="connect-popup-wrapper">
        <q-card-section class="row items-center q-pb-none">
          <div class="popup-title q-pl-sm">Account</div>
          <q-space />
          <q-btn icon="close" @click="connectPopup = false" size="sm" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section align="center">
          <div class="q-pa-md" v-if="!connectingMetamask && !connectingWalletConnect">
            <q-btn unelevated outline @click="connectToMetaMask" color="transparent" class="connect-provider-btn full-width q-pa-sm" no-caps text-color="white">
              <div class="flex justify-between items-center full-width">
                <span class="text-bold name">MetaMask</span>
                <q-icon size="md" name="img:statics/staider/icon_metamask.svg" />
              </div>
            </q-btn>
            <q-btn unelevated outline @click="connectToWalletConnect" color="transparent" class="connect-provider-btn full-width q-pa-sm q-mt-sm" no-caps text-color="white">
              <div class="flex justify-between items-center full-width">
                <span class="text-bold name">WalletConnect</span>
                <q-icon size="md" name="img:statics/staider/icon_walletconnect.svg" />
              </div>
            </q-btn>
          </div>
          <div v-if="connectingMetamask" class="flex connecting-wrapper flex-center full-width">
            <span class="text-bold name q-mr-lg">Connecting to MetaMask...</span>
            <q-icon size="md" name="img:statics/staider/icon_metamask.svg" />
          </div>
          <div v-if="connectingWalletConnect" class="flex connecting-wrapper flex-center full-width">
            <span class="text-bold name q-mr-lg">Connecting to WalletConnect...</span>
            <q-icon size="md" name="img:statics/staider/icon_walletconnect.svg" />
          </div>
          <p class="text-red" v-if="connectionError">{{connectionError}}</p>
        </q-card-section>
        <q-card-actions align="center" class="action-label">
          <span v-if="!connectingMetamask && !connectingWalletConnect" class="q-pb-md">Select a wallet to connect</span>
          <q-btn v-else color="white" class="q-pl-lg q-pr-lg" no-caps text-color="grey-6" @click="connectingMetamask = false; connectingWalletConnect = false; connectPopup = false" v-close-popup outline rounded label="Cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { toSvg } from 'jdenticon'
import Connect from '../../mixins/Connect'
import Formatter from '../../mixins/Formatter'
// import Enzyme from '../../util/Staider/EnzymeV4'
export default {
  // name: 'ComponentName',
  components: {
  },
  mixins: [Connect, Formatter],
  props: ['active', 'link', 'currentPage'],
  data () {
    return {
      connectingWalletConnect: false,
      connectingMetamask: false,
      connectPopup: false,
      connected: false,
      toggleActive: false,
      accountAddress: null,
      menuStatOpen: false
    }
  },
  computed: {
    appSiteMode () {
      return this.$route.meta.site ? 'site' : 'app'
    }
  },
  watch: {
    'connectionError': function (val) {
      if (val) {
        this.connectingMetamask = this.connectToWalletConnect = false
      }
    },
    '$store.state.currentwallet.user': {
      handler (val) {
        this.connectingMetamask = this.connectingMetamask = false

        if (val) {
          this.accountAddress = val.addressFriendly

          this.connected = true
          this.connectPopup = false
        } else {
          this.connected = false
          this.accountAddress = null
        }
      },
      deep: true,
      immediate: false
    },
    connectPopup: function (val) {
      if (val) {
        // alert('true')
        document.querySelector('.scroll_area_wrapper').classList.add('blur-effect')
      } else {
        // alert('false')
        document.querySelector('.scroll_area_wrapper').classList.remove('blur-effect')
      }
    }
  },
  async created () {

  },
  methods: {
    // toggleLightDarkMode (val) {
    //   window.localStorage.setItem('skin', val)
    //   this.$store.state.lightMode.lightMode = window.localStorage.getItem('skin')
    // },
    scrollToSection (sectionScrollName) {
      // let sectionScrollName = this.$route.params.currentSection
      let scrollTop = 0
      setTimeout(() => {
        console.log('scrollToSection', sectionScrollName)
        try {
          document.querySelector('#' + sectionScrollName).classList.add('activate-animation')
          scrollTop = document.querySelector('#' + sectionScrollName).offsetTop
        } catch (error) {
          console.log(error.message)
        }
        document.querySelector('#scroll_area_wrapper .scroll').scrollTop = parseInt(scrollTop) + (scrollTop > 0 ? -120 : 0)
      }, 100)
    },
    connectToWalletConnect () {
      this.connect('walletconnect')
      this.connectingWalletConnect = true
      setTimeout(() => {
        this.connectingWalletConnect = false
      }, 1000)
    },
    connectToMetaMask () {
      this.connect('metamask')
      this.connectingMetamask = true
    },
    avatar (name) {
      return toSvg(name, 30)
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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .main-header{
    padding-top: 15px;
    padding-bottom: 15px;
    @media screen and (max-width: 768px) {
      padding-bottom: 20px;
    }
    .h_line{
      position: relative;
      top: 5px;
    }
    /deep/ .connect-wallet{
      font-family: $MainFont !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      &.q-btn--outline .q-btn__wrapper:before {
        border: 1px solid #262626;
      }
    }
    .account-bar{
      font-family: $MainFont !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      &_row{
        .account-balance{
          margin-left: -20px;
          height: 38px;
          margin-top: -6px;
          margin-bottom: -6px;
        }
      }
    }
    /deep/ .account-bar{
      position: relative;
      overflow: hidden;
       &.q-btn--outline .q-btn__wrapper:before {
        border: 1px solid #262626;
      }
      .account-address{
        flex-wrap: nowrap;
        .identicon{
          transform: scale(.9);
          border-radius: 30px;
          outline: 1px solid #474747;
          width: 30px !important;
          height: 30px;
          position: relative;
          background: #FFF;
        }
      }
    }
  }
  .main-logo{
    img {
      height: 40px;
    }
  }
  .main-menu{
    nav{
      a{
        font-family: $MainFont;
        font-weight: 200;
        opacity: .7;
        &:hover{
          opacity: 1;
        }
        font-size: 14px;
        color: #FFF;
        text-decoration: none;
        padding: 5px 15px;
      }
    }
  }
  .download-btn{
    button{
      height: 40px;
      font-size: 14px !important;
      font-family: $MainFont !important;
    }
    /deep/ img{
      width: 16px;
      height: 16px;
    }
  }
  .mobile-version-wrapper{
    .main-menu-fixed-mobile{
      position: absolute;
      left: 0px;
      z-index: 2;
      top: 0px;
      width: 100vw;
      height: 100vh;
      max-width: unset;
      background: $gradient2;
      transition: transform cubic-bezier(0.39, 0.575, 0.565, 1) .35s,opacity cubic-bezier(0.39, 0.575, 0.565, 1) .35s;
      visibility: hidden;
      opacity: 0;
      transform: scale(.9);
      &.open{
        visibility: visible;
        opacity: 1;
        transform: scale(1);
      }
      .vulps_effect4{
        position: absolute;
        left: 0px;
        top: 0px;
        width: 577px;
        transform: translate(-140px, 20px) rotate(-1deg);
        opacity: .3;
      }
      .copyrights{
        position: absolute;
        bottom: 0px;
        left: 5%;
        width: 90%;
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 300;
        border-top: 1px solid rgba(white, .1);
        text-align: center;
        padding-top: 30px;
        z-index: 4;
        line-height: 30px;
        a{
          text-decoration: none;
          color: #3F75F2;
          font-size: 14px;
          font-family: $MainFont;
          font-weight: 400;
        }
      }
      nav{
        z-index: 4;
        a{
          font-size: 20px;
          color: #FFF;
          font-weight: 200;
          text-decoration: none;
          padding: 15px 5px;
        }
      }
    }
    .socialmedia{
      z-index: 4;
    }
    .main-menu{
      z-index: 3;
    }
    .main-logo{
      z-index: 3;
      img {
        width: 61px;
        height: 45px;
      }
    }
  }
  .connect-popup-wrapper{
    background: #1D1D21;
    width: 100%;
    min-height: 274px;
    max-width: 360px;
    border-radius: 20px;
    box-shadow: 0px 36px 36px 0px #000 !important;
    .popup-title{
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 600;
    }
    .action-label{
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 400;
      opacity: .4;
      &.wrongnetwork{
        opacity: 1;
        /deep/ .q-btn__wrapper:before {
          border: 2px solid $MainYellow !important;
        }
      }
    }
    .connecting-wrapper{
      min-height: 140px;
      .name{
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 600;
      }
    }
    .connect-provider-btn{
      background: #16161A !important;
      /deep/ .q-btn__wrapper:before {
        border: 2px solid #2D2D2D !important;
      }
      .name{
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
</style>
<style>
.dropdown-wrapper{
  background: #1D1D21 !important;
  box-shadow: 0px 36px 36px 0px !important;
}
.dropdown-wrapper .dropdown-content{
  background: #1D1D21 !important;
}
.dropdown-wrapper .dropdown-content hr{
  opacity: .2 !important;
}
.dropdown-wrapper-btn .q-btn-dropdown__arrow-container{
  display: none !important;
}
.dropdown-wrapper-btn {
  width: 42px;
  height: 42px;
}
.dropdown-wrapper-btn.active{
  border: 3px solid #F6F973;
}
.dropdown-wrapper .dropdown-content a{
  text-decoration: none;
  padding: 5px 15px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: .2px;
  font-weight: 400;
  opacity: .7;
}
.dropdown-wrapper .dropdown-content a:hover{
  opacity: 1;
}
.disconnect-btn .q-focus-helper{
  display: none;
}
.disconnect-btn{
  font-family: 'Inter', sans-serif;
  letter-spacing: .2px;
  font-size: 12px;
  font-weight: 400;
  opacity: .7;
}
.disconnect-btn:hover{
  opacity: 1;
}
</style>
