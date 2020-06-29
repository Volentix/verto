<template>
  <div class="desktop-card-style apps-section q-mb-sm">
    <div class="row flex justify-between q-pt-sm q-pb-sm">
      <div class="col col-6 flex items-center node-icon"><q-icon name="apps" />VDEX node</div>
      <div class="col col-6 flex items-center justify-end start_node q-pr-sm">
        <strong>Start Your Node</strong>
        <q-btn unelevated class="qbtn-start" color="black" text-color="white" label="Get started" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartNodeSection',
  data () {
    return {
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
        .qbtn-start{
          border-radius: 30px;
          height: 30px;
          background: #7272FA !important;
          /deep/ .q-btn__wrapper{
            min-height: unset;
            .q-btn__content{
              text-transform: initial;
              font-size: 12px;
            }
          }
        }
        &.node-icon{
          font-size: 14px;
          font-weight: $bold;
          font-family: $Titillium;
          padding-right: 20px;
          padding-left: 10px;
          // flex-basis: 130px;
          position: relative;
          color: #494949;
          i{
            font-size: 1.4em;
            margin-right: 5px;
          }
        }
        &.start_node{
          font-family: $Titillium;
          strong{
            font-weight: $bold;
            font-size: 14px;
            color: #494949;
            margin-top: -6px;
            margin-bottom: -4px;
            margin-right: 12px;
          }
        }
      }
    }
  }
</style>
