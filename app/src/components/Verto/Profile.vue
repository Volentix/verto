<template>
<div>
  <div class="profile-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="profile-wrapper--list">
      <q-list bordered separator>
        <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="(item.to !== 'backup' && item.to !== 'logout' && item.to !== 'restore' && item.to !== 'share') ? item.to : ''" @click="item.to === 'backup' ? backupConfig() : item.to === 'logout' ? logout() : item.to === 'restore' ? startRestoreConfig() : item.to === 'share' ? toggleShare() : empty()">
          <q-item-section avatar>
            <q-icon class="icons" :class="{'reverse' : item.icon === 'exit_to_app'}" v-if="item.icon !== 'vtx'" :name="item.icon" />
            <img v-else class="vtx_logo" width="15px" src="statics/vtx_black.svg" alt="">
          </q-item-section>
          <q-item-section class="item-name">{{item.name}}</q-item-section>
          <q-item-section class="text-orange profile-wrapper--list__item-info" :class="{'hide': item.info === ''}">{{item.info}}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <q-dialog v-model="showShareWrapper">
    <q-card class="q-pa-lg">
      <q-toolbar>
        <q-avatar><img src="statics/icon.png"></q-avatar>
        <q-toolbar-title><span class="text-weight-bold">Share</span> VERTO</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class=" text-h6">
        <span style="font-size: 1em">Select your prefered method</span>
        <div class="social-media-wrapper">
           <span class="submenu-wrapper">
              <social-sharing
                class="share_wrapper text-black flex column justify-even content-start item-start"
                :url="vertoLink"
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
                <a href="#">
                  Test tEstes SRestrsd
                </a>
              </social-sharing>
            </span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- <q-dialog v-model="confirmLogout" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 90vw;">
      <q-card-section class="row items-center">
        <q-avatar icon="exit_to_app" color="deep-purple-14" text-color="white" />
        <span class="q-ml-sm">Please Confirm !</span>
      </q-card-section>
      <br>
      <q-card-actions align="right">
        <q-btn rounded outline unelevated label="Cancel" class="lower fsz16 pd20" color="deep-purple-14" v-close-popup />
        <q-btn flat rounded unelevated label="Logout" class="lower fsz16 pd20" color="grey" v-close-popup @click="logout()" />
      </q-card-actions>
    </q-card>
  </q-dialog> -->
</div>
</template>

<script>
import configManager from '@/util/ConfigManager'
import Vue from 'vue'
var SocialSharing = require('vue-social-sharing')
Vue.use(SocialSharing)
export default {
  name: 'Profile',
  data () {
    return {
      vertoLink: 'https://verto.volentix.io',
      active: true,
      menu: [
        { name: 'Wallets', to: '/verto/wallets', icon: 'o_account_balance_wallet', info: '' },
        { name: 'Trade', to: '/verto/exchange', icon: 'compare_arrows', info: '' },
        { name: 'Personalize your wallet', to: '', icon: 'o_perm_media', info: 'soon' },
        { name: 'Backup Config', to: 'backup', icon: 'o_get_app', info: '' },
        { name: 'Restore Config', to: 'restore', icon: 'cloud_upload', info: '' },
        { name: 'Change Password', to: '/verto/profile/change-password', icon: 'lock_open', info: '' },
        { name: 'Link to Verto ID', to: '', icon: 'vtx', info: 'Not linked' },
        { name: 'share Verto wallet', to: 'share', icon: 'share', info: '' },
        { name: 'Log Out', to: 'logout', icon: 'exit_to_app', info: '' }
      ],
      showShareWrapper: false
    }
  },
  methods: {
    toggleShare () {
      this.showShareWrapper = !this.showShareWrapper
    },
    async startRestoreConfig () {
      this.$router.push({
        name: 'restoreWallet',
        params: { returnto: 'profile' }
      })
    },
    async backupConfig () {
      try {
        await configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
    },
    logout () {
      configManager.logout()
      this.$router.push({
        path: '/login'
      })
    },
    empty () {
      console.log('empty')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .profile-wrapper{
    padding: 0px 6%;
    padding-bottom: 30px;
    &--list{
      /deep/ .q-list--bordered {
          border: none;
          .q-item{
            &:not(:first-child){
              .q-link {
                border-top: 1px solid rgba(0,0,0,0.02);
              }
            }
          }
          .q-link {
            border-top: 1px solid rgba(0,0,0,0.04);
          }
          .q-item{
            &:first-child{
              border-top: 1px solid rgba(0,0,0,0);
            }
          }
          .q-item__section{
            &.hide{
              display: none !important;
            }
          }
      }
      &__item-info{
        border: 2px solid;
        border-radius: 9px;
        text-align: center;
        width: fit-content;
        min-width: fit-content;
        max-width: fit-content;
        padding: 0px 10px;
      }
      .vtx_logo{
        margin-left: 4px;
        opacity: .4;
      }
      .icons{
        opacity: .4;
        &.reverse{
          transform: scaleX(-1);
        }
      }
      .item-name{
        font-size: 16px;
      }
    }
  }
  .icon-alert{
    padding-top: 25px;
    padding-bottom: 0px;
    img{
      width: 50px;
    }
  }
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
  .go-to-security{
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
  }
  .social-media-wrapper{
    margin-top: 20px;
    .share_wrapper{
      display: flex;
      flex-direction: row !important;
      justify-content: space-between;
      // background-color: #fff;
      // box-shadow: 0px 1px 1px 0px rgba(black, .04);
      border-radius: 5px;
      padding: 10px 0px;
      margin-left: 0px;
      margin-right: 0px;
      margin-bottom: -20px;
      // width: 33%;
      /deep/  & > span{
        flex-basis: 33%;
      }
      /deep/ .q-btn.q-btn-item{
        color: #433afb !important;
        background: rgba(239, 239, 239, 0.13) !important;
        // transform: scale3d(.7,.7,.7);
        box-shadow: none !important;
        width: 100%;
        border-radius: 0px !important;
        img{
          width: 55px;
          height: 55px;
        }
        &.border{
          border-right: 1px solid rgb(226, 226, 226);
          border-left: 1px solid rgb(226, 226, 226);
        }
        margin-bottom: 10px;
        /deep/ .q-btn__wrapper:before{
          box-shadow: none !important;
        }
      }
    }
  }
  .lower{
    text-transform: initial !important;
  }
  .fsz16{
    font-size: 16px;
    font-weight: $regular;
    font-family: $Titillium;
  }
  .pd20{
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
