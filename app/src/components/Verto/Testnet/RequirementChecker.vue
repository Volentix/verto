<template>
<div class="row" style="max-width: 780px;margin:0 auto;">
<div class="col-md-12 checker text-h4 q-mb-md">Do you qualify to get rewards ?</div>

<div class="col-md-5 checker ">
<p class="text-body1">Use this tools to see if you qualify to get rewarded and see what you need to do to satisfy the requirements.</p>
 <p class="error-message"></p>

 <q-input v-model="account" type="text" id="username" label="Enter EOS account name" class="bg-white q-px-md q-mt-md full-width" autocomplete="off" />
 <input class="cursor-pointer" type="submit" value="Check" @click="checkAll()" />

<div id="chart"></div>
<span class="closeBtn" title="Close Chart"></span>
</div>
<div class="col-md-7">
<q-list bordered separator class="req">
<q-item clickable v-ripple :active="active">
<q-item-section avatar>
 <q-icon :color="passRequirements.staking ? 'green' : 'red'" :name="passRequirements.staking ? 'done' : 'close'" />
</q-item-section>
<q-item-section>
 <q-item-label>1 - Stake 10,000 VTX</q-item-label>
 <q-item-label caption>or more</q-item-label>
</q-item-section>
<q-item-section v-if="!passRequirements.staking" side ><q-btn flat @click="emitEvent('stake')" label="Stake now"></q-btn></q-item-section>
</q-item>

<q-item clickable v-ripple :active="active" >
<q-item-section avatar>
 <q-icon :color="passRequirements.registered ? 'green' : 'red'" :name="passRequirements.registered ? 'done' : 'close'" />
</q-item-section>
<q-item-section>
 <q-item-label>2 - Register</q-item-label>
 <q-item-label caption>as a producer</q-item-label>
 </q-item-section>
 <q-item-section v-if="!passRequirements.registered && account && account.length" side><q-btn flat @click="emitEvent('register')" label="Register"></q-btn></q-item-section>
</q-item>

<q-item clickable v-ripple :active="active" >
<q-item-section avatar>
 <q-icon :color="passRequirements.nodeRunning ? 'green' : 'red'" :name="passRequirements.nodeRunning ? 'done' : 'close'"/>
</q-item-section>
<q-item-section>3 - Run your node</q-item-section>

<q-item-section v-if="!passRequirements.nodeRunning" side ><q-btn @click="showInstructions = true" flat label="Get instructions"></q-btn></q-item-section>
</q-item>

 <q-item clickable v-ripple :active="active" >
<q-item-section avatar>
 <q-icon :color="passRequirements.voted ? 'green' : 'red'" :name="passRequirements.voted ? 'done' : 'close'"/>
</q-item-section>
<q-item-section>4 - Vote at least for 1 producer</q-item-section>
</q-item>

<q-item clickable v-ripple :active="active" >
<q-item-section avatar>
 <q-icon :color="passRequirements.ranking ? 'green' : 'red'" :name="passRequirements.ranking ? 'done' : 'close'"/>
</q-item-section>
<q-item-section>
 <q-item-label>5 - Be in the top 21</q-item-label>
 <q-item-label v-if="passRequirements.registered" caption>Current rank: {{this.currentRank}}</q-item-label>
 </q-item-section>
</q-item>

 </q-list>
</div>
<iframe v-if="showInstructions" width="100%" height="415" src="https://www.youtube.com/embed/OeZN5ff86jI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 </div>
</template>
<script>

import {
  mapState
} from 'vuex'
import EosWrapper from '@/util/EosWrapper'
export default {
  components: {

  },
  props: ['name'],
  data () {
    return {
      account: '',
      active: true,
      currentRank: null,
      showInstructions: false,
      passRequirements: {
        staking: false,
        registered: false,
        nodeRunning: false,
        voted: false,
        checked: false
      }
    }
  },
  mounted () {
    if (this.name) {
      this.account = this.name
      this.checkAll()
    }
  },
  methods: {
    emitEvent (action) {
      if (action === 'stake') {
        this.$store.commit('currentwallet/updateParams', {
          chainID: 'eos',
          tokenID: 'vtx',
          accountName: this.account
        })
        this.$router.push({
          path: '/verto/stake'
        })
      } else if (action === 'register') {
        // console.log(this.$store.state.wallets.tokens.find(o => o.chain === 'eos' && o.name.toLowerCase() === this.account.toLowerCase()), 'this.$store.state.wallets.tokens.find(o => o.chain ===  && o.name.toLowerCaase() === this.account.toLowerCaase())')
        if (this.$store.state.wallets.tokens.find(o => o.chain === 'eos' && o.name.toLowerCase() === this.account.toLowerCase())) {
          this.$emit('registerAccount', this.$store.state.wallets.tokens.find(o => o.chain === 'eos' && o.name.toLowerCase() === this.account.toLowerCase()))
        } else {
          this.$q.notify('Import this account to your Verto Wallet to regsiter it')
        }
      }
    },
    async isAccounRegistared () {
      const result = await this.$vDexNodeConfigManager.accountRegistered(this.account)
      if (result) {
        this.passRequirements.registered = true
      }
    },
    checkAll () {
      this.passRequirements = {
        staking: false,
        registered: false,
        nodeRunning: false,
        voted: false,
        checked: false
      }
      this.isStakingRequerimentMet()
      this.isAccounRegistared()
      this.hasProducerVoted()
      this.checkRanking()
    },

    async isStakingRequerimentMet () {
      let stakingContract = 'vltxstakenow'

      const eos = new EosWrapper()

      let stake = (await eos.getTable(stakingContract, this.account, 'accountstake'))

      if (stake.length) {
        let totalStake = parseInt(stake[0].amount.split(' ')[0])

        if (totalStake >= 10000) {
          this.passRequirements.staking = true
        }
      }
    },
    async hasProducerVoted () {
      const result = await this.$vDexNodeConfigManager.getUserVoted(this.account)
      if (result) {
        this.passRequirements.voted = true
      }
    },
    async checkRanking () {
      const rank = await this.$vDexNodeConfigManager.getUserRank(this.account)
      if (rank) {
        this.passRequirements.voted = true
      }
      this.currentRank = rank
    },
    isNodeRunning () {
      this.$vDexNodeConfigManager.accountRegistered(this.account)
    }
  },
  computed: {
    ...mapState('vdexnode', [ 'status' ])
  }
}
</script>
<style scoped>
.req
button {
background: #dbe1e1;
width: max-content;

}
.checker {
 background: #e9e9e9;
 padding: 10px;
}
*:focus {
 outline: none;
}
::-webkit-input-placeholder {
 color: rgba(255, 255, 255, 0.5);
}
::-moz-placeholder {
 color: rgba(255, 255, 255, 0.5);
}
:-moz-placeholder {
 color: rgba(255, 255, 255, 0.5);
}
:-ms-input-placeholder {
 color: rgba(255, 255, 255, 0.5);
}

a {
 text-decoration: none;
}
a:hover {
 opacity: 0.6;
 text-decoration: underline;
}
h1,
p {
 margin: 0;
}
form h1 {
 position: absolute;
 top: -50px;
 width: 100%;
 left: 0;
 color: #193b48;
 text-align: center;
 text-shadow: 1px 1px #fff;
}
label {
 width: 100px;
 float: left;
 line-height: 50px;
}
input[type="text"] {
 background: rgba(255, 255, 255, 0.2);
 border: 0;
 margin: 0;
 font: normal 16px/20px "Open Sans", sans-serif;
 padding: 14px 10px;
 color: #fff;
 width: 100px;
 text-align: center;
 vertical-align: baseline;
 width: 200px;
 float: left;
}
input[type="text"]:active,
input[type="text"]:focus {
 box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}
input[type="submit"] {
 display: block;
 margin-top: 20px;
 width: 100%;
 background: #193b48;
 box-shadow: 0 2px 0 #000;
 border: 0;
 color: #fff;
 font: 800 22px/50px "Open Sans", sans-serif;
 text-transform: uppercase;
 float: left;
 position: relative;
}
input[type="submit"]:active {
 top: 2px;
 box-shadow: none;
}

.glow {
 animation: glow 1s infinite;
}
@keyframes glow {
 0,
 100% {
 color: #fff;
 }
 50% {
 color: #fda543;
 }
}
.error-message {
 opacity: 0;
 z-index: -1;
 transition: opacity 250ms;
 color: #fff;
 background: #f63d3a;
 line-height: 52px;
 text-align: center;
 width: 100%;
 position: absolute;
 top: -65px;
 left: 0;
}
.error-message.shown {
 opacity: 1;
 z-index: 1;
}

/*Icons, 16x16*/
.icn::before {
 display: inline-block;
 width: 16px;
 height: 16px;
 content: "";
 position: relative;
 top: 3px;
 margin-right: 5px;
}
.icn.icn-codepen::before {
 background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAt0lEQVR42sXTsQqCUBTG8Qjc09ldN4V6l3qP2ut1stUhHSvdLhgU+h6123/4BiMvGQUd+MHlePjg6HXUtu1XfhdgqbG81JCAKQqUOg8OcLCGwVGMes67gAgZdvCwFA8JckS2gAluyBQWoJJAvb1m3L4AH1ekOKHGQmr1Us34toCLhgo0mEtjD7CvEKLCGWFnhXvvCqoYOZLOS1zBxVbP4iGfcQODgxj1nE8u0gylcH6q313l//+ND240fI6rONevAAAAAElFTkSuQmCC);
}
.icn.icn-heart::before {
 background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAArElEQVQ4jc3SPQrCQBQE4A/1BKKnEI8h2CjY23iA9HoEbyGIB7G10AvYRQRLbUPUwkVCSPxJIQ5Mse/NzHu7LP+ENla4IMYU9cAZ9jhiiVbe3MAOtxwXgfn6NgQ/0S8QvWMPaiGgU+HK3WzAoUJAnD00cSpYs4xnBQ85QPKBOcGwbK3Rm5AkaF5ijLTAnIbeR5jgmjFfQ+0rRJmAqExUL2tg4/FD15h/O/13uAP+TU7uPo9xKwAAAABJRU5ErkJggg==);
}
.icn.icn-comment::before {
 background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKxJREFUOI210jsOQUEYxfGfR4OSXdiChF0IUdiItSgVeq9IJBoRpd4K1CqvwsUUXNcVJznJTCbn/33zzfCjMjFnWVSi9R7npMAmZjjgEvmAOVpxRctYBKF3XgadPZTDKkH47jXyIaD9RfjuDrdBQf3DbF6pEQJOKQCnEDBNAZiEmwxGkt9/5sVzFjFIEB6iFNdaDX3scAyCY9HgvlXP8wMV0gCgiy02qKaF/EdXo/NMvKd9uQsAAAAASUVORK5CYII=);
}
.icn.icn-view::before {
 background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAA7ElEQVQ4jcXSMUpDURAF0BMhYi1oJNhZGYighQsQK7G0cx+CLsR96A4SIdlBUNCIRKy0UFEQRC2cBy+PfE2lA5///ty58/69M/x31H7Ir6AZ33e4wudvDWdxgMsozp8hDjFXRW5hkBGe0Ecvzil/jtWSvI7HrOgMSxneQCfDH9BO4CJuMvAVy9gJ3UPshh8vhaQFOC209qLxdZYbRa5b1J7MYL6Q8xHvfEK1AktRhw28TZCwFTffYnuChFF4A/bxbnoTn7FZ/I0945OoGuMF1kpyiiaOcW/crOT6kWKRqla57nuVG0GeepX/Pr4AgepbklEkZ7YAAAAASUVORK5CYII=);
}

/*Preloader*/
.preload {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 0;
 height: 0;
 transition: height 450ms, width 450ms;
}
.loading .preload {
 width: 100px;
 height: 100px;
 opacity: 1;
}
.preload hr {
 border: 0;
 margin: 0;
 width: 40%;
 height: 40%;
 position: absolute;
 border-radius: 50%;
 animation: spin 2s ease infinite;
}
.preload :first-child {
 background: #19a68c;
 animation-delay: -1.5s;
}
.preload :nth-child(2) {
 background: #f63d3a;
 animation-delay: -1s;
}
.preload :nth-child(3) {
 background: #fda543;
 animation-delay: -0.5s;
}
.preload :last-child {
 background: #193b48;
}
.preload::after {
 position: absolute;
 bottom: -70px;
 left: -50px;
 width: 200px;
 text-align: center;
 color: #19a68c;
}
.loading .preload::after {
 content: attr(data-preload);
}
@keyframes spin {
 /*Since IE HATES transforms, we're gonna use abs. positioning*/
 0%,
 100% {
 top: 0;
 left: 0;
 }
 25% {
 top: 0;
 left: 60%;
 }
 50% {
 top: 60%;
 left: 60%;
 }
 75% {
 top: 60%;
 left: 0;
 }
}

form {
 width: 320px;
 background: #19a68c;
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 padding: 50px;
 border-radius: 5px;
 color: #fff;
 transition: all 450ms;
 z-index: 10;
}
.loading form,
.loaded form {
 top: -50%;
}

#chart {
 width: 100%;
 opacity: 0;
 transition: opacity 450ms;
 overflow: hidden;
}
.loaded #chart {
 opacity: 1;
}
.overview-bar {
 width: 100%;
 font-size: 14px;
 color: #19a68c;
 margin: 5px 0 20px;
 text-align: center;
}
.overview-bar .icn {
 margin: 0 10px;
}
.chart-username {
 color: #19a68c;
}
.chart-label {
 color: #193b48;
 font-size: 13px;
}

.closeBtn {
 width: 40px;
 height: 40px;
 opacity: 0;
 position: fixed;
 top: 12px;
 right: -40px;
 cursor: pointer;
 transition: all 250ms;
}
.closeBtn:hover {
 transform: rotate(180deg);
}
.closeBtn::after,
.closeBtn::before {
 content: "";
 transition: background 250ms;
 width: 56px;
 height: 2px;
 background: #f63d3a;
 position: absolute;
 top: 19px;
 left: -8px;
 transform: rotate(45deg);
}
.closeBtn::after {
 transform: rotate(-45deg);
}
.closeBtn:hover::before,
.closeBtn:hover::after {
 background: #19a68c;
}
.loaded .closeBtn {
 right: 12px;
 opacity: 1;
}

</style>
