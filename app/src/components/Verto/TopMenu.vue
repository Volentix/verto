<template>
<div class="menu-top-wrapper">
    <div class="row">
        <div class="col col-3 app-logo flex q-pl-xl items-center">
            <img src="statics/vtx_black.svg" alt="" class="q-mr-sm" style="width: 30px; height: 30px;">
            <router-link to="/verto/dashboard">VERTO</router-link>
        </div>
        <div class="col col-5 flex items-center date-scrolling-msg">
          <div class="date">{{currentDate}}</div>
          <VTextMarquee :speed="40" @click="animate = !animate" :animate="animate" content="This app is in beta, please send us bug reports if you find any. <b>t.me/vertosupport</b>" />
        </div>
        <div class="col col-4 flex justify-end q-pr-xl items-center menu">
            <!-- to="/verto/earn/use-referral-account" -->
            <!-- <router-link disabled>Refer & Earn</router-link> -->
            <span @click="temp = true">Free* CPU</span>
            <router-link to="/verto/exchange4">New UI (Temp)</router-link>
            <router-link to="/vdexnode/">vDexNode</router-link>
            <router-link to="/verto/exchange">Exchange</router-link>
            <a href="javascript:void(0)" @click="logout">
                <q-icon class="reverse" name="exit_to_app" /> Logout
            </a>
        </div>
    </div>
     <q-dialog v-model="temp">
    <FreeCPUDialog />
    </q-dialog>
</div>
</template>

<script>
// import configManager from '@/util/ConfigManager'
import FreeCPUDialog from './Defi/FreeCPUDialog'
import { date } from 'quasar'
import { VTextMarquee } from 'vue-text-marquee'

// 2020-05-22 - 16:15:31
// let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD - HH:mm:ss')
export default {
  name: 'TopMenu',
  components: {
    FreeCPUDialog,
    VTextMarquee: VTextMarquee
  },
  data () {
    return {
      temp: false,
      currentDate: '',
      animate: true
    }
  },
  created () {
    setTimeout(() => {
      this.refreshDate()
    }, 1000)
  },
  methods: {
    refreshDate () {
      let timeStamp = Date.now()
      this.currentDate = date.formatDate(timeStamp, 'YYYY-MM-DD - HH:mm:ss')
      setTimeout(() => {
        this.refreshDate()
      }, 1000)
    },
    logout () {
      // configManager.logout()
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.menu-top-wrapper {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    $height: 60px;
    height: $height;
    background-color: #fff;
    z-index: 9;
    @extend .shad;

    .row {
        .col {
            height: $height;

            &.menu {
                a {
                    font-weight: $regular;
                    font-family: $Titillium;
                    font-size: 16px;
                    color: #333;
                    text-decoration: none;
                    padding: 5px 10px;
                    border-radius: 5px;

                    &:hover {
                        background-color: rgba(black, .02);
                    }
                }
            }

            &.app-logo {
                a {
                    font-weight: $bold;
                    text-transform: uppercase;
                    font-family: $Titillium;
                    font-size: 20px;
                    color: #333;
                    text-decoration: none;
                }
            }

            cursor: pointer;
            position: relative;

        }
    }
}

.reverse {
    transform: scaleX(-1);
}
.date-scrolling-msg{
  /deep/ .v-marquee{
    max-width: 390px;
    margin-left: 20px;
  }
}
</style>
