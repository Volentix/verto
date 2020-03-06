<template>
<div>
  <div class="column flex-center profile-wrapper--header" style="background: url('statics/header_bg.png');">
    <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
    <h2 class="profile-wrapper--header__balance text-white">136.23 VTX</h2>
    <div class="profile-wrapper--header__action">
      <q-btn unelevated to="/new-skin/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
      <q-btn unelevated to="/new-skin/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ProfileHeader',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
    .profile-wrapper{
      &--header{
        height: 240px;
        margin-bottom: 30px;
        background-repeat: no-repeat !important;
        background-size: cover !important;
        overflow: hidden;
        border-radius: 0px 0px 20px 20px;
        padding-bottom: 20px;
        &__title{
          margin: 0px;
          font-size: 18px;
          font-weight: 100;
          letter-spacing: 1px;
          width: 100%;
          text-align: center;
        }
        &__balance{
          margin: 0px;
          font-size: 42px;
          font-weight: 700;
          text-align: center;
          width: 100%;
          margin-top: -10px;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        &__action{
          text-align: center;
          width: 100%;
          &-btn{
            background: #7272FA !important;
            margin: 0px 10px;
            width: 100px;
            border-radius: 30px;
            height: 40px;
            text-transform: initial !important;
            font-size: 16px;
            letter-spacing: .3px;
          }
        }
      }
    }
</style>
