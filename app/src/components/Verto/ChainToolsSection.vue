<template>
  <div class="desktop-card-style apps-section q-mb-sm" :class="{'disabled' : wallet.chain !== 'eos'}">
    <div class="row flex justify-between q-pt-sm q-pb-sm">
      <div class="col col-3 flex items-center chain-icon"><q-icon :name="'img:statics/chain-tools_icon-black.svg'" />Chain Tools</div>
      <div class="col col-4 flex items-center justify-end chain-token q-pr-sm">
        <div class="column q-mr-md">
          <span class="label">Account:</span>
          <strong>{{wallet.name}}</strong>
        </div>
        <div class="column q-mr-md">
          <span class="label">Chain:</span>
          <strong>{{wallet.chain}}</strong>
        </div>
        <div class="column">
          <span class="label">Token:</span>
          <strong>{{wallet.type}}</strong>
        </div>
      </div>
      <div class="col col-5 flex items-center justify-end dropdown q-pr-sm">
        <q-select
          light
          separator
          rounded
          outlined
          class="select-input"
          v-model="chainToolModel"
          @input="goToChainTool"
          :options="['Staking', 'Voting', 'Lending']" />
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
      }
      console.log(val)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .apps-section{
    .row{
      .col{
        &.chain-token{
          font-weight: $bold;
          font-size: 11px;
          font-family: $Titillium;
          .label{
            color: #494949;
          }
          strong{
            font-size: 12px;
            color: #7272FA;
            text-transform: uppercase;
          }
        }

        &.chain-icon{
          font-size: 14px;
          font-weight: $bold;
          font-family: $Titillium;
          padding-right: 20px;
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
      width: 200px;
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
  }
</style>
