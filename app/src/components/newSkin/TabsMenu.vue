<template>
<div>
  <div class="tabs-menu--wrapper">
      <q-tabs
        v-model="tab"
        indicator-color="transparent"
        active-color="indigo-12"
        class="tabs-menu--wrapper-tabs text-grey-6"
      >
        <!-- <q-tab name="mails" icon="mail" label="Mails" /> -->
        <q-route-tab class="tabs-menu--wrapper-tab" to="/new-skin/dashboard" name="dashboard" icon="movie" label="Dashboard" />
        <q-route-tab class="tabs-menu--wrapper-tab" to="/new-skin/profile" name="chain" icon="movie" label="Chain Tools" />
        <q-route-tab class="tabs-menu--wrapper-tab" to="/new-skin/profile" name="earn" icon="movie" label="Earn" />
        <q-route-tab class="tabs-menu--wrapper-tab" to="/new-skin/profile" name="history" icon="movie" label="History" />
        <q-route-tab class="tabs-menu--wrapper-tab" to="/new-skin/profile" name="profile" icon="movie" label="Profile" />
      </q-tabs>
  </div>
</div>
</template>

<script>
export default {
  name: 'TabsMenu',
  data () {
    return {
      tab: 'profile'
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
    .tabs-menu{
        &--wrapper{
            position: fixed;
            z-index: 9;
            width: 100%;
            bottom: 0px;
            background-color: #fff;
            border-top: 1px solid rgba(#B0B0B0, .26);
            /deep/ .q-tabs__content{
                justify-content: space-evenly;
            }
            /deep/ .q-tab--inactive {
                opacity: 0.95;
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
        }
    }
</style>
