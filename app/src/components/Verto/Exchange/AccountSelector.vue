<template>
  <div
    v-if="!chain || chains || showAllWallets"
    :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }"
  >
    <div v-if="!($q.platform.is.mobile || $isbex) && false">
      <q-btn
        class="account_selector"
        dense
        v-if="accountOption"
        :dark="$store.state.settings.lightMode === 'true'"
        :color="accountOption.color"
        :text-color="
          $store.state.settings.lightMode !== 'true' ? 'black' : 'white'
        "
        style="width: 230px"
        outline
        :icon="`img:${accountOption.icon}`"
        icon-right="fiber_manual_record"
        :label="accountOption.label"
      >
        <q-menu :dark="$store.state.settings.lightMode === 'true'">
          <q-list class="coins_menu_wrapper_popup" bordered separator>
            <q-expansion-item
              :dark="$store.state.settings.lightMode === 'true'"
              style="width: 308px"
              dense-toggle
              class="chains"
              :class="{
                singleChain:
                  chainsData.filter((o) => checkChain(o)).length == 1,
              }"
              default-opened
              v-for="(tokChain, index) in chainsData.filter((o) =>
                checkChain(o)
              )"
              :key="Math.random() + index"
              clickable
            >
              <template v-slot:header>
                <q-item-section
                  :dark="$store.state.settings.lightMode === 'true'"
                  avatar
                >
                  <img class="coin-icon" width="25px" :src="tokChain.icon" />
                </q-item-section>
                <q-item-section
                  :dark="$store.state.settings.lightMode === 'true'"
                  class="item-name"
                >
                  <span class="item-name--name"> {{ tokChain.label }}</span>
                  <q-item-label caption>
                    <span class="item-name--staked" v-if="tokChain.count > 1"
                      >{{ tokChain.count }} accounts</span
                    >
                    <span
                      class="item-name--staked"
                      v-else-if="tokChain.count == 1"
                      >{{ getAccountLabel(tokChain) }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section
                  :dark="$store.state.settings.lightMode === 'true'"
                  class="item-info col"
                  side
                >
                  <div class="row items-center text-bold">
                    <span>
                      ${{
                        nFormatter2(
                          tokChain.chainTotal
                            ? tokChain.chainTotal.toFixed(0)
                            : 0,
                          0
                        )
                      }}</span
                    >
                  </div>
                </q-item-section>
              </template>
              <q-card
                class="accounts"
                :dark="$store.state.settings.lightMode === 'true'"
                dense
              >
                <q-card-section
                  :dark="$store.state.settings.lightMode === 'true'"
                >
                  <q-item
                    @click="
                      getAccount(item);
                      setAccount(300);
                    "
                    :key="Math.random() + index"
                    v-for="(item, index) in tokChain.accounts"
                    :class="{ selected: item.selected }"
                    clickable
                    :active="item.hidden"
                    active-class="bg-teal-1 text-grey-8"
                  >
                    <div
                      class="header-wallet-wrapper culumn full-width"
                      v-if="item"
                    >
                      <div
                        class="header-wallet full-width flex justify-between"
                      >
                        <q-item-section avatar>

                       <span class="identicon" v-html="toAvatar(item.name)" />
                        </q-item-section>
                        <q-item-section class="item-name">
                          <span class="item-name--name" v-if="item.isEvm">
                            {{ getAccountLabel(item) }}</span
                          >
                          <span class="item-name--name" v-else>
                            {{ item.name }}</span
                          >
                          <span
                            class="item-name--staked"
                            v-if="item.staked && item.staked !== 0 && false"
                            >Staked : {{ nFormatter2(item.staked, 3) }}</span
                          >
                          <span class="item-name--staked" v-if="item.tokenList && (item.isEvm || item.chain == 'eos')"
                            >{{ item.tokenList.length }} token{{
                              item.tokenList.length > 1 ? "s" : ""
                            }}</span
                          >
                        </q-item-section>
                        <q-item-section side>
                          <span class="item-info--amountUSD" v-if="item.total"
                            >${{
                              nFormatter2(
                                new Number(
                                  isNaN(item.total) ? 0 : item.total
                                ).toFixed(2),
                                0
                              )
                            }}</span
                          >
                          <span class="item-info--amountUSD" v-else
                            >${{
                              nFormatter2(
                                new Number(
                                  isNaN(item.usd) ? 0 : item.usd
                                ).toFixed(2),
                                0
                              )
                            }}</span
                          >
                        </q-item-section>
                      </div>
                    </div>
                  </q-item>

                  <q-item
                    v-if="!tokChain.accounts || !tokChain.accounts.length"
                    clickable
                    active-class="bg-teal-1 text-grey-8"
                  >
                    <div class="header-wallet-wrapper culumn full-width">
                      <div
                        class="header-wallet full-width flex justify-between"
                      >
                        <q-item-section class="item-name">
                          <span
                            class="item-name--name"
                            v-if="item && item.isEvm"
                          >
                            {{ getAccountLabel(item) }}</span
                          >
                          <span
                            >No {{ tokChain.chain.toUpperCase() }} account
                            found</span
                          >
                          <div
                            class="q-mt-md"
                            v-if="
                              tokChain.chain == 'eos' &&
                              $store.state.wallets.tokens.find(
                                (o) => o.chain == 'eos' && o.type == 'verto'
                              )
                            "
                          >
                            You need to setup your EOS account.<br />
                            <q-btn
                              class="q-mt-md"
                              outline
                              label="Setup EOS account"
                              @click="$router.push('/verto/eos-account/create')"
                            />
                          </div>
                        </q-item-section>
                      </div>
                    </div>
                  </q-item>
                </q-card-section>
                <q-separator />
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-menu>
      </q-btn>
      <div v-else-if="false">
        <span>No account found {{ chain }}</span>
      </div>
    </div>
    <div  class="row justify-center">
      <q-btn
        class="account_selector"
        dense
        v-if="accountOption && false"
        :color="accountOption.color"
        :text-color="$store.state.settings.lightMode !== 'true' ? 'black' : ''"
        :style="titleView ? 'width: 100%' : 'width:100%'"
        outline
        :icon="`img:${accountOption.icon}`"
        :label="formatLabel(accountOption.label)"
        @click="dialog = true"
      />
      <q-item
        v-if="!accountOption && allSelector"
        class="text-left full-width account_selector_top"
        :dark="$store.state.settings.lightMode === 'true'"
        :class="{
          'bg-grey-1 text-black': $store.state.settings.lightMode !== 'true',
          'bg-blue-verto text-white': $store.state.settings.lightMode === 'true',
          'text-white': $store.state.settings.lightMode === 'true',
          'accountOptionDark' : $store.state.settings.lightMode === 'true'
          }"
      >
        <q-item-section :dark="$store.state.settings.lightMode === 'true'" @click="dialog = true" avatar>
          <svg width="49" fill="transparent" height="49" class="view_all_svg">
            <circle cx="18" cy="18" r="18"></circle>
            <path d="M11.664 18.866l-1.107.64a.856.856 0 000 1.488l5.678 3.283c1.09.63 2.44.63 3.53 0l5.678-3.283a.856.856 0 000-1.488l-1.107-.64-3.82 2.21a5.031 5.031 0 01-5.032 0l-3.82-2.21z"></path>
            <path d="M16.235 11.723a3.53 3.53 0 013.53 0l5.678 3.283a.856.856 0 010 1.488l-5.678 3.283a3.53 3.53 0 01-3.53 0l-5.678-3.283a.856.856 0 010-1.488l5.678-3.283z"></path>
          </svg>
        </q-item-section>

        <q-item-section :dark="$store.state.settings.lightMode === 'true'">
          <q-item-label @click="dialog = true">Portfolio view</q-item-label>
          <q-item-label caption lines="1" @click="dialog = true"
            >Click here to view a specific account
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon
            name="keyboard_arrow_down"
            @click="dialog = true"
            class="shadows-2"
          />
        </q-item-section>
      </q-item>
      <q-item v-else :dark="$store.state.settings.lightMode === 'true'" class="text-left full-width account_selector_top" :class="{
        'bg-grey-1 text-black': $store.state.settings.lightMode !== 'true',
        'bg-blue-verto text-white': $store.state.settings.lightMode === 'true'
      }">
        <q-item-section @click="dialog = true" avatar>
          <q-img size="lg" :src="`${accountOption.icon}`" />
        </q-item-section>

        <q-item-section>
          <q-item-label @click="dialog = true">{{
            formatLabel(accountOption.label)
          }}</q-item-label>
          <q-item-label caption lines="1" @click="dialog = true"
            >{{ getKeyFormat(accountOption.key, 10) }} -
            <span class="item-info--amountUSD" v-if="accountOption.total"
              >${{
                nFormatter2(
                  new Number(
                    isNaN(accountOption.total) ? 0 : accountOption.total
                  ).toFixed(2),
                  0
                )
              }}</span
            >
            <span class="item-info--amountUSD" :class="$store.state.settings.lightMode === 'true' ? 'text-white':''" v-else
              >${{
                nFormatter2(
                  new Number(
                    isNaN(accountOption.usd) ? 0 : accountOption.usd
                  ).toFixed(2),
                  0
                )
              }}</span
            ></q-item-label
          >
        </q-item-section>

        <q-item-section dense side>
          <q-icon
            @click="
              copyToClipboard(
                accountOption[accountOption.chain == 'eos' ? 'name' : 'key']
              )
            "
            name="content_copy"
          />
        </q-item-section>

        <q-item-section side>
          <q-icon
            :name="!dialog ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
            @click="dialog = true"
            class="shadows-2"
          />
        </q-item-section>
      </q-item>

      <q-dialog v-model="dialog" :maximized="$q.platform.is.mobile">
        <q-card
          class=""
          :style="
            $store.state.settings.lightMode === 'true'
              ? 'background-color: #04111F !important;'
              : ''
          "
        >
          <q-toolbar>
            <q-btn
              flat
              dense
              :color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'"
              icon="arrow_back_ios"
              class="q-mr-sm"
              no-caps
              v-close-popup
              label="Back"
              @click="dialog = false"
            />

          </q-toolbar>

          <div
            :class="
              $store.state.settings.lightMode === 'true'
                ? 'text-h6 q-pa-md text-white'
                : 'text-h6 q-pa-md q-ml-md'
              "
          >
            Select An Account
          </div>

          <q-card-section class="items-center" >
            <q-item

              :key="Math.random() + '123'"
              v-if="accountOption && allSelector"
              class="
                z-top
                text-left
                full-width
                cursor-pointer
              "
              :class="{
                'bg-white text-black':$store.state.settings.lightMode !== 'true',
                'bg-blue-verto text-white':$store.state.settings.lightMode === 'true'
              }"
            >
              <q-item-section avatar >
                <svg width="49" fill="transparent" height="49" class="view_all_svg">
                  <circle cx="18" cy="18" r="18"></circle>
                  <path d="M11.664 18.866l-1.107.64a.856.856 0 000 1.488l5.678 3.283c1.09.63 2.44.63 3.53 0l5.678-3.283a.856.856 0 000-1.488l-1.107-.64-3.82 2.21a5.031 5.031 0 01-5.032 0l-3.82-2.21z"></path>
                  <path d="M16.235 11.723a3.53 3.53 0 013.53 0l5.678 3.283a.856.856 0 010 1.488l-5.678 3.283a3.53 3.53 0 01-3.53 0l-5.678-3.283a.856.856 0 010-1.488l5.678-3.283z"></path>
                </svg>
              </q-item-section>

              <q-item-section >
                <q-item-label
                @click=" dialog = false; unsetDefaultAccount()"
                  >View entire portfolio </q-item-label
                >
                <q-item-label  @click=" dialog = false; unsetDefaultAccount()" :class="$store.state.settings.lightMode === 'true' ? 'text-white':''" :dark="$store.state.settings.lightMode === 'true'" caption lines="1"
                  >View all chains and assets
                </q-item-label>
              </q-item-section>

              <q-item-section side @click=" dialog = false; " >
                <q-icon name="expand_more" class="shadows-2" />
              </q-item-section>
            </q-item>
            <q-list
              separator
              style="width: 100%"
              v-for="(tokChain, index) in chainsData.filter((o) =>
                checkChain(o)
              )"
              :key="Math.random() + index"
            >
              <q-expansion-item
                :default-opened="
                  chainsData.filter((o) => checkChain(o)).length == 1
                "
                :dark="$store.state.settings.lightMode === 'true'"
              >
                <template v-slot:header>
                  <q-item-section
                    :dark="$store.state.settings.lightMode === 'true'"
                    avatar
                  >
                    <img class="coin-icon" width="35px" :src="tokChain.icon" />
                  </q-item-section>
                  <q-item-section
                    :dark="$store.state.settings.lightMode === 'true'"
                    class="item-name"
                  >
                    <span class="item-name--name"> {{ tokChain.label }}</span>
                    <q-item-label caption>
                      <span class="item-name--staked" v-if="tokChain.count > 1"
                        >{{ tokChain.count }} accounts</span
                      >
                      <span
                        class="item-name--staked"
                        v-else-if="tokChain.count == 1"
                        >{{ getAccountLabel(tokChain) }}</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section
                    :dark="$store.state.settings.lightMode === 'true'"
                    class="item-info col"
                    side
                  >
                    <div class="row items-center text-bold">
                      <span>
                        ${{
                          nFormatter2(
                            tokChain.chainTotal
                              ? tokChain.chainTotal.toFixed(0)
                              : 0,
                            0
                          )
                        }}</span
                      >
                    </div>
                  </q-item-section>
                </template>
                <q-card
                  :dark="$store.state.settings.lightMode === 'true'"
                  dense
                  flat
                >
                  <q-card-section
                    :dark="$store.state.settings.lightMode === 'true'"
                  >
                    <q-item
                      @click="
                        getAccount(item);
                        setAccount(300);
                        dialog = false;
                      "

                      :key="Math.random() + index"
                      v-for="(item, index) in tokChain.accounts"
                      :class="{ selected: item.selected , 'bg-indigo-1': accountOption && accountOption.index == item.index}"
                      clickable
                      :active="item.hidden"
                      active-class="bg-teal-1 text-grey-8"
                    >
                      <div class="header-wallet-wrapper culumn full-width">
                        <div
                          class="header-wallet full-width flex justify-between"
                        >
                          <q-item-section avatar>

                            <span class="identicon" v-html="toAvatar(item.name)" />
                          </q-item-section>
                          <q-item-section class="item-name">
                            <span
                              class="item-name--name text-bold"
                              v-if="item.isEvm"
                            >
                              {{ getAccountLabel(item) }}</span
                            >
                            <span class="item-name--name text-bold" v-else>
                              {{ item.name }}</span
                            >
                            <span
                              class="item-name--staked"
                              v-if="item.staked && item.staked !== 0 && false"
                              >Staked : {{ nFormatter2(item.staked, 3) }}</span
                            >
                            <span
                              class="item-name--staked"
                             v-if="item.tokenList && (item.isEvm || item.chain == 'eos')"
                              >{{ item.tokenList.length }} token{{
                                item.tokenList.length > 1 ? "s" : ""
                              }}</span
                            >
                          </q-item-section>
                          <q-item-section side>
                            <span class="item-info--amountUSD" v-if="item.total"
                              >${{
                                nFormatter2(
                                  new Number(
                                    isNaN(item.total) ? 0 : item.total
                                  ).toFixed(2),
                                  0
                                )
                              }}</span
                            >
                            <span class="item-info--amountUSD" v-else
                              >${{
                                nFormatter2(
                                  new Number(
                                    isNaN(item.usd) ? 0 : item.usd
                                  ).toFixed(2),
                                  0
                                )
                              }}</span
                            >
                          </q-item-section>
                        </div>
                      </div>
                    </q-item>

                    <q-item
                      v-if="!tokChain.accounts || !tokChain.accounts.length"
                      clickable
                      active-class="bg-teal-1 text-grey-8"
                    >
                      <div class="header-wallet-wrapper culumn full-width">
                        <div
                          class="header-wallet full-width flex justify-between"
                        >
                          <q-item-section class="item-name">
                            <span
                              class="item-name--name"
                              v-if="item && item.isEvm"
                            >
                              {{ getAccountLabel(item) }}</span
                            >
                            <span
                              >No {{ tokChain.chain.toUpperCase() }} account
                              found</span
                            >
                            <div
                              class="q-mt-md"
                              v-if="
                                tokChain.chain == 'eos' &&
                                $store.state.wallets.tokens.find(
                                  (o) => o.chain == 'eos' && o.type == 'verto'
                                )
                              "
                            >
                              You need to setup your EOS account.<br />
                              <q-btn
                                class="q-mt-md"
                                outline
                                label="Setup EOS account"
                                @click="
                                  $router.push('/verto/eos-account/create')
                                "
                              />
                            </div>
                          </q-item-section>
                        </div>
                      </div>
                    </q-item>
                  </q-card-section>
                  <q-separator />
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'
import DexInteraction from '@/mixins/DexInteraction'

export default {
  props: [
    'allSelector',
    'showPortfolio',
    'chain',
    'showAllWallets',
    'autoSelectChain',
    'chains',
    'withTokenBalance',
    'titleView'
  ],
  data () {
    return {
      accountOptions: [],
      accountOption: null,
      chainsData: [],
      dialog: false
    }
  },
  created () {
    this.init()
    this.chainsData = this.setChains()
    this.chainsData = this.chainsData.filter((o) => this.checkChain(o))
  },
  methods: {
    getAccount (item) {
      let w = this.formatAccoountOption(
        this.$store.state.wallets.tokens.find((a) => a.index === item.index)
      )

      if (w) {
        this.accountOption = w
      }
    },
    checkChain (o) {
      return (
        this.showAllWallets ||
        (!this.chains && (o.chain === this.chain || !this.chain)) ||
        (this.chains && this.chains.includes(o.chain)) ||
        (!this.chain && !this.chains)
      )
    },
    init (updateDefaultAccount = true) {
      let tableData = this.$store.state.wallets.tokens

      tableData.filter(
        (w) =>
          w.chain === 'eos' &&
          w.type === 'eos' &&
          this.checkChain(w) &&
          this.accountOptions.push({
            value: w.name,
            amount: w.amount,
            name: w.name,
            key: w.key,
            index: w.index,
            usd: w.usd,
            chain: 'eos',
            total: w.total,
            image: w.icon,
            icon: w.icon,
            type: w.type,
            label: w.name,
            color: this.getRandomColor()
          })
      )

      tableData.filter(
        (w) =>
          w.chain === 'eth' &&
          this.checkChain(w) &&
          w.type === 'eth' &&
          this.accountOptions.push({
            value: w.key,
            name: w.name,
            key: w.key,
            amount: w.amount,
            chain: 'eth',
            index: w.index,
            isEvm: w.isEvm || this.isEvm(w.type),
            type: w.type,
            usd: w.usd,
            total: w.total,
            icon: w.icon,
            image: w.icon,
            label: this.getAccountLabel(w),
            color: this.getRandomColor()
          })
      )

      tableData.filter(
        (w, i, a) =>
          w.chain !== 'eth' &&
          w.chain !== 'eos' &&
          this.checkChain(w) &&
          a.findIndex((t) => t.key === w.key && t.chain === w.chain) === i &&
          this.accountOptions.push(this.formatAccoountOption(w))
      )

      this.accountOptions = this.accountOptions.filter((o) => o && o.name)
      if (this.$store.state.wallets.metamask.accounts.length) {
        this.accountOptions.push(
          this.$store.state.wallets.metamask.accounts.find(
            (o) => o.type === 'eth' && o.chain === 'eth'
          )
        )
      }

      this.accountOptions.sort(
        (a, b) =>
          (isNaN(parseFloat(b.total)) ? 0 : parseFloat(b.total)) -
          (isNaN(parseFloat(a.total)) ? 0 : parseFloat(a.total))
      )

      if (!updateDefaultAccount) return

      /*  if (
        this.$store.state.currentwallet.wallet &&
        this.$store.state.currentwallet.wallet.type && !this.withTokenBalance
      ) {
        this.accountOption = this.accountOptions.find(
          (a) =>
            a.key === this.$store.state.currentwallet.wallet.key &&
            a.chain === this.$store.state.currentwallet.wallet.chain &&
            a.name.toLowerCase() ===
              this.$store.state.currentwallet.wallet.name.toLowerCase()
        )
      } else */ if (
        !this.withTokenBalance &&
        this.$store.state.investment.defaultAccount &&
        this.$store.state.investment.defaultAccount !== undefined &&
        this.$store.state.investment.defaultAccount.name &&
        (!this.chain ||
          (this.$store.state.investment.defaultAccount.chain === this.chain &&
            this.$store.state.investment.defaultAccount.origin !== 'metamask'))
      ) {
        this.accountOption = this.accountOptions.find(
          (f) =>
            f.type === this.$store.state.investment.defaultAccount.type &&
            f.chain === this.$store.state.investment.defaultAccount.chain &&
            f.name.toLowerCase() ===
              this.$store.state.investment.defaultAccount.name.toLowerCase()
        )
      } else {
        let item = this.accountOptions.find(
          (o) =>
            ((this.autoSelectChain && o.chain === this.autoSelectChain) ||
              (this.chain && o.chain === this.chain) ||
              o.chain === 'eos') &&
            (!this.withTokenBalance ||
              this.withTokenBalance === o.type ||
              !this.$store.state.wallets.portfolioTotal)
        )

        if (!item) {
          item = this.accountOptions.find(
            (o) =>
              ((this.chain && o.chain === this.chain) || o.chain === 'eth') &&
              (this.withTokenBalance === o.type ||
                !this.$store.state.wallets.portfolioTotal)
          )
        }

        this.accountOption = !this.showPortfolio ? item : !this.showPortfolio
      }

      this.accountOptions = this.accountOptions.filter(
        (o) => !this.chain || o.chain === this.chain
      )
      if (
        !this.accountOptions &&
        this.autoSelectChain &&
        this.accountOptions.length
      ) {
        this.accountOption = !this.showPortfolio
          ? this.accountOptions.find((o) => o.chain === this.autoSelectChain)
          : !this.showPortfolio
      }
      if (!this.accountOption && this.accountOptions.length) {
        this.accountOption = !this.showPortfolio
          ? this.accountOptions[0]
          : !this.showPortfolio
      }
      // console.log(this.accountOptions, this.accountOption, this)
      if (!this.showPortfolio) {
        this.setAccount()
      }
    },
    setAccount (time = 0) {
      setTimeout(() => {
        if (this.accountOption) {
          this.$store.commit(
            'investment/setDefaultAccount',
            this.accountOption
          )
          if (this.accountOption && this.accountOption.origin === 'metamask') {
            this.$store.commit(
              'investment/setAccountTokens',
              this.$store.state.wallets.metamask.tokens
            )
          } else {
            let tokens = this.$store.state.wallets.tokens.filter(
              (w) =>
                w.chain === this.accountOption.chain &&
                w.key === this.accountOption.key &&
                (this.accountOption.chain !== 'eos' ||
                  w.name.toLowerCase() ===
                    this.accountOption.name.toLowerCase())
            )

            this.$store.commit('investment/setAccountTokens', tokens)

            this.$store.commit('currentwallet/updateParams', {
              chainID: this.accountOption.chain,
              tokenID: this.accountOption.type,
              accountName: this.accountOption.name
            })
            this.$store.state.currentwallet.wallet =
              this.$store.state.wallets.tokens.find(
                (w) =>
                  w.chain === this.accountOption.chain &&
                  w.type === this.accountOption.type &&
                  w.name.toLowerCase() === this.accountOption.name.toLowerCase()
              )
          }
          if (['matic', 'bsc'].includes(this.accountOption.chain)) {
            this.$store.commit('settings/setDex', {
              dex: 'oneinch'
            })
          }
        }
      }, time)
    },
    unsetDefaultAccount () {
      this.$store.commit(
        'investment/setDefaultAccount',
        false
      )
      this.accountOption = null
    },
    formatLabel (label) {
      try {
        return label.substr(0, 10)
      } catch (e) {
        return label
      }
    }
  },
  watch: {
    '$store.state.wallets.tokens': {
      deep: true,
      handler (newVal, old) {
        if (newVal.length !== old.length) {
          this.accountOptions = []
          this.init(false)
          this.chainsData = this.setChains()
          this.chainsData = this.chainsData.filter((o) => this.checkChain(o))
        }
      }
    },
    /*  '$store.state.currentwallet.wallet': function () {
      let item = this.accountOptions.find(
        (a) =>
          a.key === this.$store.state.currentwallet.wallet.key &&
          a.chain === this.$store.state.currentwallet.wallet.chain &&
          (this.$store.state.currentwallet.wallet.chain !== 'eos' ||
            (this.$store.state.currentwallet.wallet.chain === 'eos' &&
              this.$store.state.currentwallet.wallet.type !== 'verto' &&
              this.$store.state.currentwallet.wallet.name === a.name))
      )

      if (item) {
        this.accountOption = item
        this.setAccount()
      }
    }, */
    '$store.state.investment.defaultAccount': function (val) {
      if (!val || !['defi', 'set'].includes(val.origin)) return

      let w = this.$store.state.investment.defaultAccount

      this.accountOption = {
        value: w.key,
        isEvm: w.isEvm,
        key: w.key,
        chain: w.chain,
        index: w.index,
        usd: w.usd,
        name: w.name,
        type: w.type,
        total: w.total,
        icon: w.icon,
        image: w.icon,
        label: this.getAccountLabel(w),
        color: this.getRandomColor()
      }
      this.$store.commit(
        'investment/setAccountTokens',
        this.$store.state.wallets.tokens.filter(
          (w) =>
            w.chain === this.accountOption.chain &&
            (this.accountOption.chain !== 'eos' ||
              w.name === this.accountOption.name)
        )
      )
    },
    '$store.state.wallets.metamask': {
      deep: true,
      handler (val) {
        if (this.chain) return
        let w = val.tokens.find((a) => a.type === 'eth' && a.chain === 'eth')

        if (w) {
          this.accountOption = {
            value: w.key,
            key: w.key,
            chain: 'eth',
            isEvm: w.isEvm,
            usd: w.usd,
            type: w.type,
            total: w.total,
            image: w.icon,
            name: w.name,
            icon: w.icon,
            origin: 'metamask',
            label: this.getAccountLabel(w),
            color: this.getRandomColor()
          }
          let item = this.accountOptions.find(
            (a) => a && a.key === this.accountOption.key
          )
          if (!item) {
            this.accountOptions.push(this.accountOption)
          }
          this.setAccount()
        }
      }
    }
  },
  mixins: [Formatter, DexInteraction]
}
</script>
<style lang="scss" scoped>
.item-info {
  max-width: 40px !important;
}
.chains:hover .accounts,
.singleChain .accounts {
  display: block;
  background: #e7e8e8;
}
/deep/ element.style {
}
.q-expansion-item__container {
  padding-top: 20px;
  padding-bottom: 20px;
}
.chains:hover {
  background: #e7e8e8;
}
.accounts {
  display: none;
}
.accounts .q-card__section--vert {
  padding: 0px;
}
.select-input {
  border-radius: 100px !important;
  $height: 60px;
  height: $height;
  /deep/ .q-field__marginal {
    height: $height;
    min-height: unset;
  }
  /deep/ .q-field__control {
    height: $height;
    min-height: unset;
    .q-field__label.no-pointer-events {
      left: 15px;
      @media screen and (max-width: 1024px) {
        left: 31px;
      }
    }
    .q-field__native {
      padding-left: 0px;
      padding-top: 0px;
      padding-bottom: 0px;
      height: $height;
      min-height: unset;
      .q-item {
        padding: 0px;
        padding-left: 0px;
        min-height: $height;
        padding-bottom: 0px;
        .q-item__label--caption {
          margin-top: -35px;
        }
        .q-item__section {
          padding-right: 0px;
          min-width: 36px;
          .q-item__label + .q-item__label {
            margin-top: 0px;
          }
        }
      }
    }
  }
}
.dark-input {
  &.select-input {
    /deep/ .q-field__control {
      .q-field__native {
        .q-item {
          .q-item__section {
            .q-item__label + .q-item__label {
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
.chains:hover .accounts.q-dark,
.singleChain .accounts.q-dark {
  background: #04111f;
}
.account_selector_container{
    // border-bottom: 1px solid #CCC;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #eef8ff;
    padding-bottom: 0px;
    box-shadow: 0px 6px 6px 0px rgba(black, .1);
    .account_name{
      text-transform: capitalize;
      font-size: 18px;
    }
    .account_name_caption{
      font-size: 14px;
    }
  }
</style>
<style>
.q-menu--dark.q-dark
  .coins_menu_wrapper_popup
  .q-focusable:focus
  > .q-focus-helper,
.q-menu--dark.q-dark
  .coins_menu_wrapper_popup
  .q-manual-focusable--focused
  > .q-focus-helper,
.q-menu--dark.q-dark
  .coins_menu_wrapper_popup
  .q-hoverable:hover
  > .q-focus-helper {
  background: #061b31;
  opacity: 0.2;
}
.q-menu--dark.q-dark .coins_menu_wrapper_popup .q-item.q-item-type.row {
  background: #04111f;
}
body.desktop .q-focusable:focus > .q-focus-helper:after,
body.desktop .q-manual-focusable--focused > .q-focus-helper:after,
body.desktop .q-hoverable:hover > .q-focus-helper:after {
  background: #061a30;
  opacity: 0.3;
}
.accountOptionDark{
  background: #04111f;
}
.bg-blue-verto{
  background: #0e1829;
}
.view_all_svg{
  padding: 5px;
}
.view_all_svg circle{
  stroke: #64b5f5;
  stroke-width: 1px;
  stroke-dashoffset: 3;
  transform: translate(1px, 1px);
}
.view_all_svg path{
  transform: translate(1px, 1px);
  fill: #64b5f5;
}

.identicon{
    overflow: hidden;
    background: #FFF;
    width: 30px;
    border-radius: 10px;
    height: 30px;
    outline: 1px solid #64b5f6;
  }

</style>
