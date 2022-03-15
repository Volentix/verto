<template>
  <div v-if="data.type === 'deposit' || data.type === 'redemption'" class="row q-pa-lg q-mt-md activity-item">
    <div class="transaction-hash flex flex-center">
      <q-btn color="white" flat text-color="white" dense no-caps label="Copy transaction hash" icon="file_copy" />
    </div>
    <div class="col-5 _date_title">
      <div class="column">
        <span class="date text-grey q-mb-md">{{data.date}}</span>
        <span class="title text-white minheight flex items-center">{{data.title}}</span>
      </div>
    </div>
    <div class="col-7">
      <div class="row justify-end">
        <div class="col-4 _amount">
          <div class="column">
            <span class="label text-grey q-mb-md">Amount</span>
            <span class="title text-white text-bold">
              <div class="flex items-center minheight">
                <img :src="data.amountCoin" width="40px" alt="">
                <span class="column q-pl-md">
                  <span class="balance">{{data.amountBalance}}</span>
                  <span class="equivalent">{{data.amountEquivalent}}</span>
                </span>
              </div>
            </span>
          </div>
        </div>
        <div class="col-4 _shares_received">
          <div class="column">
            <span class="label text-grey q-mb-md">Shares received</span>
            <span class="shares text-white text-bold minheight flex items-center">{{data.sharesReceived}}</span>
          </div>
        </div>
        <div class="col-4 _depositor">
          <div class="column items-end text-right">
            <span class="label text-grey q-mb-md text-right">Depositor</span>
            <span class="btn text-white text-right minheight flex items-center">
              <q-btn color="white" no-caps dense flat text-color="white">
                <div class="flex items-center">
                  <span class="text-bold text-white q-mr-md">{{data.depositor}}</span>
                  <q-icon name="file_copy" size="xs" />
                </div>
              </q-btn>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="data.type === 'entrance-fee' || data.type === 'protocol-fee-collected'" class="row q-pa-lg q-mt-md activity-item">
    <div class="transaction-hash flex flex-center">
      <q-btn color="white" flat text-color="white" dense no-caps label="Copy transaction hash" icon="file_copy" />
    </div>
    <div class="col-5 _date_title">
      <div class="column">
        <span class="date text-grey q-mb-md">{{data.date}}</span>
        <span class="title text-white minheight flex items-center">{{data.title}}</span>
      </div>
    </div>
    <div class="col-7">
      <div class="row justify-end">
        <div class="col-4 _shares_received">
          <div class="column">
            <span class="label text-grey q-mb-md">Shares received</span>
            <span class="shares text-white text-bold minheight flex items-center">{{data.shares}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="data.type === 'management-fee-paid-out'" class="row q-pa-lg q-mt-md activity-item">
    <div class="transaction-hash flex flex-center">
      <q-btn color="white" flat text-color="white" dense no-caps label="Copy transaction hash" icon="file_copy" />
    </div>
    <div class="col-5 _date_title">
      <div class="column">
        <span class="date text-grey q-mb-md">{{data.date}}</span>
        <span class="title text-white minheight flex items-center">{{data.title}}</span>
      </div>
    </div>
    <div class="col-7">
      <div class="row justify-end">
        <div class="col-4 _amount">
          <div class="column">
            <span class="label text-grey q-mb-md">Fee (% AUM)</span>
            <span class="title text-white text-bold">
              <div class="flex items-center minheight">
                <span class="balance">{{data.fee}}</span>
              </div>
            </span>
          </div>
        </div>
        <div class="col-4 _shares_received">
          <div class="column">
            <span class="label text-grey q-mb-md">Shares</span>
            <span class="shares text-white text-bold minheight flex items-center">{{data.shares}}</span>
          </div>
        </div>
        <div class="col-4 _depositor">
          <div class="column items-end text-right">
            <span class="label text-grey q-mb-md text-right">Recipient</span>
            <span class="btn text-white text-right minheight flex items-center">
              <q-btn color="white" no-caps dense flat text-color="white">
                <div class="flex items-center">
                  <span class="text-bold text-white q-mr-md">{{data.recipient}}</span>
                  <q-icon name="file_copy" size="xs" />
                </div>
              </q-btn>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="data.type === 'swap'" class="row q-pa-lg q-mt-md activity-item">
    <div class="transaction-hash flex flex-center">
      <q-btn color="white" flat text-color="white" dense no-caps label="Copy transaction hash" icon="file_copy" />
    </div>
    <div class="col-5 _date_title">
      <div class="column">
        <span class="date text-grey q-mb-md">{{data.date}}</span>
        <span class="title text-white minheight flex items-center">{{data.title}}</span>
      </div>
    </div>
    <div class="col-7">
      <div class="row justify-end">
        <div class="col-4 _amount">
          <div class="column">
            <span class="label text-grey q-mb-md">Protocol</span>
            <span class="title text-white text-bold">
              <div class="flex items-center minheight">
                <img :src="data.protocol.logo" width="40px" alt="">
                <span class="q-pl-md">
                  <span class="balance">{{data.protocol.name}}</span>
                </span>
              </div>
            </span>
          </div>
        </div>
        <div class="col-4 _shares_received">
          <div class="column">
            <span class="label text-grey q-mb-md">Shares received</span>
            <span class="title text-white text-bold">
              <div class="flex items-center minheight">
                <img :src="data.outgoingAsset.coin" width="40px" alt="">
                <span class="column q-pl-md">
                  <span class="balance">{{data.outgoingAsset.balance}}</span>
                  <span class="equivalent">{{data.outgoingAsset.equivalent}}</span>
                </span>
              </div>
            </span>
          </div>
        </div>
        <div class="col-4 _depositor">
          <div class="column items-end text-right">
            <span class="label text-grey q-mb-md text-right">Depositor</span>
            <span class="title text-white text-bold">
              <div class="flex items-center minheight">
                <img :src="data.incommingAsset.coin" width="40px" alt="">
                <span class="column q-pl-md">
                  <span class="balance">{{data.incommingAsset.balance}}</span>
                  <span class="equivalent">{{data.incommingAsset.equivalent}}</span>
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="data.type === 'vault-migration-executed' || data.type === 'vault-migration-signalled' || data.type === 'vault-created'" class="row q-pa-lg q-mt-md activity-item">
    <div class="col-5 _date_title">
      <div class="column">
        <span class="date text-grey q-mb-md">{{data.date}}</span>
        <span class="title text-white minheight flex items-center">{{data.title}}</span>
      </div>
    </div>
    <div class="col-7">
      <div class="row justify-end">
        <div class="col-4 _shares_received">
          <div class="column justify-center items-end q-pt-md">
            <q-btn color="white" dense class="q-mt-sm q-ml-sm q-mr-sm q-pl-lg q-pr-md" no-caps text-color="white" icon-right="chevron_right" outline rounded label="View Vault" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityItem',
  props: ['data'],
  data () {
    return {
    }
  },
  mounted () {
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  $bgActivity : #16161A;
  .activity-item{
    background: $bgActivity;
    border-radius: 10px;
    position: relative;
    .transaction-hash{
      position: absolute;
      border-radius: 10px;
      width: 100%;
      height: 100%;
      background: $bgActivity;
      z-index: 9;
      left: 0px;
      top: 0px;
      transition: opacity cubic-bezier(0.39, 0.575, 0.565, 1) .1s;
      opacity: 0;
      visibility: hidden;
      cursor: pointer;
      button{}
    }
    &:hover{
      .transaction-hash{
        opacity: 1;
        visibility: visible;
      }
    }
    .model_label{
      font-family: $MainFont;
      font-size: 14px;
      font-weight: 600;
    }
    .model_value{
      font-family: $MainFont;
      font-size: 14px;
      font-weight: 900;
    }
    .minheight{
      min-height: 50px;
    }
    ._date_title{
      .date{
        @extend .model_label;
      }
      .title{
        font-family: $MainFont;
        font-size: 20px;
        font-weight: 900;
      }
    }
    ._amount{
      .label{
        @extend .model_label;
      }
      .balance{
        @extend .model_value;
      }
      .equivalent{
        @extend .model_label;
        font-size: 12px;
        font-weight: 400;
        opacity: .7;
      }
    }
    ._shares_received{
      .label{
        @extend .model_label;
      }
      .shares{
        @extend .model_value;
      }
    }
    ._depositor{
      .label{
        @extend .model_label;
      }
      .btn{
        margin-right: -13px;
        /deep/ button{
          @extend .model_value;
        }
      }
    }
  }
</style>
