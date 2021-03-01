<template>
  <div class="desktop-card-style apps-section chainToolsDropdownBtn q-mb-sm" :class="{'disabled' : wallet.type !== 'vtx' && wallet.type !== 'eos', 'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="row flex justify-between items-center q-pt-md q-pb-sm">
      <div class="col col-4 flex items-center chain-icon"><q-icon :name="'img:statics/chain-tools_icon-black.svg'" />Chain Tools</div>
      <div class="col col-6 flex items-center justify-center chain-token">
        <div class="column q-mr-md">
          <span class="label">Account:</span>
          <strong class="ellipsis">{{wallet.name}}</strong>
        </div>
        <div class="column q-mr-md">
          <span class="label">Chain:</span>
          <strong class="upper">{{wallet.chain}}</strong>
        </div>
        <div class="column">
          <span class="label">Token:</span>
          <strong class="upper">{{wallet.type}}</strong>
        </div>
      </div>
      <div class="col col-2 flex items-center justify-end dropdown q-pr-sm">
        <q-select
          :dark="$store.state.settings.lightMode === 'true'"
          :light="$store.state.settings.lightMode === 'false'"
          separator
          rounded
          outlined
          class="select-input "
          v-model="chainToolModel"
          @input="goToChainTool"
          :options="wallet.type === 'eos' ? [/*'EOS to VTX Converter', */ 'Staking / Unstaking CPU', 'Stake Proxy EOS'] : ['Staking']" />
          <!-- , 'Voting', 'Lending' -->
        <!-- <strong>Start Your Node</strong> -->
        <!-- <q-btn unelevated class="qbtn-start" color="black" text-color="white" label="Get started" /> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChainToolsSection',
  data () {
    return {
      chainToolModel: 'Chain Tools'
    }
  },
  updated () {
    // console.log('wallet ----* ', this.wallet)
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || {}
    }
  },
  methods: {
    goToChainTool (val) {
      if (val.toLowerCase() === 'staking') {
        this.$router.push({ path: '/verto/stake' })
      } else if (val.toLowerCase() === 'eos to vtx converter') {
        this.$router.push({ path: '/verto/converter' })
      } else if (val.toLowerCase() === 'staking / unstaking cpu') {
        this.$router.push({ path: '/verto/stake' })
      } else if (val.toLowerCase() === 'stake proxy eos') {
        this.$router.push({ path: '/verto/stakeproxy' })
      } else {

      }
      // console.log(val)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .apps-section{
    min-height: 77px;
    height: 100%;
    max-height: calc(100% - 10px);
    .row{
      .col{
        &.chain-token{
          font-weight: $bold;
          font-size: 11px;
          font-family: $Titillium;
          padding-right: 10px;
          margin-left: -60px;
          .label{
            color: #494949;
          }
          strong{
            font-size: 12px;
            color: #7272FA;
            max-width: 100px;
            overflow: hidden;
            &.upper{
              text-transform: uppercase;
            }
          }
        }

        &.chain-icon{
          font-size: 12px;
          font-weight: $bold;
          font-family: $Titillium;
          padding-right: 5px;
          padding-left: 10px;
          // flex-basis: 130px;
          position: relative;
          color: #494949;
          img{
            width: 28px;
            height: 28px;
            margin-right: 5px;
          }
        }
        &.dropdown{

        }
      }
    }
    .select-input{
      border-radius: 100px !important;
      $height: 35px;
      width: 160px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        height: $height;
        min-height: unset;
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          font-size: 10px;
          width: 60px;
          margin-right: -15px;
          .q-item{
            padding: 0px;
            padding-left: 18px;
            min-height: $height;
            padding-bottom: 0px;
            .q-item__section{
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
    &.dark-theme{
      color: #FFF;
      .row .col{
        &.chain-icon{
          color: #FFF;
        }
        &.chain-token{
          color: #FFF;
          .label{
            color: #FFF;
          }
        }
      }
      .logo-vtx{
        color: #FFF;
        .svg_logo{
          fill: #FFF;
        }
      }
    }
  }
  .chainToolsDropdownBtn{
    // transition: transform cubic-bezier(0.39, 0.575, 0.565, 1) .2s;
    // transform: scale(1);
    // position: relative;
    &:hover{
      // transform: scale(1.07);
      // z-index: 999;
    }
    &.active{
      animation: flash 1s linear infinite;
    }

    @keyframes flash {
    0% {
      box-shadow: 0px 0px 2px 2px transparent;
    }
    100% {
      box-shadow: 0px 0px 2px 2px yellow;
    }
  }
  }
</style>
