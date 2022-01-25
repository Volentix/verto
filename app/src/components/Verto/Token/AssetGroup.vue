<template>
  <div :class="{'col-md-12':mode == 'all', 'col-md-6':mode == 'mini'}">
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
       <AssetBalancesTable  v-if="mode == 'all'" class="full-width" :tableData="card.data" :rowsPerPage="card.data.length"   />

      <div class="bitcoin-area" v-if="mode == 'mini'">
        <div class="bitcoin-part row q-col-gutter-sm rounded-borders">
          <div
          :class="{'col-md-3': mode == 'all', 'col-md-6' :  mode == 'mini'}"
            class="bitcoin-part_a "
            @click="$emit('setItemAction', { item: item, tab: card.type })"
            v-for="(item, i) in card.data.slice(0, mode == 'all' ? card.data.length + 1 : card.limit)"
            :key="i"
          >
            <div class="bitcoin-parta full-width col-md-12">
              <div class="bitcoin-part_a1">
                <img :src="item.icon" alt="images not found" />
              </div>
              <div class="bitcoin-part_a2 q-ml-md">
                <q-item-section v-if="card.type == 'chains'">
                  <q-item-label lines="1">{{ item.label }}</q-item-label>
                  <q-item-label class="text-bold"
                    >${{
                      nFormatter2(
                        getChainTotal(item),
                        getChainTotal(item) > 10 ? 0 : 2
                      )
                    }}</q-item-label
                  >
                </q-item-section>
                <q-item-section v-else-if="card.type == 'assets'">
                  <q-item-label lines="1">{{ item.type.toUpperCase() }}</q-item-label>
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
        <q-toolbar-title :class="[card.textColor]" class="text-bold"
          >{{ card.title }}
          <span class="float-right text-grey text-bold shad"
            >${{ nFormatter2(total, 1) }}</span
          >
        </q-toolbar-title>
      </q-toolbar>

      <q-list class="shadow-1">
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
          @click="$emit('setItemAction', { item: item, tab: card.type })"
          v-for="(item, i) in card.data.slice(0, card.limit)"
          :key="i"
          class="q-mb-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="item.icon" />
            </q-avatar>
          </q-item-section>

          <q-item-section v-if="card.type == 'chains'">
            <q-item-label lines="1">{{ item.label }}</q-item-label>
            <q-item-label class="text-bold" lines="1"
              >${{
                nFormatter2(
                  getChainTotal(item),
                  getChainTotal(item) > 10 ? 0 : 2
                )
              }}</q-item-label
            >
          </q-item-section>
          <q-item-section v-else-if="card.type == 'assets'">
            <q-item-label>{{ item.type.toUpperCase() }}</q-item-label>
            <q-item-label class="text-bold" lines="1"
              >${{ formatNumber(item.usd, 2) }}</q-item-label
            >
          </q-item-section>
          <q-item-section v-if="card.type == 'investments'">
            <q-item-label
              >{{ item.type.toUpperCase() }}
              {{ item.isStaked ? "Staked" : "" }}</q-item-label
            >
            <div v-if="item.pending">
              Fetching HEX stats...

              <q-linear-progress indeterminate color="grey" class="q-mb-md" />
            </div>
            <q-item-label v-else class="text-bold" lines="1"
              >${{ formatNumber(item.usd, 2) }}</q-item-label
            >
          </q-item-section>

          <q-item-section v-if="!card.hideArrow" side>
            <q-icon name="chevron_right" color="grey" />
          </q-item-section>
        </q-item>
        <q-item
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
  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'
import AssetBalancesTable from '@/components/Verto/AssetBalancesTable'
export default {
  mixins: [Formatter],
  components: {
    AssetBalancesTable
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
      mode: 'mini'
    }
  }
}
</script>
<style scoped>
.title-bg {
  background-color: #0a1830;
}
</style>
