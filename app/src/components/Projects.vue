<template>
  <div class=" q-ma-lg">
    <div
      class="row q-mb-md shadows-2 project-item q-py-md cursor-pointer"
      v-for="(project, index) in projects.filter( o => o.id !== excludedProject)"
      :key="index"
    >
      <div class="col-md-2">
        <q-img
          contain
          style="max-height: 150px"
          class="full-width"
          :src="project.icon"
        />
      </div>
      <div class="col-md-9">
        <div class="text-h6 text-bold q-pb-sm">{{ project.title }}</div>
        <q-item-label lines="3" class="text-body1">{{
          project.description
        }}</q-item-label>
      </div>
       <div class="col-md-1 flex flex-center">
      <q-icon size="3rem" color="grey" name="arrow_forward_ios" />
    </div>
    </div>

  </div>
</template>
<script>
export default {
  props:['excludedProject'],
  data () {
    return {
      projects: [
        {
          title: 'Liquid loans',
          chain: 'tpls',
          icon: 'https://pbs.twimg.com/profile_images/1478148626605957122/nUTE6oYY_400x400.jpg',
          tokens: [],
          website: '',
          twitter: '',
          youtube: '',
          description:
            'Liquid Loans is the first truly decentralized lending protocol built specifically for PulseChain. Algorithmic Stablecoin. Low 110% Collateral Ratio. No Repayment Schedule. Immutable. Governance-Free. No Admin Keys.'
        }, {
          title: 'Hedron',
          chain: 'tpls',
          icon: 'https://pbs.twimg.com/card_img/1482984603455475712/-DUeuQhB?format=jpg&name=360x360',
          tokens: [],
          website: '',
          twitter: '',
          youtube: '',
          description:
            'Hedron (HDRN) is a collection of smart contracts that live on the Ethereum and PulseChain blockchain(s). Hedron builds on top of HEX to allow stakers to mint and borrow HDRN tokens against their active HEX stakes. Hedron also allows stakers to trade their HEX stakes as NFT tokens on any compatible NFT marketplace. Hedron has no admin keys and no kill switches. Just like HEX, Hedron is completely decentralized with zero counterparty risk.'
        }, {
          title: 'HeartDefi',
          chain: 'tpls',
          icon: 'https://images-na.ssl-images-amazon.com/images/I/71koX05yioL._AC_SL1500_.jpg',
          tokens: [],
          website: '',
          twitter: '',
          youtube: '',
          description:
            'The portal to the Pulsechain ecosystem. 1 place to access everything you need for Pulse Chain DeFi and decentralized crypto in general.'
        }
      ]
    }
  }
}
</script>
<style scoped>
.project-item {
  box-shadow: 1px 1px 20px #e01f0038;
  border-radius: 20px;
}
</style>
