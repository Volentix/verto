<template>
  <div class="menu-left-wrapper">
    <q-tabs
        v-model="tab"
        indicator-color="transparent"
        vertical
        active-color="indigo-12"
        class="tabs-menu--wrapper-tabs text-grey-6"
      >
        <!-- <q-tab name="mails" icon="mail" label="Mails" /> -->
        <q-route-tab class="tabs-menu--wrapper-tab" to="/verto/dashboard" name="dashboard">
          <div class="svg-icon-wrapper flex flex-center"><svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 92"><g id="Group_2130" data-name="Group 2130"><path id="Rectangle_1631" data-name="Rectangle 1631" class="cls-1" d="M39.09,34.58h3.33a3.48,3.48,0,0,1,3.34,3.61v3.62a3.48,3.48,0,0,1-3.34,3.61H39.09a3.48,3.48,0,0,1-3.34-3.61V38.19A3.48,3.48,0,0,1,39.09,34.58Z"/><path id="Rectangle_1632" data-name="Rectangle 1632" class="cls-1" d="M51.33,34.58h3.33A3.48,3.48,0,0,1,58,38.19v3.62a3.48,3.48,0,0,1-3.34,3.61H51.33A3.48,3.48,0,0,1,48,41.81V38.19A3.48,3.48,0,0,1,51.33,34.58Z"/><path id="Rectangle_1633" data-name="Rectangle 1633" class="cls-1" d="M51.33,47.82h3.33A3.48,3.48,0,0,1,58,51.43v3.62a3.48,3.48,0,0,1-3.34,3.61H51.33A3.48,3.48,0,0,1,48,55.05V51.43A3.48,3.48,0,0,1,51.33,47.82Z"/><path id="Rectangle_1634" data-name="Rectangle 1634" class="cls-1" d="M39.09,47.82h3.33a3.48,3.48,0,0,1,3.34,3.61v3.62a3.48,3.48,0,0,1-3.34,3.61H39.09a3.48,3.48,0,0,1-3.34-3.61V51.43A3.48,3.48,0,0,1,39.09,47.82Z"/></g></svg></div>
          <div class="text-tab-name">Dashboard</div>
        </q-route-tab>
        <q-route-tab class="tabs-menu--wrapper-tab" to="/verto/earn" name="earn">
          <div class="svg-icon-wrapper flex flex-center"><svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 92" style="enable-background:new 0 0 96 92;" xml:space="preserve"><g> <path class="st0" d="M47.8,31.5c-8.3,0-15.1,6.8-15.1,15.1c0,8.3,6.8,15.1,15.1,15.1c8.3,0,15.1-6.8,15.1-15.1 C62.9,38.3,56.1,31.5,47.8,31.5z M47.8,61.6c-8.2,0-15-6.7-15-15s6.7-15,15-15c8.2,0,15,6.7,15,15S56,61.6,47.8,61.6z"/> <path class="st0" d="M47.8,62.2c-8.6,0-15.6-7-15.6-15.6S39.2,31,47.8,31c8.6,0,15.6,7,15.6,15.6S56.4,62.2,47.8,62.2z M47.8,32.2 c-8,0-14.5,6.5-14.5,14.5c0,8,6.5,14.5,14.5,14.5s14.5-6.5,14.5-14.5C62.2,38.6,55.8,32.2,47.8,32.2z"/> </g> <g id="Path_1275"> <path class="st0" d="M47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1 C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1 C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1 C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1 L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1 C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1 L47.9,57.1c-0.1,0-0.2,0-0.3-0.1c0,0,0,0,0,0l-7-5.9c-0.1-0.1-0.2-0.2-0.2-0.4V38.9c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0.1-0.2 c0-0.1,0.1-0.1,0.2-0.1c0,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0.1c0.1,0,0.1,0.1,0.1,0.2c0,0,0,0.1,0,0.1 l4.6,11.6h3.9l4.3-11.6c0,0,0-0.1,0-0.1c0-0.1,0.1-0.1,0.1-0.2c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0.1 c0.1,0,0.1,0.1,0.2,0.1c0,0.1,0.1,0.1,0.1,0.2c0,0,0,0.1,0,0.1v11.9c0,0.1,0,0.2-0.1,0.3l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0 c0,0,0,0,0,0l0,0h0c0,0,0,0,0,0L48.3,57c0,0,0,0,0,0C48.2,57.1,48.1,57.1,47.9,57.1L47.9,57.1C48,57.1,48,57.1,47.9,57.1L47.9,57.1 C48,57.1,48,57.1,47.9,57.1L47.9,57.1C48,57.1,48,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1 C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1 C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1L47.9,57.1C47.9,57.1,47.9,57.1,47.9,57.1z M46.3,51.2 l1.6,4l1.5-4H46.3z M42.3,51.2l4.4,3.7l-1.5-3.7H42.3z M50.5,51.2l-1.4,3.7l4.2-3.7H50.5z M50.9,50.2h3.3v-8.6L50.9,50.2z M41.4,50.2h3.4l-3.4-8.8V50.2z"/> </g> </svg></div>
          <div class="text-tab-name">Earn</div>
        </q-route-tab>
        <q-route-tab class="tabs-menu--wrapper-tab" to="/verto/profile" name="profile">
          <div class="svg-icon-wrapper flex flex-center"><svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 92"><g id="icon"><path id="path" class="cls-1" d="M48.22,46.62a5.89,5.89,0,1,1,5.89-5.89,5.89,5.89,0,0,1-5.89,5.89Zm0-2.14a3.75,3.75,0,1,0-3.75-3.75h0a3.75,3.75,0,0,0,3.75,3.75Zm11.15,7.58a6.81,6.81,0,0,1,.43,1.78c.08.55.14,1.1.19,1.65v.23a2.68,2.68,0,0,1-2.67,2.68H39.11a2.67,2.67,0,0,1-2.67-2.68v-.23c0-.55.11-1.1.19-1.65a6.81,6.81,0,0,1,.43-1.78c.82-1.78,6.89-4.37,11.15-4.37s10.33,2.59,11.15,4.38Zm-2.06.82a4.74,4.74,0,0,0-.62-.46,16,16,0,0,0-2.25-1.16,16.48,16.48,0,0,0-6.22-1.43A16.48,16.48,0,0,0,42,51.26a15.31,15.31,0,0,0-2.24,1.16,5.64,5.64,0,0,0-.63.46L39,53a7.58,7.58,0,0,0-.24,1.15c0,.36-.1.75-.14,1.14,0,.2,0,.36,0,.46a.54.54,0,0,0,.53.51H57.33a.54.54,0,0,0,.53-.51c0-.1,0-.26,0-.46,0-.38-.08-.76-.14-1.14A6.53,6.53,0,0,0,57.44,53l-.13-.12Z"/></g></svg></div>
          <div class="text-tab-name">Profile</div>
        </q-route-tab>
      </q-tabs>
      <span class="version">{{version}}</span>
  </div>
</template>

<script>
import { version } from '../../../package.json'

export default {
  name: 'LeftMenu',
  data () {
    return {
      tab: 'dashboard',
      version: {}
    }
  },
  methods: {
  },
  mounted () {
    this.version = version
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .menu-left-wrapper{
    position: fixed;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 60px;
    background-color: #7900FF;
    background: transparent linear-gradient(180deg, #7900FF 0%, #00D0DF 100%) 0% 0% no-repeat padding-box;
    z-index: 7;
    padding-top: 70px;
    .version{
      position: absolute;
      left: 0px;
      bottom: 0px;
      padding: 5px 0px;
      text-align: center;
      color: #FFF;
      font-size: 10px;
      font-weight: $bold;
      font-family: $Titillium;
      width: 60px;
    }
    @extend .shad;
     .tabs-menu{
        &--wrapper{
          /deep/ .q-tabs__content{
            justify-content: space-evenly;
            box-shadow: 0px -11px 31px 0px rgba(0, 0, 0, 0.15);
          }
          /deep/ .q-tab--inactive {
            // opacity: 0.95;
          }
          &-tab{
            padding: 0px 10px;
            flex-basis: 20%;
            /deep/ .q-tab{
                &__content{}
                &__label{
                    font-size: 12px;
                    text-transform: initial;
                }
            }
          }
          &-tabs{
            .tabs-menu--wrapper-tab{
              margin-left: -10px;
              .svg-icon-wrapper{
                overflow: hidden;
                width: 60px;
                height: 50px;
              }
              .svg-icon{
                fill: rgba(#FFF, .6);
                width: 38px;
                height: 50px;
                max-width: unset;
                transform: scale(1.9);
              }
              .text-tab-name{
                font-size: 10px;
                font-family: $Titillium;
                font-weight: $light;
                text-transform: initial;
                color: rgba(#FFF, .6);
                margin-top: -10px;
                margin-bottom: 8px;
              }
              &.q-router-link--active{
                .svg-icon{
                  fill: #FFF;
                }
                .text-tab-name{
                  color: #FFF;
                }
              }
            }
          }
        }
      }
    .row{
      .col{
        cursor: pointer;
        position: relative;

      }
    }
  }
</style>
