<template>
<div>
  <div class="transaction-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="transaction-wrapper--list open" v-if="isMobile">
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
    <div class="transaction-wrapper--list open" v-else>
      <q-scroll-area :visible="true" class="q-pr-md" style="height: 200px;">
        <q-list bordered separator class="list-wrapper">
          <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="item.to">
            <q-item-section class="item-date">
              <span class="item-date--value" v-html="item.date" />
            </q-item-section>
            <q-item-section class="item-trans flex">
              <span class="item-trans--transID">{{item.transID}}</span>
              <span class="item-trans--desc">{{item.desc}}</span>
            </q-item-section>
            <q-item-section class="item-amount">
              <span class="item-amount--value">{{item.amount}}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</div>
</template>

<script>
import { QScrollArea } from 'quasar'

export default {
  name: 'History',
  components: {
    QScrollArea
  },
  props: {
    isMobile: {
      type: Boolean,
      required: false,
      default: true
    }
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
    margin-top: -20px;
    @media screen and (min-width: 768px) {
      padding: 0px;
    }
    &--list{
      background-color: #fff;
      padding: 4% 5%;
      border-radius: 0px 0px 30px 30px;
      box-shadow: 0px 4px 16px 0px rgba(black, .09);
      @media screen and (min-width: 768px) {
        box-shadow: none;
        padding: 5% 1.5%;
      }
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
            @media screen and (min-width: 768px) {
              max-width: 80px;
            }
            &--value{
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: $Titillium;
              font-weight: $light;
              font-size: 10px;
              color: #7272FA;
              width: 50px;
              @media screen and (min-width: 768px) {
                width: 80px;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
              }
              /deep/ b{
                font-weight: $bold;
                color: #6C0DCB;
                font-size: 26px;
                margin-bottom: -3px;
                margin-top: -7px;
                @media screen and (min-width: 768px) {
                  margin-right: 10px;
                }
              }
            }
          }
          &-trans{
            font-family: $Titillium;
            font-weight: $light;
            font-size: 14px;
            @media screen and (min-width: 768px) {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              margin-top: -2px;
              font-size: 12px;
            }
            &--transID{
              font-weight: $bold;
              color: #0E163B;
              margin-top: 1px;
              @media screen and (min-width: 768px) {
                margin-top: 0px;
                margin-right: 10px;
              }
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
        @media screen and (min-width: 768px) {
          margin-bottom: 0px;
          margin-top: 10px;
        }
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
