<template>
<div class="tokenbyaccount">
     <div v-if="mode == 'select'" class="row flex flex-center q-mt-md">
     <q-select :dark="$store.state.settings.lightMode === 'true'" @input="$emit('filterTokensByAccount', accountOption)" borderless v-model="accountOption" style="max-width:200px" outline dense :options="accounts">
      <template v-slot:option="scope">
        <q-item
          class="custom-menu"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-icon class="option--avatar" :name="`img:${scope.opt.icon}`" />
          </q-item-section>
          <q-item-section dark>
            <q-item-label v-html="scope.opt.name" />
            <q-item-label caption class="ellipsis">{{ getKeyFormat(scope.opt.key) }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-if="accountOption.value" v-slot:selected>
        <q-item>
          <q-item-section avatar>
            <q-icon class="option--avatar" :name="`img:${accountOption.icon}`" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="accountOption.name" />
            <q-item-label caption class="ellipsis ellipsis_important">{{ getKeyFormat(accountOption.key) }}</q-item-label>
          </q-item-section>

        </q-item>
      </template>
     </q-select>
      <q-item-section @click="copyToClipboard(accountOption.chain == 'eos' ? accountOption.name : accountOption.key)" v-if="accountOption.value" side top>
        <q-icon name="content_copy"  size="sm"/>
      </q-item-section>
    </div>
      <!-- v-else -->
      <q-list v-if="false" bordered class="rounded-borders">
        <q-item-label class="accounts_title_with" v-if="type" header>{{accounts.length}} accounts with {{type.toUpperCase()}}</q-item-label>
        <q-item @click="setAccount(account)" clickable v-ripple v-for="(account, index) in accounts" :key="index">
          <q-item-section avatar>
          <q-avatar color="primary" text-color="white"><span class="text-body1">{{account.name.substring(0,2).toUpperCase()}}</span></q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{account.name}}</q-item-label>
            <q-item-label caption >
            {{getKeyFormat(account.key)}}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <span class="text-caption"> ${{formatNumber(account.usd)}}</span>
            <span class="text-caption" v-if="type" > {{formatNumber(account.amount)}} {{type.toUpperCase()}}</span>

          </q-item-section>
        </q-item>
      </q-list>
    </div>
</template>
<script>
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Formatter from '@/mixins/Formatter'
export default {
  mixins: [Formatter],
  props: ['type', 'chain', 'mode'],
  data () {
    return {
      accountOption: {
        label: 'Filter by account',
        value: null
      },
      icons: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA41JREFUeF7t3bFNHVEURdFH4BosuQUHboEE6iEnISGhJEioAImAEkCiBge4iGXp6qJNfvRn9juz72Pma/7F88P714G/v7//QPqc+6dHym8P315d0yn8eHul/EUFIH4crgAZgEqUAQjffDgDZABqYQYgfPPhDJABqIUZgPDNhzNABqAWZgDCNx/OABmAWpgBCN98OANkAGphBiB88+EMkAGohRmA8M2Hxw1wefNC3we4+/VzlOLdx+fs5y8//4sKYP3ZfgFUAFv/UwGWKxDXvwJsvwIqQJtA6sD2C6A9AC3/aQRsvwJw/StABdh9H6QRgArYfgFUgArQrWDpQAboRpD0h7P6LKQRgEuQATIAVsjiGaDHwdSgRgDh607g+jthuP7rzz8DYAPaBLYJxApZvE1gm0BqUCOA8LUJXL8JwvVff/4ZABvQJrBNIFbI4m0C2wRSgxoBhK9N4PpNEK7/+vPPANiANoFtArFCFm8T2CaQGtQIIHzfYBOor4tHfhzX3yvQA9A3dOjna55/L0APQPMVwAhWAON3MgAC1HgGMIIZwPhlAOTH8QxgCDOA8csAyI/jGcAQZgDjlwGQH8czgCHMAMYvAyA/jmcAQ5gBjF8GQH4czwCGMAMYvwyA/DieAQwhG0AXYPvTNMN/zjS/CqAriPkK8PaKCHfHK0AFoAbrCG0EEH4PZ4AMQC3KAIRvPpwBMgC1MAMQvvlwBsgA1MIMQPjmwxkgA1ALMwDhmw9ngAxALcwAhG8+nAEyALVw3AB09OccfcXJ7dW1HgLl758eKT/9jiF+GERnXwHG3zJWAbDBGQABNgJmf3o2A2CBMwACzAAZgCrUfwGE7zQCjN9pBCDARkAjgCrUCCB8jQDDdxoBCrAR0AigDjUCCF8jwPA1ApRfTwOHf3Cj+wBY4fX3AS5vXr6QwWh8+nm6bmJH4Z1z+BdDpk+gAtgKVADjx3sY/HiOVwBE2AhAgBpvBBjBDGD8GgHIj+MZwBBmAOOXAZAfxzOAIcwAxi8DID+OZwBDmAGMXwZAfhzPAIYwAxi/DID8OJ4BDGEGMH77DfD88D76fQB9mLLdANPHv/4bQdMAtxe4AgyPgOkCV4AK0B5AOtAIEHr/4R1B0wqtABWACEwXuD0ALZ+/5q4CfHzSEkwDbATQ8u2/gipABSAC0wZrD0DLt99gFaACdCNIOtAeQOh1I6iXRW+/grYf/z8fqRaN9Yv7WgAAAABJRU5ErkJggg==',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA0xJREFUeF7t3bGN1FAURmFvG0REpNRAshJE5IRIdEFERAtI9EAEdSAaIKINkGjhBD/mfZvfHc//zpx7n8ceP/x4fPH78ndsAg8AOHbt/75xAJy9/gA4fP0BAABD4NEMmAGOXn5D4OHLDwAAOA9wNgNmgLPX3zbw8PUHAACcBziaATPA0ctvG3j48v8DALx++z0twpfPz1N9Lb778c9bwN0DvPvxAyAqAACHBwgAAKQE1jOMFpCW77oY4PAAAQCAlIAW4DxAAqgWmwFiglrA4QECAAApATOAGSABVIvNADFBLeDwAAEAgJTA7WeA+gl49/5lCvDuxZ8+fEtvoQKUZwAApPW7AMAAiSAGSPHtixmAARKFDJDi2xczAAMkChkgxbcvZgAGSBQyQIpvX8wADJAoZIAU376YARggUcgAKb59MQMwQKKQAVJ8++K5AT4+e5OeF1DfgOsB2vUANb8HAGwtsP4AAWC7/vmCEAYYL2B9eQawC0gMMUCKb1/MAAyQKGSAFN++mAEYIFHIACm+fTEDMECikAFSfPtiBmCARCEDpPj2xQzAAIlCBkjx7YuPN0C9omW/hO0I1rfXz78OBkB7YMbtWwAAANAcevNqLWD8zJ81PwAAQGLQDJDi2xczAAMkChkgxbcvZgAGSBQyQIpvX8wADJAoZIAU376YARggUcgAKb59MQMwQKIwG+DH44v0+wDp6K/r+vrzSf0Xt65/9fTX9Pjz8wLq0QMAAJWhW9czgBYwBVgLmMZ/XQzAAFMEGWAaPwPYBtoGOg+wlJAWsEz/0gK0AC1AC1hKSAtYpq8F+DLIiSAngqYO0gKm8f8Hu4B6RUu9O3j9dXJV+Dq/bID1GwDA8+QwAKT4usLXHyAAAKBdE7gmWAvQAuJnuJUbAt+237ixC9jmZwZoAsiXdK1bKAAAYAgsDJgBzACFn0sLiPcG2gbaBqZPYC3WArSAxJAWoAUkgOp5FNvAFP9/8GVQfXx8zC+fSKmvv65fD7H5eQE1wDpE1ddf1wNgfF08AJ69mf5EDANs74vQAsYK0AK0gCmCDDCNf39jDAAAYAhcMmAGMAMs+bu0gGn8ZgCngsc3xzIAAxgClwwYAg2BS/4MgdP0/4Gfy/8Db4COLhASZBMAAAAASUVORK5CYII=',
        ''
      ],
      accounts: []
    }
  },
  methods: {
    setAccount (account) {
      this.$store.commit(
        'investment/setDefaultAccount',
        account
      )
      const el = document.getElementById('main-container')

      const target = getScrollTarget(el)
      const offset = 0
      const duration = 200
      setScrollPosition(target, offset, duration)
    }
  },
  created () {
    if (this.mode !== 'select') {
      this.accounts = this.$store.state.wallets.tokens.filter(o => (o.type === this.type || !this.type) && o.chain === this.chain && !isNaN(o.amount)).map((a) => {
        let chain = this.setChains().find(o => o.chain === a.chain)
        a = this.formatAccoountOption(a)
        a.icon = chain ? chain.icon : ''
        a.origin = 'set'
        return a
      })
    } else {
      let chain = this.setChains().find(o => o.chain === this.chain)
      this.accounts = chain.accounts
      if (chain.accounts.length === 1) {
        this.accountOption = chain.accounts[0]
      }
    }
    /*
    this.accounts = this.accounts.concat(this.accounts).concat(this.accounts).concat(this.accounts).concat(this.accounts)
    this.accounts = this.accounts.concat(this.accounts)
    this.accounts = this.accounts.concat(this.accounts)
    this.accounts = this.accounts.concat(this.accounts)
    */
  }
}
</script>
