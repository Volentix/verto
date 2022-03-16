<template>
  <div :class="{'col-md-12':mode == 'all', 'col-md-6':mode == 'mini' && card.view == 'grid', 'col-md-3':mode == 'mini' && card.view == 'list'}">
     <div v-if="card.view == 'grid'" class="q-mr-md">
      <div class="myportofolio-area">
        <div class="myportofolio-left full-width">
          <div class="q-pl-md" >
            <span class="title" :class="[card.textColor]">{{ card.title }}</span
            ><span class="q-ml-lg text-grey text-bold shad"
              >${{ nFormatter2(total, 1) }}</span
            >
            <span  @click="mode == 'all' ? mode = 'mini': mode = 'all'" class="float-right q-pt-sm q-pr-md text-body2 cursor-pointer"> {{mode == 'mini' ? 'More' : 'Less'}} {{mode == 'mini' ? '('+card.data.length+')' : ''}} <q-icon :name="mode == 'mini' ? 'arrow_forward' : 'keyboard_backspace'" /></span>
          </div>
        </div>
        <div class="myportofolio-right" v-if="false">
          <ul>
            <li>
              <a href="" @click.prevent=""
                ><i class="fas fa-chevron-left"></i
              ></a>
            </li>
            <li>
              <a href="" @click.prevent=""
                ><i class="fas fa-chevron-right"></i
              ></a>
            </li>
          </ul>
        </div>
      </div>
       <AssetBalancesTable  v-if="mode == 'all'" class="full-width" :type="card.type" :tableData="card.data" :rowsPerPage="card.data.length"   />

      <div class="bitcoin-area" v-if="mode == 'mini'">
        <div class="bitcoin-part row q-col-gutter-sm rounded-borders">
          <div
            :class="{'col-md-3': mode == 'all', 'col-md-6' :  mode == 'mini'}"
            class="bitcoin-part_a "
            @click="$emit('setItemAction', { item: item, tab: card.type })"
            v-for="(item, i) in card.data.slice(0, mode == 'all' ? card.data.length + 1 : card.limit)"
            :key="i+card.type"
          >
            <div class="bitcoin-parta full-width col-md-12">
              <div class="bitcoin-part_a1">
                <img :onerror="defaultToken(item.chain)" :src="item.icon" alt="images not found" />
              </div>
              <div class="bitcoin-part_a2 q-ml-md">
                <q-item-section v-if="card.type == 'chains'">
                  <q-item-label lines="1">{{ item.label }}</q-item-label>
                  <q-item-label class="text-bold"
                    >${{
                      formatNumber(
                        getChainTotal(item),
                        2
                      )
                    }}</q-item-label
                  >
                </q-item-section>
                <q-item-section v-else-if="card.type == 'assets'">
                  <q-item-label lines="1">{{ item.chain !== 'terra' ? item.type.toUpperCase() : item.type }}</q-item-label>
                   <q-item-label caption
                    >{{ formatNumber(item.amount, 2) }}</q-item-label
                  >
                  <q-item-label class="text-bold"
                    >${{ formatNumber(item.usd, 2) }}</q-item-label
                  >
                </q-item-section>
                <q-item-section v-if="card.type == 'investments'">

                  <q-item-label
                   lines="1" >{{ item.type.toUpperCase() }}
                    {{ item.isStaked ? "Staked" : "" }}</q-item-label
                  >
                   <q-item-label v-if="!item.pending" caption
                    >{{ formatNumber(item.amount, 2) }}</q-item-label
                  >
                  <div v-if="item.pending">
                    Fetching HEX stats...

                    <q-linear-progress
                      indeterminate
                      color="grey"
                      class="q-mb-md"
                    />
                  </div>
                  <q-item-label v-else class="text-bold"
                    >${{ formatNumber(item.usd, 2) }}</q-item-label
                  >
                </q-item-section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="q-pa-md" style="max-width: 350px" v-else>
      <q-toolbar
        :class="[
          $store.state.settings.lightMode === 'false'
            ? card.bgColor
            : 'title-bg',
        ]"
        class="q-mb-sm"
      >
        <q-toolbar-title  :class="[card.textColor]" class="text-bold"
          >{{ card.title }}
          <span v-if="card.type !== 'farms'" class="float-right text-grey text-bold shad"
            >${{ nFormatter2(total,card.type == 'investments' ? 0 : 1) }}</span
          >
        </q-toolbar-title>
      </q-toolbar>

      <q-list separator>
        <q-item-label header>{{ card.description }}</q-item-label>
        <div
          style="min-height: 318px"
          v-if="card.data.length == 0"
          class="text-h6 flex flex-center text-center text-grey"
        >
          No <br />
          <br />{{ card.title }}<br />
          <br />
          found
        </div>
        <q-item
          @click="card.type == 'farms' ? $set(menuState, i , !menuState[i]) : $emit('setItemAction', { item: item, tab: card.type })"
          v-for="(item, i) in card.data.slice(0, card.limit)"
          :key="i+card.type"
          class="q-mb-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="item.icon"  :onerror="defaultToken(item.chain)"/>
            </q-avatar>
          </q-item-section>

          <q-item-section v-if="card.type == 'chains'">
            <q-item-label lines="1">{{ item.label }}</q-item-label>
            <q-item-label class="text-bold" lines="1"
              >${{
                nFormatter2(
                  getChainTotal(item),
                  2
                )
              }}</q-item-label
            >
          </q-item-section>
             <q-item-section v-if="card.type == 'farms'">
            <q-item-label lines="1">{{ item.type }}</q-item-label>
         <q-item-label class="text-h6 text-green text-bold"><q-icon name="trending_up" />  {{ item.apy }}%</q-item-label>
          </q-item-section>
          <q-item-section v-else-if="card.type == 'assets'">
            <q-item-label  lines="1">{{ item.type.toUpperCase() }}</q-item-label>

             <q-item-label :class="{'text-grey': $store.state.settings.lightMode === 'true'}" class="text-bold" lines="1"
              caption>{{ formatNumber(item.amount, 2) }} <span v-if="item.usd">| ${{ nFormatter2(item.usd) }}</span></q-item-label
            >
          </q-item-section>
          <q-item-section v-if="card.type == 'investments'">
            <q-item-label
              lines="1">{{ item.type.toUpperCase() }}
              {{ item.isStaked ? "Staked" : "" }}</q-item-label
            >
            <div v-if="item.pending">
              Fetching..

              <q-linear-progress indeterminate color="grey" class="q-mb-md" />
            </div>
            <q-item-label :class="{'text-grey': $store.state.settings.lightMode === 'true'}" class="text-bold" lines="1"
              caption>{{ formatNumber(item.amount , 1) }} <span v-if="item.usd">| ${{ nFormatter2(item.usd,1) }}</span></q-item-label
            >
          </q-item-section>
          <q-item-section class="farm-action" v-if="card.type == 'farms'" side>

            <q-btn-dropdown

       v-model="menuState[i]"
      dense
      flat
      icon="more_vert"
    >
      <q-list :dark="$store.state.settings.lightMode === 'true'" :class="$store.state.settings.lightMode === 'false'
            ? ''
            : 'title-bg'" >
        <q-item @click="triggerTokenAction(item)" clickable v-close-popup >
          <q-item-section avatar>
           <q-avatar>
              <img :src="item.icon"  :onerror="defaultToken(item.chain)"/>
            </q-avatar>
          </q-item-section>
          <q-item-section>
           <q-item-label class="texth-h6 text-bold">{{item.action}} </q-item-label>

          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>

        <q-item @click="exchangeToken(item)" class="texth-h6 text-bold" v-if="item.buy" clickable v-close-popup >
          <q-item-section avatar>
          <q-avatar>
              <img :src="item.icon"  :onerror="defaultToken(item.chain)"/>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Buy </q-item-label>
          </q-item-section>
         <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
          </q-item-section>
          <q-item-section v-else-if="!card.hideArrow" side>
            <q-icon name="chevron_right" color="grey" />
          </q-item-section>
        </q-item>
        <q-item
        v-if="card.data.length > card.limit"
          :class="[
            $store.state.settings.lightMode === 'false'
              ? card.bgColor
              : 'title-bg',
          ]"
          class="text-center flex flex-center"
        >
          <q-btn
            @click="$emit('showAll', card.type)"
            :icon="card.data.length ? 'add' : ''"
            flat
            :label="card.data.length ? 'See all ' + card.data.length : ''"
            :color="card.textColor.replace('text-')"
          />
        </q-item>
      </q-list>
    </div>
      <ErrorDialog @hideDialog="error.msg = null" :key="error.msg" v-if="error.msg" :error="error" />
  </div>
</template>
<script>
import ErrorDialog from '../Accounts/ErrorDialog'
import Formatter from '@/mixins/Formatter'
import AssetBalancesTable from '@/components/Verto/AssetBalancesTable'
export default {
  mixins: [Formatter],
  components: {
    AssetBalancesTable,
    ErrorDialog
  },
  props: ['card', 'getChainTotal', 'itemAction'],
  computed: {
    total () {
      let field = 'usd'
      let self = this
      if (this.card.type === 'chains') {
        field = 'chainTotal'
      }
      return this.card.data
        .map((v) =>
          isNaN(field === 'usd' ? v[field] : self.getChainTotal(v))
            ? 0
            : +(field === 'usd' ? v[field] : self.getChainTotal(v))
        )
        .reduce((a, b) => a + b, 0)
    }
  },
  data () {
    return {
      menuState: {},
      mode: 'mini',
      openDialog: false,
      error: {
        msg: null,
        data: {
          token: null,
          import: true,
          buy: true
        }
      }
    }
  }
}
</script>
<style scoped>
.title-bg {
  background-color: #0a1830;
}
/deep/ .q-btn-dropdown__arrow {
    display: none;
}

/*--- myportofolio-area start ---*/
.myportofolio-area {
    background-color: #fff;
    display: flex;
    margin-top: 25px;
    align-items: center;
    margin-bottom: 24px;
}

.myportofolio-left {
    width: 50%;
}

.myportofolio-left  .title{
    font-family: "Poppins-Bold";
    color: #0e134c;
    font-size: 25px;
    margin: 0;
}

.myportofolio-right {
    width: 50%;
}

.myportofolio-right ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    float: right;
}

.myportofolio-right ul li {
    float: left;
}

.myportofolio-right ul li a {
    color: #b5bbc7;
    font-size: 16px;
    width: 48px;
    height: 48px;
    background-color: #fff;
    line-height: 48px;
    border-radius: 50%;
    box-shadow: 0px 1px 5px rgb(0 0 0 / 20%);
    margin: auto;
    display: block;
    text-align: center;
    margin-left: 14px;
    transition: 0.2s all ease;
}

.myportofolio-right ul li a:hover {
    color: #fff;
    background-color: #01cfff;
}

.bitcoin-area {
    padding-bottom: 20px;
}

.bitcoin-part {
    display: flex;
}

.bitcoin-part_a {
    width: 32%;
}

.bitcoin-part_b {
    width: 32%;
}

.bitcoin-part_c {
    width: 32%;
}

.bitcoin-parta {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 8px 10px;
    border-radius: 5px;
}

.bitcoin-part_a1 {
   width: 25%;
}

.bitcoin-part_a1 img {
    width: 45px;
    height: 45px;
    display: block;
}

.bitcoin-part_a2 {
   width: 70%;
}

.bitcoin-part_a2 p {
    font-family: 'Poppins-Regular';
    color: #bdbfbc;
    font-size: 15px;
    margin: 0;
    padding-left: 2px;
}

.bitcoin-part_a2 p span {
   font-weight: bold;
    color: #3f4262;
}
.farm-action  {
width: 10px !important;
    display: contents;
    padding-left: 20px;
    }
.bitcoin-part_a2 h5 {
    font-family: 'Poppins-Regular';
    color: #bdbfbc;
    font-size: 13px;
    font-weight: 400;
    margin: 0;
    padding-left: 2px;
}

.bitcoin-part_a3 {
    width: 39%;
}

.bitcoin-part_a3 h5 {
    font-family: 'Poppins-Bold';
    color: #3f4262;
    font-size: 15px;
    margin: 0;
    padding-left: 2px;
    text-align: right;
}

.bitcoin-part_a3 p {
    font-family: 'Poppins';
    color: #ab47bb;
    font-size: 14px;
    margin: 0;
    text-align: right;
    padding-top: 5px;
}

.bitcoin-part_a3 p span {
    padding-right: 2px;
}

</style>
