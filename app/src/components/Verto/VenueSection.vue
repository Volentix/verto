<template>
  <div class="desktop-card-style apps-section q-mb-sm">
    <div class="row flex justify-between q-pt-sm q-pb-sm">
      <div class="col col-12 flex items-center venue-icon"><q-icon :name="'img:statics/venue_icon-black.svg'" />Venue Active Campaigns</div>
    </div>
    <campaigns />
  </div>
</template>

<script>
import Campaigns from './Campaigns'
export default {
  name: 'VenueSection',
  components: {
    Campaigns
  },
  data () {
    return {
      chainToolModel: 'Chain Tools'
    }
  },
  methods: {
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

        &.venue-icon{
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
            height: 24px;
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
