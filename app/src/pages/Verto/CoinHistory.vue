<template>
<q-page class="column text-black bg-grey-12" style="padding-bottom: 50px">
    <profile-header class="marg" version="type3" />
    <div class="transaction-wrapper">
        <div class="transaction-wrapper--list open">
            <q-list bordered separator class="list-wrapper">
                <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="item.to">
                <q-item-section class="item-date">
                    <span class="item-date--value" v-html="item.date" />
                </q-item-section>
                <q-item-section class="item-trans">
                    <span class="item-trans--transID">{{item.transID}}</span>
                    <span class="item-trans--desc">{{item.desc}}</span>
                </q-item-section>
                <q-item-section class="item-amount">
                    <span class="item-amount--value">{{item.amount}}</span>
                </q-item-section>
                </q-item>
            </q-list>
            <q-btn @click="showMore()" unelevated flat class="full-width transaction-wrapper--list__hide-transaction" color="white" text-color="black" label="See More..." />
        </div>
    </div>
</q-page>
</template>

<script>
import ProfileHeader from '../../components/Verto/ProfileHeader'
export default {
  name: 'History',
  components: {
    ProfileHeader
  },
  data () {
    return {
      active: true,
      showWallet: false,
      showText: false,
      menu: [
        { date: '<b>27</b> Today  ', transID: 'Transaction ID', to: '/transaction', desc: 'Sent to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>26</b> 5:15 AM', transID: 'Transaction ID', to: '/transaction', desc: 'Received to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>24</b> 6:15 PM', transID: 'Transaction ID', to: '/transaction', desc: 'Sent to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>23</b> 2:15 AM', transID: 'Transaction ID', to: '/transaction', desc: 'Received to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>23</b> 2:15 AM', transID: 'Transaction ID', to: '/transaction', desc: 'Received to kkkljo...', amount: '-2.0084 VTX' },
        { date: '<b>21</b> 4:15 AM', transID: 'Transaction ID', to: '/transaction', desc: 'Sent to kkkljo...', amount: '-2.0084 VTX' }
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
  .transaction-wrapper{
    padding: 0px 6%;
    margin-top: -30px;
    &--list{
      background-color: #fff;
      padding: 4% 5%;
      border-radius: 0px 0px 30px 30px;
      box-shadow: 0px 4px 16px 0px rgba(black, .09);
      &__hide-transaction{
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
        .item{
          &-date{
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
            max-width: 60px;
            &--value{
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: $Titillium;
              font-weight: $light;
              font-size: 10px;
              color: #7272FA;
              width: 50px;
              /deep/ b{
                font-weight: $bold;
                color: #6C0DCB;
                font-size: 26px;
                margin-bottom: -3px;
                margin-top: -7px;
              }
            }
          }
          &-trans{
            font-family: $Titillium;
            font-weight: $light;
            font-size: 14px;
            &--transID{
              font-weight: $bold;
              color: #0E163B;
              margin-top: 1px;
            }
            &--desc{
              color: #B0B0B0;
            }
          }
          &-amount{
            max-width: 90px;
            text-align: right;
            font-family: $Titillium;
            font-weight: $bold;
            font-size: 15px;
            color: #2A2A2A;
            justify-content: flex-start;
            margin-top: 2px;
            &--value{}
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
            border-top: 1px solid rgba(0,0,0,0.06);
          }
          .q-item{
            &:first-child{
              border-top: 1px solid rgba(0,0,0,0);
            }
            &:last-child{
              border-bottom: 1px solid rgba(0,0,0,.1);
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
      .coin-icon{
        margin-left: 10px;
        // opacity: .4;
      }
      .icons{
        // opacity: .4;
        &.reverse{
          transform: scaleX(-1);
        }
      }
      .item-name{
        color: #000;
        font-weight: 700;
        &--name{
          font-size: 14px;
        }
        &--purcent{
          font-size: 12px;
        }
      }
      .item-info{
        color: #000;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        &--amount{
          font-size: 14px;
        }
        &--amountUSD{
          font-size: 12px;
          color: #B0B0B0;
        }
      }
    }
  }
</style>
