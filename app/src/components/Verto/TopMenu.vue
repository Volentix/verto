<template>
  <div class="menu-top-wrapper">
    <div class="row">
      <div class="col col-3 app-logo flex q-pl-xl items-center"><router-link to="/verto/dashboard">VERTO</router-link></div>
      <div class="col col-3 flex items-center">2020-05-22 - 16:15:31</div>
      <div class="col col-6 flex justify-end q-pr-xl items-center menu">
        <router-link to="/verto/earn/use-referral-account">Refer & Earn</router-link>
        <router-link to="/verto/exchange">Exchange</router-link>
        <a href="javascript:void(0)" @click="logout"><q-icon class="reverse" name="exit_to_app" /> Logout</a>
      </div>
    </div>
  </div>
</template>

<script>
import configManager from '@/util/ConfigManager'

export default {
  name: 'TopMenu',
  data () {
    return {
    }
  },
  methods: {
    logout () {
      configManager.logout()
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .menu-top-wrapper{
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    $height: 60px;
    height: $height;
    background-color: #fff;
    z-index: 9;
    @extend .shad;
    .row{
      .col{
        height: $height;
        &.menu{
          a{
            font-weight: $regular;
            font-family: $Titillium;
            font-size: 16px;
            color: #333;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 5px;
            &:hover{
              background-color: rgba(black, .02);
            }
          }
        }
        &.app-logo{
          a{
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
  .reverse{
    transform: scaleX(-1);
  }
</style>
