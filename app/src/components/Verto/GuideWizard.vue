<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog

      v-model="dialog"
      persistent
      position="right"
      style="max-width: 400px"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card :dark=" $store.state.settings.lightMode === 'true'" class="" style="min-width:334px;">
        <q-bar>
          <q-space />

          <q-btn
            dense
            flat
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn @click="closeWizard()" dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section :class="{'bg-grey-12':  $store.state.settings.lightMode === 'false'}">
          <div class="text-h6 flex">
            <svg
              class="svg_logo q-mr-sm"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 20.58"
            >
              <path
                d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
                transform="translate(-183 -18.21)"
              ></path>
            </svg>
            Welcome to Verto
          </div>
        </q-card-section>

        <q-card-section class="q-pt-md text-body1">
          What do you want to do ?
          <q-input :dark=" $store.state.settings.lightMode === 'true'" @click="getAccount()" clearable clear-icon="close" dense filled label="Type an action" @input="filterActions()" v-model="searchAction" class="q-mt-sm" />
        </q-card-section>
        <q-card-section v-if="currentActionItem" class="q-py-sm text-body2 bg-grey-12">
          <b
            @click="
              accountDropdown = false;
              filterAccount();
            "
            class="cursor-pointer"
          >
            Actions </b
          >> {{ currentActionItem.label }}
        </q-card-section>
        <q-card-section
        v-show="!filteredActions.reduce((a, b) => +a + +b.items.length, 0)"
          class="bg-grey-12">
        <p >
         No actions found
        </p>
        </q-card-section>
        <q-card-section
          v-show="!accountDropdown && list.items.length"
          :class="{'bg-grey-12':  $store.state.settings.lightMode === 'false'}"
          v-for="(list, index) in filteredActions"
          :key="index"
        >
          <span class="text-body2" v-if="list.items.length">{{ index + 1 + "- " + list.listLabel }}</span>
          <q-list class="q-mt-md" bordered separator>
            <q-item
              v-show="list.items.length"
              clickable
              v-ripple
              @click="
                currentActionItem = item;
                currentAction = list;
                triggerMethods(item.methods);
              "
              v-for="(item, i) in list.items"
              :key="i"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-if="accountDropdown">
          <p v-if="currentToken && currentToken.autoSelect">
            {{ "Use your " + (currentActionItem.type ?  currentActionItem.type.toUpperCase() : currentAction.chain.toUpperCase() )+ " account" }}
          </p>
          <p v-else>{{ "Select " + currentAction.chain.toUpperCase() + " account" }}</p>
          <q-select
            :dark="$store.state.settings.lightMode === 'true'"
            :light="$store.state.settings.lightMode === 'false'"
            separator
            rounded
            dense
            outlined
            style="min-width: 300px"
            class="select-input accountDropdown"
            @input="selectWallet()"
            v-model="currentToken"
            :options="accounts"
          >
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
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption class="ellipsis mw200">{{
                    scope.opt.value
                      ? scope.opt.value.toString().substring(0, 10) + "..."
                      : ""
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item v-if="currentToken">
                <q-item-section avatar>
                  <q-icon class="option--avatar" :name="`img:${currentToken.icon}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="currentToken.label" />
                  <q-item-label caption class="ellipsis mw200">{{
                    currentToken.value.substring(0, 10) + "..."
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-else> </q-item>
            </template>
          </q-select>
          <q-btn
            rounded
            :to="currentActionItem.to"
            @click="dialog = false"
            class="q-mt-md"
            outline
            color="black"
            label="Proceed"
          />
        </q-card-section>
         <q-card-section :class="{'bg-grey-12':  $store.state.settings.lightMode === 'false'}">
          <div class="text-h6 q-pb-md">Support</div>

          <q-btn flat label="Ask the community" icon="groups" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
const actions = [
  {
    chain: 'eos',
    listLabel: 'EOS CHAIN',
    items: [
      {
        label: 'Stake/Buy CPU',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        methods: ['showAccountDropdown'],
        to: '/verto/stake'
      },
      {
        label: 'Import EOS account',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        to: '/verto/import-private-key/eos'
      },
      {
        label: 'Invest',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/liquidity'
      },
      {
        label: 'Exchange',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/swap'
      }
    ]
  },
  {
    chain: 'eth',
    listLabel: 'ETH CHAIN',
    items: [
      {
        label: 'Import ETH account',
        icon: 'img:https://files.coinswitch.co/public/coins/eth.png',
        to: '/verto/import-private-key/eth'
      },
      {
        label: 'Invest',
        icon: 'img:https://files.coinswitch.co/public/coins/eth.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/liquidity'
      },
      {
        label: 'Exchange',
        icon: 'img:https://files.coinswitch.co/public/coins/eth.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/swap'
      }
    ]
  },
  {
    chain: 'eos',
    listLabel: 'VTX',
    items: [
      {
        label: 'Stake VTX now',
        icon: 'img:https://ndi.340wan.com/eos/volentixgsys-vtx.png',
        methods: ['showAccountDropdown'],
        to: '/verto/stake',
        type: 'vtx'
      }
    ]
  }
]
export default {

  data () {
    return {
      dialog: true,
      accountDropdown: false,
      active: true,
      maximizedToggle: true,
      accounts: [],
      searchAction: null,
      currentToken: null,
      currentAction: null,
      currentActionItem: null,
      filteredActions: []

    }
  },
  watch: {
    '$route' (to, from) {
      if (to !== from) {
        this.dialog = false
      }
    }
  },
  methods: {
    closeWizard () {
      localStorage.setItem('closewizard', Date.now())
      this.$bus.$emit('showHomeIntro')
    },
    showAccountDropdown () {
      this.filterAccount(this.currentActionItem.type ? this.currentActionItem.type : this.currentAction.chain, this.currentAction.chain)

      if (this.accounts.length === 1) {
        this.currentToken = this.accounts[0]
        this.currentToken.autoSelect = true
        this.selectWallet()
      }
      this.accountDropdown = true
    },
    filterActions () {
      this.filteredActions = actions.map((action) => {
        let o = JSON.parse(JSON.stringify(action))
        o.items = action.items.filter((o) => {
          return (!this.searchAction || this.searchAction.trim().length === 0 || o.label.toLowerCase().includes(this.searchAction.toLowerCase()))
        })
        return o
      })
    },
    setDefiAccount () {
      this.$store.commit('investment/setDefaultAccount', this.accounts.find(o => o.chain === this.currentAction.chain))
      this.$router.push(this.currentActionItem.to)
    },
    selectWallet () {
      this.$store.commit('currentwallet/updateParams', {
        chainID: this.currentToken.chain,
        tokenID: this.currentToken.type,
        accountName: this.currentToken.name
      })
      this.$store.commit('currentwallet/updateCurrentWallet', this.currentToken)
    },
    triggerMethods (methods) {
      if (methods) {
        methods.forEach((method) => this[method]())
      } else {
        this.$router.push(this.currentActionItem.to)
        this.dialog = false
      }
    },
    filterAccount (type = false, chain = false, name = false) {
      console.log(type, chain, name, this.accounts)
      this.accounts = this.$store.state.wallets.tokens
        .filter(
          (a) =>
            (type === false || a.type === type) &&
            (chain === false || a.chain === chain) &&
            (name === false || a.name === name)
        )
        .map((token) => {
          token.label = token.name
          token.value = token.key
          return token
        })

      console.log(this.accounts)
    },
    getAccount () {
      this.accountDropdown = false
      this.accounts = this.$store.state.wallets.tokens.map((token) => {
        token.label = token.name
        token.value = token.key

        return token
      })
    }
  },
  mounted () {
    this.filteredActions = actions
    this.getAccount()
  }
}
</script>
<style>
.q-dialog__inner--maximized {
  max-width: 400px;
}
.q-dialog.fullscreen {
  z-index: 5999;
}
</style>
