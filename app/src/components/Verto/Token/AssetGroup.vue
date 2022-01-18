<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-toolbar :class="[ $store.state.settings.lightMode === 'false' ? card.bgColor : 'title-bg']" class="q-mb-sm" >
      <q-toolbar-title :class="[card.textColor]" class="text-bold" >{{card.title}}
      <span class="float-right text-grey text-bold shad">${{nFormatter2(total,1)}}</span>
      </q-toolbar-title>
    </q-toolbar>

    <q-list class="shadow-1"   >

      <q-item-label  header>{{card.description }}</q-item-label>
      <div style="min-height:318px;" v-if="card.data.length == 0" class="text-h6 flex flex-center text-center text-grey">
      No <br/> <br/>{{card.title}}<br/> <br/> found
      </div>
      <q-item @click="$emit('setItemAction',{item:item, tab:card.type})" v-for="(item, i) in card.data.slice(0, card.limit)" :key="i" class="q-mb-sm" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <img :src="item.icon">
          </q-avatar>
        </q-item-section>

        <q-item-section v-if="card.type == 'chains'">
          <q-item-label lines="1">{{ item.label }}</q-item-label>
          <q-item-label class="text-bold" lines="1">${{ nFormatter2(getChainTotal(item), getChainTotal(item) > 10 ? 0 : 2)}}</q-item-label>
        </q-item-section>
        <q-item-section v-else-if="card.type == 'assets'">
          <q-item-label>{{ item.type.toUpperCase() }}</q-item-label>
          <q-item-label class="text-bold" lines="1">${{ formatNumber(item.usd, 2)}}</q-item-label>
        </q-item-section>
        <q-item-section v-if="card.type == 'investments'">
          <q-item-label>{{  item.type.toUpperCase() }} {{ item.isStaked ? 'Staked' : ''}}</q-item-label>
            <div v-if="item.pending">
              Fetching HEX stats...

              <q-linear-progress indeterminate color="grey" class="q-mb-md" />
</div>
                   <q-item-label v-else class="text-bold" lines="1">${{ formatNumber(item.usd, 2)}}</q-item-label>
        </q-item-section>

        <q-item-section v-if=" !card.hideArrow " side>
          <q-icon name="chevron_right" color="grey" />
        </q-item-section>

      </q-item>
       <q-item :class="[ $store.state.settings.lightMode === 'false' ? card.bgColor : 'title-bg']" class="text-center flex flex-center">
          <q-btn @click="$emit('showAll',card.type)" :icon="card.data.length ? 'add': ''" flat :label="card.data.length ? 'See all ' +(card.data.length) : ''" :color="card.textColor.replace('text-')" />
        </q-item>
    </q-list>
  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'

export default {
  mixins: [Formatter],
  props: ['card', 'getChainTotal', 'itemAction'],
  computed: {
    total () {
      let field = 'usd'
      let self = this
      if (this.card.type === 'chains') {
        field = 'chainTotal'
      }
      return this.card.data.map(v => (isNaN(field === 'usd' ? v[field] : self.getChainTotal(v)) ? 0 : +(field === 'usd' ? v[field] : self.getChainTotal(v)))).reduce((a, b) => a + b, 0)
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style scoped>
.title-bg {
background-color: #0a1830 ;
}
</style>
