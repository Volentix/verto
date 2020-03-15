<template>
  <div>
    <div v-if="version === 'type1'" class="column flex-center profile-wrapper--header" style="background: url('statics/header_bg.png');">
      <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
      <h2 class="profile-wrapper--header__balance text-white">136.23 VTX</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
    <div v-else-if="version === 'type2'" class="profile-wrapper--header static">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <h3 class="flex flex-center text-white static__holder_title">Making VTX while you sleep, will be available soon.</h3>
        <span class="static__holder_img flex flex-center"><img src="statics/stake-vtx-bg.png" alt=""></span>
      </div>
      <p class="desc text-white full-width">For now, you can make EOS while you sleep.</p>
    </div>
    <div v-else-if="version === 'type3'" class="column flex-center profile-wrapper--header" style="background: url('statics/header_bg.png');">
      <h3 class="profile-wrapper--header__title text-white">{{ selectedWallet.name }}</h3>
      <h2 class="profile-wrapper--header__balance text-white">{{ selectedWallet.amount }}</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated :to="'/verto/wallets/send/' + selectedWallet.slug" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated :to="'/verto/wallets/receive/' + selectedWallet.slug" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
    <div v-else-if="version === 'type4'" class="profile-wrapper--header static" style="background: url(statics/eos-bg.png) #007086 no-repeat !important; background-size: contain !important; min-height: 260px;">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <h3 class="flex flex-center text-white static__holder_title title2">Create EOS account</h3>
        <span class="static__holder_img flex flex-center"></span>
      </div>
    </div>
    <div v-else class="column flex-center profile-wrapper--header" style="background: url('statics/header_bg.png');">
      <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
      <h2 class="profile-wrapper--header__balance text-white">136.23 VTX</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileHeader',
  props: {
    version: {
      type: String,
      required: false,
      default: 'type1'
    },
    walletID: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      selectedWallet: {
        selected: false,
        slug: 'btc-xyz',
        name: 'BTC xyz',
        purcent: '1.02%',
        icon: 'statics/coins_icons/btc.png',
        amount: '0.023 BTC',
        amountUSD: '$235.21'
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .profile-wrapper{
    &--header{
      height: 240px;
      margin-bottom: 30px;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      overflow: hidden;
      border-radius: 0px 0px 20px 20px;
      padding-bottom: 20px;
      &.static{
        background: #0E163B !important;
        box-shadow: 0px 3px 6px 0px rgba(#000000, .29);
        padding: 30px;
        min-height: 240px;
        height: auto;
        padding-top: 70px;
        .flex-row{
          .static__holder_img{
            img{
              max-width: 120px;
            }
          }
          .static__holder_title{
            max-width: 200px;
            font-size: 24px;
            line-height: 35px;
            font-weight: $bold;
            font-family: $Titillium;
            margin: 0px;
            &.title2{
              margin-top: 15px;
              font-size: 30px;
              line-height: 45px;
            }
          }
        }
        .desc{
          margin-bottom: -10px;
          margin-top: 40px;
          font-size: 17px;
          line-height: 21px;
          font-weight: $regular;
          font-family: $Titillium;
        }
      }
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
