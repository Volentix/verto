<template>
<div>
  <div class="chain-tools-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="chain-tools-wrapper--list open">
      <div class="list-wrapper">
        <div class="list-wrapper--chain__type flex justify-between item-center">
          <div class="chain">Chain: <b>EOS</b></div>
          <div class="token">Token: <b>VTX</b></div>
        </div>
        <div class="list-wrapper--chain__coming-soon">
          <ul>
            <li>
               <q-btn class="btn-soon full-width" unelevated flat color="white" text-color="black">
                 <span class="title">Staking</span><span class="soon">Coming soon <q-icon class="icon" name="keyboard_arrow_right" /></span>
               </q-btn>
            </li>
            <li>
              <!-- Lending Voting EOS to VTX Convertor -->
               <q-btn class="btn-soon full-width" unelevated flat color="white" text-color="black">
                 <span class="title">Lending</span><span class="soon">Coming soon <q-icon class="icon" name="keyboard_arrow_right" /></span>
               </q-btn>
            </li>
            <li>
              <!-- Lending Voting EOS to VTX Convertor -->
               <q-btn class="btn-soon full-width" unelevated flat color="white" text-color="black">
                 <span class="title">Voting</span><span class="soon">Coming soon <q-icon class="icon" name="keyboard_arrow_right" /></span>
               </q-btn>
            </li>
          </ul>
        </div>
        <div class="list-wrapper--chain__eos-to-vtx-convertor">
          <h3 class="list-wrapper--chain__eos-to-vtx-convertor--title">EOS to VTX Convertor</h3>
          <div class="">
            <q-stepper
              v-model="step"
              vertical
              color="primary"
              animated
              flat
            >
              <q-step
                :name="1"
                title="How many EOS"
                prefix="1"
                :done="step > 1"
              >
                For each ad campaign that you create, you can control how much you're willing to
                spend on clicks and conversions, which networks and geographical locations you want
                your ads to show on, and more.

                <q-stepper-navigation>
                  <q-btn @click="step = 2" color="primary" label="Continue" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Sign & submit"
                caption="Optional"
                prefix="2"
                :done="step > 2"
              >
                An ad group contains one or more ads which target a shared set of keywords.

                <q-stepper-navigation>
                  <q-btn @click="step = 4" color="primary" label="Continue" />
                  <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="4"
                title="Result"
                prefix="3"
              >
                Try out different ad text to see what brings in the most customers, and learn how to
                enhance your ads using features like ad extensions. If you run into any problems with
                your ads, find out how to tell if they're running and how to resolve approval issues.

                <q-stepper-navigation>
                  <q-btn color="primary" label="Finish" />
                  <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div>
        </div>
        <br><br><br>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ChainTools',
  data () {
    return {
      step: 1,
      active: true,
      showWallet: false,
      showText: false,
      menu: [
        { date: '<b>27</b> Today  ', transID: 'chain-tools ID', to: '/chain-tools', desc: 'Sent to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>26</b> 5:15 AM', transID: 'chain-tools ID', to: '/chain-tools', desc: 'Received to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>24</b> 6:15 PM', transID: 'chain-tools ID', to: '/chain-tools', desc: 'Sent to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>23</b> 2:15 AM', transID: 'chain-tools ID', to: '/chain-tools', desc: 'Received to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>23</b> 2:15 AM', transID: 'chain-tools ID', to: '/chain-tools', desc: 'Received to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>21</b> 4:15 AM', transID: 'chain-tools ID', to: '/chain-tools', desc: 'Sent to kkkljo...', amount: '-2.0084 VTX' }
      ]
    }
  },
  methods: {
    showMore () {

    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
    .chain-tools-wrapper{
      padding: 0px 6%;
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
            &__type{
              background-color: #fff;
              margin-bottom: 10px;
              border-radius: 0px 0px 10px 10px;
              padding: 3% 8%;
              box-shadow: 0px 4px 16px 0px rgba(black, .09);
              font-family: $Titillium;
              font-size: 20px;
              color: #2A2A2A;
              font-weight: $bold;
              b{
                color: #7272FA;
                text-transform: uppercase;
              }
              .chain{}
              .token{}
            }
            &__coming-soon{
              ul{
                list-style: none;
                padding: 0px;
                margin: 0px;
                padding: 5% 6%;
                li{
                  &:not(:last-child){
                    border-bottom: 1px solid #707070;
                  }
                  .btn-soon{
                    text-transform: initial !important;
                    padding: 20px 10px;
                    border-radius: 0px;
                    /deep/ .q-btn__content{
                      display: flex;
                      justify-content: space-between;
                      flex-direction: row;
                      align-items: center;
                      align-content: center;
                    }
                    .title{
                      font-size: 20px;
                      color: #454F63;
                      font-weight: $bold;
                      margin-right: auto;
                    }
                    .soon{
                      font-size: 16px;
                      color: #B0B0B0;
                      display: flex;
                      justify-content: space-between;
                      flex-direction: row;
                      align-items: center;
                      align-content: center;
                    }
                    .icon{
                      color: #78849E;
                      position: relative;
                      top: 2px;
                      margin-left: 20px;
                    }
                  }
                }
              }
            }
            &__eos-to-vtx-convertor{
              background-color: #fff;
              margin-bottom: 10px;
              border-radius: 10px;
              padding: 1% 2%;
              box-shadow: 0px 4px 16px 0px rgba(black, .09);
              &--title{
                font-size: 22px;
                font-family: $Titillium;
                font-weight: $bold;
                color: #2A2A2A;
                margin: 0px;
                padding-left: 22px;
                margin-top: 10px;
              }
            }
          }
        }
        &.open{
          margin-bottom: -100px;
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
</style>
