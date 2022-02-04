<template>
<div :key="rekey">
    <div class="full-height max-height" :class="{'dark-theme': $store.state.settings.lightMode === 'true' , 'wallets-wrapper': !isMobile}">
        <!-- <q-toggle v-model="active" label="Active" /> -->

        <div v-if="!isMobile" class="else-is-desktop wallets-wrapper--list open full-height">

            <div class="wallets-wrapper--list_title q-pa-sm q-pt-sm q-mr-sm flex items-center justify-between" :class="$store.state.currentwallet.wallet.empty ? 'q-ml-xs':'q-pl-lg q-ml-sm'">
                <div class="flex items-center justify-between" :class="$store.state.currentwallet.wallet.empty ? '':'full-width'">
                    <span class="flex items-center justify-between q-ml-xs q-pr-md">
                        <q-icon name="o_account_balance_wallet" />
                        {{$store.state.currentwallet.wallet.empty ? 'Wallets' : $store.state.currentwallet.wallet.name.toUpperCase().replace('- HD', '')}}
                    </span>
                    <span>
                        <q-btn  :disable="loadingIndicator"  v-if="!$store.state.currentwallet.wallet.empty" dense flat icon-right="cached" color="grey" @click="refreshWallet($store.state.currentwallet.wallet.name.toLowerCase())">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            <strong>Refresh</strong>
                        </q-tooltip>
                    </q-btn>
                    <q-icon v-if="!$store.state.currentwallet.wallet.empty" style="font-size: 25px" :name="`img:${$store.state.currentwallet.wallet.type !== 'usdt' ? $store.state.currentwallet.wallet.icon : 'https://assets.coingecko.com/coins/images/325/small/tether.png'}`" />
                    </span>
                        </div>
                <span v-if="$store.state.currentwallet.wallet.empty" class="flex items-center">
                    <q-btn :disable="loadingIndicator"  dense flat icon-right="cached" @click="refreshWallet()">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            <strong>Refresh</strong>
                        </q-tooltip>
                    </q-btn>
                    <!-- <q-btn unelevated flat @click="revealHide()" :icon-right="showHidden ? 'visibility_off': 'visibility'" class="full-width wallets-wrapper--list__hide-wallets wallets-wrapper--list__hide-wallets--reveal" color="white" text-color="black" :label="showHidden ? 'Hide Currencies' : 'Show Currencies'" :class="showText ? 'open': 'hide'" /> -->
                    <q-btn dense flat @click="revealHide()" :icon-right="showHidden ? 'visibility_off': 'visibility'" :class="showText ? 'open': 'hide'">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            <strong>{{showHidden ? 'Hide Currencies' : 'Show Currencies'}}</strong>
                        </q-tooltip>
                    </q-btn>
                    <!-- <q-btn v-if="$store.state.currentwallet.wallet.empty" flat icon-right="search" @click="searchWallet()">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            <strong>Search a coin</strong>
                        </q-tooltip>
                    </q-btn> -->
                </span>
            </div>
            <!-- <q-input v-if="$store.state.currentwallet.wallet.empty" v-model="searchAccount" class="input-input search_account" rounded outlined color="purple" label="Ex: account" type="text" /> -->
            <div v-if="$store.state.currentwallet.wallet.empty" class="header-list-table">
                <div class="row q-pl-sm q-pr-sm">
                    <div class="col col-6 q-pl-sm pointer"  :class="{'active' : directionAccount}">
                        <span class="sort">Account name</span>
                    </div>
                    <div class="col col-6 flex justify-end q-pr-sm items-center pointer" @click="sortBy('balance')" :class="{'active' : direction}">
                        <!-- active -->
                        <span class="sort">Balance</span>
                        <q-icon :name="!direction ? 'north' : 'south'" class="text-grey" />
                    </div>
                </div>
            </div>
              <p class="text-body2 text-center" v-if="$route.params.walletToRefresh && loadingIndicator">Updating {{$route.params.walletToRefresh}} wallet...</p>
              <p class="text-body2 text-center test text-grey" v-else-if="$store.state.wallets.tokens.length && loadingIndicator && !singleWalletRefresh">Updating {{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].chain.toUpperCase()}} wallet ({{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].name}}) {{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].total ? '($'+formatNumber($store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].total,0)+')' : ''}} <br>Fetching {{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].type.toUpperCase()}} balance:  (${{formatNumber($store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].usd,2)}})...</p>
              <p class="text-body2 text-center" v-else-if="singleWalletRefresh && loadingIndicator">Updating {{singleWalletRefresh}} wallet...</p>

            <q-scroll-area :visible="true" ref="walletsScrollArea" class="walletsScrollArea q-mr-sm q-ml-xs" :class="{'short' : $store.state.currentwallet.wallet.empty, 'long' : !$store.state.currentwallet.wallet.empty}" :style="$store.state.currentwallet.wallet.empty ? 'height: 80%;': 'height: 90%;'">
                <q-list bordered separator class="list-wrapper">

                    <div v-if="$store.state.currentwallet.wallet.empty" class="all-wallets">
                        <q-item  v-if="$store.state.wallets.tokens.filter(f => f.type == 'verto' && f.chain == 'eos' && !f.hidden && !f.disabled).length" v-show="!hideEosSetup && !loadingIndicator"  class="highlight on-top" dense>
                            <q-item-section @click="hideEOSSetup()" class="text-center  cursor-pointer q-py-sm">
                            <q-item-label class="text-center">Setup later<q-icon flat label="Yes" name="close" size="sm" /> </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-show="!hideEosSetup" class="on-top" v-for="(item) in $store.state.wallets.tokens.filter(f => f.type == 'verto' && f.chain == 'eos' && !f.hidden && !f.disabled)" :class="[item.selected ? 'selected' : '', 'highlight']" :key="Math.random()+item.name+'_'+item.type" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="showMenu(item, '/verto/eos-account/create')" :class="{'disable-coin' : item.disabled}" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                            <img class="coin-icon" width="35px" :src="item.icon" alt="">
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span :class="[$store.state.settings.lightMode === 'true' ? 'text-black' : '', 'item-name--name']">{{item.name.replace('- HD', '')}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled">
                                            <span class="item-info--amount"> <q-btn label="Setup" text-color="white" no-caps class="highlight-btn" /></span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                        </q-item>
                     <q-expansion-item    :style="setPosition(99999999)" @click="vtxAccounts.length == 1 ? showMenu(vtxAccounts[0]) : showChainAccounts('', 'vtx')"  :key="Math.random()" clickable  >
                        <template v-slot:header>
                            <q-item-section avatar>
                                <img class="coin-icon" width="35px" src="statics/icons/favicon-32x32.png"  />
                            </q-item-section>
                            <q-item-section  class="item-name">
                            <span class="item-name--name"> VTX</span>
                            <span  class="item-name--staked" v-if="vtxAccounts.length > 1">{{vtxAccounts.length}} accounts</span>

                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{formatNumber(vtxAccounts.total ? vtxAccounts.total.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card :dark="$store.state.settings.lightMode === 'true'">
                            <q-card-section>
                                <q-item  :key="Math.random()+index"  v-for="(item, index) in vtxAccounts"  :class="{'selected' : item.selected}" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="!item.disabled ? showMenu(item) : ''" :class="{'disable-coin' : item.disabled}" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                            <img class="coin-icon" width="35px" src="statics/icons/favicon-32x32.png" alt="">
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name">{{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>

                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled">
                                            <span class="item-info--amount">{{formatNumber(item.amount ? (new Number(item.amount).toString().split('.')[1] && new Number(item.amount).toString().split('.')[1].length > 8 ? new Number(item.amount).toFixed(4) : new Number(item.amount).toFixed(4).toString()) : 0, 2) }} {{item.type.toUpperCase()}}</span>

                                            <span class="item-info--amountUSD" >${{formatNumber(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                        </q-expansion-item>
                     <q-expansion-item  :ref="'chain'+index" :style="setPosition(chain.chainTotal)" @click="chain.accounts.length == 1 ? showMenu(chain.accounts[0], false, index+1 ) : showChainAccounts(index, chain.chain)" v-for="(chain, index) in chains" :class="{ 'single-chain': !($q.platform.is.mobile||$isbex) && chain.count }" :key="Math.random()+index" clickable  >
                    <template v-slot:header>

                            <q-item-section avatar>
                                <img class="coin-icon" width="35px" :src="chain.icon"  />
                            </q-item-section>
                            <q-item-section  class="item-name" >

                            <span class="item-name--name"> {{chain.label}}</span>
                            <span  class="item-name--staked" v-if="loadingIndex == index + 1 "> <q-spinner-dots color="primary" size="2em" /> </span>
                            <span  class="item-name--staked" v-else-if="chain.accounts.length > 1">{{chain.accounts.length}} accounts</span>
                            <span   class="item-name--staked" v-else-if="chain.accounts.length == 1 && chain.accounts[0].tokenList && chain.accounts[0].tokenList.length > 1">{{chain.accounts[0].tokenList.length}} tokens</span>
                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{formatNumber(chain.chainTotal ? chain.chainTotal.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card :dark="$store.state.settings.lightMode === 'true'">
                            <q-card-section>
                                <q-item  :key="Math.random()+index"  v-for="(item, index) in chain.accounts"   clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="!item.disabled ? showMenu(item) : ''" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                           <q-icon name="fiber_manual_record" :color="item.color"/>
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name" v-if="item.isEvm"> {{item.key.substr(item.key.length - 6)}}</span>
                                            <span class="item-name--name" v-else> {{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>

                                            <span  class="item-name--staked" v-if="item.tokenList">{{item.tokenList.length}} token{{ item.tokenList.length > 1 ? 's' : '' }}</span>

                                            <span  class="item-name--staked" ></span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled">
                                            <span class="item-info--amount">{{formatNumber(item.amount ? (new Number(item.amount).toString().split('.')[1] && new Number(item.amount).toString().split('.')[1].length > 8 ? new Number(item.amount).toFixed(4) : new Number(item.amount).toFixed(4).toString()) : 0, 2) }} {{item.type.toUpperCase()}}</span>
                                            <span class="item-info--amountUSD" v-if="item.total">${{formatNumber(new Number(isNaN(item.total) ? 0 : item.total).toFixed(2),0)}}</span>
                                            <span class="item-info--amountUSD" v-else>${{formatNumber(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                        </q-expansion-item>

                    </div>
                    <div v-else>
                        <q-item class="selected selected22222" clickable active-class="bg-teal-1 text-grey-8">
                            <div class="header-wallet-wrapper culumn full-width">
                                <div class="menu-wallet">
                                    <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="sub-list-menu">
                                        <!-- <q-separator style="margin-top: -20px" /> -->

                                        <q-item data-name='Create EOS account' v-if="$store.state.currentwallet.wallet.type === 'verto'" to="/verto/eos-account/create" clickable v-ripple class="p-relative bold-btn">Create EOS account
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item data-name='Import EOS account' v-if="$store.state.currentwallet.wallet.type === 'verto'" to="/verto/eos-account/import" clickable v-ripple class="p-relative bold-btn">Import EOS account
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                        <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos'" data-name='EOS to VTX Converter' clickable v-ripple class="p-relative" to="/verto/converter">EOS to VTX Converter
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item> -->
                                        <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos' || $store.state.currentwallet.wallet.type === 'vtx'" data-name='Staking / Unstaking CPU' clickable v-ripple class="p-relative" to="/verto/stake">{{$store.state.currentwallet.wallet.type === 'eos' ? 'Staking / Unstaking CPU' : 'Staking'}}
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item> -->
                                        <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos'" data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" to="/verto/stakeproxy">Stake Proxy EOS
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item> -->
                                        <div class="row text-center q-pb-md" v-if="$store.state.currentwallet.wallet.type === 'eos'" >
                                         <div class="row col-4  flex flex-center ">
                                          <q-circular-progress
                                            show-value
                                            font-size="12px"
                                            :value="circularProgress.cpu"
                                            size="70px"
                                            :thickness="0.22"
                                            color="deep-purple-2"
                                            track-color="grey-3"
                                            class="q-ma-md"
                                            >
                                            {{ circularProgress.cpu }}%
                                            </q-circular-progress>
                                            <span class="accountInfos">{{circularProgress.cpuInfos}} µs</span>
                                           <div class="col-12">CPU</div>
                                        </div>
                                         <div class="row col-4  flex flex-center ">
                                          <q-circular-progress
                                            show-value
                                            font-size="12px"
                                            :value="circularProgress.net"
                                            size="70px"
                                            :thickness="0.22"
                                            color="deep-purple-2"
                                            track-color="grey-3"
                                            class="q-ma-md"
                                            >
                                            {{ circularProgress.net }}%
                                            </q-circular-progress>
                                            <span class="accountInfos">{{circularProgress.netInfos}} KB</span>
                                           <div class="col-12">NET</div>
                                        </div>

                                        <div class="row col-4  flex flex-center ">
                                          <q-circular-progress
                                            show-value
                                            font-size="12px"
                                            :value="circularProgress.ram"
                                            size="70px"
                                            :thickness="0.22"
                                            color="deep-purple-2"
                                            track-color="grey-3"
                                            class="q-ma-md"
                                            >
                                            {{ circularProgress.ram }}%
                                            </q-circular-progress>
                                            <span class="accountInfos">{{circularProgress.ramInfos}} KB</span>
                                           <div class="col-12">RAM</div>
                                        </div>

                                            </div>
                                         <q-expansion-item
                                            v-if="$store.state.currentwallet.wallet.type === 'vtx'" data-name='VTX tools'
                                            expand-separator
                                            icon="select_all"
                                            label="VTX tools"
                                            @click="focusOnChainTools"
                                            caption="Staking, node & more"
                                            class="q-pt-sm chain-tools"
                                            default-opened
                                        >
                                        <q-item  data-name='Staking' clickable v-ripple class="p-relative" to="/verto/stake">Stake VTX
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                         <a href="https://volentix.io/node/" target="_blank">
                                        <q-item  data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" >
                                           Run a node
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        </a>
                                        </q-expansion-item>
                                        <q-expansion-item
                                            v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Chain tools'
                                            expand-separator
                                            class="chain-tools"
                                            icon="select_all"
                                            label="Chain tools"
                                            @click="focusOnChainTools"
                                            caption="Staking, CPU & more"
                                            :default-opened="$store.state.currentwallet.wallet.type === 'eos'"
                                        >
                                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Stake / Unstake CPU' clickable v-ripple class="p-relative" to="/verto/stake">Stake / Unstake CPU
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                         <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Buy/Sell Ram' clickable v-ripple class="p-relative" to="/verto/ram-market">Buy / Sell Ram
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                         <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Power up' clickable v-ripple class="p-relative" to="/verto/wallet/eos/powerup">Power up
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>

                                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" to="/verto/stakeproxy">Stake Proxy EOS
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item data-name='Create new account' v-if="$store.state.currentwallet.wallet.type !== 'verto' && $store.state.currentwallet.wallet.chain === 'eos'" to="/verto/eos-account/create" clickable v-ripple class="p-relative ">Create account
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item data-name='Import  account' v-if="$store.state.currentwallet.wallet.type !== 'verto' && $store.state.currentwallet.wallet.chain === 'eos'" to="/verto/eos-account/import" clickable v-ripple class="p-relative">Import another account
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Custom Transaction' clickable v-ripple class="p-relative" to="/verto/custom-transactions">Custom Transaction
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        </q-expansion-item>

                                        <q-item data-name='Security' clickable @click="alertSecurity = true" v-ripple class="p-relative">Security
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item data-name='History' clickable to="/verto/history" v-ripple class="p-relative">History
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                                            <q-item-section>
                                                <q-item-label>{{$store.state.currentwallet.wallet.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                                            </q-item-section>
                                            <q-item-section avatar>
                                                <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="$store.state.currentwallet.wallet.hidden" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </div>
                        </q-item>
                        <h2 v-if="$store.state.currentwallet.wallet.staked" @click="goToStake" class="wallets-wrapper--list_title goToStake bg-indigo-1 q-pa-xs q-pl-lg q-pr-lg flex items-center justify-between q-mt-md q-mb-md">
                            <span class="q-pl-sm">Total Staked Amount:</span>
                            <span>{{nFormatter2($store.state.currentwallet.wallet.staked, 3)}}
                                <q-icon style="font-size: 20px" :name="'img:'+ $store.state.currentwallet.wallet.icon" class="q-mr-xs q-mb-xs" /> <span class="small">{{$store.state.currentwallet.wallet.type.toUpperCase()}}</span>
                            </span>
                        </h2>
                    </div>
                    <div v-if="$store.state.currentwallet.wallet.empty">
                        <q-item v-for="(item) in $store.state.wallets.tokens.filter(f =>  !f.hidden && f.disabled)" :class="{'selected' : item.selected}" :key="Math.random()+item.name+'_'+item.type" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                            <div class="header-wallet-wrapper culumn full-width">
                                <div @click="showMenu(item)" :class="{'disable-coin' : item.disabled}" class="header-wallet full-width flex justify-between">
                                    <q-item-section avatar>
                                        <img class="coin-icon" width="35px" :src="item.icon" alt="">
                                    </q-item-section>
                                    <q-item-section class="item-name">
                                        <span class="item-name--name">{{item.name.replace('- HD', '')}}</span>
                                    </q-item-section>
                                    <q-item-section class="item-info" v-if="!item.disabled">
                                        <span class="item-info--amount">{{item.amount ? new Number(item.amount).toFixed(8) : 0 }} {{item.type.toUpperCase()}}</span>
                                    </q-item-section>
                                    <q-item-section class="item-info" v-else>
                                        <span class="item-info--amount">in progress</span>
                                    </q-item-section>
                                </div>
                                <div class="menu-wallet">
                                    <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="sub-list-menu">
                                        <!-- <q-item class="p-relative full-width no-pad">
                                            <div class="vespucci-score--wrapper full-width flex justify-between items-center">
                                                <span class="label">{{ item.vespucciScore > 50 ? 'Strong Buy':'Strong Sell' }}</span>
                                                <span class="value">{{ item.vespucciScore }}</span>
                                                <span class="powered">Powered by Vespucci</span>
                                            </div>
                                        </q-item> -->
                                        <q-separator style="margin-top: 10px" />
                                        <q-item data-name='Security' clickable @click="alertSecurity = true" v-ripple class="p-relative">Security
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                                            <q-item-section>
                                                <q-item-label>{{item.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                                            </q-item-section>
                                            <q-item-section avatar>
                                                <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="item.hidden" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </div>
                        </q-item>
                        <q-separator v-if="showHidden" inset="item" id="hidden__holder--sep" />
                           <q-item v-for="(item) in $store.state.wallets.tokens.filter(f => f.hidden && this.showHidden)" :class="{'selected' : item.selected}" :key="Math.random()+item.name+'_'+item.type" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                              <div class="header-wallet-wrapper culumn full-width hidden__holder" style="opacity: .4">

                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="showMenu(item)" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                            <img class="coin-icon" width="35px" :src="item.icon" alt="">
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name">{{item.name.replace('- HD', '')}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info">
                                            <span class="item-info--amount">{{new Number(item.amount).toFixed(8)}} {{item.type.toUpperCase()}}</span>
                                        </q-item-section>
                                    </div>
                                    <div class="menu-wallet">
                                        <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="sub-list-menu">
                                            <!-- <q-item class="p-relative full-width no-pad">
                                                <div class="vespucci-score--wrapper full-width flex justify-between items-center">
                                                    <span class="label">{{ item.vespucciScore > 50 ? 'Strong Buy':'Strong Sell' }}</span>
                                                    <span class="value">{{ item.vespucciScore }}</span>
                                                    <span class="powered">Powered by Vespucci</span>
                                                </div>
                                            </q-item> -->
                                            <q-separator style="margin-top: 10px" />
                                            <q-item data-name='Trade' clickable v-ripple class="p-relative" to="/verto/exchange">Trade
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item data-name='Transaction History' clickable v-ripple class="p-relative" to="/verto/wallet/coinHistory">Transaction History
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item data-name='Create new EOS account' v-if="item.type === 'verto'" to="/verto/eos-account/create" clickable v-ripple class="p-relative">Create EOS account
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item data-name='Import EOS account' v-if="item.type === 'verto'" to="/verto/eos-account/import" clickable v-ripple class="p-relative">Import EOS account
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item v-if="item.type === 'eos'" data-name='EOS to VTX Converter' clickable v-ripple class="p-relative" to="/verto/converter">EOS to VTX Converter
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item data-name='Security' clickable @click="alertSecurity = true" v-ripple class="p-relative">Security
                                                <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                            </q-item>
                                            <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                                                <q-item-section>
                                                    <q-item-label>{{item.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                                                </q-item-section>
                                                <q-item-section avatar>
                                                    <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="item.hidden" />
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </div>
                                </div>
                            </div>
                        </q-item>
                    </div>
                </q-list>
               <div v-if="$store.state.currentwallet.wallet.chain"  >
                <div class="wallet-list q-pa-sm text-body1 q-mt-md text-grey-9" >
                   <q-icon name="add" /> More wallets and accounts
                </div>
                   <q-expansion-item    :style="setPosition(99999999)" @click="vtxAccounts.length == 1 ? showMenu(vtxAccounts[0]) : showChainAccounts('', 'vtx')"  :key="Math.random()" clickable  >
                        <template v-slot:header>
                            <q-item-section avatar>
                                <img class="coin-icon" width="35px" src="statics/icons/favicon-32x32.png"  />
                            </q-item-section>
                            <q-item-section  class="item-name">
                            <span class="item-name--name"> VTX</span>
                            <span  class="item-name--staked" v-if="vtxAccounts.length > 1">{{vtxAccounts.length}} accounts</span>

                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{formatNumber(vtxAccounts.total ? vtxAccounts.total.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card :dark="$store.state.settings.lightMode === 'true'">
                            <q-card-section>
                                <q-item  :key="Math.random()+index"  v-for="(item, index) in vtxAccounts"  :class="{'selected' : item.selected}" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="!item.disabled ? showMenu(item) : ''" :class="{'disable-coin' : item.disabled}" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                            <img class="coin-icon" width="35px" src="statics/icons/favicon-32x32.png" alt="">
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name">{{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>

                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled">
                                            <span class="item-info--amount">{{formatNumber(item.amount ? (new Number(item.amount).toString().split('.')[1] && new Number(item.amount).toString().split('.')[1].length > 8 ? new Number(item.amount).toFixed(4) : new Number(item.amount).toFixed(4).toString()) : 0, 2) }} {{item.type.toUpperCase()}}</span>

                                            <span class="item-info--amountUSD" >${{formatNumber(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                        </q-expansion-item>

                                       <q-expansion-item  :ref="'chain'+index" :style="setPosition(chain.chainTotal)" @click="chain.accounts.length == 1 ? showMenu(chain.accounts[0], false, index+1 ) : showChainAccounts(index, chain.chain)" v-for="(chain, index) in chains" :class="{ 'single-chain': !($q.platform.is.mobile||$isbex) && chain.count }" :key="Math.random()+index" clickable  >
                    <template v-slot:header>

                            <q-item-section avatar>
                                <img class="coin-icon" width="35px" :src="chain.icon"  />
                            </q-item-section>
                            <q-item-section  class="item-name" >

                            <span class="item-name--name"> {{chain.label}}</span>
                            <span  class="item-name--staked" v-if="loadingIndex == index + 1 "> <q-spinner-dots color="primary" size="2em" /> </span>
                            <span  class="item-name--staked" v-else-if="chain.accounts.length > 1">{{chain.accounts.length}} accounts</span>
                            <span   class="item-name--staked" v-else-if="chain.accounts.length == 1 && chain.accounts[0].tokenList && chain.accounts[0].tokenList.length > 1">{{chain.accounts[0].tokenList.length}} tokens</span>
                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{formatNumber(chain.chainTotal ? chain.chainTotal.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card :dark="$store.state.settings.lightMode === 'true'">
                            <q-card-section>
                                <q-item  :key="Math.random()+index"  v-for="(item, index) in chain.accounts"   clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="!item.disabled ? showMenu(item) : ''" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                           <q-icon name="fiber_manual_record" :color="item.color"/>
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name" v-if="item.isEvm"> {{item.key.substr(item.key.length - 6)}}</span>
                                            <span class="item-name--name" v-else> {{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>

                                            <span  class="item-name--staked" v-if="item.tokenList">{{item.tokenList.length}} token{{ item.tokenList.length > 1 ? 's' : '' }}</span>

                                            <span  class="item-name--staked" ></span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled">
                                            <span class="item-info--amount">{{formatNumber(item.amount ? (new Number(item.amount).toString().split('.')[1] && new Number(item.amount).toString().split('.')[1].length > 8 ? new Number(item.amount).toFixed(4) : new Number(item.amount).toFixed(4).toString()) : 0, 2) }} {{item.type.toUpperCase()}}</span>
                                            <span class="item-info--amountUSD" v-if="item.total">${{formatNumber(new Number(isNaN(item.total) ? 0 : item.total).toFixed(2),0)}}</span>
                                            <span class="item-info--amountUSD" v-else>${{formatNumber(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                        </q-expansion-item>                        </div>
            </q-scroll-area>
            <!-- <div v-if="$store.state.currentwallet.wallet.empty" class="add-remove-wrapper flex column flex-center item-center content-center">
                <q-btn unelevated flat @click="revealHide()" :icon-right="showHidden ? 'visibility_off': 'visibility'" class="full-width wallets-wrapper--list__hide-wallets wallets-wrapper--list__hide-wallets--reveal" color="white" text-color="black" :label="showHidden ? 'Hide Currencies' : 'Show Currencies'" :class="showText ? 'open': 'hide'" />
                <span class="add-remove-wrapper--desc text-black">Main chains and balances above zero will show in this list</span>
            </div> -->
        </div>

        <!-- <div class="fit row  justify-center items-stretch q-gutter-lg q-mb-md">
            <q-btn outline rounded to="/verto/wallets/send" class="" color="primary"  label="Send" style="width:100px;"/>
            <q-btn outline rounded to="/verto/wallets/receive" class="" color="primary" label="Receive" />
        </div> -->
        <q-item-label caption :class="$store.state.settings.lightMode === 'true' ? 'text-white':''"> Please select an account from the list. </q-item-label>

        <div v-if="isMobile" class="q-mb-lg"  :class="{'open': !walletShowHide, 'is-mobile wallets-wrapper--list': !($q.platform.is.mobile||$isbex)}">
            <mobileAssets v-if="false" />
            <div :visible="true" class="scrollarea_ q-mb-lg" style="'height:84vh', 'margin-bottom:100px;'">

                <br>
                <div v-if="!($q.platform.is.mobile||$isbex) && $store.state.currentwallet.wallet.empty" class="header-list-table">
                    <div class="row q-pl-sm q-pr-sm">
                        <div class="col col-6 q-pl-sm " :class="{'active' : directionAccount}">
                            <span class="sort">Account name</span>
                        </div>
                        <div class="col col-6 flex justify-end q-pr-sm items-center pointer" >
                           <q-icon :disable="loadingIndicator"  @click="refreshWallet()" name="autorenew" class="text-grey q-px-sm" size="sm" />  <span class="sort">Balance</span>

                        </div>
                    </div>
                </div>
                <!-- DETAILS SECTION  -->
                <div v-if="!($q.platform.is.mobile||$isbex)">
                    <q-item v-if="$store.state.currentwallet.wallet.chain"  class="selected selected22222" clickable active-class="bg-teal-1 text-grey-8">
                        <div class="header-wallet-wrapper culumn full-width">
                            <div class="menu-wallet">
                                <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="sub-list-menu">
                                    <!-- <q-separator style="margin-top: -20px" /> -->

                                    <q-item data-name='Create EOS account' v-if="$store.state.currentwallet.wallet.type === 'verto'" to="/verto/eos-account/create" clickable v-ripple class="p-relative bold-btn">Create EOS account
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                        <q-item data-name='Import EOS account' v-if="$store.state.currentwallet.wallet.type === 'verto'" to="/verto/eos-account/import" clickable v-ripple class="p-relative bold-btn">Import EOS account
                                            <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                        </q-item>
                                    <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos'" data-name='EOS to VTX Converter' clickable v-ripple class="p-relative" to="/verto/converter">EOS to VTX Converter
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item> -->
                                    <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos' || $store.state.currentwallet.wallet.type === 'vtx'" data-name='Staking / Unstaking CPU' clickable v-ripple class="p-relative" to="/verto/stake">{{$store.state.currentwallet.wallet.type === 'eos' ? 'Staking / Unstaking CPU' : 'Staking'}}
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item> -->
                                    <!-- <q-item v-if="$store.state.currentwallet.wallet.type === 'eos'" data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" to="/verto/stakeproxy">Stake Proxy EOS
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item> -->
                                    <div class="row text-center q-pb-md" v-if="$store.state.currentwallet.wallet.type === 'eos'" >
                                        <div class="row col-4  flex flex-center ">
                                        <q-circular-progress
                                        show-value
                                        font-size="12px"
                                        :value="circularProgress.cpu"
                                        size="70px"
                                        :thickness="0.22"
                                        color="deep-purple-2"
                                        track-color="grey-3"
                                        class="q-ma-md"
                                        >
                                        {{ circularProgress.cpu }}%
                                        </q-circular-progress>
                                        <span class="accountInfos">{{circularProgress.cpuInfos}} µs</span>
                                        <div class="col-12">CPU</div>
                                    </div>
                                        <div class="row col-4  flex flex-center ">
                                        <q-circular-progress
                                        show-value
                                        font-size="12px"
                                        :value="circularProgress.net"
                                        size="70px"
                                        :thickness="0.22"
                                        color="deep-purple-2"
                                        track-color="grey-3"
                                        class="q-ma-md"
                                        >
                                        {{ circularProgress.net }}%
                                        </q-circular-progress>
                                        <span class="accountInfos">{{circularProgress.netInfos}} KB</span>
                                        <div class="col-12">NET</div>
                                    </div>

                                    <div class="row col-4  flex flex-center ">
                                        <q-circular-progress
                                        show-value
                                        font-size="12px"
                                        :value="circularProgress.ram"
                                        size="70px"
                                        :thickness="0.22"
                                        color="deep-purple-2"
                                        track-color="grey-3"
                                        class="q-ma-md"
                                        >
                                        {{ circularProgress.ram }}%
                                        </q-circular-progress>
                                        <span class="accountInfos">{{circularProgress.ramInfos}} KB</span>
                                        <div class="col-12">RAM</div>
                                    </div>

                                        </div>
                                        <q-expansion-item
                                        v-if="$store.state.currentwallet.wallet.type === 'vtx'" data-name='VTX tools'
                                        expand-separator
                                        icon="select_all"
                                        label="VTX tools"
                                        @click="focusOnChainTools"
                                        caption="Staking, node & more"
                                        class="q-pt-sm chain-tools"
                                        default-opened
                                    >
                                    <q-item  data-name='Staking' clickable v-ripple class="p-relative" to="/verto/stake">Stake VTX
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                        <a href="https://volentix.io/node/" target="_blank">
                                    <q-item  data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" >
                                        Run a node
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    </a>
                                    </q-expansion-item>
                                    <q-expansion-item
                                        v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Chain tools'
                                        expand-separator
                                        class="chain-tools"
                                        icon="select_all"
                                        label="Chain tools"
                                        @click="focusOnChainTools"
                                        caption="Staking, CPU & more"
                                        :default-opened="$store.state.currentwallet.wallet.type === 'eos'"
                                    >
                                    <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Stake / Unstake CPU' clickable v-ripple class="p-relative" to="/verto/stake">Stake / Unstake CPU
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Buy/Sell Ram' clickable v-ripple class="p-relative" to="/verto/ram-market">Buy / Sell Ram
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                        <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Power up' clickable v-ripple class="p-relative" to="/verto/wallet/eos/powerup">Power up
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>

                                    <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Stake Proxy EOS' clickable v-ripple class="p-relative" to="/verto/stakeproxy">Stake Proxy EOS
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    <q-item data-name='Create new account' v-if="$store.state.currentwallet.wallet.type !== 'verto' && $store.state.currentwallet.wallet.chain === 'eos'" to="/verto/eos-account/create" clickable v-ripple class="p-relative ">Create account
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    <q-item data-name='Import  account' v-if="$store.state.currentwallet.wallet.type !== 'verto' && $store.state.currentwallet.wallet.chain === 'eos'" to="/verto/eos-account/import" clickable v-ripple class="p-relative">Import another account
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    <q-item v-if="$store.state.currentwallet.wallet.chain === 'eos'" data-name='Custom Transaction' clickable v-ripple class="p-relative" to="/verto/custom-transactions">Custom Transaction
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    </q-expansion-item>

                                    <q-item data-name='Security' clickable @click="alertSecurity = true" v-ripple class="p-relative">Security
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    <q-item data-name='History' clickable to="/verto/history" v-ripple class="p-relative">History
                                        <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                                    </q-item>
                                    <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                                        <q-item-section>
                                            <q-item-label>{{$store.state.currentwallet.wallet.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                                        </q-item-section>
                                        <q-item-section avatar>
                                            <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="$store.state.currentwallet.wallet.hidden" />
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </div>
                        </div>
                    </q-item>
                </div>
                <!-- MOBILE VIEW COMPONENT - DETAILS SECTION  -->
                <div v-if="$q.platform.is.mobile||$isbex">
                    <WalletsAccountDetailsDialog :dialog.sync="dialog" :circularProgress="circularProgress" :focusOnChainTools="focusOnChainTools" :alertSecurity.sync="alertSecurity" :hideCurrency="hideCurrency" :selectedCoin="selectedITEM" :formatNumber="formatNumber" :accountChain="selectedAccountChain" />
                </div>

                <div class="wallet-list q-pa-sm text-body1 q-mt-md text-grey-9" v-if="!($q.platform.is.mobile||$isbex) && $store.state.currentwallet.wallet.chain" >
                   <q-icon name="add" /> More wallets and accounts
                </div>
                <q-list  :class="$store.state.settings.lightMode === 'true' ? 'rounded-borders text-white': 'rounded-borders'"  bordered  >
                    <q-expansion-item    :style="setPosition(99999999)" @click="vtxAccounts.length == 1 ? showMenu(vtxAccounts[0]) : showChainAccounts('', 'vtx')"  :key="Math.random()" clickable   v-if="vtxAccounts.total > 0">
                        <template v-slot:header>
                            <q-item-section avatar>
                                <img class="coin-icon" width="35px" src="statics/icons/favicon-32x32.png"  onerror="this.src='https://etherscan.io/images/main/empty-token.png';"  />
                            </q-item-section>
                            <q-item-section  class="item-name">
                            <span class="item-name--name"> VTX</span>
                            <span  class="item-name--staked" v-if="vtxAccounts.length > 1">{{vtxAccounts.length}} accounts</span>

                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{formatNumber(vtxAccounts.total ? vtxAccounts.total.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card :dark="$store.state.settings.lightMode === 'true'">
                            <q-card-section>
                                <q-item  :key="Math.random()+index"  v-for="(item, index) in vtxAccounts"  :class="{'selected' : item.selected}" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="!item.disabled ? showMenu(item, false, false, vtxAccounts) : ''" :class="{'disable-coin' : item.disabled}" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                            <img class="coin-icon" width="35px" src="statics/icons/favicon-32x32.png" alt="">
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name">{{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>

                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled" style="margin-right: -25px;">
                                            <span class="item-info--amount">{{formatNumber(item.amount ? (new Number(item.amount).toString().split('.')[1] && new Number(item.amount).toString().split('.')[1].length > 8 ? new Number(item.amount).toFixed(4) : new Number(item.amount).toFixed(4).toString()) : 0, 2) }} {{item.type.toUpperCase()}}</span>

                                            <span class="item-info--amountUSD" >${{formatNumber(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                    </q-expansion-item>
                    <q-expansion-item  :ref="'chain'+index" :style="setPosition(chain.chainTotal)" @click="chain.accounts.length == 1 ? showMenu(chain.accounts[0], false, index+1 ) : showChainAccounts(index, chain.chain)" v-for="(chain, index) in chains" :class="{ 'single-chain': !($q.platform.is.mobile||$isbex) && chain.count }" :key="Math.random()+index" clickable  v-show="!(chain.label === 'EOS' && chain.chainTotal < 1)">
                        <template v-slot:header >

                            <q-item-section avatar>
                                <img class="coin-icon" width="35px" :src="chain.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';"  />
                            </q-item-section>
                            <q-item-section  class="item-name" >

                            <span class="item-name--name"> {{chain.label}}</span>
                            <span  class="item-name--staked" v-if="loadingIndex == index + 1 "> <q-spinner-dots color="primary" size="2em" /> </span>
                            <span  class="item-name--staked" v-else-if="chain.accounts.length > 1">{{chain.accounts.length}} accounts</span>
                            <span   class="item-name--staked" v-else-if="chain.accounts.length == 1 && chain.accounts[0].tokenList && chain.accounts[0].tokenList.length > 1">{{chain.accounts[0].tokenList.length}} tokens</span>
                            </q-item-section>

                            <q-item-section class="item-info col" side>
                            <div class="row items-center text-bold">

                            <span> ${{formatNumber(chain.chainTotal ? chain.chainTotal.toFixed(0) : 0 , 0)}}</span>
                                </div>
                            </q-item-section>
                            </template>

                            <q-card :dark="$store.state.settings.lightMode === 'true'">
                            <q-card-section>
                                <q-item  :key="Math.random()+index"  v-for="(item, index) in chain.accounts"   clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
                                <div class="header-wallet-wrapper culumn full-width">
                                    <div @click="!item.disabled ? showMenu(item, false, false, chain) : ''" class="header-wallet full-width flex justify-between">
                                        <q-item-section avatar>
                                           <q-icon name="fiber_manual_record" :color="item.color"/>
                                        </q-item-section>
                                        <q-item-section class="item-name">
                                            <span class="item-name--name" v-if="item.isEvm"> {{item.key.substr(item.key.length - 6)}}</span>
                                            <span class="item-name--name" v-else> {{item.name}}</span>
                                            <span class="item-name--staked" v-if="item.staked && item.staked !== 0 && false">Staked : {{nFormatter2(item.staked, 3)}}</span>

                                            <span  class="item-name--staked" v-if="item.tokenList">{{item.tokenList.length}} token{{ item.tokenList.length > 1 ? 's' : '' }}</span>

                                            <span  class="item-name--staked" ></span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-if="!item.disabled">
                                            <span class="item-info--amount">{{formatNumber(item.amount ? (new Number(item.amount).toString().split('.')[1] && new Number(item.amount).toString().split('.')[1].length > 8 ? new Number(item.amount).toFixed(4) : new Number(item.amount).toFixed(4).toString()) : 0, 2) }} {{item.type.toUpperCase()}}</span>
                                            <span class="item-info--amountUSD" v-if="item.total">${{formatNumber(new Number(isNaN(item.total) ? 0 : item.total).toFixed(2),0)}}</span>
                                            <span class="item-info--amountUSD" v-else>${{formatNumber(new Number(isNaN(item.usd) ? 0 : item.usd).toFixed(2),0)}}</span>
                                        </q-item-section>
                                        <q-item-section class="item-info" v-else>
                                            <span class="item-info--amount">in progress</span>
                                        </q-item-section>
                                    </div>

                                </div>
                            </q-item>

                            </q-card-section>
                            <q-separator />

                            </q-card>

                        </q-expansion-item>
                </q-list>
            </div>
            <div v-if="false" class="add-remove-wrapper flex column flex-center item-center content-center">
                <q-btn unelevated flat @click="revealHide()" :icon-right="showHidden ? 'visibility_off': 'visibility'" class="full-width wallets-wrapper--list__hide-wallets wallets-wrapper--list__hide-wallets--reveal" color="white" text-color="black" :label="showHidden ? 'Hide Currencies' : 'Show Currencies'" :class="showText ? 'open': 'hide'" />
                <span class="add-remove-wrapper--desc text-black">Main chains and balances above zero will show in this list</span>
                <!-- <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" /> -->
            </div>
            <q-btn unelevated v-if="!showWallets" flat @click="toggleWallets()" :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" :class="showText ? 'open': 'hide'" />
        </div>
    </div>
    <q-dialog v-model="alertSecurity">
        <q-card style="width: 100%; max-width: 400px" :dark="$store.state.settings.lightMode === 'true'">

            <q-card-section class="q-pa-lg text-h6">
                The private key is confidential. Please make sure you do not share it with anyone. Your private keys control your funds.
            </q-card-section>

            <q-card-actions align="right" class="q-pb-lg q-pr-lg">
             <q-btn :dark="$store.state.settings.lightMode === 'true'" flat label="Cancel"   v-close-popup />     <q-btn :dark="$store.state.settings.lightMode === 'true'" flat label="Got it" class="go-to-security" @click="goToSecurity()" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</div>
</template>

<script>
import initWallet from '@/util/_Wallets2Tokens'
import mobileAssets from '@/components/Verto/Mobile/Wallets'
import {
  QScrollArea,
  openURL
} from 'quasar'
import EosWrapper from '@/util/EosWrapper'
import Formatter from '@/mixins/Formatter'
const eos = new EosWrapper()
import {
  mapState
} from 'vuex'

import WalletsAccountDetailsDialog from './MobileUI/WalletsAccountDetailsDialog.vue'

export default {
  components: {
    QScrollArea,
    mobileAssets,
    WalletsAccountDetailsDialog
  },
  name: 'Wallets',
  props: {
    showWallets: {
      type: Boolean,
      required: false,
      default: true
    },
    isWalletsPage: {
      type: Boolean,
      required: false,
      default: true
    },
    isWalletDetail: {
      type: Boolean,
      required: false,
      default: true
    },
    isMobile: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    '$store.state.wallets.portfolioTotal': function () {
      this.loadingIndicator = true
      setTimeout(() => {
        this.loadingIndicator = false
      }, 5000)
    },
    $route (to, from) {
      if (to !== from) {
        // this.setRessourcesInfos()
      }
    },
    tokens: {
      deep: true,
      handler (val, old) {
        if (old && val && val.length !== old.length) {
          this.chains = this.setChains()
          this.setVtxData()
          // console.log(this.rekey)
          this.rekey++
        }
      }
    }
  },
  data () {
    return {
      selectedChain: null,
      vtxAccounts: [],
      loadingIndex: false,
      chainSwitcher: '',
      searchAccount: '',
      chains: [],
      circularProgress: {
        ram: 0,
        cpu: 0,
        net: 0
      },
      hideEosSetup: true,
      loadingIndicator: false,
      history: [],
      rekey: 98813538,
      toggled: false,
      alertSecurity: false,
      showHidden: false,
      showPrivate: false,
      showVespucciScore: false,
      active: true,
      openModal: false,
      accountName: '',
      tokenID: '',
      singleWalletRefresh: false,
      selectedCoin: null,
      currentAsset: {
        'buySupport': '',
        'currentPrice': '',
        'marketCap': '',
        'c24hChange': '',
        'c24hChange2': '',
        'vespucciScore': ''
      },
      confirmed: false,
      // showWallet: true,
      showText: false,
      menu: [],
      direction: false,
      directionAccount: false,
      // false is ASC
      // true is DESC
      currentAccount: {
        selected: false,
        type: '',
        key: '',
        name: '',
        amount: '',
        contract: '',
        chain: '',
        to: '',
        icon: ''
      },
      dialog: false, // for mobile version [account details info ]
      selectedITEM: { total: '', usd: '' },
      selectedAccountChain: []
    }
  },
  async mounted () {
    this.showSetupEos()
    setTimeout(() => {
      this.showSetupEos()
    }, 5000)
    this.chains = this.setChains()
    this.setVtxData()

    setTimeout(() => {
      this.$store.state.wallets.tokens.map(async (f) => {
        let stakedAmounts = 0
        if (f.type === 'vtx') {
          eos.getTable('vertostaking', f.name, 'accountstake').then(stakes => {
            // console.log(stakes, 'stakes')
            stakes.map(s => {
              s.amount = Math.round(+s.amount.split(' ')[0] * 10000) / 10000
              s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 10000) / 10000
              stakedAmounts += +s.amount
            })
            f.staked = stakedAmounts
            // console.log(f.staked, 'f.staked')
          })
        }
      })
    }, 6000)

    this.setRessourcesInfos()
    // handle dialog page to wallets details page route
    if (this.$route.params.openDialog) {
      let menuChain = JSON.parse(localStorage.getItem('menuChain'))
      this.showMenu(menuChain.menu, menuChain.to, menuChain.loadingIndex, menuChain.accountChain)
      this.dialog = true
    }
  },
  async updated () {
    // ////console.log('updated')
  },
  async created () {
    // ////console.log('created')
    // this.params = this.$store.state.currentwallet.params
    if (this.$route.params.chainID) {
      this.chainID = this.$route.params.chainID
      this.tokenID = this.$route.params.tokenID
      this.accountName = this.$route.params.accountName

      this.$store.commit('currentwallet/updateParams', {
        chainID: this.chainID,
        tokenID: this.tokenID,
        accountName: this.accountName
      })
    }
    if (this.$store.state.investment.defaultAccount) {
      this.showMenu(this.$store.state.investment.defaultAccount, false, 1)
      this.dialog = true
    }
  },
  computed: {
    //   $store.state.wallets.tokens.filter(this.filterdWalletList)
    // filterdWalletList (f) {
    //   return !f.hidden
    // },
    ...mapState('wallets', ['tokens']),
    walletShowHide () {
      return this.toggled ? this.showWallets : !this.showWallets
    }
  },
  methods: {
    showSetupEos () {
      this.hideEosSetup = !this.$store.state.wallets.tokens.find(f => f.type === 'verto' && f.chain === 'eos' && !f.hidden && !f.disabled)
      let check = localStorage.getItem('hideEosSetup')

      if (check) {
        this.hideEosSetup = true
      }
    },
    setVtxData () {
      this.vtxAccounts = this.$store.state.wallets.tokens.filter((v) => v.type === 'vtx' && v.chain === 'eos')
      this.vtxAccounts.total = this.vtxAccounts.reduce((a, b) => +a + (isNaN(b.usd) ? 0 : +b.usd), 0)
      this.vtxAccounts.totalStaked = this.vtxAccounts.reduce((a, b) => +a + (isNaN(b.staked) ? 0 : +b.staked), 0)
      this.vtxAccounts.sort((a, b) => parseFloat(b.chainTotal) - parseFloat(a.chainTotal))
    },
    showChainAccounts (index, chain) {
      // let nodeList = document.querySelectorAll('.all-wallets .q-expansion-item__toggle-icon')
      localStorage.setItem('selectedChain', chain)
      this.$bus.$emit('selectedChain')

      //   let items = Array.prototype.slice.call(nodeList)
    },
    focusOnChainTools () {
      let element = document.querySelector('.chainToolsDropdownBtn')
      if (element) element.classList.add('active')
      setTimeout(() => {
        if (element) element.classList.remove('active')
      }, 5000)
    },
    launchExplorer (tx) {
      switch (this.$store.state.currentwallet.wallet.chain) {
        case 'eos':
          openURL(process.env[this.$store.state.settings.network].EOS_TRANSACTION_EXPLORER + tx)
          break
        case 'eth':
          openURL(process.env[this.$store.state.settings.network].ETH_TRANSACTION_EXPLORER + tx)
          break
        default:
          break
      }
    },
    goToStake () {
      this.$router.push({
        path: '/verto/stake'
      })
    },
    sortBy (type) {
      if (type === 'balance') {
        /*
        let nonAmountCoins = this.$store.state.wallets.tokens.filter(f => f.usd === undefined)
        for (let n of nonAmountCoins) {
          this.$store.state.wallets.tokens.push(this.$store.state.wallets.tokens.splice(this.$store.state.wallets.tokens.indexOf(n), 1)[0])
          // ////console.log('n', n)
        }
        // ////console.log('this.$store.state.wallets.tokens', this.$store.state.wallets.tokens)
        this.directionAccount = false
        if (this.direction) {
          this.$store.state.wallets.tokens.sort(function (a, b) {
            return a.usd - b.usd
          })
        } else {
          this.$store.state.wallets.tokens.sort(function (a, b) {
            return b.usd - a.usd
          })
        }
        // ////console.log('tokens of table', tokens)
        */
        this.direction = !this.direction
        // this.$store.state.wallets.tokens.map((a) => {
        // ////console.log('a.amount', a.amount)
        // })
      }
      if (type === 'account') {
        let nonAmountCoins = this.$store.state.wallets.tokens.filter(f => f.name === undefined)
        for (let n of nonAmountCoins) {
          this.$store.state.wallets.tokens.push(this.$store.state.wallets.tokens.splice(this.$store.state.wallets.tokens.indexOf(n), 1)[0])
          // ////console.log('n', n)
        }
        // ////console.log('this.$store.state.wallets.tokens', this.$store.state.wallets.tokens)
        this.direction = false
        if (this.directionAccount) {
          this.$store.state.wallets.tokens.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        } else {
          this.$store.state.wallets.tokens.sort((a, b) => (b.name > a.name) ? 1 : ((a.name > b.name) ? -1 : 0))
        }
        // ////console.log('tokens of table', tokens)
        this.directionAccount = !this.directionAccount
        // this.$store.state.wallets.tokens.map((a) => {
        // ////console.log('a.amount', a.amount)
        // })
      }
    },
    goToSecurity () {
      this.$router.push({
        path: '/verto/wallet/privateKey'
      })
    },
    refreshWallet (name = null) {
      if (!name) {
        this.$store.state.tokens.walletTokensData = []
        this.$store.state.tokens.pending = []
        this.singleWalletRefresh = null
        localStorage.removeItem('walletPublicDatav2')
      } else {
        this.singleWalletRefresh = name
      }

      return initWallet(name)
    },
    revealHide () {
      this.showHidden = !this.showHidden
      // //console.log('this.showHidden', this.showHidden)
      // //console.log("document.getElementById('hidden__holder--sep')", document.getElementById('hidden__holder--sep'))
      setTimeout(() => {
        let position = document.getElementById('hidden__holder--sep') ? document.getElementById('hidden__holder--sep').offsetTop : 0
        if (this.$refs.walletsScrollArea) { this.$refs.walletsScrollArea.setScrollPosition(position, position === 0 ? 50 : 300) }
      }, 500)
    },
    togglePrivateKey () {
      this.showPrivate = !this.showPrivate
    },
    hideEOSSetup () {
      localStorage.setItem('hideEosSetup', 'true')
      this.hideEosSetup = true
    },
    hideModalFun: function () {
      this.openModal = false
      this.confirmed = false
    },
    openModalFun: function (item) {
      this.openModal = true
    },
    async showMenu (menu, to, loadingIndex, accountChain = false) {
      this.loadingIndex = loadingIndex
      this.$store.state.currentwallet.wallet = menu
      setTimeout(() => {
        this.$store.state.currentwallet.wallet = this.selectedCoin
        this.loadingIndex = false
        if (this.$refs.walletsScrollArea) { this.$refs.walletsScrollArea.setScrollPosition(0, 50) }

        // account details dialog prop
        this.selectedITEM = menu
        this.selectedAccountChain = accountChain
        this.dialog = true
        localStorage.setItem('menuChain', JSON.stringify({ menu: menu, to: to, loadingIndex: loadingIndex, accountChain: accountChain }))
      }, 200)
      this.removeClassSelected()
      menu.selected = true

      this.selectedCoin = menu
      if (this.selectedCoin.hidden === undefined) {
        this.selectedCoin.hidden = false
      }

      // this.$store.commit('currentwallet/updateParams', {
      //   chainID: this.selectedCoin.chain,
      //   tokenID: this.selectedCoin.type,
      //   accountName: this.selectedCoin.name
      // })

      this.$store.commit('currentwallet/updateParams', {
        chainID: this.$route.params.chainID || this.selectedCoin.chain,
        tokenID: this.$route.params.tokenID || this.selectedCoin.type,
        accountName: this.$route.params.accountName || this.selectedCoin.name.toLowerCase()
      })
      // let stakedAmounts = 0
      // if (this.selectedCoin.type === 'vtx') {
      //   let stakes = await eos.getTable('vtxstake1111', this.selectedCoin.name, 'accounts')
      //   stakes.map(s => {
      //     s.stake_amount = Math.round(+s.stake_amount.split(' ')[0] * 10000) / 10000
      //     s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 10000) / 10000
      //     stakedAmounts += +s.stake_amount
      //   })
      //   this.selectedCoin.staked = stakedAmounts
      // }
      // this.$store.state.currentwallet.wallet = this.currentAccount

      this.$store.commit('investment/setDefaultAccount', this.selectedCoin)
      this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === this.selectedCoin.chain && w.key === this.selectedCoin.key))

      this.setRessourcesInfos()
      /* ////console.log('****_*_*_selectedCoin****_*_*_', stakedAmounts)

        if (this.selectedCoin.chain !== 'eos' && this.selectedCoin.chain !== 'eth') {
          this.history = []
        } else {
          let nameOrKey = this.selectedCoin.chain !== 'eos' ? this.selectedCoin.key : this.selectedCoin.name
          let pagination = {
            position: -1,
            offset: 100
          }
          this.history = (await Lib.history(this.selectedCoin.chain, this.selectedCoin.type, nameOrKey, pagination)).history
        }
        */

      if (this.selectedCoin.chain === 'eos' && this.selectedCoin.type === 'verto') {
        let result = await eos.getAccountNamesFromPubKeyP(this.selectedCoin.key)
        if (result && result.account_names.length) {
          to = '/verto/eos-account/import'
        }
      }

      if (to) this.$router.push(to)
    },
    kFormatter (num) {
      return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    },
    async setRessourcesInfos () {
      if (this.$store.state.currentwallet.wallet && this.$store.state.currentwallet.wallet.chain === 'eos' && this.$store.state.currentwallet.wallet.chain !== 'verto') {
        eos.freePowerUp(this.$store.state.currentwallet.wallet.name)
        if (!this.$store.state.currentwallet.wallet.accountData) {
          this.$store.state.currentwallet.wallet.accountData = await eos.getAccount(this.$store.state.currentwallet.wallet.name)
        }
        this.circularProgress.ram = parseInt((this.$store.state.currentwallet.wallet.accountData.ram_usage / this.$store.state.currentwallet.wallet.accountData.ram_quota) * 100)
        this.circularProgress.cpu = parseInt((this.$store.state.currentwallet.wallet.accountData.cpu_limit.used / this.$store.state.currentwallet.wallet.accountData.cpu_limit.max) * 100)
        this.circularProgress.net = parseInt((this.$store.state.currentwallet.wallet.accountData.net_limit.used / this.$store.state.currentwallet.wallet.accountData.net_limit.max) * 100)
        this.circularProgress.cpu = this.circularProgress.cpu > 100 ? 100 : this.circularProgress.cpu
        this.circularProgress.net = this.circularProgress.net > 100 ? 100 : this.circularProgress.net
        this.circularProgress.ram = this.circularProgress.ram > 100 ? 100 : this.circularProgress.ram
        this.circularProgress.cpu = isNaN(this.circularProgress.cpu) ? 0 : this.circularProgress.cpu
        this.circularProgress.net = isNaN(this.circularProgress.net) ? 0 : this.circularProgress.net
        this.circularProgress.ram = isNaN(this.circularProgress.ram) ? 0 : this.circularProgress.ram
        this.circularProgress.cpuInfos = this.$store.state.currentwallet.wallet.accountData.cpu_limit.used
        this.circularProgress.netInfos = this.$store.state.currentwallet.wallet.accountData.net_limit.used
        this.circularProgress.ramInfos = this.$store.state.currentwallet.wallet.accountData.ram_usage / 1000
      }
    },
    setPosition (total) {
      let style = ''

      // Get max wallet total / usd value from any wallet
      let maxUsd = parseInt(Math.max.apply(Math, this.$store.state.wallets.tokens.map(o => isNaN(parseFloat(o.total)) ? (isNaN(parseFloat(o.usd)) ? 0 : parseFloat(o.usd)) : parseFloat(o.total))))

      let index = (!this.direction ? maxUsd : 0) - (isNaN(parseInt(total)) ? 0 : parseInt(total)) * (!this.direction ? 1 : -1)

      style = '-webkit-box-ordinal-group: ' + index + '; -moz-box-ordinal-group: ' + index + ';box-ordinal-group: ' + index + ';'

      return style
    },
    nFormatter2 (num, digits) {
      var si = [{
        value: 1,
        symbol: ''
      },
      {
        value: 1E3,
        symbol: 'k'
      },
      {
        value: 1E6,
        symbol: 'M'
      },
      {
        value: 1E9,
        symbol: 'B'
      },
      {
        value: 1E12,
        symbol: 'T'
      },
      {
        value: 1E15,
        symbol: 'P'
      },
      {
        value: 1E18,
        symbol: 'E'
      }
      ]
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
      var i
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
    },
    removeClassSelected: function () {
      for (let item of this.menu) {
        item.selected = false
      }
    },
    toggleWallets () {
      this.toggled = !this.toggled
      this.showText = !this.showText
    },
    async hideCurrency () {
      // ////console.log('this.$store.state.wallets.tokens', this.$store.state.wallets.tokens)

      this.$store.state.wallets.tokens.filter(w => w.chain === this.$route.params.chainID && w.type === this.$route.params.tokenID && w.name.toLowerCase() === this.$route.params.accountName.toLowerCase()).map(t => {
        t.hidden = this.currentAccount.hidden
      })

      await this.$configManager.updateConfig(this.$store.state.settings.temporary, this.$store.state.currentwallet.config)
      // ////console.log('hidden', this.currentAccount.hidden)
    }
  },
  mixins: [Formatter]
}
</script>

<style lang="scss" scoped>
a {
    text-decoration: none;
    color: inherit;
}
.all-wallets > div:hover {
   background:#f9fcfe
}

.dark-theme .all-wallets > div:hover {
   background:#11284c
}
.chain-tools /deep/ .q-item__section--side {
    min-width: 0px  !important
}
.wallet-list {
    background: #f3f3f3;
}
 .single-chain /deep/ i.q-expansion-item__toggle-icon {
  display:none
}

span.accountInfos {
    text-align: center;
    font-size: 11px;
    color: #907bb3;
}
.q-expansion-item--expanded * , .q-expansion-item--expanded  {
    background: whitesmoke;
}
.single-wallet-refresh {
    left: -17px !important;
    right: unset !important;
}

.single-wallet-refresh {
    display: none;
}
.q-expansion-item:hover .q-item__section--side span{
    // display: none
}

.q-expansion-item:hover  .single-wallet-refresh {
    display: block  !important;
}
.on-top {
-webkit-box-ordinal-group: 1;
-moz-box-ordinal-group: 1;

}
.all-wallets {
     display: -webkit-box;
        display: -moz-box;

        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        box-orient: vertical;
}

.all-wallets > div {
        width:100%
}
@import "~@/assets/styles/variables.scss";

.q-expansion-item {
       border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.highlight {
    background: #ffe9fb;
}
.highlight-btn {
    // background: #a991fb !important;
    text-transform: initial !important;
    background: transparent !important;
    border: 1px solid rgba(0, 0, 0, 0.7);
    font-size: 12px !important;
    color: #000 !important;
    border-radius: 40px;
    font-weight: 700;
    min-height: 20px;
    margin-bottom: 5px;
    min-width: fit-content;
}
.header-wallet {
    &.disable-coin {
        opacity: .45
    }

    &.selected_true {
        border: 2px solid blue !important;
    }
}

.wallets-wrapper {
    padding: 0px 6%;
    padding-bottom: 70px;

    @media screen and (min-width: 768px) {
        background: #FFF;
        padding: 5% 0px;
        padding-top: 0px;
        margin-top: -10px;
        margin-right: 10px;
        border-radius: 0px 0px 10px 10px;
    }

    &.padtop {
        padding-bottom: 0px;
    }

    .modal-wrapper {
        position: fixed;
        width: 100vw;
        // height: 100vh;
        z-index: 99999;
        top: 0px;
        left: 0px;
        visibility: hidden;
        transform: translateY(50px);
        opacity: 0;
        transition: ease transform .3s, opacity ease .2s;

        &.open {
            visibility: visible;
            transform: translateY(0px);
            opacity: 1;
        }
    }

    &--list {
        background-color: #fff;
        padding: 4% 0%;
        border-radius: 0px 0px 25px 25px;
        overflow: hidden;
        @media screen and (min-width: 768px) {
            box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.19) !important;
            border-radius: 0px 0px 8px 8px !important;
        }
        .input-input{
          height: 40px;
          max-width: 90%;
          margin: auto;
          background: #FFF;
          position: relative;
          z-index: 2;
          margin-top: 0px;
          margin-bottom: 10px;
          padding-bottom: 20px;
          /deep/ .q-field__label{
              font-size: 12px;
              top: 10px;
          }
          /deep/ .q-field__control{
            height: 40px;
            min-height: unset;
            input{
                padding-top: 15px;
                padding-bottom: 5px;
                font-size: 12px;
                font-weight: $bold;
                letter-spacing: 1px;
            }
          }
        }
        .header-list-table {
            padding-right: 5px;
            margin-top: -10px;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(#CCC, .3);
            padding-bottom: 10px;

            .sort {
                font-size: 12px;
                // font-weight: bold;
                // font-family: $Titillium;
                color: grey;
                letter-spacing: 1px;
                padding-right: 5px;
            }

            .col {
                &.active {
                    .sort {
                        font-weight: bold;
                        color: blue;
                    }

                    /deep/ .q-icon {
                        color: blue !important;
                    }
                }
            }
        }

        &_title {
            font-size: 12px;
            font-family: $Titillium;
            font-weight: $bold;
            line-height: 30px;
            margin-top: 0px;
            margin-bottom: 0px;
            // margin-left: -10px;
            // margin-right: -10px;
            color: #494949;

            i {
                font-size: 20px;
                margin-right: 10px;
            }
        }

        .add-remove-wrapper {
            align-items: center;
            margin-top: -20px;
            margin-bottom: 10px;
            cursor: pointer;

            &--title {
                font-size: 18px;
                font-family: $Titillium;
                font-weight: $regular;
                margin-right: 0px;
                color: #7272FA !important;
                margin-bottom: 10px;
            }

            &--desc {
                font-size: 14px;
                font-family: $Titillium;
                font-weight: $regular;
                margin-right: 0px;
                box-shadow: 0px 5px 10px 0px rgba(black, .07);
                border-radius: 10px;
                max-width: 220px;
                padding: 5px;
                text-align: center;

                @media screen and (min-width: 768px) {
                    font-size: 12px;
                }
            }

            &--btn {
                border-radius: 50px;
                font-size: 25px;
                line-height: 25px;
                font-family: $Titillium;
                font-weight: $light;
                background: #7272FA !important;
                width: 39px;
                height: 39px;
                min-height: unset;
                padding: 0px !important;
                margin-left: 5px;

                /deep/ .q-btn__content {
                    margin-top: -1px;
                    margin-left: -1px;
                }
            }
        }

        &__hide-wallets {
            text-transform: initial !important;
            margin-top: 0px;
            margin-bottom: 25px;
            color: #7272FA !important;
            font-size: 17px;

            &--reveal {
                margin-top: 50px !important;

                @media screen and (min-width: 768px) {
                    margin-top: 30px !important;
                    margin-bottom: 5px !important;
                    max-width: 90%;
                }
            }

            &.hide {
                margin-bottom: -6px;
                margin-top: -8px;
                background: #FFF;
                @media screen and (min-width: 768px) {
                    margin-bottom: 35px;
                    margin-top: 0px;
                    font-size: 14px;
                }
            }

            // @media screen and (min-width: 768px) {
            //   margin-bottom: 35px;
            //   margin-top: 0px;
            // }
        }

        .list-wrapper {
            overflow: hidden;
            visibility: hidden;
            height: 0px;
            opacity: 0;
            transform: translateY(-20px) scaleY(.5);
            transform-origin: top;
            transition: ease transform .3s, ease opacity .4s;
        }

        &.open {

            // margin-bottom: -260px;
            .list-wrapper {
                visibility: visible;
                height: auto;
                opacity: 1;
                transform: translateY(0px) scaleY(1);
                margin-bottom: 40px;

                @media screen and (min-width: 768px) {
                    margin-bottom: 0px;
                    margin-top: 0px;

                    /deep/ .q-focus-helper {
                        display: none !important;
                    }
                }
            }
        }

        /deep/ .q-list--bordered {
            border: none;

            .q-item {
                &:not(:first-child) {
                    .q-link {
                        border-top: 1px solid rgba(0, 0, 0, 0.02);
                    }
                }
            }

            .q-link {
                border-top: 1px solid rgba(0, 0, 0, 0.06);

                @media screen and (min-width: 768px) {
                    max-width: 100%;
                    // padding-right: 30px;
                    margin: auto;
                }

                .menu-wallet {
                    display: none;

                    .bold-btn {
                        font-family: $Titillium;
                        font-weight: $bold;
                        font-size: 15px !important;
                        color: #7272FA !important;;
                    }

                    /deep/ .sub-list-menu {
                        &.q-list--dark{
                            .q-link{
                                border-top: 1px solid rgba(white, 0.06) !important;
                            }
                            // .q-separator{
                            //     background: rgba(white,.12) !important;
                            //     margin-top: 0px !important;
                            //     position: relative;
                            //     z-index: 2;
                            // }
                        }
                        margin-top: 10px;

                        .p-relative {
                            position: relative;

                            .copy {
                                margin-right: 10px;
                            }

                            .close {
                                margin-right: -15px;
                            }

                            .p-abs {
                                position: absolute;
                                right: 0px;
                            }
                        }

                        .q-link {
                            border-top: 1px solid rgba(0, 0, 0, 0.06);
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            font-size: 15px;
                            color: #B0B0B0;

                            @media screen and (min-width: 768px) {
                                margin-left: 0px;
                                margin-right: 0px;
                                width: 100% !important;
                                max-width: 100% !important;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                font-size: 16px;
                                color: #000;
                            }

                            &:hover {
                                @media screen and (min-width: 768px) {
                                    background-color: rgba(black, .02);
                                }
                            }
                        }
                    }
                }

                &.selected {
                    .menu-wallet {
                        display: block;

                        .vespucci-score--wrapper {
                            min-height: 35px;
                            background-color: #F3F3F3;
                            background: transparent linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%) 0% 0% no-repeat padding-box;
                            border-radius: 8px;
                            padding: 0px 10px;
                            box-shadow: 0px 5px 8px 0px rgba(black, .1);
                            position: relative;

                            .powered {
                                position: absolute;
                                left: 0px;
                                width: 100%;
                                text-align: center;
                                font-size: 10px;
                                color: #2A2A2A;
                                font-weight: $regular;
                                opacity: .5;
                                letter-spacing: .2px;
                                padding-left: 30px;
                            }

                            .label {
                                background-color: #6C0DCB;
                                color: #FFF;
                                font-size: 12px;
                                font-family: $Titillium;
                                font-weight: $regular;
                                padding: 2px 6px;
                                border-radius: 20px;
                                background: transparent linear-gradient(270deg, #6C0DCB 0%, #00FFFF 100%) 0% 0% no-repeat;
                                box-shadow: 0px 3px 6px 0px rgba(black, .1);
                            }

                            .value {
                                @extend .label;
                            }
                        }
                    }
                }
            }

            .q-item {
                &:first-child {
                    border-top: 1px solid rgba(0, 0, 0, 0);
                }
            }

            .q-item__section {
                &.hide {
                    display: none !important;
                }
            }
        }

        &__item-info {
            border: 2px solid;
            border-radius: 9px;
            text-align: center;
        }

        .coin-icon {
            margin-left: -3px;

            @media screen and (min-width: 768px) {
                max-width: 20px;
            }

            // opacity: .4;
        }

        .icons {

            // opacity: .4;
            &.reverse {
                transform: scaleX(-1);
            }
        }
        .item-coin{
            .item-name--name{
                color: #CCC;
                font-weight: 700;
                font-size: 10px;
                transform: translate(-36%, 2px);
                width: fit-content;
                min-width: 50px;
                text-align: center;
            }
        }
        .item-name {
            color: #000;
            font-weight: 700;
            max-width: fit-content;
            &--staked{
                font-size: 13px;
                color: #B0B0B0;
            }
            &--name {
                font-size: 14px;

                @media screen and (min-width: 768px) {
                    font-size: 12px;
                }
            }

            &--percent {
                font-size: 12px;
            }

            @media screen and (min-width: 768px) {
                margin-left: -20px;
            }
        }

        .item-info {
            color: #000;
            font-weight: 700;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            // position: relative;
            .single-wallet-refresh{
                position: absolute;
                right: 40px;
            }
            &--amount {
                font-size: 16px;

                @media screen and (min-width: 768px) {
                    font-size: 10px;
                    margin-bottom: 0px;
                }
            }

            &--amountUSD {
                font-size: 13px;
                color: #B0B0B0;

                @media screen and (min-width: 768px) {
                    font-size: 12px;
                    font-family: $Titillium;
                    font-weight: $bold;
                    transform: translateY(2px);
                }
            }
        }
    }
    .q-card{
        .q-card__section{
            padding: 0px;
        }
    }
    &.dark-theme{
        background-color: #04111F;
        .q-card.q-card--dark.q-dark{
            background: #071e36 !important;
        }
        .wallets-wrapper--list .q-list--bordered .q-link{
            .q-item__section{
                color: #FFF;
            }
            /deep/ .q-card{
            }
        }
        .wallets-wrapper--list__hide-wallets.hide{
            background: #04111F;
        }
        .wallets-wrapper--list{
            &.is-mobile{

            }
        }
        @media screen and (min-width: 768px){
            background-color: #04111F;
            border: 1px solid #627797;
        }
        .wallets-wrapper--list .add-remove-wrapper--desc{
            color: #FFF !important;
        }
        .go-to-security{
            color: inherit !important;
            background-color: inherit !important;
        }
        .history-list-wrapper {
            .q-item{
                padding-left: 5px;
            }
            .item-trans--transID{
                color: #FFF;
            }
            .item-amount{
                color: #FFF;
                margin-left: 0px;
            }
        }
        .wallets-wrapper--list{
            background-color: #04111F;
            border-top: none;
            &_title{
                color: #FFF;
                background: transparent !important;
                // background: #7272FA !important;
                // margin-left: 0px !important;
            }
            .q-list--bordered {
                .q-item{
                    &:first-child{
                        .q-link {
                            border-top: 1px solid rgba(0, 0, 0, 0);
                        }
                    }
                }
                .q-link {
                    border-top: 1px solid rgba(#627797, 0.2) !important;
                    &.bg-teal-1{
                        background-color: #152f4b !important;
                    }
                    &.bgblack{
                        background-color: #0b1f35;
                    }
                    &:first-child{
                        border-top: 1px solid rgba(0, 0, 0, 0) !important;
                    }
                    @media screen and (min-width: 768px){
                        .menu-wallet .sub-list-menu .q-link{
                            color: #FFF;
                        }
                    }
                }
            }
            .item-name, .item-info{
                color: #FFF;
            }
            .header-list-table{
                .sort{
                    color: rgba(#FFF, .7);
                }
            }
        }
    }
}

.header-wallet-wrapper {}

.standard-content {
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh !important;
    max-height: 100vh !important;
    overflow: auto;
    padding-bottom: 100px;

    &--title {
        font-size: 35px;
        font-weight: $bold;
        position: relative;
        line-height: 50px;
        font-family: $Titillium;
        margin-top: 0px;
        padding-top: 60px;
        margin-bottom: 60px;

        .btn-align-left {
            position: absolute;
            left: -20px;
            top: 10px;
        }
    }

    &--body {
        .wallet-name {
            font-family: $Titillium;
            font-weight: $regular;
            color: #B0B0B0;
            font-size: 17px;
        }

        .wallet-amount {
            font-family: $Titillium;
            font-weight: $bold;
            color: #B0B0B0;
            font-size: 19px;
        }
    }

    &--desc {
        margin-top: -20px;
        margin-bottom: 40px;
        font-size: 18px;
        font-weight: $regular;
        position: relative;
        line-height: 26px;
        font-family: $Titillium;
        color: $mainColor;
    }

    &--footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: baseline;
        min-height: 100px;

        &.confirmed {
            background: #F3F3F3;
            padding: 20px;
            border-radius: 20px;
            flex-direction: column;
            align-items: flex-end;

            .confirmed-title {
                font-size: 19px;
                color: #191818;
                font-family: $Titillium;
                font-weight: $bold;
                width: 100%;
                text-align: left;
                margin-bottom: 20px;
            }
        }

        .action-link {
            height: 47px;
            text-transform: initial !important;
            font-size: 16px;
            letter-spacing: .5px;
            border-radius: 40px;
            width: 150px;
            margin-left: 10px;
            background-color: #7272FA !important;
        }
    }
}

.max200 {
    max-width: 200px;
}

.max260 {
    max-width: 260px;
}

.no-column {
    flex-direction: row !important;
    padding-right: 0px !important;
}

.pr0 {
    padding-right: 0px !important;
}

.mt10 {
    margin-top: 10px;
}

.lower {
    text-transform: initial !important;
}

.scrollarea {
    &.height {
        height: 300px;
    }
}

.no-pad {
    padding-left: 0px;
    padding-right: 0px;
}

.pointer {
    cursor: pointer;
}
</style><style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.history-list-wrapper {
    overflow: hidden;
    visibility: hidden;
    height: 0px;
    opacity: 0;
    transform: translateY(-20px) scaleY(.5);
    transform-origin: top;
    transition: ease transform .3s, ease opacity .4s;

    .item {
        &-date {
            // display: flex;
            // justify-content: flex-start;
            max-width: 50px;

            &--value {
                display: flex;
                flex-direction: column;
                // align-items: center;
                font-family: $Titillium;
                font-weight: $light;
                font-size: 10px;
                color: #7272FA;
                width: 50px;
                margin-left: 10px;

                /deep/ b {
                    font-weight: $bold;
                    color: #6C0DCB;
                    font-size: 20px;
                    margin-bottom: -5px;
                    margin-top: -4px;

                    @media screen and (min-width: 768px) {
                        margin-right: 10px;
                    }
                }
            }
        }

        &-trans {
            font-family: $Titillium;
            font-weight: $light;
            font-size: 12px;
            width: 90px;

            &--transID {
                font-weight: $bold;
                color: #0E163B;
                margin-top: 1px;
            }

            &--desc {
                color: #B0B0B0;

                .type {
                    text-transform: capitalize;

                    &.sent {
                        color: #FFB200;
                    }

                    &.received {
                        color: #00D0CA;
                    }
                }
            }
        }

        &-amount {
            max-width: 70px;
            text-align: right;
            font-family: $Titillium;
            font-weight: $bold;
            font-size: 10px;
            color: #2A2A2A;
            justify-content: flex-start;
            margin-top: 5px;
            word-break: break-all;
        }
    }

}
.go-to-security{
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
  }
.goToStake {
    margin-top: 2px;
    margin-bottom: 20px;
    cursor: pointer;

    &:hover {
        opacity: .9;
    }

    .small {
        font-size: 12px;
    }
}
.max-height{
    max-height: 83.5%;
    @media screen and (min-height: 700px) {
        // height: 54.5vh;
        max-height: 83.70%;
    }
    @media screen and (min-height: 760px) {
        // height: 54vh;
        max-height: 83.25%;
    }
    @media screen and (min-height: 800px) {
        // height: 55vh;
        max-height: 84.15%;
    }
    @media screen and (min-height: 870px) {
        // height: 56vh;
        max-height: 84.15%;
    }
}
/deep/ .q-item__section.column.q-item__section--avatar{
    min-width: 66px;
    padding-left: 0px;
    margin-left: 10px;
}
.chain-switch-wrapper{
    background-color: rgba(#CCC, .1);
    border-bottom: 1px solid rgba(#CCC, .7);
    margin-top: -3px;
    /deep/ .q-btn-group{
        justify-content: space-between;
    }
    /deep/ button{
        border-radius: 0px;
        width: 50%;
        &.text-teal{
            color: #7272FA !important;
            border-bottom: 2px solid #7272FA;
        }
        &:first-child{
            border-right: 1px solid rgba(#CCC, .7);
            // width: 50%;
        }
    }
    .ethereum-chain-wrapper,
    .eos-chain-wrapper{
        line-height: 18px;
        padding-right: 0px;
        .chain{
            &-name{
                font-size: 10px;
                font-weight: $bold;
                letter-spacing: 1px;
                margin-top: -4px;
            }
            &-total-accounts{
                padding-left: 10px;
                font-size: 12px;
                letter-spacing: 1px;
                margin-bottom: 1px;
                strong{
                    font-size: 12px;
                    font-weight: $bold;
                }
            }
            &-total-balances{
                padding-left: 10px;
                font-size: 12px;
                font-weight: $bold;
            }
        }
    }
    .eos-chain-wrapper{
        border-right: none;
        padding-right: 0px;
    }
}
.dark-theme{
    .highlight {
      background: #071e36;
      color: #FFF;
      /deep/ .item-name--name{
        color: #FFF !important;
      }
    }
    .highlight-btn {
      text-transform: initial !important;
      background: transparent !important;
      border: 1px solid rgba(204, 204, 204, 0.7);
      font-size: 12px !important;
      border-radius: 40px;
      font-weight: 700;
      color: #FFF !important;
      min-height: 20px;
      margin-bottom: 5px;
      min-width: -webkit-fit-content;
      min-width: -moz-fit-content;
      min-width: fit-content;
    }
    .q-expansion-item--expanded *,
    .q-expansion-item--expanded{
        background: #071e36;
    }
    .chain-switch-wrapper{
        background-color: rgba(#CCC, .1);
        border-bottom: 1px solid rgba(#CCC, .7);
        color: #FFF;
        /deep/ button{
            &:first-child{
                border-right: 1px solid rgba(#FFF, .1);
            }
        }
        .ethereum-chain-wrapper,
        .eos-chain-wrapper{
            .chain{
            }
        }
        .eos-chain-wrapper{
            border-right: none;
            padding-right: 0px;
        }
    }
}
// /deep/ .q-expansion-item__container > .q-item .q-item__section.column.q-item__section--avatar{
//     min-width: 66px;
// }
</style>
