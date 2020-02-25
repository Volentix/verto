<template>
<div>
  <div class="profile-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="profile-wrapper--list">
      <q-list bordered separator>
        <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="item.to">
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
</div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      active: true,
      menu: [
        { name: 'Wallets', to: '/wallets', icon: 'account_balance_wallet', info: '' },
        { name: 'Exchange', to: '/wallets', icon: 'bar_chart', info: '' },
        { name: 'Personalize your wallet', to: '/wallets', icon: 'bubble_chart', info: '' },
        { name: 'Privacy', to: '/wallets', icon: 'info', info: 'Backup is incomplete' },
        { name: 'Link to Verto ID', to: '/wallets', icon: 'vtx', info: 'Not linked' },
        { name: 'share Verto wallet', to: '/wallets', icon: 'share', info: '' },
        { name: 'Log Out', to: '/wallets', icon: 'exit_to_app', info: '' }
      ]
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
    .profile-wrapper{
      padding: 0px 6%;
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
</style>
