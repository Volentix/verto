<template>
  <div class="main-footer q-pl-lg q-pr-lg" :class="{'site': appSiteMode === 'site'}">
    <div class="fluid-container">
      <div class="row">
        <div class="column main-logo" :class="{'col-12': $q.screen.width < 768, 'col-3': $q.screen.width >= 768}">
          <router-link to="/home/">
            <img src="statics/staider/staider_logo_white.svg" alt="">
          </router-link>
          <p class="text-white" v-if="false">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod adipiscing elit, sed diam </p>
          <div v-if="$q.screen.width >= 768" class="flex items-center q-mt-xl">
             <q-btn type="a" href="https://github.com/Volentix" target="_blank" color="white" class="q-mr-sm" text-color="white" dense rounded flat icon="img:statics/staider/github_icon.svg" />
             <q-btn type="a" href="https://twitter.com/volentix" target="_blank" color="white" class="q-mr-sm" text-color="white" dense rounded flat icon="img:statics/staider/twitter_icon.svg" />
          </div>
        </div>
        <div class="footer-nav text-white" :class="{'col-12': $q.screen.width < 768, 'col-9': $q.screen.width >= 768}">
          <div class="row" :class="{'justify-end': $q.screen.width >= 768}">
            <div class="" :class="{'col-6': $q.screen.width < 768, 'col-3': $q.screen.width >= 768}">
              <h6>Explore</h6>
              <ul>
                <!-- <li v-for="(link, index) in footerNav3" :key="'nav_'+index">
                  <router-link :to="link.to">{{link.title}}</router-link>
                </li> -->
                <li><a href="javascript:void(0)" @click="scrollToSection('vaults')">Explore Vaults</a></li>
                <li><a href="javascript:void(0)" @click="scrollToSection('team')">Team</a></li>
                <li><a href="javascript:void(0)" @click="scrollToSection('timeline')">Timeline</a></li>
              </ul>
            </div>
            <div class="" :class="{'col-6': $q.screen.width < 768, 'col-3': $q.screen.width >= 768}">
              <h6>Support</h6>
              <ul>
                <!-- <li v-for="(link, index) in footerNav4" :key="'nav_'+index">
                  <router-link :to="link.to">{{link.title}}</router-link>
                </li> -->
                <li><a href="javascript:void(0)" @click="scrollToSection('faqs')">FAQs</a></li>
                <li><a href="mailto:info@staider.finance">Contact us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-12 copyrights text-white">
          <div class="row">
            <div class="col-12" v-if="$q.screen.width < 768">
              <ul class="flex full-width justify-between">
                <li v-for="(link, index) in footerNav" :key="'nav_'+index">
                  <router-link :to="link.to">{{link.title}}</router-link>
                </li>
              </ul>
            </div>
            <div class="col-12" v-if="$q.screen.width < 768">
              <div class="socialmedia full-width flex flex-center q-mb-lg q-mt-lg q-pt-xl q-pb-lg">
                <q-btn type="a" href="https://github.com/Volentix" target="_blank" color="white" class="q-mr-lg" text-color="white" dense rounded flat icon="img:statics/staider/github_icon.svg" />
                <q-btn type="a" href="https://twitter.com/volentix" target="_blank" color="white" class="q-mr-lg" text-color="white" dense rounded flat icon="img:statics/staider/twitter_icon.svg" />
              </div>
            </div>
            <div class="" :class="{'col-12': $q.screen.width < 768, 'col-6': $q.screen.width >= 768}">
              <p>This project is created by <a href="http://volentixlabs.com" target="_blank">Volentix labs INC</a>. <br v-if="$q.screen.width < 768">Copyright © 2018 - All rights reserved</p>
            </div>
            <div class="col-6" v-if="$q.screen.width >= 768">
              <ul class="flex full-width justify-end">
                <li v-for="(link, index) in footerNav" :key="'nav_'+index">
                  <router-link :to="link.to">{{link.title}}</router-link>
                </li>
                <li>
                  <a href="javascript:void(0)" @click="showNotif">Cookie Preferences</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      // appSiteMode: 'site',
      footerNav3: [
        { to: '/funds', title: 'Explore funds' },
        { to: '/team', title: 'Team' },
        { to: '/roadmap', title: 'Roadmap' }
      ],
      footerNav4: [
        { to: '/faq', title: 'FAQs' }
        // { to: '/documentation', title: 'Documentation' },
        // { to: '/blog', title: 'Blog' }
      ],
      footerNav: [
        { to: '/privacy-policy', title: 'Privacy Policy' },
        { to: '/terms-of-Use', title: 'Terms of Use' }
      ]
    }
  },
  mounted () {
  },
  created () {
  },
  computed: {
    appSiteMode () {
      return this.$route.meta.site ? 'site' : 'app'
    }
  },
  methods: {
    showNotif () {
      this.$q.notify({
        progress: false,
        persistent: true,
        timeout: 0,
        color: 'white',
        textColor: 'black',
        multiLine: true,
        position: 'bottom-right',
        classes: 'cookie-notif',
        message: '<div class="cookie_notif_wrapper">By continuing to browse the site, you accept the use of cookies for audience measurement purposes.</div>',
        html: true,
        actions: [
          { label: 'Accept',
            color: 'black',
            noCaps: true,
            handler: () => {
              // this.$store.commit('utils/updateAcceptCookies', true)
            } },
          { label: 'Close', color: 'black', noCaps: true, handler: () => { /* ... */ } }
        ]
      })
    },
    scrollToSection (sectionScrollName) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .main-footer{
    margin-top: 100px;
    @media screen and (max-width: 768px) {
      margin-top: 50px;
      padding-top: 50px !important;
      background: #1b1b1f;
    }
    &.site{
      padding: 0px 10px;
      max-width: calc(100% - 180px);
      margin-left: auto;
      margin-right: auto;
      @media screen and (max-width: 768px) {
        max-width: 100%;
        padding-left: 20px;
        padding-right: 20px;
      }
    }
    .h_line{
      position: relative;
      top: 5px;
    }
  }
  .main-logo{
    @media screen and (max-width: 768px) {
      margin-bottom: 20px;
    }
    img {
      height: 41px;
      margin-left: -5px;
      @media screen and (max-width: 768px) {
        height: 41px;
        margin-left: -5px;
      }
    }
    p{
      font-size: 14px;
      font-family: $MainFont;
      font-weight: 200;
      max-width: 250px;
    }
  }
  .footer-nav{
    h6{
      text-align: right;
      margin: 0px;
      padding-right: 15px;
      @media screen and (max-width: 768px) {
        text-align: left;
        padding-left: 15px;
        padding-right: 0px;
        margin-left: -10px;
      }
    }
    ul{
      list-style: none;
      @media screen and (max-width: 768px) {
        margin-left: -10px;
      }
      li{
        text-align: right;
        @media screen and (max-width: 768px) {
          text-align: left;
        }
      }
      @media screen and (max-width: 768px) {
        padding: 0px;
        padding-left: 0px;
      }
      a{
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 300;
        line-height: 30px;
        color: #FFF;
        text-decoration: none;
        padding: 5px 15px;
      }
    }
  }
  .copyrights{
    font-size: 14px;
    font-family: $MainFont;
    font-weight: 300;
    border-top: 1px solid rgba(white, .1);
    margin-top: 30px;
    padding-top: 30px;
    padding-bottom: 20px;
    p{
      @media screen and (max-width: 768px) {
        text-align: center;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 30px;
      }
    }
    ul{
      list-style: none;
      margin: 0px;
      @media screen and (max-width: 768px) {
        padding: 0px;
        padding-left: 10px;
        padding-right: 10px;
      }
      a{
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 300;
        line-height: 30px;
        color: #FFF;
        text-decoration: none;
        padding: 5px 15px;
        @media screen and (max-width: 768px) {
          padding: 5px 0px;
        }
      }
    }
    a{
      text-decoration: none;
      color: #3F75F2;
      font-size: 14px;
      font-family: $MainFont;
      font-weight: 400;
      @media screen and (max-width: 768px) {
        margin-right: 0px !important;
      }
    }
  }
  .socialmedia{
    @media screen and (max-width: 768px) {
      border-top: 1px solid rgba(white, .1);
    }
  }
</style>
