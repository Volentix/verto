<template>
  <div class="news-area full-width" v-if="loaded">
    <h3 @click="initTimeline()" class="timeline">  <i class="fas fa-bell"></i> Timeline</h3>
    <div  class="row full-width" :class="{'q-col-gutter-md': !mini}">
    <div  class="full-width" v-if="mini">
    <div class="q-py-sm text-body2 text-grey row full-width"><div>Recents projects</div> <div class="text-right col cursor-pointer" @click="$router.push('/projects')">All -></div></div>
    <div class="col-md-12"  v-for="(item, i) in $store.state.settings.projects.slice(0, $store.state.currentwallet.user ? 4 : 10)" :key="'project'+i">
     <Notif   :key="'Project'+i" :data="item" v-if="item.type == 'project'" />
     </div>
     <div v-if="$store.state.currentwallet.user && timeline.length" class="q-py-sm text-body2 text-grey row full-width"><div>Recents transactions</div> <div class="text-right col cursor-pointer" @click="$router.push('/account/'+$store.state.currentwallet.user.address+'/history')">All -></div></div>
       <div class="col-md-12"  v-for="(item, i) in timeline.slice(0, 5)" :key="'div'+i">
     <Transaction   :key="'Transaction'+i" :data="item" v-if="item.type == 'transaction'" />
     </div>
</div>
    <div  v-show="!mini" :id="item.id"  :style="!maximize(item.id, index) ? 'height:auto' : 'height:80vh'" :key="index" v-for="(item, index) in feed" :class="{'col-md-6': !mini &&  !max[index], 'col-md-12': mini || maximize(item.id, index)}" >

     <q-item v-if="item.youtube"  class="q-mb-sm" >
        <q-item-section avatar>
          <q-avatar>
            <img :src="`https://cdn.quasar.dev/img/avatar6.jpg`">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Channel Name</q-item-label>

        </q-item-section>

        <q-item-section @click="mini ? $router.push('/community/y/'+item.id) : $set(max,index,!max[index])" style="width:100px" class="row inline endDetails" side>
         <div class="flex flex-center" >6m  ago </div> <div class="flex flex-center" ><q-btn flat :icon="maximize(item.id, index) ? 'close_fullscreen' : 'check_box_outline_blank'" /> </div>
        </q-item-section>
      </q-item>
     <iframe v-if="item.youtube"   width="100%" :style="!maximize(item.id, index) ? (mini ? '' : 'height:315px') : 'height:80vh; padding-bottom:80px'" :src="'https://www.youtube.com/embed/'+item.id" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

      <div v-if="item.twitter"  class="news-part">
      <blockquote class="twitter-tweet">
        <a :href="'https://twitter.com/x/status/'+item.id"></a>
         </blockquote>
    </div>
    </div>
    </div>

  </div>
</template>

<script>
import Formatter from '@/mixins/Formatter'
import Transaction from './RecentTransaction.vue'
import Notif from './RecentNotif.vue'
import Lib from '@/util/walletlib'
export default {
  mixins: [Formatter],
  props: ['mini'],
  components: {
    Transaction,
    Notif
  },
  data () {
    return {
      timeline: [],
      feed: [
        {
          youtube: true,
          id: 'xuRaE4xWIKY'
        },
        {
          youtube: true,
          id: 'AeqLcKtF-Bk'
        }, {
          youtube: true,
          id: '4799dgaQ0CE'
        }, {
          twitter: true,
          id: '807811447862468608'
        }],
      loaded: true,
      max: {}
    }
  },
  watch: {
    '$store.state.currentwallet.user': function (val) {
      if (val) {
        this.initTimeline()
      }
    }
  },
  methods: {
    async initTimeline () {
      if (!this.$store.state.currentwallet.user) return
      let history = await this.$store.dispatch('investment/getETHTransactions', this.$store.state.currentwallet.user.address)
      this.timeline = history.slice(0, 10).map(o => {
        o.type = 'transaction'
        o.icon = Lib.getTokenImage(o.symbol)
        o.date = this.getTimeAgo(o.timeStamp, true)
        return o
      })
    },
    maximize (id, index) {
      return (this.max[index] || (this.$route.params.id && this.$route.params.id === id))
    }
  },
  computed: {

  },
  created () {
    if (this.$route.params.id) {
      this.feed = this.feed.sort((a) => {
        return a.id === this.$route.params.id ? -1 : 1
      })
    }
  },
  mounted () {
    let twitterScript = document.createElement('script')
    twitterScript.src = 'https://platform.twitter.com/widgets.js'
    document.body.appendChild(twitterScript)
    twitterScript.addEventListener('load', () => {
      this.loaded = true
    })
    this.initTimeline()
  },
  destroyed () {

  }

}
</script>
<style scoped>
.feed-item {
    display: grid;
}
.endDetails {
    width: 100px;
    display: contents;
    }
</style>
