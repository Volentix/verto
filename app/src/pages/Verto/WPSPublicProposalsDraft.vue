<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px;background: #f3f3f3 !important">
        <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/card-wps/public-proposals" text-color="black" icon="keyboard_backspace" />
                     Draft proposals
                </h2>
                <div class="privatekey_bg flex flex-center"><img src="statics/draft_proposals_bg.png" alt=""></div>
            </div>
            <div class="chain-tools-wrapper--list open">
                <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                      <div class="title">2 draft Proposals</div>
                      <!-- <div class="parag"></div> -->
                      <div class="list-proposals--wrapper">
                        <div class="item" v-for="item in 2" :key="item">
                          <div class="row flex justify-between">
                            <div class="">
                              <strong>My worker proposal #1</strong> &nbsp; Proposer: <strong>verto123</strong>
                            </div>
                          </div>
                          <div class="row full-width items-center q-mt-sm">
                            <div class="progress col col-6">
                              Duration: <strong>2</strong>
                              <br> Budget: <strong>80000000 VTX</strong>
                            </div>
                            <div class="vote col col-6 flex justify-end items-center">
                              <q-btn unelevated color="deep-purple-14" class="q-mr-sm --next-btn" rounded label="Activate" />
                              <q-btn unelevated color="grey" class="--next-btn" rounded label="Cancel" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br><br><br>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      goBack: '',
      progress: 0.3
    }
  },
  async created () {
    let tableData = await this.$store.state.wallets.tokens
    let params = this.$store.state.currentwallet.params
    this.currentWallet = tableData.find(w => w.chain === params.chainID && w.type === params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === params.accountName : w.key === params.accountName)
    )
    this.goBack = `/verto/wallets/${params.chainID}/${params.tokenID}/${params.accountName}`
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .chain-tools-wrapper{
    // padding: 0px 6%;
    &--list{
      &__hide-chain-tools{
        text-transform: initial !important;
        margin-top: 0px;
        margin-bottom: 10px;
        color: #7272FA !important;
      }
      .list-wrapper{
        overflow: hidden;
        visibility: hidden;
        height: 0px;
        opacity: 0;
        transform: translateY(-20px) scaleY(.5);
        transform-origin: top;
        transition: ease transform .3s, ease opacity .4s;
        &--chain{
          &__eos-to-vtx-convertor{
            background-color: #fff;
            margin-bottom: 10px;
            border-radius: 10px;
            padding: 4% 5%;
            box-shadow: 0px 4px 16px 0px rgba(black, .09);
            &--title{
              font-size: 22px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #2A2A2A;
              margin: 0px;
              padding-left: 22px;
              margin-top: 3px;
              position: relative;
            }
            .title{
              font-size: 20px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #2A2A2A;
              margin-bottom: 10px;
            }
            .list-proposals--wrapper{
              .item{
                border: 1px solid rgba(#707070, .09);
                border-radius: 15px;
                padding: 10px;
                margin-bottom: 10px;
                font-size: 10px;
                font-family: $Titillium;
                font-weight: $regular;
                color: #B0B0B0;
                strong{
                  color: #333;
                  font-size: 11px;
                  font-weight: $bold;
                }
              }
            }
            .--input{
              margin-top: 20px;
              /deep/ .q-field{
                height: 40px;
              }
              /deep/ .q-field__native,
              /deep/ .q-field__prefix,
              /deep/ .q-field__suffix{
                padding-top: 10px;
                padding-bottom: 0px;
              }
              /deep/ .q-field__label{
                top: 10px;
                font-size: 12px;
                font-weight: $bold;
                font-family: $Titillium;
              }
              /deep/ .q-field__marginal{
                height: 40px;
              }
              /deep/ .q-field__control{
                height: 40px;
              }
            }
            .--slider{
              /deep/ &.q-slider--dark {
                .q-slider__track-container{
                  background: rgba(0, 0, 0, 0.3);
                }
                .q-slider__pin-value-marker-text{
                  font-weight: $bold;
                  font-size: 11px;
                }
                .q-slider__pin-value-marker-bg{
                  background: #FFB200 !important;
                }
                .text-green{
                  background: #FFB200 !important;
                }
              }
            }
            .--next-btn{
              width: fit-content;
              text-transform: initial !important;
              font-size: 10px;
            }
            .--progress{
              height: 20px;
              /deep/ .q-linear-progress{
                margin-top: 8px;
                height: 5px !important;
                max-width: 90%;
                margin-left: auto;
                margin-right: auto;
                .q-linear-progress__track{
                  background: #FFB200;
                }
                .q-linear-progress__model--indeterminate:before,
                .q-linear-progress__model--indeterminate:after{
                  background: #FFB200;
                }
              }
            }
            .--back-btn{
              position: absolute;
              right: 0px;
              top: 6px;
            }
            .--subtitle{
              font-size: 17px;
              color: #000;
              font-family: $Titillium;
              font-weight: $regular;
              line-height: 20px;
              margin-top: 10px;
              margin-bottom: 30px;
              ul{
                padding: 0px;
                margin: 0px;
                margin-left: 20px;
                li{
                  font-size: 15px;
                  font-weight: $bold;
                  margin-bottom: 10px;
                  line-height: 15px;
                  color: #FFB200;
                  span{
                    color: #2A2A2A;
                  }
                }
              }
              &__success{
                color: #00D0CA;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__faild{
                color: #FFB200;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__transLink{
                color: #2A2A2A;
                border-bottom: 1px solid;
                width: fit-content;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__summary{
                margin-bottom: 20px;
                font-weight: $bold;
              }
              &__summary--list{
                list-style: disc;
                padding-left: 24px;
                margin-top: -10px;
                li{
                  color: #B0B0B0;
                }
              }
              &__success{
                color: #00D0CA;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__faild{
                color: #FFB200;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__transLink{
                color: #2A2A2A;
                border-bottom: 1px solid;
                width: fit-content;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__summary{
                margin-bottom: 20px;
                font-weight: $bold;
              }
              &__summary--list{
                list-style: disc;
                padding-left: 24px;
                margin-top: -10px;
                li{
                  color: #B0B0B0;
                }
              }
            }
            .--title,.--amount{
              font-size: 13px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #B0B0B0;
              text-transform: initial !important;
              line-height: 20px;
            }
            .--amount{
              color: #2A2A2A !important;
            }
          }
        }
      }
      &.open{
        margin-bottom: 0px;
        padding-left: 4%;
        padding-right: 4%;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 10px;
        }
      }
    }
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // padding-bottom: 100px;
    .privatekey_bg{
      margin-top: 0px;
      img{
        width: 100%;
        max-width: 330px;
      }
    }
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 0px;
      position: relative;
      z-index: 2;
      .btn-align-left{
        position: absolute;
        left: -35px;
        top: 10px;
      }
    }
  }
  .file-select-wrapper{
    border: 1px solid #CCC;
    border-radius: 100px;
    padding: 0px;
    overflow: hidden;
    position: relative;
    .icon-upload{
      font-size: 25px;
      position: absolute;
      right: 15px;
      opacity: .3;
    }
    label{
      width: 100%;
    }
    /deep/ .file-select > .select-button {
      padding: .12rem;
      color: transparent;
      background-color: #fbfbfb !important;
      padding: 10px 0px;
      border: none;
      flex-direction: row;
      justify-content: flex-start;
      display: flex;
      span{
        color: #000;
        padding: 0px 15px;
      }
    }
  }
  .mw40{
    max-width: 40px;
    padding: 0px;
  }
</style>
